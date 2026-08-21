import { useState, useEffect } from 'react';
import { nesGetConfig, nesSaveConfig } from './api';

export function NesSettingsSection() {
  const [serverUrl, setServerUrl] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    nesGetConfig().then((cfg: any) => { if (cfg?.serverUrl) setServerUrl(cfg.serverUrl); }).catch(() => {});
  }, []);

  const handleSave = async () => {
    try {
      await nesSaveConfig({ serverUrl });
      setMsg('Saved');
      setTimeout(() => setMsg(null), 2000);
    } catch (err: any) { setMsg(`Error: ${err}`); }
  };

  return (
    <div className="space-y-3 text-xs">
      <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 font-bold">NES Multiplayer</h3>
      {msg && <div className="rounded border border-cyber-neon/40 bg-cyber-neon/10 p-2 text-cyber-neon text-[11px] font-mono">{msg}</div>}
      <div>
        <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1">Server URL</label>
        <input type="text" value={serverUrl} onChange={(e) => setServerUrl(e.target.value)}
          className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-100 outline-none focus:border-cyber-neon" />
      </div>
      <button onClick={handleSave}
        className="rounded bg-cyber-neon/20 border border-cyber-neon px-3 py-1.5 text-xs font-semibold text-cyber-neon hover:bg-cyber-neon/30 transition">Save</button>
    </div>
  );
}
