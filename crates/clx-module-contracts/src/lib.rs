//! Shared, versioned contracts for CLX first-party modules.
//!
//! This crate deliberately has no Tauri dependency. Unknown pack input is
//! parsed and verified here before it can enter the desktop application or a
//! sidecar supervisor.

mod entitlement;
mod manifest;
mod state;
mod verify;

pub use entitlement::{
    CommunityEntitlementProvider, DeterministicEntitlementProvider, EntitlementContext,
    EntitlementProvider,
};
pub use manifest::{
    BackgroundActivationPolicy, CoreCapability, LicenseEntry, ModuleDependency, ModuleFile,
    ModuleManifestV1, ModuleTarget, SidecarEntrypointV1, SignatureMetadata, UiContribution,
    UiContributionKind, HOST_API_V1, MANIFEST_SCHEMA_V1, MAX_MANIFEST_BYTES,
};
pub use state::{
    EntitlementResult, IntegrityResult, ModuleErrorCode, ModuleRuntimeState, ModuleSnapshot,
    TypedModuleError,
};
pub use verify::{
    canonical_signing_bytes, parse_manifest_v1, verify_manifest, FileVerification,
    ManifestVerification, PublisherKeyring, VerificationError,
};
