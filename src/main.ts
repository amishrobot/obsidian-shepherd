import { Plugin, WorkspaceLeaf, TFile } from 'obsidian';
import { ShepherdView, VIEW_TYPE_SHEPHERD } from './ShepherdView';
// On workspace restore, custom-view leaves exist as deferred placeholders
// before the plugin's view type is registered. instanceof guards against
// TypeError when methods like refresh() are called on those placeholders.
import { ShepherdSettings, DEFAULT_SETTINGS } from './models/types';

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

    this.addRibbonIcon('heart', 'Shepherd', () => {
      this.activateView();
    });

    this.addCommand({
      id: 'open-shepherd',
      name: 'Open Shepherd Panel',
      callback: () => this.activateView(),
    });

    this.addCommand({
      id: 'mark-contacted',
      name: 'Mark Member Contacted Today',
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file || !this.isMemberFile(file)) return false;
        if (!checking) {
          this.getView()?.refresh(file);
        }
        return true;
      },
    });

    // React to active file changes
    this.registerEvent(
      this.app.workspace.on('file-open', (file) => {
        if (file instanceof TFile) {
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
  }

  private isMemberFile(file: TFile): boolean {
    return file.path.startsWith(this.settings.memberDir + '/') && file.extension === 'md';
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

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
