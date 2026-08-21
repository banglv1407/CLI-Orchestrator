use serde::{Deserialize, Serialize};

pub const MANIFEST_SCHEMA_V1: u32 = 1;
pub const HOST_API_V1: u32 = 1;
pub const MAX_MANIFEST_BYTES: usize = 256 * 1024;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ModuleManifestV1 {
    pub schema_version: u32,
    pub module_id: String,
    pub version: String,
    pub publisher: String,
    pub target: ModuleTarget,
    pub core_version: String,
    pub host_api_version: u32,
    #[serde(default)]
    pub ui_contributions: Vec<UiContribution>,
    pub sidecar: Option<SidecarEntrypointV1>,
    #[serde(default)]
    pub requested_capabilities: Vec<CoreCapability>,
    #[serde(default)]
    pub dependencies: Vec<ModuleDependency>,
    pub entitlement_id: String,
    pub background_activation: BackgroundActivationPolicy,
    pub files: Vec<ModuleFile>,
    pub licenses: Vec<LicenseEntry>,
    pub signature: SignatureMetadata,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ModuleTarget {
    #[serde(rename = "windows-x86_64")]
    WindowsX86_64,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct UiContribution {
    pub id: String,
    pub kind: UiContributionKind,
    pub entrypoint: String,
    pub export: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum UiContributionKind {
    MainPanel,
    SettingsSection,
    SidebarBadge,
    CommandPaletteAction,
    Overlay,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SidecarEntrypointV1 {
    pub path: String,
    pub protocol_version: u32,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum CoreCapability {
    CredentialRead,
    FileOpen,
    ProcessLaunch,
    RemoteTransport,
    NetworkRequest,
    Notification,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ModuleDependency {
    pub module_id: String,
    pub version: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum BackgroundActivationPolicy {
    Never,
    UserConfigured,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ModuleFile {
    pub path: String,
    pub size: u64,
    pub sha256: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct LicenseEntry {
    pub name: String,
    pub path: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SignatureMetadata {
    pub algorithm: String,
    pub key_id: String,
    pub value: String,
}
