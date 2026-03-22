import { h } from 'preact';

interface Props {
  lastContact: string;
  daysSince: number | null;
  isOverdue: boolean;
  onMarkContacted: () => void;
}

export function LastContactBadge({ lastContact, daysSince, isOverdue, onMarkContacted }: Props) {
  let display: string;
  if (daysSince === null) {
    display = 'No contact recorded';
  } else if (daysSince === 0) {
    display = 'Today';
  } else if (daysSince === 1) {
    display = 'Yesterday';
  } else {
    display = `${daysSince} days ago`;
  }

  return (
    <div class="shepherd-last-contact">
      <div class="shepherd-last-contact-row">
        <span class="shepherd-pill-label">Last Contact</span>
        <span class={`shepherd-last-contact-value ${isOverdue ? 'shepherd-overdue' : ''}`}>
          {display}
        </span>
      </div>
      <span class="shepherd-contact-today-btn" onClick={onMarkContacted}>
        📝 Mark contacted today
      </span>
    </div>
  );
}
