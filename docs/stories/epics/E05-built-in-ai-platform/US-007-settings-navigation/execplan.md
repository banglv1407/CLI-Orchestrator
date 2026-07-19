# Exec Plan

## Goal

Restructure settings to use a left-rail category navigation, support deep routing via global navigation events, update the Command Palette with deep links and launch shortcuts, and add the Open Interpreter tab to the sidebar.

## Scope

In scope:
- Split the monolithic settings view into category rail and corresponding category views.
- Support categories: `appearance`, `mythical-pet`, `ai-companion`, `local-llm`, `open-interpreter`, `web-ai`, `navigation`.
- Expose global event-based `openSettings(section)` navigation and wire it up.
- Remove duplicate LLM configuration modal and direct AI Companion configuration to the Settings page.
- Add Command Palette routes for each Settings category and launcher commands.
- Support Open Interpreter in primary sidebar order and ensure backwards-compatible migration.
- Add responsive selection layout for narrow windows.

Out of scope:
- Open Interpreter ACP client implementation (US-010/US-011).
- Web AI profile WebView engine (US-009).

## Risk Classification

Risk flags:
- Existing behavior (Settings UI forms and sidebar ordering).

Hard gates: None.

## Work Phases

1. **Restructure Settings View**: Implement left rail category select, sub-sections, responsive view, and state preservation.
2. **Add Global Event Navigation**: Add `open-settings` event listener in `Dashboard.tsx` and pass state/props down.
3. **Migration of AI Companion config**: Update "Config" button in companion header to dispatch `open-settings` event instead of opening `LlmConfigModal`.
4. **Command Palette Integration**: Add settings links and launch commands to the Command Palette list.
5. **Sidebar Tab & Order Update**: Add the Open Interpreter tab (`open-interpreter`) to the sidebar rendering, order management, and migration functions.
6. **Validation & Verification**: Verify compilation, styling, responsive behavior, and correct state loading.
