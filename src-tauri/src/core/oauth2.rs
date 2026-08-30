use axum::{extract::{Query, State}, response::Html, routing::get, Router};
use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine as _};
use rand::RngExt;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::{collections::HashMap, sync::Arc, time::{SystemTime, UNIX_EPOCH}};
use tokio::sync::Mutex;
use tokio_util::sync::CancellationToken;

use crate::core::proxy_server::ProxyBackend;

pub const OAUTH_REDIRECT_URI: &str = "http://127.0.0.1:9877/oauth/callback";
const VAULT_PREFIX: &str = "clx.proxy.oauth2.";

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct OAuthConnectionStatus {
    pub backend_id: String,
    pub connected: bool,
    pub connecting: bool,
    pub expires_at: Option<u64>,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct OAuthConnectStart { pub authorization_url: String }

#[derive(Clone)]
struct Pending {
    backend: ProxyBackend,
    state: String,
    verifier: String,
    cancel: CancellationToken,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Tokens {
    access_token: String,
    refresh_token: Option<String>,
    expires_at: Option<u64>,
}

#[derive(Default)]
pub struct OAuthManager {
    pending: Mutex<Option<Pending>>,
    fallback: std::sync::Mutex<HashMap<String, String>>,
    errors: Mutex<HashMap<String, String>>,
}

impl OAuthManager {
    pub async fn start(self: &Arc<Self>, backend: ProxyBackend) -> Result<OAuthConnectStart, String> {
        validate_oauth_config(&backend)?;
        let config = backend.oauth2.as_ref().ok_or("OAuth2 settings are missing")?;
        let state = random_urlsafe(32);
        let verifier = random_urlsafe(64);
        let challenge = URL_SAFE_NO_PAD.encode(Sha256::digest(verifier.as_bytes()));
        let cancel = CancellationToken::new();
        {
            let mut pending = self.pending.lock().await;
            if pending.is_some() { return Err("An OAuth login is already in progress".into()); }
            *pending = Some(Pending { backend: backend.clone(), state: state.clone(), verifier, cancel: cancel.clone() });
        }
        let manager = self.clone();
        let listener = tokio::net::TcpListener::bind("127.0.0.1:9877").await
            .map_err(|e| format!("Cannot start OAuth callback on port 9877: {e}"))?;
        let cancel_for_spawn = cancel.clone();
        tokio::spawn(async move {
            let app = Router::new().route("/oauth/callback", get(oauth_callback)).with_state(manager);
            let _ = axum::serve(listener, app).with_graceful_shutdown(async move { cancel_for_spawn.cancelled().await }).await;
        });
        let mut url = reqwest::Url::parse(&config.authorization_url)
            .map_err(|_| "OAuth authorization URL is invalid".to_string())?;
        {
            let mut q = url.query_pairs_mut();
            q.append_pair("response_type", "code");
            q.append_pair("client_id", &config.client_id);
            q.append_pair("redirect_uri", OAUTH_REDIRECT_URI);
            q.append_pair("state", &state);
            q.append_pair("code_challenge", &challenge);
            q.append_pair("code_challenge_method", "S256");
            if !config.scopes.is_empty() { q.append_pair("scope", &config.scopes.join(" ")); }
            if let Some(audience) = &config.audience { q.append_pair("audience", audience); }
        }
        let authorization_url: String = url.to_string();
        open_browser(&authorization_url);
        Ok(OAuthConnectStart { authorization_url })
    }

    pub async fn cancel(&self, backend_id: &str) {
        let mut pending = self.pending.lock().await;
        if pending.as_ref().and_then(|p| p.backend.id.as_deref()) == Some(backend_id) {
            if let Some(item) = pending.take() { item.cancel.cancel(); }
        }
    }

    pub async fn disconnect(&self, backend_id: &str) {
        self.cancel(backend_id).await;
        self.delete(backend_id);
        self.errors.lock().await.remove(backend_id);
    }

    pub async fn status(&self, backend_id: &str) -> OAuthConnectionStatus {
        let connecting = self.pending.lock().await.as_ref()
            .and_then(|p| p.backend.id.as_deref()) == Some(backend_id);
        let token = self.load(backend_id).ok().flatten();
        OAuthConnectionStatus {
            backend_id: backend_id.to_string(),
            connected: token.as_ref().map(|t| !t.access_token.is_empty()).unwrap_or(false),
            connecting,
            expires_at: token.and_then(|t| t.expires_at),
            error: self.errors.lock().await.get(backend_id).cloned(),
        }
    }

    pub async fn access_token(&self, backend: &ProxyBackend) -> Result<String, String> {
        validate_oauth_config(backend)?;
        let id = backend.id.as_deref().ok_or("OAuth backend is missing an id")?;
        let token = self.load(id)?.ok_or_else(|| format!("OAuth backend '{}' is not connected", backend.name))?;
        if token.expires_at.map(|v| v > now() + 60).unwrap_or(true) { return Ok(token.access_token); }
        let refresh = token.refresh_token.ok_or("OAuth access token expired; reconnect the backend")?;
        let config = backend.oauth2.as_ref().ok_or("OAuth2 settings are missing")?;
        let response = reqwest::Client::new().post(&config.token_url)
            .form(&[("grant_type", "refresh_token"), ("refresh_token", refresh.as_str()), ("client_id", config.client_id.as_str())])
            .send().await.map_err(|e| format!("OAuth refresh failed: {e}"))?;
        if !response.status().is_success() { return Err(format!("OAuth refresh was rejected ({})", response.status())); }
        let received: TokenResponse = response.json().await.map_err(|e| format!("OAuth refresh response was invalid: {e}"))?;
        let refreshed = Tokens { access_token: received.access_token, refresh_token: received.refresh_token.or(Some(refresh)), expires_at: received.expires_in.map(|v| now() + v) };
        self.save(id, &refreshed)?;
        Ok(refreshed.access_token)
    }

    pub async fn known_secrets(&self) -> Vec<String> {
        self.fallback.lock().ok().map(|v| v.values().cloned().collect()).unwrap_or_default()
    }

    async fn finish(&self, code: String, received_state: String) -> Result<(), String> {
        let pending = self.pending.lock().await.take().ok_or("OAuth login is no longer active")?;
        if pending.state != received_state { pending.cancel.cancel(); return Err("OAuth state did not match".into()); }
        let id = pending.backend.id.clone().ok_or("OAuth backend is missing an id")?;
        let config = pending.backend.oauth2.as_ref().ok_or("OAuth2 settings are missing")?;
        let response = reqwest::Client::new().post(&config.token_url).form(&[
            ("grant_type", "authorization_code"), ("code", code.as_str()), ("redirect_uri", OAUTH_REDIRECT_URI),
            ("client_id", config.client_id.as_str()), ("code_verifier", pending.verifier.as_str()),
        ]).send().await.map_err(|e| format!("OAuth exchange failed: {e}"))?;
        if !response.status().is_success() { pending.cancel.cancel(); return Err(format!("OAuth exchange was rejected ({})", response.status())); }
        let received: TokenResponse = response.json().await.map_err(|e| format!("OAuth token response was invalid: {e}"))?;
        self.save(&id, &Tokens { access_token: received.access_token, refresh_token: received.refresh_token, expires_at: received.expires_in.map(|v| now() + v) })?;
        pending.cancel.cancel();
        self.errors.lock().await.remove(&id);
        Ok(())
    }

    fn load(&self, id: &str) -> Result<Option<Tokens>, String> {
        self.read_raw(id)?.map(|v| serde_json::from_str(&v).map_err(|e| format!("Stored OAuth credential is invalid: {e}"))).transpose()
    }
    fn save(&self, id: &str, tokens: &Tokens) -> Result<(), String> {
        self.write_raw(id, &serde_json::to_string(tokens).map_err(|e| e.to_string())?)
    }
    fn delete(&self, id: &str) {
        #[cfg(target_os = "windows")] { let _ = windows_delete(&vault_key(id)); }
        if let Ok(mut values) = self.fallback.lock() { values.remove(id); }
    }
    fn read_raw(&self, id: &str) -> Result<Option<String>, String> {
        #[cfg(target_os = "windows")] { if let Some(value) = windows_get(&vault_key(id))? { return Ok(Some(value)); } }
        Ok(self.fallback.lock().map_err(|e| e.to_string())?.get(id).cloned())
    }
    fn write_raw(&self, id: &str, value: &str) -> Result<(), String> {
        #[cfg(target_os = "windows")] { if windows_set(&vault_key(id), value).is_ok() { self.fallback.lock().map_err(|e| e.to_string())?.remove(id); return Ok(()); } }
        self.fallback.lock().map_err(|e| e.to_string())?.insert(id.to_string(), value.to_string()); Ok(())
    }
}

#[derive(Deserialize)]
struct TokenResponse { access_token: String, refresh_token: Option<String>, expires_in: Option<u64> }

async fn oauth_callback(State(manager): State<Arc<OAuthManager>>, Query(query): Query<HashMap<String, String>>) -> Html<String> {
    let result = match (query.get("code"), query.get("state"), query.get("error")) {
        (_, _, Some(error)) => Err(format!("Provider returned {error}")),
        (Some(code), Some(state), _) => manager.finish(code.clone(), state.clone()).await,
        _ => Err("OAuth callback is missing code or state".into()),
    };
    match result {
        Ok(()) => Html("<h2>Connected</h2><p>You may close this tab and return to CLX.</p>".into()),
        Err(error) => Html(format!("<h2>Connection failed</h2><p>{}</p>", html_escape(&error))),
    }
}

pub fn validate_oauth_config(backend: &ProxyBackend) -> Result<(), String> {
    if !backend.uses_oauth2() { return Ok(()); }
    let config = backend.oauth2.as_ref().ok_or("OAuth2 settings are required")?;
    for (name, value) in [("authorization URL", &config.authorization_url), ("token URL", &config.token_url), ("client ID", &config.client_id)] {
        if value.trim().is_empty() { return Err(format!("OAuth {name} is required")); }
    }
    if config.redirect_uri != OAUTH_REDIRECT_URI { return Err(format!("OAuth redirect URI must be {OAUTH_REDIRECT_URI}")); }
    Ok(())
}

fn now() -> u64 { SystemTime::now().duration_since(UNIX_EPOCH).unwrap_or_default().as_secs() }
fn vault_key(id: &str) -> String { format!("{VAULT_PREFIX}{id}") }
fn random_urlsafe(count: usize) -> String { let mut bytes = vec![0u8; count]; rand::rng().fill(&mut bytes); URL_SAFE_NO_PAD.encode(bytes) }
fn html_escape(value: &str) -> String { value.replace('&', "&amp;").replace('<', "&lt;").replace('>', "&gt;") }
fn open_browser(url: &str) { #[cfg(target_os = "windows")] { let _ = std::process::Command::new("rundll32.exe").args(["url.dll,FileProtocolHandler", url]).spawn(); } }
#[cfg(target_os = "windows")]
fn wide_null(value: &str) -> Vec<u16> {
    use std::os::windows::ffi::OsStrExt;
    std::ffi::OsStr::new(value).encode_wide().chain(std::iter::once(0)).collect()
}

#[cfg(target_os = "windows")]
fn windows_set(key: &str, secret: &str) -> Result<(), String> {
    use windows_sys::Win32::Security::Credentials::{CredWriteW, CREDENTIALW, CRED_PERSIST_LOCAL_MACHINE, CRED_TYPE_GENERIC};
    let mut target = wide_null(key);
    let mut user = wide_null("CLX OAuth2");
    let mut blob = secret.as_bytes().to_vec();
    let credential = CREDENTIALW { Flags: 0, Type: CRED_TYPE_GENERIC, TargetName: target.as_mut_ptr(), Comment: std::ptr::null_mut(), LastWritten: unsafe { std::mem::zeroed() }, CredentialBlobSize: blob.len() as u32, CredentialBlob: blob.as_mut_ptr(), Persist: CRED_PERSIST_LOCAL_MACHINE, AttributeCount: 0, Attributes: std::ptr::null_mut(), TargetAlias: std::ptr::null_mut(), UserName: user.as_mut_ptr() };
    if unsafe { CredWriteW(&credential, 0) } == 0 { return Err(format!("Windows Credential Manager rejected OAuth credentials: {}", std::io::Error::last_os_error())); }
    Ok(())
}

#[cfg(target_os = "windows")]
fn windows_get(key: &str) -> Result<Option<String>, String> {
    use windows_sys::Win32::Security::Credentials::{CredFree, CredReadW, CREDENTIALW, CRED_TYPE_GENERIC};
    let target = wide_null(key); let mut pointer: *mut CREDENTIALW = std::ptr::null_mut();
    if unsafe { CredReadW(target.as_ptr(), CRED_TYPE_GENERIC, 0, &mut pointer) } == 0 { return Ok(None); }
    if pointer.is_null() { return Ok(None); }
    let credential = unsafe { &*pointer }; let bytes = unsafe { std::slice::from_raw_parts(credential.CredentialBlob, credential.CredentialBlobSize as usize) };
    let result = String::from_utf8(bytes.to_vec()).map(Some).map_err(|e| format!("Stored OAuth credential is not UTF-8: {e}")); unsafe { CredFree(pointer.cast()) }; result
}

#[cfg(target_os = "windows")]
fn windows_delete(key: &str) -> Result<(), String> {
    use windows_sys::Win32::Security::Credentials::{CredDeleteW, CRED_TYPE_GENERIC}; let target = wide_null(key);
    if unsafe { CredDeleteW(target.as_ptr(), CRED_TYPE_GENERIC, 0) } == 0 { let error = std::io::Error::last_os_error(); if error.raw_os_error() != Some(1168) { return Err(format!("Failed to delete OAuth credential: {error}")); } }
    Ok(())
}
