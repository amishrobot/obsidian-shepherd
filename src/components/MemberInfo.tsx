import { h } from 'preact';
import { PriesthoodOffice } from '../models/types';

interface Props {
  priesthood: PriesthoodOffice;
  gender: string;
  ministeringBrothers: string[];
  ministeringSisters: string[];
  patriarchalBlessing: boolean;
  tags: string[];
}

const PRIESTHOOD_LABELS: Record<string, string> = {
  'none': 'None',
  'deacon': 'Deacon',
  'teacher': 'Teacher',
  'priest': 'Priest',
  'elder': 'Elder',
  'high-priest': 'High Priest',
};

export function MemberInfo({ priesthood, gender, ministeringBrothers, ministeringSisters, patriarchalBlessing, tags }: Props) {
  const hasMinistering = ministeringBrothers.length > 0 || ministeringSisters.length > 0;
  const showPriesthood = gender === 'M';

  return (
    <div class="shepherd-section shepherd-info-section">
      <div class="shepherd-info-grid">
        {showPriesthood && (
          <div class="shepherd-info-row">
            <span class="shepherd-info-label">Priesthood</span>
            <span class={`shepherd-info-value ${priesthood === 'none' ? 'shepherd-info-dim' : ''}`}>
              {PRIESTHOOD_LABELS[priesthood] || priesthood}
            </span>
          </div>
        )}
        <div class="shepherd-info-row">
          <span class="shepherd-info-label">Pat. Blessing</span>
          <span class={`shepherd-info-value ${!patriarchalBlessing ? 'shepherd-info-dim' : ''}`}>
            {patriarchalBlessing ? 'Yes' : 'No'}
          </span>
        </div>
        {hasMinistering && (
          <div class="shepherd-info-row">
            <span class="shepherd-info-label">Ministering</span>
            <span class="shepherd-info-value">
              {[...ministeringBrothers, ...ministeringSisters].join(', ')}
            </span>
          </div>
        )}
      </div>
      {tags.length > 0 && (
        <div class="shepherd-tags">
          {tags.map((tag, i) => (
            <span key={i} class="shepherd-tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
