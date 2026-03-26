import { h } from 'preact';
import { Ordinance, ORDINANCES } from '../models/types';

interface Props {
  current: Ordinance;
  onChange: (o: Ordinance) => void;
}

const LABELS: Record<string, string> = {
  'unknown': 'unknown',
  'baptism': 'baptism',
  'confirmation': 'confirmation',
  'aaronic-priesthood': 'aaronic',
  'melchizedek-priesthood': 'melchizedek',
  'endowment': 'endowment',
  'sealing': 'sealing',
};

export function OrdinancePill({ current, onChange }: Props) {
  return (
    <div class="shepherd-pill-row">
      <span class="shepherd-pill-label">Next Ordinance</span>
      <div class="shepherd-pills shepherd-pills-wrap">
        {ORDINANCES.map((o) => (
          <span
            key={o}
            class={`shepherd-pill ${o === current ? 'shepherd-pill-active' : ''}`}
            style={o === current ? { background: '#58a6ff', color: '#fff' } : {}}
            onClick={() => onChange(o)}
          >
            {LABELS[o] || o}
          </span>
        ))}
      </div>
    </div>
  );
}
