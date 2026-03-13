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
