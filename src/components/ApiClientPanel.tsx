import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getApiClientStore,
  subscribe,
  setMethod,
  setUrl,
  setHeaders,
  setParams,
  setBody,
  setActiveTab,
  setCurlInput,
  setCopied,
  getFullUrl,
  sendRequest,
  abortRequest,
  runBenchmark,
  stopBenchmark,
  setRunnerConcurrency,
  setRunnerMode,
  setRunnerTotal,
  setRunnerDurationSec,
  nextId,
  type ApiClientState,
  type KeyValue,
  type HttpMethod,
} from '../lib/api-client-store';
import type { ApiHistoryEntry } from '../lib/api-history';
import { METHOD_COLORS } from '../lib/api-history';

// ---------------------------------------------------------------------------
// Custom hook: subscribes to store, returns current state
// ---------------------------------------------------------------------------

function useApiClientStore(): ApiClientState {
  const [snap, setSnap] = useState<ApiClientState>(getApiClientStore());
  useEffect(() => subscribe(() => setSnap(getApiClientStore())), []);
  return snap;
}

// ---------------------------------------------------------------------------
// Curl parser
// ---------------------------------------------------------------------------

function parseCurl(curl: string): {
  url: string;
  method: HttpMethod;
  headers: KeyValue[];
  body: string;
  params: KeyValue[];
} | null {
  const s = curl.trim();
  if (!s.startsWith('curl ')) return null;

  const isCmd = s.indexOf('^') >= 0 && s.indexOf('^"') >= 0;
  let normalized = s;
  if (isCmd) {
    normalized = normalized.replace(/\^\s*\n\s*/g, ' ');
    normalized = normalizeCmdQuoting(normalized);
  } else {
    normalized = normalized.replace(/\\\s*\n\s*/g, ' ');
  }

  const tokens = tokenize(normalized);
  let method: HttpMethod = 'GET';
  let url = '';
  const headers: KeyValue[] = [];
  let body = '';
  let ti = 1; // skip 'curl'

  // Find URL by http:// pattern
  let urlTokenIdx = -1;
  for (let ui = 0; ui < tokens.length; ui++) {
    if (tokens[ui].startsWith('http://') || tokens[ui].startsWith('https://')) {
      url = tokens[ui];
      urlTokenIdx = ui;
      break;
    }
  }
  if (!url) {
    while (ti < tokens.length) {
      if (!tokens[ti].startsWith('-')) { url = tokens[ti]; break; }
      ti++;
    }
  }

  // Parse flags
  while (ti < tokens.length) {
    if (ti === urlTokenIdx) { ti++; continue; }
    const flag = tokens[ti];
    if (flag === '-X' || flag === '--request') {
      ti++;
      if (ti === urlTokenIdx) ti++;
      if (ti < tokens.length) {
        const m = tokens[ti].toUpperCase();
        if (['GET','POST','PUT','DELETE','PATCH','HEAD','OPTIONS'].includes(m)) method = m as HttpMethod;
        ti++;
      }
    } else if (flag === '-H' || flag === '--header') {
      ti++;
      if (ti === urlTokenIdx) ti++;
      if (ti < tokens.length) {
        const val = tokens[ti];
        const colonIdx = val.indexOf(':');
        if (colonIdx > 0) {
          headers.push({ id: crypto.randomUUID(), key: val.slice(0, colonIdx).trim(), value: val.slice(colonIdx + 1).trim(), enabled: true });
        }
        ti++;
      }
    } else if (flag === '-b' || flag === '--cookie') {
      ti++;
      if (ti === urlTokenIdx) ti++;
      if (ti < tokens.length) {
        const rawCookie = tokens[ti];
        if (!rawCookie.includes('=') || rawCookie.startsWith('@')) {
          // likely a cookie jar file, skip
        } else {
          headers.push({ id: crypto.randomUUID(), key: 'Cookie', value: rawCookie, enabled: true });
        }
        ti++;
      }
    } else if (flag === '-d' || flag === '--data' || flag === '--data-raw' || flag === '--data-binary') {
      ti++;
      if (ti === urlTokenIdx) ti++;
      if (ti < tokens.length) {
        body = tokens[ti];
        if (method === 'GET') method = 'POST';
        ti++;
      }
    } else { ti++; }
  }

  // Parse URL params
  const params: KeyValue[] = [];
  const qIdx = url.indexOf('?');
  const baseUrl = qIdx >= 0 ? url.slice(0, qIdx) : url;
  if (qIdx >= 0) {
    url.slice(qIdx + 1).split('&').forEach((pair) => {
      const eqIdx = pair.indexOf('=');
      if (eqIdx >= 0) {
        const k = decodeURIComponent(pair.slice(0, eqIdx));
        const v = decodeURIComponent(pair.slice(eqIdx + 1));
        if (k) params.push({ id: crypto.randomUUID(), key: k, value: v, enabled: true });
      } else if (pair) {
        params.push({ id: crypto.randomUUID(), key: pair, value: '', enabled: true });
      }
    });
  }

  return { url: baseUrl, method, headers, body, params };
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < input.length) {
    if (input[i] === ' ' || input[i] === '\t' || input[i] === '\n' || input[i] === '\r') { i++; continue; }
    if (input[i] === "'") {
      i++;
      let tok = '';
      while (i < input.length && input[i] !== "'") { tok += input[i]; i++; }
      if (i < input.length) i++;
      tokens.push(tok);
    } else if (input[i] === '"') {
      i++;
      let tok = '';
      while (i < input.length && input[i] !== '"') {
        if (input[i] === '\\' && i + 1 < input.length) { tok += input[i + 1]; i += 2; }
        else { tok += input[i]; i++; }
      }
      if (i < input.length) i++;
      tokens.push(tok);
    } else {
      let tok = '';
      while (i < input.length && input[i] !== ' ' && input[i] !== '\t' && input[i] !== '\n' && input[i] !== '\r') { tok += input[i]; i++; }
      tokens.push(tok);
    }
  }
  return tokens;
}

