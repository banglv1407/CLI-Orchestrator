import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { t as tr, tFeedback as trFeedback, useLocale } from '../i18n';
import { formatConfigContent, isConfigFile, validateConfigSyntax } from '../lib/configFiles';
import type { GitStatusEntry, SshConnection } from '../types';

export interface OpenedFileTab {
  id: string;
  path: string;
  name: string;
  rootPath: string | null;
  sshConnection: SshConnection | null;
  content: string;
  originalContent: string;
  loading: boolean;
  saving: boolean;
  loadError: string | null;
  viewMode: 'edit' | 'diff';
  gitDiffContent: string;
  diffLoading: boolean;
}

interface FileEditorPanelProps {
  tabs: OpenedFileTab[];
  activeTabId: string | null;
  gitStatusList: GitStatusEntry[];
  activeSessionId?: string | null;
  pinned?: boolean;
  width?: number;
  onSelectTab: (tabId: string) => void;
  onChangeTabContent: (tabId: string, content: string) => void;
  onChangeTabViewMode: (tabId: string, mode: 'edit' | 'diff') => void;
  onSaveTab: (tabId: string, contentOverride?: string) => Promise<boolean>;
  onSendInput?: (sessionId: string, data: string) => void;
  onCloseTab: (tabId: string) => void;
  onCloseAllCleanTabs: () => void;
  onTogglePin: () => void;
  onHidePanel: () => void;
}

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

