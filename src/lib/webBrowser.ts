import { invoke } from '@tauri-apps/api/core';
import type { ProxyHop } from '../types';

export interface WebBrowserConfig { url: string; hop?: ProxyHop; hops?: ProxyHop[]; profileId?: string; routeId?: string }
export type WebBrowserDraft = WebBrowserConfig;
export interface WebConnectionProfile { id: string; name: string; config: WebBrowserConfig }
export interface WebBrowserSettings { version: number; current: WebBrowserConfig; profiles: WebConnectionProfile[] }
export interface WebHistoryEntry { id: string; url: string; title: string; visitedAt: number; profileId?: string | null; routeKey: string; connectionKind: string }
export interface WebBrowserBounds { x: number; y: number; width: number; height: number }
export interface WebBrowserPage {
  sessionId: string; url: string; title: string; loading: boolean; visible: boolean; navigationId: number; routeKey: string;
  error: string | null; download: string | null;
}
export type WebBrowserAction = 'back' | 'forward' | 'reload' | 'stop';
export const EMPTY_WEB_BROWSER_DRAFT: WebBrowserDraft = { url: '' };

const reservedHosts = new Set(['tauri.localhost', 'asset.localhost', 'clx-module.localhost', 'ipc.localhost']);

export function normalizeWebsiteUrl(input: string): string {
  const value = input.trim();
  if (!value || value.length > 8192 || /[\x00-\x1f\x7f]/.test(value)) throw new Error('Enter a valid HTTP or HTTPS website URL.');
  let url: URL;
  try { url = new URL(value.includes('://') ? value : `http://${value}`); }
  catch { throw new Error('Enter a valid HTTP or HTTPS website URL.'); }
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password || reservedHosts.has(url.hostname)) {
    throw new Error('Enter a valid HTTP or HTTPS website URL.');
  }
  return url.href;
}

