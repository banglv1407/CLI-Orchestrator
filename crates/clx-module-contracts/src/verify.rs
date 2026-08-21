use std::{
    collections::{HashMap, HashSet},
    fs::{self, File},
    io::Read,
    path::{Component, Path},
};

use base64::{engine::general_purpose::STANDARD as BASE64, Engine as _};
use ed25519_dalek::{Signature, Verifier, VerifyingKey};
use semver::{Version, VersionReq};
use sha2::{Digest, Sha256};
use thiserror::Error;

use crate::{
    CoreCapability, ModuleManifestV1, ModuleTarget, HOST_API_V1, MANIFEST_SCHEMA_V1,
    MAX_MANIFEST_BYTES,
};

const MAX_FILES: usize = 2048;
const MAX_FILE_BYTES: u64 = 512 * 1024 * 1024;

#[derive(Debug, Error, PartialEq, Eq)]
pub enum VerificationError {
    #[error("manifest exceeds {MAX_MANIFEST_BYTES} bytes")]
    ManifestTooLarge,
    #[error("invalid manifest json: {0}")]
    InvalidJson(String),
    #[error("unsupported manifest schema version {0}")]
    UnsupportedSchema(u32),
    #[error("invalid module id: {0}")]
    InvalidModuleId(String),
    #[error("invalid semantic version or version requirement: {0}")]
    InvalidVersion(String),
    #[error("module targets an unsupported architecture")]
    WrongArchitecture,
    #[error("module does not support Core {0}")]
    CoreIncompatible(String),
    #[error("module requires unsupported host API {0}")]
    HostApiIncompatible(u32),
    #[error("invalid or duplicate manifest entry: {0}")]
    InvalidEntry(String),
    #[error("unsafe relative path: {0}")]
    UnsafePath(String),
    #[error("unknown publisher key: {0}")]
    UnknownPublisher(String),
    #[error("unsupported signature algorithm: {0}")]
    UnsupportedSignatureAlgorithm(String),
    #[error("invalid manifest signature")]
    InvalidSignature,
    #[error("manifest file is missing or not a regular file: {0}")]
    MissingFile(String),
    #[error("manifest file has an unexpected size: {0}")]
    FileSizeMismatch(String),
    #[error("manifest file has an unexpected SHA-256: {0}")]
    FileHashMismatch(String),
    #[error("cannot read module file {path}: {message}")]
    Io { path: String, message: String },
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct FileVerification {
    pub path: String,
    pub size: u64,
    pub sha256: String,
}

#[derive(Debug, Clone)]
pub struct ManifestVerification {
    pub manifest: ModuleManifestV1,
    pub files: Vec<FileVerification>,
    pub installed_size: u64,
}

#[derive(Debug, Default, Clone)]
pub struct PublisherKeyring {
    keys: HashMap<String, VerifyingKey>,
}

impl PublisherKeyring {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn insert(&mut self, key_id: impl Into<String>, key: VerifyingKey) {
        self.keys.insert(key_id.into(), key);
    }

    pub fn insert_base64(
        &mut self,
        key_id: impl Into<String>,
        encoded_key: &str,
    ) -> Result<(), VerificationError> {
        let bytes = BASE64
            .decode(encoded_key)
            .map_err(|_| VerificationError::InvalidSignature)?;
        let bytes: [u8; 32] = bytes
            .try_into()
            .map_err(|_| VerificationError::InvalidSignature)?;
        let key =
            VerifyingKey::from_bytes(&bytes).map_err(|_| VerificationError::InvalidSignature)?;
        self.insert(key_id, key);
        Ok(())
    }

