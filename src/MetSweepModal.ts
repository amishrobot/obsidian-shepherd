import { App, Modal, TFile } from 'obsidian';
import { MemberService } from './services/MemberService';
import { WriteService } from './services/WriteService';
import { MemberState } from './models/types';
import { callingNames, monthYear } from './components/MemberBand';

// One card per member nobody has sorted yet: photo, name, calling, how long
// they've been in the ward, who they live with. "I know them" / "Haven't met"
// writes `met:` to the note; Skip leaves it for next time. The point is to
// turn a 290-name roster into an honest "people I haven't met" list in about
// ten minutes, on a phone, in the foyer.
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
    this.scope.register([], 'k', () => { void this.answer(true); return false; });
    this.scope.register([], 'n', () => { void this.answer(false); return false; });
    this.scope.register([], 's', () => { this.next(); return false; });
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
    const m: MemberState = await this.members.buildMemberState(file);
    el.createDiv({ cls: 'shepherd-sweep-progress', text: `${this.pos + 1} of ${this.queue.length}` });

    const card = el.createDiv({ cls: 'shepherd-sweep-card' });
    const photo = m.photo ? this.app.vault.getAbstractFileByPath(m.photo) : null;
    if (photo instanceof TFile) card.createEl('img', { cls: 'shepherd-sweep-photo', attr: { src: this.app.vault.getResourcePath(photo), alt: '' } });
    else card.createDiv({ cls: 'shepherd-sweep-photo is-empty', text: m.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('') });

    card.createDiv({ cls: 'shepherd-sweep-name', text: m.name });
    const bits: string[] = [];
    if (m.age != null) bits.push(String(m.age));
    const since = monthYear(m.movedIn);
    if (since) bits.push(`in the ward since ${since}`);
    if (bits.length) card.createDiv({ cls: 'shepherd-sweep-sub', text: bits.join(' · ') });
    card.createDiv({ cls: 'shepherd-sweep-sub', text: callingNames(m.calling) || 'No calling' });
    const housemates = this.members.getHousemates(m).map((p) => p.name);
    if (housemates.length) card.createDiv({ cls: 'shepherd-sweep-sub', text: `Lives with ${housemates.slice(0, 4).join(', ')}` });

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
