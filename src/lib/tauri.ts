import { invoke } from '@tauri-apps/api/core';
import type {
  CliDefinition,
  CreateSessionRequest,
  ProjectTag,
  SessionInfo,
  StopCliRequest,
  UpsertCliRequest,
  FileEntry,
  SshConnection,
  GitStatusEntry,
  QuickApp,
  RipgrepMatch,
  ProxyBackend,
  ProxyBackendUsage,
  ProxyConfig,
  ProxyLogEntry,
  ProxyStatus,
  SystemLogEntry,
  NotepadContent,
  WebAiProfile,
  WebAiConfig,
  WebAiRect,
} from '../types';

export function listClis(): Promise<CliDefinition[]> {
  return invoke('list_clis');
}

export function upsertCli(request: UpsertCliRequest): Promise<CliDefinition> {
  return invoke('upsert_cli', { request });
}

export function deleteCli(name: string): Promise<void> {
  return invoke('delete_cli', { request: { name } });
}

export function listSessions(): Promise<SessionInfo[]> {
  return invoke('list_sessions');
}

export function listProjectTags(): Promise<ProjectTag[]> {
  return invoke('list_project_tags');
}

export function saveProjectTag(tag: string, path: string): Promise<ProjectTag[]> {
  return invoke('save_project_tag', { request: { tag, path } });
}

export function saveCliTag(cliName: string, tag: string, path: string): Promise<CliDefinition> {
  return invoke('save_cli_tag', { request: { cliName, tag, path } });
}

export function backendLogsPath(): Promise<string> {
  return invoke('backend_logs_path');
}

export function openBackendLogsFolder(): Promise<string> {
  return invoke('open_backend_logs_folder');
}

export function pickFolder(): Promise<string | null> {
  return invoke('pick_folder');
}

export function createTerminalSession(request: CreateSessionRequest): Promise<SessionInfo> {
  return invoke('create_terminal_session', { request });
}

export function sendCliInput(sessionId: string, input: string): Promise<void> {
  return invoke('send_cli_input', { request: { sessionId, input } });
}

export function stopCli(request: StopCliRequest): Promise<void> {
  return invoke('stop_cli', { request });
}export function listDirectoryFiles(path: string): Promise<FileEntry[]> {
  return invoke('list_directory_files', { path });
}

export function readFileContent(path: string): Promise<string> {
  return invoke('read_file_content', { path });
}

export function writeFileContent(path: string, content: string): Promise<void> {
  return invoke('write_file_content', { path, content });
}

export function createDirectory(path: string): Promise<void> {
  return invoke('create_directory', { path });
}

export function createFileContent(path: string, content: string): Promise<void> {
  return invoke('create_file_content', { path, content });
}

export function deleteFileOrDir(path: string, rootPath: string): Promise<void> {
  return invoke('delete_file_or_dir', { path, rootPath });
}

export function deleteSshFileOrDir(connection: SshConnection, path: string, rootPath: string): Promise<void> {
  return invoke('delete_ssh_file_or_dir', { connection, path, rootPath });
}

export function listSshDirectoryFiles(connection: SshConnection, path: string): Promise<FileEntry[]> {
  return invoke('list_ssh_directory_files', { connection, path });
}

export function readSshFileContent(connection: SshConnection, path: string): Promise<string> {
  return invoke('read_ssh_file_content', { connection, path });
}

export function writeSshFileContent(connection: SshConnection, path: string, content: string): Promise<void> {
  return invoke('write_ssh_file_content', { connection, path, content });
}

export function listAllFilesRecursive(path: string): Promise<FileEntry[]> {
  return invoke('list_all_files_recursive', { path });
}

export function listSshFilesRecursive(connection: SshConnection, path: string): Promise<FileEntry[]> {
  return invoke('list_ssh_files_recursive', { connection, path });
}

export function pickFile(): Promise<string | null> {
  return invoke('pick_file');
}

export function loadSshConnections(): Promise<SshConnection[]> {
  return invoke('load_ssh_connections');
}

