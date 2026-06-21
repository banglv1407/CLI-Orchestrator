import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import type { CliOutputEvent, CliStatusEvent, SessionInfo, SshConnection, AppTheme } from '../types';

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0 text-slate-400">
      <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z" clipRule="evenodd" />
      <path d="M12.938 5.437c.07.38.37.68.75.75h3.562c-.105-.372-.309-.706-.59-1.002l-2.72-2.72a3.75 3.75 0 0 0-.991-.59v3.562Z" />
    </svg>
  );
}

const getRelativePath = (fullPath: string, root: string) => {
  let rel = fullPath.replace(root, '');
  rel = rel.replace(/^[/\\]+/, '');
  return rel.replace(/\\/g, '/');
};

function MarqueeTitle({ text, className = "text-slate-300" }: { text: string; className?: string }) {
  const isLong = text.length > 25;
  if (!isLong) {
    return (
      <span className={`truncate max-w-[90%] font-mono font-semibold ${className}`} title={text}>
        {text}
      </span>
    );
  }
  return (
    <div className="cyber-marquee-container flex-1 max-w-[90%]" title={text}>
      <div className={`cyber-marquee-track font-mono font-semibold ${className}`}>
        <span>{text}</span>
        <span style={{ paddingLeft: '24px' }}>{text}</span>
        <span style={{ paddingLeft: '24px' }}></span>
      </div>
    </div>
  );
}

