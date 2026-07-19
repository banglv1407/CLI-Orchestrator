import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { AppTheme, BuiltinLlmConfig, BuiltinLlmStatus, LlmConfig, WebAiProfile, WebAiConfig } from '../types';
import { webAiLoadProfiles, webAiSaveProfiles, webAiClearData } from '../lib/tauri';
import { ALL_PETS, getActivePetId, setActivePetId, getPetEnabled, setPetEnabled } from '../lib/mythical-pets';
import { ProxyPanel } from './ProxyPanel';
import { RemoteSshPanel } from './RemoteSshPanel';
import { SystemLogPanel } from './SystemLogPanel';

interface SettingsPanelProps {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

type SettingsSection =
  | 'appearance'
  | 'mythical-pet'
  | 'ai-companion'
  | 'local-llm'
  | 'web-ai'
  | 'navigation'
  | 'proxy'
  | 'remote'
  | 'logs'
  | 'agents';

const SECTIONS: { id: SettingsSection; label: string; icon: string; desc: string }[] = [
  { id: 'appearance', label: 'Appearance', icon: '🎨', desc: 'Theme and visuals configuration' },
  { id: 'mythical-pet', label: 'Mythical Pet', icon: '🐉', desc: 'Interact with your desktop companions' },
  { id: 'ai-companion', label: 'AI Companion', icon: '🤖', desc: 'Configure cloud LLM endpoints and settings' },
  { id: 'local-llm', label: 'Local LLM', icon: '🧠', desc: 'Manage offline inference fallbacks' },
  { id: 'local-llm', label: 'Built-in LLM', icon: '🧠', desc: 'Local AI model management' },
  { id: 'proxy', label: 'CliProxyAI', icon: '🔀', desc: 'Durable API proxy usage and endpoints' },
  { id: 'remote', label: 'SSH Connections', icon: '🖥️', desc: 'Manage remote terminal connections' },
  { id: 'logs', label: 'System Logs', icon: '📋', desc: 'View orchestration command and server logs' },
  { id: 'agents', label: 'Agents', icon: '🤖', desc: 'Manage agent binaries and per-agent config.yaml' },
  { id: 'navigation', label: 'Navigation', icon: '↕️', desc: 'Customize sidebar item layout ordering' },
];

export function SettingsPanel({ theme, setTheme }: SettingsPanelProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>(() => {
    const saved = localStorage.getItem('ai-cli-settings-active-section');
    return (saved as SettingsSection) || 'appearance';
  });

  // Listen for selecting section from deep links (Command Palette or other views)
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvt = e as CustomEvent<string>;
      if (customEvt.detail) {
        setActiveSection(customEvt.detail as SettingsSection);
      }
    };
    window.addEventListener('settings-select-section', handler);
    return () => window.removeEventListener('settings-select-section', handler);
  }, []);

  useEffect(() => {
    localStorage.setItem('ai-cli-settings-active-section', activeSection);
  }, [activeSection]);

  // Pet state
  const [petId, setPetIdLocal] = useState(getActivePetId);
  const [petEnabled, setPetEnabledLocal] = useState(getPetEnabled);

  // Cloud AI Companion state
  const [llmConfig, setLlmConfig] = useState<LlmConfig>({
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    apiKey: '',
    headers: {
      'User-Agent': 'AI-CLI-Orchestrator'
    },
    systemPrompt: 'You are an intelligent terminal companion helping developers with their terminal commands and daily programming tasks. Keep your answers concise, practical and optimized.',
    stream: false,
  });
  const [headersJson, setHeadersJson] = useState('{\n  "User-Agent": "AI-CLI-Orchestrator"\n}');
  const [companionStatusMsg, setCompanionStatusMsg] = useState<string | null>(null);
  const [companionErrorMsg, setCompanionErrorMsg] = useState<string | null>(null);

  // Web AI Profiles state
  const [webAiProfiles, setWebAiProfiles] = useState<WebAiProfile[]>([]);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileUrl, setNewProfileUrl] = useState('');
  const [defaultProfileId, setDefaultProfileId] = useState<string>('');

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

    // Load cloud LLM config
    const savedLlm = localStorage.getItem('ai-cli-llm-config');
    if (savedLlm) {
      try {
        const parsed = JSON.parse(savedLlm);
        setLlmConfig(parsed);
        if (parsed.headers) {
          setHeadersJson(JSON.stringify(parsed.headers, null, 2));
        }
      } catch (e) {
        console.error('Failed to load LLM config:', e);
      }
    }

    // Load Web AI Profiles
    webAiLoadProfiles()
      .then((cfg) => {
        setWebAiProfiles(cfg.profiles);
        if (cfg.preferredProfileId) {
          setDefaultProfileId(cfg.preferredProfileId);
        }
      })
      .catch((err) => console.error('Failed to load Web AI profiles:', err));
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
      setTimeout(async () => {
        const status = await invoke<BuiltinLlmStatus>('builtin_llm_status');
        setBuiltinLlmStatus(status);
      }, 500);
    } catch (err) {
      console.error('Failed to save built-in config:', err);
    }
  };

  // Cloud AI Companion save handler
  const handleSaveCompanionConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanionStatusMsg(null);
    setCompanionErrorMsg(null);

    let parsedHeaders: Record<string, string> = {};
    try {
      if (headersJson.trim()) {
        const parsed = JSON.parse(headersJson);
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          throw new Error('Headers must be a valid JSON Object');
        }
        for (const [k, v] of Object.entries(parsed)) {
          parsedHeaders[k] = String(v);
        }
      }
    } catch (err) {
      setCompanionErrorMsg(err instanceof Error ? err.message : 'Invalid Headers JSON.');
      return;
    }

    const newCfg = {
      ...llmConfig,
      headers: parsedHeaders,
    };

    localStorage.setItem('ai-cli-llm-config', JSON.stringify(newCfg));
    window.dispatchEvent(new CustomEvent('llm-config-changed', { detail: newCfg }));
    setCompanionStatusMsg('Configuration saved successfully!');
    setTimeout(() => setCompanionStatusMsg(null), 3000);
  };

  // Web AI handlers
  const saveWebAiConfig = async (profiles: WebAiProfile[], preferredId?: string) => {
    try {
      await webAiSaveProfiles({
        profiles,
        preferredProfileId: preferredId || defaultProfileId || undefined,
      });
    } catch (e) {
      console.error('Failed to save Web AI config:', e);
    }
  };

  const handleAddWebAiProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim() || !newProfileUrl.trim()) return;

    const id = newProfileName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
    let hostname = '';
    try {
      hostname = new URL(newProfileUrl.trim()).hostname;
    } catch {
      hostname = newProfileUrl.trim();
    }

    const newProfile: WebAiProfile = {
      id,
      name: newProfileName.trim(),
      defaultUrl: newProfileUrl.trim(),
      partition: id,
      allowNavigationRules: [hostname],
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    const next = [...webAiProfiles, newProfile];
    setWebAiProfiles(next);
    saveWebAiConfig(next);

    setNewProfileName('');
    setNewProfileUrl('');
  };

  const handleDeleteWebAiProfile = (id: string) => {
    const next = webAiProfiles.filter((p) => p.id !== id);
    setWebAiProfiles(next);
    let nextDefault = defaultProfileId;
    if (defaultProfileId === id && next.length > 0) {
      nextDefault = next[0].id;
      setDefaultProfileId(nextDefault);
    }
    saveWebAiConfig(next, nextDefault);
  };

  const handleSetDefaultWebAiProfile = (id: string) => {
    setDefaultProfileId(id);
    saveWebAiConfig(webAiProfiles, id);
  };

  const handleClearWebAiData = async () => {
    try {
      await webAiClearData();
      alert('Secure Web AI caches, cookies, and local database sessions have been cleared successfully.');
    } catch (e: any) {
      alert('Failed to clear Web AI data: ' + String(e));
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-cyber-panel/40 p-4 md:p-6 select-none">
      {/* Settings title */}
      <div className="flex shrink-0 items-center justify-between border-b border-cyber-line/50 pb-4 mb-4">
        <div>
          <h2 className="font-display text-base uppercase tracking-[0.2em] text-cyber-neon font-bold">Settings</h2>
          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Category-based Configuration</p>
        </div>
      </div>

      {/* Settings Shell: Rail Layout */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden gap-6">
        {/* Left Rail (Desktop) */}
        <div className="hidden md:flex flex-col w-60 shrink-0 border-r border-cyber-line/20 pr-4 space-y-1.5 overflow-y-auto scrollbar-thin">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg border text-left transition select-none ${
                  isActive
                    ? 'border-cyber-neon bg-cyber-neon/10 text-cyber-neon shadow-neon-glow-sm'
                    : 'border-cyber-line/30 bg-cyber-base/10 text-slate-400 hover:border-cyber-electric/50 hover:bg-cyber-base/30 hover:text-slate-200'
                }`}
              >
                <span className="text-base shrink-0">{sec.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-xs font-display">{sec.label}</div>
                  <div className={`text-[9px] truncate mt-0.5 ${isActive ? 'text-cyber-neon/80' : 'text-slate-500'}`}>{sec.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Top select (Narrow screens) */}
        <div className="block md:hidden shrink-0">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5 font-mono">Category</label>
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value as SettingsSection)}
            className="w-full rounded-lg border border-cyber-line bg-cyber-panel/90 px-3 py-2 text-xs font-semibold text-cyber-neon outline-none focus:border-cyber-neon cursor-pointer"
          >
            {SECTIONS.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.icon} {sec.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right Content Pane */}
        <div className="flex-1 overflow-y-auto pr-1.5 scrollbar-thin space-y-6">
          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <div className="space-y-4">
              <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 border-b border-cyber-line/20 pb-2 font-bold">Theme Settings</h3>
              <label className="flex items-center justify-between rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-4 text-xs text-slate-200 transition hover:border-cyber-neon/80 cursor-pointer">
                <div>
                  <span className="font-semibold">App Theme</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Change overall visual styles</p>
                </div>
                <select
                  value={theme}
                  onChange={(event) => setTheme(event.target.value as AppTheme)}
                  className="rounded border border-cyber-line bg-cyber-base px-3 py-1 font-semibold text-cyber-neon outline-none transition focus:border-cyber-neon cursor-pointer text-xs"
                >
                  <option value="cyberpunk">Cyberpunk</option>
                  <option value="kawaii">Kawaii</option>
                  <option value="light">Light</option>
                </select>
              </label>
            </div>
          )}

          {/* Mythical Pet Section */}
          {activeSection === 'mythical-pet' && (
            <div className="space-y-4">
              <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 border-b border-cyber-line/20 pb-2 font-bold">Mythical Pet</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-4 text-xs text-slate-200 transition hover:border-cyber-neon/80 cursor-pointer">
                  <div>
                    <span className="font-semibold">Enable Pet Overlay</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Show animated avatar pet flying on screen</p>
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
                              ? 'border-cyber-neon bg-cyber-neon/10 text-cyber-neon shadow-neon-sm'
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
          )}

          {/* Cloud AI Companion Section */}
          {activeSection === 'ai-companion' && (
            <div className="space-y-4">
              <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 border-b border-cyber-line/20 pb-2 font-bold">Cloud AI Companion</h3>
              <form onSubmit={handleSaveCompanionConfig} className="space-y-4 text-xs">
                {companionStatusMsg && (
                  <div className="rounded border border-green-500/40 bg-green-950/20 p-3 text-green-300 font-semibold font-mono">
                    ✓ {companionStatusMsg}
                  </div>
                )}
                {companionErrorMsg && (
                  <div className="rounded border border-rose-500/40 bg-rose-950/20 p-3 text-rose-300 font-semibold font-mono">
                    ⚠ {companionErrorMsg}
                  </div>
                )}

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1 font-mono text-[10px]">
                    API Base URL (OpenAI Compatible)
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="e.g. https://api.openai.com/v1"
                    value={llmConfig.baseUrl}
                    onChange={(e) => setLlmConfig({ ...llmConfig, baseUrl: e.target.value })}
                    className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-100 placeholder-slate-600 outline-none transition focus:border-cyber-neon"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1 font-mono text-[10px]">
                      Model Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. gpt-4o-mini"
                      value={llmConfig.model}
                      onChange={(e) => setLlmConfig({ ...llmConfig, model: e.target.value })}
                      className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-100 placeholder-slate-600 outline-none transition focus:border-cyber-neon"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1 font-mono text-[10px]">
                      API Key
                    </label>
                    <input
                      type="password"
                      placeholder="Secret API Key"
                      value={llmConfig.apiKey}
                      onChange={(e) => setLlmConfig({ ...llmConfig, apiKey: e.target.value })}
                      className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-100 placeholder-slate-600 outline-none transition focus:border-cyber-neon"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1 font-mono text-[10px]">
                    Custom Headers (JSON Object)
                  </label>
                  <textarea
                    rows={3}
                    placeholder='e.g. { "User-Agent": "Custom-Agent-Value" }'
                    value={headersJson}
                    onChange={(e) => setHeadersJson(e.target.value)}
                    className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 font-mono text-[11px] text-slate-100 placeholder-slate-600 outline-none transition focus:border-cyber-neon resize-y"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1 font-mono text-[10px]">
                    System Prompt
                  </label>
                  <textarea
                    rows={4}
                    placeholder="System prompt to guide the AI assistant..."
                    value={llmConfig.systemPrompt}
                    onChange={(e) => setLlmConfig({ ...llmConfig, systemPrompt: e.target.value })}
                    className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-100 placeholder-slate-600 outline-none transition focus:border-cyber-neon resize-y"
                  />
                </div>

                <div className="flex items-center gap-2 py-1 select-none">
                  <input
                    type="checkbox"
                    id="llm-stream"
                    checked={llmConfig.stream}
                    onChange={(e) => setLlmConfig({ ...llmConfig, stream: e.target.checked })}
                    className="h-4 w-4 rounded border-cyber-line bg-cyber-base text-cyber-neon outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer accent-cyber-neon"
                  />
                  <label
                    htmlFor="llm-stream"
                    className="font-semibold uppercase tracking-wider text-slate-300 cursor-pointer font-mono text-[10px]"
                  >
                    Enable Stream Mode (Server SSE)
                  </label>
                </div>

                <button
                  type="submit"
                  className="rounded-lg bg-cyber-neon/20 border border-cyber-neon/50 px-5 py-2.5 font-bold uppercase tracking-wider text-cyber-neon hover:bg-cyber-neon/30 transition shadow-neon-sm"
                >
                  Save Configuration
                </button>
              </form>
            </div>
          )}

          {/* Local LLM Section */}
          {activeSection === 'local-llm' && (
            <div className="space-y-4">
              <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 border-b border-cyber-line/20 pb-2 font-bold">Built-in Local LLM</h3>
              <div className="space-y-4 rounded-lg border border-cyber-line/40 bg-cyber-base/20 p-4">
                <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
                  <div>
                    <span className="font-semibold">Enable local LLM fallback</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Use local model when cloud API fails</p>
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
                        <option value="llamacpp">Llama.cpp (Local server - GPU/AVX, GGUF models)</option>
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
          )}

          {/* Web AI Profiles Section */}
          {activeSection === 'web-ai' && (
            <div className="space-y-4">
              <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 border-b border-cyber-line/20 pb-2 font-bold">Web AI Sandboxed Profiles</h3>
              <div className="space-y-4 text-xs">
                {/* Profiles List */}
                <div className="space-y-2">
                  <span className="block font-semibold uppercase tracking-wider text-slate-300 font-mono text-[10px]">Configured Profiles</span>
                  {webAiProfiles.length === 0 ? (
                    <div className="p-4 border border-dashed border-cyber-line text-slate-500 text-center font-mono rounded">
                      No profiles configured. Add one below.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {webAiProfiles.map((p) => (
                        <div
                          key={p.id}
                          className="rounded-lg border border-cyber-line/55 bg-cyber-base/30 transition hover:border-cyber-neon/40 p-3 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <span className="font-bold text-slate-200">{p.name}</span>
                              <span className="text-[10px] text-slate-500 block truncate">{p.defaultUrl}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {defaultProfileId === p.id ? (
                                <span className="rounded bg-cyber-neon/15 border border-cyber-neon/40 text-cyber-neon font-bold text-[9px] px-2 py-0.5 uppercase">
                                  Default
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetDefaultWebAiProfile(p.id)}
                                  className="rounded border border-slate-600 hover:border-cyber-neon/40 px-2 py-0.5 text-[9px] text-slate-400 hover:text-cyber-neon transition uppercase"
                                >
                                  Set Default
                                </button>
                              )}
                              <button
                                  type="button"
                                  onClick={() => handleDeleteWebAiProfile(p.id)}
                                  className="rounded border border-red-500/40 hover:bg-red-950/20 px-2 py-0.5 text-[9px] text-red-400 hover:text-red-300 transition uppercase"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          
                          <details className="text-[10px] text-slate-400 space-y-2">
                            <summary className="cursor-pointer text-[9px] uppercase tracking-wider text-slate-500 hover:text-slate-300 select-none">
                              Edit Advanced Settings
                            </summary>
                            <div className="pt-2 space-y-2.5 border-t border-cyber-line/20">
                              <div className="grid grid-cols-2 gap-2">
                                <label className="block space-y-0.5">
                                  <span className="text-[8px] uppercase tracking-wider text-slate-500">Partition</span>
                                  <input
                                    type="text"
                                    value={p.partition}
                                    onChange={(e) => {
                                      const next = [...webAiProfiles];
                                      const idx = next.findIndex((x) => x.id === p.id);
                                      next[idx] = { ...p, partition: e.target.value };
                                      setWebAiProfiles(next);
                                      saveWebAiConfig(next);
                                    }}
                                    className="w-full bg-cyber-base border border-cyber-line rounded px-2 py-1 text-[10px] text-slate-200 focus:border-cyber-neon outline-none"
                                  />
                                </label>
                                <label className="block space-y-0.5">
                                  <span className="text-[8px] uppercase tracking-wider text-slate-500">Default URL</span>
                                  <input
                                    type="text"
                                    value={p.defaultUrl}
                                    onChange={(e) => {
                                      const next = [...webAiProfiles];
                                      const idx = next.findIndex((x) => x.id === p.id);
                                      next[idx] = { ...p, defaultUrl: e.target.value };
                                      setWebAiProfiles(next);
                                      saveWebAiConfig(next);
                                    }}
                                    className="w-full bg-cyber-base border border-cyber-line rounded px-2 py-1 text-[10px] text-slate-200 focus:border-cyber-neon outline-none"
                                  />
                                </label>
                              </div>
                              <label className="block space-y-0.5">
                                <span className="text-[8px] uppercase tracking-wider text-slate-500">User Agent</span>
                                <input
                                  type="text"
                                  value={p.userAgent || ''}
                                  placeholder="Standard Browser UserAgent"
                                  onChange={(e) => {
                                    const next = [...webAiProfiles];
                                    const idx = next.findIndex((x) => x.id === p.id);
                                    next[idx] = { ...p, userAgent: e.target.value || undefined };
                                    setWebAiProfiles(next);
                                    saveWebAiConfig(next);
                                  }}
                                  className="w-full bg-cyber-base border border-cyber-line rounded px-2 py-1 text-[10px] text-slate-200 focus:border-cyber-neon outline-none"
                                />
                              </label>
                              <label className="block space-y-0.5">
                                <span className="text-[8px] uppercase tracking-wider text-slate-500">Allowed Domains / Navigation Rules (comma separated)</span>
                                <input
                                  type="text"
                                  value={p.allowNavigationRules.join(', ')}
                                  onChange={(e) => {
                                    const next = [...webAiProfiles];
                                    const idx = next.findIndex((x) => x.id === p.id);
                                    next[idx] = {
                                      ...p,
                                      allowNavigationRules: e.target.value
                                        .split(',')
                                        .map((s) => s.trim())
                                        .filter(Boolean),
                                    };
                                    setWebAiProfiles(next);
                                    saveWebAiConfig(next);
                                  }}
                                  className="w-full bg-cyber-base border border-cyber-line rounded px-2 py-1 text-[10px] text-slate-200 focus:border-cyber-neon outline-none"
                                />
                              </label>
                            </div>
                          </details>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Profile Form */}
                <form onSubmit={handleAddWebAiProfile} className="space-y-3 p-4 rounded-lg border border-cyber-line/40 bg-cyber-base/20">
                  <span className="block font-bold uppercase text-[10px] text-slate-300 font-mono border-b border-cyber-line/20 pb-1">
                    Add Web AI Profile
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase text-slate-500 mb-0.5">Profile Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Claude AI"
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        className="w-full rounded border border-cyber-line bg-cyber-base px-2.5 py-1.5 text-slate-200 outline-none focus:border-cyber-neon"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase text-slate-500 mb-0.5">Start URL</label>
                      <input
                        type="url"
                        required
                        placeholder="https://..."
                        value={newProfileUrl}
                        onChange={(e) => setNewProfileUrl(e.target.value)}
                        className="w-full rounded border border-cyber-line bg-cyber-base px-2.5 py-1.5 text-slate-200 outline-none focus:border-cyber-neon"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="rounded border border-cyber-neon/50 bg-cyber-neon/10 hover:bg-cyber-neon/20 px-4 py-1.5 font-bold uppercase tracking-wider text-cyber-neon transition"
                  >
                    Add Profile
                  </button>
                </form>

                {/* Clear Site Data */}
                <div className="p-4 rounded-lg border border-red-500/25 bg-red-950/5 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-300">Clear Site Data</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Removes cache, cookies, and local site databases for Web AI sessions</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearWebAiData}
                    className="rounded border border-red-500/40 hover:bg-red-500/25 px-4 py-2 font-bold text-red-400 hover:text-red-300 transition uppercase"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Section */}
          {activeSection === 'navigation' && (
            <div className="space-y-4">
              <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 border-b border-cyber-line/20 pb-2 font-bold">Sidebar Icon Order</h3>
              <p className="text-[10px] text-slate-500">Reorder sidebar feature icons using the arrow buttons.</p>
              <SidebarOrderEditor />
            </div>
          )}

          {/* CliProxyAI Section */}
          {activeSection === 'proxy' && (
            <div className="space-y-4 h-full flex flex-col">
              <ProxyPanel />
            </div>
          )}

          {/* Remote SSH Section */}
          {activeSection === 'remote' && (
            <div className="space-y-4 h-full flex flex-col">
              <RemoteSshPanel />
            </div>
          )}

          {/* System Logs Section */}
          {activeSection === 'logs' && (
            <div className="space-y-4 h-full flex flex-col">
              <SystemLogPanel />
            </div>
          )}
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
  'settings': { label: 'Settings', icon: '⚙️' },
};

const DEFAULT_ORDER = ['cli-manager', 'explorer', 'quickapps', 'operator', 'apiclient', 'settings'];
const PINNED_TABS = new Set(['settings']);

function normalizeSidebarOrder(order: string[]): string[] {
  let list = [...order];
  return [
    ...list.filter((tab) => !PINNED_TABS.has(tab)),
    ...list.filter((tab) => PINNED_TABS.has(tab)),
  ];
}

function SidebarOrderEditor() {
  const [order, setOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('ai-cli-sidebar-tabs-order');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return normalizeSidebarOrder(parsed);
      } catch { /* ignore */ }
    }
    return [...DEFAULT_ORDER];
  });

  const saveOrder = (newOrder: string[]) => {
    const normalizedOrder = normalizeSidebarOrder(newOrder);
    setOrder(normalizedOrder);
    localStorage.setItem('ai-cli-sidebar-tabs-order', JSON.stringify(normalizedOrder));
    window.dispatchEvent(new CustomEvent('sidebar-order-changed', { detail: normalizedOrder }));
  };

  const moveUp = (idx: number) => {
    if (idx <= 0 || PINNED_TABS.has(order[idx]) !== PINNED_TABS.has(order[idx - 1])) return;
    const newOrder = [...order];
    [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
    saveOrder(newOrder);
  };

  const moveDown = (idx: number) => {
    if (idx >= order.length - 1 || PINNED_TABS.has(order[idx]) !== PINNED_TABS.has(order[idx + 1])) return;
    const newOrder = [...order];
    [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
    saveOrder(newOrder);
  };

  const resetOrder = () => {
    saveOrder([...DEFAULT_ORDER]);
  };

  return (
    <div className="space-y-1.5 text-xs">
      {order.map((tab, idx) => {
        const info = TAB_LABELS[tab] || { label: tab, icon: '❓' };
        const canMoveUp = idx > 0 && PINNED_TABS.has(tab) === PINNED_TABS.has(order[idx - 1]);
        const canMoveDown = idx < order.length - 1 && PINNED_TABS.has(tab) === PINNED_TABS.has(order[idx + 1]);
        return (
          <div
            key={tab}
            className={`flex items-center gap-2 rounded-lg border border-cyber-line/40 bg-cyber-base/30 px-3 py-2 text-xs text-slate-200 group hover:border-cyber-neon/40 transition ${
              PINNED_TABS.has(tab) && (idx === 0 || !PINNED_TABS.has(order[idx - 1])) ? 'mt-4' : ''
            }`}
          >
            <span className="text-slate-600 font-mono text-[10px] w-4 text-center shrink-0">{idx + 1}</span>
            <span className="text-base shrink-0">{info.icon}</span>
            <span className="flex-1 font-semibold truncate">{info.label}</span>
            <div className="flex items-center gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition">
              <button
                type="button"
                onClick={() => moveUp(idx)}
                disabled={!canMoveUp}
                className="flex h-6 w-6 items-center justify-center rounded border border-cyber-line/50 hover:bg-cyber-neon/15 hover:text-cyber-neon disabled:opacity-20 disabled:cursor-not-allowed transition text-[10px]"
                title="Move up"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => moveDown(idx)}
                disabled={!canMoveDown}
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
