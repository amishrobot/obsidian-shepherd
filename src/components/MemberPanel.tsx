import { h, Fragment } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { App, Component, MarkdownRenderer, Platform, TFile, setIcon } from 'obsidian';
import { MemberState, RelationshipPerson, Task } from '../models/types';
import { HelpEntry, Restriction } from '../services/sections';
import { buildMapsUrl } from '../services/helpers';
import { MemberSheet, SheetEvent, kindLabel, sheetIsEmpty } from '../services/wardSheet';

// The member side panel (design 2c-D, "Native workbench"): a pinned header
// with the calling and when you last talked, open threads always visible,
// then Facts · Private · Ward behind a segmented control. Grouped lists with
// inset separators, Obsidian theme colors so it follows light and dark.

export type Tab = 'facts' | 'private' | 'ward';
export const TABS: { id: Tab; label: string; key: string }[] = [
  { id: 'facts', label: 'Facts', key: '1' },
  { id: 'private', label: 'Private', key: '2' },
  { id: 'ward', label: 'Ward', key: '3' },
];

export interface PanelPeople {
  housemates: RelationshipPerson[];
  ministeredBy: RelationshipPerson[];
  ministersTo: RelationshipPerson[];
}

export interface PanelActions {
  log: () => void;
  more: (e: MouseEvent) => void;
  toggleTask: (line: number) => void;
  addTask: (text: string) => void;
  addFact: (label?: string) => void;
  addHelp: () => void;
  addRestriction: () => void;
  liftRestriction: (index: number, e: MouseEvent) => void;
  editPrivate: (sub: string) => void;
  open: (f: TFile) => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function shortDate(iso: string, withYear = true): string {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(iso || '');
  if (!m) return iso || '';
  const mon = MONTHS[parseInt(m[2], 10) - 1] ?? '';
  if (!m[3]) return `${mon} ${m[1]}`;
  const day = parseInt(m[3], 10);
  return withYear ? `${mon} ${day}, ${m[1]}` : `${mon} ${day}`;
}

function daysAgo(iso: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
  if (!m) return null;
  const then = new Date(+m[1], +m[2] - 1, +m[3]).getTime();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((today - then) / 86400000);
}

export function lastTalkedLabel(iso: string): string {
  const d = daysAgo(iso);
  if (d === null) return 'Never';
  if (d <= 0) return 'Today';
  if (d === 1) return 'Yesterday';
  if (d < 60) return `${d} days ago`;
  const mo = Math.round(d / 30);
  if (mo < 18) return `${mo} months ago`;
  return `${Math.round(d / 365)} years ago`;
}

// "Temple Worker (Temple Workers) / Bishopric Second Counselor (Bishopric)" → names
function callingList(raw: string): string[] {
  return (raw || '').split('/').map((c) => c.replace(/\s*\([^)]*\)\s*$/, '').trim()).filter(Boolean);
}

function money(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

function Icon({ name, class: cls = '' }: { name: string; class?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => { if (ref.current) { ref.current.empty(); setIcon(ref.current, name); } }, [name]);
  return <span ref={ref} class={`sh2-icon ${cls}`} aria-hidden="true" />;
}

function Markdown({ app, component, text, path }: { app: App; component: Component; text: string; path: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.empty();
    void MarkdownRenderer.render(app, text, el, path, component);
  }, [text, path]);
  return <div ref={ref} class="sh2-prose" />;
}

function IconButton({ icon, label, hint, href, onClick }: {
  icon: string; label: string; hint?: string; href?: string; onClick?: (e: MouseEvent) => void;
}) {
  const title = hint ? `${label} · ${hint}` : label;
  if (href) {
    return <a class="sh2-iconbtn" href={href} aria-label={label} title={title}><Icon name={icon} /></a>;
  }
  return (
    <button type="button" class="sh2-iconbtn" aria-label={label} title={title}
      onClick={(e) => onClick?.(e as unknown as MouseEvent)}><Icon name={icon} /></button>
  );
}

