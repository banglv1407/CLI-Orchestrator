# Design

## Lifecycle

The frontend derives `uiActive = nativeWindowVisible && !document.hidden`. It pauses UI-owned timers and animation while false. Hiding to tray additionally closes the Web AI child WebView. PTY, proxy, SSH, and agent services remain backend-owned and continue running.

Normal exit performs bounded cleanup: close Web AI, cancel Companion work, and stop active monitor-log streams. Cleanup must be idempotent.

## Dashboard

- Mount Dashboard only when selected and `uiActive`.
- Replace the 4-second interval with a completion-driven 10-second loop plus explicit refresh.
- Run blocking OS inspection off the Tauri command executor and reuse a connection snapshot within one refresh.
- Store aggregate history buckets instead of complete connection arrays.
- Fetch proxy summaries for the table; fetch large detail only when opened.
- Extend resource diagnostics without removing existing fields: tree working/private bytes, descendant count, and WebView count.

## Monitor logs

The backend emits batches of up to 100 lines or 64 KiB, flushing at least every 100 ms. The frontend owns a bounded ring of 5,000 lines/2 MiB and renders only the latest visible window. While paused it keeps capture bounded but publishes pending-count UI updates no more than four times per second.

## Web AI

Leaving the Web AI surface or hiding the main window closes the child WebView but preserves its profile data. Launch and close are serialized, delayed launch work is cancellable, and bounds updates are coalesced to animation frames. If the 20-cycle gate still fails, the documented fallback is a dedicated native window rather than a persistent embedded child.

## AI Companion

Each run owns a real cancellation token. The HTTP future is selected against cancellation, uses a 10-second connect timeout and 180-second request timeout, and accepts at most a 2 MiB successful body or 64 KiB error body. Run state is observable so the UI can settle deterministically.

## Compatibility

No database or config migration is required. Existing command response fields remain available; new diagnostics and summary commands are additive.

