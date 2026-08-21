use std::{env, fs, path::PathBuf};

use clx_module_contracts::{verify_manifest, PublisherKeyring};
use semver::Version;

fn main() {
    if let Err(error) = run() {
        eprintln!("pack verification failed: {error}");
        std::process::exit(1);
    }
}

fn run() -> Result<(), String> {
    let mut args = env::args().skip(1);
    let pack_root = PathBuf::from(args.next().ok_or("pack root is required")?);
    let core_version = Version::parse(&args.next().ok_or("Core version is required")?)
        .map_err(|error| error.to_string())?;
    let key_id = args.next().ok_or("publisher key id is required")?;
    let public_key = args.next().ok_or("publisher public key is required")?;
    if args.next().is_some() {
        return Err("unexpected extra argument".into());
    }
    let manifest = fs::read(pack_root.join("manifest.json")).map_err(|error| error.to_string())?;
    let mut keyring = PublisherKeyring::new();
    keyring
        .insert_base64(key_id, &public_key)
        .map_err(|error| error.to_string())?;
    let verified = verify_manifest(&pack_root, &manifest, &core_version, &keyring)
        .map_err(|error| error.to_string())?;
    println!(
        "verified {} {} ({} files, {} bytes)",
        verified.manifest.module_id,
        verified.manifest.version,
        verified.files.len(),
        verified.installed_size
    );
    Ok(())
}
