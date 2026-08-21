use std::{
    collections::HashMap,
    path::{Path, PathBuf},
    sync::Arc,
    time::Duration,
};

use clx_ssh_client::{client, ChannelMsg};
use serde::{Deserialize, Serialize};
use tokio::sync::{Mutex, RwLock};
use tokio_util::sync::CancellationToken;
use zeroize::Zeroize;

const STORE_VERSION: u32 = 1;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MonitorConfig {
    pub id: String,
    pub label: String,
    pub service_port: u16,
    pub target_type: String,
    #[serde(default)]
    pub target: Option<SshHop>,
    #[serde(default)]
    pub jump: Option<SshHop>,
    #[serde(default = "default_target_os")]
    pub target_os: String,
    #[serde(default)]
    pub log_source: LogSourceConfig,
    #[serde(default)]
    pub legacy_imported: bool,
}

fn default_target_os() -> String {
    "auto".to_string()
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SshHop {
    pub host: String,
    #[serde(default = "default_ssh_port")]
    pub ssh_port: u16,
    pub user: String,
    #[serde(default = "default_auth_mode")]
    pub auth_mode: String,
    #[serde(default)]
    pub key_path: Option<String>,
    #[serde(default)]
    pub has_secret: bool,
}

fn default_ssh_port() -> u16 {
    22
}

fn default_auth_mode() -> String {
    "password".to_string()
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LogSourceConfig {
    #[serde(default = "default_log_kind")]
    pub kind: String,
    #[serde(default)]
    pub path: Option<String>,
    #[serde(default)]
    pub unit: Option<String>,
    #[serde(default)]
    pub engine: Option<String>,
    #[serde(default)]
    pub container: Option<String>,
    #[serde(default)]
    pub log_name: Option<String>,
    #[serde(default)]
    pub provider: Option<String>,
    #[serde(default)]
    pub command: Option<String>,
    #[serde(default)]
    pub shell: Option<String>,
}

fn default_log_kind() -> String {
    "auto".to_string()
}

impl Default for LogSourceConfig {
    fn default() -> Self {
        Self {
            kind: default_log_kind(),
            path: None,
            unit: None,
            engine: None,
            container: None,
            log_name: None,
            provider: None,
            command: None,
            shell: None,
        }
    }
}

#[derive(Clone, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MonitorSecrets {
    #[serde(default)]
    pub target_secret: Option<String>,
    #[serde(default)]
    pub jump_secret: Option<String>,
    #[serde(default)]
    pub clear_target_secret: bool,
    #[serde(default)]
    pub clear_jump_secret: bool,
}

impl Drop for MonitorSecrets {
    fn drop(&mut self) {
        if let Some(secret) = self.target_secret.as_mut() {
            secret.zeroize();
        }
        if let Some(secret) = self.jump_secret.as_mut() {
            secret.zeroize();
        }
    }
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MonitorSaveResult {
    pub monitor: MonitorConfig,
    pub vault_persistent: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct MonitorStore {
    version: u32,
    #[serde(default)]
    monitors: Vec<MonitorConfig>,
}

impl Default for MonitorStore {
    fn default() -> Self {
        Self {
            version: STORE_VERSION,
            monitors: Vec::new(),
        }
    }
}

pub struct MonitorManager {
    store_path: PathBuf,
    store: RwLock<MonitorStore>,
    vault: SecretVault,
    streams: Mutex<HashMap<String, CancellationToken>>,
    os_cache: Mutex<HashMap<String, String>>,
}

impl MonitorManager {
    pub fn new(data_root: PathBuf) -> Result<Self, String> {
        std::fs::create_dir_all(&data_root)
            .map_err(|error| format!("Failed to create monitoring data directory: {error}"))?;
        let store_path = data_root.join("monitoring.json");
        let store = if store_path.exists() {
            let raw = std::fs::read_to_string(&store_path)
                .map_err(|error| format!("Failed to read monitoring config: {error}"))?;
            let parsed: MonitorStore = serde_json::from_str(&raw)
                .map_err(|error| format!("Failed to parse monitoring config: {error}"))?;
            if parsed.version > STORE_VERSION {
                return Err(format!(
                    "Monitoring config version {} is newer than supported version {}",
                    parsed.version, STORE_VERSION
                ));
            }
            parsed
        } else {
            MonitorStore::default()
        };

        Ok(Self {
            store_path,
            store: RwLock::new(store),
            vault: SecretVault::default(),
            streams: Mutex::new(HashMap::new()),
            os_cache: Mutex::new(HashMap::new()),
        })
    }

    pub async fn list(&self) -> Vec<MonitorConfig> {
        let mut monitors = self.store.read().await.monitors.clone();
        for monitor in &mut monitors {
            if let Some(target) = monitor.target.as_mut() {
                target.has_secret = self.vault.get(&secret_key(&monitor.id, "target")).is_some();
            }
            if let Some(jump) = monitor.jump.as_mut() {
                jump.has_secret = self.vault.get(&secret_key(&monitor.id, "jump")).is_some();
            }
        }
        monitors
    }

    pub async fn get(&self, id: &str) -> Option<MonitorConfig> {
        self.store
            .read()
            .await
            .monitors
            .iter()
            .find(|monitor| monitor.id == id)
            .cloned()
    }

    pub async fn upsert(
        &self,
        mut monitor: MonitorConfig,
        mut secrets: MonitorSecrets,
    ) -> Result<MonitorSaveResult, String> {
        if monitor.id.trim().is_empty() {
            monitor.id = uuid::Uuid::new_v4().to_string();
        }
        normalize_and_validate(&mut monitor)?;

        let previous = self.get(&monitor.id).await;
        if monitor.target_type == "local" {
            secrets.clear_target_secret = true;
            secrets.clear_jump_secret = true;
        } else {
            if monitor.jump.is_none() {
                secrets.clear_jump_secret = true;
            }
            if secrets.target_secret.is_none()
                && previous
                    .as_ref()
                    .and_then(|value| value.target.as_ref())
                    .zip(monitor.target.as_ref())
                    .is_some_and(|(old, new)| old.auth_mode != new.auth_mode)
            {
                secrets.clear_target_secret = true;
            }
            if secrets.jump_secret.is_none()
                && previous
                    .as_ref()
                    .and_then(|value| value.jump.as_ref())
                    .zip(monitor.jump.as_ref())
                    .is_some_and(|(old, new)| old.auth_mode != new.auth_mode)
            {
                secrets.clear_jump_secret = true;
            }
        }

        let mut persistent = cfg!(target_os = "windows");
        let target_key = secret_key(&monitor.id, "target");
        let jump_key = secret_key(&monitor.id, "jump");

        if secrets.clear_target_secret {
            self.vault.delete(&target_key);
        } else if let Some(secret) = secrets.target_secret.as_deref() {
            if !secret.is_empty() {
                persistent &= self.vault.set(&target_key, secret)?;
            }
        }
        if secrets.clear_jump_secret {
            self.vault.delete(&jump_key);
        } else if let Some(secret) = secrets.jump_secret.as_deref() {
            if !secret.is_empty() {
                persistent &= self.vault.set(&jump_key, secret)?;
            }
        }

        if let Some(target) = monitor.target.as_mut() {
            target.has_secret = self.vault.get(&target_key).is_some();
            if target.auth_mode == "password" && !target.has_secret {
                return Err("A target SSH password is required".to_string());
            }
        }
        if let Some(jump) = monitor.jump.as_mut() {
            jump.has_secret = self.vault.get(&jump_key).is_some();
            if jump.auth_mode == "password" && !jump.has_secret {
                return Err("A jump-host SSH password is required".to_string());
            }
        }

        let mut store = self.store.write().await;
        if let Some(existing) = store
            .monitors
            .iter_mut()
            .find(|existing| existing.id == monitor.id)
        {
            *existing = monitor.clone();
        } else {
            store.monitors.push(monitor.clone());
        }
        save_store(&self.store_path, &store)?;
        drop(store);

        self.os_cache.lock().await.remove(&monitor.id);
        secrets
            .target_secret
            .take()
            .map(|mut value| value.zeroize());
        secrets.jump_secret.take().map(|mut value| value.zeroize());

        Ok(MonitorSaveResult {
            monitor,
            vault_persistent: persistent,
        })
    }

    pub async fn delete(&self, id: &str) -> Result<(), String> {
        self.stop_streams_for_monitor(id).await;
        let mut store = self.store.write().await;
        let before = store.monitors.len();
        store.monitors.retain(|monitor| monitor.id != id);
        if before == store.monitors.len() {
            return Err(format!("Monitor '{id}' was not found"));
        }
        save_store(&self.store_path, &store)?;
        self.vault.delete(&secret_key(id, "target"));
        self.vault.delete(&secret_key(id, "jump"));
        self.os_cache.lock().await.remove(id);
        Ok(())
    }

    pub fn secret(&self, monitor_id: &str, role: &str) -> Option<String> {
        self.vault.get(&secret_key(monitor_id, role))
    }

    pub async fn cached_os(&self, monitor_id: &str) -> Option<String> {
        self.os_cache.lock().await.get(monitor_id).cloned()
    }

    pub async fn cache_os(&self, monitor_id: &str, os: &str) {
        self.os_cache
            .lock()
            .await
            .insert(monitor_id.to_string(), os.to_string());
    }

    pub async fn register_stream(&self, stream_id: String, monitor_id: &str) -> CancellationToken {
        self.stop_streams_for_monitor(monitor_id).await;
        let token = CancellationToken::new();
        self.streams
            .lock()
            .await
            .insert(format!("{monitor_id}:{stream_id}"), token.clone());
        token
    }

    pub async fn stop_stream(&self, stream_id: &str) {
        let mut streams = self.streams.lock().await;
        let keys: Vec<String> = streams
            .keys()
            .filter(|key| key.ends_with(&format!(":{stream_id}")))
            .cloned()
            .collect();
        for key in keys {
            if let Some(token) = streams.remove(&key) {
                token.cancel();
            }
        }
    }

    pub async fn stop_all_streams(&self) {
        let mut streams = self.streams.lock().await;
        for (_, token) in streams.drain() {
            token.cancel();
        }
    }

    async fn stop_streams_for_monitor(&self, monitor_id: &str) {
        let prefix = format!("{monitor_id}:");
        let mut streams = self.streams.lock().await;
        let keys: Vec<String> = streams
            .keys()
            .filter(|key| key.starts_with(&prefix))
            .cloned()
            .collect();
        for key in keys {
            if let Some(token) = streams.remove(&key) {
                token.cancel();
            }
        }
    }
}

pub(crate) fn normalize_and_validate(monitor: &mut MonitorConfig) -> Result<(), String> {
    monitor.id = monitor.id.trim().to_string();
    monitor.label = monitor.label.trim().to_string();
    monitor.target_type = monitor.target_type.trim().to_ascii_lowercase();
    monitor.target_os = monitor.target_os.trim().to_ascii_lowercase();

    if monitor.service_port == 0 {
        return Err("Service port must be between 1 and 65535".to_string());
    }
    if monitor.label.is_empty() {
        monitor.label = if monitor.target_type == "local" {
            format!("Local :{}", monitor.service_port)
        } else if let Some(target) = monitor.target.as_ref() {
            format!("{}:{}", target.host, monitor.service_port)
        } else {
            format!("Port {}", monitor.service_port)
        };
    }
    if !matches!(monitor.target_os.as_str(), "auto" | "linux" | "windows") {
        return Err("Target OS must be auto, linux, or windows".to_string());
    }

    match monitor.target_type.as_str() {
        "local" => {
            monitor.target = None;
            monitor.jump = None;
        }
        "ssh" => {
            let target = monitor
                .target
                .as_mut()
                .ok_or_else(|| "SSH target is required".to_string())?;
            validate_hop(target, "target")?;
            if let Some(jump) = monitor.jump.as_mut() {
                validate_hop(jump, "jump host")?;
            }
        }
        _ => return Err("Target type must be local or ssh".to_string()),
    }

    validate_log_source(&monitor.log_source)
}

fn validate_hop(hop: &mut SshHop, label: &str) -> Result<(), String> {
    hop.host = hop.host.trim().to_string();
    hop.user = hop.user.trim().to_string();
    hop.auth_mode = hop.auth_mode.trim().to_ascii_lowercase();
    hop.key_path = hop
        .key_path
        .as_ref()
        .map(|path| path.trim().to_string())
        .filter(|path| !path.is_empty());
    if hop.host.is_empty() || hop.user.is_empty() || hop.ssh_port == 0 {
        return Err(format!(
            "A valid {label} host, user, and SSH port are required"
        ));
    }
    if !matches!(hop.auth_mode.as_str(), "password" | "key") {
        return Err(format!("{label} auth mode must be password or key"));
    }
    if hop.auth_mode == "key" && hop.key_path.is_none() {
        return Err(format!("A private key path is required for the {label}"));
    }
    Ok(())
}

fn validate_log_source(source: &LogSourceConfig) -> Result<(), String> {
    let required = |value: &Option<String>, message: &str| {
        value
            .as_ref()
            .filter(|value| !value.trim().is_empty())
            .map(|_| ())
            .ok_or_else(|| message.to_string())
    };
    match source.kind.as_str() {
        "auto" => Ok(()),
        "file" => required(&source.path, "A log file path is required"),
        "systemd" => required(&source.unit, "A systemd unit is required"),
        "container" => {
            required(&source.container, "A container name or ID is required")?;
            if !matches!(source.engine.as_deref(), Some("docker") | Some("podman")) {
                return Err("Container engine must be docker or podman".to_string());
            }
            Ok(())
        }
        "windowsEvent" => required(&source.log_name, "A Windows Event Log name is required"),
        "custom" => required(&source.command, "A custom follow command is required"),
        _ => Err("Unsupported log source kind".to_string()),
    }
}

fn save_store(path: &Path, store: &MonitorStore) -> Result<(), String> {
    let parent = path
        .parent()
        .ok_or_else(|| "Monitoring config path has no parent".to_string())?;
    std::fs::create_dir_all(parent)
        .map_err(|error| format!("Failed to create monitoring config directory: {error}"))?;
    let raw = serde_json::to_string_pretty(store)
        .map_err(|error| format!("Failed to serialize monitoring config: {error}"))?;
    std::fs::write(path, raw)
        .map_err(|error| format!("Failed to write monitoring config: {error}"))?;
    Ok(())
}

fn secret_key(monitor_id: &str, role: &str) -> String {
    format!("clx.monitor.{monitor_id}.{role}")
}

#[derive(Default)]
struct SecretVault {
    session: std::sync::Mutex<HashMap<String, String>>,
}

impl SecretVault {
    fn set(&self, key: &str, secret: &str) -> Result<bool, String> {
        #[cfg(target_os = "windows")]
        if windows_vault_set(key, secret).is_ok() {
            self.session
                .lock()
                .map_err(|error| error.to_string())?
                .remove(key);
            return Ok(true);
        }

        self.session
            .lock()
            .map_err(|error| error.to_string())?
            .insert(key.to_string(), secret.to_string());
        Ok(false)
    }

    fn get(&self, key: &str) -> Option<String> {
        #[cfg(target_os = "windows")]
        if let Ok(Some(secret)) = windows_vault_get(key) {
            return Some(secret);
        }
        self.session.lock().ok()?.get(key).cloned()
    }

    fn delete(&self, key: &str) {
        #[cfg(target_os = "windows")]
        let _ = windows_vault_delete(key);
        if let Ok(mut session) = self.session.lock() {
            if let Some(mut secret) = session.remove(key) {
                secret.zeroize();
            }
        }
    }
}

#[cfg(target_os = "windows")]
fn wide_null(value: &str) -> Vec<u16> {
    use std::os::windows::ffi::OsStrExt;
    std::ffi::OsStr::new(value)
        .encode_wide()
        .chain(std::iter::once(0))
        .collect()
}

#[cfg(target_os = "windows")]
fn windows_vault_set(key: &str, secret: &str) -> Result<(), String> {
    use windows_sys::Win32::Security::Credentials::{
        CredWriteW, CREDENTIALW, CRED_PERSIST_LOCAL_MACHINE, CRED_TYPE_GENERIC,
    };
    let mut target = wide_null(key);
    let mut user = wide_null("CLX Monitor");
    let mut blob = secret.as_bytes().to_vec();
    let credential = CREDENTIALW {
        Flags: 0,
        Type: CRED_TYPE_GENERIC,
        TargetName: target.as_mut_ptr(),
        Comment: std::ptr::null_mut(),
        LastWritten: unsafe { std::mem::zeroed() },
        CredentialBlobSize: blob.len() as u32,
        CredentialBlob: blob.as_mut_ptr(),
        Persist: CRED_PERSIST_LOCAL_MACHINE,
        AttributeCount: 0,
        Attributes: std::ptr::null_mut(),
        TargetAlias: std::ptr::null_mut(),
        UserName: user.as_mut_ptr(),
    };
    let ok = unsafe { CredWriteW(&credential, 0) };
    blob.zeroize();
    if ok == 0 {
        return Err(format!(
            "Windows Credential Manager rejected the secret: {}",
            std::io::Error::last_os_error()
        ));
    }
    Ok(())
}

#[cfg(target_os = "windows")]
fn windows_vault_get(key: &str) -> Result<Option<String>, String> {
    use windows_sys::Win32::Security::Credentials::{
        CredFree, CredReadW, CREDENTIALW, CRED_TYPE_GENERIC,
    };
    let target = wide_null(key);
    let mut pointer: *mut CREDENTIALW = std::ptr::null_mut();
    let ok = unsafe { CredReadW(target.as_ptr(), CRED_TYPE_GENERIC, 0, &mut pointer) };
    if ok == 0 {
        return Ok(None);
    }
    if pointer.is_null() {
        return Ok(None);
    }
    let credential = unsafe { &*pointer };
    let bytes = unsafe {
        std::slice::from_raw_parts(
            credential.CredentialBlob,
            credential.CredentialBlobSize as usize,
        )
    };
    let result = String::from_utf8(bytes.to_vec())
        .map(Some)
        .map_err(|error| format!("Stored monitoring credential is not UTF-8: {error}"));
    unsafe { CredFree(pointer.cast()) };
    result
}

#[cfg(target_os = "windows")]
fn windows_vault_delete(key: &str) -> Result<(), String> {
    use windows_sys::Win32::Security::Credentials::{CredDeleteW, CRED_TYPE_GENERIC};
    let target = wide_null(key);
    let ok = unsafe { CredDeleteW(target.as_ptr(), CRED_TYPE_GENERIC, 0) };
    if ok == 0 {
        let error = std::io::Error::last_os_error();
        if error.raw_os_error() != Some(1168) {
            return Err(format!("Failed to delete monitoring credential: {error}"));
        }
    }
    Ok(())
}

// ── SSH route session (delegated to clx-ssh-client crate) ──────────────

pub use clx_ssh_client::CommandOutput;

pub struct SshRouteSession(clx_ssh_client::SshRouteSession);

impl SshRouteSession {
    pub async fn connect(
        monitor: &MonitorConfig,
        target_secret: Option<String>,
        jump_secret: Option<String>,
    ) -> Result<Self, String> {
        let target = monitor
            .target
            .as_ref()
            .ok_or_else(|| "SSH target is missing".to_string())?;
        let target_hop = clx_ssh_client::SshHop {
            host: target.host.clone(),
            ssh_port: target.ssh_port,
            user: target.user.clone(),
            auth_mode: target.auth_mode.clone(),
            key_path: target.key_path.clone(),
        };
        let jump_hop = monitor.jump.as_ref().map(|j| clx_ssh_client::SshHop {
            host: j.host.clone(),
            ssh_port: j.ssh_port,
            user: j.user.clone(),
            auth_mode: j.auth_mode.clone(),
            key_path: j.key_path.clone(),
        });
        let inner = clx_ssh_client::SshRouteSession::connect(
            &target_hop,
            jump_hop.as_ref(),
            target_secret,
            jump_secret,
        )
        .await?;
        Ok(Self(inner))
    }

    pub async fn exec_capture(
        &self,
        command: &str,
        stdin: Option<&[u8]>,
    ) -> Result<CommandOutput, String> {
        self.0.exec_capture(command, stdin).await
    }

    pub async fn open_exec_channel(
        &self,
        command: &str,
        stdin: Option<&[u8]>,
    ) -> Result<clx_ssh_client::Channel<client::Msg>, String> {
        self.0.open_exec_channel(command, stdin).await
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn local_monitor(port: u16) -> MonitorConfig {
        MonitorConfig {
            id: "test".to_string(),
            label: String::new(),
            service_port: port,
            target_type: "local".to_string(),
            target: None,
            jump: None,
            target_os: "auto".to_string(),
            log_source: LogSourceConfig::default(),
            legacy_imported: false,
        }
    }

    #[test]
    fn normalizes_local_monitor() {
        let mut monitor = local_monitor(8081);
        normalize_and_validate(&mut monitor).unwrap();
        assert_eq!(monitor.label, "Local :8081");
        assert!(monitor.target.is_none());
    }

    #[test]
    fn rejects_empty_custom_command() {
        let mut monitor = local_monitor(8081);
        monitor.log_source.kind = "custom".to_string();
        assert!(normalize_and_validate(&mut monitor).is_err());
    }

    #[test]
    fn persisted_json_never_has_secret_fields() {
        let raw = serde_json::to_string(&local_monitor(8081)).unwrap();
        assert!(!raw.contains("targetSecret"));
        assert!(!raw.contains("jumpSecret"));
    }
}
