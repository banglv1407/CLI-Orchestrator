import type { ClxUiHostV1 } from '../../../sdk';

let host: ClxUiHostV1 | null = null;

export function configureCompanionHost(value: ClxUiHostV1) {
  host = value;
}

function call<T>(method: string, params: unknown = {}): Promise<T> {
  if (!host) throw new Error('Companion host is not configured');
  return host.moduleCall<T>(`clx.ai-companion.${method}`, params);
}

export interface CompanionConfigView {
  baseUrl: string;
  model: string;
  apiKeyPresent: boolean;
  streamEnabled: boolean;
  customPrompt: string;
  customHeaders: { name: string; masked: boolean }[];
  actionsEnabled: boolean;
  reasoningEffort?: string;
}

export interface CompanionMessage {
  id: number;
  conversationId: string;
  runId: string;
  role: string;
  content: string;
  status: string;
  timestamp: string;
}

export const companionGetConfig = () => call<CompanionConfigView>('getConfig');
export const companionSaveConfig = (update: Partial<CompanionConfigView> & { apiKey?: string; actionsEnabled?: boolean }) =>
  call<CompanionConfigView>('saveConfig', update);
export const companionGetHistory = () => call<CompanionMessage[]>('getHistory');
export const companionClearHistory = () => call<void>('clearHistory');
export const companionSend = (message: string, toolsEnabled = true) =>
  call<{ runId: string }>('send', { message, toolsEnabled });
export const companionCancel = (runId: string) => call<void>('cancel', { runId });
export const companionPollEvents = () => call<any[]>('pollEvents');
