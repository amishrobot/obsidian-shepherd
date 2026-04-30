import { h } from 'preact';
import { MemberState, Priority, MemberStatus, PastoralState, Ordinance, Recommend, PRIORITY_COLORS } from '../models/types';
import { ContactBar } from './ContactBar';
import { PriorityPill } from './PriorityPill';
import { StatusPill } from './StatusPill';
import { PastoralStatePill } from './PastoralStatePill';
import { OrdinancePill } from './OrdinancePill';
import { RecommendPill } from './RecommendPill';
import { LastContactBadge } from './LastContactBadge';
import { MemberInfo } from './MemberInfo';
import { TaskList } from './TaskList';
import { QuickLog } from './QuickLog';
import { InteractionList } from './InteractionList';

interface Props {
  member: MemberState;
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

export function ShepherdPanel({
  member: m,
  onPriorityChange,
  onStatusChange,
  onPastoralStateChange,
  onOrdinanceChange,
  onRecommendChange,
  onMarkContacted,
  onToggleTask,
  onAddTask,
  onLogInteraction,
}: Props) {
  const details: string[] = [];
  if (m.age) details.push(`${m.age}${m.gender}`);
  if (m.calling) details.push(m.calling);

  return (
    <div class="shepherd-panel">
      {/* Header */}
      <div
        class="shepherd-header"
        style={{ borderLeft: `4px solid ${PRIORITY_COLORS[m.priority]}` }}
      >
        <div class="shepherd-name">{m.name}</div>
        {details.length > 0 && (
          <div class="shepherd-details">{details.join(' · ')}</div>
        )}
        {m.address && (
          <div class="shepherd-address">📍 {m.address}</div>
        )}
        {m.whereTheyAre && (
          <div class="shepherd-where">{m.whereTheyAre}</div>
        )}
      </div>

      {/* Contact */}
      <ContactBar phone={m.phone} email={m.email} />

      {/* Controls */}
      <div class="shepherd-controls">
        <PriorityPill current={m.priority} onChange={onPriorityChange} />
        <StatusPill current={m.status} onChange={onStatusChange} />
        <PastoralStatePill current={m.pastoralState} onChange={onPastoralStateChange} />
        <OrdinancePill current={m.nextOrdinance} gender={m.gender} onChange={onOrdinanceChange} />
        <RecommendPill current={m.recommend} onChange={onRecommendChange} />
        <LastContactBadge
          lastContact={m.lastContact}
          daysSince={m.daysSinceContact}
          isOverdue={m.isOverdue}
          onMarkContacted={onMarkContacted}
        />
      </div>

      {/* Member Info */}
      <MemberInfo
        priesthood={m.priesthood}
        gender={m.gender}
        ministeringBrothers={m.ministeringBrothers}
        ministeringSisters={m.ministeringSisters}
        patriarchalBlessing={m.patriarchalBlessing}
        tags={m.tags}
      />

      {/* Tasks */}
      <TaskList
        tasks={m.tasks}
        onToggle={onToggleTask}
        onAdd={onAddTask}
      />

      {/* Quick Log */}
      <QuickLog onLog={onLogInteraction} />

      {/* Interactions */}
      <InteractionList interactions={m.interactions} />
    </div>
  );
}
