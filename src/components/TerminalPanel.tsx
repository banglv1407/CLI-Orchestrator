import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { FitAddon } from '@xterm/addon-fit';
import { SearchAddon } from '@xterm/addon-search';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import type { CliOutputEvent, CliStatusEvent, SessionInfo, SshConnection, AppTheme, FileEntry, RipgrepMatch } from '../types';
import { listAllFilesRecursive, listSshFilesRecursive, ripgrepSearch } from '../lib/tauri';
import { QuickAppsPanel } from './QuickAppsPanel';
import { ApiClientPanel } from './ApiClientPanel';
import { ProxyPanel } from './ProxyPanel';
import { SystemLogPanel } from './SystemLogPanel';
import { SettingsPanel } from './SettingsPanel';
import { RemoteSshPanel } from './RemoteSshPanel';
import { DashboardPanel } from './DashboardPanel';
import { WebAiPanel } from './WebAiPanel';
import { useUiActive } from '../hooks/useUiActive';
import { copyTerminalSelection, getTerminalSelectionText, type TerminalCopyMode } from '../lib/terminalClipboard';

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
  activeMainView: string;
  theme?: AppTheme;
  setTheme?: (theme: AppTheme) => void;

  // Global context menu state lifted to Dashboard
  contextMenu: { x: number; y: number; sessionId: string | null; workingDir: string | null } | null;
  setContextMenu: (menu: { x: number; y: number; sessionId: string | null; workingDir: string | null } | null) => void;
}

interface TerminalHandle {
  term: Terminal;
  fit: FitAddon;
  search: SearchAddon;
  miniTerm: Terminal | null;
  writeQueue: string[];
  writeQueueBytes: number;
  isWriting: boolean;
  isAtBottom: boolean;
  cleanupScroll: () => void;
  cleanupMiniScroll: () => void;
}

