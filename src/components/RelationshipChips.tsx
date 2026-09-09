import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Platform, type TFile } from 'obsidian';
import { RelationshipPerson } from '../models/types';

interface Props {
  housemates: RelationshipPerson[];
  ministeredBy: RelationshipPerson[];
  ministersTo: RelationshipPerson[];
  onOpenPerson: (file: TFile) => void;
}

/**
 * Design system 4a, rule M4: overflow trims content, not type. A ministering
 * list of six names does not get smaller chips on a phone — it shows the first
 * two and a "+4" that reveals the rest on tap.
 */
const COLLAPSE_AT = Platform.isMobile ? 2 : 4;

function ChipRow({ label, people, onOpenPerson }: {
  label: string; people: RelationshipPerson[]; onOpenPerson: (file: TFile) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (people.length === 0) return null;

  const collapsed = !expanded && people.length > COLLAPSE_AT;
  const shown = collapsed ? people.slice(0, COLLAPSE_AT) : people;
  const hidden = people.length - shown.length;

  return (
    <div class="shepherd-rel-row">
      <div class="shepherd-rel-label">{label}</div>
      <div class="shepherd-rel-chips">
        {shown.map((person) => (
          person.file ? (
            <span
              class="shepherd-chip shepherd-chip-person"
              onClick={() => onOpenPerson(person.file as TFile)}
            >{person.name}</span>
          ) : (
            <span class="shepherd-chip shepherd-chip-inert">{person.name}</span>
          )
        ))}
        {collapsed && (
          <span
            class="shepherd-chip shepherd-chip-more"
            onClick={() => setExpanded(true)}
          >+{hidden}</span>
        )}
      </div>
    </div>
  );
}

export function RelationshipChips({ housemates, ministeredBy, ministersTo, onOpenPerson }: Props) {
  if (housemates.length === 0 && ministeredBy.length === 0 && ministersTo.length === 0) {
    return null;
  }

  return (
    <div class="shepherd-relationships">
      <ChipRow label="Housemates" people={housemates} onOpenPerson={onOpenPerson} />
      <ChipRow label="Ministered by" people={ministeredBy} onOpenPerson={onOpenPerson} />
      <ChipRow label="Ministers to" people={ministersTo} onOpenPerson={onOpenPerson} />
    </div>
  );
}
