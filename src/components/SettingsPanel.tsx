import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { AppTheme, BuiltinLlmConfig, BuiltinLlmStatus, LlmConfig } from '../types';
import { petInstallPack, pickFolder } from '../lib/tauri';
import {
  getActivePetId,
  setActivePetId,
  getPetDiagnostics,
  getPetDefaultTuning,
  getPetEnabled,
  getRegisteredPets,
  refreshPetRegistry,
  resolvePetAssetUrl,
  resetPetTuning,
  setPetEnabled,
  setPetTuning,
  type MythicalPet,
} from '../lib/mythical-pets';
import { ProxyPanel } from './ProxyPanel';
import { RemoteSshPanel } from './RemoteSshPanel';
import { SystemLogPanel } from './SystemLogPanel';
import { BuzzNesSettings } from './BuzzNesSettings';
import { PetPreviewStage } from './MythicalPet';
import {
  getUiZoom,
  setUiZoom,
  getUiFontFamily,
  setUiFontFamily,
  getTerminalFontSize,
  setTerminalFontSize,
  getTerminalFontFamily,
  setTerminalFontFamily,
  UI_ZOOM_PRESETS,
  UI_FONT_OPTIONS,
  TERMINAL_FONT_SIZES,
  TERMINAL_FONT_OPTIONS,
  zoomIn,
  zoomOut,
  resetZoom,
} from '../lib/appearance';

function PetPickerThumbnail({ pet }: { pet: MythicalPet }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let disposed = false;
    const source = pet.thumbnail ?? pet.animations.idle.sheet;
    resolvePetAssetUrl(pet, source)
      .then((url) => new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
      }))
      .then((image) => {
        if (disposed) return;
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) return;
        context.clearRect(0, 0, 56, 56);
        context.imageSmoothingEnabled = false;
        if (pet.thumbnail) {
          context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 4, 4, 48, 48);
        } else {
          const clip = pet.animations.idle;
          context.drawImage(
            image,
            0,
            0,
            clip.frameWidth,
            clip.frameHeight,
            4,
            4,
            48,
            48,
          );
        }
      })
      .catch(() => {
        // The picker still shows the pet name and a local-pack diagnostic.
      });
    return () => {
      disposed = true;
    };
  }, [pet]);

  return (
    <canvas
      ref={canvasRef}
      width={56}
      height={56}
      className="h-14 w-14 shrink-0 rounded-lg bg-slate-950/50"
      style={{ imageRendering: 'pixelated' }}
      aria-hidden="true"
    />
  );
}

