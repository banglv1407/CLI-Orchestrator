# Design

## Configuration Schema

File `~/.ai-cli-manager/web-ai.json`:
```json
{
  "profiles": [
    {
      "id": "chatgpt-uuid",
      "name": "ChatGPT",
      "userAgent": "Mozilla/5.0 ...",
      "partition": "chatgpt",
      "defaultUrl": "https://chatgpt.com",
      "allowNavigationRules": ["*chatgpt.com*", "*openai.com*"]
    }
  ],
  "preferredProfileId": "chatgpt-uuid"
}
```

## Tauri Commands

### `web_ai_spawn_profile(id: String, url: String, partition: String, rules: Vec<String>) -> Result<(), String>`
Spawns a child `WebviewWindow` named `web-ai-viewer`:
- Sets `.data_directory` to `~/.ai-cli-manager/web-ai-profiles/<partition>`.
- Hook `.on_navigation` to inspect the targeted URL. Compare it against `rules` (using glob matching). If it does not match, return `false` to block navigation.

### `web_ai_load_profiles() -> Result<WebAiConfig, String>`
Loads custom profiles from `web-ai.json`. If the file doesn't exist, it creates a default configuration containing ChatGPT, Claude, and Gemini with standard rules.

### `web_ai_save_profiles(config: WebAiConfig) -> Result<(), String>`
Saves the updated configuration to `web-ai.json`.

## Domain Filtering Logic

Using the `wildmatch` crate or a simple string matching mechanism (e.g. converting globs to simple substring contains/match rules):
```rust
fn is_url_allowed(url: &str, rules: &[String]) -> bool {
    // Check if the URL matches any of the glob-like rules
    for rule in rules {
        let pattern = rule.replace("*", "");
        if url.contains(&pattern) {
            return true;
        }
    }
    false
}
```
This is simple, requires no external dependencies (like `wildmatch`), and is highly performant and secure.

## Frontend UI Components

- **`WebAiPanel.tsx`**: Renders a list of profiles on a sidebar. When a profile is clicked, it calls `web_ai_spawn_profile` to open/spawn the isolated browser window.
- **`SettingsPanel.tsx` (Web AI Tab)**: Allows configuring custom profiles, editing user agents, URLs, and allowed domains list.