function Header({ m, photoUrl, act }: { m: MemberState; photoUrl: string | null; act: PanelActions }) {
  const callings = callingList(m.calling);
  const digits = (m.phone || '').replace(/\D/g, '');
  const maps = m.address ? buildMapsUrl(m.address, Platform.isMacOS || Platform.isIosApp) : '';
  const meta: string[] = [];
  if (m.age != null) meta.push(String(m.age));
  if (m.priesthood && m.priesthood !== 'none') meta.push(m.priesthood.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()));
  if (m.movedIn) meta.push(`in ward since ${shortDate(m.movedIn.slice(0, 7))}`);
  const days = daysAgo(m.lastTalked);
  const tone = days === null ? 'is-never' : days > 60 ? 'is-stale' : '';
  const initials = m.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('');
  return (
    <header class="sh2-head">
      <div class="sh2-id">
        {photoUrl
          ? <img class="sh2-avatar" src={photoUrl} alt="" />
          : <div class="sh2-avatar is-empty">{initials}</div>}
        <div class="sh2-id-text">
          <div class="sh2-name">{m.name}</div>
          <div class={`sh2-calling ${callings.length ? '' : 'is-none'}`}>
            {callings.length ? callings.join(' · ') : 'No calling'}
          </div>
          {meta.length > 0 && <div class="sh2-meta">{meta.join(' · ')}</div>}
        </div>
      </div>
      <div class="sh2-last">
        <span class="sh2-label">Last talked</span>
        <span class={`sh2-last-value ${tone}`}>{lastTalkedLabel(m.lastTalked)}</span>
        {m.met === false && <span class="sh2-chip">Haven’t met</span>}
        {m.met === null && <span class="sh2-chip is-quiet">Met? not sorted</span>}
      </div>
      <div class="sh2-actions">
        {digits && <IconButton icon="phone" label="Call" hint="C" href={`tel:${digits}`} />}
        {digits && <IconButton icon="message-circle" label="Text" hint="T" href={`sms:${digits}`} />}
        {m.email && <IconButton icon="mail" label="Email" hint="E" href={`mailto:${m.email}`} />}
        {maps && <IconButton icon="map-pin" label={m.address} href={maps} />}
        <button type="button" class="sh2-btn mod-cta" title="Log a conversation · L" onClick={act.log}>
          <Icon name="pencil" /> Log
        </button>
        <IconButton icon="more-horizontal" label="Status, recommend, check-in" onClick={act.more} />
      </div>
    </header>
  );
}

function Threads({ tasks, act }: { tasks: Task[]; act: PanelActions }) {
  const [draft, setDraft] = useState('');
  const open = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);
  const [showDone, setShowDone] = useState(false);
  const shown = showDone ? [...open, ...done] : open;
  const submit = () => {
    if (draft.trim()) act.addTask(draft.trim());
    setDraft('');
  };
  return (
    <section class="sh2-section">
      <div class="sh2-section-head">
        <span class="sh2-section-title">Open threads</span>
        {open.length > 0 && <span class="sh2-count">{open.length}</span>}
        {done.length > 0 && (
          <button type="button" class="sh2-link" onClick={() => setShowDone(!showDone)}>
            {showDone ? 'Hide done' : `${done.length} done`}
          </button>
        )}
      </div>
      <div class="sh2-group">
        {shown.map((t) => {
          const d = t.due ? daysAgo(t.due) : null;
          return (
            <label class={`sh2-row sh2-task ${t.completed ? 'is-done' : ''}`}>
              <input type="checkbox" class="task-list-item-checkbox" checked={t.completed}
                onChange={() => act.toggleTask(t.line)} />
              <span class="sh2-task-text">{t.text}</span>
              {t.due && <span class={`sh2-due ${d !== null && d > 0 && !t.completed ? 'is-late' : ''}`}>{shortDate(t.due, false)}</span>}
            </label>
          );
        })}
        <div class="sh2-row sh2-add-row">
          <Icon name="plus" class="sh2-muted" />
          <input type="text" class="sh2-input" placeholder="Add a thread" value={draft}
            onInput={(e) => setDraft((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } }} />
        </div>
      </div>
    </section>
  );
}

function Segmented({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <div class="sh2-segmented" role="tablist">
      {TABS.map((t) => (
        <button type="button" role="tab" aria-selected={tab === t.id}
          class={`sh2-seg ${tab === t.id ? 'is-active' : ''} ${t.id === 'private' ? 'is-private' : ''}`}
          onClick={() => onTab(t.id)}>
          {t.id === 'private' && <Icon name="lock" />}
          {t.label}<kbd class="sh2-kbd">{t.key}</kbd>
        </button>
      ))}
    </div>
  );
}

