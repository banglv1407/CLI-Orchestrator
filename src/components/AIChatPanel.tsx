import { tFeedback as trFeedback, t as tr, formatChatTime } from '../i18n';
import { useState, useEffect, useRef, useCallback } from 'react';
import { listen } from '@tauri-apps/api/event';
import type { CompanionRunEvent, CompanionConfigView } from '../types';
import {
  companionGetConfig,
  companionSaveConfig,
  companionGetHistory,
  companionSend,
  companionCancel,
  companionClearHistory,
  companionImportLegacy,
} from '../lib/tauri';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  runId?: string;
  interfaceFeedback?: boolean;
}

export function AIChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [config, setConfig] = useState<CompanionConfigView | null>(null);
  const [actionsEnabled, setActionsEnabled] = useState(false);
  const [consentShown, setConsentShown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load config + history on mount
  useEffect(() => {
    (async () => {
      try {
        const cfg = await companionGetConfig();
        setConfig(cfg);
        setActionsEnabled(cfg.actionsEnabled);
      } catch { /* ignore */ }
      try {
        const history = await companionGetHistory();
        setMessages(history.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: m.timestamp,
          runId: m.runId,
        })));
      } catch { /* ignore */ }

      // Legacy migration
      const legacyCfg = localStorage.getItem('ai-cli-llm-config');
      const legacyHist = localStorage.getItem('ai-cli-llm-history');
      if (legacyCfg || legacyHist) {
        try {
          const cfg = legacyCfg ? JSON.parse(legacyCfg) : null;
          const hist = legacyHist ? JSON.parse(legacyHist) : [];
          const result = await companionImportLegacy({
            endpoint: cfg?.baseUrl ?? 'https://api.openai.com/v1',
            model: cfg?.model ?? 'gpt-4o-mini',
            api_key: (cfg as any)?.apiKey ?? '',
            headers: cfg?.headers ?? {},
            system_prompt: cfg?.systemPrompt ?? '',
            stream: cfg?.stream ?? true,
            history: Array.isArray(hist) ? hist.map((h: any) => ({
              role: h.role ?? 'user',
              content: h.content ?? '',
              timestamp: h.timestamp ?? new Date().toISOString(),
            })) : [],
          });
          if (result.configImported || result.historyImported > 0) {
            localStorage.removeItem('ai-cli-llm-config');
            localStorage.removeItem('ai-cli-llm-history');
            window.dispatchEvent(new CustomEvent('llm-config-imported'));
            // Reload
            setTimeout(async () => {
              try {
                const history = await companionGetHistory();
                setMessages(history.map(m => ({
                  role: m.role as 'user' | 'assistant',
                  content: m.content,
                  timestamp: m.timestamp,
                  runId: m.runId,
                })));
              } catch {}
            }, 300);
          }
        } catch { /* ignore */ }
      }
    })();
  }, []);

  // Listen for companion run events
  useEffect(() => {
    const unlisten = listen<any>('companion-run-event', (event) => {
      const evt = event.payload; // Direct JSON: {type, run_id, seq, ...variant_fields}
      const runId = evt.run_id;
      const type = evt.type;

      if (type === 'assistant_delta') {
        const delta = evt.delta || '';
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && last.runId === runId && last.content.endsWith('\u258c')) {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...last,
              content: last.content.slice(0, -1) + delta + '\u258c',
            };
            return updated;
          }
          return [...prev, {
            role: 'assistant',
            content: delta + '\u258c',
            timestamp: new Date().toISOString(),
            runId,
          }];
        });
      } else if (type === 'done') {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && last.content.endsWith('\u258c')) {
            const updated = [...prev];
            updated[updated.length - 1] = { ...last, content: last.content.slice(0, -1) };
            return updated;
          }
          return prev;
        });
        setIsRunning(false);
        setCurrentRunId(null);
      } else if (type === 'tool_started') {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `\uD83D\uDD27 Running: ${evt.tool_name}...`,
          interfaceFeedback: true,
          timestamp: new Date().toISOString(),
          runId,
        }]);
      } else if (type === 'tool_result') {
        const icon = evt.verified ? '\u2713' : '\u2717';
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `${icon} ${evt.tool_name}: ${(evt.result || '').slice(0, 200)}`,
          timestamp: new Date().toISOString(),
          runId,
        }]);
      } else if (type === 'error' || type === 'warning') {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `\u26A0 ${evt.message}`,
          interfaceFeedback: true,
          timestamp: new Date().toISOString(),
          runId,
        }]);
        if (type === 'error') {
          setIsRunning(false);
          setCurrentRunId(null);
        }
      } else if (type === 'ui_effect') {
        // Dispatch UI actions to Dashboard + auto-switch sidebar away from AI chat
        const effectType = evt.effect_type;
        const targetId = evt.target_id;
        if (effectType === 'open_view') {
          window.dispatchEvent(new CustomEvent('switch-main-view', { detail: targetId }));
        } else if (effectType === 'open_settings') {
          window.dispatchEvent(new CustomEvent('switch-main-view', { detail: 'settings' }));
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('settings-select-section', { detail: targetId }));
          }, 100);
        } else if (effectType === 'focus_session' || effectType === 'start_session' || effectType === 'stop_session') {
          window.dispatchEvent(new CustomEvent('companion-session-action', { detail: { type: effectType, targetId } }));
        }
      }
    });
    return () => { unlisten.then(fn => fn()); };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 112) + 'px';
    }
  }, [input]);

  const handleSend = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isRunning) return;

    const content = input.trim();
    setInput('');
    setMessages(prev => [...prev, {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }]);

    try {
      setIsRunning(true);
      const { runId } = await companionSend(content);
      setCurrentRunId(runId);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${err}`,
        interfaceFeedback: true,
        timestamp: new Date().toISOString(),
      }]);
      setIsRunning(false);
    }
  }, [input, isRunning]);

  const handleCancel = useCallback(async () => {
    if (!currentRunId) return;
    try {
      await companionCancel(currentRunId);
    } catch { /* ignore */ }
    setIsRunning(false);
    setCurrentRunId(null);
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last?.role === 'assistant' && last.content.endsWith('▌')) {
        const updated = [...prev];
        updated[updated.length - 1] = { ...last, content: last.content.slice(0, -1) + ' [cancelled]' };
        return updated;
      }
      return prev;
    });
  }, [currentRunId]);

  const handleClear = useCallback(async () => {
    try {
      await companionClearHistory();
      setMessages([]);
    } catch { /* ignore */ }
  }, []);

  const handleToggleActions = useCallback(async () => {
    if (!actionsEnabled && !consentShown) {
      setConsentShown(true);
      return;
    }
    const next = !actionsEnabled;
    try {
      await companionSaveConfig({ actionsEnabled: next });
      setActionsEnabled(next);
      setConsentShown(false);
    } catch { /* ignore */ }
  }, [actionsEnabled, consentShown]);

  const handleAcceptConsent = useCallback(async () => {
    try {
      await companionSaveConfig({ actionsEnabled: true });
      setActionsEnabled(true);
      setConsentShown(false);
    } catch { /* ignore */ }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-cyber-line p-3 bg-cyber-base/20">
        <div>
          <h2 className="font-display text-xs uppercase tracking-[0.2em] text-cyber-neon font-bold">{tr("AI Companion")}</h2>
          <div className="flex gap-2 mt-0.5">
            {config && (
              <span className="text-[10px] text-slate-400">{config.model}</span>
            )}
            <span className={`text-[10px] font-semibold ${actionsEnabled ? 'text-cyber-neon' : 'text-slate-500'}`}>
              {actionsEnabled ? tr("Tools enabled") : tr("Q&A only")}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-settings', { detail: 'ai-companion' }))}
            className="rounded border border-cyber-electric/40 px-1.5 py-0.5 text-[9px] font-semibold text-cyber-electric hover:border-cyber-electric hover:bg-cyber-electric/10"
          >{tr("Config")}</button>
          <button
            type="button"
            onClick={handleToggleActions}
            className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold transition ${
              actionsEnabled
                ? 'border-cyber-neon/40 text-cyber-neon hover:bg-cyber-neon/10'
                : 'border-slate-500/40 text-slate-500 hover:bg-slate-500/10'
            }`}
          >{actionsEnabled ? tr("Disable") : tr("Enable")}{tr(" Tools")}</button>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded border border-cyber-warn/40 px-1.5 py-0.5 text-[9px] font-semibold text-cyber-warn hover:bg-cyber-warn/10"
            >{tr("Clear")}</button>
          )}
        </div>
      </div>

      {/* Consent card */}
      {consentShown && (
        <div className="shrink-0 mx-3 mt-2 p-3 rounded-lg border border-cyber-neon/40 bg-cyber-neon/5">
          <p className="text-[12px] text-slate-200 font-semibold mb-1">{tr("Enable App Actions?")}</p>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-2">{tr("App Actions let the AI navigate views, check status, and manage configurations on your behalf. Read-only actions happen automatically. Creating, editing, or deleting anything requires your explicit approval each time.")}</p>
          <p className="text-[11px] text-cyber-warn/80 mb-3">{tr("⚠ Credentials typed in chat are sent to the configured model provider before local redaction.")}</p>
          <div className="flex gap-2">
            <button onClick={handleAcceptConsent} className="rounded bg-cyber-neon/20 border border-cyber-neon px-2.5 py-1 text-[11px] font-semibold text-cyber-neon hover:bg-cyber-neon/30">{tr("Enable Actions")}</button>
            <button onClick={() => setConsentShown(false)} className="rounded border border-slate-500/40 px-2.5 py-1 text-[11px] text-slate-400 hover:bg-slate-500/10">{tr("Cancel")}</button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 py-8">
            <p className="text-[13px] italic">{tr("No messages yet.")}</p>
            <p className="mt-1 text-[12px] text-slate-600">{tr("Ask about features, start sessions, or manage configs.")}</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col max-w-[95%] rounded-lg px-3 py-2 leading-normal ${
                msg.role === 'user'
                  ? 'bg-cyber-neon/10 border border-cyber-neon/30 text-slate-100 self-end ml-auto'
                  : 'bg-cyber-electric/10 border border-cyber-electric/30 text-slate-200 self-start mr-auto'
              }`}
            >
              <span className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${
                msg.role === 'user' ? 'text-cyber-neon' : 'text-cyber-electric'
              }`}>
                {msg.role === 'user' ? tr("You") : tr("Companion")}
                <span className="ml-2 font-normal opacity-50">{formatChatTime(msg.timestamp)}</span>
              </span>
              <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">{msg.interfaceFeedback ? trFeedback(msg.content) : msg.content}</p>
            </div>
          ))
        )}
        {isRunning && !messages.some(m => m.role === 'assistant' && m.content.endsWith('▌')) && (
          <div className="flex items-center gap-2 self-start max-w-[80%] rounded-lg px-3 py-2 bg-cyber-electric/10 border border-cyber-electric/20">
            <span className="text-[13px] text-cyber-electric italic">{tr("Thinking")}</span>
            <span className="flex gap-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyber-electric animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-cyber-electric animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-cyber-electric animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="shrink-0 border-t border-cyber-line p-3">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            placeholder={tr("Type a message...")}
            value={input}
            disabled={isRunning}
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-0 rounded border border-cyber-line bg-cyber-base px-2 py-1.5 text-slate-100 placeholder-slate-500 outline-none focus:border-cyber-neon text-[13px] disabled:opacity-50 resize-none overflow-y-auto"
            style={{ maxHeight: '7rem' }}
          />
          {isRunning ? (
            <button
              type="button"
              onClick={handleCancel}
              className="shrink-0 rounded border border-cyber-warn bg-cyber-warn/15 px-3 py-1.5 font-bold uppercase text-[11px] text-cyber-warn hover:bg-cyber-warn/25 transition"
            >{tr("Cancel")}</button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="shrink-0 rounded border border-cyber-neon bg-cyber-neon/15 px-3 py-1.5 font-bold uppercase text-[11px] text-cyber-neon hover:bg-cyber-neon/25 transition disabled:opacity-30"
            >{tr("Send")}</button>
          )}
        </div>
        <p className="mt-1 text-[10px] text-slate-600">{tr("Enter to send · Shift+Enter for new line")}</p>
      </form>
    </div>
  );
}