export function saveSshConnections(connections: SshConnection[]): Promise<void> {
  return invoke('save_ssh_connections', { connections });
}

export function createSshSession(connection: SshConnection): Promise<SessionInfo> {
  return invoke('create_ssh_session', { connection });
}

export function createRdpSession(connection: SshConnection): Promise<void> {
  return invoke('create_rdp_session', { connection });
}

export function openWorkspaceFolder(path: string): Promise<void> {
  return invoke('open_workspace_folder', { path });
}

export function revealInFileManager(path: string): Promise<void> {
  return invoke('reveal_in_file_manager', { path });
}

export function getGitStatus(repoPath: string): Promise<any[]> {
  return invoke('get_git_status', { repoPath });
}

export function getGitDiff(repoPath: string, filePath: string, isUntracked: boolean): Promise<string> {
  return invoke('get_git_diff', { repoPath, filePath, isUntracked });
}

export function listQuickapps(): Promise<QuickApp[]> {
  return invoke('list_quickapps');
}

export function upsertQuickapp(app: QuickApp): Promise<QuickApp> {
  return invoke('upsert_quickapp', { app });
}

export function deleteQuickapp(id: string): Promise<void> {
  return invoke('delete_quickapp', { id });
}

export function reextractQuickappIcons(): Promise<QuickApp[]> {
  return invoke('reextract_icons');
}

export function launchQuickapp(id: string): Promise<number> {
  return invoke('launch_quickapp', { id });
}

export function ripgrepSearch(path: string, query: string): Promise<RipgrepMatch[]> {
  return invoke('ripgrep_search', { path, query });
}

export interface SshServerStatus {
  running: boolean;
  port: number;
  localIp: string;
  logs: string[];
}

export function startSshServer(port: number): Promise<void> {
  return invoke('start_ssh_server', { port });
}

export function stopSshServer(): Promise<void> {
  return invoke('stop_ssh_server');
}

export function getSshServerStatus(): Promise<SshServerStatus> {
  return invoke('get_ssh_server_status');
}

export interface SshServerConfig {
  username: string;
  password?: string;
  publicKeys: string[];
}

export function getSshServerConfig(): Promise<SshServerConfig> {
  return invoke('get_ssh_server_config');
}

export function saveSshServerConfig(config: SshServerConfig): Promise<void> {
  return invoke('save_ssh_server_config', { config });
}

export interface ApiProxyRequest {
  method: string;
  url: string;
  headers: [string, string][];
  body?: string | null;
  requestId?: string | null;
}

export interface ApiProxyResponse {
  status: number;
  statusText: string;
  headers: [string, string][];
  body: string;
  duration: number;
  requestId?: string | null;
}

export interface ApiProxyStreamChunk {
  requestId: string;
  chunk: string;
  eventType: 'start' | 'data' | 'done' | 'error';
  status?: number | null;
  statusText?: string | null;
  headers?: [string, string][] | null;
  error?: string | null;
}

export function apiProxyRequest(request: ApiProxyRequest): Promise<ApiProxyResponse> {
  return invoke('api_proxy_request', { request });
}

export function apiProxyStream(request: ApiProxyRequest): Promise<string> {
  return invoke('api_proxy_stream', { request });
}

export function apiProxyAbort(requestId: string): Promise<void> {
  return invoke('api_proxy_abort', { requestId });
}

// ── CliProxyAI ────────────────────────────────────────────

export function proxyStatus(): Promise<ProxyStatus> {
  return invoke('proxy_status');
}

export function proxyStart(): Promise<ProxyStatus> {
  return invoke('proxy_start');
}

export function proxyStop(): Promise<ProxyStatus> {
  return invoke('proxy_stop');
}

export function proxyGetConfig(): Promise<ProxyConfig> {
  return invoke('proxy_get_config');
}

export function proxySaveConfig(config: ProxyConfig): Promise<ProxyConfig> {
  return invoke('proxy_save_config', { config });
}

