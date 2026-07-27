use base64::{engine::general_purpose::STANDARD, Engine as _};
use serde::{Deserialize, Serialize};
use std::{
    collections::{HashMap, HashSet},
    fs,
    path::{Component, Path, PathBuf},
};
use uuid::Uuid;

const MANIFEST_FILE: &str = "manifest.json";
const SCHEMA_VERSION: u32 = 1;
const MAX_MANIFEST_BYTES: u64 = 256 * 1024;
const MAX_ASSET_BYTES: u64 = 4 * 1024 * 1024;
const MAX_PACK_BYTES: u64 = 32 * 1024 * 1024;
const MAX_ASSET_FILES: usize = 64;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PetPackManifestV1 {
    pub schema_version: u32,
    pub id: String,
    pub name: String,
    pub pets: Vec<PetDefinition>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PetDefinition {
    pub id: String,
    pub name: String,
    #[serde(default)]
    pub name_vn: String,
    #[serde(default)]
    pub thumbnail: Option<String>,
    pub display_size: u32,
    #[serde(default = "default_speed_multiplier")]
    pub speed_multiplier: f32,
    pub glow_color: String,
    pub animations: HashMap<String, PetAnimationClip>,
    #[serde(default)]
    pub moves: Vec<PetMoveDefinition>,
}

fn default_speed_multiplier() -> f32 {
    1.0
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PetAnimationClip {
    pub sheet: String,
    pub frame_width: u32,
    pub frame_height: u32,
    pub frame_count: u32,
    pub fps: u32,
    #[serde(default)]
    pub looped: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PetMoveDefinition {
    pub id: String,
    pub label: String,
    pub kind: PetMoveKind,
    pub clip: String,
    #[serde(default)]
    pub primary_color: Option<String>,
    #[serde(default)]
    pub secondary_color: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum PetMoveKind {
    Blink,
    Teleport,
    Beam,
    Clone,
    OrbLunge,
    WebShot,
    WebZip,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct InstalledPetPack {
    pub manifest: PetPackManifestV1,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PetPackDiagnostic {
    pub directory: String,
    pub error: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PetPackListResponse {
    pub packs: Vec<InstalledPetPack>,
    pub errors: Vec<PetPackDiagnostic>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PetAssetPayload {
    pub mime_type: String,
    pub data_base64: String,
}

struct ValidatedPack {
    manifest: PetPackManifestV1,
    assets: Vec<String>,
}

fn pet_root() -> Result<PathBuf, String> {
    let home = dirs::home_dir().ok_or("Cannot determine the home directory")?;
    Ok(home.join(".ai-cli-manager").join("pets"))
}

fn is_slug(value: &str) -> bool {
    let bytes = value.as_bytes();
    !bytes.is_empty()
        && bytes.len() <= 64
        && bytes
            .iter()
            .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || *byte == b'-')
        && bytes[0] != b'-'
        && bytes[bytes.len() - 1] != b'-'
}

fn valid_color(value: &str) -> bool {
    value.len() == 7
        && value.starts_with('#')
        && value[1..].bytes().all(|byte| byte.is_ascii_hexdigit())
}

fn validate_relative_png(value: &str) -> Result<PathBuf, String> {
    let path = Path::new(value);
    if path.is_absolute() || value.contains('\\') {
        return Err(format!(
            "Asset path '{value}' must be a portable relative path"
        ));
    }
    if path
        .components()
        .any(|component| !matches!(component, Component::Normal(_)))
    {
        return Err(format!("Asset path '{value}' contains an unsafe component"));
    }
    if path.extension().and_then(|ext| ext.to_str()) != Some("png") {
        return Err(format!("Asset '{value}' must be a PNG file"));
    }
    Ok(path.to_path_buf())
}

fn ensure_no_symlink(root: &Path, relative: &Path) -> Result<(), String> {
    let mut current = root.to_path_buf();
    for component in relative.components() {
        let Component::Normal(part) = component else {
            return Err("Unsafe asset path".to_string());
        };
        current.push(part);
        let metadata = fs::symlink_metadata(&current)
            .map_err(|error| format!("Cannot access '{}': {error}", relative.display()))?;
        if metadata.file_type().is_symlink() {
            return Err(format!(
                "Symlinks are not allowed in pet packs: '{}'",
                relative.display()
            ));
        }
    }
    Ok(())
}

fn validate_asset(
    root: &Path,
    relative_value: &str,
    expected_geometry: Option<(u32, u32)>,
) -> Result<(String, u64), String> {
    let relative = validate_relative_png(relative_value)?;
    ensure_no_symlink(root, &relative)?;

    let canonical_root =
        fs::canonicalize(root).map_err(|error| format!("Cannot resolve pack root: {error}"))?;
    let target = root.join(&relative);
    let canonical_target = fs::canonicalize(&target)
        .map_err(|error| format!("Cannot resolve asset '{}': {error}", relative.display()))?;
    if !canonical_target.starts_with(&canonical_root) {
        return Err(format!(
            "Asset '{}' resolves outside the selected pack",
            relative.display()
        ));
    }

    let metadata = fs::metadata(&canonical_target)
        .map_err(|error| format!("Cannot inspect asset '{}': {error}", relative.display()))?;
    if !metadata.is_file() {
        return Err(format!("Asset '{}' is not a file", relative.display()));
    }
    if metadata.len() > MAX_ASSET_BYTES {
        return Err(format!(
            "Asset '{}' exceeds the 4 MiB limit",
            relative.display()
        ));
    }

    let dimensions = image::image_dimensions(&canonical_target)
        .map_err(|error| format!("Cannot decode PNG '{}': {error}", relative.display()))?;
    if let Some(expected) = expected_geometry {
        if dimensions != expected {
            return Err(format!(
                "Asset '{}' is {}x{} but the manifest requires {}x{}",
                relative.display(),
                dimensions.0,
                dimensions.1,
                expected.0,
                expected.1
            ));
        }
    }

    Ok((relative_value.to_string(), metadata.len()))
}

fn read_and_validate_pack(root: &Path) -> Result<ValidatedPack, String> {
    let manifest_path = root.join(MANIFEST_FILE);
    let metadata = fs::symlink_metadata(&manifest_path)
        .map_err(|error| format!("Missing manifest.json: {error}"))?;
    if metadata.file_type().is_symlink() || !metadata.is_file() {
        return Err("manifest.json must be a regular file".to_string());
    }
    if metadata.len() > MAX_MANIFEST_BYTES {
        return Err("manifest.json exceeds the 256 KiB limit".to_string());
    }

    let raw = fs::read_to_string(&manifest_path)
        .map_err(|error| format!("Cannot read manifest.json: {error}"))?;
    let manifest: PetPackManifestV1 =
        serde_json::from_str(&raw).map_err(|error| format!("Invalid manifest.json: {error}"))?;

    if manifest.schema_version != SCHEMA_VERSION {
        return Err(format!(
            "Unsupported pet-pack schema version {}; expected {}",
            manifest.schema_version, SCHEMA_VERSION
        ));
    }
    if !is_slug(&manifest.id) {
        return Err("Pack id must be a lowercase ASCII slug".to_string());
    }
    if manifest.name.trim().is_empty() || manifest.name.len() > 96 {
        return Err("Pack name must contain 1-96 characters".to_string());
    }
    if manifest.pets.is_empty() || manifest.pets.len() > 16 {
        return Err("A pack must contain 1-16 pets".to_string());
    }

    let mut pet_ids = HashSet::new();
    let mut unique_assets: HashMap<String, u64> = HashMap::new();

    for pet in &manifest.pets {
        if !is_slug(&pet.id) || !pet_ids.insert(pet.id.clone()) {
            return Err(format!("Pet id '{}' is invalid or duplicated", pet.id));
        }
        if pet.name.trim().is_empty() || pet.name.len() > 96 || pet.name_vn.len() > 96 {
            return Err(format!("Pet '{}' has an invalid display name", pet.id));
        }
        if !(24..=160).contains(&pet.display_size) {
            return Err(format!(
                "Pet '{}' displaySize must be between 24 and 160",
                pet.id
            ));
        }
        if !(0.25..=3.0).contains(&pet.speed_multiplier) {
            return Err(format!(
                "Pet '{}' speedMultiplier must be between 0.25 and 3.0",
                pet.id
            ));
        }
        if !valid_color(&pet.glow_color) {
            return Err(format!("Pet '{}' glowColor must use #RRGGBB", pet.id));
        }
        for required in ["idle", "travel", "blink"] {
            if !pet.animations.contains_key(required) {
                return Err(format!("Pet '{}' is missing the '{required}' clip", pet.id));
            }
        }
        if pet.moves.len() > 2 {
            return Err(format!("Pet '{}' exposes more than two moves", pet.id));
        }

        let mut move_ids = HashSet::new();
        for movement in &pet.moves {
            if !is_slug(&movement.id) || !move_ids.insert(movement.id.clone()) {
                return Err(format!(
                    "Pet '{}' has an invalid or duplicated move id '{}'",
                    pet.id, movement.id
                ));
            }
            if movement.label.trim().is_empty() || movement.label.len() > 96 {
                return Err(format!("Move '{}' has an invalid label", movement.id));
            }
            if !pet.animations.contains_key(&movement.clip) {
                return Err(format!(
                    "Move '{}' references missing clip '{}'",
                    movement.id, movement.clip
                ));
            }
            for color in [&movement.primary_color, &movement.secondary_color]
                .into_iter()
                .flatten()
            {
                if !valid_color(color) {
                    return Err(format!("Move '{}' has an invalid color", movement.id));
                }
            }
        }

        for (clip_id, clip) in &pet.animations {
            if !is_slug(clip_id) {
                return Err(format!("Pet '{}' has invalid clip id '{clip_id}'", pet.id));
            }
            if !(32..=256).contains(&clip.frame_width)
                || !(32..=256).contains(&clip.frame_height)
                || !(1..=32).contains(&clip.frame_count)
                || !(1..=30).contains(&clip.fps)
            {
                return Err(format!("Clip '{clip_id}' has unsupported frame metadata"));
            }
            let sheet_width = clip
                .frame_width
                .checked_mul(clip.frame_count)
                .ok_or_else(|| format!("Clip '{clip_id}' sheet width overflows"))?;
            if sheet_width > 8192 {
                return Err(format!("Clip '{clip_id}' sheet exceeds 8192 pixels"));
            }
            let (asset, size) =
                validate_asset(root, &clip.sheet, Some((sheet_width, clip.frame_height)))?;
            unique_assets.entry(asset).or_insert(size);
        }

        if let Some(thumbnail) = &pet.thumbnail {
            let (asset, size) = validate_asset(root, thumbnail, None)?;
            unique_assets.entry(asset).or_insert(size);
        }
    }

    if unique_assets.len() > MAX_ASSET_FILES {
        return Err(format!(
            "Pack references more than {MAX_ASSET_FILES} asset files"
        ));
    }
    let total_bytes: u64 = unique_assets.values().sum();
    if total_bytes > MAX_PACK_BYTES {
        return Err("Pack exceeds the 32 MiB asset limit".to_string());
    }

    let mut assets: Vec<String> = unique_assets.into_keys().collect();
    assets.sort();
    Ok(ValidatedPack { manifest, assets })
}

fn copy_validated_pack(
    source_root: &Path,
    destination_root: &Path,
    pack: &ValidatedPack,
) -> Result<(), String> {
    fs::create_dir_all(destination_root)
        .map_err(|error| format!("Cannot create install staging directory: {error}"))?;

    let manifest_json = serde_json::to_vec_pretty(&pack.manifest)
        .map_err(|error| format!("Cannot serialize manifest: {error}"))?;
    fs::write(destination_root.join(MANIFEST_FILE), manifest_json)
        .map_err(|error| format!("Cannot write installed manifest: {error}"))?;

    for asset in &pack.assets {
        let relative = Path::new(asset);
        let destination = destination_root.join(relative);
        if let Some(parent) = destination.parent() {
            fs::create_dir_all(parent)
                .map_err(|error| format!("Cannot create asset directory: {error}"))?;
        }
        fs::copy(source_root.join(relative), &destination)
            .map_err(|error| format!("Cannot install asset '{asset}': {error}"))?;
    }
    Ok(())
}

fn install_pack_at(
    install_root: &Path,
    source_dir: &Path,
    replace_existing: bool,
) -> Result<InstalledPetPack, String> {
    let source = fs::canonicalize(source_dir)
        .map_err(|error| format!("Cannot resolve selected pack folder: {error}"))?;
    if !source.is_dir() {
        return Err("Selected pet-pack source is not a directory".to_string());
    }
    let validated = read_and_validate_pack(&source)?;

    fs::create_dir_all(install_root)
        .map_err(|error| format!("Cannot create the pet-pack directory: {error}"))?;
    let target = install_root.join(&validated.manifest.id);
    if target.exists() && !replace_existing {
        return Err(format!(
            "Pet pack '{}' is already installed",
            validated.manifest.id
        ));
    }

    let nonce = Uuid::new_v4();
    let staging = install_root.join(format!(".install-{nonce}"));
    let backup = install_root.join(format!(".backup-{}-{nonce}", validated.manifest.id));

    let result = (|| {
        copy_validated_pack(&source, &staging, &validated)?;
        read_and_validate_pack(&staging)?;

        if target.exists() {
            fs::rename(&target, &backup)
                .map_err(|error| format!("Cannot stage the existing pet pack: {error}"))?;
        }
        if let Err(error) = fs::rename(&staging, &target) {
            if backup.exists() {
                let _ = fs::rename(&backup, &target);
            }
            return Err(format!("Cannot activate the imported pet pack: {error}"));
        }
        if backup.exists() {
            let _ = fs::remove_dir_all(&backup);
        }
        Ok(InstalledPetPack {
            manifest: validated.manifest.clone(),
        })
    })();

    if staging.exists() {
        let _ = fs::remove_dir_all(&staging);
    }
    result
}

fn list_packs_at(install_root: &Path) -> Result<PetPackListResponse, String> {
    if !install_root.exists() {
        return Ok(PetPackListResponse {
            packs: Vec::new(),
            errors: Vec::new(),
        });
    }

    let mut packs = Vec::new();
    let mut errors = Vec::new();
    let entries = fs::read_dir(install_root)
        .map_err(|error| format!("Cannot read the pet-pack directory: {error}"))?;
    for entry in entries {
        let entry = match entry {
            Ok(value) => value,
            Err(error) => {
                errors.push(PetPackDiagnostic {
                    directory: "(unreadable)".to_string(),
                    error: error.to_string(),
                });
                continue;
            }
        };
        let file_name = entry.file_name().to_string_lossy().to_string();
        if file_name.starts_with('.') || !entry.path().is_dir() {
            continue;
        }
        match read_and_validate_pack(&entry.path()) {
            Ok(validated) => packs.push(InstalledPetPack {
                manifest: validated.manifest,
            }),
            Err(error) => errors.push(PetPackDiagnostic {
                directory: file_name,
                error,
            }),
        }
    }
    packs.sort_by(|left, right| left.manifest.name.cmp(&right.manifest.name));
    Ok(PetPackListResponse { packs, errors })
}

fn load_asset_at(
    install_root: &Path,
    pack_id: &str,
    relative_path: &str,
) -> Result<PetAssetPayload, String> {
    if !is_slug(pack_id) {
        return Err("Invalid pet-pack id".to_string());
    }
    let pack_root = install_root.join(pack_id);
    let validated = read_and_validate_pack(&pack_root)?;
    if !validated.assets.iter().any(|asset| asset == relative_path) {
        return Err("The requested image is not declared by this pet pack".to_string());
    }
    let relative = validate_relative_png(relative_path)?;
    ensure_no_symlink(&pack_root, &relative)?;
    let canonical_root = fs::canonicalize(&pack_root)
        .map_err(|error| format!("Cannot resolve installed pack: {error}"))?;
    let target = fs::canonicalize(pack_root.join(relative))
        .map_err(|error| format!("Cannot resolve pet asset: {error}"))?;
    if !target.starts_with(canonical_root) {
        return Err("Pet asset resolves outside its installed pack".to_string());
    }
    let bytes = fs::read(target).map_err(|error| format!("Cannot read pet asset: {error}"))?;
    Ok(PetAssetPayload {
        mime_type: "image/png".to_string(),
        data_base64: STANDARD.encode(bytes),
    })
}

#[tauri::command]
pub fn pet_list_packs() -> Result<PetPackListResponse, String> {
    list_packs_at(&pet_root()?)
}

#[tauri::command]
pub fn pet_install_pack(
    source_dir: String,
    replace_existing: bool,
) -> Result<InstalledPetPack, String> {
    install_pack_at(&pet_root()?, Path::new(&source_dir), replace_existing)
}

#[tauri::command]
pub fn pet_load_asset(pack_id: String, relative_path: String) -> Result<PetAssetPayload, String> {
    load_asset_at(&pet_root()?, &pack_id, &relative_path)
}

#[cfg(test)]
mod tests {
    use super::*;
    use image::{Rgba, RgbaImage};

    fn temp_dir(label: &str) -> PathBuf {
        let path = std::env::temp_dir().join(format!("clx-pet-{label}-{}", Uuid::new_v4()));
        fs::create_dir_all(&path).unwrap();
        path
    }

    fn write_sheet(path: &Path, frame_width: u32, frame_height: u32, frames: u32) {
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).unwrap();
        }
        let image = RgbaImage::from_pixel(
            frame_width * frames,
            frame_height,
            Rgba([40, 180, 255, 255]),
        );
        image.save(path).unwrap();
    }

    fn valid_manifest(sheet: &str) -> PetPackManifestV1 {
        let animations = ["idle", "travel", "blink"]
            .into_iter()
            .map(|id| {
                (
                    id.to_string(),
                    PetAnimationClip {
                        sheet: sheet.to_string(),
                        frame_width: 32,
                        frame_height: 32,
                        frame_count: 2,
                        fps: 8,
                        looped: id != "blink",
                    },
                )
            })
            .collect();
        PetPackManifestV1 {
            schema_version: 1,
            id: "test-pack".to_string(),
            name: "Test Pack".to_string(),
            pets: vec![PetDefinition {
                id: "test-pet".to_string(),
                name: "Test Pet".to_string(),
                name_vn: String::new(),
                thumbnail: None,
                display_size: 96,
                speed_multiplier: 1.0,
                glow_color: "#22d3ee".to_string(),
                animations,
                moves: Vec::new(),
            }],
        }
    }

    fn write_manifest(root: &Path, manifest: &PetPackManifestV1) {
        fs::write(
            root.join(MANIFEST_FILE),
            serde_json::to_vec_pretty(manifest).unwrap(),
        )
        .unwrap();
    }

    #[test]
    fn validates_installs_lists_and_loads_a_pack() {
        let source = temp_dir("source");
        let install = temp_dir("install");
        write_sheet(&source.join("pet/sheet.png"), 32, 32, 2);
        write_manifest(&source, &valid_manifest("pet/sheet.png"));

        let installed = install_pack_at(&install, &source, false).unwrap();
        assert_eq!(installed.manifest.id, "test-pack");
        assert_eq!(list_packs_at(&install).unwrap().packs.len(), 1);
        let payload = load_asset_at(&install, "test-pack", "pet/sheet.png").unwrap();
        assert_eq!(payload.mime_type, "image/png");
        assert!(!payload.data_base64.is_empty());

        fs::remove_dir_all(source).unwrap();
        fs::remove_dir_all(install).unwrap();
    }

    #[test]
    fn rejects_escaping_paths() {
        let source = temp_dir("traversal");
        write_manifest(&source, &valid_manifest("../outside.png"));
        let error = read_and_validate_pack(&source).err().unwrap();
        assert!(error.contains("unsafe") || error.contains("portable"));
        fs::remove_dir_all(source).unwrap();
    }

    #[test]
    fn rejects_sheet_geometry_mismatch() {
        let source = temp_dir("geometry");
        write_sheet(&source.join("pet/sheet.png"), 32, 32, 1);
        write_manifest(&source, &valid_manifest("pet/sheet.png"));
        let error = read_and_validate_pack(&source).err().unwrap();
        assert!(error.contains("manifest requires"));
        fs::remove_dir_all(source).unwrap();
    }

    #[test]
    fn replacement_keeps_one_valid_pack() {
        let first = temp_dir("replace-first");
        let second = temp_dir("replace-second");
        let install = temp_dir("replace-install");
        write_sheet(&first.join("pet/sheet.png"), 32, 32, 2);
        write_sheet(&second.join("pet/sheet.png"), 32, 32, 2);
        let mut first_manifest = valid_manifest("pet/sheet.png");
        let mut second_manifest = valid_manifest("pet/sheet.png");
        first_manifest.name = "First".to_string();
        second_manifest.name = "Second".to_string();
        write_manifest(&first, &first_manifest);
        write_manifest(&second, &second_manifest);

        install_pack_at(&install, &first, false).unwrap();
        assert!(install_pack_at(&install, &second, false).is_err());
        install_pack_at(&install, &second, true).unwrap();
        assert_eq!(
            list_packs_at(&install).unwrap().packs[0].manifest.name,
            "Second"
        );

        fs::remove_dir_all(first).unwrap();
        fs::remove_dir_all(second).unwrap();
        fs::remove_dir_all(install).unwrap();
    }

    #[test]
    fn validates_optional_local_pack_fixture() {
        let Ok(source) = std::env::var("CLX_PET_PACK_FIXTURE") else {
            return;
        };
        let source = PathBuf::from(source);
        let install = temp_dir("real-pack-install");

        let installed = install_pack_at(&install, &source, false).unwrap();
        assert_eq!(installed.manifest.id, "anime-heroes-modern");
        assert_eq!(installed.manifest.pets.len(), 3);
        for pet in &installed.manifest.pets {
            assert_eq!(pet.display_size, 32);
            assert!((pet.speed_multiplier - 1.3).abs() < f32::EPSILON);
        }

        let listed = list_packs_at(&install).unwrap();
        assert!(listed.errors.is_empty());
        assert_eq!(listed.packs.len(), 1);

        for pet in &installed.manifest.pets {
            for clip in pet.animations.values() {
                let payload = load_asset_at(&install, &installed.manifest.id, &clip.sheet).unwrap();
                assert_eq!(payload.mime_type, "image/png");
                assert!(!payload.data_base64.is_empty());
            }
        }

        fs::remove_dir_all(install).unwrap();
    }
}
