import { h } from 'preact';
import { MemberState, Priority, MemberStatus, PastoralState, Ordinance, Recommend } from '../models/types';
import { IdentityBlock } from './IdentityBlock';
import { ContactChips } from './ContactChips';
import { LogInteractionCTA } from './LogInteractionCTA';
import { StatusTable } from './StatusTable';
import { TaskList } from './TaskList';

interface Props {
  member: MemberState;
  expandLogSignal: number;
  onPriorityChange: (p: Priority) => void;
  onStatusChange: (s: MemberStatus) => void;
  onPastoralStateChange: (s: PastoralState) => void;
  onOrdinanceChange: (o: Ordinance) => void;
  onRecommendChange: (r: Recommend) => void;
  onMarkContacted: () => void;
  onToggleTask: (line: number) => void;
  onAddTask: (text: string) => void;
  onLogInteraction: (note: string) => void;
}

export function ShepherdPanel(p: Props) {
  const m = p.member;
  return (
    <div class="shepherd-panel">
      <IdentityBlock member={m} />
      <ContactChips phone={m.phone} email={m.email} address={m.address} />
      <LogInteractionCTA
        lastContact={m.lastContact}
        onMarkContacted={p.onMarkContacted}
        onLogInteraction={p.onLogInteraction}
        expandSignal={p.expandLogSignal}
      />
      <StatusTable
        priority={m.priority}
        status={m.status}
        pastoral={m.pastoralState}
        nextOrdinance={m.nextOrdinance}
        recommend={m.recommend}
        onPriorityChange={p.onPriorityChange}
        onStatusChange={p.onStatusChange}
        onPastoralChange={p.onPastoralStateChange}
        onOrdinanceChange={p.onOrdinanceChange}
        onRecommendChange={p.onRecommendChange}
      />
      <TaskList tasks={m.tasks} onToggle={p.onToggleTask} onAdd={p.onAddTask} />
    </div>
  );
}