    fn get(&self, key_id: &str) -> Option<&VerifyingKey> {
        self.keys.get(key_id)
    }
}

pub fn parse_manifest_v1(bytes: &[u8]) -> Result<ModuleManifestV1, VerificationError> {
    if bytes.len() > MAX_MANIFEST_BYTES {
        return Err(VerificationError::ManifestTooLarge);
    }
    let manifest: ModuleManifestV1 = serde_json::from_slice(bytes)
        .map_err(|error| VerificationError::InvalidJson(error.to_string()))?;
    validate_contract(&manifest)?;
    Ok(manifest)
}

pub fn canonical_signing_bytes(manifest: &ModuleManifestV1) -> Result<Vec<u8>, VerificationError> {
    let mut value = serde_json::to_value(manifest)
        .map_err(|error| VerificationError::InvalidJson(error.to_string()))?;
    let object = value
        .as_object_mut()
        .ok_or_else(|| VerificationError::InvalidJson("manifest must be an object".into()))?;
    object.remove("signature");
    serde_json::to_vec(&value).map_err(|error| VerificationError::InvalidJson(error.to_string()))
}

pub fn verify_manifest(
    pack_root: &Path,
    manifest_bytes: &[u8],
    core_version: &Version,
    keyring: &PublisherKeyring,
) -> Result<ManifestVerification, VerificationError> {
    let manifest = parse_manifest_v1(manifest_bytes)?;
    validate_compatibility(&manifest, core_version)?;
    verify_signature(&manifest, keyring)?;
    let files = verify_files(pack_root, &manifest)?;
    let installed_size = files.iter().map(|file| file.size).sum();
    Ok(ManifestVerification {
        manifest,
        files,
        installed_size,
    })
}

fn validate_contract(manifest: &ModuleManifestV1) -> Result<(), VerificationError> {
    if manifest.schema_version != MANIFEST_SCHEMA_V1 {
        return Err(VerificationError::UnsupportedSchema(
            manifest.schema_version,
        ));
    }
    if !is_module_id(&manifest.module_id) {
        return Err(VerificationError::InvalidModuleId(
            manifest.module_id.clone(),
        ));
    }
    Version::parse(&manifest.version)
        .map_err(|_| VerificationError::InvalidVersion(manifest.version.clone()))?;
    VersionReq::parse(&manifest.core_version)
        .map_err(|_| VerificationError::InvalidVersion(manifest.core_version.clone()))?;
    if manifest.publisher.trim().is_empty() || manifest.entitlement_id.trim().is_empty() {
        return Err(VerificationError::InvalidEntry(
            "publisher and entitlementId are required".into(),
        ));
    }
    if manifest.files.is_empty() || manifest.files.len() > MAX_FILES {
        return Err(VerificationError::InvalidEntry(
            "files must contain between 1 and 2048 entries".into(),
        ));
    }

    let mut paths = HashSet::new();
    for file in &manifest.files {
        validate_relative_path(&file.path)?;
        if file.size > MAX_FILE_BYTES {
            return Err(VerificationError::InvalidEntry(format!(
                "{} exceeds the per-file size limit",
                file.path
            )));
        }
        if !is_sha256(&file.sha256) || !paths.insert(file.path.as_str()) {
            return Err(VerificationError::InvalidEntry(file.path.clone()));
        }
    }

    let mut contribution_ids = HashSet::new();
    for contribution in &manifest.ui_contributions {
        if contribution.id.trim().is_empty()
            || contribution.export.trim().is_empty()
            || !contribution_ids.insert(contribution.id.as_str())
        {
            return Err(VerificationError::InvalidEntry(contribution.id.clone()));
        }
        validate_relative_path(&contribution.entrypoint)?;
        require_declared_file(manifest, &contribution.entrypoint)?;
    }

    if let Some(sidecar) = &manifest.sidecar {
        if sidecar.protocol_version != 1 {
            return Err(VerificationError::InvalidEntry(format!(
                "unsupported sidecar protocol {}",
                sidecar.protocol_version
            )));
        }
        validate_relative_path(&sidecar.path)?;
        require_declared_file(manifest, &sidecar.path)?;
    }

    let mut dependency_ids = HashSet::new();
    for dependency in &manifest.dependencies {
        if !is_module_id(&dependency.module_id)
            || dependency.module_id == manifest.module_id
            || !dependency_ids.insert(dependency.module_id.as_str())
        {
            return Err(VerificationError::InvalidEntry(
                dependency.module_id.clone(),
            ));
        }
        VersionReq::parse(&dependency.version)
            .map_err(|_| VerificationError::InvalidVersion(dependency.version.clone()))?;
    }

    let mut capabilities = HashSet::<CoreCapability>::new();
    for capability in &manifest.requested_capabilities {
        if !capabilities.insert(*capability) {
            return Err(VerificationError::InvalidEntry(format!(
                "duplicate capability {capability:?}"
            )));
        }
    }

    for license in &manifest.licenses {
        if license.name.trim().is_empty() {
            return Err(VerificationError::InvalidEntry(
                "license name is required".into(),
            ));
        }
        validate_relative_path(&license.path)?;
        require_declared_file(manifest, &license.path)?;
    }
    Ok(())
}

fn validate_compatibility(
    manifest: &ModuleManifestV1,
    core_version: &Version,
) -> Result<(), VerificationError> {
    if manifest.target != ModuleTarget::WindowsX86_64 {
        return Err(VerificationError::WrongArchitecture);
    }
    let requirement = VersionReq::parse(&manifest.core_version)
        .map_err(|_| VerificationError::InvalidVersion(manifest.core_version.clone()))?;
    if !requirement.matches(core_version) {
        return Err(VerificationError::CoreIncompatible(
            core_version.to_string(),
        ));
    }
    if manifest.host_api_version != HOST_API_V1 {
        return Err(VerificationError::HostApiIncompatible(
            manifest.host_api_version,
        ));
    }
    Ok(())
}

fn verify_signature(
    manifest: &ModuleManifestV1,
    keyring: &PublisherKeyring,
) -> Result<(), VerificationError> {
    if !manifest.signature.algorithm.eq_ignore_ascii_case("ed25519") {
        return Err(VerificationError::UnsupportedSignatureAlgorithm(
            manifest.signature.algorithm.clone(),
        ));
    }
    let key = keyring
        .get(&manifest.signature.key_id)
        .ok_or_else(|| VerificationError::UnknownPublisher(manifest.signature.key_id.clone()))?;
    let signature_bytes = BASE64
        .decode(&manifest.signature.value)
        .map_err(|_| VerificationError::InvalidSignature)?;
    let signature =
        Signature::from_slice(&signature_bytes).map_err(|_| VerificationError::InvalidSignature)?;
    let message = canonical_signing_bytes(manifest)?;
    key.verify(&message, &signature)
        .map_err(|_| VerificationError::InvalidSignature)
}

fn verify_files(
    pack_root: &Path,
    manifest: &ModuleManifestV1,
) -> Result<Vec<FileVerification>, VerificationError> {
    let root = fs::canonicalize(pack_root).map_err(|error| VerificationError::Io {
        path: pack_root.display().to_string(),
        message: error.to_string(),
    })?;
    let mut verified = Vec::with_capacity(manifest.files.len());
    for expected in &manifest.files {
        let path = root.join(&expected.path);
        let metadata = fs::symlink_metadata(&path)
            .map_err(|_| VerificationError::MissingFile(expected.path.clone()))?;
        if !metadata.file_type().is_file() || metadata.file_type().is_symlink() {
            return Err(VerificationError::MissingFile(expected.path.clone()));
        }
        let canonical = fs::canonicalize(&path)
            .map_err(|_| VerificationError::MissingFile(expected.path.clone()))?;
        if !canonical.starts_with(&root) {
            return Err(VerificationError::UnsafePath(expected.path.clone()));
        }
        if metadata.len() != expected.size {
            return Err(VerificationError::FileSizeMismatch(expected.path.clone()));
        }
        let actual_hash = sha256_file(&canonical, &expected.path)?;
        if !actual_hash.eq_ignore_ascii_case(&expected.sha256) {
            return Err(VerificationError::FileHashMismatch(expected.path.clone()));
        }
        verified.push(FileVerification {
            path: expected.path.clone(),
            size: metadata.len(),
            sha256: actual_hash,
        });
    }
    Ok(verified)
}

fn sha256_file(path: &Path, display_path: &str) -> Result<String, VerificationError> {
    let mut file = File::open(path).map_err(|error| VerificationError::Io {
        path: display_path.into(),
        message: error.to_string(),
    })?;
    let mut hasher = Sha256::new();
    let mut buffer = [0_u8; 64 * 1024];
    loop {
        let read = file
            .read(&mut buffer)
            .map_err(|error| VerificationError::Io {
                path: display_path.into(),
                message: error.to_string(),
            })?;
        if read == 0 {
            break;
        }
        hasher.update(&buffer[..read]);
    }
    Ok(format!("{:x}", hasher.finalize()))
}

fn require_declared_file(manifest: &ModuleManifestV1, path: &str) -> Result<(), VerificationError> {
    if manifest.files.iter().any(|file| file.path == path) {
        Ok(())
    } else {
        Err(VerificationError::InvalidEntry(format!(
            "{path} is not in files"
        )))
    }
}

fn validate_relative_path(path: &str) -> Result<(), VerificationError> {
    if path.is_empty()
        || path.contains('\\')
        || path.contains(':')
        || !path
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'/' | b'.' | b'_' | b'-'))
    {
        return Err(VerificationError::UnsafePath(path.into()));
    }
    let candidate = Path::new(path);
    if candidate.is_absolute()
        || !candidate
            .components()
            .all(|component| matches!(component, Component::Normal(_)))
    {
        return Err(VerificationError::UnsafePath(path.into()));
    }
    Ok(())
}