interface SettingsPanelProps {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

type SettingsSection =
  | 'appearance'
  | 'mythical-pet'
  | 'ai-companion'
  | 'local-llm'
  | 'buzz-nes'
  | 'navigation'
  | 'proxy'
  | 'remote'
  | 'logs';

const SECTIONS: { id: SettingsSection; label: string; icon: string; desc: string }[] = [
  { id: 'appearance', label: 'Appearance', icon: '🎨', desc: 'Theme and visuals configuration' },
  { id: 'mythical-pet', label: 'Mythical Pet', icon: '🐉', desc: 'Interact with your desktop companions' },
  { id: 'ai-companion', label: 'AI Companion', icon: '🤖', desc: 'Configure cloud LLM endpoints and settings' },
  { id: 'local-llm', label: 'Local LLM', icon: '🧠', desc: 'Manage offline inference fallbacks' },
  { id: 'buzz-nes', label: 'Buzz & NES', icon: '🐝', desc: 'Buzz relay/identity and NES session service' },
  { id: 'proxy', label: 'CliProxyAI', icon: '🔀', desc: 'Durable API proxy usage and endpoints' },
  { id: 'remote', label: 'SSH Connections', icon: '🖥️', desc: 'Manage remote terminal connections' },
  { id: 'logs', label: 'System Logs', icon: '📋', desc: 'View orchestration command and server logs' },
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

  // Appearance scaling & font state
  const [uiZoom, setUiZoomState] = useState(getUiZoom);
  const [uiFont, setUiFontState] = useState(getUiFontFamily);
  const [termFontSize, setTermFontSizeState] = useState(getTerminalFontSize);
  const [termFontFamily, setTermFontFamilyState] = useState(getTerminalFontFamily);

  useEffect(() => {
    const onAppChange = () => {
      setUiZoomState(getUiZoom());
      setUiFontState(getUiFontFamily());
    };
    const onTermChange = () => {
      setTermFontSizeState(getTerminalFontSize());
      setTermFontFamilyState(getTerminalFontFamily());
    };
    window.addEventListener('clx-appearance-changed', onAppChange);
    window.addEventListener('clx-terminal-font-changed', onTermChange);
    return () => {
      window.removeEventListener('clx-appearance-changed', onAppChange);
      window.removeEventListener('clx-terminal-font-changed', onTermChange);
    };
  }, []);

  // Pet state
  const [petId, setPetIdLocal] = useState(getActivePetId);
  const [petEnabled, setPetEnabledLocal] = useState(getPetEnabled);
  const [pets, setPets] = useState(getRegisteredPets);
  const [petDiagnostics, setPetDiagnostics] = useState(getPetDiagnostics);
  const [petImporting, setPetImporting] = useState(false);
  const [petImportError, setPetImportError] = useState<string | null>(null);
  const [previewClip, setPreviewClip] = useState('idle');
  const [previewReplay, setPreviewReplay] = useState(0);

  useEffect(() => {
    let disposed = false;
    refreshPetRegistry().then((registered) => {
      if (!disposed) {
        setPets(registered);
        setPetDiagnostics(getPetDiagnostics());
      }
    });
    const onRegistry = () => {
      setPets(getRegisteredPets());
      setPetDiagnostics(getPetDiagnostics());
    };
    window.addEventListener('mythical-pet-registry-change', onRegistry);
    return () => {
      disposed = true;
      window.removeEventListener('mythical-pet-registry-change', onRegistry);
    };
  }, []);

  const selectedPet = pets.find((candidate) => candidate.id === petId) ?? pets[0];
  const selectedPetDefaults = selectedPet
    ? getPetDefaultTuning(selectedPet.id)
    : undefined;
  const selectedPetHasTuning = Boolean(
    selectedPet
    && selectedPetDefaults
    && (
      selectedPet.displaySize !== selectedPetDefaults.displaySize
      || Math.abs(
        selectedPet.speedMultiplier - selectedPetDefaults.speedMultiplier,
      ) > 0.001
    ),
  );

  const updateSelectedPetTuning = (
    update: Partial<Pick<MythicalPet, 'displaySize' | 'speedMultiplier'>>,
  ) => {
    if (!selectedPet) return;
    setPetTuning(selectedPet.id, {
      displaySize: update.displaySize ?? selectedPet.displaySize,
      speedMultiplier:
        update.speedMultiplier ?? selectedPet.speedMultiplier,
    });
    setPreviewReplay((value) => value + 1);
  };

  const handleResetPetTuning = () => {
    if (!selectedPet) return;
    resetPetTuning(selectedPet.id);
    setPreviewReplay((value) => value + 1);
  };

  useEffect(() => {
    setPreviewClip('idle');
    setPreviewReplay((value) => value + 1);
  }, [petId]);

  const handleImportPetPack = async () => {
    setPetImportError(null);
    const sourceDir = await pickFolder();
    if (!sourceDir) return;
    setPetImporting(true);
    try {
      try {
        await petInstallPack(sourceDir, false);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (!message.includes('already installed')) throw error;
        const replace = window.confirm(
          'This pet pack is already installed. Replace it with the selected folder?',
        );
        if (!replace) return;
        await petInstallPack(sourceDir, true);
      }
      const registered = await refreshPetRegistry();
      setPets(registered);
      setPetDiagnostics(getPetDiagnostics());
    } catch (error) {
      setPetImportError(error instanceof Error ? error.message : String(error));
    } finally {
      setPetImporting(false);
    }
  };

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
            <div className="space-y-6">
              {/* Theme Settings */}
              <div className="space-y-3">
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

              {/* UI Scaling & Zoom */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-cyber-line/20 pb-2">
                  <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 font-bold">Display & Scaling</h3>
                  <span className="font-mono text-xs text-cyber-neon font-bold">{uiZoom}%</span>
                </div>

                <div className="rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-4 space-y-3 text-xs text-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-semibold">UI Scale / Zoom</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Phóng to toàn bộ giao diện (chữ, thanh bên, biểu tượng, panel, popups).
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={zoomOut}
                        title="Thu nhỏ (Ctrl -)"
                        className="rounded border border-cyber-line bg-cyber-panel px-2.5 py-1 text-xs font-bold text-slate-300 hover:text-cyber-neon hover:border-cyber-neon transition"
                      >
                        −
                      </button>

                      <select
                        value={uiZoom}
                        onChange={(e) => setUiZoom(Number(e.target.value))}
                        className="rounded border border-cyber-line bg-cyber-base px-3 py-1 font-semibold text-cyber-neon outline-none transition focus:border-cyber-neon cursor-pointer text-xs font-mono"
                      >
                        {UI_ZOOM_PRESETS.map((p) => (
                          <option key={p} value={p}>
                            {p}% {p === 100 ? '(Mặc định)' : p === 115 ? '(Khuyên dùng)' : ''}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={zoomIn}
                        title="Phóng to (Ctrl +)"
                        className="rounded border border-cyber-line bg-cyber-panel px-2.5 py-1 text-xs font-bold text-slate-300 hover:text-cyber-neon hover:border-cyber-neon transition"
                      >
                        +
                      </button>

                      {uiZoom !== 100 && (
                        <button
                          type="button"
                          onClick={resetZoom}
                          title="Đặt lại 100% (Ctrl 0)"
                          className="rounded border border-cyber-line/50 bg-cyber-base px-2 py-1 text-[10px] text-slate-400 hover:text-cyber-neon transition"
                        >
                          100%
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 font-mono">
                    💡 Phím tắt nhanh: <kbd className="px-1 py-0.5 rounded bg-cyber-panel border border-cyber-line/60 text-slate-300">Ctrl +</kbd> để phóng to, <kbd className="px-1 py-0.5 rounded bg-cyber-panel border border-cyber-line/60 text-slate-300">Ctrl -</kbd> để thu nhỏ, <kbd className="px-1 py-0.5 rounded bg-cyber-panel border border-cyber-line/60 text-slate-300">Ctrl 0</kbd> để về 100%.
                  </p>
                </div>

                {/* UI Font Family */}
                <label className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-4 text-xs text-slate-200 transition hover:border-cyber-neon/80 cursor-pointer">
                  <div>
                    <span className="font-semibold">UI Font Family (Phông chữ giao diện)</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Chọn font chuẩn (Segoe UI / Inter) giúp chữ dày dặn, to và dễ đọc hơn đáng kể.
                    </p>
                  </div>
                  <select
                    value={uiFont}
                    onChange={(e) => setUiFontFamily(e.target.value)}
                    className="rounded border border-cyber-line bg-cyber-base px-3 py-1 font-semibold text-cyber-neon outline-none transition focus:border-cyber-neon cursor-pointer text-xs"
                  >
                    {UI_FONT_OPTIONS.map((f) => (
                      <option key={f.id} value={f.fontFamily}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Terminal Font Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-cyber-line/20 pb-2">
                  <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 font-bold">Terminal Font Settings</h3>
                  <span className="font-mono text-xs text-cyber-neon font-bold">{termFontSize}px</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-4 space-y-2 text-xs text-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Terminal Font Size</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setTerminalFontSize(termFontSize - 1)}
                          className="rounded border border-cyber-line bg-cyber-panel px-2 py-0.5 text-xs font-bold text-slate-300 hover:text-cyber-neon transition"
                        >
                          −
                        </button>
                        <select
                          value={termFontSize}
                          onChange={(e) => setTerminalFontSize(Number(e.target.value))}
                          className="rounded border border-cyber-line bg-cyber-base px-2.5 py-1 font-semibold text-cyber-neon outline-none transition focus:border-cyber-neon cursor-pointer text-xs font-mono"
                        >
                          {TERMINAL_FONT_SIZES.map((s) => (
                            <option key={s} value={s}>
                              {s}px {s === 13 ? '(Mặc định)' : s === 15 ? '(Khuyên dùng)' : ''}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setTerminalFontSize(termFontSize + 1)}
                          className="rounded border border-cyber-line bg-cyber-panel px-2 py-0.5 text-xs font-bold text-slate-300 hover:text-cyber-neon transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Cỡ chữ cho tất cả terminal sessions (áp dụng ngay lập tức).
                    </p>
                  </div>

                  <div className="rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-4 space-y-2 text-xs text-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Terminal Font</span>
                      <select
                        value={termFontFamily}
                        onChange={(e) => setTerminalFontFamily(e.target.value)}
                        className="rounded border border-cyber-line bg-cyber-base px-2.5 py-1 font-semibold text-cyber-neon outline-none transition focus:border-cyber-neon cursor-pointer text-xs max-w-[160px] truncate"
                      >
                        {TERMINAL_FONT_OPTIONS.map((f) => (
                          <option key={f.id} value={f.fontFamily}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Phông chữ monospace hiển thị trong cửa sổ terminal.
                    </p>
                  </div>
                </div>

                {/* Live Preview Card */}
                <div className="rounded-lg border border-cyber-line/40 bg-cyber-base/60 p-3 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    <span>Live Preview</span>
                    <span className="text-cyber-neon font-semibold">Scale: {uiZoom}% | Term: {termFontSize}px</span>
                  </div>
                  <div className="space-y-1.5 p-3 rounded border border-cyber-line/30 bg-black/40">
                    <div className="text-xs text-slate-200 font-semibold flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                      Giao diện CLX: Chữ rõ nét, kích thước hiển thị cân đối
                    </div>
                    <div
                      style={{
                        fontFamily: termFontFamily,
                        fontSize: `${termFontSize}px`,
                        lineHeight: 1.4,
                      }}
                      className="p-2 rounded bg-black/60 border border-cyber-line/20 text-slate-300 font-mono overflow-x-auto"
                    >
                      <span className="text-emerald-400">user@clx</span>:<span className="text-cyan-400">~/app</span>$ bun run build && cargo check<br />
                      <span className="text-slate-400">[info]</span> All modules compiled successfully (60 FPS, ready)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mythical Pet Section */}
          {activeSection === 'mythical-pet' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-cyber-line/20 pb-2">
                <div>
                  <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 font-bold">Animated Pets</h3>
                  <p className="mt-1 text-[10px] text-slate-500">Built-in companions and private local pet packs</p>
                </div>
                <button
                  type="button"
                  onClick={handleImportPetPack}
                  disabled={petImporting}
                  className="rounded-lg border border-cyber-neon/60 bg-cyber-neon/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-cyber-neon transition hover:bg-cyber-neon/20 disabled:cursor-wait disabled:opacity-50"
                >
                  {petImporting ? 'Importing…' : 'Import Folder'}
                </button>
              </div>
              {petImportError && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-300">
                  {petImportError}
                </div>
              )}
              {petDiagnostics.length > 0 && (
                <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200">
                  {petDiagnostics.map((diagnostic) => (
                    <div key={`${diagnostic.directory}:${diagnostic.error}`}>
                      <span className="font-semibold">{diagnostic.directory}:</span>{' '}
                      {diagnostic.error}
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-4 text-xs text-slate-200">
                  <div>
                    <span className="font-semibold">Enable Pet Overlay</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Show the selected animated pet across CLX</p>
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
                </div>
                {petEnabled && selectedPet && (
                  <>
                  <div className="rounded-lg border border-cyber-line/40 bg-cyber-base/20 p-4">
                    <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Select Pet</p>
                    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                      {pets.map((p) => (
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
                            <PetPickerThumbnail pet={p} />
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-semibold">{p.name}</div>
                              <div className="mt-0.5 truncate text-[10px] text-slate-500">{p.nameVn || p.packName}</div>
                              <span className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider ${
                                p.source === 'local'
                                  ? 'border-violet-400/40 bg-violet-400/10 text-violet-300'
                                  : 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300'
                              }`}>
                                {p.source === 'local' ? 'Local Pack' : 'Built-in'}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4 rounded-lg border border-cyber-line/40 bg-cyber-base/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Pet Tuning</p>
                        <p className="mt-1 text-[10px] text-slate-500">Saved separately for {selectedPet.name}; preview and live overlay update immediately.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetPetTuning}
                        disabled={!selectedPetHasTuning}
                        className="rounded border border-cyber-line/60 px-2.5 py-1 text-[10px] text-slate-300 transition hover:border-cyber-neon hover:text-cyber-neon disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        Reset
                      </button>
                    </div>
                    <label className="block space-y-2">
                      <span className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        <span>Size</span>
                        <span className="font-mono text-cyber-neon">{selectedPet.displaySize}px</span>
                      </span>
                      <input
                        type="range"
                        min="20"
                        max="160"
                        step="1"
                        value={selectedPet.displaySize}
                        onChange={(event) => updateSelectedPetTuning({
                          displaySize: Number(event.target.value),
                        })}
                        className="h-1 w-full cursor-pointer appearance-none rounded bg-cyber-line accent-cyber-neon"
                      />
                      <span className="flex justify-between text-[9px] text-slate-600">
                        <span>20px</span>
                        <span>160px</span>
                      </span>
                    </label>
                    <label className="block space-y-2">
                      <span className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        <span>Speed</span>
                        <span className="font-mono text-cyber-neon">{selectedPet.speedMultiplier.toFixed(1)}×</span>
                      </span>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={selectedPet.speedMultiplier}
                        onChange={(event) => updateSelectedPetTuning({
                          speedMultiplier: Number(event.target.value),
                        })}
                        className="h-1 w-full cursor-pointer appearance-none rounded bg-cyber-line accent-cyber-neon"
                      />
                      <span className="flex justify-between text-[9px] text-slate-600">
                        <span>0.5×</span>
                        <span>2.0×</span>
                      </span>
                    </label>
                  </div>
                  <div className="space-y-3 rounded-lg border border-cyber-line/40 bg-cyber-base/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Move Preview</p>
                        <p className="mt-1 text-[10px] text-slate-500">Isolated 320×220 stage; the live overlay is not interrupted.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewReplay((value) => value + 1)}
                        className="rounded border border-cyber-line/60 px-2 py-1 text-[10px] text-slate-300 transition hover:border-cyber-neon hover:text-cyber-neon"
                      >
                        Replay
                      </button>
                    </div>
                    <PetPreviewStage
                      pet={selectedPet}
                      clipId={previewClip}
                      replayToken={previewReplay}
                    />
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'idle', label: 'Idle' },
                        { id: 'travel', label: 'Travel' },
                        { id: 'blink', label: 'Blink' },
                        ...selectedPet.moves.map((move) => ({
                          id: move.clip,
                          label: move.label,
                        })),
                      ].map((clipOption) => (
                        <button
                          key={clipOption.id}
                          type="button"
                          onClick={() => {
                            setPreviewClip(clipOption.id);
                            setPreviewReplay((value) => value + 1);
                          }}
                          className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold transition ${
                            previewClip === clipOption.id
                              ? 'border-cyber-neon bg-cyber-neon/10 text-cyber-neon'
                              : 'border-cyber-line/50 text-slate-400 hover:border-cyber-electric/70 hover:text-slate-200'
                          }`}
                        >
                          {clipOption.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  </>
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



          {/* Navigation Section */}
          {activeSection === 'navigation' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 border-b border-cyber-line/20 pb-2 font-bold flex items-center justify-between">
                  <span>Cấu hình Navigation & Hiển thị Feature</span>
                  <span className="text-[10px] text-cyber-neon font-mono font-normal">Active Bar</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Tùy chỉnh bật/tắt hiển thị các tính năng trên thanh Active Bar bên trái và sắp xếp thứ tự ưu tiên.
                  Mặc định hệ thống chỉ hiển thị <strong className="text-amber-400 font-semibold">Terminal Orchestor</strong> và <strong className="text-amber-400 font-semibold">Agent Sessions</strong>.
                </p>
              </div>
              <SidebarOrderEditor />
            </div>
          )}

          {/* Buzz & NES Section */}
          {activeSection === 'buzz-nes' && <BuzzNesSettings />}

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

const TAB_LABELS: Record<string, { label: string; icon: string; desc: string }> = {
  'cli-manager': { label: 'Terminal Orchestor', icon: '💻', desc: 'Quản lý terminal, agent CLI và tác vụ' },
  'agent-sessions': { label: 'Agent Sessions', icon: '🗂', desc: 'Lịch sử hội thoại & resume agent CLI' },
  'dashboard': { label: 'Dashboard', icon: '📊', desc: 'Bảng điều khiển & giám sát hệ thống' },
  'quickapps': { label: 'Quick Apps', icon: '⚡', desc: 'Trình khởi chạy nhanh các ứng dụng ưa thích' },
  'buzz': { label: 'Buzz Workspace', icon: '💬', desc: 'Không gian làm việc cộng tác & chat P2P' },
  'game': { label: 'Entertainment', icon: '🎮', desc: 'Trò chơi cổ điển NES/SNES giải trí' },
  'apiclient': { label: 'API Client', icon: '🔗', desc: 'Công cụ test & gọi API (Postman-like)' },
  'settings': { label: 'Settings', icon: '⚙️', desc: 'Cài đặt hệ thống (cố định thanh dưới)' },
};

const DEFAULT_ORDER = [
  'cli-manager',
  'agent-sessions',
  'dashboard',
  'quickapps',
  'buzz',
  'game',
  'apiclient',
  'settings',
];
const DEFAULT_VISIBLE_TABS = ['cli-manager', 'agent-sessions', 'settings'];
const PINNED_TABS = new Set(['settings']);

function normalizeSidebarOrder(order: string[]): string[] {
  let list = order.filter((tab) => Boolean(TAB_LABELS[tab]));
  for (const def of DEFAULT_ORDER) {
    if (!list.includes(def)) {
      list.push(def);
    }
  }
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

  const [visibleTabs, setVisibleTabs] = useState<string[]>(() => {
    const saved = localStorage.getItem('ai-cli-sidebar-visible-tabs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((t) => Boolean(TAB_LABELS[t]));
        }
      } catch { /* ignore */ }
    }
    return [...DEFAULT_VISIBLE_TABS];
  });

  const saveConfig = (newOrder: string[], newVisible: string[]) => {
    const normalizedOrder = normalizeSidebarOrder(newOrder);
    setOrder(normalizedOrder);
    setVisibleTabs(newVisible);
    localStorage.setItem('ai-cli-sidebar-tabs-order', JSON.stringify(normalizedOrder));
    localStorage.setItem('ai-cli-sidebar-visible-tabs', JSON.stringify(newVisible));
    window.dispatchEvent(new CustomEvent('sidebar-order-changed', { detail: normalizedOrder }));
    window.dispatchEvent(new CustomEvent('sidebar-visibility-changed', { detail: newVisible }));
  };

  const toggleVisibility = (tab: string) => {
    if (visibleTabs.includes(tab) && visibleTabs.length <= 1) {
      return;
    }
    const newVisible = visibleTabs.includes(tab)
      ? visibleTabs.filter((t) => t !== tab)
      : [...visibleTabs, tab];
    saveConfig(order, newVisible);
  };

  const moveUp = (idx: number) => {
    if (idx <= 0 || PINNED_TABS.has(order[idx]) !== PINNED_TABS.has(order[idx - 1])) return;
    const newOrder = [...order];
    [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
    saveConfig(newOrder, visibleTabs);
  };

  const moveDown = (idx: number) => {
    if (idx >= order.length - 1 || PINNED_TABS.has(order[idx]) !== PINNED_TABS.has(order[idx + 1])) return;
    const newOrder = [...order];
    [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
    saveConfig(newOrder, visibleTabs);
  };

  const resetToDefault = () => {
    saveConfig([...DEFAULT_ORDER], [...DEFAULT_VISIBLE_TABS]);
  };

  const showAll = () => {
    saveConfig(order, [...DEFAULT_ORDER]);
  };

  const showOnlyDefaults = () => {
    saveConfig(order, [...DEFAULT_VISIBLE_TABS]);
  };

  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span className="font-medium">
          Danh sách tính năng: <strong className="text-zinc-200">{visibleTabs.length}/{order.length}</strong> đang hiển thị
        </span>
        <div className="flex items-center gap-2 font-medium">
          <button
            type="button"
            onClick={showOnlyDefaults}
            className="text-amber-400 hover:text-amber-300 transition hover:underline cursor-pointer"
          >
            Chỉ hiện mặc định
          </button>
          <span className="text-zinc-600">•</span>
          <button
            type="button"
            onClick={showAll}
            className="text-cyber-neon hover:text-cyber-neon/80 transition hover:underline cursor-pointer"
          >
            Hiện tất cả
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {order.map((tab, idx) => {
          const info = TAB_LABELS[tab] || { label: tab, icon: '❓', desc: '' };
          const isVisible = visibleTabs.includes(tab);
          const isPinned = PINNED_TABS.has(tab);
          const canMoveUp = idx > 0 && PINNED_TABS.has(tab) === PINNED_TABS.has(order[idx - 1]);
          const canMoveDown = idx < order.length - 1 && PINNED_TABS.has(tab) === PINNED_TABS.has(order[idx + 1]);

          return (
            <div
              key={tab}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-xs transition-all ${
                isPinned && (idx === 0 || !PINNED_TABS.has(order[idx - 1])) ? 'mt-4' : ''
              } ${
                isVisible
                  ? 'border-cyber-line/50 bg-cyber-base/40 text-slate-200 hover:border-cyber-neon/40 shadow-sm'
                  : 'border-zinc-800/80 bg-zinc-900/30 text-zinc-500 opacity-60 hover:opacity-90'
              }`}
            >
              {/* Order number */}
              <span className="text-slate-600 font-mono text-[10px] w-4 text-center shrink-0">
                {idx + 1}
              </span>

              {/* Icon */}
              <span className="text-lg shrink-0">{info.icon}</span>

              {/* Label & Description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold truncate ${isVisible ? 'text-zinc-100' : 'text-zinc-400'}`}>
                    {info.label}
                  </span>
                  {isPinned && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-zinc-800 text-zinc-400 border border-zinc-700">
                      Cố định dưới
                    </span>
                  )}
                  {tab === 'cli-manager' && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                      Mặc định
                    </span>
                  )}
                  {tab === 'agent-sessions' && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                      Mặc định
                    </span>
                  )}
                </div>
                {info.desc && (
                  <p className="text-[10px] text-zinc-500 truncate mt-0.5">{info.desc}</p>
                )}
              </div>

              {/* Toggle Show/Hide Button */}
              <button
                type="button"
                onClick={() => toggleVisibility(tab)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                  isVisible
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25 shadow-sm'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200 hover:bg-zinc-700/60'
                }`}
                title={isVisible ? 'Nhấp để ẩn khỏi thanh Active Bar' : 'Nhấp để hiển thị trên thanh Active Bar'}
              >
                <span>{isVisible ? '👁️' : '🙈'}</span>
                <span>{isVisible ? 'Hiển thị' : 'Đã ẩn'}</span>
              </button>

              {/* Reorder Buttons */}
              <div className="flex items-center gap-1 shrink-0 opacity-60 hover:opacity-100 transition">
                <button
                  type="button"
                  onClick={() => moveUp(idx)}
                  disabled={!canMoveUp}
                  className="flex h-6 w-6 items-center justify-center rounded border border-cyber-line/50 hover:bg-cyber-neon/15 hover:text-cyber-neon disabled:opacity-20 disabled:cursor-not-allowed transition text-[10px] cursor-pointer"
                  title="Di chuyển lên"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(idx)}
                  disabled={!canMoveDown}
                  className="flex h-6 w-6 items-center justify-center rounded border border-cyber-line/50 hover:bg-cyber-neon/15 hover:text-cyber-neon disabled:opacity-20 disabled:cursor-not-allowed transition text-[10px] cursor-pointer"
                  title="Di chuyển xuống"
                >
                  ▼
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-cyber-line/20">
        <button
          type="button"
          onClick={resetToDefault}
          className="rounded border border-cyber-line/50 px-3 py-1.5 text-[10px] text-slate-400 hover:text-cyber-neon hover:border-cyber-neon/40 transition uppercase tracking-wider font-semibold cursor-pointer"
        >
          Reset to Default
        </button>
        <span className="text-[10px] text-zinc-500 font-mono">
          Thanh Active Bar sẽ tự động cập nhật ngay khi thay đổi
        </span>
      </div>
    </div>
  );
}
