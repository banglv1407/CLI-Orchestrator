use serde::{Deserialize, Serialize};

use crate::UiContribution;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum ModuleRuntimeState {
    NotInstalled,
    Disabled,
    Locked,
    Ready,
    Running,
    Incompatible,
    Tampered,
    Failed,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum EntitlementResult {
    Granted,
    Denied,
    Expired,
    Unavailable,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum IntegrityResult {
    NotChecked,
    Verified,
    Rejected,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum ModuleErrorCode {
    ManifestInvalid,
    WrongArchitecture,
    CoreIncompatible,
    HostApiIncompatible,
    UnknownPublisher,
    SignatureInvalid,
    FileMissing,
    FileModified,
    DependencyMissing,
    DependencyIncompatible,
    EntitlementDenied,
    EntitlementExpired,
    EntitlementUnavailable,
    CapabilityDenied,
    ProtocolViolation,
    SidecarCrashed,
    Internal,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct TypedModuleError {
    pub code: ModuleErrorCode,
    pub message: String,
    pub repairable: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ModuleSnapshot {
    pub module_id: String,
    pub version: Option<String>,
    pub state: ModuleRuntimeState,
    pub installed_size: u64,
    pub entitlement: EntitlementResult,
    pub integrity: IntegrityResult,
    pub enabled: bool,
    pub ui_contributions: Vec<UiContribution>,
    pub error: Option<TypedModuleError>,
}
