use std::{
    collections::{BTreeMap, BTreeSet, HashMap},
    fs,
    path::{Path, PathBuf},
    process::Stdio,
    sync::{Arc, RwLock},
    time::Duration,
};

mod callbacks;

pub use callbacks::{CoreHostCallbacks, NoopHostCallbacks};

use clx_module_contracts::{
    verify_manifest, CommunityEntitlementProvider, CoreCapability, EntitlementContext,
    EntitlementProvider, EntitlementResult, IntegrityResult, ManifestVerification, ModuleErrorCode,
    ModuleRuntimeState, ModuleSnapshot, PublisherKeyring, TypedModuleError, VerificationError,
    MAX_MANIFEST_BYTES,
};
use semver::Version;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use tokio::{
    io::{AsyncRead, AsyncReadExt, AsyncWriteExt, BufReader},
    process::{Child, ChildStdin, ChildStdout, Command},
    sync::Mutex,
    time::timeout,
};

const MODULE_STATE_SCHEMA: u32 = 1;
const MAX_RPC_BYTES: usize = 1024 * 1024;
const MAX_HEADER_BYTES: usize = 8 * 1024;
const RPC_TIMEOUT: Duration = Duration::from_secs(30);
const HTTP_REQUEST_RPC_TIMEOUT: Duration = Duration::from_secs(65);
const RELEASE_KEY_ID: &str = "clx-release-v1";

pub const FIRST_PARTY_MODULES: [&str; 9] = [
    "clx.quickapps",
    "clx.api-client",
    "clx.buzz",
    "clx.nes",
    "clx.pet",
    "clx.ai-companion",
    "clx.cli-proxy",
    "clx.ssh",
    "clx.local-llm",
];

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct ModulePreferences {
    schema_version: u32,
    #[serde(default)]
    enabled: BTreeMap<String, bool>,
}

impl Default for ModulePreferences {
    fn default() -> Self {
        Self {
            schema_version: MODULE_STATE_SCHEMA,
            enabled: BTreeMap::new(),
        }
    }
}

struct InstalledModule {
    root: PathBuf,
    verified: ManifestVerification,
}

#[derive(Debug, Clone)]
pub struct ModuleAsset {
    pub bytes: Vec<u8>,
    pub content_type: &'static str,
}

struct SidecarProcess {
    child: Child,
    stdin: ChildStdin,
    stdout: BufReader<ChildStdout>,
    launch_token: String,
    next_id: u64,
}

pub struct ModuleHost {
    modules_root: PathBuf,
    data_root: PathBuf,
    state_path: PathBuf,
    core_version: Version,
    keyring: PublisherKeyring,
    entitlement: Arc<dyn EntitlementProvider>,
    preferences: RwLock<ModulePreferences>,
    callbacks: Arc<dyn CoreHostCallbacks>,
    sidecars: Mutex<HashMap<String, SidecarProcess>>,
}

impl ModuleHost {
    pub fn for_current_install(data_root: &Path, core_version: &str) -> Result<Self, String> {
        Self::for_current_install_with_callbacks(data_root, core_version, Arc::new(NoopHostCallbacks))
    }

    pub fn for_current_install_with_callbacks(
        data_root: &Path,
        core_version: &str,
        callbacks: Arc<dyn CoreHostCallbacks>,
    ) -> Result<Self, String> {
        let executable = std::env::current_exe().map_err(|error| error.to_string())?;
        let install_root = executable
            .parent()
            .ok_or_else(|| "CLX executable has no parent directory".to_string())?;
        let mut keyring = PublisherKeyring::new();
        if let Some(encoded) = option_env!("CLX_MODULE_PUBLISHER_PUBLIC_KEY") {
            keyring
                .insert_base64(RELEASE_KEY_ID, encoded)
                .map_err(|error| format!("invalid pinned module publisher key: {error}"))?;
        }
        Self::new_with_callbacks(
            install_root.join("modules"),
            data_root.join("modules.json"),
            core_version,
            keyring,
            Arc::new(CommunityEntitlementProvider),
            callbacks,
        )
    }

