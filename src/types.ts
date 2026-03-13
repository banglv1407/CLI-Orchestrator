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
