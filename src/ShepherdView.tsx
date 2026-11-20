import { ItemView, Menu, TFile, WorkspaceLeaf } from 'obsidian';
import { h, render } from 'preact';
import { MemberPanel, PanelActions, Tab, TABS } from './components/MemberPanel';
import { MemberService } from './services/MemberService';
import { WriteService } from './services/WriteService';
import { MemberState, ShepherdSettings } from './models/types';
import { unfoldSection } from './folds';
import { WARD_SHEET_PATH, WardSheet, parseWardSheet, sheetFor } from './services/wardSheet';
import { addFact, addHelp, addRestriction, logInteraction, showMoreMenu } from './menus';

export const VIEW_TYPE_SHEPHERD = 'shepherd-view';

export class ShepherdView extends ItemView {
  private memberService: MemberService;
  private writeService: WriteService;
  private currentFile: TFile | null = null;
  private member: MemberState | null = null;
  private tab: Tab = 'facts';
  private wardSheet: WardSheet | null = null;
  private wardSheetMtime = -1;

  constructor(leaf: WorkspaceLeaf, private settings: ShepherdSettings) {
    super(leaf);
    this.memberService = new MemberService(this.app, settings);
    this.registerEvent(this.memberService.indexInvalidationRef);
    this.writeService = new WriteService(this.app);
  }

  getViewType(): string { return VIEW_TYPE_SHEPHERD; }
  getDisplayText(): string { return 'Shepherd'; }
  getIcon(): string { return 'heart'; }

  private get host(): HTMLElement {
    return this.containerEl.children[1] as HTMLElement;
  }

  async onOpen() {
    this.host.addClass('shepherd-view');
    this.host.tabIndex = -1;
    this.registerDomEvent(this.host, 'keydown', (e: KeyboardEvent) => this.onKey(e));
    const file = this.app.workspace.getActiveFile();
    if (file && this.memberService.isMemberFile(file)) await this.showMember(file);
    else this.showEmpty();
  }

  async onClose() {
    render(null, this.host);
  }

  /** 1/2/3 switch tabs, L logs, C/T/E call/text/email: only while focus is in the panel and not typing. */
  private onKey(e: KeyboardEvent) {
    if (!this.member || e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target as HTMLElement;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
    const k = e.key.toLowerCase();
    const tab = TABS.find((x) => x.key === k);
    if (tab) { e.preventDefault(); this.setTab(tab.id); return; }
    if (k === 'l') { e.preventDefault(); this.triggerLogExpand(); return; }
    const label = ({ c: 'Call', t: 'Text', e: 'Email' } as Record<string, string>)[k];
    if (label) {
      const a = this.host.querySelector(`.sh2-actions a[aria-label="${label}"]`) as HTMLAnchorElement | null;
      if (a) { e.preventDefault(); a.click(); }
    }
  }

  setTab(tab: Tab) {
    this.tab = tab;
    if (this.member) this.renderPanel(this.member);
  }

  /**
   * Read the nightly ward sheet cache, re-reading only when the file changed.
   * Never throws: a missing or unreadable file just means no sheet, and the
   * Ward tab says so quietly.
   */
  private async loadWardSheet(): Promise<void> {
    try {
      const adapter = this.app.vault.adapter;
      const stat = await adapter.stat(WARD_SHEET_PATH);
      if (!stat || stat.type !== 'file') { this.wardSheet = null; this.wardSheetMtime = -1; return; }
      if (stat.mtime === this.wardSheetMtime) return;
      this.wardSheet = parseWardSheet(await adapter.read(WARD_SHEET_PATH));
      this.wardSheetMtime = stat.mtime;
    } catch {
      this.wardSheet = null;
      this.wardSheetMtime = -1;
    }
  }

  async showMember(file: TFile) {
    this.currentFile = file;
    await this.loadWardSheet();
    if (this.currentFile?.path !== file.path) return;
    try {
      const member = await this.memberService.buildMemberState(file);
      if (this.currentFile?.path !== file.path) return;
      this.member = member;
      this.renderPanel(member);
    } catch (e) {
      this.member = null;
      render(null, this.host);
      this.host.empty();
      const errDiv = this.host.createDiv({ cls: 'shepherd-empty' });
      errDiv.createDiv({ text: `Error loading member: ${e}`, cls: 'shepherd-empty-text' });
    }
  }

  showEmpty() {
    this.currentFile = null;
    this.member = null;
    const dashPath = this.settings.dashboardPath;
    render(
      h('div', { class: 'shepherd-empty' },
        h('div', { class: 'shepherd-empty-text' }, 'Open a member note to see them here.'),
        h('a', {
          class: 'shepherd-empty-link',
          onClick: () => {
            if (this.app.vault.getAbstractFileByPath(dashPath) instanceof TFile) {
              this.app.workspace.openLinkText(dashPath, '', false);
            }
          },
        }, 'Open the dashboard'),
      ),
      this.host,
    );
  }

  async refresh(file?: TFile) {
    const target = file || this.currentFile;
    if (target && this.memberService.isMemberFile(target)) await this.showMember(target);
    else this.showEmpty();
  }

  /** Open the log form (command and the L key). */
  triggerLogExpand() {
    if (this.member) logInteraction(this.app, this.writeService, this.member);
  }

  private noteLeaf(): WorkspaceLeaf {
    return this.app.workspace.getMostRecentLeaf() ?? this.app.workspace.getLeaf(false);
  }

  private renderPanel(member: MemberState) {
    const file = member.file;
    const w = this.writeService;
    const after = (p: Promise<void>) => void p.then(() => this.showMember(file));
    const photo = member.photo ? this.app.vault.getAbstractFileByPath(member.photo) : null;
    const photoUrl = photo instanceof TFile ? this.app.vault.getResourcePath(photo) : null;
    const person = (name: string) => ({ name, file: this.memberService.resolveMemberByName(name) });

    const act: PanelActions = {
      log: () => logInteraction(this.app, w, member),
      more: (e) => showMoreMenu(this.app, w, member, e),
      toggleTask: (line) => after(w.toggleTask(file, line)),
      addTask: (text) => after(w.addTask(file, text)),
      addFact: (label) => addFact(this.app, w, member, label),
      addHelp: () => addHelp(this.app, w, member),
      addRestriction: () => addRestriction(this.app, w, member),
      liftRestriction: (i, e) => {
        const menu = new Menu();
        menu.addItem((it) => it.setTitle('Mark lifted today').setIcon('check').onClick(() => after(w.liftRestriction(file, i))));
        menu.showAtMouseEvent(e);
      },
      editPrivate: (sub) => {
        void w.ensurePrivateHeading(file, sub).then(() =>
          this.noteLeaf().openFile(file, { eState: { subpath: `#${sub}` } })).then(() =>
          unfoldSection(this.app.workspace, file, 'Private'));
      },
      open: (target) => void this.noteLeaf().openFile(target),
    };

    render(
      h(MemberPanel, {
        app: this.app,
        component: this,
        member,
        photoUrl,
        people: {
          housemates: this.memberService.getHousemates(member),
          ministeredBy: member.ministeredBy.map(person),
          ministersTo: member.ministersTo.map(person),
        },
        sheet: sheetFor(this.wardSheet, member.file.basename),
        tab: this.tab,
        onTab: (t: Tab) => this.setTab(t),
        act,
      }),
      this.host,
    );
  }
}
