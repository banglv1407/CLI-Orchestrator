import type { ClxUiHostV1 } from '../../../sdk';

let host: ClxUiHostV1 | null = null;

export function configureSshHost(value: ClxUiHostV1) {
  host = value;
}

function call<T>(method: string, params: unknown = {}): Promise<T> {
  if (!host) throw new Error('SSH host is not configured');
  return host.moduleCall<T>(`clx.ssh.${method}`, params);
}

export interface SshConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  authType: string;
  password?: string;
  keyPath?: string;
  passphrase?: string;
  remotePath?: string;
}

export interface SshServerConfig {
  enabled: boolean;
  port: number;
  username: string;
  password?: string;
  authorizedKeys: string[];
  allowPty: boolean;
  idleTimeoutSecs: number;
}

export interface SshServerStatus {
  running: boolean;
  port: number;
  activeSessions: number;
  logs: string[];
}

export const sshLoadConnections = () => call<SshConnection[]>('loadConnections');
export const sshSaveConnections = (connections: SshConnection[]) => call<SshConnection[]>('saveConnections', connections);
export const sshGetServerConfig = () => call<SshServerConfig>('getServerConfig');
export const sshSaveServerConfig = (config: SshServerConfig) => call<SshServerConfig>('saveServerConfig', config);
export const sshGetServerStatus = () => call<SshServerStatus>('getServerStatus');
export const sshStartServer = () => call<{ started: boolean }>('startServer');
export const sshStopServer = () => call<{ stopped: boolean }>('stopServer');
