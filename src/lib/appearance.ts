// Appearance configuration: UI Zoom/Scale, UI Font, Terminal Font Size & Family

import { adjustWindowScale } from './tauri';

export const UI_ZOOM_PRESETS = [90, 100, 105, 110, 115, 120, 125, 130, 140, 150];
export const DEFAULT_UI_ZOOM = 100;
export const STORAGE_KEY_BASE_WINDOW_SIZE = 'clx-base-window-size';

export interface UiFontOption {
  id: string;
  name: string;
  fontFamily: string;
  desc: string;
}

export const UI_FONT_OPTIONS: UiFontOption[] = [
  {
    id: 'rajdhani',
    name: 'Rajdhani (Mặc định Cyberpunk)',
    fontFamily: "'Rajdhani', sans-serif",
    desc: 'Cyberpunk condensed aesthetic',
  },
  {
    id: 'segoe',
    name: 'Segoe UI (Chuẩn Windows - Rõ nét, chữ lớn)',
    fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    desc: 'Crisp, highly readable system font',
  },
  {
    id: 'inter',
    name: 'Inter / Modern Sans (Dễ đọc)',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    desc: 'Modern, clean, balanced readability',
  },
  {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    fontFamily: "'JetBrains Mono', 'Cascadia Code', monospace",
    desc: 'Developer monospace font',
  },
];

export const TERMINAL_FONT_SIZES = [12, 13, 14, 15, 16, 18, 20, 22];
export const DEFAULT_TERMINAL_FONT_SIZE = 13;

export interface TerminalFontOption {
  id: string;
  name: string;
  fontFamily: string;
}

export const TERMINAL_FONT_OPTIONS: TerminalFontOption[] = [
  {
    id: 'cascadia',
    name: 'Cascadia Mono (Mặc định Windows)',
    fontFamily: 'Cascadia Mono, CaskaydiaCove Nerd Font, Consolas, monospace',
  },
  {
    id: 'fira-code',
    name: 'Fira Code',
    fontFamily: "'Fira Code', Cascadia Mono, monospace",
  },
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    fontFamily: "'JetBrains Mono', Cascadia Mono, monospace",
  },
  {
    id: 'consolas',
    name: 'Consolas',
    fontFamily: "Consolas, 'Courier New', monospace",
  },
  {
    id: 'system-mono',
    name: 'Monospace (Hệ thống)',
    fontFamily: 'monospace',
  },
];

const STORAGE_KEY_UI_ZOOM = 'clx-ui-zoom';
const STORAGE_KEY_UI_FONT = 'clx-ui-font-family';
const STORAGE_KEY_TERM_FONT_SIZE = 'clx-terminal-font-size';
const STORAGE_KEY_TERM_FONT_FAMILY = 'clx-terminal-font-family';

export function recordBaseWindowSize(width: number, height: number): void {
  if (width >= 900 && height >= 500) {
    localStorage.setItem(
      STORAGE_KEY_BASE_WINDOW_SIZE,
      JSON.stringify({ width: Math.round(width), height: Math.round(height) })
    );
  }
}

export function getBaseWindowSize(): { width: number; height: number } {
  const saved = localStorage.getItem(STORAGE_KEY_BASE_WINDOW_SIZE);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed?.width && parsed?.height && parsed.width >= 900 && parsed.height >= 500) {
        return { width: Number(parsed.width), height: Number(parsed.height) };
      }
    } catch { /* ignore */ }
  }
  return { width: 1440, height: 900 };
}

export function getUiZoom(): number {
  const saved = localStorage.getItem(STORAGE_KEY_UI_ZOOM);
  const parsed = saved ? parseInt(saved, 10) : DEFAULT_UI_ZOOM;
  return Number.isNaN(parsed) || parsed < 80 || parsed > 160 ? DEFAULT_UI_ZOOM : parsed;
}

export function setUiZoom(zoom: number): void {
  const clamped = Math.max(80, Math.min(160, Math.round(zoom)));
  localStorage.setItem(STORAGE_KEY_UI_ZOOM, clamped.toString());
  applyUiZoom(clamped);

  const base = getBaseWindowSize();
  void adjustWindowScale(clamped, base.width, base.height).catch(() => {
    // dev or browser mode
  });

  window.dispatchEvent(new CustomEvent('clx-appearance-changed', { detail: { zoom: clamped } }));
}

export function getUiFontFamily(): string {
  return localStorage.getItem(STORAGE_KEY_UI_FONT) || UI_FONT_OPTIONS[0].fontFamily;
}

export function setUiFontFamily(fontFamily: string): void {
  localStorage.setItem(STORAGE_KEY_UI_FONT, fontFamily);
  applyUiFontFamily(fontFamily);
  window.dispatchEvent(new CustomEvent('clx-appearance-changed', { detail: { fontFamily } }));
}

export function getTerminalFontSize(): number {
  const saved = localStorage.getItem(STORAGE_KEY_TERM_FONT_SIZE);
  const parsed = saved ? parseInt(saved, 10) : DEFAULT_TERMINAL_FONT_SIZE;
  return Number.isNaN(parsed) || parsed < 10 || parsed > 32 ? DEFAULT_TERMINAL_FONT_SIZE : parsed;
}

export function setTerminalFontSize(size: number): void {
  const clamped = Math.max(10, Math.min(32, Math.round(size)));
  localStorage.setItem(STORAGE_KEY_TERM_FONT_SIZE, clamped.toString());
  window.dispatchEvent(new CustomEvent('clx-terminal-font-changed', { detail: { fontSize: clamped } }));
}

export function getTerminalFontFamily(): string {
  return localStorage.getItem(STORAGE_KEY_TERM_FONT_FAMILY) || TERMINAL_FONT_OPTIONS[0].fontFamily;
}

export function setTerminalFontFamily(fontFamily: string): void {
  localStorage.setItem(STORAGE_KEY_TERM_FONT_FAMILY, fontFamily);
  window.dispatchEvent(new CustomEvent('clx-terminal-font-changed', { detail: { fontFamily } }));
}

export function zoomIn(): void {
  const current = getUiZoom();
  const next = UI_ZOOM_PRESETS.find((p) => p > current) ?? Math.min(160, current + 10);
  setUiZoom(next);
}

export function zoomOut(): void {
  const current = getUiZoom();
  const next = [...UI_ZOOM_PRESETS].reverse().find((p) => p < current) ?? Math.max(80, current - 10);
  setUiZoom(next);
}

export function resetZoom(): void {
  setUiZoom(DEFAULT_UI_ZOOM);
}

export function applyUiZoom(zoom: number): void {
  document.documentElement.style.zoom = `${zoom}%`;
  document.documentElement.style.overflow = 'hidden';
  document.documentElement.style.height = '100%';
  document.documentElement.style.width = '100%';
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
    document.body.style.width = '100%';
  }
}

export function applyUiFontFamily(fontFamily: string): void {
  document.documentElement.style.setProperty('--app-font-family', fontFamily);
}

export function applyAppearanceSettings(): void {
  applyUiZoom(getUiZoom());
  applyUiFontFamily(getUiFontFamily());
}

if (typeof window !== 'undefined') {
  let resizeTimer: ReturnType<typeof setTimeout> | null = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const zoom = getUiZoom();
      if (zoom === 100) {
        recordBaseWindowSize(window.innerWidth, window.innerHeight);
      }
    }, 300);
  });
}
