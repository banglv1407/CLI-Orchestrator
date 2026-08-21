use crate::{EntitlementResult, ModuleManifestV1};

#[derive(Debug, Clone, Copy)]
pub struct EntitlementContext<'a> {
    pub manifest: &'a ModuleManifestV1,
    pub installed: bool,
    pub publisher_verified: bool,
}

pub trait EntitlementProvider: Send + Sync {
    fn entitlement(&self, context: EntitlementContext<'_>) -> EntitlementResult;
}

#[derive(Debug, Default)]
pub struct CommunityEntitlementProvider;

impl EntitlementProvider for CommunityEntitlementProvider {
    fn entitlement(&self, context: EntitlementContext<'_>) -> EntitlementResult {
        if context.installed
            && context.publisher_verified
            && context.manifest.publisher == "CLX"
            && context.manifest.module_id.starts_with("clx.")
        {
            EntitlementResult::Granted
        } else {
            EntitlementResult::Denied
        }
    }
}

#[derive(Debug, Clone, Copy)]
pub struct DeterministicEntitlementProvider {
    result: EntitlementResult,
}

impl DeterministicEntitlementProvider {
    pub const fn new(result: EntitlementResult) -> Self {
        Self { result }
    }
}

impl EntitlementProvider for DeterministicEntitlementProvider {
    fn entitlement(&self, _context: EntitlementContext<'_>) -> EntitlementResult {
        self.result
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{BackgroundActivationPolicy, ModuleTarget, SignatureMetadata, MANIFEST_SCHEMA_V1};

    fn manifest(publisher: &str) -> ModuleManifestV1 {
        ModuleManifestV1 {
            schema_version: MANIFEST_SCHEMA_V1,
            module_id: "clx.quickapps".into(),
            version: "1.0.0".into(),
            publisher: publisher.into(),
            target: ModuleTarget::WindowsX86_64,
            core_version: "^0.1".into(),
            host_api_version: 1,
            ui_contributions: Vec::new(),
            sidecar: None,
            requested_capabilities: Vec::new(),
            dependencies: Vec::new(),
            entitlement_id: "clx.quickapps".into(),
            background_activation: BackgroundActivationPolicy::Never,
            files: Vec::new(),
            licenses: Vec::new(),
            signature: SignatureMetadata {
                algorithm: "ed25519".into(),
                key_id: "test".into(),
                value: String::new(),
            },
        }
    }

    #[test]
    fn community_grants_only_verified_installed_clx_modules() {
        let provider = CommunityEntitlementProvider;
        let good = manifest("CLX");
        assert_eq!(
            provider.entitlement(EntitlementContext {
                manifest: &good,
                installed: true,
                publisher_verified: true,
            }),
            EntitlementResult::Granted
        );

        let unknown = manifest("Someone Else");
        assert_eq!(
            provider.entitlement(EntitlementContext {
                manifest: &unknown,
                installed: true,
                publisher_verified: true,
            }),
            EntitlementResult::Denied
        );
    }

    #[test]
    fn deterministic_provider_covers_every_result() {
        let manifest = manifest("CLX");
        for result in [
            EntitlementResult::Granted,
            EntitlementResult::Denied,
            EntitlementResult::Expired,
            EntitlementResult::Unavailable,
        ] {
            let provider = DeterministicEntitlementProvider::new(result);
            assert_eq!(
                provider.entitlement(EntitlementContext {
                    manifest: &manifest,
                    installed: true,
                    publisher_verified: true,
                }),
                result
            );
        }
    }
}