const INPUT_FLUSH_MS = 16;
const MOUNT_DELAY_MS = 50;
const MAX_TERMINAL_WRITE_QUEUE_BYTES = 2 * 1024 * 1024;
const MAX_REPLAY_HISTORY_BYTES = 1024 * 1024;
const MAX_REPLAY_HISTORY_CHUNKS = 1_000;
const TERMINAL_FONT_FAMILY = 'Cascadia Mono, CaskaydiaCove Nerd Font, Fira Code, Consolas, "Segoe UI Symbol", monospace';
const TUI_CLI_NAME_PATTERNS = ['codex', 'opencode', 'claude', 'gemini', 'aider'];
const ALT_SCREEN_PATTERN = /\x1b\[\?(?:47|1047|1048|1049)h/;

function isNestedTuiCli(session?: SessionInfo | null) {
  if (!session) return false;
  const name = session.cliName.toLowerCase();
  return TUI_CLI_NAME_PATTERNS.some((pattern) => name.includes(pattern));
}

function hasAlternateScreenOutput(chunks?: string[]) {
  return chunks?.some((chunk) => ALT_SCREEN_PATTERN.test(chunk)) ?? false;
}

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
  activeMainView,
  theme,
  setTheme,
  contextMenu,
  setContextMenu,
}: TerminalPanelProps) {
  const uiActive = useUiActive();
  // Search state
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultCount, setSearchResultCount] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  // Ref for searchVisible — lets xterm key-handler closures read the latest value
  const searchVisibleRef = useRef(false);

  // visibleSessionId must be declared before search callbacks that depend on it
  // (defined here by hoisting the computation up; the actual useMemo stays below
  //  but we keep a ref so callbacks capture the latest value without stale closures)
  const visibleSessionIdRef = useRef<string | null>(null);

  // ── Right Panel Toggle State ──
  const [rightPanelVisible, setRightPanelVisible] = useState(() => {
    return localStorage.getItem('ai-cli-right-panel-visible') === 'true';
  });
  useEffect(() => {
    localStorage.setItem('ai-cli-right-panel-visible', String(rightPanelVisible));
  }, [rightPanelVisible]);

  // ── @ Mention Autocomplete State ──
  const [mentionActive, setMentionActive] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionSelectedIndex, setMentionSelectedIndex] = useState(0);
  const mentionActiveRef = useRef(false);
  const mentionQueryRef = useRef('');
  const fileIndexCache = useRef<Record<string, FileEntry[]>>({});
  const [fileIndex, setFileIndex] = useState<FileEntry[]>([]);
  const [fileIndexLoading, setFileIndexLoading] = useState(false);
  const mentionInputRef = useRef<HTMLInputElement | null>(null);

  // ── ! Ripgrep Search Autocomplete State ──
  const [rgActive, setRgActive] = useState(false);
  const [rgQuery, setRgQuery] = useState('');
  const [rgSelectedIndex, setRgSelectedIndex] = useState(0);
  const rgActiveRef = useRef(false);
  const rgQueryRef = useRef('');
  const [rgResults, setRgResults] = useState<RipgrepMatch[]>([]);
  const [rgLoading, setRgLoading] = useState(false);
  const rgInputRef = useRef<HTMLInputElement | null>(null);
  const mentionListRef = useRef<HTMLDivElement | null>(null);
  const rgListRef = useRef<HTMLDivElement | null>(null);

  const openSearch = useCallback(() => {
    setSearchVisible(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchVisible(false);
    setSearchQuery('');
    setSearchResultCount(null);
    // Clear highlight in current terminal
    const sid = visibleSessionIdRef.current;
    if (sid) {
      try { terminalRefs.current[sid]?.search.clearDecorations(); } catch (_e) {}
    }
  }, []);

  const doSearch = useCallback((query: string, direction: 'next' | 'prev' = 'next') => {
    const sid = visibleSessionIdRef.current;
    if (!sid) return;
    const handle = terminalRefs.current[sid];
    if (!handle || !query.trim()) {
      setSearchResultCount(null);
      return;
    }
    const opts = { caseSensitive: false, regex: false, decorations: { matchBackground: '#f8e16a55', matchBorder: '#f8e16a', matchOverviewRuler: '#f8e16a', activeMatchBackground: '#f8e16acc', activeMatchBorder: '#00ffd1', activeMatchColorOverviewRuler: '#00ffd1' } };
    const found = direction === 'next'
      ? handle.search.findNext(query, opts)
      : handle.search.findPrevious(query, opts);
    setSearchResultCount(found ? 1 : 0);
  }, []);

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
  const mainOutputHistoryBytes = useRef<Record<string, number>>({});

  // Context menu is now lifted to Dashboard — reuse its state
  // But keep local handleContextMenu for TerminalPanel internal wiring (disabled for now)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleContextMenu = (e: React.MouseEvent, sessionId: string) => {
    // Only intercept the native context menu while the terminal surface is
    // actually visible. For other views (proxy, logs, settings, remote,
    // quickapps, apiclient, file editor, etc.) the WebView should keep its
    // default copy/select context menu so users can still copy text from
    // tables, JSON panels, and the like.
    if (activeMainView !== 'terminal') return;
    if (openedFile) return;
    if (!visibleSessionIdRef.current) return;
    // Only treat the click as a terminal-context invocation if the right
    // click landed on a session we actually own. Without this guard a
    // right-click inside a sub-view that happens to share the panel would
    // still pop the terminal menu.
    if (sessionId !== visibleSessionIdRef.current) return;
    e.preventDefault();
    const activeSess = sessions.find((s) => s.id === sessionId);
    setContextMenu?.({
      x: e.clientX,
      y: e.clientY,
      sessionId,
      workingDir: activeSess?.workingDir ?? null,
    });
  };

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
          handle.writeQueueBytes = Math.max(0, handle.writeQueueBytes - chunk.length * 2);
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

  // Keep the refs in sync so callbacks always see the latest values
  useEffect(() => {
    visibleSessionIdRef.current = visibleSessionId;
  }, [visibleSessionId]);
  useEffect(() => {
    searchVisibleRef.current = searchVisible;
  }, [searchVisible]);
  // Re-run search when switching sessions (if search bar is open)
  useEffect(() => {
    if (!searchVisibleRef.current) return;
    if (!visibleSessionId) return;
    if (searchQuery.trim()) doSearch(searchQuery, 'next');
    setTimeout(() => searchInputRef.current?.focus(), 80);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleSessionId]);
  const lastQuickSessionTime = useRef(0);
  const triggerQuickSession = useCallback(() => {
    const now = Date.now();
    if (now - lastQuickSessionTime.current < 500) {
      return;
    }
    lastQuickSessionTime.current = now;
    onQuickSession?.();
  }, [onQuickSession]);

  // ── @ Mention Refs Sync ──
  useEffect(() => {
    mentionActiveRef.current = mentionActive;
  }, [mentionActive]);
  useEffect(() => {
    mentionQueryRef.current = mentionQuery;
  }, [mentionQuery]);

  // ── Fuzzy Search Helper ──
  const fuzzyMatch = useCallback((query: string, target: string): { match: boolean; score: number } => {
    if (!query) return { match: true, score: 0 };
    const lq = query.toLowerCase();
    const lt = target.toLowerCase();

    // Exact substring → highest score
    if (lt.includes(lq)) {
      const idx = lt.indexOf(lq);
      return { match: true, score: 100 - idx + (lt === lq ? 50 : 0) };
    }

    // Sequential character match (fuzzy)
    let qi = 0;
    for (let ti = 0; ti < lt.length && qi < lq.length; ti++) {
      if (lt[ti] === lq[qi]) qi++;
    }
    if (qi === lq.length) {
      return { match: true, score: (qi / lt.length) * 50 };
    }
    return { match: false, score: 0 };
  }, []);

  // ── Mention Filtered Results (derived, memoized) ──
  const mentionResults = useMemo(() => {
    if (!mentionActive || fileIndex.length === 0) return [];
    const q = mentionQuery.trim();
    if (!q) {
      // Show first 50 entries (dirs first, then files)
      return fileIndex.slice(0, 50);
    }
    const scored: { entry: FileEntry; score: number }[] = [];
    for (const entry of fileIndex) {
      // Match against relative path (from workingDir) for better UX
      const { match, score } = fuzzyMatch(q, entry.name);
      if (match) scored.push({ entry, score });
      if (scored.length >= 200) break; // Pre-cap for performance
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 50).map(s => s.entry);
  }, [mentionActive, mentionQuery, fileIndex, fuzzyMatch]);

  // Reset selected index when results change
  useEffect(() => {
    setMentionSelectedIndex(0);
  }, [mentionResults.length, mentionQuery]);

  // ── Load File Index ──
  const loadFileIndex = useCallback(async (workingDir: string, isSsh: boolean, sshConn?: SshConnection) => {
    // Check cache first
    const cacheKey = `${isSsh ? 'ssh:' : ''}${workingDir}`;
    if (fileIndexCache.current[cacheKey]) {
      setFileIndex(fileIndexCache.current[cacheKey]);
      return;
    }

    setFileIndexLoading(true);
    try {
      let entries: FileEntry[];
      if (isSsh && sshConn) {
        entries = await listSshFilesRecursive(sshConn, workingDir);
      } else {
        entries = await listAllFilesRecursive(workingDir);
      }
      // Sort: dirs first, then alpha
      entries.sort((a, b) => {
        if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
      // Convert absolute paths to relative for display
      entries = entries.map(e => ({
        ...e,
        name: e.path.replace(workingDir, '').replace(/^[/\\]+/, '').replace(/\\/g, '/'),
      }));
      // Cap at 10K entries
      if (entries.length > 10000) entries = entries.slice(0, 10000);
      fileIndexCache.current[cacheKey] = entries;
      setFileIndex(entries);
    } catch (err) {
      console.error('Failed to load file index:', err);
      setFileIndex([]);
    } finally {
      setFileIndexLoading(false);
    }
  }, []);

  // ── Open / Close Mention ──
  const openMention = useCallback((workingDir: string, isSsh: boolean, sshConn?: SshConnection) => {
    setMentionActive(true);
    setMentionQuery('');
    setMentionSelectedIndex(0);
    void loadFileIndex(workingDir, isSsh, sshConn);
    setTimeout(() => mentionInputRef.current?.focus(), 50);
  }, [loadFileIndex]);

  const closeMention = useCallback(() => {
    setMentionActive(false);
    setMentionQuery('');
    setMentionSelectedIndex(0);
  }, []);

  // ── ! Ripgrep Refs Sync ──
  useEffect(() => {
    rgActiveRef.current = rgActive;
  }, [rgActive]);
  useEffect(() => {
    rgQueryRef.current = rgQuery;
  }, [rgQuery]);

  // ── Open / Close Ripgrep ──
  const openRg = useCallback((workingDir: string) => {
    setRgActive(true);
    setRgQuery('');
    setRgSelectedIndex(0);
    setRgResults([]);
    setTimeout(() => rgInputRef.current?.focus(), 50);
  }, []);

  const closeRg = useCallback(() => {
    setRgActive(false);
    setRgQuery('');
    setRgSelectedIndex(0);
    setRgResults([]);
  }, []);

  // ── Debounced Ripgrep search query execution ──
  useEffect(() => {
    if (!rgActive) return;
    const q = rgQuery.trim();
    if (!q) {
      setRgResults([]);
      return;
    }

    const session = sessions.find(s => s.id === visibleSessionId);
    const wd = session?.workingDir;
    if (!wd) return;

    setRgLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const matches = await ripgrepSearch(wd, q);
        // Normalize file paths to relative paths
        const normalized = matches.map(m => ({
          ...m,
          filePath: m.filePath.replace(wd, '').replace(/^\.[\/\\]/, '').replace(/^[/\\]+/, '').replace(/\\/g, '/'),
        }));
        setRgResults(normalized);
      } catch (err) {
        console.error('Ripgrep search failed:', err);
        setRgResults([]);
      } finally {
        setRgLoading(false);
      }
    }, 300); // 300ms debounce for typing responsiveness

    return () => clearTimeout(delayDebounceFn);
  }, [rgQuery, rgActive, visibleSessionId, sessions]);

  // ── Auto-scroll selected item into view for Mention list ──
  useEffect(() => {
    const listEl = mentionListRef.current;
    if (!listEl) return;
    const selectedEl = listEl.children[mentionSelectedIndex] as HTMLElement | null;
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }, [mentionSelectedIndex]);

  // ── Auto-scroll selected item into view for Ripgrep list ──
  useEffect(() => {
    const listEl = rgListRef.current;
    if (!listEl) return;
    const selectedEl = listEl.children[rgSelectedIndex] as HTMLElement | null;
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }, [rgSelectedIndex]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        triggerQuickSession();
      }
      if (e.ctrlKey && e.key === 'f') {
        // Only intercept Ctrl+F when a terminal session is visible and focus is not in a text input
        const tag = (document.activeElement as HTMLElement | null)?.tagName ?? '';
        if (!['INPUT', 'TEXTAREA'].includes(tag)) {
          e.preventDefault();
          openSearch();
        }
      }
      if (e.key === 'Escape' && searchVisible) {
        closeSearch();
      }
      // Close mention on Escape (global fallback)
      if (e.key === 'Escape' && mentionActive) {
        closeMention();
      }
      // Close Ripgrep search on Escape
      if (e.key === 'Escape' && rgActive) {
        closeRg();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [triggerQuickSession, openSearch, closeSearch, searchVisible, mentionActive, closeMention, rgActive, closeRg]);

  // ── Mention Selection via Custom Event ──
  useEffect(() => {
    const handleMentionSelect = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const sessionId = detail?.sessionId || visibleSessionIdRef.current;
      if (!sessionId) return;

      const results = mentionResults;
      // Use a clamped index from the ref to avoid stale closure
      const idx = Math.min(Math.max(0, mentionSelectedIndex), results.length - 1);
      const selected = results[idx];
      if (!selected) {
        closeMention();
        return;
      }

      // Send the relative path to the terminal (replacing the '@' query with the full path)
      const pathToInsert = selected.name;
      onSendInput(sessionId, pathToInsert);
      closeMention();
    };

    window.addEventListener('mention-select-current', handleMentionSelect);
    return () => window.removeEventListener('mention-select-current', handleMentionSelect);
  }, [mentionResults, mentionSelectedIndex, closeMention, onSendInput]);

  // ── Ripgrep Selection via Custom Event ──
  useEffect(() => {
    const handleRgSelect = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const sessionId = detail?.sessionId || visibleSessionIdRef.current;
      if (!sessionId) return;

      const results = rgResults;
      const idx = Math.min(Math.max(0, rgSelectedIndex), results.length - 1);
      const selected = results[idx];
      if (!selected) {
        closeRg();
        return;
      }

      // Send the relative path to the terminal (replacing the '!' query with the full path)
      const pathToInsert = selected.filePath;
      onSendInput(sessionId, pathToInsert);
      closeRg();
    };

    window.addEventListener('rg-select-current', handleRgSelect);
    return () => window.removeEventListener('rg-select-current', handleRgSelect);
  }, [rgResults, rgSelectedIndex, closeRg, onSendInput]);
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
    try { handle.miniTerm?.dispose(); } catch (_e) { /* ignore if already disposed */ }

    const newMiniTerm = new Terminal({
      cursorBlink: false,
      convertEol: false,
      scrollback: 500,
      fontFamily: TERMINAL_FONT_FAMILY,
      fontSize: 13,
      cols: handle.term.cols,
      rows: handle.term.rows,
      disableStdin: true,
      scrollOnUserInput: false,
      theme: getTerminalTheme(),
    });

    handle.miniTerm = newMiniTerm;
    handle.cleanupMiniScroll = () => {};

    return { miniTerm: newMiniTerm };
  }, []);

  const replayHistoryIntoMiniTerm = useCallback((sessionId: string, miniTerm: Terminal) => {
    const history = mainOutputHistory.current[sessionId];
    if (!history || history.length === 0) return;
    if (hasAlternateScreenOutput(history)) return;
    try {
      for (const chunk of history) {
        miniTerm.write(chunk);
      }
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
    const { miniTerm } = createFreshMiniTerminal(handle);
    miniTerm.open(mountNode);

    const miniViewport = (mountNode.querySelector('.xterm-scrollable-element') as HTMLElement | null)
      ?? (mountNode.querySelector('.xterm-viewport') as HTMLElement | null);
    if (miniViewport) miniViewport.style.overflowY = 'hidden';

    replayHistoryIntoMiniTerm(sessionId, miniTerm);

    setTimeout(() => {
      try {
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

    // Multiple timed fit+refresh passes to ensure proper layout without
    // replaying raw ANSI/TUI history into the active terminal buffer.
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
        convertEol: false,
        scrollback: 2000,
        fontFamily: TERMINAL_FONT_FAMILY,
        fontSize: 13,
        disableStdin: false,
        // Disable auto-scroll on user input so we respect manual scroll position
        scrollOnUserInput: false,
        theme: getTerminalTheme(),
      });

      term.attachCustomKeyEventHandler((event) => {
        // ── @ Mention intercepts (must be first) ──
        if (mentionActiveRef.current) {
          if (event.type !== 'keydown') return false; // block keyup too
          if (event.key === 'ArrowDown') {
            setMentionSelectedIndex(prev => prev + 1);
            return false;
          }
          if (event.key === 'ArrowUp') {
            setMentionSelectedIndex(prev => Math.max(0, prev - 1));
            return false;
          }
          if (event.key === 'Enter' || event.key === 'Tab') {
            // Selection is handled via a custom event dispatched from the mention overlay
            const evt = new CustomEvent('mention-select-current', { detail: { sessionId: session.id } });
            window.dispatchEvent(evt);
            return false;
          }
          if (event.key === 'Escape') {
            closeMention();
            return false;
          }
          // Let printable chars through to onData (they'll be routed to mentionQuery)
          if (event.key === 'Backspace') {
            // Handle backspace in mention query
            const currentQ = mentionQueryRef.current;
            if (currentQ.length > 0) {
              setMentionQuery(currentQ.slice(0, -1));
            } else {
              closeMention();
            }
            return false;
          }
          // Block modifier combos from going to terminal while mention is active
          if (event.ctrlKey || event.altKey || event.metaKey) {
            return false;
          }
          // Single printable character → append to mention query (handled in onData below)
          // Return false to prevent xterm from processing it
          if (event.key.length === 1) {
            setMentionQuery(prev => prev + event.key);
            return false;
          }
          return false;
        }

        // ── ! Ripgrep Search intercepts ──
        if (rgActiveRef.current) {
          if (event.type !== 'keydown') return false;
          if (event.key === 'ArrowDown') {
            setRgSelectedIndex(prev => prev + 1);
            return false;
          }
          if (event.key === 'ArrowUp') {
            setRgSelectedIndex(prev => Math.max(0, prev - 1));
            return false;
          }
          if (event.key === 'Enter' || event.key === 'Tab') {
            const evt = new CustomEvent('rg-select-current', { detail: { sessionId: session.id } });
            window.dispatchEvent(evt);
            return false;
          }
          if (event.key === 'Escape') {
            closeRg();
            return false;
          }
          if (event.key === 'Backspace') {
            const currentQ = rgQueryRef.current;
            if (currentQ.length > 0) {
              setRgQuery(currentQ.slice(0, -1));
            } else {
              closeRg();
            }
            return false;
          }
          if (event.ctrlKey || event.altKey || event.metaKey) {
            return false;
          }
          if (event.key.length === 1) {
            setRgQuery(prev => prev + event.key);
            return false;
          }
          return false;
        }

        if (event.ctrlKey && event.key.toLowerCase() === 'c') {
          // Only act on keydown to avoid double-firing on keyup. We use
          // toLowerCase() to tolerate Caps Lock; the Shift modifier is what
          // distinguishes "copy as code" from the regular interrupt path.
          if (event.type !== 'keydown') return false;
          if (event.shiftKey) {
            // Ctrl+Shift+C: code-mode copy. Bail if there is no real
            // selection so we never write an empty payload to the clipboard.
            if (term.hasSelection()) {
              void copyTerminalSelection(term, 'code');
            }
            return false;
          }
          if (term.hasSelection()) {
            void copyTerminalSelection(term, 'exact');
            return false;
          }
          // No selection: fall through so the underlying PTY can interpret
          // Ctrl+C as an interrupt signal.
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
        if (event.ctrlKey && event.key === 'p') {
          if (event.type === 'keydown') {
            const evt = new CustomEvent('trigger-command-palette');
            window.dispatchEvent(evt);
          }
          return false;
        }
        if (event.ctrlKey && event.key === 'f') {
          if (event.type === 'keydown') {
            openSearch();
          }
          return false;
        }
        if (event.key === 'Escape') {
          if (searchVisibleRef.current) {
            closeSearch();
            return false;
          }
        }
        return true;
      });

      const fit = new FitAddon();
      term.loadAddon(fit);

      const search = new SearchAddon();
      term.loadAddon(search);

      terminalRefs.current[session.id] = {
        term,
        fit,
        search,
        miniTerm: null,
        writeQueue: [],
        writeQueueBytes: 0,
        isWriting: false,
        isAtBottom: true,
        cleanupScroll: () => {},
        cleanupMiniScroll: () => {},
      };
      handle = terminalRefs.current[session.id];

      // Initialize output history for this session
      if (!mainOutputHistory.current[session.id]) {
        mainOutputHistory.current[session.id] = [];
        mainOutputHistoryBytes.current[session.id] = 0;
      }

      term.onResize((dim) => {
        invoke('resize_cli', {
          request: { sessionId: session.id, rows: dim.rows, cols: dim.cols },
        }).catch(console.error);
        // Keep miniTerm grid in sync — prevents ANSI escape misalignment
        if (handle?.miniTerm) {
          handle.miniTerm.resize(dim.cols, dim.rows);
        }
      });

      term.onData((data) => {
        const activeSession = sessions.find(s => s.id === session.id);
        const allowInlineAssist = !isNestedTuiCli(activeSession);

        // Detect '@' trigger for file mention
        if (allowInlineAssist && data === '@' && !mentionActiveRef.current && !rgActiveRef.current) {
          const wd = activeSession?.workingDir;
          if (wd) {
            const isSsh = !!activeSession?.cliName.startsWith('SSH: ');
            openMention(wd, isSsh);
            // Still send the '@' to the terminal so user sees it
            inputBuffers.current[session.id] = `${inputBuffers.current[session.id] ?? ''}${data}`;
            if (!inputTimers.current[session.id]) {
              inputTimers.current[session.id] = window.setTimeout(() => {
                flushInput(session.id);
              }, INPUT_FLUSH_MS);
            }
            return;
          }
        }

        // Detect '!' trigger for ripgrep search
        if (allowInlineAssist && data === '!' && !rgActiveRef.current && !mentionActiveRef.current) {
          const wd = activeSession?.workingDir;
          // Only support local sessions for ripgrep for now
          const isSsh = !!activeSession?.cliName.startsWith('SSH: ');
          if (wd && !isSsh) {
            openRg(wd);
            // Still send the '!' to the terminal so user sees it
            inputBuffers.current[session.id] = `${inputBuffers.current[session.id] ?? ''}${data}`;
            if (!inputTimers.current[session.id]) {
              inputTimers.current[session.id] = window.setTimeout(() => {
                flushInput(session.id);
              }, INPUT_FLUSH_MS);
            }
            return;
          }
        }

        // When mention or ripgrep is active, don't send data to PTY
        if (mentionActiveRef.current || rgActiveRef.current) {
          return;
        }

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

      return handle;
    },
    [flushInput, onSendInput, triggerQuickSession, openSearch, closeSearch, openMention, closeMention, sessions, openRg, closeRg],
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

      const { miniTerm } = createFreshMiniTerminal(handle);
      miniTerm.open(mountNode);

      const miniViewport = (mountNode.querySelector('.xterm-scrollable-element') as HTMLElement | null)
        ?? (mountNode.querySelector('.xterm-viewport') as HTMLElement | null);
      if (miniViewport) {
        miniViewport.style.overflowY = 'hidden';
      }

      // Replay accumulated output history into the fresh terminal
      replayHistoryIntoMiniTerm(session.id, miniTerm);

      // Delayed refresh to allow DOM layout to settle after mount
      setTimeout(() => {
        try {
          miniTerm.scrollToBottom();
          miniTerm.refresh(0, miniTerm.rows - 1);
        } catch (_e) {}
      }, MOUNT_DELAY_MS);

      setTimeout(() => {
        try {
          miniTerm.scrollToBottom();
          miniTerm.refresh(0, miniTerm.rows - 1);
        } catch (_e) {}
      }, 200);
    },
    [initializeSessionTerminal, createFreshMiniTerminal, replayHistoryIntoMiniTerm],
  );

  useEffect(() => {
    if (!rightPanelVisible) {
      Object.values(terminalRefs.current).forEach((handle) => {
        handle.cleanupMiniScroll();
        try { handle.miniTerm?.dispose(); } catch (_e) {}
        handle.miniTerm = null;
      });
      lastMiniMountNode.current = {};
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      sessions.forEach((session) => ensureMiniTerminal(session, miniContainerRefs.current[session.id]));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [rightPanelVisible, sessions, ensureMiniTerminal]);

  useEffect(() => {
    sessions.forEach((session) => {
      ensureTerminal(session, containerRefs.current[session.id]);
      if (rightPanelVisible) ensureMiniTerminal(session, miniContainerRefs.current[session.id]);
    });

    const existingIds = Object.keys(terminalRefs.current);
    existingIds.forEach((sessionId) => {
      if (!sessions.some((session) => session.id === sessionId)) {
        terminalRefs.current[sessionId].cleanupScroll();
        terminalRefs.current[sessionId].cleanupMiniScroll();
        try { terminalRefs.current[sessionId].search.dispose(); } catch (_e) {}
        terminalRefs.current[sessionId].term.dispose();
        terminalRefs.current[sessionId].miniTerm?.dispose();
        terminalRefs.current[sessionId].writeQueue = [];
        terminalRefs.current[sessionId].writeQueueBytes = 0;
        terminalRefs.current[sessionId].isWriting = false;
        delete terminalRefs.current[sessionId];
        delete containerRefs.current[sessionId];
        delete miniContainerRefs.current[sessionId];
        delete inputBuffers.current[sessionId];
        delete pendingTerminalWrites.current[sessionId];
        delete initializedRef.current[sessionId];
        delete mainOutputHistory.current[sessionId];
        delete mainOutputHistoryBytes.current[sessionId];
        delete lastMiniMountNode.current[sessionId];
        if (inputTimers.current[sessionId]) {
          window.clearTimeout(inputTimers.current[sessionId]);
          delete inputTimers.current[sessionId];
        }
      }
    });
  }, [ensureTerminal, ensureMiniTerminal, rightPanelVisible, sessions]);

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
          mainOutputHistoryBytes.current[payload.sessionId] = 0;
        }
        const replayHistory = mainOutputHistory.current[payload.sessionId];
        replayHistory.push(payload.chunk);
        mainOutputHistoryBytes.current[payload.sessionId] += payload.chunk.length * 2;
        while (
          replayHistory.length > MAX_REPLAY_HISTORY_CHUNKS
          || mainOutputHistoryBytes.current[payload.sessionId] > MAX_REPLAY_HISTORY_BYTES
        ) {
          const removed = replayHistory.shift();
          if (removed) mainOutputHistoryBytes.current[payload.sessionId] -= removed.length * 2;
        }
        const handle = terminalRefs.current[payload.sessionId];
        if (!handle) {
          if (!pendingTerminalWrites.current[payload.sessionId]) {
            pendingTerminalWrites.current[payload.sessionId] = [];
          }
          pendingTerminalWrites.current[payload.sessionId].push(payload.chunk);
          let pendingBytes = pendingTerminalWrites.current[payload.sessionId]
            .reduce((total, chunk) => total + chunk.length * 2, 0);
          while (pendingBytes > MAX_TERMINAL_WRITE_QUEUE_BYTES) {
            const removed = pendingTerminalWrites.current[payload.sessionId].shift();
            if (!removed) break;
            pendingBytes -= removed.length * 2;
          }
          return;
        }
        handle.writeQueue.push(payload.chunk);
        handle.writeQueueBytes += payload.chunk.length * 2;
        while (handle.writeQueueBytes > MAX_TERMINAL_WRITE_QUEUE_BYTES) {
          const removed = handle.writeQueue.shift();
          if (!removed) break;
          handle.writeQueueBytes -= removed.length * 2;
        }
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
        // Keep status UI outside the emulated terminal. Writing app-owned
        // status lines into xterm corrupts full-screen TUIs that own the buffer.
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

  // Re-fit terminal when file overlay is closed or main view switches back to terminal,
  // so xterm recalculates its dimensions after its container becomes visible again.
  useEffect(() => {
    if (openedFile !== null) return; // file is open, terminals are hidden
    if (activeMainView !== 'terminal') return; // a different panel is showing, terminal hidden
    if (!visibleSessionId) return;

    const handle = terminalRefs.current[visibleSessionId];
    if (!handle) return;

    const doRefresh = () => {
      const container = containerRefs.current[visibleSessionId];
      if (container && container.offsetWidth > 10 && container.offsetHeight > 10) {
        try {
          handle.fit.fit();
          handle.term.refresh(0, handle.term.rows - 1);
          handle.term.scrollToBottom();
          if (handle.miniTerm) {
            handle.miniTerm.scrollToBottom();
          }
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
  }, [activeMainView, openedFile, visibleSessionId]);
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
        try { item.search.dispose(); } catch (_e) {}
        item.term.dispose();
        item.miniTerm?.dispose();
        item.writeQueue = [];
        item.writeQueueBytes = 0;
        item.isWriting = false;
      });
      terminalRefs.current = {};
      inputBuffers.current = {};
      inputTimers.current = {};
      pendingTerminalWrites.current = {};
      mainOutputHistory.current = {};
      mainOutputHistoryBytes.current = {};
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
  const activeSessionUsesNestedTui = isNestedTuiCli(activeSession);

  const [miniTerminalScale, setMiniTerminalScale] = useState<number>(() => {
    const saved = localStorage.getItem('clx-mini-terminal-scale');
    return saved ? parseFloat(saved) : 1.0;
  });

  // Dynamic height and scale calculation to ensure up to 10 sessions fit on a single screen without scrolling!
  const thumbSizes = useMemo(() => {
    const baseHeight = 110;
    const baseWidth = 176;
    const baseScale = 0.275;
    const baseContainer = 204;
    return {
      cardHeight: Math.round(baseHeight * miniTerminalScale),
      cardWidth: Math.round(baseWidth * miniTerminalScale),
      scale: baseScale * miniTerminalScale,
      containerWidth: Math.round(baseContainer * miniTerminalScale)
    };
  }, [miniTerminalScale]);

  const fileDirty = openedFile !== null && fileContent !== fileOriginalContent;
  const relPath = openedFileRootPath && openedFile ? getRelativePath(openedFile.path, openedFileRootPath) : '';
  const fileHasChanges = gitStatusList.some((g) => g.path === relPath);

  return (
    <section className="flex h-full w-full rounded-xl border border-cyber-line bg-cyber-panel/70 overflow-hidden relative">
      {sessions.length === 0 && !openedFile && activeMainView === 'terminal' ? (
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
              {/* ── Terminal Search Overlay ── */}
              {searchVisible && !openedFile && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyber-accent/60 bg-[#0a0f1f]/95 shadow-2xl shadow-cyber-accent/20 backdrop-blur-sm select-none" style={{ minWidth: '320px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-cyber-muted shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      doSearch(e.target.value, 'next');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); doSearch(searchQuery, e.shiftKey ? 'prev' : 'next'); }
                      if (e.key === 'Escape') { e.preventDefault(); closeSearch(); }
                    }}
                    placeholder="Search terminal… (Enter=next, Shift+Enter=prev)"
                    className="flex-1 bg-transparent text-cyber-text text-[12px] font-mono outline-none placeholder:text-cyber-muted/50 caret-cyber-accent"
                    style={{ minWidth: 0 }}
                  />
                  {searchResultCount !== null && (
                    <span className={`text-[10px] font-mono shrink-0 ${searchResultCount === 0 ? 'text-cyber-warn' : 'text-cyber-neon'}`}>
                      {searchResultCount === 0 ? 'No match' : '✓ Found'}
                    </span>
                  )}
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => doSearch(searchQuery, 'prev')}
                      title="Previous match (Shift+Enter)"
                      className="flex items-center justify-center w-6 h-6 rounded text-cyber-muted hover:text-cyber-accent hover:bg-cyber-accent/10 transition text-[10px] font-bold border border-cyber-line/40 hover:border-cyber-accent/50"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => doSearch(searchQuery, 'next')}
                      title="Next match (Enter)"
                      className="flex items-center justify-center w-6 h-6 rounded text-cyber-muted hover:text-cyber-accent hover:bg-cyber-accent/10 transition text-[10px] font-bold border border-cyber-line/40 hover:border-cyber-accent/50"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={closeSearch}
                      title="Close (Esc)"
                      className="flex items-center justify-center w-6 h-6 rounded text-cyber-muted hover:text-cyber-warn hover:bg-cyber-warn/10 transition text-[10px] font-bold border border-cyber-line/40 hover:border-cyber-warn/50 ml-0.5"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* @ Mention Autocomplete Overlay */}
              {mentionActive && (
                <div 
                  className="absolute bottom-4 left-4 z-50 flex flex-col w-96 max-h-60 rounded-xl border border-cyber-neon/60 bg-[#0a0f1f]/95 shadow-2xl shadow-cyber-neon/15 backdrop-blur-sm select-none font-mono text-[11px] overflow-hidden animate-slide-up"
                >
                  <div className="flex items-center justify-between px-3 py-2 border-b border-cyber-line/50 bg-[#0d1527]">
                    <span className="text-cyber-neon text-[10px] font-bold tracking-wider">
                      ⚡ MENTION FILE/FOLDER
                    </span>
                    {fileIndexLoading ? (
                      <span className="text-[10px] text-cyber-electric animate-pulse">Indexing...</span>
                    ) : (
                      <span className="text-[9px] text-slate-500">{mentionResults.length} matches</span>
                    )}
                  </div>

                  {/* Filter query display */}
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-cyber-line/30 bg-[#080d1a]">
                    <span className="text-cyber-neon font-bold">@</span>
                    <input
                      ref={mentionInputRef}
                      type="text"
                      value={mentionQuery}
                      onChange={(e) => setMentionQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          setMentionSelectedIndex(prev => Math.min(mentionResults.length - 1, prev + 1));
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          setMentionSelectedIndex(prev => Math.max(0, prev - 1));
                        } else if (e.key === 'Enter' || e.key === 'Tab') {
                          e.preventDefault();
                          const selected = mentionResults[mentionSelectedIndex];
                          if (selected) {
                            onSendInput(visibleSessionId!, "\x7f" + selected.name);
                          }
                          closeMention();
                        } else if (e.key === 'Escape') {
                          e.preventDefault();
                          closeMention();
                        }
                      }}
                      placeholder="type to search..."
                      className="flex-1 bg-transparent text-cyber-text text-xs outline-none caret-cyber-neon"
                    />
                  </div>

                  <div ref={mentionListRef} className="flex-1 overflow-y-auto scrollbar-thin p-1 max-h-40">
                    {mentionResults.length === 0 ? (
                      <div className="p-3 text-center text-slate-500 italic text-[10px]">
                        {fileIndexLoading ? 'Loading directory files...' : 'No files or folders found'}
                      </div>
                    ) : (
                      mentionResults.map((item, index) => {
                        const isSelected = index === mentionSelectedIndex;
                        return (
                          <div
                            key={item.path}
                            onClick={() => {
                              onSendInput(visibleSessionId!, "\x7f" + item.name);
                              closeMention();
                            }}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-cyber-neon/20 text-cyber-neon border-l-2 border-cyber-neon'
                                : 'hover:bg-[#121c33]/50 text-slate-300'
                            }`}
                          >
                            {item.isDir ? (
                              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-cyber-electric shrink-0">
                                <path fillRule="evenodd" d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Zm-6.75-10.5a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V16.5a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V10.5Z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-slate-400 shrink-0">
                                <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z" clipRule="evenodd" />
                              </svg>
                            )}
                            <span className="truncate flex-1 text-[10px]">{item.name}</span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="px-3 py-1.5 border-t border-cyber-line/30 bg-[#0d1527] flex items-center justify-between text-[9px] text-slate-500">
                    <span>↑↓ Navigate</span>
                    <span>⏎ Select</span>
                    <span>Esc Close</span>
                  </div>
                </div>
              )}

              {/* ! Ripgrep Autocomplete Overlay */}
              {rgActive && (
                <div 
                  className="absolute bottom-4 left-4 z-50 flex flex-col w-96 max-h-60 rounded-xl border border-cyber-electric/60 bg-[#0a0f1f]/95 shadow-2xl shadow-cyber-electric/15 backdrop-blur-sm select-none font-mono text-[11px] overflow-hidden animate-slide-up"
                >
                  <div className="flex items-center justify-between px-3 py-2 border-b border-cyber-line/50 bg-[#0c162b]">
                    <span className="text-cyber-electric text-[10px] font-bold tracking-wider">
                      🔍 RIPGREP SEARCH
                    </span>
                    {rgLoading ? (
                      <span className="text-[10px] text-cyber-electric animate-pulse">Searching...</span>
                    ) : (
                      <span className="text-[9px] text-slate-500">{rgResults.length} matches</span>
                    )}
                  </div>

                  {/* Filter query display */}
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-cyber-line/30 bg-[#080d1a]">
                    <span className="text-cyber-electric font-bold">!</span>
                    <input
                      ref={rgInputRef}
                      type="text"
                      value={rgQuery}
                      onChange={(e) => setRgQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          setRgSelectedIndex(prev => Math.min(rgResults.length - 1, prev + 1));
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          setRgSelectedIndex(prev => Math.max(0, prev - 1));
                        } else if (e.key === 'Enter' || e.key === 'Tab') {
                          e.preventDefault();
                          const selected = rgResults[rgSelectedIndex];
                          if (selected) {
                            onSendInput(visibleSessionId!, "\x7f" + selected.filePath);
                          }
                          closeRg();
                        } else if (e.key === 'Escape') {
                          e.preventDefault();
                          closeRg();
                        }
                      }}
                      placeholder="text to find inside files..."
                      className="flex-1 bg-transparent text-cyber-text text-xs outline-none caret-cyber-electric"
                    />
                  </div>

                  <div ref={rgListRef} className="flex-1 overflow-y-auto scrollbar-thin p-1 max-h-40">
                    {rgResults.length === 0 ? (
                      <div className="p-3 text-center text-slate-500 italic text-[10px]">
                        {rgLoading ? 'Searching file contents...' : 'Type something to search inside files'}
                      </div>
                    ) : (
                      rgResults.map((item, index) => {
                        const isSelected = index === rgSelectedIndex;
                        return (
                          <div
                            key={`${item.filePath}:${item.lineNumber}:${index}`}
                            onClick={() => {
                              onSendInput(visibleSessionId!, "\x7f" + item.filePath);
                              closeRg();
                            }}
                            className={`flex flex-col gap-0.5 px-2.5 py-1.5 rounded cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-cyber-electric/20 text-cyber-electric border-l-2 border-cyber-electric'
                                : 'hover:bg-[#121c33]/50 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[9px] text-slate-400 font-semibold truncate">
                              <span className="truncate max-w-[280px]">{item.filePath}</span>
                              <span className="text-cyber-electric font-mono text-[8px] bg-cyber-electric/10 px-1 rounded shrink-0">
                                L{item.lineNumber}
                              </span>
                            </div>
                            <span className="text-[10px] truncate text-slate-200 font-mono pl-1 border-l border-slate-700/50 italic">
                              {item.content || '(empty line)'}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="px-3 py-1.5 border-t border-cyber-line/30 bg-[#0c162b] flex items-center justify-between text-[9px] text-slate-500">
                    <span>↑↓ Navigate</span>
                    <span>⏎ Select</span>
                    <span>Esc Close</span>
                  </div>
                </div>
              )}

              {/* Active terminal canvas viewport — terminals always mounted, sub-views overlay */}
              <div className="flex-1 w-full h-full min-h-0 relative">
                {/* Terminals: always in DOM, hidden by visibility */}
                {sessions.map((session) => (
                  <div
                    key={`main-${session.id}`}
                    style={{
                      position: 'absolute',
                      left: (!openedFile && activeMainView === 'terminal' && visibleSessionId === session.id) ? 0 : '-9999px',
                      top: 0,
                      width: '100%',
                      height: '100%',
                      visibility: (!openedFile && activeMainView === 'terminal' && visibleSessionId === session.id) ? 'visible' : 'hidden',
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
                {/* Sub-view overlays */}
                {activeMainView === 'quickapps' && <QuickAppsPanel />}
                {activeMainView === 'apiclient' && <ApiClientPanel />}
                {activeMainView === 'settings' && <SettingsPanel theme={theme!} setTheme={setTheme!} />}
                {/* Heavy UI surfaces own work only while selected and visible. */}
                {uiActive && activeMainView === 'dashboard' && (
                  <div className="absolute inset-0 z-[5]">
                    <DashboardPanel />
                  </div>
                )}
                {uiActive && activeMainView === 'web-ai' && (
                  <div className="absolute inset-0 z-[5]">
                    <WebAiPanel visible />
                  </div>
                )}

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
                style={{ height: sshSessions.length === 0 ? `${Math.round(110 * miniTerminalScale)}px` : `${thumbSizes.cardHeight + 60}px` }}
                className="shrink-0 border-t border-cyber-line/50 bg-[#070b16] p-3 flex flex-col gap-2 overflow-hidden select-none transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-[9px] uppercase tracking-[0.15em] text-cyber-electric font-bold">
                      ⚡ CMD ({sshSessions.length})
                    </h3>
                    <div className="flex items-center gap-1 bg-black/45 border border-cyber-line/55 rounded px-1.5 py-0.5 scale-90 select-none">
                      <span className="text-[7px] font-mono text-cyber-electric/70 font-semibold tabular-nums min-w-[22px] text-right">{Math.round(miniTerminalScale * 100)}%</span>
                      <input
                        type="range"
                        min="50" max="200" step="5"
                        value={Math.round(miniTerminalScale * 100)}
                        onChange={(e) => {
                          const v = parseInt(e.target.value) / 100;
                          setMiniTerminalScale(v);
                          localStorage.setItem('clx-mini-terminal-scale', v.toFixed(1));
                        }}
                        className="w-14 h-1 accent-cyber-electric cursor-pointer"
                        title="Mini terminal scale"
                      />
                    </div>
                  </div>
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
                          className={`flex flex-col rounded-lg border-2 overflow-hidden transition-all duration-200 shrink-0 cursor-grab active:cursor-grabbing ${
                            isDragging 
                              ? 'opacity-30 border-cyber-neon shadow-neon-sm scale-105' 
                              : isActive 
                                ? 'border-cyber-electric shadow-neon-blue-sm bg-cyber-electric/5' 
                                : 'border-cyber-line/50 hover:border-cyber-electric/80 bg-[#0a0f1f] hover:shadow-neon-blue-sm'
                          }`}
                        >
                          {/* Terminal area — flex-1, no overlay */}
                          <div className="flex-1 relative min-h-0">
                            {/* Live scaled view */}
                            <div 
                              style={{ 
                                transform: `scale(${thumbSizes.scale})`, 
                                width: '640px', 
                                height: '400px',
                              }}
                              className="absolute origin-top-left pointer-events-none inset-0"
                            >
                              <div
                                ref={(node) => {
                                  miniContainerRefs.current[session.id] = node;
                                  if (node) {
                                    containerToSessionRef.current.set(node, session.id);
                                    if (rightPanelVisible) ensureMiniTerminal(session, node);
                                  }
                                }}
                                className="h-full w-full"
                              />
                            </div>

                            {/* Quick Close button */}
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

                          {/* Info bar — below terminal, not overlay */}
                          {thumbSizes.cardHeight >= 70 && (
                            <div className="shrink-0 bg-[#0a0f1f]/90 border-t border-cyber-line/20 px-2 py-1 flex items-center justify-between text-[8px]">
                              <MarqueeTitle text={`${session.cliName} - ${session.workingDir || ''}`} className="text-cyber-electric" />
                              <span className="font-mono text-[7px] px-1 rounded bg-[#0a0f1f]/80 border border-cyber-line text-slate-400 select-none">
                                {session.id.substring(0, 4)}
                              </span>
                            </div>
                          )}
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
            <>
              {/* Expand tab — visible only when panel is collapsed */}
              {!rightPanelVisible && (
                <button
                  type="button"
                  onClick={() => setRightPanelVisible(true)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex h-14 w-5 items-center justify-center rounded-l border border-l-0 border-cyber-neon/50 bg-[#0a0f1f]/90 text-cyber-neon hover:bg-cyber-neon hover:text-black transition cursor-pointer select-none font-bold text-[10px]"
                  title="Show Right Panel"
                >
                  ◀
                </button>
              )}
              <div 
                style={{ width: rightPanelVisible ? `${thumbSizes.containerWidth}px` : '0px' }}
                onMouseEnter={() => {
                  if (activeDragId) {
                    const sess = sessions.find(s => s.id === activeDragId);
                    const currentPanel = sess?.panel || 'right';
                    if (currentPanel !== 'right') {
                      onMoveSessionToPanel?.(activeDragId, 'right');
                    }
                  }
                }}
                className={`h-full border-cyber-line bg-cyber-base/40 flex flex-col gap-2 shrink-0 select-none overflow-hidden transition-all duration-300 ease-in-out ${
                  rightPanelVisible ? 'border-l p-3.5 opacity-100' : 'border-l-0 p-0 opacity-0'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3 className="font-display text-[8px] uppercase tracking-[0.15em] text-slate-500 font-bold truncate">
                      AI AGENT ({cliSessions.length})
                    </h3>
                  <div className="flex items-center gap-1 bg-black/45 border border-cyber-line/55 rounded px-1.5 py-1 select-none shrink-0">
                    <span className="text-[7px] font-mono text-cyber-electric/70 font-semibold tabular-nums min-w-[22px] text-right">{Math.round(miniTerminalScale * 100)}%</span>
                    <input
                      type="range"
                      min="50" max="200" step="5"
                      value={Math.round(miniTerminalScale * 100)}
                      onChange={(e) => {
                        const v = parseInt(e.target.value) / 100;
                        setMiniTerminalScale(v);
                        localStorage.setItem('clx-mini-terminal-scale', v.toFixed(1));
                      }}
                      className="w-14 h-1 accent-cyber-electric cursor-pointer"
                      title="Mini terminal scale"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onQuickSession?.('right')}
                  title="New Terminal (dock to right)"
                  className="flex items-center gap-0.5 rounded border border-cyber-neon/50 bg-cyber-neon/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-cyber-neon transition hover:bg-cyber-neon/25 hover:border-cyber-neon shadow-neon-sm-faint shrink-0"
                >
                  + New
                </button>
                <button
                  type="button"
                  onClick={() => setRightPanelVisible(false)}
                  title="Collapse panel"
                  className="flex items-center justify-center w-5 h-5 text-[10px] text-slate-500 hover:text-cyber-neon hover:bg-white/5 rounded transition ml-1 shrink-0"
                >
                  ▶
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
                        className={`flex flex-col rounded-lg border-2 overflow-hidden transition-all duration-200 shrink-0 cursor-grab active:cursor-grabbing ${
                          isDragging 
                            ? 'opacity-30 border-cyber-neon shadow-neon-sm scale-105' 
                            : isActive 
                              ? 'border-cyber-neon shadow-neon-sm bg-cyber-neon/5' 
                              : 'border-cyber-line/50 hover:border-cyber-electric/80 bg-[#0a0f1f] hover:shadow-neon-blue-sm'
                        }`}
                      >
                        {/* Terminal area — flex-1, no overlay */}
                        <div className="flex-1 relative min-h-0">
                          {/* Live scaled view */}
                          <div 
                            style={{ 
                              transform: `scale(${thumbSizes.scale})`, 
                              width: '640px', 
                              height: '400px',
                            }}
                            className="absolute origin-top-left pointer-events-none inset-0"
                          >
                            <div
                              ref={(node) => {
                                miniContainerRefs.current[session.id] = node;
                                if (node) {
                                  containerToSessionRef.current.set(node, session.id);
                                  if (rightPanelVisible) ensureMiniTerminal(session, node);
                                }
                              }}
                              className="h-full w-full"
                            />
                          </div>

                          {/* Quick Close button */}
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

                        {/* Info bar — below terminal, not overlay */}
                        {thumbSizes.cardHeight >= 70 && (
                          <div className="shrink-0 bg-[#0a0f1f]/90 border-t border-cyber-line/20 px-2 py-1 flex items-center justify-between text-[8px]">
                            <MarqueeTitle text={`${session.cliName} - ${session.workingDir || ''}`} className="text-slate-300" />
                            <span className="font-mono text-[7px] px-1 rounded bg-[#0a0f1f]/80 border border-cyber-line text-slate-400 select-none">
                              {session.id.substring(0, 4)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
          )}
        </div>
      )}

      {/* Cyberpunk Right-click Context Menu — lifted state from Dashboard */}
      {contextMenu && (
        <div
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed z-[100] w-52 rounded-lg border border-cyber-neon/40 bg-cyber-panel/95 p-1 text-slate-100 shadow-2xl backdrop-blur-md select-none font-mono text-[11px]"
          onClick={(e) => e.stopPropagation()}
        >
          {(() => {
            const sid = contextMenu.sessionId;
            const sessionTerminal = sid ? terminalRefs.current[sid]?.term : null;
            const terminalSelection = sessionTerminal?.hasSelection() ? sessionTerminal.getSelection() : '';
            const pageSelection = window.getSelection()?.toString() || '';
            const selectedText = (terminalSelection || pageSelection).trim();
            if (selectedText) {
              const copyMode = async (mode: TerminalCopyMode) => {
                if (!sessionTerminal) return;
                const text = getTerminalSelectionText(sessionTerminal, mode);
                if (mode === 'code' && text === '') return;
                try {
                  await navigator.clipboard.writeText(text);
                } catch {
                  /* swallow; UI just won't show a confirmation */
                }
              };
              return (
                <>
                  <button
                    type="button"
                    onClick={() => { void copyMode('exact'); setContextMenu(null); }}
                    className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-neon/25 hover:text-cyber-neon text-cyber-neon transition"
                  >
                    📋 Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => { void copyMode('code'); setContextMenu(null); }}
                    className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-neon/25 hover:text-cyber-neon text-cyber-neon transition"
                  >
                    🧩 Copy as code
                  </button>
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

          {contextMenu.sessionId && (
            <button
              type="button"
              onClick={() => {
                refreshMainTerminal(contextMenu.sessionId!);
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-neon/20 hover:text-cyber-neon transition"
            >
              🔄 Refresh
            </button>
          )}

          {contextMenu.sessionId && (
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(contextMenu.sessionId!);
              }}
              className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-electric/20 transition"
            >
              📋 Copy Session ID
            </button>
          )}

          {contextMenu.sessionId && (
            <>
              <div className="my-1 border-t border-cyber-line/50" />
              <button
                type="button"
                onClick={() => {
                  onStopSession(contextMenu.sessionId!);
                }}
                className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 font-bold transition"
              >
                ❌ Stop / Close Session
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
