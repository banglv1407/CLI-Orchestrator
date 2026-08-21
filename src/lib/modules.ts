import { invoke } from '@tauri-apps/api/core';

import type {
  ClxUiHostV1,
  ModuleSnapshot,
  MountedUiContribution,
  UiContributionManifest,
} from '../../modules/sdk';

export type {
  ClxUiHostV1,
  ModuleRuntimeState,
  ModuleSnapshot,
  MountedUiContribution,
  UiContributionKind,
  UiContributionManifest,
} from '../../modules/sdk';

type UiModule = Record<string, (host: ClxUiHostV1) => void | Promise<void>>;

const loadedModules = new Map<string, Promise<Map<string, MountedUiContribution>>>();

export const moduleCatalog = () => invoke<ModuleSnapshot[]>('module_catalog');

export const moduleSetEnabled = (moduleId: string, enabled: boolean) =>
  invoke<ModuleSnapshot>('module_set_enabled', { moduleId, enabled });

export const moduleCall = <T>(moduleId: string, method: string, params: unknown = {}) =>
  invoke<T>('module_call', { moduleId, method, params });

export const moduleRestart = (moduleId: string) =>
  invoke<ModuleSnapshot>('module_restart', { moduleId });

function moduleAssetUrl(moduleId: string, version: string, path: string) {
  const safePath = path.split('/').map(encodeURIComponent).join('/');
  return `http://clx-module.localhost/${encodeURIComponent(moduleId)}/${encodeURIComponent(version)}/${safePath}`;
}

export function loadUiContributions(snapshot: ModuleSnapshot) {
  const { moduleId, version } = snapshot;
  if (!version || (snapshot.state !== 'ready' && snapshot.state !== 'running')) {
    return Promise.reject(new Error(snapshot.error?.message ?? `${moduleId} is not ready`));
  }
  const cacheKey = `${moduleId}@${version}`;
  const existing = loadedModules.get(cacheKey);
  if (existing) return existing;

  const promise = (async () => {
    const registered = new Map<string, MountedUiContribution>();
    const allowed = new Map(snapshot.uiContributions.map((item) => [item.id, item]));
    const host: ClxUiHostV1 = {
      apiVersion: 1,
      moduleId,
      moduleCall: (method, params = {}) => moduleCall(moduleId, method, params),
      registerContribution(contribution) {
        const declared = allowed.get(contribution.id);
        if (!declared || declared.kind !== contribution.kind || registered.has(contribution.id)) {
          throw new Error(`Module registered an undeclared contribution: ${contribution.id}`);
        }
        registered.set(contribution.id, contribution);
      },
    };

    const entrypoints = new Map<string, UiContributionManifest[]>();
    for (const contribution of snapshot.uiContributions) {
      const group = entrypoints.get(contribution.entrypoint) ?? [];
      group.push(contribution);
      entrypoints.set(contribution.entrypoint, group);
    }
    for (const [entrypoint, declarations] of entrypoints) {
      const imported = await import(/* @vite-ignore */ moduleAssetUrl(moduleId, version, entrypoint)) as UiModule;
      for (const declaration of declarations) {
        const register = imported[declaration.export];
        if (typeof register !== 'function') {
          throw new Error(`Module export is missing: ${declaration.export}`);
        }
        await register(host);
      }
    }
    for (const contribution of snapshot.uiContributions) {
      if (!registered.has(contribution.id)) {
        throw new Error(`Module did not register contribution: ${contribution.id}`);
      }
    }
    return registered;
  })();
  loadedModules.set(cacheKey, promise);
  promise.catch(() => loadedModules.delete(cacheKey));
  return promise;
}
