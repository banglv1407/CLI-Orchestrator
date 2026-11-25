import { tFeedback as trFeedback, t as tr, useLocale } from '../i18n';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getNotepad, saveNotepad } from '../lib/tauri';
import { confirm } from '../lib/dialogs';
import type { NotepadState, NotepadTab } from '../types';

type LangDef = { id: string; label: string };

const LANGS: LangDef[] = [
  { id: 'markdown', label: 'Markdown' },
  { id: 'json', label: 'JSON' },
  { id: 'python', label: 'Python' },
  { id: 'sql', label: 'PostgreSQL' },
];

function guessLanguage(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return 'markdown';
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // Continue with heuristic detection.
    }
  }

  const upper = trimmed.toUpperCase();
  const sqlScore = [
    /\bSELECT\b/, /\bINSERT\b/, /\bUPDATE\b/, /\bDELETE\b/, /\bCREATE\b/,
    /\bFROM\b/, /\bWHERE\b/, /\bALTER\b/, /\bDROP\b/,
  ].filter((pattern) => pattern.test(upper)).length;
  if (sqlScore >= 2) return 'sql';

  const pythonScore = [
    /\bdef\s/, /\bclass\s/, /\bimport\s/, /\bfrom\s\w+\simport/,
    /^ {4}/m, /\breturn\b/, /\braise\b/, /\bself\b/,
  ].filter((pattern) => pattern.test(trimmed)).length;
  return pythonScore >= 2 ? 'python' : 'markdown';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function highlightJson(code: string): string {
  const tokenRegex = /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^"\\\n])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
  let lastIndex = 0;
  let out = '';
  let match: RegExpExecArray | null;
  while ((match = tokenRegex.exec(code)) !== null) {
    out += escapeHtml(code.slice(lastIndex, match.index));
    const [full, str, colon, kw] = match;
    if (str) {
      if (colon) {
        out += `<span class="text-cyan-400 font-semibold">${escapeHtml(str)}</span>${escapeHtml(colon)}`;
      } else {
        out += `<span class="text-emerald-300">${escapeHtml(str)}</span>`;
      }
    } else if (kw) {
      out += `<span class="text-amber-400 font-bold">${escapeHtml(full)}</span>`;
    } else {
      out += `<span class="text-purple-400">${escapeHtml(full)}</span>`;
    }
    lastIndex = tokenRegex.lastIndex;
  }
  out += escapeHtml(code.slice(lastIndex));
  return out;
}

function highlightPython(code: string): string {
  const tokenRegex = /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|(\b(?:def|class|import|from|return|if|elif|else|for|while|try|except|raise|with|as|pass|break|continue|in|is|not|and|or|lambda|yield|async|await|None|True|False|self)\b)/g;
  let lastIndex = 0;
  let out = '';
  let match: RegExpExecArray | null;
  while ((match = tokenRegex.exec(code)) !== null) {
    out += escapeHtml(code.slice(lastIndex, match.index));
    const [full, comment, str, num, kw] = match;
    if (comment) {
      out += `<span class="text-slate-500 italic">${escapeHtml(comment)}</span>`;
    } else if (str) {
      out += `<span class="text-emerald-300">${escapeHtml(str)}</span>`;
    } else if (num) {
      out += `<span class="text-purple-400">${escapeHtml(num)}</span>`;
    } else if (kw) {
      out += `<span class="text-cyber-neon font-semibold">${escapeHtml(kw)}</span>`;
    }
    lastIndex = tokenRegex.lastIndex;
  }
  out += escapeHtml(code.slice(lastIndex));
  return out;
}

