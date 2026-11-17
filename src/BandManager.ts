import { App, MarkdownView, Menu, TFile } from 'obsidian';
import { h, render } from 'preact';
import { BandField, MemberBand } from './components/MemberBand';
import { MemberService } from './services/MemberService';
import { WriteService } from './services/WriteService';
import {
  MemberState, ORDINANCES, PASTORAL_STATES, PRIORITIES, RECOMMENDS,
  Ordinance, PastoralState, Priority, Recommend,
} from './models/types';

const TITLE = (s: string) => (s ? s.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()) : 'None');

// Draws the status band at the top of every open member note, outside the
// note's scroller so it stays visible while reading. One band per markdown
// leaf; leaves showing a non-member file get none. Each editable cell opens a
// menu that writes frontmatter; the metadata-change event then redraws the
// band and the side panel.
export class BandManager {
  private writer: WriteService;

  constructor(private app: App, private memberService: MemberService) {
    this.writer = new WriteService(app);
  }

  private pick(member: MemberState, field: BandField, e: MouseEvent): void {
    const file = member.file;
    const menu = new Menu();
    const add = <T extends string>(opts: readonly T[], current: string, write: (v: T) => Promise<void>) => {
      for (const o of opts) {
        menu.addItem((i) => i.setTitle(TITLE(o)).setChecked(o === current).onClick(() => void write(o)));
      }
    };
    if (field === 'recommend') add(RECOMMENDS as Recommend[], member.recommend, (v) => this.writer.setRecommend(file, v));
    if (field === 'ordinance') add(ORDINANCES as Ordinance[], member.nextOrdinance, (v) => this.writer.setOrdinance(file, v));
    if (field === 'flags') {
      menu.addItem((i) => i.setTitle('Priority').setIsLabel(true));
      add(PRIORITIES, member.priority, (v: Priority) => this.writer.setPriority(file, v));
      menu.addSeparator();
      menu.addItem((i) => i.setTitle('Pastoral').setIsLabel(true));
      add(PASTORAL_STATES, member.pastoralState, (v: PastoralState) => this.writer.setPastoralState(file, v));
    }
    if (field === 'contact') {
      menu.addItem((i) => i.setTitle('Mark contacted today').setIcon('check').onClick(() => void this.writer.markContacted(file)));
    }
    menu.showAtMouseEvent(e);
  }

  /** Re-render the band in every markdown leaf (cheap: a handful of leaves). */
  refreshAll(): void {
    this.app.workspace.getLeavesOfType('markdown').forEach((leaf) => {
      if (leaf.view instanceof MarkdownView) void this.refreshView(leaf.view);
    });
  }

  /** Re-render only the leaves showing this file. */
  refreshFile(file: TFile): void {
    this.app.workspace.getLeavesOfType('markdown').forEach((leaf) => {
      if (leaf.view instanceof MarkdownView && leaf.view.file?.path === file.path) {
        void this.refreshView(leaf.view);
      }
    });
  }

  private async refreshView(view: MarkdownView): Promise<void> {
    const host = view.contentEl;
    let band = host.querySelector(':scope > .shepherd-band') as HTMLElement | null;
    const file = view.file;
    if (!file || !this.memberService.isMemberFile(file)) {
      if (band) { render(null, band); band.remove(); }
      return;
    }
    if (!band) {
      band = createDiv({ cls: 'shepherd-band' });
      host.prepend(band);
    }
    try {
      const member = await this.memberService.buildMemberState(file);
      // The leaf may have moved to another file while we awaited.
      if (view.file?.path !== file.path) return;
      render(h(MemberBand, { member, onPick: (f: BandField, e: MouseEvent) => this.pick(member, f, e) }), band);
    } catch {
      render(null, band);
      band.remove();
    }
  }

  removeAll(): void {
    document.querySelectorAll('.shepherd-band').forEach((el) => {
      render(null, el as HTMLElement);
      el.remove();
    });
  }
}
