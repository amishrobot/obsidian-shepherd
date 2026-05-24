import { h } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { formatLastContact } from '../services/helpers';

interface Props {
  lastContact: string;
  onMarkContacted: () => void;
  onLogInteraction: (note: string) => void;
  expandSignal: number;
}

export function LogInteractionCTA({ lastContact, onMarkContacted, onLogInteraction, expandSignal }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formatted = formatLastContact(lastContact || null);

  useEffect(() => {
    if (expandSignal > 0) {
      setExpanded(true);
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }, [expandSignal]);

  const submit = () => {
    const trimmed = note.trim();
    if (trimmed) {
      onLogInteraction(trimmed);
    } else {
      onMarkContacted();
    }
    setNote('');
    setExpanded(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    } else if (e.key === 'Escape') {
      setExpanded(false);
      setNote('');
    }
  };

  return (
    <div class="shepherd-cta-wrap">
      <div class={`shepherd-last-contact${formatted === 'never' ? ' is-never' : ''}`}>
        Last contact · {formatted}
      </div>
      {expanded ? (
        <div class="shepherd-cta-expanded">
          <textarea
            ref={textareaRef}
            class="shepherd-cta-textarea"
            placeholder="Add a note (or press Enter alone to just mark contacted)"
            value={note}
            onInput={(e) => setNote((e.target as HTMLTextAreaElement).value)}
            onKeyDown={handleKeyDown}
            rows={3}
          />
          <div class="shepherd-cta-actions">
            <button class="shepherd-cta-cancel" onClick={() => { setExpanded(false); setNote(''); }}>Cancel</button>
            <button class="shepherd-cta-submit" onClick={submit}>
              {note.trim() ? 'Log Interaction' : 'Mark Contacted'}
            </button>
          </div>
        </div>
      ) : (
        <button class="shepherd-cta-btn" onClick={() => setExpanded(true)}>
          <span class="shepherd-cta-label">📝 Log Interaction</span>
          <span class="shepherd-cta-kbd">⌘⇧L</span>
        </button>
      )}
    </div>
  );
}
