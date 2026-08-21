import { useState, useEffect, useRef, useCallback } from 'react';
import type { CompanionConfigView } from './api';
import {
  companionGetConfig,
  companionSaveConfig,
  companionGetHistory,
  companionSend,
  companionCancel,
  companionClearHistory,
  companionPollEvents,
} from './api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  runId?: string;
}

export function CompanionChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [config, setConfig] = useState<CompanionConfigView | null>(null);
  const [actionsEnabled, setActionsEnabled] = useState(false);
  const [consentShown, setConsentShown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    })();
  }, []);

  // Poll for events while running
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(async () => {
      try {
        const events = await companionPollEvents();
        for (const evt of events) {
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
                timestamp: new Date().toLocaleTimeString(),
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
              timestamp: new Date().toLocaleTimeString(),
              runId,
            }]);
          } else if (type === 'tool_result') {
            const icon = evt.verified ? '\u2713' : '\u2717';
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `${icon} ${evt.tool_name}: ${(evt.result || '').slice(0, 200)}`,
              timestamp: new Date().toLocaleTimeString(),
              runId,
            }]);
          } else if (type === 'error' || type === 'warning') {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `\u26A0 ${evt.message}`,
              timestamp: new Date().toLocaleTimeString(),
              runId,
            }]);
            if (type === 'error') {
              setIsRunning(false);
              setCurrentRunId(null);
            }
          }
        }
      } catch { /* ignore */ }
    }, 100);
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
      timestamp: new Date().toLocaleTimeString(),
    }]);
    try {
      setIsRunning(true);
      const { runId } = await companionSend(content, actionsEnabled);
      setCurrentRunId(runId);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${err}`,
        timestamp: new Date().toLocaleTimeString(),
      }]);
      setIsRunning(false);
    }
  }, [input, isRunning, actionsEnabled]);

  const handleCancel = useCallback(async () => {
    if (!currentRunId) return;
    try { await companionCancel(currentRunId); } catch { /* ignore */ }
    setIsRunning(false);
    setCurrentRunId(null);
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-cyber-base text-slate-100">
      <div className="flex shrink-0 items-center justify-between border-b border-cyber-line p-3 bg-cyber-base/20">
        <div>
          <h2 className="font-display text-xs uppercase tracking-[0.2em] text-cyber-neon font-bold">AI Companion</h2>
          <div className="flex gap-2 mt-0.5">
            {config && <span className="text-[10px] text-slate-400">{config.model}</span>}
            <span className={`text-[10px] font-semibold ${actionsEnabled ? 'text-cyber-neon' : 'text-slate-500'}`}>
              {actionsEnabled ? 'Tools enabled' : 'Q&A only'}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={handleToggleActions}
            className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold transition ${
              actionsEnabled
                ? 'border-cyber-neon/40 text-cyber-neon hover:bg-cyber-neon/10'
                : 'border-slate-500/40 text-slate-500 hover:bg-slate-500/10'
            }`}
          >{actionsEnabled ? 'Disable' : 'Enable'} Tools</button>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded border border-cyber-warn/40 px-1.5 py-0.5 text-[9px] font-semibold text-cyber-warn hover:bg-cyber-warn/10"
            >Clear</button>
          )}
        </div>
      </div>

      {consentShown && (
        <div className="shrink-0 mx-3 mt-2 p-3 rounded-lg border border-cyber-neon/40 bg-cyber-neon/5">
          <p className="text-[12px] text-slate-200 font-semibold mb-1">Enable App Actions?</p>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
            App Actions let the AI navigate views, check status, and manage configurations on your behalf.
          </p>
          <div className="flex gap-2">
            <button onClick={() => { companionSaveConfig({ actionsEnabled: true }); setActionsEnabled(true); setConsentShown(false); }} className="rounded bg-cyber-neon/20 border border-cyber-neon px-2.5 py-1 text-[11px] font-semibold text-cyber-neon hover:bg-cyber-neon/30">Enable</button>
            <button onClick={() => setConsentShown(false)} className="rounded border border-slate-500/40 px-2.5 py-1 text-[11px] text-slate-400 hover:bg-slate-500/10">Cancel</button>
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 py-8">
            <p className="text-[13px] italic">No messages yet.</p>
            <p className="mt-1 text-[12px] text-slate-600">Ask about features, start sessions, or manage configs.</p>
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
                {msg.role === 'user' ? 'You' : 'Companion'}
                <span className="ml-2 font-normal opacity-50">{msg.timestamp}</span>
              </span>
              <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">{msg.content}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend} className="shrink-0 border-t border-cyber-line p-3">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            placeholder="Type a message..."
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
            >Cancel</button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="shrink-0 rounded border border-cyber-neon bg-cyber-neon/15 px-3 py-1.5 font-bold uppercase text-[11px] text-cyber-neon hover:bg-cyber-neon/25 transition disabled:opacity-30"
            >Send</button>
          )}
        </div>
      </form>
    </div>
  );
}
