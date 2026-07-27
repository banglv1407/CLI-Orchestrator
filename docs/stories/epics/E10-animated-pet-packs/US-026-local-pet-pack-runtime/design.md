# Design

## Domain Model

`PetPackManifestV1` contains pack metadata and pet definitions. Each pet
declares 128x128 horizontal PNG clips and up to two supported signature move
kinds. Identifiers are lowercase ASCII slugs and unique within their scope.

## Application Flow

`pet_install_pack` validates a selected folder into a staging directory and
then replaces an existing installation only after explicit confirmation.
`pet_list_packs` returns installed manifests and diagnostics.
`pet_load_asset` accepts a pack ID and manifest-relative asset path, validates
the canonical target, and returns a base64 PNG payload.

## Interface Contract

- `pet_list_packs() -> PetPackListResponse`
- `pet_install_pack(source_dir, replace_existing) -> InstalledPetPack`
- `pet_load_asset(pack_id, relative_path) -> PetAssetPayload`

Errors are actionable strings for invalid manifests, unsafe paths, unsupported
images, size limits, duplicate installs, and missing assets.

## Data Model

No database migration. Packs are directories under
`~/.ai-cli-manager/pets/<pack-id>`.

## UI / Platform Impact

Settings can choose a folder, confirm replacement, refresh the merged registry,
and show invalid-pack errors. Path handling uses Rust `PathBuf` and canonical
containment checks.

## Observability

Importer and loader failures return bounded error text; no binary asset content
or user path is written to application logs.

## Alternatives Considered

1. Tauri's broad asset protocol was rejected to avoid granting frontend access
   to arbitrary local paths.
2. ZIP import was deferred to avoid archive traversal and extraction cleanup.