interface TerminalPanelProps {
  sessions: SessionInfo[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onSendInput: (sessionId: string, input: string) => void;
  onStopSession: (sessionId: string) => void;
  onSaveTag: (cliName: string, tag: string, directory: string) => Promise<void>;
  sshConnections: SshConnection[];
  onQuickSession?: (panel?: 'bottom' | 'right') => void;

  openedFile: { path: string; name: string } | null;
  openedFileRootPath: string | null;
  fileContent: string;
  setFileContent: (val: string) => void;
  fileOriginalContent: string;
  isSavingFile: boolean;
  fileLoadError: string | null;
  isFileLoading: boolean;
  viewMode: 'edit' | 'diff';
  setViewMode: (val: 'edit' | 'diff') => void;
  gitDiffContent: string;
  isDiffLoading: boolean;
  gitStatusList: { path: string; status: 'modified' | 'added' | 'deleted' | 'untracked' }[];
  onSaveFile: () => Promise<void>;
  onCloseFile: () => void;

  onReorderSessions: (draggedId: string, targetId: string) => void;
  onMoveSessionToPanel: (sessionId: string, panel: 'bottom' | 'right') => void;
  theme?: AppTheme;
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
  onQuickSession,

  openedFile,
  openedFileRootPath,
  fileContent,
  setFileContent,
  fileOriginalContent,
  isSavingFile,
  fileLoadError,
  isFileLoading,
  viewMode,
  setViewMode,
  gitDiffContent,
  isDiffLoading,
  gitStatusList,
  onSaveFile,
  onCloseFile,

  onReorderSessions,
  onMoveSessionToPanel,
  theme,
}: TerminalPanelProps) {
  // Custom Mouse Drag-to-Swap States and Handlers
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setActiveDragId(null);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  useEffect(() => {
    if (activeDragId) {
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [activeDragId]);
  const terminalRefs = useRef<Record<string, TerminalHandle>>({});
  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const miniContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const inputBuffers = useRef<Record<string, string>>({});
  const inputTimers = useRef<Record<string, number>>({});
  const pendingTerminalWrites = useRef<Record<string, string[]>>({});
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const initializedRef = useRef<Record<string, boolean>>({});
  const containerToSessionRef = useRef<WeakMap<Element, string>>(new WeakMap());
  // Accumulate ALL raw terminal output so we can replay it into mini terminals after DOM moves
  const mainOutputHistory = useRef<Record<string, string[]>>({});

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
      // Guard against re-entry while another drain is in flight. The recursion
      // at the end of this function will pick up any chunks that arrive mid-drain.
      if (!handle || handle.isWriting) {
        return;
      }
      if (handle.writeQueue.length === 0) {
        return;
      }

      handle.isWriting = true;

      // The actual scroll position lives in `buffer.ydisp` (= `viewportY`).
      // We read it directly from xterm's public API instead of the DOM, because
      // the DOM scrollable element does NOT reflect the buffer's scrollback
      // height (verified: `lines.length=401` but `scrollHeight=432=clientHeight`).
      const computeIsAtBottom = (): boolean => {
        try {
          return handle.term.buffer.active.viewportY >= handle.term.buffer.active.baseY - 1;
        } catch {
          return true; // safer to assume at-bottom on any error
        }
      };

      while (handle.writeQueue.length > 0) {
        const chunk = handle.writeQueue.shift();
        if (chunk) {
          // Refresh the cache from xterm's authoritative state right before
          // the write. `term.onScroll` keeps this in sync, but a write may
          // race the listener (xterm mutates ydisp synchronously inside the
          // write callback path), so we re-read here.
          const wasAtBottom = computeIsAtBottom();
          handle.isAtBottom = wasAtBottom;

          await new Promise<void>((resolve) => {
            handle.term.write(chunk, () => resolve());
            if (handle.miniTerm) {
              handle.miniTerm.write(chunk);
            }
          });

          // If the user was at the bottom, keep them there — they want to see
          // the new output. xterm natively handles "stay at bottom" when
          // `isUserScrolling=false` (the default), so the cursor stays in view
          // and ydisp tracks ybase as content grows.
          //
          // If the user had scrolled up, DO NOT touch scroll. xterm's
          // `isUserScrolling` flag (set automatically by wheel/keyboard scrolls
          // via `BufferService.scrollLines`) tells the scroll() path to leave
          // ydisp alone — the user keeps reading old content while new
          // content pushes old content up.
        }
      }

      // Final reconcile: sync the cache from xterm's real state in case the
      // ydisp moved during the write burst (e.g. user scrolled mid-drain).
      handle.isAtBottom = computeIsAtBottom();

      // Only auto-scroll to bottom if the user is parked there. If they were
      // reading history, leave them alone — this is the entire bug fix.
      if (handle.isAtBottom) {
        handle.term.scrollToBottom();
      }
      if (handle.miniTerm) {
        // Mini terminal is read-only output; always follow.
        handle.miniTerm.scrollToBottom();
      }

      handle.isWriting = false;

      // If new chunks arrived while we were draining (the early-return guard at
      // the top of this function would have rejected re-entry), recursively
      // drain them now. Without this, late chunks sit in the queue forever
      // until the next external event.
      if (handle.writeQueue.length > 0) {
        void processWriteQueue(sessionId);
      }
    };

  const visibleSessionId = useMemo(() => {
    if (activeSessionId && sessions.some((session) => session.id === activeSessionId)) {
      return activeSessionId;
    }
    return sessions[0]?.id ?? null;
  }, [activeSessionId, sessions]);
  const lastQuickSessionTime = useRef(0);
  const triggerQuickSession = useCallback(() => {
    const now = Date.now();
    if (now - lastQuickSessionTime.current < 500) {
      return;
    }
    lastQuickSessionTime.current = now;
    onQuickSession?.();
  }, [onQuickSession]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        triggerQuickSession();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [triggerQuickSession]);
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

  // Track which DOM node each miniTerm was last opened on
  const lastMiniMountNode = useRef<Record<string, HTMLDivElement | null>>({});

  const createFreshMiniTerminal = useCallback((handle: TerminalHandle) => {
    // Dispose old miniTerm completely
    handle.cleanupMiniScroll();
    try { handle.miniTerm.dispose(); } catch (_e) { /* ignore if already disposed */ }

    const newMiniTerm = new Terminal({
      cursorBlink: false,
      convertEol: true,
      scrollback: 2000,
      fontFamily: 'Fira Code, monospace',
      fontSize: 7,
      disableStdin: true,
      scrollOnUserInput: false,
      theme: getTerminalTheme(),
    });
    const newMiniFit = new FitAddon();
    newMiniTerm.loadAddon(newMiniFit);

    handle.miniTerm = newMiniTerm;
    handle.miniFit = newMiniFit;
    handle.cleanupMiniScroll = () => {};

    return { miniTerm: newMiniTerm, miniFit: newMiniFit };
  }, []);

  const replayHistoryIntoMiniTerm = useCallback((sessionId: string, miniTerm: Terminal, miniFit: FitAddon) => {
    const history = mainOutputHistory.current[sessionId];
    if (!history || history.length === 0) return;
    try {
      for (const chunk of history) {
        miniTerm.write(chunk);
      }
      miniFit.fit();
      miniTerm.scrollToBottom();
      miniTerm.refresh(0, miniTerm.rows - 1);
    } catch (e) {
      console.error('Failed to replay output to mini terminal:', e);
    }
  }, []);

  const refreshMiniTerminalFromMain = useCallback((sessionId: string) => {
    const handle = terminalRefs.current[sessionId];
    if (!handle) return;
    const mountNode = miniContainerRefs.current[sessionId];
    if (!mountNode) return;

    // Dispose and recreate for a clean state
    const { miniTerm, miniFit } = createFreshMiniTerminal(handle);
    miniTerm.open(mountNode);

    const miniViewport = (mountNode.querySelector('.xterm-scrollable-element') as HTMLElement | null)
      ?? (mountNode.querySelector('.xterm-viewport') as HTMLElement | null);
    if (miniViewport) miniViewport.style.overflowY = 'hidden';

    replayHistoryIntoMiniTerm(sessionId, miniTerm, miniFit);

    setTimeout(() => {
      try {
        miniFit.fit();
        miniTerm.scrollToBottom();
        miniTerm.refresh(0, miniTerm.rows - 1);
      } catch (_e) {}
    }, MOUNT_DELAY_MS);
  }, [createFreshMiniTerminal, replayHistoryIntoMiniTerm]);

  const refreshMainTerminal = useCallback((sessionId: string) => {
    const handle = terminalRefs.current[sessionId];
    if (!handle) return;
    const mountNode = containerRefs.current[sessionId];
    if (!mountNode) return;

    // Clear and replay all history for a clean re-render
    handle.term.clear();
    const history = mainOutputHistory.current[sessionId];
    if (history && history.length > 0) {
      for (const chunk of history) {
        handle.term.write(chunk);
      }
    }

    // Multiple timed fit+refresh passes to ensure proper layout
    const doRefresh = () => {
      try {
        handle.fit.fit();
        handle.term.refresh(0, handle.term.rows - 1);
        handle.term.scrollToBottom();
      } catch (_e) {}
    };

    doRefresh();
    setTimeout(doRefresh, MOUNT_DELAY_MS);
    setTimeout(doRefresh, 150);
    setTimeout(doRefresh, 300);
  }, []);

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
      const container = containerRefs.current[sessionId];
      if (container && container.offsetWidth > 10 && container.offsetHeight > 10) {
        try {
          handle.fit.fit();
          handle.term.refresh(0, handle.term.rows - 1);
        } catch (_e) {}
      }
    }
  }, [visibleSessionId]);

  const getTerminalTheme = () => {
    if (theme === 'light') {
      return {
        background: '#f8fafc',
        foreground: '#0f172a',
        cursor: '#4f46e5',
        selectionBackground: '#cbd5e1',
        black: '#0f172a',
        red: '#dc2626',
        green: '#16a34a',
        yellow: '#ca8a04',
        blue: '#2563eb',
        magenta: '#9333ea',
        cyan: '#0891b2',
        white: '#cbd5e1',
        brightBlack: '#64748b',
        brightRed: '#ef4444',
        brightGreen: '#22c55e',
        brightYellow: '#eab308',
        brightBlue: '#3b82f6',
        brightMagenta: '#a855f7',
        brightCyan: '#06b6d4',
        brightWhite: '#ffffff',
      };
    }
    return {
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
    };
  };

  useEffect(() => {
    const termTheme = getTerminalTheme();
    Object.values(terminalRefs.current).forEach((handle) => {
      if (handle) {
        if (handle.term) {
          handle.term.options.theme = termTheme;
        }
        if (handle.miniTerm) {
          handle.miniTerm.options.theme = termTheme;
        }
      }
    });
  }, [theme]);

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
        // Disable auto-scroll on user input so we respect manual scroll position
        scrollOnUserInput: false,
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
        if (event.ctrlKey && event.key === 'n') {
          if (event.type === 'keydown') {
            triggerQuickSession();
          }
          event.preventDefault();
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

      // Initialize output history for this session
      if (!mainOutputHistory.current[session.id]) {
        mainOutputHistory.current[session.id] = [];
      }

      term.onResize((dim) => {
        invoke('resize_cli', {
          request: { sessionId: session.id, rows: dim.rows, cols: dim.cols },
        }).catch(console.error);
      });

      const initMsg = `Connected to session: ${session.id}`;
      term.writeln(initMsg);
      miniTerm.writeln(initMsg);
      mainOutputHistory.current[session.id].push(initMsg + '\r\n');
      if (session.projectTag || session.workingDir) {
        const projectLine = [session.projectTag, session.workingDir].filter(Boolean).join(' | ');
        term.writeln(projectLine);
        miniTerm.writeln(projectLine);
        mainOutputHistory.current[session.id].push(projectLine + '\r\n');
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
    [flushInput, onSendInput, triggerQuickSession],
  );

  const ensureTerminal = useCallback(
    (session: SessionInfo, mountNode: HTMLDivElement | null) => {
      if (!mountNode) {
        return;
      }

      const handle = initializeSessionTerminal(session);
      const hasXterm = mountNode.querySelector('.xterm') !== null;

      if (handle.term.element !== mountNode || !hasXterm) {
        handle.cleanupScroll();
        handle.term.open(mountNode);

        // xterm v6 manages scroll position INTERNALLY via `buffer.ydisp` (a.k.a.
        // `viewportY` in the public buffer API). The `.xterm-scrollable-element`
        // and `.xterm-viewport` DOM nodes do NOT reflect the buffer's actual
        // scrollback size — `scrollHeight` is hard-wired to the visible viewport
        // height (432px = 24 rows × 18px) regardless of `buffer.lines.length`.
        // Any "is at bottom" math against DOM geometry is a no-op.
        //
        // The CORRECT way to track scroll state:
        //   - `term.buffer.active.viewportY` — current display line (ydisp)
        //   - `term.buffer.active.baseY`     — bottom of buffer (ybase)
        //   - `term.onScroll(ydisp => ...)`  — fires on every ydisp change,
        //                                     including user wheel/keyboard scrolls
        //
        // When `isUserScrolling` is true (set automatically by xterm when the
        // user scrolls up via wheel/keyboard), xterm's `scroll()` no longer
        // snaps ydisp to ybase — the user stays at their position and new
        // content pushes old content up. So once the user has scrolled up, we
        // don't need any custom restore logic; we just have to STOP calling
        // `term.scrollToBottom()` unconditionally.
        const computeIsAtBottom = (): boolean => {
          try {
            return handle.term.buffer.active.viewportY >= handle.term.buffer.active.baseY - 1;
          } catch {
            return true; // safer to assume at-bottom on any error
          }
        };
        handle.isAtBottom = computeIsAtBottom();

        const scrollDisposable = handle.term.onScroll(() => {
          handle.isAtBottom = computeIsAtBottom();
        });

        handle.cleanupScroll = () => {
          scrollDisposable.dispose();
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

      // If already attached to this exact DOM node, skip entirely.
      // This prevents the "open() on every render" bug that clears content.
      if (lastMiniMountNode.current[session.id] === mountNode) {
        return;
      }

      // DOM node changed (drag-and-drop or first mount) — dispose and recreate miniTerm entirely
      lastMiniMountNode.current[session.id] = mountNode;

      const { miniTerm, miniFit } = createFreshMiniTerminal(handle);
      miniTerm.open(mountNode);

      const miniViewport = (mountNode.querySelector('.xterm-scrollable-element') as HTMLElement | null)
        ?? (mountNode.querySelector('.xterm-viewport') as HTMLElement | null);
      if (miniViewport) {
        miniViewport.style.overflowY = 'hidden';
      }

      // Replay accumulated output history into the fresh terminal
      replayHistoryIntoMiniTerm(session.id, miniTerm, miniFit);

      // Delayed fit+refresh to allow DOM layout to settle after mount
      setTimeout(() => {
        try {
          miniFit.fit();
          miniTerm.scrollToBottom();
          miniTerm.refresh(0, miniTerm.rows - 1);
        } catch (_e) {}
      }, MOUNT_DELAY_MS);

      setTimeout(() => {
        try {
          miniFit.fit();
          miniTerm.scrollToBottom();
          miniTerm.refresh(0, miniTerm.rows - 1);
        } catch (_e) {}
      }, 200);
    },
    [initializeSessionTerminal, createFreshMiniTerminal, replayHistoryIntoMiniTerm],
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
        delete mainOutputHistory.current[sessionId];
        delete lastMiniMountNode.current[sessionId];
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
        // Accumulate output history for replay after drag
        if (!mainOutputHistory.current[payload.sessionId]) {
          mainOutputHistory.current[payload.sessionId] = [];
        }
        mainOutputHistory.current[payload.sessionId].push(payload.chunk);
        // Cap history to prevent memory issues (keep last 5000 chunks)
        if (mainOutputHistory.current[payload.sessionId].length > 5000) {
          mainOutputHistory.current[payload.sessionId] = mainOutputHistory.current[payload.sessionId].slice(-3000);
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
      const container = containerRefs.current[visibleSessionId];
      if (container && container.offsetWidth > 10 && container.offsetHeight > 10) {
        try {
          handle.fit.fit();
          handle.term.refresh(0, handle.term.rows - 1);
        } catch (_e) {}
      }
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

  // Re-fit terminal when file overlay is closed so xterm recalculates its dimensions
  useEffect(() => {
    if (openedFile !== null) return; // file is open, terminals are hidden
    if (!visibleSessionId) return;

    const handle = terminalRefs.current[visibleSessionId];
    if (!handle) return;

    const doRefresh = () => {
      const container = containerRefs.current[visibleSessionId];
      if (container && container.offsetWidth > 10 && container.offsetHeight > 10) {
        try {
          handle.fit.fit();
          handle.term.refresh(0, handle.term.rows - 1);
        } catch (_e) {}
      }
    };

    // Multiple passes: DOM needs time to become visible before xterm can measure it
    const t1 = window.setTimeout(doRefresh, 0);
    const t2 = window.setTimeout(doRefresh, MOUNT_DELAY_MS);
    const t3 = window.setTimeout(doRefresh, 150);
    const t4 = window.setTimeout(doRefresh, 300);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [openedFile, visibleSessionId]);
  const fitTerminalRef = useRef(fitTerminal);
  useEffect(() => {
    fitTerminalRef.current = fitTerminal;
  }, [fitTerminal]);

  useEffect(() => {
    const observerCallback = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const sessionId = containerToSessionRef.current.get(entry.target);
        if (sessionId) {
          fitTerminalRef.current(sessionId);
        }
      }
    };

    const observer = new ResizeObserver(observerCallback);
    resizeObserverRef.current = observer;

    // Observe any already-mounted containers
    Object.values(containerRefs.current).forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });

    return () => {
      observer.disconnect();
      resizeObserverRef.current = null;
    };
  }, []);

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

  const cliSessions = useMemo(
    () => sessions.filter(s => (s.panel ?? 'right') === 'right'),
    [sessions]
  );
  const sshSessions = useMemo(
    () => sessions.filter(s => (s.panel ?? 'right') === 'bottom'),
    [sessions]
  );

  const activeSession = sessions.find((s) => s.id === visibleSessionId);

  // Dynamic height and scale calculation to ensure up to 10 sessions fit on a single screen without scrolling!
  const thumbSizes = useMemo(() => {
    return {
      cardHeight: 110,
      cardWidth: 176,
      scale: 0.275,
      containerWidth: 204
    };
  }, []);

  const fileDirty = openedFile !== null && fileContent !== fileOriginalContent;
  const relPath = openedFileRootPath && openedFile ? getRelativePath(openedFile.path, openedFileRootPath) : '';
  const fileHasChanges = gitStatusList.some((g) => g.path === relPath);

  return (
    <section className="flex h-full w-full rounded-xl border border-cyber-line bg-cyber-panel/70 overflow-hidden relative">
      {sessions.length === 0 && !openedFile ? (
        <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
          No interactive sessions. Create one from the sidebar.
        </div>
      ) : (
        <div className="flex h-full w-full overflow-hidden select-none">
          {/* Main active terminal center panel */}
          <div 
            className="flex-1 h-full min-w-0 flex flex-col"
          >
            {/* Top: Active terminal canvas viewport */}
            <div 
              className="relative flex-1 min-h-0 bg-[#0a0f1f] flex flex-col justify-between"
              onContextMenu={(e) => visibleSessionId && handleContextMenu(e, visibleSessionId)}
            >
              {/* Active Session Info Header */}
              {activeSession && !openedFile && (
                <div className="absolute top-3 left-4 z-20 flex items-center gap-2 select-none">
                  <div className="px-3 py-1 rounded bg-[#0a0f1f]/85 border border-cyber-line/50 text-[10px] font-mono font-bold text-cyber-electric shadow-neon-blue-sm">
                    🟢 {activeSession.cliName} - {activeSession.workingDir || ''}
                  </div>
                </div>
              )}

              {/* Stop Session (Close) Button on top right */}
              {visibleSessionId && !openedFile && (
                <button
                  type="button"
                  onClick={() => onStopSession(visibleSessionId)}
                  className="absolute top-3 right-4 z-20 flex h-6 w-6 items-center justify-center rounded-lg border border-cyber-warn/60 bg-[#0a0f1f]/90 text-cyber-warn hover:bg-cyber-warn hover:text-white transition cursor-pointer select-none font-bold text-xs shadow-neon-sm"
                  title="Stop / Close Session"
                >
                  ✕
                </button>
              )}

              {/* Active terminal canvas viewport — always mounted to preserve xterm state */}
              <div className="flex-1 w-full h-full min-h-0 relative">
                {/* Terminals: always rendered, never unmounted, just hidden when file is open */}
                {sessions.map((session) => (
                  <div
                    key={`main-${session.id}`}
                    style={{
                      position: 'absolute',
                      left: !openedFile && visibleSessionId === session.id ? 0 : '-9999px',
                      top: 0,
                      width: '100%',
                      height: '100%',
                      visibility: !openedFile && visibleSessionId === session.id ? 'visible' : 'hidden',
                    }}
                  >
                    <div
                      ref={(node) => {
                        containerRefs.current[session.id] = node;
                        if (node) {
                          containerToSessionRef.current.set(node, session.id);
                          resizeObserverRef.current?.observe(node);
                          ensureTerminal(session, node);
                        }
                      }}
                      className="h-full w-full"
                    />
                  </div>
                ))}

                {/* File viewer overlay — rendered on top of terminals when a file is open */}
                {openedFile && (
                  <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#0a0f1f] z-10">
                    {/* Editor toolbar */}
                    <div className="flex shrink-0 items-center justify-between gap-1 border-b border-cyber-line bg-cyber-base/50 px-4 py-2.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <FileIcon />
                        <span
                          className="truncate font-mono text-xs text-slate-200 font-semibold"
                          title={openedFile.path}
                        >
                          {openedFile.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono truncate max-w-[250px] ml-1">
                          ({openedFile.path})
                        </span>
                        {fileDirty && (
                          <span className="ml-1 h-2 w-2 shrink-0 rounded-full bg-cyber-warn animate-pulse shadow-neon-sm" title="Unsaved changes" />
                        )}

                        {/* Diff / Edit Mode Toggle */}
                        {fileHasChanges && (
                          <div className="flex bg-cyber-base/80 border border-cyber-line p-0.5 rounded ml-3 select-none">
                            <button
                              type="button"
                              onClick={() => setViewMode('diff')}
                              className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded transition-colors ${
                                viewMode === 'diff'
                                  ? 'bg-cyber-neon/15 text-cyber-neon shadow-neon-sm'
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              Diff
                            </button>
                            <button
                              type="button"
                              onClick={() => setViewMode('edit')}
                              className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded transition-colors ${
                                viewMode === 'edit'
                                  ? 'bg-cyber-electric/15 text-cyber-electric shadow-neon-blue-sm'
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex shrink-0 items-center gap-2">
                        {viewMode === 'edit' && fileDirty && (
                          <button
                            type="button"
                            onClick={() => setFileContent(fileOriginalContent)}
                            title="Revert changes"
                            className="rounded border border-cyber-warn/50 px-2 py-1 text-[10px] font-bold uppercase text-cyber-warn transition hover:bg-cyber-warn/10"
                          >
                            Revert
                          </button>
                        )}
                        {viewMode === 'edit' && (
                          <button
                            type="button"
                            onClick={onSaveFile}
                            disabled={!fileDirty || isSavingFile}
                            title="Save file (Ctrl+S)"
                            className="rounded border border-cyber-neon/50 px-2.5 py-1 text-[10px] font-bold uppercase text-cyber-neon transition hover:bg-cyber-neon/10 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            {isSavingFile ? 'Saving…' : 'Save'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={onCloseFile}
                          title="Close file"
                          className="flex h-6 w-6 items-center justify-center rounded border border-cyber-line bg-cyber-base/40 text-slate-400 hover:text-white transition text-xs font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Editor body */}
                    <div className="flex-1 overflow-hidden relative">
                      {isFileLoading ? (
                        <div className="flex h-full items-center justify-center text-xs text-slate-500 italic">
                          Loading file content…
                        </div>
                      ) : fileLoadError ? (
                        <div className="p-6 text-xs text-cyber-warn leading-relaxed">
                          <p className="font-semibold mb-2 text-sm">Cannot display this file</p>
                          <p className="text-slate-400 break-words font-mono bg-black/30 p-3 rounded border border-cyber-line/20">{fileLoadError}</p>
                        </div>
                      ) : viewMode === 'diff' ? (
                        isDiffLoading ? (
                          <div className="flex h-full items-center justify-center text-xs text-slate-500 italic">
                            Loading diff…
                          </div>
                        ) : (
                          <div className="h-full w-full overflow-y-auto bg-cyber-base/80 p-4 font-mono text-xs leading-relaxed select-text scrollbar-thin text-slate-300">
                            {gitDiffContent ? (
                              gitDiffContent.split('\n').map((line, idx) => {
                                let lineClass = 'text-slate-400 pl-2';
                                if (line.startsWith('+') && !line.startsWith('+++')) {
                                  lineClass = 'bg-emerald-950/20 text-emerald-400 border-l-2 border-emerald-500 pl-2 font-semibold py-0.5';
                                } else if (line.startsWith('-') && !line.startsWith('---')) {
                                  lineClass = 'bg-rose-950/20 text-rose-400 border-l-2 border-rose-500 pl-2 font-semibold py-0.5';
                                } else if (line.startsWith('@@')) {
                                  lineClass = 'bg-indigo-950/20 text-indigo-400 italic pl-2 py-0.5';
                                } else if (line.startsWith('diff') || line.startsWith('index') || line.startsWith('---') || line.startsWith('+++')) {
                                  lineClass = 'text-slate-500 font-semibold pl-2 py-0.5';
                                }
                                return (
                                  <div key={idx} className={`${lineClass} whitespace-pre-wrap min-h-[20px]`}>
                                    {line}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-slate-500 italic p-2">No differences found.</div>
                            )}
                          </div>
                        )
                      ) : (
                        <textarea
                          value={fileContent}
                          onChange={(e) => setFileContent(e.target.value)}
                          onKeyDown={(e) => {
                            // Ctrl+S to save
                            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                              e.preventDefault();
                              void onSaveFile();
                            }
                            // Tab insert
                            if (e.key === 'Tab') {
                              e.preventDefault();
                              const { selectionStart, selectionEnd } = e.currentTarget;
                              const newVal =
                                fileContent.substring(0, selectionStart) +
                                '  ' +
                                fileContent.substring(selectionEnd);
                              setFileContent(newVal);
                              requestAnimationFrame(() => {
                                e.currentTarget.selectionStart = selectionStart + 2;
                                e.currentTarget.selectionEnd = selectionStart + 2;
                              });
                            }
                          }}
                          spellCheck={false}
                          className="h-full w-full resize-none bg-cyber-base/80 p-4 font-mono text-[13px] leading-relaxed text-slate-200 outline-none placeholder-slate-600 scrollbar-thin selection:bg-cyber-neon/30"
                          style={{ caretColor: 'var(--color-cyber-neon, #39ff14)' }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom: SSH Consoles Tray */}
            {(sshSessions.length > 0 || !!activeDragId) && (
              <div 
                onMouseEnter={() => {
                  if (activeDragId) {
                    const sess = sessions.find(s => s.id === activeDragId);
                    const currentPanel = sess?.panel || 'right';
                    if (currentPanel !== 'bottom') {
                      onMoveSessionToPanel?.(activeDragId, 'bottom');
                    }
                  }
                }}
                className={`${sshSessions.length === 0 ? 'h-[110px]' : 'h-[170px]'} shrink-0 border-t border-cyber-line/50 bg-[#070b16] p-3 flex flex-col gap-2 overflow-hidden select-none transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-[9px] uppercase tracking-[0.15em] text-cyber-electric font-bold">
                    ⚡ CMD ({sshSessions.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => onQuickSession?.('bottom')}
                    title="New Terminal (dock to bottom)"
                    className="flex items-center gap-0.5 rounded border border-cyber-electric/50 bg-cyber-electric/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-cyber-electric transition hover:bg-cyber-electric/25 hover:border-cyber-electric shadow-neon-blue-sm-faint"
                  >
                    + New
                  </button>
                </div>
                
                {sshSessions.length === 0 ? (
                  <div className="flex-1 border-2 border-dashed border-cyber-electric/30 hover:border-cyber-electric/70 rounded-lg flex items-center justify-center text-[10px] text-cyber-electric/80 font-mono italic p-3 animate-pulse transition-colors">
                    ⚡ Drag here to dock CMD sessions at the bottom
                  </div>
                ) : (
                  <div className="flex-1 flex gap-3 overflow-x-auto overflow-y-hidden justify-start items-center scrollbar-thin pb-1">
                    {sshSessions.map((session) => {
                      const isActive = visibleSessionId === session.id;
                      const isDragging = activeDragId === session.id;
                      return (
                        <div
                          key={`ssh-thumb-${session.id}`}
                          onClick={() => onSelectSession(session.id)}
                          onContextMenu={(e) => handleContextMenu(e, session.id)}
                          onMouseDown={(e) => {
                            if (e.button !== 0) return;
                            setActiveDragId(session.id);
                          }}
                          onMouseEnter={() => {
                            if (activeDragId && activeDragId !== session.id) {
                              onReorderSessions?.(activeDragId, session.id);
                            }
                          }}
                          title={`${session.cliName} - ${session.workingDir || ''}`}
                          style={{ 
                            width: `${thumbSizes.cardWidth}px`, 
                            height: `${thumbSizes.cardHeight}px`,
                            userSelect: 'none',
                            WebkitUserDrag: 'none'
                          } as React.CSSProperties}
                          className={`relative rounded-lg border-2 overflow-hidden transition-all duration-200 shrink-0 cursor-grab active:cursor-grabbing ${
                            isDragging 
                              ? 'opacity-30 border-cyber-neon shadow-neon-sm scale-105' 
                              : isActive 
                                ? 'border-cyber-electric shadow-neon-blue-sm bg-cyber-electric/5' 
                                : 'border-cyber-line/50 hover:border-cyber-electric/80 bg-[#0a0f1f] hover:shadow-neon-blue-sm'
                          }`}
                        >
                          {/* Live scaled view */}
                          <div 
                            style={{ 
                              transform: `scale(${thumbSizes.scale})`, 
                              width: '640px', 
                              height: '400px' 
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

                          {/* Overlay connection name / label */}
                          {thumbSizes.cardHeight >= 70 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-[#0a0f1f]/85 border-t border-cyber-line/20 px-2 py-0.5 flex items-center justify-between pointer-events-none text-[8px]">
                              <MarqueeTitle text={`${session.cliName} - ${session.workingDir || ''}`} className="text-cyber-electric" />
                              <span className="font-mono text-[7px] px-1 rounded bg-[#0a0f1f]/80 border border-cyber-line text-slate-400 select-none scale-90">
                                {session.id.substring(0, 4)}
                              </span>
                            </div>
                          )}

                          {/* Quick Close button on SSH thumbnail */}
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
                )}
              </div>
            )}
          </div>

          {/* Right live scaled session thumbnails panel */}
          {/* Right live scaled session thumbnails panel */}
          {(cliSessions.length >= 1 || !!activeDragId) && (
            <div 
              style={{ width: `${thumbSizes.containerWidth}px` }}
              onMouseEnter={() => {
                if (activeDragId) {
                  const sess = sessions.find(s => s.id === activeDragId);
                  const currentPanel = sess?.panel || 'right';
                  if (currentPanel !== 'right') {
                    onMoveSessionToPanel?.(activeDragId, 'right');
                  }
                }
              }}
              className="h-full border-l border-cyber-line bg-cyber-base/40 p-3.5 flex flex-col gap-2 shrink-0 select-none overflow-hidden transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display text-[8px] uppercase tracking-[0.15em] text-slate-500 font-bold truncate">
                  AI AGENT ({cliSessions.length})
                </h3>
                <button
                  type="button"
                  onClick={() => onQuickSession?.('right')}
                  title="New Terminal (dock to right)"
                  className="flex items-center gap-0.5 rounded border border-cyber-neon/50 bg-cyber-neon/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-cyber-neon transition hover:bg-cyber-neon/25 hover:border-cyber-neon shadow-neon-sm-faint shrink-0"
                >
                  + New
                </button>
              </div>
              
              {cliSessions.length === 0 ? (
                <div className="flex-1 border-2 border-dashed border-cyber-neon/30 hover:border-cyber-neon/70 rounded-lg flex items-center justify-center text-[10px] text-cyber-neon/80 font-mono italic p-4 text-center animate-pulse transition-colors">
                  👾 Drag here to dock AI Agents on the right
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto overflow-x-hidden scrollbar-thin justify-start items-center w-full">
                  {cliSessions.map((session) => {
                    const isActive = visibleSessionId === session.id;
                    const isDragging = activeDragId === session.id;
                    return (
                      <div
                        key={`thumb-${session.id}`}
                        onClick={() => onSelectSession(session.id)}
                        onContextMenu={(e) => handleContextMenu(e, session.id)}
                        onMouseDown={(e) => {
                          if (e.button !== 0) return;
                          setActiveDragId(session.id);
                        }}
                        onMouseEnter={() => {
                          if (activeDragId && activeDragId !== session.id) {
                            onReorderSessions?.(activeDragId, session.id);
                          }
                        }}
                        title={`${session.cliName} - ${session.workingDir || ''}`}
                        style={{ 
                          width: `${thumbSizes.cardWidth}px`, 
                          height: `${thumbSizes.cardHeight}px`,
                          userSelect: 'none',
                          WebkitUserDrag: 'none'
                        } as React.CSSProperties}
                        className={`relative rounded-lg border-2 overflow-hidden transition-all duration-200 shrink-0 cursor-grab active:cursor-grabbing ${
                          isDragging 
                            ? 'opacity-30 border-cyber-neon shadow-neon-sm scale-105' 
                            : isActive 
                              ? 'border-cyber-neon shadow-neon-sm bg-cyber-neon/5' 
                              : 'border-cyber-line/50 hover:border-cyber-electric/80 bg-[#0a0f1f] hover:shadow-neon-blue-sm'
                        }`}
                      >
                        {/* Live scaled view */}
                        <div 
                          style={{ 
                            transform: `scale(${thumbSizes.scale})`, 
                            width: '640px', 
                            height: '400px' 
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
                            <MarqueeTitle text={`${session.cliName} - ${session.workingDir || ''}`} className="text-slate-300" />
                            <span className="font-mono text-[7px] px-1 rounded bg-[#0a0f1f]/80 border border-cyber-line text-slate-400 select-none scale-90">
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
              )}
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
          {(() => {
            const sessionTerminal = terminalRefs.current[contextMenu.sessionId]?.term;
            const terminalSelection = sessionTerminal?.hasSelection() ? sessionTerminal.getSelection() : '';
            const pageSelection = window.getSelection()?.toString() || '';
            const selectedText = (terminalSelection || pageSelection).trim();
            if (selectedText) {
              return (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const event = new CustomEvent('explain-text', { detail: selectedText });
                      window.dispatchEvent(event);
                      setContextMenu(null);
                    }}
                    className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-neon/25 hover:text-cyber-neon text-cyber-neon transition"
                  >
                    💡 Giải thích
                  </button>
                  <div className="my-1 border-t border-cyber-line/50" />
                </>
              );
            }
            return null;
          })()}



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


          <button
            type="button"
            onClick={() => {
              refreshMainTerminal(contextMenu.sessionId);
              setContextMenu(null);
            }}
            className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-neon/20 hover:text-cyber-neon transition"
          >
            🔄 Refresh
          </button>

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