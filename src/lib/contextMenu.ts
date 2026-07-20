export type ContextMenuArea = 'left' | 'main' | 'right' | 'bottom';

export interface AppContextMenuState {
  area: ContextMenuArea;
  x: number;
  y: number;
  sessionId: string | null;
  workingDir: string | null;
}

const VIEWPORT_MARGIN = 8;

export function getContextMenuPosition(
  clientX: number,
  clientY: number,
  menuWidth: number,
  menuHeight: number,
) {
  const maxX = Math.max(VIEWPORT_MARGIN, window.innerWidth - menuWidth - VIEWPORT_MARGIN);
  const maxY = Math.max(VIEWPORT_MARGIN, window.innerHeight - menuHeight - VIEWPORT_MARGIN);

  return {
    x: Math.max(VIEWPORT_MARGIN, Math.min(clientX, maxX)),
    y: Math.max(VIEWPORT_MARGIN, Math.min(clientY, maxY)),
  };
}
