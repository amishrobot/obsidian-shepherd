import { h } from 'preact';
import type { TFile } from 'obsidian';
import { RelationshipPerson } from '../models/types';

interface Props {
  housemates: RelationshipPerson[];
  ministeredBy: RelationshipPerson[];
  ministersTo: RelationshipPerson[];
  onOpenPerson: (file: TFile) => void;
}

function ChipRow({ label, people, onOpenPerson }: {
  label: string; people: RelationshipPerson[]; onOpenPerson: (file: TFile) => void;
}) {
  if (people.length === 0) return null;
  return (
    <div class="shepherd-rel-row">
      <div class="shepherd-rel-label">{label}</div>
      <div class="shepherd-rel-chips">
        {people.map((person) => (
          person.file ? (
            <span
              class="shepherd-chip shepherd-chip-person"
              onClick={() => onOpenPerson(person.file as TFile)}
            >{person.name}</span>
          ) : (
            <span class="shepherd-chip shepherd-chip-inert">{person.name}</span>
          )
        ))}
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
