import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { CliDefinition, SessionInfo, FileEntry, AppTheme, AssistantState, LlmConfig, LlmChatMessage, SshConnection, GitStatusEntry } from '../types';
import { AnimeAssistant } from './AnimeAssistant';
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
} from '../lib/tauri';

// --- SVG Icons ---

function CloudIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
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
}

type SidebarTab = 'explorer' | 'cli-manager' | 'quickapps' | 'settings' | 'ai-chat' | 'operator';

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
}: CliSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('cli-manager');

  const handleSetActiveTab = useCallback((tab: SidebarTab) => {
    const wasQuickApps = activeTab === 'quickapps';
    const isQuickApps = tab === 'quickapps';
    setActiveTab(tab);
    // Only notify parent when quickapps state actually changes
    if (onQuickAppsTabChange && wasQuickApps !== isQuickApps) {
      onQuickAppsTabChange(isQuickApps);
    }
  }, [activeTab, onQuickAppsTabChange]);

  // --- Sidebar Resizer Code ---
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('ai-cli-sidebar-width');
    return saved ? parseInt(saved, 10) : 320;
  });

  const isResizingRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      const newWidth = Math.max(220, Math.min(e.clientX, 800));
      setSidebarWidth(newWidth);
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
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoadingLlm]);

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
      className="relative flex h-full shrink-0 border-r border-cyber-line bg-cyber-panel/75 backdrop-blur"
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Resizable drag handle bar */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 right-0 bottom-0 w-1.5 cursor-col-resize hover:bg-cyber-neon/40 active:bg-cyber-neon transition-colors z-50"
      />
      {/* 1. Left-most Activity Bar (VSCode Style) */}
      <nav className="flex h-full w-14 flex-col items-center justify-between border-r border-cyber-line/50 bg-cyber-base/70 py-4">
        <div className="flex flex-col gap-5">
          <button
            type="button"
            onClick={() => handleSetActiveTab('cli-manager')}
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

          <button
            type="button"
            onClick={() => handleSetActiveTab('explorer')}
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
            onClick={() => handleSetActiveTab('quickapps')}
            title="Quick Apps (favorite apps launcher)"
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
              activeTab === 'quickapps'
                ? 'text-cyber-electric bg-cyber-electric/10 shadow-neon-blue-sm'
                : 'text-slate-400 hover:text-cyber-electric hover:bg-cyber-electric/10'
            }`}
          >
            {activeTab === 'quickapps' && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-electric" />
            )}
            <QuickAppsIcon />
          </button>

          <button
            type="button"
            onClick={() => handleSetActiveTab('operator')}
            title="Operator (SSH VM Manager)"
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
              activeTab === 'operator'
                ? 'text-cyber-electric bg-cyber-electric/10 shadow-neon-blue-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'operator' && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-cyber-electric" />
            )}
            <CloudIcon />
          </button>
        </div>

        <button
          type="button"
          onClick={() => handleSetActiveTab('settings')}
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
        {/* Anime Assistant — click to toggle AI Chat panel */}
        <div
          className="p-3 border-b border-cyber-line bg-cyber-base/30 shrink-0 cursor-pointer transition-colors hover:bg-cyber-neon/5 select-none"
          onClick={() => handleSetActiveTab(activeTab === 'ai-chat' ? 'explorer' : 'ai-chat')}
          role="button"
          title={activeTab === 'ai-chat' ? 'Close AI Companion Chat' : 'Open AI Companion Chat'}
          aria-label="Toggle AI Companion Chat"
        >
          <div className={`relative transition-all ${activeTab === 'ai-chat' ? 'ring-1 ring-cyber-neon/60 rounded-xl' : ''}`}>
            <AnimeAssistant state={assistantState} text={assistantText} />
            {activeTab !== 'ai-chat' && chatHistory.length > 0 && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-cyber-neon animate-pulse shadow-neon-sm" title="New messages" />
            )}
            <div className={`absolute bottom-1.5 right-2 text-[8px] font-bold uppercase tracking-widest transition ${
              activeTab === 'ai-chat' ? 'text-cyber-neon' : 'text-slate-500'
            }`}>
              {activeTab === 'ai-chat' ? '▲ close chat' : '▼ open chat'}
            </div>
          </div>
        </div>

        {/* Active Tab: Explorer */}
        {activeTab === 'explorer' && (
          <div className="flex h-full flex-col overflow-hidden">
            {/* Explorer header */}
            <div className="flex shrink-0 items-center justify-between border-b border-cyber-line p-4">
              <h2 className="font-display text-xs uppercase tracking-[0.2em] text-cyber-neon font-bold">Explorer</h2>
              <div className="flex gap-1.5">
                {rootPath && (
                  <button
                    type="button"
                    onClick={() => void openWorkspaceFolder(rootPath)}
                    title="Open directory in Windows Explorer"
                    className="rounded border border-cyber-electric/40 px-2 py-0.5 text-[10px] uppercase font-semibold text-cyber-electric transition hover:border-cyber-electric hover:bg-cyber-electric/10"
                  >
                    Reveal
                  </button>
                )}
                {rootPath && (
                  <button
                    type="button"
                    onClick={() => setIsSearchModalOpen(true)}
                    title="Search files (Ctrl+P)"
                    className="rounded border border-cyber-neon/60 bg-cyber-neon/10 px-2 py-0.5 text-[10px] uppercase font-semibold text-cyber-neon transition hover:border-cyber-neon hover:bg-cyber-neon/20 shadow-neon-sm"
                  >
                    🔍 Find File (Ctrl+P)
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSelectFolder}
                  title="Open Local Folder"
                  className="rounded border border-cyber-neon/40 px-2 py-0.5 text-[10px] uppercase font-semibold text-cyber-neon transition hover:border-cyber-neon hover:bg-cyber-neon/10"
                >
                  Open Folder
                </button>
              </div>
            </div>

            {/* Accordion Panels Container */}
            <div
              className="flex flex-col overflow-hidden shrink-0 border-b border-cyber-line/20 flex-1"
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
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
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
                              className="rounded border border-cyber-line bg-cyber-base/40 p-2.5 transition hover:border-cyber-electric/60 hover:bg-cyber-electric/5"
                            >
                              <div className="flex items-start gap-1.5">
                                <div className="min-w-0 flex-1">
                                  <span className="block truncate text-[12.5px] font-bold text-slate-100">{conn.name}</span>
                                  <span className="block truncate text-[9.5px] text-slate-400 font-mono mt-0.5">
                                    {conn.user}@{conn.host}:{conn.port}
                                  </span>
                                  <span className={`inline-block rounded border px-1 py-0.5 text-[8.5px] font-semibold mt-1.5 uppercase tracking-wider ${
                                    conn.protocol === 'rdp'
                                      ? 'bg-cyber-electric/10 border-cyber-electric/40 text-cyber-electric'
                                      : 'bg-cyber-neon/10 border-cyber-neon/40 text-cyber-neon'
                                  }`}>
                                    {conn.protocol === 'rdp' ? '💻 RDP' : conn.authMode === 'key' ? '🔑 SSH Key' : '⌨ SSH Pass'}
                                  </span>
                                </div>

                                <div className="mt-0.5 flex shrink-0 items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => conn.protocol === 'rdp' ? onConnectRdp(conn) : onConnectSsh(conn)}
                                    aria-label={conn.protocol === 'rdp' ? `Remote Desktop to ${conn.name}` : `Connect SSH to ${conn.name}`}
                                    title={conn.protocol === 'rdp' ? "Launch RDP Session" : "Connect SSH Session"}
                                    className="flex h-5.5 w-5.5 items-center justify-center rounded border border-cyber-neon/70 text-cyber-neon transition hover:bg-cyber-neon/10"
                                  >
                                    <PlayIcon />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onEditSsh(conn)}
                                    aria-label={`Edit ${conn.name}`}
                                    title="Edit Profile"
                                    className="flex h-5.5 w-5.5 items-center justify-center rounded border border-cyber-electric/60 text-cyber-electric transition hover:bg-cyber-electric/10"
                                  >
                                    <EditIcon />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onDeleteSsh(conn)}
                                    aria-label={`Delete ${conn.name}`}
                                    title="Delete Profile"
                                    className="flex h-5.5 w-5.5 items-center justify-center rounded border border-cyber-warn/60 text-cyber-warn transition hover:bg-cyber-warn/10"
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
