import { App, MarkdownPostProcessorContext, TFile, setIcon } from 'obsidian';
import { callingNames } from './services/helpers';

// Reading-view styling for member notes (Doop frame 2c-D, main column).
// The markdown stays as written; this only decorates the rendered headings:
//   # Name                     → title + calling chips
//   ## Interactions            → "Conversations", entry count, "What did you talk about today?"
//   ### 2026-10-28 — Interview → timeline entry: icon tile, "Oct 28", type, topic
//   ### Confidential …         → lock tile, "Confidential" (folded by folds.ts)
// The heading text node is swapped for spans; the collapse arrow and
// data-heading (which folding and links key on) are left alone.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ENTRY = /^(\d{4})-(\d{2})-(\d{2})\s*(?:[—–·:-]\s*)?(.*)$/;

/** "2026-10-28" → "Oct 28"; another year → "Oct 28, 2025". */
export function entryDate(y: string, m: string, d: string, thisYear = new Date().getFullYear()): string {
  const base = `${MONTHS[parseInt(m, 10) - 1] ?? m} ${parseInt(d, 10)}`;
  return parseInt(y, 10) === thisYear ? base : `${base}, ${y}`;
}

/** Icon + kind for the first segment of an entry heading. */
export function entryKind(type: string): { kind: string; icon: string } {
  const t = type.toLowerCase();
  if (/interview|recommend|personal meeting|met with/.test(t)) return { kind: 'interview', icon: 'message-square' };
  if (/text|replied/.test(t)) return { kind: 'text', icon: 'message-circle' };
  if (/visit|welcome/.test(t)) return { kind: 'visit', icon: 'home' };
  if (/monologue|granola|circleback|call/.test(t)) return { kind: 'recording', icon: 'mic' };
  if (/tithing/.test(t)) return { kind: 'tithing', icon: 'receipt' };
  if (/welfare|assistance/.test(t)) return { kind: 'welfare', icon: 'hand-heart' };
  if (/ordain|ordinance|baptism|sealing/.test(t)) return { kind: 'ordinance', icon: 'sparkles' };
  if (/contact|hallway|sunday/.test(t)) return { kind: 'contact', icon: 'user' };
  return { kind: 'note', icon: 'file-text' };
}

/** "Interview — Temple prep" → { type: 'Interview', topic: 'Temple prep', empty: false } */
export function splitEntry(rest: string): { type: string; topic: string; empty: boolean } {
  const empty = /,\s*no notes\s*$/i.test(rest);
  const clean = rest.replace(/,\s*no notes\s*$/i, '').trim();
  const [type, ...more] = clean.split(/\s+[—–]\s+/);
  return { type: type || 'Note', topic: more.join(' — '), empty };
}

function replaceText(h: HTMLElement, build: (frag: DocumentFragment) => void) {
  for (const n of Array.from(h.childNodes)) if (n.nodeType === Node.TEXT_NODE) n.remove();
  const frag = document.createDocumentFragment();
  build(frag);
  h.appendChild(frag);
}

function tile(parent: DocumentFragment | HTMLElement, icon: string, cls = '') {
  const t = parent.createSpan({ cls: `sh-tile ${cls}`.trim() });
  setIcon(t, icon);
  return t;
}

export function makeNoteBodyProcessor(app: App, isMember: (f: TFile) => boolean) {
  return (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
    const file = app.vault.getAbstractFileByPath(ctx.sourcePath);
    if (!(file instanceof TFile) || !isMember(file)) return;
    const fm = app.metadataCache.getFileCache(file)?.frontmatter ?? {};

    el.querySelectorAll<HTMLElement>('h1').forEach((h) => {
      if (h.hasClass('sh-title')) return;
      h.addClass('sh-title');
      const callings = callingNames(String(fm.calling || '')).split(' · ').filter(Boolean);
      if (!callings.length) return;
      const row = createDiv({ cls: 'sh-callings' });
      for (const c of callings) {
        const chip = row.createSpan({ cls: 'sh-calling' });
        setIcon(chip.createSpan({ cls: 'sh-calling-ic' }), 'users');
        chip.createSpan({ text: c });
      }
      h.insertAdjacentElement('afterend', row);
    });

    el.querySelectorAll<HTMLElement>('h2').forEach((h) => {
      if (h.dataset.heading !== 'Interactions' || h.hasClass('sh-conv-h')) return;
      h.addClass('sh-conv-h');
      const heads = app.metadataCache.getFileCache(file)?.headings ?? [];
      const dated = heads.filter((x) => x.level === 3 && ENTRY.test(x.heading));
      const first = dated.map((x) => x.heading.slice(0, 7)).sort()[0];
      replaceText(h, (f) => {
        f.createSpan({ cls: 'sh-conv-title', text: 'Conversations' });
        if (dated.length) {
          const [y, m] = (first || '').split('-');
          const since = y && m ? ` since ${MONTHS[parseInt(m, 10) - 1]} ${y}` : '';
          f.createSpan({ cls: 'sh-conv-count', text: `${dated.length} ${dated.length === 1 ? 'entry' : 'entries'}${since}` });
        }
      });
      const btn = createEl('button', { cls: 'sh-compose', attr: { type: 'button' } });
      setIcon(btn.createSpan({ cls: 'sh-compose-ic' }), 'plus');
      btn.createSpan({ text: 'What did you talk about today?' });
      btn.createEl('kbd', { text: 'L' });
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        (app as unknown as { commands: { executeCommandById(id: string): boolean } })
          .commands.executeCommandById('shepherd:log-interaction');
      });
      h.insertAdjacentElement('afterend', btn);
    });

    el.querySelectorAll<HTMLElement>('h3').forEach((h) => {
      if (h.hasClass('sh-ev')) return;
      const text = h.dataset.heading ?? h.textContent ?? '';
      if (/^confidential/i.test(text)) {
        const m = /(\d{4})-(\d{2})-(\d{2})/.exec(text);
        const from = /from (bishop [a-z]+)/i.exec(text);
        h.addClass('sh-ev', 'sh-conf');
        replaceText(h, (f) => {
          tile(f, 'lock', 'sh-tile-lock');
          f.createSpan({ cls: 'sh-ev-date', text: m ? entryDate(m[1], m[2], m[3]) : from ? `From ${from[1].replace(/\bbishop\b/i, 'Bishop')}` : 'Earlier' });
          f.createSpan({ cls: 'sh-ev-conf', text: 'Confidential' });
        });
        return;
      }
      const m = ENTRY.exec(text);
      if (!m) return;
      const { type, topic, empty } = splitEntry(m[4]);
      const { kind, icon } = entryKind(type);
      h.addClass('sh-ev');
      h.dataset.kind = kind;
      if (empty) h.addClass('sh-ev-empty');
      replaceText(h, (f) => {
        tile(f, icon);
        f.createSpan({ cls: 'sh-ev-date', text: entryDate(m[1], m[2], m[3]) });
        f.createSpan({ cls: 'sh-ev-type', text: type });
        if (topic) f.createSpan({ cls: 'sh-ev-topic', text: topic });
        if (empty) f.createSpan({ cls: 'sh-ev-none', text: 'no notes' });
      });
    });
  };
}