    pub fn new(
        modules_root: PathBuf,
        state_path: PathBuf,
        core_version: &str,
        keyring: PublisherKeyring,
        entitlement: Arc<dyn EntitlementProvider>,
    ) -> Result<Self, String> {
        Self::new_with_callbacks(
            modules_root,
            state_path,
            core_version,
            keyring,
            entitlement,
            Arc::new(NoopHostCallbacks),
        )
    }

    pub fn new_with_callbacks(
        modules_root: PathBuf,
        state_path: PathBuf,
        core_version: &str,
        keyring: PublisherKeyring,
        entitlement: Arc<dyn EntitlementProvider>,
        callbacks: Arc<dyn CoreHostCallbacks>,
    ) -> Result<Self, String> {
        let core_version = Version::parse(core_version).map_err(|error| error.to_string())?;
        let preferences = load_preferences(&state_path)?;
        let data_root = state_path
            .parent()
            .ok_or_else(|| "module preference path has no parent".to_string())?
            .to_path_buf();
        Ok(Self {
            modules_root,
            data_root,
            state_path,
            core_version,
            keyring,
            entitlement,
            preferences: RwLock::new(preferences),
            callbacks,
            sidecars: Mutex::new(HashMap::new()),
        })
    }

    pub fn catalog(&self) -> Vec<ModuleSnapshot> {
        let mut module_ids: BTreeSet<String> = FIRST_PARTY_MODULES
            .iter()
            .map(|module_id| (*module_id).to_string())
            .collect();
        if let Ok(entries) = fs::read_dir(&self.modules_root) {
            for entry in entries.flatten() {
                if entry.path().is_dir() {
                    if let Some(module_id) = entry.file_name().to_str() {
                        module_ids.insert(module_id.to_string());
                    }
                }
            }
        }
        module_ids
            .into_iter()
            .map(|module_id| self.snapshot(&module_id))
            .collect()
    }

    pub fn snapshot(&self, module_id: &str) -> ModuleSnapshot {
        let enabled = self.is_enabled(module_id);
        match self.resolve_installed(module_id) {
            Ok(Some(installed)) => {
                let entitlement = self.entitlement.entitlement(EntitlementContext {
                    manifest: &installed.verified.manifest,
                    installed: true,
                    publisher_verified: true,
                });
                let (state, error) = match entitlement {
                    EntitlementResult::Granted if enabled => (ModuleRuntimeState::Ready, None),
                    EntitlementResult::Granted => (ModuleRuntimeState::Disabled, None),
                    EntitlementResult::Denied => (
                        ModuleRuntimeState::Locked,
                        Some(module_error(
                            ModuleErrorCode::EntitlementDenied,
                            "Module entitlement was denied",
                            false,
                        )),
                    ),
                    EntitlementResult::Expired => (
                        ModuleRuntimeState::Locked,
                        Some(module_error(
                            ModuleErrorCode::EntitlementExpired,
                            "Module entitlement has expired",
                            false,
                        )),
                    ),
                    EntitlementResult::Unavailable => (
                        ModuleRuntimeState::Locked,
                        Some(module_error(
                            ModuleErrorCode::EntitlementUnavailable,
                            "Module entitlement provider is unavailable",
                            true,
                        )),
                    ),
                };
                ModuleSnapshot {
                    module_id: module_id.into(),
                    version: Some(installed.verified.manifest.version.clone()),
                    state,
                    installed_size: installed.verified.installed_size,
                    entitlement,
                    integrity: IntegrityResult::Verified,
                    enabled,
                    ui_contributions: installed.verified.manifest.ui_contributions.clone(),
                    error,
                }
            }
            Ok(None) => not_installed_snapshot(module_id),
            Err(error) => rejected_snapshot(module_id, error),
        }
    }

    pub async fn set_enabled(
        &self,
        module_id: &str,
        enabled: bool,
    ) -> Result<ModuleSnapshot, String> {
        let current = self.snapshot(module_id);
        if current.state == ModuleRuntimeState::NotInstalled {
            return Err(format!("module is not installed: {module_id}"));
        }
        if enabled
            && !matches!(
                current.state,
                ModuleRuntimeState::Disabled
                    | ModuleRuntimeState::Ready
                    | ModuleRuntimeState::Running
            )
        {
            return Err(current
                .error
                .map(|error| error.message)
                .unwrap_or_else(|| format!("module cannot be enabled: {module_id}")));
        }

        {
            let mut preferences = self
                .preferences
                .write()
                .map_err(|_| "module preference lock poisoned".to_string())?;
            preferences.enabled.insert(module_id.to_string(), enabled);
            save_preferences(&self.state_path, &preferences)?;
        }
        if !enabled {
            self.stop_sidecar(module_id).await;
        }
        Ok(self.snapshot(module_id))
    }

