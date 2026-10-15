import type { SearchAddon, ISearchOptions } from '@xterm/addon-search';
import type { IBuffer, Terminal } from '@xterm/xterm';

export const TERMINAL_SEARCH_LIMIT = 1000;
type SearchAction = 'open' | 'next' | 'previous' | 'close';

export function handleTerminalSearchKey(
  event: KeyboardEvent,
  context: { enabled: boolean; editableElsewhere: boolean; inSearchInput: boolean; searchVisible: boolean },
  actions: Record<SearchAction, () => void>,
): boolean {
  if (!context.enabled || context.editableElsewhere || event.isComposing || event.altKey) return false;
  const key = event.key.toLowerCase();
  const primary = event.ctrlKey || event.metaKey;
  let action: SearchAction | undefined;
  if (primary && !event.shiftKey && key === 'f') action = 'open';
  else if (!primary && key === 'f3' && context.searchVisible) action = event.shiftKey ? 'previous' : 'next';
  else if (primary && key === 'g' && context.searchVisible) action = event.shiftKey ? 'previous' : 'next';
  else if (!primary && key === 'enter' && context.inSearchInput) action = event.shiftKey ? 'previous' : 'next';
  else if (!primary && key === 'escape' && context.searchVisible) action = 'close';
  if (!action) return false;

  // Returning false from xterm's custom handler alone does not cancel browser
  // find. The capture listener owns the gesture before xterm or WebView do.
  event.preventDefault();
  event.stopImmediatePropagation();
  actions[action]();
  return true;
}

export function clearTerminalSearch(term: Terminal, search: SearchAddon): void {
  search.clearDecorations();
  term.clearSelection();
}

function usedColumns(buffer: IBuffer, row: number): number {
  const line = buffer.getLine(row);
  if (!line) return 0;
  for (let col = line.length - 1; col >= 0; col--) {
    const cell = line.getCell(col);
    if (cell?.getCode()) return col + cell.getWidth();
  }
  return 0;
}

function offsetInLine(buffer: IBuffer, firstRow: number, point: { x: number; y: number }): number {
  let offset = point.x;
  for (let row = firstRow; row < point.y; row++) offset += usedColumns(buffer, row);
  return offset;
}

function pointInLine(buffer: IBuffer, firstRow: number, offset: number): { x: number; y: number } | undefined {
  for (let row = firstRow; row < buffer.length; row++) {
    const width = usedColumns(buffer, row);
    if (offset < width || !buffer.getLine(row + 1)?.isWrapped) {
      return offset <= width ? { x: offset, y: row } : undefined;
    }
    offset -= width;
  }
}

// xterm clears selections on height changes. SearchAddon's delayed refresh
// then starts from the bottom and changes the current result. Preserve a
// search match across reflow using a temporary logical-line marker and cell
// offsets, including wide-character padding. Ordinary mouse selections keep
// xterm's existing behavior. This adapter uses only public xterm APIs.
export function preserveSearchSelectionOnResize(term: Terminal, getQuery: () => string): () => void {
  const originalResize = term.resize;
  const resize: Terminal['resize'] = (cols, rows) => {
    const query = getQuery();
    const selection = term.getSelectionPosition();
    const buffer = term.buffer.active;
    if (!query || !selection || term.getSelection().toLowerCase() !== query.toLowerCase()) {
      originalResize.call(term, cols, rows);
      return;
    }
    let firstRow = selection.start.y;
    while (firstRow > 0 && buffer.getLine(firstRow)?.isWrapped) firstRow--;
    const startOffset = offsetInLine(buffer, firstRow, selection.start);
    const endOffset = offsetInLine(buffer, firstRow, selection.end);
    const marker = term.registerMarker(firstRow - buffer.baseY - buffer.cursorY);
    try {
      originalResize.call(term, cols, rows);
      if (!marker || marker.isDisposed || term.buffer.active.type !== buffer.type) return;
      const nextBuffer = term.buffer.active;
      const start = pointInLine(nextBuffer, marker.line, startOffset);
      const end = pointInLine(nextBuffer, marker.line, endOffset);
      if (!start || !end) return;
      term.select(start.x, start.y, (end.y - start.y) * term.cols + end.x - start.x);
      if (term.getSelection().toLowerCase() !== query.toLowerCase()) term.clearSelection();
    } finally {
      marker?.dispose();
    }
  };
  term.resize = resize;
  return () => { if (term.resize === resize) term.resize = originalResize; };
}

export function findTerminalText(
  term: Terminal,
  search: SearchAddon,
  query: string,
  direction: 'next' | 'prev' = 'next',
  incremental = false,
): boolean {
  if (!query.length) {
    clearTerminalSearch(term, search);
    return false;
  }
  const options: ISearchOptions = {
    caseSensitive: false,
    regex: false,
    incremental,
    decorations: {
      matchBackground: '#514b26', matchBorder: '#f8e16a', matchOverviewRuler: '#f8e16a',
      activeMatchBackground: '#7d6826', activeMatchBorder: '#00ffd1', activeMatchColorOverviewRuler: '#00ffd1',
    },
  };
  return direction === 'next' ? search.findNext(query, options) : search.findPrevious(query, options);
}
