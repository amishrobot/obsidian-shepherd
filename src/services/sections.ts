// Pure readers and writers for the member-note sections the side panel shows.
// No Obsidian imports, so vitest can exercise them directly.
//
// Note layout (top to bottom):
//   ## Open threads     - [ ] task lines, optional "📅 YYYY-MM-DD" / "by YYYY-MM-DD"
//   ## Standing facts   - **Work** — value *(2026-05-12)*
//   ## Private
//     ### Repentance & recovery   prose
//     ### Membership              - 2026-04-12 — restriction · lifted 2026-09-01
//     ### Help given              - 2026-06-03 — $450 — rent
//     ### Mental health           prose
//   ## Interactions     ### YYYY-MM-DD — title
//   ## Earlier notes
//
// Older notes carry ## Next Steps instead of ## Open threads; readers fall back to it.

export interface Task {
  text: string;
  completed: boolean;
  /** Line index relative to the body (the text after frontmatter). */
  line: number;
  due: string;
}

export interface Fact {
  label: string;
  value: string;
  date: string;
}

export interface Restriction {
  text: string;
  since: string;
  lifted: string;
}

export interface HelpEntry {
  date: string;
  amount: number | null;
  amountText: string;
  purpose: string;
}

export interface PrivateInfo {
  recovery: string;
  membership: Restriction[];
  help: HelpEntry[];
  mentalHealth: string;
  /** True when the note has a ## Private section at all. */
  present: boolean;
}

export const FACT_LABELS = [
  'Background', 'Work', 'School', 'Family', 'Living', 'Relationships', 'Health', 'Temple', 'Activity',
];

export const PRIVATE_SUBSECTIONS = {
  recovery: 'Repentance & recovery',
  membership: 'Membership',
  help: 'Help given',
  mentalHealth: 'Mental health',
} as const;

const DATE = String.raw`\d{4}-\d{2}(?:-\d{2})?`;
const DASH = String.raw`\s+[—–-]\s+`;

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** [start, end) line range of a heading's content, or null. Ends at a heading of the same or higher level. */
export function sectionRange(lines: string[], heading: string, level = 2, from = 0, to = lines.length): [number, number] | null {
  const hashes = '#'.repeat(level);
  const re = new RegExp(`^${hashes}\\s+${escapeRe(heading)}\\s*$`, 'i');
  const stop = new RegExp(`^#{1,${level}}\\s`);
  for (let i = from; i < to; i++) {
    if (!re.test(lines[i])) continue;
    let j = i + 1;
    while (j < to && !stop.test(lines[j])) j++;
    return [i + 1, j];
  }
  return null;
}

function sectionText(lines: string[], range: [number, number] | null): string {
  if (!range) return '';
  return lines.slice(range[0], range[1]).join('\n').trim();
}

export function splitBody(content: string): { body: string; offset: number } {
  const m = content.match(/^---\n[\s\S]*?\n---\n/);
  if (!m) return { body: content, offset: 0 };
  return { body: content.slice(m[0].length), offset: m[0].split('\n').length - 1 };
}

const DUE_RE = new RegExp(String.raw`\s*(?:📅\s*|\bby\s+|·\s*)(${DATE})\s*$`, 'i');

export function parseTasks(body: string): Task[] {
  const lines = body.split('\n');
  const range = sectionRange(lines, 'Open threads') || sectionRange(lines, 'Next Steps');
  if (!range) return [];
  const tasks: Task[] = [];
  for (let i = range[0]; i < range[1]; i++) {
    const m = lines[i].match(/^\s*- \[([ xX])\]\s+(.*)$/);
    if (!m) continue;
    let text = m[2].trim();
    let due = '';
    const d = text.match(DUE_RE);
    if (d) {
      due = d[1];
      text = text.slice(0, d.index).trim();
    }
    tasks.push({ completed: m[1] !== ' ', text, line: i, due });
  }
  return tasks;
}

const FACT_RE = new RegExp(
  String.raw`^\s*-\s+(?:\*\*(.+?)\*\*:?|([A-Z][\w &/]*?):)\s*(?:[—–-]\s*)?(.*?)\s*(?:\*?\((${DATE})\)\*?)?\s*$`,
);