    pub async fn call(
        &self,
        module_id: &str,
        method: &str,
        params: Value,
    ) -> Result<Value, String> {
        if method.is_empty() || method.len() > 128 || !method.starts_with(module_id) {
            return Err("module RPC method must be namespaced by its module id".into());
        }
        let snapshot = self.snapshot(module_id);
        if snapshot.state != ModuleRuntimeState::Ready
            && snapshot.state != ModuleRuntimeState::Running
        {
            return Err(snapshot
                .error
                .map(|error| error.message)
                .unwrap_or_else(|| format!("module is not ready: {module_id}")));
        }
        let installed = self
            .resolve_installed(module_id)
            .map_err(|error| error.to_string())?
            .ok_or_else(|| format!("module is not installed: {module_id}"))?;
        if let Some(required) = required_capability(module_id, method) {
            if !installed
                .verified
                .manifest
                .requested_capabilities
                .contains(&required)
            {
                return Err(format!(
                    "module capability was not granted for method: {method}"
                ));
            }
        }
        let sidecar = installed
            .verified
            .manifest
            .sidecar
            .as_ref()
            .ok_or_else(|| format!("module has no native runtime: {module_id}"))?;

        let mut sidecars = self.sidecars.lock().await;
        if !sidecars.contains_key(module_id) {
            let process =
                start_sidecar(module_id, &installed.root, &sidecar.path, &self.data_root).await?;
            sidecars.insert(module_id.to_string(), process);
        }
        let result = sidecars
            .get_mut(module_id)
            .expect("sidecar inserted above")
            .call(module_id, method, params, &self.callbacks)
            .await;
        if result.is_err() {
            if let Some(mut process) = sidecars.remove(module_id) {
                let _ = process.child.kill().await;
            }
        }
        result
    }

    pub async fn restart(&self, module_id: &str) -> Result<ModuleSnapshot, String> {
        self.stop_sidecar(module_id).await;
        let snapshot = self.snapshot(module_id);
        if snapshot.state == ModuleRuntimeState::NotInstalled {
            return Err(format!("module is not installed: {module_id}"));
        }
        Ok(snapshot)
    }

    pub fn read_asset(
        &self,
        module_id: &str,
        version: &str,
        relative_path: &str,
    ) -> Result<ModuleAsset, String> {
        let snapshot = self.snapshot(module_id);
        if !matches!(
            snapshot.state,
            ModuleRuntimeState::Ready | ModuleRuntimeState::Running
        ) {
            return Err("module is not ready for UI asset loading".into());
        }
        let installed = self
            .resolve_installed(module_id)
            .map_err(|error| error.to_string())?
            .ok_or_else(|| "module is not installed".to_string())?;
        if installed.verified.manifest.version != version {
            return Err("module asset version is not active".into());
        }
        let declared = installed
            .verified
            .manifest
            .files
            .iter()
            .find(|file| file.path == relative_path)
            .ok_or_else(|| "module asset is not declared in the signed manifest".to_string())?;
        let content_type = asset_content_type(relative_path)
            .ok_or_else(|| "module asset type is not allowed".to_string())?;
        let root = fs::canonicalize(&installed.root).map_err(|error| error.to_string())?;
        let path = fs::canonicalize(root.join(relative_path)).map_err(|error| error.to_string())?;
        if !path.starts_with(&root) || !path.is_file() {
            return Err("module asset escaped its verified pack root".into());
        }
        let bytes = fs::read(path).map_err(|error| error.to_string())?;
        if bytes.len() as u64 != declared.size {
            return Err("module asset changed after verification".into());
        }
        Ok(ModuleAsset {
            bytes,
            content_type,
        })
    }

    pub async fn shutdown(&self) {
        let mut sidecars = self.sidecars.lock().await;
        for (_, mut process) in sidecars.drain() {
            let _ = process.child.kill().await;
        }
    }

