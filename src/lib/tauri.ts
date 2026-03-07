import { invoke } from '@tauri-apps/api/core';
import type {
  CliDefinition,
  CreateSessionRequest,
  ProjectTag,
  SessionInfo,
  StopCliRequest,
  UpsertCliRequest,
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
