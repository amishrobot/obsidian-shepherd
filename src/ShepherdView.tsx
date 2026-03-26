import { ItemView, WorkspaceLeaf, TFile } from 'obsidian';
import { h, render } from 'preact';
import { ShepherdPanel } from './components/ShepherdPanel';
import { MemberService } from './services/MemberService';
import { WriteService } from './services/WriteService';
import { MemberState, Priority, MemberStatus, Ordinance, Recommend, ShepherdSettings } from './models/types';

export const VIEW_TYPE_SHEPHERD = 'shepherd-view';

export class ShepherdView extends ItemView {
  private memberService: MemberService;
  private writeService: WriteService;
  private currentFile: TFile | null = null;
  private settings: ShepherdSettings;

  constructor(leaf: WorkspaceLeaf, settings: ShepherdSettings) {
    super(leaf);
    this.settings = settings;
    this.memberService = new MemberService(this.app, settings);
    this.writeService = new WriteService(this.app);
  }

  getViewType(): string {
    return VIEW_TYPE_SHEPHERD;
  }

  getDisplayText(): string {
    return 'Shepherd';
  }

  getIcon(): string {
    return 'heart';
  }

  async onOpen() {
    const file = this.app.workspace.getActiveFile();
    if (file && this.memberService.isMemberFile(file)) {
      await this.showMember(file);
    } else {
      this.showEmpty();
    }
  }

  async onClose() {
    const container = this.containerEl.children[1] as HTMLElement;
    render(null, container);
  }

  async showMember(file: TFile) {
    this.currentFile = file;
    const container = this.containerEl.children[1] as HTMLElement;

    try {
      const member = await this.memberService.buildMemberState(file);
      this.renderPanel(container, member);
    } catch (e) {
      // Use safe DOM methods instead of innerHTML
      container.empty();
      const errDiv = container.createDiv({ cls: 'shepherd-empty' });
      errDiv.createDiv({ text: `Error loading member: ${e}`, cls: 'shepherd-empty-text' });
    }
  }

  showEmpty() {
    this.currentFile = null;
    const container = this.containerEl.children[1] as HTMLElement;
    const dashPath = this.settings.dashboardPath;

    render(
      h('div', { class: 'shepherd-empty' },
        h('div', { class: 'shepherd-empty-icon' }, '🐑'),
        h('div', { class: 'shepherd-empty-text' }, 'Open a member file to see pastoral controls.'),
        h('span', {
          class: 'shepherd-empty-link',
          onClick: () => {
            const f = this.app.vault.getAbstractFileByPath(dashPath);
            if (f instanceof TFile) {
              this.app.workspace.openLinkText(dashPath, '', false);
            }
          },
        }, '📂 Open Dashboard'),
      ),
      container
    );
  }

  async refresh(file?: TFile) {
    const target = file || this.currentFile;
    if (target && this.memberService.isMemberFile(target)) {
      await this.showMember(target);
    } else {
      this.showEmpty();
    }
  }

  private renderPanel(container: HTMLElement, member: MemberState) {
    const file = member.file;

    const refresh = () => this.showMember(file);

    render(
      h(ShepherdPanel, {
        member,
        onPriorityChange: async (p: Priority) => {
          await this.writeService.setPriority(file, p);
          await refresh();
        },
        onStatusChange: async (s: MemberStatus) => {
          await this.writeService.setStatus(file, s);
          await refresh();
        },
        onOrdinanceChange: async (o: Ordinance) => {
          await this.writeService.setOrdinance(file, o);
          await refresh();
        },
        onRecommendChange: async (r: Recommend) => {
          await this.writeService.setRecommend(file, r);
          await refresh();
        },
        onMarkContacted: async () => {
          await this.writeService.markContacted(file);
          await refresh();
        },
        onToggleTask: async (line: number) => {
          await this.writeService.toggleTask(file, line);
          await refresh();
        },
        onAddTask: async (text: string) => {
          await this.writeService.addTask(file, text);
          await refresh();
        },
        onLogInteraction: async (note: string) => {
          await this.writeService.logInteraction(file, note);
          await refresh();
        },
      }),
      container
    );
  }
}