    async fn stop_sidecar(&self, module_id: &str) {
        let mut sidecars = self.sidecars.lock().await;
        if let Some(mut process) = sidecars.remove(module_id) {
            let _ = process.child.kill().await;
        }
    }

    fn is_enabled(&self, module_id: &str) -> bool {
        self.preferences
            .read()
            .ok()
            .and_then(|preferences| preferences.enabled.get(module_id).copied())
            .unwrap_or(true)
    }

    fn resolve_installed(
        &self,
        module_id: &str,
    ) -> Result<Option<InstalledModule>, VerificationError> {
        let module_root = self.modules_root.join(module_id);
        if !module_root.is_dir() {
            return Ok(None);
        }
        let mut candidates = Vec::new();
        let entries = fs::read_dir(&module_root).map_err(|error| VerificationError::Io {
            path: module_root.display().to_string(),
            message: error.to_string(),
        })?;
        for entry in entries.flatten() {
            let path = entry.path();
            if !path.is_dir() {
                continue;
            }
            let Some(name) = entry.file_name().to_str().map(str::to_string) else {
                continue;
            };
            if let Ok(version) = Version::parse(&name) {
                candidates.push((version, path));
            }
        }
        candidates.sort_by(|left, right| right.0.cmp(&left.0));
        let mut newest_error = None;
        for (candidate_version, root) in candidates {
            let result = (|| {
                let manifest_path = root.join("manifest.json");
                let metadata = fs::metadata(&manifest_path)
                    .map_err(|_| VerificationError::MissingFile("manifest.json".into()))?;
                if metadata.len() > MAX_MANIFEST_BYTES as u64 {
                    return Err(VerificationError::ManifestTooLarge);
                }
                let bytes = fs::read(&manifest_path).map_err(|error| VerificationError::Io {
                    path: manifest_path.display().to_string(),
                    message: error.to_string(),
                })?;
                let verified = verify_manifest(&root, &bytes, &self.core_version, &self.keyring)?;
                if verified.manifest.module_id != module_id {
                    return Err(VerificationError::InvalidModuleId(
                        verified.manifest.module_id.clone(),
                    ));
                }
                if verified.manifest.version != candidate_version.to_string() {
                    return Err(VerificationError::InvalidEntry(format!(
                        "manifest version {} does not match pack directory {}",
                        verified.manifest.version, candidate_version
                    )));
                }
                Ok(InstalledModule { root, verified })
            })();
            match result {
                Ok(installed) => return Ok(Some(installed)),
                Err(error) if newest_error.is_none() => newest_error = Some(error),
                Err(_) => {}
            }
        }
        newest_error.map_or(Ok(None), Err)
    }
}

