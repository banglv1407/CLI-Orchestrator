# Validation

Date: 2026-10-21

## Acceptance Evidence

| Check | Result |
| --- | --- |
| SSH fingerprint Rust fixtures | 5/5 passed: canonical SHA256/address checks, no authentication, refused/non-SSH/timeout, stable key, concurrent requests, invalid key preserved |
| Existing proxy-hop fixtures | 7/7 passed with normal Windows Schannel access: Direct, HTTP, HTTPS CONNECT/TLS rejection, SOCKS4, SOCKS5 and SSH |
| SSH integration | Discovered key works with password/private-key authentication, incremental SSE and cleanup; mismatched pin rejected |
| Default-feature CLX compilation | cargo check passed; existing OAuth dead-code warnings remain |
| Frontend | TypeScript and Vite production build passed |
| Browser | 13 cases en/vi/ko, zero runtime exceptions, simulated Tauri IPC and clipboard |
| Localization unit tests | 10/10 passed |
| Focused SSH/proxy localization | 184 copy locations passed; exact Vietnamese/Korean button text asserted and screenshots reviewed |
| Whole-project localization audit | 9 pre-existing failures in Notepad, SpecialConfigModal and TerminalPanel drafts; none from SSH/proxy changes |
| Diff / new Rust module formatting | Passed |
| Native desktop / real remote host / new EXE | Not attempted |

The browser suite covers loading, duplicate prevention, credential-free IPC,
concurrent auth edits, password/key modes, host/port invalidation, stale results,
hop switching, cancellation, Add/Edit/save/reload, copy, network/key/clipboard
errors and retry. Browser persistence and clipboard use simulated IPC.

Report: .temp/ssh-fingerprint/report.json.
Screenshots: .temp/ssh-fingerprint/{en,vi,ko}-{backend,server}.png.

## Commands

Run Rust in the Visual Studio x64 developer environment with
AWS_LC_SYS_PREBUILT_NASM=1.

~~~text
cargo test --manifest-path src-tauri/Cargo.toml --lib --no-default-features ssh_fingerprint
cargo test --manifest-path src-tauri/Cargo.toml --lib --no-default-features proxy_hop
cargo check --manifest-path src-tauri/Cargo.toml --bin clx
npm.cmd run build
node --test scripts/i18n.test.mjs
npm.cmd run test:ssh-fingerprint:ui
npm.cmd run check:i18n
rustfmt --check --edition 2021 src-tauri/src/core/ssh_fingerprint.rs
git diff --check
~~~

## Windows Runner Notes

- The managed sandbox prevents Schannel credentials: Windows error -2146893042,
  "No credentials are available in the security package". The existing HTTPS
  fixture failed before ClientHello inside the sandbox. All seven final proxy
  fixtures passed unchanged outside it.
- Set CLX_SSH_BROWSER_NO_SANDBOX=1 for the isolated managed Chromium fixture
  profile; its sandbox initially closed the debugging connection.
- Windows PowerShell stdin defaults can corrupt Unicode piped into Node. Use
  ASCII Unicode escapes or explicitly set UTF-8. Corrected Vietnamese/Korean
  controls were inspected in screenshots and the full browser suite rerun.
- Invoke Harness with the explicit Git Bash executable and
  PATH=/usr/bin:/bin:$PATH. Selecting a generic Bash shell can resolve to WSL.

## Existing Localization Failures

~~~text
Notepad.tsx:700: literal "{v0} / {v1}"
SpecialConfigModal.tsx:190: missing "Empty"
SpecialConfigModal.tsx:226: missing "Pick"
TerminalPanel.tsx:2977: missing "Format"
TerminalPanel.tsx:3068: literal "{v0} / {v1}"
TerminalPanel.tsx:3240: literals "Ln", ", Col"
TerminalPanel.tsx:3252: literal "TXT"
TerminalPanel.tsx:3254: literal "UTF-8"
~~~

These files were already modified when this task started and were left intact.
