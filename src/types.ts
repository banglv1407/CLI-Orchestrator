export type CliMode = 'interactive';

export type AssistantState = 'Idle' | 'Thinking' | 'Running CLI' | 'Error' | 'Done';

export interface CliSavedDirectory {
  tag: string;
  path: string;
}

export interface CliDefinition {
  name: string;
  command: string;
  args: string[];
  mode: CliMode;
  env?: Record<string, string>;
  defaultWorkingDir?: string;
  savedDirectories?: CliSavedDirectory[];
}

export interface SessionInfo {
  id: string;
  cliName: string;
  status: string;
  workingDir?: string;
  projectTag?: string;
}

export interface ProjectTag {
  tag: string;
  path: string;
}

export interface CliOutputEvent {
  sessionId?: string;
  cliName: string;
  chunk: string;
  stream: 'stdout' | 'stderr';
}

export interface CliStatusEvent {
  sessionId?: string;
  cliName: string;
  status: 'started' | 'completed' | 'error' | 'stopped';
  message?: string;
  exitCode?: number;
}

export interface CreateSessionRequest {
  cliName: string;
  workingDir?: string;
  projectTag?: string;
}

export interface StopCliRequest {
  sessionId: string;
}

export interface UpsertCliRequest {
  cli: CliDefinition;
  originalName?: string;
}

export interface AccountProfile {
  id: string;
  cliName: string;
  profileName: string;
  createdAt: string;
  lastUsed?: string;
}

export interface AccountStatus {
  cliName: string;
  activeProfile?: string;
  availableProfiles: string[];
}

export interface CooldownEntry {
  cliName: string;
  profileName: string;
  until: string;
}

export interface SaveAccountRequest {
  cliName: string;
  profileName: string;
}

export interface ActivateAccountRequest {
  cliName: string;
  profileName: string;
}

export interface DeleteAccountRequest {
  cliName: string;
  profileName: string;
}

export interface SetCooldownRequest {
  cliName: string;
  profileName: string;
  minutes: number;
}

export interface CassIndexSummary {
  indexed: number;
  skipped: number;
  removed: number;
  tokens: number;
  sessionsTotal: number;
  tokensTotal: number;
  sources: CassSourceInfo[];
  lastIndexedAt: string;
  errors: number;
}

export interface CassIndexStats {
  sessionsTotal: number;
  tokensTotal: number;
  sources: CassSourceInfo[];
  lastIndexedAt?: string;
}

export interface CassSourceInfo {
  name: string;
  path: string;
  exists: boolean;
  files: number;
}

export interface CassSearchResult {
  sessionId: string;
  cliName: string;
  path: string;
  updatedAt: string;
  score: number;
  snippet: string;
  cwd?: string;
}

export interface CassSearchRequest {
  query: string;
  limit?: number;
  refresh?: boolean;
}

export type AppTheme = 'cyberpunk' | 'kawaii';

export interface FileEntry {
  name: string;
  path: string;
  isDir: boolean;
}

export interface GitStatusEntry {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'untracked';
}

export interface FolderHistoryEntry {
  path: string;
  timestamp: number;
}

export interface LlmConfig {
  baseUrl: string;
  model: string;
  apiKey: string;
  headers: Record<string, string>;
  systemPrompt: string;
  stream: boolean;
}

export interface LlmChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SshConnection {
  id: string;
  name: string;
  protocol: 'ssh' | 'rdp';
  host: string;
  port: number;
  user: string;
  authMode?: 'password' | 'key';
  keyPath?: string;
  password?: string;
  group: string;
  rdpResolution?: 'fullscreen' | '1080p' | '720p' | 'custom';
  rdpShareClipboard?: boolean;
  rdpShareDrives?: boolean;
}