export function parseFacts(body: string): Fact[] {
  const lines = body.split('\n');
  const range = sectionRange(lines, 'Standing facts');
  if (!range) return [];
  const facts: Fact[] = [];
  for (let i = range[0]; i < range[1]; i++) {
    const m = lines[i].match(FACT_RE);
    if (!m) continue;
    const label = (m[1] || m[2] || '').trim();
    const value = (m[3] || '').trim();
    if (!label || !value) continue;
    facts.push({ label, value, date: m[4] || '' });
  }
  return facts;
}

function listLines(lines: string[], range: [number, number] | null): string[] {
  if (!range) return [];
  return lines.slice(range[0], range[1])
    .filter((l) => /^\s*-\s+/.test(l))
    .map((l) => l.replace(/^\s*-\s+/, '').trim());
}

export function parseRestriction(item: string): Restriction {
  let rest = item;
  let since = '';
  let lifted = '';
  const lm = rest.match(new RegExp(String.raw`\s*[·,]?\s*lifted\s+(${DATE})\s*$`, 'i'));
  if (lm) {
    lifted = lm[1];
    rest = rest.slice(0, lm.index).trim();
  }
  const sm = rest.match(new RegExp(`^(${DATE})${DASH}(.*)$`));
  if (sm) {
    since = sm[1];
    rest = sm[2].trim();
  }
  return { text: rest, since, lifted };
}

export function parseHelp(item: string): HelpEntry {
  const parts = item.split(/\s+[—–]\s+/).map((p) => p.trim());
  let date = '';
  if (parts.length && new RegExp(`^${DATE}$`).test(parts[0])) date = parts.shift() as string;
  let amount: number | null = null;
  let amountText = '';
  const ai = parts.findIndex((p) => /^\$\s*[\d,]+(?:\.\d+)?$/.test(p));
  if (ai >= 0) {
    amountText = parts[ai].replace(/\s+/g, '');
    amount = Number(amountText.replace(/[$,]/g, ''));
    parts.splice(ai, 1);
  }
  return { date, amount, amountText, purpose: parts.join(' — ') };
}

export function parsePrivate(body: string): PrivateInfo {
  const lines = body.split('\n');
  const priv = sectionRange(lines, 'Private');
  if (!priv) return { recovery: '', membership: [], help: [], mentalHealth: '', present: false };
  const sub = (name: string) => sectionRange(lines, name, 3, priv[0], priv[1]);
  return {
    present: true,
    recovery: sectionText(lines, sub(PRIVATE_SUBSECTIONS.recovery)),
    membership: listLines(lines, sub(PRIVATE_SUBSECTIONS.membership)).map(parseRestriction),
    help: listLines(lines, sub(PRIVATE_SUBSECTIONS.help)).map(parseHelp),
    mentalHealth: sectionText(lines, sub(PRIVATE_SUBSECTIONS.mentalHealth)),
  };
}

// ---------------------------------------------------------------- writers

/** Sections in note order; a missing one is created before the first later one that exists. */
const ORDER = ['Open threads', 'Standing facts', 'Private', 'Interactions', 'Earlier notes'];

/** Ensure a ## section exists; returns new lines and the section's content range. */
export function ensureSection(lines: string[], heading: string): { lines: string[]; range: [number, number] } {
  const found = sectionRange(lines, heading);
  if (found) return { lines, range: found };
  const later = ORDER.slice(ORDER.indexOf(heading) + 1);
  let at = -1;
  for (const h of later) {
    const r = sectionRange(lines, h);
    if (r && (at < 0 || r[0] - 1 < at)) at = r[0] - 1;
  }
  const out = lines.slice();
  if (at < 0) {
    while (out.length && out[out.length - 1].trim() === '') out.pop();
    out.push('', `## ${heading}`, '');
  } else {
    out.splice(at, 0, `## ${heading}`, '', '');
  }
  return { lines: out, range: sectionRange(out, heading) as [number, number] };
}

