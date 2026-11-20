// The ward sheet cache: talks, prayers, upcoming assignments and welcome-form
// answers per member, written nightly by JoshOS (ward_sheet_sync) as JSON so
// the search index never sees it. Keys are the filenames (no .md) of the
// current-member notes directly inside Church/Members — the one folder the
// sync reads. A key names that exact note, never any note with the same name.
// Each entry also carries the creation time of the note it was matched to
// (schema 2, AMI-2621); an entry is shown only when the note at that path
// still has that creation time, so a same-name note created after the sync
// (an archive-then-replace between nightly runs) gets nothing.
//
// Everything here is pure and forgiving. A missing file, bad JSON, an unknown
// schema or a wrong-typed field all come back as "nothing for this member",
// never as a thrown error: the panel shows one quiet line instead.

export const WARD_SHEET_PATH = 'Church/_system/cache/ward-sheet.json';

/**
 * The folder ward_sheet_sync reads (top level only, `_`-prefixed names
 * skipped). Fixed by the sync, not by the plugin's member-folder setting:
 * the sheet's keys only mean something for notes in this exact folder.
 */
export const SHEET_MEMBER_DIR = 'Church/Members';

export interface SheetEvent {
  date: string;
  kind: string;
  topic: string;
}

export interface WelcomeForm {
  submitted: string;
  situation: string;
  acceptCalling: string;
  teach: string;
  music: string;
  pastCallings: string;
  hobbies: string;
  forBishopric: string;
}

export interface MemberSheet {
  /** Creation time (epoch ms) of the note this entry was matched to; null = unbound, never shown. */
  noteCreated: number | null;
  lastTalk: string;
  lastPrayer: string;
  talks: SheetEvent[];
  prayers: SheetEvent[];
  upcoming: SheetEvent[];
  welcomeForm: WelcomeForm | null;
}

export interface WardSheet {
  generated: string;
  members: Record<string, MemberSheet>;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function events(v: unknown): SheetEvent[] {
  if (!Array.isArray(v)) return [];
  const out: SheetEvent[] = [];
  for (const e of v) {
    if (!isObject(e)) continue;
    const date = str(e.date);
    if (!date) continue;
    out.push({ date, kind: str(e.kind), topic: str(e.topic) });
  }
  return out;
}

function welcomeForm(v: unknown): WelcomeForm | null {
  if (!isObject(v)) return null;
  const f: WelcomeForm = {
    submitted: str(v.submitted),
    situation: str(v.situation),
    acceptCalling: str(v.accept_calling),
    teach: str(v.teach),
    music: str(v.music),
    pastCallings: str(v.past_callings),
    hobbies: str(v.hobbies),
    forBishopric: str(v.for_bishopric),
  };
  return Object.values(f).some(Boolean) ? f : null;
}

function memberSheet(v: unknown): MemberSheet | null {
  if (!isObject(v)) return null;
  const created = v.note_created_ms;
  return {
    noteCreated: typeof created === 'number' && Number.isFinite(created) && created > 0 ? created : null,
    lastTalk: str(v.last_talk),
    lastPrayer: str(v.last_prayer),
    talks: events(v.talks),
    prayers: events(v.prayers),
    upcoming: events(v.upcoming),
    welcomeForm: welcomeForm(v.welcome_form),
  };
}

/**
 * Parse the cache file's text. Null when it isn't a schema-2 ward sheet:
 * schema 1 has no note identity, so it is refused rather than trusted.
 */
export function parseWardSheet(text: string): WardSheet | null {
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { return null; }
  if (!isObject(raw) || raw.schema !== 2 || !isObject(raw.members)) return null;
  const members: Record<string, MemberSheet> = {};
  for (const [name, v] of Object.entries(raw.members)) {
    const m = memberSheet(v);
    if (m) members[name] = m;
  }
  return { generated: str(raw.generated), members };
}

/**
 * The sheet key for a vault path, or null when the note isn't a current-member
 * note the sync could have keyed. Archived (`_archive/`), outreach
 * (`_outreach/`), any other subfolder, any other root, and `_`-prefixed notes
 * all come back null, so a note that merely shares a basename with a current
 * member never borrows that member's sheet.
 */
export function sheetKeyForPath(path: string): string | null {
  const prefix = SHEET_MEMBER_DIR + '/';
  if (!path.startsWith(prefix) || !path.endsWith('.md')) return null;
  const key = path.slice(prefix.length, -'.md'.length);
  if (!key || key.includes('/') || key.startsWith('_')) return null;
  return key;
}

/**
 * How far a note's creation time may drift from the one the sync recorded
 * and still count as the same note. Python's st_birthtime and Node's
 * birthtimeMs agree to the microsecond on APFS (measured 2026-11-20); the
 * sync rounds to whole ms, so the window only absorbs rounding. A person
 * creating a replacement note never lands inside it.
 */
export const NOTE_IDENTITY_TOLERANCE_MS = 5;

/**
 * One member's entry, for the note at `path` created at `noteCreated` (the
 * note's `TFile.stat.ctime`). Null unless all three hold: the path is a
 * canonical current-member note, the sheet has that key, and the entry's
 * recorded creation time matches this note's. Exact path match only; a
 * missing or mismatched creation time is no match, never a guess.
 */
export function sheetFor(sheet: WardSheet | null, path: string, noteCreated: number): MemberSheet | null {
  if (!sheet) return null;
  const key = sheetKeyForPath(path);
  if (key === null) return null;
  if (!Object.prototype.hasOwnProperty.call(sheet.members, key)) return null;
  const entry = sheet.members[key];
  if (entry.noteCreated === null || !Number.isFinite(noteCreated)) return null;
  return Math.abs(entry.noteCreated - noteCreated) < NOTE_IDENTITY_TOLERANCE_MS ? entry : null;
}

/** True when the entry has nothing to show (matched in the sheet, but never spoke, prayed or filled the form). */
export function sheetIsEmpty(s: MemberSheet): boolean {
  return !s.lastTalk && !s.lastPrayer && !s.talks.length && !s.prayers.length && !s.upcoming.length && !s.welcomeForm;
}

/** "opening prayer" → "Opening prayer"; an empty kind falls back to the given word. */
export function kindLabel(kind: string, fallback: string): string {
  const k = kind || fallback;
  return k.charAt(0).toUpperCase() + k.slice(1);
}
