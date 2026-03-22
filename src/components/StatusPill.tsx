import { h } from 'preact';
import { MemberStatus, STATUSES, STATUS_COLORS } from '../models/types';

interface Props {
  current: MemberStatus;
  onChange: (s: MemberStatus) => void;
}

export function StatusPill({ current, onChange }: Props) {
  return (
    <div class="shepherd-pill-row">
      <span class="shepherd-pill-label">Status</span>
      <div class="shepherd-pills shepherd-pills-wrap">
        {STATUSES.map((s) => (
          <span
            key={s}
            class={`shepherd-pill ${s === current ? 'shepherd-pill-active' : ''}`}
            style={s === current ? { background: STATUS_COLORS[s] || '#6b7280', color: '#fff' } : {}}
            onClick={() => onChange(s)}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
