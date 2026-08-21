import { createRoot } from 'react-dom/client';
import type { ClxUiHostV1 } from '../../../sdk';
import { BuzzSettingsSection } from './BuzzSettingsSection';
import { configureBuzzHost } from './api';

export function registerSettings(host: ClxUiHostV1) {
  configureBuzzHost(host);
  host.registerContribution({
    id: 'buzz.settings', kind: 'settingsSection',
    mount(container) {
      const root = createRoot(container);
      root.render(<BuzzSettingsSection />);
      return () => root.unmount();
    },
  });
}
