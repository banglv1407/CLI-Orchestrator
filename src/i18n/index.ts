import { useSyncExternalStore } from 'react';
import { invoke, isTauri } from '@tauri-apps/api/core';
import { isLanguage, LANGUAGE_STORAGE_KEY, LANGUAGES, readLanguage, translate, translateFeedback, type Language } from './core';

export { LANGUAGES, LANGUAGE_STORAGE_KEY, type Language } from './core';

function browserStorage(): Storage | undefined {
  try { return typeof window === 'undefined' ? undefined : window.localStorage; }
  catch { return undefined; }
}

let language = readLanguage(browserStorage());
const listeners = new Set<() => void>();
let nativeSync: Promise<unknown> = Promise.resolve();

export function getLanguage(): Language { return language; }
export function getIntlLocale(): string {
  return LANGUAGES.find(({ code }) => code === language)!.locale;
}

export function formatChatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? timestamp : date.toLocaleTimeString(getIntlLocale());
}

export function formatRelativeTime(timestampSeconds: number): string {
  if (!timestampSeconds || timestampSeconds <= 0) return '—';
  const seconds = Math.max(0, Date.now() / 1000 - timestampSeconds);
  const format = new Intl.RelativeTimeFormat(getIntlLocale(), { numeric: 'auto' });
  if (seconds < 60) return format.format(0, 'second');
  if (seconds < 3600) return format.format(-Math.floor(seconds / 60), 'minute');
  if (seconds < 86400) return format.format(-Math.floor(seconds / 3600), 'hour');
  if (seconds < 86400 * 30) return format.format(-Math.floor(seconds / 86400), 'day');
  return new Date(timestampSeconds * 1000).toLocaleDateString(getIntlLocale());
}

export function t(source: string, values?: Record<string, string | number>): string {
  return translate(language, source, values);
}

export function tFeedback(source: string, values?: Record<string, string | number>): string {
  return translateFeedback(language, source, values);
}

function notifyLanguage(): void {
  if (typeof document !== 'undefined') document.documentElement.lang = language;
  for (const listener of listeners) listener();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('clx-language-changed', { detail: language }));
  }
  syncNativeLanguage();
}

export function setLanguage(next: Language): void {
  if (!isLanguage(next)) return;
  try { browserStorage()?.setItem(LANGUAGE_STORAGE_KEY, next); }
  catch { /* Language remains usable when storage is unavailable. */ }
  if (next === language) return;
  language = next;
  notifyLanguage();
}

export function syncNativeLanguage(): void {
  if (!isTauri()) return;
  const next = language;
  // Serialize rapid selections so a slow earlier invocation cannot win.
  nativeSync = nativeSync.catch(() => undefined).then(() => invoke('set_ui_language', { language: next }));
  void nativeSync.catch((error) => console.error('Failed to sync interface language:', error));
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

export function useLocale(): Language {
  return useSyncExternalStore(subscribe, getLanguage, () => 'en' as Language);
}

export function initializeLanguage(): void {
  if (typeof document !== 'undefined') document.documentElement.lang = language;
  syncNativeLanguage();
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== LANGUAGE_STORAGE_KEY && event.key !== null) return;
    const next = readLanguage(browserStorage());
    if (next !== language) { language = next; notifyLanguage(); }
  });
}
