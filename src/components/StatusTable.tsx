import { h, Fragment, JSX } from 'preact';
import {
  Priority, MemberStatus, PastoralState, Ordinance, Recommend, CheckIn, CheckInStyle,
  PRIORITIES, STATUSES, PASTORAL_STATES, ORDINANCES, RECOMMEND_ACTIONABLE, CHECK_INS, CHECK_IN_STYLES,
} from '../models/types';

interface Props {
  priority: Priority;
  status: MemberStatus | string;
  pastoral: PastoralState | string;
  nextOrdinance: Ordinance;
  recommend: Recommend;
  recommendExp: string;
  checkIn: CheckIn;
  checkInStyle: CheckInStyle;
  gifPrompt: string;
  /** When the status band is drawing above the note, the band owns priority,
   *  pastoral state, next ordinance and recommend; the panel drops them. */
  bandOn?: boolean;
  onPriorityChange: (p: Priority) => void;
  onStatusChange: (s: MemberStatus) => void;
  onPastoralChange: (s: PastoralState) => void;
  onOrdinanceChange: (o: Ordinance) => void;
  onRecommendChange: (r: Recommend) => void;
  onCheckInChange: (c: CheckIn) => void;
  onCheckInStyleChange: (s: CheckInStyle) => void;
  onGifPromptChange: (prompt: string) => void;
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
  'dating-seriously': 'dating seriously',
  'getting-married': 'getting married',
  'preparing-for-baptism': 'preparing for baptism',
};

const CHECK_IN_STYLE_LABELS: Record<CheckInStyle, string> = {
  'gif': 'GIF',
  'quick-text': 'quick text',
  'encouragement': 'encouragement',
  'scripture': 'scripture / spiritual thought',
  'write-myself': "I'll write it",
};

export function StatusTable(p: Props) {
  const pastoralVariant: 'warn' | 'danger' | undefined =
    p.pastoral === 'working-with' ? 'warn' :
    p.pastoral === 'under-restrictions' ? 'danger' :
    undefined;
  const recommendVariant: 'warn' | 'danger' | undefined =
    p.recommend === 'expired' ? 'danger' :
    p.recommend === 'expiring' ? 'warn' :
    undefined;

  return (
    <div class="shepherd-status">
      <div class="shepherd-section-label">Status</div>
      {!p.bandOn && (
        <div class="shepherd-row">
          <div class="shepherd-row-label">Priority</div>
          <Segmented options={PRIORITIES} current={p.priority} onChange={p.onPriorityChange} />
        </div>
      )}
      <div class="shepherd-row">
        <div class="shepherd-row-label">Presence</div>
        <Segmented options={STATUSES} current={p.status} onChange={p.onStatusChange as (v: string) => void} />
      </div>
      {!p.bandOn && (
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
      )}
      <div class="shepherd-row">
        <div class="shepherd-row-label">Check-in</div>
        <Segmented options={CHECK_INS} current={p.checkIn} onChange={p.onCheckInChange} />
      </div>
      {p.checkIn !== 'none' && (
        <div class="shepherd-row">
          <div class="shepherd-row-label">Message</div>
          <Dropdown
            options={CHECK_IN_STYLES as string[]}
            current={p.checkInStyle}
            onChange={p.onCheckInStyleChange as (v: string) => void}
            labels={CHECK_IN_STYLE_LABELS}
          />
        </div>
      )}
      {p.checkIn !== 'none' && p.checkInStyle === 'gif' && (
        <div class="shepherd-row">
          <div class="shepherd-row-label">GIF prompt</div>
          <input
            key={p.gifPrompt}
            class="shepherd-dropdown shepherd-gif-prompt"
            type="text"
            placeholder="e.g. locked in, you got this"
            defaultValue={p.gifPrompt}
            onBlur={(e) => {
              const v = (e.target as HTMLInputElement).value;
              if (v.trim() !== p.gifPrompt) p.onGifPromptChange(v);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
          />
        </div>
      )}
      {!p.bandOn && (<>
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
        <div class="shepherd-recommend-wrap">
          <Segmented
            options={RECOMMEND_ACTIONABLE}
            current={p.recommend}
            onChange={p.onRecommendChange}
            variant={recommendVariant}
          />
          {p.recommendExp && (
            <span class={`shepherd-recommend-exp${p.recommend === 'expired' ? ' is-danger' : ''}`}>
              exp {p.recommendExp}
            </span>
          )}
        </div>
      </div>
      </>)}
    </div>
  );
}
