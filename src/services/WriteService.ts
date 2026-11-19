import { App, TFile } from 'obsidian';
import * as sections from './sections';
import { Priority, MemberStatus, PastoralState, Ordinance, Recommend, CheckIn, CheckInStyle } from '../models/types';

export class WriteService {
  constructor(private app: App) {}

  async setPriority(file: TFile, priority: Priority): Promise<void> {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm.priority = priority;
    });
  }

  /** `met: true|false`; null removes it (back to "not sorted"). */
  async setMet(file: TFile, met: boolean | null): Promise<void> {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      if (met === null) delete fm.met;
      else fm.met = met;
    });
  }

  async setStatus(file: TFile, status: MemberStatus): Promise<void> {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm.status = status;
    });
  }

  async setPastoralState(file: TFile, state: PastoralState): Promise<void> {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm['pastoral-state'] = state;
    });
  }

  async setCheckIn(file: TFile, checkIn: CheckIn): Promise<void> {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      if (checkIn === 'none') delete fm['check-in'];
      else fm['check-in'] = checkIn;
    });
  }

  async setCheckInStyle(file: TFile, style: CheckInStyle): Promise<void> {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm['check-in-style'] = style;
    });
  }

  async setGifPrompt(file: TFile, prompt: string): Promise<void> {
    const value = prompt.trim();
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      if (value) fm['gif-prompt'] = value;
      else delete fm['gif-prompt'];
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
    const day = today();
    const content = await this.app.vault.read(file);
    const lines = content.split('\n');

    // Only add a body entry if there isn't already one for today
    if (!this.hasInteractionHeadingFor(lines, day)) {
      let insertIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^##\s+Interactions/)) {
          insertIdx = i + 1;
          break;
        }
      }
      if (insertIdx >= 0) {
        const entry = `\n### ${day} — Contact\n`;
        lines.splice(insertIdx, 0, entry);
        await this.app.vault.modify(file, lines.join('\n'));
      }
    }

    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm['last-contact'] = day;
    });
  }

  private hasInteractionHeadingFor(lines: string[], isoDate: string): boolean {
    let inSection = false;
    for (const line of lines) {
      if (line.match(/^##\s+Interactions/)) { inSection = true; continue; }
      if (inSection && line.match(/^##\s/) && !line.match(/^###/)) return false;
      if (!inSection) continue;
      if (line.match(new RegExp(`^###\\s+${isoDate}\\b`))) return true;
    }
    return false;
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
    await this.app.vault.process(file, (c) => sections.addTask(c, text.trim()));
  }

  async upsertFact(file: TFile, label: string, value: string): Promise<void> {
    await this.app.vault.process(file, (c) => sections.upsertFact(c, label, value.trim(), today()));
  }

  async addHelp(file: TFile, date: string, amount: string, purpose: string): Promise<void> {
    await this.app.vault.process(file, (c) => sections.addHelp(c, date || today(), amount, purpose));
  }

  async addRestriction(file: TFile, date: string, text: string): Promise<void> {
    await this.app.vault.process(file, (c) => sections.addRestriction(c, date || today(), text));
  }

  async liftRestriction(file: TFile, index: number): Promise<void> {
    await this.app.vault.process(file, (c) => sections.liftRestriction(c, index, today()));
  }

  async ensurePrivateHeading(file: TFile, sub: string): Promise<void> {
    await this.app.vault.process(file, (c) => sections.ensurePrivateHeading(c, sub));
  }

  async logInteraction(file: TFile, note: string): Promise<void> {
    const day = today();
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
      const entry = `\n### ${day} \u2014 Note\n${note}\n`;
      lines.splice(insertIdx, 0, entry);
      await this.app.vault.modify(file, lines.join('\n'));
    }

    // Also update last-contact
    await this.markContacted(file);
  }
}

/** Local date, YYYY-MM-DD (toISOString would give tomorrow's date on a Utah evening). */
export function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