function Labeled({ label, date, children, onClick }: { label: string; date?: string; children: any; onClick?: () => void }) {
  return (
    <div class={`sh2-row sh2-fact ${onClick ? 'is-clickable' : ''}`} onClick={onClick}>
      <div class="sh2-fact-body">
        <div class="sh2-label">{label}</div>
        <div class="sh2-value">{children}</div>
      </div>
      {date && <span class="sh2-date">{shortDate(date)}</span>}
    </div>
  );
}

function FactsTab({ m, act }: { m: MemberState; act: PanelActions }) {
  const facts = m.facts.slice();
  const has = (l: string) => facts.some((f) => f.label.toLowerCase() === l.toLowerCase());
  const restricted = m.private.membership.some((r) => !r.lifted);
  // Fill from frontmatter only where the note hasn't written the fact itself.
  if (!has('Temple') && !restricted && (m.endowed || m.recommend !== 'unknown')) {
    const bits: string[] = [];
    if (m.endowed) bits.push('Endowed');
    if (m.recommend === 'current' || m.recommend === 'expiring') bits.push(`recommend good until ${shortDate(m.recommendExp.slice(0, 7)) || '—'}`);
    if (m.recommend === 'expired') bits.push(`recommend expired ${shortDate(m.recommendExp.slice(0, 7))}`.trim());
    if (m.recommend === 'none') bits.push('no recommend');
    if (bits.length) facts.push({ label: 'Temple', value: bits.join(', ').replace(/^./, (c) => c.toUpperCase()), date: '' });
  }
  if (!has('Mission') && m.mission) facts.push({ label: 'Mission', value: m.mission, date: '' });
  return (
    <div class="sh2-tab">
      {facts.length === 0
        ? <div class="sh2-empty">Nothing written yet. Facts are what’s true now: work, school, family, where they live.</div>
        : (
          <div class="sh2-group">
            {facts.map((f) => (
              <Labeled label={f.label} date={f.date}
                onClick={m.facts.includes(f) ? () => act.addFact(f.label) : undefined}>{f.value}</Labeled>
            ))}
          </div>
        )}
      <button type="button" class="sh2-add" onClick={() => act.addFact()}><Icon name="plus" /> Add fact</button>
    </div>
  );
}

function RestrictionRow({ r, i, act }: { r: Restriction; i: number; act: PanelActions }) {
  const when = r.lifted
    ? `${shortDate(r.since)} – lifted ${shortDate(r.lifted)}`
    : r.since ? `Since ${shortDate(r.since)}` : '';
  return (
    <div class={`sh2-row sh2-restriction ${r.lifted ? 'is-lifted' : ''}`}>
      <div class="sh2-fact-body">
        <div class="sh2-value">{r.text}</div>
        {when && <div class="sh2-sub">{when}</div>}
      </div>
      {!r.lifted && (
        <button type="button" class="sh2-link" onClick={(e) => act.liftRestriction(i, e as unknown as MouseEvent)}>Lift</button>
      )}
    </div>
  );
}

function HelpRows({ help }: { help: HelpEntry[] }) {
  const total = help.reduce((s, x) => s + (x.amount ?? 0), 0);
  return (
    <>
      {help.map((x) => (
        <div class="sh2-row sh2-help">
          <div class="sh2-fact-body">
            <div class="sh2-value">{x.purpose || '—'}</div>
            {x.date && <div class="sh2-sub">{shortDate(x.date)}</div>}
          </div>
          <span class="sh2-amount">{x.amount != null ? money(x.amount) : ''}</span>
        </div>
      ))}
      {help.some((x) => x.amount != null) && (
        <div class="sh2-row sh2-total"><span>Total</span><span class="sh2-amount">{money(total)}</span></div>
      )}
    </>
  );
}

