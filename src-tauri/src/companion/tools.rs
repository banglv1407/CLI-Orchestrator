// ── Companion tool definitions and execution ────────────────────
use crate::companion::manager::{CompanionManager, ToolDef, ToolRisk};

impl CompanionManager {
    /// Full v1 tool set: read, navigation, proxy, CLI, session, SSH/RDP, Quick Apps.
    pub fn v1_tools(&self) -> Vec<ToolDef> {
        vec![
            // ── Help & navigation ──────────────────────────────
            ToolDef {
                name: "app.search_help".into(),
                description: "Search the feature catalog for help about a feature, view, or capability.".into(),
                parameters: serde_json::json!({"type":"object","properties":{"query":{"type":"string"}},"required":["query"]}),
                risk: ToolRisk::None,
            },
            ToolDef {
                name: "app.get_context".into(),
                description: "Get current app state: active view, selected CLI, workspace, running proxy, configured profiles.".into(),
                parameters: serde_json::json!({"type":"object","properties":{}}),
                risk: ToolRisk::Read,
            },
            ToolDef {
                name: "app.open_view".into(),
                description: "Open a view: terminal, quickapps, apiclient, proxy, logs, remote, dashboard, web-ai, settings.".into(),
                parameters: serde_json::json!({"type":"object","properties":{"view_id":{"type":"string","enum":["terminal","quickapps","apiclient","proxy","logs","remote","dashboard","web-ai","settings"]}},"required":["view_id"]}),
                risk: ToolRisk::None,
            },
            ToolDef {
                name: "app.open_settings".into(),
                description: "Open a Settings section.".into(),
                parameters: serde_json::json!({"type":"object","properties":{"section":{"type":"string","enum":["appearance","mythical-pet","ai-companion","local-llm","web-ai","navigation"]}},"required":["section"]}),
                risk: ToolRisk::None,
            },
            // ── CliProxyAI ─────────────────────────────────────
            ToolDef {
                name: "proxy.get_status".into(),
                description: "Check if CliProxyAI is running: port, active backends, request count.".into(),
                parameters: serde_json::json!({"type":"object","properties":{}}),
                risk: ToolRisk::Read,
            },
            ToolDef {
                name: "proxy.list_backends".into(),
                description: "List all configured proxy backends with names, URLs, models, and weights.".into(),
                parameters: serde_json::json!({"type":"object","properties":{}}),
                risk: ToolRisk::Read,
            },
            ToolDef {
                name: "proxy.start".into(),
                description: "Start CliProxyAI on configured port. Requires at least one valid backend.".into(),
                parameters: serde_json::json!({"type":"object","properties":{}}),
                risk: ToolRisk::None,
            },
            ToolDef {
                name: "proxy.stop".into(),
                description: "Stop the running CliProxyAI server. REQUIRES USER APPROVAL.".into(),
                parameters: serde_json::json!({"type":"object","properties":{}}),
                risk: ToolRisk::Stop,
            },
            ToolDef {
                name: "proxy.upsert_backend".into(),
                description: "Add or update a proxy backend. REQUIRES USER APPROVAL. Fields: name, url, apiKey, model, weight (default 1), maxRetries (default 2).".into(),
                parameters: serde_json::json!({"type":"object","properties":{"name":{"type":"string"},"url":{"type":"string"},"apiKey":{"type":"string"},"model":{"type":"string"},"weight":{"type":"integer","default":1},"maxRetries":{"type":"integer","default":2}},"required":["name","url","model"]}),
                risk: ToolRisk::ConfigWrite,
            },
            ToolDef {
                name: "proxy.delete_backend".into(),
                description: "Delete a backend by name. REQUIRES USER APPROVAL. Cannot be undone.".into(),
                parameters: serde_json::json!({"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}),
                risk: ToolRisk::Delete,
            },
            // ── CLI profiles ───────────────────────────────────
            ToolDef {
                name: "cli.list_profiles".into(),
                description: "List all registered CLI profiles with commands and working directories.".into(),
                parameters: serde_json::json!({"type":"object","properties":{}}),
                risk: ToolRisk::Read,
            },
            ToolDef {
                name: "cli.list_workspaces".into(),
                description: "List saved workspace/project tags with their paths.".into(),
                parameters: serde_json::json!({"type":"object","properties":{}}),
                risk: ToolRisk::Read,
            },
            ToolDef {
                name: "cli.upsert_profile".into(),
                description: "Add or edit a CLI profile. REQUIRES USER APPROVAL. Fields: name, command, args (optional), defaultWorkingDir (optional).".into(),
                parameters: serde_json::json!({"type":"object","properties":{"name":{"type":"string"},"command":{"type":"string"},"args":{"type":"array","items":{"type":"string"}},"defaultWorkingDir":{"type":"string"}},"required":["name","command"]}),
                risk: ToolRisk::ConfigWrite,
            },
            ToolDef {
                name: "cli.delete_profile".into(),
                description: "Delete a CLI profile by name. REQUIRES USER APPROVAL. Cannot be undone.".into(),
                parameters: serde_json::json!({"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}),
                risk: ToolRisk::Delete,
            },
            // ── Terminal sessions ──────────────────────────────
            ToolDef {
                name: "session.list".into(),
                description: "List all active terminal sessions with IDs, CLI names, status, and working directories.".into(),
                parameters: serde_json::json!({"type":"object","properties":{}}),
                risk: ToolRisk::Read,
            },
            ToolDef {
                name: "session.start".into(),
                description: "Start a new terminal session for a CLI profile in a workspace directory. Returns session ID.".into(),
                parameters: serde_json::json!({"type":"object","properties":{"cliName":{"type":"string"},"workingDir":{"type":"string"},"projectTag":{"type":"string"}},"required":["cliName","workingDir"]}),
                risk: ToolRisk::None,
            },
            ToolDef {
                name: "session.focus".into(),
                description: "Focus an existing terminal session by ID.".into(),
                parameters: serde_json::json!({"type":"object","properties":{"sessionId":{"type":"string"}},"required":["sessionId"]}),
                risk: ToolRisk::None,
            },
            ToolDef {
                name: "session.stop".into(),
                description: "Stop a terminal session by ID. REQUIRES USER APPROVAL.".into(),
                parameters: serde_json::json!({"type":"object","properties":{"sessionId":{"type":"string"}},"required":["sessionId"]}),
                risk: ToolRisk::Stop,
            },
            // ── SSH/RDP profiles ───────────────────────────────
            ToolDef {
                name: "remote.list_profiles".into(),
                description: "List all SSH/RDP connection profiles.".into(),
                parameters: serde_json::json!({"type":"object","properties":{}}),
                risk: ToolRisk::Read,
            },
            ToolDef {
                name: "remote.upsert_profile".into(),
                description: "Add or edit SSH/RDP profile. REQUIRES USER APPROVAL.".into(),
                parameters: serde_json::json!({"type":"object","properties":{"name":{"type":"string"},"host":{"type":"string"},"port":{"type":"integer","default":22},"user":{"type":"string"},"authMode":{"type":"string","enum":["password","key"]},"protocol":{"type":"string","enum":["ssh","rdp"]}},"required":["name","host","user"]}),
                risk: ToolRisk::ConfigWrite,
            },
            ToolDef {
                name: "remote.delete_profile".into(),
                description: "Delete an SSH/RDP profile. REQUIRES USER APPROVAL.".into(),
                parameters: serde_json::json!({"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}),
                risk: ToolRisk::Delete,
            },
            ToolDef {
                name: "remote.connect".into(),
                description: "Connect to an existing SSH/RDP profile by name.".into(),
                parameters: serde_json::json!({"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}),
                risk: ToolRisk::None,
            },
            // ── Quick Apps ─────────────────────────────────────
            ToolDef {
                name: "quickapp.list".into(),
                description: "List all registered Quick Apps.".into(),
                parameters: serde_json::json!({"type":"object","properties":{}}),
                risk: ToolRisk::Read,
            },
            ToolDef {
                name: "quickapp.upsert".into(),
                description: "Add or edit a Quick App. REQUIRES USER APPROVAL.".into(),
                parameters: serde_json::json!({"type":"object","properties":{"name":{"type":"string"},"command":{"type":"string"},"args":{"type":"array","items":{"type":"string"}},"workingDir":{"type":"string"}},"required":["name","command"]}),
                risk: ToolRisk::ConfigWrite,
            },
            ToolDef {
                name: "quickapp.delete".into(),
                description: "Delete a Quick App. REQUIRES USER APPROVAL.".into(),
                parameters: serde_json::json!({"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}),
                risk: ToolRisk::Delete,
            },
            ToolDef {
                name: "quickapp.launch".into(),
                description: "Launch a Quick App by name.".into(),
                parameters: serde_json::json!({"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}),
                risk: ToolRisk::None,
            },
        ]
    }
}
