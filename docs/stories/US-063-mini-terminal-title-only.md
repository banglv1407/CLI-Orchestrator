# US-063 Mini Terminal Title-Only Display Mode

## Status

Implemented.

## Lane

Normal: bounded terminal display behavior; existing behavior and weak proof.

## Product Contract

Users can choose compact title-only session rows instead of mini terminal
previews in both the bottom and right panels.

## Relevant Product Docs

- `docs/product/terminal.md`
- `docs/product/localization.md`
- `README.md`

## Acceptance Criteria

- Each panel offers Mini terminal and Title only; the shared choice persists.
- Title-only rows retain the resolved agent title, full hover text, active
  selection, mouse/keyboard activation, dragging/docking, and stop/close.
- Title only omits preview and metadata bars, hides the scale controls, and
  makes the bottom tray compact.
- Switching mode disposes only mini xterms and synchronization work. Main
  terminal buffers, session processes, output, and title updates survive.
- Returning to previews recreates them from current main buffers.
- New controls have complete English, Vietnamese, and Korean translations.

## Design Notes

- Reuse `getMiniTerminalTitle` for both layouts and modes.
- Keep preview as the default for missing/invalid saved values.
- Share the mode selector and compact title renderer; preserve existing PTY
  ownership and the parsed main xterm buffers.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Existing terminal title resolution tests |
| Integration | TypeScript/production build and localization audit |
| E2E | Browser fixture: both panels, persistence, live titles, buffers, selection, mode restoration |
| Platform | Manual Windows desktop and actual CLI checks remain separate |
| Release | Packaged executable not requested |

## Harness Delta

Intake #64 and story US-063 track the new display mode and its proof.
The existing production browser smoke now has simulated event subscriptions and
three isolated live xterm fixtures to verify mode changes against parsed output.

## Evidence

- `npm.cmd run build`: TypeScript and production Vite build passed. Existing
  Browserslist freshness and bundle/import warnings remain.
- `npm.cmd run check:i18n`: 1,510 complete en/vi/ko messages passed, including
  the display selector and its two options.
- `npm.cmd run test:terminal-titles`: all 7 existing title/polling tests passed.
- `npm.cmd run test:i18n:ui` with installed Chromium and
  `CLX_I18N_BROWSER_NO_SANDBOX=1`: passed. Three real xterm instances use
  simulated PTY events/IPC to verify both panels, invalid-preference fallback,
  preview removal, smaller tray, scale control removal, Unicode OSC title
  changes, main-buffer preservation, preview recovery, repeated mode switches,
  mouse/keyboard session selection, localized options, reload persistence, and
  closing exactly the selected session. Existing Companion/localization checks
  also passed; zero runtime exceptions.
- Report: `.temp/i18n-browser/report.json`; screenshot:
  `.temp/i18n-browser/terminal-title-only-ko.png`.
- `node --check scripts/i18n-smoke.mjs` and `git diff --check`: passed.
- Actual Windows Tauri/agent interaction remains pending.
- The subsequent Windows portable `CLX (1012).exe` includes this display mode.
  Build, x64 metadata, hashes, and ZIP integrity are recorded in US-060.
