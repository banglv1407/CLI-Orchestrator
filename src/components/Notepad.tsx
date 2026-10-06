import { tFeedback as trFeedback, t as tr, useLocale } from '../i18n';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getNotepad, saveNotepad } from '../lib/tauri';
import type { NotepadState, NotepadTab } from '../types';

type LangDef = { id: string; label: string; regexes: RegExp[] };

const LANGS: LangDef[] = [
  {
    id: 'json', label: 'JSON', regexes: [
      /"[^"]*"\s*:/g, /\btrue\b|\bfalse\b|\bnull\b/g, /\b\d+\.?\d*\b/g,
    ],
  },
  {
    id: 'python', label: 'Python', regexes: [
      /\bdef\s+\w+/g, /\bclass\s+\w+/g,
      /\bimport\s|\bfrom\s/g,
      /\breturn\b|\bif\b|\belif\b|\belse\b|\bfor\b|\bwhile\b|\btry\b|\bexcept\b|\braise\b/g,
      /\bTrue\b|\bFalse\b|\bNone\b|\bself\b|\bwith\b|\bas\b/g,
      /#.*$/gm, /"[^"]*"/g, /'[^']*'/g,
    ],
  },
  {
    id: 'sql', label: 'PostgreSQL', regexes: [
      /\bSELECT\b|\bFROM\b|\bWHERE\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bCREATE\b|\bALTER\b|\bDROP\b/g,
      /\bJOIN\b|\bLEFT\b|\bRIGHT\b|\bINNER\b|\bOUTER\b|\bON\b/g,
      /\bAND\b|\bOR\b|\bNOT\b|\bIN\b|\bLIKE\b|\bBETWEEN\b|\bIS\b|\bNULL\b/g,
      /\bORDER\b|\bBY\b|\bGROUP\b|\bHAVING\b|\bLIMIT\b|\bOFFSET\b|\bAS\b/g,
      /\bBEGIN\b|\bCOMMIT\b|\bROLLBACK\b|\bTRANSACTION\b/g,
      /--.*$/gm, /'[^']*'/g,
      /\bINT\b|\bINTEGER\b|\bVARCHAR\b|\bTEXT\b|\bBOOLEAN\b|\bTIMESTAMP\b|\bSERIAL\b|\bPRIMARY\b|\bKEY\b|\bREFERENCES\b/g,
      /\bCOUNT\b|\bSUM\b|\bAVG\b|\bMAX\b|\bMIN\b/g,
    ],
  },
  {
    id: 'markdown', label: 'Markdown', regexes: [
      /^#{1,6}\s.*$/gm, /(\*\*|__).*?(\*\*|__)/g,
      /\[.*?\]\(.*?\)/g, /^-\s/gm,
      /`[^`]+`/g,
    ],
  },
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
    /^    /m, /\breturn\b/, /\braise\b/, /\bself\b/,
  ].filter((pattern) => pattern.test(trimmed)).length;
  return pythonScore >= 2 ? 'python' : 'markdown';
}

function prettyFormat(text: string, language: string): string {
  if (language === 'json') {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  }
  if (language !== 'sql') return text;

  const major = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY',
    'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE',
    'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
    'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
    'ON', 'BEGIN', 'COMMIT', 'ROLLBACK',
  ];
  let result = text.replace(
    /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AND|OR|NOT|IN|LIKE|BETWEEN|IS|NULL|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|AS|SET|INTO|VALUES|TABLE|BEGIN|COMMIT|ROLLBACK|TRANSACTION|EXISTS|CASE|WHEN|THEN|ELSE|END|CAST|COALESCE|NULLIF|DISTINCT|ALL|UNION|INTERSECT|EXCEPT)\b/gi,
    (match) => match.toUpperCase(),
  );
  for (const keyword of major) {
    result = result.replace(
      new RegExp(`\\b${keyword}\\b`, 'gi'),
      `\n${keyword.toUpperCase()}`,
    );
  }
  return result.trimStart();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function highlight(code: string, language: string): string {
  const definition = LANGS.find((candidate) => candidate.id === language);
  if (!definition) return escapeHtml(code);
  let html = escapeHtml(code);
  for (const regex of definition.regexes) {
    html = html.replace(regex, (match) => {
      const source = regex.source;
      if (source.startsWith('#') || source.startsWith('--')) {
        return `<span class="sl-comment">${match}</span>`;
      }
      if (source.includes('"[^"]') || source.includes("'[^']")) {
        return `<span class="sl-string">${match}</span>`;
      }
      if (source.includes('\\d')) {
        return `<span class="sl-number">${match}</span>`;
      }
      if (source.startsWith('^#')) {
        return `<span class="sl-heading">${match}</span>`;
      }
      return `<span class="sl-keyword">${match}</span>`;
    });
  }
  return html;
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

type Props = { onClose?: () => void };

export function Notepad({ onClose }: Props) {
  const locale = useLocale();
  const [state, setState] = useState<NotepadState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [confirmCloseId, setConfirmCloseId] = useState<string | null>(null);
  const [savingClose, setSavingClose] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const savedSnapshotRef = useRef('');
  const latestStateRef = useRef<NotepadState | null>(null);
  const renameCancelledRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

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
  const renderedHtml = useMemo(() => (
    activeTab ? highlight(activeTab.text, activeTab.language) : ''
  ), [activeTab]);

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

  const syncScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
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
    }
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      setShowPreview((current) => !current);
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      void requestClose();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <span className="text-sm text-slate-400">{tr("Loading notepad...")}</span>
      </div>
    );
  }

  if (!state || !activeTab) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
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
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-10"
      onClick={(event) => {
        if (event.target === event.currentTarget) void requestClose();
      }}
    >
      <div className="flex h-[92vh] w-[95vw] max-w-7xl flex-col overflow-hidden rounded-xl border border-cyber-line/50 bg-cyber-panel shadow-2xl">
        <div className="flex items-center justify-between border-b border-cyber-line/40 bg-cyber-base/70 px-5 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <h2 className="font-display text-sm uppercase tracking-widest text-cyber-neon">{tr("Notepad")}</h2>
            <span className={`rounded-full px-2 py-0.5 text-xs ${
              saved ? 'bg-slate-500/10 text-slate-500' : 'bg-yellow-500/10 text-yellow-400'
            }`}>
              {savingClose ? tr("Saving…") : saved ? tr("Saved") : tr("Unsaved")}
            </span>
            {error && <span className="max-w-[260px] truncate text-xs text-red-400" title={trFeedback(error ?? '')}>{trFeedback(error ?? '')}</span>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
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
              className="rounded border border-cyber-line px-2 py-1 text-xs text-slate-400 transition hover:border-green-400/30 hover:text-green-400"
            >{tr("Pretty")}</button>
            <button
              type="button"
              onClick={() => setShowPreview((current) => !current)}
              className={`rounded border px-2 py-1 text-xs transition ${
                showPreview
                  ? 'border-cyber-neon/30 bg-cyber-neon/10 text-cyber-neon'
                  : 'border-cyber-line text-slate-400 hover:text-slate-200'
              }`}
            >
              {showPreview ? tr("Edit") : tr("Preview")}
            </button>
            <button
              type="button"
              onClick={() => void requestClose()}
              disabled={savingClose}
              className="px-3 py-1 text-xs text-slate-400 transition hover:text-slate-200 disabled:opacity-50"
            >
              Esc
            </button>
          </div>
        </div>

        <div role="tablist" aria-label={tr("Notepad tabs")} className="flex shrink-0 items-end gap-1 overflow-x-auto border-b border-cyber-line/40 bg-[#070b16] px-3 pt-2 scrollbar-thin">
          {state.tabs.map((tab) => {
            const isActive = tab.id === state.activeTabId;
            return (
              <div
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                className={`flex max-w-[220px] shrink-0 items-center rounded-t border border-b-0 ${
                  isActive
                    ? 'border-cyber-neon/50 bg-cyber-panel text-cyber-neon'
                    : 'border-cyber-line/40 bg-cyber-base/50 text-slate-400'
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
                    className="min-w-[70px] max-w-[170px] truncate px-2 py-1.5 text-left text-xs"
                  >
                    {tab.title}
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
            className="mb-1 shrink-0 rounded border border-cyber-line/50 px-2 py-1 text-xs text-slate-400 hover:border-cyber-neon/50 hover:text-cyber-neon"
          >
            +
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden font-mono text-sm leading-relaxed">
          {showPreview ? (
            <div
              key={`preview-${activeTab.id}`}
              className="h-full overflow-auto break-all whitespace-pre-wrap bg-black/20 p-5 text-slate-200 scrollbar-thin"
              dangerouslySetInnerHTML={{ __html: renderedHtml || escapeHtml(activeTab.text) }}
            />
          ) : (
            <div className="relative h-full min-h-0">
              <textarea
                key={`editor-${activeTab.id}`}
                ref={textareaRef}
                value={activeTab.text}
                onChange={(event) => updateActiveTab({ text: event.target.value })}
                onScroll={syncScroll}
                onKeyDown={onEditorKeyDown}
                className="absolute inset-0 h-full w-full resize-none overflow-auto border-none bg-transparent p-5 leading-relaxed outline-none scrollbar-thin"
                style={{ color: 'transparent', caretColor: '#00ffcc' }}
                spellCheck={false}
                placeholder={tr("Start typing...")}
              />
              <div
                key={`highlight-${activeTab.id}`}
                ref={highlightRef}
                className="pointer-events-none absolute inset-0 overflow-hidden break-all whitespace-pre-wrap p-5 leading-relaxed text-slate-200"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: renderedHtml || escapeHtml(activeTab.text) }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-cyber-line/40 bg-cyber-base/50 px-4 py-1.5 text-[10px] text-slate-500">
          <span>
            {activeTab.language.toUpperCase()} · {lineCount}{tr(" lines · ")}{activeTab.text.length}{tr(" chars")}<span className="ml-2 text-cyan-500">{state.tabs.length}{tr(" tabs")}</span>
          </span>
          <span>{tr("Double-click tab to rename · Ctrl+Enter Preview · Tab Indent · Esc Close")}</span>
        </div>
      </div>

      {pendingCloseTab && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70">
          <div className="w-[420px] max-w-[90vw] rounded-xl border border-rose-500/40 bg-cyber-panel p-5 shadow-2xl">
            <h3 className="font-display text-sm uppercase tracking-wider text-rose-300">{tr("Close note tab?")}</h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-300">
              “{pendingCloseTab.title}{tr("” contains content. Closing it permanently removes that tab from Notepad.")}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmCloseId(null)}
                disabled={savingClose}
                className="rounded border border-cyber-line px-3 py-1.5 text-xs text-slate-300 disabled:opacity-50"
              >{tr("Cancel")}</button>
              <button
                type="button"
                onClick={() => void closeTab(pendingCloseTab.id, true)}
                disabled={savingClose}
                className="rounded border border-rose-500/60 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 disabled:opacity-50"
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
