# US-062 AI Companion Activity Bar Navigation and Visibility

## Status

Implemented.

## Lane

Normal: bounded navigation behavior; existing behavior and weak proof flags.

## Product Contract

AI Companion is a selectable feature on the activity bar with the same persisted
visibility and ordering controls as the other features.

## Relevant Product Docs

- `docs/product/workspace.md`
- `docs/product/localization.md`
- `README.md`

## Acceptance Criteria

- The localized robot activity button is visible by default and opens the
  existing chat panel with an active highlight; a second click collapses it.
- The button works with Enter and Space, and exposes its expanded state.
- Settings > Navigation can hide, show, and reorder AI Companion immediately.
- Visibility and order survive restart; legacy navigation gains the new item
  once while retaining existing preferences, and subsequent hides persist.
- Reset/default and show-all actions include AI Companion.
- Command Palette can open hidden chat without changing icon visibility.

## Design Notes

- Sidebar and navigation editor share typed defaults, persisted-state parsing,
  order normalization, and the one-time visibility migration.
- Reuse AIChatPanel, the existing view switch flow, and existing translations.
- No provider, runtime, approval, or chat persistence behavior changes.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Saved-state normalization and one-time migration/hide persistence |
| Integration | TypeScript/build and localization audit |
| E2E | Browser fixture: open/collapse, hide/show/reorder, reload, palette, locales |
| Platform | Physical Windows desktop interaction pending; browser uses simulated IPC |
| Release | No packaged executable requested |

## Harness Delta

Intake #63; story US-062 records the activity navigation contract and proof.
Browser-runner friction from backlog #7 was diagnosed: Chromium child processes
failed under the managed Windows runner. The smoke now offers a documented
`CLX_I18N_BROWSER_NO_SANDBOX=1` option limited to its isolated fixture profile.
Keyboard checks emulate focus and include the native key text in CDP events.

## Evidence

- `node --test scripts/sidebar-navigation.test.mjs`: 4 tests passed, covering
  fresh defaults, one-time upgrade, explicit hide persistence, saved custom
  ordering, invalid/retired values, and storage failure.
- `npm.cmd run check:i18n`: all 1,507 en/vi/ko catalog entries and UI bindings
  passed; existing translations cover the new activity icon and settings row.
- `npm.cmd run build`: TypeScript and production Vite build passed. Existing
  Browserslist freshness and bundle-size/import warnings remain.
- `npm.cmd run test:i18n:ui` with `CLX_I18N_BROWSER` pointing to installed
  Chromium and `CLX_I18N_BROWSER_NO_SANDBOX=1`: passed all three locales, all
  nine Settings sections, seven workspaces in vi/ko, Companion icon activation
  and collapse using mouse/Enter/Space, hide/show/reorder/presets, hidden palette
  destination, legacy upgrade, unsaved settings, and reload persistence.
- Browser report: `.temp/i18n-browser/report.json`; zero runtime exceptions.
- `git diff --check`: passed. Physical desktop, real-provider chat, and a
  packaged executable were not part of this frontend navigation validation.
- The subsequent Windows portable `CLX (1012).exe` includes this feature.
  Build, x64 metadata, hashes, and ZIP integrity are recorded in US-060.
