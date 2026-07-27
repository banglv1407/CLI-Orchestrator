import { useState, useEffect } from 'react';
import type { LlmConfig } from '../types';

interface LlmConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LlmConfig;
  onSave: (config: LlmConfig) => void;
}

export function LlmConfigModal({ isOpen, onClose, config, onSave }: LlmConfigModalProps) {
  const [baseUrl, setBaseUrl] = useState(config.baseUrl);
  const [model, setModel] = useState(config.model);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [systemPrompt, setSystemPrompt] = useState(config.systemPrompt);
  const [headersJson, setHeadersJson] = useState(JSON.stringify(config.headers, null, 2));
  const [stream, setStream] = useState(config.stream ?? false);
  const [reasoningEffort, setReasoningEffort] = useState<string>(config.reasoningEffort || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state with prop config when modal opens
  useEffect(() => {
    if (isOpen) {
      setBaseUrl(config.baseUrl);
      setModel(config.model);
      setApiKey(config.apiKey);
      setSystemPrompt(config.systemPrompt);
      setHeadersJson(JSON.stringify(config.headers, null, 2));
      setStream(config.stream ?? false);
      setReasoningEffort(config.reasoningEffort || '');
      setErrorMsg(null);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate headers JSON
    let headers: Record<string, string> = {};
    try {
      if (headersJson.trim()) {
        const parsed = JSON.parse(headersJson);
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          throw new Error('Headers must be a valid JSON Object');
        }
        
        // Ensure all values are strings
        for (const [k, v] of Object.entries(parsed)) {
          headers[k] = String(v);
        }
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Invalid Headers JSON format.');
      return;
    }

    onSave({
      baseUrl: baseUrl.trim(),
      model: model.trim(),
      apiKey: apiKey.trim(),
      systemPrompt: systemPrompt.trim(),
      headers,
      stream,
      reasoningEffort: (reasoningEffort as any) || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg rounded-2xl border border-cyber-line bg-cyber-panel/90 p-6 shadow-neon-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-4 flex items-center justify-between border-b border-cyber-line pb-3">
          <h2 className="font-display text-base font-bold uppercase tracking-[0.15em] text-cyber-neon">
            LLM Configuration
          </h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition text-lg"
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="rounded border border-rose-500/50 bg-rose-950/30 p-2.5 text-rose-300 font-medium">
              ⚠ {errorMsg}
            </div>
          )}

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
              API Base URL (OpenAI Compatible)
            </label>
            <input
              type="url"
              required
              placeholder="e.g. https://api.openai.com/v1"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyber-neon"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Model Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. gpt-4o-mini"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyber-neon"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                API Key
              </label>
              <input
                type="password"
                placeholder="Secret API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyber-neon"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Reasoning Effort
            </label>
            <select
              value={reasoningEffort}
              onChange={(e) => setReasoningEffort(e.target.value)}
              className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-100 outline-none transition focus:border-cyber-neon"
            >
              <option value="">Default (None)</option>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
              <option value="xhigh">xhigh</option>
              <option value="max">max</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Custom Headers (JSON Object)
            </label>
            <textarea
              rows={3}
              placeholder='e.g. { "User-Agent": "Custom-Agent-Value" }'
              value={headersJson}
              onChange={(e) => setHeadersJson(e.target.value)}
              className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 font-mono text-[11px] text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyber-neon"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
              System Prompt
            </label>
            <textarea
              rows={3}
              placeholder="System prompt to guide the AI assistant..."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyber-neon"
            />
          </div>

          <div className="flex items-center gap-2 py-1 select-none">
            <input
              type="checkbox"
              id="llm-stream"
              checked={stream}
              onChange={(e) => setStream(e.target.checked)}
              className="h-4 w-4 rounded border-cyber-line bg-cyber-base text-cyber-neon outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <label 
              htmlFor="llm-stream" 
              className="font-semibold uppercase tracking-wider text-slate-300 cursor-pointer"
            >
              Enable Stream Mode (Set to false if server doesn't support SSE)
            </label>
          </div>

          <footer className="flex justify-end gap-3 pt-3 border-t border-cyber-line">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-cyber-line px-4 py-2 font-bold uppercase tracking-wider text-slate-300 hover:bg-cyber-line/20 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded border border-cyber-neon bg-cyber-neon/15 px-5 py-2 font-bold uppercase tracking-wider text-cyber-neon hover:bg-cyber-neon/25 transition shadow-neon-sm"
            >
              Save Configuration
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