impl SidecarProcess {
    async fn call(
        &mut self,
        module_id: &str,
        method: &str,
        params: Value,
        callbacks: &Arc<dyn CoreHostCallbacks>,
    ) -> Result<Value, String> {
        if let Some(status) = self.child.try_wait().map_err(|error| error.to_string())? {
            return Err(format!("module sidecar exited before request: {status}"));
        }
        self.next_id = self.next_id.saturating_add(1);
        let expected_id = self.next_id;
        let request = json!({
            "jsonrpc": "2.0",
            "id": expected_id,
            "method": method,
            "params": params,
            "token": self.launch_token,
        });
        let payload = serde_json::to_vec(&request).map_err(|error| error.to_string())?;
        if payload.len() > MAX_RPC_BYTES {
            return Err("module RPC request exceeds 1 MiB".into());
        }
        let header = format!("Content-Length: {}\r\n\r\n", payload.len());
        let rpc_timeout = if method == "clx.api-client.request" {
            HTTP_REQUEST_RPC_TIMEOUT
        } else {
            RPC_TIMEOUT
        };
        timeout(rpc_timeout, async {
            self.stdin.write_all(header.as_bytes()).await?;
            self.stdin.write_all(&payload).await?;
            self.stdin.flush().await
        })
        .await
        .map_err(|_| "module RPC write timed out".to_string())?
        .map_err(|error| error.to_string())?;

        // Read frames until we get the matching response.
        // Interleaved notifications and reverse-RPC requests are dispatched inline.
        loop {
            let response = timeout(rpc_timeout, read_frame(&mut self.stdout))
                .await
                .map_err(|_| "module RPC response timed out".to_string())??;
            let response: Value = serde_json::from_slice(&response)
                .map_err(|_| "module returned invalid JSON".to_string())?;

            if response.get("jsonrpc").and_then(Value::as_str) != Some("2.0") {
                return Err("module returned invalid JSON-RPC version".into());
            }

            // Case 1: Notification (no id field)
            if response.get("id").is_none() || response.get("id") == Some(&Value::Null) {
                if let Some(event_method) = response.get("method").and_then(Value::as_str) {
                    let event_params = response.get("params").cloned().unwrap_or(Value::Null);
                    callbacks
                        .emit_event(module_id, event_method, event_params)
                        .await;
                }
                continue;
            }

            let frame_id = response.get("id");

            // Case 2: Reverse-RPC request from sidecar (has method + id)
            if let Some(req_method) = response.get("method").and_then(Value::as_str) {
                let req_params = response.get("params").cloned().unwrap_or(Value::Null);
                let dispatch_result = callbacks
                    .dispatch_core_call(module_id, req_method, req_params)
                    .await;

                let reply = match dispatch_result {
                    Ok(value) => json!({
                        "jsonrpc": "2.0",
                        "id": frame_id,
                        "result": value,
                    }),
                    Err(error_msg) => json!({
                        "jsonrpc": "2.0",
                        "id": frame_id,
                        "error": { "code": -32000, "message": error_msg },
                    }),
                };

                let reply_payload =
                    serde_json::to_vec(&reply).map_err(|error| error.to_string())?;
                let reply_header = format!("Content-Length: {}\r\n\r\n", reply_payload.len());
                let _ = self.stdin.write_all(reply_header.as_bytes()).await;
                let _ = self.stdin.write_all(&reply_payload).await;
                let _ = self.stdin.flush().await;
                continue;
            }

            // Case 3: Response to our call
            if frame_id.and_then(Value::as_u64) != Some(expected_id) {
                return Err("module returned a mismatched JSON-RPC response id".into());
            }

            if let Some(error) = response.get("error") {
                let message = error
                    .get("message")
                    .and_then(Value::as_str)
                    .unwrap_or("module RPC failed");
                return Err(message.to_string());
            }

            return response
                .get("result")
                .cloned()
                .ok_or_else(|| "module response has no result".to_string());
        }
    }
}

async fn start_sidecar(
    module_id: &str,
    pack_root: &Path,
    relative_path: &str,
    data_root: &Path,
) -> Result<SidecarProcess, String> {
    let root = fs::canonicalize(pack_root).map_err(|error| error.to_string())?;
    let executable =
        fs::canonicalize(root.join(relative_path)).map_err(|error| error.to_string())?;
    if !executable.starts_with(&root) || !executable.is_file() {
        return Err("verified sidecar path escaped its pack root".into());
    }
    let launch_token = uuid::Uuid::new_v4().to_string();
    let mut command = Command::new(&executable);
    command
        .env("CLX_MODULE_ID", module_id)
        .env("CLX_MODULE_TOKEN", &launch_token)
        .env("CLX_DATA_ROOT", data_root)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .kill_on_drop(true);
    #[cfg(windows)]
    command.creation_flags(0x08000000);
    let mut child = command.spawn().map_err(|error| error.to_string())?;
    let stdin = child
        .stdin
        .take()
        .ok_or_else(|| "module sidecar has no stdin".to_string())?;
    let stdout = child
        .stdout
        .take()
        .ok_or_else(|| "module sidecar has no stdout".to_string())?;
    if let Some(mut stderr) = child.stderr.take() {
        tokio::spawn(async move {
            let mut buffer = [0_u8; 8192];
            while let Ok(read) = stderr.read(&mut buffer).await {
                if read == 0 {
                    break;
                }
                // Drain stderr to prevent backpressure. Pack output is not
                // forwarded because it may contain credentials or app args.
            }
        });
    }
    Ok(SidecarProcess {
        child,
        stdin,
        stdout: BufReader::new(stdout),
        launch_token,
        next_id: 0,
    })
}

