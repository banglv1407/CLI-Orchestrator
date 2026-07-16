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
  panel?: 'bottom' | 'right';
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

export type AppTheme = 'cyberpunk' | 'kawaii' | 'light';

export interface QuickApp {
  id: string;
  name: string;
  command: string;
  args: string[];
  workingDir?: string;
  iconPath?: string;
  order: number;
  iconDataUrl?: string;
  iconMissing: boolean;
  group?: string;
}

export interface FileEntry {
  name: string;
  path: string;
  isDir: boolean;
}

export interface RipgrepMatch {
  filePath: string;
  lineNumber: number;
  content: string;
}

export interface GitStatusEntry {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'untracked';
  staged: boolean;
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
  workingDir?: string;
}
export interface ProxyBackend {
  name: string;
  url: string;
  apiKey: string;
  model: string;
  weight: number;
  maxRetries: number;
  headers: Record<string, string>;
  customUserAgent?: string;
}

export interface ProxyConfig {
  port: number;
  backends: ProxyBackend[];
  enabled: boolean;
}

export interface ProxyStatus {
  running: boolean;
  port: number;
  activeBackends: number;
  totalRequests: number;
}
export interface ProxyLogEntry {
  id: number;
  timestamp: string;
  backend: string;
  model: string;
  requestJson: string;
  responseJson: string;
  status: number;
  durationMs: number;
  success: boolean;
  errorMsg?: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  normalizedResponseJson: string;
  responseTruncated: boolean;
}
export interface SystemLogEntry {
  timestamp: string;
  level: string;
  source: string;
  message: string;
}

export interface NotepadContent {
  text: string;
  language: string;
}

export interface BuiltinLlmConfig {
  enabled: boolean;
  modelPath: string | null;
  tokenizerPath: string | null;
  maxTokens: number;
  temperature: number;
  repeatPenalty: number;
  seed: number;
  runtime: string;
  serverPath: string | null;
  serverPort: number;
}

export interface BuiltinLlmStatus {
  loaded: boolean;
  modelPath: string | null;
  enabled: boolean;
}


