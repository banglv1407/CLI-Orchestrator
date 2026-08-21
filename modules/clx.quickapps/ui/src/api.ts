import type { ClxUiHostV1 } from '../../../sdk';

export interface QuickApp {
  id: string;
  name: string;
  command: string;
  args: string[];
  workingDir?: string | null;
  iconPath?: string | null;
  order: number;
  iconDataUrl?: string | null;
  iconMissing: boolean;
  group?: string | null;
}

let host: ClxUiHostV1 | undefined;

export function configureQuickAppsHost(value: ClxUiHostV1) {
  host = value;
}

function call<T>(method: string, params: unknown = {}) {
  if (!host) return Promise.reject(new Error('Quick Apps host is not registered'));
  return host.moduleCall<T>(`clx.quickapps.${method}`, params);
}

export const listQuickapps = () => call<QuickApp[]>('list');
export const upsertQuickapp = (app: QuickApp) => {
  const { iconDataUrl: _iconDataUrl, iconMissing: _iconMissing, ...persistentApp } = app;
  return call<QuickApp>('upsert', { app: persistentApp });
};
export const deleteQuickapp = (id: string) => call<void>('delete', { id });
export const reextractQuickappIcons = () => call<QuickApp[]>('reextractIcons');
export const launchQuickapp = (id: string) => call<number>('launch', { id });
