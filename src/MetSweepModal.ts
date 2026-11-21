import { App, Modal, TFile } from 'obsidian';
import { MemberService } from './services/MemberService';
import { WriteService } from './services/WriteService';
import { MemberState } from './models/types';
import { callingNames, monthYear } from './services/helpers';

// One card per member nobody has sorted yet: photo, name, calling, how long
// they've been in the ward, who they live with. "I know them" / "Haven't met"
// writes `met:` to the note; Skip leaves it for next time. The point is to
// turn a 290-name roster into an honest "people I haven't met" list in about
// ten minutes, on a phone, in the foyer.
//
// The card docks at the bottom and doesn't block the workspace: each card opens
// that member's note behind it, so the timeline and the Shepherd panel show
// whatever history exists before you answer.
export class MetSweepModal extends Modal {
  private queue: TFile[] = [];
  private pos = 0;
  private sorted = 0;
  private history: TFile[] = [];

  constructor(app: App, private members: MemberService, private writer: WriteService, private memberDir: string) {
    super(app);
  }

  onOpen(): void {
    this.modalEl.addClass('shepherd-sweep-modal');
    this.containerEl.addClass('shepherd-sweep-container');
    // Current members only: subfolders (_archive) hold people who moved out.
    const files = this.app.vault.getMarkdownFiles().filter((f) => f.parent?.path === this.memberDir);
    const fmOf = (f: TFile) => this.app.metadataCache.getFileCache(f)?.frontmatter ?? {};
    this.queue = files
      .filter((f) => {
        const fm = fmOf(f);
        const css = fm.cssclasses;
        const isMember = Array.isArray(css) ? css.includes('member-profile') : String(css ?? '').includes('member-profile');
        return isMember && fm.met !== true && fm.met !== false && fm.met !== 'true' && fm.met !== 'false';
      })
      // Faces first: a card without a photo is much harder to answer.
      .sort((a, b) => Number(!fmOf(a).photo) - Number(!fmOf(b).photo) || a.basename.localeCompare(b.basename));
    // Keys only count while focus is on the card, not while typing in the note behind it.
    const key = (fn: () => void) => () => {
      if (!this.modalEl.contains(document.activeElement) && document.activeElement !== document.body) return true;
      fn();
      return false;
    };
    this.scope.register([], 'k', key(() => void this.answer(true)));
    this.scope.register([], 'n', key(() => void this.answer(false)));
    this.scope.register([], 's', key(() => this.next()));
    void this.draw();
  }

  onClose(): void {
    this.contentEl.empty();
    // The MemberService made for this modal listens for metadata changes;
    // drop that listener with the modal.
    this.app.metadataCache.offref(this.members.indexInvalidationRef);
  }

  private async answer(met: boolean): Promise<void> {
    const file = this.queue[this.pos];
    if (!file) return;
    await this.writer.setMet(file, met);
    this.history.push(file);
    this.sorted++;
    this.next();
  }

  private next(): void {
    this.pos++;
    void this.draw();
  }

  private async undo(): Promise<void> {
    const file = this.history.pop();
    if (!file) return;
    await this.writer.setMet(file, null);
    this.sorted--;
    this.pos = this.queue.indexOf(file);
    void this.draw();
  }

  /** Open the member's note in the main pane without taking focus from the card. */
  private async showNote(file: TFile): Promise<void> {
    const leaf = this.app.workspace.getMostRecentLeaf() ?? this.app.workspace.getLeaf(false);
    if ((leaf.view as { file?: TFile }).file?.path !== file.path) {
      await leaf.openFile(file, { active: false });
    }
    // Make the pane active (without focus) so the Shepherd panel follows it.
    this.app.workspace.setActiveLeaf(leaf, { focus: false });
    this.modalEl.focus();
  }

  private async draw(): Promise<void> {
    const el = this.contentEl;
    el.empty();
    this.titleEl.setText('Who do you know?');
    const file = this.queue[this.pos];
    if (!file) {
      el.createDiv({ cls: 'shepherd-sweep-done', text: this.queue.length
        ? `Done. ${this.sorted} sorted this round${this.pos > this.sorted ? `, ${this.pos - this.sorted} skipped` : ''}.`
        : 'Everyone is sorted.' });
      return;
    }
    void this.showNote(file);
    const m: MemberState = await this.members.buildMemberState(file);
    el.createDiv({ cls: 'shepherd-sweep-progress', text: `${this.pos + 1} of ${this.queue.length}` });

    const card = el.createDiv({ cls: 'shepherd-sweep-card' });
    const photo = m.photo ? this.app.vault.getAbstractFileByPath(m.photo) : null;
    if (photo instanceof TFile) card.createEl('img', { cls: 'shepherd-sweep-photo', attr: { src: this.app.vault.getResourcePath(photo), alt: '' } });
    else card.createDiv({ cls: 'shepherd-sweep-photo is-empty', text: m.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('') });

    const info = card.createDiv({ cls: 'shepherd-sweep-info' });
    info.createDiv({ cls: 'shepherd-sweep-name', text: m.name });
    const bits: string[] = [];
    if (m.age != null) bits.push(String(m.age));
    const since = monthYear(m.movedIn);
    if (since) bits.push(`in the ward since ${since}`);
    if (bits.length) info.createDiv({ cls: 'shepherd-sweep-sub', text: bits.join(' · ') });
    info.createDiv({ cls: 'shepherd-sweep-sub', text: callingNames(m.calling) || 'No calling' });
    const housemates = this.members.getHousemates(m).map((p) => p.name);
    if (housemates.length) info.createDiv({ cls: 'shepherd-sweep-sub', text: `Lives with ${housemates.slice(0, 4).join(', ')}` });

    const row = el.createDiv({ cls: 'shepherd-sweep-actions' });
    const btn = (label: string, cls: string, fn: () => void) => {
      const b = row.createEl('button', { cls, text: label });
      b.addEventListener('click', fn);
    };
    btn("Haven't met", 'shepherd-sweep-btn', () => void this.answer(false));
    btn('I know them', 'shepherd-sweep-btn mod-cta', () => void this.answer(true));

    const foot = el.createDiv({ cls: 'shepherd-sweep-foot' });
    const link = (label: string, fn: () => void) => {
      const a = foot.createEl('button', { cls: 'shepherd-sweep-link', text: label });
      a.addEventListener('click', fn);
    };
    link('Skip', () => this.next());
    if (this.history.length) link('Undo', () => void this.undo());
  }
}
