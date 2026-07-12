import { useCallback, useEffect, useState } from 'react';
import {
  proxyStatus, proxyStart, proxyStop,
  proxyGetConfig, proxySaveConfig,
  proxyAddBackend, proxyRemoveBackend,
  proxyGetLogs,
} from '../lib/tauri';
import type { ProxyBackend, ProxyConfig, ProxyLogEntry, ProxyStatus } from '../types';

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

export function ProxyPanel({ isInSidebar }: { isInSidebar?: boolean }) {
  const [status, setStatus] = useState<ProxyStatus | null>(null);
  const [config, setConfig] = useState<ProxyConfig | null>(null);
  const [logs, setLogs] = useState<ProxyLogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<SubTab>('config');
  const [showAdd, setShowAdd] = useState(false);
  const [nName, setNName] = useState(''); const [nUrl, setNUrl] = useState('');
  const [nKey, setNKey] = useState(''); const [nModel, setNModel] = useState('');

  const refresh = useCallback(async () => {
    const errs: string[] = [];
    try { setStatus(await proxyStatus()); } catch(e: any) { errs.push('status: '+String(e)); }
    try { setConfig(await proxyGetConfig()); } catch(e: any) { errs.push('config: '+String(e)); }
    try { setLogs(await proxyGetLogs()); } catch(e: any) { errs.push('logs: '+String(e)); }
    setError(errs.length ? errs.join(' | ') : null);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    if(subTab !== 'logs') return;
    const iv = setInterval(async () => { try { setLogs(await proxyGetLogs()); } catch{} }, 2000);
    return () => clearInterval(iv);
  }, [subTab]);

  const toggle = useCallback(async () => {
    try { if(status?.running) await proxyStop(); else await proxyStart(); await refresh(); }
    catch(e: any) { setError(String(e)); }
  }, [status, refresh]);

  const portCh = useCallback(async (p: number) => { if(!config) return; try { setConfig(await proxySaveConfig({...config, port: p})); } catch(e: any) { setError(String(e)); } }, [config]);
  const uaCh = useCallback(async (ua: string) => { if(!config) return; try { setConfig(await proxySaveConfig({...config, customUserAgent: ua||undefined})); } catch(e: any) { setError(String(e)); } }, [config]);

  const addBackend = useCallback(async () => {
    if(!nName||!nUrl||!nKey||!nModel) return;
    try { await proxyAddBackend({name:nName,url:nUrl,apiKey:nKey,model:nModel,weight:1,maxRetries:2,headers:{}}); setNName('');setNUrl('');setNKey('');setNModel('');setShowAdd(false); await refresh(); }
    catch(e: any) { setError(String(e)); }
  }, [nName,nUrl,nKey,nModel,refresh]);

  const rmBackend = useCallback(async (name: string) => { try { await proxyRemoveBackend(name); await refresh(); } catch(e: any) { setError(String(e)); } }, [refresh]);

  if(!config) return <div className="flex h-full items-center justify-center text-slate-500">Loading...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-6 pb-4">
        <div><h2 className="font-display text-lg uppercase tracking-widest text-cyber-neon">CliProxyAI</h2><p className="text-xs text-slate-400 mt-1">OpenAI-compatible API proxy</p></div>
        <div className="flex items-center gap-3">
          {status && (<span className={'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider '+(status.running?'bg-green-500/20 text-green-400 border border-green-500/30':'bg-slate-500/20 text-slate-400 border border-slate-500/30')}>{status.running?'Running':'Stopped'}</span>)}
          <button onClick={toggle} className={'flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold uppercase tracking-wider transition '+(status?.running?'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30':'bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/30 hover:bg-cyber-neon/30')}>{status?.running?<><StopIcon/>Stop</>:<><PlayIcon/>Start</>}</button>
        </div>
      </div>
      {status?.running && (<div className="flex gap-4 text-xs text-slate-400 bg-cyber-line/20 border-y border-cyber-line/30 px-6 py-2"><span>Port: <b className="text-cyber-electric">{status.port}</b></span><span>Backends: <b className="text-cyber-electric">{status.activeBackends}</b></span><span>Requests: <b className="text-cyber-electric">{status.totalRequests}</b></span></div>)}
      {error && (<div className="mx-6 mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">{error}<button onClick={()=>setError(null)} className="ml-2 underline text-xs">Dismiss</button></div>)}
      <div className="flex gap-1 px-6 pt-4 border-b border-cyber-line">
        {(['config','logs'] as SubTab[]).map(t=>(<button key={t} onClick={()=>setSubTab(t)} className={'px-4 py-2 text-xs font-semibold uppercase tracking-wider transition border-b-2 -mb-[1px] '+(subTab===t?'text-cyber-neon border-cyber-neon':'text-slate-500 border-transparent hover:text-slate-300')}>{t==='config'?'Config':'Logs'}{t==='logs'&&logs.length>0&&(<span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-cyber-line/40 text-slate-400">{logs.length}</span>)}</button>))}
        <div className="flex-1"/><button onClick={refresh} className="px-3 py-2 text-slate-500 hover:text-slate-300 transition"><RefreshIcon/></button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {subTab==='config'?(
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-display text-sm uppercase tracking-widest text-slate-300 border-b border-cyber-line pb-2">Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Port</label><input type="number" value={config.port} onChange={e=>portCh(Number(e.target.value))} className="w-full bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none" min={1024} max={65535}/></div>
                <div><label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">User-Agent</label><input type="text" value={config.customUserAgent??''} onChange={e=>uaCh(e.target.value)} className="w-full bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none" placeholder="CliProxyAI/1.0"/></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-cyber-line pb-2"><h3 className="font-display text-sm uppercase tracking-widest text-slate-300">Backends ({config.backends.length})</h3><button onClick={()=>setShowAdd(true)} className="flex items-center gap-1 text-xs text-cyber-neon hover:text-cyber-electric transition uppercase tracking-wider"><PlusIcon/>Add</button></div>
              {showAdd && (<div className="bg-cyber-line/10 border border-cyber-neon/30 rounded-lg p-4 space-y-3"><h4 className="text-xs uppercase tracking-widest text-cyber-neon">New Backend</h4><div className="grid grid-cols-2 gap-3"><input value={nName} onChange={e=>setNName(e.target.value)} placeholder="Name" className="bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none"/><input value={nUrl} onChange={e=>setNUrl(e.target.value)} placeholder="URL" className="bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none"/><input value={nKey} onChange={e=>setNKey(e.target.value)} placeholder="API Key" type="password" className="bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none"/><input value={nModel} onChange={e=>setNModel(e.target.value)} placeholder="Model" className="bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none"/></div><div className="flex gap-2 justify-end"><button onClick={()=>setShowAdd(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 uppercase tracking-wider">Cancel</button><button onClick={addBackend} disabled={!nName||!nUrl||!nKey||!nModel} className="px-3 py-1.5 text-xs bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/30 rounded hover:bg-cyber-neon/30 uppercase tracking-wider disabled:opacity-40">Save</button></div></div>)}
              {config.backends.length===0?<div className="text-center py-8 text-slate-500 text-sm">No backends.</div>:config.backends.map((b,i)=>(<div key={b.name} draggable onDragStart={e=>{e.dataTransfer.setData('text/plain',b.name)}} onDragOver={e=>e.preventDefault()} onDrop={async e=>{e.preventDefault();const from=e.dataTransfer.getData('text/plain');if(from!==b.name){const idx=config.backends.findIndex(x=>x.name===from);const newOrder=[...config.backends];const[item]=newOrder.splice(idx,1);const insIdx=newOrder.findIndex(x=>x.name===b.name);newOrder.splice(insIdx,0,item);try{setConfig(await proxySaveConfig({...config,backends:newOrder}));}catch{}}} } className="flex items-center gap-3 bg-cyber-line/10 border border-cyber-line/30 rounded-lg px-4 py-3 group hover:border-cyber-line/60 cursor-grab active:cursor-grabbing"><span className="text-[10px] text-slate-600 font-mono w-5">{i+1}</span><div className="flex-1 min-w-0"><div className="text-sm text-slate-200 font-semibold truncate">{b.name}</div><div className="text-xs text-slate-500 truncate">{b.model} @ {b.url}</div></div><div className="flex items-center gap-2"><input type="number" value={b.maxRetries||2} onChange={async e=>{const backends=[...config.backends];backends[i]={...b,maxRetries:Number(e.target.value)};try{setConfig(await proxySaveConfig({...config,backends}));}catch{}}} className="w-12 bg-cyber-base border border-cyber-line rounded px-1 py-0.5 text-[10px] text-slate-300 text-center focus:border-cyber-neon outline-none" title="Max retries" min={1} max={10}/><button onClick={()=>rmBackend(b.name)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition p-1"><TrashIcon/></button></div></div>))}
            </div>
            <div className="bg-cyber-line/5 border border-cyber-line/20 rounded-lg p-4"><h4 className="text-xs uppercase tracking-widest text-slate-400 mb-2">Usage</h4><code className="text-xs text-slate-500 block bg-cyber-base rounded p-2">curl http://127.0.0.1:{config.port}/v1/chat/completions</code></div>
          </div>
        ):(
          <LogsTab logs={logs}/>
        )}
      </div>
    </div>
  );
}

function LogsTab({ logs }: { logs: ProxyLogEntry[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  if(logs.length===0) return <div className="flex items-center justify-center h-40 text-slate-500 text-sm">No requests yet.</div>;

  const fmtJson = (s: string) => { try { return JSON.stringify(JSON.parse(s),null,2); } catch { return s; } };
  const preview = (e: ProxyLogEntry) => {
    if(!e.success) return e.errorMsg||'';
    try { const r=JSON.parse(e.responseJson); return r?.choices?.[0]?.message?.content?.substring(0,80)||''; } catch { return ''; }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3 px-2"><span>{logs.length} reqs</span><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"/>OK: {logs.filter(l=>l.success).length}</span><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"/>Fail: {logs.filter(l=>!l.success).length}</span></div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead><tr className="text-slate-400 uppercase tracking-wider border-b border-cyber-line/50"><th className="text-left px-2 py-2 w-16">Time</th><th className="text-left px-2 py-2 w-24">Backend</th><th className="text-left px-2 py-2 w-14">Status</th><th className="text-left px-2 py-2 w-14">Dur</th><th className="text-left px-2 py-2 w-18">Tokens</th><th className="text-left px-2 py-2">Response</th></tr></thead>
          <tbody>
            {logs.slice().reverse().map(e=>(
              <tr key={e.id} className="hover:bg-cyber-line/10">
                <td className="px-2 py-2 text-slate-500 font-mono align-top cursor-pointer" onClick={()=>setExpandedId(e.id===expandedId?null:e.id)}>{e.timestamp}</td>
                <td className="px-2 py-2 text-slate-300 font-medium truncate max-w-[100px] align-top cursor-pointer" onClick={()=>setExpandedId(e.id===expandedId?null:e.id)}>{e.backend}</td>
                <td className="px-2 py-2 align-top cursor-pointer" onClick={()=>setExpandedId(e.id===expandedId?null:e.id)}><span className={e.success?'text-green-400':'text-red-400'}>{e.status||'ERR'}</span></td>
                <td className="px-2 py-2 text-slate-500 font-mono align-top cursor-pointer" onClick={()=>setExpandedId(e.id===expandedId?null:e.id)}>{e.durationMs}ms</td>
                <td className="px-2 py-2 text-slate-500 font-mono align-top text-right cursor-pointer" onClick={()=>setExpandedId(e.id===expandedId?null:e.id)}>{e.totalTokens>0?<span title={'Prompt: '+e.promptTokens+' / Comp: '+e.completionTokens}>{e.totalTokens.toLocaleString()}</span>:'-'}</td>
                <td className="px-2 py-2 text-slate-400 truncate max-w-[350px] align-top cursor-pointer" onClick={()=>setExpandedId(e.id===expandedId?null:e.id)}>{preview(e)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {expandedId!==null && (()=>{
        const e = logs.find(l=>l.id===expandedId); if(!e) return null;
        return (
          <div className="mt-4 bg-cyber-base/80 border border-cyber-line/40 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between"><div className="flex gap-4 text-xs text-slate-500"><span>#{e.id}</span><span>{e.timestamp}</span><span className={e.success?'text-green-400':'text-red-400'}>{e.status||'ERR'} &middot; {e.durationMs}ms</span><span>Model: {e.model}</span>{e.totalTokens>0&&<span>Tokens: {e.totalTokens.toLocaleString()} (P:{e.promptTokens} C:{e.completionTokens})</span>}</div><button onClick={()=>setExpandedId(null)} className="text-slate-500 hover:text-slate-300 text-xs">Close</button></div>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="text-[10px] uppercase tracking-wider text-cyan-400 mb-1 font-semibold">Request</div><pre className="text-[11px] text-slate-300 bg-black/30 rounded p-3 overflow-auto max-h-64 whitespace-pre-wrap font-mono">{fmtJson(e.requestJson)}</pre></div>
              <div><div className="text-[10px] uppercase tracking-wider text-green-400 mb-1 font-semibold">Response</div><pre className="text-[11px] text-slate-300 bg-black/30 rounded p-3 overflow-auto max-h-64 whitespace-pre-wrap font-mono">{fmtJson(e.responseJson)}</pre></div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
