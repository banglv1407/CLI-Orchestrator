export type ModuleRuntimeState =
  | 'notInstalled'
  | 'disabled'
  | 'locked'
  | 'ready'
  | 'running'
  | 'incompatible'
  | 'tampered'
  | 'failed';

export type UiContributionKind =
  | 'mainPanel'
  | 'settingsSection'
  | 'sidebarBadge'
  | 'commandPaletteAction'
  | 'overlay';

export interface UiContributionManifest {
  id: string;
  kind: UiContributionKind;
  entrypoint: string;
  export: string;
}

export interface ModuleSnapshot {
  moduleId: string;
  version: string | null;
  state: ModuleRuntimeState;
  installedSize: number;
  entitlement: 'granted' | 'denied' | 'expired' | 'unavailable';
  integrity: 'notChecked' | 'verified' | 'rejected';
  enabled: boolean;
  uiContributions: UiContributionManifest[];
  error: { code: string; message: string; repairable: boolean } | null;
}

export interface MountedUiContribution {
  id: string;
  kind: UiContributionKind;
  mount(container: HTMLElement): void | (() => void);
}

export interface ClxUiHostV1 {
  apiVersion: 1;
  moduleId: string;
  moduleCall<T>(method: string, params?: unknown): Promise<T>;
  registerContribution(contribution: MountedUiContribution): void;
}
