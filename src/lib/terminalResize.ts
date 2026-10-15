import type { ITerminalAddon, Terminal } from '@xterm/xterm';

export interface TerminalSize {
  cols: number;
  rows: number;
}

// Matches spawn_pty_process. Start parsing at the native grid size, including
// output that arrives before the terminal is opened and fitted.
export const INITIAL_TERMINAL_SIZE: TerminalSize = { cols: 140, rows: 34 };

interface BufferLine {
  isWrapped: boolean;
}

// xterm 6.0.0 internals are confined to this addon. Keep the dependency pinned
// and run the captured ConPTY regression before changing its version.
interface ReflowBuffer {
  _cols: number;
  ybase: number;
  ydisp: number;
  y: number;
  savedY: number;
  lines: {
    length: number;
    maxLength: number;
    get(index: number): BufferLine | undefined;
    push(line: BufferLine): void;
  };
  getBlankLine(): BufferLine;
  _reflow(cols: number, rows: number): void;
}

function lineIndex(buffer: ReflowBuffer, line: BufferLine | undefined): number {
  if (!line) return -1;
  for (let index = 0; index < buffer.lines.length; index++) {
    if (buffer.lines.get(index) === line) return index;
  }
  return -1;
}

function logicalLineStart(buffer: ReflowBuffer, index: number): BufferLine | undefined {
  while (index > 0 && buffer.lines.get(index)?.isWrapped) index--;
  return buffer.lines.get(index);
}

function reflowConpty(buffer: ReflowBuffer, reflow: ReflowBuffer['_reflow'], cols: number, rows: number): void {
  if (cols === buffer._cols) {
    reflow.call(buffer, cols, rows);
    return;
  }

  const top = buffer.lines.get(buffer.ybase);
  const cursor = buffer.lines.get(buffer.ybase + buffer.y);
  const savedCursor = logicalLineStart(buffer, buffer.savedY);
  const view = logicalLineStart(buffer, buffer.ydisp);
  const atBottom = buffer.ydisp === buffer.ybase;

  // ConPTY only owns its viewport; a wrapped first row has no preceding row
  // in its buffer. Reflow scrollback and viewport independently to match it.
  if (top) top.isWrapped = false;
  reflow.call(buffer, cols, rows);

  const topIndex = lineIndex(buffer, top);
  const cursorIndex = lineIndex(buffer, cursor);
  if (cursorIndex < 0) return;
  const viewIndex = lineIndex(buffer, view);
  const savedCursorIndex = lineIndex(buffer, savedCursor);

  // Width expansion must leave blank rows below the viewport instead of
  // pulling history into rows that the native redraw is about to overwrite.
  const base = Math.max(0, topIndex, cursorIndex - rows + 1);
  const blanks = Math.max(0, base + rows - buffer.lines.length);
  const trimmed = Math.max(0, buffer.lines.length + blanks - buffer.lines.maxLength);
  for (let index = 0; index < blanks; index++) buffer.lines.push(buffer.getBlankLine());

  buffer.ybase = Math.max(0, base - trimmed);
  buffer.y = Math.max(0, Math.min(rows - 1, cursorIndex - trimmed - buffer.ybase));
  buffer.ydisp = atBottom ? buffer.ybase : Math.max(0, Math.min(buffer.ybase, viewIndex - trimmed));
  if (savedCursorIndex >= 0) buffer.savedY = Math.max(0, savedCursorIndex - trimmed);
}

export class ConptyResizeAddon implements ITerminalAddon {
  private terminal?: Terminal;
  private originalResize?: Terminal['resize'];
  private resize?: Terminal['resize'];

  activate(terminal: Terminal): void {
    this.terminal = terminal;
    this.originalResize = terminal.resize;
    const originalResize = terminal.resize;
    terminal.options.windowsPty = { backend: 'conpty' };
    this.resize = (cols, rows) => {
      const buffer = (terminal as unknown as {
        _core: { _bufferService: { buffers: { normal: ReflowBuffer } } };
      })._core._bufferService.buffers.normal;
      const reflow = buffer._reflow;
      buffer._reflow = (nextCols, nextRows) => reflowConpty(buffer, reflow, nextCols, nextRows);
      try {
        originalResize.call(terminal, cols, rows);
      } finally {
        // Also works after reset/alternate-buffer switches: find the current
        // normal buffer for each resize and never retain a replaced buffer.
        buffer._reflow = reflow;
      }
    };
    terminal.resize = this.resize;
  }

  dispose(): void {
    const terminal = this.terminal;
    if (terminal && terminal.resize === this.resize && this.originalResize) {
      terminal.resize = this.originalResize;
    }
    this.terminal = undefined;
    this.resize = undefined;
    this.originalResize = undefined;
  }
}

function sameSize(first: TerminalSize | undefined, second: TerminalSize): boolean {
  return first?.cols === second.cols && first.rows === second.rows;
}

// Only one native resize can be outstanding per PTY. New dimensions replace
// intermediate requests, and disposal prevents late work on a closed session.
export class TerminalResizeQueue {
  private pending?: TerminalSize;
  private applied?: TerminalSize;
  private running = false;
  private disposed = false;

  constructor(
    private readonly send: (size: TerminalSize) => Promise<unknown>,
    private readonly onError: (error: unknown) => void,
  ) {}

  get isResizing(): boolean {
    return this.running;
  }

  enqueue(size: TerminalSize): void {
    if (this.disposed || size.cols < 2 || size.rows < 1) return;
    this.pending = size;
    void this.drain();
  }

  dispose(): void {
    this.disposed = true;
    this.pending = undefined;
  }

  private async drain(): Promise<void> {
    if (this.running || this.disposed) return;
    this.running = true;
    try {
      while (this.pending && !this.disposed) {
        const size = this.pending;
        this.pending = undefined;
        if (sameSize(this.applied, size)) continue;
        try {
          await this.send(size);
          this.applied = size;
        } catch (error) {
          if (!this.disposed) this.onError(error);
        }
      }
    } finally {
      this.running = false;
    }
  }
}
