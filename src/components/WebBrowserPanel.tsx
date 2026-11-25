import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type Ref } from 'react';
import { isTauri } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { t as tr, tFeedback as trFeedback, useLocale } from '../i18n';
import { NEW_TERMINAL_EVENT, CYCLE_TERMINAL_EVENT } from '../lib/terminalShortcuts';
import { WebProxyChainEditor } from './WebProxyChainEditor';
import { WebMiniPlacementControl } from './WebMiniPanel';
import { DEFAULT_WEB_MINI, type WebMiniPreferences, type WebMiniTab, type WebBrowserController } from '../lib/webMini';
import { WebBrowserHistory } from './WebBrowserHistory';
import { useWebBrowserViewport } from '../hooks/useWebBrowserViewport';
import type { ProxyHop } from '../types';
import {
  closeWebBrowser, deleteWebBrowserHistory, deleteWebBrowserProfile, getWebBrowserHistory,
  getWebBrowserSettings, getWebBrowserSnapshot, getWebBrowserPreview, getWebBrowserConnectionKey, getWebRoute, navigateWebBrowser, normalizeWebBrowserConfig,
  openWebBrowser, physicalBrowserBounds, recordWebBrowserHistory, sameWebConnection,
  saveWebBrowserConfig, saveWebBrowserProfile, setWebBrowserViewport, webBrowserAction, webConnectionLabel,
  type WebBrowserAction, type WebBrowserConfig, type WebBrowserPage, type WebConnectionProfile, type WebHistoryEntry,
} from '../lib/webBrowser';

interface Tab {
  id: string; address: string; config: WebBrowserConfig; liveConfig?: WebBrowserConfig;
  profileName: string; page?: WebBrowserPage; pendingId?: string; operation?: string;
  busy: boolean; error: string; preview?: string;
}
const newTab = (config: WebBrowserConfig = { url: '' }, address = ''): Tab => ({ id: crypto.randomUUID(), address, config: { ...config, url: address }, profileName: '', busy: false, error: '' });
const message = (error: unknown) => error instanceof Error ? error.message : String(error);