fn is_module_id(value: &str) -> bool {
    value.starts_with("clx.")
        && value.len() <= 64
        && value.bytes().all(|byte| {
            byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'.' || byte == b'-'
        })
        && !value.ends_with('.')
        && !value.contains("..")
}

fn is_sha256(value: &str) -> bool {
    value.len() == 64 && value.bytes().all(|byte| byte.is_ascii_hexdigit())
}

#[cfg(test)]
mod tests {
    use std::fs;

    use base64::{engine::general_purpose::STANDARD as BASE64, Engine as _};
    use ed25519_dalek::{Signer, SigningKey};
    use semver::Version;
    use sha2::{Digest, Sha256};
    use tempfile::tempdir;

    use crate::{
        BackgroundActivationPolicy, LicenseEntry, ModuleFile, SignatureMetadata, UiContribution,
        UiContributionKind,
    };

    use super::*;

    fn signed_fixture(contents: &[u8]) -> (ModuleManifestV1, SigningKey) {
        let signing_key = SigningKey::from_bytes(&[7_u8; 32]);
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
                    size: contents.len() as u64,
                    sha256: format!("{:x}", Sha256::digest(contents)),
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
        let message = canonical_signing_bytes(&manifest).unwrap();
        manifest.signature.value = BASE64.encode(signing_key.sign(&message).to_bytes());
        (manifest, signing_key)
    }

