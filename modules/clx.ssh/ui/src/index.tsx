import { createRoot } from 'react-dom/client';
import type { ClxUiHostV1 } from '../../../sdk';
import { SshSettingsSection } from './SshSettingsSection';
import { configureSshHost } from './api';

function requireHost(host: ClxUiHostV1) {
  if (host.apiVersion !== 1 || host.moduleId !== 'clx.ssh') {
    throw new Error('SSH requires CLX UI host API v1');
  }
  configureSshHost(host);
}

export function registerSettings(host: ClxUiHostV1) {
  requireHost(host);
  host.registerContribution({
    id: 'ssh.settings',
    kind: 'settingsSection',
    mount(container) {
      const root = createRoot(container);
      root.render(<SshSettingsSection />);
      return () => root.unmount();
    },
  });
}
