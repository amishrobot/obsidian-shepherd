import { h } from 'preact';
import { Interaction } from '../models/types';

interface Props {
  interactions: Interaction[];
}

export function InteractionList({ interactions }: Props) {
  if (interactions.length === 0) return null;

  return (
    <div class="shepherd-section">
      <div class="shepherd-section-header">Recent Interactions</div>
      {interactions.slice(0, 5).map((ix, i) => (
        <div key={i} class="shepherd-interaction">
          <span class="shepherd-interaction-date">{ix.date || 'Undated'}</span>
          <span class="shepherd-interaction-preview">{(ix.preview || ix.title).substring(0, 200)}</span>
        </div>
      ))}
      {interactions.length > 5 && (
        <div class="shepherd-empty-text">{interactions.length - 5} more in file</div>
      )}
    </div>
  );
}
