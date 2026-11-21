import { App, Menu, Modal, Platform } from 'obsidian';
import { WriteService, today } from './services/WriteService';
import { FACT_LABELS } from './services/sections';
import {
  CHECK_INS, CHECK_IN_STYLES, MemberState, ORDINANCES, PASTORAL_STATES, PRIORITIES, RECOMMENDS, STATUSES,
  CheckIn, CheckInStyle, MemberStatus, Ordinance, PastoralState, Priority, Recommend,
} from './models/types';

const TITLE = (s: string) => (s ? s.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()) : 'None');

interface Field {
  key: string;
  label: string;
  placeholder?: string;
  initial?: string;
  multiline?: boolean;
  options?: string[];
}

/** A small form: stacked label-over-input fields, Cancel + Save. Enter saves from a single-line
 *  field; Cmd/Ctrl+Enter saves from a textarea. */
export class FormModal extends Modal {
  constructor(app: App, private heading: string, private fields: Field[],
              private onSave: (v: Record<string, string>) => void, private required: string[] = []) {
    super(app);
  }

  onOpen(): void {
    this.modalEl.addClass('sh-form-modal');
    this.titleEl.setText(this.heading);
    const values: Record<string, string> = {};
    let first: HTMLElement | null = null;
    let saveBtn: HTMLButtonElement | null = null;
    const ready = () => !this.required.some((k) => !(values[k] || '').trim());
    const sync = () => { if (saveBtn) saveBtn.disabled = !ready(); };
    const save = () => {
      if (!ready()) return;
      this.close();
      this.onSave(values);
    };
    const form = this.contentEl.createDiv({ cls: 'sh-form' });
    for (const f of this.fields) {
      values[f.key] = f.initial ?? (f.options ? f.options[0] : '');
      const row = form.createDiv({ cls: 'sh-form-field' });
      const id = `sh-f-${f.key}-${Math.random().toString(36).slice(2, 7)}`;
      row.createEl('label', { text: f.label, attr: { for: id } });
      let el: HTMLElement;
      if (f.options) {
        const sel = row.createEl('select', { cls: 'dropdown', attr: { id } });
        f.options.forEach((o) => sel.createEl('option', { text: o, value: o }));
        sel.value = values[f.key];
        sel.addEventListener('change', () => { values[f.key] = sel.value; sync(); });
        el = sel;
      } else if (f.multiline) {
        const ta = row.createEl('textarea', { attr: { id, rows: '5', placeholder: f.placeholder ?? '' } });
        ta.value = values[f.key];
        ta.addEventListener('input', () => { values[f.key] = ta.value; sync(); });
        ta.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); save(); }
        });
        el = ta;
      } else {
        const tx = row.createEl('input', { attr: { id, type: 'text', placeholder: f.placeholder ?? '' } });
        tx.value = values[f.key];
        tx.addEventListener('input', () => { values[f.key] = tx.value; sync(); });
        tx.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Enter') { e.preventDefault(); save(); }
        });
        el = tx;
      }
      first = first ?? el;
    }
    const bar = this.contentEl.createDiv({ cls: 'sh-form-actions' });
    if (this.fields.some((f) => f.multiline)) {
      bar.createSpan({ cls: 'sh-form-hint', text: Platform.isMacOS ? '⌘↵ to save' : 'Ctrl+Enter to save' });
    }
    bar.createEl('button', { text: 'Cancel' }).addEventListener('click', () => this.close());
    saveBtn = bar.createEl('button', { text: 'Save', cls: 'mod-cta' });
    saveBtn.addEventListener('click', save);
    sync();
    window.setTimeout(() => (first as HTMLElement | null)?.focus(), 0);
  }

  onClose(): void { this.contentEl.empty(); }
}

export function logInteraction(app: App, writer: WriteService, member: MemberState): void {
  new FormModal(app, `Log a conversation · ${member.name}`,
    [{ key: 'note', label: 'What did you talk about?', multiline: true, placeholder: 'Leave blank to just mark that you talked today' }],
    (v) => {
      const note = (v.note || '').trim();
      void (note ? writer.logInteraction(member.file, note) : writer.markContacted(member.file));
    }).open();
}

