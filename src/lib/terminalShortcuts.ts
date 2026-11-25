export const NEW_TERMINAL_EVENT = 'create-quick-terminal';
export const CYCLE_TERMINAL_EVENT = 'cycle-terminal';

export function isNewTerminalShortcut(event: Pick<KeyboardEvent, 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey' | 'code' | 'key' | 'isComposing'>): boolean {
  return event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey && !event.isComposing &&
    (event.code === 'Backquote' || ((!event.code || event.code === 'Unidentified') && event.key === '`'));
}

export function getCycleTerminalStep(event: Pick<KeyboardEvent, 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey' | 'code' | 'key' | 'isComposing'>): -1 | 0 | 1 {
  if (!event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return 0;
  const isTab = event.code === 'Tab' || ((!event.code || event.code === 'Unidentified') && event.key === 'Tab');
  if (!isTab) return 0;
  return event.shiftKey ? -1 : 1;
}

export function cycleTerminalSessionId(sessionIds: readonly string[], activeSessionId: string | null, step: -1 | 1 = 1): string | null {
  if (!sessionIds.length) return null;
  const idx = activeSessionId ? sessionIds.indexOf(activeSessionId) : -1;
  if (idx === -1) return sessionIds[step > 0 ? 0 : sessionIds.length - 1];
  return sessionIds[(idx + step + sessionIds.length) % sessionIds.length];
}

// Install before React mounts, ahead of xterm, modal and game capture handlers.
export function installNewTerminalShortcut(
  target: Window,
  createTerminal: () => void,
  cycleTerminal?: (step: -1 | 1) => void,
): () => void {
  const handle = (event: KeyboardEvent) => {
    if (isNewTerminalShortcut(event)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (event.type === 'keydown' && !event.repeat) createTerminal();
      return;
    }
    const step = cycleTerminal ? getCycleTerminalStep(event) : 0;
    if (step !== 0) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (event.type === 'keydown' && !event.repeat) cycleTerminal!(step);
    }
  };
  target.addEventListener('keydown', handle, true);
  target.addEventListener('keyup', handle, true);
  return () => {
    target.removeEventListener('keydown', handle, true);
    target.removeEventListener('keyup', handle, true);
  };
}
