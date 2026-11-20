import { describe, it, expect } from 'vitest';
import { kindLabel, parseWardSheet, sheetFor, sheetIsEmpty } from './wardSheet';

// Synthetic data only. Never paste real sheet rows into this file.
const file = (members: unknown, schema: unknown = 1) =>
  JSON.stringify({ schema, generated: '2026-01-02T03:04:05+00:00', members });

const full = {
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
    const s = sheetFor(parseWardSheet(file({ 'Alex Example': full })), 'Alex Example');
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
    expect(parseWardSheet(file({}, 2))).toBeNull();
    expect(parseWardSheet(JSON.stringify({ schema: 1 }))).toBeNull();
    expect(parseWardSheet(JSON.stringify({ schema: 1, members: [] }))).toBeNull();
    expect(parseWardSheet('null')).toBeNull();
    expect(parseWardSheet('[]')).toBeNull();
  });

  it('survives wrong-typed fields instead of throwing', () => {
    const s = sheetFor(parseWardSheet(file({
      'Alex Example': { last_talk: 7, talks: 'nope', prayers: [null, 3, { kind: 'talk' }, { date: '2026-01-01' }], upcoming: {}, welcome_form: 'x' },
      'Bad Entry': 'a string',
    })), 'Alex Example');
    expect(s).toEqual({
      lastTalk: '', lastPrayer: '', talks: [], upcoming: [], welcomeForm: null,
      prayers: [{ date: '2026-01-01', kind: '', topic: '' }],
    });
  });

  it('drops a member whose entry is not an object', () => {
    const sheet = parseWardSheet(file({ 'Bad Entry': 'a string' }));
    expect(sheetFor(sheet, 'Bad Entry')).toBeNull();
  });

  it('treats a welcome form of empty strings as no form', () => {
    const s = sheetFor(parseWardSheet(file({
      'Alex Example': { welcome_form: { submitted: '', situation: ' ', hobbies: '' } },
    })), 'Alex Example');
    expect(s!.welcomeForm).toBeNull();
  });
});

describe('sheetFor', () => {
  it('returns null with no sheet or an absent member', () => {
    expect(sheetFor(null, 'Alex Example')).toBeNull();
    expect(sheetFor(parseWardSheet(file({})), 'Alex Example')).toBeNull();
  });

  it('does not match inherited object keys', () => {
    expect(sheetFor(parseWardSheet(file({})), 'constructor')).toBeNull();
    expect(sheetFor(parseWardSheet(file({})), 'toString')).toBeNull();
  });
});

describe('sheetIsEmpty', () => {
  it('is true for a matched member with nothing recorded', () => {
    const s = sheetFor(parseWardSheet(file({
      'Alex Example': { last_talk: '', last_prayer: '', talks: [], prayers: [], upcoming: [], welcome_form: null },
    })), 'Alex Example');
    expect(sheetIsEmpty(s!)).toBe(true);
  });

  it('is false once anything is recorded', () => {
    const s = sheetFor(parseWardSheet(file({ 'Alex Example': full })), 'Alex Example');
    expect(sheetIsEmpty(s!)).toBe(false);
  });
});

describe('kindLabel', () => {
  it('capitalizes the kind and falls back when it is empty', () => {
    expect(kindLabel('opening prayer', 'Prayer')).toBe('Opening prayer');
    expect(kindLabel('', 'Prayer')).toBe('Prayer');
  });
});
