import { h } from 'preact';
import { Recommend, RECOMMENDS } from '../models/types';

interface Props {
  current: Recommend;
  onChange: (r: Recommend) => void;
}

const COLORS: Record<string, string> = {
  'current': '#22c55e',
  'expired': '#ef4444',
  'none': '#6b7280',
  'unknown': '#6b7280',
};

export function RecommendPill({ current, onChange }: Props) {
  return (
    <div class="shepherd-pill-row">
      <span class="shepherd-pill-label">Recommend</span>
      <div class="shepherd-pills">
        {RECOMMENDS.map((r) => (
          <span
            key={r}
            class={`shepherd-pill ${r === current ? 'shepherd-pill-active' : ''}`}
            style={r === current ? { background: COLORS[r], color: '#fff' } : {}}
            onClick={() => onChange(r)}
          >
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}
