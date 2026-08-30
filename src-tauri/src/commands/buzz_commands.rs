use crate::{
    app_state::AppState,
    core::buzz_identity,
    core::buzz_types::{
        BuzzAgentConfig, BuzzChannel, BuzzDmConversation, BuzzDmResult, BuzzMember, BuzzMessage,
        BuzzRelayConfig, BuzzUserProfile,
    },
};
use tauri::{AppHandle, State};

#[tauri::command]
pub fn buzz_get_config(state: State<'_, AppState>) -> Result<BuzzRelayConfig, String> {
    Ok(state.buzz.get_config())
}

#[tauri::command]
pub fn buzz_set_config(config: BuzzRelayConfig, state: State<'_, AppState>) -> Result<(), String> {
    state.buzz.set_config(config);
    Ok(())
}

#[tauri::command]
pub async fn buzz_list_channels(
    relay_url: Option<String>,
    state: State<'_, AppState>,
) -> Result<Vec<BuzzChannel>, String> {
    state.buzz.fetch_channels(relay_url).await
}

#[tauri::command]
pub async fn buzz_get_messages(
    channel_id: String,
    limit: Option<usize>,
    state: State<'_, AppState>,
) -> Result<Vec<BuzzMessage>, String> {
    state
        .buzz
        .fetch_messages(&channel_id, limit.unwrap_or(20))
        .await
}

#[tauri::command]
pub async fn buzz_get_thread(
    channel_id: String,
    event_id: String,
    limit: Option<usize>,
    state: State<'_, AppState>,
) -> Result<Vec<BuzzMessage>, String> {
    state
        .buzz
        .fetch_thread(&channel_id, &event_id, limit.unwrap_or(50))
        .await
}

#[tauri::command]
pub async fn buzz_send_message(
    channel_id: String,
    content: String,
    reply_to: Option<String>,
    mentions: Option<Vec<String>>,
    state: State<'_, AppState>,
) -> Result<String, String> {
    state
        .buzz
        .send_message(
            &channel_id,
            &content,
            reply_to.as_deref(),
            mentions.as_deref().unwrap_or(&[]),
        )
        .await
}

#[tauri::command]
pub async fn buzz_list_members(
    channel_id: String,
    state: State<'_, AppState>,
) -> Result<Vec<BuzzMember>, String> {
    state.buzz.list_members(&channel_id).await
}

#[tauri::command]
pub async fn buzz_resolve_users(
    pubkeys: Vec<String>,
    state: State<'_, AppState>,
) -> Result<Vec<BuzzUserProfile>, String> {
    let refs: Vec<&str> = pubkeys.iter().map(|s| s.as_str()).collect();
    state.buzz.resolve_users(&refs).await
}

#[tauri::command]
pub async fn buzz_open_dm(
    pubkeys: Vec<String>,
    state: State<'_, AppState>,
) -> Result<BuzzDmResult, String> {
    state.buzz.open_dm(&pubkeys).await
}

#[tauri::command]
pub async fn buzz_list_dms(state: State<'_, AppState>) -> Result<Vec<BuzzDmConversation>, String> {
    state.buzz.fetch_dms().await
}

#[tauri::command]
pub fn buzz_list_agents(state: State<'_, AppState>) -> Result<Vec<BuzzAgentConfig>, String> {
    Ok(state.buzz.list_agents())
}

#[tauri::command]
pub fn buzz_add_agent(agent: BuzzAgentConfig, state: State<'_, AppState>) -> Result<(), String> {
    state.buzz.add_agent(agent);
    Ok(())
}

#[tauri::command]
pub fn buzz_has_identity(state: State<'_, AppState>) -> Result<bool, String> {
    Ok(state.buzz.identity_key().is_some())
}

/// Derive the Nostr public key for the Buzz identity (shared vault with NES).
/// Never returns the private key.
#[tauri::command]
pub fn buzz_get_pubkey() -> Result<String, String> {
    crate::core::nes_identity::derive_pubkey()
}

#[tauri::command]
pub fn buzz_generate_identity(state: State<'_, AppState>) -> Result<String, String> {
    let key = buzz_identity::generate_private_key();
    buzz_identity::vault_set(&key)?;
    // Update the stored pubkey reference in config via a fresh CLI lookup.
    let existing = state.buzz.get_config();
    let _ = state.buzz.set_config(BuzzRelayConfig {
        relay_url: existing.relay_url,
        allow_insecure: existing.allow_insecure,
        identity_pubkey: None,
        proxy: existing.proxy,
    });
    Ok(key)
}

#[tauri::command]
pub fn buzz_import_identity(key: String) -> Result<(), String> {
    let trimmed = key.trim();
    if trimmed.len() != 64 || !trimmed.chars().all(|c| c.is_ascii_hexdigit()) {
        return Err("Invalid private key: expected 64 hex characters".to_string());
    }
    buzz_identity::vault_set(trimmed)
}

#[tauri::command]
pub fn buzz_clear_identity() -> Result<(), String> {
    buzz_identity::vault_delete()
}

#[tauri::command]
pub async fn buzz_set_profile(
    name: String,
    about: Option<String>,
    avatar: Option<String>,
    state: State<'_, AppState>,
) -> Result<(), String> {
    state
        .buzz
        .set_profile(&name, about.as_deref(), avatar.as_deref())
        .await
}

#[tauri::command]
pub async fn buzz_get_my_profile(
    state: State<'_, AppState>,
) -> Result<Option<BuzzUserProfile>, String> {
    state.buzz.get_my_profile().await
}

#[tauri::command]
pub async fn buzz_subscribe_live(
    channel_id: String,
    app: AppHandle,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let relay = state.buzz.get_config().relay_url;
    state.buzz.live().subscribe(app, relay, Some(channel_id));
    Ok(())
}

#[tauri::command]
pub async fn buzz_unsubscribe_live(
    app: AppHandle,
    state: State<'_, AppState>,
) -> Result<(), String> {
    state.buzz.live().subscribe(app, String::new(), None);
    Ok(())
}

#[tauri::command]
pub async fn buzz_live_status(
    state: State<'_, AppState>,
) -> Result<Option<(String, String)>, String> {
    Ok(state.buzz.live().current().await)
}
