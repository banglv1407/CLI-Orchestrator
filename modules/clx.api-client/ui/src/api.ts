import type { ClxUiHostV1 } from '../../../sdk';

export interface ApiProxyRequest {
  method: string;
  url: string;
  headers: [string, string][];
  body: string | null;
  requestId?: string | null;
}

export interface ApiProxyResponse {
  status: number;
  statusText: string;
  headers: [string, string][];
  body: string;
  duration: number;
  requestId: string | null;
}

export interface ApiProxyStreamChunk {
  requestId: string;
  chunk: string;
  eventType: 'start' | 'data' | 'done' | 'error';
  status: number | null;
  statusText: string | null;
  headers: [string, string][] | null;
  error: string | null;
}

export interface StreamPollResult {
  events: ApiProxyStreamChunk[];
  active: boolean;
}

let host: ClxUiHostV1 | null = null;

export function configureApiClientHost(value: ClxUiHostV1) {
  host = value;
}

function call<T>(method: string, params: unknown): Promise<T> {
  if (!host) throw new Error('API Client host is not configured');
  return host.moduleCall<T>(`clx.api-client.${method}`, params);
}

export const apiClientRequest = (request: ApiProxyRequest) =>
  call<ApiProxyResponse>('request', request);

export const apiClientStreamStart = (request: ApiProxyRequest) =>
  call<{ requestId: string }>('streamStart', request);

export const apiClientStreamPoll = (requestId: string) =>
  call<StreamPollResult>('streamPoll', { requestId });

export const apiClientAbort = (requestId: string) =>
  call<{ aborted: boolean }>('streamAbort', { requestId });
