export const NEW_TERMINAL_EVENT = 'create-quick-terminal';

export function isNewTerminalShortcut(event: Pick<KeyboardEvent, 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey' | 'code' | 'key' | 'isComposing'>): boolean {
  return event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey && !event.isComposing &&
    (event.code === 'Backquote' || ((!event.code || event.code === 'Unidentified') && event.key === '`'));
}

// Install before React mounts, ahead of xterm, modal and game capture handlers.
export function installNewTerminalShortcut(target: Window, createTerminal: () => void): () => void {
  const handle = (event: KeyboardEvent) => {
    if (!isNewTerminalShortcut(event)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.type === 'keydown' && !event.repeat) createTerminal();
  };
  target.addEventListener('keydown', handle, true);
  target.addEventListener('keyup', handle, true);
  return () => {
    target.removeEventListener('keydown', handle, true);
    target.removeEventListener('keyup', handle, true);
  };
}
