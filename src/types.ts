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
  id?: string;
  name: string;
  url: string;
  apiKey: string;
  model: string;
  weight: number;
  maxRetries: number;
  headers: Record<string, string>;
  customUserAgent?: string;
}

export interface ProxyBackendUsage {
  backendId: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  reportedRequests: number;
  unreportedRequests: number;
  resetAt: string;
  updatedAt: string;
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

export interface WebAiProfile {
  id: string;
  name: string;
  userAgent?: string;
  partition: string;
  defaultUrl: string;
  allowNavigationRules: string[];
}

export interface WebAiConfig {
  profiles: WebAiProfile[];
  preferredProfileId?: string;
}

export interface WebAiRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

// ── Companion types ──────────────────────────────────────────────

export interface FeatureEntry {
  featureId: string;
  title: string;
  aliases: string[];
  summary: string;
  help: string;
  availability: string;
  viewId?: string;
  settingsSection?: string;
  backendCommands: string[];
  toolExposure: 'knowledge-only' | 'read-tool' | 'action-tool' | 'unavailable';
  limitations: string[];
}

export interface CatalogResponse {
  features: FeatureEntry[];
  compactIndex: string;
}

export interface HelpDetail {
  featureId: string;
  title: string;
  help: string;
  summary: string;
  howToOpen: string;
  availability: string;
  limitations: string[];
  toolExposure: string;
  backendCommands: string[];
}

export interface SafeAppContext {
  activeView: string | null;
  selectedCli: string | null;
  workspacePath: string | null;
  projectTag: string | null;
  activeSessions: number;
  cliProfiles: string[];
  proxyBackendNames: string[];
  proxyRunning: boolean;
  proxyPort: number | null;
  sshProfiles: string[];
  quickApps: string[];
  builtinLlmLoaded: boolean;
  actionsEnabled: boolean;
}

// ── Future Companion types (US-021+) ─────────────────────────────

export interface CompanionConfigView {
  baseUrl: string;
  model: string;
  apiKeyPresent: boolean;
  streamEnabled: boolean;
  customPrompt: string;
  customHeaders: { name: string; masked: boolean }[];
  actionsEnabled: boolean;
}

export interface CompanionConfigUpdate {
  baseUrl?: string;
  model?: string;
  apiKey?: string;
  streamEnabled?: boolean;
  customPrompt?: string;
  customHeaders?: Record<string, string>;
  clearApiKey?: boolean;
  clearCustomHeaders?: string[];
  actionsEnabled?: boolean;
}

export type CompanionRunEventType =
  | 'assistant_delta'
  | 'tool_started'
  | 'approval_required'
  | 'tool_result'
  | 'ui_effect'
  | 'warning'
  | 'error'
  | 'done';

export interface CompanionRunEvent {
  runId: string;
  seq: number;
  type: CompanionRunEventType;
  actionId?: string;
  payload: unknown;
}

export interface CompanionMessage {
  id: string;
  runId: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  status: 'pending' | 'streaming' | 'complete' | 'error';
  timestamp: string;
  toolCalls?: CompanionToolCall[];
}

export interface CompanionToolCall {
  actionId: string;
  toolId: string;
  toolName: string;
  arguments: Record<string, unknown>;
  risk: ToolRisk;
  approvalState: 'pending' | 'approved' | 'denied' | 'not_required';
  result?: string;
  verified?: boolean;
}

export type ToolRisk = 'none' | 'read' | 'config_write' | 'delete' | 'stop';

export interface PendingAction {
  actionId: string;
  runId: string;
  toolName: string;
  description: string;
  target: string;
  diff: Record<string, unknown>;
  risk: ToolRisk;
  reason: string;
}

export interface CompanionUiEffect {
  type: 'open_view' | 'open_settings' | 'focus_session';
  targetId: string;
  label: string;
}