function normalizeCmdQuoting(s: string): string {
  let out = '';
  let i = 0;
  while (i < s.length) {
    if (s[i] === '^' && i + 1 < s.length && s[i + 1] === '"') {
      i += 2;
      let inner = '';
      while (i < s.length) {
        if (s[i] === '^' && i + 1 < s.length) {
          if (s[i + 1] === '"') { i += 2; break; }
          else { inner += s[i + 1]; i += 2; }
        } else { inner += s[i]; i++; }
      }
      inner = inner.replace(/(?<!\\)"/g, '\\"');
      out += '"' + inner + '"';
    } else if (s[i] === '^' && i + 1 < s.length) {
      out += s[i + 1];
      i += 2;
    } else { out += s[i]; i++; }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const httpStatusText = (code: number): string => {
  const map: Record<number, string> = {
    200: 'OK', 201: 'Created', 204: 'No Content',
    301: 'Moved', 302: 'Found', 304: 'Not Modified',
    400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found',
    405: 'Method Not Allowed', 408: 'Timeout', 409: 'Conflict',
    422: 'Unprocessable', 429: 'Rate Limited',
    500: 'Internal Server Error', 502: 'Bad Gateway', 503: 'Service Unavailable', 504: 'Gateway Timeout',
  };
  return map[code] || '';
};

const statusColor = (s: number) => {
  if (s >= 200 && s < 300) return 'text-green-400';
  if (s >= 300 && s < 400) return 'text-yellow-400';
  if (s >= 400) return 'text-red-400';
  return 'text-slate-400';
};

const fmtSize = (b: number) => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB';

const formatBody = (b: string) => { try { return JSON.stringify(JSON.parse(b), null, 2); } catch { return b; } };

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

// Simple inline SVGs
function ApiIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"/></svg>; }
function PlayIcon() { return <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/></svg>; }
function PlusIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>; }
function TrashSmallIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>; }
function LoaderSpinner() { return <svg className="animate-spin h-4 w-4 text-cyber-electric" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>; }
function CopyIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/></svg>; }
function PrettyIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.499 5.882v8.236m0 0a2.25 2.25 0 1 0 4.5 0 2.25 2.25 0 0 0-4.5 0Zm0 0A2.25 2.25 0 0 1 6.75 12.25h1.5A2.25 2.25 0 0 0 10.5 10v-.118a2.25 2.25 0 0 1 4.5 0V10a2.25 2.25 0 0 0 2.25 2.25h1.5a2.25 2.25 0 0 1 2.25 2.25v0a2.25 2.25 0 0 1-4.5 0v0"/></svg>; }

