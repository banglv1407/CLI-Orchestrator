import { useMemo, useState } from 'react';
import { getIntlLocale, t as tr, tFeedback as trFeedback } from '../i18n';
import type { WebHistoryEntry } from '../lib/webBrowser';

export function WebBrowserHistory({ entries, error, onOpen, onDelete, onClear, onClose }: {
  entries: WebHistoryEntry[]; error: string;
  onOpen: (entry: WebHistoryEntry) => void; onDelete: (id: string) => void;
  onClear: () => void; onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => entries.filter(entry => `${entry.title} ${entry.url}`.toLowerCase().includes(query.toLowerCase())), [entries, query]);
  return <aside data-web-history className="flex w-80 max-w-[45%] shrink-0 flex-col overflow-hidden border-l border-cyber-line bg-cyber-panel">
    <div className="flex items-center justify-between gap-2 border-b border-cyber-line px-3 py-2">
      <h2 className="text-xs font-semibold text-cyber-electric">{tr('Browsing history')}</h2>
      <button type="button" onClick={onClose} aria-label={tr('Close history')} className="rounded px-2 py-1 text-slate-400 hover:text-white">×</button>
    </div>
    <div className="space-y-2 border-b border-cyber-line p-3">
      <input aria-label={tr('Search browsing history')} value={query} onChange={event => setQuery(event.target.value)} placeholder={tr('Search browsing history')} className="w-full rounded border border-cyber-line bg-cyber-base px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-cyber-electric" />
      <button type="button" data-web-history-clear onClick={onClear} disabled={!entries.length} className="text-xs text-rose-300 hover:text-rose-200 disabled:opacity-40">{tr('Clear browsing history')}</button>
    </div>
    {error && <p role="alert" className="p-3 text-xs text-rose-300">{trFeedback(error)}</p>}
    <div className="min-h-0 flex-1 overflow-y-auto">
      {!filtered.length && <p className="p-5 text-center text-xs text-slate-400">{tr('No browsing history.')}</p>}
      {filtered.map(entry => <div key={entry.id} data-web-history-entry={entry.id} className="flex items-start gap-1 border-b border-cyber-line/40 p-2">
        <button type="button" onClick={() => onOpen(entry)} title={entry.url} className="min-w-0 flex-1 rounded px-1 py-1 text-left hover:bg-cyber-electric/10">
          <span className="block truncate text-xs text-slate-200">{entry.title || entry.url}</span>
          <span className="mt-1 block truncate text-[10px] text-slate-400">{entry.url}</span>
          <span className="mt-1 block text-[10px] text-slate-500">{new Date(entry.visitedAt).toLocaleString(getIntlLocale())}</span>
        </button>
        <button type="button" onClick={() => onDelete(entry.id)} aria-label={tr('Delete history entry')} title={tr('Delete history entry')} className="shrink-0 rounded px-2 py-1 text-slate-500 hover:bg-rose-400/10 hover:text-rose-300">×</button>
      </div>)}
    </div>
  </aside>;
}