export function proxyAddBackend(backend: ProxyBackend): Promise<ProxyConfig> {
  return invoke('proxy_add_backend', { backend });
}

export function proxyRemoveBackend(name: string): Promise<ProxyConfig> {
  return invoke('proxy_remove_backend', { name });
}

export function proxyGetLogs(): Promise<ProxyLogEntry[]> {
  return invoke('proxy_get_logs');
}

export function proxyGetUsage(id: string): Promise<ProxyBackendUsage> {
  return invoke('proxy_get_usage', { id });
}

export function proxyResetUsage(id: string): Promise<void> {
  return invoke('proxy_reset_usage', { id });
}

export function getSystemLogs(limit?: number): Promise<SystemLogEntry[]> {
  return invoke('get_system_logs', { limit });
}

export function getNotepad(): Promise<NotepadContent> {
  return invoke('get_notepad');
}

export function saveNotepad(content: NotepadContent): Promise<void> {
  return invoke('save_notepad', { content });
}

export function webAiLoadProfiles(): Promise<WebAiConfig> {
  return invoke('web_ai_load_profiles');
}

export function webAiSaveProfiles(config: WebAiConfig): Promise<void> {
  return invoke('web_ai_save_profiles', { config });
}

export function webAiSpawnProfile(profile: WebAiProfile, rect: WebAiRect): Promise<void> {
  return invoke('web_ai_spawn_profile', { profile, rect });
}

export function webAiReposition(rect: WebAiRect): Promise<void> {
  return invoke('web_ai_reposition', { rect });
}

export function webAiSetVisible(visible: boolean): Promise<void> {
  return invoke('web_ai_set_visible', { visible });
}

export function webAiClose(): Promise<void> {
  return invoke('web_ai_close');
}

export function webAiClearData(): Promise<void> {
  return invoke('web_ai_clear_data');
}

// ── Dashboard ───────────────────────────────────────────────────────

export interface ResourceUsage {
  memoryBytes: number;
  memoryMb: number;
  memoryPercent: number;
  childCount: number;
}

export interface ProcessDetail {
  exePath?: string | null;
  memoryBytes: number;
  memoryMb: number;
  cpuTimeSeconds: number;
  uptimeSeconds: number;
}

export interface PortInfo {
  port: number;
  listening: boolean;
  pid?: number | null;
  processName?: string | null;
  detail?: ProcessDetail | null;
}

export function dashboardGetResourceUsage(): Promise<ResourceUsage> {
  return invoke('dashboard_get_resource_usage');
}

/** Batch probe — one netstat call for all tracked ports. */
export function dashboardProbePorts(ports: number[]): Promise<PortInfo[]> {
  return invoke('dashboard_probe_ports', { ports });
}

/** Single-port probe for one-off use. */
export function dashboardProbePort(port: number): Promise<PortInfo> {
  return invoke('dashboard_probe_port', { port });
}

export function dashboardKillPort(port: number): Promise<boolean> {
  return invoke('dashboard_kill_port', { port });
}

export interface ProcessLogInfo {
  serviceName: string;
  logPath: string;
  logContent: string;
  logSizeBytes: number;
}

export function dashboardGetProcessLogs(pid: number): Promise<ProcessLogInfo> {
  return invoke('dashboard_get_process_logs', { pid });
}

// ── Target-aware Dashboard monitoring ─────────────────────────────

export interface MonitorSshHop {
  host: string;
  sshPort: number;
  user: string;
  authMode: 'password' | 'key';
  keyPath?: string | null;
  hasSecret: boolean;
}

export interface MonitorLogSource {
  kind: 'auto' | 'file' | 'systemd' | 'container' | 'windowsEvent' | 'custom';
  path?: string | null;
  unit?: string | null;
  engine?: 'docker' | 'podman' | null;
  container?: string | null;
  logName?: string | null;
  provider?: string | null;
  command?: string | null;
  shell?: 'auto' | 'posix' | 'powershell' | null;
}

