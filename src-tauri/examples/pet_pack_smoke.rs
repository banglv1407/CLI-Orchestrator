use clx::pet_commands::{pet_install_pack, pet_list_packs, pet_load_asset};
use std::env;

fn main() -> Result<(), String> {
    let args: Vec<String> = env::args().collect();
    let source_dir = args
        .get(1)
        .cloned()
        .ok_or("Usage: pet_pack_smoke <pack-directory>")?;
    let replace_existing = args.iter().any(|argument| argument == "--replace");

    let installed = pet_install_pack(source_dir, replace_existing)?;
    let pack_id = installed.manifest.id.clone();
    let listed = pet_list_packs()?;
    let listed_pack = listed
        .packs
        .iter()
        .find(|pack| pack.manifest.id == pack_id)
        .ok_or_else(|| format!("Installed pack '{pack_id}' was not returned by pet_list_packs"))?;

    let mut loaded_assets = 0usize;
    for pet in &listed_pack.manifest.pets {
        for clip in pet.animations.values() {
            let asset = pet_load_asset(pack_id.clone(), clip.sheet.clone())?;
            if asset.mime_type != "image/png" || asset.data_base64.is_empty() {
                return Err(format!(
                    "Asset '{}' did not return a valid PNG payload",
                    clip.sheet
                ));
            }
            loaded_assets += 1;
        }
    }

    println!(
        "Installed pack '{}' with {} pets and loaded {} animation sheets.",
        listed_pack.manifest.name,
        listed_pack.manifest.pets.len(),
        loaded_assets
    );
    Ok(())
}
