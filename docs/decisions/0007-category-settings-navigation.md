# 0007 Settings Navigation and Event-driven Routing

Date: 2026-07-16

## Status

Accepted

## Context

The Settings panel in CLI Orchestrator has grown monolithically and needs to accommodate upcoming features like Open Interpreter (US-010/US-011) and Web AI Profiles (US-009). The settings configuration needs to support deep linking from other parts of the application (e.g. AI Companion chat header, Command Palette) without introducing heavy frameworks like React Router which are not aligned with the lightweight SPA architecture of the dashboard.

## Decision

We split the settings panel into a rail-based category UI:
1. Left sidebar containing section buttons for `appearance`, `mythical-pet`, `ai-companion`, `local-llm`, `open-interpreter`, `web-ai`, and `navigation`.
2. Responsive select dropdown when screen width is narrow (< 768px).
3. Global, decoupled routing via custom events:
   - Dispatched: `open-settings` (with detail containing targeted category ID).
   - Listened by `Dashboard.tsx` to set the main view to settings, and then forward target category to `SettingsPanel`.
4. Removed the separate `LlmConfigModal` from sidebar, replacing it with a redirect to the Settings companion tab.
5. Dynamic migration of sidebar orders to append `open-interpreter` tab gracefully for existing users.

## Alternatives Considered

1. **React Router integration**: Rejected. Introducing router dependencies into Tauri SPAs increases bundle size and complexity.
2. **Prop-drilling callback functions**: Rejected. Emitting custom window events is more decoupled and allows any deep component to navigate to Settings easily.

## Consequences

Positive:
- Settings layout is clean and ready for Web AI and Open Interpreter configurations.
- Sidebar code size is reduced by eliminating duplicate configuration forms.
- Dynamic deep routing works from anywhere in the application.

Tradeoffs:
- Relies on browser CustomEvents, requiring care with event listener cleanups in React lifecycle hooks.
