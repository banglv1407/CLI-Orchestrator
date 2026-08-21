import { createRoot } from 'react-dom/client';

import type { ClxUiHostV1 } from '../../../sdk';
import { ApiClientPanel } from './ApiClientPanel';
import { ApiHistoryPanel } from './ApiHistoryPanel';
import { configureApiClientHost } from './api';

function requireHost(host: ClxUiHostV1) {
  if (host.apiVersion !== 1 || host.moduleId !== 'clx.api-client') {
    throw new Error('API Client requires CLX UI host API v1');
  }
  configureApiClientHost(host);
}

export function registerMain(host: ClxUiHostV1) {
  requireHost(host);
  host.registerContribution({
    id: 'api-client.main',
    kind: 'mainPanel',
    mount(container) {
      const root = createRoot(container);
      root.render(<ApiClientPanel />);
      return () => root.unmount();
    },
  });
}

export function registerHistory(host: ClxUiHostV1) {
  requireHost(host);
  host.registerContribution({
    id: 'api-client.history',
    kind: 'mainPanel',
    mount(container) {
      const root = createRoot(container);
      root.render(<ApiHistoryPanel />);
      return () => root.unmount();
    },
  });
}