async fn read_frame(reader: &mut (impl AsyncRead + Unpin)) -> Result<Vec<u8>, String> {
    let mut header = Vec::new();
    let mut byte = [0_u8; 1];
    while !header.ends_with(b"\r\n\r\n") {
        if header.len() >= MAX_HEADER_BYTES {
            return Err("module RPC header exceeds 8 KiB".into());
        }
        reader
            .read_exact(&mut byte)
            .await
            .map_err(|error| error.to_string())?;
        header.push(byte[0]);
    }
    let header = std::str::from_utf8(&header).map_err(|_| "module RPC header is not UTF-8")?;
    let mut content_length = None;
    for line in header.split("\r\n").filter(|line| !line.is_empty()) {
        let (name, value) = line
            .split_once(':')
            .ok_or_else(|| "malformed module RPC header".to_string())?;
        if name.eq_ignore_ascii_case("Content-Length") {
            if content_length.is_some() {
                return Err("duplicate Content-Length header".into());
            }
            content_length = Some(
                value
                    .trim()
                    .parse::<usize>()
                    .map_err(|_| "invalid Content-Length header".to_string())?,
            );
        } else {
            return Err("unsupported module RPC header".into());
        }
    }
    let content_length =
        content_length.ok_or_else(|| "missing Content-Length header".to_string())?;
    if content_length == 0 || content_length > MAX_RPC_BYTES {
        return Err("module RPC payload exceeds bounds".into());
    }
    let mut payload = vec![0_u8; content_length];
    reader
        .read_exact(&mut payload)
        .await
        .map_err(|error| error.to_string())?;
    Ok(payload)
}

fn load_preferences(path: &Path) -> Result<ModulePreferences, String> {
    if !path.is_file() {
        return Ok(ModulePreferences::default());
    }
    let bytes = fs::read(path).map_err(|error| error.to_string())?;
    let preferences: ModulePreferences =
        serde_json::from_slice(&bytes).map_err(|error| error.to_string())?;
    if preferences.schema_version != MODULE_STATE_SCHEMA {
        return Err(format!(
            "unsupported module preference schema {}",
            preferences.schema_version
        ));
    }
    Ok(preferences)
}

fn save_preferences(path: &Path, preferences: &ModulePreferences) -> Result<(), String> {
    let parent = path
        .parent()
        .ok_or_else(|| "module preference path has no parent".to_string())?;
    fs::create_dir_all(parent).map_err(|error| error.to_string())?;
    let temporary = path.with_extension("json.tmp");
    let bytes = serde_json::to_vec_pretty(preferences).map_err(|error| error.to_string())?;
    fs::write(&temporary, bytes).map_err(|error| error.to_string())?;
    if path.exists() {
        let backup = path.with_extension("json.bak");
        let _ = fs::copy(path, &backup);
        fs::remove_file(path).map_err(|error| error.to_string())?;
    }
    fs::rename(&temporary, path).map_err(|error| error.to_string())
}

fn not_installed_snapshot(module_id: &str) -> ModuleSnapshot {
    ModuleSnapshot {
        module_id: module_id.into(),
        version: None,
        state: ModuleRuntimeState::NotInstalled,
        installed_size: 0,
        entitlement: EntitlementResult::Denied,
        integrity: IntegrityResult::NotChecked,
        enabled: false,
        ui_contributions: Vec::new(),
        error: None,
    }
}

