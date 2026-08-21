import { useState, useEffect } from 'react';
import type { BuiltinLlmConfig, BuiltinLlmStatus } from './api';
import {
  localLlmGetConfig,
  localLlmSaveConfig,
  localLlmGetStatus,
  localLlmLoadModel,
  localLlmUnloadModel,
} from './api';

export function LocalLlmSettingsSection() {
  const [config, setConfig] = useState<BuiltinLlmConfig | null>(null);
  const [status, setStatus] = useState<BuiltinLlmStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [c, s] = await Promise.all([localLlmGetConfig(), localLlmGetStatus()]);
        setConfig(c);
        setStatus(s);
      } catch { /* ignore */ }
    })();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    try {
      setLoading(true);
      await localLlmSaveConfig(config);
      setMsg('Settings saved');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLoad = async () => {
    try {
      setLoading(true);
      if (status?.loaded) {
        const s = await localLlmUnloadModel();
        setStatus(s);
        setMsg('Model unloaded');
      } else {
        const s = await localLlmLoadModel();
        setStatus(s);
        setMsg('Model loaded successfully');
      }
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return <div className="p-4 text-xs text-slate-500">Loading Local LLM settings...</div>;
  }

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-cyber-line/20 pb-2">
        <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 font-bold">Local LLM (Candle Runtime)</h3>
        <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
          status?.loaded ? 'bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/40' : 'bg-slate-700/50 text-slate-400'
        }`}>
          {status?.loaded ? 'Model Loaded' : 'Not Loaded'}
        </span>
      </div>

      {msg && (
        <div className="rounded border border-cyber-neon/40 bg-cyber-neon/10 p-2 text-cyber-neon text-[11px] font-mono">
          {msg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="llm-enabled"
            checked={config.enabled}
            onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
            className="rounded border-cyber-line"
          />
          <label htmlFor="llm-enabled" className="text-slate-300 font-semibold">Enable Local LLM Engine</label>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1">Model Path (.gguf)</label>
          <input
            type="text"
            placeholder="C:/models/llama-3-8b.Q4_K_M.gguf"
            value={config.modelPath || ''}
            onChange={(e) => setConfig({ ...config, modelPath: e.target.value || null })}
            className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-100 placeholder-slate-600 outline-none focus:border-cyber-neon text-xs"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1">Tokenizer Path (optional if next to model)</label>
          <input
            type="text"
            placeholder="C:/models/tokenizer.json"
            value={config.tokenizerPath || ''}
            onChange={(e) => setConfig({ ...config, tokenizerPath: e.target.value || null })}
            className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-100 placeholder-slate-600 outline-none focus:border-cyber-neon text-xs"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1">Max Tokens</label>
            <input
              type="number"
              value={config.maxTokens}
              onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) || 256 })}
              className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-100 outline-none focus:border-cyber-neon text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1">Temperature</label>
            <input
              type="number"
              step="0.1"
              value={config.temperature}
              onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) || 0.7 })}
              className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-100 outline-none focus:border-cyber-neon text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1">Runtime</label>
            <select
              value={config.runtime}
              onChange={(e) => setConfig({ ...config, runtime: e.target.value })}
              className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-100 outline-none focus:border-cyber-neon text-xs"
            >
              <option value="candle">Candle (CPU/Embedded)</option>
              <option value="llamacpp">llama.cpp Server</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-cyber-neon/20 border border-cyber-neon px-3 py-1.5 text-xs font-semibold text-cyber-neon hover:bg-cyber-neon/30 transition disabled:opacity-50"
          >Save Settings</button>
          {config.modelPath && (
            <button
              type="button"
              disabled={loading}
              onClick={handleToggleLoad}
              className={`rounded border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                status?.loaded
                  ? 'border-cyber-warn/40 text-cyber-warn hover:bg-cyber-warn/10'
                  : 'border-cyber-electric/40 text-cyber-electric hover:bg-cyber-electric/10'
              }`}
            >{status?.loaded ? 'Unload Model' : 'Load Model'}</button>
          )}
        </div>
      </form>
    </div>
  );
}
