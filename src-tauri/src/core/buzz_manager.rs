use std::sync::Mutex;
use crate::core::buzz_identity;
use crate::core::buzz_types::{
    BuzzAgentConfig, BuzzChannel, BuzzDmResult, BuzzMember, BuzzMessage, BuzzRelayConfig,
    BuzzUserProfile,
};

/// Windows CREATE_NO_WINDOW — spawn buzz.exe without popping a console window.
#[cfg(target_os = "windows")]
const CREATE_NO_WINDOW: u32 = 0x08000000;

pub struct BuzzManager {
    config: Mutex<BuzzRelayConfig>,
    agents: Mutex<Vec<BuzzAgentConfig>>,
}

impl BuzzManager {
    pub fn new() -> Self {
        Self {
            config: Mutex::new(BuzzRelayConfig::default()),
            agents: Mutex::new(Vec::new()),
        }
    }

    pub fn get_config(&self) -> BuzzRelayConfig {
        self.config.lock().unwrap().clone()
    }

    pub fn set_config(&self, cfg: BuzzRelayConfig) {
        *self.config.lock().unwrap() = cfg;
    }

    /// Read the private key from the Windows Credential Manager vault.
    /// Returns None when no identity has been generated/imported yet.
    pub fn identity_key(&self) -> Option<String> {
        buzz_identity::vault_get().ok().flatten()
    }

    /// Spawn a buzz CLI subprocess with the identity key injected into its
    /// environment, run headlessly (no console window on Windows).
    fn buzz_command(&self, relay_url: &str) -> Result<tokio::process::Command, String> {
        let key = self.identity_key().ok_or_else(|| {
            "Buzz identity is not configured. Generate or import an identity first.".to_string()
        })?;
        let mut cmd = tokio::process::Command::new("buzz.exe");
        cmd.env("BUZZ_PRIVATE_KEY", key)
            .env("BUZZ_RELAY_URL", relay_url)
            .args(["--relay", relay_url]);
        #[cfg(target_os = "windows")]
        {
            cmd.creation_flags(CREATE_NO_WINDOW);
        }
        Ok(cmd)
    }

    /// Run a buzz subcommand and return parsed stdout. On CLI failure, surface
    /// the relay/auth error from stderr.
    async fn run_buzz<T>(&self, relay_url: &str, args: &[&str]) -> Result<Vec<u8>, String>
    where
        T: serde::de::DeserializeOwned,
    {
        let mut cmd = self.buzz_command(relay_url)?;
        let output = cmd
            .args(args)
            .output()
            .await
            .map_err(|e| format!("Failed to run buzz CLI: {}", e))?;

        if output.status.success() {
            Ok(output.stdout)
        } else {
            Err(parse_cli_error(&output.stderr))
        }
    }

    pub async fn fetch_channels(&self, relay_url: Option<String>) -> Result<Vec<BuzzChannel>, String> {
        let target_url = relay_url.unwrap_or_else(|| self.get_config().relay_url);
        let stdout = self
            .run_buzz::<Vec<BuzzChannel>>(&target_url, &["channels", "list"])
            .await?;
        serde_json::from_slice::<Vec<BuzzChannel>>(&stdout)
            .map_err(|e| format!("JSON parse error: {}", e))
    }

    pub async fn fetch_messages(&self, channel_id: &str, limit: usize) -> Result<Vec<BuzzMessage>, String> {
        let target_url = self.get_config().relay_url;
        let limit_str = limit.to_string();
        let stdout = self
            .run_buzz::<Vec<BuzzMessage>>(
                &target_url,
                &["messages", "get", "--channel", channel_id, "--limit", &limit_str],
            )
            .await?;
        serde_json::from_slice::<Vec<BuzzMessage>>(&stdout)
            .map_err(|e| format!("JSON parse error: {}", e))
    }

    /// Get the reply thread for a root message.
    pub async fn fetch_thread(
        &self,
        channel_id: &str,
        event_id: &str,
        limit: usize,
    ) -> Result<Vec<BuzzMessage>, String> {
        let target_url = self.get_config().relay_url;
        let limit_str = limit.to_string();
        let stdout = self
            .run_buzz::<Vec<BuzzMessage>>(
                &target_url,
                &[
                    "messages",
                    "thread",
                    "--channel",
                    channel_id,
                    "--event",
                    event_id,
                    "--limit",
                    &limit_str,
                ],
            )
            .await?;
        serde_json::from_slice::<Vec<BuzzMessage>>(&stdout)
            .map_err(|e| format!("JSON parse error: {}", e))
    }

