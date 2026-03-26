import { App, TFile } from 'obsidian';
import { Priority, MemberStatus, Ordinance, Recommend } from '../models/types';

export class WriteService {
  constructor(private app: App) {}

  async setPriority(file: TFile, priority: Priority): Promise<void> {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm.priority = priority;
    });
  }

  async setStatus(file: TFile, status: MemberStatus): Promise<void> {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm.status = status;
    });
  }

  async setOrdinance(file: TFile, ordinance: Ordinance): Promise<void> {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm['next-ordinance'] = ordinance;
    });
  }

  async setRecommend(file: TFile, recommend: Recommend): Promise<void> {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm.recommend = recommend;
    });
  }

  async setCalling(file: TFile, calling: string): Promise<void> {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm.calling = calling;
    });
  }

  async markContacted(file: TFile): Promise<void> {
    const today = new Date().toISOString().slice(0, 10);
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm['last-contact'] = today;
    });
  }

  async toggleTask(file: TFile, taskLine: number): Promise<void> {
    const content = await this.app.vault.read(file);
    const lines = content.split('\n');

    // taskLine is relative to body, find the frontmatter offset
    const fmEnd = content.indexOf('\n---', 3);
    const bodyStart = fmEnd === -1 ? 0 : content.substring(0, fmEnd + 4).split('\n').length;
    const absoluteLine = bodyStart + taskLine;

    if (absoluteLine < lines.length) {
      const line = lines[absoluteLine];
      if (line.match(/^- \[ \]/)) {
        lines[absoluteLine] = line.replace('- [ ]', '- [x]');
      } else if (line.match(/^- \[[xX]\]/)) {
        lines[absoluteLine] = line.replace(/- \[[xX]\]/, '- [ ]');
      }
      await this.app.vault.modify(file, lines.join('\n'));
    }
  }

  async addTask(file: TFile, text: string): Promise<void> {
    const content = await this.app.vault.read(file);
    const lines = content.split('\n');

    // Find ## Next Steps section
    let insertIdx = -1;
    let inSection = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^##\s+Next Steps/)) {
        inSection = true;
        insertIdx = i + 1;
        continue;
      }
      if (inSection) {
        if (lines[i].match(/^##\s/)) break;
        if (lines[i].match(/^- \[/)) insertIdx = i + 1;
        else if (lines[i].trim() === '' && insertIdx === i) insertIdx = i + 1;
      }
    }

    if (insertIdx >= 0) {
      lines.splice(insertIdx, 0, `- [ ] ${text}`);
      await this.app.vault.modify(file, lines.join('\n'));
    }
  }

  async logInteraction(file: TFile, note: string): Promise<void> {
    const today = new Date().toISOString().slice(0, 10);
    const content = await this.app.vault.read(file);
    const lines = content.split('\n');

    // Find ## Interactions section and insert after the heading
    let insertIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^##\s+Interactions/)) {
        insertIdx = i + 1;
        break;
      }
    }

    if (insertIdx >= 0) {
      const entry = `\n### ${today} \u2014 Note\n${note}\n`;
      lines.splice(insertIdx, 0, entry);
      await this.app.vault.modify(file, lines.join('\n'));
    }

    // Also update last-contact
    await this.markContacted(file);
  }
}
