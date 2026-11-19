import { describe, expect, it } from 'vitest';
import {
  addHelp, addRestriction, addTask, liftRestriction, parseFacts, parseHelp, parsePrivate,
  parseRestriction, parseTasks, splitBody, upsertFact,
} from './sections';

const NOTE = `---
name: Daniel Okafor
---
# Daniel Okafor

## Open threads

- [ ] Temple prep class 📅 2026-12-01
- [x] Bring him a Book of Mormon
- [ ] Check on the job interview by 2026-11-25

## Standing facts

- **Work** — Line cook at a Provo diner *(2026-10-28)*
- **School** — UVU, nursing prereqs
- Living: Three roommates in Orem (2026-09)

## Private

### Repentance & recovery

Meeting weekly. Six weeks clean.

### Membership

- 2026-04-12 — No temple recommend use
- 2026-04-12 — No sacrament · lifted 2026-09-01

### Help given

- 2026-06-03 — $450 — Rent (fast offering)
- 2026-08-10 — $1,200.50 — Groceries and utilities

### Mental health

Seeing a counselor through Family Services.

## Interactions

### 2026-10-28 — Interview
Talked.

## Earlier notes
`;

describe('parseTasks', () => {
  it('reads Open threads with due dates', () => {
    const { body } = splitBody(NOTE);
    const t = parseTasks(body);
    expect(t.map((x) => [x.text, x.completed, x.due])).toEqual([
      ['Temple prep class', false, '2026-12-01'],
      ['Bring him a Book of Mormon', true, ''],
      ['Check on the job interview', false, '2026-11-25'],
    ]);
    expect(body.split('\n')[t[0].line]).toContain('Temple prep');
  });

  it('falls back to Next Steps', () => {
    expect(parseTasks('## Next Steps\n\n- [ ] Old style\n\n## Interactions\n')[0].text).toBe('Old style');
  });
});

describe('parseFacts', () => {
  it('reads bold, plain and dateless facts', () => {
    expect(parseFacts(splitBody(NOTE).body)).toEqual([
      { label: 'Work', value: 'Line cook at a Provo diner', date: '2026-10-28' },
      { label: 'School', value: 'UVU, nursing prereqs', date: '' },
      { label: 'Living', value: 'Three roommates in Orem', date: '2026-09' },
    ]);
  });
});

describe('parsePrivate', () => {
  it('reads all four subsections', () => {
    const p = parsePrivate(splitBody(NOTE).body);
    expect(p.present).toBe(true);
    expect(p.recovery).toBe('Meeting weekly. Six weeks clean.');
    expect(p.membership).toEqual([
      { text: 'No temple recommend use', since: '2026-04-12', lifted: '' },
      { text: 'No sacrament', since: '2026-04-12', lifted: '2026-09-01' },
    ]);
    expect(p.help.map((h) => h.amount)).toEqual([450, 1200.5]);
    expect(p.help[0].purpose).toBe('Rent (fast offering)');
    expect(p.mentalHealth).toContain('counselor');
  });

  it('is empty without a Private section', () => {
    expect(parsePrivate('## Interactions\n').present).toBe(false);
  });

  it('parses loose items', () => {
    expect(parseRestriction('Informal restriction')).toEqual({ text: 'Informal restriction', since: '', lifted: '' });
    expect(parseHelp('2026-01-02 — Bus pass')).toEqual({ date: '2026-01-02', amount: null, amountText: '', purpose: 'Bus pass' });
  });
});

describe('writers', () => {
  it('adds a task to Open threads', () => {
    const out = addTask(NOTE, 'Call his mom');
    expect(parseTasks(splitBody(out).body).map((t) => t.text)).toContain('Call his mom');
  });

  it('creates Open threads before Interactions when missing', () => {
    const out = addTask('# X\n\n## Interactions\n\n### 2026-01-01 — Hi\n', 'First');
    expect(out.indexOf('## Open threads')).toBeLessThan(out.indexOf('## Interactions'));
    expect(parseTasks(out)[0].text).toBe('First');
  });

  it('writes to Next Steps on an unmigrated note', () => {
    const out = addTask('## Next Steps\n\n- [ ] A\n\n## Interactions\n', 'B');
    expect(out).not.toContain('Open threads');
    expect(parseTasks(out).map((t) => t.text)).toEqual(['A', 'B']);
  });

  it('upserts a fact by label', () => {
    const out = upsertFact(NOTE, 'Work', 'Shift lead', '2026-11-19');
    const facts = parseFacts(splitBody(out).body);
    expect(facts.find((f) => f.label === 'Work')).toEqual({ label: 'Work', value: 'Shift lead', date: '2026-11-19' });
    expect(facts).toHaveLength(3);
  });

  it('creates Standing facts after Open threads', () => {
    const out = upsertFact('## Open threads\n\n- [ ] A\n\n## Interactions\n', 'Work', 'Cook', '2026-11-19');
    expect(out.indexOf('## Open threads')).toBeLessThan(out.indexOf('## Standing facts'));
    expect(out.indexOf('## Standing facts')).toBeLessThan(out.indexOf('## Interactions'));
  });

  it('adds help and restrictions, creating Private when needed', () => {
    let out = addHelp('# X\n\n## Interactions\n', '2026-11-19', '80', 'Bus pass');
    out = addRestriction(out, '2026-11-19', 'No temple recommend use');
    const p = parsePrivate(out);
    expect(p.help).toEqual([{ date: '2026-11-19', amount: 80, amountText: '$80', purpose: 'Bus pass' }]);
    expect(p.membership[0].text).toBe('No temple recommend use');
    expect(out.indexOf('## Private')).toBeLessThan(out.indexOf('## Interactions'));
  });

  it('appends to an existing ledger', () => {
    const p = parsePrivate(splitBody(addHelp(NOTE, '2026-11-19', '$25', 'Gas')).body);
    expect(p.help).toHaveLength(3);
    expect(p.help[2].purpose).toBe('Gas');
  });

  it('lifts a restriction once', () => {
    const out = liftRestriction(NOTE, 0, '2026-11-19');
    expect(parsePrivate(splitBody(out).body).membership[0].lifted).toBe('2026-11-19');
    expect(liftRestriction(out, 1, '2026-11-20')).toBe(out);
  });
});
