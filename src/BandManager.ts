import { App, MarkdownView, Menu, Modal, Setting, TFile } from 'obsidian';
import { h, render } from 'preact';
import { BandAction, BandField, MemberBand } from './components/MemberBand';
import { MemberService } from './services/MemberService';
import { WriteService } from './services/WriteService';
import {
  CHECK_INS, CHECK_IN_STYLES, MemberState, ORDINANCES, PASTORAL_STATES, PRIORITIES, RECOMMENDS, STATUSES,
  CheckIn, CheckInStyle, MemberStatus, Ordinance, PastoralState, Priority, Recommend,
} from './models/types';

const TITLE = (s: string) => (s ? s.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()) : 'None');

/** One text field and a Save button. Enter saves (Shift+Enter for a newline when multiline). */
class TextModal extends Modal {
  constructor(app: App, private heading: string, private initial: string, private multiline: boolean,
              private placeholder: string, private onSave: (v: string) => void) {
    super(app);
  }
  onOpen(): void {
    this.titleEl.setText(this.heading);
    let value = this.initial;
    const input = this.multiline
      ? this.contentEl.createEl('textarea', { cls: 'shepherd-modal-input', attr: { rows: '5', placeholder: this.placeholder } })
      : this.contentEl.createEl('input', { cls: 'shepherd-modal-input', attr: { type: 'text', placeholder: this.placeholder } });
    input.value = value;
    input.addEventListener('input', () => { value = input.value; });
    const save = () => { this.close(); if (value.trim() || !this.multiline) this.onSave(value); };
    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !(this.multiline && e.shiftKey)) { e.preventDefault(); save(); }
    });
    new Setting(this.contentEl).addButton((b) => b.setButtonText('Save').setCta().onClick(save));
    window.setTimeout(() => input.focus(), 0);
  }
  onClose(): void { this.contentEl.empty(); }
}

// Draws the member band at the top of every open member note, outside the
// note's scroller so it stays visible while reading. One band per markdown
// leaf; leaves showing a non-member file get none. Every control writes
// frontmatter or the note; the metadata-change event then redraws the band.
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
      menu.addItem((i) => i.setTitle('Log interaction…').setIcon('pencil').onClick(() => this.logInteraction(member)));
    }
    menu.showAtMouseEvent(e);
  }

  private logInteraction(member: MemberState): void {
    new TextModal(this.app, `Log interaction · ${member.name}`, '', true, 'What happened?',
      (note) => void this.writer.logInteraction(member.file, note.trim())).open();
  }

  private action(member: MemberState, a: BandAction, e: MouseEvent): void {
    if (a === 'log') { this.logInteraction(member); return; }
    const file = member.file;
    const menu = new Menu();
    const add = <T extends string>(opts: readonly T[], current: string, write: (v: T) => Promise<void>) => {
      for (const o of opts) {
        menu.addItem((i) => i.setTitle(TITLE(o)).setChecked(o === current).onClick(() => void write(o)));
      }
    };
    menu.addItem((i) => i.setTitle('Met').setIsLabel(true));
    menu.addItem((i) => i.setTitle('I know them').setChecked(member.met === true)
      .onClick(() => void this.writer.setMet(file, true)));
    menu.addItem((i) => i.setTitle("Haven't met").setChecked(member.met === false)
      .onClick(() => void this.writer.setMet(file, false)));
    menu.addSeparator();
    menu.addItem((i) => i.setTitle('Presence').setIsLabel(true));
    add(STATUSES, member.status, (v: MemberStatus) => this.writer.setStatus(file, v));
    menu.addSeparator();
    menu.addItem((i) => i.setTitle('Check-in').setIsLabel(true));
    add(CHECK_INS, member.checkIn, (v: CheckIn) => this.writer.setCheckIn(file, v));
    if (member.checkIn !== 'none') {
      menu.addSeparator();
      menu.addItem((i) => i.setTitle('Message').setIsLabel(true));
      add(CHECK_IN_STYLES, member.checkInStyle, (v: CheckInStyle) => this.writer.setCheckInStyle(file, v));
      if (member.checkInStyle === 'gif') {
        menu.addItem((i) => i
          .setTitle(member.gifPrompt ? `GIF prompt: ${member.gifPrompt}` : 'Set GIF prompt…')
          .setIcon('image')
          .onClick(() => new TextModal(this.app, 'GIF prompt', member.gifPrompt, false, 'e.g. locked in, you got this',
            (v) => void this.writer.setGifPrompt(file, v)).open()));
      }
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
      const photo = member.photo ? this.app.vault.getAbstractFileByPath(member.photo) : null;
      const photoUrl = photo instanceof TFile ? this.app.vault.getResourcePath(photo) : null;
      const person = (name: string) => ({ name, file: this.memberService.resolveMemberByName(name) });
      const people = {
        ministeredBy: member.ministeredBy.map(person),
        ministersTo: member.ministersTo.map(person),
        housemates: this.memberService.getHousemates(member),
      };
      render(h(MemberBand, {
        member, photoUrl, people,
        onPick: (f: BandField, e: MouseEvent) => this.pick(member, f, e),
        onAction: (a: BandAction, e: MouseEvent) => this.action(member, a, e),
        onOpen: (target: TFile) => void view.leaf.openFile(target),
      }), band);
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
