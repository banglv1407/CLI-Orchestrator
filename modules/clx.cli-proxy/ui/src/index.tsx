import { createRoot } from 'react-dom/client';

import type { ClxUiHostV1 } from '../../../sdk';
import { ProxyPanel } from './ProxyPanel';
import { configureProxyHost } from './api';

function requireHost(host: ClxUiHostV1) {
  if (host.apiVersion !== 1 || host.moduleId !== 'clx.cli-proxy') {
    throw new Error('CliProxyAI requires CLX UI host API v1');
  }
  configureProxyHost(host);
}

export function registerMain(host: ClxUiHostV1) {
  requireHost(host);
  host.registerContribution({
    id: 'cli-proxy.main',
    kind: 'mainPanel',
    mount(container) {
      const root = createRoot(container);
      root.render(<ProxyPanel />);
      return () => root.unmount();
    },
  });
}

export function registerSettings(host: ClxUiHostV1) {
  requireHost(host);
  host.registerContribution({
    id: 'cli-proxy.settings',
    kind: 'settingsSection',
    mount(container) {
      const root = createRoot(container);
      root.render(<ProxyPanel />);
      return () => root.unmount();
    },
  });
}
