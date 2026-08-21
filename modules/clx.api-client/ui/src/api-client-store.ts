// api-client-store.ts
// Module-level singleton store for API Client state.
// Survives component unmount/mount so that API requests, runner benchmarks,
// and streaming responses continue in the background when the user switches
// to another feature panel.
//
// Design: observer pattern — components subscribe/unsubscribe via
// useApiClientStore() hook. Tauri event listeners (stream) are registered
// once at module level and never cleaned up.

import { saveApiHistory } from './api-history';
import {
  apiClientAbort,
  apiClientRequest,
  apiClientStreamPoll,
  apiClientStreamStart,
  type ApiProxyRequest,
  type ApiProxyResponse,
  type ApiProxyStreamChunk,
} from './api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface KeyValue {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number;
  size: number;
}

interface RunnerStats {
  min: number;
  max: number;
  avg: number;
  p50: number;
  p95: number;
  p99: number;
}

export interface RunnerState {
  concurrency: number;
  total: number;
  mode: 'count' | 'duration';
  durationSec: number;
  running: boolean;
  sent: number;
  success: number;
  errors: number;
  reqPerSec: number;
  latencies: number[];
  errorList: string[];
  stats: RunnerStats;
}

export interface ApiClientState {
  method: HttpMethod;
  url: string;
  headers: KeyValue[];
  params: KeyValue[];
  body: string;
  activeTab: 'params' | 'headers' | 'body' | 'runner';
  curlInput: string;
  response: ApiResponse | null;
  isLoading: boolean;
  copied: boolean;
  isStreaming: boolean;
  streamStatus: { status: number; statusText: string; headers: Record<string, string> } | null;
  runner: RunnerState;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function computeStats(latencies: number[]): RunnerStats {
  if (latencies.length === 0) return { min: 0, max: 0, avg: 0, p50: 0, p95: 0, p99: 0 };
  const sorted = [...latencies].sort((a, b) => a - b);
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg: Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length),
    p50: sorted[Math.floor(sorted.length * 0.5)],
    p95: sorted[Math.floor(sorted.length * 0.95)],
    p99: sorted[Math.floor(sorted.length * 0.99)],
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

type Listener = () => void;

// Module-level state — survives unmount
let state: ApiClientState = {
  method: 'GET',
  url: '',
  headers: [{ id: 'h0', key: '', value: '', enabled: true }],
  params: [{ id: 'p0', key: '', value: '', enabled: true }],
  body: '',
  activeTab: 'params',
  curlInput: '',
  response: null,
  isLoading: false,
  copied: false,
  isStreaming: false,
  streamStatus: null,
  runner: {
    concurrency: 10,
    total: 100,
    mode: 'count',
    durationSec: 10,
    running: false,
    sent: 0,
    success: 0,
    errors: 0,
    reqPerSec: 0,
    latencies: [],
    errorList: [],
    stats: { min: 0, max: 0, avg: 0, p50: 0, p95: 0, p99: 0 },
  },
};

let listeners = new Set<Listener>();
let idCounter = 100;

function emit() {
  listeners.forEach((fn) => fn());
}

export function getApiClientStore(): Readonly<ApiClientState> {
  return state;
}

export function nextId(): string {
  return String(++idCounter);
}

// ---------------------------------------------------------------------------
// Subscribe hook for React components
// ---------------------------------------------------------------------------

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function setMethod(v: HttpMethod) {
  state = { ...state, method: v };
  emit();
}

export function setUrl(v: string) {
  state = { ...state, url: v };
  emit();
}

export function setHeaders(v: KeyValue[]) {
  state = { ...state, headers: v };
  emit();
}

export function setParams(v: KeyValue[]) {
  state = { ...state, params: v };
  emit();
}

export function setBody(v: string) {
  state = { ...state, body: v };
  emit();
}

export function setActiveTab(v: 'params' | 'headers' | 'body' | 'runner') {
  state = { ...state, activeTab: v };
  emit();
}

export function setCurlInput(v: string) {
  state = { ...state, curlInput: v };
  emit();
}

export function setCopied(v: boolean) {
  state = { ...state, copied: v };
  emit();
}


// ---------------------------------------------------------------------------
// Runner setters
// ---------------------------------------------------------------------------

export function setRunnerConcurrency(v: number) {
  state = { ...state, runner: { ...state.runner, concurrency: v } };
  emit();
}

export function setRunnerMode(v: 'count' | 'duration') {
  state = { ...state, runner: { ...state.runner, mode: v } };
  emit();
}

export function setRunnerTotal(v: number) {
  state = { ...state, runner: { ...state.runner, total: v } };
  emit();
}

export function setRunnerDurationSec(v: number) {
  state = { ...state, runner: { ...state.runner, durationSec: v } };
  emit();
}

// ---------------------------------------------------------------------------
// Derived
// ---------------------------------------------------------------------------


export function getFullUrl(): string {
  const enabled = state.params.filter((p) => p.enabled && p.key);
  if (enabled.length === 0) return state.url;
  return state.url + '?' + enabled.map((p) => encodeURIComponent(p.key) + '=' + encodeURIComponent(p.value)).join('&');
}

// ---------------------------------------------------------------------------
// Send request
// ---------------------------------------------------------------------------

let activeStreamId: string | null = null;

export async function sendRequest() {
  if (!state.url.trim() || state.isLoading) return;
  state = { ...state, isLoading: true, response: null };
  emit();

  const headerArr: [string, string][] = [];
  for (const h of state.headers) {
    if (h.enabled && h.key) headerArr.push([h.key, h.value]);
  }

  const wantsStream = headerArr.some(
    ([k, v]) =>
      k.toLowerCase() === 'accept' &&
      (v.includes('text/event-stream') || v.includes('application/x-ndjson')),
  );

  const fullUrl = getFullUrl();

  if (wantsStream) {
    state = { ...state, isStreaming: true };
    emit();
    const requestId = crypto.randomUUID();
    activeStreamId = requestId;
    try {
      const started = await apiClientStreamStart({
        method: state.method,
        url: fullUrl,
        headers: headerArr,
        body: state.body || null,
        requestId,
      });
      activeStreamId = started.requestId;
      void consumeStream(started.requestId);
    } catch (err: any) {
      state = {
        ...state,
        isLoading: false,
        isStreaming: false,
        response: {
          status: 0,
          statusText: 'Error',
          headers: {},
          body: typeof err === 'string' ? err : err.message || String(err),
          duration: 0,
          size: 0,
        },
      };
      activeStreamId = null;
      emit();
    }
  } else {
    try {
      const apiReq: ApiProxyRequest = {
        method: state.method,
        url: fullUrl,
        headers: headerArr,
        body: state.body || null,
      };
      const res: ApiProxyResponse = await apiClientRequest(apiReq);
      const bytes = new TextEncoder().encode(res.body).length;
      const resHeaders: Record<string, string> = {};
      for (const [k, v] of res.headers) resHeaders[k] = v;

      state = {
        ...state,
        isLoading: false,
        response: {
          status: res.status,
          statusText: res.statusText,
          headers: resHeaders,
          body: res.body,
          duration: res.duration,
          size: bytes,
        },
      };

      saveApiHistory({
        url: fullUrl,
        method: state.method,
        timestamp: Date.now(),
        headers: state.headers.map((h) => ({ key: h.key, value: h.value, enabled: h.enabled })),
        params: state.params.map((p) => ({ key: p.key, value: p.value, enabled: p.enabled })),
        body: state.body,
      });
      emit();
    } catch (err: any) {
      state = {
        ...state,
        isLoading: false,
        response: {
          status: 0,
          statusText: 'Error',
          headers: {},
          body: typeof err === 'string' ? err : err.message || String(err),
          duration: 0,
          size: 0,
        },
      };
      emit();
    }
  }
}

export async function abortRequest() {
  if (activeStreamId) {
    await apiClientAbort(activeStreamId);
    state = { ...state, isLoading: false, isStreaming: false };
    activeStreamId = null;
    emit();
  }
}

// ---------------------------------------------------------------------------
// Runner (benchmark)
// ---------------------------------------------------------------------------

let runnerAbort = false;

export async function runBenchmark() {
  if (!state.url.trim() || state.runner.running) return;

  runnerAbort = false;
  const concurrency = state.runner.concurrency;
  const total = state.runner.mode === 'count' ? state.runner.total : 999999;
  const deadline = state.runner.mode === 'duration' ? performance.now() + state.runner.durationSec * 1000 : Infinity;
  const fullUrl = getFullUrl();
  const method = state.method;
  const body = state.body;

  // Build headers once
  const headerArr: [string, string][] = [];
  for (const h of state.headers) {
    if (h.enabled && h.key) headerArr.push([h.key, h.value]);
  }
  const hasBody = method !== 'GET' && method !== 'HEAD' && !!body;

  state = {
    ...state,
    runner: {
      ...state.runner,
      running: true,
      sent: 0,
      success: 0,
      errors: 0,
      reqPerSec: 0,
      latencies: [],
      errorList: [],
      stats: { min: 0, max: 0, avg: 0, p50: 0, p95: 0, p99: 0 },
    },
  };
  const startTime = performance.now();
  emit();

  let sent = 0, ok = 0, err = 0;
  const latencies: number[] = [];
  const errors: string[] = [];

  const tick = () => {
    const elapsed = (performance.now() - startTime) / 1000;
    state = {
      ...state,
      runner: {
        ...state.runner,
        sent,
        success: ok,
        errors: err,
        latencies: [...latencies],
        reqPerSec: elapsed > 0 ? Math.round(sent / elapsed) : 0,
        stats: computeStats(latencies),
      },
    };
    emit();
  };
  const tickHandle = setInterval(tick, 500);

  let i = 0;
  const worker = async () => {
    while (i < total && performance.now() < deadline && !runnerAbort) {
      const idx = i++;
      if (idx >= total) break;
      const t0 = performance.now();
      sent++;
      try {
        const res = await apiClientRequest({ method, url: fullUrl, headers: headerArr, body: hasBody ? body : null });
        if (res.status >= 200 && res.status < 300) ok++;
        else { err++; if (errors.length < 20) errors.push(res.status + ' ' + res.statusText); }
      } catch (e: any) { err++; if (errors.length < 20) errors.push(e.message || String(e)); }
      latencies.push(Math.round(performance.now() - t0));
    }
  };

  const workers: Promise<void>[] = [];
  for (let w = 0; w < concurrency; w++) workers.push(worker());
  await Promise.all(workers);

  clearInterval(tickHandle);

  const elapsed = (performance.now() - startTime) / 1000;
  state = {
    ...state,
    runner: {
      ...state.runner,
      running: false,
      sent,
      success: ok,
      errors: err,
      latencies: [...latencies],
      errorList: errors,
      reqPerSec: elapsed > 0 ? Math.round(sent / elapsed) : 0,
      stats: computeStats(latencies),
    },
  };
  emit();

  saveApiHistory({
    url: fullUrl,
    method,
    timestamp: Date.now(),
    headers: state.headers.map((h) => ({ key: h.key, value: h.value, enabled: h.enabled })),
    params: state.params.map((p) => ({ key: p.key, value: p.value, enabled: p.enabled })),
    body,
  });
}

export function stopBenchmark() {
  runnerAbort = true;
  state = {
    ...state,
    runner: { ...state.runner, running: false },
  };
  emit();
}

// ---------------------------------------------------------------------------
// Stream polling — the sidecar keeps network work independent from UI mounts.
// ---------------------------------------------------------------------------

let streamChunks: string[] = [];
let streamStatus: { status: number; statusText: string; headers: Record<string, string> } | null = null;

function applyStreamEvent(evt: ApiProxyStreamChunk) {
  if (evt.eventType === 'start') {
    const hdr: Record<string, string> = {};
    if (evt.headers) for (const [k, v] of evt.headers) hdr[k] = v;
    streamStatus = { status: evt.status || 200, statusText: evt.statusText || 'OK', headers: hdr };
    streamChunks = [];
    state = { ...state, streamStatus, isStreaming: true };
    emit();
  } else if (evt.eventType === 'data') {
    streamChunks = [...streamChunks, evt.chunk];
    state = {
      ...state,
      response: {
        status: streamStatus?.status || 200,
        statusText: streamStatus?.statusText || 'OK',
        headers: streamStatus?.headers || {},
        body: streamChunks.join(''),
        duration: 0,
        size: new TextEncoder().encode(streamChunks.join('')).length,
      },
    };
    emit();
  } else if (evt.eventType === 'done') {
    state = {
      ...state,
      isStreaming: false,
      isLoading: false,
      response: {
        status: streamStatus?.status || 200,
        statusText: streamStatus?.statusText || 'OK',
        headers: streamStatus?.headers || {},
        body: streamChunks.join(''),
        duration: 0,
        size: new TextEncoder().encode(streamChunks.join('')).length,
      },
    };
    activeStreamId = null;
    emit();
  } else if (evt.eventType === 'error') {
    state = {
      ...state,
      isStreaming: false,
      isLoading: false,
      response: {
        status: 0,
        statusText: 'Error',
        headers: {},
        body: evt.error || 'Stream error',
        duration: 0,
        size: 0,
      },
    };
    activeStreamId = null;
    emit();
  }
}

async function consumeStream(requestId: string) {
  try {
    while (activeStreamId === requestId) {
      const result = await apiClientStreamPoll(requestId);
      for (const event of result.events) applyStreamEvent(event);
      if (!result.active) break;
      if (result.events.length === 0) {
        await new Promise((resolve) => window.setTimeout(resolve, 50));
      }
    }
  } catch (error) {
    if (activeStreamId === requestId) {
      applyStreamEvent({
        requestId,
        chunk: '',
        eventType: 'error',
        status: null,
        statusText: null,
        headers: null,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
