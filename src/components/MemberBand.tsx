import { h } from 'preact';
import { MemberState } from '../models/types';
import { formatLastContact } from '../services/helpers';

// Read-only status band drawn above a member note's text. It shows the four
// facts scanned for most (recommend, next ordinance, calling, last contact)
// plus priority and pastoral state when they are set. Editing stays in the
// side panel; the band replaces the agent-written [!member-card] callout,
// which copied the same frontmatter into prose and drifted from it.

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

export function MemberBand({ member, onPick }: {
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
      <Cell label="Calling">
        {calling ? <span class="shepherd-band-text" title={member.calling}>{calling}</span> : <span class="shepherd-band-none">None</span>}
      </Cell>
      <Cell label="Last contact" field="contact" onPick={onPick}>
        <span class={contact === 'never' ? 'shepherd-band-none' : ''}>{contact === 'never' ? 'Never logged' : contact}</span>
      </Cell>
      <Cell label="Flags" field="flags" onPick={onPick}>
        {pri.tone && <span class={`shepherd-band-pill is-${pri.tone}`}>{pri.label}</span>}
        {member.pastoralState && <span class="shepherd-band-pill is-info">{member.pastoralState.replace(/-/g, ' ')}</span>}
        {!pri.tone && !member.pastoralState && <span class="shepherd-band-none">None</span>}
      </Cell>
    </div>
  );
}
