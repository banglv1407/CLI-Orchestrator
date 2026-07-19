# Overview

## Current Behavior

- The `WebAiPanel` component is a static placeholder without any WebView spawning capabilities.
- Web AI profile configuration does not exist in preferences.
- Clicking the mythical pet changes the main view to `'web-ai'` but does not automatically load a default profile or collapse the sidebar.

## Target Behavior

- **Profile Configuration**: Custom Web AI profiles saved in `~/.ai-cli-manager/web-ai.json`. Default profiles provided for ChatGPT, Claude, and Gemini with default user agents and domain filters.
- **Spawning isolated WebViews**: Spawn child WebViews with custom partition names (e.g. `chatgpt_partition`) to isolate cookies and sessions.
- **Navigation boundaries**: Restrict WebView navigation to matching `allowNavigationRules`. If a user navigates to a disallowed URL, block it or display a security error.
- **Pet click routing**: Auto-collapse sidebar and load the preferred default Web AI profile (or ChatGPT fallback).

## Affected Users

- Users utilizing web-based LLM assistants (ChatGPT, Claude, Gemini) securely in-app without leaking cookies or browser sessions.

## Affected Product Docs

- `docs/stories/epics/E05-built-in-ai-platform/plan.md`
