# Validation

## Automated

- [x] `npm.cmd run build` (PASS, 2026-07-22)
- [x] `cargo check --manifest-path src-tauri/Cargo.toml` (PASS, 2026-07-22)
- [x] `cargo test --manifest-path src-tauri/Cargo.toml` (50 passed, 1 live-provider test ignored)
- [x] Rust test target compilation (`cargo test --no-run`)

## Runtime gates

- [ ] Dashboard 30-minute soak with current four local monitors
- [ ] 1,000 lines/second monitor-log test for five minutes
- [ ] Web AI open/close 20-cycle test
- [ ] Tray-hidden ten-minute idle test
- [x] Companion cancellation during body wait (mock server stalls after headers; cancellation completed in under one second)
- [ ] Normal-exit cleanup check

## Baseline note

Before implementation, a live Windows sample showed the `clx.exe` process around 40 MiB working set while its WebView2 descendants accounted for roughly 641 MiB. This is a directional sample, not a pass/fail measurement; final checks must use repeatable before/after sampling of the same process tree.

## Current status

The compile/unit/integration gate and Companion cancellation timing are green. The initial soak exposed renderer growth and the 10-minute post-fix smoke passed, but the post-fix 30-minute soak, high-volume log generation, Web AI 20-cycle, and tray-idle checks remain open. US-024 stays `in_progress`; no claim is made that all long-session gates have passed yet.

## Runtime evidence

- Initial 30-minute soak on the pre-Stage-2 build: **FAIL**, UI-owned delta `+96.61 MiB`, slope `6.731 MiB/min`, WebView count stable at `6`. CSV: `D:\tmp\us024-dashboard-soak.csv`.
- Failure analysis: WebView renderer retained terminal output in main xterm, mini xterm, and an unbounded-by-byte replay history. This activated US-025.
- Post-fix 10-minute smoke on isolated debug PID: **PASS**, UI-owned delta `+5.71 MiB`, slope `0.409 MiB/min`, WebView count stable at `6`. CSV: `D:\tmp\us024-stage2-smoke.csv`.
- Local monitor batching smoke: process count baseline `8`, refresh peak `10`; before batching refresh peaks reached `16-20`.
- Post-fix 30-minute attempt: **CONTAMINATED**, not scored. Workload changed at minute ~23 from 8 processes to 30-32 processes by adding 10 `cmd.exe`, 11 `conhost.exe`, and a Node/Codex workload. The stable segment from minute 5 to ~23 had delta `-4.16 MiB`, slope `-0.106 MiB/min`, six WebViews, and process count fixed at eight. CSV: `D:\tmp\us024-stage2-soak.csv`.
- The post-fix 10-minute result is encouraging but does not replace the required 30-minute soak.
