import { MarkdownView, TFile, Workspace } from 'obsidian';

// When the side panel shows a member, the note itself should read as the
// conversation timeline. The sections the panel already shows are folded
// under their headings (one click on the arrow opens them). Uses the editor's
// fold info, which Obsidian doesn't document; every call is guarded so a
// future API change just leaves the note unfolded.

export const PANEL_SECTIONS = ['Open threads', 'Standing facts', 'Private', 'Earlier notes'];

interface FoldMode {
  getFoldInfo?: () => { folds: { from: number; to: number }[]; lines: number } | null;
  applyFoldInfo?: (info: { folds: { from: number; to: number }[]; lines: number }) => void;
}

function sectionFolds(view: MarkdownView, headings: string[]): { from: number; to: number }[] {
  const editor = view.editor;
  if (!editor) return [];
  const n = editor.lineCount();
  const lines: string[] = [];
  for (let i = 0; i < n; i++) lines.push(editor.getLine(i));
  const folds: { from: number; to: number }[] = [];
  for (const h of headings) {
    const i = lines.findIndex((l) => l.trim().toLowerCase() === `## ${h}`.toLowerCase());
    if (i < 0) continue;
    let j = i + 1;
    while (j < n && !/^#{1,2}\s/.test(lines[j]) && lines[j].trim() !== '---') j++;
    let end = j - 1;
    while (end > i && !lines[end].trim()) end--;
    if (end > i) folds.push({ from: i, to: end });
  }
  return folds;
}

/** Each "### Confidential..." block, folded to its heading line. */
function confidentialFolds(view: MarkdownView): { from: number; to: number }[] {
  const editor = view.editor;
  if (!editor) return [];
  const n = editor.lineCount();
  const folds: { from: number; to: number }[] = [];
  for (let i = 0; i < n; i++) {
    if (!/^###\s+confidential/i.test(editor.getLine(i))) continue;
    let j = i + 1;
    while (j < n && !/^#{1,3}\s/.test(editor.getLine(j)) && editor.getLine(j).trim() !== '---') j++;
    let end = j - 1;
    while (end > i && !editor.getLine(end).trim()) end--;
    if (end > i) folds.push({ from: i, to: end });
  }
  return folds;
}

function views(ws: Workspace, file: TFile): MarkdownView[] {
  return ws.getLeavesOfType('markdown')
    .map((l) => l.view)
    .filter((v): v is MarkdownView => v instanceof MarkdownView && v.file?.path === file.path);
}

/** Fold the panel's sections in every editor showing this file. */
export function foldPanelSections(ws: Workspace, file: TFile): void {
  for (const view of views(ws, file)) {
    const mode = view.currentMode as unknown as FoldMode;
    if (!mode.getFoldInfo || !mode.applyFoldInfo) continue;
    try {
      const want = [...sectionFolds(view, PANEL_SECTIONS), ...confidentialFolds(view)];
      const have = mode.getFoldInfo()?.folds ?? [];
      const merged = [...have.filter((f) => !want.some((w) => w.from === f.from)), ...want];
      mode.applyFoldInfo({ folds: merged, lines: view.editor.lineCount() });
    } catch { /* leave it unfolded */ }
  }
}

/** Unfold one section (used before jumping to a heading inside it). */
export function unfoldSection(ws: Workspace, file: TFile, heading: string): void {
  for (const view of views(ws, file)) {
    const mode = view.currentMode as unknown as FoldMode;
    if (!mode.getFoldInfo || !mode.applyFoldInfo) continue;
    try {
      const target = sectionFolds(view, [heading])[0];
      const info = mode.getFoldInfo();
      if (!target || !info) continue;
      mode.applyFoldInfo({ folds: info.folds.filter((f) => f.from !== target.from), lines: view.editor.lineCount() });
    } catch { /* nothing to undo */ }
  }
}
