import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { CliDefinition, SessionInfo, FileEntry, AppTheme, AssistantState, LlmConfig, LlmChatMessage, SshConnection, GitStatusEntry, SpecialConfigFile } from '../types';
import { loadApiHistory, clearApiHistory, type ApiHistoryEntry, METHOD_COLORS } from '../lib/api-history';
import { ALL_PETS, getActivePetId, setActivePetId, getPetEnabled, setPetEnabled } from '../lib/mythical-pets';
import { getContextMenuPosition } from '../lib/contextMenu';
import { ProxyPanel } from './ProxyPanel';
import { AIChatPanel } from './AIChatPanel';
import { loadSpecialConfigFiles, saveSpecialConfigFile, deleteSpecialConfigFile } from '../lib/configFiles';
import { SpecialConfigModal } from './SpecialConfigModal';

import { 
  listDirectoryFiles, 
  pickFolder,
  sendCliInput,
  readFileContent,
  writeFileContent,
  openWorkspaceFolder,
  revealInFileManager,
  getGitStatus,
  getGitDiff,
  listSshDirectoryFiles,
  listAllFilesRecursive,
  listSshFilesRecursive,
  deleteFileOrDir,
  deleteSshFileOrDir,
  downloadSshFile,
} from '../lib/tauri';
import { save } from '@tauri-apps/plugin-dialog';

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

function BuzzIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
      <circle cx="6" cy="6" r="2.25" />
      <circle cx="18" cy="6" r="2.25" />
      <circle cx="12" cy="18" r="2.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7.5 10.5 16.5M16 7.5 13.5 16.5M6.75 8h10.5" />
    </svg>
  );
}

function GameIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9h4m-2-2v4M15 9h.01M18 9h.01M15 13h.01M18 13h.01M7.5 3h9a4.5 4.5 0 0 1 4.5 4.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Z" />
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
  onProxyTabChange?: (isActive: boolean) => void;
  onLogsTabChange?: (isActive: boolean) => void;
}

type SidebarTab = 'cli-manager' | 'quickapps' | 'buzz' | 'game' | 'settings' | 'ai-chat' | 'apiclient' | 'dashboard';

const PINNED_SIDEBAR_TABS = new Set<SidebarTab>(['settings']);

interface FileContextTarget {
  path: string;
  isDir: boolean;
  name: string;
  rootPath: string;
  connection: SshConnection | null;
  canDelete: boolean;
}

interface DeleteConfirmation extends FileContextTarget {
  deleting: boolean;
  error: string | null;
}

function normalizeUiPath(path: string): string {
  return path.replace(/\\/g, '/').replace(/\/+$/, '');
}

function isSameOrDescendantPath(path: string, ancestor: string): boolean {
  const normalizedPath = normalizeUiPath(path);
  const normalizedAncestor = normalizeUiPath(ancestor);
  return normalizedPath === normalizedAncestor || normalizedPath.startsWith(`${normalizedAncestor}/`);
}

function parentUiPath(path: string): string {
  const lastSeparator = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  return lastSeparator > 0 ? path.slice(0, lastSeparator) : '.';
}

