# Validation

## Result

The final Windows portable executable passed 25 real Tauri/WebView2 integration
cases using isolated loopback fixtures. Report and native/localized screenshots:
`.temp/web-browser-native/c092bbcd-9835-4140-9b5b-53df47487469/report.json`.

Artifact: `src-tauri/target/release/CLX (1111).exe`, version 0.2.3,
42,998,784 bytes, Windows x64 PE32+ GUI. SHA-256:
`65603598170CA9FFDDFEC3C67D5A16658C53FFA193E16BC6A87F7A8ECE9B3A2C`.
All 156 recorded Rust/frontend/config inputs remained byte-identical across the
final production build and native checks. Metadata/hash/source evidence:
`.temp/web-connections-release-artifact.json`. Windows DLL imports:
`.temp/web-connections-release-imports.txt`.

## Checks

- Browser URL/connection/bounds and sidebar tests: 14 passed.
- Interface-language tests: 10 passed; terminal shortcuts: 4 passed.
- Localization audit: 1700 complete English/Vietnamese/Korean messages passed.
- Final Rust browser/config/store/relay tests: 15 passed. This includes DPAPI
  round-trip and no plaintext secrets, legacy cookie/profile migration, named
  profile CRUD and route revisions, deleted history remaining deleted,
  SOCKS4a/5 remote DNS/body streaming/shared leases/stable listener reuse and
  authenticated HTTP CONNECT buffered-byte preservation. Log:
  `.temp/web-connections-rust-final.log`.
- Shared API proxy/SSH regressions: 7 passed. Windows TLS requires an unrestricted
  local test process; the sandbox stopped before ClientHello, then the same test
  and full suite passed outside the sandbox without changing the transport.
- Production TypeScript/Vite and standard portable builds passed.
- Native cases cover Enter/Go without Settings; full Direct/HTTP/authenticated
  HTTP/SOCKS4/SOCKS5/authenticated SOCKS5 pages; remote DNS; CSS, images, JS,
  dynamic import, fetch, WebSocket; preserved origins; form POST, HttpOnly cookies,
  redirects and back/forward; independent tabs and managed popups; native
  visibility and physical resizing; profile save/select/delete/restart; history
  reopen/individual/all deletion and retention across locale reloads; pinned SSH
  password/plain/encrypted-key authentication; shared SSH tab close/reopen;
  immediate cancellation during SSH handshake; wrong password/pin rejection;
  main-document forwarding failure/HTTP 502; no Direct fallback even for
  loopback; TLS downgrade rejection; unsafe URL and custom/built-in IPC denial.
- A saved SSH profile opens with Go after restart and records history even when
  an optional image is deliberately blocked. Document success uses native
  main-frame completion and HTTP status; adapter subresource/background errors
  cannot turn a loaded document into a failed visit.
- English/Vietnamese/Korean HTTP and SSH controls and an owned-window PrintWindow
  capture of actual native web content were visually inspected. Test-only
  DevTools keyboard events exercise Enter; physical OS keyboard interception is
  not certified.

The existing desktop CLX process (15872) was preserved. Only the verified
repo-local Rust debug incremental cache was removed after disk-space exhaustion.
No illustrative IP, user browser profile or user connection config was touched.

Real corporate proxies/SSO, trusted external HTTPS infrastructure, interactive
download destinations and non-Windows runtimes remain outside these local proofs.

## Reproduce

Use the Visual Studio x64 environment and `AWS_LC_SYS_PREBUILT_NASM=1`.
Run `npm.cmd run test:web-browser`, `npm.cmd run test:i18n`,
`npm.cmd run check:i18n`, then
`cargo test --manifest-path src-tauri/Cargo.toml --offline --bin clx web_browser`
and the existing `--lib proxy_hop` tests.

For native acceptance, build the SSH fixture with
`cargo build --manifest-path src-tauri/Cargo.toml --offline --example web-browser-route-fixture`,
build the desktop/portable executable, set `CLX_WEB_BROWSER_EXE` to it and run
`npm.cmd run test:web-browser:native` from an unrestricted local Windows process.
The runner supplies isolated data roots and test-scoped DevTools flags and cleans
up its own process tree. No SSH server/service is installed.