export function WebBrowserPanel({ isVisible, onTabsChange, controllerRef, miniPreferences = DEFAULT_WEB_MINI, onMiniPreferencesChange }: {
  isVisible: boolean; onTabsChange?: (tabs: WebMiniTab[]) => void; controllerRef?: Ref<WebBrowserController>;
  miniPreferences?: WebMiniPreferences; onMiniPreferencesChange?: (value: WebMiniPreferences) => void;
}) {
  useLocale();
  const [tabs, setTabs] = useState<Tab[]>(() => [newTab()]);
  const tabsRef = useRef(tabs);
  const [activeId, setActiveId] = useState(tabs[0].id);
  const activeRef = useRef(activeId);
  const [profiles, setProfiles] = useState<WebConnectionProfile[]>([]);
  const profilesRef = useRef(profiles); profilesRef.current = profiles;
  const [history, setHistory] = useState<WebHistoryEntry[]>([]);
  const [historyError, setHistoryError] = useState('');
  const [panel, setPanel] = useState<'settings' | 'history' | null>(null);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const mounted = useRef(true);
  const visible = useRef(isVisible); visible.current = isVisible;
  const loadError = useRef('');
  const addressRef = useRef<HTMLInputElement>(null);
  const historyTimers = useRef(new Map<string, { signature: string; timer?: number }>());
  const launchRef = useRef<(id: string, address: string, config?: WebBrowserConfig) => Promise<void>>(async () => undefined);
  const addTabRef = useRef<(config?: WebBrowserConfig, address?: string, open?: boolean) => void>(() => undefined);

  const updateTabs = useCallback((update: (tabs: Tab[]) => Tab[]) => {
    const next = update(tabsRef.current); tabsRef.current = next; setTabs(next);
  }, []);
  const updateTab = useCallback((id: string, update: (tab: Tab) => Tab) => updateTabs(tabs => tabs.map(tab => tab.id === id ? update(tab) : tab)), [updateTabs]);
  const current = tabs.find(tab => tab.id === activeId) ?? tabs[0];
  const miniTabs = useMemo(() => tabs.map(tab => ({ id: tab.id, title: tab.page?.title || tab.address, url: tab.page?.url || tab.address, active: isVisible && tab.id === activeId, loading: tab.busy || !!tab.page?.loading, error: !!(tab.error || tab.page?.error), preview: tab.preview })), [tabs, activeId, isVisible]);
  useEffect(() => { onTabsChange?.(miniTabs); }, [miniTabs, onTabsChange]);
  const frameId = current.pendingId ?? current.page?.sessionId ?? current.id;
  const viewport = useWebBrowserViewport(frameId, isVisible, error => updateTab(activeRef.current, tab => ({ ...tab, error })));

  const scheduleHistory = useCallback((page: WebBrowserPage) => {
    if (page.loading || page.error || !page.url) return;
    const signature = JSON.stringify([page.navigationId, page.url, page.title]);
    const previous = historyTimers.current.get(page.sessionId);
    if (previous?.signature === signature) return;
    if (previous?.timer) clearTimeout(previous.timer);
    const timer = window.setTimeout(() => {
      void recordWebBrowserHistory(page.sessionId).then(entries => { if (mounted.current) setHistory(entries); })
        .catch(error => { if (mounted.current) setHistoryError(message(error)); });
    }, 500);
    historyTimers.current.set(page.sessionId, { signature, timer });
  }, []);
  const updatePage = useCallback((page: WebBrowserPage) => {
    if (!mounted.current) return;
    const match = tabsRef.current.find(tab => tab.pendingId === page.sessionId || tab.page?.sessionId === page.sessionId);
    if (!match) return;
    updateTab(match.id, tab => ({ ...tab, page, preview: tab.page?.navigationId === page.navigationId && tab.page.url === page.url ? tab.preview : undefined, address: activeRef.current === match.id && document.activeElement?.id === 'web-address' ? tab.address : page.url }));
    scheduleHistory(page);
  }, [scheduleHistory, updateTab]);

  useEffect(() => {
    mounted.current = true; let disposed = false;
    if (!isTauri()) { setReady(true); return; }
    void getWebBrowserSettings().then(settings => {
      if (disposed) return;
      setProfiles(settings.profiles);
      updateTabs(tabs => tabs.map((tab, index) => index === 0 && !tab.address && !tab.page && !tab.busy ? {
        ...tab, config: settings.current, address: settings.current.url,
        profileName: settings.profiles.find(profile => profile.id === settings.current.profileId)?.name ?? '',
      } : tab));
    }).catch(error => {
      if (!disposed) { loadError.current = message(error); updateTab(activeRef.current, tab => ({ ...tab, error: loadError.current })); }
    }).finally(() => { if (!disposed) setReady(true); });
    void getWebBrowserHistory().then(entries => { if (!disposed) setHistory(entries); }).catch(error => { if (!disposed) setHistoryError(message(error)); });
    const pageEvents = listen<WebBrowserPage>('web-browser-state', event => updatePage(event.payload));
    const popupEvents = listen<{ sourceSessionId: string; url: string }>('web-browser-new-tab', event => {
      const source = tabsRef.current.find(tab => tab.page?.sessionId === event.payload.sourceSessionId);
      if (source?.liveConfig) addTabRef.current(source.liveConfig, event.payload.url, true);
    });
    const shortcuts = listen<string>('web-browser-shortcut', event => {
      if (event.payload === 'newTerminal') window.dispatchEvent(new Event(NEW_TERMINAL_EVENT));
      else if (event.payload === 'palette') window.dispatchEvent(new Event('trigger-command-palette'));
      else if (event.payload === 'nextTerminal' || event.payload === 'previousTerminal') window.dispatchEvent(new CustomEvent(CYCLE_TERMINAL_EVENT, { detail: { step: event.payload === 'nextTerminal' ? 1 : -1 } }));
    });
    return () => {
      disposed = true; mounted.current = false;
      for (const entry of historyTimers.current.values()) if (entry.timer) clearTimeout(entry.timer);
      historyTimers.current.clear();
      for (const tab of tabsRef.current) for (const id of new Set([tab.pendingId, tab.page?.sessionId].filter((id): id is string => !!id))) void closeWebBrowser(id).catch(() => undefined);
      for (const subscription of [pageEvents, popupEvents, shortcuts]) void subscription.then(unlisten => unlisten()).catch(() => undefined);
    };
  }, [updatePage, updateTab, updateTabs]);

  useEffect(() => {
    if (!isVisible || !current.page || !isTauri()) return;
    let disposed = false, pending = false;
    const id = current.page.sessionId;
    const timer = window.setInterval(async () => {
      if (pending) return; pending = true;
      try { const page = await getWebBrowserSnapshot(id); if (!disposed && page) updatePage(page); }
      catch { /* Native events continue to supply navigation state. */ }
      finally { pending = false; }
    }, 1000);
    return () => { disposed = true; clearInterval(timer); };
  }, [current.page?.sessionId, isVisible, updatePage]);

  const activate = (id: string) => { if (!tabsRef.current.some(tab => tab.id === id)) return; activeRef.current = id; setActiveId(id); requestAnimationFrame(() => addressRef.current?.focus()); };
  const addTab = (config = current.config, address = '', open = false) => {
    if (tabsRef.current.length >= 32) { updateTab(activeRef.current, tab => ({ ...tab, error: 'Close a web tab before opening another.' })); return; }
    const tab = newTab(config, address);
    tab.profileName = profilesRef.current.find(profile => profile.id === config.profileId)?.name ?? '';
    updateTabs(tabs => [...tabs, tab]); activate(tab.id);
    if (open) queueMicrotask(() => void launchRef.current(tab.id, address, config));
  };
  addTabRef.current = addTab;
  const closeTab = (id: string) => {
    const old = tabsRef.current; const index = old.findIndex(tab => tab.id === id); const tab = old[index];
    if (!tab) return;
    for (const session of new Set([tab.pendingId, tab.page?.sessionId].filter((id): id is string => !!id))) {
      const timer = historyTimers.current.get(session)?.timer; if (timer) clearTimeout(timer);
      historyTimers.current.delete(session); void closeWebBrowser(session).catch(() => undefined);
    }
    let next = old.filter(tab => tab.id !== id);
    if (!next.length) next = [newTab({ ...tab.config, url: '' })];
    updateTabs(() => next);
    if (activeRef.current === id) activate(next[Math.min(index, next.length - 1)].id);
  };
  useImperativeHandle(controllerRef, () => ({ activate, close: closeTab, add: () => addTabRef.current() }));

  useEffect(() => {
    const page = current.page;
    if (!isVisible || !page || page.loading || miniPreferences.placement === 'hidden' || miniPreferences.display !== 'preview' || !isTauri()) return;
    let disposed = false, pending = false;
    const capture = async () => {
      if (pending) return; pending = true;
      try {
        const preview = await getWebBrowserPreview(page.sessionId);
        if (!disposed && preview) updateTab(current.id, tab => tab.page?.sessionId === page.sessionId && tab.page.navigationId === page.navigationId ? { ...tab, preview } : tab);
      } catch { /* Keep the last successful preview or the title/URL placeholder. */ }
      finally { pending = false; }
    };
    const first = window.setTimeout(() => void capture(), 500);
    const timer = window.setInterval(() => void capture(), 10000);
    return () => { disposed = true; clearTimeout(first); clearInterval(timer); };
  }, [current.id, current.page?.sessionId, current.page?.navigationId, current.page?.loading, isVisible, miniPreferences.placement, miniPreferences.display, updateTab]);

  const launch = async (id: string, address: string, override?: WebBrowserConfig) => {
    const tab = tabsRef.current.find(tab => tab.id === id);
    if (!tab || tab.busy || !ready) return;
    let config: WebBrowserConfig;
    try {
      if (!isTauri()) throw new Error('Open the CLX desktop app to browse websites.');
      if (loadError.current) throw new Error(loadError.current);
      config = normalizeWebBrowserConfig({ ...(override ?? tab.config), url: address });
    } catch (error) { updateTab(id, tab => ({ ...tab, error: message(error) })); return; }
    const navigate = !!tab.page && !!tab.liveConfig && sameWebConnection(tab.liveConfig, config);
    if (activeRef.current === id) setPanel(null);
    const operation = crypto.randomUUID();
    updateTab(id, current => ({ ...current, config, busy: true, error: '', operation, pendingId: navigate ? undefined : operation }));
    try {
      config = await saveWebBrowserConfig(config);
      if (!mounted.current || !tabsRef.current.some(tab => tab.id === id && tab.operation === operation)) return;
      if (navigate && tab.page) {
        await navigateWebBrowser(tab.page.sessionId, config.url);
        updateTab(id, tab => ({ ...tab, config, liveConfig: config, address: config.url }));
      } else {
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
        const node = viewport.current;
        const bounds = node ? physicalBrowserBounds(node.getBoundingClientRect(), devicePixelRatio) : null;
        if (!bounds) throw new Error('The Web viewport is not visible.');
        if (activeRef.current === id) await setWebBrowserViewport(operation, bounds, visible.current);
        const page = await openWebBrowser(operation, config, bounds, tab.page?.sessionId);
        if (!mounted.current || !tabsRef.current.some(tab => tab.id === id && tab.operation === operation)) { await closeWebBrowser(operation); return; }
        updateTab(id, tab => ({ ...tab, config, liveConfig: config, page, address: config.url, pendingId: undefined }));
        scheduleHistory(page);
      }
      setSaved(false);
      if (activeRef.current === id) setPanel(null);
    } catch (error) {
      if (!mounted.current) return;
      const previous = tab.page ? await getWebBrowserSnapshot(tab.page.sessionId).catch(() => null) : null;
      updateTab(id, current => current.operation === operation ? { ...current, error: message(error), page: previous ?? undefined, liveConfig: previous ? tab.liveConfig : undefined, pendingId: undefined } : current);
    } finally {
      if (mounted.current) updateTab(id, tab => tab.operation === operation ? { ...tab, busy: false, pendingId: undefined, operation: undefined } : tab);
    }
  };
  launchRef.current = launch;

  const changeRoute = (hops: ProxyHop[]) => {
    loadError.current = ''; setSaved(false);
    updateTab(current.id, tab => ({ ...tab, config: { ...tab.config, hop: hops.length === 1 ? hops[0] : undefined, hops: hops.length > 1 ? hops : undefined, routeId: crypto.randomUUID() }, error: '' }));
  };
  const chooseProfile = (id: string) => {
    loadError.current = ''; setSaved(false);
    if (id === 'direct') updateTab(current.id, tab => ({ ...tab, config: { url: tab.address }, profileName: '', error: '' }));
    else {
      const profile = profiles.find(profile => profile.id === id);
      if (profile) updateTab(current.id, tab => ({ ...tab, config: structuredClone(profile.config), address: profile.config.url || tab.address, profileName: profile.name, error: '' }));
    }
  };
  const saveProfile = async (asNew: boolean) => {
    try {
      if (!isTauri()) throw new Error('Open the CLX desktop app to browse websites.');
      const config = normalizeWebBrowserConfig({ ...current.config, url: current.address }, true);
      const settings = await saveWebBrowserProfile(asNew ? undefined : current.config.profileId, current.profileName, config);
      if (!mounted.current) return;
      setProfiles(settings.profiles); setSaved(true); loadError.current = '';
      updateTab(current.id, tab => ({ ...tab, config: settings.current, profileName: settings.profiles.find(profile => profile.id === settings.current.profileId)?.name ?? tab.profileName, error: '' }));
    } catch (error) { updateTab(current.id, tab => ({ ...tab, error: message(error) })); }
  };
  const deleteProfile = async () => {
    const id = current.config.profileId; if (!id) return;
    try {
      const settings = await deleteWebBrowserProfile(id); if (!mounted.current) return;
      setProfiles(settings.profiles); setSaved(false);
      updateTabs(tabs => tabs.map(tab => tab.config.profileId === id ? { ...tab, config: { ...tab.config, profileId: undefined, routeId: crypto.randomUUID() }, profileName: '' } : tab));
    } catch (error) { updateTab(current.id, tab => ({ ...tab, error: message(error) })); }
  };
  const action = async (action: WebBrowserAction) => {
    if (!current.page) return;
    try { updateTab(current.id, tab => ({ ...tab, error: '' })); await webBrowserAction(current.page.sessionId, action); }
    catch (error) { updateTab(current.id, tab => ({ ...tab, error: message(error) })); }
  };
  const removeHistory = async (id?: string) => {
    try { const entries = await deleteWebBrowserHistory(id); if (mounted.current) { setHistory(entries); setHistoryError(''); } }
    catch (error) { setHistoryError(message(error)); }
  };
  const openHistory = async (entry: WebHistoryEntry) => {
    const tabId = current.id;
    try {
    let config: WebBrowserConfig;
    if (entry.profileId) {
      const profile = profiles.find(profile => profile.id === entry.profileId);
      if (!profile) { updateTab(current.id, tab => ({ ...tab, address: entry.url, error: 'This history entry uses a deleted connection profile. Choose a connection before opening it.' })); return; }
      config = profile.config;
    } else if (entry.connectionKind === 'direct') config = { url: entry.url };
    else if (await getWebBrowserConnectionKey(current.config) === entry.routeKey) config = current.config;
    else { updateTab(current.id, tab => ({ ...tab, address: entry.url, error: 'Choose the connection used for this history entry.' })); return; }
    updateTab(tabId, tab => ({ ...tab, address: entry.url, config }));
    await launch(tabId, entry.url, config);
    } catch (error) { updateTab(tabId, tab => ({ ...tab, error: message(error) })); }
  };

  const page = current.page;
  const button = 'h-8 shrink-0 rounded border border-cyber-line px-2.5 text-xs text-slate-300 transition hover:border-cyber-electric hover:text-cyber-electric disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyber-electric';
  const selectedProfile = current.config.profileId && profiles.some(profile => profile.id === current.config.profileId) ? current.config.profileId : getWebRoute(current.config).length ? 'custom' : 'direct';
  const liveRoute = getWebRoute(current.liveConfig ?? current.config);
  return <section data-web-browser-root data-web-browser-session={page?.sessionId} data-web-active-tab={current.id} className="flex h-full min-h-0 flex-col overflow-hidden bg-cyber-base text-slate-200" aria-label={tr('Web Browser')}>
    <div className="flex shrink-0 items-center gap-1 border-b border-cyber-line bg-cyber-panel px-2 pt-1">
      <div role="tablist" aria-label={tr('Web tabs')} className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
        {tabs.map(tab => <div key={tab.id} className={`flex w-48 min-w-[120px] max-w-[220px] shrink-0 items-center rounded-t border border-b-0 ${tab.id === activeId ? 'border-cyber-line bg-cyber-base' : 'border-transparent text-slate-400 hover:bg-cyber-base/50'}`}>
          <button type="button" role="tab" aria-selected={tab.id === activeId} data-web-tab={tab.id} onClick={() => activate(tab.id)} title={tab.address} className="min-w-0 flex-1 truncate px-3 py-2 text-left text-xs">{tab.busy || tab.page?.loading ? '◌ ' : ''}{tab.page?.title || tab.address || tr('New tab')}</button>
          <button type="button" data-web-tab-close={tab.id} aria-label={tr('Close web tab')} title={tr('Close web tab')} onClick={() => closeTab(tab.id)} className="mr-1 rounded px-1.5 text-slate-500 hover:bg-rose-400/10 hover:text-rose-300">×</button>
        </div>)}
      </div>
      <button type="button" data-web-new-tab onClick={() => addTab()} aria-label={tr('New web tab')} title={tr('New web tab')} className="mb-1 shrink-0 rounded px-3 py-1 text-lg text-slate-400 hover:bg-cyber-electric/10 hover:text-cyber-electric">+</button>
    </div>
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-cyber-line bg-cyber-panel px-3 py-2">
      <button type="button" className={button} onClick={() => void action('back')} disabled={!page || current.busy} title={tr('Back')} aria-label={tr('Back')}>←</button>
      <button type="button" className={button} onClick={() => void action('forward')} disabled={!page || current.busy} title={tr('Forward')} aria-label={tr('Forward')}>→</button>
      <button type="button" className={button} onClick={() => void action(page?.loading ? 'stop' : 'reload')} disabled={!page || current.busy} title={tr(page?.loading ? 'Stop loading' : 'Reload website')} aria-label={tr(page?.loading ? 'Stop loading' : 'Reload website')}>{page?.loading ? '■' : '↻'}</button>
      <form className="flex min-w-[180px] flex-1 gap-2" onSubmit={event => { event.preventDefault(); void launch(current.id, current.address); }}>
        <label className="sr-only" htmlFor="web-address">{tr('Website address')}</label>
        <input ref={addressRef} id="web-address" value={current.address} onChange={event => updateTab(current.id, tab => ({ ...tab, address: event.target.value }))} onKeyDown={event => { if (event.key === 'Enter' && !event.nativeEvent.isComposing) { event.preventDefault(); void launch(current.id, current.address); } }} className="h-8 min-w-0 flex-1 rounded border border-cyber-line bg-cyber-base px-3 text-xs text-slate-200 outline-none focus:border-cyber-electric" placeholder={tr('Website URL')} autoCapitalize="off" autoCorrect="off" spellCheck={false} />
        <button type="submit" data-web-go className={button} disabled={!ready || current.busy || !current.address.trim()}>{tr(current.busy ? 'Opening website…' : 'Go')}</button>
      </form>
      <select id="web-profile-select" aria-label={tr('Connection profile')} value={selectedProfile} onChange={event => chooseProfile(event.target.value)} className="h-8 max-w-[190px] rounded border border-cyber-line bg-cyber-base px-2 text-xs text-slate-300">
        <option value="direct">{tr('Direct')}</option>
        {getWebRoute(current.config).length > 0 && !current.config.profileId && <option value="custom">{tr('Current connection')}</option>}
        {profiles.map(profile => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
      </select>
      <button type="button" className={button} aria-expanded={panel === 'settings'} aria-controls="web-proxy-settings" onClick={() => setPanel(panel === 'settings' ? null : 'settings')}>{tr('Connection settings')}</button>
      <button type="button" data-web-history-toggle className={button} aria-expanded={panel === 'history'} onClick={() => setPanel(panel === 'history' ? null : 'history')}>{tr('History')}</button>
      {onMiniPreferencesChange && <WebMiniPlacementControl value={miniPreferences} onChange={onMiniPreferencesChange} />}
    </div>
    {panel === 'settings' && <form id="web-proxy-settings" className="max-h-[48vh] shrink-0 space-y-3 overflow-y-auto border-b border-cyber-line bg-cyber-panel/60 p-3" onSubmit={event => { event.preventDefault(); void launch(current.id, current.address); }}>
      <div className="max-w-3xl space-y-3">
        <WebProxyChainEditor config={current.config} onChange={changeRoute} />
        <label className="block text-xs text-slate-400" htmlFor="web-profile-name">{tr('Profile name')}
          <input id="web-profile-name" value={current.profileName} onChange={event => { setSaved(false); updateTab(current.id, tab => ({ ...tab, profileName: event.target.value })); }} className="mt-1 w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyber-electric" placeholder={tr('Name this connection')} maxLength={80} />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" disabled={!ready || current.busy || !current.address.trim()} className="rounded border border-cyber-electric bg-cyber-electric/15 px-4 py-2 text-xs font-semibold text-cyber-electric disabled:opacity-40">{tr('Open website')}</button>
          <button type="button" data-web-profile-save onClick={() => void saveProfile(false)} disabled={!ready || current.busy} className={button}>{tr('Save profile')}</button>
          {current.config.profileId && <><button type="button" data-web-profile-save-new onClick={() => void saveProfile(true)} disabled={current.busy} className={button}>{tr('Save as new profile')}</button><button type="button" data-web-profile-delete onClick={() => void deleteProfile()} disabled={current.busy} className={button}>{tr('Delete profile')}</button></>}
          {saved && <span role="status" className="text-[11px] text-emerald-400">{tr('Connection profile saved.')}</span>}
        </div>
      </div>
    </form>}
    {(current.error || page?.error) && <div role="alert" className="shrink-0 border-b border-rose-400/30 bg-rose-400/10 px-4 py-2 text-xs text-rose-300">{trFeedback(current.error || page?.error || '')}</div>}
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-cyber-line/40 px-3 py-1.5 text-[10px] text-slate-400">
      <span className="min-w-0 truncate" title={page?.url}>{current.busy || page?.loading ? tr('Loading website…') : page?.title || tr('Web Browser')}</span>
      <span data-web-connection className="shrink-0">{page?.download ? tr('Downloaded: {name}', { name: page.download }) : liveRoute.length > 1 ? tr('Proxy chain ({count} hops)', { count: liveRoute.length }) : tr(webConnectionLabel(liveRoute[0]))}</span>
    </div>
    <div className="flex min-h-0 flex-1">
      <div ref={viewport} data-web-browser-viewport className="relative min-h-[120px] min-w-0 flex-1 overflow-hidden bg-white">
        {!page && <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-3 bg-cyber-base px-8 text-center">
          <svg aria-hidden="true" className="h-12 w-12 text-cyber-electric/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 6.5h14M5 17.5h14" /></svg>
          <h2 className="text-base font-semibold text-slate-200">{tr(current.busy ? 'Opening website…' : 'Enter a website and press Enter')}</h2>
          <p className="max-w-md text-xs leading-relaxed text-slate-400">{tr('Browse directly, or choose a saved connection. Proxy and SSH settings are optional.')}</p>
          {!isTauri() && <p className="text-xs text-amber-300">{tr('Open the CLX desktop app to browse websites.')}</p>}
        </div>}
      </div>
      {panel === 'history' && <WebBrowserHistory entries={history} error={historyError} onOpen={entry => void openHistory(entry)} onDelete={id => void removeHistory(id)} onClear={() => void removeHistory()} onClose={() => setPanel(null)} />}
    </div>
  </section>;
}
