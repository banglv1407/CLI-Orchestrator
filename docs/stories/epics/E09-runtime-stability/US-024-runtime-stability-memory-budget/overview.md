# US-024 - Runtime stability and memory budget

## Problem

After Dashboard, AI Companion, and Web AI were added, CLX can become unresponsive and its WebView2 process tree can retain substantial memory. Dashboard work currently continues while hidden, monitor logs create one frontend event and array copy per line, Web AI can survive panel removal, and Companion cancellation cannot interrupt an in-flight HTTP operation.

## User story

As a CLX user, I want the app to stay responsive during long sessions and release UI-only resources when a surface is inactive, without interrupting my terminals or background services.

## Scope

- Lifecycle signal combining native-window visibility and document visibility.
- Dashboard mounted only while active, with one completion-driven refresh every 10 seconds.
- Bounded Dashboard history and lightweight proxy summaries.
- Batched monitor-log delivery and bounded, windowed rendering.
- Eager Web AI teardown when leaving the surface or hiding to tray.
- Abortable Companion requests with explicit timeouts and response limits.
- Compact diagnostics for process-tree memory, WebView count, and UI lag.

## Out of scope

- Redesigning terminal, proxy, SSH, or agent service ownership.
- Changing saved config schemas or provider APIs.
- General whole-app optimization unless the targeted performance gate fails.

## Acceptance criteria

1. With the current four local monitors, Dashboard refreshes no more than once per 10 seconds, never overlaps refreshes, and stops while inactive.
2. After a 5-minute warm-up in a 30-minute Dashboard soak, process-tree working-set growth is at most 25 MiB and its linear slope is at most 1 MiB/minute.
3. Dashboard interaction has no observed task over 500 ms and p95 sampled UI lag is at most 50 ms during the soak.
4. At 1,000 log lines/second for five minutes, retained log memory remains within 5,000 lines and 2 MiB, rendering remains windowed, and pause does not trigger per-line React renders.
5. Twenty Web AI open/close cycles leave no child overlay and no monotonically growing WebView process count; within 60 seconds the final process-tree working set is within 75 MiB of baseline.
6. Hiding CLX to tray for ten minutes causes no Dashboard/UI polling; idle UI CPU stays below 1% of one core while background services remain available.
7. Cancelling an active Companion request reaches idle state within one second, including while connecting or waiting for a body.
8. Normal exit closes Web AI, cancels Companion work, and stops monitor-log streams within a two-second grace period.

