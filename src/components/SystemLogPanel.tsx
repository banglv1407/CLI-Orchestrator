import { useCallback, useEffect, useState } from 'react';
import { getSystemLogs } from '../lib/tauri';
import type { SystemLogEntry } from '../types';

const LEVEL_COLORS: Record<string, string> = {
  ERROR: 'text-red-400 bg-red-500/10',
  WARN: 'text-yellow-400 bg-yellow-500/10',
  INFO: 'text-cyan-400 bg-cyan-500/10',
  DEBUG: 'text-slate-400 bg-slate-500/10',
};

export function SystemLogPanel() {
  const [logs, setLogs] = useState<SystemLogEntry[]>([]);
  const [filter, setFilter] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const l = await getSystemLogs(300);
      setLogs(l);
      setError(null);
    } catch (e: any) {
      setError(String(e));
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (!autoRefresh) return;
    const iv = setInterval(refresh, 2000);
    return () => clearInterval(iv);
  }, [autoRefresh, refresh]);

  const filtered = filter
    ? logs.filter((l) => {
        const q = filter.toLowerCase();
        return (
          l.message.toLowerCase().includes(q) ||
          l.source.toLowerCase().includes(q) ||
          l.level.toLowerCase().includes(q)
        );
      })
    : logs;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h2 className="font-display text-lg uppercase tracking-widest text-cyber-neon">System Logs</h2>
          <p className="text-xs text-slate-400 mt-1">CLX application runtime logs</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer select-none">
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="accent-cyber-neon" />
            Auto-refresh
          </label>
          <button onClick={refresh} className="px-3 py-1.5 text-xs text-cyber-neon border border-cyber-neon/30 rounded hover:bg-cyber-neon/10 transition uppercase tracking-wider">
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-6 mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
          {error} <button onClick={() => setError(null)} className="ml-2 underline text-xs">Dismiss</button>
        </div>
      )}

      {/* Filter */}
      <div className="px-6 pb-3">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter logs..."
          className="w-full bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none"
        />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        <table className="w-full text-xs font-mono">
          <thead className="sticky top-0 bg-cyber-panel">
            <tr className="text-slate-400 uppercase tracking-wider border-b border-cyber-line/50">
              <th className="text-left px-2 py-2 w-[140px]">Timestamp</th>
              <th className="text-left px-2 py-2 w-16">Level</th>
              <th className="text-left px-2 py-2 w-28">Source</th>
              <th className="text-left px-2 py-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-slate-500">
                  {logs.length === 0 ? 'No logs yet.' : 'No matching entries.'}
                </td>
              </tr>
            ) : (
              [...filtered].reverse().map((entry, i) => {
                const colorClass = LEVEL_COLORS[entry.level] || LEVEL_COLORS.DEBUG;
                return (
                  <tr key={i} className="hover:bg-cyber-line/10 border-b border-cyber-line/20">
                    <td className="px-2 py-1.5 text-slate-500 whitespace-nowrap">{entry.timestamp}</td>
                    <td className="px-2 py-1.5">
                      <span className={'px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ' + colorClass}>
                        {entry.level}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-cyan-400 truncate max-w-[120px]">{entry.source}</td>
                    <td className="px-2 py-1.5 text-slate-300 whitespace-pre-wrap break-all">{entry.message}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
