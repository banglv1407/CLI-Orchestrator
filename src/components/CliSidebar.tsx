import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { CliDefinition, SessionInfo, FileEntry, AppTheme, AssistantState, LlmConfig, LlmChatMessage, SshConnection, GitStatusEntry } from '../types';
import { loadApiHistory, clearApiHistory, type ApiHistoryEntry, METHOD_COLORS } from '../lib/api-history';
import { ALL_PETS, getActivePetId, setActivePetId, getPetEnabled, setPetEnabled } from '../lib/mythical-pets';
import { LlmConfigModal } from './LlmConfigModal';

import { 
  listDirectoryFiles, 
  pickFolder,
  sendCliInput,
  readFileContent,
  writeFileContent,
  openWorkspaceFolder,
  getGitStatus,
  getGitDiff,
  listSshDirectoryFiles,
  listAllFilesRecursive,
  listSshFilesRecursive,
  startSshServer,
  stopSshServer,
  getSshServerStatus,
  getSshServerConfig,
  saveSshServerConfig,
  type SshServerConfig,
} from '../lib/tauri';

// --- SVG Icons ---

function RemoteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
    </svg>
  );
}

function ApiIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
  );
}

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

function QuickAppsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
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
  setAssistantState?: (state: AssistantState) => void;
  setAssistantText?: (text: string) => void;

  sshConnections: SshConnection[];
  onConnectSsh: (connection: SshConnection) => void;
  onConnectRdp: (connection: SshConnection) => void;
  onAddSsh: () => void;
  onEditSsh: (connection: SshConnection) => void;
  onDeleteSsh: (connection: SshConnection) => void;

  selectedFilePath: string | null;
  gitStatusList: GitStatusEntry[];
  refreshGitStatus: (repo: string) => Promise<void>;
  onFileClick: (entry: FileEntry, rootPath: string | null) => Promise<void>;
  onCloseFile: () => void;
  onQuickAppsTabChange?: (isActive: boolean) => void;
  onApiClientTabChange?: (isActive: boolean) => void;
}

type SidebarTab = 'explorer' | 'cli-manager' | 'quickapps' | 'settings' | 'ai-chat' | 'operator' | 'remote' | 'readme' | 'apiclient';


