import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import type { CliOutputEvent, CliStatusEvent, SessionInfo, SshConnection } from '../types';

interface TerminalPanelProps {
  sessions: SessionInfo[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onSendInput: (sessionId: string, input: string) => void;
  onStopSession: (sessionId: string) => void;
  onSaveTag: (cliName: string, tag: string, directory: string) => Promise<void>;
  sshConnections: SshConnection[];
}

interface TerminalHandle {
  term: Terminal;
  fit: FitAddon;
  miniTerm: Terminal;
  miniFit: FitAddon;
  writeQueue: string[];
  isWriting: boolean;
  isAtBottom: boolean;
  cleanupScroll: () => void;
  cleanupMiniScroll: () => void;
}

const INPUT_FLUSH_MS = 16;
const MOUNT_DELAY_MS = 50;

export function TerminalPanel({
  sessions,
  activeSessionId,
  onSelectSession,
  onSendInput,
  onStopSession,
  onSaveTag,
  sshConnections,
}: TerminalPanelProps) {
  const terminalRefs = useRef<Record<string, TerminalHandle>>({});
  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const miniContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const inputBuffers = useRef<Record<string, string>>({});
  const inputTimers = useRef<Record<string, number>>({});
  const pendingTerminalWrites = useRef<Record<string, string[]>>({});
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const initializedRef = useRef<Record<string, boolean>>({});
  const containerToSessionRef = useRef<WeakMap<Element, string>>(new WeakMap());

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    sessionId: string;
  } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, sessionId: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      sessionId,
    });
  };

  useEffect(() => {
    const handleGlobalClick = () => {
      setContextMenu(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const processWriteQueue = async (sessionId: string) => {
    const handle = terminalRefs.current[sessionId];
    if (!handle || handle.isWriting || handle.writeQueue.length === 0) {
      return;
    }

    handle.isWriting = true;
    const wasAtBottom = handle.isAtBottom;

    while (handle.writeQueue.length > 0) {
      const chunk = handle.writeQueue.shift();
      if (chunk) {
        await new Promise<void>((resolve) => {
          handle.term.write(chunk, () => resolve());
          if (handle.miniTerm) {
            handle.miniTerm.write(chunk);
          }
        });
      }
    }

    if (wasAtBottom) {
      handle.term.scrollToBottom();
    }
    if (handle.miniTerm) {
      handle.miniTerm.scrollToBottom();
    }

    handle.isWriting = false;
  };

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

  const fitTerminal = useCallback((sessionId: string) => {
    if (sessionId !== visibleSessionId) {
      return;
    }
    const handle = terminalRefs.current[sessionId];
    if (handle) {
      handle.fit.fit();
      handle.term.refresh(0, handle.term.rows - 1);
    }
  }, [visibleSessionId]);

  const getTerminalTheme = () => ({
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
  });

  const initializeSessionTerminal = useCallback(
    (session: SessionInfo) => {
      let handle = terminalRefs.current[session.id];
      if (handle) {
        return handle;
      }

      const term = new Terminal({
        cursorBlink: true,
        convertEol: true,
        scrollback: 5000,
        fontFamily: 'Fira Code, monospace',
        fontSize: 13,
        disableStdin: false,
        scrollOnUserInput: true,
        theme: getTerminalTheme(),
      });

      const miniTerm = new Terminal({
        cursorBlink: false,
        convertEol: true,
        scrollback: 2000,
        fontFamily: 'Fira Code, monospace',
        fontSize: 7,
        disableStdin: true,
        scrollOnUserInput: false,
        theme: getTerminalTheme(),
      });

      term.attachCustomKeyEventHandler((event) => {
        if (event.ctrlKey && event.key === 'c') {
          if (term.hasSelection()) {
            const selected = term.getSelection();
            void navigator.clipboard.writeText(selected);
            return false;
          }
        }
        if (event.ctrlKey && event.key === 'v') {
          if (event.type === 'keydown') {
            void navigator.clipboard.readText().then((text) => {
              if (text) {
                onSendInput(session.id, text);
              }
            });
          }
          return false;
        }
        if (event.shiftKey && event.key === 'Enter') {
          if (event.type === 'keydown') {
            onSendInput(session.id, '\n');
          }
          return false;
        }
        return true;
      });

      const fit = new FitAddon();
      term.loadAddon(fit);

      const miniFit = new FitAddon();
      miniTerm.loadAddon(miniFit);

      terminalRefs.current[session.id] = {
        term,
        fit,
        miniTerm,
        miniFit,
        writeQueue: [],
        isWriting: false,
        isAtBottom: true,
        cleanupScroll: () => {},
        cleanupMiniScroll: () => {},
      };
      handle = terminalRefs.current[session.id];

      term.onResize((dim) => {
        invoke('resize_cli', {
          request: { sessionId: session.id, rows: dim.rows, cols: dim.cols },
        }).catch(console.error);
      });

      term.writeln(`Connected to session: ${session.id}`);
      miniTerm.writeln(`Connected to session: ${session.id}`);
      if (session.projectTag || session.workingDir) {
        const projectLine = [session.projectTag, session.workingDir].filter(Boolean).join(' | ');
        term.writeln(projectLine);
        miniTerm.writeln(projectLine);
      }

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
          miniTerm.write(chunk);
        }
        delete pendingTerminalWrites.current[session.id];
      }

      return handle;
    },
    [flushInput, onSendInput],
  );

  const ensureTerminal = useCallback(
    (session: SessionInfo, mountNode: HTMLDivElement | null) => {
      if (!mountNode) {
        return;
      }

      const handle = initializeSessionTerminal(session);

      if (handle.term.element !== mountNode) {
        handle.cleanupScroll();
        handle.term.open(mountNode);

        const viewport = mountNode.querySelector('.xterm-viewport') as HTMLElement;
        if (viewport) {
          viewport.style.overflowY = 'auto';
        }

        let scrollTimeout: number | null = null;
        const handleScroll = () => {
          if (scrollTimeout) {
            window.clearTimeout(scrollTimeout);
          }
          scrollTimeout = window.setTimeout(() => {
            if (viewport) {
              const atBottom = Math.abs(viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight) < 50;
              handle.isAtBottom = atBottom;
            }
          }, 100);
        };

        if (viewport) {
          viewport.addEventListener('scroll', handleScroll);
        }

        handle.cleanupScroll = () => {
          if (viewport) {
            viewport.removeEventListener('scroll', handleScroll);
          }
          if (scrollTimeout) {
            window.clearTimeout(scrollTimeout);
          }
        };

        setTimeout(() => {
          handle.fit.fit();
          handle.term.refresh(0, handle.term.rows - 1);
        }, MOUNT_DELAY_MS);
      }
    },
    [initializeSessionTerminal],
  );

  const ensureMiniTerminal = useCallback(
    (session: SessionInfo, mountNode: HTMLDivElement | null) => {
      if (!mountNode) {
        return;
      }

      const handle = initializeSessionTerminal(session);

      if (handle.miniTerm.element !== mountNode) {
        handle.cleanupMiniScroll();
        handle.miniTerm.open(mountNode);

        const viewport = mountNode.querySelector('.xterm-viewport') as HTMLElement;
        if (viewport) {
          viewport.style.overflowY = 'hidden';
        }

        handle.cleanupMiniScroll = () => {};

        setTimeout(() => {
          handle.miniFit.fit();
          handle.miniTerm.refresh(0, handle.miniTerm.rows - 1);
        }, MOUNT_DELAY_MS);
      }
    },
    [initializeSessionTerminal],
  );

  useEffect(() => {
    sessions.forEach((session) => {
      ensureTerminal(session, containerRefs.current[session.id]);
      ensureMiniTerminal(session, miniContainerRefs.current[session.id]);
    });

    const existingIds = Object.keys(terminalRefs.current);
    existingIds.forEach((sessionId) => {
      if (!sessions.some((session) => session.id === sessionId)) {
        terminalRefs.current[sessionId].cleanupScroll();
        terminalRefs.current[sessionId].cleanupMiniScroll();
        terminalRefs.current[sessionId].term.dispose();
        terminalRefs.current[sessionId].miniTerm.dispose();
        terminalRefs.current[sessionId].writeQueue = [];
        terminalRefs.current[sessionId].isWriting = false;
        delete terminalRefs.current[sessionId];
        delete containerRefs.current[sessionId];
        delete miniContainerRefs.current[sessionId];
        delete inputBuffers.current[sessionId];
        delete pendingTerminalWrites.current[sessionId];
        delete initializedRef.current[sessionId];
        if (inputTimers.current[sessionId]) {
          window.clearTimeout(inputTimers.current[sessionId]);
          delete inputTimers.current[sessionId];
        }
      }
    });
  }, [ensureTerminal, ensureMiniTerminal, sessions]);

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
        handle.writeQueue.push(payload.chunk);
        void processWriteQueue(payload.sessionId);
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
        handle.writeQueue.push(`\r\n[${payload.status}]${statusText}`);
        void processWriteQueue(payload.sessionId);
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

    const refreshTerm = () => {
      handle.fit.fit();
      handle.term.refresh(0, handle.term.rows - 1);
    };

    refreshTerm();
    
    const timer1 = window.setTimeout(refreshTerm, 0);
    const timer2 = window.setTimeout(refreshTerm, MOUNT_DELAY_MS);
    const timer3 = window.setTimeout(refreshTerm, 100);
    const timer4 = window.setTimeout(refreshTerm, 250);

    return () => {
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
      window.clearTimeout(timer3);
      window.clearTimeout(timer4);
    };
  }, [visibleSessionId]);

  useEffect(() => {
    const containers = containerRefs.current;
    const sessionIds = Object.keys(containers);

    if (sessionIds.length === 0) {
      return;
    }

    const observerCallback = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const sessionId = containerToSessionRef.current.get(entry.target);
        if (sessionId) {
          fitTerminal(sessionId);
        }
      }
    };

    resizeObserverRef.current = new ResizeObserver(observerCallback);

    sessionIds.forEach((sessionId) => {
      const container = containers[sessionId];
      if (container) {
        resizeObserverRef.current?.observe(container);
      }
    });

    return () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, [sessions, fitTerminal, visibleSessionId]);

  useEffect(() => {
    return () => {
      Object.values(inputTimers.current).forEach((timer) => window.clearTimeout(timer));
      Object.values(terminalRefs.current).forEach((item) => {
        item.cleanupScroll();
        item.cleanupMiniScroll();
        item.term.dispose();
        item.miniTerm.dispose();
        item.writeQueue = [];
        item.isWriting = false;
      });
      terminalRefs.current = {};
      inputBuffers.current = {};
      inputTimers.current = {};
      pendingTerminalWrites.current = {};
      containerRefs.current = {};
      miniContainerRefs.current = {};
      initializedRef.current = {};
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, []);

  const activeSession = sessions.find((s) => s.id === visibleSessionId);
  const matchedSsh = useMemo(() => {
    if (!activeSession) return null;
    return sshConnections.find((c) => `SSH: ${c.name}` === activeSession.cliName);
  }, [activeSession, sshConnections]);

  // Dynamic height and scale calculation to ensure up to 10 sessions fit on a single screen without scrolling!
  const thumbSizes = useMemo(() => {
    const N = sessions.length;
    if (N <= 1) return { cardHeight: 144, cardWidth: 230, scale: 0.18, containerWidth: 260 };
    
    // We assume available vertical height of around 640px
    const availableHeight = 640;
    const totalGaps = (N - 1) * 8; // 8px gaps
    let height = Math.floor((availableHeight - totalGaps) / N);
    
    // Limit bounds
    height = Math.max(54, Math.min(144, height));
    
    const width = Math.floor(height * 1.6);
    const scale = height / 800; // virtual height is 800px
    const containerWidth = width + 28; // Card width + padding
    
    return {
      cardHeight: height,
      cardWidth: width,
      scale,
      containerWidth: Math.max(120, Math.min(260, containerWidth))
    };
  }, [sessions.length]);

  return (
    <section className="flex h-full w-full rounded-xl border border-cyber-line bg-cyber-panel/70 overflow-hidden relative">
      {sessions.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
          No interactive sessions. Create one from the sidebar.
        </div>
      ) : (
        <div className="flex h-full w-full overflow-hidden select-none">
          {/* Main active terminal center panel */}
          <div 
            className="relative flex-1 h-full min-w-0 bg-[#0a0f1f] flex flex-col justify-between"
            onContextMenu={(e) => visibleSessionId && handleContextMenu(e, visibleSessionId)}
          >
            {/* Active Session Info Header */}
            {activeSession && (
              <div className="absolute top-3 left-4 z-20 flex items-center gap-2 select-none">
                <div className="px-3 py-1 rounded bg-[#0a0f1f]/85 border border-cyber-line/50 text-[10px] font-mono font-bold text-cyber-electric shadow-neon-blue-sm">
                  🟢 {activeSession.cliName} {activeSession.workingDir ? `| ${activeSession.workingDir.split(/[/\\]/).pop() || activeSession.workingDir}` : ''}
                </div>
                
                {matchedSsh && matchedSsh.authMode === 'password' && matchedSsh.password && (
                  <button
                    type="button"
                    onClick={() => onSendInput(visibleSessionId!, `${matchedSsh.password}\n`)}
                    className="rounded bg-cyber-electric/25 border border-cyber-electric/80 px-2 py-0.5 font-bold uppercase tracking-wider text-cyber-electric transition hover:bg-cyber-electric/40 shadow-neon-blue-sm font-mono text-[9px] select-none cursor-pointer"
                  >
                    🔑 Autofill Password
                  </button>
                )}
              </div>
            )}

            {/* Stop Session (Close) Button on top right */}
            {visibleSessionId && (
              <button
                type="button"
                onClick={() => onStopSession(visibleSessionId)}
                className="absolute top-3 right-4 z-20 flex h-6 w-6 items-center justify-center rounded-lg border border-cyber-warn/60 bg-[#0a0f1f]/90 text-cyber-warn hover:bg-cyber-warn hover:text-white transition cursor-pointer select-none font-bold text-xs shadow-neon-sm"
                title="Stop / Close Session"
              >
                ✕
              </button>
            )}

            {/* Active terminal canvas viewport */}
            <div className="flex-1 w-full h-full min-h-0 relative">
              {sessions.map((session) => (
                <div
                  key={`main-${session.id}`}
                  className={`h-full w-full ${visibleSessionId === session.id ? 'block' : 'hidden'}`}
                >
                  <div
                    ref={(node) => {
                      if (visibleSessionId !== session.id) {
                        return; // Active is mounted in main
                      }
                      containerRefs.current[session.id] = node;
                      if (node) {
                        containerToSessionRef.current.set(node, session.id);
                        ensureTerminal(session, node);
                      }
                    }}
                    className="h-full w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right live scaled session thumbnails panel */}
          {sessions.length > 1 && (
            <div 
              style={{ width: `${thumbSizes.containerWidth}px` }}
              className="h-full border-l border-cyber-line bg-cyber-base/40 p-3.5 flex flex-col gap-2 shrink-0 select-none overflow-hidden"
            >
              <h3 className="font-display text-[8px] uppercase tracking-[0.15em] text-slate-500 font-bold mb-1 text-center truncate">
                Meetings ({sessions.length})
              </h3>
              
              <div className="flex-1 flex flex-col gap-2 overflow-y-hidden justify-start items-center">
                {sessions.map((session) => {
                  const isActive = visibleSessionId === session.id;
                  return (
                    <div
                      key={`thumb-${session.id}`}
                      onClick={() => onSelectSession(session.id)}
                      onContextMenu={(e) => handleContextMenu(e, session.id)}
                      style={{ 
                        width: `${thumbSizes.cardWidth}px`, 
                        height: `${thumbSizes.cardHeight}px` 
                      }}
                      className={`relative rounded-lg border-2 overflow-hidden transition-all duration-200 shrink-0 ${
                        isActive 
                          ? 'border-cyber-neon shadow-neon-sm bg-cyber-neon/5' 
                          : 'border-cyber-line/50 hover:border-cyber-electric/80 bg-[#0a0f1f] hover:shadow-neon-blue-sm'
                      }`}
                    >
                      {/* Live scaled view */}
                      <div 
                        style={{ 
                          transform: `scale(${thumbSizes.scale})`, 
                          width: '1280px', 
                          height: '800px' 
                        }}
                        className="absolute inset-0 origin-top-left pointer-events-none"
                      >
                        <div
                          ref={(node) => {
                            miniContainerRefs.current[session.id] = node;
                            if (node) {
                              containerToSessionRef.current.set(node, session.id);
                              ensureMiniTerminal(session, node);
                            }
                          }}
                          className="h-full w-full"
                        />
                      </div>

                      {/* Overlay directory / label */}
                      {thumbSizes.cardHeight >= 70 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-[#0a0f1f]/85 border-t border-cyber-line/20 px-2 py-0.5 flex items-center justify-between pointer-events-none text-[8px]">
                          <span className="truncate max-w-[70%] font-mono font-semibold text-slate-300">
                            {session.cliName}
                          </span>
                          <span className="font-mono text-[7px] px-1 rounded bg-cyber-base border border-cyber-line text-slate-400 select-none scale-90">
                            {session.id.substring(0, 4)}
                          </span>
                        </div>
                      )}

                      {/* Quick Close button on thumbnail */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStopSession(session.id);
                        }}
                        style={{
                          width: thumbSizes.cardHeight < 70 ? '14px' : '18px',
                          height: thumbSizes.cardHeight < 70 ? '14px' : '18px',
                          fontSize: thumbSizes.cardHeight < 70 ? '7px' : '9px',
                        }}
                        className="absolute top-1 right-1 z-30 flex items-center justify-center rounded bg-rose-500/80 hover:bg-rose-600 text-white transition font-bold opacity-75 hover:opacity-100 shadow-sm"
                        title="Stop / Close Session"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cyberpunk Right-click Context Menu */}
      {contextMenu && (
        <div
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed z-[100] w-48 rounded-lg border border-cyber-neon/40 bg-cyber-panel/95 p-1 text-slate-100 shadow-2xl backdrop-blur-md select-none font-mono text-[11px]"
        >
          <button
            type="button"
            onClick={() => {
              const session = sessions.find((s) => s.id === contextMenu.sessionId);
              if (session && session.workingDir) {
                void invoke('open_workspace_folder', { path: session.workingDir }).catch(console.error);
              }
            }}
            className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-electric/25 hover:text-cyber-electric transition"
          >
            📁 Reveal in Explorer
          </button>
          
          {(() => {
            const session = sessions.find((s) => s.id === contextMenu.sessionId);
            const matched = session ? sshConnections.find((c) => `SSH: ${c.name}` === session.cliName) : null;
            if (matched && matched.authMode === 'password' && matched.password) {
              return (
                <button
                  type="button"
                  onClick={() => onSendInput(contextMenu.sessionId, `${matched.password}\n`)}
                  className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-neon/25 hover:text-cyber-neon transition"
                >
                  🔑 Autofill Password
                </button>
              );
            }
            return null;
          })()}

          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(contextMenu.sessionId);
            }}
            className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-electric/20 transition"
          >
            📋 Copy Session ID
          </button>

          <div className="my-1 border-t border-cyber-line/50" />

          <button
            type="button"
            onClick={() => {
              onStopSession(contextMenu.sessionId);
            }}
            className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 font-bold transition"
          >
            ❌ Stop / Close Session
          </button>
        </div>
      )}
    </section>
  );
}