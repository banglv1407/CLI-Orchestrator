use serde::{Deserialize, Serialize};

/// One feature entry in the companion capability catalog.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FeatureEntry {
    pub feature_id: String,
    pub title: String,
    pub aliases: Vec<String>,
    pub summary: String,
    pub help: String,
    pub availability: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub view_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub settings_section: Option<String>,
    pub backend_commands: Vec<String>,
    pub tool_exposure: ToolExposure,
    pub limitations: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "kebab-case")]
pub enum ToolExposure {
    KnowledgeOnly,
    ReadTool,
    ActionTool,
    Unavailable,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Catalog {
    pub version: String,
    pub features: Vec<FeatureEntry>,
}

impl Catalog {
    /// Load the catalog from the embedded JSON file.
    pub fn load() -> Result<Self, String> {
        let json = include_str!("catalog.json");
        serde_json::from_str(json).map_err(|e| format!("Failed to parse catalog: {}", e))
    }

    /// Find a feature by its exact feature_id.
    pub fn find_by_id(&self, id: &str) -> Option<&FeatureEntry> {
        self.features.iter().find(|f| f.feature_id == id)
    }

    /// Search features by alias or title (case-insensitive).
    pub fn search(&self, query: &str) -> Vec<&FeatureEntry> {
        let q = query.to_lowercase();
        self.features
            .iter()
            .filter(|f| {
                f.feature_id.to_lowercase().contains(&q)
                    || f.title.to_lowercase().contains(&q)
                    || f.aliases.iter().any(|a| a.to_lowercase().contains(&q))
            })
            .collect()
    }

    /// Build a compact feature index string for the model context.
    pub fn compact_index(&self) -> String {
        let mut idx = String::from("Available features in CLX:\n");
        for f in &self.features {
            idx.push_str(&format!(
                "- {}: {} ({})\n",
                f.feature_id,
                f.title,
                f.tool_exposure_label()
            ));
        }
        idx
    }

    /// Get detailed context for a set of feature IDs.
    #[allow(dead_code)]
    pub fn detailed_context(&self, ids: &[&str]) -> String {
        let mut ctx = String::new();
        for id in ids {
            if let Some(f) = self.find_by_id(id) {
                let limitations = if f.limitations.is_empty() {
                    "None".to_string()
                } else {
                    f.limitations.join(", ")
                };
                ctx.push_str(&format!(
                    "--- {} ---\n{}\nHow to open: {}\nAvailability: {}\nLimitations: {}\n\n",
                    f.title,
                    f.help,
                    f.open_instruction(),
                    f.availability,
                    limitations
                ));
            }
        }
        ctx
    }
}

impl FeatureEntry {
    pub fn tool_exposure_label(&self) -> &'static str {
        match self.tool_exposure {
            ToolExposure::KnowledgeOnly => "Q&A only",
            ToolExposure::ReadTool => "read-only tool",
            ToolExposure::ActionTool => "action tool",
            ToolExposure::Unavailable => "unavailable",
        }
    }

    pub fn open_instruction(&self) -> String {
        if let Some(ref view_id) = self.view_id {
            format!("Open via Activity Bar → {}", view_id)
        } else if let Some(ref section) = self.settings_section {
            format!("Settings → {}", section)
        } else if !self.backend_commands.is_empty() {
            "Available via Command Palette (Ctrl+P)".to_string()
        } else {
            "Always available".to_string()
        }
    }
}
