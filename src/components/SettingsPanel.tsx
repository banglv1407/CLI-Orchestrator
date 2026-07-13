import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { AppTheme, BuiltinLlmConfig, BuiltinLlmStatus } from '../types';
import { ALL_PETS, getActivePetId, setActivePetId, getPetEnabled, setPetEnabled } from '../lib/mythical-pets';

interface SettingsPanelProps {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

export function SettingsPanel({ theme, setTheme }: SettingsPanelProps) {
  // Pet state
  const [petId, setPetIdLocal] = useState(getActivePetId);
  const [petEnabled, setPetEnabledLocal] = useState(getPetEnabled);

  // Local LLM states
  const [builtinLlmConfig, setBuiltinLlmConfig] = useState<BuiltinLlmConfig>({
    enabled: false,
    modelPath: null,
    tokenizerPath: null,
    maxTokens: 256,
    temperature: 0.7,
    repeatPenalty: 1.1,
    seed: 42,
    runtime: 'candle',
    serverPath: null,
    serverPort: 8080,
  });

  const [builtinLlmStatus, setBuiltinLlmStatus] = useState<BuiltinLlmStatus>({
    loaded: false,
    modelPath: null,
    enabled: false,
  });

  const [isBuiltinLlmLoading, setIsBuiltinLlmLoading] = useState(false);

  useEffect(() => {
    // Load config
    invoke<BuiltinLlmConfig>('builtin_llm_get_config')
      .then((cfg) => setBuiltinLlmConfig(cfg))
      .catch((err) => console.error('Failed to get built-in config:', err));

    // Load status
    invoke<BuiltinLlmStatus>('builtin_llm_status')
      .then((stat) => setBuiltinLlmStatus(stat))
      .catch((err) => console.error('Failed to get built-in status:', err));
  }, []);

  const handleLoadBuiltinLlm = async () => {
    setIsBuiltinLlmLoading(true);
    try {
      await invoke('builtin_llm_load');
      const status = await invoke<BuiltinLlmStatus>('builtin_llm_status');
      setBuiltinLlmStatus(status);
    } catch (err) {
      console.error('Failed to load built-in LLM:', err);
    } finally {
      setIsBuiltinLlmLoading(false);
    }
  };

  const handleUnloadBuiltinLlm = async () => {
    try {
      await invoke('builtin_llm_unload');
      const status = await invoke<BuiltinLlmStatus>('builtin_llm_status');
      setBuiltinLlmStatus(status);
    } catch (err) {
      console.error('Failed to unload built-in LLM:', err);
    }
  };

  const handlePickBuiltinModel = async () => {
    try {
      const file = await invoke<string | null>('pick_file');
      if (file) {
        const newCfg = { ...builtinLlmConfig, modelPath: file };
        await invoke('builtin_llm_save_config', { config: newCfg });
        setBuiltinLlmConfig(newCfg);
      }
    } catch (err) {
      console.error('Failed to pick model file:', err);
    }
  };

  const handlePickBuiltinTokenizer = async () => {
    try {
      const file = await invoke<string | null>('pick_file');
      if (file) {
        const newCfg = { ...builtinLlmConfig, tokenizerPath: file };
        await invoke('builtin_llm_save_config', { config: newCfg });
        setBuiltinLlmConfig(newCfg);
      }
    } catch (err) {
      console.error('Failed to pick tokenizer file:', err);
    }
  };

  const handlePickBuiltinServer = async () => {
    try {
      const file = await invoke<string | null>('pick_file');
      if (file) {
        const newCfg = { ...builtinLlmConfig, serverPath: file };
        await invoke('builtin_llm_save_config', { config: newCfg });
        setBuiltinLlmConfig(newCfg);
      }
    } catch (err) {
      console.error('Failed to pick server file:', err);
    }
  };

  const handleUpdateBuiltinConfig = async (updates: Partial<BuiltinLlmConfig>) => {
    const newCfg = { ...builtinLlmConfig, ...updates };
    try {
      await invoke('builtin_llm_save_config', { config: newCfg });
      setBuiltinLlmConfig(newCfg);
      // Wait for tauri backend to process config change and then update status
      setTimeout(async () => {
        const status = await invoke<BuiltinLlmStatus>('builtin_llm_status');
        setBuiltinLlmStatus(status);
      }, 500);
    } catch (err) {
      console.error('Failed to save built-in config:', err);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-cyber-panel/40 p-6 select-none">
      <div className="flex shrink-0 items-center justify-between border-b border-cyber-line/50 pb-4 mb-4">
        <h2 className="font-display text-base uppercase tracking-[0.2em] text-cyber-neon font-bold">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1.5 scrollbar-thin">
        {/* Theme Settings */}
        <div>
          <h3 className="font-display text-sm uppercase tracking-wider text-slate-400 mb-2 font-bold">Theme Settings</h3>
          <label className="flex items-center justify-between rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-4 text-xs text-slate-200 transition hover:border-cyber-neon/80">
            <span className="font-semibold">App Theme</span>
            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value as AppTheme)}
              className="rounded border border-cyber-line bg-cyber-base px-3 py-1 font-semibold text-cyber-neon outline-none transition focus:border-cyber-neon cursor-pointer"
            >
              <option value="cyberpunk">Cyberpunk</option>
              <option value="kawaii">Kawaii</option>
              <option value="light">Light</option>
            </select>
          </label>
        </div>

        {/* Mythical Pet Settings */}
        <div>
          <h3 className="font-display text-sm uppercase tracking-wider text-slate-400 mb-2 font-bold">Mythical Pet</h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-4 text-xs text-slate-200 transition hover:border-cyber-neon/80 cursor-pointer">
              <div>
                <span className="font-semibold">Enable Pet</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Show pet overlay on screen</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !petEnabled;
                  setPetEnabledLocal(next);
                  setPetEnabled(next);
                  window.dispatchEvent(new CustomEvent('mythical-pet-change', { detail: { enabled: next } }));
                }}
                className={`w-10 h-5 rounded-full transition relative ${petEnabled ? 'bg-cyber-neon' : 'bg-slate-600'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition ${petEnabled ? 'left-5' : 'left-0.5'}`} />
              </button>
            </label>
            {petEnabled && (
              <div className="rounded-lg border border-cyber-line/40 bg-cyber-base/20 p-4">
                <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Select Pet</p>
                <div className="grid grid-cols-2 gap-3">
                  {ALL_PETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPetIdLocal(p.id);
                        setActivePetId(p.id);
                        window.dispatchEvent(new CustomEvent('mythical-pet-change', { detail: { id: p.id } }));
                      }}
                      className={`text-left px-4 py-3 rounded-lg border transition text-xs ${
                        p.id === petId
                          ? 'border-cyber-neon bg-cyber-neon/10 text-cyber-neon'
                          : 'border-cyber-line/40 bg-cyber-base/30 text-slate-300 hover:border-cyber-electric/60 hover:bg-cyber-electric/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{p.id === 'dragon' ? '🐉' : p.id === 'phoenix' ? '🔥' : p.id === 'qilin' ? '🦄' : '🪽'}</span>
                        <div>
                          <div className="font-semibold">{p.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{p.nameVn}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Built-in Local LLM Settings */}
        <div>
          <h3 className="font-display text-sm uppercase tracking-wider text-slate-400 mb-2 font-bold">Built-in Local LLM</h3>
          <div className="space-y-4 rounded-lg border border-cyber-line/40 bg-cyber-base/20 p-4">
            <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
              <div>
                <span className="font-semibold">Enable local LLM fallback</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Use local LLM when cloud API fails</p>
              </div>
              <button
                type="button"
                onClick={() => handleUpdateBuiltinConfig({ enabled: !builtinLlmConfig.enabled })}
                className={`w-10 h-5 rounded-full transition relative ${builtinLlmConfig.enabled ? 'bg-cyber-neon' : 'bg-slate-600'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition ${builtinLlmConfig.enabled ? 'left-5' : 'left-0.5'}`} />
              </button>
            </label>

            {builtinLlmConfig.enabled && (
              <div className="space-y-4 pt-4 border-t border-cyber-line/30 text-xs">
                {/* Model Status */}
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-400">Model Status:</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold uppercase ${builtinLlmStatus.loaded ? 'text-cyber-neon' : 'text-red-400'}`}>
                      {builtinLlmStatus.loaded ? '🟢 Loaded' : '🔴 Unloaded'}
                    </span>
                    {builtinLlmStatus.loaded ? (
                      <button
                        type="button"
                        onClick={handleUnloadBuiltinLlm}
                        className="rounded border border-red-500/40 bg-red-950/20 px-3 py-1 hover:bg-red-500/20 transition"
                      >
                        Unload
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isBuiltinLlmLoading || !builtinLlmConfig.modelPath}
                        onClick={handleLoadBuiltinLlm}
                        className="rounded border border-cyber-neon/40 bg-cyber-neon/15 px-3 py-1 text-cyber-neon hover:bg-cyber-neon/20 transition disabled:opacity-40"
                      >
                        {isBuiltinLlmLoading ? 'Loading...' : 'Load Model'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Inference Engine (Runtime) */}
                <div className="space-y-1.5">
                  <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Inference Engine</span>
                  <select
                    value={builtinLlmConfig.runtime || 'candle'}
                    onChange={(e) => handleUpdateBuiltinConfig({ runtime: e.target.value })}
                    className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-300 font-mono outline-none focus:border-cyber-neon cursor-pointer"
                  >
                    <option value="candle">Candle (CPU - Lightweight, Standard Llama only)</option>
                    <option value="llamacpp">Llama.cpp (Local server - GPU/AVX, supports all GGUF models)</option>
                  </select>
                </div>

                {/* GGUF Path */}
                <div className="space-y-1.5">
                  <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">GGUF Model Path</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Select .gguf model file..."
                      value={builtinLlmConfig.modelPath || ''}
                      onChange={(e) => handleUpdateBuiltinConfig({ modelPath: e.target.value || null })}
                      className="flex-1 rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-300 font-mono outline-none focus:border-cyber-neon"
                    />
                    <button
                      type="button"
                      onClick={handlePickBuiltinModel}
                      className="rounded border border-cyber-line px-3.5 py-1.5 text-slate-300 hover:bg-cyber-line/20 transition"
                    >
                      Browse
                    </button>
                  </div>
                </div>

                {builtinLlmConfig.runtime === 'llamacpp' && (
                  <>
                    {/* llama-server Path */}
                    <div className="space-y-1.5">
                      <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Llama Server Executable Path (Optional)</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Defaults to 'llama-server' in your PATH..."
                          value={builtinLlmConfig.serverPath || ''}
                          onChange={(e) => handleUpdateBuiltinConfig({ serverPath: e.target.value || null })}
                          className="flex-1 rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-300 font-mono outline-none focus:border-cyber-neon"
                        />
                        <button
                          type="button"
                          onClick={handlePickBuiltinServer}
                          className="rounded border border-cyber-line px-3.5 py-1.5 text-slate-300 hover:bg-cyber-line/20 transition"
                        >
                          Browse
                        </button>
                      </div>
                    </div>

                    {/* Port */}
                    <div className="space-y-1.5">
                      <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Local Server Port</span>
                      <input
                        type="number"
                        placeholder="8080"
                        value={builtinLlmConfig.serverPort || 8080}
                        onChange={(e) => handleUpdateBuiltinConfig({ serverPort: parseInt(e.target.value) || 8080 })}
                        className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-300 font-mono outline-none focus:border-cyber-neon"
                      />
                    </div>
                  </>
                )}

                {builtinLlmConfig.runtime !== 'llamacpp' && (
                  /* Tokenizer Path */
                  <div className="space-y-1.5">
                    <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Tokenizer Path (Optional)</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Defaults to tokenizer.json next to model..."
                        value={builtinLlmConfig.tokenizerPath || ''}
                        onChange={(e) => handleUpdateBuiltinConfig({ tokenizerPath: e.target.value || null })}
                        className="flex-1 rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-300 font-mono outline-none focus:border-cyber-neon"
                      />
                      <button
                        type="button"
                        onClick={handlePickBuiltinTokenizer}
                        className="rounded border border-cyber-line px-3.5 py-1.5 text-slate-300 hover:bg-cyber-line/20 transition"
                      >
                        Browse
                      </button>
                    </div>
                  </div>
                )}

                {/* Generation settings */}
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <label className="block space-y-1">
                    <span className="text-slate-400 uppercase text-[9px]">Temp ({builtinLlmConfig.temperature})</span>
                    <input
                      type="range"
                      min="0.1"
                      max="1.5"
                      step="0.1"
                      value={builtinLlmConfig.temperature}
                      onChange={(e) => handleUpdateBuiltinConfig({ temperature: parseFloat(e.target.value) })}
                      className="w-full h-1 bg-cyber-line rounded outline-none appearance-none cursor-pointer accent-cyber-neon"
                    />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-slate-400 uppercase text-[9px]">Max Tokens ({builtinLlmConfig.maxTokens})</span>
                    <input
                      type="range"
                      min="64"
                      max="2048"
                      step="64"
                      value={builtinLlmConfig.maxTokens}
                      onChange={(e) => handleUpdateBuiltinConfig({ maxTokens: parseInt(e.target.value) })}
                      className="w-full h-1 bg-cyber-line rounded outline-none appearance-none cursor-pointer accent-cyber-neon"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Icon Order */}
        <div>
          <h3 className="font-display text-sm uppercase tracking-wider text-slate-400 mb-2 font-bold">Sidebar Icon Order</h3>
          <p className="text-[10px] text-slate-500 mb-3">Reorder sidebar feature icons using the arrow buttons.</p>
          <SidebarOrderEditor />
        </div>
      </div>
    </div>
  );
}