export function normalizeWebBrowserConfig(draft: WebBrowserDraft, allowEmptyUrl = false): WebBrowserConfig {
  const url = allowEmptyUrl && !draft.url.trim() ? '' : normalizeWebsiteUrl(draft.url);
  if (draft.hops?.length) {
    if (draft.hop) throw new Error('Choose one connection or an ordered proxy chain.');
    if (draft.hops.length > 8) throw new Error('A proxy chain can contain at most 8 hops.');
    const route = draft.hops.map(hop => normalizeWebBrowserConfig({ url: draft.url, hop }, allowEmptyUrl).hop!);
    return { url, ...(route.length === 1 ? { hop: route[0] } : { hops: route }), profileId: draft.profileId, routeId: draft.routeId };
  }
  if (!draft.hop) return { url, profileId: draft.profileId, routeId: draft.routeId };
  const hop = draft.hop;
  if (!['http', 'https', 'socks4', 'socks5', 'ssh'].includes(hop.kind)) throw new Error('Unsupported hop type');
  const host = hop.host.trim();
  const port = hop.port;
  const error = 'Enter a proxy hostname or IP and a port from 1 to 65535.';
  if (!host || host.length > 253 || /[\s\x00-\x1f\x7f/\\@?#"'<>=]/.test(host)
    || !Number.isInteger(port) || port < 1 || port > 65535) throw new Error(error);
  let proxy: URL;
  try { proxy = new URL(`http://${host}:${port}`); } catch { throw new Error(error); }
  if (!proxy.hostname || Number(proxy.port || 80) !== port) throw new Error(error);
  if (hop.secret && !hop.username && hop.kind !== 'ssh') throw new Error('Proxy password requires a username');
  if (hop.kind === 'socks4' && (hop.username || hop.secret)) throw new Error('SOCKS4 credentials are not supported; use SOCKS5 for authentication');
  if (hop.kind === 'socks5' && (new TextEncoder().encode(hop.username).length > 255 || new TextEncoder().encode(hop.secret).length > 255)) throw new Error('SOCKS5 username and password must be at most 255 bytes.');
  if (hop.kind === 'ssh') {
    if (!hop.username.trim()) throw new Error('SSH username is required');
    if ((hop.authMode === 'password' && !hop.secret) || (hop.authMode === 'key' && !hop.keyPath.trim()) || !['password', 'key'].includes(hop.authMode)) throw new Error('SSH requires a password or private key path');
    if (!/^SHA256:[A-Za-z0-9+/]{43}$/.test(hop.hostKey)) throw new Error('A valid SSH server SHA256 fingerprint is required.');
  }
  return { url, hop: { ...hop, host: proxy.hostname }, profileId: draft.profileId, routeId: draft.routeId };
}

export function sameWebConnection(left: WebBrowserConfig, right: WebBrowserConfig): boolean {
  const identity = (config: WebBrowserConfig) => [config.profileId ?? '', config.routeId ?? '', getWebRoute(config).map(hop => [hop.kind, hop.host, hop.port, hop.username, hop.secret, hop.authMode, hop.keyPath, hop.hostKey])];
  return JSON.stringify(identity(left)) === JSON.stringify(identity(right));
}

export function getWebRoute(config: WebBrowserConfig): ProxyHop[] { return config.hops?.length ? config.hops : config.hop ? [config.hop] : []; }

export function webConnectionLabel(hop?: ProxyHop): string {
  return ({ http: 'HTTP proxy', https: 'HTTPS proxy (TLS to proxy)', socks4: 'SOCKS4 (no authentication)', socks5: 'SOCKS5 (remote DNS)', ssh: 'SSH tunnel' })[hop?.kind as ProxyHop['kind']] ?? 'Direct';
}

export function physicalBrowserBounds(rect: Pick<DOMRect, 'x' | 'y' | 'width' | 'height'>, scale: number): WebBrowserBounds | null {
  const values = [rect.x, rect.y, rect.width, rect.height, scale];
  if (values.some(value => !Number.isFinite(value)) || rect.x < 0 || rect.y < 0 || rect.width < 1 || rect.height < 1 || scale <= 0) return null;
  return { x: rect.x * scale, y: rect.y * scale, width: rect.width * scale, height: rect.height * scale };
}

export const getWebBrowserConfig = () => invoke<WebBrowserConfig>('web_browser_get_config');
export const getWebBrowserConnectionKey = (config: WebBrowserConfig) => invoke<string>('web_browser_connection_key', { config });
export const probeWebBrowserFingerprint = (hops: ProxyHop[], host: string, port: number) => invoke<string>('web_browser_probe_fingerprint', { config: normalizeWebBrowserConfig({ url: '', hops }, true), host, port });
export const getWebBrowserSettings = () => invoke<WebBrowserSettings>('web_browser_get_settings');
export const saveWebBrowserConfig = (config: WebBrowserConfig) => invoke<WebBrowserConfig>('web_browser_save_config', { config });
export const saveWebBrowserProfile = (id: string | undefined, name: string, config: WebBrowserConfig) => invoke<WebBrowserSettings>('web_browser_save_profile', { id: id ?? null, name, config });
export const deleteWebBrowserProfile = (id: string) => invoke<WebBrowserSettings>('web_browser_delete_profile', { id });
export const getWebBrowserHistory = () => invoke<WebHistoryEntry[]>('web_browser_get_history');
export const recordWebBrowserHistory = (sessionId: string) => invoke<WebHistoryEntry[]>('web_browser_record_history', { sessionId });
export const deleteWebBrowserHistory = (id?: string) => invoke<WebHistoryEntry[]>('web_browser_delete_history', { id: id ?? null });
export const openWebBrowser = (sessionId: string, config: WebBrowserConfig, bounds: WebBrowserBounds, replaceSessionId?: string) =>
  invoke<WebBrowserPage>('web_browser_open', { request: { sessionId, config, bounds, replaceSessionId: replaceSessionId ?? null } });
let viewportRevision = 0;
export const setWebBrowserViewport = (sessionId: string, bounds: WebBrowserBounds | null, visible: boolean) =>
  invoke<void>('web_browser_set_viewport', { sessionId, bounds, visible, revision: ++viewportRevision });
export const webBrowserAction = (sessionId: string, action: WebBrowserAction) => invoke<void>('web_browser_action', { sessionId, action });
export const navigateWebBrowser = (sessionId: string, url: string) => invoke<void>('web_browser_navigate', { sessionId, url });
export const getWebBrowserSnapshot = (sessionId: string) => invoke<WebBrowserPage | null>('web_browser_snapshot', { sessionId });
export const getWebBrowserPreview = (sessionId: string) => invoke<string | null>('web_browser_preview', { sessionId });
export const closeWebBrowser = (sessionId: string) => invoke<void>('web_browser_close', { sessionId });
