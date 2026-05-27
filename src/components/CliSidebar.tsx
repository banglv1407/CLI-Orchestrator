import { useState, useEffect } from 'react';
import type { CliDefinition, SessionInfo, FileEntry, AppTheme, AssistantState } from '../types';
import { AnimeAssistant } from './AnimeAssistant';
import { 
  listDirectoryFiles, 
  pickFolder,
  sendCliInput 
} from '../lib/tauri';

// --- SVG Icons ---

function ExplorerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.884 2.223v6.12c0 1.242 1.008 2.25 2.25 2.25h15.812c1.242 0 2.25-1.008 2.25-2.25v-6.12a2.25 2.25 0 0 0-1.884-2.223m-16.5 0c.237-.039.48-.06.728-.06h3.407a1.875 1.875 0 0 1 1.326.55l1.682 1.682a.375.375 0 0 0 .265.11h3.04c.248 0 .491-.021.728-.06m-12 0V6a2.25 2.25 0 0 1 2.25-2.25h3.407a1.875 1.875 0 0 1 1.326.55l1.682 1.682a.375.375 0 0 0 .265.11h3.04c.248 0 .491-.021.728-.06Z" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869L9.594 3.94ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
    </svg>
  );
}

function FolderArrowIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      className={`h-3 w-3 shrink-0 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0 text-cyber-electric/80">
      <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.33.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0 text-slate-400">
      <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z" clipRule="evenodd" />
      <path d="M12.938 5.437c.07.38.37.68.75.75h3.562c-.105-.372-.309-.706-.59-1.002l-2.72-2.72a3.75 3.75 0 0 0-.991-.59v3.562Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M8 5.25c0-.6.66-.96 1.16-.64l10 6.75a.75.75 0 0 1 0 1.28l-10 6.75A.75.75 0 0 1 8 18.75V5.25Z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.86 3.49a2.2 2.2 0 1 1 3.11 3.11L8 18.57l-4 1 1-4 11.86-12.08Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2m-1 0v14H9V6" />
    </svg>
  );
}

function SwitchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  );
}

// --- Component Interfaces ---

interface CliSidebarProps {
  clis: CliDefinition[];
  sessions: SessionInfo[];
  activeCli: string;
  activeSessionId: string | null;
  onSelectCli: (cliName: string) => void;
  onOpenCliInteraction: (cli: CliDefinition) => void;
  onSelectSession: (sessionId: string) => void;
  onAddCli: () => void;
  onEditCli: (cli: CliDefinition) => void;
  onDeleteCli: (cli: CliDefinition) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  assistantState: AssistantState;
  assistantText: string;
}

type SidebarTab = 'explorer' | 'cli-manager' | 'settings';

export function CliSidebar({
  clis,
  sessions,
  activeCli,
  activeSessionId,
  onSelectCli,
  onOpenCliInteraction,
  onSelectSession,
  onAddCli,
  onEditCli,
  onDeleteCli,
  theme,
  setTheme,
  assistantState,
  assistantText,
}: CliSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('explorer');

  // CLI Manager States
  const [showCliList, setShowCliList] = useState(true);

  // Explorer States
  const [customFolder, setCustomFolder] = useState<string | null>(null);
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>({});
  const [cachedFiles, setCachedFiles] = useState<Record<string, FileEntry[]>>({});

  // Active workspace calculation
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const rootPath = activeSession?.workingDir || customFolder;

  // Sync loading root files
  useEffect(() => {
    if (rootPath) {
      listDirectoryFiles(rootPath)
        .then((files) => {
          setCachedFiles((prev) => ({ ...prev, [rootPath]: files }));
        })
        .catch((e) => console.error('Failed to load root files:', e));
    }
  }, [rootPath]);

  // Folder selection helper
  const handleSelectFolder = async () => {
    try {
      const path = await pickFolder();
      if (path) {
        setCustomFolder(path);
      }
    } catch (e) {
      console.error('Failed to pick folder:', e);
    }
  };

  // File tree node expansion toggling
  const handleToggleExpand = async (path: string) => {
    const isExpanded = expandedPaths[path];
    
    if (!isExpanded && !cachedFiles[path]) {
      try {
        const files = await listDirectoryFiles(path);
        setCachedFiles((prev) => ({ ...prev, [path]: files }));
      } catch (e) {
        console.error('Failed to load subfolder:', e);
      }
    }

    setExpandedPaths((prev) => ({
      ...prev,
      [path]: !isExpanded,
    }));
  };

  // Click file inside tree
  const handleFileClick = (entry: FileEntry) => {
    if (activeSessionId) {
      // Send smart paste command to active terminal session
      const message = confirm(`Send file path to terminal?\n\n"${entry.path}"`);
      if (message) {
        void sendCliInput(activeSessionId, ` "${entry.path}" `);
      }
    } else {
      // Otherwise fallback to copying path
      navigator.clipboard.writeText(entry.path)
        .then(() => alert(`Copied file path to clipboard:\n${entry.path}`))
        .catch(() => alert('Failed to copy file path.'));
    }
  };

  // Recursive Tree Node Renderer
  const renderFileNode = (entry: FileEntry, depth: number) => {
    const isExpanded = !!expandedPaths[entry.path];
    const children = cachedFiles[entry.path] ?? [];

    return (
      <div key={entry.path} className="select-none text-[13px]">
        <button
          type="button"
          onClick={() => (entry.isDir ? handleToggleExpand(entry.path) : handleFileClick(entry))}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
          className={`flex w-full items-center gap-2 py-1 text-left transition hover:bg-cyber-neon/5 ${
            !entry.isDir ? 'text-slate-300 hover:text-white' : 'text-slate-100 font-semibold'
          }`}
        >
          {entry.isDir ? (
            <>
              <FolderArrowIcon isExpanded={isExpanded} />
              <FolderIcon />
            </>
          ) : (
            <>
              <span className="w-3" />
              <FileIcon />
            </>
          )}
          <span className="truncate">{entry.name}</span>
        </button>

        {entry.isDir && isExpanded && (
          <div className="relative">
            {/* Guide line exactly like VSCode */}
            <div 
              style={{ left: `${(depth + 1) * 14 + 4}px` }}
              className="absolute top-0 bottom-0 w-px bg-cyber-line/20" 
            />
            {children.length === 0 ? (
              <p 
                style={{ paddingLeft: `${(depth + 1) * 14 + 20}px` }}
                className="py-1 text-xs italic text-slate-500"
              >
                (empty)
              </p>
            ) : (
              children.map((child) => renderFileNode(child, depth + 1))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full w-80 shrink-0 border-r border-cyber-line bg-cyber-panel/75 backdrop-blur">
      {/* 1. Left-most Activity Bar (VSCode Style) */}
      <nav className="flex h-full w-14 flex-col items-center justify-between border-r border-cyber-line/50 bg-cyber-base/70 py-4">
        <div className="flex flex-col gap-5">
          <button
            type="button"
            onClick={() => setActiveTab('explorer')}
            title="File Explorer"
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
              activeTab === 'explorer'
                ? 'text-cyber-neon bg-cyber-neon/10 shadow-neon-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'explorer' && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-neon" />
            )}
            <ExplorerIcon />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cli-manager')}
            title="CLI Orchestrator"
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
              activeTab === 'cli-manager'
                ? 'text-cyber-electric bg-cyber-electric/10 shadow-neon-blue-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'cli-manager' && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-electric" />
            )}
            <TerminalIcon />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          title="Settings"
          className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
            activeTab === 'settings'
              ? 'text-cyber-neon bg-cyber-neon/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {activeTab === 'settings' && (
            <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-neon" />
          )}
          <SettingsIcon />
        </button>
      </nav>

      {/* 2. Primary Sidebar Panel Content */}
      <aside className="flex flex-1 flex-col overflow-hidden">
        {/* Anime Assistant at the top of the sidebar */}
        <div className="p-3 border-b border-cyber-line bg-cyber-base/30 shrink-0">
          <AnimeAssistant state={assistantState} text={assistantText} />
        </div>

        {/* Active Tab: Explorer */}
        {activeTab === 'explorer' && (
          <div className="flex h-full flex-col overflow-hidden">
            <div className="flex shrink-0 items-center justify-between border-b border-cyber-line p-4">
              <h2 className="font-display text-xs uppercase tracking-[0.2em] text-cyber-neon font-bold">Explorer</h2>
              <button
                type="button"
                onClick={handleSelectFolder}
                title="Open Local Folder"
                className="rounded border border-cyber-neon/40 px-2 py-0.5 text-[10px] uppercase font-semibold text-cyber-neon transition hover:border-cyber-neon hover:bg-cyber-neon/10"
              >
                Open Folder
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {rootPath ? (
                <div>
                  <div className="px-4 pb-2 pt-1">
                    <span className="font-display text-[10px] uppercase tracking-wider text-slate-400">Open Folder</span>
                    <h3 className="truncate font-mono text-[11px] font-semibold text-cyber-electric" title={rootPath}>
                      {rootPath.split(/[/\\]/).pop() || rootPath}
                    </h3>
                  </div>
                  <div className="mt-2">
                    {(cachedFiles[rootPath] ?? []).map((entry) => renderFileNode(entry, 0))}
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <ExplorerIcon />
                  <p className="mt-4 text-xs font-semibold text-slate-300">No Folder Opened</p>
                  <p className="mt-1 text-[11px] text-slate-500 leading-normal">
                    Start an interactive session or select a project directory to explore files.
                  </p>
                  <button
                    type="button"
                    onClick={handleSelectFolder}
                    className="mt-4 rounded border border-cyber-electric bg-cyber-electric/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyber-electric transition hover:bg-cyber-electric/25"
                  >
                    Select Folder
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Active Tab: CLI Manager */}
        {activeTab === 'cli-manager' && (
          <div className="flex h-full flex-col overflow-hidden">
            <div className="flex shrink-0 items-center justify-between border-b border-cyber-line p-4 bg-cyber-base/20">
              <div>
                <h1 className="font-display text-sm uppercase tracking-[0.2em] text-cyber-electric font-bold">CLI Orchestrator</h1>
                <p className="text-[10px] text-slate-400 mt-0.5">Sessions and Profiles</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-5">
              {/* CLIs SECTION */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowCliList((value) => !value)}
                    className="font-display text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-slate-200"
                  >
                    CLIs {showCliList ? '[-]' : '[+]'}
                  </button>
                  <button
                    type="button"
                    onClick={onAddCli}
                    className="rounded border border-cyber-neon/40 px-1.5 py-0.5 text-[10px] font-semibold text-cyber-neon transition hover:border-cyber-neon hover:bg-cyber-neon/10"
                  >
                    Add CLI
                  </button>
                </div>

                {showCliList ? (
                  <div className="space-y-1">
                    {clis.map((cli) => (
                      <div
                        key={cli.name}
                        className={`rounded border px-1.5 py-1.5 transition ${
                          activeCli === cli.name
                            ? 'border-cyber-neon bg-cyber-neon/10 shadow-neon-sm-faint'
                            : 'border-cyber-line bg-cyber-base/40'
                        }`}
                      >
                        <div className="flex items-start gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectCli(cli.name)}
                            className="min-w-0 flex-1 text-left leading-tight"
                          >
                            <span className="block truncate text-[13px] font-semibold text-slate-100">{cli.name}</span>
                            <span className="block truncate text-[9px] text-slate-400">{cli.command}</span>
                          </button>

                          <div className="mt-0.5 flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onOpenCliInteraction(cli)}
                              aria-label={`Start ${cli.name}`}
                              title="Start Session"
                              className="flex h-5 w-5 items-center justify-center rounded border border-cyber-neon/70 text-cyber-neon transition hover:bg-cyber-neon/10"
                            >
                              <PlayIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() => onEditCli(cli)}
                              aria-label={`Edit ${cli.name}`}
                              title="Edit CLI"
                              className="flex h-5 w-5 items-center justify-center rounded border border-cyber-electric/60 text-cyber-electric transition hover:bg-cyber-electric/10"
                            >
                              <EditIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteCli(cli)}
                              aria-label={`Delete ${cli.name}`}
                              title="Delete CLI"
                              className="flex h-5 w-5 items-center justify-center rounded border border-cyber-warn/60 text-cyber-warn transition hover:bg-cyber-warn/10"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Active Tab: Settings */}
        {activeTab === 'settings' && (
          <div className="flex h-full flex-col overflow-hidden">
            <div className="flex shrink-0 items-center justify-between border-b border-cyber-line p-4">
              <h2 className="font-display text-xs uppercase tracking-[0.2em] text-cyber-neon font-bold">Settings</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <h3 className="font-display text-xs uppercase tracking-wider text-slate-400 mb-2 font-bold">Theme Settings</h3>
                <label className="flex items-center justify-between rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-3 text-xs text-slate-200 transition hover:border-cyber-neon/80">
                  <span className="font-semibold">App Theme</span>
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

              <div>
                <h3 className="font-display text-xs uppercase tracking-wider text-slate-400 mb-2 font-bold">System Status</h3>
                <div className="rounded-lg border border-cyber-line/40 bg-cyber-base/20 p-3 space-y-2 text-[11px] leading-relaxed text-slate-400 font-mono">
                  <div className="flex justify-between">
                    <span>Active CLI:</span>
                    <span className="text-cyber-electric font-semibold">{activeCli || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total CLIs:</span>
                    <span className="text-slate-300 font-semibold">{clis.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
