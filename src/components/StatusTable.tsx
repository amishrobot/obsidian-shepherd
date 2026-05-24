import { h, JSX } from 'preact';
import {
  Priority, MemberStatus, PastoralState, Ordinance, Recommend,
  PRIORITIES, STATUSES, PASTORAL_STATES, ORDINANCES, RECOMMEND_ACTIONABLE,
} from '../models/types';

interface Props {
  priority: Priority;
  status: MemberStatus | string;
  pastoral: PastoralState | string;
  nextOrdinance: Ordinance;
  recommend: Recommend;
  onPriorityChange: (p: Priority) => void;
  onStatusChange: (s: MemberStatus) => void;
  onPastoralChange: (s: PastoralState) => void;
  onOrdinanceChange: (o: Ordinance) => void;
  onRecommendChange: (r: Recommend) => void;
}

function Segmented<T extends string>({ options, current, onChange, variant }: {
  options: T[]; current: string; onChange: (v: T) => void; variant?: 'warn' | 'danger';
}) {
  return (
    <div class={`shepherd-seg${variant ? ' shepherd-seg-' + variant : ''}`}>
      {options.map((opt) => (
        <button
          class={`shepherd-seg-btn${current === opt ? ' is-on' : ''}`}
          onClick={() => onChange(opt)}
        >{opt}</button>
      ))}
    </div>
  );
}

function Dropdown({ options, current, onChange, labels }: {
  options: string[]; current: string; onChange: (v: string) => void;
  labels?: Record<string, string>;
}) {
  const handleChange = (e: JSX.TargetedEvent<HTMLSelectElement>) => {
    onChange((e.target as HTMLSelectElement).value);
  };
  return (
    <select class="shepherd-dropdown" value={current} onChange={handleChange}>
      {options.map((opt) => (
        <option value={opt}>{labels?.[opt] ?? opt}</option>
      ))}
    </select>
  );
}

const ORDINANCE_LABELS: Record<Ordinance, string> = {
  'unknown': 'Unknown',
  'baptism': 'Baptism',
  'confirmation': 'Confirmation',
  'aaronic-priesthood': 'Aaronic Priesthood',
  'melchizedek-priesthood': 'Melchizedek Priesthood',
  'endowment': 'Endowment',
  'sealing': 'Sealing',
};

const PASTORAL_LABELS: Record<string, string> = {
  '': 'none',
  'working-with': 'working with',
  'under-restrictions': 'under restrictions',
  'non-responsive': 'non-responsive',
  'resolved': 'resolved',
};

export function StatusTable(p: Props) {
  const pastoralVariant: 'warn' | 'danger' | undefined =
    p.pastoral === 'working-with' ? 'warn' :
    p.pastoral === 'under-restrictions' ? 'danger' :
    undefined;
  const recommendVariant: 'danger' | undefined =
    p.recommend === 'expired' ? 'danger' : undefined;

  return (
    <div class="shepherd-status">
      <div class="shepherd-section-label">Status</div>
      <div class="shepherd-row">
        <div class="shepherd-row-label">Priority</div>
        <Segmented options={PRIORITIES} current={p.priority} onChange={p.onPriorityChange} />
      </div>
      <div class="shepherd-row">
        <div class="shepherd-row-label">Presence</div>
        <Segmented options={STATUSES} current={p.status} onChange={p.onStatusChange as (v: string) => void} />
      </div>
      <div class="shepherd-row">
        <div class="shepherd-row-label">Pastoral</div>
        <div class={`shepherd-dd-wrap${pastoralVariant ? ' shepherd-dd-' + pastoralVariant : ''}`}>
          <Dropdown
            options={PASTORAL_STATES as string[]}
            current={p.pastoral}
            onChange={p.onPastoralChange as (v: string) => void}
            labels={PASTORAL_LABELS}
          />
        </div>
      </div>
      <div class="shepherd-row">
        <div class="shepherd-row-label">Next ord.</div>
        <Dropdown
          options={ORDINANCES as string[]}
          current={p.nextOrdinance}
          onChange={p.onOrdinanceChange as (v: string) => void}
          labels={ORDINANCE_LABELS}
        />
      </div>
      <div class="shepherd-row">
        <div class="shepherd-row-label">Recommend</div>
        <Segmented
          options={RECOMMEND_ACTIONABLE}
          current={p.recommend}
          onChange={p.onRecommendChange}
          variant={recommendVariant}
        />
      </div>
    </div>
  );
}