export function FileEditorPanel({
  tabs,
  activeTabId,
  gitStatusList,
  activeSessionId,
  pinned = false,
  width,
  onSelectTab,
  onChangeTabContent,
  onChangeTabViewMode,
  onSaveTab,
  onSendInput,
  onCloseTab,
  onCloseAllCleanTabs,
  onTogglePin,
  onHidePanel,
}: FileEditorPanelProps) {
  useLocale();
  const rootRef = useRef<HTMLDivElement>(null);
  const fileEditorRef = useRef<HTMLTextAreaElement | null>(null);
  const fileDiffScrollRef = useRef<HTMLDivElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);
  const fileSearchInputRef = useRef<HTMLInputElement | null>(null);
  const fileSearchComposingRef = useRef(false);
  const fileHighlightBarRef = useRef<HTMLDivElement | null>(null);

  const [fileSearchOpen, setFileSearchOpen] = useState(false);
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [debouncedFileSearchQuery, setDebouncedFileSearchQuery] = useState('');
  const [fileMatchIdx, setFileMatchIdx] = useState(0);
  const [fileWordWrap, setFileWordWrap] = useState(false);
  const [fileCursorPos, setFileCursorPos] = useState({ line: 1, col: 1 });
  const [formatFeedback, setFormatFeedback] = useState<{ text: string; isError?: boolean } | null>(null);
  const [confirmCloseTabId, setConfirmCloseTabId] = useState<string | null>(null);

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? tabs[0] ?? null,
    [tabs, activeTabId],
  );
  const pendingCloseTab = useMemo(
    () => (confirmCloseTabId ? tabs.find((t) => t.id === confirmCloseTabId) ?? null : null),
    [tabs, confirmCloseTabId],
  );

  // Disambiguate duplicate filenames across open tabs with parent folder name
  const duplicateNames = useMemo(() => {
    const counts = new Map<string, number>();
    for (const tab of tabs) {
      counts.set(tab.name, (counts.get(tab.name) ?? 0) + 1);
    }
    return counts;
  }, [tabs]);

  const tabDisplayLabel = useCallback(
    (tab: OpenedFileTab) => {
      if ((duplicateNames.get(tab.name) ?? 0) <= 1) return tab.name;
      const parts = tab.path.split(/[/\\]/).filter(Boolean);
      const parent = parts.length >= 2 ? parts[parts.length - 2] : '';
      return parent ? `${parent}/${tab.name}` : tab.name;
    },
    [duplicateNames],
  );

  useEffect(() => {
    setFileMatchIdx(0);
    setFileCursorPos({ line: 1, col: 1 });
    setFormatFeedback(null);
  }, [activeTab?.id]);

  // ponytail: 280ms debounce avoids premature jump while typing; upgrade to WebWorker search only if opening >5MB files.
  useEffect(() => {
    if (!fileSearchQuery.trim()) {
      setDebouncedFileSearchQuery('');
      setFileMatchIdx(0);
      return;
    }
    const timer = window.setTimeout(() => {
      if (!fileSearchComposingRef.current) {
        setDebouncedFileSearchQuery(fileSearchQuery);
        setFileMatchIdx(0);
      }
    }, 280);
    return () => window.clearTimeout(timer);
  }, [fileSearchQuery]);

  const fileContent = activeTab?.content ?? '';
  const viewMode = activeTab?.viewMode ?? 'edit';
  const gitDiffContent = activeTab?.gitDiffContent ?? '';
  const searchableFileText = viewMode === 'diff' ? gitDiffContent : fileContent;

  const fileMatches = useMemo(() => {
    if (!debouncedFileSearchQuery.trim() || !searchableFileText) return [];
    const q = debouncedFileSearchQuery.toLowerCase();
    const text = searchableFileText.toLowerCase();
    const res: { start: number; end: number; line: number }[] = [];
    let idx = 0;
    let scanPos = 0;
    let runningLine = 0;
    while ((idx = text.indexOf(q, idx)) !== -1) {
      for (let i = scanPos; i < idx; i++) {
        if (searchableFileText.charCodeAt(i) === 10) runningLine++;
      }
      scanPos = idx;
      res.push({ start: idx, end: idx + q.length, line: runningLine });
      idx += q.length;
    }
    return res;
  }, [searchableFileText, debouncedFileSearchQuery]);

  const fileMatchLines = useMemo(() => new Set(fileMatches.map((m) => m.line)), [fileMatches]);
  const activeFileMatch = fileMatches.length > 0 ? fileMatches[fileMatchIdx % fileMatches.length] : null;

  const syncFileHighlightBar = useCallback((lineIdx: number | null) => {
    const bar = fileHighlightBarRef.current;
    if (!bar) return;
    if (lineIdx === null || fileWordWrap) {
      bar.style.display = 'none';
      return;
    }
    const scrollTop = fileEditorRef.current?.scrollTop ?? 0;
    bar.style.display = 'block';
    bar.style.top = `${16 + lineIdx * 19.5 - scrollTop}px`;
  }, [fileWordWrap]);

  const jumpToFileMatch = useCallback((match: { start: number; end: number; line: number }, focusEditor = false) => {
    const lineHeight = 19.5;
    if (viewMode === 'diff') {
      const container = fileDiffScrollRef.current;
      const lineEl = container?.querySelector<HTMLElement>(`[data-diff-line="${match.line}"]`);
      lineEl?.scrollIntoView({ block: 'center' });
      return;
    }
    if (!fileEditorRef.current) return;
    if (focusEditor) {
      fileEditorRef.current.focus();
    }
    fileEditorRef.current.setSelectionRange(match.start, match.end);
    const visibleHeight = fileEditorRef.current.clientHeight || 300;
    const targetScroll = Math.max(0, match.line * lineHeight - visibleHeight / 3);
    fileEditorRef.current.scrollTop = targetScroll;
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = targetScroll;
    }
    syncFileHighlightBar(match.line);
  }, [viewMode, syncFileHighlightBar]);

  useEffect(() => {
    if (!fileSearchOpen || !activeFileMatch) {
      syncFileHighlightBar(null);
      return;
    }
    const searchingInInput = document.activeElement === fileSearchInputRef.current;
    jumpToFileMatch(activeFileMatch, !searchingInInput);
  }, [activeFileMatch, fileSearchOpen, jumpToFileMatch, syncFileHighlightBar]);

  const updateFileCursorPos = useCallback(() => {
    if (!fileEditorRef.current) return;
    const { selectionStart, value } = fileEditorRef.current;
    const textBefore = value.substring(0, selectionStart);
    const lines = textBefore.split('\n');
    setFileCursorPos({
      line: lines.length,
      col: (lines[lines.length - 1]?.length ?? 0) + 1,
    });
  }, []);

  const configValidation = useMemo(() => {
    if (!activeTab) return { valid: true };
    return validateConfigSyntax(activeTab.name, activeTab.content);
  }, [activeTab]);

  useEffect(() => {
    if (!activeTab || activeTab.loading) return;
    requestAnimationFrame(() => {
      fileEditorRef.current?.scrollTo({ top: 0, left: 0 });
      fileDiffScrollRef.current?.scrollTo({ top: 0, left: 0 });
    });
  }, [activeTab?.id, activeTab?.loading]);

  const requestCloseTab = useCallback((tab: OpenedFileTab) => {
    if (tab.content !== tab.originalContent) {
      setConfirmCloseTabId(tab.id);
      return;
    }
    onCloseTab(tab.id);
  }, [onCloseTab]);

  // Scoped Ctrl+F, Ctrl+S, and modal Escape handling (same scoping discipline as Notepad)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeTab) return;
      const insideEditor = !!rootRef.current?.contains(document.activeElement);
      if (pinned && !insideEditor) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setFileSearchOpen(true);
        setTimeout(() => fileSearchInputRef.current?.focus(), 50);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void onSaveTab(activeTab.id);
        return;
      }
      if (e.key === 'Escape') {
        if (confirmCloseTabId) {
          e.preventDefault();
          setConfirmCloseTabId(null);
          return;
        }
        if (fileSearchOpen) {
          e.preventDefault();
          setFileSearchOpen(false);
          return;
        }
        if (!pinned) {
          e.preventDefault();
          onHidePanel();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, pinned, confirmCloseTabId, fileSearchOpen, onSaveTab, onHidePanel]);

  if (!activeTab) return null;

  const fileDirty = activeTab.content !== activeTab.originalContent;
  const relPath = activeTab.rootPath ? getRelativePath(activeTab.path, activeTab.rootPath) : '';
  const fileHasChanges =
    !activeTab.sshConnection &&
    (viewMode === 'diff' || !!activeTab.gitDiffContent || gitStatusList.some((g) => g.path === relPath));

  const outerClass = pinned
    ? 'flex h-full shrink-0 min-w-0'
    : 'fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-8';
  const outerStyle = pinned && width ? { width: `${width}px` } : undefined;

  return (
    <div
      ref={rootRef}
      style={outerStyle}
      data-file-editor-panel
      data-file-editor-pinned={pinned ? 'true' : 'false'}
      className={outerClass}
      onClick={(e) => {
        if (!pinned && e.target === e.currentTarget) {
          onHidePanel();
        }
      }}
    >
      <div
        className={
          pinned
            ? 'flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border border-cyber-line/60 bg-cyber-panel'
            : 'flex h-[92vh] w-[95vw] max-w-7xl flex-col overflow-hidden rounded-xl border border-cyber-line bg-cyber-panel shadow-2xl'
        }
      >
        {/* Top Header Bar */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-cyber-line bg-cyber-base/60 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <FileIcon />
            <span className="truncate font-mono text-xs font-semibold text-slate-200" title={activeTab.path}>
              {activeTab.name}
            </span>
            {!pinned && (
              <span className="hidden lg:inline truncate text-[11px] font-mono text-slate-500 max-w-[320px]" title={activeTab.path}>
                ({activeTab.path})
              </span>
            )}
            {activeTab.sshConnection && (
              <span className="rounded bg-cyber-electric/15 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-cyber-electric border border-cyber-electric/30">
                SSH: {activeTab.sshConnection.host}
              </span>
            )}
            {fileDirty && (
              <span className="rounded bg-cyber-warn/20 px-1.5 py-0.5 text-[10px] font-semibold text-cyber-warn border border-cyber-warn/30">
                {tr("Unsaved")}
              </span>
            )}
            {isConfigFile(activeTab.name) && (
              <>
                <span className="rounded bg-cyber-electric/15 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-cyber-electric border border-cyber-electric/30">
                  {activeTab.name.split('.').pop()?.toUpperCase()}
                </span>
                {configValidation.valid ? (
                  <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                    {tr("✓ Valid Syntax")}
                  </span>
                ) : (
                  <span
                    className="rounded bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/30 max-w-[200px] truncate"
                    title={configValidation.error}
                  >
                    ✗ {configValidation.error}
                  </span>
                )}
              </>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1.5 flex-wrap">
            {fileHasChanges && (
              <div className="flex items-center rounded border border-cyber-line/60 bg-cyber-base p-0.5 mr-0.5">
                <button
                  type="button"
                  onClick={() => onChangeTabViewMode(activeTab.id, 'edit')}
                  className={`rounded px-2 py-0.5 text-[11px] font-medium transition ${
                    viewMode === 'edit' ? 'bg-cyber-electric/20 text-cyber-electric font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tr("Edit")}
                </button>
                <button
                  type="button"
                  onClick={() => onChangeTabViewMode(activeTab.id, 'diff')}
                  className={`rounded px-2 py-0.5 text-[11px] font-medium transition flex items-center gap-1 ${
                    viewMode === 'diff' ? 'bg-cyber-warn/20 text-cyber-warn font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{tr("Diff")}</span>
                </button>
              </div>
            )}

            {formatFeedback && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border transition ${
                  formatFeedback.isError
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {trFeedback(formatFeedback.text ?? '')}
              </span>
            )}

            {viewMode === 'edit' && (
              <>
                <button
                  type="button"
                  onClick={() => setFileWordWrap((w) => !w)}
                  title={tr("Toggle word wrapping")}
                  className={`rounded border px-2 py-1 text-[11px] font-mono transition ${
                    fileWordWrap
                      ? 'border-cyber-neon/60 bg-cyber-neon/15 text-cyber-neon'
                      : 'border-cyber-line/60 text-slate-400 hover:border-cyber-line hover:text-slate-200'
                  }`}
                >
                  {fileWordWrap ? tr("↩ Wrap: On") : tr("➡ Wrap: Off")}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const res = formatConfigContent(activeTab.name, activeTab.content);
                    if (res.error) {
                      setFormatFeedback({ text: res.error, isError: true });
                    } else if (res.changed) {
                      onChangeTabContent(activeTab.id, res.formatted);
                      setFormatFeedback({ text: 'Formatted' });
                    } else {
                      setFormatFeedback({ text: 'Clean' });
                    }
                    setTimeout(() => setFormatFeedback(null), 2500);
                  }}
                  disabled={activeTab.loading}
                  title={tr("Format & clean indentation")}
                  className="rounded border border-cyber-electric/40 bg-cyber-electric/10 px-2 py-1 text-[11px] font-mono font-semibold text-cyber-electric hover:bg-cyber-electric/20 transition disabled:opacity-40 flex items-center gap-1"
                >
                  <span>{tr("⚡ Format")}</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setFileSearchOpen((v) => {
                  const next = !v;
                  if (next) {
                    setTimeout(() => fileSearchInputRef.current?.focus(), 50);
                  }
                  return next;
                });
              }}
              title={tr("Search in file (Ctrl+F)")}
              className={`rounded border px-2 py-1 text-[11px] font-mono transition flex items-center gap-1 ${
                fileSearchOpen
                  ? 'border-cyber-electric bg-cyber-electric/15 text-cyber-electric font-semibold'
                  : 'border-cyber-line/60 text-slate-400 hover:border-cyber-line hover:text-slate-200'
              }`}
            >
              <span>🔍</span>
              <span>{tr("Find")}</span>
            </button>

            {viewMode === 'edit' && fileDirty && (
              <button
                type="button"
                onClick={() => onChangeTabContent(activeTab.id, activeTab.originalContent)}
                title={tr("Revert changes")}
                className="rounded border border-cyber-warn/50 px-2 py-1 text-xs font-medium text-cyber-warn hover:bg-cyber-warn/10 transition"
              >
                {tr("Revert")}
              </button>
            )}

            {viewMode === 'edit' && (
              <>
                <button
                  type="button"
                  onClick={() => void onSaveTab(activeTab.id)}
                  disabled={activeTab.saving || !fileDirty}
                  title={tr("Save file (Ctrl+S)")}
                  className="rounded border border-cyber-neon/70 bg-cyber-neon/10 px-2.5 py-1 text-xs font-medium text-cyber-neon hover:bg-cyber-neon/20 disabled:opacity-40 transition"
                >
                  {activeTab.saving ? tr("Saving...") : tr("Save")}
                </button>
                {activeSessionId && onSendInput && (
                  <button
                    type="button"
                    onClick={async () => {
                      const ok = await onSaveTab(activeTab.id);
                      if (ok || !fileDirty) {
                        onSendInput(activeSessionId, '\x03');
                      }
                    }}
                    disabled={activeTab.saving}
                    title={tr("Save file and send restart signal (Ctrl+C) to active CLI session")}
                    className="rounded border border-amber-500/50 bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase text-amber-400 transition hover:bg-amber-500/20 disabled:opacity-30 font-mono"
                  >
                    {tr("Save & Restart")}
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              onClick={onTogglePin}
              data-file-editor-pin-toggle
              aria-pressed={pinned}
              title={pinned ? tr("Unpin to popup") : tr("Pin beside terminal")}
              className={`rounded border px-2 py-1 text-xs transition flex items-center gap-1 font-semibold ${
                pinned
                  ? 'border-cyber-neon/60 bg-cyber-neon/15 text-cyber-neon'
                  : 'border-cyber-line text-slate-400 hover:border-cyber-neon/40 hover:text-slate-200'
              }`}
            >
              <span aria-hidden="true">📌</span>
              <span>{pinned ? tr("Pinned") : tr("Pin")}</span>
            </button>

            <button
              type="button"
              onClick={onHidePanel}
              data-file-editor-close
              title={tr("Close")}
              className="rounded border border-cyber-line px-2.5 py-1 text-xs text-slate-400 transition hover:text-slate-200 hover:border-cyber-line/80"
            >
              {pinned ? '✕' : 'Esc'}
            </button>
          </div>
        </div>

        {/* Multi-file Tab Strip */}
        <div
          data-file-editor-tabs
          role="tablist"
          className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-cyber-line/60 bg-cyber-base/40 px-3 pt-1.5 scrollbar-thin select-none"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab.id;
            const dirty = tab.content !== tab.originalContent;
            return (
              <div
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                data-file-editor-tab={tab.id}
                data-file-editor-tab-path={tab.path}
                onClick={() => onSelectTab(tab.id)}
                onAuxClick={(e) => {
                  if (e.button === 1) {
                    e.preventDefault();
                    requestCloseTab(tab);
                  }
                }}
                title={tab.path}
                className={`group flex shrink-0 items-center gap-1.5 rounded-t-lg border border-b-0 px-3 py-1.5 text-xs font-mono cursor-pointer transition ${
                  isActive
                    ? 'border-cyber-neon/60 bg-[#0a0f1f] text-cyber-neon font-semibold'
                    : 'border-cyber-line/40 bg-cyber-panel/40 text-slate-400 hover:text-slate-200 hover:bg-cyber-panel/70'
                }`}
              >
                {dirty && (
                  <span
                    data-file-editor-tab-dirty
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyber-warn"
                    title={tr("Unsaved")}
                  />
                )}
                <span className="max-w-[180px] truncate">{tabDisplayLabel(tab)}</span>
                <button
                  type="button"
                  data-file-editor-tab-close={tab.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    requestCloseTab(tab);
                  }}
                  title={tr("Close tab")}
                  className="ml-0.5 rounded px-1 text-[11px] text-slate-500 hover:bg-rose-500/20 hover:text-rose-300 transition"
                >
                  ×
                </button>
              </div>
            );
          })}

          {tabs.length > 1 && (
            <button
              type="button"
              data-file-editor-close-all
              onClick={onCloseAllCleanTabs}
              title={tr("Close all saved tabs")}
              className="mb-1 ml-auto shrink-0 rounded border border-cyber-line/50 px-2 py-0.5 text-[10px] font-mono text-slate-400 hover:border-rose-500/50 hover:text-rose-300 transition"
            >
              {tr("Close saved")}
            </button>
          )}
        </div>

        {/* Collapsible Find Bar */}
        {fileSearchOpen && (
          <div className="flex shrink-0 items-center justify-between border-b border-cyber-line/50 bg-[#070b17] px-4 py-1.5">
            <div className="flex items-center gap-2 flex-1 max-w-xl">
              <span className="text-slate-400 text-xs">🔍</span>
              <input
                ref={fileSearchInputRef}
                type="text"
                data-file-search
                data-file-search-input
                value={fileSearchQuery}
                onCompositionStart={() => {
                  fileSearchComposingRef.current = true;
                }}
                onCompositionEnd={(e) => {
                  fileSearchComposingRef.current = false;
                  const val = e.currentTarget.value;
                  setFileSearchQuery(val);
                  setDebouncedFileSearchQuery(val);
                  setFileMatchIdx(0);
                }}
                onChange={(e) => {
                  setFileSearchQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.nativeEvent.isComposing || fileSearchComposingRef.current) return;
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (fileSearchQuery !== debouncedFileSearchQuery) {
                      setDebouncedFileSearchQuery(fileSearchQuery);
                      setFileMatchIdx(0);
                      return;
                    }
                    if (fileMatches.length > 0) {
                      const nextIdx = e.shiftKey
                        ? (fileMatchIdx - 1 + fileMatches.length) % fileMatches.length
                        : (fileMatchIdx + 1) % fileMatches.length;
                      setFileMatchIdx(nextIdx);
                      jumpToFileMatch(fileMatches[nextIdx], false);
                    }
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    setFileSearchOpen(false);
                    fileEditorRef.current?.focus();
                  }
                }}
                placeholder={tr("Find in file... (Enter = next, Shift+Enter = prev, Esc = close)")}
                className="w-full rounded border border-cyber-line bg-cyber-base/80 px-2.5 py-1 text-xs text-slate-100 outline-none focus:border-cyber-electric font-mono"
              />
              <span data-file-search-count className="font-mono text-xs text-slate-400 shrink-0 min-w-[60px] text-center">
                {!fileSearchQuery.trim()
                  ? '0 / 0'
                  : fileSearchQuery !== debouncedFileSearchQuery
                    ? '…'
                    : fileMatches.length > 0
                      ? `${(fileMatchIdx % fileMatches.length) + 1} / ${fileMatches.length}`
                      : tr("No matches")}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={fileMatches.length === 0}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (fileMatches.length === 0) return;
                    const prev = (fileMatchIdx - 1 + fileMatches.length) % fileMatches.length;
                    setFileMatchIdx(prev);
                    jumpToFileMatch(fileMatches[prev], document.activeElement !== fileSearchInputRef.current);
                  }}
                  title={tr("Previous match (Shift+Enter)")}
                  className="rounded border border-cyber-line bg-cyber-base/40 px-1.5 py-0.5 text-xs text-slate-300 hover:bg-cyber-base disabled:opacity-30 transition"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={fileMatches.length === 0}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (fileMatches.length === 0) return;
                    const next = (fileMatchIdx + 1) % fileMatches.length;
                    setFileMatchIdx(next);
                    jumpToFileMatch(fileMatches[next], document.activeElement !== fileSearchInputRef.current);
                  }}
                  title={tr("Next match (Enter)")}
                  className="rounded border border-cyber-line bg-cyber-base/40 px-1.5 py-0.5 text-xs text-slate-300 hover:bg-cyber-base disabled:opacity-30 transition"
                >
                  ▼
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setFileSearchOpen(false);
                setFileSearchQuery('');
                setDebouncedFileSearchQuery('');
              }}
              className="text-slate-400 hover:text-slate-200 text-xs px-2 py-0.5 font-mono"
            >
              ✕
            </button>
          </div>
        )}

        {/* Editor Body */}
        <div className="relative min-h-0 flex-1 overflow-hidden bg-[#0a0f1f]">
          {activeTab.loading && viewMode !== 'diff' ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-500 italic">
              {tr("Loading file content…")}
            </div>
          ) : viewMode === 'diff' ? (
            activeTab.diffLoading ? (
              <div className="flex h-full items-center justify-center text-xs text-slate-500 italic">
                {tr("Loading diff…")}
              </div>
            ) : (
              <div
                key={`diff-${activeTab.id}`}
                ref={fileDiffScrollRef}
                className="h-full min-h-0 w-full overflow-auto bg-cyber-base/80 p-4 pb-10 font-mono text-xs leading-relaxed text-slate-300 scrollbar-thin select-text"
              >
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
                    const isActiveMatchLine = fileSearchOpen && activeFileMatch?.line === idx;
                    const isMatchLine = fileSearchOpen && fileMatchLines.has(idx);
                    return (
                      <div
                        key={idx}
                        data-diff-line={idx}
                        className={`${lineClass} whitespace-pre-wrap min-h-[20px] ${
                          isActiveMatchLine ? 'ring-1 ring-cyber-electric bg-cyber-electric/20' : isMatchLine ? 'bg-cyber-neon/10' : ''
                        }`}
                      >
                        {line}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-slate-500 italic p-2">{tr("No differences found.")}</div>
                )}
              </div>
            )
          ) : activeTab.loadError ? (
            <div className="p-6 text-xs text-cyber-warn leading-relaxed">
              <p className="font-semibold mb-2 text-sm">{tr("Cannot display this file")}</p>
              <p className="text-slate-400 break-words font-mono bg-black/30 p-3 rounded border border-cyber-line/20">
                {trFeedback(activeTab.loadError)}
              </p>
            </div>
          ) : (
            <div className="flex h-full w-full min-h-0 overflow-hidden bg-cyber-base/80 font-mono text-[13px] leading-relaxed">
              {/* Line Numbers Column */}
              <div
                ref={lineNumbersRef}
                className="shrink-0 select-none overflow-hidden bg-black/40 px-2.5 py-4 text-right text-[11px] font-mono text-slate-600 border-r border-cyber-line/20"
                style={{ minWidth: '40px' }}
              >
                {fileContent.split('\n').map((_, idx) => {
                  const isActiveMatchLine = fileSearchOpen && activeFileMatch?.line === idx;
                  const isMatchLine = fileSearchOpen && fileMatchLines.has(idx);
                  return (
                    <div
                      key={idx}
                      className={`h-[19.5px] ${
                        isActiveMatchLine
                          ? 'text-cyber-electric font-bold bg-cyber-electric/20 rounded px-1 -mx-1'
                          : isMatchLine
                            ? 'text-cyber-neon font-semibold'
                            : ''
                      }`}
                    >
                      {idx + 1}
                    </div>
                  );
                })}
              </div>

              {/* Textarea + Active Search Line Band */}
              <div className="relative flex h-full min-h-0 flex-1 overflow-hidden">
                <div
                  ref={fileHighlightBarRef}
                  aria-hidden="true"
                  style={{ display: 'none', top: 0, height: '19.5px' }}
                  className="pointer-events-none absolute inset-x-0 bg-cyber-electric/15 border-y border-cyber-electric/45"
                />
                <textarea
                  key={`editor-${activeTab.id}`}
                  ref={fileEditorRef}
                  value={fileContent}
                  onChange={(e) => onChangeTabContent(activeTab.id, e.target.value)}
                  onClick={updateFileCursorPos}
                  onKeyUp={updateFileCursorPos}
                  onSelect={updateFileCursorPos}
                  wrap={fileWordWrap ? 'soft' : 'off'}
                  onScroll={(e) => {
                    if (lineNumbersRef.current) {
                      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
                    }
                    if (fileSearchOpen && activeFileMatch) {
                      syncFileHighlightBar(activeFileMatch.line);
                    }
                  }}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                      e.preventDefault();
                      e.stopPropagation();
                      void onSaveTab(activeTab.id);
                      return;
                    }
                    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
                      e.preventDefault();
                      e.stopPropagation();
                      setFileSearchOpen(true);
                      setTimeout(() => fileSearchInputRef.current?.focus(), 50);
                      return;
                    }
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const { selectionStart, selectionEnd } = e.currentTarget;
                      if (e.shiftKey) {
                        const textBefore = fileContent.substring(0, selectionStart);
                        const lineStart = textBefore.lastIndexOf('\n') + 1;
                        const linePrefix = fileContent.substring(lineStart, lineStart + 2);
                        const spacesToRemove = linePrefix.startsWith('  ') ? 2 : linePrefix.startsWith(' ') ? 1 : 0;
                        if (spacesToRemove > 0) {
                          const newVal = fileContent.substring(0, lineStart) + fileContent.substring(lineStart + spacesToRemove);
                          onChangeTabContent(activeTab.id, newVal);
                          requestAnimationFrame(() => {
                            if (!fileEditorRef.current) return;
                            fileEditorRef.current.selectionStart = Math.max(lineStart, selectionStart - spacesToRemove);
                            fileEditorRef.current.selectionEnd = Math.max(lineStart, selectionEnd - spacesToRemove);
                            updateFileCursorPos();
                          });
                        }
                      } else {
                        const newVal =
                          fileContent.substring(0, selectionStart) +
                          '  ' +
                          fileContent.substring(selectionEnd);
                        onChangeTabContent(activeTab.id, newVal);
                        requestAnimationFrame(() => {
                          if (!fileEditorRef.current) return;
                          fileEditorRef.current.selectionStart = selectionStart + 2;
                          fileEditorRef.current.selectionEnd = selectionStart + 2;
                          updateFileCursorPos();
                        });
                      }
                    }
                  }}
                  spellCheck={false}
                  className={`relative z-10 h-full min-h-0 flex-1 resize-none bg-transparent p-4 pb-10 font-mono text-[13px] leading-[19.5px] text-slate-200 outline-none placeholder-slate-600 scrollbar-thin selection:bg-cyber-neon/30 ${
                    fileWordWrap ? 'whitespace-pre-wrap overflow-y-auto' : 'whitespace-pre overflow-auto'
                  }`}
                  style={{ caretColor: 'var(--color-cyber-neon, #39ff14)' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Status Bar Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-cyber-line/30 bg-[#060a15] px-4 py-1 text-[10px] font-mono text-slate-500 select-none">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Ln {fileCursorPos.line}, Col {fileCursorPos.col}</span>
            <span>·</span>
            <span>{fileContent.split('\n').length} {tr("lines")}</span>
            <span>·</span>
            <span>{fileContent.length} {tr("chars")}</span>
            <span className="text-cyan-500">· {tabs.length}{tr(" tabs")}</span>
            {fileMatches.length > 0 && fileSearchQuery.trim() && (
              <span className="text-cyber-electric font-semibold">
                · {fileMatches.length} {tr("matches")}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span>{activeTab.name.split('.').pop()?.toUpperCase() || 'TXT'}</span>
            <span>·</span>
            <span>UTF-8</span>
          </div>
        </div>
      </div>

      {/* Dirty Tab Close Confirmation Modal */}
      {pendingCloseTab && (
        <div
          data-file-editor-confirm-modal
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmCloseTabId(null);
          }}
        >
          <div className="w-[420px] max-w-[90vw] rounded-xl border border-cyber-warn/40 bg-cyber-panel p-5 shadow-2xl">
            <h3 className="font-display text-sm uppercase tracking-wider text-cyber-warn font-bold">
              {tr("Unsaved changes")}
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-300">
              {tr("Save changes to \"{name}\" before closing?", { name: pendingCloseTab.name })}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                data-file-editor-confirm-cancel
                onClick={() => setConfirmCloseTabId(null)}
                disabled={pendingCloseTab.saving}
                className="rounded border border-cyber-line px-3 py-1.5 text-xs text-slate-300 disabled:opacity-50 transition"
              >
                {tr("Cancel")}
              </button>
              <button
                type="button"
                data-file-editor-confirm-discard
                onClick={() => {
                  onCloseTab(pendingCloseTab.id);
                  setConfirmCloseTabId(null);
                }}
                disabled={pendingCloseTab.saving}
                className="rounded border border-rose-500/60 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/20 disabled:opacity-50 transition font-semibold"
              >
                {tr("Discard")}
              </button>
              <button
                type="button"
                data-file-editor-confirm-save
                onClick={async () => {
                  const ok = await onSaveTab(pendingCloseTab.id);
                  if (ok) {
                    onCloseTab(pendingCloseTab.id);
                    setConfirmCloseTabId(null);
                  }
                }}
                disabled={pendingCloseTab.saving}
                className="rounded border border-cyber-neon/70 bg-cyber-neon/15 px-3 py-1.5 text-xs text-cyber-neon hover:bg-cyber-neon/25 disabled:opacity-50 transition font-bold"
              >
                {pendingCloseTab.saving ? tr("Saving...") : tr("Save & Close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