fn rejected_snapshot(module_id: &str, error: VerificationError) -> ModuleSnapshot {
    let (state, integrity, code, repairable) = match error {
        VerificationError::WrongArchitecture => (
            ModuleRuntimeState::Incompatible,
            IntegrityResult::NotChecked,
            ModuleErrorCode::WrongArchitecture,
            false,
        ),
        VerificationError::CoreIncompatible(_) => (
            ModuleRuntimeState::Incompatible,
            IntegrityResult::NotChecked,
            ModuleErrorCode::CoreIncompatible,
            true,
        ),
        VerificationError::HostApiIncompatible(_) => (
            ModuleRuntimeState::Incompatible,
            IntegrityResult::NotChecked,
            ModuleErrorCode::HostApiIncompatible,
            true,
        ),
        VerificationError::UnknownPublisher(_) => (
            ModuleRuntimeState::Tampered,
            IntegrityResult::Rejected,
            ModuleErrorCode::UnknownPublisher,
            true,
        ),
        VerificationError::InvalidSignature
        | VerificationError::UnsupportedSignatureAlgorithm(_) => (
            ModuleRuntimeState::Tampered,
            IntegrityResult::Rejected,
            ModuleErrorCode::SignatureInvalid,
            true,
        ),
        VerificationError::MissingFile(_) => (
            ModuleRuntimeState::Tampered,
            IntegrityResult::Rejected,
            ModuleErrorCode::FileMissing,
            true,
        ),
        VerificationError::FileSizeMismatch(_) | VerificationError::FileHashMismatch(_) => (
            ModuleRuntimeState::Tampered,
            IntegrityResult::Rejected,
            ModuleErrorCode::FileModified,
            true,
        ),
        _ => (
            ModuleRuntimeState::Failed,
            IntegrityResult::Rejected,
            ModuleErrorCode::ManifestInvalid,
            true,
        ),
    };
    ModuleSnapshot {
        module_id: module_id.into(),
        version: None,
        state,
        installed_size: 0,
        entitlement: EntitlementResult::Denied,
        integrity,
        enabled: false,
        ui_contributions: Vec::new(),
        error: Some(module_error(code, &error.to_string(), repairable)),
    }
}

fn required_capability(module_id: &str, method: &str) -> Option<CoreCapability> {
    match (module_id, method) {
        ("clx.quickapps", "clx.quickapps.launch") => Some(CoreCapability::ProcessLaunch),
        ("clx.api-client", "clx.api-client.request" | "clx.api-client.streamStart") => {
            Some(CoreCapability::NetworkRequest)
        }
        _ => None,
    }
}

fn asset_content_type(path: &str) -> Option<&'static str> {
    let extension = Path::new(path).extension()?.to_str()?.to_ascii_lowercase();
    match extension.as_str() {
        "js" | "mjs" => Some("text/javascript; charset=utf-8"),
        "css" => Some("text/css; charset=utf-8"),
        "json" => Some("application/json; charset=utf-8"),
        "png" => Some("image/png"),
        "jpg" | "jpeg" => Some("image/jpeg"),
        "svg" => Some("image/svg+xml"),
        "webp" => Some("image/webp"),
        "gif" => Some("image/gif"),
        "woff2" => Some("font/woff2"),
        _ => None,
    }
}

