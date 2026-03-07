import { useCallback, useEffect, useMemo, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import { open, confirm } from '@tauri-apps/plugin-dialog';
import { AnimeAssistant } from '../components/AnimeAssistant';
import { CliEditorModal } from '../components/CliEditorModal';
import { CliStartModal } from '../components/CliStartModal';
import { CliSidebar } from '../components/CliSidebar';
import { TerminalPanel } from '../components/TerminalPanel';
import {
  backendLogsPath,
  createTerminalSession,
  deleteCli,
  listClis,
  listProjectTags,
  listSessions,
  openBackendLogsFolder,
  pickFolder,
  saveCliTag,
  sendCliInput,
  stopCli,
  upsertCli,
} from '../lib/tauri';
import type { AssistantState, CliDefinition, CliSavedDirectory, CliStatusEvent, SessionInfo } from '../types';

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
  const [backendLogsDir, setBackendLogsDir] = useState('');
  const [cliEditorOpen, setCliEditorOpen] = useState(false);
  const [editingCli, setEditingCli] = useState<CliDefinition | null>(null);
  const [cliStartModalOpen, setCliStartModalOpen] = useState(false);
  const [cliToStart, setCliToStart] = useState<CliDefinition | null>(null);
  const [theme, setTheme] = useState<AppTheme>(() => {
    const stored = localStorage.getItem('ai-cli-theme');
    return stored === 'kawaii' ? 'kawaii' : 'cyberpunk';
  });
  const [globalProjectTags, setGlobalProjectTags] = useState<{ tag: string; path: string }[]>([]);

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
    } else {
      setActiveCli('');
    }

    if (loadedSessions.length > 0) {
      if (activeSessionId?.startsWith('loading-')) {
        return;
      }
      const hasActiveSession = loadedSessions.some((session) => session.id === activeSessionId);
      if (!hasActiveSession) {
        setActiveSessionId(loadedSessions[0].id);
      }
    } else if (activeSessionId && !activeSessionId.startsWith('loading-')) {
      setActiveSessionId(null);
    }
  }, [activeCli, activeSessionId]);

  const activeCliDefinition = useMemo(
    () => clis.find((cli) => cli.name === activeCli) ?? null,
    [activeCli, clis],
  );
  const activeCliSavedDirectories = useMemo(
    () => activeCliDefinition?.savedDirectories ?? [],
    [activeCliDefinition],
  );

  const allSavedDirectories = useMemo((): CliSavedDirectory[] => {
    const list: CliSavedDirectory[] = [];
    const seen = new Set<string>();

    const addItems = (items: CliSavedDirectory[] | undefined) => {
      if (!items) return;
      for (const item of items) {
        if (!seen.has(item.tag)) {
          seen.add(item.tag);
          list.push({ tag: item.tag, path: item.path });
        }
      }
    };

    // Put active CLI tags first
    addItems(activeCliDefinition?.savedDirectories);
    clis.forEach((cli) => {
      if (cli.name !== activeCli) {
        addItems(cli.savedDirectories);
      }
    });

    return list;
  }, [clis, activeCli, activeCliDefinition]);

  const workingDirSuggestions = useMemo(() => {
    const next = new Set<string>();
    allSavedDirectories.forEach((item) => {
      if (item.path.trim()) {
        next.add(item.path);
      }
    });
    return [...next];
  }, [allSavedDirectories]);

  const mergeCliIntoState = useCallback((updatedCli: CliDefinition) => {
    setClis((current) => {
      const index = current.findIndex((item) => item.name === updatedCli.name);
      if (index === -1) {
        return [...current, updatedCli].sort((left, right) => left.name.localeCompare(right.name));
      }

      const next = [...current];
      next[index] = updatedCli;
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('ai-cli-theme', theme);
  }, [theme]);

  useEffect(() => {
    void refreshSidebarData();
    listProjectTags().then(setGlobalProjectTags).catch(console.error);
  }, [refreshSidebarData]);

  useEffect(() => {
    if (!activeCliDefinition) {
      return;
    }

    if (!projectTag && activeCliSavedDirectories.length > 0) {
      setProjectTag(activeCliSavedDirectories[0].tag);
    }

    if (!workingDir) {
      const selected = activeCliSavedDirectories.find((item) => item.tag === projectTag);
      if (selected?.path) {
        setWorkingDir(selected.path);
        return;
      }

      if (activeCliSavedDirectories.length > 0) {
        setWorkingDir(activeCliSavedDirectories[0].path);
        return;
      }

      if (activeCliDefinition.defaultWorkingDir) {
        setWorkingDir(activeCliDefinition.defaultWorkingDir);
      }
    }
  }, [activeCliDefinition, activeCliSavedDirectories, projectTag, workingDir]);

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
    void backendLogsPath()
      .then((path) => setBackendLogsDir(path))
      .catch(() => setBackendLogsDir(''));
  }, []);

  useEffect(() => {
    let unlistenStatus: (() => void) | undefined;

    const setupListeners = async () => {
      unlistenStatus = await listen<CliStatusEvent>('cli-status', (event) => {
        const payload = event.payload;
        if (!payload.sessionId) {
          return;
        }

        if (payload.status === 'error') {
          setAssistantState('Error');
          setAssistantText(payload.message ?? 'Session failed.');
          void refreshSidebarData();
          return;
        }

        if (payload.status === 'completed' || payload.status === 'stopped') {
          setAssistantState('Done');
          setAssistantText(payload.message ?? 'Session ended.');
          void refreshSidebarData();
          return;
        }

        if (payload.status === 'started') {
          setAssistantState('Done');
          setAssistantText(payload.message ?? `Session started for ${payload.cliName}.`);
        }
      });
    };

    void setupListeners();
    return () => {
      unlistenStatus?.();
    };
  }, [refreshSidebarData]);

  const handleSaveProjectTag = useCallback(
    async (cliName: string, tag: string, directory: string) => {
      try {
        const updatedCli = await saveCliTag(cliName, tag, directory);
        mergeCliIntoState(updatedCli);
        setProjectTag(tag);
        setWorkingDir(directory);
        setAssistantState('Done');
        setAssistantText(`Saved project tag for ${cliName}: ${tag}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setAssistantState('Error');
        setAssistantText(`Save tag failed: ${message}`);
      }
    },
    [mergeCliIntoState],
  );

  const handlePickWorkingDir = useCallback(async () => {
    try {
      const picked = await open({
        directory: true,
        multiple: false,
        title: 'Select Working Directory',
      });

      const selected = typeof picked === 'string' ? picked : null;
      if (selected) {
        setWorkingDir(selected);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setAssistantState('Error');
      setAssistantText(`Cannot open folder picker: ${message}`);
    }
  }, []);

  const createSessionForCli = useCallback(
    async (
      cliName: string,
      overrides?: {
        projectTag?: string;
        workingDir?: string;
      },
    ) => {
      const trimmedWorkingDir = (overrides?.workingDir ?? workingDir).trim();
      const trimmedProjectTag = (overrides?.projectTag ?? projectTag).trim();

      if (trimmedProjectTag && trimmedWorkingDir) {
        try {
          const updatedCli = await saveCliTag(cliName, trimmedProjectTag, trimmedWorkingDir);
          mergeCliIntoState(updatedCli);
        } catch {
          // Ignore auto-save failures here; session creation still validates workingDir.
        }
      }

      const pendingId = `loading-${crypto.randomUUID()}`;
      const pendingSession: SessionInfo = {
        id: pendingId,
        cliName,
        status: 'loading',
        workingDir: trimmedWorkingDir || undefined,
        projectTag: trimmedProjectTag || undefined,
      };

      setPendingSessions((current) => [pendingSession, ...current]);
      setActiveSessionId(pendingId);
      setAssistantState('Running CLI');
      setAssistantText(`Starting interactive session for ${cliName}...`);

      try {
        const session = await createTerminalSession({
          cliName,
          workingDir: trimmedWorkingDir || undefined,
          projectTag: trimmedProjectTag || undefined,
        });

        setPendingSessions((current) => current.filter((item) => item.id !== pendingId));
        setSessions((current) => {
          const existingIndex = current.findIndex((item) => item.id === session.id);
          if (existingIndex === -1) {
            return [session, ...current];
          }

          const next = [...current];
          next[existingIndex] = { ...next[existingIndex], ...session };
          return next;
        });
        setActiveSessionId(session.id);
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
    [mergeCliIntoState, projectTag, refreshSidebarData, workingDir],
  );

  const handleOpenLogsFolder = useCallback(async () => {
    try {
      const logsDir = await openBackendLogsFolder();
      setBackendLogsDir(logsDir);
      setAssistantState('Done');
      setAssistantText(`Opened backend logs folder: ${logsDir}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setAssistantState('Error');
      setAssistantText(`Cannot open logs folder: ${message}`);
    }
  }, []);

  const handleOpenCliInteraction = useCallback(
    async (cli: CliDefinition) => {
      setCliToStart(cli);
      setCliStartModalOpen(true);
    },
    [],
  );

  const handleConfirmStart = useCallback(
    async (cliName: string, directory: string, tag: string) => {
      setCliStartModalOpen(false);
      setCliToStart(null);
      await createSessionForCli(cliName, {
        projectTag: tag,
        workingDir: directory,
      });
    },
    [createSessionForCli],
  );

  const handleStartSession = useCallback(async () => {
    if (!activeCliDefinition) {
      setAssistantState('Error');
      setAssistantText('Select a CLI before starting a session.');
      return;
    }

    setCliToStart(activeCliDefinition);
    setCliStartModalOpen(true);
  }, [activeCliDefinition]);

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
      />

      <section className="flex min-w-0 flex-1 flex-col gap-4 p-4">
        <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <section className="rounded-xl border border-cyber-line bg-cyber-panel/70 p-4">
            <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-display text-sm uppercase tracking-[0.2em] text-cyber-electric">Interactive Session Control</h2>
                <p className="text-sm text-slate-300">All workflows now run as live interactive terminal sessions.</p>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-200">
                <span className="text-xs uppercase tracking-wider text-slate-400">Theme</span>
                <select
                  value={theme}
                  onChange={(event) => setTheme(event.target.value as AppTheme)}
                  className="rounded border border-cyber-line bg-cyber-base px-3 py-1 font-semibold text-cyber-neon outline-none transition focus:border-cyber-neon"
                >
                  <option value="cyberpunk">Cyberpunk</option>
                  <option value="kawaii">Kawaii</option>
                </select>
              </label>
            </div>

            <div className="grid gap-2 xl:grid-cols-[1.5fr_3fr_4fr_auto]">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">CLI</label>
                <div className="w-full rounded border border-cyber-line/50 bg-cyber-base/40 px-3 py-2 text-sm font-semibold text-cyber-neon/80">
                  {activeCli || 'None'}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Project Tag</label>
                <div className="w-full truncate rounded border border-cyber-line/50 bg-cyber-base/40 px-3 py-2 text-sm text-slate-300">
                  {projectTag || '-'}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Working Directory</label>
                <div className="w-full truncate rounded border border-cyber-line/50 bg-cyber-base/40 px-3 py-2 text-sm text-slate-400">
                  {workingDir || '-'}
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartSession}
                className="self-end rounded border border-cyber-neon px-5 py-2 text-xs font-semibold uppercase tracking-wider text-cyber-neon transition hover:bg-cyber-neon/10"
              >
                Start New
              </button>
            </div>
            {backendLogsDir ? <p className="mt-2 truncate text-xs text-slate-400">Backend logs: {backendLogsDir}</p> : null}
          </section>

          <AnimeAssistant state={assistantState} text={assistantText} />
        </div>

        <div className="min-h-0 flex-1">
          <TerminalPanel
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={setActiveSessionId}
            onSendInput={handleSendTerminalInput}
            onStopSession={handleStopSession}
            onSaveTag={handleSaveProjectTag}
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
        onClose={() => setCliStartModalOpen(false)}
        onConfirm={handleConfirmStart}
      />
    </main>
  );
}
