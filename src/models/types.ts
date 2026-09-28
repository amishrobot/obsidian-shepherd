import type { TFile } from 'obsidian';

export type Priority = 'top-10' | 'high' | 'normal' | 'new-move-in';
export type MemberStatus = 'new' | 'active' | 'inactive';
export type PastoralState = '' | 'working-with' | 'under-restrictions' | 'non-responsive' | 'resolved' | 'getting-married' | 'preparing-for-baptism';
export type Ordinance = 'unknown' | 'baptism' | 'confirmation'
  | 'aaronic-priesthood' | 'melchizedek-priesthood'
  | 'endowment' | 'sealing';
export type Recommend = 'current' | 'expiring' | 'expired' | 'none' | 'unknown';
export type PriesthoodOffice = 'none' | 'deacon' | 'teacher' | 'priest' | 'elder' | 'high-priest';

export const PRIORITIES: Priority[] = ['top-10', 'high', 'normal', 'new-move-in'];
export const STATUSES: MemberStatus[] = ['new', 'active', 'inactive'];
export const PASTORAL_STATES: PastoralState[] = ['', 'working-with', 'under-restrictions', 'non-responsive', 'resolved', 'getting-married', 'preparing-for-baptism'];
export const ORDINANCES: (Ordinance & string)[] = [
  'unknown', 'baptism', 'confirmation', 'aaronic-priesthood',
  'melchizedek-priesthood', 'endowment', 'sealing',
];
export const RECOMMENDS: (Recommend & string)[] = [
  'current', 'expiring', 'expired', 'none', 'unknown',
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
  ministeredBy: string[];
  ministersTo: string[];
  patriarchalBlessing: boolean;
  calling: string;
  lastContact: string;
  convertDate: string;
  movedIn: string;
  tags: string[];
  daysSinceContact: number | null;
  isOverdue: boolean;
  tasks: Task[];
  interactions: Interaction[];
  whereTheyAre: string;
}

export interface RelationshipPerson {
  name: string;
  file: TFile | null;
}

export interface ShepherdSettings {
  memberDir: string;
  dashboardPath: string;
  overdueThreshold: number;
  showContactBar: boolean;
}

export const DEFAULT_SETTINGS: ShepherdSettings = {
  memberDir: 'Church/Members',
  dashboardPath: 'Church/_system/views/_dashboard.md',
  overdueThreshold: 14,
  showContactBar: true,
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  'top-10': '#ef4444',
  'high': '#eab308',
  'normal': '#6b7280',
  'new-move-in': '#3b82f6',
};

export const STATUS_COLORS: Record<MemberStatus, string> = {
  'new': '#3b82f6',
  'active': '#22c55e',
  'inactive': '#ef4444',
};

export const PASTORAL_STATE_COLORS: Record<Exclude<PastoralState, ''>, string> = {
  'working-with': '#eab308',
  'under-restrictions': '#dc2626',
  'non-responsive': '#6b7280',
  'resolved': '#22c55e',
  'getting-married': '#ec4899',
  'preparing-for-baptism': '#3b82f6',
};

export const RECOMMEND_ACTIONABLE: Recommend[] = ['current', 'expiring', 'expired'];
