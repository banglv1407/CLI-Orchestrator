import type { ClxUiHostV1 } from '../../../sdk';
let host: ClxUiHostV1 | null = null;
export function configureBuzzHost(value: ClxUiHostV1) { host = value; }
function call<T>(method: string, params: unknown = {}): Promise<T> {
  if (!host) throw new Error('Buzz host is not configured');
  return host.moduleCall<T>(`clx.buzz.${method}`, params);
}
export const buzzGetConfig = () => call<any>('getConfig');
export const buzzSetConfig = (config: any) => call<void>('setConfig', config);
export const buzzHasIdentity = () => call<boolean>('hasIdentity');
