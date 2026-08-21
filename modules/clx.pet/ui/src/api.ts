import type { ClxUiHostV1 } from '../../../sdk';
let host: ClxUiHostV1 | null = null;
export function configurePetHost(value: ClxUiHostV1) { host = value; }
function call<T>(method: string, params: unknown = {}): Promise<T> {
  if (!host) throw new Error('Pet host is not configured');
  return host.moduleCall<T>(`clx.pet.${method}`, params);
}
export const petListPacks = () => call<any>('listPacks');
export const petInstallPack = (sourceDir: string, replaceExisting: boolean) =>
  call<any>('installPack', { sourceDir, replaceExisting });
export const petLoadAsset = (packId: string, relativePath: string) =>
  call<any>('loadAsset', { packId, relativePath });
