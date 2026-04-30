import { h } from 'preact';
import { Ordinance, ORDINANCES } from '../models/types';

interface Props {
  current: Ordinance;
  gender: string;
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

const PRIESTHOOD_ORDINANCES: Ordinance[] = ['aaronic-priesthood', 'melchizedek-priesthood'];

export function OrdinancePill({ current, gender, onChange }: Props) {
  const options = gender === 'M'
    ? ORDINANCES
    : ORDINANCES.filter((o) => !PRIESTHOOD_ORDINANCES.includes(o));

  return (
    <div class="shepherd-pill-row">
      <span class="shepherd-pill-label">Next Ordinance</span>
      <div class="shepherd-pills shepherd-pills-wrap">
        {options.map((o) => (
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
