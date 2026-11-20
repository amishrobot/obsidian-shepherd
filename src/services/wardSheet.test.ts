import { describe, it, expect } from 'vitest';
import { kindLabel, parseWardSheet, sheetFor, sheetIsEmpty, sheetKeyForPath } from './wardSheet';

const at = (name: string) => `Church/Members/${name}.md`;
// The synthetic note's creation time, as the sync records it and Obsidian reports it.
const BORN = 1_700_000_000_000;

// Synthetic data only. Never paste real sheet rows into this file.
const file = (members: unknown, schema: unknown = 2) =>
  JSON.stringify({ schema, generated: '2026-01-02T03:04:05+00:00', members });

const full = {
  note_created_ms: BORN,
  last_talk: '2026-01-04',
  last_prayer: '2025-12-07',
  talks: [{ date: '2026-01-04', kind: 'talk', topic: 'Example topic' }],
  prayers: [{ date: '2025-12-07', kind: 'opening prayer' }],
  upcoming: [{ date: '2026-02-01', kind: 'talk', topic: 'Next topic' }],
  welcome_form: {
    submitted: '2025-09-01', situation: 'Student', accept_calling: 'Yes', teach: 'Yes',
    music: 'Piano', past_callings: 'Clerk', hobbies: 'Chess', for_bishopric: 'A note',
  },
};

describe('parseWardSheet', () => {
  it('reads a full member entry', () => {
    const s = sheetFor(parseWardSheet(file({ 'Alex Example': full })), at('Alex Example'), BORN);
    expect(s).not.toBeNull();
    expect(s!.lastTalk).toBe('2026-01-04');
    expect(s!.talks).toEqual([{ date: '2026-01-04', kind: 'talk', topic: 'Example topic' }]);
    expect(s!.prayers).toEqual([{ date: '2025-12-07', kind: 'opening prayer', topic: '' }]);
    expect(s!.upcoming).toHaveLength(1);
    expect(s!.welcomeForm).toEqual({
      submitted: '2025-09-01', situation: 'Student', acceptCalling: 'Yes', teach: 'Yes',
      music: 'Piano', pastCallings: 'Clerk', hobbies: 'Chess', forBishopric: 'A note',
    });
  });

  it('returns null for text that is not JSON', () => {
    expect(parseWardSheet('')).toBeNull();
    expect(parseWardSheet('{not json')).toBeNull();
  });

  it('returns null for an unknown schema or a missing members map', () => {
    expect(parseWardSheet(file({}, 1))).toBeNull(); // schema 1 has no note identity
    expect(parseWardSheet(file({}, 3))).toBeNull();
    expect(parseWardSheet(JSON.stringify({ schema: 1 }))).toBeNull();
    expect(parseWardSheet(JSON.stringify({ schema: 1, members: [] }))).toBeNull();
    expect(parseWardSheet('null')).toBeNull();
    expect(parseWardSheet('[]')).toBeNull();
  });

  it('survives wrong-typed fields instead of throwing', () => {
    const s = sheetFor(parseWardSheet(file({
      'Alex Example': { note_created_ms: BORN, last_talk: 7, talks: 'nope', prayers: [null, 3, { kind: 'talk' }, { date: '2026-01-01' }], upcoming: {}, welcome_form: 'x' },
      'Bad Entry': 'a string',
    })), at('Alex Example'), BORN);
    expect(s).toEqual({
      noteCreated: BORN, lastTalk: '', lastPrayer: '', talks: [], upcoming: [], welcomeForm: null,
      prayers: [{ date: '2026-01-01', kind: '', topic: '' }],
    });
  });

  it('drops a member whose entry is not an object', () => {
    const sheet = parseWardSheet(file({ 'Bad Entry': 'a string' }));
    expect(sheetFor(sheet, at('Bad Entry'), BORN)).toBeNull();
  });

  it('treats a welcome form of empty strings as no form', () => {
    const s = sheetFor(parseWardSheet(file({
      'Alex Example': { note_created_ms: BORN, welcome_form: { submitted: '', situation: ' ', hobbies: '' } },
    })), at('Alex Example'), BORN);
    expect(s!.welcomeForm).toBeNull();
  });
});

describe('sheetFor', () => {
  it('returns null with no sheet or an absent member', () => {
    expect(sheetFor(null, at('Alex Example'), BORN)).toBeNull();
    expect(sheetFor(parseWardSheet(file({})), at('Alex Example'), BORN)).toBeNull();
  });

  it('does not match inherited object keys', () => {
    expect(sheetFor(parseWardSheet(file({})), at('constructor'), BORN)).toBeNull();
    expect(sheetFor(parseWardSheet(file({})), at('toString'), BORN)).toBeNull();
  });
});

