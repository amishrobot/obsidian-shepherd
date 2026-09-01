import { h } from 'preact';
import { App, TFile } from 'obsidian';
import { MemberState, Priority, MemberStatus, PastoralState, Ordinance, Recommend, RelationshipPerson } from '../models/types';
import { IdentityBlock } from './IdentityBlock';
import { ContactChips } from './ContactChips';
import { RelationshipChips } from './RelationshipChips';
import { LogInteractionCTA } from './LogInteractionCTA';
import { StatusTable } from './StatusTable';
import { TaskList } from './TaskList';

interface Props {
  app: App;
  member: MemberState;
  housemates: RelationshipPerson[];
  ministeredBy: RelationshipPerson[];
  ministersTo: RelationshipPerson[];
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
  onOpenPerson: (file: TFile) => void;
}

export function ShepherdPanel(p: Props) {
  const m = p.member;
  return (
    <div class="shepherd-panel">
      <IdentityBlock app={p.app} member={m} />
      <ContactChips phone={m.phone} email={m.email} address={m.address} />
      <RelationshipChips
        housemates={p.housemates}
        ministeredBy={p.ministeredBy}
        ministersTo={p.ministersTo}
        onOpenPerson={p.onOpenPerson}
      />
      {m.whereTheyAre && (
        <div class="shepherd-where">{m.whereTheyAre}</div>
      )}
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
        recommendExp={m.recommendExp}
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
