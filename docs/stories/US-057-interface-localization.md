# US-057 Complete en/vi/ko interface localization

## Status

implemented

## Lane

normal (existing behavior, weak proof, multiple UI domains)

## Product Contract

All CLX-owned interface text follows the persisted English, Vietnamese, or
Korean selection in Settings > Appearance. Changing language is immediate and
preserves running sessions and unsaved user content.

## Relevant Product Docs

- `docs/product/localization.md`

## Acceptance Criteria

- Settings exposes English / Tiếng Việt / 한국어 with an accessible label.
- A valid stored selection is restored before the first render; invalid or
  inaccessible storage falls back to English.
- Navigation, Settings, panels, dialogs, game UI, notifications, and native
  tray/exit actions use complete en/vi/ko resources.
- Runtime substitutions preserve values and translated word order.
- User content, commands, paths, identifiers, and external output are preserved.
- Language changes rerender existing views without remounting them.
- A catalog audit prevents missing languages and leftover literal UI copy.

## Design Notes

Small typed translation catalog and a React external-store subscription; no
network translation or new production dependency. A native locale command
updates tray labels and exit-dialog copy. Browser storage holds the frontend
preference; native persistence restores native menus before the WebView loads.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Catalog completeness, interpolation, persistence and fallback |
| Integration | UI copy audit, TypeScript and production frontend build |
| E2E | Change language while editing/chatting; verify every workspace |
| Platform | Native locale tests/check; tray and exit dialog smoke |

## Evidence

Implemented Settings > Appearance > Interface language with English, Vietnamese,
and Korean. The shared catalog contains 1,507 complete entries, including
application feedback, dynamic labels, built-in game copy, and native locale
copy. The native bridge updates tray menu labels and persists the close-dialog
language. User values, commands, content, and external output are preserved.

- `npm.cmd run check:i18n`: passed for all three languages, placeholders, literal
  UI copy, and technical bindings.
- `npm.cmd run test:i18n`: 10 tests passed, covering interpolation, nested owned
  errors, unavailable/corrupt storage, immediate updates, cross-window changes,
  native update ordering, and time formatting.
- `npm.cmd run build`: TypeScript and production frontend build passed.
- `npm.cmd run test:i18n:ui`: passed using Edge headless and a native fixture.
  All 9 Settings sections rendered in en/vi/ko with no recognized untranslated
  visible copy. Seven workspaces rendered in vi/ko, the unsaved prompt survived
  en/vi/ko changes, and Korean was restored after reload. No runtime exceptions.
  Screenshots and the report are in `.temp/i18n-browser`.
- `cargo check --manifest-path src-tauri/Cargo.toml --bin clx`: passed with
  default features. The no-default-features binary check also passed.
- `cargo test --manifest-path src-tauri/Cargo.toml --no-default-features --lib
  ui_language`: 3 native locale tests passed.
- Rust checks used the Visual Studio developer environment and temporary
  `AWS_LC_SYS_NO_ASM=1` for debug checks because NASM is absent on this host.
  No build dependency or production crypto setting was changed.
- Focused `rustfmt --check` and `git diff --check`: passed.

Physical desktop inspection of tray/exit dialogs remains manual. No release
executable was built or deployed. Browser fixture proof does not claim live
SSH, AI-provider, or multiplayer coverage.

Harness: Intake #55, story US-057, completion trace #91. Unit, integration, and
browser E2E proof are recorded; physical platform smoke remains unchecked.
