# US-064 Main Terminal Resize Integrity

## Status

implemented

Fix implemented, automated validation passed, and Windows portable packaging
completed on 2026-10-13. Live nested-agent desktop acceptance is still open.

## Lane

normal

Risk flags: existing behavior and weak proof.

## Product Contract

Resizing a main terminal, or selecting a session after a layout change, must
preserve each logical output line once. Windows ConPTY screen redraws must
remain aligned with the xterm buffer and must not overwrite unrelated history.

## Relevant Product Docs

- `docs/product/terminal.md`
- `docs/stories/US-003-terminal-tui-safe-rendering.md`
- `docs/stories/US-034-batched-terminal-restore-output.md`

## Acceptance Criteria

- [x] Width and height changes preserve unique output lines and scrollback with
  actual ConPTY redraws, including long wrapped lines.
- [x] Switching sessions preserves the parsed buffer without ANSI history replay.
- [x] Fit scheduling follows the intended visibility policy and does not issue
  redundant work for hidden sessions through React ref callbacks.
- [ ] Real nested-agent CLI redraws pass a Windows desktop smoke test.

## Design Notes

`src/lib/terminalResize.ts` adds `ConptyResizeAddon` for Windows main
terminals. It enables ConPTY row-growth handling, splits reflow at the native
viewport boundary, and preserves that boundary/cursor while adding blank
rows after width expansion. This keeps ConPTY's subsequent redraw aligned
with the parsed buffer instead of overwriting history. It preserves xterm's
cell attributes, scrollback limits, and alternate-screen handling without
writing or replaying terminal text. Reset works because each resize resolves
the current normal buffer. The private xterm access stays inside the addon;
the existing dependency is pinned to exactly 6.0.0.

The frontend starts at the same 140 x 34 grid as `spawn_pty_process` and
routes pre-mount output through the main write queue. `TerminalResizeQueue`
serializes native resize IPC per PTY, coalesces pending dimensions, skips
already applied sizes, and disposes pending requests with the session.

All fit paths share an 80 ms timer with active-session, DOM-visibility, and
size checks. A fit waits while the main write queue or preceding native
resize is in progress. Session/view switches cancel pending fits and keep
scroll position. `ensureTerminal` checks the xterm root's parent container,
so repeated React ref callbacks no longer reopen it or schedule hidden fits.
Font/appearance changes update options for all sessions and fit the visible
session. The native backend and Unix terminal reflow are unchanged.

Native output was captured using the same installed `portable-pty 0.8.1`
ConPTY backend as CLX. An isolated PowerShell child printed 60 numbered lines
once and then waited for input; no commands or extra content were sent during
resize. Captured redraws were parsed by the installed xterm 6.0.0 with the
main-terminal constructor extracted from current source. The browser test
also fed those bytes through the current React `cli-output` listener and
write queue, with exact capture dimensions and fitting paused for that replay.
This demonstrates real native redraw data and real frontend parsing, while
keeping Tauri IPC simulated and avoiding interference with user sessions.

The original fault appeared when xterm reflowed wrapped history across the
viewport boundary and ConPTY repainted a different layout. Windows metadata
alone fixed height-only history loss but left width duplication; disabling
reflow avoided duplicate markers while losing history. The fix preserves
both history and viewport reflow. The original attachment check compared
the xterm root to its parent container and always scheduled another fit,
including for hidden sessions; this has also been corrected.