export function addFact(app: App, writer: WriteService, member: MemberState, label?: string): void {
  const current = label ? member.facts.find((f) => f.label === label)?.value : '';
  new FormModal(app, label ? `${label} · ${member.name}` : `Add a fact · ${member.name}`, [
    { key: 'label', label: 'Topic', options: label ? [label] : FACT_LABELS },
    { key: 'value', label: 'What’s true now', initial: current || '', placeholder: 'e.g. Line cook at a Provo diner' },
  ], (v) => void writer.upsertFact(member.file, v.label, v.value), ['value']).open();
}

export function addHelp(app: App, writer: WriteService, member: MemberState): void {
  new FormModal(app, `Help given · ${member.name}`, [
    { key: 'date', label: 'Date', initial: today() },
    { key: 'amount', label: 'Amount', placeholder: '450' },
    { key: 'purpose', label: 'For', placeholder: 'Rent (fast offering)' },
  ], (v) => void writer.addHelp(member.file, v.date, v.amount, v.purpose), ['purpose']).open();
}

export function addRestriction(app: App, writer: WriteService, member: MemberState): void {
  new FormModal(app, `Membership restriction · ${member.name}`, [
    { key: 'date', label: 'Since', initial: today() },
    { key: 'text', label: 'Restriction', placeholder: 'No temple recommend use' },
  ], (v) => void writer.addRestriction(member.file, v.date, v.text), ['text']).open();
}

/** The ⋯ menu: every frontmatter setting the band used to carry. */
export function showMoreMenu(app: App, writer: WriteService, member: MemberState, e: MouseEvent): void {
  const file = member.file;
  const menu = new Menu();
  const group = <T extends string>(title: string, opts: readonly T[], current: string, write: (v: T) => Promise<void>) => {
    menu.addItem((i) => i.setTitle(title).setIsLabel(true));
    for (const o of opts) {
      menu.addItem((i) => i.setTitle(TITLE(o)).setChecked(o === current).onClick(() => void write(o)));
    }
    menu.addSeparator();
  };
  menu.addItem((i) => i.setTitle('Mark talked today').setIcon('check').onClick(() => void writer.markContacted(file)));
  menu.addSeparator();
  menu.addItem((i) => i.setTitle('Met').setIsLabel(true));
  menu.addItem((i) => i.setTitle('I know them').setChecked(member.met === true).onClick(() => void writer.setMet(file, true)));
  menu.addItem((i) => i.setTitle("Haven't met").setChecked(member.met === false).onClick(() => void writer.setMet(file, false)));
  menu.addSeparator();
  group('Priority', PRIORITIES, member.priority, (v: Priority) => writer.setPriority(file, v));
  group('Pastoral', PASTORAL_STATES, member.pastoralState, (v: PastoralState) => writer.setPastoralState(file, v));
  group('Recommend', RECOMMENDS as Recommend[], member.recommend, (v) => writer.setRecommend(file, v));
  group('Next ordinance', ORDINANCES as Ordinance[], member.nextOrdinance, (v) => writer.setOrdinance(file, v));
  group('Presence', STATUSES, member.status, (v: MemberStatus) => writer.setStatus(file, v));
  group('Check-in', CHECK_INS, member.checkIn, (v: CheckIn) => writer.setCheckIn(file, v));
  if (member.checkIn !== 'none') {
    group('Message', CHECK_IN_STYLES, member.checkInStyle, (v: CheckInStyle) => writer.setCheckInStyle(file, v));
    if (member.checkInStyle === 'gif') {
      menu.addItem((i) => i
        .setTitle(member.gifPrompt ? `GIF prompt: ${member.gifPrompt}` : 'Set GIF prompt…')
        .setIcon('image')
        .onClick(() => new FormModal(app, 'GIF prompt',
          [{ key: 'p', label: 'Prompt', initial: member.gifPrompt, placeholder: 'e.g. locked in, you got this' }],
          (v) => void writer.setGifPrompt(file, v.p || '')).open()));
    }
  }
  menu.showAtMouseEvent(e);
}
