import { invoke } from '@tauri-apps/api/core';
import type {
  AccountProfile,
  AccountStatus,
  CliDefinition,
  CreateSessionRequest,
  ProjectTag,
  SessionInfo,
  StopCliRequest,
  UpsertCliRequest,
  CooldownEntry,
  CassIndexStats,
  CassIndexSummary,
  CassSearchRequest,
  CassSearchResult,
  FileEntry,
  SshConnection,
  GitStatusEntry,
  QuickApp,
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
}

export function listAccounts(cliName: string): Promise<AccountProfile[]> {
  return invoke('list_accounts', { cliName });
}

export function saveAccount(cliName: string, profileName: string): Promise<AccountProfile> {
  return invoke('save_account', { request: { cliName, profileName } });
}

export function activateAccount(cliName: string, profileName: string): Promise<void> {
  return invoke('activate_account', { request: { cliName, profileName } });
}

export function deleteAccount(cliName: string, profileName: string): Promise<void> {
  return invoke('delete_account', { request: { cliName, profileName } });
}

export function getAccountStatus(cliName: string): Promise<AccountStatus> {
  return invoke('get_account_status', { request: { cliName } });
}

export function getAllAccountStatuses(): Promise<AccountStatus[]> {
  return invoke('get_all_account_statuses');
}

export function switchToNextAccount(cliName: string): Promise<string | null> {
  return invoke('switch_to_next_account', { cliName });
}

export function setAccountCooldown(cliName: string, profileName: string, minutes: number): Promise<void> {
  return invoke('set_account_cooldown', { request: { cliName, profileName, minutes } });
}

export function clearAccountCooldown(cliName: string, profileName: string): Promise<void> {
  return invoke('clear_account_cooldown', { cliName, profileName });
}

export function listAccountCooldowns(): Promise<CooldownEntry[]> {
  return invoke('list_account_cooldowns');
}

export function cassIndexLogs(): Promise<CassIndexSummary> {
  return invoke('cass_index_logs');
}

export function cassStats(): Promise<CassIndexStats> {
  return invoke('cass_stats');
}

export function cassSearch(request: CassSearchRequest): Promise<CassSearchResult[]> {
  return invoke('cass_search', { request });
}

export function listDirectoryFiles(path: string): Promise<FileEntry[]> {
  return invoke('list_directory_files', { path });
}

export function readFileContent(path: string): Promise<string> {
  return invoke('read_file_content', { path });
}

export function writeFileContent(path: string, content: string): Promise<void> {
  return invoke('write_file_content', { path, content });
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

