// src/lib/terminalClipboard.ts
//
// Helpers for copying xterm.js selections to the system clipboard.
//
// Two modes are exposed:
//
//   - "exact": returns whatever xterm's public API reports as selected,
//     untouched. No trimming, no line-ending conversion, no wrap rewriting.
//     This is the safe default for a faithful "copy what you see" experience.
//
//   - "code": attempts to reconstruct the original source text by re-joining
//     soft-wrap continuations emitted by xterm and any TUI-drawn hard-wraps
//     whose last character lands on the right margin. Real newlines in the
//     source are preserved; only visual wrap artefacts are folded back into
//     a single logical line. The heuristic is intentionally conservative — it
//     prefers leaving a wrap intact over collapsing two distinct lines by
//     mistake.
//
// Heuristics and the rationale behind them are documented inline below.

import type { Terminal } from '@xterm/xterm';

export type TerminalCopyMode = 'exact' | 'code';

const BOX_DRAWING_RANGE_LO = 0x2500;
const BOX_DRAWING_RANGE_HI = 0x257f;
const NOISE_CHARS = new Set([' ', '\t', ' ', ' ', ' ', ' ']);

function isBoxDrawing(code: number): boolean {
  return code >= BOX_DRAWING_RANGE_LO && code <= BOX_DRAWING_RANGE_HI;
}

interface SelectionPoint {
  x: number;
  y: number;
}

interface BufferLine {
  isWrapped?: boolean;
  length: number;
  getCell?(x: number): { getChars?(): string } | undefined;
  translateToString?(trimRight?: boolean, startColumn?: number, endColumn?: number): string;
  getTrimmedLength?(): number;
}

interface ActiveBuffer {
  viewportY: number;
  baseY: number;
  length: number;
  getLine(y: number): BufferLine | undefined;
}

/**
 * Normalize a line ending to `\n` for the "code" mode only. We avoid changing
 * anything else so that indentation, blank lines, and box-drawing separators
 * stay byte-identical with the source.
 */
function normalizeLineEndings(text: string): string {
  if (text.indexOf('\r\n') === -1 && text.indexOf('\r') === -1) {
    return text;
  }
  return text.replace(/\r\n?/g, '\n');
}

/**
 * Read the cell at the given column for a buffer line. xterm stores the
 * rendered text in `BufferLine.getCell(col).getChars()`. We avoid touching
 * private fields; if the helper API is missing we fall back to
 * `translateToString` and index into that.
 */
function readCell(line: BufferLine, column: number): string {
  if (line.getCell) {
    const cell = line.getCell(column);
    if (cell && typeof cell.getChars === 'function') {
      return cell.getChars();
    }
  }
  if (line.translateToString) {
    const slice = line.translateToString(true, column, column + 1);
    return slice ?? '';
  }
  return '';
}

/**
 * Returns true if the last "meaningful" character of a buffer row sits on the
 * right margin. This is the only evidence we accept for joining a hard-wrap —
 * everything else (a stray space, a box-drawing glyph, a trailing horizontal
 * rule) is too easy to confuse with intentional padding.
 *
 * `columns` is the rendered viewport width; the rightmost column is
 * `columns - 1`.
 */
function rightEdgeHasContinuationChar(line: BufferLine, columns: number): boolean {
  if (line.length === 0) return false;
  const lastCol = Math.min(columns - 1, line.length - 1);
  const char = readCell(line, lastCol);
  if (!char) return false;
  if (NOISE_CHARS.has(char)) return false;
  const code = char.codePointAt(0) ?? 0;
  if (isBoxDrawing(code)) return false;
  return true;
}

/**
 * Build the "exact" string. We delegate to xterm's public `getSelection()`
 * because it already accounts for the active selection rectangle and the
 * buffer's current viewport. We never trim or normalize line endings.
 */
function buildExactText(terminal: Terminal): string {
  return terminal.getSelection();
}

/**
 * Build the "code" string. We rely on the official `getSelectionPosition()`
 * to obtain the buffer coordinates of the selection. If the API is not
 * available (older xterm) we return an empty string rather than guess.
 */
function buildCodeText(terminal: Terminal, columns: number): string {
  const position = terminal.getSelectionPosition();
  if (!position) return '';

  // xterm's IBufferRange does not expose raw start/end in every version, so
  // we narrow the access through a typed shim rather than fighting the
  // public type.
  const range = position as unknown as { start: SelectionPoint; end: SelectionPoint };
  if (!range.start || !range.end) return '';

  const buffer = (terminal as unknown as { buffer: { active: ActiveBuffer } }).buffer.active;
  if (!buffer) return '';

  const { start, end } = range;
  // Selection may be drawn in any direction — normalize so we walk top-to-bottom.
  let startY = start.y;
  let startX = start.x;
  let endY = end.y;
  let endX = end.x;
  if (startY > endY || (startY === endY && startX > endX)) {
    startY = end.y;
    startX = end.x;
    endY = start.y;
    endX = start.x;
  }

  const lines: string[] = [];

  for (let y = startY; y <= endY; y++) {
    const line = buffer.getLine(y);
    if (!line) continue;

    // Per-row column window. First row starts at startX, last row ends at endX
    // (inclusive — xterm reports the selected cell, not the trailing edge).
    const rowStart = y === startY ? startX : 0;
    const rowEnd = y === endY ? endX : Math.max(0, line.length - 1);
    if (rowStart > rowEnd) {
      // Empty selection (e.g. past last column on a short row) — skip.
      continue;
    }

    const cellText = line.translateToString
      ? line.translateToString(true, rowStart, rowEnd + 1)
      : '';
    const rowText = cellText ?? '';
    lines.push(rowText);

    // Decide whether to join the next row. We only fold rows when xterm has
    // already flagged them as wrapped AND the visual end of the current row
    // sits on the right margin. Either condition alone is too weak; both
    // together is the only signal we trust.
    if (y < endY) {
      const wrapped = line.isWrapped === true;
      const touchesRightEdge = rightEdgeHasContinuationChar(line, columns);
      if (wrapped && touchesRightEdge) {
        // Pop the synthesized newline and continue on the same logical line.
        lines[lines.length - 1] = lines[lines.length - 1].replace(/[ \t]+$/, '');
        continue;
      }
    }
  }

  return normalizeLineEndings(lines.join('\n'));
}

/**
 * Returns the text that should be copied for the given mode. "exact" mirrors
 * the buffer verbatim; "code" tries to undo xterm's visual wrapping while
 * preserving real newlines, indentation, and Unicode box-drawing glyphs.
 */
export function getTerminalSelectionText(
  terminal: Terminal,
  mode: TerminalCopyMode,
  columns?: number,
): string {
  if (mode === 'exact') {
    return buildExactText(terminal);
  }

  // For "code" we need a column count. xterm exposes it via `cols`.
  const cols = columns ?? (terminal as unknown as { cols?: number }).cols ?? 80;
  if (!terminal.hasSelection()) {
    return '';
  }
  return buildCodeText(terminal, cols);
}

/**
 * Convenience wrapper that copies the terminal selection to the system
 * clipboard. Returns true on success, false on rejection.
 *
 * In "code" mode the function refuses to copy an empty payload — the caller
 * can use that to detect "no real selection" and fall through to the regular
 * PTY interrupt path.
 */
export async function copyTerminalSelection(
  terminal: Terminal,
  mode: TerminalCopyMode,
): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
    return false;
  }

  const text = getTerminalSelectionText(terminal, mode);
  if (mode === 'code' && text === '') {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
