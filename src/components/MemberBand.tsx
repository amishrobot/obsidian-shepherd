import { h } from 'preact';
import { Platform, TFile } from 'obsidian';
import { MemberState, RelationshipPerson } from '../models/types';
import { buildMapsUrl, formatLastContact, parseCity } from '../services/helpers';

// The member band: everything Shepherd shows about a member, drawn above the
// note's text so the side panel isn't needed. Top row: photo, who they are,
// contact links, Log interaction and a "…" menu (presence, check-in). Middle
// row: status cells, each a menu. Bottom row: ministering and housemates.
// On desktop it replaces the generated [!member-card] callout, which stays in
// the file for places the plugin doesn't run (mobile).

export type BandAction = 'log' | 'more';

export interface BandPeople {
  ministeredBy: RelationshipPerson[];
  ministersTo: RelationshipPerson[];
  housemates: RelationshipPerson[];
}

function People({ label, people, onOpen, max = 4 }: {
  label: string; people: RelationshipPerson[]; onOpen: (f: TFile) => void; max?: number;
}) {
  if (!people.length) return null;
  const shown = people.slice(0, max);
  return (
    <span class="shepherd-band-people-group">
      <span class="shepherd-band-people-label">{label}</span>{' '}
      {shown.map((p, i) => (
        <span>
          {p.file
            ? <a class="shepherd-band-person" onClick={() => onOpen(p.file as TFile)}>{p.name}</a>
            : <span>{p.name}</span>}
          {i < shown.length - 1 ? ', ' : ''}
        </span>
      ))}
      {people.length > max && <span class="shepherd-band-sub"> +{people.length - max}</span>}
    </span>
  );
}

function TopRow({ member, photoUrl, onAction }: {
  member: MemberState; photoUrl: string | null; onAction?: (a: BandAction, e: MouseEvent) => void;
}) {
  const bits: string[] = [];
  if (member.age != null) bits.push(String(member.age));
  if (member.priesthood && member.priesthood !== 'none') bits.push(member.priesthood.replace(/-/g, ' '));
  // Short form so the line never truncates: "since Jul 2026".
  const since = monthYear(member.movedIn);
  if (since) bits.push(`since ${since}`);
  const digits = (member.phone || '').replace(/\D/g, '');
  const city = parseCity(member.address);
  const maps = member.address ? buildMapsUrl(member.address, Platform.isMacOS || Platform.isIosApp) : '';
  return (
    <div class="shepherd-band-top">
      {photoUrl
        ? <img class="shepherd-band-avatar" src={photoUrl} alt="" />
        : <div class="shepherd-band-avatar is-empty" />}
      <div class="shepherd-band-who">{bits.join(' · ')}</div>
      <div class="shepherd-band-actions">
        {digits && <a class="shepherd-band-link" href={`tel:${digits}`}>Call</a>}
        {digits && <a class="shepherd-band-link" href={`sms:${digits}`}>Text</a>}
        {member.email && <a class="shepherd-band-link" href={`mailto:${member.email}`}>Email</a>}
        {city && <a class="shepherd-band-link" href={maps} target="_blank" title={member.address}>{city}</a>}
        {onAction && <button type="button" class="shepherd-band-btn mod-cta" onClick={(e) => onAction('log', e as unknown as MouseEvent)}>Log interaction</button>}
        {onAction && <button type="button" class="shepherd-band-btn" aria-label="Presence and check-in" title="Presence and check-in" onClick={(e) => onAction('more', e as unknown as MouseEvent)}>⋯</button>}
      </div>
    </div>
  );
}

const ORDINANCE: Record<string, string> = {
  unknown: 'Unknown', baptism: 'Baptism', confirmation: 'Confirmation',
  'aaronic-priesthood': 'Aaronic Priesthood', 'melchizedek-priesthood': 'Melchizedek Priesthood',
  endowment: 'Endowment', sealing: 'Sealing',
};

const RECOMMEND: Record<string, { label: string; tone: string }> = {
  current: { label: 'Current', tone: 'ok' },
  expiring: { label: 'Expiring', tone: 'warn' },
  expired: { label: 'Expired', tone: 'danger' },
  none: { label: 'None', tone: 'muted' },
  unknown: { label: 'Unknown', tone: 'muted' },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function monthYear(iso: string): string {
  const m = /^(\d{4})-(\d{2})/.exec(iso || '');
  if (!m) return '';
  const mi = parseInt(m[2], 10) - 1;
  return mi >= 0 && mi < 12 ? `${MONTHS[mi]} ${m[1]}` : '';
}

// "Temple Worker (Temple Workers) / Bishopric Second Counselor (Bishopric)"
// → "Temple Worker · Bishopric Second Counselor"
export function callingNames(raw: string): string {
  return (raw || '')
    .split('/')
    .map((c) => c.replace(/\s*\([^)]*\)\s*$/, '').trim())
    .filter(Boolean)
    .join(' · ');
}

