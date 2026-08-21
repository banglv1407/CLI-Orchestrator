import { createRoot } from 'react-dom/client';

import type { ClxUiHostV1 } from '../../../sdk';
import { configureQuickAppsHost } from './api';
import { QuickAppsPanel } from './QuickAppsPanel';

export function register(host: ClxUiHostV1) {
  if (host.apiVersion !== 1 || host.moduleId !== 'clx.quickapps') {
    throw new Error('Quick Apps requires CLX UI host API v1');
  }
  configureQuickAppsHost(host);
  host.registerContribution({
    id: 'quickapps.main',
    kind: 'mainPanel',
    mount(container) {
      const root = createRoot(container);
      root.render(<QuickAppsPanel />);
      return () => root.unmount();
    },
  });
}