    /// Send a message. `reply_to` creates a thread reply; `mentions` are
    /// pubkeys to explicitly mention (converted to `--mention` flags).
    pub async fn send_message(
        &self,
        channel_id: &str,
        content: &str,
        reply_to: Option<&str>,
        mentions: &[String],
    ) -> Result<String, String> {
        let target_url = self.get_config().relay_url;
        let mut args: Vec<String> = vec![
            "messages".into(),
            "send".into(),
            "--channel".into(),
            channel_id.into(),
            "--content".into(),
            content.into(),
        ];
        if let Some(reply_id) = reply_to {
            if !reply_id.is_empty() {
                args.push("--reply-to".into());
                args.push(reply_id.into());
            }
        }
        for m in mentions {
            if !m.is_empty() {
                args.push("--mention".into());
                args.push(m.clone());
            }
        }

        let args_ref: Vec<&str> = args.iter().map(|s| s.as_str()).collect();
        let stdout = self.run_buzz::<serde_json::Value>(&target_url, &args_ref).await?;
        let res: serde_json::Value = serde_json::from_slice(&stdout).unwrap_or_default();
        Ok(res["event_id"].as_str().unwrap_or("").to_string())
    }

    /// List members of a channel, resolving display names where possible.
    pub async fn list_members(&self, channel_id: &str) -> Result<Vec<BuzzMember>, String> {
        let target_url = self.get_config().relay_url;
        let stdout = self
            .run_buzz::<Vec<BuzzMember>>(
                &target_url,
                &["channels", "members", "--channel", channel_id],
            )
            .await?;

        // The raw shape from `channels members` is [{pubkey, role}].
        let raw: Vec<serde_json::Value> = serde_json::from_slice(&stdout)
            .map_err(|e| format!("JSON parse error: {}", e))?;
        let mut members: Vec<BuzzMember> = raw
            .iter()
            .map(|m| BuzzMember {
                pubkey: m["pubkey"].as_str().unwrap_or("").to_string(),
                role: m["role"].as_str().unwrap_or("").to_string(),
                display_name: None,
                picture: None,
            })
            .collect();

        // Enrich with user profiles (display name + picture) in a single lookup.
        let pubkeys: Vec<&str> = members.iter().map(|m| m.pubkey.as_str()).collect();
        if let Ok(profiles) = self.resolve_users(&pubkeys).await {
            for member in members.iter_mut() {
                if let Some(p) = profiles.iter().find(|p| p.pubkey == member.pubkey) {
                    member.display_name = p
                        .display_name
                        .clone()
                        .or_else(|| p.name.clone());
                    member.picture = p.picture.clone();
                }
            }
        }

        Ok(members)
    }

    /// Resolve user profiles from pubkeys (single `users get` call).
    pub async fn resolve_users(&self, pubkeys: &[&str]) -> Result<Vec<BuzzUserProfile>, String> {
        let target_url = self.get_config().relay_url;
        let mut args: Vec<String> = vec!["users".into(), "get".into()];
        for pk in pubkeys {
            if !pk.is_empty() {
                args.push("--pubkey".into());
                args.push(pk.to_string());
            }
        }
        let args_ref: Vec<&str> = args.iter().map(|s| s.as_str()).collect();
        let stdout = self.run_buzz::<Vec<BuzzUserProfile>>(&target_url, &args_ref).await?;
        serde_json::from_slice::<Vec<BuzzUserProfile>>(&stdout)
            .map_err(|e| format!("JSON parse error: {}", e))
    }

    /// Open a direct message with one or more users; returns the DM channel id.
    pub async fn open_dm(&self, pubkeys: &[String]) -> Result<BuzzDmResult, String> {
        let target_url = self.get_config().relay_url;
        let mut args: Vec<String> = vec!["dms".into(), "open".into()];
        for pk in pubkeys {
            if !pk.is_empty() {
                args.push("--pubkey".into());
                args.push(pk.clone());
            }
        }
        let args_ref: Vec<&str> = args.iter().map(|s| s.as_str()).collect();
        let stdout = self.run_buzz::<serde_json::Value>(&target_url, &args_ref).await?;
        let value: serde_json::Value = serde_json::from_slice(&stdout).unwrap_or_default();
        Ok(BuzzDmResult {
            dm_id: value["dm_id"].as_str().unwrap_or("").to_string(),
            accepted: value["accepted"].as_bool().unwrap_or(false),
            event_id: value["event_id"].as_str().map(|s| s.to_string()),
        })
    }

    pub fn list_agents(&self) -> Vec<BuzzAgentConfig> {
        self.agents.lock().unwrap().clone()
    }

    pub fn add_agent(&self, agent: BuzzAgentConfig) {
        self.agents.lock().unwrap().push(agent);
    }
}

/// Parse the CLI's JSON-on-stderr error shape: `{"error":"<category>","message":"<detail>"}`.
/// Falls back to the raw stderr text when it isn't JSON.
fn parse_cli_error(stderr: &[u8]) -> String {
    let text = String::from_utf8_lossy(stderr).to_string();
    if let Ok(value) = serde_json::from_str::<serde_json::Value>(&text) {
        if let Some(msg) = value.get("message").and_then(|m| m.as_str()) {
            return msg.to_string();
        }
    }
    text
}
