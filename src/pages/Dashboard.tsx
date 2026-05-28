import { useCallback, useEffect, useMemo, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import { confirm } from '@tauri-apps/plugin-dialog';
import { CliEditorModal } from '../components/CliEditorModal';
import { CliStartModal } from '../components/CliStartModal';
import { CliSidebar } from '../components/CliSidebar';
import { TerminalPanel } from '../components/TerminalPanel';
import { SshConnectionModal } from '../components/SshConnectionModal';
import {
  createTerminalSession,
  deleteCli,
  getAccountStatus,
  listClis,
  listProjectTags,
  listSessions,
  saveCliTag,
  sendCliInput,
  stopCli,
  upsertCli,
  activateAccount,
  loadSshConnections,
  saveSshConnections,
  createSshSession,
  createRdpSession,
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
type AppTheme = 'cyberpunk' | 'kawaii';

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
  const [startAccountProfiles, setStartAccountProfiles] = useState<string[]>([]);
  const [startAccountActive, setStartAccountActive] = useState<string | null>(null);
  const [startAccountsLoading, setStartAccountsLoading] = useState(false);
  const [theme, setTheme] = useState<AppTheme>(() => {
    const stored = localStorage.getItem('ai-cli-theme');
    return stored === 'kawaii' ? 'kawaii' : 'cyberpunk';
  });
  const [globalProjectTags, setGlobalProjectTags] = useState<{ tag: string; path: string }[]>([]);
  
  const [sshConnections, setSshConnections] = useState<SshConnection[]>([]);
  const [sshModalOpen, setSshModalOpen] = useState(false);
  const [editingSsh, setEditingSsh] = useState<SshConnection | null>(null);

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
    setSessions(loadedSessions);

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
        if (index >= 0) {
          const next = [...current];
          next[index] = session;
          return next;
        }
        return [...current, session];
      });
      setActiveSessionId(session.id);
    },
    [setSessions, setActiveSessionId],
  );

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
      setStartAccountProfiles([]);
      setStartAccountActive(null);

      if (profileName) {
        try {
          await activateAccount(cliName, profileName);
          setAssistantState('Done');
          setAssistantText(`Activated ${profileName} for ${cliName}.`);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          setAssistantState('Error');
          setAssistantText(`Account activation failed: ${message}`);
          return;
        }
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
    [activeSessionId, refreshSidebarData],
  );

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
      setCliToStart(cli);
      setCliStartModalOpen(true);
    },
    [],
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
        onSelectSession={setActiveSessionId}
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
      />

      <section className="flex min-w-0 flex-1 flex-col h-screen overflow-hidden">
        <div className="flex-1 h-full w-full">
          <TerminalPanel
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={setActiveSessionId}
            onSendInput={handleSendTerminalInput}
            onStopSession={handleStopSession}
            onSaveTag={handleSaveProjectTag}
            sshConnections={sshConnections}
          />
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
        accountProfiles={startAccountProfiles}
        activeProfile={startAccountActive}
        isLoadingAccounts={startAccountsLoading}
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
    </main>
  );
}
