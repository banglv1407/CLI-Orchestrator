import { useEffect, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';

/** True only while both the native window and its document are visible. */
export function useUiActive(): boolean {
  const [nativeVisible, setNativeVisible] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(() => document.visibilityState === 'visible');

  useEffect(() => {
    let disposed = false;
    void getCurrentWindow().isVisible().then((visible) => {
      if (!disposed) setNativeVisible(visible);
    }).catch(() => { /* Browser/dev mode. */ });

    const unlisten = listen<boolean>('app-window-visibility', (event) => {
      if (!disposed) setNativeVisible(event.payload);
    });
    const onVisibility = () => setDocumentVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', onVisibility);
      void unlisten.then((dispose) => dispose());
    };
  }, []);

  return nativeVisible && documentVisible;
}
