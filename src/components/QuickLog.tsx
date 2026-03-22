import { h } from 'preact';
import { useState } from 'preact/hooks';

interface Props {
  onLog: (note: string) => void;
}

export function QuickLog({ onLog }: Props) {
  const [text, setText] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSave = () => {
    const note = text.trim();
    if (note) {
      onLog(note);
      setText('');
      setExpanded(false);
    }
  };

  if (!expanded) {
    return (
      <div class="shepherd-section">
        <span class="shepherd-add-btn" onClick={() => setExpanded(true)}>+ Log interaction</span>
      </div>
    );
  }

  return (
    <div class="shepherd-section">
      <div class="shepherd-section-header">Quick Log</div>
      <textarea
        class="shepherd-log-input"
        placeholder="Brief note about this interaction..."
        value={text}
        onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
        rows={3}
      />
      <div class="shepherd-log-actions">
        <span class="shepherd-pill shepherd-pill-active" style={{ background: '#22c55e' }} onClick={handleSave}>
          Save
        </span>
        <span class="shepherd-pill" onClick={() => { setExpanded(false); setText(''); }}>
          Cancel
        </span>
      </div>
    </div>
  );
}