Upstream context: [Microsoft's ConPTY buffer-desynchronization issue](https://github.com/microsoft/terminal/issues/15976)
describes the distinction between viewport-only native reflow and an
emulator's scrollback. xterm's [ConPTY reflow change](https://github.com/xtermjs/xterm.js/pull/5321)
was later reverted. This implementation keeps the existing released xterm
version and validates a bounded local adapter with actual native captures.

## Validation

| Layer | Proof |
| --- | --- |
| Unit | 10 resize tests pass, covering every fixture character/marker, Unicode/colors, scrollback bounds, reset/alternate screen, and delivery/cleanup |
| Integration | All 15 native capture stages preserve all 60 fixture lines and the complete parsed text |
| E2E | 11 current-React browser cases pass with simulated Tauri IPC; zero runtime exceptions |
| Platform | Live Windows Tauri sessions with the affected agent CLI still pending |
| Release | Frontend and production portable build pass; Windows x64 GUI PE header verified |

## Evidence

Branch `dev`, HEAD `d6805f209867a6d943aea2c2a683cc862d424a0d`, using the current
working tree, including pre-existing uncommitted terminal changes. Installed
xterm is 6.0.0, portable-pty is 0.8.1, and local Windows build is 26300.

Before the fix, at a fixed height of 34 rows, native capture produced these results:

| Width | Unique markers retained | Total markers | Duplicate markers |
| --- | ---: | ---: | ---: |
| 140 | 60 | 60 | 0 |
| 80 | 60 | 60 | 0 |
| 160 | 43 | 43 | 0 |
| 100 | 43 | 51 | 8 |
| 140 | 35 | 35 | 0 |

`FIXTURE_045` through `FIXTURE_052` each appeared twice at width 100. The
original React main terminal reproduced the same result with zero runtime
exceptions. A separate mixed width/height sequence duplicated three markers.
Height-only resizing lost 34 of the original 60 markers; setting
`windowsPty: { backend: 'conpty', buildNumber: 26300 }` retained all 60 in that
height-only fixture, but still duplicated eight markers in the width fixture.

Controls passed: 20 same-size session switches preserved the entire parsed
buffer; static text without native redraw retained all 60 unique markers
through four browser window sizes (900 x 700, 1800 x 1100, 1100 x 750,
1440 x 1000). Switching alone was not reproduced as an independent cause.

After the fix, every height, width, and mixed capture stage retains 60
distinct markers, 60 total markers, and exactly the original parsed text.
The native captures are now tracked under `scripts/fixtures/terminal-resize/`
and replayed by `scripts/terminal-resize.test.mjs` through the production
addon and installed xterm.

The current browser check additionally confirms:

- 20 same-size session switches preserve the buffer.
- Four window sizes preserve every static fixture line.
- A hidden terminal stays at 111 x 66 during a window resize, then fits to
  60 x 50 on selection; the previous version resized it while hidden.
- A pending native resize prevents another grid change until completion.
- A pending output write prevents fitting until old-grid parsing completes.
- All 15 captured redraw stages pass through the actual React output listener
  and write queue without duplication or history loss.

Commands passed:

```powershell
npm.cmd run test:terminal-resize
npm.cmd run test:terminal-titles
node .temp\terminal-paste-smoke.mjs
npm.cmd run build
node .temp\terminal-resize-investigation\browser.mjs
```

The existing 7 terminal-title tests and single-paste smoke checks also pass.

Portable release: `src-tauri/target/release/CLX (1013).exe` (41,494,528 bytes).
Production build exited 0. PE inspection confirms Windows x64 PE32+ GUI.
SHA256: `0E1AABC9A789B345AC8C2C1CC3EC8C14AFC48C62B3E5486CFA7A7B39C2271E94`.
Build log, exit code, and artifact metadata are retained in
`.temp/portable-20261013-resize-build.log`,
`.temp/portable-20261013-resize-exit.txt`, and
`.temp/portable-20261013-resize-artifacts.json`.

Local investigation artifacts are under
`.temp/terminal-resize-investigation/` (gitignored):

- `capture/`: offline Rust capture utility, using the existing Cargo lockfile
  versions; `fixture.ps1`: deterministic one-time output.
- `rows.json`, `width.json`, `mixed.json`: native output and resize dimensions.
- `analyze.mjs`, `buffer-report.json`: current-constructor xterm replay and
  exploratory configuration comparisons.
- `browser.mjs`, `vite.config.mjs`, `browser-fixed-report.json`: actual current React
  terminal with diagnostic handle access and simulated Tauri IPC.
- `duplicated-lines.png`, `fixed-lines.png`: browser rendering before/after;
  JSON marker counts and text equality provide the authoritative evidence.

Commands used:

```powershell
cargo build --offline --manifest-path .temp\terminal-resize-investigation\capture\Cargo.toml
# Run the capture executable for rows, width, and mixed scenarios.
node .temp\terminal-resize-investigation\analyze.mjs
node .temp\terminal-resize-investigation\browser.mjs
```

The browser test uses an isolated profile and diagnostic Vite config. The
CLX (1012) desktop process and its terminal sessions were left running. No
live Hermes/Codex/Claude desktop acceptance or physical monitor DPI transition
is claimed by the automated checks.

## Harness Delta

Harness backlog 8's native resize regression is now executable through
`npm.cmd run test:terminal-resize` and committed fixture inputs. Keep native
agent desktop acceptance open separately from capture replay and browser IPC
simulation; compilation alone did not detect the original defect.
