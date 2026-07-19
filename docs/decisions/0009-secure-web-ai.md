# 0009 Secure Web AI Sandboxed WebView Profiles

Date: 2026-07-16

## Status

Accepted

## Context

Users want to utilize web-based LLM assistants (ChatGPT, Claude, Gemini) securely from the orchestrator client. The browser sessions, login cookies, and local database storage must be isolated between profiles (e.g. logging into ChatGPT should not expose/leak information toClaude or other browser activities). In addition, security boundaries are required to restrict web navigation to matching allowed domain rules.

## Decision

We implemented the following features for the secure Web AI platform:
1. **Durable Profile Configs (`web-ai.json`)**:
   - Web AI profiles can be customized with Name, Default URL, User Agent, Partition, and Allowed navigation rules.
   - Defaults are populated for ChatGPT, Claude, and Gemini when config is absent.
2. **Session Segregation via custom partitions**:
   - When spawning a profile webview window, we configure a custom `.data_directory` pointed to `~/.ai-cli-manager/web-ai-profiles/<partition>`. This forces WebView2 to generate and manage segregated cookies and localStorage directories per partition.
3. **Restricting Navigation Boundaries**:
   - Registered a callback closure using `.on_navigation(...)` on the window builder. The callback parses the destination URL string, compares it against the profile's allowed domain match patterns, and returns `false` to block navigation if a disallowed site is visited.
4. **Settings Panel Integrations**:
   - Added advanced settings editor collapsible details for each profile where users modify Partition, Default URL, User Agent, and navigation rules list.
   - Added a "Clear All" button invoking a command that deletes all profiles directories under `web-ai-profiles/` to reset cache and cookie databases instantly.
5. **Mythical Pet Click Routing**:
   - Clicking on the floating mythical pet collapses the left rail sidebar, changes `activeMainView` to `'web-ai'`, and auto-launches the preferred default profile.

## Alternatives Considered

1. **Embedding WebViews inside the main viewport (iframe or child layout)**: Rejected. Docking child webviews dynamically inside the main Tauri window is extremely complex to align on resize across platforms and leads to visual glitches on Windows. Spawning dedicated child windows with close/hide buttons is visually premium and highly robust.

## Consequences

Positive:
- Full session isolation: users can safely log into separate assistant profiles without session collision.
- Secure domain control: prevents the child browser windows from navigating to arbitrary/phishing/unrelated addresses.
- Auto-routing triggers dynamic, interactive pet animations and switches views cleanly.
