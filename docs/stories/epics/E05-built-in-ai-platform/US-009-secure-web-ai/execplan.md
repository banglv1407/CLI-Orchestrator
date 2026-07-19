# Execution Plan

## Implementation Phases

### Phase 1: Rust Configuration Loader (`web_ai_config.rs`)
- Create `src-tauri/src/core/web_ai_config.rs` defining:
  - `WebAiProfile`: struct containing `id`, `name`, `userAgent`, `partition`, `defaultUrl`, `allowNavigationRules`.
  - `WebAiConfig`: struct containing `profiles` list and `preferredProfileId`.
- Add `load` and `save` helpers pointing to `~/.ai-cli-manager/web-ai.json`.
- Populate defaults:
  - **ChatGPT**: `https://chatgpt.com`, partition `"chatgpt"`, allowed rules: `["chatgpt.com", "openai.com"]`.
  - **Claude**: `https://claude.ai`, partition `"claude"`, allowed rules: `["claude.ai", "anthropic.com"]`.
  - **Gemini**: `https://gemini.google.com`, partition `"gemini"`, allowed rules: `["gemini.google.com", "google.com", "googleusercontent.com"]`.

### Phase 2: Rust Spawning Command (`web_ai_commands.rs`)
- Create `src-tauri/src/commands/web_ai_commands.rs` containing:
  - `web_ai_spawn_profile(app: tauri::AppHandle, profile: WebAiProfile)`:
    - If a window named `"web-ai-viewer"` already exists, close/destroy it or load the new URL.
    - Build a new `tauri::WebviewWindowBuilder` named `"web-ai-viewer"`.
    - Configure custom data directory: `~/.ai-cli-manager/web-ai-profiles/<partition>`.
    - Set the custom User Agent on the builder.
    - Set `on_navigation` hook with domain rule matches. If disallowed, block it.

### Phase 3: Register commands
- Register new commands in `src-tauri/src/main.rs`.
- Register the new module `web_ai_config` in `src-tauri/src/core/mod.rs`.

### Phase 4: Frontend Settings Integration
- Update TypeScript types in `src/types.ts`.
- In `SettingsPanel.tsx` (Web AI Tab):
  - Allow adding, editing, and deleting profiles.
  - Allow editing default URL, allowed domain rules (as comma-separated values), and user agent.
  - Allow selecting the preferred default profile.

### Phase 5: In-App WebView Selector & Pet Click
- Update `WebAiPanel.tsx`:
  - Fetch profiles list and display as a side panel.
  - Button to "Open secure browser window".
  - Auto-open the preferred default profile on mount.
- Wire mythical pet click to route to `'web-ai'` and load the preferred profile.