describe('canonical-path join', () => {
  const sheet = parseWardSheet(file({ 'Alex Example': full, 'Blair Sample': full }));

  it('gives an ordinary current member their own entry', () => {
    expect(sheetFor(sheet, 'Church/Members/Alex Example.md', BORN)).not.toBeNull();
    expect(sheetFor(sheet, 'Church/Members/Blair Sample.md', BORN)!.lastTalk).toBe('2026-01-04');
  });

  it('gives an archived note with the same basename nothing', () => {
    expect(sheetFor(sheet, 'Church/Members/_archive/Alex Example.md', BORN)).toBeNull();
  });

  it('gives an outreach note with the same basename nothing', () => {
    expect(sheetFor(sheet, 'Church/Members/_outreach/Alex Example.md', BORN)).toBeNull();
  });

  it('gives a moved note in any other folder nothing', () => {
    expect(sheetFor(sheet, 'Church/Members/Old/Alex Example.md', BORN)).toBeNull();
    expect(sheetFor(sheet, 'Church/Members/_archive/2025/Alex Example.md', BORN)).toBeNull();
    expect(sheetFor(sheet, 'Church/_archive/Alex Example.md', BORN)).toBeNull();
    expect(sheetFor(sheet, 'Personal/Church/Members/Alex Example.md', BORN)).toBeNull();
    expect(sheetFor(sheet, 'Alex Example.md', BORN)).toBeNull();
  });

  it('never falls back to a bare basename or a near match', () => {
    expect(sheetFor(sheet, 'Alex Example', BORN)).toBeNull();
    expect(sheetFor(sheet, 'Church/Members/alex example.md', BORN)).toBeNull();
    expect(sheetFor(sheet, 'Church/Members/Alex Example.canvas', BORN)).toBeNull();
    expect(sheetFor(sheet, 'Church/Members/Alex Example 1.md', BORN)).toBeNull();
  });

  it('skips underscore notes the sync never keys', () => {
    const s = parseWardSheet(file({ _Dashboard: full }));
    expect(sheetFor(s, 'Church/Members/_Dashboard.md', BORN)).toBeNull();
  });

  it('maps paths to keys only for top-level member notes', () => {
    expect(sheetKeyForPath('Church/Members/Alex Example.md')).toBe('Alex Example');
    expect(sheetKeyForPath('Church/Members/_outreach/Alex Example.md')).toBeNull();
    expect(sheetKeyForPath('Church/Members/.md')).toBeNull();
    expect(sheetKeyForPath('Church/Members/')).toBeNull();
  });
});

describe('note identity binding', () => {
  const sheet = parseWardSheet(file({ 'Alex Example': full }));

  it('shows the entry on the same note the sync matched', () => {
    expect(sheetFor(sheet, at('Alex Example'), BORN)).not.toBeNull();
  });

  it('absorbs sub-second rounding between the sync and Obsidian', () => {
    expect(sheetFor(sheet, at('Alex Example'), BORN + 0.4)).not.toBeNull();
    expect(sheetFor(sheet, at('Alex Example'), BORN - 4)).not.toBeNull();
  });

  it('gives nothing to a same-name note created after the sync (archive, then replace, before the next run)', () => {
    // The synced note was archived; a different person's note now sits at the same path.
    const replacement = BORN + 3 * 24 * 60 * 60 * 1000;
    expect(sheetFor(sheet, at('Alex Example'), replacement)).toBeNull();
    expect(sheetFor(sheet, at('Alex Example'), BORN + 5)).toBeNull();
    expect(sheetFor(sheet, at('Alex Example'), BORN + 1000)).toBeNull();
    // And the archived original, at its new path, still gets nothing either.
    expect(sheetFor(sheet, 'Church/Members/_archive/Alex Example.md', BORN)).toBeNull();
  });

  it('gives nothing to a note created before the synced one', () => {
    expect(sheetFor(sheet, at('Alex Example'), BORN - 60_000)).toBeNull();
  });

  it('gives nothing when the entry carries no creation time', () => {
    const unbound = { ...full } as Record<string, unknown>;
    delete unbound.note_created_ms;
    for (const v of [undefined, null, 0, -5, 'x', NaN]) {
      const s = parseWardSheet(file({ 'Alex Example': v === undefined ? unbound : { ...full, note_created_ms: v } }));
      expect(sheetFor(s, at('Alex Example'), BORN)).toBeNull();
    }
  });

  it('gives nothing when the note reports no usable creation time', () => {
    expect(sheetFor(sheet, at('Alex Example'), NaN)).toBeNull();
  });
});

describe('sheetIsEmpty', () => {
  it('is true for a matched member with nothing recorded', () => {
    const s = sheetFor(parseWardSheet(file({
      'Alex Example': { note_created_ms: BORN, last_talk: '', last_prayer: '', talks: [], prayers: [], upcoming: [], welcome_form: null },
    })), at('Alex Example'), BORN);
    expect(sheetIsEmpty(s!)).toBe(true);
  });

  it('is false once anything is recorded', () => {
    const s = sheetFor(parseWardSheet(file({ 'Alex Example': full })), at('Alex Example'), BORN);
    expect(sheetIsEmpty(s!)).toBe(false);
  });
});

describe('kindLabel', () => {
  it('capitalizes the kind and falls back when it is empty', () => {
    expect(kindLabel('opening prayer', 'Prayer')).toBe('Opening prayer');
    expect(kindLabel('', 'Prayer')).toBe('Prayer');
  });
});