/** Ensure ### sub exists inside ## parent (appended at the end of the parent). */
export function ensureSubsection(lines: string[], parent: string, sub: string): { lines: string[]; range: [number, number] } {
  const p = ensureSection(lines, parent);
  let out = p.lines;
  const found = sectionRange(out, sub, 3, p.range[0], p.range[1]);
  if (found) return { lines: out, range: found };
  let end = p.range[1];
  while (end > p.range[0] && out[end - 1].trim() === '') end--;
  out = out.slice();
  out.splice(end, 0, '', `### ${sub}`, '');
  const pr = sectionRange(out, parent) as [number, number];
  return { lines: out, range: sectionRange(out, sub, 3, pr[0], pr[1]) as [number, number] };
}

/** Insert a line after the last list item in a range (or at its top when it has none). */
function appendListItem(lines: string[], range: [number, number], item: string, prepend = false): string[] {
  const out = lines.slice();
  let at = range[0];
  // Skip a blank line right after the heading.
  while (at < range[1] && out[at].trim() === '' && at === range[0]) at++;
  if (!prepend) {
    for (let i = range[0]; i < range[1]; i++) if (/^\s*- /.test(out[i])) at = i + 1;
  }
  out.splice(at, 0, item);
  // Keep a blank line before the next heading.
  if (at + 1 < out.length && /^#/.test(out[at + 1])) out.splice(at + 1, 0, '');
  return out;
}

export function addTask(content: string, text: string): string {
  let lines = content.split('\n');
  const legacy = sectionRange(lines, 'Open threads') ? null : sectionRange(lines, 'Next Steps');
  const target = legacy ? { lines, range: legacy } : ensureSection(lines, 'Open threads');
  lines = appendListItem(target.lines, target.range, `- [ ] ${text}`);
  return lines.join('\n');
}

export function upsertFact(content: string, label: string, value: string, date: string): string {
  const { lines, range } = ensureSection(content.split('\n'), 'Standing facts');
  const line = `- **${label}** — ${value} *(${date})*`;
  for (let i = range[0]; i < range[1]; i++) {
    const m = lines[i].match(FACT_RE);
    if (m && (m[1] || m[2] || '').trim().toLowerCase() === label.toLowerCase()) {
      const out = lines.slice();
      out[i] = line;
      return out.join('\n');
    }
  }
  return appendListItem(lines, range, line).join('\n');
}

export function addHelp(content: string, date: string, amount: string, purpose: string): string {
  const { lines, range } = ensureSubsection(content.split('\n'), 'Private', PRIVATE_SUBSECTIONS.help);
  const amt = amount.trim() ? `$${amount.trim().replace(/^\$/, '')}` : '';
  const item = ['- ' + date, amt, purpose.trim()].filter(Boolean).join(' — ');
  return appendListItem(lines, range, item).join('\n');
}

export function addRestriction(content: string, date: string, text: string): string {
  const { lines, range } = ensureSubsection(content.split('\n'), 'Private', PRIVATE_SUBSECTIONS.membership);
  return appendListItem(lines, range, `- ${date} — ${text.trim()}`).join('\n');
}

/** Mark the nth membership item lifted on `date`. */
export function liftRestriction(content: string, index: number, date: string): string {
  const lines = content.split('\n');
  const priv = sectionRange(lines, 'Private');
  if (!priv) return content;
  const r = sectionRange(lines, PRIVATE_SUBSECTIONS.membership, 3, priv[0], priv[1]);
  if (!r) return content;
  let n = 0;
  for (let i = r[0]; i < r[1]; i++) {
    if (!/^\s*-\s+/.test(lines[i])) continue;
    if (n++ !== index) continue;
    if (/lifted\s+\d{4}-/i.test(lines[i])) return content;
    lines[i] = `${lines[i].trimEnd()} · lifted ${date}`;
    return lines.join('\n');
  }
  return content;
}

/** Make sure a ### heading under ## Private exists so the note can be opened at it. */
export function ensurePrivateHeading(content: string, sub: string): string {
  return ensureSubsection(content.split('\n'), 'Private', sub).lines.join('\n');
}
