import { useEffect, useState } from 'react';
import type { CliDefinition } from '../types';
import { loadRecents, recentKey, RECENTS_CHANGED, type RecentTerminal } from '../lib/terminal-recents';

export function RecentTerminals({ clis, onOpen }: {
  clis: CliDefinition[];
  onOpen: (item: RecentTerminal) => Promise<void>;
}) {
  const [items, setItems] = useState(loadRecents);
  const [opening, setOpening] = useState<string | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const refresh = () => setItems(loadRecents());
    window.addEventListener(RECENTS_CHANGED, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(RECENTS_CHANGED, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
    <p className="text-[11px] text-slate-400">Recent CLI & folders · newest first</p>
    {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
    {items.length === 0 && <p className="text-xs text-slate-500 py-4">No recent terminals yet. Start a CLI in a folder to see it here.</p>}
    {items.map(item => {
      const key = recentKey(item);
      const available = item.cliName === 'Quick - shell' || clis.some(cli => cli.name === item.cliName);
      return <button key={key} type="button" disabled={!available || opening !== null}
        title={available ? `Open ${item.cliName} in ${item.workingDir}` : 'CLI is no longer available'}
        onClick={async () => {
          setOpening(key); setError('');
          try { await onOpen(item); } catch (error) { setError(String(error)); }
          finally { setOpening(null); }
        }}
        className="w-full text-left rounded border border-cyber-line bg-cyber-base/30 p-2.5 hover:border-cyber-electric focus-visible:outline focus-visible:outline-cyber-electric disabled:opacity-50 disabled:cursor-not-allowed">
        <div className="text-xs font-semibold text-cyber-electric truncate">{item.cliName}{opening === key ? ' · Opening...' : ''}</div>
        <div className="text-[11px] text-slate-300 break-all mt-1">{item.workingDir}</div>
        <div className="text-[10px] text-slate-500 mt-1">
          {available ? new Date(item.lastUsed).toLocaleString() : 'CLI unavailable'}
        </div>
      </button>;
    })}
  </div>;
}
