import { useState, useEffect } from 'react';
import type { SshServerConfig, SshServerStatus, SshConnection } from './api';
import {
  sshGetServerConfig,
  sshSaveServerConfig,
  sshGetServerStatus,
  sshStartServer,
  sshStopServer,
  sshLoadConnections,
  sshSaveConnections,
} from './api';

export function SshSettingsSection() {
  const [config, setConfig] = useState<SshServerConfig | null>(null);
  const [status, setStatus] = useState<SshServerStatus | null>(null);
  const [connections, setConnections] = useState<SshConnection[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [cfg, stat, conns] = await Promise.all([
          sshGetServerConfig(),
          sshGetServerStatus(),
          sshLoadConnections(),
        ]);
        setConfig(cfg);
        setStatus(stat);
        setConnections(conns);
      } catch { /* ignore */ }
    })();
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    try {
      setLoading(true);
      await sshSaveServerConfig(config);
      setMsg('Server settings saved');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleServer = async () => {
    try {
      setLoading(true);
      if (status?.running) {
        await sshStopServer();
      } else {
        await sshStartServer();
      }
      const newStatus = await sshGetServerStatus();
      setStatus(newStatus);
    } catch (err: any) {
      setMsg(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConnection = async (id: string) => {
    const updated = connections.filter((c) => c.id !== id);
    setConnections(updated);
    try {
      await sshSaveConnections(updated);
    } catch { /* ignore */ }
  };

  if (!config) {
    return <div className="p-4 text-xs text-slate-500">Loading SSH settings...</div>;
  }

  return (
    <div className="space-y-6 text-xs">
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-cyber-line/20 pb-2">
          <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 font-bold">Embedded SSH Server</h3>
          <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
            status?.running ? 'bg-green-500/20 text-green-300 border border-green-500/40' : 'bg-slate-700/50 text-slate-400'
          }`}>
            {status?.running ? `Listening on port ${config.port}` : 'Stopped'}
          </span>
        </div>

        {msg && (
          <div className="rounded border border-cyber-neon/40 bg-cyber-neon/10 p-2 text-cyber-neon text-[11px] font-mono">
            {msg}
          </div>
        )}

        <form onSubmit={handleSaveConfig} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1">Port</label>
              <input
                type="number"
                value={config.port}
                onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) || 2222 })}
                className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-100 outline-none focus:border-cyber-neon"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1">Username</label>
              <input
                type="text"
                value={config.username}
                onChange={(e) => setConfig({ ...config, username: e.target.value })}
                className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-100 outline-none focus:border-cyber-neon"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1">Password Authentication</label>
            <input
              type="password"
              placeholder="Leave empty to require SSH key"
              value={config.password || ''}
              onChange={(e) => setConfig({ ...config, password: e.target.value || undefined })}
              className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-100 placeholder-slate-600 outline-none focus:border-cyber-neon"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-cyber-neon/20 border border-cyber-neon px-3 py-1.5 text-xs font-semibold text-cyber-neon hover:bg-cyber-neon/30 transition disabled:opacity-50"
            >Save Server Config</button>
            <button
              type="button"
              disabled={loading}
              onClick={handleToggleServer}
              className={`rounded border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                status?.running
                  ? 'border-cyber-warn/40 text-cyber-warn hover:bg-cyber-warn/10'
                  : 'border-green-500/40 text-green-300 hover:bg-green-500/10'
              }`}
            >{status?.running ? 'Stop SSH Server' : 'Start SSH Server'}</button>
          </div>
        </form>
      </div>

      <div className="space-y-3 pt-4 border-t border-cyber-line/20">
        <h4 className="font-display text-xs uppercase tracking-wider text-slate-300 font-bold">Saved Remote Connections ({connections.length})</h4>
        {connections.length === 0 ? (
          <p className="text-slate-500 italic text-[11px]">No saved connections.</p>
        ) : (
          <div className="space-y-1">
            {connections.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-2 rounded border border-cyber-line/40 bg-cyber-base/40">
                <div>
                  <span className="font-semibold text-slate-200">{c.name}</span>
                  <span className="ml-2 text-[10px] font-mono text-slate-400">{c.username}@{c.host}:{c.port}</span>
                </div>
                <button
                  onClick={() => handleDeleteConnection(c.id)}
                  className="rounded border border-rose-500/40 px-2 py-0.5 text-[10px] text-rose-400 hover:bg-rose-500/10"
                >Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
