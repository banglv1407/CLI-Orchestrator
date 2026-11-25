import { useEffect, useRef } from 'react';
import { isTauri } from '@tauri-apps/api/core';
import { physicalBrowserBounds, setWebBrowserViewport } from '../lib/webBrowser';

function covered(viewport: HTMLElement): boolean {
  const area = viewport.getBoundingClientRect();
  return Array.from(document.querySelectorAll<HTMLElement>('[aria-modal="true"], [role="dialog"], .fixed')).some(element => {
    if (element.closest('[data-native-web-nonblocking]') || element.contains(viewport) || viewport.contains(element)) return false;
    const style = getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.pointerEvents === 'none') return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.left < area.right && rect.right > area.left && rect.top < area.bottom && rect.bottom > area.top;
  });
}

export function useWebBrowserViewport(sessionId: string, isVisible: boolean, onError: (error: string) => void) {
  const viewport = useRef<HTMLDivElement>(null);
  const current = useRef({ sessionId, isVisible, onError }); current.current = { sessionId, isVisible, onError };
  useEffect(() => {
    if (!isTauri()) return;
    let disposed = false, frame = 0, previous = '';
    const sync = () => {
      frame = 0;
      if (disposed || current.current.sessionId !== sessionId) return;
      const node = viewport.current;
      const bounds = node ? physicalBrowserBounds(node.getBoundingClientRect(), devicePixelRatio) : null;
      const visible = !!bounds && isVisible && !!node && !covered(node);
      const serialized = JSON.stringify({ bounds, visible });
      if (serialized === previous) return;
      previous = serialized;
      void setWebBrowserViewport(sessionId, bounds, visible).catch(error => {
        if (!disposed && current.current.sessionId === sessionId) current.current.onError(String(error));
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(sync); };
    const resize = new ResizeObserver(schedule);
    if (viewport.current) resize.observe(viewport.current);
    const mutations = new MutationObserver(schedule);
    if (isVisible) mutations.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'hidden', 'open'] });
    window.addEventListener('resize', schedule); document.addEventListener('scroll', schedule, true);
    sync();
    return () => {
      disposed = true; if (frame) cancelAnimationFrame(frame);
      resize.disconnect(); mutations.disconnect();
      window.removeEventListener('resize', schedule); document.removeEventListener('scroll', schedule, true);
      void setWebBrowserViewport(sessionId, null, false).catch(() => undefined);
    };
  }, [sessionId, isVisible]);
  return viewport;
}