function joinWorkspacePath(rootPath: string, relativePath: string): string {
  const useBackslash = rootPath.includes('\\') && !rootPath.includes('/');
  const separator = useBackslash ? '\\' : '/';
  const normalizedRelative = relativePath.replace(/[\\/]/g, separator);
  return `${rootPath.replace(/[\\/]+$/, '')}${separator}${normalizedRelative}`;
}


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
  onProxyTabChange,
  onLogsTabChange,
}: CliSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('cli-manager');
  const [cliSubTab, setCliSubTab] = useState<'clis' | 'operator' | 'configs' | 'explorer'>('clis');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('ai-cli-sidebar-collapsed') === 'true';
  });

  // Pet state (for Settings picker)
  const [petId, setPetIdLocal] = useState(getActivePetId);
  const [petEnabled, setPetEnabledLocal] = useState(getPetEnabled);
  const [buzzUnreadCount, setBuzzUnreadCount] = useState<number>(0);

  useEffect(() => {
    const handleBuzzUnread = (e: Event) => {
      setBuzzUnreadCount((e as CustomEvent<number>).detail || 0);
    };
    window.addEventListener('buzz-unread-count', handleBuzzUnread);
    return () => window.removeEventListener('buzz-unread-count', handleBuzzUnread);
  }, []);

  const handleSetActiveTab = useCallback((tab: SidebarTab) => {
    const tabsWithNoLeftArea = new Set(['quickapps', 'buzz', 'game', 'settings', 'dashboard']);
    
    if (tabsWithNoLeftArea.has(tab)) {
      setIsSidebarCollapsed(true);
      localStorage.setItem('ai-cli-sidebar-collapsed', 'true');
      setActiveTab(tab);

      if (tab === 'quickapps' && onQuickAppsTabChange) onQuickAppsTabChange(true);
      else if (tab === 'buzz') {
        window.dispatchEvent(new CustomEvent('switch-main-view', { detail: 'buzz' }));
        window.dispatchEvent(new CustomEvent('buzz-mark-current-read'));
      }
      else if (tab === 'game') {
        window.dispatchEvent(new CustomEvent('switch-main-view', { detail: 'game' }));
      }
      else if (tab === 'settings') {
        if (onQuickAppsTabChange) onQuickAppsTabChange(false);
        if (onApiClientTabChange) onApiClientTabChange(false);
        if (onProxyTabChange) onProxyTabChange(false);
        if (onLogsTabChange) onLogsTabChange(false);
        window.dispatchEvent(new CustomEvent('switch-main-view', { detail: 'settings' }));
      }
      else if (tab === 'dashboard') {
        if (onQuickAppsTabChange) onQuickAppsTabChange(false);
        if (onApiClientTabChange) onApiClientTabChange(false);
        if (onProxyTabChange) onProxyTabChange(false);
        if (onLogsTabChange) onLogsTabChange(false);
        window.dispatchEvent(new CustomEvent('switch-main-view', { detail: 'dashboard' }));
      }
    } else {
      if (activeTab === tab && !isSidebarCollapsed) {
        setIsSidebarCollapsed(true);
        localStorage.setItem('ai-cli-sidebar-collapsed', 'true');
      } else {
        setIsSidebarCollapsed(false);
        localStorage.setItem('ai-cli-sidebar-collapsed', 'false');
        
        const trackedTabs = new Set(['quickapps', 'apiclient']);
        const leavingTracked = trackedTabs.has(activeTab) || tabsWithNoLeftArea.has(activeTab);
        const enteringTracked = trackedTabs.has(tab);

        setActiveTab(tab);

        if (!enteringTracked && leavingTracked) {
          if (onQuickAppsTabChange) onQuickAppsTabChange(false);
          if (onApiClientTabChange) onApiClientTabChange(false);
          if (onProxyTabChange) onProxyTabChange(false);
          if (onLogsTabChange) onLogsTabChange(false);
          window.dispatchEvent(new CustomEvent('switch-main-view', { detail: 'terminal' }));
        } else if (enteringTracked) {
          if (tab === 'quickapps' && onQuickAppsTabChange) onQuickAppsTabChange(true);
          else if (tab === 'apiclient' && onApiClientTabChange) onApiClientTabChange(true);
        } else {
          // If entering standard tab from standard tab (e.g. explorer -> cli-manager)
          window.dispatchEvent(new CustomEvent('switch-main-view', { detail: 'terminal' }));
        }
      }
    }
  }, [activeTab, isSidebarCollapsed, onQuickAppsTabChange, onApiClientTabChange, onProxyTabChange, onLogsTabChange]);

  // --- Sidebar Tabs Reordering (Dynamic Icons) ---
  const [tabsOrder, setTabsOrder] = useState<SidebarTab[]>(() => {
    const saved = localStorage.getItem('ai-cli-sidebar-tabs-order');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          let list = [...parsed].filter((t) => t !== 'explorer' && t !== 'operator' && t !== 'web-ai' && t !== 'logs' && t !== 'remote' && t !== 'proxy');
          if (!list.includes('dashboard')) {
            list.unshift('dashboard');
          }
          if (!list.includes('buzz')) {
            const quickIdx = list.indexOf('quickapps');
            list.splice(quickIdx >= 0 ? quickIdx + 1 : list.length, 0, 'buzz');
          }
          if (!list.includes('game')) {
            const buzzIdx = list.indexOf('buzz');
            list.splice(buzzIdx >= 0 ? buzzIdx + 1 : list.length, 0, 'game');
          }
          return [
            ...list.filter((t) => !PINNED_SIDEBAR_TABS.has(t as SidebarTab)),
            ...list.filter((t) => PINNED_SIDEBAR_TABS.has(t as SidebarTab)),
          ] as SidebarTab[];
        }
      } catch {
        // ignore
      }
    }
    return ['dashboard', 'cli-manager', 'quickapps', 'buzz', 'game', 'apiclient', 'settings'];
  });

  const handleTabDragStart = (e: React.DragEvent, tab: SidebarTab) => {
    e.dataTransfer.setData('text/plain', tab);
  };

  const handleTabDrop = (e: React.DragEvent, targetTab: SidebarTab) => {
    e.preventDefault();
    const sourceTab = e.dataTransfer.getData('text/plain') as SidebarTab;
    const sameActivityGroup = PINNED_SIDEBAR_TABS.has(sourceTab) === PINNED_SIDEBAR_TABS.has(targetTab);
    if (sourceTab && sourceTab !== targetTab && sameActivityGroup) {
      const newOrder = [...tabsOrder];
      const sourceIdx = newOrder.indexOf(sourceTab);
      const targetIdx = newOrder.indexOf(targetTab);
      if (sourceIdx !== -1 && targetIdx !== -1) {
        newOrder.splice(sourceIdx, 1);
        newOrder.splice(targetIdx, 0, sourceTab);
        setTabsOrder(newOrder);
        localStorage.setItem('ai-cli-sidebar-tabs-order', JSON.stringify(newOrder));
      }
    }
  };

  const renderTabButton = (tab: SidebarTab) => {
    switch (tab) {
      case 'cli-manager':
        return (
          <div
            key="cli-manager"
            role="button"
            tabIndex={0}
            draggable
            onDragStart={(e) => handleTabDragStart(e, 'cli-manager')}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleTabDrop(e, 'cli-manager')}
            onClick={() => handleSetActiveTab('cli-manager')}
            title="Terminal Orchestor"
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all cursor-grab active:cursor-grabbing select-none outline-none ${
              activeTab === 'cli-manager'
                ? 'text-cyber-electric bg-cyber-electric/10 shadow-neon-blue-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-base/40'
            }`}
          >
            <div className="pointer-events-none flex items-center justify-center w-full h-full relative">
              {activeTab === 'cli-manager' && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-electric" />
              )}
              <TerminalIcon />
            </div>
          </div>
        );
      case 'buzz':
        return (
          <div
            key="buzz"
            role="button"
            tabIndex={0}
            draggable
            onDragStart={(e) => handleTabDragStart(e, 'buzz')}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleTabDrop(e, 'buzz')}
            onClick={() => handleSetActiveTab('buzz')}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'buzz'
                ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 ring-1 ring-amber-400/30'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
            }`}
            title="Buzz Workspace"
          >
            <BuzzIcon />
            {buzzUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-md ring-2 ring-slate-900 animate-pulse">
                {buzzUnreadCount > 99 ? '99+' : buzzUnreadCount}
              </span>
            )}
          </div>
        );
      case 'game':
        return (
          <div
            key="game"
            role="button"
            tabIndex={0}
            draggable
            onDragStart={(e) => handleTabDragStart(e, 'game')}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleTabDrop(e, 'game')}
            onClick={() => handleSetActiveTab('game')}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'game'
                ? 'bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/25 ring-1 ring-fuchsia-400/30'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
            }`}
            title="NES Multiplayer"
          >
            <GameIcon />
          </div>
        );
      case 'quickapps':
        return (
          <div
            key="quickapps"
            role="button"
            tabIndex={0}
            draggable
            onDragStart={(e) => handleTabDragStart(e, 'quickapps')}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleTabDrop(e, 'quickapps')}
            onClick={() => handleSetActiveTab('quickapps')}
            title="Quick Apps (favorite apps launcher)"
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all cursor-grab active:cursor-grabbing select-none outline-none ${
              activeTab === 'quickapps'
                ? 'text-cyber-electric bg-cyber-electric/10 shadow-neon-blue-sm'
                : 'text-slate-400 hover:text-cyber-electric hover:bg-cyber-electric/10'
            }`}
          >
            <div className="pointer-events-none flex items-center justify-center w-full h-full relative">
              {activeTab === 'quickapps' && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-electric" />
              )}
              <QuickAppsIcon />
            </div>
          </div>
        );
      case 'apiclient':
        return (
          <div
            key="apiclient"
            role="button"
            tabIndex={0}
            draggable
            onDragStart={(e) => handleTabDragStart(e, 'apiclient')}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleTabDrop(e, 'apiclient')}
            onClick={() => handleSetActiveTab('apiclient')}
            title="API Client (Postman-like)"
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all cursor-grab active:cursor-grabbing select-none outline-none ${
              activeTab === 'apiclient'
                ? 'text-cyber-neon bg-cyber-neon/10 shadow-neon-sm'
                : 'text-slate-400 hover:text-cyber-neon hover:bg-cyber-neon/10'
            }`}
          >
            <div className="pointer-events-none flex items-center justify-center w-full h-full relative">
              {activeTab === 'apiclient' && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-neon" />
              )}
              <ApiIcon />
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div
            key="dashboard"
            role="button"
            tabIndex={0}
            draggable
            onDragStart={(e) => handleTabDragStart(e, 'dashboard')}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleTabDrop(e, 'dashboard')}
            onClick={() => handleSetActiveTab('dashboard')}
            title="Dashboard"
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all cursor-grab active:cursor-grabbing select-none outline-none ${
              activeTab === 'dashboard'
                ? 'text-cyber-electric bg-cyber-electric/10 shadow-neon-blue-sm'
                : 'text-slate-400 hover:text-cyber-electric hover:bg-cyber-electric/10'
            }`}
          >
            <div className="pointer-events-none flex items-center justify-center w-full h-full relative">
              {activeTab === 'dashboard' && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-electric" />
              )}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div
            key="settings"
            role="button"
            tabIndex={0}
            draggable
            onDragStart={(e) => handleTabDragStart(e, 'settings')}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleTabDrop(e, 'settings')}
            onClick={() => handleSetActiveTab('settings')}
            title="Settings"
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all cursor-grab active:cursor-grabbing select-none outline-none ${
              activeTab === 'settings'
                ? 'text-cyber-neon bg-cyber-neon/10 shadow-neon-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-base/40'
            }`}
          >
            <div className="pointer-events-none flex items-center justify-center w-full h-full relative">
              {activeTab === 'settings' && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-neon" />
              )}
              <SettingsIcon />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Listen for opening a specific sidebar tab (e.g. ai-chat from Command Palette)
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvt = e as CustomEvent<SidebarTab>;
      if (customEvt.detail) {
        handleSetActiveTab(customEvt.detail);
      }
    };
    window.addEventListener('open-sidebar-tab', handler);
    return () => window.removeEventListener('open-sidebar-tab', handler);
  }, [handleSetActiveTab]);

  // Listen for LLM Companion config changes from Settings Panel
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvt = e as CustomEvent<LlmConfig>;
      if (customEvt.detail) {
        setLlmConfig(customEvt.detail);
      }
    };
    window.addEventListener('llm-config-changed', handler);
    return () => window.removeEventListener('llm-config-changed', handler);
  }, []);

  // Listen for sidebar order changes from Settings panel
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvt = e as CustomEvent<string[]>;
      if (customEvt.detail && Array.isArray(customEvt.detail)) {
        setTabsOrder(customEvt.detail as SidebarTab[]);
      }
    };
    window.addEventListener('sidebar-order-changed', handler);
    return () => window.removeEventListener('sidebar-order-changed', handler);
  }, []);

  // --- Sidebar Resizer Code ---
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('ai-cli-sidebar-width');
    return saved ? parseInt(saved, 10) : 320;
  });

  const isResizingRef = useRef(false);
  const sidebarWidthRef = useRef(sidebarWidth);
  sidebarWidthRef.current = sidebarWidth;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      if (e.clientX < 120) {
        setIsSidebarCollapsed(true);
        localStorage.setItem('ai-cli-sidebar-collapsed', 'true');
        return;
      }
      const newWidth = Math.max(220, Math.min(e.clientX, 800));
      sidebarWidthRef.current = newWidth;
      setSidebarWidth(newWidth);
      setIsSidebarCollapsed(false);
    };

    const handleMouseUp = () => {
      if (isResizingRef.current) {
        isResizingRef.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        localStorage.setItem('ai-cli-sidebar-width', String(sidebarWidthRef.current));
        localStorage.setItem('ai-cli-sidebar-collapsed', 'false');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // --- SSH VM Manager States ---
  const [sshSearchQuery, setSshSearchQuery] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});



  // Auto-switch to Explorer sub-tab in Terminal Orchestrator when an active session changes
  useEffect(() => {
    if (activeSessionId) {
      setActiveTab('cli-manager');
      setCliSubTab('explorer');
    }
  }, [activeSessionId]);

  // --- Local LLM fallback states ---
  const [builtinLlmConfig, setBuiltinLlmConfig] = useState<any>({
    enabled: false,
    modelPath: null,
    tokenizerPath: null,
    maxTokens: 256,
    temperature: 0.7,
    repeatPenalty: 1.1,
    seed: 42,
    runtime: 'candle',
    serverPath: null,
    serverPort: 8080,
  });
  const [builtinLlmStatus, setBuiltinLlmStatus] = useState<any>({
    loaded: false,
    modelPath: null,
    enabled: false,
  });
  const [isBuiltinLlmLoading, setIsBuiltinLlmLoading] = useState(false);

  useEffect(() => {
    // Load config
    invoke('builtin_llm_get_config')
      .then((cfg) => {
        setBuiltinLlmConfig(cfg);
      })
      .catch((err) => console.error('Failed to get built-in config:', err));

    // Load status
    invoke('builtin_llm_status')
      .then((stat) => {
        setBuiltinLlmStatus(stat);
      })
      .catch((err) => console.error('Failed to get built-in status:', err));
  }, []);

  const handleLoadBuiltinLlm = async () => {
    setIsBuiltinLlmLoading(true);
    if (setAssistantState && setAssistantText) {
      setAssistantState('Thinking');
      setAssistantText('Loading built-in local LLM model... (This may take a moment)');
    }
    try {
      await invoke('builtin_llm_load');
      const status = await invoke<any>('builtin_llm_status');
      setBuiltinLlmStatus(status);
      if (setAssistantState && setAssistantText) {
        setAssistantState('Done');
        setAssistantText('Built-in local LLM model loaded successfully!');
        setTimeout(() => setAssistantState('Idle'), 3000);
      }
    } catch (err) {
      console.error('Failed to load built-in LLM:', err);
      if (setAssistantState && setAssistantText) {
        setAssistantState('Error');
        setAssistantText(`Failed to load model: ${err}`);
      }
    } finally {
      setIsBuiltinLlmLoading(false);
    }
  };

  const handleUnloadBuiltinLlm = async () => {
    try {
      await invoke('builtin_llm_unload');
      const status = await invoke<any>('builtin_llm_status');
      setBuiltinLlmStatus(status);
      if (setAssistantState && setAssistantText) {
        setAssistantState('Done');
        setAssistantText('Built-in local LLM model unloaded.');
        setTimeout(() => setAssistantState('Idle'), 3000);
      }
    } catch (err) {
      console.error('Failed to unload built-in LLM:', err);
    }
  };

  const handlePickBuiltinModel = async () => {
    try {
      const file = await invoke<string | null>('pick_file');
      if (file) {
        const newCfg = { ...builtinLlmConfig, modelPath: file };
        await invoke('builtin_llm_save_config', { config: newCfg });
        setBuiltinLlmConfig(newCfg);
      }
    } catch (err) {
      console.error('Failed to pick model file:', err);
    }
  };

  const handlePickBuiltinTokenizer = async () => {
    try {
      const file = await invoke<string | null>('pick_file');
      if (file) {
        const newCfg = { ...builtinLlmConfig, tokenizerPath: file };
        await invoke('builtin_llm_save_config', { config: newCfg });
        setBuiltinLlmConfig(newCfg);
      }
    } catch (err) {
      console.error('Failed to pick tokenizer file:', err);
    }
  };

  const handlePickBuiltinServer = async () => {
    try {
      const file = await invoke<string | null>('pick_file');
      if (file) {
        const newCfg = { ...builtinLlmConfig, serverPath: file };
        await invoke('builtin_llm_save_config', { config: newCfg });
        setBuiltinLlmConfig(newCfg);
      }
    } catch (err) {
      console.error('Failed to pick server file:', err);
    }
  };

  const handleUpdateBuiltinConfig = async (updates: Partial<typeof builtinLlmConfig>) => {
    const newCfg = { ...builtinLlmConfig, ...updates };
    try {
      await invoke('builtin_llm_save_config', { config: newCfg });
      setBuiltinLlmConfig(newCfg);
      const status = await invoke<any>('builtin_llm_status');
      setBuiltinLlmStatus(status);
    } catch (err) {
      console.error('Failed to save built-in config:', err);
    }
  };

  const handleOptimizeQuery = async () => {
    if (!chatInput.trim() || isLoadingLlm) return;
    setIsLoadingLlm(true);
    if (setAssistantState && setAssistantText) {
      setAssistantState('Thinking');
      setAssistantText('Rewriting query for clarity...');
    }
    try {
      if (!builtinLlmStatus.loaded) {
        await invoke('builtin_llm_load');
        const stat = await invoke<any>('builtin_llm_status');
        setBuiltinLlmStatus(stat);
      }
      const reply = await invoke<string>('builtin_llm_generate', {
        prompt: chatInput.trim(),
        task: 'rewrite',
      });
      setChatInput(reply.trim());
      if (setAssistantState && setAssistantText) {
        setAssistantState('Done');
        setAssistantText('Query rewritten!');
        setTimeout(() => setAssistantState('Idle'), 2000);
      }
    } catch (err) {
      console.error(err);
      if (setAssistantState && setAssistantText) {
        setAssistantState('Error');
        setAssistantText(`Rewrite failed: ${err}`);
      }
    } finally {
      setIsLoadingLlm(false);
    }
  };

  const handleSuggestCommand = async () => {
    if (!chatInput.trim() || isLoadingLlm) return;
    setIsLoadingLlm(true);
    if (setAssistantState && setAssistantText) {
      setAssistantState('Thinking');
      setAssistantText('Generating CLI command suggestion...');
    }
    try {
      if (!builtinLlmStatus.loaded) {
        await invoke('builtin_llm_load');
        const stat = await invoke<any>('builtin_llm_status');
        setBuiltinLlmStatus(stat);
      }
      const reply = await invoke<string>('builtin_llm_generate', {
        prompt: chatInput.trim(),
        task: 'suggest',
      });
      
      const assistantMsg: LlmChatMessage = {
        role: 'assistant',
        content: `Suggested CLI Command:\n\`\`\`bash\n${reply.trim()}\n\`\`\`,`,
        timestamp: new Date().toLocaleTimeString(),
      };
      
      const updatedHistory = [
        ...chatHistory,
        { role: 'user', content: `Suggest command for: ${chatInput.trim()}`, timestamp: new Date().toLocaleTimeString() } as LlmChatMessage,
        assistantMsg
      ];
      setChatHistory(updatedHistory);
      localStorage.setItem('ai-cli-llm-history', JSON.stringify(updatedHistory));
      setChatInput('');

      if (setAssistantState && setAssistantText) {
        setAssistantState('Done');
        setAssistantText('Command suggested!');
        setTimeout(() => setAssistantState('Idle'), 2000);
      }
    } catch (err) {
      console.error(err);
      if (setAssistantState && setAssistantText) {
        setAssistantState('Error');
        setAssistantText(`Failed: ${err}`);
      }
    } finally {
      setIsLoadingLlm(false);
    }
  };

  const handleSummarizeClipboard = async () => {
    if (isLoadingLlm) return;
    setIsLoadingLlm(true);
    if (setAssistantState && setAssistantText) {
      setAssistantState('Thinking');
      setAssistantText('Summarizing text...');
    }
    try {
      if (!builtinLlmStatus.loaded) {
        await invoke('builtin_llm_load');
        const stat = await invoke<any>('builtin_llm_status');
        setBuiltinLlmStatus(stat);
      }
      const textToSummarize = chatInput.trim();
      if (!textToSummarize) {
        setIsLoadingLlm(false);
        return;
      }
      const reply = await invoke<string>('builtin_llm_generate', {
        prompt: textToSummarize,
        task: 'summarize',
      });
      
      const assistantMsg: LlmChatMessage = {
        role: 'assistant',
        content: `Summary:\n${reply.trim()}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      
      const updatedHistory = [
        ...chatHistory,
        { role: 'user', content: `Summarize text...`, timestamp: new Date().toLocaleTimeString() } as LlmChatMessage,
        assistantMsg
      ];
      setChatHistory(updatedHistory);
      localStorage.setItem('ai-cli-llm-history', JSON.stringify(updatedHistory));
      setChatInput('');

      if (setAssistantState && setAssistantText) {
        setAssistantState('Done');
        setAssistantText('Text summarized!');
        setTimeout(() => setAssistantState('Idle'), 2000);
      }
    } catch (err) {
      console.error(err);
      if (setAssistantState && setAssistantText) {
        setAssistantState('Error');
        setAssistantText(`Failed: ${err}`);
      }
    } finally {
      setIsLoadingLlm(false);
    }
  };

  const handleGenerateTitle = async () => {
    if (!chatInput.trim() || isLoadingLlm) return;
    setIsLoadingLlm(true);
    if (setAssistantState && setAssistantText) {
      setAssistantState('Thinking');
      setAssistantText('Generating title...');
    }
    try {
      if (!builtinLlmStatus.loaded) {
        await invoke('builtin_llm_load');
        const stat = await invoke<any>('builtin_llm_status');
        setBuiltinLlmStatus(stat);
      }
      const reply = await invoke<string>('builtin_llm_generate', {
        prompt: chatInput.trim(),
        task: 'title',
      });
      
      const assistantMsg: LlmChatMessage = {
        role: 'assistant',
        content: `Generated Title: "${reply.trim()}"`,
        timestamp: new Date().toLocaleTimeString(),
      };
      
      const updatedHistory = [
        ...chatHistory,
        { role: 'user', content: `Generate title for: ${chatInput.trim().slice(0, 30)}...`, timestamp: new Date().toLocaleTimeString() } as LlmChatMessage,
        assistantMsg
      ];
      setChatHistory(updatedHistory);
      localStorage.setItem('ai-cli-llm-history', JSON.stringify(updatedHistory));
      setChatInput('');

      if (setAssistantState && setAssistantText) {
        setAssistantState('Done');
        setAssistantText('Title generated!');
        setTimeout(() => setAssistantState('Idle'), 2000);
      }
    } catch (err) {
      console.error(err);
      if (setAssistantState && setAssistantText) {
        setAssistantState('Error');
        setAssistantText(`Failed: ${err}`);
      }
    } finally {
      setIsLoadingLlm(false);
    }
  };

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
  const [inputContextMenu, setInputContextMenu] = useState<{
    x: number;
    y: number;
    open: boolean;
    text: string;
  } | null>(null);

  const [rewriteModal, setRewriteModal] = useState<{
    open: boolean;
    type: 'rewrite' | 'suggest' | 'summarize' | 'title';
    originalText: string;
    resultText: string;
    loading: boolean;
    error: string | null;
  } | null>(null);

  const [fileContextMenu, setFileContextMenu] = useState<{
    x: number; y: number;
    target: FileContextTarget;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmation | null>(null);

  useEffect(() => {
    const handleGlobalClick = () => { setInputContextMenu(null); setFileContextMenu(null); };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleTriggerRewriteAction = async (type: 'rewrite' | 'suggest' | 'summarize' | 'title', text: string) => {
    setInputContextMenu(null);
    setRewriteModal({
      open: true,
      type,
      originalText: text,
      resultText: '',
      loading: true,
      error: null,
    });

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
          messages: [{ role: 'user', content: text.trim() }],
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
            messages: [{ role: 'user', content: text.trim() }],
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
            const stat = await invoke<any>('builtin_llm_status');
            setBuiltinLlmStatus(stat);
          }
          const reply = await invoke<string>('builtin_llm_generate', {
            prompt: text.trim(),
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
      
      if (builtinLlmConfig.enabled) {
        setIsLoadingLlm(true);
        if (setAssistantState && setAssistantText) {
          setAssistantState('Thinking');
          setAssistantText('Cloud LLM failed. Falling back to local built-in LLM...');
        }
        try {
          if (!builtinLlmStatus.loaded) {
            await invoke('builtin_llm_load');
            const stat = await invoke<any>('builtin_llm_status');
            setBuiltinLlmStatus(stat);
          }
          
          const reply = await invoke<string>('builtin_llm_generate', {
            prompt: userMessageContent,
            task: 'chat',
            maxTokens: builtinLlmConfig.maxTokens,
          });

          const assistantMsg: LlmChatMessage = {
            role: 'assistant',
            content: `[Local Fallback] ${reply}`,
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
          return; // Success, don't show the error
        } catch (fallbackErr) {
          console.error('Local LLM fallback failed:', fallbackErr);
        }
      }
      
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

  // Quick Config Files state
  const [quickConfigsExpanded, setQuickConfigsExpanded] = useState(true);
  const [specialConfigs, setSpecialConfigs] = useState<SpecialConfigFile[]>(() => loadSpecialConfigFiles());
  const [specialModalOpen, setSpecialModalOpen] = useState(false);
  const [editingSpecialConfig, setEditingSpecialConfig] = useState<SpecialConfigFile | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvt = e as CustomEvent<SpecialConfigFile[]>;
      setSpecialConfigs(customEvt.detail || loadSpecialConfigFiles());
    };
    window.addEventListener('special-configs-changed', handler);
    return () => window.removeEventListener('special-configs-changed', handler);
  }, []);

  const quickConfigFiles = useMemo(() => {
    const list: FileEntry[] = [];

    // Only show user-saved special config files (no auto-discovery)
    specialConfigs.forEach((sc) => {
      const fileName = sc.path.split(/[/\\]/).pop() || sc.path;
      // If path is absolute (Windows or Unix), use it directly; otherwise join with rootPath
      const isAbsolute = /^([A-Za-z]:[/\\]|\/|\\\\)/.test(sc.path);
      const fullPath = isAbsolute
        ? sc.path
        : rootPath
          ? joinWorkspacePath(rootPath, sc.path)
          : sc.path;
      list.push({
        name: sc.name || fileName,
        path: fullPath,
        isDir: false,
      });
    });

    return list;
  }, [specialConfigs, rootPath]);

  const [configSearchQuery, setConfigSearchQuery] = useState('');
  const [collapsedConfigGroups, setCollapsedConfigGroups] = useState<Record<string, boolean>>({});

  const groupedConfigs = useMemo(() => {
    const map: Record<string, { entry: FileEntry; specialMatch?: SpecialConfigFile }[]> = {};

    quickConfigFiles.forEach((entry) => {
      const specialMatch = specialConfigs.find(
        (sc) => sc.name === entry.name || sc.path === entry.path || entry.path.endsWith(sc.path)
      );

      if (configSearchQuery.trim()) {
        const query = configSearchQuery.toLowerCase();
        const matchesName = entry.name.toLowerCase().includes(query);
        const matchesPath = entry.path.toLowerCase().includes(query);
        const matchesDesc = specialMatch?.description?.toLowerCase().includes(query) ?? false;
        const matchesGroup = specialMatch?.group?.toLowerCase().includes(query) ?? false;
        if (!matchesName && !matchesPath && !matchesDesc && !matchesGroup) {
          return;
        }
      }

      const groupName = specialMatch?.group || 'General Configs';
      if (!map[groupName]) {
        map[groupName] = [];
      }
      map[groupName].push({ entry, specialMatch });
    });

    return map;
  }, [quickConfigFiles, specialConfigs, configSearchQuery]);

  // Ctrl+P search states
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [allFiles, setAllFiles] = useState<FileEntry[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleOpenQuickConfig = () => {
      setCliSubTab('configs');
      handleSetActiveTab('cli-manager');
      setIsSearchModalOpen(true);
    };
    window.addEventListener('open-quick-config-search', handleOpenQuickConfig);
    return () => window.removeEventListener('open-quick-config-search', handleOpenQuickConfig);
  }, [handleSetActiveTab]);


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

  const openDeleteConfirmation = (target: FileContextTarget) => {
    setFileContextMenu(null);
    setDeleteConfirm({ ...target, deleting: false, error: null });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm || deleteConfirm.deleting) return;

    const target = deleteConfirm;
    setDeleteConfirm({ ...target, deleting: true, error: null });

    try {
      if (target.connection) {
        await deleteSshFileOrDir(target.connection, target.path, target.rootPath);
      } else {
        await deleteFileOrDir(target.path, target.rootPath);
      }

      if (selectedFilePath && isSameOrDescendantPath(selectedFilePath, target.path)) {
        onCloseFile();
      }

      setAllFiles((prev) => prev.filter((entry) => !isSameOrDescendantPath(entry.path, target.path)));
      setExpandedPaths((prev) => Object.fromEntries(
        Object.entries(prev).filter(([path]) => !isSameOrDescendantPath(path, target.path)),
      ));
      setCachedFiles((prev) => Object.fromEntries(
        Object.entries(prev)
          .filter(([path]) => !isSameOrDescendantPath(path, target.path))
          .map(([path, entries]) => [
            path,
            entries.filter((entry) => !isSameOrDescendantPath(entry.path, target.path)),
          ]),
      ));

      const parentPath = parentUiPath(target.path);
      try {
        const files = target.connection
          ? await listSshDirectoryFiles(target.connection, parentPath)
          : await listDirectoryFiles(parentPath);
        setCachedFiles((prev) => ({ ...prev, [parentPath]: files }));
      } catch (refreshError) {
        console.error(`Failed to refresh directory '${parentPath}':`, refreshError);
      }

      if (!target.connection) {
        try {
          await refreshGitStatus(target.rootPath);
        } catch (refreshError) {
          console.error('Failed to refresh Git status after deletion:', refreshError);
        }
      }

      if (setAssistantState && setAssistantText) {
        setAssistantState('Done');
        setAssistantText(`${target.isDir ? 'Folder' : 'File'} deleted: ${target.name}`);
        setTimeout(() => setAssistantState('Idle'), 2500);
      }
      setDeleteConfirm(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Delete failed:', error);
      setDeleteConfirm({ ...target, deleting: false, error: message });
      if (setAssistantState && setAssistantText) {
        setAssistantState('Error');
        setAssistantText(`Delete failed: ${message}`);
      }
    }
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
          onContextMenu={(e) => {
            e.preventDefault();
            if (!rootPath) return;
            setFileContextMenu({
              x: e.clientX,
              y: e.clientY,
              target: {
                path: entry.path,
                isDir: entry.isDir,
                name: entry.name,
                rootPath,
                connection: isSshSession ? sshConnection ?? null : null,
                canDelete: !isSshSession || !!sshConnection,
              },
            });
          }}
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

  // --- CLI Grouping and Filtering ---
  const [cliSearchQuery, setCliSearchQuery] = useState('');
  const [collapsedCliGroups, setCollapsedCliGroups] = useState<Record<string, boolean>>({});

  const groupedClis = useMemo(() => {
    const query = cliSearchQuery.toLowerCase().trim();
    const filtered = clis.filter((cli) => {
      if (!query) return true;
      return (
        cli.name.toLowerCase().includes(query) ||
        cli.command.toLowerCase().includes(query) ||
        (cli.group || 'Default').toLowerCase().includes(query)
      );
    });

    const groups: Record<string, CliDefinition[]> = {};
    filtered.forEach((cli) => {
      const g = cli.group || 'Default';
      if (!groups[g]) {
        groups[g] = [];
      }
      groups[g].push(cli);
    });
    return groups;
  }, [clis, cliSearchQuery]);

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
      <nav className="flex h-full w-14 flex-col items-center border-r border-cyber-line/50 bg-cyber-base/70 py-4 shrink-0 select-none">
        <div className="flex flex-col gap-4 items-center flex-1 w-full overflow-y-auto scrollbar-none py-1">
          {tabsOrder.filter((tab) => !PINNED_SIDEBAR_TABS.has(tab)).map(renderTabButton)}
        </div>
        <div className="mt-auto flex shrink-0 flex-col items-center gap-3 border-t border-cyber-line/40 pt-3">
          {tabsOrder.filter((tab) => PINNED_SIDEBAR_TABS.has(tab)).map(renderTabButton)}
        </div>
      </nav>
 
      {/* 2. Primary Sidebar Panel Content */}
      {!isSidebarCollapsed && (
        <aside className="flex flex-1 flex-col overflow-hidden">

        {/* Active Tab: CLI Manager (Terminal Orchestrator - unified hub) */}
        {activeTab === 'cli-manager' && (
          <div className="flex h-full flex-col overflow-hidden">
            {/* Header & Sub-Navigation Pills */}
            <div className="flex shrink-0 flex-col border-b border-cyber-line bg-cyber-base/20">
              <div className="flex items-center justify-between px-4 pt-3 pb-2">
                <div>
                  <h1 className="font-display text-sm uppercase tracking-[0.2em] text-cyber-electric font-bold">Terminal Orchestor</h1>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">CLIs, Operator, Configs & Explorer</p>
                </div>
              </div>

              {/* Sub-Navigation Pills */}
              <div className="flex items-center gap-1 px-3 pb-2.5">
                <button
                  type="button"
                  onClick={() => setCliSubTab('clis')}
                  className={`flex-1 rounded px-1.5 py-1 text-[10px] font-semibold transition ${
                    cliSubTab === 'clis'
                      ? 'bg-cyber-electric/20 text-cyber-electric border border-cyber-electric/40 shadow-neon-blue-sm-faint font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-base/40'
                  }`}
                >
                  💻 CLIs
                </button>
                <button
                  type="button"
                  onClick={() => setCliSubTab('operator')}
                  className={`flex-1 rounded px-1.5 py-1 text-[10px] font-semibold transition ${
                    cliSubTab === 'operator'
                      ? 'bg-cyber-electric/20 text-cyber-electric border border-cyber-electric/40 shadow-neon-blue-sm-faint font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-base/40'
                  }`}
                >
                  ☁️ VM
                </button>
                <button
                  type="button"
                  onClick={() => setCliSubTab('configs')}
                  className={`flex-1 rounded px-1.5 py-1 text-[10px] font-semibold transition ${
                    cliSubTab === 'configs'
                      ? 'bg-cyber-electric/20 text-cyber-electric border border-cyber-electric/40 shadow-neon-blue-sm-faint font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-base/40'
                  }`}
                >
                  ⚡ Configs
                </button>
                <button
                  type="button"
                  onClick={() => setCliSubTab('explorer')}
                  className={`flex-1 rounded px-1.5 py-1 text-[10px] font-semibold transition ${
                    cliSubTab === 'explorer'
                      ? 'bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/40 shadow-neon-sm-faint font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-base/40'
                  }`}
                >
                  📁 Explorer
                </button>
              </div>
            </div>

            {/* Sub-view 1: CLIs & Sessions */}
            {cliSubTab === 'clis' && (
              <div className="flex flex-1 flex-col overflow-hidden">
                {/* Action bar */}
                <div className="flex shrink-0 items-center justify-between border-b border-cyber-line/40 px-3 py-2 bg-cyber-base/10">
                  <span className="font-display text-[10px] uppercase tracking-wider text-slate-400 font-bold">CLI Connections</span>
                  <button
                    type="button"
                    onClick={onAddCli}
                    className="rounded border border-cyber-neon/40 px-2 py-0.5 text-[10px] font-semibold text-cyber-neon transition hover:border-cyber-neon hover:bg-cyber-neon/10 shadow-neon-sm-faint"
                  >
                    Add CLI
                  </button>
                </div>

                {/* Search Box */}
                <div className="shrink-0 p-2.5 border-b border-cyber-line/50">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search CLI name, command or group..."
                      value={cliSearchQuery}
                      onChange={(e) => setCliSearchQuery(e.target.value)}
                      className="w-full rounded border border-cyber-line bg-cyber-base pl-3 pr-8 py-1.5 text-slate-200 placeholder-slate-500 outline-none transition focus:border-cyber-neon text-[11px]"
                    />
                    {cliSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setCliSearchQuery('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* CLI Grouped List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin">
                  {Object.keys(groupedClis).length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 py-8 select-none">
                      <TerminalIcon />
                      <p className="mt-4 text-xs font-semibold text-slate-300">No CLIs Found</p>
                      <p className="mt-1 text-[11px] text-slate-500 leading-normal">
                        {cliSearchQuery ? 'Try adjusting your search query.' : 'Add your first CLI connection above to start.'}
                      </p>
                    </div>
                  ) : (
                    (Object.entries(groupedClis) as [string, CliDefinition[]][]).map(([groupName, cliList]) => {
                      const isCollapsed = !!collapsedCliGroups[groupName];
                      return (
                        <div key={groupName} className="space-y-1">
                          <button
                            type="button"
                            onClick={() => setCollapsedCliGroups((prev) => ({ ...prev, [groupName]: !isCollapsed }))}
                            className="flex w-full items-center justify-between font-display text-[11px] uppercase tracking-wider text-slate-400 hover:text-slate-200 py-1"
                          >
                            <div className="flex items-center gap-1.5 font-bold">
                              <FolderArrowIcon isExpanded={!isCollapsed} />
                              <span>{groupName}</span>
                              <span className="text-[9px] opacity-60 font-semibold lowercase">({cliList.length})</span>
                            </div>
                          </button>

                          {!isCollapsed && (
                            <div className="space-y-1.5 pl-2 border-l border-cyber-line/20 ml-1.5 mt-1">
                              {cliList.map((cli) => (
                                <div
                                  key={cli.name}
                                  onClick={() => onSelectCli(cli.name)}
                                  onDoubleClick={() => onOpenCliInteraction(cli)}
                                  className={`rounded border px-1.5 py-1.5 transition cursor-pointer ${
                                    activeCli === cli.name
                                      ? 'border-cyber-neon bg-cyber-neon/10 shadow-neon-sm-faint'
                                      : 'border-cyber-line bg-cyber-base/40 hover:border-cyber-neon/60 hover:bg-cyber-neon/5'
                                  }`}
                                >
                                  <div className="flex items-start gap-1.5">
                                    <div className="min-w-0 flex-1 text-left">
                                      <span className="block truncate text-[11px] font-semibold text-slate-200 leading-tight">{cli.name}</span>
                                      <span className="block truncate text-[9px] text-slate-500 font-mono leading-tight">{cli.command}</span>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onOpenCliInteraction(cli);
                                        }}
                                        aria-label={`Start ${cli.name}`}
                                        title="Start Session"
                                        className="flex h-5 w-5 items-center justify-center rounded border border-cyber-neon/70 text-cyber-neon transition hover:bg-cyber-neon/10"
                                      >
                                        <PlayIcon />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onEditCli(cli);
                                        }}
                                        aria-label={`Edit ${cli.name}`}
                                        title="Edit CLI"
                                        className="flex h-5 w-5 items-center justify-center rounded border border-cyber-electric/60 text-cyber-electric transition hover:bg-cyber-electric/10"
                                      >
                                        <EditIcon />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onDeleteCli(cli);
                                        }}
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
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Sub-view 2: VM Operator (SSH connections) */}
            {cliSubTab === 'operator' && (
              <div className="flex flex-1 flex-col overflow-hidden">
                {/* Action bar */}
                <div className="flex shrink-0 items-center justify-between border-b border-cyber-line/40 px-3 py-2 bg-cyber-base/10">
                  <span className="font-display text-[10px] uppercase tracking-wider text-slate-400 font-bold">VM Connections</span>
                  <button
                    type="button"
                    onClick={onAddSsh}
                    className="rounded border border-cyber-electric/50 px-2 py-0.5 text-[10px] font-semibold text-cyber-electric transition hover:border-cyber-electric hover:bg-cyber-electric/10 shadow-neon-blue-sm-faint"
                  >
                    Add VM
                  </button>
                </div>

                {/* Search Box */}
                <div className="shrink-0 p-2.5 border-b border-cyber-line/50">
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

                {/* Connection List */}
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

                          {!isCollapsed && (
                            <div className="space-y-1.5 pl-2 border-l border-cyber-line/20 ml-1.5 mt-1">
                              {conns.map((conn) => (
                                <div
                                  key={conn.id}
                                  onDoubleClick={() => {
                                    if (conn.protocol === 'rdp') onConnectRdp(conn);
                                    else onConnectSsh(conn);
                                    setCliSubTab('explorer');
                                  }}
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
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (conn.protocol === 'rdp') onConnectRdp(conn);
                                          else onConnectSsh(conn);
                                          setCliSubTab('explorer');
                                        }}
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

            {/* Sub-view 3: Quick Config Files Manager */}
            {cliSubTab === 'configs' && (
              <div className="flex flex-1 flex-col overflow-hidden">
                {/* Action bar */}
                <div className="flex shrink-0 items-center justify-between border-b border-cyber-line/40 px-3 py-2 bg-cyber-base/10">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-[10px] uppercase tracking-wider text-slate-400 font-bold">Quick Config Files</span>
                    {quickConfigFiles.length > 0 && (
                      <span className="rounded bg-cyber-electric/15 px-1.5 py-0.2 text-[8px] font-bold text-cyber-electric border border-cyber-electric/30 font-mono">
                        {quickConfigFiles.length}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSpecialConfig(null);
                      setSpecialModalOpen(true);
                    }}
                    className="rounded border border-cyber-electric/50 px-2 py-0.5 text-[10px] font-semibold text-cyber-electric transition hover:border-cyber-electric hover:bg-cyber-electric/10 shadow-neon-blue-sm-faint"
                  >
                    + Add Config
                  </button>
                </div>

                {/* Search Box */}
                <div className="shrink-0 p-2.5 border-b border-cyber-line/50">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search config name, path, description or group..."
                      value={configSearchQuery}
                      onChange={(e) => setConfigSearchQuery(e.target.value)}
                      className="w-full rounded border border-cyber-line bg-cyber-base pl-3 pr-8 py-1.5 text-slate-200 placeholder-slate-500 outline-none transition focus:border-cyber-electric text-[11px]"
                    />
                    {configSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setConfigSearchQuery('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Grouped Config List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin">
                  {Object.keys(groupedConfigs).length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 py-8 select-none">
                      <span className="text-3xl mb-1">⚡</span>
                      <p className="mt-2 text-xs font-semibold text-slate-300">No Config Files Found</p>
                      <p className="mt-1 text-[11px] text-slate-500 leading-normal">
                        {configSearchQuery ? 'Try adjusting your search query.' : 'Add your first config file above to start.'}
                      </p>
                    </div>
                  ) : (
                    (Object.entries(groupedConfigs) as [string, { entry: FileEntry; specialMatch?: SpecialConfigFile }[]][]).map(([groupName, items]) => {
                      const isCollapsed = !!collapsedConfigGroups[groupName];
                      return (
                        <div key={groupName} className="space-y-1">
                          <button
                            type="button"
                            onClick={() => setCollapsedConfigGroups((prev) => ({ ...prev, [groupName]: !isCollapsed }))}
                            className="flex w-full items-center justify-between font-display text-[11px] uppercase tracking-wider text-slate-400 hover:text-slate-200 py-1"
                          >
                            <div className="flex items-center gap-1.5 font-bold">
                              <FolderArrowIcon isExpanded={!isCollapsed} />
                              <span>{groupName}</span>
                              <span className="text-[9px] opacity-60 font-semibold lowercase">({items.length})</span>
                            </div>
                          </button>

                          {!isCollapsed && (
                            <div className="space-y-2 pl-2 border-l border-cyber-line/20 ml-1.5 mt-1">
                              {items.map(({ entry, specialMatch }) => {
                                const ext = entry.name.split('.').pop()?.toUpperCase() || 'CFG';
                                const isActive = selectedFilePath === entry.path;
                                return (
                                  <div
                                    key={entry.path}
                                    onDoubleClick={() => void onFileClick(entry, rootPath)}
                                    className={`rounded border px-2.5 py-2 transition cursor-pointer ${
                                      isActive
                                        ? 'border-cyber-electric bg-cyber-electric/15 shadow-neon-blue-sm-faint'
                                        : 'border-cyber-line bg-cyber-base/40 hover:border-cyber-electric/60 hover:bg-cyber-electric/5'
                                    }`}
                                  >
                                    <div className="flex items-start gap-2">
                                      <span className="text-sm shrink-0 mt-0.5">{specialMatch ? '⚙️' : '📄'}</span>
                                      <div className="min-w-0 flex-1 text-left">
                                        <div className="flex items-center justify-between gap-1">
                                          <span className="truncate text-[11px] font-semibold text-slate-200 leading-tight">
                                            {specialMatch?.name || entry.name}
                                          </span>
                                          <span className="shrink-0 text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-cyber-electric/10 text-cyber-electric border border-cyber-electric/20 font-mono">
                                            {ext}
                                          </span>
                                        </div>
                                        <span className="block truncate text-[9px] text-slate-400 font-mono leading-tight mt-0.5">
                                          {specialMatch?.path || entry.path}
                                        </span>
                                        {specialMatch?.description && (
                                          <p className="text-[9px] text-slate-400 leading-tight mt-1 line-clamp-2">
                                            {specialMatch.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-cyber-line/20">
                                      <span className="text-[8px] text-slate-500 font-mono italic">Double-click or ⚡ to edit content</span>
                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            void onFileClick(entry, rootPath);
                                          }}
                                          title="Fast Access: Open file in editor immediately for quick editing"
                                          className="flex items-center gap-1 rounded border border-cyber-electric/60 px-2 py-0.5 text-[9px] font-semibold text-cyber-electric transition hover:bg-cyber-electric/20"
                                        >
                                          ⚡ Open
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingSpecialConfig(
                                              specialMatch || {
                                                id: `special-${Date.now()}`,
                                                name: entry.name,
                                                path: entry.path,
                                                description: '',
                                              }
                                            );
                                            setSpecialModalOpen(true);
                                          }}
                                          title="Edit Entry Info"
                                          className="flex h-5 w-5 items-center justify-center rounded border border-slate-600 text-slate-400 transition hover:border-slate-300 hover:text-white"
                                        >
                                          <EditIcon />
                                        </button>
                                        {specialMatch && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              deleteSpecialConfigFile(specialMatch.id);
                                            }}
                                            title="Delete Config Entry"
                                            className="flex h-5 w-5 items-center justify-center rounded border border-cyber-warn/60 text-cyber-warn transition hover:bg-cyber-warn/10"
                                          >
                                            <TrashIcon />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Sub-view 4: File Explorer */}
            {cliSubTab === 'explorer' && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex flex-col overflow-hidden shrink-0 flex-1 pr-1.5">
                  {rootPath ? (
                    <div className="flex flex-col h-full overflow-hidden">
                      {/* Workspace Info Banner */}
                      <div className="border-b border-cyber-line/50 bg-cyber-panel/60 p-3 flex flex-col gap-1.5 select-none shrink-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs">{isSshSession ? '🌐' : '🖥️'}</span>
                            <span className="font-display text-[10px] uppercase font-bold tracking-wider text-cyber-neon truncate">
                              {isSshSession
                                ? `SSH: ${sshConnection?.user ? sshConnection.user + '@' : ''}${sshConnection?.host || sshConnectionName || 'Remote'}`
                                : 'Local Workspace'}
                            </span>
                          </div>
                          {isSshSession && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-semibold bg-cyber-electric/15 text-cyber-electric border border-cyber-electric/30">
                              Port {sshConnection?.port || 22}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-1 text-[10px] font-mono text-slate-400 bg-cyber-base/60 px-2 py-1 rounded border border-cyber-line/30">
                          <span className="truncate flex-1 text-slate-300" title={rootPath}>
                            {rootPath}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(rootPath);
                            }}
                            className="text-slate-500 hover:text-cyber-electric transition p-0.5"
                            title="Copy workspace path"
                          >
                            📋
                          </button>
                        </div>
                      </div>

                      {/* Panel 0: Quick Config Files */}
                      <div className={`flex flex-col overflow-hidden border-b border-cyber-line/30 ${quickConfigsExpanded ? 'shrink-0 max-h-[220px]' : 'shrink-0'}`}>
                        <div className="flex w-full items-center justify-between border-b border-cyber-line/45 bg-cyber-base/40 px-4 py-2 select-none">
                          <button
                            type="button"
                            onClick={() => setQuickConfigsExpanded(!quickConfigsExpanded)}
                            className="flex items-center gap-2 flex-1 text-left"
                          >
                            <FolderArrowIcon isExpanded={quickConfigsExpanded} />
                            <span className="font-display text-[9px] uppercase font-bold tracking-[0.15em] text-cyber-electric">⚡ Quick Config Files</span>
                          </button>
                          <div className="flex items-center gap-1.5">
                            {quickConfigFiles.length > 0 && (
                              <span className="rounded bg-cyber-electric/15 px-1.5 py-0.2 text-[8px] font-bold text-cyber-electric border border-cyber-electric/30 font-mono">
                                {quickConfigFiles.length}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSpecialConfig(null);
                                setSpecialModalOpen(true);
                              }}
                              className="rounded border border-cyber-neon/40 px-1.5 py-0.5 text-[9px] font-bold uppercase text-cyber-neon transition hover:bg-cyber-neon/15"
                              title="Add custom Special Config File (Name, Path, Description)"
                            >
                              + Add
                            </button>
                          </div>
                        </div>

                        {quickConfigsExpanded && (
                          <div className="flex-1 overflow-y-auto py-1 scrollbar-thin">
                            {quickConfigFiles.length === 0 ? (
                              <p className="px-4 py-2 text-[10px] italic text-slate-500 font-mono">No config files (.yaml, .json, .env, .toml) loaded yet.</p>
                            ) : (
                              quickConfigFiles.map((entry) => {
                                const isActive = selectedFilePath === entry.path;
                                const specialMatch = specialConfigs.find(sc => sc.name === entry.name || sc.path === entry.path || entry.path.endsWith(sc.path));
                                return (
                                  <div
                                    key={`config-${entry.path}`}
                                    className={`flex items-center justify-between px-3 py-1.5 transition text-xs font-mono border-b border-cyber-line/10 group ${
                                      isActive ? 'bg-cyber-electric/15 text-cyber-electric border-l-2 border-cyber-electric pl-3' : 'text-slate-300 hover:text-white hover:bg-cyber-base/40'
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => void onFileClick(entry, rootPath)}
                                      className="flex flex-1 items-center gap-2 min-w-0 text-left"
                                      title={specialMatch ? `${specialMatch.name} (${specialMatch.path}): ${specialMatch.description}` : entry.path}
                                    >
                                      <span className="text-[10px] shrink-0">{specialMatch ? '⚙️' : '📄'}</span>
                                      <div className="flex flex-col min-w-0 flex-1">
                                        <span className="truncate font-semibold text-[11px] leading-tight">{entry.name}</span>
                                        {specialMatch?.description && (
                                          <span className="truncate text-[8px] text-slate-400 mt-0.5">{specialMatch.description}</span>
                                        )}
                                      </div>
                                    </button>

                                    <div className="flex items-center gap-1 shrink-0 ml-1">
                                      {specialMatch && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteSpecialConfigFile(specialMatch.id);
                                          }}
                                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition p-0.5 text-[10px]"
                                          title="Delete special config entry"
                                        >
                                          ✕
                                        </button>
                                      )}
                                      <span className="text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-cyber-electric/10 text-cyber-electric border border-cyber-electric/20 font-mono">
                                        {entry.name.split('.').pop() || 'CFG'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>

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
                              <div className="space-y-1">
                                {(() => {
                                  const staged = gitStatusList.filter(g => g.staged);
                                  const unstaged = gitStatusList.filter(g => !g.staged);

                                  const renderItem = (gitItem: typeof gitStatusList[0]) => {
                                    const entry: FileEntry = {
                                      name: gitItem.path.split('/').pop() || gitItem.path,
                                      path: joinWorkspacePath(rootPath, gitItem.path),
                                      isDir: false
                                    };
                                    const isActive = selectedFilePath === entry.path;
                                    let statusBadge = '';
                                    let textClass = 'text-slate-300 hover:text-white';
                                    if (gitItem.status === 'modified') { statusBadge = 'M'; textClass = 'text-amber-300 hover:text-amber-200 hover:bg-amber-400/5'; }
                                    else if (gitItem.status === 'added') { statusBadge = 'A'; textClass = 'text-emerald-300 hover:text-emerald-200 hover:bg-emerald-400/5'; }
                                    else if (gitItem.status === 'untracked') { statusBadge = 'U'; textClass = 'text-cyan-300 hover:text-cyan-200 hover:bg-cyan-400/5'; }
                                    else if (gitItem.status === 'deleted') { statusBadge = 'D'; textClass = 'text-rose-400 hover:text-rose-300 hover:bg-rose-400/5 line-through'; }

                                    return (
                                      <button
                                        key={gitItem.path}
                                        type="button"
                                        aria-disabled={gitItem.status === 'deleted'}
                                        onClick={() => {
                                          if (gitItem.status !== 'deleted') void onFileClick(entry, rootPath);
                                        }}
                                        onContextMenu={(event) => {
                                          event.preventDefault();
                                          setFileContextMenu({
                                            x: event.clientX,
                                            y: event.clientY,
                                            target: {
                                              path: entry.path,
                                              isDir: false,
                                              name: entry.name,
                                              rootPath,
                                              connection: null,
                                              canDelete: gitItem.status !== 'deleted',
                                            },
                                          });
                                        }}
                                        className={`flex w-full items-center justify-between px-4 py-1.5 text-left transition text-xs font-mono border-b border-cyber-line/10 ${
                                          isActive ? 'bg-cyber-neon/10 text-cyber-neon border-l-2 border-cyber-neon pl-3.5' : `${textClass}`
                                        }`}>
                                        <div className="flex flex-col min-w-0">
                                          <span className="truncate font-semibold text-slate-200">{entry.name}</span>
                                          <span className="truncate text-[8px] text-slate-500 font-mono mt-0.5" title={gitItem.path}>{gitItem.path}</span>
                                        </div>
                                        <span className={`text-[9px] font-bold px-1 py-0.2 rounded border font-mono scale-90 ${
                                          gitItem.status === 'modified' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' :
                                          gitItem.status === 'added' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' :
                                          gitItem.status === 'untracked' ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' :
                                          'text-rose-500 bg-rose-500/10 border-rose-500/20 line-through'
                                        }`}>{statusBadge}</span>
                                      </button>
                                    );
                                  };

                                  return (
                                    <>
                                      {staged.length > 0 && (
                                        <div>
                                          <div className="px-4 py-1 text-[9px] uppercase tracking-wider font-bold text-emerald-400 border-b border-cyber-line/20">Changes to be committed</div>
                                          {staged.map(renderItem)}
                                        </div>
                                      )}
                                      {unstaged.length > 0 && (
                                        <div>
                                          <div className="px-4 py-1 text-[9px] uppercase tracking-wider font-bold text-rose-400 border-b border-cyber-line/20">Changes not staged for commit</div>
                                          {unstaged.map(renderItem)}
                                        </div>
                                      )}
                                    </>
                                  );
                                })()}
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
          </div>
        )}

        {/* Active Tab: API Client (History & saved queries) */}
        {activeTab === 'apiclient' && <ApiHistoryList />}
      </aside>
      )}

      {/* LLM Configuration Modal - Removed in favor of category Settings */}

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
      {/* ── Chat Input Right Click Context Menu ── */}
      {inputContextMenu?.open && (
        <div
          style={(() => {
            const pos = getContextMenuPosition(inputContextMenu.x, inputContextMenu.y, 210, 120);
            return { top: `${pos.y}px`, left: `${pos.x}px` };
          })()}
          className="fixed z-[300] w-52 rounded-lg border border-cyber-neon/40 bg-cyber-panel/95 p-1 text-slate-100 shadow-2xl backdrop-blur-md select-none font-mono text-[11px]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => handleTriggerRewriteAction('rewrite', inputContextMenu.text)}
            className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-neon/25 hover:text-cyber-neon transition cursor-pointer w-full"
          >
            ✨ Optimize Prompt
          </button>
          <button
            type="button"
            onClick={() => handleTriggerRewriteAction('suggest', inputContextMenu.text)}
            className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-neon/25 hover:text-cyber-neon transition cursor-pointer w-full"
          >
            💻 Fix/Suggest Command
          </button>
        </div>
      )}

      {/* ── File Explorer Right-click Context Menu ── */}
      {fileContextMenu && (
        <div
          style={(() => {
            const pos = getContextMenuPosition(fileContextMenu.x, fileContextMenu.y, 200, 160);
            return { top: `${pos.y}px`, left: `${pos.x}px` };
          })()}
          className="fixed z-[150] w-48 rounded-lg border border-cyber-neon/40 bg-cyber-panel/95 p-1 text-slate-100 shadow-2xl backdrop-blur-md select-none font-mono text-[11px]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(fileContextMenu.target.path);
              setFileContextMenu(null);
            }}
            className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-electric/20 transition"
          >
            📋 Copy Path
          </button>
          {!fileContextMenu.target.connection && (
            <button
              type="button"
              onClick={async () => {
                const p = fileContextMenu.target.path;
                setFileContextMenu(null);
                try { await revealInFileManager(p); }
                catch (e) { console.error('Reveal failed:', e); }
              }}
              className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-electric/20 transition"
            >
              📂 Reveal in Explorer
            </button>
          )}
          {/* Download option for SSH remote files */}
          {fileContextMenu.target.connection && !fileContextMenu.target.isDir && (
            <button
              type="button"
              onClick={async () => {
                const conn = fileContextMenu.target.connection;
                const filePath = fileContextMenu.target.path;
                const fileName = fileContextMenu.target.name;
                setFileContextMenu(null);
                if (!conn) return;
                try {
                  const localPath = await save({ defaultPath: fileName });
                  if (localPath) {
                    await downloadSshFile(conn, filePath, localPath);
                  }
                } catch (e) {
                  console.error('Download failed:', e);
                }
              }}
              className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-cyber-electric/20 transition"
            >
              ⬇️ Download to Local
            </button>
          )}
          {fileContextMenu.target.canDelete && (
            <>
              <div className="my-1 border-t border-cyber-line/50" />
              <button
                type="button"
                onClick={() => openDeleteConfirmation(fileContextMenu.target)}
                className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-rose-500/20 hover:text-rose-400 transition"
              >
                <TrashIcon />
                Delete
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirmation-title"
            className="w-96 max-w-[calc(100vw-2rem)] rounded-lg border border-rose-500/50 bg-cyber-panel/95 p-6 shadow-2xl backdrop-blur-md select-none"
          >
            <h2 id="delete-confirmation-title" className="font-display text-sm uppercase tracking-[0.2em] text-rose-400 font-bold mb-4">Delete Confirmation</h2>
            <p className="text-sm text-slate-300 mb-2">
              {deleteConfirm.isDir
                ? 'This permanently deletes the folder and all of its contents:'
                : 'This permanently deletes the file:'}
            </p>
            <p className="text-sm text-rose-300 font-mono bg-cyber-base/50 p-2 rounded border border-cyber-line mb-6 break-all">
              {deleteConfirm.name}
            </p>
            {deleteConfirm.error && (
              <p role="alert" className="mb-4 max-h-24 overflow-y-auto rounded border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300 break-words">
                {deleteConfirm.error}
              </p>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleteConfirm.deleting}
                className="px-4 py-1.5 text-xs text-slate-400 hover:text-slate-200 uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleConfirmDelete()}
                disabled={deleteConfirm.deleting}
                className="min-w-20 px-4 py-1.5 text-xs font-bold text-rose-400 bg-rose-500/20 border border-rose-500/40 rounded hover:bg-rose-500/30 uppercase tracking-wider transition disabled:cursor-wait disabled:opacity-60"
              >
                {deleteConfirm.deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── AI Chat Input Rewrite Modal ── */}
      {rewriteModal?.open && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[480px] rounded-xl border border-cyber-neon/50 bg-cyber-panel/95 p-6 shadow-2xl backdrop-blur-md select-none">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-cyber-neon font-bold mb-4">
              {rewriteModal.type === 'suggest' ? '💻 AI Command Suggester' : '✨ AI Prompt Optimizer'}
            </h2>

            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-wide text-slate-400 mb-1">Original Message</label>
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
                  <span>Running local inference...</span>
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
                      setChatInput(rewriteModal.resultText);
                      setRewriteModal(null);
                    }}
                    className="rounded border border-cyber-neon/40 bg-cyber-neon/15 px-4 py-2 hover:bg-cyber-neon/25 text-cyber-neon transition uppercase font-bold"
                  >
                    ✔️ Apply (Replace Input)
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setRewriteModal(null)}
                className="rounded border border-cyber-line px-4 py-2 hover:bg-cyber-line/20 text-slate-300 transition uppercase"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Special Config File Modal */}
      <SpecialConfigModal
        isOpen={specialModalOpen}
        initialConfig={editingSpecialConfig}
        onClose={() => setSpecialModalOpen(false)}
        onSave={(entry) => {
          saveSpecialConfigFile(entry);
        }}
      />
    </div>
  );
}
