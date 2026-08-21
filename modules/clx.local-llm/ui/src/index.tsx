import { createRoot } from 'react-dom/client';
import type { ClxUiHostV1 } from '../../../sdk';
import { LocalLlmSettingsSection } from './LocalLlmSettingsSection';
import { configureLocalLlmHost } from './api';

function requireHost(host: ClxUiHostV1) {
  if (host.apiVersion !== 1 || host.moduleId !== 'clx.local-llm') {
    throw new Error('Local LLM requires CLX UI host API v1');
  }
  configureLocalLlmHost(host);
}

export function registerSettings(host: ClxUiHostV1) {
  requireHost(host);
  host.registerContribution({
    id: 'local-llm.settings',
    kind: 'settingsSection',
    mount(container) {
      const root = createRoot(container);
      root.render(<LocalLlmSettingsSection />);
      return () => root.unmount();
    },
  });
}
