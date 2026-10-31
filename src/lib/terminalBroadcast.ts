import type { IDisposable, ITerminalAddon, Terminal } from '@xterm/xterm';

export function selectMiniTerminals(
  selectedIds: readonly string[],
  sessionId: string,
  additive: boolean,
  activeSessionId: string | null,
): string[] {
  if (!additive) return [sessionId];
  const current = new Set(selectedIds.length ? selectedIds : activeSessionId ? [activeSessionId] : []);
  if (current.has(sessionId)) current.delete(sessionId);
  else current.add(sessionId);
  return [...current];
}

export function terminalInputTargets(sourceId: string, selectedIds: readonly string[], runningIds: ReadonlySet<string>): string[] {
  if (!runningIds.has(sourceId)) return [];
  const selected = [...new Set(selectedIds)].filter(id => runningIds.has(id));
  return selected.length > 1 && selected.includes(sourceId) ? selected : [sourceId];
}

// Match xterm's paste handling independently for each receiving terminal.
export function buildTerminalPasteInput(text: string, bracketedPaste: boolean): string {
  const normalized = text.replace(/\r?\n/g, '\r');
  return bracketedPaste ? `\x1b[200~${normalized}\x1b[201~` : normalized;
}

// xterm 6 emits both user input and terminal protocol replies through onData.
// Confine its internal user-input signal here so DSR/DA/focus/mouse replies
// remain local. This signal precedes the corresponding onData synchronously,
// including IME input, which may arrive after the original DOM event.
export class TerminalInputAddon implements ITerminalAddon {
  private listeners: IDisposable[] = [];

  constructor(private readonly onInput: (data: string, userInput: boolean) => void) {}

  activate(terminal: Terminal): void {
    const core = (terminal as unknown as { _core: { coreService: { onUserInput: (listener: () => void) => IDisposable } } })._core;
    let userInput = false;
    this.listeners.push(core.coreService.onUserInput(() => { userInput = true; }));
    this.listeners.push(terminal.onData(data => {
      const fromUser = userInput;
      userInput = false;
      const mouseReport = /^\x1b\[(?:<\d+;\d+;\d+[Mm]|\d+;\d+;\d+M)$/.test(data);
      this.onInput(data, fromUser && !mouseReport);
    }));
  }

  dispose(): void {
    this.listeners.forEach(listener => listener.dispose());
    this.listeners = [];
  }
}
