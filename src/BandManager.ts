import { App, MarkdownView, TFile } from 'obsidian';
import { h, render } from 'preact';
import { MemberBand } from './components/MemberBand';
import { MemberService } from './services/MemberService';

// Draws the read-only status band at the top of every open member note,
// outside the note's scroller so it stays visible while reading. One band per
// markdown leaf; leaves showing a non-member file get none.
export class BandManager {
  constructor(private app: App, private memberService: MemberService) {}

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
      render(h(MemberBand, { member }), band);
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