function ApiHistoryList() {
  const [history, setHistory] = useState<ApiHistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { setHistory(loadApiHistory()); }, []);

  const handlerRef = useRef<EventListener>(null!);
  if (!handlerRef.current) {
    handlerRef.current = (e: Event) => {
      setHistory((e as CustomEvent<ApiHistoryEntry[]>).detail);
    };
  }
  useEffect(() => {
    window.addEventListener('apiclient-history-changed', handlerRef.current);
    return () => window.removeEventListener('apiclient-history-changed', handlerRef.current);
  }, []);

  const handleClear = () => { clearApiHistory(); setHistory([]); };
  const handleSelect = (entry: ApiHistoryEntry) => {
    window.dispatchEvent(new CustomEvent('apiclient-history-select', { detail: entry }));
  };

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const q = searchQuery.toLowerCase();
    return history.filter((entry) =>
      entry.url.toLowerCase().includes(q) ||
      entry.method.toLowerCase().includes(q)
    );
  }, [history, searchQuery]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-cyber-line p-4">
        <h2 className="font-display text-xs uppercase tracking-[0.2em] text-cyber-neon font-bold">API History</h2>
        <button type="button" onClick={handleClear} className="rounded border border-cyber-line/40 px-2 py-0.5 text-[9px] font-semibold text-slate-400 hover:text-red-400 hover:border-red-400/40 transition uppercase">Clear</button>
      </div>
      {/* Search Box */}
      <div className="shrink-0 p-2 border-b border-cyber-line/50">
        <div className="relative">
          <input
            type="text"
            placeholder="Search URL or method..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded border border-cyber-line bg-cyber-base pl-3 pr-8 py-1.5 text-slate-200 placeholder-slate-500 outline-none transition focus:border-cyber-electric text-[11px]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-6 text-center text-[11px] text-slate-600">No requests yet.<br/><span className="text-[10px]">Send a request from the API Client to see it here.</span></div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-6 text-center text-[11px] text-slate-600">No results for "{searchQuery}".</div>
        ) : (
          filteredHistory.map((entry, idx) => (
            <button key={entry.url + entry.method + idx} type="button" onClick={() => handleSelect(entry)} className="w-full text-left px-4 py-2.5 border-b border-cyber-line/20 hover:bg-cyber-neon/5 transition flex items-start gap-2 group">
              <span className="text-[10px] font-bold font-mono mt-px shrink-0 min-w-[44px]" style={{ color: METHOD_COLORS[entry.method] }}>{entry.method}</span>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-slate-300 truncate font-mono leading-tight">{entry.url}</div>
                <div className="text-[9px] text-slate-600 mt-0.5 flex items-center gap-2">
                  <span>{new Date(entry.timestamp).toLocaleString()}</span>
                  {entry.headers?.length > 0 && <span className="text-cyber-electric/60">{entry.headers.length}h</span>}
                  {entry.params?.length > 0 && <span className="text-cyber-neon/60">{entry.params.length}p</span>}
                  {entry.body && <span className="text-slate-500">{'·'} body</span>}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}



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
  setAssistantState,
  setAssistantText,

  sshConnections,
  onConnectSsh,
  onConnectRdp,
  onAddSsh,
  onEditSsh,
  onDeleteSsh,

  selectedFilePath,
  gitStatusList,
  refreshGitStatus,
  onFileClick,
  onCloseFile,
  onQuickAppsTabChange,
  onApiClientTabChange,
}: CliSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('cli-manager');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('ai-cli-sidebar-collapsed') === 'true';
  });

  // Pet state (for Settings picker)
  const [petId, setPetIdLocal] = useState(getActivePetId);
  const [petEnabled, setPetEnabledLocal] = useState(getPetEnabled);

  const handleSetActiveTab = useCallback((tab: SidebarTab) => {
    if (activeTab === tab && !isSidebarCollapsed) {
      setIsSidebarCollapsed(true);
      localStorage.setItem('ai-cli-sidebar-collapsed', 'true');
    } else {
      setIsSidebarCollapsed(false);
      localStorage.setItem('ai-cli-sidebar-collapsed', 'false');
      const wasQuickApps = activeTab === 'quickapps';
      const isQuickApps = tab === 'quickapps';
      const wasApiClient = activeTab === 'apiclient';
      const isApiClient = tab === 'apiclient';
      setActiveTab(tab);
      if (onQuickAppsTabChange && wasQuickApps !== isQuickApps) {
        onQuickAppsTabChange(isQuickApps);
      }
      if (onApiClientTabChange && wasApiClient !== isApiClient) {
        onApiClientTabChange(isApiClient);
      }
    }
  }, [activeTab, isSidebarCollapsed, onQuickAppsTabChange, onApiClientTabChange]);

  // Listen for pet click → open AI chat
  useEffect(() => {
    const handler = () => handleSetActiveTab('ai-chat');
    window.addEventListener('mythical-pet-click', handler);
    return () => window.removeEventListener('mythical-pet-click', handler);
  }, [handleSetActiveTab]);

  // --- Sidebar Resizer Code ---
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('ai-cli-sidebar-width');
    return saved ? parseInt(saved, 10) : 320;
  });

  const isResizingRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      if (e.clientX < 120) {
        setIsSidebarCollapsed(true);
        localStorage.setItem('ai-cli-sidebar-collapsed', 'true');
        return;
      }
      const newWidth = Math.max(220, Math.min(e.clientX, 800));
      setSidebarWidth(newWidth);
      setIsSidebarCollapsed(false);
      localStorage.setItem('ai-cli-sidebar-collapsed', 'false');
    };

    const handleMouseUp = () => {
      if (isResizingRef.current) {
        isResizingRef.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        localStorage.setItem('ai-cli-sidebar-width', String(sidebarWidth));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [sidebarWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // --- SSH VM Manager States ---
  const [sshSearchQuery, setSshSearchQuery] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // --- SSH Remote Server States & Actions ---
  const [sshServerRunning, setSshServerRunning] = useState(false);
  const [sshServerPort, setSshServerPort] = useState(2222);
  const [sshServerIp, setSshServerIp] = useState('127.0.0.1');
  const [sshServerLoading, setSshServerLoading] = useState(false);
  const [sshServerErr, setSshServerErr] = useState<string | null>(null);
  const [sshServerLogs, setSshServerLogs] = useState<string[]>([]);
  const [sshServerConfig, setSshServerConfig] = useState<SshServerConfig>({
    username: 'admin',
    password: 'admin',
    publicKeys: [],
  });
  const [newPublicKey, setNewPublicKey] = useState('');

  const fetchSshServerStatus = useCallback(async () => {
    try {
      const status = await getSshServerStatus();
      setSshServerRunning(status.running);
      setSshServerPort(status.port);
      setSshServerIp(status.localIp);
      setSshServerLogs(status.logs);
    } catch (err) {
      console.error('Failed to get SSH server status:', err);
    }
  }, []);

  const fetchSshServerConfig = useCallback(async () => {
    try {
      const config = await getSshServerConfig();
      setSshServerConfig(config);
    } catch (err) {
      console.error('Failed to get SSH server config:', err);
    }
  }, []);

  useEffect(() => {
    fetchSshServerStatus();
    if (activeTab === 'remote') {
      fetchSshServerConfig();
    }
    let interval: any = null;
    if (activeTab === 'remote') {
      interval = setInterval(fetchSshServerStatus, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, fetchSshServerStatus, fetchSshServerConfig]);

  const handleUpdateSshConfig = async (updated: SshServerConfig) => {
    try {
      await saveSshServerConfig(updated);
      setSshServerConfig(updated);
    } catch (err: any) {
      console.error('Failed to save SSH server config:', err);
      setSshServerErr(err?.message || String(err));
    }
  };

  const handleToggleSshServer = async () => {
    setSshServerLoading(true);
    setSshServerErr(null);
    try {
      if (sshServerRunning) {
        await stopSshServer();
        setSshServerRunning(false);
      } else {
        await startSshServer(sshServerPort);
        setSshServerRunning(true);
      }
      await fetchSshServerStatus();
    } catch (err: any) {
      console.error('Failed to toggle SSH server:', err);
      setSshServerErr(err?.message || String(err));
    } finally {
      setSshServerLoading(false);
    }
  };

  // Auto-switch to Explorer tab when an active session changes and has a workingDir
  useEffect(() => {
    if (activeSessionId) {
      const activeSess = sessions.find((s) => s.id === activeSessionId);
      if (activeSess?.workingDir) {
        setActiveTab('explorer');
      }
    }
  }, [activeSessionId, sessions]);

  // --- LLM Chat States & Handlers ---
  const DEFAULT_LLM_CONFIG: LlmConfig = {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    apiKey: '',
    headers: {
      'User-Agent': 'AI-CLI-Orchestrator'
    },
    systemPrompt: 'You are an intelligent terminal companion helping developers with their terminal commands and daily programming tasks. Keep your answers concise, practical and optimized.',
    stream: false
  };

  const [llmConfig, setLlmConfig] = useState<LlmConfig>(() => {
    const saved = localStorage.getItem('ai-cli-llm-config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return DEFAULT_LLM_CONFIG;
  });

  const [chatHistory, setChatHistory] = useState<LlmChatMessage[]>(() => {
    const saved = localStorage.getItem('ai-cli-llm-history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [chatInput, setChatInput] = useState('');
  const [isLoadingLlm, setIsLoadingLlm] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  // Auto-scroll toggle for the AI chat list. Persisted so the choice survives reloads.
  // Default ON (most users want it), but Boss and other power users can flip it off to
  // freely scroll back through older replies without being yanked to the bottom on each
  // new message. Lives next to Config/Clear in the chat header.
  const [autoScrollChat, setAutoScrollChat] = useState<boolean>(() => {
    const saved = localStorage.getItem('ai-cli-auto-scroll-chat');
    if (saved !== null) {
      return saved === 'true';
    }
    return true;
  });
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  // Track whether the user is "near the bottom" of the chat list.
  // Only auto-scroll on new messages when this is true — otherwise the
  // user is reading older content and we'd yank them away from it.
  const isNearBottomRef = useRef<boolean>(true);

  // Keep `isNearBottom` in sync with the actual scroll position.
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    const handleScroll = () => {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      isNearBottomRef.current = distanceFromBottom < 50;
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    // Initialize once in case the container is already scrolled (e.g. on remount).
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll on new messages, but only if auto-scroll is enabled AND the user
  // is already at (or near) the bottom. If they've scrolled up to read older
  // messages, leave them alone. The autoScrollChat flag lets the user opt out
  // entirely via the header toggle.
  useEffect(() => {
    if (autoScrollChat && isNearBottomRef.current) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isLoadingLlm, autoScrollChat]);

  const handleToggleAutoScroll = () => {
    setAutoScrollChat((prev) => {
      const next = !prev;
      localStorage.setItem('ai-cli-auto-scroll-chat', String(next));
      // When the user re-enables auto-scroll and is currently parked at the bottom,
      // jump them straight to the latest message so the state matches the toggle.
      if (next && isNearBottomRef.current) {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
      return next;
    });
  };

  const handleSaveLlmConfig = (newConfig: LlmConfig) => {
    setLlmConfig(newConfig);
    localStorage.setItem('ai-cli-llm-config', JSON.stringify(newConfig));
    if (setAssistantState && setAssistantText) {
      setAssistantState('Done');
      setAssistantText('LLM configuration saved successfully!');
    }
  };

  const handleClearChat = () => {
    setChatHistory([]);
    localStorage.removeItem('ai-cli-llm-history');
    if (setAssistantState && setAssistantText) {
      setAssistantState('Done');
      setAssistantText('Chat history cleared.');
    }
  };

  const sendLlmMessage = async (userMessageContent: string) => {
    if (isLoadingLlm) return;

    const userMsg: LlmChatMessage = {
      role: 'user',
      content: userMessageContent,
      timestamp: new Date().toLocaleTimeString(),
    };

    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    localStorage.setItem('ai-cli-llm-history', JSON.stringify(newHistory));

    setIsLoadingLlm(true);
    if (setAssistantState && setAssistantText) {
      setAssistantState('Thinking');
      setAssistantText('AI Companion is processing your request...');
    }

    try {
      const contextMessages = newHistory.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const reply = await invoke<string>('send_llm_chat', {
        request: {
          baseUrl: llmConfig.baseUrl,
          model: llmConfig.model,
          apiKey: llmConfig.apiKey,
          headers: llmConfig.headers,
          systemPrompt: llmConfig.systemPrompt,
          messages: contextMessages,
          stream: llmConfig.stream ?? false,
        },
      });

      const assistantMsg: LlmChatMessage = {
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString(),
      };

      const updatedHistory = [...newHistory, assistantMsg];
      setChatHistory(updatedHistory);
      localStorage.setItem('ai-cli-llm-history', JSON.stringify(updatedHistory));

      setIsLoadingLlm(false);
      if (setAssistantState && setAssistantText) {
        setAssistantState('Done');
        setAssistantText(reply.length > 50 ? `${reply.slice(0, 50)}...` : reply);
        setTimeout(() => {
          setAssistantState('Idle');
        }, 4000);
      }
    } catch (error) {
      console.error('LLM request failed:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      const assistantMsg: LlmChatMessage = {
        role: 'assistant',
        content: `Error: ${errorMsg}\n\nPlease check your LLM configuration, custom API endpoint URL, network connections, or headers (User-Agent).`,
        timestamp: new Date().toLocaleTimeString(),
      };

      const updatedHistory = [...newHistory, assistantMsg];
      setChatHistory(updatedHistory);
      localStorage.setItem('ai-cli-llm-history', JSON.stringify(updatedHistory));
      
      setIsLoadingLlm(false);
      if (setAssistantState && setAssistantText) {
        setAssistantState('Error');
        setAssistantText(`LLM Error: ${errorMsg}`);
      }
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoadingLlm) return;

    const userMessageContent = chatInput.trim();
    setChatInput('');
    await sendLlmMessage(userMessageContent);
  };

  useEffect(() => {
    const handleExplainEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const textToExplain = customEvent.detail;
      if (textToExplain) {
        setActiveTab('ai-chat');
        const promptText = `Hãy giải thích chi tiết đoạn mã hoặc văn bản sau đây:\n\n\`\`\`\n${textToExplain}\n\`\`\``;
        void sendLlmMessage(promptText);
      }
    };

    window.addEventListener('explain-text', handleExplainEvent);
    return () => window.removeEventListener('explain-text', handleExplainEvent);
  }, [chatHistory, llmConfig, isLoadingLlm]);

  // CLI Manager States
  const [showCliList, setShowCliList] = useState(true);

  // Explorer States
  const [customFolder, setCustomFolder] = useState<string | null>(null);

  // Active workspace calculation
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const isSshSession = !!activeSession?.cliName.startsWith('SSH: ');
  const sshConnectionName = isSshSession ? activeSession?.cliName.slice(5) : null;
  const sshConnection = sshConnections.find((c) => c.name === sshConnectionName);

  const rootPath = isSshSession 
    ? (activeSession?.workingDir || sshConnection?.workingDir || '.') 
    : (activeSession?.workingDir || customFolder);

  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>({});
  const [cachedFiles, setCachedFiles] = useState<Record<string, FileEntry[]>>({});

  // Ctrl+P search states
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [allFiles, setAllFiles] = useState<FileEntry[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Ctrl+P global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab === 'explorer' && e.ctrlKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // Load recursive files when search opens
  useEffect(() => {
    if (!isSearchModalOpen || !rootPath) {
      setAllFiles([]);
      setSearchQuery('');
      setSelectedIndex(0);
      return;
    }

    setIsSearchLoading(true);
    if (isSshSession && sshConnection) {
      listSshFilesRecursive(sshConnection, rootPath)
        .then((files) => {
          setAllFiles(files);
        })
        .catch((err) => {
          console.error('Failed to load recursive SSH files:', err);
        })
        .finally(() => {
          setIsSearchLoading(false);
        });
    } else {
      listAllFilesRecursive(rootPath)
        .then((files) => {
          setAllFiles(files);
        })
        .catch((err) => {
          console.error('Failed to load recursive local files:', err);
        })
        .finally(() => {
          setIsSearchLoading(false);
        });
    }
  }, [isSearchModalOpen, rootPath, isSshSession, sshConnection]);

  // Filtered files list
  const filteredFiles = useMemo(() => {
    if (!searchQuery) {
      return allFiles.slice(0, 50);
    }
    const q = searchQuery.toLowerCase();
    return allFiles
      .filter((file) => {
        return file.name.toLowerCase().includes(q) || file.path.toLowerCase().includes(q);
      })
      .slice(0, 50);
  }, [allFiles, searchQuery]);

  // Reset selection index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Keep ref of cachedFiles to check if directories are pre-loaded without triggering effect
  const cachedFilesRef = useRef(cachedFiles);
  useEffect(() => {
    cachedFilesRef.current = cachedFiles;
  }, [cachedFiles]);

  // Expand parent directories when a file is selected (e.g. from Ctrl+P search)
  useEffect(() => {
    if (!selectedFilePath || !rootPath) return;

    const getParentPaths = (filePath: string, root: string) => {
      const paths: string[] = [];
      let current = filePath;
      while (true) {
        const lastSlash = Math.max(current.lastIndexOf('/'), current.lastIndexOf('\\'));
        if (lastSlash === -1 || lastSlash <= root.length) {
          break;
        }
        current = current.substring(0, lastSlash);
        if (current.length >= root.length) {
          paths.push(current);
        } else {
          break;
        }
      }
      return paths.reverse();
    };

    const parents = getParentPaths(selectedFilePath, rootPath);
    if (parents.length === 0) return;

    const loadParents = async () => {
      let changedCached = false;
      const cachedUpdates: Record<string, FileEntry[]> = {};

      for (const parent of parents) {
        const isAlreadyCached = cachedFilesRef.current[parent] || cachedUpdates[parent];
        if (!isAlreadyCached) {
          try {
            const files = isSshSession && sshConnection
              ? await listSshDirectoryFiles(sshConnection, parent)
              : await listDirectoryFiles(parent);
            cachedUpdates[parent] = files;
            changedCached = true;
          } catch (e) {
            console.error(`Failed to preload parent dir ${parent}:`, e);
          }
        }
      }

      setExpandedPaths((prev) => {
        const next = { ...prev };
        parents.forEach((p) => {
          next[p] = true;
        });
        return next;
      });

      if (changedCached) {
        setCachedFiles((prev) => ({ ...prev, ...cachedUpdates }));
      }
    };

    void loadParents();
  }, [selectedFilePath, rootPath, isSshSession, sshConnection]);

  // Accordion Panel States
  const [workspaceFilesExpanded, setWorkspaceFilesExpanded] = useState(true);
  const [gitDiffExpanded, setGitDiffExpanded] = useState(false);



  // Path helper
  const getRelativePath = (fullPath: string, root: string) => {
    let rel = fullPath.replace(root, '');
    rel = rel.replace(/^[/\\]+/, '');
    return rel.replace(/\\/g, '/');
  };

  // Sync loading root files
  useEffect(() => {
    if (rootPath) {
      if (isSshSession && sshConnection) {
        listSshDirectoryFiles(sshConnection, rootPath)
          .then((files) => {
            setCachedFiles((prev) => ({ ...prev, [rootPath]: files }));
          })
          .catch((e) => console.error('Failed to load remote SSH root files:', e));
      } else {
        listDirectoryFiles(rootPath)
          .then((files) => {
            setCachedFiles((prev) => ({ ...prev, [rootPath]: files }));
          })
          .catch((e) => console.error('Failed to load root files:', e));
      }
      
      if (gitDiffExpanded && !isSshSession) {
        void refreshGitStatus(rootPath);
      }
    }
  }, [rootPath, gitDiffExpanded, refreshGitStatus, isSshSession, sshConnection]);

  // Clear expanded subfolders when root workspace changes
  useEffect(() => {
    setExpandedPaths({});
  }, [rootPath]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredFiles.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredFiles.length) % Math.max(1, filteredFiles.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredFiles[selectedIndex];
      if (selected) {
        onFileClick(selected, rootPath);
        setIsSearchModalOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsSearchModalOpen(false);
    }
  };

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
        if (isSshSession && sshConnection) {
          const files = await listSshDirectoryFiles(sshConnection, path);
          setCachedFiles((prev) => ({ ...prev, [path]: files }));
        } else {
          const files = await listDirectoryFiles(path);
          setCachedFiles((prev) => ({ ...prev, [path]: files }));
        }
      } catch (e) {
        console.error('Failed to load subfolder:', e);
      }
    }

    setExpandedPaths((prev) => ({
      ...prev,
      [path]: !isExpanded,
    }));
  };



  // Recursive Tree Node Renderer
  const renderFileNode = (entry: FileEntry, depth: number) => {
    const isExpanded = !!expandedPaths[entry.path];
    const children = cachedFiles[entry.path] ?? [];

    const relPath = rootPath ? getRelativePath(entry.path, rootPath) : '';
    const gitItem = gitStatusList.find((g) => g.path === relPath);
    
    // Style and badge depending on Git status
    let gitBadge = null;
    let gitTextClass = 'text-slate-300 hover:text-white';
    
    if (gitItem && !entry.isDir) {
      if (gitItem.status === 'modified') {
        gitBadge = <span className="ml-auto text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 font-mono scale-90 select-none">M</span>;
        gitTextClass = 'text-amber-300 hover:text-amber-200';
      } else if (gitItem.status === 'added') {
        gitBadge = <span className="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20 font-mono scale-90 select-none">A</span>;
        gitTextClass = 'text-emerald-300 hover:text-emerald-200';
      } else if (gitItem.status === 'untracked') {
        gitBadge = <span className="ml-auto text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/20 font-mono scale-90 select-none">U</span>;
        gitTextClass = 'text-cyan-300 hover:text-cyan-200';
      } else if (gitItem.status === 'deleted') {
        gitBadge = <span className="ml-auto text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 line-through font-mono scale-90 select-none">D</span>;
        gitTextClass = 'text-rose-400/90 hover:text-rose-300 line-through';
      }
    }

    return (
      <div key={entry.path} className="select-none text-[13px]">
        <button
          type="button"
          onClick={() => (entry.isDir ? handleToggleExpand(entry.path) : void onFileClick(entry, rootPath))}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
          className={`flex w-full items-center gap-2 py-1 pr-3 text-left transition hover:bg-cyber-neon/5 ${
            !entry.isDir
              ? selectedFilePath === entry.path
                ? 'text-cyber-neon bg-cyber-neon/10 font-medium'
                : `${gitTextClass}`
              : 'text-slate-100 font-semibold'
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
          {gitBadge}
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

  // --- SSH VM Grouping and Filtering ---
  const groupedConnections = useMemo(() => {
    const query = sshSearchQuery.toLowerCase().trim();
    const filtered = sshConnections.filter((conn) => {
      if (!query) return true;
      return (
        conn.name.toLowerCase().includes(query) ||
        conn.host.toLowerCase().includes(query) ||
        conn.user.toLowerCase().includes(query) ||
        conn.group.toLowerCase().includes(query) ||
        (conn.protocol || 'ssh').toLowerCase().includes(query)
      );
    });

    const groups: Record<string, SshConnection[]> = {};
    filtered.forEach((conn) => {
      const g = conn.group || 'Default';
      if (!groups[g]) {
        groups[g] = [];
      }
      groups[g].push(conn);
    });
    return groups;
  }, [sshConnections, sshSearchQuery]);

  return (
    <div
      className="relative flex h-full shrink-0 border-r border-cyber-line bg-cyber-panel/75 backdrop-blur transition-all duration-300 ease-in-out"
      style={{ width: isSidebarCollapsed ? '56px' : `${sidebarWidth}px` }}
    >
      {/* Resizable drag handle bar */}
      {!isSidebarCollapsed && (
        <div
          onMouseDown={handleMouseDown}
          onDoubleClick={() => {
            setIsSidebarCollapsed(true);
            localStorage.setItem('ai-cli-sidebar-collapsed', 'true');
          }}
          className="absolute top-0 right-0 bottom-0 w-1.5 cursor-col-resize hover:bg-cyber-neon/40 active:bg-cyber-neon transition-colors z-50"
        />
      )}
      {/* 1. Left-most Activity Bar (VSCode Style) */}
      <nav className="flex h-full w-14 flex-col items-center justify-between border-r border-cyber-line/50 bg-cyber-base/70 py-4 shrink-0">
        <div className="flex flex-col gap-5">
          <button
            type="button"
            onClick={() => handleSetActiveTab('cli-manager')}
            title="CLI Orchestrator"
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
              activeTab === 'cli-manager' && !isSidebarCollapsed
                ? 'text-cyber-electric bg-cyber-electric/10 shadow-neon-blue-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'cli-manager' && !isSidebarCollapsed && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-electric" />
            )}
            <TerminalIcon />
          </button>
 
          <button
            type="button"
            onClick={() => handleSetActiveTab('explorer')}
            title="File Explorer"
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
              activeTab === 'explorer' && !isSidebarCollapsed
                ? 'text-cyber-neon bg-cyber-neon/10 shadow-neon-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'explorer' && !isSidebarCollapsed && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-neon" />
            )}
            <ExplorerIcon />
          </button>
 
          <button
            type="button"
            onClick={() => handleSetActiveTab('quickapps')}
            title="Quick Apps (favorite apps launcher)"
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
              activeTab === 'quickapps' && !isSidebarCollapsed
                ? 'text-cyber-electric bg-cyber-electric/10 shadow-neon-blue-sm'
                : 'text-slate-400 hover:text-cyber-electric hover:bg-cyber-electric/10'
            }`}
          >
            {activeTab === 'quickapps' && !isSidebarCollapsed && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-electric" />
            )}
            <QuickAppsIcon />
          </button>
 
          <button
            type="button"
            onClick={() => handleSetActiveTab('operator')}
            title="Operator (SSH VM Manager)"
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
              activeTab === 'operator' && !isSidebarCollapsed
                ? 'text-cyber-electric bg-cyber-electric/10 shadow-neon-blue-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'operator' && !isSidebarCollapsed && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-electric" />
            )}
            <CloudIcon />
          </button>

          <button
            type="button"
            onClick={() => handleSetActiveTab('remote')}
            title="Remote SSH Server"
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
              activeTab === 'remote' && !isSidebarCollapsed
                ? 'text-cyber-neon bg-cyber-neon/10 shadow-neon-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'remote' && !isSidebarCollapsed && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-neon" />
            )}
            <RemoteIcon />
          </button>

          <button
            type="button"
            onClick={() => handleSetActiveTab('apiclient')}
            title="API Client (Postman-like)"
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
              activeTab === 'apiclient' && !isSidebarCollapsed
                ? 'text-cyber-neon bg-cyber-neon/10 shadow-neon-sm'
                : 'text-slate-400 hover:text-cyber-neon hover:bg-cyber-neon/10'
            }`}
          >
            {activeTab === 'apiclient' && !isSidebarCollapsed && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-neon" />
            )}
            <ApiIcon />
          </button>
        </div>
 
        <div className="flex flex-col gap-4 items-center">
          <button
            type="button"
            onClick={() => handleSetActiveTab('readme')}
            title="User Guide"
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
              activeTab === 'readme' && !isSidebarCollapsed
                ? 'text-cyber-neon bg-cyber-neon/10 shadow-neon-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'readme' && !isSidebarCollapsed && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-neon" />
            )}
            <BookOpenIcon />
          </button>

          <button
            type="button"
            onClick={() => handleSetActiveTab('settings')}
            title="Settings"
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
              activeTab === 'settings' && !isSidebarCollapsed
                ? 'text-cyber-neon bg-cyber-neon/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'settings' && !isSidebarCollapsed && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-neon" />
            )}
            <SettingsIcon />
          </button>
        </div>
      </nav>
 
      {/* 2. Primary Sidebar Panel Content */}
      {!isSidebarCollapsed && (
        <aside className="flex flex-1 flex-col overflow-hidden">

        {/* Active Tab: Explorer */}
        {activeTab === 'explorer' && (
          <div className="flex h-full flex-col overflow-hidden">
            {/* Accordion Panels Container */}
            <div
              className="flex flex-col overflow-hidden shrink-0 flex-1 pr-1.5"
            >
              {rootPath ? (
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Panel 1: Workspace Files */}
                  <div className={`flex flex-col overflow-hidden ${workspaceFilesExpanded ? 'flex-1 min-h-[100px]' : 'shrink-0'}`}>
                    <button
                      type="button"
                      onClick={() => setWorkspaceFilesExpanded(!workspaceFilesExpanded)}
                      className="flex w-full items-center justify-between border-b border-cyber-line/45 bg-cyber-base/40 px-4 py-2 hover:bg-cyber-base/70 transition select-none"
                    >
                      <div className="flex items-center gap-2">
                        <FolderArrowIcon isExpanded={workspaceFilesExpanded} />
                        <span className="font-display text-[9px] uppercase font-bold tracking-[0.15em] text-slate-300">Workspace Files</span>
                      </div>
                      <span className="truncate max-w-[120px] font-mono text-[9px] font-semibold text-cyber-electric/80" title={rootPath}>
                        {rootPath.split(/[/\\]/).pop() || rootPath}
                      </span>
                    </button>
                    
                    {workspaceFilesExpanded && (
                      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
                        {(cachedFiles[rootPath] ?? []).map((entry) => renderFileNode(entry, 0))}
                      </div>
                    )}
                  </div>

                  {/* Panel 2: Git Diff (Changes) */}
                  <div className={`flex flex-col overflow-hidden border-t border-cyber-line/30 ${gitDiffExpanded ? 'flex-1 min-h-[120px]' : 'shrink-0'}`}>
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = !gitDiffExpanded;
                        setGitDiffExpanded(nextVal);
                        if (nextVal && rootPath) {
                          void refreshGitStatus(rootPath);
                        }
                      }}
                      className="flex w-full items-center justify-between border-b border-cyber-line/45 bg-cyber-base/40 px-4 py-2 hover:bg-cyber-base/70 transition select-none"
                    >
                      <div className="flex items-center gap-2">
                        <FolderArrowIcon isExpanded={gitDiffExpanded} />
                        <span className="font-display text-[9px] uppercase font-bold tracking-[0.15em] text-slate-300">Git Diff (Changes)</span>
                      </div>
                      {gitStatusList.length > 0 && (
                        <span className="rounded bg-cyber-neon/15 px-1.5 py-0.2 text-[8px] font-bold text-cyber-neon border border-cyber-neon/30 font-mono">
                          {gitStatusList.length}
                        </span>
                      )}
                    </button>

                    {gitDiffExpanded && (
                      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
                        {gitStatusList.length === 0 ? (
                          <p className="px-4 py-3 text-xs italic text-slate-500 font-mono">No changed files in workspace.</p>
                        ) : (
                          <div className="space-y-0.5">
                            {gitStatusList.map((gitItem) => {
                              const entry: FileEntry = {
                                name: gitItem.path.split('/').pop() || gitItem.path,
                                path: rootPath + '/' + gitItem.path,
                                isDir: false
                              };
                              const isActive = selectedFilePath === entry.path;
                              
                              let statusBadge = '';
                              let textClass = 'text-slate-300 hover:text-white';
                              if (gitItem.status === 'modified') {
                                statusBadge = 'M';
                                textClass = 'text-amber-300 hover:text-amber-200 hover:bg-amber-400/5';
                              } else if (gitItem.status === 'added') {
                                statusBadge = 'A';
                                textClass = 'text-emerald-300 hover:text-emerald-200 hover:bg-emerald-400/5';
                              } else if (gitItem.status === 'untracked') {
                                statusBadge = 'U';
                                textClass = 'text-cyan-300 hover:text-cyan-200 hover:bg-cyan-400/5';
                              } else if (gitItem.status === 'deleted') {
                                statusBadge = 'D';
                                textClass = 'text-rose-400 hover:text-rose-300 hover:bg-rose-400/5 line-through';
                              }

                              return (
                                <button
                                  key={gitItem.path}
                                  type="button"
                                  onClick={() => void onFileClick(entry, rootPath)}
                                  className={`flex w-full items-center justify-between px-4 py-1.5 text-left transition text-xs font-mono border-b border-cyber-line/10 ${
                                    isActive 
                                      ? 'bg-cyber-neon/10 text-cyber-neon border-l-2 border-cyber-neon pl-3.5' 
                                      : `${textClass}`
                                  }`}
                                >
                                  <div className="flex flex-col min-w-0">
                                    <span className="truncate font-semibold text-slate-200">{entry.name}</span>
                                    <span className="truncate text-[8px] text-slate-500 font-mono mt-0.5" title={gitItem.path}>{gitItem.path}</span>
                                  </div>
                                  <span className={`text-[9px] font-bold px-1 py-0.2 rounded border font-mono scale-90 ${
                                    gitItem.status === 'modified' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' :
                                    gitItem.status === 'added' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' :
                                    gitItem.status === 'untracked' ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' :
                                    'text-rose-500 bg-rose-500/10 border-rose-500/20 line-through'
                                  }`}>
                                    {statusBadge}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
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

        {/* Active Tab: AI Chat */}
        {activeTab === 'ai-chat' && (
          <div className="flex h-full flex-col overflow-hidden">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-cyber-line p-4 bg-cyber-base/20">
              <div>
                <h2 className="font-display text-sm uppercase tracking-[0.2em] text-cyber-neon font-bold">AI Companion</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Intelligent Terminal Assistant</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setConfigModalOpen(true)}
                  className="rounded border border-cyber-electric/40 px-1.5 py-0.5 text-[9px] font-semibold text-cyber-electric transition hover:border-cyber-electric hover:bg-cyber-electric/10"
                >
                  Config
                </button>
                <button
                  type="button"
                  onClick={handleToggleAutoScroll}
                  title={autoScrollChat ? 'Auto-scroll: ON — click to disable' : 'Auto-scroll: OFF — click to enable'}
                  aria-pressed={autoScrollChat}
                  className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold transition ${
                    autoScrollChat
                      ? 'border-cyber-neon/40 text-cyber-neon hover:border-cyber-neon hover:bg-cyber-neon/10'
                      : 'border-slate-500/40 text-slate-500 hover:border-slate-400 hover:bg-slate-400/10'
                  }`}
                >
                  ↓ {autoScrollChat ? 'Auto' : 'Manual'}
                </button>
                {chatHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearChat}
                    className="rounded border border-cyber-warn/40 px-1.5 py-0.5 text-[9px] font-semibold text-cyber-warn transition hover:border-cyber-warn hover:bg-cyber-warn/10"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Chat messages — full height scrollable */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
              {chatHistory.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 py-8">
                  <p className="text-[13px] italic">No messages yet.</p>
                  <p className="mt-1 text-[12px] text-slate-600">Ask me anything about commands or coding!</p>
                </div>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[95%] rounded-lg px-3 py-2 leading-normal ${
                      msg.role === 'user'
                        ? 'bg-cyber-neon/10 border border-cyber-neon/30 text-slate-100 self-end ml-auto'
                        : 'bg-cyber-electric/10 border border-cyber-electric/30 text-slate-200 self-start mr-auto'
                    }`}
                  >
                    <span className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${
                      msg.role === 'user' ? 'text-cyber-neon' : 'text-cyber-electric'
                    }`}>
                      {msg.role === 'user' ? 'You' : 'AI Companion'}
                      <span className="ml-2 font-normal opacity-50">{msg.timestamp}</span>
                    </span>
                    <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">{msg.content}</p>
                  </div>
                ))
              )}
              {isLoadingLlm && (
                <div className="flex items-center gap-2 self-start max-w-[80%] rounded-lg px-3 py-2 bg-cyber-electric/10 border border-cyber-electric/20">
                  <span className="text-[13px] text-cyber-electric italic">AI is thinking</span>
                  <span className="flex gap-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyber-electric animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-cyber-electric animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-cyber-electric animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat input — Shift+Enter = newline, Enter = send */}
            <form onSubmit={handleSendChatMessage} className="shrink-0 border-t border-cyber-line p-3">
              <div className="flex gap-2 items-end">
                <textarea
                  placeholder="Type a message..."
                  value={chatInput}
                  disabled={isLoadingLlm}
                  rows={1}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (!isLoadingLlm && chatInput.trim()) {
                        void handleSendChatMessage(e as unknown as React.FormEvent);
                      }
                    }
                  }}
                  className="flex-1 min-w-0 rounded border border-cyber-line bg-cyber-base px-2 py-1.5 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyber-neon text-[13px] disabled:opacity-50 resize-none overflow-y-auto"
                  style={{ maxHeight: '7rem' }}
                />
                <button
                  type="submit"
                  disabled={isLoadingLlm || !chatInput.trim()}
                  className="shrink-0 rounded border border-cyber-neon bg-cyber-neon/15 px-3 py-1.5 font-bold uppercase text-[11px] text-cyber-neon hover:bg-cyber-neon/25 transition disabled:opacity-30"
                >
                  Send
                </button>
              </div>
              <p className="mt-1 text-[10px] text-slate-600">Enter to send · Shift+Enter for new line</p>
            </form>
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

        {/* Active Tab: Quick Apps — content renders in main area */}
        {activeTab === 'quickapps' && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-cyber-muted p-6">
            <div className="w-14 h-14 rounded-2xl bg-cyber-accent/10 border border-cyber-accent/30 flex items-center justify-center text-2xl">
              🚀
            </div>
            <div className="text-center">
              <p className="text-[13px] font-semibold text-cyber-text">Quick Apps</p>
              <p className="text-[11px] text-cyber-muted mt-1 leading-relaxed">
                Displayed in the main area →
              </p>
            </div>
          </div>
        )}


        {/* Active Tab: API Client History */}
        {activeTab === 'apiclient' && (
          <ApiHistoryList />
        )}

        {/* Active Tab: Operator (SSH VM Manager) */}
        {activeTab === 'operator' && (
          <div className="flex h-full flex-col overflow-hidden">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-cyber-line p-4 bg-cyber-base/20">
              <div>
                <h1 className="font-display text-sm uppercase tracking-[0.2em] text-cyber-electric font-bold">VM Operator</h1>
                <p className="text-[10px] text-slate-400 mt-0.5">SSH connections to your VMs</p>
              </div>
              <button
                type="button"
                onClick={onAddSsh}
                className="rounded border border-cyber-electric/50 px-2 py-1 text-[10px] font-semibold text-cyber-electric transition hover:border-cyber-electric hover:bg-cyber-electric/10 shadow-neon-blue-sm-faint"
              >
                Add VM
              </button>
            </div>

            {/* Search Box */}
            <div className="shrink-0 p-3 border-b border-cyber-line/50">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search VM, host, user or group..."
                  value={sshSearchQuery}
                  onChange={(e) => setSshSearchQuery(e.target.value)}
                  className="w-full rounded border border-cyber-line bg-cyber-base pl-3 pr-8 py-1.5 text-slate-200 placeholder-slate-500 outline-none transition focus:border-cyber-electric text-[11px]"
                />
                {sshSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setSshSearchQuery('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* VM Connection List grouped by Group */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin">
              {Object.keys(groupedConnections).length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 py-8 select-none">
                  <CloudIcon />
                  <p className="mt-4 text-xs font-semibold text-slate-300">No Connections Found</p>
                  <p className="mt-1 text-[11px] text-slate-500 leading-normal">
                    {sshSearchQuery ? 'Try adjusting your search query.' : 'Add your first VM connection above to start.'}
                  </p>
                </div>
              ) : (
                (Object.entries(groupedConnections) as [string, SshConnection[]][]).map(([groupName, conns]) => {
                  const isCollapsed = !!collapsedGroups[groupName];
                  return (
                    <div key={groupName} className="space-y-1">
                      {/* Group Header */}
                      <button
                        type="button"
                        onClick={() => setCollapsedGroups((prev) => ({ ...prev, [groupName]: !isCollapsed }))}
                        className="flex w-full items-center justify-between font-display text-[11px] uppercase tracking-wider text-slate-400 hover:text-slate-200 py-1"
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          <FolderArrowIcon isExpanded={!isCollapsed} />
                          <span>{groupName}</span>
                          <span className="text-[9px] opacity-60 font-semibold lowercase">({conns.length})</span>
                        </div>
                      </button>

                      {/* Group Connection cards */}
                      {!isCollapsed && (
                        <div className="space-y-1.5 pl-2 border-l border-cyber-line/20 ml-1.5 mt-1">
                          {conns.map((conn) => (
                            <div
                              key={conn.id}
                              onDoubleClick={() => conn.protocol === 'rdp' ? onConnectRdp(conn) : onConnectSsh(conn)}
                              className="rounded border border-cyber-line bg-cyber-base/40 px-1.5 py-1.5 transition hover:border-cyber-electric/60 hover:bg-cyber-electric/5 cursor-pointer"
                            >
                              <div className="flex items-start gap-1.5">
                                <div className="min-w-0 flex-1 text-left">
                                  <span className="block truncate text-[11px] font-semibold text-slate-200 leading-tight">{conn.name}</span>
                                  <span className="block truncate text-[9px] text-slate-500 font-mono leading-tight">{conn.user}@{conn.host}:{conn.port}</span>
                                </div>
                                <div className="flex shrink-0 items-center gap-1">
                                  <span className={`rounded border px-1 py-px text-[7px] font-semibold uppercase tracking-wider ${
                                    conn.protocol === 'rdp'
                                      ? 'bg-cyber-electric/10 border-cyber-electric/40 text-cyber-electric'
                                      : 'bg-cyber-neon/10 border-cyber-neon/40 text-cyber-neon'
                                  }`}>
                                    {conn.protocol === 'rdp' ? 'RDP' : conn.authMode === 'key' ? 'KEY' : 'SSH'}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); conn.protocol === 'rdp' ? onConnectRdp(conn) : onConnectSsh(conn); }}
                                    aria-label={conn.protocol === 'rdp' ? `Remote Desktop to ${conn.name}` : `Connect SSH to ${conn.name}`}
                                    title={conn.protocol === 'rdp' ? "Launch RDP" : "Connect SSH"}
                                    className="flex h-5 w-5 items-center justify-center rounded border border-cyber-neon/70 text-cyber-neon transition hover:bg-cyber-neon/10"
                                  >
                                    <PlayIcon />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); onEditSsh(conn); }}
                                    aria-label={`Edit ${conn.name}`}
                                    title="Edit"
                                    className="flex h-5 w-5 items-center justify-center rounded border border-cyber-electric/60 text-cyber-electric transition hover:bg-cyber-electric/10"
                                  >
                                    <EditIcon />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); onDeleteSsh(conn); }}
                                    aria-label={`Delete ${conn.name}`}
                                    title="Delete"
                                    className="flex h-5 w-5 items-center justify-center rounded border border-cyber-warn/60 text-cyber-warn transition hover:bg-cyber-warn/10"
                                  >
                                    <TrashIcon />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Active Tab: Remote SSH Server */}
        {activeTab === 'remote' && (
          <div className="flex h-full flex-col overflow-hidden animate-slide-up">
            <div className="flex shrink-0 items-center justify-between border-b border-cyber-line p-4">
              <h2 className="font-display text-xs uppercase tracking-[0.2em] text-cyber-neon font-bold">Remote Access</h2>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider uppercase ${
                sshServerRunning ? 'bg-cyber-neon/10 text-cyber-neon border border-cyber-neon/30 animate-pulse' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
              }`}>
                {sshServerRunning ? '🟢 Active' : '🔴 Inactive'}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Server Control Card */}
              <div className="rounded-xl border border-cyber-line/50 bg-cyber-panel/40 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">SSH Server</span>
                  <button
                    onClick={handleToggleSshServer}
                    disabled={sshServerLoading}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition ${
                      sshServerRunning
                        ? 'bg-red-500/20 hover:bg-red-500/35 text-red-400 border border-red-500/40 shadow-neon-red-sm'
                        : 'bg-cyber-neon/20 hover:bg-cyber-neon/35 text-cyber-neon border border-cyber-neon/40 shadow-neon-sm'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {sshServerLoading ? 'Processing...' : sshServerRunning ? 'Stop Server' : 'Start Server'}
                  </button>
                </div>

                {sshServerErr && (
                  <div className="text-[10px] text-red-400 bg-red-950/20 border border-red-500/30 p-2.5 rounded-lg font-mono leading-relaxed">
                    ⚠ {sshServerErr}
                  </div>
                )}

                <div className="space-y-3">
                  <label className="block space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Server Port</span>
                    <input
                      type="number"
                      value={sshServerPort}
                      disabled={sshServerRunning}
                      onChange={(e) => setSshServerPort(parseInt(e.target.value, 10) || 2222)}
                      className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-xs font-mono font-semibold text-slate-100 placeholder-slate-500 outline-none focus:border-cyber-neon transition disabled:opacity-50"
                    />
                  </label>
                </div>
              </div>

              {/* Server Configuration Card */}
              <div className="rounded-xl border border-cyber-line/50 bg-cyber-panel/40 p-4 space-y-4">
                <h3 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Server Authentication</h3>
                
                <div className="space-y-3">
                  <label className="block space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Username</span>
                    <input
                      type="text"
                      value={sshServerConfig.username}
                      onChange={(e) => handleUpdateSshConfig({ ...sshServerConfig, username: e.target.value })}
                      placeholder="e.g. admin"
                      className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-xs font-mono font-semibold text-slate-100 placeholder-slate-500 outline-none focus:border-cyber-neon transition"
                    />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Password Auth</span>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={sshServerConfig.password || ''}
                        onChange={(e) => handleUpdateSshConfig({ ...sshServerConfig, password: e.target.value || undefined })}
                        placeholder="Leave empty to disable password login"
                        className="flex-1 rounded border border-cyber-line bg-cyber-base px-3 py-2 text-xs font-mono font-semibold text-slate-100 placeholder-slate-500 outline-none focus:border-cyber-neon transition"
                      />
                      {sshServerConfig.password && (
                        <button
                          type="button"
                          onClick={() => handleUpdateSshConfig({ ...sshServerConfig, password: undefined })}
                          className="px-2.5 py-2 text-xs border border-red-500/30 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 font-bold"
                          title="Disable Password Auth"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </label>

                  {/* Public Keys Section */}
                  <div className="space-y-2 pt-2 border-t border-cyber-line/30">
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Authorized Public Keys ({sshServerConfig.publicKeys.length})</span>
                    
                    {sshServerConfig.publicKeys.length > 0 && (
                      <div className="max-h-24 overflow-y-auto space-y-1.5 scrollbar-thin border border-cyber-line bg-cyber-base/40 p-2 rounded">
                        {sshServerConfig.publicKeys.map((key, index) => (
                          <div key={index} className="flex items-center justify-between text-[9px] font-mono bg-cyber-panel/50 p-1.5 rounded border border-cyber-line/20 text-slate-300">
                            <span className="truncate flex-1 pr-2" title={key}>
                              {key.substring(0, 20)}...{key.substring(key.length - 15)}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedKeys = [...sshServerConfig.publicKeys];
                                updatedKeys.splice(index, 1);
                                handleUpdateSshConfig({ ...sshServerConfig, publicKeys: updatedKeys });
                              }}
                              className="text-red-400 hover:text-red-300 px-1 font-bold text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={newPublicKey}
                        onChange={(e) => setNewPublicKey(e.target.value)}
                        placeholder="Paste ssh-rsa/ssh-ed25519 public key"
                        className="flex-1 rounded border border-cyber-line bg-cyber-base px-2 py-1.5 text-[10px] font-mono text-slate-100 placeholder-slate-500 outline-none focus:border-cyber-neon transition"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newPublicKey.trim()) return;
                          const updatedKeys = [...sshServerConfig.publicKeys, newPublicKey.trim()];
                          handleUpdateSshConfig({ ...sshServerConfig, publicKeys: updatedKeys });
                          setNewPublicKey('');
                        }}
                        className="px-2.5 py-1.5 text-[10px] bg-cyber-neon/20 hover:bg-cyber-neon/35 text-cyber-neon border border-cyber-neon/40 rounded font-bold uppercase tracking-wider"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[9px] text-slate-500 font-medium leading-relaxed italic">
                  💡 Note: Restart the SSH Server to apply authentication changes.
                </div>
              </div>

              {/* Instruction Panel */}
              <div className="rounded-xl border border-cyber-electric/40 bg-cyber-electric/5 p-4 space-y-3">
                <h3 className="text-[10px] uppercase font-bold tracking-wider text-cyber-electric">Connection Instruction</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Other machines on your network can connect directly to your CLX sessions.
                </p>

                <div className="space-y-1.5 font-mono text-[10px]">
                  <div className="text-slate-400 font-semibold">Command:</div>
                  <div className="relative flex items-center justify-between rounded border border-cyber-line/65 bg-[#0d162a] p-2 pr-10 text-cyber-electric select-all">
                    <span>ssh {sshServerConfig.username}@{sshServerIp} -p {sshServerPort}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`ssh ${sshServerConfig.username}@${sshServerIp} -p ${sshServerPort}`);
                        alert('Copied connection command to clipboard!');
                      }}
                      className="absolute right-2 text-slate-500 hover:text-cyber-electric transition"
                      title="Copy command"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                        <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12a1.5 1.5 0 0 1 .439 1.061V16.5A1.5 1.5 0 0 1 15.5 18h-7A1.5 1.5 0 0 1 7 16.5v-13Zm1.5-.5a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V7h-3a1 1 0 0 1-1-1V3H8.5Z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="text-[9px] font-mono leading-relaxed space-y-1 text-slate-500">
                  <div>🔐 Active Credentials:</div>
                  <div>• Username: <span className="text-slate-300 font-bold">{sshServerConfig.username}</span></div>
                  {sshServerConfig.password ? (
                    <div>• Password: <span className="text-slate-300 font-bold">{sshServerConfig.password}</span></div>
                  ) : (
                    <div className="text-red-400">• Password authentication is disabled</div>
                  )}
                  {sshServerConfig.publicKeys.length > 0 && (
                    <div className="text-cyber-neon/80">• Public Key Authentication is active ({sshServerConfig.publicKeys.length} key(s))</div>
                  )}
                </div>
              </div>

              {/* Collaborative details */}
              <div className="rounded-xl border border-cyber-line/30 bg-cyber-base/20 p-3 text-[10px] leading-relaxed text-slate-400 space-y-2">
                <div className="font-bold text-slate-300 flex items-center gap-1.5">
                  <span>💡</span> Collaborative REPL Shell
                </div>
                <p>
                  Connected users enter a custom shell displaying all active sessions. Pressing <span className="text-cyber-neon font-mono font-bold">Ctrl+X</span> or <span className="text-cyber-neon font-mono font-bold">Ctrl+Q</span> detaches from a session.
                </p>
              </div>

              {/* Server Logs */}
              <div className="rounded-xl border border-cyber-line/50 bg-cyber-panel/40 p-4 space-y-3">
                <h3 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Server Logs</h3>
                <div className="h-32 overflow-y-auto scrollbar-thin bg-black/60 rounded border border-cyber-line/30 p-2.5 font-mono text-[9px] text-slate-300 space-y-1 select-text">
                  {sshServerLogs.length === 0 ? (
                    <div className="text-slate-500 italic">No logs yet.</div>
                  ) : (
                    sshServerLogs.map((log, idx) => (
                      <div key={idx} className="leading-relaxed break-all">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Tab: User Guide README */}
        {activeTab === 'readme' && (
          <div className="flex h-full flex-col overflow-hidden animate-slide-up">
            <div className="flex shrink-0 items-center justify-between border-b border-cyber-line p-4">
              <h2 className="font-display text-xs uppercase tracking-[0.2em] text-cyber-neon font-bold">User Guide</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin text-xs text-slate-350 select-text leading-relaxed font-sans">
              
              {/* Introduction */}
              <div className="space-y-2">
                <h3 className="text-cyber-electric font-semibold text-[11px] uppercase tracking-wider font-mono">⚡ Welcome to CLX</h3>
                <p>
                  CLX is an advanced desktop orchestrator for terminal interfaces and AI CLI companions (like aider, gemini-cli, etc.), featuring network collaboration and intelligent terminal overlays.
                </p>
              </div>

              {/* Autocomplete Section */}
              <div className="space-y-2 border-t border-cyber-line/25 pt-4">
                <h3 className="text-cyber-neon font-semibold text-[11px] uppercase tracking-wider font-mono">🔎 Autocomplete overlays</h3>
                <div className="space-y-3 pl-1.5">
                  <div>
                    <span className="text-cyber-neon font-bold font-mono">@ Mention File/Folder:</span>
                    <p className="mt-1">
                      Type <code className="text-cyber-neon bg-cyber-neon/10 px-1 rounded font-mono font-bold">@</code> inside any terminal panel to pop up the local file/folder search. Press <kbd className="bg-cyber-line/50 px-1.5 rounded text-[10px]">Arrow Up/Down</kbd> to navigate, and <kbd className="bg-cyber-line/50 px-1.5 rounded text-[10px]">Enter</kbd> to insert.
                    </p>
                  </div>
                  <div>
                    <span className="text-cyber-electric font-bold font-mono">! Ripgrep Content Search:</span>
                    <p className="mt-1">
                      Type <code className="text-cyber-electric bg-cyber-electric/10 px-1 rounded font-mono font-bold">!</code> to fuzzy search file contents using Ripgrep. Displays matching code snippets and line numbers (<code className="text-cyber-electric font-mono text-[10px]">L12</code>).
                    </p>
                  </div>
                </div>
              </div>

              {/* Collaborative SSH Section */}
              <div className="space-y-2 border-t border-cyber-line/25 pt-4">
                <h3 className="text-cyber-neon font-semibold text-[11px] uppercase tracking-wider font-mono">🤝 Collaborative Remote SSH</h3>
                <p>
                  CLX embeds a high-security <span className="text-cyber-neon font-bold">SSH Server</span> that allows co-programming.
                </p>
                <ul className="list-disc pl-4 space-y-1.5 mt-2">
                  <li>Start the server in the <span className="text-cyber-neon font-bold">Remote</span> sidebar tab.</li>
                  <li>Type <code className="text-cyber-neon font-mono bg-cyber-neon/10 px-1 rounded">ssh admin@&lt;local_ip&gt; -p 2222</code> from another machine (e.g. Termux, Laptop).</li>
                  <li>Log in with default credentials <code className="font-mono bg-cyber-line/25 px-1 rounded">admin / admin</code>.</li>
                  <li>Select a terminal session to attach. Keypresses and screens will sync in real-time between devices!</li>
                  <li>Press <kbd className="bg-cyber-line/50 px-1.5 rounded text-[10px] font-mono">Ctrl + X</kbd> to detach and return to menu.</li>
                </ul>
              </div>

              {/* Quick Apps & Operator Section */}
              <div className="space-y-2 border-t border-cyber-line/25 pt-4">
                <h3 className="text-cyber-neon font-semibold text-[11px] uppercase tracking-wider font-mono">🚀 Favorite & VM Operator</h3>
                <div className="space-y-2.5 pl-1.5">
                  <div>
                    <span className="text-slate-200 font-bold">Quick Apps:</span>
                    <p className="mt-1">
                      Pin and launch favorited CLI scripts or local applications with a single click.
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-200 font-bold">Operator Tab:</span>
                    <p className="mt-1">
                      Manage multiple SSH and RDP configurations for virtual machines or remote servers.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Companion Section */}
              <div className="space-y-2 border-t border-cyber-line/25 pt-4">
                <h3 className="text-cyber-neon font-semibold text-[11px] uppercase tracking-wider font-mono">🤖 AI Companion Chat</h3>
                <p>
                  Click on the character avatar in the sidebar to open the AI Companion Chat. Configure your LLM providers (API key, model, endpoints) to get live commands and programming support.
                </p>
              </div>

              {/* System shortcuts */}
              <div className="space-y-2 border-t border-cyber-line/25 pt-4">
                <h3 className="text-cyber-electric font-semibold text-[11px] uppercase tracking-wider font-mono">⌨ Shortcuts</h3>
                <div className="rounded-lg border border-cyber-line/30 bg-cyber-base/40 p-3 space-y-2 text-[10px] font-mono">
                  <div className="flex justify-between">
                    <span>Ctrl + P</span>
                    <span className="text-cyber-electric font-semibold">Search Files Modal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ctrl + N</span>
                    <span className="text-cyber-electric font-semibold">New Quick Shell</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ctrl + X (SSH)</span>
                    <span className="text-cyber-electric font-semibold">Detach Remote Session</span>
                  </div>
                </div>
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
                    <option value="light">Light</option>
                  </select>
                </label>
              </div>

              {/* Mythical Pet Settings */}
              <div>
                <h3 className="font-display text-xs uppercase tracking-wider text-slate-400 mb-2 font-bold">Mythical Pet</h3>
                <div className="space-y-2">
                  <label className="flex items-center justify-between rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-3 text-xs text-slate-200 transition hover:border-cyber-neon/80 cursor-pointer">
                    <div>
                      <span className="font-semibold">Enable Pet</span>
                      <p className="text-[9px] text-slate-500 mt-0.5">Show pet overlay on screen</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !petEnabled;
                        setPetEnabledLocal(next);
                        setPetEnabled(next);
                        window.dispatchEvent(new CustomEvent('mythical-pet-change', { detail: { enabled: next } }));
                      }}
                      className={`w-10 h-5 rounded-full transition relative ${petEnabled ? 'bg-cyber-neon' : 'bg-slate-600'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition ${petEnabled ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </label>
                  {petEnabled && (
                    <div className="rounded-lg border border-cyber-line/40 bg-cyber-base/20 p-3">
                      <p className="text-[10px] text-slate-400 mb-2 font-semibold uppercase tracking-wider">Select Pet</p>
                      <div className="space-y-1.5">
                        {ALL_PETS.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setPetIdLocal(p.id);
                              setActivePetId(p.id);
                              window.dispatchEvent(new CustomEvent('mythical-pet-change', { detail: { id: p.id } }));
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg border transition text-xs ${
                              p.id === petId
                                ? 'border-cyber-neon bg-cyber-neon/10 text-cyber-neon'
                                : 'border-cyber-line/40 bg-cyber-base/30 text-slate-300 hover:border-cyber-electric/60 hover:bg-cyber-electric/5'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">{p.id === 'dragon' ? '🐉' : p.id === 'phoenix' ? '🔥' : p.id === 'qilin' ? '🦄' : '🪽'}</span>
                              <div>
                                <div className="font-semibold">{p.name}</div>
                                <div className="text-[9px] text-slate-500">{p.nameVn}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
      )}

      {/* LLM Configuration Modal */}
      <LlmConfigModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        config={llmConfig}
        onSave={handleSaveLlmConfig}
      />

      {/* Ctrl+P File Finder Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-20 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-cyber-line/80 bg-cyber-panel shadow-2xl overflow-hidden flex flex-col max-h-[450px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cyber-line/55 bg-cyber-base/40 px-4 py-3">
              <span className="font-display text-[10px] uppercase tracking-wider text-cyber-neon font-bold">Search Files</span>
              <button 
                type="button" 
                onClick={() => setIsSearchModalOpen(false)}
                className="text-slate-400 hover:text-white transition font-mono text-xs"
              >
                ESC
              </button>
            </div>

            {/* Input */}
            <div className="p-3 border-b border-cyber-line/30">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Type name to find files..."
                className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-xs font-semibold text-slate-100 placeholder-slate-500 outline-none focus:border-cyber-neon transition"
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
              {isSearchLoading ? (
                <div className="flex flex-col items-center justify-center py-8 text-xs text-slate-400 gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyber-neon border-t-transparent" />
                  <span>Scanning workspace files...</span>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No files match your search query.
                </div>
              ) : (
                <div className="space-y-0.5 font-mono">
                  {filteredFiles.map((file, idx) => {
                    const isSelected = idx === selectedIndex;
                    const displayPath = rootPath ? getRelativePath(file.path, rootPath) : file.path;
                    return (
                      <div
                        key={file.path}
                        onClick={() => {
                          onFileClick(file, rootPath);
                          setIsSearchModalOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex flex-col px-3 py-2 rounded-lg cursor-pointer transition ${
                          isSelected 
                            ? 'bg-cyber-neon/15 border border-cyber-neon/30 text-white' 
                            : 'border border-transparent text-slate-300 hover:bg-cyber-base/40'
                        }`}
                      >
                        <span className="text-xs font-semibold truncate select-none">{file.name}</span>
                        <span className="text-[10px] text-slate-500 truncate select-none">{displayPath}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