export type BandField = 'recommend' | 'ordinance' | 'flags' | 'contact';

const PRIORITY: Record<string, { label: string; tone: string }> = {
  'top-10': { label: 'Top 10', tone: 'warn' },
  high: { label: 'High', tone: 'warn' },
  normal: { label: 'Normal', tone: '' },
  'new-move-in': { label: 'New move-in', tone: 'info' },
};

function Cell({ label, field, onPick, children }: {
  label: string; field?: BandField; onPick?: (f: BandField, e: MouseEvent) => void; children: any;
}) {
  const inner = (
    <div>
      <div class="shepherd-band-label">{label}</div>
      <div class="shepherd-band-value">{children}</div>
    </div>
  );
  if (!field || !onPick) return <div class="shepherd-band-cell">{inner}</div>;
  return (
    <button
      type="button"
      class="shepherd-band-cell is-editable"
      aria-label={`Change ${label.toLowerCase()}`}
      onClick={(e) => onPick(field, e as unknown as MouseEvent)}
    >{inner}</button>
  );
}

export function MemberBand({ member, onPick, onAction, onOpen, photoUrl = null, people }: {
  member: MemberState;
  onPick?: (f: BandField, e: MouseEvent) => void;
  onAction?: (a: BandAction, e: MouseEvent) => void;
  onOpen?: (f: TFile) => void;
  photoUrl?: string | null;
  people?: BandPeople;
}) {
  const open = onOpen ?? (() => {});
  const hasPeople = !!people && (people.ministeredBy.length + people.ministersTo.length + people.housemates.length) > 0;
  return (
    <div class="shepherd-band-wrap">
      <TopRow member={member} photoUrl={photoUrl} onAction={onAction} />
      <StatusCells member={member} onPick={onPick} />
      {hasPeople && (
        <div class="shepherd-band-people">
          <People label="Ministered by" people={people!.ministeredBy} onOpen={open} />
          <People label="Ministers to" people={people!.ministersTo} onOpen={open} max={3} />
          <People label="Housemates" people={people!.housemates} onOpen={open} />
        </div>
      )}
    </div>
  );
}

function StatusCells({ member, onPick }: {
  member: MemberState; onPick?: (f: BandField, e: MouseEvent) => void;
}) {
  const rec = RECOMMEND[member.recommend] ?? RECOMMEND.unknown;
  const exp = monthYear(member.recommendExp);
  const calling = callingNames(member.calling);
  const contact = formatLastContact(member.lastContact || null);
  const pri = PRIORITY[member.priority] ?? PRIORITY.normal;

  return (
    <div class="shepherd-band-inner">
      <Cell label="Recommend" field="recommend" onPick={onPick}>
        <span class={`shepherd-band-pill is-${rec.tone}`}>{rec.label}</span>
        {exp && member.recommend !== 'none' && <span class="shepherd-band-sub">{member.recommend === 'expired' ? 'since' : 'until'} {exp}</span>}
      </Cell>
      <Cell label="Next ordinance" field="ordinance" onPick={onPick}>{ORDINANCE[member.nextOrdinance] ?? '—'}</Cell>
      <Cell label="Last contact" field="contact" onPick={onPick}>
        <span class={contact === 'never' ? 'shepherd-band-none' : ''}>{contact === 'never' ? 'Never logged' : contact}</span>
      </Cell>
      <Cell label="Flags" field="flags" onPick={onPick}>
        {pri.tone && <span class={`shepherd-band-pill is-${pri.tone}`}>{pri.label}</span>}
        {member.pastoralState && <span class="shepherd-band-pill is-info">{member.pastoralState.replace(/-/g, ' ')}</span>}
        {!pri.tone && !member.pastoralState && <span class="shepherd-band-none">None</span>}
      </Cell>
      <div class="shepherd-band-cell is-calling" title={member.calling || undefined}>
        <div class="shepherd-band-label">Calling</div>
        <div class="shepherd-band-value">
          {calling ? <span class="shepherd-band-text">{calling}</span> : <span class="shepherd-band-none">None</span>}
        </div>
      </div>
    </div>
  );
}
