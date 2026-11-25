import { tFeedback as trFeedback, t as tr, useLocale } from '../i18n';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { confirm, showMessage } from '../lib/dialogs';
import { CliEditorModal } from '../components/CliEditorModal';
import { CliStartModal } from '../components/CliStartModal';
import { CliSidebar } from '../components/CliSidebar';
import { TerminalPanel } from '../components/TerminalPanel';
import { SshConnectionModal } from '../components/SshConnectionModal';
import { MythicalPet } from '../components/MythicalPet';
import { Notepad } from '../components/Notepad';
import { FileEditorPanel, type OpenedFileTab } from '../components/FileEditorPanel';
import { CommandPalette } from '../components/CommandPalette';
import {
  createTerminalSession,
  deleteCli,
  listClis,
  listProjectTags,
  listSessions,
  saveCliTag,
  sendCliInput,
  stopCli,
  upsertCli,
  loadSshConnections,
  saveSshConnections,
  createSshSession,
  createRdpSession,
  getGitDetail,
  getGitDiff,
  readFileContent,
  writeFileContent,
  readSshFileContent,
  writeSshFileContent,
  createDirectory,
  createFileContent,
} from '../lib/tauri';
import { zoomIn, zoomOut, resetZoom } from '../lib/appearance';
import { canLinkTerminal, readTerminalLinks, saveTerminalLinks, type TerminalLinks } from '../lib/terminalLinks';
import {
  NEW_TERMINAL_EVENT,
  CYCLE_TERMINAL_EVENT,
  cycleTerminalSessionId,
} from '../lib/terminalShortcuts';
import type {
  AssistantState,
  CliDefinition,
  CliSavedDirectory,
  CliStatusEvent,
  FileOpenOptions,
  GitRepoDetail,
  GitStatusEntry,
  SessionInfo,
  SshConnection,
} from '../types';

const DEFAULT_ASSISTANT_TEXT = 'Select a CLI and start an interactive session.';
type AppTheme = 'cyberpunk' | 'kawaii' | 'light';

