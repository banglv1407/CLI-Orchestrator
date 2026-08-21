import type { ClxUiHostV1 } from '../../../sdk';
let host: ClxUiHostV1 | null = null;
export function configureNesHost(value: ClxUiHostV1) { host = value; }
function call<T>(method: string, params: unknown = {}): Promise<T> {
  if (!host) throw new Error('NES host is not configured');
  return host.moduleCall<T>(`clx.nes.${method}`, params);
}
export const nesGetConfig = () => call<any>('getConfig');
export const nesSaveConfig = (config: any) => call<void>('saveConfig', config);
