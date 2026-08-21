import { createRoot } from 'react-dom/client';
import type { ClxUiHostV1 } from '../../../sdk';
import { NesSettingsSection } from './NesSettingsSection';
import { configureNesHost } from './api';

export function registerSettings(host: ClxUiHostV1) {
  configureNesHost(host);
  host.registerContribution({
    id: 'nes.settings', kind: 'settingsSection',
    mount(container) {
      const root = createRoot(container);
      root.render(<NesSettingsSection />);
      return () => root.unmount();
    },
  });
}
