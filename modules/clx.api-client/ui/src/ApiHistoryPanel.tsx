import { useEffect, useMemo, useRef, useState } from 'react';

import {
  clearApiHistory,
  loadApiHistory,
  METHOD_COLORS,
  type ApiHistoryEntry,
} from './api-history';

export function ApiHistoryPanel() {
  const [history, setHistory] = useState<ApiHistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const handlerRef = useRef<EventListener>((event) => {
    setHistory((event as CustomEvent<ApiHistoryEntry[]>).detail);
  });

  useEffect(() => {
    setHistory(loadApiHistory());
    const handler = handlerRef.current;
    window.addEventListener('apiclient-history-changed', handler);
    return () => window.removeEventListener('apiclient-history-changed', handler);
  }, []);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return query
      ? history.filter((entry) =>
          entry.url.toLowerCase().includes(query) ||
          entry.method.toLowerCase().includes(query))
      : history;
  }, [history, searchQuery]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-cyber-line p-4">
        <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-cyber-neon">API History</h2>
        <button type="button" onClick={() => clearApiHistory()} className="rounded border border-cyber-line/40 px-2 py-0.5 text-[9px] font-semibold uppercase text-slate-400 hover:border-red-400/40 hover:text-red-400">Clear</button>
      </div>
      <div className="shrink-0 border-b border-cyber-line/50 p-2">
        <input type="text" placeholder="Search URL or method..." value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-[11px] text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyber-electric" />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-[11px] text-slate-600">
            {history.length === 0 ? 'No requests yet.' : `No results for "${searchQuery}".`}
          </div>
        ) : filtered.map((entry, index) => (
          <button key={`${entry.method}:${entry.url}:${index}`} type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('apiclient-history-select', { detail: entry }))}
            className="flex w-full items-start gap-2 border-b border-cyber-line/20 px-4 py-2.5 text-left transition hover:bg-cyber-neon/5">
            <span className="min-w-[44px] shrink-0 font-mono text-[10px] font-bold" style={{ color: METHOD_COLORS[entry.method] }}>{entry.method}</span>
            <div className="min-w-0 flex-1">
              <div className="truncate font-mono text-[11px] text-slate-300">{entry.url}</div>
              <div className="mt-0.5 text-[9px] text-slate-600">{new Date(entry.timestamp).toLocaleString()}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
