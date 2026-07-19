# Design

## Domain Model

We define Settings sections as a type:
```typescript
type SettingsSection = 
  | 'appearance'
  | 'mythical-pet'
  | 'ai-companion'
  | 'local-llm'
  | 'open-interpreter'
  | 'web-ai'
  | 'navigation';
```

## Application Flow

### Global Settings Navigation

Other components (like the AI Companion header, Command Palette, or empty states) trigger settings navigation via a custom event:
- Event: `open-settings`
- Detail: `{ section: SettingsSection }`

`Dashboard.tsx` listens to this event:
1. Sets `activeMainView` to `'settings'`.
2. Dispatches a second internal state updates or prop configuration to render the requested section in `<SettingsPanel>`.

## Interface Contract

- Custom Event `open-settings` payload: `{ detail: SettingsSection }` (or `{ detail: { section: SettingsSection } }`).
- Navigation entrypoint: `window.dispatchEvent(new CustomEvent('open-settings', { detail: section }))` or a helper function `openSettings(section)`.

## Data Model

- LocalStorage key `ai-cli-settings-active-section` stores the last visited section ID as a string.
- LocalStorage key `ai-cli-sidebar-tabs-order` is migrated: when parsed, if `'open-interpreter'` is not present, it is dynamically appended before the pinned items.

## UI / Platform Impact

- `SettingsPanel.tsx` is restructured to show:
  - Left rail with category navigation buttons (desktop) or a drop-down selector (narrow screens, width < 640px).
  - Right content area showing the selected section form.
- The sidebar (`CliSidebar.tsx`) adds a new Open Interpreter tab icon.
- Command Palette (`CommandPalette.tsx`) adds commands:
  - `Settings: Appearance`
  - `Settings: Mythical Pet`
  - `Settings: AI Companion`
  - `Settings: Local LLM`
  - `Settings: Open Interpreter`
  - `Settings: Web AI`
  - `Settings: Sidebar Navigation`
  - `Launch Open Interpreter`
  - `Launch Web AI`
  - `Launch AI Companion`
