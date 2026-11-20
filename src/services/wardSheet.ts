// The ward sheet cache: talks, prayers, upcoming assignments and welcome-form
// answers per member, written nightly by JoshOS (ward_sheet_sync) as JSON so
// the search index never sees it. Keys are member note basenames.
//
// Everything here is pure and forgiving. A missing file, bad JSON, an unknown
// schema or a wrong-typed field all come back as "nothing for this member",
// never as a thrown error: the panel shows one quiet line instead.

export const WARD_SHEET_PATH = 'Church/_system/cache/ward-sheet.json';

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
  return {
    lastTalk: str(v.last_talk),
    lastPrayer: str(v.last_prayer),
    talks: events(v.talks),
    prayers: events(v.prayers),
    upcoming: events(v.upcoming),
    welcomeForm: welcomeForm(v.welcome_form),
  };
}

/** Parse the cache file's text. Null when it isn't a schema-1 ward sheet. */
export function parseWardSheet(text: string): WardSheet | null {
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { return null; }
  if (!isObject(raw) || raw.schema !== 1 || !isObject(raw.members)) return null;
  const members: Record<string, MemberSheet> = {};
  for (const [name, v] of Object.entries(raw.members)) {
    const m = memberSheet(v);
    if (m) members[name] = m;
  }
  return { generated: str(raw.generated), members };
}

/** One member's entry, by note basename. Null when the sheet doesn't have them. */
export function sheetFor(sheet: WardSheet | null, basename: string): MemberSheet | null {
  if (!sheet) return null;
  return Object.prototype.hasOwnProperty.call(sheet.members, basename) ? sheet.members[basename] : null;
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
