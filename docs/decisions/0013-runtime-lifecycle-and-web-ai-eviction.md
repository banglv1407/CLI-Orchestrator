# ADR 0013: Runtime lifecycle and Web AI eviction

- Status: Accepted
- Date: 2026-07-22
- Story: US-024

## Context

UI-owned polling and child WebViews can continue consuming CPU and memory after their surface is no longer useful. Earlier Web AI documents disagree between an embedded child and a dedicated window. CLX also intentionally keeps terminals and services alive when hidden to tray.

## Decision

CLX separates service lifetime from UI lifetime. UI work runs only while the native window and document are visible. Hiding to tray preserves background services but pauses polling/rendering and closes the live Web AI child. Web AI profile data remains persisted so login state survives recreation.

The embedded Web AI child remains the first implementation because it preserves the current layout. It must pass a 20-cycle open/close stability gate. If it fails, Web AI moves to a dedicated native window; it must not be kept persistently embedded as a workaround.

Normal exit explicitly cancels Companion work, stops monitor-log streams, and closes Web AI with a bounded grace period.

## Consequences

- Returning to Web AI reloads the page but retains cookies/login state.
- Dashboard data may be up to 10 seconds old and refreshes immediately when reopened.
- Service processes remain available while tray-hidden; UI-owned resource use should approach idle.
- Lifecycle cleanup becomes a shared contract for future heavy surfaces.

