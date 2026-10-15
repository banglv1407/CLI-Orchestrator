# US-060 Windows Portable Build with Matching Tauri Packages

## Status

implemented

## Lane

normal

## Product Contract

Build a Windows x64 executable containing the current mini-terminal session
title and single-paste fixes. The executable runs without a CLX installer and
is also available in a portable ZIP.

## Relevant Product Docs

- `README.md`
- `docs/product/terminal.md`

## Acceptance Criteria

- JavaScript Tauri API/dialog packages match the major/minor releases already
  selected by the Rust lockfile, so the normal compatibility check passes.
- The standard production entrypoint builds with default application features
  and embedded production frontend assets.
- Produce the dated executable and ZIP, with recorded size and SHA256.
- Check executable architecture and imported runtime DLLs.
- Document the existing WebView2 requirement and where to run the executable.

## Design Notes

- The initial build stopped at the Tauri compatibility guard: Rust selected
  tauri 2.11.1 and tauri-plugin-dialog 2.7.2; the npm lockfile still selected
  API 2.10.1 and dialog 2.6.0. Align the JS dependencies with those Rust versions.
- Use `npm.cmd run build:production -- --no-bundle --ci` after loading the
  existing Visual Studio developer environment. Retain compatibility checks.
- `AWS_LC_SYS_PREBUILT_NASM=1` uses the dependency's bundled Windows objects
  for this build. The build does not change this dependency or its configuration.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Existing terminal paste/OSC integration smoke |
| Integration | Matched npm/Rust versions and production frontend compilation |
| E2E | Executable launch if available without affecting the current app |
| Platform | Windows x64 PE and runtime dependency checks |
| Release | Production release build; artifact hashes; ZIP integrity |

## Harness Delta

- Record the mismatched dependency guard and release artifact evidence.

## Evidence

- The subsequent Hermes name fix is shipped in `CLX (1011-2).exe` and its ZIP.
  See `docs/stories/US-061-hermes-session-names.md` for the current artifacts
  and final hashes. The evidence below describes the initial portable build.
- Updated only the npm Tauri API/dialog dependencies to 2.11.1 and 2.7.2,
  matching the existing Rust versions. The npm lockfile also now reflects
  the already-current app version 0.2.3. The normal Tauri compatibility guard
  passes; no ignore-version flag was used.
- Production build: PASS in 4m 12s using the standard entrypoint, default
  features, VS developer environment, and bundled prebuilt NASM objects.
- `node .temp/terminal-paste-smoke.mjs`: PASS after dependency alignment,
  including allowed/prompt/denied states, repeat paste, Caps Lock,
  Ctrl+Shift+V, multiline/Unicode, bracketed paste, and separate PTY targets.
- `node .temp/mini-title-parser-smoke.cjs`: PASS for real xterm OSC parsing,
  independent sessions, updates, clearing, and listener disposal.
- `npm.cmd run check:i18n`: PASS for all 1,507 en/vi/ko messages.
- Executable metadata: Windows x64 PE32+ GUI; product name `CLX (1011)`;
  product version `0.2.3`. `dumpbin /dependents` lists Windows system DLLs and
  Universal CRT API sets, without an app-specific sidecar or runtime DLL import.
- ZIP integrity: PASS. Its only entry is `CLX (1011).exe`; hashing the extracted
  entry stream produces the same SHA256 as the release executable.
- Artifacts:

  | File | Bytes | SHA256 |
  | --- | ---: | --- |
  | `src-tauri/target/release/CLX (1011).exe` | 41,157,120 | `61B5528932945F2477E99BC12B7DC58D731EE34472722FF62DC4B52331364E75` |
  | `src-tauri/target/release/CLX (1011).zip` | 17,892,207 | `621C7589FFAFF07F3317B2FEE628A8AC0C78B4CA2A2739C71B562988C404CA3D` |

- Machine-readable report: `.temp/portable-20261011-artifacts.json`.
  Build log: `.temp/portable-20261011-build.log`.
- `git diff --check`: PASS. README documents the portable build command and
  current mini-terminal title behavior.
- WebView2 154.0.4258.62 is installed on this machine. The new application was
  not launched during this build; the existing `CLX (1006)` desktop instance
  remains running. Native mini-title/hover and first Allow-dialog acceptance
  remain the manual checks documented in US-058 and US-059.

## Portable Release 2026-10-12

- Intake #65 builds the current checkout, including AI Companion activity
  navigation (US-062) and the title-only mini terminal display (US-063).
- `npm.cmd run build:production -- --no-bundle --ci`: PASS with default app
  features, the existing VS x64 environment, and `AWS_LC_SYS_PREBUILT_NASM=1`.
  Tauri package compatibility checks passed; optimized Rust compilation took
  3m 28s. Existing unused-code and frontend bundle warnings remain.
- Verified Windows x64 PE32+ GUI headers, product name `CLX (1012)`, version
  `0.2.3`, and Windows/Universal CRT DLL imports.
- ZIP contains only the dated executable; its extracted SHA256 matches the
  executable. Frontend source hashes remained unchanged throughout the build.

  | File | Bytes | SHA256 |
  | --- | ---: | --- |
  | `src-tauri/target/release/CLX (1012).exe` | 41,494,528 | `EE07B325AD7EFC4B0EBDAF4F89E773D5D077D7340DBD57C965F0DC4198E318C6` |
  | `src-tauri/target/release/CLX (1012).zip` | 17,969,786 | `74B8C71FD32CF0A00DA9733D51E3042F1876B4F8A495E17B12C85E110BCF5751` |

- Reports: `.temp/portable-20261012-artifacts.json` and
  `.temp/portable-20261012-inputs.json`; log:
  `.temp/portable-20261012-build.log`.
- No installer was built, and the new executable was not launched. Browser
  acceptance for both new UI features passed in US-062/US-063; actual desktop
  interaction remains separate from the binary and archive checks.
