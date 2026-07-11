import { useCallback, useEffect, useMemo, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import { confirm } from '@tauri-apps/plugin-dialog';
import { CliEditorModal } from '../components/CliEditorModal';
import { CliStartModal } from '../components/CliStartModal';
import { CliSidebar } from '../components/CliSidebar';
import { TerminalPanel } from '../components/TerminalPanel';
import { SshConnectionModal } from '../components/SshConnectionModal';
import { QuickAppsPanel } from '../components/QuickAppsPanel';
import { ApiClientPanel } from '../components/ApiClientPanel';
import { MythicalPet } from '../components/MythicalPet';
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
} from '../lib/tauri';
import type {
  AssistantState,
  CliDefinition,
  CliSavedDirectory,
  CliStatusEvent,
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
  const [activeMainView, setActiveMainView] = useState<'terminal' | 'quickapps' | 'apiclient'>('terminal');
  const [paletteOpen, setPaletteOpen] = useState(false);


  // Listen for API client history selection from sidebar
  useEffect(() => {
    const handler = (e: Event) => {
      setActiveMainView('apiclient');
    };
    window.addEventListener('apiclient-history-select', handler);
    return () => window.removeEventListener('apiclient-history-select', handler);
  }, []);

  // Command Palette keyboard shortcut (Ctrl+Shift+P)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
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
        return {
          ...s,
          panel: 'right',
        };
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
        const sessionWithPanel = {
          ...session,
          panel: session.panel || 'right',
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
  const [gitStatusList, setGitStatusList] = useState<{ path: string; status: 'modified' | 'added' | 'deleted' | 'untracked' }[]>([]);

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

  const handleSaveCli = useCallback(
    async (payload: { cli: CliDefinition; originalName?: string }) => {
      await upsertCli(payload);
      await refreshSidebarData();
      setActiveCli(payload.cli.name);
      setAssistantState('Done');
      setAssistantText(`CLI saved: ${payload.cli.name}`);
    },
    [refreshSidebarData],
  );

  const handleDeleteCli = useCallback(
    async (cli: CliDefinition) => {
      try {
        const ok = await confirm(`Are you sure you want to delete the CLI \"${cli.name}\"?`, {
          title: 'Delete CLI',
          kind: 'warning',
        });
        if (!ok) {
          return;
        }

        await deleteCli(cli.name);
        await refreshSidebarData();
        setAssistantState('Done');
        setAssistantText(`CLI deleted: ${cli.name}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setAssistantState('Error');
        setAssistantText(`Delete failed: ${message}`);
      }
    },
    [refreshSidebarData],
  );

  const handleConnectSsh = useCallback(
    async (connection: SshConnection) => {
      const pendingId = `pending-${Date.now()}`;
      const fakeSession: SessionInfo = {
        id: pendingId,
        cliName: `SSH: ${connection.name}`,
        status: 'loading',
      };

      setPendingSessions((current) => [...current, fakeSession]);
      setActiveSessionId(pendingId);

      try {
        const session = await createSshSession(connection);
        setPendingSessions((current) => current.filter((item) => item.id !== pendingId));
        mergeCliIntoState(session);
        void refreshSidebarData();
        setAssistantState('Done');
        setAssistantText(`SSH Session started for ${connection.name}`);
      } catch (error) {
        setPendingSessions((current) => current.filter((item) => item.id !== pendingId));
        setActiveSessionId(null);
        await refreshSidebarData();
        const message = error instanceof Error ? error.message : String(error);
        setAssistantState('Error');
        setAssistantText(`SSH Connection failed: ${message}`);
      }
    },
    [mergeCliIntoState, refreshSidebarData],
  );

  const handleConnectRdp = useCallback(
    async (connection: SshConnection) => {
      try {
        setAssistantState('Thinking');
        setAssistantText(`Launching RDP Connection to ${connection.name}...`);
        await createRdpSession(connection);
        setAssistantState('Done');
        setAssistantText(`RDP session launched for ${connection.name}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setAssistantState('Error');
        setAssistantText(`RDP Connection failed: ${message}`);
      }
    },
    [],
  );

  const handleSaveSshConnection = useCallback(
    async (connection: SshConnection) => {
      try {
        let nextList = [...sshConnections];
        const idx = nextList.findIndex((c) => c.id === connection.id);
        if (idx >= 0) {
          nextList[idx] = connection;
        } else {
          nextList.push(connection);
        }

        await saveSshConnections(nextList);
        setSshConnections(nextList);
        setAssistantState('Done');
        setAssistantText(`SSH Connection "${connection.name}" saved.`);
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
    <main className="flex h-screen bg-cyber-base bg-grid text-slate-100">
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
      />

      <section className="flex min-w-0 flex-1 flex-col h-screen overflow-hidden">
        <div className="flex-1 h-full w-full">
          {activeMainView === 'quickapps' ? (
            <QuickAppsPanel />
          ) : activeMainView === 'apiclient' ? (
            <ApiClientPanel />
          ) : (
            <TerminalPanel
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={(sessId) => {
                setActiveSessionId(sessId);
                handleCloseFile();
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
              theme={theme}
            />
          )}
        </div>
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
    </main>
  );
}