    fn write_pack(contents: &[u8]) -> tempfile::TempDir {
        let dir = tempdir().unwrap();
        fs::create_dir(dir.path().join("ui")).unwrap();
        fs::write(dir.path().join("ui/index.js"), contents).unwrap();
        fs::write(dir.path().join("NOTICE.txt"), b"notice").unwrap();
        dir
    }

    #[test]
    fn accepts_a_signed_compatible_pack_with_matching_files() {
        let contents = b"export const register = () => {};";
        let dir = write_pack(contents);
        let (manifest, signing_key) = signed_fixture(contents);
        let bytes = serde_json::to_vec(&manifest).unwrap();
        let mut keys = PublisherKeyring::new();
        keys.insert("test-publisher", signing_key.verifying_key());

        let verified =
            verify_manifest(dir.path(), &bytes, &Version::parse("0.1.0").unwrap(), &keys).unwrap();
        assert_eq!(verified.manifest.module_id, "clx.quickapps");
        assert_eq!(verified.files.len(), 2);
    }

    #[test]
    fn rejects_modified_files_and_unknown_publishers() {
        let contents = b"export const register = () => {};";
        let dir = write_pack(contents);
        let (manifest, signing_key) = signed_fixture(contents);
        let bytes = serde_json::to_vec(&manifest).unwrap();

        let unknown = verify_manifest(
            dir.path(),
            &bytes,
            &Version::parse("0.1.0").unwrap(),
            &PublisherKeyring::new(),
        )
        .unwrap_err();
        assert!(matches!(unknown, VerificationError::UnknownPublisher(_)));

        fs::write(dir.path().join("ui/index.js"), b"tampered").unwrap();
        let mut keys = PublisherKeyring::new();
        keys.insert("test-publisher", signing_key.verifying_key());
        let modified =
            verify_manifest(dir.path(), &bytes, &Version::parse("0.1.0").unwrap(), &keys)
                .unwrap_err();
        assert!(matches!(modified, VerificationError::FileSizeMismatch(_)));
    }

    #[test]
    fn rejects_traversal_unknown_fields_and_incompatible_core() {
        let contents = b"ok";
        let (mut manifest, signing_key) = signed_fixture(contents);
        manifest.files[0].path = "../outside.js".into();
        let error = parse_manifest_v1(&serde_json::to_vec(&manifest).unwrap()).unwrap_err();
        assert!(matches!(error, VerificationError::UnsafePath(_)));

        let unknown = br#"{"schemaVersion":1,"unexpected":true}"#;
        assert!(matches!(
            parse_manifest_v1(unknown).unwrap_err(),
            VerificationError::InvalidJson(_)
        ));

        let dir = write_pack(contents);
        let (mut incompatible, _) = signed_fixture(contents);
        incompatible.core_version = ">=2.0".into();
        let message = canonical_signing_bytes(&incompatible).unwrap();
        incompatible.signature.value = BASE64.encode(signing_key.sign(&message).to_bytes());
        let mut keys = PublisherKeyring::new();
        keys.insert("test-publisher", signing_key.verifying_key());
        let error = verify_manifest(
            dir.path(),
            &serde_json::to_vec(&incompatible).unwrap(),
            &Version::parse("0.1.0").unwrap(),
            &keys,
        )
        .unwrap_err();
        assert!(matches!(error, VerificationError::CoreIncompatible(_)));
    }

    #[test]
    fn signature_covers_the_contract() {
        let contents = b"ok";
        let dir = write_pack(contents);
        let (mut manifest, signing_key) = signed_fixture(contents);
        manifest.entitlement_id = "clx.changed".into();
        let mut keys = PublisherKeyring::new();
        keys.insert("test-publisher", signing_key.verifying_key());
        let error = verify_manifest(
            dir.path(),
            &serde_json::to_vec(&manifest).unwrap(),
            &Version::parse("0.1.0").unwrap(),
            &keys,
        )
        .unwrap_err();
        assert_eq!(error, VerificationError::InvalidSignature);
    }
}