export interface MonitorConfig {
  id: string;
  label: string;
  servicePort: number;
  targetType: 'local' | 'ssh';
  target?: MonitorSshHop | null;
  jump?: MonitorSshHop | null;
  targetOs: 'auto' | 'linux' | 'windows';
  logSource: MonitorLogSource;
  legacyImported: boolean;
}

export interface MonitorSecrets {
  targetSecret?: string | null;
  jumpSecret?: string | null;
  clearTargetSecret?: boolean;
  clearJumpSecret?: boolean;
}

export interface MonitorSaveResult {
  monitor: MonitorConfig;
  vaultPersistent: boolean;
}

export interface MonitorProcessIdentity {
  pid: number;
  startToken: string;
  processName: string;
  exePath?: string | null;
  commandLine?: string | null;
  workingDir?: string | null;
  memoryBytes: number;
  memoryMb: number;
  cpuTimeSeconds: number;
  uptimeSeconds: number;
}

export interface MonitorSnapshot {
  monitorId: string;
  servicePort: number;
  status: 'listening' | 'notListening' | 'unreachable' | 'permissionDenied' | 'unsupported' | 'stale';
  targetOs: 'auto' | 'linux' | 'windows';
  unverifiedSsh: boolean;
  listeners: MonitorProcessIdentity[];
  error?: string | null;
  lastCheckedAt: string;
}

export interface MonitorTestResult {
  ok: boolean;
  targetOs: string;
  message: string;
  unverifiedSsh: boolean;
}

export interface MonitorLogSourceCandidate {
  id: string;
  label: string;
  confidence: number;
  reason: string;
  requiresElevation: boolean;
  source: MonitorLogSource;
}

export interface MonitorLogChunkEvent {
  streamId: string;
  monitorId: string;
  sequence: number;
  stream: 'stdout' | 'stderr' | 'system';
  text: string;
}

export interface MonitorLogStateEvent {
  streamId: string;
  monitorId: string;
  state: 'connecting' | 'following' | 'reconnecting' | 'needsElevation' | 'ended' | 'stopped' | 'error';
  message?: string | null;
  attempt: number;
}

export interface MonitorKillResult {
  requested: number[];
  stopped: number[];
  stillListening: number[];
  forceAvailable: boolean;
}

export function dashboardListMonitors(): Promise<MonitorConfig[]> {
  return invoke('dashboard_list_monitors');
}

export function dashboardTestMonitor(monitor: MonitorConfig, secrets?: MonitorSecrets): Promise<MonitorTestResult> {
  return invoke('dashboard_test_monitor', { monitor, secrets });
}

export function dashboardUpsertMonitor(monitor: MonitorConfig, secrets?: MonitorSecrets): Promise<MonitorSaveResult> {
  return invoke('dashboard_upsert_monitor', { monitor, secrets });
}

export function dashboardDeleteMonitor(monitorId: string): Promise<void> {
  return invoke('dashboard_delete_monitor', { monitorId });
}

export function dashboardProbeMonitors(monitorIds?: string[]): Promise<MonitorSnapshot[]> {
  return invoke('dashboard_probe_monitors', { monitorIds });
}

export function dashboardDiscoverLogSources(monitorId: string, pid: number): Promise<MonitorLogSourceCandidate[]> {
  return invoke('dashboard_discover_log_sources', { monitorId, pid });
}

export function dashboardStartLogStream(
  monitorId: string,
  source: MonitorLogSource,
  sudoPassword?: string,
): Promise<{ streamId: string; source: MonitorLogSource }> {
  return invoke('dashboard_start_log_stream', { request: { monitorId, source, sudoPassword } });
}

export function dashboardStopLogStream(streamId: string): Promise<void> {
  return invoke('dashboard_stop_log_stream', { streamId });
}

export function dashboardKillProcesses(
  monitorId: string,
  processes: MonitorProcessIdentity[],
  mode: 'normal' | 'force',
  sudoPassword?: string,
): Promise<MonitorKillResult> {
  return invoke('dashboard_kill_processes', { request: { monitorId, processes, mode, sudoPassword } });
}
