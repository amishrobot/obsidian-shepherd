import { Plugin, WorkspaceLeaf, TFile } from 'obsidian';
import { ShepherdView, VIEW_TYPE_SHEPHERD } from './ShepherdView';
import { WriteService } from './services/WriteService';
import { MemberService } from './services/MemberService';
import { MetSweepModal } from './MetSweepModal';
import { foldPanelSections } from './folds';
import { makeNoteBodyProcessor } from './noteBody';
// On workspace restore, custom-view leaves exist as deferred placeholders
// before the plugin's view type is registered. instanceof guards against
// TypeError when methods like refresh() are called on those placeholders.
import { ShepherdSettings, DEFAULT_SETTINGS } from './models/types';
import { ShepherdSettingTab } from './SettingsTab';

export default class ShepherdPlugin extends Plugin {
  settings: ShepherdSettings = DEFAULT_SETTINGS;
  private modifyTimeout: ReturnType<typeof setTimeout> | null = null;

  async onload() {
    console.log('Loading Shepherd');
    await this.loadSettings();

    this.registerView(
      VIEW_TYPE_SHEPHERD,
      (leaf: WorkspaceLeaf) => new ShepherdView(leaf, this.settings)
    );

    this.addSettingTab(new ShepherdSettingTab(this.app, this));

    this.addRibbonIcon('heart', 'Shepherd', () => {
      this.activateView();
    });

    this.addCommand({
      id: 'open-shepherd',
      name: 'Open Shepherd Panel',
      callback: () => this.activateView(),
    });

    this.addCommand({
      id: 'sort-who-i-know',
      name: 'Who do I know? (sort members by met / not met)',
      callback: () => {
        const members = new MemberService(this.app, this.settings);
        new MetSweepModal(this.app, members, new WriteService(this.app), this.settings.memberDir).open();
      },
    });

    this.addCommand({
      id: 'mark-contacted',
      name: 'Mark Member Contacted Today',
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file || !this.isMemberFile(file)) return false;
        if (!checking) {
          const writeService = new WriteService(this.app);
          writeService.markContacted(file).then(() => this.getView()?.refresh(file));
        }
        return true;
      },
    });

    this.addCommand({
      id: 'log-interaction',
      name: 'Log Interaction (open input)',
      hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 'l' }],
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file || !this.isMemberFile(file)) return false;
        if (!checking) {
          const view = this.getView();
          if (view) {
            view.triggerLogExpand();
          } else {
            this.activateView().then(() => this.getView()?.triggerLogExpand());
          }
        }
        return true;
      },
    });

    // The generated [!member-card] callout duplicates the panel; styles.css hides
    // it while this class is on the body. It stays in the file for places the
    // plugin doesn't run.
    document.body.addClass('shepherd-panel-on');

    // Member notes read as a conversation timeline in reading view.
    this.registerMarkdownPostProcessor(makeNoteBodyProcessor(this.app, (f) => this.isMemberFile(f)));

    // React to active file changes
    this.registerEvent(
      this.app.workspace.on('file-open', (file) => {
        if (file instanceof TFile) {
          if (this.settings.autoOpenPanel && this.isMemberFile(file) && !this.getView()) {
            void this.openPanelQuietly();
          }
          // Fold what the panel shows so the note reads as the timeline.
          // Once per open; unfolding by hand sticks until the note is reopened.
          // Twice: a fresh tab's syntax tree isn't parsed at the first pass, and
          // the editor clamps each fold to what it has parsed so far.
          if (this.isMemberFile(file)) {
            for (const ms of [150, 900]) window.setTimeout(() => foldPanelSections(this.app.workspace, file), ms);
          }
          this.scheduleRefresh(file);
        }
      })
    );

    this.registerEvent(
      this.app.workspace.on('active-leaf-change', () => {
        const file = this.app.workspace.getActiveFile();
        this.scheduleRefresh(file);
      })
    );

    // Refresh when the current member file is modified externally
    this.registerEvent(
      this.app.vault.on('modify', (file) => {
        if (!(file instanceof TFile) || !this.isMemberFile(file)) return;
        const view = this.getView();
        if (!view) return;
        // Only refresh if it's the currently displayed member
        if (this.modifyTimeout) clearTimeout(this.modifyTimeout);
        this.modifyTimeout = setTimeout(() => view.refresh(file), 300);
      })
    );
  }

  async onunload() {
    console.log('Unloading Shepherd');
    document.body.removeClass('shepherd-panel-on');
  }

  private isMemberFile(file: TFile): boolean {
    return file.path.startsWith(this.settings.memberDir + '/') && file.extension === 'md';
  }

  // Re-render the open panel after a settings change.
  refreshView() {
    this.scheduleRefresh(this.app.workspace.getActiveFile());
  }

  private getView(): ShepherdView | null {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_SHEPHERD);
    for (const leaf of leaves) {
      if (leaf.view instanceof ShepherdView) {
        return leaf.view;
      }
    }
    return null;
  }

  private scheduleRefresh(file?: TFile | null) {
    const view = this.getView();
    if (!view) return;

    if (file && this.isMemberFile(file)) {
      view.refresh(file);
    } else {
      view.refresh();
    }
  }

  async activateView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_SHEPHERD);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }

    const leaf = this.app.workspace.getRightLeaf(false);
    if (leaf) {
      await leaf.setViewState({ type: VIEW_TYPE_SHEPHERD, active: true });
      this.app.workspace.revealLeaf(leaf);
    }
  }

  /** Create the panel in the right sidebar without taking focus from the note. */
  private async openPanelQuietly() {
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE_SHEPHERD).length) return;
    const leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf) return;
    await leaf.setViewState({ type: VIEW_TYPE_SHEPHERD, active: false });
    if (this.app.workspace.rightSplit.collapsed) this.app.workspace.rightSplit.expand();
    this.app.workspace.revealLeaf(leaf);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