// ---------------------------------------------------------------------------
// Sub-component: KeyValueRow
// ---------------------------------------------------------------------------

function KeyValueRow({ row, onChangeKey, onChangeValue, onToggle, onDelete }: {
  row: KeyValue;
  onChangeKey: (v: string) => void;
  onChangeValue: (v: string) => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" onClick={onToggle} className={"w-5 h-5 shrink-0 rounded text-[10px] flex items-center justify-center border transition " + (row.enabled ? 'bg-cyber-electric/20 border-cyber-electric/40 text-cyber-electric' : 'bg-transparent border-cyber-line/30 text-slate-600')} title="Toggle">{"\u2713"}</button>
      <input type="text" placeholder="Key" value={row.key} onChange={(e) => onChangeKey(e.target.value)} className={"flex-1 rounded border bg-cyber-base/50 px-2 py-1.5 text-[11px] text-slate-300 font-mono outline-none transition placeholder:text-slate-600 focus:border-cyber-neon/50 " + (row.enabled ? 'border-cyber-line/50' : 'border-cyber-line/20 opacity-50')} />
      <input type="text" placeholder="Value" value={row.value} onChange={(e) => onChangeValue(e.target.value)} className={"flex-1 rounded border bg-cyber-base/50 px-2 py-1.5 text-[11px] text-slate-300 font-mono outline-none transition placeholder:text-slate-600 focus:border-cyber-neon/50 " + (row.enabled ? 'border-cyber-line/50' : 'border-cyber-line/20 opacity-50')} />
      <button type="button" onClick={onDelete} className="w-5 h-5 shrink-0 flex items-center justify-center rounded text-slate-600 hover:text-red-400 transition"><TrashSmallIcon /></button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ApiClientPanel() {
  const st = useApiClientStore();

  // ── Resize state (local — UI only) ──
  const [responseHeight, setResponseHeight] = useState(250);
  const resizingRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const startHRef = useRef(0);

  // ── Full URL derived ──
  const fullUrl = useMemo(() => getFullUrl(), [st.url, st.params]);

  // ── Stable kv helpers ──
  const addRow = useCallback((rows: KeyValue[], setter: (v: KeyValue[]) => void) => {
    setter([...rows, { id: nextId(), key: '', value: '', enabled: true }]);
  }, []);

  const kvActionsRef = useRef({
    updateRow(rows: KeyValue[], setter: (v: KeyValue[]) => void, id: string, field: 'key' | 'value', value: string) {
      setter(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    },
    toggleRow(rows: KeyValue[], setter: (v: KeyValue[]) => void, id: string) {
      setter(rows.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
    },
    deleteRow(rows: KeyValue[], setter: (v: KeyValue[]) => void, id: string) {
      setter(rows.filter((r) => r.id !== id));
    },
  });

  // ── Keyboard shortcut ──
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); sendRequest(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // ── History selection listener ──
  useEffect(() => {
    const h = (e: Event) => {
      const ce = e as CustomEvent<ApiHistoryEntry>;
      const entry = ce.detail;
      if (!entry || !entry.url) return;
      setMethod(entry.method);
      const qIdx = entry.url.indexOf('?');
      setUrl(qIdx >= 0 ? entry.url.slice(0, qIdx) : entry.url);
      if (entry.headers?.length) setHeaders(entry.headers.map(h => ({ id: nextId(), ...h })));
      if (entry.params?.length) setParams(entry.params.map(p => ({ id: nextId(), ...p })));
      if (entry.body) setBody(entry.body);
      setActiveTab(entry.body ? 'body' : 'params');
    };
    window.addEventListener('apiclient-history-select', h);
    return () => window.removeEventListener('apiclient-history-select', h);
  }, []);

  // ── Resize handlers ──
  const onResizeDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    resizingRef.current = true;
    startYRef.current = e.clientY;
    startHRef.current = responseHeight;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  }, [responseHeight]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!resizingRef.current) return;
      const delta = startYRef.current - e.clientY;
      const panelH = panelRef.current?.clientHeight || 600;
      const newH = Math.max(80, Math.min(panelH - 150, startHRef.current + delta));
      setResponseHeight(newH);
    };
    const onUp = () => {
      if (!resizingRef.current) return;
      resizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  // ── Copy ──
  const copyResponse = useCallback(async () => {
    if (!st.response?.body) return;
    try { await navigator.clipboard.writeText(st.response.body); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  }, [st.response]);

  const copyBodyToClipboard = useCallback(async () => {
    try { await navigator.clipboard.writeText(st.body); } catch {}
  }, [st.body]);

  // ── Curl parse ──
  const handlePasteCurl = useCallback(() => {
    if (!st.curlInput.trim()) return;
    const parsed = parseCurl(st.curlInput);
    if (!parsed) return;
    setMethod(parsed.method);
    setUrl(parsed.url);
    if (parsed.headers.length > 0) setHeaders(parsed.headers);
    if (parsed.params.length > 0) setParams(parsed.params);
    if (parsed.body) { try { setBody(JSON.stringify(JSON.parse(parsed.body), null, 2)); } catch { setBody(parsed.body); } }
    setCurlInput('');
    setActiveTab(parsed.body ? 'body' : 'params');
  }, [st.curlInput]);

  // ── Pretty body ──
  const prettyBody = useCallback(() => { try { setBody(JSON.stringify(JSON.parse(st.body), null, 2)); } catch {} }, [st.body]);

  // ── Runner stats ──
  const runnerStats = st.runner.stats;

  // ── Render ──
  return (
    <div ref={panelRef} className="flex h-full flex-col bg-cyber-base overflow-hidden relative">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-cyber-line p-3 bg-cyber-base/70">
        <h2 className="font-display text-xs uppercase tracking-[0.2em] text-cyber-neon font-bold flex items-center gap-2"><ApiIcon />API Client</h2>
        <span className="text-[9px] text-slate-500 ml-auto font-mono">Ctrl+Enter to send</span>
      </div>

      {/* Curl paste */}
      <div className="flex shrink-0 gap-2 border-b border-cyber-line/50 bg-cyber-panel/20 px-3 py-2">
        <input type="text" placeholder="Paste curl command here..." value={st.curlInput} onChange={(e) => setCurlInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handlePasteCurl(); }} className="flex-1 rounded border border-cyber-line bg-cyber-base/50 px-2.5 py-1 text-[11px] text-slate-300 font-mono outline-none placeholder:text-slate-600 focus:border-cyber-neon/50 transition" />
        <button type="button" onClick={handlePasteCurl} disabled={!st.curlInput.trim()} className="shrink-0 rounded border border-cyber-neon/40 bg-cyber-neon/10 px-3 py-1 text-[10px] font-semibold text-cyber-neon transition hover:bg-cyber-neon/20 disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-wider">Parse Curl</button>
      </div>

      {/* URL bar */}
      <div className="flex shrink-0 gap-0 border-b border-cyber-line px-3 py-2.5">
        <select value={st.method} onChange={(e) => setMethod(e.target.value as HttpMethod)} className="h-9 rounded-l-md border border-cyber-line bg-cyber-base px-2.5 text-[12px] font-bold uppercase text-slate-200 outline-none appearance-none pr-7 cursor-pointer focus:border-cyber-neon/50 transition" style={{ color: METHOD_COLORS[st.method] }}>{METHODS.map((m) => (<option key={m} value={m} style={{ color: METHOD_COLORS[m] }}>{m}</option>))}</select>
        <input type="text" placeholder="https://api.example.com/v1/endpoint" value={st.url} onChange={(e) => setUrl(e.target.value)} className="h-9 flex-1 border-y border-cyber-line bg-cyber-base px-2.5 text-[12px] text-slate-200 font-mono outline-none placeholder:text-slate-600 focus:border-cyber-neon/50 transition" />
        {st.isLoading ? (
          <button type="button" onClick={abortRequest} className="h-9 shrink-0 rounded-r-md border border-red-500/40 bg-red-500/10 px-4 text-[11px] font-bold text-red-400 uppercase tracking-wider hover:bg-red-500/20 transition"><LoaderSpinner /></button>
        ) : (
          <button type="button" onClick={sendRequest} disabled={!st.url.trim()} className="h-9 shrink-0 rounded-r-md border border-cyber-electric/40 bg-cyber-electric/10 px-4 text-[11px] font-bold text-cyber-electric uppercase tracking-wider transition hover:bg-cyber-electric/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"><PlayIcon />Send</button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 border-b border-cyber-line">
        {(['params', 'headers', 'body', 'runner'] as const).map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={"px-4 py-2 text-[11px] font-semibold uppercase tracking-wider transition border-b-2 -mb-[1px] " + (st.activeTab === tab ? 'text-cyber-electric border-cyber-electric' : 'text-slate-500 border-transparent hover:text-slate-300')}>
            {tab === 'params' ? 'Params' : tab === 'headers' ? 'Headers' : tab === 'body' ? 'Body' : 'Runner'}
          </button>
        ))}
      </div>

      {/* ── Request area ── */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {st.activeTab !== 'body' && st.activeTab !== 'runner' && (
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {(st.activeTab === 'params' ? st.params : st.headers).map((row) => (
              <KeyValueRow key={row.id} row={row}
                onChangeKey={(v) => kvActionsRef.current.updateRow(st.activeTab === 'params' ? st.params : st.headers, st.activeTab === 'params' ? setParams : setHeaders, row.id, 'key', v)}
                onChangeValue={(v) => kvActionsRef.current.updateRow(st.activeTab === 'params' ? st.params : st.headers, st.activeTab === 'params' ? setParams : setHeaders, row.id, 'value', v)}
                onToggle={() => kvActionsRef.current.toggleRow(st.activeTab === 'params' ? st.params : st.headers, st.activeTab === 'params' ? setParams : setHeaders, row.id)}
                onDelete={() => kvActionsRef.current.deleteRow(st.activeTab === 'params' ? st.params : st.headers, st.activeTab === 'params' ? setParams : setHeaders, row.id)}
              />
            ))}
            <button type="button" onClick={() => addRow(st.activeTab === 'params' ? st.params : st.headers, st.activeTab === 'params' ? setParams : setHeaders)} className="mt-2 flex items-center gap-1 text-[10px] text-slate-500 hover:text-cyber-neon transition font-semibold uppercase"><PlusIcon />{'Add ' + (st.activeTab === 'params' ? 'Param' : 'Header')}</button>
          </div>
        )}

        {st.activeTab === 'body' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-cyber-line/30 bg-cyber-base/20 shrink-0">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Request Body</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={prettyBody} className="rounded border border-cyber-line/40 px-1.5 py-0.5 text-[9px] text-slate-400 hover:text-cyber-neon hover:border-cyber-neon/40 transition flex items-center gap-1"><PrettyIcon />Pretty</button>
                <button type="button" onClick={copyBodyToClipboard} className="rounded border border-cyber-line/40 px-1.5 py-0.5 text-[9px] text-slate-400 hover:text-cyber-neon hover:border-cyber-neon/40 transition flex items-center gap-1"><CopyIcon />Copy</button>
              </div>
            </div>
            <textarea value={st.body} onChange={(e) => setBody(e.target.value)} placeholder='{"key": "value"}' className="flex-1 resize-none bg-transparent px-3 py-2 text-[12px] text-slate-300 font-mono outline-none placeholder:text-slate-600" spellCheck={false} />
          </div>
        )}

        {/* Runner tab */}
        {st.activeTab === 'runner' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-lg border border-cyber-line/40 bg-cyber-panel/20 p-3">
                <label className="block text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Concurrency</label>
                <input type="number" min={1} max={100} value={st.runner.concurrency} onChange={(e) => setRunnerConcurrency(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))} disabled={st.runner.running} className="w-full rounded border border-cyber-line/50 bg-cyber-base px-2 py-1.5 text-[13px] font-bold text-cyber-electric font-mono outline-none focus:border-cyber-neon/50 disabled:opacity-40" />
              </div>
              <div className="rounded-lg border border-cyber-line/40 bg-cyber-panel/20 p-3">
                <label className="block text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Mode</label>
                <select value={st.runner.mode} onChange={(e) => setRunnerMode(e.target.value as 'count' | 'duration')} disabled={st.runner.running} className="w-full rounded border border-cyber-line/50 bg-cyber-base px-2 py-1.5 text-[12px] font-bold text-cyber-electric font-mono outline-none focus:border-cyber-neon/50 disabled:opacity-40">
                  <option value="count">N requests</option><option value="duration">Duration</option>
                </select>
              </div>
              {st.runner.mode === 'count' ? (
                <div className="rounded-lg border border-cyber-line/40 bg-cyber-panel/20 p-3">
                  <label className="block text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Total Requests</label>
                  <input type="number" min={1} max={100000} step={100} value={st.runner.total} onChange={(e) => setRunnerTotal(Math.max(1, parseInt(e.target.value) || 1))} disabled={st.runner.running} className="w-full rounded border border-cyber-line/50 bg-cyber-base px-2 py-1.5 text-[13px] font-bold text-cyber-electric font-mono outline-none focus:border-cyber-neon/50 disabled:opacity-40" />
                </div>
              ) : (
                <div className="rounded-lg border border-cyber-line/40 bg-cyber-panel/20 p-3">
                  <label className="block text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Duration (sec)</label>
                  <input type="number" min={1} max={3600} value={st.runner.durationSec} onChange={(e) => setRunnerDurationSec(Math.max(1, parseInt(e.target.value) || 1))} disabled={st.runner.running} className="w-full rounded border border-cyber-line/50 bg-cyber-base px-2 py-1.5 text-[13px] font-bold text-cyber-electric font-mono outline-none focus:border-cyber-neon/50 disabled:opacity-40" />
                </div>
              )}
              <div className="flex items-end">
                {st.runner.running ? (
                  <button type="button" onClick={stopBenchmark} className="w-full rounded border border-red-500/50 bg-red-500/15 px-3 py-2 text-[11px] font-bold text-red-400 uppercase tracking-wider transition hover:bg-red-500/25">Stop</button>
                ) : (
                  <button type="button" onClick={runBenchmark} disabled={!st.url.trim()} className="w-full rounded border border-cyber-neon/50 bg-cyber-neon/15 px-3 py-2 text-[11px] font-bold text-cyber-neon uppercase tracking-wider transition hover:bg-cyber-neon/25 disabled:opacity-30 disabled:cursor-not-allowed">Start</button>
                )}
              </div>
            </div>
            <div className="rounded-lg border border-cyber-line/40 bg-cyber-panel/20 p-3 space-y-2">
              <div className="flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Progress</span><span className="text-[10px] font-mono text-slate-500">{st.runner.mode === 'count' ? st.runner.sent + ' / ' + st.runner.total + ' (' + Math.round((st.runner.sent / Math.max(st.runner.total, 1)) * 100) + '%)' : st.runner.sent + ' sent'}</span></div>
              <div className="h-2 rounded-full bg-cyber-base overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-cyber-electric to-cyber-neon transition-all duration-300" style={{ width: st.runner.mode === 'count' ? Math.min(100, (st.runner.sent / Math.max(st.runner.total, 1)) * 100) + '%' : '100%' }} /></div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[{ label: 'Requests/sec', value: st.runner.reqPerSec, color: 'text-cyber-neon' },{ label: 'Sent', value: st.runner.sent, color: 'text-cyber-electric' },{ label: '2xx OK', value: st.runner.success, color: 'text-green-400' },{ label: 'Errors', value: st.runner.errors, color: st.runner.errors > 0 ? 'text-red-400' : 'text-slate-400' }].map((stat) => (<div key={stat.label} className="rounded-lg border border-cyber-line/40 bg-cyber-panel/20 p-3 text-center"><div className={'text-2xl font-bold font-mono ' + stat.color}>{stat.value}</div><div className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 mt-0.5">{stat.label}</div></div>))}
            </div>
            {st.runner.latencies.length > 0 && (
              <div className="rounded-lg border border-cyber-line/40 bg-cyber-panel/20 p-3">
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Latency (ms)</h4>
                <div className="grid grid-cols-6 gap-2 text-center">
                  {[{ label: 'Min', val: runnerStats.min },{ label: 'Avg', val: runnerStats.avg },{ label: 'P50', val: runnerStats.p50 },{ label: 'P95', val: runnerStats.p95 },{ label: 'P99', val: runnerStats.p99 },{ label: 'Max', val: runnerStats.max }].map((s) => (<div key={s.label} className="rounded bg-cyber-base/50 px-2 py-1.5"><div className="text-[13px] font-bold font-mono text-slate-200">{s.val}</div><div className="text-[8px] font-semibold uppercase tracking-wider text-slate-500">{s.label}</div></div>))}
                </div>
              </div>
            )}
            {st.runner.errorList.length > 0 && (<div className="rounded-lg border border-cyber-line/40 bg-cyber-panel/20 p-3"><h4 className="text-[10px] font-semibold uppercase tracking-wider text-red-400 mb-2">Errors (max 20 shown)</h4><div className="space-y-0.5 max-h-32 overflow-y-auto">{st.runner.errorList.map((e, i) => (<div key={i} className="text-[10px] font-mono text-red-300/80 break-all">{e}</div>))}</div></div>)}
          </div>
        )}
      </div>

      {/* ── Resize handle ── */}
      <div onMouseDown={onResizeDown} className="h-1.5 shrink-0 bg-cyber-line/30 hover:bg-cyber-electric/40 cursor-row-resize transition-colors relative group"><div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-cyber-electric/0 group-hover:bg-cyber-electric/60 transition-colors" /></div>

      {/* ── Response area ── */}
      {st.response && (
        <div className="flex flex-col shrink-0 overflow-hidden border-t border-cyber-line/50" style={{ height: responseHeight }}>
          <div className="flex shrink-0 items-center justify-between px-3 py-2 border-b border-cyber-line/30 bg-cyber-base/30">
            <div className="flex items-center gap-2">
              <span className={'text-lg font-bold font-mono ' + statusColor(st.response.status)}>{st.response.status}</span>
              <span className="text-[11px] font-mono text-slate-300">{httpStatusText(st.response.status) || st.response.statusText}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-500 font-mono">{st.response.duration}ms</span>
              <span className="text-[9px] text-slate-500 font-mono">{fmtSize(st.response.size)}</span>
              <button type="button" onClick={copyResponse} className="rounded border border-cyber-line/40 px-1.5 py-0.5 text-[9px] text-slate-400 hover:text-cyber-neon hover:border-cyber-neon/40 transition flex items-center gap-1"><CopyIcon />{st.copied ? 'Copied!' : 'Copy'}</button>
            </div>
          </div>

          {Object.keys(st.response.headers).length > 0 && (
            <details className="shrink-0 border-b border-cyber-line/20">
              <summary className="px-3 py-1.5 text-[10px] text-slate-500 cursor-pointer hover:text-slate-300 font-semibold uppercase tracking-wider">{'Response Headers (' + Object.keys(st.response.headers).length + ')'}</summary>
              <div className="px-3 py-1.5 space-y-0.5 max-h-32 overflow-y-auto">{Object.entries(st.response.headers).map(([k, v]) => (<div key={k} className="flex gap-2 text-[10px] font-mono"><span className="text-cyber-neon shrink-0">{k}:</span><span className="text-slate-400 break-all">{v}</span></div>))}</div>
            </details>
          )}

          <pre className="flex-1 overflow-auto p-3 text-[11px] text-slate-300 font-mono whitespace-pre-wrap break-all leading-relaxed"><code>{formatBody(st.response.body)}</code></pre>
        </div>
      )}

      {/* Loading indicator */}
      {st.isLoading && (
        <div className="flex shrink-0 items-center gap-2 border-t border-cyber-line/50 bg-cyber-panel/20 px-3 py-2"><LoaderSpinner /><span className="text-[11px] text-slate-400 font-mono">{st.isStreaming ? 'Streaming... (click to abort)' : 'Sending request...'}</span></div>
      )}
    </div>
  );
}
