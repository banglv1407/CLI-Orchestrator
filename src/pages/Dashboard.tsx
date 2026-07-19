import { useCallback, useEffect, useMemo, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { confirm } from '@tauri-apps/plugin-dialog';
import { CliEditorModal } from '../components/CliEditorModal';
import { CliStartModal } from '../components/CliStartModal';
import { CliSidebar } from '../components/CliSidebar';
import { TerminalPanel } from '../components/TerminalPanel';
import { SshConnectionModal } from '../components/SshConnectionModal';
import { MythicalPet } from '../components/MythicalPet';
import { Notepad } from '../components/Notepad';
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
  getGitStatus,
  getGitDiff,
  readFileContent,
  writeFileContent,
  readSshFileContent,
  writeSshFileContent,
  createDirectory,
  createFileContent,
} from '../lib/tauri';
import type {
  AssistantState,
  CliDefinition,
  CliSavedDirectory,
  CliStatusEvent,
  GitStatusEntry,
  SessionInfo,
  SshConnection,
} from '../types';

const DEFAULT_ASSISTANT_TEXT = 'Select a CLI and start an interactive session.';
type AppTheme = 'cyberpunk' | 'kawaii' | 'light';

export function Dashboard() {
  const [clis, setClis] = useState<CliDefinition[]>([]);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
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
  const [activeMainView, setActiveMainView] = useState<'terminal' | 'quickapps' | 'apiclient' | 'proxy' | 'logs' | 'settings' | 'remote' | 'dashboard' | 'web-ai'>('terminal');
  const [showNotepad, setShowNotepad] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // ── Global right-click context menu ──
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    sessionId: string | null;
    workingDir: string | null;
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
      // Try Cloud/Configured LLM first
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
      console.warn('Cloud LLM failed, falling back to local LLM:', cloudErr);
      
      // Local LLM Fallback
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
        console.error('Both Cloud LLM and Local LLM fallback failed:', localErr);
        setRewriteModal(prev => prev ? { 
          ...prev, 
          error: `Cloud LLM Error: ${String(cloudErr)}\nLocal LLM Fallback Error: ${String(localErr)}`, 
          loading: false 
        } : null);
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
    if (!contextMenu?.workingDir) return;
    setNewFileModal({ open: true, type: 'file', basePath: contextMenu.workingDir });
    setNewFileName('');
    setNewFileContent('');
    setNewFileError(null);
    setContextMenu(null);
  }, [contextMenu]);

  const handleNewDirectory = useCallback(() => {
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
        setPaletteOpen((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setShowNotepad((v) => !v);
      }
    };
    
    const customPaletteHandler = () => {
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
    let unlistenStatus: (() => void) | undefined;

    const setupListeners = async () => {
      unlistenStatus = await listen<CliStatusEvent>('cli-status', (event) => {
        const payload = event.payload;
        if (!payload.sessionId) {
          return;
        }

        setPendingSessions((current) => current.filter((item) => item.id !== payload.sessionId));
        void refreshSidebarData();

        if (payload.status === 'started') {
          setAssistantState('Running CLI');
          setAssistantText(`Session started for ${payload.cliName}`);
          if (activeSessionId === null) {
            setActiveSessionId(payload.sessionId);
          }
        } else if (payload.status === 'stopped' || payload.status === 'completed') {
          setAssistantState('Done');
          setAssistantText(`Session ${payload.cliName} exited cleanly.`);
          if (activeSessionId === payload.sessionId) {
            setActiveSessionId(null);
          }
        } else if (payload.status === 'error') {
          setAssistantState('Error');
          setAssistantText(`Session error on ${payload.cliName}: ${payload.message ?? 'Unknown'}`);
          if (activeSessionId === payload.sessionId) {
            setActiveSessionId(null);
          }
        }
      });
    };

    void setupListeners();
    return () => {
      if (unlistenStatus) unlistenStatus();
    };
  }, [activeSessionId, refreshSidebarData]);

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

  // --- File Editor States ---
  const [openedFile, setOpenedFile] = useState<{ path: string; name: string } | null>(null);
  const [openedFileRootPath, setOpenedFileRootPath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileOriginalContent, setFileOriginalContent] = useState<string>('');
  const [isSavingFile, setIsSavingFile] = useState(false);
  const [fileLoadError, setFileLoadError] = useState<string | null>(null);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'diff'>('edit');
  const [gitDiffContent, setGitDiffContent] = useState<string>('');
  const [isDiffLoading, setIsDiffLoading] = useState(false);
  const [gitStatusList, setGitStatusList] = useState<GitStatusEntry[]>([]);

  const activeSession = useMemo(() => sessions.find((s) => s.id === activeSessionId), [sessions, activeSessionId]);
  const isSshSession = useMemo(() => !!activeSession?.cliName.startsWith('SSH: '), [activeSession]);
  const sshConnectionName = useMemo(() => isSshSession ? activeSession?.cliName.slice(5) : null, [isSshSession, activeSession]);
  const activeSshConnection = useMemo(() => sshConnections.find((c) => c.name === sshConnectionName), [sshConnections, sshConnectionName]);

  // Path helper
  const getRelativePath = useCallback((fullPath: string, root: string) => {
    let rel = fullPath.replace(root, '');
    rel = rel.replace(/^[/\\\\]+/, '');
    return rel.replace(/\\\\/g, '/');
  }, []);

  // Fetch Git Status
  const refreshGitStatus = useCallback(async (repo: string) => {
    try {
      const status = await getGitStatus(repo);
      setGitStatusList(status);
    } catch (e) {
      console.error('Failed to get git status:', e);
    }
  }, []);

  // Click file inside tree
  const handleFileClick = useCallback(async (entry: { path: string; name: string }, rootPath: string | null) => {
    setSelectedFilePath(entry.path);
    setOpenedFile({ path: entry.path, name: entry.name });
    setOpenedFileRootPath(rootPath);
    setFileLoadError(null);
    setIsFileLoading(true);
    setFileContent('');
    setFileOriginalContent('');
    setGitDiffContent('');
    
    const relPath = rootPath ? getRelativePath(entry.path, rootPath) : '';
    const gitItem = gitStatusList.find((g) => g.path === relPath);
    const hasGitChanges = !isSshSession && !!gitItem;

    if (hasGitChanges) {
      setViewMode('diff');
    } else {
      setViewMode('edit');
    }

    try {
      let content = '';
      if (isSshSession && activeSshConnection) {
        content = await readSshFileContent(activeSshConnection, entry.path);
      } else {
        content = await readFileContent(entry.path);
      }
      setFileContent(content);
      setFileOriginalContent(content);
      setAssistantText(`Opened: ${entry.name}`);
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e);
      setFileLoadError(errMsg);
      setAssistantText(`Cannot read file: ${entry.name}`);
    } finally {
      setIsFileLoading(false);
    }

    if (hasGitChanges && rootPath && !isSshSession && gitItem) {
      setIsDiffLoading(true);
      try {
        const diff = await getGitDiff(rootPath, relPath, gitItem.status === 'untracked');
        setGitDiffContent(diff || 'No changes or empty file.');
      } catch (e) {
        console.error('Failed to load git diff:', e);
        setGitDiffContent('Error loading diff.');
      } finally {
        setIsDiffLoading(false);
      }
    }
  }, [gitStatusList, getRelativePath, isSshSession, activeSshConnection]);

  const handleCloseFile = useCallback(() => {
    setOpenedFile(null);
    setOpenedFileRootPath(null);
    setFileContent('');
    setFileOriginalContent('');
    setFileLoadError(null);
    setSelectedFilePath(null);
  }, []);

  const handleSaveFile = useCallback(async () => {
    if (!openedFile || isSavingFile) return;
    setIsSavingFile(true);
    try {
      if (isSshSession && activeSshConnection) {
        await writeSshFileContent(activeSshConnection, openedFile.path, fileContent);
      } else {
        await writeFileContent(openedFile.path, fileContent);
      }
      setFileOriginalContent(fileContent);
      
      if (openedFileRootPath && !isSshSession) {
        void refreshGitStatus(openedFileRootPath);
      }

      setAssistantState('Done');
      setAssistantText(`Saved: ${openedFile.name}`);
      setTimeout(() => setAssistantState('Idle'), 2500);
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e);
      setAssistantState('Error');
      setAssistantText(`Save failed: ${errMsg}`);
    } finally {
      setIsSavingFile(false);
    }
  }, [openedFile, isSavingFile, fileContent, openedFileRootPath, refreshGitStatus, isSshSession, activeSshConnection]);

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
        if (activeSessionId === sessionId) {
          setActiveSessionId(null);
        }
        setAssistantState('Done');
        setAssistantText('Session stopped.');
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setAssistantState('Error');
        setAssistantText(`Stop failed: ${message}`);
      }
    },
    [activeSessionId, refreshSidebarData]
  );

  const handleQuickSession = useCallback(async (panel: 'bottom' | 'right' = 'right') => {
    let workingDir: string | undefined;
    if (activeSessionId) {
      const activeSess = sessions.find((s) => s.id === activeSessionId);
      if (activeSess && activeSess.workingDir) {
        workingDir = activeSess.workingDir;
      }
    }

    const cliName = 'Quick - shell';
    const pendingId = `pending-quick-${Date.now()}`;
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
      void refreshSidebarData();
      setAssistantState('Done');
      setAssistantText('Quick CLI session started.');
    } catch (error) {
      setPendingSessions((current) => current.filter((item) => item.id !== pendingId));
      setActiveSessionId(null);
      const message = error instanceof Error ? error.message : String(error);
      setAssistantState('Error');
      setAssistantText(`Failed to start Quick CLI: ${message}`);
    }
  }, [activeSessionId, sessions, refreshSidebarData, mergeCliIntoState]);

  const handleAddCli = useCallback(() => {
    setEditingCli(null);
    setCliEditorOpen(true);
  }, []);

  const handleEditCli = useCallback((cli: CliDefinition) => {
    setEditingCli(cli);
    setCliEditorOpen(true);
  }, []);

  const handleDeleteCli = useCallback(
    async (cli: CliDefinition) => {
      try {
        const ok = await confirm(`Are you sure you want to delete the CLI "${cli.name}"?`, {
          title: 'Delete CLI',
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
        const ok = await confirm(`Are you sure you want to delete the VM connection "${connection.name}"?`, {
          title: 'Delete Connection',
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
    setEditingSsh(null);
    setSshModalOpen(true);
  }, []);

  const handleEditSsh = useCallback((connection: SshConnection) => {
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
    <main
      className="flex h-screen bg-cyber-base bg-grid text-slate-100"
      onContextMenu={(e) => {
        // Find workingDir from active session for context menu
        const activeSess = sessions.find((s) => s.id === activeSessionId);
        handleContextMenu(e, activeSessionId, activeSess?.workingDir ?? null);
      }}
    >
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
        assistantText={assistantText}
        setAssistantState={setAssistantState}
        setAssistantText={setAssistantText}
        
        sshConnections={sshConnections}
        onConnectSsh={handleConnectSsh}
        onConnectRdp={handleConnectRdp}
        onAddSsh={handleAddSsh}
        onEditSsh={handleEditSsh}
        onDeleteSsh={handleDeleteSshConnection}

        selectedFilePath={selectedFilePath}
        gitStatusList={gitStatusList}
        refreshGitStatus={refreshGitStatus}
        onFileClick={handleFileClick}
        onCloseFile={handleCloseFile}

        onQuickAppsTabChange={(isActive) => setActiveMainView(isActive ? 'quickapps' : 'terminal')}
        onApiClientTabChange={(isActive) => setActiveMainView(isActive ? 'apiclient' : 'terminal')}
        onProxyTabChange={(isActive) => setActiveMainView(isActive ? 'proxy' : 'terminal')}
        onLogsTabChange={(isActive) => setActiveMainView(isActive ? 'logs' : 'terminal')}
      />

      <section className="flex min-w-0 flex-1 flex-col h-screen overflow-hidden">
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
          onQuickSession={handleQuickSession}

          openedFile={openedFile}
          openedFileRootPath={openedFileRootPath}
          fileContent={fileContent}
          setFileContent={setFileContent}
          fileOriginalContent={fileOriginalContent}
          isSavingFile={isSavingFile}
          fileLoadError={fileLoadError}
          isFileLoading={isFileLoading}
          viewMode={viewMode}
          setViewMode={setViewMode}
          gitDiffContent={gitDiffContent}
          isDiffLoading={isDiffLoading}
          gitStatusList={gitStatusList}
          onSaveFile={handleSaveFile}
          onCloseFile={handleCloseFile}

          onReorderSessions={handleReorderSessions}
          onMoveSessionToPanel={handleMoveSessionToPanel}
          activeMainView={activeMainView}
          theme={theme}
          setTheme={setTheme}
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
        />
      </section>

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
        existingGroups={Array.from(new Set(sshConnections.map((c) => c.group || 'Default')))}
        onClose={() => setSshModalOpen(false)}
        onSave={handleSaveSshConnection}
      />
      {/* Mythical Pet — flies across the entire app window */}
      <MythicalPet onOpenChat={() => {
        window.dispatchEvent(new CustomEvent('mythical-pet-click'));
      }} />

      {/* Notepad modal */}
      {showNotepad && <Notepad onClose={() => setShowNotepad(false)} />}

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

      {/* ── Global Right-click Context Menu ── */}
      {contextMenu && (
        <div
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed z-[100] w-52 rounded-lg border border-cyber-neon/40 bg-cyber-panel/95 p-1 text-slate-100 shadow-2xl backdrop-blur-md select-none font-mono text-[11px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* New submenu */}
          <div className="relative group">
            <div className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-neon/25 hover:text-cyber-neon transition cursor-pointer">
              ✨ New
              <span className="ml-auto text-[9px] text-slate-500">▶</span>
            </div>
            <div className="absolute left-[98%] top-0 hidden group-hover:block w-44 rounded-lg border border-cyber-neon/30 bg-cyber-panel/95 p-1 shadow-2xl backdrop-blur-md z-[101]">
              <button
                type="button"
                onClick={handleNewFile}
                className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-electric/25 hover:text-cyber-electric transition"
              >
                📄 File...
              </button>
              <button
                type="button"
                onClick={handleNewDirectory}
                className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-electric/25 hover:text-cyber-electric transition"
              >
                📁 Directory...
              </button>
            </div>
          </div>

          <div className="my-1 border-t border-cyber-line/50" />

          {contextMenu.workingDir && (
            <button
              type="button"
              onClick={() => {
                void invoke('open_workspace_folder', { path: contextMenu.workingDir! });
              }}
              className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-electric/25 hover:text-cyber-electric transition"
            >
              📁 Reveal in Explorer
            </button>
          )}

          <button
            type="button"
            onClick={async () => {
              try { const text = await navigator.clipboard.readText(); if (activeSessionId) handleSendTerminalInput(activeSessionId, text); } catch {}
              setContextMenu(null);
            }}
            className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-electric/20 transition"
          >
            📋 Paste
          </button>

          <div className="my-1 border-t border-cyber-line/50" />

          {selectedText.trim() && (
            <>
              <div className="my-1 border-t border-cyber-line/50" />
              <button
                type="button"
                onClick={() => handleOptimizeSelection('rewrite')}
                className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-neon/20 hover:text-cyber-neon transition"
              >
                ✨ Optimize Selection
              </button>
              <button
                type="button"
                onClick={() => handleOptimizeSelection('suggest')}
                className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-neon/20 hover:text-cyber-neon transition"
              >
                💻 Fix/Suggest Command
              </button>
            </>
          )}
        </div>
      )}

      {/* ── New File / Directory Modal ── */}
      {newFileModal?.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[420px] rounded-xl border border-cyber-neon/50 bg-cyber-panel/95 p-6 shadow-2xl backdrop-blur-md select-none">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-cyber-neon font-bold mb-4">
              {newFileModal.type === 'directory' ? '📁 New Directory' : '📄 New File'}
            </h2>

            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-wide text-slate-400 mb-1">Location</label>
              <div className="rounded border border-cyber-line bg-cyber-base/50 px-3 py-2 text-[11px] text-slate-300 font-mono truncate">
                {newFileModal.basePath}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-wide text-slate-400 mb-1">
                {newFileModal.type === 'directory' ? 'Directory Name' : 'File Name'}
              </label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFileOrDir();
                  if (e.key === 'Escape') setNewFileModal(null);
                }}
                placeholder={newFileModal.type === 'directory' ? 'e.g. my-folder' : 'e.g. config.json'}
                className="w-full rounded border border-cyber-line bg-cyber-base/50 px-3 py-2 text-[12px] font-mono text-slate-200 placeholder:text-slate-600 outline-none focus:border-cyber-electric transition"
                autoFocus
              />
            </div>

            {newFileModal.type === 'file' && (
              <div className="mb-4">
                <label className="block text-[10px] uppercase tracking-wide text-slate-400 mb-1">
                  Content <span className="text-slate-600">(optional)</span>
                </label>
                <textarea
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  placeholder="File content..."
                  rows={5}
                  className="w-full rounded border border-cyber-line bg-cyber-base/50 px-3 py-2 text-[12px] font-mono text-slate-200 placeholder:text-slate-600 outline-none focus:border-cyber-electric transition resize-none"
                />
              </div>
            )}

            {newFileError && (
              <div className="mb-4 rounded border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-400 font-mono">
                {newFileError}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setNewFileModal(null)}
                className="rounded-lg border border-cyber-line px-4 py-2 text-[11px] font-semibold text-slate-400 hover:text-white hover:border-slate-500 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateFileOrDir}
                disabled={!newFileName.trim()}
                className="rounded-lg bg-cyber-neon/20 border border-cyber-neon/50 px-5 py-2 text-[11px] font-bold text-cyber-neon hover:bg-cyber-neon/30 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── AI Selection Optimizer Modal ── */}
      {rewriteModal?.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[500px] rounded-xl border border-cyber-neon/50 bg-cyber-panel/95 p-6 shadow-2xl backdrop-blur-md select-none">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-cyber-neon font-bold mb-4">
              {rewriteModal.type === 'suggest' ? '💻 AI Command Suggester' : '✨ AI Prompt Optimizer'}
            </h2>

            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-wide text-slate-400 mb-1">Original Text</label>
              <div className="max-h-24 overflow-y-auto rounded border border-cyber-line bg-cyber-base/50 px-3 py-2 text-[11px] text-slate-400 font-mono whitespace-pre-wrap break-all">
                {rewriteModal.originalText}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-wide text-slate-400 mb-1">Optimized Result</label>
              {rewriteModal.loading ? (
                <div className="flex flex-col items-center justify-center py-8 rounded border border-cyber-line bg-cyber-base/30 text-cyber-neon/80 text-xs font-mono">
                  <svg className="animate-spin h-5 w-5 mb-2 text-cyber-neon" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Running built-in local inference...</span>
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
                      alert('Copied to clipboard!');
                    }}
                    className="rounded border border-cyber-line px-4 py-2 hover:bg-cyber-line/20 text-slate-300 transition uppercase"
                  >
                    📋 Copy
                  </button>
                  {activeSessionId && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await sendCliInput(activeSessionId, rewriteModal.resultText + '\n');
                          setRewriteModal(null);
                        } catch (e) {
                          alert(`Failed to send to terminal: ${e}`);
                        }
                      }}
                      className="rounded border border-cyber-neon/40 bg-cyber-neon/15 px-4 py-2 hover:bg-cyber-neon/25 text-cyber-neon transition uppercase font-bold"
                    >
                      ⚡ Run in Terminal
                    </button>
                  )}
                </>
              )}
              <button
                type="button"
                onClick={() => setRewriteModal(null)}
                className="rounded border border-cyber-line px-4 py-2 hover:bg-cyber-line/20 text-slate-300 transition uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
