import type { TFile } from 'obsidian';

export type Priority = 'top-5' | 'high' | 'normal';
export type MemberStatus = 'active' | 'new' | 'inactive' | 'moving';
export type PastoralState = '' | 'working-through' | 'under-restrictions';
export type Ordinance = 'unknown' | 'baptism' | 'confirmation'
  | 'aaronic-priesthood' | 'melchizedek-priesthood'
  | 'endowment' | 'sealing';
export type Recommend = 'current' | 'expired' | 'none' | 'unknown';
export type PriesthoodOffice = 'none' | 'deacon' | 'teacher' | 'priest' | 'elder' | 'high-priest';

export const PRIORITIES: Priority[] = ['top-5', 'high', 'normal'];
// 'new' is auto-assigned on import and not user-selectable in the picker.
export const STATUSES: MemberStatus[] = ['active', 'inactive', 'moving'];
export const PASTORAL_STATES: PastoralState[] = ['', 'working-through', 'under-restrictions'];
export const ORDINANCES: (Ordinance & string)[] = [
  'unknown', 'baptism', 'confirmation', 'aaronic-priesthood',
  'melchizedek-priesthood', 'endowment', 'sealing',
];
export const RECOMMENDS: (Recommend & string)[] = [
  'current', 'expired', 'none', 'unknown',
];

export interface Task {
  text: string;
  completed: boolean;
  line: number;
}

export interface Interaction {
  date: string;
  title: string;
  preview: string;
}

export interface MemberState {
  file: TFile;
  name: string;
  photo: string;
  phone: string;
  email: string;
  address: string;
  age: number | null;
  dob: string;
  gender: string;
  priority: Priority;
  status: MemberStatus;
  pastoralState: PastoralState;
  nextOrdinance: Ordinance;
  recommend: Recommend;
  recommendExp: string;
  endowed: boolean;
  priesthood: PriesthoodOffice;
  ministeringBrothers: string[];
  ministeringSisters: string[];
  patriarchalBlessing: boolean;
  calling: string;
  lastContact: string;
  convertDate: string;
  tags: string[];
  daysSinceContact: number | null;
  isOverdue: boolean;
  tasks: Task[];
  interactions: Interaction[];
  whereTheyAre: string;
}

export interface ShepherdSettings {
  memberDir: string;
  dashboardPath: string;
  overdueThreshold: number;
  showContactBar: boolean;
}

export const DEFAULT_SETTINGS: ShepherdSettings = {
  memberDir: 'Personal/Church/Members',
  dashboardPath: 'Personal/Church/_dashboard.md',
  overdueThreshold: 14,
  showContactBar: true,
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  'top-5': '#ef4444',
  'high': '#eab308',
  'normal': '#6b7280',
};

export const STATUS_COLORS: Record<MemberStatus, string> = {
  'active': '#22c55e',
  'new': '#3b82f6',
  'inactive': '#ef4444',
  'moving': '#6b7280',
};

export const PASTORAL_STATE_COLORS: Record<Exclude<PastoralState, ''>, string> = {
  'working-through': '#eab308',
  'under-restrictions': '#dc2626',
};
