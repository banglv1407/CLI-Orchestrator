import { createRoot } from 'react-dom/client';
import type { ClxUiHostV1 } from '../../../sdk';
import { PetSettingsSection } from './PetSettingsSection';
import { configurePetHost } from './api';

export function registerSettings(host: ClxUiHostV1) {
  configurePetHost(host);
  host.registerContribution({
    id: 'pet.settings', kind: 'settingsSection',
    mount(container) {
      const root = createRoot(container);
      root.render(<PetSettingsSection />);
      return () => root.unmount();
    },
  });
}
