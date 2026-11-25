export type WebMiniPlacement = 'hidden' | 'right' | 'bottom' | 'both';
export interface WebMiniPreferences { placement: WebMiniPlacement; display: 'preview' | 'title-only' }
export interface WebMiniTab { id: string; title: string; url: string; active: boolean; loading: boolean; error: boolean; preview?: string }
export interface WebBrowserController { activate: (id: string) => void; close: (id: string) => void; add: () => void }
export const DEFAULT_WEB_MINI: WebMiniPreferences = { placement: 'hidden', display: 'preview' };
export function readWebMiniPreferences(): WebMiniPreferences {
  try {
    const value = JSON.parse(localStorage.getItem('clx-web-mini-panels') || 'null');
    return { placement: ['hidden', 'right', 'bottom', 'both'].includes(value?.placement) ? value.placement : 'hidden', display: value?.display === 'title-only' ? 'title-only' : 'preview' };
  } catch { return { ...DEFAULT_WEB_MINI }; }
}
export function writeWebMiniPreferences(value: WebMiniPreferences): void { try { localStorage.setItem('clx-web-mini-panels', JSON.stringify(value)); } catch { /* Keep panels usable without persistence. */ } }
export function webMiniVisible(placement: WebMiniPlacement, panel: 'right' | 'bottom'): boolean { return placement === 'both' || placement === panel; }
export function hideWebMiniPanel(placement: WebMiniPlacement, panel: 'right' | 'bottom'): WebMiniPlacement { return placement === 'both' ? panel === 'right' ? 'bottom' : 'right' : placement === panel ? 'hidden' : placement; }