function PrivateTab({ app, component, m, act }: { app: App; component: Component; m: MemberState; act: PanelActions }) {
  const p = m.private;
  const prose = (title: string, text: string) => (
    <section class="sh2-section">
      <div class="sh2-section-head">
        <span class="sh2-section-title">{title}</span>
        <button type="button" class="sh2-link" onClick={() => act.editPrivate(title)}>{text ? 'Edit' : 'Write'}</button>
      </div>
      <div class="sh2-group">
        {text
          ? <div class="sh2-row"><Markdown app={app} component={component} text={text} path={m.file.path} /></div>
          : <div class="sh2-row sh2-muted">Nothing written</div>}
      </div>
    </section>
  );
  return (
    <div class="sh2-tab sh2-private">
      {prose('Repentance & recovery', p.recovery)}
      <section class="sh2-section">
        <div class="sh2-section-head">
          <span class="sh2-section-title">Membership</span>
          <button type="button" class="sh2-link" onClick={act.addRestriction}>+ Add</button>
        </div>
        <div class="sh2-group">
          {p.membership.length
            ? p.membership.map((r, i) => <RestrictionRow r={r} i={i} act={act} />)
            : <div class="sh2-row sh2-muted">No restrictions</div>}
        </div>
      </section>
      <section class="sh2-section">
        <div class="sh2-section-head">
          <span class="sh2-section-title">Help given</span>
          <button type="button" class="sh2-link" onClick={act.addHelp}>+ Add</button>
        </div>
        <div class="sh2-group">
          {p.help.length ? <HelpRows help={p.help} /> : <div class="sh2-row sh2-muted">None recorded</div>}
        </div>
      </section>
      {prose('Mental health', p.mentalHealth)}
    </div>
  );
}

function People({ label, people, act }: { label: string; people: RelationshipPerson[]; act: PanelActions }) {
  if (!people.length) return null;
  return (
    <Labeled label={label}>
      {people.map((x, i) => (
        <span>
          {x.file ? <a class="sh2-person" onClick={() => act.open(x.file as TFile)}>{x.name}</a> : x.name}
          {i < people.length - 1 ? ', ' : ''}
        </span>
      ))}
    </Labeled>
  );
}

function EventRows({ events, fallback }: { events: SheetEvent[]; fallback: string }) {
  return (
    <>
      {events.map((e) => (
        <div class="sh2-row sh2-fact">
          <div class="sh2-fact-body">
            <div class="sh2-value">{e.topic || kindLabel(e.kind, fallback)}</div>
            {e.topic && <div class="sh2-sub">{kindLabel(e.kind, fallback)}</div>}
          </div>
          <span class="sh2-date">{shortDate(e.date)}</span>
        </div>
      ))}
    </>
  );
}

