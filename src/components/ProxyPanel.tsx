import { tFeedback as trFeedback, t as tr, useLocale, getIntlLocale } from '../i18n';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import {
  proxyStatus, proxyStart, proxyStop,
  proxyGetConfig, proxySaveConfig,
  proxyAddBackend, proxyRemoveBackend,
  proxyGetLogs, proxyGetUsage, proxyResetUsage,
} from '../lib/tauri';
import type { ProxyBackend, ProxyConfig, ProxyLogEntry, ProxyStatus, ProxyBackendUsage } from '../types';

const LOGS_PER_PAGE = 10;

type CopyKey = `request:${number}` | `response:${number}`;

function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
    return Promise.resolve(false);
  }
  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false);
}

function PlayIcon() {
  return (<svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/></svg>);
}
function StopIcon() {
  return (<svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M4.5 4.5h15v15h-15z"/></svg>);
}
function PlusIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>);
}
function TrashIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>);
}
function RefreshIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>);
}

type SubTab = 'config' | 'logs';
import { ProxyHopEditor } from './ProxyHopEditor';
import type { ProxyHop } from '../types';

export function ProxyPanel({ isInSidebar }: { isInSidebar?: boolean }) {
  const [status, setStatus] = useState<ProxyStatus | null>(null);
  const [config, setConfig] = useState<ProxyConfig | null>(null);
  const [logs, setLogs] = useState<ProxyLogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<SubTab>('config');
  const [showAdd, setShowAdd] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [nName, setNName] = useState(''); const [nUrl, setNUrl] = useState('');
  const [nKey, setNKey] = useState(''); const [nModel, setNModel] = useState('');
  const [nUa, setNUa] = useState('');
  const [nHop, setNHop] = useState<ProxyHop | undefined>();
  const [nEnableRtk, setNEnableRtk] = useState(false);
  const [nEnablePonytail, setNEnablePonytail] = useState(false);
  const [nReasoningEffort, setNReasoningEffort] = useState<string>('');
  const [usageMap, setUsageMap] = useState<Record<string, ProxyBackendUsage>>({});
  const [resetConfirmId, setResetConfirmId] = useState<string | null>(null);

  const loadUsage = useCallback(async () => {
    if (!config) return;
    const map: Record<string, ProxyBackendUsage> = {};
    for (const b of config.backends) {
      if (b.id) {
        try {
          map[b.id] = await proxyGetUsage(b.id);
        } catch {}
      }
    }
    setUsageMap(map);
  }, [config]);

  useEffect(() => {
    loadUsage();
  }, [config, loadUsage]);

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    listen<string>('proxy-usage-updated', async (event) => {
      const id = event.payload;
      try {
        const usage = await proxyGetUsage(id);
        setUsageMap(prev => ({ ...prev, [id]: usage }));
      } catch {}
    }).then(fn => {
      unlisten = fn;
    });
    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  // Listen for deep-link sub-tab selection (from Dashboard logs click)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === 'logs' || detail === 'config') setSubTab(detail);
    };
    window.addEventListener('proxy-select-subtab', handler);
    return () => window.removeEventListener('proxy-select-subtab', handler);
  }, []);

  const handleResetUsage = useCallback(async (id: string) => {
    try {
      await proxyResetUsage(id);
      setResetConfirmId(null);
    } catch (e: any) {
      setError(String(e));
    }
  }, []);

  const resetForm = () => { setNHop(undefined);setNName('');setNUrl('');setNKey('');setNModel('');setNUa('');setNReasoningEffort('');setNEnableRtk(false);setNEnablePonytail(false);setShowAdd(false);setEditingIdx(null); };
  const loadBackend = (b: ProxyBackend, idx: number) => { setNHop(b.hop);setNName(b.name);setNUrl(b.url);setNKey(b.apiKey);setNModel(b.model);setNUa(b.customUserAgent||'');setNReasoningEffort(b.reasoningEffort||'');setNEnableRtk(b.enableRtk||false);setNEnablePonytail(b.enablePonytail||false);setShowAdd(false);setEditingIdx(idx); };

  const refresh = useCallback(async () => {
    const errs: string[] = [];
    try { setStatus(await proxyStatus()); } catch(e: any) { errs.push('status: '+String(e)); }
    try { setConfig(await proxyGetConfig()); } catch(e: any) { errs.push('config: '+String(e)); }
    try { setLogs(await proxyGetLogs()); } catch(e: any) { errs.push('logs: '+String(e)); }
    setError(errs.length ? errs.join(' | ') : null);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    if (isInSidebar) {
      const iv = setInterval(async () => { try { setLogs(await proxyGetLogs()); } catch{} }, 3000);
      return () => clearInterval(iv);
    }
    if (subTab !== 'logs') return;
    const iv = setInterval(async () => { try { setLogs(await proxyGetLogs()); } catch{} }, 2000);
    return () => clearInterval(iv);
  }, [subTab, isInSidebar]);

  const toggle = useCallback(async () => {
    try { if(status?.running) await proxyStop(); else await proxyStart(); await refresh(); }
    catch(e: any) { setError(String(e)); }
  }, [status, refresh]);

  const portCh = useCallback(async (p: number) => { if(!config) return; try { setConfig(await proxySaveConfig({...config, port: p})); } catch(e: any) { setError(String(e)); } }, [config]);

  const addBackend = useCallback(async () => {
    if(!nName||!nUrl||!nKey||!nModel) return;
    try {
      if (editingIdx !== null && config) {
        const backends = [...config.backends];
        backends[editingIdx] = {
          ...backends[editingIdx],
          hop: nHop,
          name:nName, url:nUrl, apiKey:nKey, model:nModel,
          customUserAgent: nUa || undefined,
          enableRtk: nEnableRtk,
          enablePonytail: nEnablePonytail,
          reasoningEffort: (nReasoningEffort as any) || undefined,
        };
        await proxySaveConfig({...config, backends});
      } else {
        await proxyAddBackend({
          hop: nHop,
          name:nName,url:nUrl,apiKey:nKey,model:nModel,weight:1,maxRetries:2,headers:{},
          customUserAgent:nUa||undefined,enableRtk:nEnableRtk,enablePonytail:nEnablePonytail,
          reasoningEffort:(nReasoningEffort as any)||undefined,
        });
      }
      resetForm(); await refresh();
    }
    catch(e: any) { setError(String(e)); }
  }, [nName,nUrl,nKey,nModel,nUa,nHop,nEnableRtk,nEnablePonytail,nReasoningEffort,editingIdx,config,refresh]);

  const duplicateBackend = useCallback(async (b: ProxyBackend) => {
    if (!config) return;
    try {
      const newName = `${b.name} (Copy)`;
      const newBackend: ProxyBackend = {
        ...b,
        id: undefined,
        name: newName,
      };
      await proxyAddBackend(newBackend);
      await refresh();
    } catch (e: any) {
      setError(String(e));
    }
  }, [config, refresh]);

  const rmBackend = useCallback(async (name: string) => { try { await proxyRemoveBackend(name); await refresh(); } catch(e: any) { setError(String(e)); } }, [refresh]);

  if(!config) return <div className="flex h-full items-center justify-center text-slate-500">{tr("Loading...")}</div>;

  if (isInSidebar) {
    return (
      <div className="h-full flex flex-col p-4 space-y-4 overflow-y-auto">
        <div className="border-b border-cyber-line pb-2">
          <h2 className="font-display text-sm uppercase tracking-widest text-cyber-neon font-bold">CliProxyAI</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">{tr("API proxy configurations")}</p>
        </div>
        
        {/* Toggle Status */}
        <div className="flex items-center justify-between rounded-lg border border-cyber-line bg-cyber-base/40 p-3 text-xs">
          <div>
            <span className="font-semibold text-slate-200 block">{tr("Status")}</span>
            {status && (
              <span className={`text-[10px] uppercase font-mono font-bold ${status.running ? 'text-green-400' : 'text-slate-400'}`}>
                {status.running ? tr("Running") : tr("Stopped")}
              </span>
            )}
          </div>
          <button
            onClick={toggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition ${
              status?.running
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                : 'bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/30 hover:bg-cyber-neon/30'
            }`}
          >
            {status?.running ? <StopIcon /> : <PlayIcon />}
            {status?.running ? tr("Stop") : tr("Start")}
          </button>
        </div>

        {/* Port */}
        <div className="space-y-3 rounded-lg border border-cyber-line bg-cyber-base/40 p-3 text-xs">
          <h3 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{tr("Server Settings")}</h3>
          <div className="space-y-3">
            <label className="block space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-500">{tr("Port")}</span>
              <input
                type="number"
                value={config.port}
                onChange={e => portCh(Number(e.target.value))}
                className="w-full bg-cyber-base border border-cyber-line rounded px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyber-neon outline-none"
                min={1024}
                max={65535}
              />
            </label>
          </div>
        </div>

        {/* Small Logs Summary */}
        <div className="flex-1 flex flex-col min-h-[220px] border border-cyber-line/50 rounded-lg p-3 bg-cyber-base/20 overflow-hidden">
          <div className="flex justify-between items-center border-b border-cyber-line/30 pb-2 mb-2">
            <h3 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{tr("Request Logs")}</h3>
            <button onClick={refresh} className="text-slate-500 hover:text-slate-300"><RefreshIcon /></button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin text-[10px] font-mono leading-tight">
            {logs.length === 0 ? (
              <div className="text-slate-500 italic text-center py-4">{tr("No requests yet.")}</div>
            ) : (
              logs.slice().reverse().map(l => (
                <div key={l.id} className="flex justify-between items-start gap-1 p-1 rounded hover:bg-cyber-line/10">
                  <span className="text-slate-500 shrink-0">{l.timestamp.split(' ')[1] || l.timestamp}</span>
                  <span className="text-slate-300 truncate max-w-[80px]">{l.backend}</span>
                  <span className={l.success ? 'text-green-400' : 'text-red-400'}>{l.status || tr("ERR")}</span>
                  <span className="text-slate-500 text-[9px]">{l.durationMs}ms</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN VIEW RENDER ---
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h2 className="font-display text-lg uppercase tracking-widest text-cyber-neon">{tr("CliProxyAI Backend Configuration")}</h2>
          <p className="text-xs text-slate-400 mt-1">{tr("Manage upstream AI backend servers and monitor logs")}</p>
        </div>
        <div className="flex items-center gap-3">
          {status && (<span className={'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider '+(status.running?'bg-green-500/20 text-green-400 border border-green-500/30':'bg-slate-500/20 text-slate-400 border border-slate-500/30')}>{status.running?tr("Running"):tr("Stopped")}</span>)}
          <button onClick={toggle} className={'flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold uppercase tracking-wider transition '+(status?.running?'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30':'bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/30 hover:bg-cyber-neon/30')}>{status?.running?<><StopIcon/>{tr("Stop")}</>:<><PlayIcon/>{tr("Start")}</>}</button>
        </div>
      </div>

      {status?.running && (
        <div className="flex gap-4 text-xs text-slate-400 bg-cyber-line/20 border-y border-cyber-line/30 px-6 py-2">
          <span>{tr("Port: ")}<b className="text-cyber-electric">{status.port}</b></span>
          <span>{tr("Active Backends: ")}<b className="text-cyber-electric">{status.activeBackends}</b></span>
          <span>{tr("Total Requests: ")}<b className="text-cyber-electric">{status.totalRequests}</b></span>
        </div>
      )}

      {error && (
        <div className="mx-6 mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
          {trFeedback(error ?? '')}
          <button onClick={()=>setError(null)} className="ml-2 underline text-xs">{tr("Dismiss")}</button>
        </div>
      )}

      <div className="flex gap-1 px-6 pt-4 border-b border-cyber-line">
        {(['config','logs'] as SubTab[]).map(t=>(<button key={t} onClick={()=>setSubTab(t)} className={'px-4 py-2 text-xs font-semibold uppercase tracking-wider transition border-b-2 -mb-[1px] '+(subTab===t?'text-cyber-neon border-cyber-neon':'text-slate-500 border-transparent hover:text-slate-300')}>{t==='config'?tr("Backend Configurations"):tr("Detailed Logs & Inspector")}{t==='logs'&&logs.length>0&&(<span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-cyber-line/40 text-slate-400">{logs.length}</span>)}</button>))}
        <div className="flex-1"/><button onClick={refresh} className="px-3 py-2 text-slate-500 hover:text-slate-300 transition"><RefreshIcon/></button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {subTab==='config'?(
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column: Backend servers configurations */}
              <div className="col-span-2 space-y-4">
                <div className="flex items-center justify-between border-b border-cyber-line pb-2">
                  <h3 className="font-display text-sm uppercase tracking-widest text-slate-300">{tr("Upstream Backend Servers (")}{config.backends.length})</h3>
                  <button onClick={()=>{resetForm();setShowAdd(true);}} className="flex items-center gap-1 text-xs text-cyber-neon hover:text-cyber-electric transition uppercase tracking-wider"><PlusIcon/>{tr("Add Backend")}</button>
                </div>

                {(showAdd || editingIdx !== null) && (
                  <div className="bg-cyber-line/10 border border-cyber-neon/30 rounded-lg p-4 space-y-3">
                    <h4 className="text-xs uppercase tracking-widest text-cyber-neon">{editingIdx !== null ? tr("Edit Upstream Server") : tr("New Upstream Server")}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <input value={nName} onChange={e=>setNName(e.target.value)} placeholder={tr("Name (e.g. OpenAI)")} className="bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none"/>
                      <input value={nUrl} onChange={e=>setNUrl(e.target.value)} placeholder={tr("Endpoint URL (e.g. https://api.openai.com/v1)")} className="bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none"/>
                      <input value={nKey} onChange={e=>setNKey(e.target.value)} placeholder={tr("API Key")} type="password" className="bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none"/>
                      <input value={nModel} onChange={e=>setNModel(e.target.value)} placeholder={tr("Model identifier (e.g. gpt-4o)")} className="bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none"/>
                      <input value={nUa} onChange={e=>setNUa(e.target.value)} placeholder={tr("User-Agent (optional, e.g. CliProxyAI/1.0)")} className="bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none"/>
                      <select
                        value={nReasoningEffort}
                        onChange={e => setNReasoningEffort(e.target.value)}
                        className="bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none"
                      >
                        <option value="">{tr("Reasoning Effort: Default (None)")}</option>
                        <option value="low">{tr("Reasoning Effort: low")}</option>
                        <option value="medium">{tr("Reasoning Effort: medium")}</option>
                        <option value="high">{tr("Reasoning Effort: high")}</option>
                        <option value="xhigh">{tr("Reasoning Effort: xhigh")}</option>
                        <option value="max">{tr("Reasoning Effort: max")}</option>
                      </select>
                      
                      <label className="col-span-2 flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={nEnableRtk}
                          onChange={e => setNEnableRtk(e.target.checked)}
                          className="rounded border-cyber-line bg-cyber-base text-cyber-neon focus:ring-cyber-neon accent-cyber-neon"
                        />
                        <span className="text-xs text-slate-200 font-medium flex items-center gap-1">
                          ⚡ <span className="text-cyber-electric font-semibold">{tr("Enable RTK Token Compression")}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{tr("(Cắt 60–90% token output command)")}</span>
                        </span>
                      </label>

                      <label className="col-span-2 flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={nEnablePonytail}
                          onChange={e => setNEnablePonytail(e.target.checked)}
                          className="rounded border-cyber-line bg-cyber-base text-cyber-neon focus:ring-cyber-neon accent-cyber-neon"
                        />
                        <span className="text-xs text-slate-200 font-medium flex items-center gap-1">
                          👱‍♂️ <span className="text-purple-300 font-semibold">{tr("Enable Ponytail Anti-Bloat")}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{tr("(Lazy Senior Dev System Prompt Injector)")}</span>
                        </span>
                      </label>
                    </div>
                    <ProxyHopEditor value={nHop} onChange={setNHop} />
                    <div className="flex gap-2 justify-end">
                      <button onClick={resetForm} className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 uppercase tracking-wider">{tr("Cancel")}</button>
                      <button onClick={addBackend} disabled={!nName||!nUrl||!nKey||!nModel} className="px-3 py-1.5 text-xs bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/30 rounded hover:bg-cyber-neon/30 uppercase tracking-wider disabled:opacity-40">{editingIdx !== null ? tr("Update") : tr("Save Backend")}</button>
                    </div>
                  </div>
                )}

                {config.backends.length===0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm">{tr("No backend servers configured. Requests will return error.")}</div>
                ) : (
                  config.backends.map((b,i)=>(
                    <div
                      key={b.name}
                      draggable
                      onDragStart={e=>{e.dataTransfer.setData('text/plain',b.name)}}
                      onDragOver={e=>e.preventDefault()}
                      onDrop={async e=>{
                        e.preventDefault();
                        const from=e.dataTransfer.getData('text/plain');
                        if(from!==b.name){
                          const idx=config.backends.findIndex(x=>x.name===from);
                          const newOrder=[...config.backends];
                          const[item]=newOrder.splice(idx,1);
                          const insIdx=newOrder.findIndex(x=>x.name===b.name);
                          newOrder.splice(insIdx,0,item);
                          try{setConfig(await proxySaveConfig({...config,backends:newOrder}));}catch{}
                        }
                      }}
                      className="flex items-center gap-3 bg-cyber-line/10 border border-cyber-line/30 rounded-lg px-4 py-3 group hover:border-cyber-line/60 cursor-grab active:cursor-grabbing"
                    >
                      <span className="text-[10px] text-slate-600 font-mono w-5">{i+1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-slate-200 font-semibold truncate">{b.name}</div>
                          {b.enableRtk && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5" title={tr("RTK Token Compression Enabled")}>
                              ⚡ RTK
                            </span>
                          )}
                          {b.enablePonytail && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-0.5" title={tr("Ponytail Anti-Bloat Enabled")}>
                              👱‍♂️ Ponytail
                            </span>
                          )}
                          {b.reasoningEffort && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-0.5" title={tr("Reasoning Effort: {v0}", { v0: tr(b.reasoningEffort) })}>
                              🧠 {b.reasoningEffort}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 truncate">{b.model} @ {b.url}</div>
                        <div className="text-xs text-cyber-neon">{tr("Hop: ")}{b.hop ? b.hop.kind.toUpperCase() : tr("Direct")}</div>
                        {b.customUserAgent && <div className="text-[10px] text-cyber-neon/60 truncate">UA: {b.customUserAgent}</div>}
                        
                        {/* Durable Usage Statistics */}
                        {b.id && usageMap[b.id] && (
                          <div className="mt-2 space-y-0.5 border-t border-cyber-line/20 pt-1.5 text-[10px] text-slate-400 font-mono">
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                              <span>{tr("Prompt: ")}<span className="text-slate-200">{usageMap[b.id].promptTokens.toLocaleString(getIntlLocale())}</span></span>
                              <span>{tr("Completion: ")}<span className="text-slate-200">{usageMap[b.id].completionTokens.toLocaleString(getIntlLocale())}</span></span>
                              <span>{tr("Total: ")}<span className="text-cyber-electric font-bold">{usageMap[b.id].totalTokens.toLocaleString(getIntlLocale())}</span></span>
                            </div>
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-slate-500">
                              <span>{tr("Requests: ")}<span className="text-slate-300">{usageMap[b.id].reportedRequests}</span></span>
                              {usageMap[b.id].unreportedRequests > 0 && (
                                <span className="text-amber-400 font-semibold" title={tr("Success requests without reported usage")}>{tr("Unreported: ")}{usageMap[b.id].unreportedRequests}*
                                </span>
                              )}
                              {usageMap[b.id].resetAt && (
                                <span>{tr("Reset: ")}{new Date(usageMap[b.id].resetAt).toLocaleDateString(getIntlLocale())} {new Date(usageMap[b.id].resetAt).toLocaleTimeString(getIntlLocale())}</span>
                              )}
                            </div>
                            {usageMap[b.id].unreportedRequests > 0 && (
                              <div className="text-[9px] text-amber-500/80 italic mt-0.5">{tr("* Totals are incomplete: unreported requests found.")}</div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={async ()=>{const n=[...config.backends];if(i>0){[n[i-1],n[i]]=[n[i],n[i-1]];try{setConfig(await proxySaveConfig({...config,backends:n}));}catch{}}}}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 transition p-1 disabled:opacity-10" title={tr("Move up")} disabled={i===0}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5"/></svg>
                        </button>
                        <button onClick={async ()=>{const n=[...config.backends];if(i<config.backends.length-1){[n[i],n[i+1]]=[n[i+1],n[i]];try{setConfig(await proxySaveConfig({...config,backends:n}));}catch{}}}}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 transition p-1 disabled:opacity-10" title={tr("Move down")} disabled={i===config.backends.length-1}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>
                        </button>
                        <span className="text-[10px] text-slate-500 font-semibold">{tr("Max Retries:")}</span>
                        <input
                          type="number"
                          value={b.maxRetries||2}
                          onChange={async e=>{
                            const backends=[...config.backends];
                            backends[i]={...b,maxRetries:Number(e.target.value)};
                            try{setConfig(await proxySaveConfig({...config,backends}));}catch{}
                          }}
                          className="w-12 bg-cyber-base border border-cyber-line rounded px-1 py-0.5 text-[10px] text-slate-300 text-center focus:border-cyber-neon outline-none"
                          min={1}
                          max={10}
                        />
                        <button onClick={() => duplicateBackend(b)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-cyber-electric transition p-1" title={tr("Duplicate Backend")}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v9.25c0 .621-.504 1.125-1.125 1.125Z"/></svg>
                        </button>
                        <button onClick={()=>loadBackend(b,i)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-cyber-neon transition p-1" title={tr("Edit")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.86 3.49a2.2 2.2 0 1 1 3.11 3.11L8 18.57l-4 1 1-4 11.86-12.08Z"/></svg></button>
                        {b.id && (
                          <button onClick={()=>setResetConfirmId(b.id!)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-amber-400 transition p-1" title={tr("Reset Usage")}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
                          </button>
                        )}
                        <button onClick={()=>rmBackend(b.name)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition p-1"><TrashIcon/></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Right Column: Server settings and Usage */}
              <div className="col-span-1 space-y-6">
                <div className="rounded-xl border border-cyber-line/50 bg-cyber-panel/40 p-4 space-y-4">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">{tr("Server Settings")}</h3>
                  <div className="space-y-4">
                    <label className="block space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400">{tr("Port")}</span>
                      <input
                        type="number"
                        value={config.port}
                        onChange={e => portCh(Number(e.target.value))}
                        className="w-full bg-cyber-base border border-cyber-line rounded px-3 py-2 text-xs text-slate-200 focus:border-cyber-neon outline-none font-mono"
                        min={1024}
                        max={65535}
                      />
                    </label>
                  </div>
                </div>

                <div className="bg-cyber-line/5 border border-cyber-line/20 rounded-lg p-4 space-y-2">
                  <h4 className="text-xs uppercase tracking-widest text-slate-400">{tr("Usage Example")}</h4>
                  <code className="text-[10px] text-cyber-neon block bg-cyber-base rounded p-2 overflow-x-auto scrollbar-none font-mono select-all">
                    curl http://127.0.0.1:{config.port}/v1/chat/completions
                  </code>
                </div>

                <div className="rounded-xl border border-cyber-line/30 bg-cyber-base/20 p-4 text-xs leading-relaxed text-slate-400 space-y-2">
                  <div className="font-bold text-slate-300 flex items-center gap-1.5">
                    <span>💡</span>{tr(" API Proxy Server")}</div>
                  <p>{tr("All API requests sent to port ")}<span className="text-cyber-neon font-mono font-bold">{config.port}</span>{tr(" will be load-balanced and proxy-passed to the active backends.")}</p>
                </div>
              </div>
            </div>
          </div>
        ):(
          <LogsTab logs={logs}/>
        )}
      </div>
      
      {/* Usage Reset Confirmation Modal */}
      {resetConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-cyber-line/80 bg-cyber-panel p-6 shadow-2xl space-y-4">
            <h3 className="font-display text-sm uppercase tracking-widest text-amber-400 font-bold">{tr("Confirm Reset Usage")}</h3>
            <p className="text-xs text-slate-300">{tr("Are you sure you want to reset the accumulated token usage for this backend to zero? This action cannot be undone.")}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setResetConfirmId(null)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 uppercase tracking-wider">{tr("Cancel")}</button>
              <button onClick={() => handleResetUsage(resetConfirmId)} className="px-3 py-1.5 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded hover:bg-amber-500/30 uppercase tracking-wider">{tr("Reset Usage")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LogsTab({ logs }: { logs: ProxyLogEntry[] }) {
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copyState, setCopyState] = useState<{ key: CopyKey; status: 'copied' | 'failed' } | null>(null);

  // Logs are stored oldest -> newest on the wire; present newest first.
  const orderedLogs = useMemo(() => logs.slice().reverse(), [logs]);
  const pageCount = Math.max(1, Math.ceil(orderedLogs.length / LOGS_PER_PAGE));

  useEffect(() => {
    setPage((current) => {
      if (current < 1) return 1;
      if (current > pageCount) return pageCount;
      return current;
    });
  }, [pageCount]);

  useEffect(() => {
    if (!copyState) return;
    const timer = window.setTimeout(() => setCopyState(null), 1500);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  const pageLogs = useMemo(() => {
    const start = (page - 1) * LOGS_PER_PAGE;
    return orderedLogs.slice(start, start + LOGS_PER_PAGE);
  }, [orderedLogs, page]);

  useEffect(() => {
    if (expandedId === null) return;
    if (!pageLogs.some((entry) => entry.id === expandedId)) {
      setExpandedId(null);
    }
  }, [expandedId, pageLogs]);

  const goToPage = useCallback(
    (next: number) => {
      setPage(next);
      setExpandedId(null);
    },
    [],
  );

  const handleRowToggle = useCallback(
    (id: number, source: 'button' | 'selection' | 'row') => {
      if (source === 'button') return;
      if (source === 'selection') return;
      setExpandedId((current) => (current === id ? null : id));
    },
    [],
  );

  const handleCopy = useCallback(
    async (key: CopyKey, text: string) => {
      const ok = await copyToClipboard(text);
      setCopyState({ key, status: ok ? 'copied' : 'failed' });
    },
    [],
  );

  const fmtJson = (s: string) => {
    try { return JSON.stringify(JSON.parse(s), null, 2); } catch { return s; }
  };

  const requestText = (e: ProxyLogEntry) => fmtJson(e.requestJson);

  const responseText = (e: ProxyLogEntry) => {
    if (e.normalizedResponseJson) return fmtJson(e.normalizedResponseJson);
    if (e.responseJson) return fmtJson(e.responseJson);
    if (!e.success && e.errorMsg) return e.errorMsg;
    return '';
  };

  const preview = (e: ProxyLogEntry) => {
    if (!e.success) return e.errorMsg || '';
    try { const r = JSON.parse(e.normalizedResponseJson || e.responseJson); return r?.choices?.[0]?.message?.content?.substring(0, 80) || ''; } catch { return ''; }
  };

  const copyButtonLabel = (key: CopyKey): string => {
    if (copyState && copyState.key === key) {
      return copyState.status === 'copied' ? 'Copied' : 'Copy failed';
    }
    return 'Copy';
  };

  const renderSections = (entry: ProxyLogEntry) => {
    let parsed: any;
    try { parsed = JSON.parse(entry.normalizedResponseJson || entry.responseJson); } catch { return null; }
    const renderBlock = (label: string, content: string) => (
      <div key={label} className="mb-2">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5 font-semibold">{tr(label)}</div>
        <pre className="text-[11px] text-slate-300 bg-black/30 rounded p-2.5 overflow-auto max-h-48 whitespace-pre-wrap font-mono select-text" onClick={(e) => e.stopPropagation()}>{content || tr("(empty)")}</pre>
      </div>
    );
    const sections: React.ReactNode[] = [];

    const choices = parsed?.choices;
    if (choices && Array.isArray(choices)) {
      choices.forEach((choice: any, ci: number) => {
        const msg = choice?.message || {};
        // Content
        if (msg.content) sections.push(renderBlock(choices.length > 1 ? `Content #${ci}` : 'Content', String(msg.content)));
        // Reasoning — handle all common+provider-specific pattern but dedupe
        const reasoningKeys = ['reasoning', 'reasoning_content', 'reasoning_text', 'reasoning_details'];
        for (const key of reasoningKeys) {
          if (msg[key]) sections.push(renderBlock(key, String(msg[key])));
        }
        // Provider-specific reasoning / thinking fields (exclude duplicates from the explicit list above)
        const alreadyRendered = new Set(reasoningKeys);
        for (const key of Object.keys(msg)) {
          if ((key.startsWith('reasoning_') || key.startsWith('thinking')) && msg[key] && !alreadyRendered.has(key)) {
            sections.push(renderBlock(key, String(msg[key])));
          }
        }
        // Tool calls
        if (msg.tool_calls || msg.function_call) {
          sections.push(renderBlock('Tool Calls', fmtJson(JSON.stringify(msg.tool_calls || msg.function_call))));
        }
        // Finish reason
        if (choice.finish_reason) {
          sections.push(renderBlock('Finish Reason', String(choice.finish_reason)));
        }
        // Other message fields
        const known = new Set(['content', ...reasoningKeys, 'tool_calls', 'function_call', 'role']);
        const otherMsgFields = Object.keys(msg).filter((k) => !known.has(k) && !k.startsWith('reasoning_') && !k.startsWith('thinking'));
        if (otherMsgFields.length > 0) {
          const other: Record<string, any> = {};
          for (const k of otherMsgFields) other[k] = msg[k];
          sections.push(renderBlock('Other', fmtJson(JSON.stringify(other))));
        }
      });
    }

    // Usage
    if (parsed?.usage) {
      sections.push(renderBlock('Usage', fmtJson(JSON.stringify(parsed.usage))));
    }

    // Other top-level fields
    const topKnown = new Set(['id', 'object', 'created', 'model', 'choices', 'usage', 'system_fingerprint']);
    const otherTop: Record<string, any> = {};
    for (const k of Object.keys(parsed)) {
      if (!topKnown.has(k)) otherTop[k] = parsed[k];
    }
    if (Object.keys(otherTop).length > 0) {
      sections.push(renderBlock('Other', fmtJson(JSON.stringify(otherTop))));
    }

    return sections.length > 0 ? <>{sections}</> : null;
  };

  if (logs.length === 0) {
    return <div className="flex items-center justify-center h-40 text-slate-500 text-sm">{tr("No requests yet.")}</div>;
  }

  return (
    <div className="p-4 select-none">
      <div className="flex items-center justify-between gap-4 text-xs text-slate-500 mb-3 px-2">
        <div className="flex items-center gap-4">
          <span>{logs.length}{tr(" reqs")}</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400" />{tr("OK: ")}{logs.filter((l) => l.success).length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400" />{tr("Fail: ")}{logs.filter((l) => !l.success).length}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <button
            type="button"
            onClick={() => goToPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="px-2 py-0.5 rounded border border-cyber-line/60 text-slate-300 hover:border-cyber-neon hover:text-cyber-neon transition disabled:opacity-30 disabled:cursor-not-allowed"
          >{tr("Previous")}</button>
          <span className="text-slate-400">{tr("Page ")}{page} / {pageCount}</span>
          <button
            type="button"
            onClick={() => goToPage(Math.min(pageCount, page + 1))}
            disabled={page >= pageCount}
            className="px-2 py-0.5 rounded border border-cyber-line/60 text-slate-300 hover:border-cyber-neon hover:text-cyber-neon transition disabled:opacity-30 disabled:cursor-not-allowed"
          >{tr("Next")}</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-400 uppercase tracking-wider border-b border-cyber-line/50">
              <th className="text-left px-2 py-2 w-16">{tr("Time")}</th>
              <th className="text-left px-2 py-2 w-24">{tr("Backend")}</th>
              <th className="text-left px-2 py-2 w-14">{tr("Status")}</th>
              <th className="text-left px-2 py-2 w-14">{tr("Dur")}</th>
              <th className="text-left px-2 py-2 w-18">{tr("Tokens")}</th>
              <th className="text-left px-2 py-2">{tr("Response")}</th>
            </tr>
          </thead>
          <tbody>
            {pageLogs.map((e) => {
              const isExpanded = expandedId === e.id;
              const requestKey: CopyKey = `request:${e.id}`;
              const responseKey: CopyKey = `response:${e.id}`;
              return (
                <Fragment key={e.id}>
                  <tr
                    className={`hover:bg-cyber-line/10 ${isExpanded ? 'bg-cyber-line/10' : ''}`}
                    onClick={() => handleRowToggle(e.id, 'row')}
                    onMouseUp={(event) => {
                      if (window.getSelection && window.getSelection()?.toString()) {
                        event.stopPropagation();
                      }
                    }}
                  >
                    <td className="px-2 py-2 text-slate-500 font-mono align-top">{e.timestamp}</td>
                    <td className="px-2 py-2 text-slate-300 font-medium truncate max-w-[100px] align-top">{e.backend}</td>
                    <td className="px-2 py-2 align-top">
                      <span className={e.success ? 'text-green-400' : 'text-red-400'}>{e.status || tr("ERR")}</span>
                    </td>
                    <td className="px-2 py-2 text-slate-500 font-mono align-top">{e.durationMs}ms</td>
                    <td className="px-2 py-2 text-slate-500 font-mono align-top text-right">
                      {e.totalTokens > 0 ? (
                        <span title={tr("Prompt: {v0} / Comp: {v1}", { v0: String(e.promptTokens), v1: String(e.completionTokens) })}>
                          {e.totalTokens.toLocaleString(getIntlLocale())}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-2 py-2 text-slate-400 truncate max-w-[350px] align-top">{preview(e)}</td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-cyber-base/80 border-y border-cyber-line/40">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
                            <div className="flex gap-4 flex-wrap">
                              <span>#{e.id}</span>
                              <span>{e.timestamp}</span>
                              <span className={e.success ? 'text-green-400' : 'text-red-400'}>
                                {e.status || tr("ERR")} &middot; {e.durationMs}ms
                              </span>
                              <span>{tr("Model: ")}{e.model}</span>
                              {e.totalTokens > 0 && (
                                <span>{tr("Tokens: ")}{e.totalTokens.toLocaleString(getIntlLocale())}{tr(" (P:")}{e.promptTokens}{tr(" C:")}{e.completionTokens})</span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={(event) => { event.stopPropagation(); handleRowToggle(e.id, 'button'); }}
                              className="text-slate-500 hover:text-slate-300 text-xs"
                            >{tr("Close")}</button>
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-semibold">{tr("Request")}</span>
                                <button
                                  type="button"
                                  onClick={(event) => { event.stopPropagation(); void handleCopy(requestKey, requestText(e)); }}
                                  className={`text-[10px] px-2 py-0.5 rounded border transition ${
                                    copyState && copyState.key === requestKey
                                      ? copyState.status === 'copied' ? 'border-green-500/60 text-green-400' : 'border-red-500/60 text-red-400'
                                      : 'border-cyber-line/60 text-slate-400 hover:border-cyber-neon hover:text-cyber-neon'
                                  }`}
                                >{tr(copyButtonLabel(requestKey))}</button>
                              </div>
                              <pre
                                className="text-[11px] text-slate-300 bg-black/30 rounded p-3 overflow-auto max-h-64 whitespace-pre-wrap font-mono select-text"
                                onClick={(e) => e.stopPropagation()}
                              >{requestText(e)}</pre>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] uppercase tracking-wider text-green-400 font-semibold">{tr("Response")}</span>
                                <button
                                  type="button"
                                  onClick={(event) => { event.stopPropagation(); void handleCopy(responseKey, responseText(e)); }}
                                  className={`text-[10px] px-2 py-0.5 rounded border transition ${
                                    copyState && copyState.key === responseKey
                                      ? copyState.status === 'copied' ? 'border-green-500/60 text-green-400' : 'border-red-500/60 text-red-400'
                                      : 'border-cyber-line/60 text-slate-400 hover:border-cyber-neon hover:text-cyber-neon'
                                  }`}
                                >{tr(copyButtonLabel(responseKey))}</button>
                              </div>
                              {e.normalizedResponseJson ? (
                                <div className="space-y-1 max-h-[32rem] overflow-y-auto scrollbar-thin select-text" onClick={(e) => e.stopPropagation()}>
                                  {renderSections(e)}
                                  <details className="mt-2">
                                    <summary className="text-[10px] text-slate-500 cursor-pointer hover:text-slate-300 select-none">{tr("Raw ")}{e.responseTruncated && <span className="text-amber-400">{tr("(256 KiB truncated)")}</span>}</summary>
                                    <pre className="text-[11px] text-slate-400 bg-black/20 rounded p-2.5 mt-1 overflow-auto max-h-48 whitespace-pre-wrap font-mono select-text" onClick={(e) => e.stopPropagation()}>{e.responseJson || tr("(empty)")}</pre>
                                  </details>
                                </div>
                              ) : (
                                <pre
                                  className="text-[11px] text-slate-300 bg-black/30 rounded p-3 overflow-auto max-h-64 whitespace-pre-wrap font-mono select-text"
                                  onClick={(e) => e.stopPropagation()}
                                >{responseText(e)}</pre>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
