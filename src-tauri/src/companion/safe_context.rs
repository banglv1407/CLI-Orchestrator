use serde::{Deserialize, Serialize};

/// Safe application context exposed to the companion model.
/// Must never contain terminal output, file contents, logs,
/// API keys, passwords, or private-key data.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SafeAppContext {
    pub active_view: Option<String>,

    /// Currently selected CLI profile name
    pub selected_cli: Option<String>,

    /// Current workspace path (directory only, no file contents)
    pub workspace_path: Option<String>,

    /// Current project tag
    pub project_tag: Option<String>,

    /// Active terminal session count
    pub active_sessions: usize,

    /// CLI profile names
    pub cli_profiles: Vec<String>,

    /// Configured proxy backend display names
    pub proxy_backend_names: Vec<String>,

    /// Proxy running status (not the port or internal state)
    pub proxy_running: bool,

    /// Proxy port (display only)
    pub proxy_port: Option<u16>,

    /// SSH connection profile names
    pub ssh_profiles: Vec<String>,

    /// Quick App names
    pub quick_apps: Vec<String>,

    /// Whether the built-in LLM is loaded
    pub builtin_llm_loaded: bool,

    /// Whether app actions are enabled for companion
    pub actions_enabled: bool,
}

impl SafeAppContext {
    pub fn empty() -> Self {
        Self {
            active_view: None,
            selected_cli: None,
            workspace_path: None,
            project_tag: None,
            active_sessions: 0,
            cli_profiles: Vec::new(),
            proxy_backend_names: Vec::new(),
            proxy_running: false,
            proxy_port: None,
            ssh_profiles: Vec::new(),
            quick_apps: Vec::new(),
            builtin_llm_loaded: false,
            actions_enabled: false,
        }
    }

    /// Build a human-readable context string for the model.
    pub fn to_prompt_context(&self) -> String {
        let mut ctx = String::from("Current app state:\n");

        if let Some(ref view) = self.active_view {
            ctx.push_str(&format!("- Active view: {}\n", view));
        }
        if let Some(ref cli) = self.selected_cli {
            ctx.push_str(&format!("- Selected CLI: {}\n", cli));
        }
        if let Some(ref dir) = self.workspace_path {
            ctx.push_str(&format!("- Workspace: {}\n", dir));
        }
        if let Some(ref tag) = self.project_tag {
            ctx.push_str(&format!("- Project tag: {}\n", tag));
        }
        ctx.push_str(&format!("- Active sessions: {}\n", self.active_sessions));

        if !self.cli_profiles.is_empty() {
            ctx.push_str(&format!(
                "- CLI profiles: {}\n",
                self.cli_profiles.join(", ")
            ));
        }
        if !self.proxy_backend_names.is_empty() {
            ctx.push_str(&format!(
                "- Proxy backends: {}\n",
                self.proxy_backend_names.join(", ")
            ));
        }
        ctx.push_str(&format!("- CliProxyAI running: {}\n", self.proxy_running));
        if let Some(port) = self.proxy_port {
            ctx.push_str(&format!("- Proxy port: {}\n", port));
        }
        if !self.ssh_profiles.is_empty() {
            ctx.push_str(&format!(
                "- SSH profiles: {}\n",
                self.ssh_profiles.join(", ")
            ));
        }
        if !self.quick_apps.is_empty() {
            ctx.push_str(&format!("- Quick Apps: {}\n", self.quick_apps.join(", ")));
        }
        ctx.push_str(&format!(
            "- Built-in LLM loaded: {}\n",
            self.builtin_llm_loaded
        ));
        ctx.push_str(&format!(
            "- App Actions enabled: {}\n",
            self.actions_enabled
        ));

        ctx
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_context_is_machine_readable() {
        let ctx = SafeAppContext::empty();
        let json = serde_json::to_string(&ctx).unwrap();
        assert!(json.contains("activeView"));
    }

    #[test]
    fn context_excludes_file_contents() {
        let ctx = SafeAppContext {
            workspace_path: Some("/home/user/project".to_string()),
            ..SafeAppContext::empty()
        };
        let prompt = ctx.to_prompt_context();
        // Must not contain any terminal output patterns
        assert!(!prompt.contains("stdout"));
        assert!(!prompt.contains("file content"));
        assert!(!prompt.contains("password"));
    }

    #[test]
    fn context_excludes_secrets() {
        let ctx = SafeAppContext::empty();
        let json = serde_json::to_string(&ctx).unwrap();
        assert!(!json.contains("apiKey"));
        assert!(!json.contains("password"));
        assert!(!json.contains("secret"));
        assert!(!json.contains("token"));
    }

    #[test]
    fn prompt_context_does_not_leak_internal_state() {
        let ctx = SafeAppContext {
            proxy_running: true,
            proxy_port: Some(8080),
            ..SafeAppContext::empty()
        };
        let prompt = ctx.to_prompt_context();
        // Must not leak internal struct field names
        assert!(!prompt.contains("backend_url"));
        assert!(!prompt.contains("api_key"));
    }
}