/** A welcome-form answer that stays hidden until tapped (situation, the note to the bishopric). */
function Folded({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div class="sh2-row sh2-fact sh2-folded">
      <div class="sh2-fact-body">
        <div class="sh2-label"><Icon name="lock" class="sh2-fold-lock" /> {label}</div>
        {open && <div class="sh2-value">{text}</div>}
      </div>
      <button type="button" class="sh2-link" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}

const PRAYERS_SHOWN = 3;

function SheetSections({ sheet }: { sheet: MemberSheet | null }) {
  const [allPrayers, setAllPrayers] = useState(false);
  if (!sheet) return <div class="sh2-footnote">Not in the ward sheet.</div>;
  if (sheetIsEmpty(sheet)) return <div class="sh2-footnote">No talks, prayers or welcome form in the ward sheet.</div>;
  const f = sheet.welcomeForm;
  const lastTalk = sheet.lastTalk || sheet.talks[0]?.date || '';
  const lastPrayer = sheet.lastPrayer || sheet.prayers[0]?.date || '';
  const prayers = allPrayers ? sheet.prayers : sheet.prayers.slice(0, PRAYERS_SHOWN);
  const never = <span class="sh2-muted">Not on record</span>;
  return (
    <>
      <section class="sh2-section">
        <div class="sh2-section-head"><span class="sh2-section-title">Sacrament meeting</span></div>
        <div class="sh2-group">
          <Labeled label="Last talk" date={lastTalk}>{lastTalk ? lastTalkedLabel(lastTalk) : never}</Labeled>
          <Labeled label="Last prayer" date={lastPrayer}>{lastPrayer ? lastTalkedLabel(lastPrayer) : never}</Labeled>
        </div>
      </section>
      {sheet.upcoming.length > 0 && (
        <section class="sh2-section">
          <div class="sh2-section-head"><span class="sh2-section-title">Coming up</span></div>
          <div class="sh2-group"><EventRows events={sheet.upcoming} fallback="Assignment" /></div>
        </section>
      )}
      {sheet.talks.length > 0 && (
        <section class="sh2-section">
          <div class="sh2-section-head">
            <span class="sh2-section-title">Talks</span>
            <span class="sh2-tally">{sheet.talks.length}</span>
          </div>
          <div class="sh2-group"><EventRows events={sheet.talks} fallback="Talk" /></div>
        </section>
      )}
      {sheet.prayers.length > 0 && (
        <section class="sh2-section">
          <div class="sh2-section-head">
            <span class="sh2-section-title">Prayers</span>
            <span class="sh2-tally">{sheet.prayers.length}</span>
            {sheet.prayers.length > PRAYERS_SHOWN && (
              <button type="button" class="sh2-link" onClick={() => setAllPrayers(!allPrayers)}>
                {allPrayers ? 'Show fewer' : 'Show all'}
              </button>
            )}
          </div>
          <div class="sh2-group"><EventRows events={prayers} fallback="Prayer" /></div>
        </section>
      )}
      {f && (
        <section class="sh2-section">
          <div class="sh2-section-head">
            <span class="sh2-section-title">Welcome form</span>
            {f.submitted && <span class="sh2-tally">{shortDate(f.submitted)}</span>}
          </div>
          <div class="sh2-group">
            {f.acceptCalling && <Labeled label="Would accept a calling">{f.acceptCalling}</Labeled>}
            {f.teach && <Labeled label="Teaching">{f.teach}</Labeled>}
            {f.music && <Labeled label="Music">{f.music}</Labeled>}
            {f.pastCallings && <Labeled label="Past callings">{f.pastCallings}</Labeled>}
            {f.hobbies && <Labeled label="Hobbies">{f.hobbies}</Labeled>}
            {f.situation && <Folded label="Situation" text={f.situation} />}
            {f.forBishopric && <Folded label="For the bishopric" text={f.forBishopric} />}
          </div>
        </section>
      )}
    </>
  );
}

function WardTab({ m, people, sheet, act }: { m: MemberState; people: PanelPeople; sheet: MemberSheet | null; act: PanelActions }) {
  const callings = callingList(m.calling);
  return (
    <div class="sh2-tab">
      <div class="sh2-group">
        <Labeled label="Calling" date={m.callingSince}>{callings.length ? callings.join(' · ') : <span class="sh2-muted">None</span>}</Labeled>
        <People label="Housemates" people={people.housemates} act={act} />
        <People label="Ministered by" people={people.ministeredBy} act={act} />
        <People label="Ministers to" people={people.ministersTo} act={act} />
        {m.movedIn && <Labeled label="Moved in">{shortDate(m.movedIn)}{m.priorUnit ? ` from ${m.priorUnit}` : ''}</Labeled>}
      </div>
      <div class="sh2-group">
        {m.phone && <Labeled label="Phone">{m.phone}</Labeled>}
        {m.email && <Labeled label="Email">{m.email}</Labeled>}
        {m.address && <Labeled label="Address">{m.address}</Labeled>}
      </div>
      <SheetSections sheet={sheet} />
    </div>
  );
}

export function MemberPanel({ app, component, member, photoUrl, people, sheet, tab, onTab, act }: {
  app: App; component: Component; member: MemberState; photoUrl: string | null;
  people: PanelPeople; sheet: MemberSheet | null; tab: Tab; onTab: (t: Tab) => void; act: PanelActions;
}) {
  return (
    <div class="sh2">
      <Header m={member} photoUrl={photoUrl} act={act} />
      <div class="sh2-body">
        <Threads tasks={member.tasks} act={act} />
        <Segmented tab={tab} onTab={onTab} />
        {tab === 'facts' && <FactsTab m={member} act={act} />}
        {tab === 'private' && <PrivateTab app={app} component={component} m={member} act={act} />}
        {tab === 'ward' && <WardTab key={member.file.path} m={member} people={people} sheet={sheet} act={act} />}
      </div>
    </div>
  );
}