fn module_error(code: ModuleErrorCode, message: &str, repairable: bool) -> TypedModuleError {
    TypedModuleError {
        code,
        message: message.into(),
        repairable,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use base64::{engine::general_purpose::STANDARD as BASE64, Engine as _};
    use clx_module_contracts::{
        canonical_signing_bytes, BackgroundActivationPolicy, CoreCapability,
        DeterministicEntitlementProvider, EntitlementResult, LicenseEntry, ModuleFile,
        ModuleManifestV1, ModuleRuntimeState, ModuleTarget, SignatureMetadata, UiContribution,
        UiContributionKind, HOST_API_V1, MANIFEST_SCHEMA_V1,
    };
    use ed25519_dalek::{Signer, SigningKey};
    use sha2::{Digest, Sha256};
    use tempfile::tempdir;

    #[test]
    fn catalog_contains_all_first_party_modules_when_none_are_installed() {
        let root = tempdir().unwrap();
        let host = ModuleHost::new(
            root.path().join("modules"),
            root.path().join("data/modules.json"),
            "0.1.0",
            PublisherKeyring::new(),
            Arc::new(CommunityEntitlementProvider),
        )
        .unwrap();
        let catalog = host.catalog();
        assert_eq!(catalog.len(), FIRST_PARTY_MODULES.len());
        assert!(catalog
            .iter()
            .all(|module| module.state == ModuleRuntimeState::NotInstalled));
    }

    #[test]
    fn deterministic_entitlement_provider_is_accepted_by_the_host_boundary() {
        let root = tempdir().unwrap();
        let host = ModuleHost::new(
            root.path().join("modules"),
            root.path().join("data/modules.json"),
            "0.1.0",
            PublisherKeyring::new(),
            Arc::new(DeterministicEntitlementProvider::new(
                EntitlementResult::Unavailable,
            )),
        );
        assert!(host.is_ok());
    }

    #[tokio::test]
    async fn frame_reader_rejects_oversized_and_unknown_headers() {
        let oversized = format!("Content-Length: {}\r\n\r\n", MAX_RPC_BYTES + 1);
        let error = read_frame(&mut oversized.as_bytes()).await.unwrap_err();
        assert!(error.contains("exceeds bounds"));

        let unknown = b"X-Test: 1\r\n\r\n{}";
        let error = read_frame(&mut unknown.as_slice()).await.unwrap_err();
        assert!(error.contains("unsupported"));
    }

    #[test]
    fn process_launch_rpc_requires_the_declared_capability() {
        assert_eq!(
            required_capability("clx.quickapps", "clx.quickapps.launch"),
            Some(CoreCapability::ProcessLaunch)
        );
        assert_eq!(
            required_capability("clx.quickapps", "clx.quickapps.list"),
            None
        );
        assert_eq!(
            required_capability("clx.api-client", "clx.api-client.request"),
            Some(CoreCapability::NetworkRequest)
        );
        assert_eq!(
            required_capability("clx.api-client", "clx.api-client.streamPoll"),
            None
        );
    }

    #[test]
    fn invalid_newer_pack_falls_back_to_last_verified_version() {
        let root = tempdir().unwrap();
        let signing_key = SigningKey::from_bytes(&[9_u8; 32]);
        let pack_root = root.path().join("modules/clx.quickapps/1.0.0");
        fs::create_dir_all(pack_root.join("ui")).unwrap();
        fs::write(
            pack_root.join("ui/index.js"),
            b"export const register = () => {};",
        )
        .unwrap();
        fs::write(pack_root.join("NOTICE.txt"), b"notice").unwrap();
        let mut manifest = ModuleManifestV1 {
            schema_version: MANIFEST_SCHEMA_V1,
            module_id: "clx.quickapps".into(),
            version: "1.0.0".into(),
            publisher: "CLX".into(),
            target: ModuleTarget::WindowsX86_64,
            core_version: "^0.1".into(),
            host_api_version: HOST_API_V1,
            ui_contributions: vec![UiContribution {
                id: "quickapps.main".into(),
                kind: UiContributionKind::MainPanel,
                entrypoint: "ui/index.js".into(),
                export: "register".into(),
            }],
            sidecar: None,
            requested_capabilities: vec![CoreCapability::ProcessLaunch],
            dependencies: Vec::new(),
            entitlement_id: "clx.quickapps".into(),
            background_activation: BackgroundActivationPolicy::Never,
            files: vec![
                ModuleFile {
                    path: "ui/index.js".into(),
                    size: 33,
                    sha256: format!("{:x}", Sha256::digest(b"export const register = () => {};")),
                },
                ModuleFile {
                    path: "NOTICE.txt".into(),
                    size: 6,
                    sha256: format!("{:x}", Sha256::digest(b"notice")),
                },
            ],
            licenses: vec![LicenseEntry {
                name: "NOTICE".into(),
                path: "NOTICE.txt".into(),
            }],
            signature: SignatureMetadata {
                algorithm: "ed25519".into(),
                key_id: "test-publisher".into(),
                value: String::new(),
            },
        };
        let signing_bytes = canonical_signing_bytes(&manifest).unwrap();
        manifest.signature.value = BASE64.encode(signing_key.sign(&signing_bytes).to_bytes());
        fs::write(
            pack_root.join("manifest.json"),
            serde_json::to_vec_pretty(&manifest).unwrap(),
        )
        .unwrap();
        fs::create_dir_all(root.path().join("modules/clx.quickapps/2.0.0")).unwrap();

        let mut keyring = PublisherKeyring::new();
        keyring.insert("test-publisher", signing_key.verifying_key());
        let host = ModuleHost::new(
            root.path().join("modules"),
            root.path().join("data/modules.json"),
            "0.1.0",
            keyring,
            Arc::new(CommunityEntitlementProvider),
        )
        .unwrap();

        let snapshot = host.snapshot("clx.quickapps");
        assert_eq!(snapshot.state, ModuleRuntimeState::Ready);
        assert_eq!(snapshot.version.as_deref(), Some("1.0.0"));
    }
}
