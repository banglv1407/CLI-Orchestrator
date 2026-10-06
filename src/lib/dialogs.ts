import { confirm as nativeConfirm, message as nativeMessage } from '@tauri-apps/plugin-dialog';
import { isTauri } from '@tauri-apps/api/core';
import { t } from '../i18n';

export async function confirm(message: string, options?: Parameters<typeof nativeConfirm>[1]): Promise<boolean> {
  if (!isTauri()) return window.confirm(message);
  const config = typeof options === 'string' ? { title: options } : options ?? {};
  return nativeConfirm(message, {
    ...config,
    title: t(config.title ?? 'Confirm'),
    okLabel: t(config.okLabel ?? 'Confirm'),
    cancelLabel: t(config.cancelLabel ?? 'Cancel'),
  });
}

export async function showMessage(message: string): Promise<void> {
  if (!isTauri()) { window.alert(message); return; }
  await nativeMessage(message, { title: 'CLX', okLabel: t('Close') });
}