export function Dashboard() {
  const locale = useLocale();
  const [clis, setClis] = useState<CliDefinition[]>([]);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [terminalLinks, setTerminalLinks] = useState<TerminalLinks>(readTerminalLinks);
  useEffect(() => { saveTerminalLinks(terminalLinks); }, [terminalLinks]);
  const handleLinkTerminal = useCallback((child: string, parent: string | null) => {
    setTerminalLinks(current => {
      if (parent && !canLinkTerminal(current, child, parent)) return current;
      const next = { ...current };
      if (parent) next[child] = parent;
      else delete next[child];
      return next;
    });
  }, []);
  const [pendingSessions, setPendingSessions] = useState<SessionInfo[]>([]);
  const [activeCli, setActiveCli] = useState(() => localStorage.getItem('ai-cli-last-cli') ?? '');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [assistantState, setAssistantState] = useState<AssistantState>('Idle');
  const [assistantText, setAssistantText] = useState(DEFAULT_ASSISTANT_TEXT);
  const [projectTag, setProjectTag] = useState(() => localStorage.getItem('ai-cli-last-project-tag') ?? '');
  const [workingDir, setWorkingDir] = useState(() => localStorage.getItem('ai-cli-last-working-dir') ?? '');

  const [cliEditorOpen, setCliEditorOpen] = useState(false);
  const [editingCli, setEditingCli] = useState<CliDefinition | null>(null);
  const [cliStartModalOpen, setCliStartModalOpen] = useState(false);
  const [cliToStart, setCliToStart] = useState<CliDefinition | null>(null);
  const [theme, setTheme] = useState<AppTheme>(() => {
    const stored = localStorage.getItem('ai-cli-theme');
    return (stored === 'kawaii' || stored === 'light') ? stored : 'cyberpunk';
  });
  const [globalProjectTags, setGlobalProjectTags] = useState<{ tag: string; path: string }[]>([]);
  
  const [sshConnections, setSshConnections] = useState<SshConnection[]>([]);
  const [sshModalOpen, setSshModalOpen] = useState(false);
  const [editingSsh, setEditingSsh] = useState<SshConnection | null>(null);
  const [activeMainView, setActiveMainView] = useState<'terminal' | 'quickapps' | 'buzz' | 'game' | 'apiclient' | 'proxy' | 'logs' | 'settings' | 'remote' | 'dashboard' | 'agent-sessions' | 'web'>('terminal');
  const [notepadPinned, setNotepadPinned] = useState<boolean>(() => localStorage.getItem('clx-notepad-pinned') === 'true');
  const [showNotepad, setShowNotepad] = useState<boolean>(() => (
    localStorage.getItem('clx-notepad-pinned') === 'true' && localStorage.getItem('clx-notepad-pinned-open') !== 'false'
  ));
  const [notepadWidth, setNotepadWidth] = useState<number>(() => {
    const saved = parseInt(localStorage.getItem('clx-notepad-width') || '420', 10);
    return Number.isNaN(saved) || saved < 280 || saved > 900 ? 420 : saved;
  });
  const [fileEditorPinned, setFileEditorPinned] = useState<boolean>(() => localStorage.getItem('clx-file-editor-pinned') === 'true');
  const [showFileEditor, setShowFileEditor] = useState<boolean>(false);
  const [fileEditorWidth, setFileEditorWidth] = useState<number>(() => {
    const saved = parseInt(localStorage.getItem('clx-file-editor-width') || '560', 10);
    return Number.isNaN(saved) || saved < 320 || saved > 1100 ? 560 : saved;
  });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [terminalShortcutOrigin, setTerminalShortcutOrigin] = useState<{ view: typeof activeMainView; focus: HTMLElement | null } | null>(null);
  const terminalShortcutReturnRafRef = useRef<number | null>(null);
  const sshGroups = useMemo(() => Array.from(new Set(sshConnections.map(connection => connection.group || 'Default'))), [sshConnections]);

  // ── Global right-click context menu ──
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    sessionId: string | null;
    workingDir: string | null;
    source?: 'main' | 'mini';
    panel?: 'right' | 'bottom';
  } | null>(null);

  // ── New File/Directory modal ──
  const [newFileModal, setNewFileModal] = useState<{
    open: boolean;
    type: 'file' | 'directory';
    basePath: string;
  } | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [newFileError, setNewFileError] = useState<string | null>(null);

  const [selectedText, setSelectedText] = useState('');
  const [rewriteModal, setRewriteModal] = useState<{
    open: boolean;
    type: 'rewrite' | 'suggest' | 'summarize' | 'title';
    originalText: string;
    resultText: string;
    loading: boolean;
    error: string | null;
  } | null>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent, sessionId: string | null, workingDir: string | null) => {
    e.preventDefault();
    const sel = window.getSelection()?.toString() || '';
    setSelectedText(sel);
    setContextMenu({ x: e.clientX, y: e.clientY, sessionId, workingDir });
  }, []);

  const handleOptimizeSelection = async (type: 'rewrite' | 'suggest' | 'summarize' | 'title') => {
    setTerminalShortcutOrigin(null);
    const text = selectedText.trim();
    setContextMenu(null);
    setRewriteModal({
      open: true,
      type,
      originalText: text,
      resultText: '',
      loading: true,
      error: null,
    });

    // Default configuration for cloud LLM
    const DEFAULT_LLM_CONFIG = {
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
      apiKey: '',
      headers: {
        'User-Agent': 'AI-CLI-Orchestrator'
      },
      systemPrompt: 'You are an intelligent terminal companion helping developers with their terminal commands and daily programming tasks. Keep your answers concise, practical and optimized.',
      stream: false
    };

    // Load cloud LLM config on-demand from localStorage
    let llmConfig = DEFAULT_LLM_CONFIG;
    const saved = localStorage.getItem('ai-cli-llm-config');
    if (saved) {
      try {
        llmConfig = JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }

    // Define task-specific system prompts for cloud LLM
    let systemPrompt = '';
    if (type === 'rewrite') {
      systemPrompt = 'You are an expert prompt engineer. Your task is to rewrite the user\'s prompt to make it clear, explicit, structured, and highly effective for LLMs. Improve grammar, clarify intent, and add necessary context if missing. Do NOT answer the prompt itself, just rewrite and optimize it. Output ONLY the optimized prompt content, nothing else (no headers, no markdown blocks, no conversational preamble).';
    } else if (type === 'suggest') {
      systemPrompt = 'You are an expert CLI command assistant. The user will provide a command or describe what they want to do. You must analyze it, fix any errors, or suggest the correct, optimized shell commands (like bash, powershell, git, docker, etc.). Output ONLY the suggested command or instruction directly. Do NOT write any explanations, comments, or markdown code block backticks. Just output the command itself.';
    } else if (type === 'summarize') {
      systemPrompt = 'Summarize the following terminal output, logs, or text in a concise and clear manner. Focus on errors, warnings, and key events. Keep it short. Output ONLY the summary.';
    } else if (type === 'title') {
      systemPrompt = 'Generate a very short, concise title (max 5 words) for the following text. Do not put quotes around the title. Output ONLY the title itself.';
    }
    try {
      // 1. Try AI Companion endpoint first (uses companion.json config from backend)
      const reply = await invoke<string>('send_companion_chat', {
        request: {
          systemPrompt: systemPrompt,
          messages: [{ role: 'user', content: text }],
        },
      });
      setRewriteModal(prev => prev ? { ...prev, resultText: reply.trim(), loading: false } : null);
    } catch (companionErr) {
      console.warn('Companion LLM failed, falling back to configured LLM:', companionErr);

      try {
        // 2. Fallback to localStorage llm config (send_llm_chat)
        const reply = await invoke<string>('send_llm_chat', {
          request: {
            baseUrl: llmConfig.baseUrl,
            model: llmConfig.model,
            apiKey: llmConfig.apiKey,
            headers: llmConfig.headers,
            systemPrompt: systemPrompt,
            messages: [{ role: 'user', content: text }],
            stream: false,
          },
        });
        setRewriteModal(prev => prev ? { ...prev, resultText: reply.trim(), loading: false } : null);
      } catch (cloudErr) {
        console.warn('Configured LLM failed, falling back to local LLM:', cloudErr);
      
        // 3. Local LLM Fallback
        try {
          const status = await invoke<any>('builtin_llm_status');
          if (!status.loaded) {
            await invoke('builtin_llm_load');
          }
          const reply = await invoke<string>('builtin_llm_generate', {
            prompt: text,
            task: type,
          });
          setRewriteModal(prev => prev ? { ...prev, resultText: `[Local Fallback] ${reply.trim()}`, loading: false } : null);
        } catch (localErr: any) {
          console.error('All LLM providers failed:', localErr);
          setRewriteModal(prev => prev ? { 
            ...prev, 
            error: `Companion Error: ${String(companionErr)}\nCloud LLM Error: ${String(cloudErr)}\nLocal LLM Fallback Error: ${String(localErr)}`, 
            loading: false 
          } : null);
        }
      }
    }
  };

  useEffect(() => {
    const handleGlobalClick = () => setContextMenu(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Listen for custom view switch events from sidebar
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvt = e as CustomEvent<string>;
      if (customEvt.detail) {
        const view = customEvt.detail;
        if (view === 'proxy' || view === 'remote' || view === 'logs') {
          setActiveMainView('settings');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('settings-select-section', { detail: view }));
          }, 50);
        } else {
          setActiveMainView(view as any);
        }
      }
    };
    window.addEventListener('switch-main-view', handler);
    return () => window.removeEventListener('switch-main-view', handler);
  }, []);

  // Listen for custom open-settings event
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvt = e as CustomEvent<string>;
      if (customEvt.detail) {
        setActiveMainView('settings');
        localStorage.setItem('ai-cli-settings-active-section', customEvt.detail);
        // Dispatch settings-select-section with a short delay to ensure SettingsPanel is mounted
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('settings-select-section', { detail: customEvt.detail }));
        }, 50);
      }
    };
    window.addEventListener('open-settings', handler);
    return () => window.removeEventListener('open-settings', handler);
  }, []);

  const handleNewFile = useCallback(() => {
    setTerminalShortcutOrigin(null);
    if (!contextMenu?.workingDir) return;
    setNewFileModal({ open: true, type: 'file', basePath: contextMenu.workingDir });
    setNewFileName('');
    setNewFileContent('');
    setNewFileError(null);
    setContextMenu(null);
  }, [contextMenu]);

  const handleNewDirectory = useCallback(() => {
    setTerminalShortcutOrigin(null);
    if (!contextMenu?.workingDir) return;
    setNewFileModal({ open: true, type: 'directory', basePath: contextMenu.workingDir });
    setNewFileName('');
    setNewFileContent('');
    setNewFileError(null);
    setContextMenu(null);
  }, [contextMenu]);

  const handleCreateFileOrDir = useCallback(async () => {
    if (!newFileModal || !newFileName.trim()) return;
    const name = newFileName.trim();
    const fullPath = newFileModal.basePath.replace(/[\\/]+$/, '') + '/' + name;

    try {
      if (newFileModal.type === 'directory') {
        await createDirectory(fullPath);
      } else {
        await createFileContent(fullPath, newFileContent);
      }
      setNewFileModal(null);
      setNewFileName('');
      setNewFileContent('');
      setAssistantState('Done');
      setAssistantText(`Created: ${name}`);
      setTimeout(() => setAssistantState('Idle'), 2500);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setNewFileError(msg);
    }
  }, [newFileModal, newFileName, newFileContent]);

  // Listen for API client history selection from sidebar
  useEffect(() => {
    const handler = (e: Event) => {
      setActiveMainView('apiclient');
    };
    window.addEventListener('apiclient-history-select', handler);
    return () => window.removeEventListener('apiclient-history-select', handler);
  }, []);

  // Command Palette keyboard shortcut (Ctrl+P)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setTerminalShortcutOrigin(null);
        setPaletteOpen((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setTerminalShortcutOrigin(null);
        setShowNotepad((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && (e.code === 'Space' || e.key === ' ' || e.key === 'Space')) {
        e.preventDefault();
        setActiveMainView('terminal');
        window.dispatchEvent(new CustomEvent('focus-active-terminal'));
      }
    };
    
    const customPaletteHandler = () => {
      setTerminalShortcutOrigin(null);
      setPaletteOpen((v) => !v);
    };

    window.addEventListener('keydown', handler);
    window.addEventListener('trigger-command-palette', customPaletteHandler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('trigger-command-palette', customPaletteHandler);
    };
  }, []);

  const [recentFolders, setRecentFolders] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('ai-cli-folder-history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addFolderToHistory = useCallback((path: string) => {
    if (!path) return;
    setRecentFolders((current) => {
      const cleaned = path.trim();
      const filtered = current.filter((p) => p !== cleaned);
      const next = [cleaned, ...filtered].slice(0, 10);
      localStorage.setItem('ai-cli-folder-history', JSON.stringify(next));
      return next;
    });
  }, []);

  const displaySessions = useMemo(
    () => [...pendingSessions, ...sessions],
    [pendingSessions, sessions],
  );

  const refreshSidebarData = useCallback(async () => {
    const [loadedClis, loadedSessions] = await Promise.all([listClis(), listSessions()]);
    setClis(loadedClis);
    setSessions((current) => {
      return loadedSessions.map((s) => {
        const existing = current.find((es) => es.id === s.id);
        if (existing?.panel) {
          return { ...s, panel: existing.panel };
        }
        // SSH & Quick shell sessions auto-dock to bottom
        const isSsh = s.cliName.startsWith('SSH: ');
        const isQuick = s.cliName === 'Quick - shell';
        return { ...s, panel: (isSsh || isQuick) ? 'bottom' : 'right' };
      });
    });

    if (loadedClis.length > 0) {
      const hasActiveCli = loadedClis.some((cli) => cli.name === activeCli);
      if (!hasActiveCli) {
        setActiveCli(loadedClis[0].name);
      }
    }
  }, [activeCli]);

  useEffect(() => {
    void refreshSidebarData();
  }, [refreshSidebarData]);

  const activeCliDefinition = useMemo(
    () => clis.find((cli) => cli.name === activeCli),
    [clis, activeCli],
  );

  const activeCliSavedDirectories = useMemo(
    () => activeCliDefinition?.savedDirectories ?? [],
    [activeCliDefinition],
  );

  useEffect(() => {
    const tags = globalProjectTags.map((t) => t.tag);
    const validSaved = activeCliSavedDirectories.filter((d) => tags.includes(d.tag));

    if (validSaved.length > 0) {
      const current = validSaved.find((d) => d.tag === projectTag);
      if (current) {
        setWorkingDir(current.path);
      } else {
        setProjectTag(validSaved[0].tag);
        setWorkingDir(validSaved[0].path);
      }
    } else {
      setProjectTag('');
      if (activeCliDefinition?.defaultWorkingDir) {
        setWorkingDir(activeCliDefinition.defaultWorkingDir);
      }
    }
  }, [activeCliDefinition, activeCliSavedDirectories, projectTag, globalProjectTags]);

  useEffect(() => {
    localStorage.setItem('ai-cli-last-cli', activeCli);
  }, [activeCli]);

  useEffect(() => {
    localStorage.setItem('ai-cli-last-project-tag', projectTag);
  }, [projectTag]);

  useEffect(() => {
    localStorage.setItem('ai-cli-last-working-dir', workingDir);
  }, [workingDir]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('ai-cli-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('clx-notepad-pinned', String(notepadPinned));
    if (notepadPinned) localStorage.setItem('clx-notepad-pinned-open', String(showNotepad));
  }, [notepadPinned, showNotepad]);

  useEffect(() => {
    localStorage.setItem('clx-file-editor-pinned', String(fileEditorPinned));
  }, [fileEditorPinned]);

  const startNotepadResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = notepadWidth;
    const onMove = (ev: MouseEvent) => {
      const next = Math.min(900, Math.max(280, Math.round(startWidth + (startX - ev.clientX))));
      setNotepadWidth(next);
      localStorage.setItem('clx-notepad-width', String(next));
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [notepadWidth]);

  const startFileEditorResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = fileEditorWidth;
    const onMove = (ev: MouseEvent) => {
      const next = Math.min(1100, Math.max(320, Math.round(startWidth + (startX - ev.clientX))));
      setFileEditorWidth(next);
      localStorage.setItem('clx-file-editor-width', String(next));
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [fileEditorWidth]);

  useEffect(() => {
    const handleZoomKeys = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      if (e.altKey) return;
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        zoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        resetZoom();
      }
    };
    window.addEventListener('keydown', handleZoomKeys);
    return () => window.removeEventListener('keydown', handleZoomKeys);
  }, []);

  useEffect(() => {
    let unlistenStatus: (() => void) | undefined;

    const setupListeners = async () => {
      unlistenStatus = await listen<CliStatusEvent>('cli-status', (event) => {
        const payload = event.payload;
        if (!payload.sessionId) {
          return;
        }
        const sessionId = payload.sessionId;

        setPendingSessions((current) => current.filter((item) => item.id !== payload.sessionId));
        void refreshSidebarData();

        if (payload.status === 'started') {
          setAssistantState('Running CLI');
          setAssistantText(`Session started for ${payload.cliName}`);
          setActiveSessionId(current => current ?? sessionId);
        } else if (payload.status === 'stopped' || payload.status === 'completed') {
          setAssistantState('Done');
          setAssistantText(`Session ${payload.cliName} exited cleanly.`);
          setActiveSessionId(current => current === payload.sessionId ? null : current);
        } else if (payload.status === 'error') {
          setAssistantState('Error');
          setAssistantText(`Session error on ${payload.cliName}: ${payload.message ?? 'Unknown'}`);
          setActiveSessionId(current => current === payload.sessionId ? null : current);
        }
      });
    };

    void setupListeners();
    return () => {
      if (unlistenStatus) unlistenStatus();
    };
  }, [refreshSidebarData]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await listProjectTags();
        setGlobalProjectTags(tags);
      } catch (e) {
        console.error('Failed to load project tags:', e);
      }
    };
    void loadTags();
  }, []);

  useEffect(() => {
    const loadSsh = async () => {
      try {
        const conns = await loadSshConnections();
        setSshConnections(conns);
      } catch (e) {
        console.error('Failed to load SSH connections:', e);
      }
    };
    void loadSsh();
  }, []);

  const handleSaveProjectTag = useCallback(
    async (cliName: string, tag: string, path: string) => {
      try {
        await saveCliTag(cliName, tag, path);
        const tags = await listProjectTags();
        setGlobalProjectTags(tags);
        setProjectTag(tag);
        setWorkingDir(path);
        void refreshSidebarData();
        setAssistantState('Done');
        setAssistantText(`Saved tag #${tag} at ${path}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setAssistantState('Error');
        setAssistantText(`Save tag failed: ${message}`);
      }
    },
    [refreshSidebarData],
  );

  const mergeCliIntoState = useCallback(
    (session: SessionInfo) => {
      setSessions((current) => {
        const index = current.findIndex((item) => item.id === session.id);
        const isSshOrQuick = session.cliName.startsWith('SSH: ') || session.cliName === 'Quick - shell';
        const defaultPanel = isSshOrQuick ? 'bottom' : 'right';
        const sessionWithPanel = {
          ...session,
          panel: session.panel || defaultPanel,
        };
        if (index >= 0) {
          const next = [...current];
          next[index] = sessionWithPanel;
          return next;
        }
        return [...current, sessionWithPanel];
      });
      setActiveSessionId(session.id);
    },
    [setSessions, setActiveSessionId],
  );

  // --- Multi-Tab File Editor States ---
  const [fileTabs, setFileTabs] = useState<OpenedFileTab[]>([]);
  const fileTabsRef = useRef<OpenedFileTab[]>([]);
  fileTabsRef.current = fileTabs;
  const [activeFileTabId, setActiveFileTabId] = useState<string | null>(null);
  const [gitStatusList, setGitStatusList] = useState<GitStatusEntry[]>([]);
  const [gitDetail, setGitDetail] = useState<GitRepoDetail | null>(null);

  const activeFileTab = useMemo(
    () => fileTabs.find((t) => t.id === activeFileTabId) ?? fileTabs[0] ?? null,
    [fileTabs, activeFileTabId],
  );
  const selectedFilePath = showFileEditor ? (activeFileTab?.path ?? null) : null;
  const hasUnpinnedFileEditor = showFileEditor && !fileEditorPinned && fileTabs.length > 0;

  const activeSession = useMemo(() => sessions.find((s) => s.id === activeSessionId), [sessions, activeSessionId]);
  const isSshSession = useMemo(() => !!activeSession?.cliName.startsWith('SSH: '), [activeSession]);
  const sshConnectionName = useMemo(() => isSshSession ? activeSession?.cliName.slice(5) : null, [isSshSession, activeSession]);
  const activeSshConnection = useMemo(() => sshConnections.find((c) => c.name === sshConnectionName), [sshConnections, sshConnectionName]);

  // Path helper
  const getRelativePath = useCallback((fullPath: string, root: string) => {
    let rel = fullPath.replace(root, '');
    rel = rel.replace(/^[/\\]+/, '');
    return rel.replace(/\\/g, '/');
  }, []);

  const buildFileTabId = useCallback((path: string, sshConn: SshConnection | null) => {
    const normalized = path.replace(/\\/g, '/');
    return `${sshConn ? `ssh:${sshConn.id}` : 'local'}:${normalized}`;
  }, []);

  // Fetch Git Detail + Status
  const refreshGitStatus = useCallback(async (repo: string) => {
    try {
      const detail = await getGitDetail(repo);
      setGitDetail(detail);
      setGitStatusList(detail.entries);
    } catch (e) {
      console.error('Failed to get git detail:', e);
    }
  }, []);

  const loadTabGitDiff = useCallback(async (
    tabId: string,
    fullPath: string,
    rootPath: string | null,
    sshConn: SshConnection | null,
    statusHint?: string,
  ) => {
    if (!rootPath || sshConn) return;
    const relPath = getRelativePath(fullPath, rootPath);
    const isUntracked = statusHint
      ? statusHint === 'untracked'
      : gitStatusList.find((g) => g.path === relPath)?.status === 'untracked';
    setFileTabs((prev) => prev.map((t) => (t.id === tabId ? { ...t, diffLoading: true } : t)));
    try {
      let diff = await getGitDiff(rootPath, relPath, isUntracked);
      if (!diff && isUntracked) {
        const raw = await readFileContent(fullPath).catch(() => '');
        if (raw) {
          const lines = raw.split('\n').map((l) => l.trimEnd());
          diff = `--- /dev/null\n+++ b/${relPath}\n@@ -0,0 +1,${lines.length} @@\n${lines.map((l) => `+${l}`).join('\n')}`;
        }
      }
      setFileTabs((prev) =>
        prev.map((t) =>
          t.id === tabId
            ? { ...t, gitDiffContent: diff || 'No changes or empty file.', diffLoading: false }
            : t,
        ),
      );
    } catch (e) {
      console.error('Failed to load git diff:', e);
      setFileTabs((prev) =>
        prev.map((t) =>
          t.id === tabId ? { ...t, gitDiffContent: 'Error loading diff.', diffLoading: false } : t,
        ),
      );
    }
  }, [getRelativePath, gitStatusList]);

  // Unified multi-tab file opener used by both Workspace Files and Git Detail
  const handleFileClick = useCallback(async (
    entry: { path: string; name: string },
    rootPath: string | null,
    options?: FileOpenOptions,
  ) => {
    setTerminalShortcutOrigin(null);
    const sshConn = isSshSession && activeSshConnection ? activeSshConnection : null;
    const tabId = buildFileTabId(entry.path, sshConn);
    const relPath = rootPath ? getRelativePath(entry.path, rootPath) : '';
    const gitItem = gitStatusList.find((g) => g.path === relPath);
    const resolvedGitStatus = options?.gitStatus ?? gitItem?.status;
    const isDeleted = !sshConn && resolvedGitStatus === 'deleted';
    const hasGitChanges = !sshConn && (!!gitItem || !!options?.preferDiff || !!resolvedGitStatus);

    const existing = fileTabsRef.current.find((t) => t.id === tabId);
    if (existing) {
      const nextMode: 'edit' | 'diff' | undefined =
        options?.preferDiff === true
          ? 'diff'
          : options?.preferDiff === false
            ? 'edit'
            : undefined;
      if (nextMode) {
        setFileTabs((prev) => prev.map((t) => (t.id === tabId ? { ...t, viewMode: nextMode } : t)));
        if (nextMode === 'diff' && rootPath && !sshConn) {
          void loadTabGitDiff(tabId, entry.path, rootPath, null, resolvedGitStatus);
        }
      }
      setActiveFileTabId(existing.id);
      setShowFileEditor(true);
      return;
    }

    const initialViewMode: 'edit' | 'diff' =
      options?.preferDiff === true || isDeleted ? 'diff' : 'edit';

    const newTab: OpenedFileTab = {
      id: tabId,
      path: entry.path,
      name: entry.name,
      rootPath,
      sshConnection: sshConn,
      content: '',
      originalContent: '',
      loading: !isDeleted,
      saving: false,
      loadError: null,
      viewMode: initialViewMode,
      gitDiffContent: '',
      diffLoading: hasGitChanges,
    };

    setFileTabs((prev) => (prev.some((t) => t.id === tabId) ? prev : [...prev, newTab]));
    setActiveFileTabId(tabId);
    setShowFileEditor(true);

    if (!isDeleted) {
      try {
        const content = sshConn
          ? await readSshFileContent(sshConn, entry.path)
          : await readFileContent(entry.path);
        setFileTabs((prev) =>
          prev.map((t) =>
            t.id === tabId
              ? { ...t, content, originalContent: content, loading: false, loadError: null }
              : t,
          ),
        );
        setAssistantText(`Opened: ${entry.name}`);
      } catch (e) {
        const errMsg = e instanceof Error ? e.message : String(e);
        setFileTabs((prev) =>
          prev.map((t) => (t.id === tabId ? { ...t, loading: false, loadError: errMsg } : t)),
        );
        setAssistantText(`Cannot read file: ${entry.name}`);
      }
    } else {
      setAssistantText(`Opened diff: ${entry.name}`);
    }

    if (hasGitChanges && rootPath && !sshConn) {
      void loadTabGitDiff(tabId, entry.path, rootPath, sshConn, resolvedGitStatus);
    }
  }, [gitStatusList, getRelativePath, isSshSession, activeSshConnection, buildFileTabId, loadTabGitDiff]);

  const handleChangeTabContent = useCallback((tabId: string, content: string) => {
    setFileTabs((prev) => prev.map((t) => (t.id === tabId ? { ...t, content } : t)));
  }, []);

  const handleChangeTabViewMode = useCallback((tabId: string, mode: 'edit' | 'diff') => {
    const tab = fileTabsRef.current.find((t) => t.id === tabId);
    setFileTabs((prev) => prev.map((t) => (t.id === tabId ? { ...t, viewMode: mode } : t)));
    if (mode === 'diff' && tab && tab.rootPath && !tab.sshConnection) {
      void loadTabGitDiff(tab.id, tab.path, tab.rootPath, null);
    }
  }, [loadTabGitDiff]);

  const handleCloseFileTab = useCallback((tabId: string) => {
    setFileTabs((prev) => {
      const idx = prev.findIndex((t) => t.id === tabId);
      if (idx === -1) return prev;
      const next = prev.filter((t) => t.id !== tabId);
      if (next.length === 0) {
        setActiveFileTabId(null);
        setShowFileEditor(false);
      } else {
        setActiveFileTabId((currId) => {
          if (currId !== tabId) return currId;
          const fallback = next[Math.min(idx, next.length - 1)];
          return fallback?.id ?? next[0].id;
        });
      }
      return next;
    });
  }, []);

  const handleCloseAllCleanFileTabs = useCallback(() => {
    setFileTabs((prev) => {
      const dirtyTabs = prev.filter((t) => t.content !== t.originalContent);
      if (dirtyTabs.length === 0) {
        setActiveFileTabId(null);
        setShowFileEditor(false);
        return [];
      }
      setActiveFileTabId((currId) =>
        dirtyTabs.some((t) => t.id === currId) ? currId : dirtyTabs[0].id,
      );
      return dirtyTabs;
    });
  }, []);

  const handleCloseFile = useCallback((deletedPath?: string) => {
    setTerminalShortcutOrigin(null);
    if (deletedPath) {
      const normTarget = deletedPath.replace(/[\\/]+$/, '').replace(/\\/g, '/').toLowerCase();
      setFileTabs((prev) => {
        const next = prev.filter((t) => {
          const normTab = t.path.replace(/\\/g, '/').toLowerCase();
          return !(normTab === normTarget || normTab.startsWith(normTarget + '/'));
        });
        if (next.length === 0) {
          setActiveFileTabId(null);
          setShowFileEditor(false);
        } else {
          setActiveFileTabId((curr) => (next.some((t) => t.id === curr) ? curr : next[0].id));
        }
        return next;
      });
      return;
    }
    if (!fileEditorPinned) {
      setShowFileEditor(false);
    }
  }, [fileEditorPinned]);

  const handleSaveFileTab = useCallback(async (tabId: string, contentOverride?: string): Promise<boolean> => {
    const tab = fileTabsRef.current.find((t) => t.id === tabId);
    if (!tab || tab.saving) return false;
    const nextContent = contentOverride ?? tab.content;
    setFileTabs((prev) => prev.map((t) => (t.id === tabId ? { ...t, saving: true } : t)));
    try {
      if (tab.sshConnection) {
        await writeSshFileContent(tab.sshConnection, tab.path, nextContent);
      } else {
        await writeFileContent(tab.path, nextContent);
      }
      setFileTabs((prev) =>
        prev.map((t) =>
          t.id === tabId
            ? { ...t, content: nextContent, originalContent: nextContent, saving: false }
            : t,
        ),
      );

      if (tab.rootPath && !tab.sshConnection) {
        void refreshGitStatus(tab.rootPath);
        if (tab.viewMode === 'diff') {
          void loadTabGitDiff(tab.id, tab.path, tab.rootPath, null);
        }
      }

      setAssistantState('Done');
      setAssistantText(`Saved: ${tab.name}`);
      setTimeout(() => setAssistantState('Idle'), 2500);
      return true;
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e);
      setFileTabs((prev) => prev.map((t) => (t.id === tabId ? { ...t, saving: false } : t)));
      setAssistantState('Error');
      setAssistantText(`Save failed: ${errMsg}`);
      return false;
    }
  }, [refreshGitStatus, loadTabGitDiff]);

  // Drag-and-drop session reordering handlers
  const handleReorderSessions = useCallback((draggedId: string, targetId: string) => {
    setSessions((current) => {
      const draggedIdx = current.findIndex((s) => s.id === draggedId);
      const targetIdx = current.findIndex((s) => s.id === targetId);
      if (draggedIdx === -1 || targetIdx === -1) {
        return current;
      }
      const next = [...current];
      const targetPanel = next[targetIdx].panel || 'right';
      next[draggedIdx] = { ...next[draggedIdx], panel: targetPanel };
      
      const [draggedItem] = next.splice(draggedIdx, 1);
      const newTargetIdx = next.findIndex((s) => s.id === targetId);
      next.splice(newTargetIdx, 0, draggedItem);
      return next;
    });
  }, []);

  const handleMoveSessionToPanel = useCallback((sessionId: string, panel: 'bottom' | 'right') => {
    setSessions((current) => {
      const idx = current.findIndex((s) => s.id === sessionId);
      if (idx === -1) return current;
      const next = [...current];
      next[idx] = { ...next[idx], panel };
      const [item] = next.splice(idx, 1);
      next.push(item);
      return next;
    });
  }, []);

  const createSessionForCli = useCallback(
    async (cliName: string, config: { projectTag?: string; workingDir?: string }) => {
      const pendingId = `pending-${Date.now()}`;
      const fakeSession: SessionInfo = {
        id: pendingId,
        cliName,
        status: 'loading',
        workingDir: config.workingDir,
        projectTag: config.projectTag,
      };

      setPendingSessions((current) => [...current, fakeSession]);
      setActiveSessionId(pendingId);

      try {
        const session = await createTerminalSession({
          cliName,
          workingDir: config.workingDir,
          projectTag: config.projectTag,
        });

        if (session.workingDir) {
          addFolderToHistory(session.workingDir);
        }

        setPendingSessions((current) => current.filter((item) => item.id !== pendingId));
        mergeCliIntoState(session);
        void refreshSidebarData();
        setAssistantState('Done');
        setAssistantText(`Session created: ${session.cliName}`);
        return session;
      } catch (error) {
        setPendingSessions((current) => current.filter((item) => item.id !== pendingId));
        setActiveSessionId(null);
        await refreshSidebarData();
        const message = error instanceof Error ? error.message : String(error);
        setAssistantState('Error');
        setAssistantText(`Interactive start failed: ${message}`);
      }
    },
    [mergeCliIntoState, refreshSidebarData, addFolderToHistory],
  );

  const handleConfirmStart = useCallback(
    async (cliName: string, directory: string, tag: string, profileName: string | null) => {
      setCliStartModalOpen(false);
      setCliToStart(null);
      if (profileName) {
        return;
      }
      await createSessionForCli(cliName, {
        projectTag: tag,
        workingDir: directory,
      });
    },
    [createSessionForCli],
  );

  const handleSendTerminalInput = useCallback((sessionId: string, input: string) => {
    void sendCliInput(sessionId, input).catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      setAssistantState('Error');
      setAssistantText(`Failed to write input to session ${sessionId}: ${message}`);
    });
  }, []);

  const handleStopSession = useCallback(
    async (sessionId: string) => {
      try {
        await stopCli({ sessionId });
        await refreshSidebarData();
        setActiveSessionId(current => current === sessionId ? null : current);
        setAssistantState('Done');
        setAssistantText('Session stopped.');
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setAssistantState('Error');
        setAssistantText(`Stop failed: ${message}`);
      }
    },
    [refreshSidebarData]
  );

  const handleQuickSession = useCallback(async (panel: 'bottom' | 'right' = 'right', parentSessionId?: string | null) => {
    let workingDir: string | undefined;
    const sourceId = parentSessionId === undefined ? (activeSessionId ?? sessions.find(s => s.status === 'running')?.id) : parentSessionId;
    const parent = sessions.find(s => s.id === sourceId && s.status === 'running');
    if (parent) {
      const activeSess = parent;
      if (activeSess && !activeSess.cliName.startsWith('SSH: ') && activeSess.workingDir) {
        workingDir = activeSess.workingDir;
      }
    }

    const cliName = 'Quick - shell';
    const pendingId = `pending-quick-${crypto.randomUUID()}`;
    const fakeSession: SessionInfo = {
      id: pendingId,
      cliName,
      workingDir: workingDir || undefined,
      projectTag: undefined,
      status: 'loading',
      panel,
    };

    setPendingSessions((current) => [...current, fakeSession]);
    setActiveSessionId(pendingId);

    try {
      const session = await createTerminalSession({
        cliName,
        workingDir,
      });

      setPendingSessions((current) => current.filter((item) => item.id !== pendingId));
      mergeCliIntoState({ ...session, panel });
      if (parent) handleLinkTerminal(session.id, parent.id);
      void refreshSidebarData();
      setAssistantState('Done');
      setAssistantText('Quick CLI session started.');
      return session;
    } catch (error) {
      setPendingSessions((current) => current.filter((item) => item.id !== pendingId));
      setActiveSessionId(current => current === pendingId ? (parent?.id ?? null) : current);
      const message = error instanceof Error ? error.message : String(error);
      setAssistantState('Error');
      setAssistantText(`Failed to start Quick CLI: ${message}`);
    }
  }, [activeSessionId, sessions, refreshSidebarData, mergeCliIntoState, handleLinkTerminal]);

  useEffect(() => {
    const openTerminal = async (event: Event) => {
      if (terminalShortcutReturnRafRef.current !== null) {
        cancelAnimationFrame(terminalShortcutReturnRafRef.current);
        terminalShortcutReturnRafRef.current = null;
      }
      if (activeMainView !== 'terminal' || hasUnpinnedFileEditor || paletteOpen || (showNotepad && !notepadPinned) || cliEditorOpen || cliStartModalOpen || sshModalOpen || newFileModal || rewriteModal) {
        const focus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setTerminalShortcutOrigin(current => current ?? { view: activeMainView, focus });
      }
      setContextMenu(null);
      setActiveMainView('terminal');
      const detail = (event as CustomEvent<{ panel?: 'right' | 'bottom'; parentSessionId?: string | null }>).detail;
      const session = await handleQuickSession(detail?.panel === 'bottom' ? 'bottom' : 'right', detail?.parentSessionId);
      if (session) window.dispatchEvent(new CustomEvent('focus-active-terminal', { detail: { sessionId: session.id } }));
    };
    window.addEventListener(NEW_TERMINAL_EVENT, openTerminal);
    return () => window.removeEventListener(NEW_TERMINAL_EVENT, openTerminal);
  }, [activeMainView, hasUnpinnedFileEditor, paletteOpen, showNotepad, notepadPinned, cliEditorOpen, cliStartModalOpen, sshModalOpen, newFileModal, rewriteModal, handleQuickSession]);

  useEffect(() => {
    const cycleTerminal = (e: Event) => {
      if (sessions.length === 0) return;
      if (terminalShortcutReturnRafRef.current !== null) {
        cancelAnimationFrame(terminalShortcutReturnRafRef.current);
        terminalShortcutReturnRafRef.current = null;
      }
      const step: -1 | 1 = (e as CustomEvent<{ step?: -1 | 1 }>).detail?.step === -1 ? -1 : 1;
      const orderedIds = [
        ...sessions.filter((s) => (s.panel ?? 'right') === 'right').map((s) => s.id),
        ...sessions.filter((s) => (s.panel ?? 'right') === 'bottom').map((s) => s.id),
      ];
      const currentId = activeSessionId && sessions.some((s) => s.id === activeSessionId)
        ? activeSessionId
        : (sessions[0]?.id ?? null);
      const nextId = cycleTerminalSessionId(orderedIds, currentId, step);
      if (!nextId) return;
      if (activeMainView !== 'terminal' || hasUnpinnedFileEditor || paletteOpen || (showNotepad && !notepadPinned) || cliEditorOpen || cliStartModalOpen || sshModalOpen || newFileModal || rewriteModal) {
        const focus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setTerminalShortcutOrigin((current) => current ?? { view: activeMainView, focus });
      }
      setContextMenu(null);
      setActiveSessionId(nextId);
      setActiveMainView('terminal');
      window.dispatchEvent(new CustomEvent('focus-active-terminal', { detail: { sessionId: nextId } }));
    };
    window.addEventListener(CYCLE_TERMINAL_EVENT, cycleTerminal);
    return () => window.removeEventListener(CYCLE_TERMINAL_EVENT, cycleTerminal);
  }, [sessions, activeSessionId, activeMainView, hasUnpinnedFileEditor, paletteOpen, showNotepad, notepadPinned, cliEditorOpen, cliStartModalOpen, sshModalOpen, newFileModal, rewriteModal]);

  useEffect(() => {
    const reloadSessions = () => { void refreshSidebarData(); };
    window.addEventListener('clx-reload-sessions', reloadSessions);
    return () => window.removeEventListener('clx-reload-sessions', reloadSessions);
  }, [refreshSidebarData]);

  const handleAddCli = useCallback(() => {
    setTerminalShortcutOrigin(null);
    setEditingCli(null);
    setCliEditorOpen(true);
  }, []);

  const handleEditCli = useCallback((cli: CliDefinition) => {
    setTerminalShortcutOrigin(null);
    setEditingCli(cli);
    setCliEditorOpen(true);
  }, []);

  const handleDeleteCli = useCallback(
    async (cli: CliDefinition) => {
      try {
        const ok = await confirm(tr("Are you sure you want to delete the CLI \"{v0}\"?", { v0: String(cli.name) }), {
          title: tr("Delete CLI"),
          kind: 'warning',
        });
        if (!ok) return;
        await deleteCli(cli.name);
        void refreshSidebarData();
        setAssistantState('Done');
        setAssistantText(`CLI "${cli.name}" deleted.`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setAssistantState('Error');
        setAssistantText(`Delete failed: ${message}`);
      }
    },
    [refreshSidebarData],
  );

  const handleSaveCli = useCallback(
    async (payload: { cli: CliDefinition; originalName?: string }) => {
      try {
        await upsertCli(payload);
        setCliEditorOpen(false);
        void refreshSidebarData();
        setActiveSessionId(null);
        setAssistantState('Done');
        setAssistantText(`CLI "${payload.cli.name}" saved.`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setAssistantState('Error');
        setAssistantText(`Save CLI failed: ${message}`);
      }
    },
    [refreshSidebarData],
  );

  const handleConnectSsh = useCallback(
    async (connection: SshConnection) => {
      try {
        await createSshSession(connection);
        void refreshSidebarData();
        setAssistantState('Done');
        setAssistantText(`SSH session connected to ${connection.host}.`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setAssistantState('Error');
        setAssistantText(`SSH connection failed: ${message}`);
      }
    },
    [refreshSidebarData],
  );

  const handleConnectRdp = useCallback(
    async (connection: SshConnection) => {
      try {
        await createRdpSession(connection);
        setAssistantState('Done');
        setAssistantText(`RDP session launched for ${connection.host}.`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setAssistantState('Error');
        setAssistantText(`RDP connection failed: ${message}`);
      }
    },
    [],
  );

  const handleSaveSshConnection = useCallback(
    async (connection: SshConnection) => {
      try {
        let nextList: SshConnection[];
        const existingIndex = sshConnections.findIndex((c) => c.id === connection.id);
        if (existingIndex >= 0) {
          nextList = [...sshConnections];
          nextList[existingIndex] = connection;
        } else {
          nextList = [...sshConnections, connection];
        }
        await saveSshConnections(nextList);
        setSshConnections(nextList);
        setSshModalOpen(false);
        setAssistantState('Done');
        setAssistantText(`Connection "${connection.name}" saved.`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setAssistantState('Error');
        setAssistantText(`Failed to save connection: ${message}`);
      }
    },
    [sshConnections],
  );

  const handleDeleteSshConnection = useCallback(
    async (connection: SshConnection) => {
      try {
        const ok = await confirm(tr("Are you sure you want to delete the VM connection \"{v0}\"?", { v0: String(connection.name) }), {
          title: tr("Delete Connection"),
          kind: 'warning',
        });
        if (!ok) return;

        const nextList = sshConnections.filter((c) => c.id !== connection.id);
        await saveSshConnections(nextList);
        setSshConnections(nextList);
        setAssistantState('Done');
        setAssistantText(`Connection "${connection.name}" deleted.`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setAssistantState('Error');
        setAssistantText(`Delete failed: ${message}`);
      }
    },
    [sshConnections],
  );

  const handleAddSsh = useCallback(() => {
    setTerminalShortcutOrigin(null);
    setEditingSsh(null);
    setSshModalOpen(true);
  }, []);

  const handleEditSsh = useCallback((connection: SshConnection) => {
    setTerminalShortcutOrigin(null);
    setEditingSsh(connection);
    setSshModalOpen(true);
  }, []);

  const handleSelectCli = useCallback(
    (cliName: string) => {
      setActiveCli(cliName);
      const cli = clis.find((c) => c.name === cliName);

      if (!cli) {
        return;
      }

      const savedDirectories = cli.savedDirectories ?? [];
      if (savedDirectories.length > 0) {
        setProjectTag(savedDirectories[0].tag);
        setWorkingDir(savedDirectories[0].path);
        return;
      }

      if (cli.defaultWorkingDir) {
        setWorkingDir(cli.defaultWorkingDir);
      }
    },
    [clis],
  );

  const handleOpenCliInteraction = useCallback(
    async (cli: CliDefinition) => {
      setTerminalShortcutOrigin(null);
      const savedDirs = cli.savedDirectories ?? [];
      const pathToUse = savedDirs.length > 0
        ? savedDirs[0].path
        : cli.defaultWorkingDir;

      if (pathToUse) {
        const tag = savedDirs.length > 0 ? savedDirs[0].tag : '';
        await createSessionForCli(cli.name, {
          projectTag: tag,
          workingDir: pathToUse,
        });
      } else {
        setCliToStart(cli);
        setCliStartModalOpen(true);
      }
    },
    [createSessionForCli],
  );

  return (
    <main className="flex h-full w-full bg-cyber-base bg-grid text-slate-100 overflow-hidden">
      <CliSidebar
        clis={clis}
        sessions={displaySessions}
        activeCli={activeCli}
        activeSessionId={activeSessionId}
        onSelectCli={handleSelectCli}
        onOpenCliInteraction={handleOpenCliInteraction}
        onSelectSession={(sessId) => {
          setActiveSessionId(sessId);
          handleCloseFile();
          setActiveMainView('terminal');
        }}
        onAddCli={handleAddCli}
        onEditCli={handleEditCli}
        onDeleteCli={handleDeleteCli}
        theme={theme}
        setTheme={setTheme}
        assistantState={assistantState}
        assistantText={trFeedback(assistantText ?? '')}
        setAssistantState={setAssistantState}
        setAssistantText={setAssistantText}
        
        sshConnections={sshConnections}
        onConnectSsh={handleConnectSsh}
        onConnectRdp={handleConnectRdp}
        onAddSsh={handleAddSsh}
        onEditSsh={handleEditSsh}
        onDeleteSsh={handleDeleteSshConnection}

        selectedFilePath={selectedFilePath}
        openFileTabsCount={fileTabs.length}
        isFileEditorOpen={showFileEditor && !terminalShortcutOrigin}
        onOpenFileEditor={() => {
          setTerminalShortcutOrigin(null);
          setShowFileEditor((v) => !v);
        }}
        gitDetail={gitDetail}
        gitStatusList={gitStatusList}
        refreshGitStatus={refreshGitStatus}
        onFileClick={handleFileClick}
        onCloseFile={handleCloseFile}

        onQuickAppsTabChange={(isActive) => setActiveMainView(isActive ? 'quickapps' : 'terminal')}
        onApiClientTabChange={(isActive) => setActiveMainView(isActive ? 'apiclient' : 'terminal')}
        onProxyTabChange={(isActive) => setActiveMainView(isActive ? 'proxy' : 'terminal')}
        onLogsTabChange={(isActive) => setActiveMainView(isActive ? 'logs' : 'terminal')}
      />

      <section className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
        {terminalShortcutOrigin && (
          <div className="shrink-0 border-b border-cyber-line/50 px-3 py-1.5 text-[11px]">
            <button type="button" data-terminal-shortcut-return onClick={() => {
              const origin = terminalShortcutOrigin;
              const activeAtClick = document.activeElement;
              setTerminalShortcutOrigin(null);
              setActiveMainView(origin.view);
              if (terminalShortcutReturnRafRef.current !== null) {
                cancelAnimationFrame(terminalShortcutReturnRafRef.current);
              }
              terminalShortcutReturnRafRef.current = requestAnimationFrame(() => {
                terminalShortcutReturnRafRef.current = null;
                if (document.activeElement && document.activeElement !== document.body && document.activeElement !== activeAtClick) {
                  return;
                }
                if (origin.focus?.isConnected && origin.focus.getClientRects().length > 0) {
                  origin.focus.focus();
                }
              });
            }} className="text-cyber-electric hover:underline">{tr("Return to previous view")}</button>
          </div>
        )}
        <div className="min-h-0 flex-1 flex overflow-hidden">
          <div className="min-w-0 flex-1 h-full overflow-hidden">
            <TerminalPanel
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={(sessId) => {
                setActiveSessionId(sessId);
                handleCloseFile();
                setActiveMainView('terminal');
              }}
              onSendInput={handleSendTerminalInput}
              onStopSession={handleStopSession}
              onSaveTag={handleSaveProjectTag}
              sshConnections={sshConnections}
              terminalLinks={terminalLinks}
              onLinkTerminal={handleLinkTerminal}
              onReorderSessions={handleReorderSessions}
              onMoveSessionToPanel={handleMoveSessionToPanel}
              activeMainView={activeMainView}
              nativeBrowserSuspended={paletteOpen || cliEditorOpen || cliStartModalOpen || sshModalOpen || !!newFileModal || !!rewriteModal || (showNotepad && !notepadPinned) || (showFileEditor && !fileEditorPinned) || !!contextMenu}
              theme={theme}
              setTheme={setTheme}
              contextMenu={contextMenu}
              setContextMenu={setContextMenu}
            />
          </div>
          {showFileEditor && fileEditorPinned && fileTabs.length > 0 && (
            <>
              <div
                onMouseDown={startFileEditorResize}
                data-file-editor-resizer
                title={tr("Drag to resize File Editor")}
                className="w-2 shrink-0 cursor-col-resize flex items-center justify-center group"
              >
                <div className="h-12 w-0.5 rounded-full bg-cyber-line/60 group-hover:bg-cyber-neon group-active:bg-cyber-neon transition-colors" />
              </div>
              <FileEditorPanel
                pinned
                width={fileEditorWidth}
                tabs={fileTabs}
                activeTabId={activeFileTabId}
                gitStatusList={gitStatusList}
                activeSessionId={activeSessionId}
                onSelectTab={setActiveFileTabId}
                onChangeTabContent={handleChangeTabContent}
                onChangeTabViewMode={handleChangeTabViewMode}
                onSaveTab={handleSaveFileTab}
                onSendInput={handleSendTerminalInput}
                onCloseTab={handleCloseFileTab}
                onCloseAllCleanTabs={handleCloseAllCleanFileTabs}
                onTogglePin={() => setFileEditorPinned(false)}
                onHidePanel={() => setShowFileEditor(false)}
              />
            </>
          )}
          {showNotepad && notepadPinned && (
            <>
              <div
                onMouseDown={startNotepadResize}
                data-notepad-resizer
                title={tr("Drag to resize Notepad")}
                className="w-2 shrink-0 cursor-col-resize flex items-center justify-center group"
              >
                <div className="h-12 w-0.5 rounded-full bg-cyber-line/60 group-hover:bg-cyber-neon group-active:bg-cyber-neon transition-colors" />
              </div>
              <Notepad
                pinned
                width={notepadWidth}
                onTogglePin={() => setNotepadPinned(false)}
                onClose={() => setShowNotepad(false)}
              />
            </>
          )}
        </div>
      </section>

      <div data-terminal-shortcut-dialogs className={terminalShortcutOrigin ? 'hidden' : 'contents'}>
      {/* File Editor modal (unpinned) */}
      {showFileEditor && !fileEditorPinned && fileTabs.length > 0 && (
        <FileEditorPanel
          tabs={fileTabs}
          activeTabId={activeFileTabId}
          gitStatusList={gitStatusList}
          activeSessionId={activeSessionId}
          onSelectTab={setActiveFileTabId}
          onChangeTabContent={handleChangeTabContent}
          onChangeTabViewMode={handleChangeTabViewMode}
          onSaveTab={handleSaveFileTab}
          onSendInput={handleSendTerminalInput}
          onCloseTab={handleCloseFileTab}
          onCloseAllCleanTabs={handleCloseAllCleanFileTabs}
          onTogglePin={() => setFileEditorPinned(true)}
          onHidePanel={() => setShowFileEditor(false)}
        />
      )}

      <CliEditorModal
        isOpen={cliEditorOpen}
        initialCli={editingCli}
        onClose={() => setCliEditorOpen(false)}
        onSubmit={handleSaveCli}
      />

      <CliStartModal
        isOpen={cliStartModalOpen}
        cli={cliToStart}
        recentFolders={recentFolders}
        onClose={() => setCliStartModalOpen(false)}
        onConfirm={handleConfirmStart}
      />

      <SshConnectionModal
        isOpen={sshModalOpen}
        connection={editingSsh}
        existingGroups={sshGroups}
        onClose={() => setSshModalOpen(false)}
        onSave={handleSaveSshConnection}
      />
      {/* Notepad modal (unpinned) */}
      {showNotepad && !notepadPinned && (
        <Notepad
          onTogglePin={() => setNotepadPinned(true)}
          onClose={() => setShowNotepad(false)}
        />
      )}

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        sessions={displaySessions}
        clis={clis}
        sshConnections={sshConnections}
        theme={theme}
        onSelectSession={(sessId) => {
          setActiveSessionId(sessId);
          handleCloseFile();
          setActiveMainView('terminal');
        }}
        onOpenCliInteraction={handleOpenCliInteraction}
        onConnectSsh={handleConnectSsh}
        onConnectRdp={handleConnectRdp}
        onAddCli={handleAddCli}
        onAddSsh={handleAddSsh}
        onQuickSession={handleQuickSession}
        onSwitchView={(view) => setActiveMainView(view)}
        onSwitchTheme={(t) => setTheme(t)}
        activeMainView={activeMainView}
      />



      {/* ── New File / Directory Modal ── */}
      {newFileModal?.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[420px] rounded-xl border border-cyber-neon/50 bg-cyber-panel/95 p-6 shadow-2xl backdrop-blur-md select-none">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-cyber-neon font-bold mb-4">
              {newFileModal.type === 'directory' ? tr("📁 New Directory") : tr("📄 New File")}
            </h2>

            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-wide text-slate-400 mb-1">{tr("Location")}</label>
              <div className="rounded border border-cyber-line bg-cyber-base/50 px-3 py-2 text-[11px] text-slate-300 font-mono truncate">
                {newFileModal.basePath}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-wide text-slate-400 mb-1">
                {newFileModal.type === 'directory' ? tr("Directory Name") : tr("File Name")}
              </label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFileOrDir();
                  if (e.key === 'Escape') setNewFileModal(null);
                }}
                placeholder={newFileModal.type === 'directory' ? tr("e.g. my-folder") : tr("e.g. config.json")}
                className="w-full rounded border border-cyber-line bg-cyber-base/50 px-3 py-2 text-[12px] font-mono text-slate-200 placeholder:text-slate-600 outline-none focus:border-cyber-electric transition"
                autoFocus
              />
            </div>

            {newFileModal.type === 'file' && (
              <div className="mb-4">
                <label className="block text-[10px] uppercase tracking-wide text-slate-400 mb-1">{tr("Content ")}<span className="text-slate-600">{tr("(optional)")}</span>
                </label>
                <textarea
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  placeholder={tr("File content...")}
                  rows={5}
                  className="w-full rounded border border-cyber-line bg-cyber-base/50 px-3 py-2 text-[12px] font-mono text-slate-200 placeholder:text-slate-600 outline-none focus:border-cyber-electric transition resize-none"
                />
              </div>
            )}

            {newFileError && (
              <div className="mb-4 rounded border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-400 font-mono">
                {trFeedback(newFileError ?? '')}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setNewFileModal(null)}
                className="rounded-lg border border-cyber-line px-4 py-2 text-[11px] font-semibold text-slate-400 hover:text-white hover:border-slate-500 transition"
              >{tr("Cancel")}</button>
              <button
                type="button"
                onClick={handleCreateFileOrDir}
                disabled={!newFileName.trim()}
                className="rounded-lg bg-cyber-neon/20 border border-cyber-neon/50 px-5 py-2 text-[11px] font-bold text-cyber-neon hover:bg-cyber-neon/30 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >{tr("Create")}</button>
            </div>
          </div>
        </div>
      )}
      {/* ── AI Selection Optimizer Modal ── */}
      {rewriteModal?.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[500px] rounded-xl border border-cyber-neon/50 bg-cyber-panel/95 p-6 shadow-2xl backdrop-blur-md select-none">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-cyber-neon font-bold mb-4">
              {rewriteModal.type === 'suggest' ? tr("💻 AI Command Suggester") : tr("✨ AI Prompt Optimizer")}
            </h2>

            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-wide text-slate-400 mb-1">{tr("Original Text")}</label>
              <div className="max-h-24 overflow-y-auto rounded border border-cyber-line bg-cyber-base/50 px-3 py-2 text-[11px] text-slate-400 font-mono whitespace-pre-wrap break-all">
                {rewriteModal.originalText}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-wide text-slate-400 mb-1">{tr("Optimized Result")}</label>
              {rewriteModal.loading ? (
                <div className="flex flex-col items-center justify-center py-8 rounded border border-cyber-line bg-cyber-base/30 text-cyber-neon/80 text-xs font-mono">
                  <svg className="animate-spin h-5 w-5 mb-2 text-cyber-neon" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{tr("Running built-in local inference...")}</span>
                </div>
              ) : rewriteModal.error ? (
                <div className="rounded border border-red-500/30 bg-red-950/20 px-3 py-2 text-[11px] text-red-400 font-mono whitespace-pre-wrap break-all">
                  {rewriteModal.error}
                </div>
              ) : (
                <textarea
                  value={rewriteModal.resultText}
                  onChange={(e) => setRewriteModal({ ...rewriteModal, resultText: e.target.value })}
                  rows={6}
                  className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-[11px] text-slate-100 font-mono outline-none focus:border-cyber-neon resize-y"
                />
              )}
            </div>

            <div className="flex justify-end gap-3 text-xs font-mono mt-6">
              {!rewriteModal.loading && !rewriteModal.error && rewriteModal.resultText && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard.writeText(rewriteModal.resultText);
                      void showMessage(tr("Copied to clipboard!"));
                    }}
                    className="rounded border border-cyber-line px-4 py-2 hover:bg-cyber-line/20 text-slate-300 transition uppercase"
                  >{tr("📋 Copy")}</button>
                  {activeSessionId && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await sendCliInput(activeSessionId, rewriteModal.resultText + '\n');
                          setRewriteModal(null);
                        } catch (e) {
                          void showMessage(trFeedback("Failed to send to terminal: {v0}", { v0: String(e) }));
                        }
                      }}
                      className="rounded border border-cyber-neon/40 bg-cyber-neon/15 px-4 py-2 hover:bg-cyber-neon/25 text-cyber-neon transition uppercase font-bold"
                    >{tr("⚡ Run in Terminal")}</button>
                  )}
                </>
              )}
              <button
                type="button"
                onClick={() => setRewriteModal(null)}
                className="rounded border border-cyber-line px-4 py-2 hover:bg-cyber-line/20 text-slate-300 transition uppercase"
              >{tr("Close")}</button>
            </div>
          </div>
        </div>
      )}
      </div>
      {/* Mythical Pet — flies across the entire app window */}
      <MythicalPet />
    </main>
  );
}
