import { useCallback, useEffect, useMemo, useRef } from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import type { CliOutputEvent, CliStatusEvent, SessionInfo } from '../types';

interface TerminalPanelProps {
  sessions: SessionInfo[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onSendInput: (sessionId: string, input: string) => void;
  onStopSession: (sessionId: string) => void;
  onSaveTag: (cliName: string, tag: string, directory: string) => Promise<void>;
}

interface TerminalHandle {
  term: Terminal;
  fit: FitAddon;
}

const INPUT_FLUSH_MS = 16;

export function TerminalPanel({
  sessions,
  activeSessionId,
  onSelectSession,
  onSendInput,
  onStopSession,
  onSaveTag,
}: TerminalPanelProps) {
  const terminalRefs = useRef<Record<string, TerminalHandle>>({});
  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const inputBuffers = useRef<Record<string, string>>({});
  const inputTimers = useRef<Record<string, number>>({});
  const pendingTerminalWrites = useRef<Record<string, string[]>>({});

  const visibleSessionId = useMemo(() => {
    if (activeSessionId && sessions.some((session) => session.id === activeSessionId)) {
      return activeSessionId;
    }
    return sessions[0]?.id ?? null;
  }, [activeSessionId, sessions]);

  const flushInput = useCallback(
    (sessionId: string) => {
      const payload = inputBuffers.current[sessionId];
      if (!payload) {
        return;
      }

      inputBuffers.current[sessionId] = '';
      delete inputTimers.current[sessionId];
      onSendInput(sessionId, payload);
    },
    [onSendInput],
  );

  const handleResetView = useCallback(() => {
    if (!visibleSessionId) return;
    const handle = terminalRefs.current[visibleSessionId];
    if (!handle) return;

    handle.term.clear();
    handle.fit.fit();
  }, [visibleSessionId]);

  const handleSaveTag = useCallback(async () => {
    if (!visibleSessionId) return;
    const session = sessions.find((s) => s.id === visibleSessionId);
    if (!session || !session.workingDir) return;

    const newTag = window.prompt('Enter project tag name:', session.projectTag || '');
    if (newTag === null) return;

    const trimmed = newTag.trim();
    if (!trimmed) return;

    await onSaveTag(session.cliName, trimmed, session.workingDir);
  }, [visibleSessionId, sessions, onSaveTag]);

  const ensureTerminal = useCallback(
    (session: SessionInfo) => {
      if (terminalRefs.current[session.id]) {
        return;
      }

      const mountNode = containerRefs.current[session.id];
      if (!mountNode) {
        return;
      }

      // Guard against React StrictMode double-invocation:
      // xterm adds the class 'xterm' to the node after opening.
      if (mountNode.classList.contains('xterm')) {
        return;
      }

      const term = new Terminal({
        cursorBlink: true,
        convertEol: true,
        scrollback: 5000,
        fontFamily: 'Fira Code, monospace',
        fontSize: 13,
        theme: {
          background: '#0a0f1f',
          foreground: '#d8f7ff',
          cursor: '#00ffd1',
          selectionBackground: '#1f3658',
          black: '#0a0f1f',
          red: '#ff5f6d',
          green: '#b6ff2f',
          yellow: '#f8e16a',
          blue: '#43b8ff',
          magenta: '#ff77aa',
          cyan: '#00ffd1',
          white: '#e7efff',
          brightBlack: '#3a4d6b',
          brightRed: '#ff7f88',
          brightGreen: '#d7ff86',
          brightYellow: '#ffe894',
          brightBlue: '#75ccff',
          brightMagenta: '#ff99c2',
          brightCyan: '#6dffe3',
          brightWhite: '#ffffff',
        },
      });

      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(mountNode);
      fit.fit();
      term.onResize((dim) => {
        invoke('resize_cli', {
          request: { sessionId: session.id, rows: dim.rows, cols: dim.cols },
        }).catch(console.error);
      });
      term.writeln(`Connected to session: ${session.id}`);
      if (session.projectTag || session.workingDir) {
        const projectLine = [session.projectTag, session.workingDir].filter(Boolean).join(' | ');
        term.writeln(projectLine);
      }

      // Use onData for PTY: xterm does NOT echo locally; the PTY backend
      // echoes input back as output which we display via cli-output events.
      term.onData((data) => {
        inputBuffers.current[session.id] = `${inputBuffers.current[session.id] ?? ''}${data}`;

        if (inputTimers.current[session.id]) {
          return;
        }

        inputTimers.current[session.id] = window.setTimeout(() => {
          flushInput(session.id);
        }, INPUT_FLUSH_MS);
      });

      if (pendingTerminalWrites.current[session.id]?.length) {
        for (const chunk of pendingTerminalWrites.current[session.id]) {
          term.write(chunk);
        }
        delete pendingTerminalWrites.current[session.id];
      }

      terminalRefs.current[session.id] = { term, fit };
    },
    [flushInput],
  );

  useEffect(() => {
    sessions.forEach((session) => ensureTerminal(session));

    const existingIds = Object.keys(terminalRefs.current);
    existingIds.forEach((sessionId) => {
      if (!sessions.some((session) => session.id === sessionId)) {
        terminalRefs.current[sessionId].term.dispose();
        delete terminalRefs.current[sessionId];
        delete containerRefs.current[sessionId];
        delete inputBuffers.current[sessionId];
        delete pendingTerminalWrites.current[sessionId];
        if (inputTimers.current[sessionId]) {
          window.clearTimeout(inputTimers.current[sessionId]);
          delete inputTimers.current[sessionId];
        }
      }
    });
  }, [ensureTerminal, sessions]);

  useEffect(() => {
    let isCancelled = false;
    let unlistenOutput: (() => void) | undefined;
    let unlistenStatus: (() => void) | undefined;

    const setup = async () => {
      unlistenOutput = await listen<CliOutputEvent>('cli-output', (event) => {
        const payload = event.payload;
        if (!payload.sessionId) {
          return;
        }
        const handle = terminalRefs.current[payload.sessionId];
        if (!handle) {
          if (!pendingTerminalWrites.current[payload.sessionId]) {
            pendingTerminalWrites.current[payload.sessionId] = [];
          }
          pendingTerminalWrites.current[payload.sessionId].push(payload.chunk);
          return;
        }
        handle.term.write(payload.chunk);
      });

      if (isCancelled) {
        unlistenOutput();
      }

      unlistenStatus = await listen<CliStatusEvent>('cli-status', (event) => {
        const payload = event.payload;
        if (!payload.sessionId) {
          return;
        }
        const handle = terminalRefs.current[payload.sessionId];
        const statusText = payload.message ? ` ${payload.message}` : '';
        if (!handle) {
          if (!pendingTerminalWrites.current[payload.sessionId]) {
            pendingTerminalWrites.current[payload.sessionId] = [];
          }
          pendingTerminalWrites.current[payload.sessionId].push(`\r\n[${payload.status}]${statusText}`);
          return;
        }
        handle.term.writeln(`\r\n[${payload.status}]${statusText}`);
      });

      if (isCancelled) {
        unlistenStatus();
      }
    };

    void setup();

    return () => {
      isCancelled = true;
      unlistenOutput?.();
      unlistenStatus?.();
    };
  }, []);

  useEffect(() => {
    if (!visibleSessionId) {
      return;
    }

    const handle = terminalRefs.current[visibleSessionId];
    if (!handle) {
      return;
    }

    const timer = window.setTimeout(() => handle.fit.fit(), 0);
    return () => window.clearTimeout(timer);
  }, [visibleSessionId]);

  useEffect(() => {
    return () => {
      Object.values(inputTimers.current).forEach((timer) => window.clearTimeout(timer));
      Object.values(terminalRefs.current).forEach((item) => item.term.dispose());
      terminalRefs.current = {};
      inputBuffers.current = {};
      inputTimers.current = {};
      pendingTerminalWrites.current = {};
      containerRefs.current = {};
    };
  }, []);

  return (
    <section className="flex h-full min-h-0 flex-col rounded-xl border border-cyber-line bg-cyber-panel/70">
      <header className="flex items-center justify-between border-b border-cyber-line p-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => onSelectSession(session.id)}
              className={`rounded border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${visibleSessionId === session.id
                ? 'border-cyber-neon bg-cyber-neon/15 text-cyber-neon'
                : 'border-cyber-line bg-cyber-base text-slate-300'
                }`}
            >
              {session.cliName}
            </button>
          ))}
        </div>

        {visibleSessionId ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveTag}
              className="rounded border border-cyber-neon/70 px-3 py-1 text-xs uppercase tracking-wider text-cyber-neon transition hover:bg-cyber-neon/10"
            >
              Save Tag
            </button>
            <button
              type="button"
              onClick={handleResetView}
              className="rounded border border-cyber-electric/70 px-3 py-1 text-xs uppercase tracking-wider text-cyber-electric transition hover:bg-cyber-electric/10"
            >
              Reset View
            </button>
            <button
              type="button"
              onClick={() => onStopSession(visibleSessionId)}
              className="rounded border border-cyber-warn/70 px-3 py-1 text-xs uppercase tracking-wider text-cyber-warn transition hover:bg-cyber-warn/10"
            >
              Stop
            </button>
          </div>
        ) : null}
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        {sessions.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No interactive sessions. Create one from the sidebar.
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`h-full w-full ${visibleSessionId === session.id ? 'block' : 'hidden'}`}
            >
              <div
                ref={(node) => {
                  containerRefs.current[session.id] = node;
                  if (node) {
                    ensureTerminal(session);
                  }
                }}
                className="h-full w-full"
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
