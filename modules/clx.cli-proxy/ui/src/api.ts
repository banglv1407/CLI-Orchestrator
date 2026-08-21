import type { ClxUiHostV1 } from '../../../sdk';

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
  enableRtk?: boolean;
  enablePonytail?: boolean;
  reasoningEffort?: string;
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
  normalizedResponseJson?: string;
  responseTruncated?: boolean;
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

let host: ClxUiHostV1 | null = null;

export function configureProxyHost(value: ClxUiHostV1) {
  host = value;
}

function call<T>(method: string, params: unknown): Promise<T> {
  if (!host) throw new Error('Proxy host is not configured');
  return host.moduleCall<T>(`clx.cli-proxy.${method}`, params);
}

export const proxyStatus = () => call<ProxyStatus>('status', {});
export const proxyStart = () => call<ProxyStatus>('start', {});
export const proxyStop = () => call<ProxyStatus>('stop', {});
export const proxyGetConfig = () => call<ProxyConfig>('getConfig', {});
export const proxySaveConfig = (config: ProxyConfig) => call<ProxyConfig>('saveConfig', { config });
export const proxyAddBackend = (backend: ProxyBackend) => call<ProxyConfig>('addBackend', { backend });
export const proxyRemoveBackend = (name: string) => call<ProxyConfig>('removeBackend', { name });
export const proxyGetLogs = () => call<ProxyLogEntry[]>('getLogs', {});
export const proxyGetRecentLogs = (limit = 10) => call<ProxyLogEntry[]>('getRecentLogs', { limit });
export const proxyGetUsage = (id: string) => call<ProxyBackendUsage>('getUsage', { id });
export const proxyResetUsage = (id: string) => call<void>('resetUsage', { id });
