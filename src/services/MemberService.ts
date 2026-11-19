import { App, EventRef, TFile, parseYaml } from 'obsidian';
import { MemberState, Priority, MemberStatus, PastoralState, Ordinance, Recommend, PriesthoodOffice, Interaction, ShepherdSettings, RelationshipPerson, CheckIn, CheckInStyle } from '../models/types';
import { parseMinistering, normalizeAddress } from './helpers';
import { parseFacts, parsePrivate, parseTasks, splitBody } from './sections';

interface MemberIndexEntry {
  file: TFile;
  name: string;
  address: string;
  status: string;
}

export class MemberService {
  private index: MemberIndexEntry[] | null = null;

  // The owning view must pass this to registerEvent() so the listener dies
  // with the view — MemberService is per-view, and an unregistered listener
  // leaks on every view close.
  readonly indexInvalidationRef: EventRef;

  constructor(private app: App, private settings: ShepherdSettings) {
    // Simple invalidation: any change to a member file's metadata drops the
    // cached index so the next housemate/name lookup rebuilds it.
    this.indexInvalidationRef = this.app.metadataCache.on('changed', (file) => {
      if (file instanceof TFile && this.isMemberFile(file)) {
        this.index = null;
      }
    });
  }

  isMemberFile(file: TFile | null): boolean {
    if (!file) return false;
    return file.path.startsWith(this.settings.memberDir + '/') && file.extension === 'md';
  }

  async buildMemberState(file: TFile): Promise<MemberState> {
    // Read frontmatter from cache (instant)
    const cache = this.app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter || {};

    // Read body (single file)
    const content = await this.app.vault.read(file);
    const { body } = splitBody(content);

    const tasks = parseTasks(body);
    const interactions = this.parseInteractions(body);

    const lastContact = String(fm['last-contact'] || '');
    const newestEntry = interactions.map((i) => i.date).filter(Boolean).sort().pop() || '';
    const lastTalked = [lastContact.slice(0, 10), newestEntry].filter(Boolean).sort().pop() || '';
    const daysSinceContact = this.daysSince(lastTalked);
    const ministering = parseMinistering(String(fm['ministering-assignment'] || ''));

    return {
      file,
      name: String(fm.name || file.basename),
      photo: String(fm.photo || ''),
      phone: String(fm.phone || ''),
      email: String(fm.email || ''),
      address: String(fm.address || ''),
      age: fm.age != null ? Number(fm.age) : null,
      dob: String(fm.dob || ''),
      gender: String(fm.gender || ''),
      priority: (fm.priority || 'normal') as Priority,
      status: (fm.status || 'new') as MemberStatus,
      pastoralState: (fm['pastoral-state'] || '') as PastoralState,
      checkIn: (fm['check-in'] || 'none') as CheckIn,
      checkInStyle: (fm['check-in-style'] || 'gif') as CheckInStyle,
      gifPrompt: String(fm['gif-prompt'] || ''),
      nextOrdinance: (fm['next-ordinance'] || 'unknown') as Ordinance,
      recommend: (fm.recommend || 'unknown') as Recommend,
      recommendExp: String(fm['recommend-exp'] || ''),
      endowed: fm.endowed === true || fm.endowed === 'true',
      priesthood: (fm.priesthood || 'none') as PriesthoodOffice,
      ministeringBrothers: Array.isArray(fm['ministering-brothers']) ? fm['ministering-brothers'] : [],
      ministeringSisters: Array.isArray(fm['ministering-sisters']) ? fm['ministering-sisters'] : [],
      ministeredBy: ministering.ministeredBy,
      ministersTo: ministering.ministersTo,
      patriarchalBlessing: fm['patriarchal-blessing'] === true,
      calling: String(fm.calling || ''),
      lastContact,
      convertDate: String(fm['convert-date'] || ''),
      movedIn: String(fm['moved-in'] || ''),
      met: fm.met === true || fm.met === 'true' ? true : fm.met === false || fm.met === 'false' ? false : null,
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      daysSinceContact,
      isOverdue: this.checkOverdue(fm.priority as Priority, daysSinceContact),
      tasks,
      interactions,
      facts: parseFacts(body),
      private: parsePrivate(body),
      callingSince: String(fm['calling-since'] || ''),
      priorUnit: String(fm['prior-unit'] || ''),
      mission: String(fm.mission || ''),
      lastTalked,
    };
  }

  private daysSince(dateStr: string): number | null {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    const now = new Date();
    return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  }

  private checkOverdue(priority: Priority | undefined, days: number | null): boolean {
    if (days === null) return false;
    const highPriority = priority === 'top-10' || priority === 'high';
    return highPriority && days > this.settings.overdueThreshold;
  }

  private parseInteractions(body: string): Interaction[] {
    const interactions: Interaction[] = [];
    const lines = body.split('\n');
    let inSection = false;
    let current: Interaction | null = null;

    for (const line of lines) {
      if (line.match(/^##\s+Interactions/)) {
        inSection = true;
        continue;
      }
      if (inSection && line.match(/^##\s/) && !line.match(/^###/)) break;
      if (!inSection) continue;

      const heading = line.match(/^###\s+(.*)/);
      if (heading) {
        if (current) interactions.push(current);
        const headingText = heading[1];
        const dateMatch = headingText.match(/(\d{4}-\d{2}-\d{2})/);
        current = {
          date: dateMatch ? dateMatch[1] : '',
          title: headingText,
          preview: '',
        };
        continue;
      }

      if (current && line.trim()) {
        if (current.preview) {
          current.preview += ' · ' + line.trim();
        } else {
          current.preview = line.trim();
        }
      }
    }
    if (current) interactions.push(current);
    return interactions;
  }

  /** All other member files sharing a normalized address, excluding moved-out members. */
  getHousemates(member: MemberState): RelationshipPerson[] {
    const targetAddress = normalizeAddress(member.address);
    if (!targetAddress) return [];

    return this.getIndex()
      .filter((entry) => entry.file.path !== member.file.path)
      .filter((entry) => entry.status !== 'moved-out')
      .filter((entry) => normalizeAddress(entry.address) === targetAddress)
      .map((entry) => ({ name: entry.name, file: entry.file }));
  }

  /** Looks up a member file by display name (frontmatter `name`, falling back to filename). */
  resolveMemberByName(name: string): TFile | null {
    const target = name.trim().toLowerCase();
    if (!target) return null;

    const index = this.getIndex();
    const byName = index.find((entry) => entry.name.trim().toLowerCase() === target);
    if (byName) return byName.file;

    const byFile = index.find((entry) => entry.file.basename.trim().toLowerCase() === target);
    return byFile ? byFile.file : null;
  }

  private getIndex(): MemberIndexEntry[] {
    if (!this.index) this.index = this.buildIndex();
    return this.index;
  }

  private buildIndex(): MemberIndexEntry[] {
    return this.app.vault.getFiles()
      .filter((f) => this.isMemberFile(f))
      .map((file) => {
        const cache = this.app.metadataCache.getFileCache(file);
        const fm = cache?.frontmatter || {};
        return {
          file,
          name: String(fm.name || file.basename),
          address: String(fm.address || ''),
          status: String(fm.status || ''),
        };
      });
  }
}
