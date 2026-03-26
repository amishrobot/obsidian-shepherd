import type { TFile } from 'obsidian';

export type Priority = 'top-5' | 'urgent' | 'high' | 'normal' | 'low';
export type MemberStatus = 'active' | 'inactive' | 'fence' | 'occasional'
  | 'new' | 'returning' | 'moving' | 'attending-home-ward'
  | 'convert-baptism' | 'needs-outreach';
export type Ordinance = 'unknown' | 'baptism' | 'confirmation'
  | 'aaronic-priesthood' | 'melchizedek-priesthood'
  | 'endowment' | 'sealing';
export type Recommend = 'current' | 'expired' | 'none' | 'unknown';
export type PriesthoodOffice = 'none' | 'deacon' | 'teacher' | 'priest' | 'elder' | 'high-priest';

export const PRIORITIES: Priority[] = ['top-5', 'urgent', 'high', 'normal', 'low'];
export const STATUSES: MemberStatus[] = [
  'active', 'new', 'returning', 'occasional', 'fence',
  'inactive', 'moving', 'attending-home-ward', 'convert-baptism', 'needs-outreach',
];
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
  nextOrdinance: Ordinance;
  recommend: Recommend;
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
  'urgent': '#f97316',
  'high': '#eab308',
  'normal': '#6b7280',
  'low': '#4b5563',
};

export const STATUS_COLORS: Record<string, string> = {
  'active': '#22c55e',
  'new': '#3b82f6',
  'returning': '#8b5cf6',
  'occasional': '#eab308',
  'fence': '#f97316',
  'inactive': '#ef4444',
  'moving': '#6b7280',
  'attending-home-ward': '#6b7280',
  'convert-baptism': '#06b6d4',
  'needs-outreach': '#f97316',
};
