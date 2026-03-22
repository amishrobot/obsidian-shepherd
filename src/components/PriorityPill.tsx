import { h } from 'preact';
import { Priority, PRIORITIES, PRIORITY_COLORS } from '../models/types';

interface Props {
  current: Priority;
  onChange: (p: Priority) => void;
}

export function PriorityPill({ current, onChange }: Props) {
  return (
    <div class="shepherd-pill-row">
      <span class="shepherd-pill-label">Priority</span>
      <div class="shepherd-pills">
        {PRIORITIES.map((p) => (
          <span
            key={p}
            class={`shepherd-pill ${p === current ? 'shepherd-pill-active' : ''}`}
            style={p === current ? { background: PRIORITY_COLORS[p], color: '#fff' } : {}}
            onClick={() => onChange(p)}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
