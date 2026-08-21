import type { ClxUiHostV1 } from '../../../sdk';

let host: ClxUiHostV1 | null = null;

export function configureLocalLlmHost(value: ClxUiHostV1) {
  host = value;
}

function call<T>(method: string, params: unknown = {}): Promise<T> {
  if (!host) throw new Error('Local LLM host is not configured');
  return host.moduleCall<T>(`clx.local-llm.${method}`, params);
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

export const localLlmGetStatus = () => call<BuiltinLlmStatus>('status');
export const localLlmGetConfig = () => call<BuiltinLlmConfig>('getConfig');
export const localLlmSaveConfig = (cfg: BuiltinLlmConfig) => call<BuiltinLlmConfig>('saveConfig', cfg);
export const localLlmLoadModel = () => call<BuiltinLlmStatus>('loadModel');
export const localLlmUnloadModel = () => call<BuiltinLlmStatus>('unloadModel');
export const localLlmGenerate = (prompt: string) => call<{ text: string }>('generate', { prompt });
export const localLlmChat = (messages: { role: string; content: string }[], systemPrompt?: string) =>
  call<{ text: string }>('chat', { messages, systemPrompt });
