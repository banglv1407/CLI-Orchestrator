import { useState, useEffect } from 'react';
import { buzzGetConfig, buzzSetConfig, buzzHasIdentity } from './api';

export function BuzzSettingsSection() {
  const [relayUrl, setRelayUrl] = useState('');
  const [hasIdentity, setHasIdentity] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    buzzGetConfig().then((cfg: any) => { if (cfg?.relayUrl) setRelayUrl(cfg.relayUrl); }).catch(() => {});
    buzzHasIdentity().then(setHasIdentity).catch(() => {});
  }, []);

  const handleSave = async () => {
    try {
      await buzzSetConfig({ relayUrl });
      setMsg('Saved');
      setTimeout(() => setMsg(null), 2000);
    } catch (err: any) { setMsg(`Error: ${err}`); }
  };

  return (
    <div className="space-y-3 text-xs">
      <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 font-bold">Buzz Relay</h3>
      {msg && <div className="rounded border border-cyber-neon/40 bg-cyber-neon/10 p-2 text-cyber-neon text-[11px] font-mono">{msg}</div>}
      <div>
        <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1">Relay URL</label>
        <input type="text" value={relayUrl} onChange={(e) => setRelayUrl(e.target.value)}
          className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-100 outline-none focus:border-cyber-neon" />
      </div>
      <div className="flex items-center gap-3">
        <button onClick={handleSave}
          className="rounded bg-cyber-neon/20 border border-cyber-neon px-3 py-1.5 text-xs font-semibold text-cyber-neon hover:bg-cyber-neon/30 transition">Save</button>
        <span className={`text-[10px] ${hasIdentity ? 'text-green-400' : 'text-slate-500'}`}>
          {hasIdentity ? 'Identity configured' : 'No identity'}
        </span>
      </div>
    </div>
  );
}
