# Validation

Required: mixed chains must reach full native pages/resources; unreachable next
hop proves no local DNS/direct shortcut; each credential/pin/TLS failure stops
the route. Cover legacy route identity, named-chain save/reload and encryption.
Probe downstream SSH through prefix routes. Both mini web areas need independent
visibility, title/preview, activate/close and reload-persistence checks with live
terminal buffers preserved. Check English/Vietnamese/Korean and native resizing,
modal occlusion, packaged WebView2 and process cleanup using loopback fixtures.

## Completed development proof

- 17 Rust browser/config/store/relay tests passed, including legacy single-hop
  identities, chain validation/order, encrypted secrets for all hops and route
  revision on upstream credential changes. Log: `.temp/web-chain-rust.log`.
- 7 shared API proxy/SSH and 5 fingerprint tests passed after stream-based SSH
  authentication was shared. Log: `.temp/web-chain-shared-regressions.log`.
- 16 browser/sidebar/chain/mini preference tests, 10 locale tests and 4 terminal
  shortcut unit tests passed. Localization audit: 1723 complete en/vi/ko messages.
- Existing browser UI regressions passed: 11 terminal-broadcast and 25 terminal
  shortcut/editor cases, with zero runtime exceptions.
- Development executable passed 35 real native WebView2 cases. Report:
  `.temp/web-browser-native/f113a872-83ae-47cc-aa55-a653e87cca7e/report.json`.
  This includes the 25 existing browser cases plus HTTP -> SOCKS5 -> HTTP,
  authenticated HTTP -> HTTP, HTTP -> SOCKS4a, SSH -> authenticated HTTP -> SSH
  with encrypted private key, prefix fingerprint discovery, inner pin rejection
  and middle authentication failure without a direct loopback fallback.
- Native previews render in separate right and bottom web areas; mini selection,
  exact-tab close, empty terminal workspace retention, per-area hiding,
  title/preview switching and persisted placement passed. Two real local PTYs
  kept their output buffers and sessions while web tabs changed/closed.
- Native owned-window capture and Vietnamese/Korean chain controls were visually
  inspected. The preview now contains the whole captured viewport to avoid
  cropping wide pages inside the card.

## Final packaged proof

The final `src-tauri/target/release/CLX (1114).exe` passed the same 35 real native
cases, including the two live local PTYs. Report and screenshots:
`.temp/web-browser-native/cb52300e-3f6d-4ad3-8e4d-1125a60264c6/report.json`.

Version 0.2.3, 43,679,744 bytes, Windows x64 PE32+ GUI. SHA-256:
`D57648FBAC196B40D53A728A2BB888E5BE65209F8B5E1AFACB868FFD9B61C614`.
All 168 recorded Rust/frontend/config/build/test inputs stayed unchanged across
packaging and acceptance. Evidence:
`.temp/web-chain-mini-release-artifact.json` and
`.temp/web-chain-mini-release-imports.txt`.

The packaged native preview shows the whole captured viewport inside each card.
Actual content capture and en/vi/ko controls were visually inspected. Browser
fixture proofs are distinct from physical OS keyboard and provider acceptance.
All websites/proxies/SSH services were loopback fixtures; no illustrative IP was
contacted. The runner stopped only its own PTYs/process tree and preserved the
existing desktop `CLX (1111).exe` process.

Real corporate proxy chains, SSO, trusted HTTPS proxy infrastructure, interactive
download destinations and non-Windows runtime acceptance remain unverified.

## Reproduce

Use the Visual Studio x64 developer environment and `AWS_LC_SYS_PREBUILT_NASM=1`.
Run `npm.cmd run test:web-browser`, `npm.cmd run test:i18n`,
`npm.cmd run check:i18n`, `cargo test --manifest-path src-tauri/Cargo.toml --offline
--bin clx web_browser`, and shared `--lib proxy_hop` / `--lib ssh_fingerprint`
tests. Build `cargo build --manifest-path src-tauri/Cargo.toml --offline --example
web-browser-route-fixture`, then the portable app. Set `CLX_WEB_BROWSER_EXE` to
the resulting EXE and run `npm.cmd run test:web-browser:native` in an unrestricted
local Windows process. The runner creates isolated browser profiles and fixture
servers. No persistent SSH service is installed.
