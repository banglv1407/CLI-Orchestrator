import { createRoot } from 'react-dom/client';
import type { ClxUiHostV1 } from '../../../sdk';
import { CompanionChatPanel } from './CompanionChatPanel';
import { configureCompanionHost } from './api';

function requireHost(host: ClxUiHostV1) {
  if (host.apiVersion !== 1 || host.moduleId !== 'clx.ai-companion') {
    throw new Error('AI Companion requires CLX UI host API v1');
  }
  configureCompanionHost(host);
}

export function registerMain(host: ClxUiHostV1) {
  requireHost(host);
  host.registerContribution({
    id: 'ai-companion.main',
    kind: 'mainPanel',
    mount(container) {
      const root = createRoot(container);
      root.render(<CompanionChatPanel />);
      return () => root.unmount();
    },
  });
}

export function registerSettings(host: ClxUiHostV1) {
  requireHost(host);
  host.registerContribution({
    id: 'ai-companion.settings',
    kind: 'settingsSection',
    mount(container) {
      const root = createRoot(container);
      root.render(<CompanionChatPanel />);
      return () => root.unmount();
    },
  });
}
