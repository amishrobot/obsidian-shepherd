import { h } from 'preact';
import { PastoralState, PASTORAL_STATES, PASTORAL_STATE_COLORS } from '../models/types';

interface Props {
  current: PastoralState;
  onChange: (s: PastoralState) => void;
}

const LABELS: Record<PastoralState, string> = {
  '': 'none',
  'working-with': 'working with',
  'under-restrictions': 'restrictions',
};

export function PastoralStatePill({ current, onChange }: Props) {
  return (
    <div class="shepherd-pill-row">
      <span class="shepherd-pill-label">Pastoral</span>
      <div class="shepherd-pills shepherd-pills-wrap">
        {PASTORAL_STATES.map((s) => {
          const active = s === current;
          const bg = s !== '' ? PASTORAL_STATE_COLORS[s] : '#6b7280';
          return (
            <span
              key={s || 'none'}
              class={`shepherd-pill ${active ? 'shepherd-pill-active' : ''}`}
              style={active ? { background: bg, color: '#fff' } : {}}
              onClick={() => onChange(s)}
            >
              {LABELS[s]}
            </span>
          );
        })}
      </div>
    </div>
  );
}
