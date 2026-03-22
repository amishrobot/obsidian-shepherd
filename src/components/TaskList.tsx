import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Task } from '../models/types';

interface Props {
  tasks: Task[];
  onToggle: (taskLine: number) => void;
  onAdd: (text: string) => void;
}

export function TaskList({ tasks, onToggle, onAdd }: Props) {
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState('');

  const handleAdd = () => {
    const text = newText.trim();
    if (text) {
      onAdd(text);
      setNewText('');
      setAdding(false);
    }
  };

  return (
    <div class="shepherd-section">
      <div class="shepherd-section-header">Next Steps</div>
      {tasks.length === 0 && !adding && (
        <div class="shepherd-empty-text">No open tasks</div>
      )}
      {tasks.map((t) => (
        <div
          key={t.line}
          class={`shepherd-task ${t.completed ? 'shepherd-task-done' : ''}`}
          onClick={() => onToggle(t.line)}
        >
          <span class="shepherd-task-check">{t.completed ? '☑' : '☐'}</span>
          <span class="shepherd-task-text">{t.text}</span>
        </div>
      ))}
      {adding ? (
        <div class="shepherd-task-add-row">
          <input
            type="text"
            class="shepherd-task-input"
            placeholder="New step..."
            value={newText}
            onInput={(e) => setNewText((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') { setAdding(false); setNewText(''); }
            }}
          />
          <span class="shepherd-pill shepherd-pill-active" onClick={handleAdd}>Add</span>
        </div>
      ) : (
        <span class="shepherd-add-btn" onClick={() => setAdding(true)}>+ Add step</span>
      )}
    </div>
  );
}