const TAB_LABELS: Record<string, { label: string; icon: string }> = {
  'cli-manager': { label: 'CLI Orchestrator', icon: '💻' },
  'explorer': { label: 'File Explorer', icon: '📁' },
  'quickapps': { label: 'Quick Apps', icon: '⚡' },
  'operator': { label: 'VM Operator', icon: '☁️' },
  'apiclient': { label: 'API Client', icon: '🔗' },
  'logs': { label: 'System Logs', icon: '📋' },
  'remote': { label: 'Remote SSH', icon: '🖥️' },
  'proxy': { label: 'CliProxyAI', icon: '🔀' },
  'settings': { label: 'Settings', icon: '⚙️' },
};

const DEFAULT_ORDER = ['cli-manager', 'explorer', 'quickapps', 'operator', 'apiclient', 'logs', 'remote', 'proxy', 'settings'];

function SidebarOrderEditor() {
  const [order, setOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('ai-cli-sidebar-tabs-order');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* ignore */ }
    }
    return [...DEFAULT_ORDER];
  });

  const saveOrder = (newOrder: string[]) => {
    setOrder(newOrder);
    localStorage.setItem('ai-cli-sidebar-tabs-order', JSON.stringify(newOrder));
    // Notify sidebar to re-read order
    window.dispatchEvent(new CustomEvent('sidebar-order-changed', { detail: newOrder }));
  };

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    const newOrder = [...order];
    [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
    saveOrder(newOrder);
  };

  const moveDown = (idx: number) => {
    if (idx >= order.length - 1) return;
    const newOrder = [...order];
    [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
    saveOrder(newOrder);
  };

  const resetOrder = () => {
    saveOrder([...DEFAULT_ORDER]);
  };

  return (
    <div className="space-y-1.5">
      {order.map((tab, idx) => {
        const info = TAB_LABELS[tab] || { label: tab, icon: '❓' };
        return (
          <div
            key={tab}
            className="flex items-center gap-2 rounded-lg border border-cyber-line/40 bg-cyber-base/30 px-3 py-2 text-xs text-slate-200 group hover:border-cyber-neon/40 transition"
          >
            <span className="text-slate-600 font-mono text-[10px] w-4 text-center shrink-0">{idx + 1}</span>
            <span className="text-base shrink-0">{info.icon}</span>
            <span className="flex-1 font-semibold truncate">{info.label}</span>
            <div className="flex items-center gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition">
              <button
                type="button"
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="flex h-6 w-6 items-center justify-center rounded border border-cyber-line/50 hover:bg-cyber-neon/15 hover:text-cyber-neon disabled:opacity-20 disabled:cursor-not-allowed transition text-[10px]"
                title="Move up"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => moveDown(idx)}
                disabled={idx === order.length - 1}
                className="flex h-6 w-6 items-center justify-center rounded border border-cyber-line/50 hover:bg-cyber-neon/15 hover:text-cyber-neon disabled:opacity-20 disabled:cursor-not-allowed transition text-[10px]"
                title="Move down"
              >
                ▼
              </button>
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={resetOrder}
        className="mt-2 rounded border border-cyber-line/50 px-3 py-1.5 text-[10px] text-slate-400 hover:text-cyber-neon hover:border-cyber-neon/40 transition uppercase tracking-wider font-semibold"
      >
        Reset to Default
      </button>
    </div>
  );
}