function highlightSql(code: string): string {
  const tokenRegex = /(--[^\n]*|\/\*[\s\S]*?\*\/)|('(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|(\b(?:SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|JOIN|LEFT|RIGHT|INNER|OUTER|FULL|CROSS|ON|AND|OR|NOT|IN|LIKE|BETWEEN|IS|NULL|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|AS|BEGIN|COMMIT|ROLLBACK|TRANSACTION|EXISTS|CASE|WHEN|THEN|ELSE|END|UNION|ALL|DISTINCT|COUNT|SUM|AVG|MAX|MIN|INT|INTEGER|VARCHAR|TEXT|BOOLEAN|TIMESTAMP|SERIAL|PRIMARY|KEY|REFERENCES|DEFAULT)\b)/gi;
  let lastIndex = 0;
  let out = '';
  let match: RegExpExecArray | null;
  while ((match = tokenRegex.exec(code)) !== null) {
    out += escapeHtml(code.slice(lastIndex, match.index));
    const [full, comment, str, num, kw] = match;
    if (comment) {
      out += `<span class="text-slate-500 italic">${escapeHtml(comment)}</span>`;
    } else if (str) {
      out += `<span class="text-emerald-300">${escapeHtml(str)}</span>`;
    } else if (num) {
      out += `<span class="text-purple-400">${escapeHtml(num)}</span>`;
    } else if (kw) {
      out += `<span class="text-cyan-400 font-bold uppercase">${escapeHtml(kw)}</span>`;
    }
    lastIndex = tokenRegex.lastIndex;
  }
  out += escapeHtml(code.slice(lastIndex));
  return out;
}

function highlightMarkdown(code: string): string {
  const lines = code.split('\n');
  return lines.map((line) => {
    const hMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (hMatch) {
      const level = hMatch[1].length;
      const content = escapeHtml(hMatch[2]);
      const sizeClass = level === 1 ? 'text-lg text-cyber-neon font-bold border-b border-cyber-neon/20 pb-1 mb-2' : level === 2 ? 'text-base text-cyan-300 font-semibold mb-1.5' : 'text-sm text-slate-200 font-semibold mb-1';
      return `<div class="${sizeClass}">${content}</div>`;
    }
    if (line.startsWith('> ')) {
      return `<div class="border-l-2 border-cyan-500/50 pl-3 italic text-slate-400 my-0.5">${escapeHtml(line.slice(2))}</div>`;
    }
    if (line.match(/^[-*]\s+/)) {
      return `<div class="pl-4 text-slate-300 my-0.5">• ${escapeHtml(line.replace(/^[-*]\s+/, ''))}</div>`;
    }
    let rendered = escapeHtml(line);
    rendered = rendered.replace(/`([^`]+)`/g, '<code class="rounded bg-black/40 px-1 py-0.5 text-cyber-neon border border-cyber-line/30 font-mono text-xs">$1</code>');
    rendered = rendered.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
    return `<div>${rendered || '&nbsp;'}</div>`;
  }).join('');
}

function highlight(code: string, language: string): string {
  if (language === 'json') return highlightJson(code);
  if (language === 'python') return highlightPython(code);
  if (language === 'sql') return highlightSql(code);
  if (language === 'markdown') return highlightMarkdown(code);
  return escapeHtml(code);
}

function applySearchHighlight(html: string, query: string, activeIdx: number): string {
  if (!query.trim()) return html;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(?![^<]*>)(${escapedQuery})`, 'gi');
  let matchCount = 0;
  return html.replace(regex, (m) => {
    const isCurrent = matchCount === activeIdx;
    matchCount++;
    if (isCurrent) {
      return `<mark class="rounded bg-cyber-neon text-black font-bold px-1 ring-2 ring-white">${m}</mark>`;
    }
    return `<mark class="rounded bg-yellow-400/90 text-black font-semibold px-0.5">${m}</mark>`;
  });
}

function prettyFormat(text: string, language: string): string {
  if (language === 'json') {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  }
  return text
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function createTab(title: string): NotepadTab {
  const randomId = globalThis.crypto?.randomUUID?.()
    ?? `note-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return {
    id: randomId,
    title,
    text: '',
    language: 'markdown',
  };
}

function nextTabTitle(tabs: NotepadTab[]): string {
  const titles = new Set(tabs.map((tab) => tab.title));
  let index = 1;
  while (titles.has(`Note ${index}`)) index += 1;
  return `Note ${index}`;
}

function removeTab(state: NotepadState, tabId: string): NotepadState {
  const removedIndex = state.tabs.findIndex((tab) => tab.id === tabId);
  let tabs = state.tabs.filter((tab) => tab.id !== tabId);
  if (tabs.length === 0) {
    tabs = [createTab(nextTabTitle(state.tabs))];
  }
  const activeTabId = state.activeTabId === tabId
    ? tabs[Math.min(Math.max(removedIndex, 0), tabs.length - 1)].id
    : state.activeTabId;
  return { ...state, activeTabId, tabs };
}

type Props = {
  onClose?: () => void;
  pinned?: boolean;
  onTogglePin?: () => void;
  width?: number;
};

export function Notepad({ onClose, pinned = false, onTogglePin, width }: Props) {
  const locale = useLocale();
  const rootRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<NotepadState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [confirmCloseId, setConfirmCloseId] = useState<string | null>(null);
  const [savingClose, setSavingClose] = useState(false);

  // Search states
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentMatchIdx, setCurrentMatchIdx] = useState(0);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const savedSnapshotRef = useRef('');
  const latestStateRef = useRef<NotepadState | null>(null);
  const renameCancelledRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchComposingRef = useRef(false);

  useEffect(() => {
    void (async () => {
      try {
        const loaded = await getNotepad();
        const normalized: NotepadState = {
          ...loaded,
          tabs: loaded.tabs.map((tab) => ({
            ...tab,
            language: tab.language || guessLanguage(tab.text),
          })),
        };
        latestStateRef.current = normalized;
        savedSnapshotRef.current = JSON.stringify(normalized);
        setState(normalized);
        setSaved(true);
      } catch (loadError) {
        setError(String(loadError));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persistState = useCallback(async (candidate: NotepadState) => {
    const serialized = JSON.stringify(candidate);
    const operation = saveQueueRef.current.then(() => saveNotepad(candidate));
    saveQueueRef.current = operation.catch(() => undefined);
    try {
      await operation;
      savedSnapshotRef.current = serialized;
      if (JSON.stringify(latestStateRef.current) === serialized) {
        setSaved(true);
      }
      setError(null);
      return true;
    } catch (saveError) {
      setSaved(false);
      setError(String(saveError));
      return false;
    }
  }, []);

  useEffect(() => {
    if (!state) return;
    latestStateRef.current = state;
    const serialized = JSON.stringify(state);
    if (serialized === savedSnapshotRef.current) {
      setSaved(true);
      return;
    }

    setSaved(false);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      void persistState(state);
    }, 800);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [persistState, state]);

  const activeTab = useMemo(() => (
    state?.tabs.find((tab) => tab.id === state.activeTabId) ?? null
  ), [state]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setDebouncedSearchQuery('');
      return;
    }
    const timer = window.setTimeout(() => {
      if (!searchComposingRef.current) {
        setDebouncedSearchQuery(searchQuery);
      }
    }, 280);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const computeMatches = useCallback((query: string, sourceText?: string) => {
    if (!query.trim() || !sourceText) return [];
    const q = query.toLowerCase();
    const text = sourceText.toLowerCase();
    const matches: { start: number; end: number }[] = [];
    let idx = 0;
    while ((idx = text.indexOf(q, idx)) !== -1) {
      matches.push({ start: idx, end: idx + q.length });
      idx += q.length;
    }
    return matches;
  }, []);

  // Compute matches in active tab
  const activeMatches = useMemo(
    () => computeMatches(debouncedSearchQuery, activeTab?.text),
    [computeMatches, debouncedSearchQuery, activeTab?.text],
  );

  // Compute match counts for all tabs
  const tabMatchCounts = useMemo(() => {
    if (!debouncedSearchQuery.trim() || !state) return {};
    const q = debouncedSearchQuery.toLowerCase();
    const counts: Record<string, number> = {};
    for (const tab of state.tabs) {
      if (!tab.text) continue;
      const text = tab.text.toLowerCase();
      let count = 0;
      let idx = 0;
      while ((idx = text.indexOf(q, idx)) !== -1) {
        count++;
        idx += q.length;
      }
      if (count > 0) counts[tab.id] = count;
    }
    return counts;
  }, [debouncedSearchQuery, state]);

  const renderedHtml = useMemo(() => {
    if (!activeTab) return '';
    const base = highlight(activeTab.text, activeTab.language);
    if (debouncedSearchQuery.trim()) {
      return applySearchHighlight(base, debouncedSearchQuery.trim(), currentMatchIdx);
    }
    return base;
  }, [activeTab, debouncedSearchQuery, currentMatchIdx]);

  const scrollToMatch = useCallback((index: number, matchesOverride = activeMatches) => {
    if (!matchesOverride.length) return;
    const bounded = (index + matchesOverride.length) % matchesOverride.length;
    setCurrentMatchIdx(bounded);
    const match = matchesOverride[bounded];
    if (textareaRef.current && !showPreview) {
      // Never steal focus from searchInputRef while typing or stepping through matches!
      textareaRef.current.setSelectionRange(match.start, match.end);
      const textBefore = activeTab?.text.slice(0, match.start) || '';
      const lineIdx = (textBefore.match(/\n/g) || []).length;
      const lineHeight = 22;
      textareaRef.current.scrollTop = Math.max(0, lineIdx * lineHeight - 80);
    }
  }, [activeMatches, showPreview, activeTab?.text]);

  // When debounced search query changes, jump to first match without stealing focus
  useEffect(() => {
    if (activeMatches.length > 0) {
      scrollToMatch(0, activeMatches);
    } else {
      setCurrentMatchIdx(0);
    }
  }, [debouncedSearchQuery, activeTab?.id]);

  const updateActiveTab = useCallback((patch: Partial<NotepadTab>) => {
    setState((current) => {
      if (!current) return current;
      const next = {
        ...current,
        tabs: current.tabs.map((tab) => (
          tab.id === current.activeTabId ? { ...tab, ...patch } : tab
        )),
      };
      latestStateRef.current = next;
      return next;
    });
  }, []);

  const requestClose = useCallback(async () => {
    if (!onClose || savingClose) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    const latest = latestStateRef.current;
    if (
      latest
      && JSON.stringify(latest) !== savedSnapshotRef.current
    ) {
      setSavingClose(true);
      const didSave = await persistState(latest);
      setSavingClose(false);
      if (!didSave) return;
    }
    onClose();
  }, [onClose, persistState, savingClose]);

  const handleTogglePin = useCallback(async () => {
    if (!onTogglePin || savingClose) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    const latest = latestStateRef.current;
    if (latest && JSON.stringify(latest) !== savedSnapshotRef.current) {
      setSavingClose(true);
      const didSave = await persistState(latest);
      setSavingClose(false);
      if (!didSave) return;
    }
    onTogglePin();
  }, [onTogglePin, persistState, savingClose]);

  const addTab = () => {
    setState((current) => {
      if (!current) return current;
      const tab = createTab(nextTabTitle(current.tabs));
      const next = {
        ...current,
        activeTabId: tab.id,
        tabs: [...current.tabs, tab],
      };
      latestStateRef.current = next;
      return next;
    });
    setShowPreview(false);
  };

  const beginRename = (tab: NotepadTab) => {
    renameCancelledRef.current = false;
    setRenamingId(tab.id);
    setRenameValue(tab.title);
  };

  const commitRename = (tabId: string) => {
    if (renameCancelledRef.current) {
      renameCancelledRef.current = false;
      return;
    }
    setState((current) => {
      if (!current) return current;
      const existing = current.tabs.find((tab) => tab.id === tabId);
      const title = renameValue.trim() || existing?.title || 'Untitled';
      const next = {
        ...current,
        tabs: current.tabs.map((tab) => (
          tab.id === tabId ? { ...tab, title } : tab
        )),
      };
      latestStateRef.current = next;
      return next;
    });
    setRenamingId(null);
  };

  const closeTab = async (tabId: string, persistBeforeClose: boolean) => {
    const current = latestStateRef.current;
    if (!current || savingClose) return;
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    const next = removeTab(current, tabId);
    if (persistBeforeClose) {
      setSavingClose(true);
      const didSave = await persistState(next);
      setSavingClose(false);
      if (!didSave) return;
    }
    latestStateRef.current = next;
    setState(next);
    setConfirmCloseId(null);
  };

  const requestTabClose = (tab: NotepadTab) => {
    if (tab.text.length > 0) {
      setConfirmCloseId(tab.id);
      return;
    }
    void closeTab(tab.id, false);
  };

  const handleClearContent = async () => {
    if (!activeTab || !activeTab.text) return;
    const ok = await confirm(tr("Clear all text in this note?"), {
      title: tr("Clear Note"),
      okLabel: tr("Clear"),
      cancelLabel: tr("Cancel"),
    });
    if (ok) {
      updateActiveTab({ text: '' });
    }
  };

  const onEditorKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      textarea.setRangeText('  ', start, textarea.selectionEnd, 'end');
      updateActiveTab({ text: textarea.value });
      requestAnimationFrame(() => {
        textarea.selectionStart = start + 2;
        textarea.selectionEnd = start + 2;
      });
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') {
      event.preventDefault();
      setSearchOpen(true);
      setTimeout(() => searchInputRef.current?.focus(), 50);
      return;
    }
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      setShowPreview((current) => !current);
      return;
    }
    if (event.key === 'Escape') {
      if (searchOpen) {
        event.preventDefault();
        setSearchOpen(false);
      } else if (!pinned) {
        event.preventDefault();
        void requestClose();
      }
    }
  };

  // Global Ctrl+F listener for Notepad (scoped to Notepad subtree when pinned beside terminal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (pinned && !rootRef.current?.contains(document.activeElement)) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pinned]);

  const outerClass = pinned
    ? 'flex h-full shrink-0 min-w-0'
    : 'fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-8';
  const outerStyle = pinned && width ? { width: `${width}px` } : undefined;

  if (loading) {
    return (
      <div ref={rootRef} style={outerStyle} className={pinned ? 'flex h-full shrink-0 items-center justify-center rounded-xl border border-cyber-line/50 bg-cyber-panel' : 'fixed inset-0 z-50 flex items-center justify-center bg-black/60'}>
        <span className="text-sm text-slate-400">{tr("Loading notepad...")}</span>
      </div>
    );
  }

  if (!state || !activeTab) {
    return (
      <div ref={rootRef} style={outerStyle} className={pinned ? 'flex h-full shrink-0 items-center justify-center rounded-xl border border-cyber-line/50 bg-cyber-panel p-4' : 'fixed inset-0 z-50 flex items-center justify-center bg-black/60'}>
        <div className="rounded-lg border border-rose-500/40 bg-cyber-panel p-5 text-sm text-rose-300">
          <p className="mb-3">{tr("Could not load Notepad.")}</p>
          <p className="max-w-xl break-words font-mono text-xs text-slate-400">{trFeedback(error ?? '')}</p>
          <button type="button" onClick={onClose} className="mt-4 rounded border border-cyber-line px-3 py-1 text-xs">{tr("Close")}</button>
        </div>
      </div>
    );
  }

  const lineCount = (activeTab.text.match(/\n/g)?.length ?? 0) + 1;
  const pendingCloseTab = confirmCloseId
    ? state.tabs.find((tab) => tab.id === confirmCloseId) ?? null
    : null;

  return (
    <div
      ref={rootRef}
      data-notepad-pinned={pinned ? 'true' : 'false'}
      style={outerStyle}
      className={outerClass}
      onClick={(event) => {
        if (!pinned && event.target === event.currentTarget) void requestClose();
      }}
    >
      <div className={pinned ? 'flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border border-cyber-line bg-cyber-panel shadow-2xl' : 'flex h-[92vh] w-[95vw] max-w-7xl flex-col overflow-hidden rounded-xl border border-cyber-line/50 bg-cyber-panel shadow-2xl'}>
        {/* Top Header */}
        <div className={`flex flex-wrap items-center justify-between gap-2 border-b border-cyber-line/40 bg-cyber-base/70 ${pinned ? 'px-3 py-2' : 'px-5 py-2.5'}`}>
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="font-display text-sm uppercase tracking-widest text-cyber-neon font-bold">{tr("Notepad")}</h2>
            <span className={`rounded-full px-2 py-0.5 text-xs font-mono ${
              saved ? 'bg-slate-500/10 text-slate-400' : 'bg-yellow-500/10 text-yellow-400 font-semibold'
            }`}>
              {savingClose ? tr("Saving…") : saved ? tr("Saved") : tr("Unsaved")}
            </span>
            {error && <span className="max-w-[260px] truncate text-xs text-red-400" title={trFeedback(error ?? '')}>{trFeedback(error ?? '')}</span>}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* Search Toggle Button */}
            <button
              type="button"
              onClick={() => {
                setSearchOpen((prev) => !prev);
                if (!searchOpen) {
                  setTimeout(() => searchInputRef.current?.focus(), 50);
                }
              }}
              title={tr("Search notes (Ctrl+F)")}
              className={`rounded border px-2.5 py-1 text-xs transition flex items-center gap-1.5 font-mono ${
                searchOpen
                  ? 'border-cyber-electric bg-cyber-electric/15 text-cyber-electric'
                  : 'border-cyber-line text-slate-400 hover:border-cyber-electric/40 hover:text-slate-200'
              }`}
            >
              <span>🔍</span>
              <span>{tr("Find")}</span>
            </button>

            <button
              type="button"
              onClick={() => updateActiveTab({ language: guessLanguage(activeTab.text) })}
              title={tr("Auto-detect language")}
              className="rounded border border-cyber-line px-2 py-1 text-xs text-slate-400 transition hover:border-cyan-400/30 hover:text-cyan-400"
            >{tr("Detect")}</button>

            <select
              value={activeTab.language}
              onChange={(event) => updateActiveTab({ language: event.target.value })}
              className="rounded border border-cyber-line bg-cyber-base px-2 py-1 text-xs text-slate-300 outline-none focus:border-cyber-neon"
            >
              {LANGS.map((language) => (
                <option key={language.id} value={language.id}>{tr(language.label)}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => updateActiveTab({
                text: prettyFormat(activeTab.text, activeTab.language),
              })}
              title={tr("Format text / clean whitespace")}
              className="rounded border border-cyber-line px-2 py-1 text-xs text-slate-400 transition hover:border-green-400/30 hover:text-green-400"
            >{tr("Pretty")}</button>

            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClearContent}
              disabled={!activeTab.text}
              title={tr("Clear note text")}
              className="rounded border border-cyber-line px-2 py-1 text-xs text-slate-400 transition hover:border-rose-400/40 hover:text-rose-300 disabled:opacity-40"
            >{tr("Clear")}</button>

            <button
              type="button"
              onClick={() => setShowPreview((current) => !current)}
              className={`rounded border px-2.5 py-1 text-xs transition font-semibold ${
                showPreview
                  ? 'border-cyber-neon/40 bg-cyber-neon/15 text-cyber-neon'
                  : 'border-cyber-line text-slate-300 hover:text-white hover:border-cyber-neon/30'
              }`}
            >
              {showPreview ? tr("Edit") : tr("Preview")}
            </button>

            {onTogglePin && (
              <button
                type="button"
                onClick={() => void handleTogglePin()}
                disabled={savingClose}
                data-notepad-pin-toggle
                aria-pressed={pinned}
                title={pinned ? tr("Unpin to popup") : tr("Pin beside terminal")}
                className={`rounded border px-2 py-1 text-xs transition flex items-center gap-1 font-semibold disabled:opacity-50 ${
                  pinned
                    ? 'border-cyber-neon/60 bg-cyber-neon/15 text-cyber-neon'
                    : 'border-cyber-line text-slate-400 hover:border-cyber-neon/40 hover:text-slate-200'
                }`}
              >
                <span aria-hidden="true">📌</span>
                <span>{pinned ? tr("Pinned") : tr("Pin")}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => void requestClose()}
              disabled={savingClose}
              title={tr("Close")}
              className="rounded border border-cyber-line px-2.5 py-1 text-xs text-slate-400 transition hover:text-slate-200 hover:border-cyber-line/80 disabled:opacity-50"
            >
              {pinned ? '✕' : 'Esc'}
            </button>
          </div>
        </div>

        {/* Search Bar Row (Collapsible) */}
        {searchOpen && (
          <div className="flex shrink-0 items-center justify-between border-b border-cyber-line/50 bg-[#080d1a] px-4 py-2">
            <div className="flex items-center gap-2 flex-1 max-w-xl">
              <span className="text-slate-400 text-xs">🔍</span>
              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onCompositionStart={() => { searchComposingRef.current = true; }}
                  onCompositionEnd={(e) => {
                    searchComposingRef.current = false;
                    setSearchQuery(e.currentTarget.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.nativeEvent.isComposing || searchComposingRef.current) return;
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (debouncedSearchQuery !== searchQuery) {
                        setDebouncedSearchQuery(searchQuery);
                        const fresh = computeMatches(searchQuery, activeTab?.text);
                        scrollToMatch(e.shiftKey ? fresh.length - 1 : 0, fresh);
                      } else {
                        scrollToMatch(e.shiftKey ? currentMatchIdx - 1 : currentMatchIdx + 1);
                      }
                    }
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      setSearchOpen(false);
                      textareaRef.current?.focus();
                    }
                  }}
                  placeholder={tr("Find in note... (Enter = next, Shift+Enter = prev, Esc = close)")}
                  className="w-full rounded border border-cyber-line bg-cyber-base pl-3 pr-8 py-1 text-xs text-slate-100 placeholder-slate-500 font-mono outline-none focus:border-cyber-electric transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSearchQuery('');
                      setDebouncedSearchQuery('');
                    }}
                    className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Match Counter */}
              <span className="font-mono text-xs text-slate-400 shrink-0 min-w-[70px] text-center">
                {debouncedSearchQuery.trim()
                  ? activeMatches.length > 0
                    ? `${currentMatchIdx + 1} / ${activeMatches.length}`
                    : tr("No matches")
                  : ''}
              </span>

              {/* Prev / Next buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={!searchQuery.trim() || (debouncedSearchQuery === searchQuery && activeMatches.length === 0)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (debouncedSearchQuery !== searchQuery) {
                      setDebouncedSearchQuery(searchQuery);
                      const fresh = computeMatches(searchQuery, activeTab?.text);
                      scrollToMatch(fresh.length - 1, fresh);
                    } else {
                      scrollToMatch(currentMatchIdx - 1);
                    }
                  }}
                  title={tr("Previous match (Shift+Enter)")}
                  className="rounded border border-cyber-line bg-cyber-base/40 px-2 py-1 text-xs text-slate-300 hover:bg-cyber-base disabled:opacity-30 transition"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={!searchQuery.trim() || (debouncedSearchQuery === searchQuery && activeMatches.length === 0)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (debouncedSearchQuery !== searchQuery) {
                      setDebouncedSearchQuery(searchQuery);
                      const fresh = computeMatches(searchQuery, activeTab?.text);
                      scrollToMatch(0, fresh);
                    } else {
                      scrollToMatch(currentMatchIdx + 1);
                    }
                  }}
                  title={tr("Next match (Enter)")}
                  className="rounded border border-cyber-line bg-cyber-base/40 px-2 py-1 text-xs text-slate-300 hover:bg-cyber-base disabled:opacity-30 transition"
                >
                  ▼
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
                setDebouncedSearchQuery('');
              }}
              title={tr("Close search")}
              className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 font-mono"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab List */}
        <div role="tablist" aria-label={tr("Notepad tabs")} className="flex shrink-0 items-end gap-1 overflow-x-auto border-b border-cyber-line/40 bg-[#070b16] px-3 pt-2 scrollbar-thin">
          {state.tabs.map((tab) => {
            const isActive = tab.id === state.activeTabId;
            const matchCount = tabMatchCounts[tab.id] || 0;
            return (
              <div
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                className={`flex max-w-[240px] shrink-0 items-center rounded-t border border-b-0 transition ${
                  isActive
                    ? 'border-cyber-neon/50 bg-cyber-panel text-cyber-neon'
                    : 'border-cyber-line/40 bg-cyber-base/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                {renamingId === tab.id ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(event) => setRenameValue(event.target.value)}
                    onBlur={() => commitRename(tab.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        commitRename(tab.id);
                      }
                      if (event.key === 'Escape') {
                        event.preventDefault();
                        renameCancelledRef.current = true;
                        setRenamingId(null);
                      }
                    }}
                    className="min-w-[80px] max-w-[160px] bg-transparent px-2 py-1.5 text-xs outline-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setState((current) => {
                      if (!current) return current;
                      const next = { ...current, activeTabId: tab.id };
                      latestStateRef.current = next;
                      return next;
                    })}
                    onDoubleClick={() => beginRename(tab)}
                    title={tr("{v0} — double-click to rename", { v0: String(tab.title) })}
                    className="min-w-[70px] max-w-[170px] truncate px-2 py-1.5 text-left text-xs flex items-center gap-1.5"
                  >
                    <span className="truncate">{tab.title}</span>
                    {matchCount > 0 && (
                      <span className="rounded bg-cyber-neon/20 px-1 py-0.2 text-[9px] font-bold text-cyber-neon border border-cyber-neon/30 shrink-0 font-mono">
                        {matchCount}
                      </span>
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => requestTabClose(tab)}
                  title={tr("Close {v0}", { v0: String(tab.title) })}
                  className="mr-1 rounded px-1 text-[10px] text-slate-500 hover:bg-rose-500/20 hover:text-rose-300"
                >
                  ✕
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={addTab}
            title={tr("New note tab")}
            className="mb-1 shrink-0 rounded border border-cyber-line/50 px-2 py-1 text-xs text-slate-400 hover:border-cyber-neon/50 hover:text-cyber-neon transition"
          >
            +
          </button>
        </div>

        {/* Editor / Preview Area */}
        <div className="min-h-0 flex-1 overflow-hidden font-mono text-sm leading-relaxed bg-[#050811]">
          {showPreview ? (
            <div
              key={`preview-${activeTab.id}`}
              className="h-full overflow-auto break-words whitespace-pre-wrap bg-black/20 p-5 text-slate-200 scrollbar-thin select-text"
              dangerouslySetInnerHTML={{ __html: renderedHtml || escapeHtml(activeTab.text) }}
            />
          ) : (
            <div className="relative h-full min-h-0">
              <textarea
                key={`editor-${activeTab.id}`}
                ref={textareaRef}
                value={activeTab.text}
                onChange={(event) => updateActiveTab({ text: event.target.value })}
                onKeyDown={onEditorKeyDown}
                className="h-full w-full resize-none overflow-auto border-none bg-transparent p-5 font-mono text-sm leading-relaxed text-slate-100 outline-none placeholder-slate-500 scrollbar-thin selection:bg-cyber-neon/30 selection:text-white"
                spellCheck={false}
                placeholder={tr("Start typing...")}
              />
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between border-t border-cyber-line/40 bg-cyber-base/50 px-4 py-1.5 text-[10px] text-slate-500 font-mono">
          <span>
            {activeTab.language.toUpperCase()} · {lineCount}{tr(" lines · ")}{activeTab.text.length}{tr(" chars")}<span className="ml-2 text-cyan-500">{state.tabs.length}{tr(" tabs")}</span>
            {activeMatches.length > 0 && (
              <span className="ml-2 text-cyber-neon font-bold">
                · {activeMatches.length} {tr("matches found")}
              </span>
            )}
          </span>
          {!pinned && (
            <span>{tr("Ctrl+F Find · Double-click tab to rename · Ctrl+Enter Preview · Tab Indent · Esc Close")}</span>
          )}
        </div>
      </div>

      {pendingCloseTab && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70">
          <div className="w-[420px] max-w-[90vw] rounded-xl border border-rose-500/40 bg-cyber-panel p-5 shadow-2xl">
            <h3 className="font-display text-sm uppercase tracking-wider text-rose-300 font-bold">{tr("Close note tab?")}</h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-300">
              “{pendingCloseTab.title}{tr("” contains content. Closing it permanently removes that tab from Notepad.")}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmCloseId(null)}
                disabled={savingClose}
                className="rounded border border-cyber-line px-3 py-1.5 text-xs text-slate-300 disabled:opacity-50 transition"
              >{tr("Cancel")}</button>
              <button
                type="button"
                onClick={() => void closeTab(pendingCloseTab.id, true)}
                disabled={savingClose}
                className="rounded border border-rose-500/60 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 disabled:opacity-50 hover:bg-rose-500/20 transition font-bold"
              >
                {savingClose ? tr("Saving…") : tr("Close tab")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
