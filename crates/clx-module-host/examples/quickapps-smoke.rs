use std::{env, path::PathBuf, sync::Arc};

use clx_module_contracts::{CommunityEntitlementProvider, ModuleRuntimeState, PublisherKeyring};
use clx_module_host::ModuleHost;

#[tokio::main(flavor = "current_thread")]
async fn main() {
    if let Err(error) = run().await {
        eprintln!("Quick Apps module smoke failed: {error}");
        std::process::exit(1);
    }
}

async fn run() -> Result<(), String> {
    let mut args = env::args().skip(1);
    let modules_root = PathBuf::from(args.next().ok_or("modules root is required")?);
    let core_version = args.next().ok_or("Core version is required")?;
    let key_id = args.next().ok_or("publisher key id is required")?;
    let public_key = args.next().ok_or("publisher public key is required")?;
    if args.next().is_some() {
        return Err("unexpected extra argument".into());
    }

    let fixture = tempfile::tempdir().map_err(|error| error.to_string())?;
    let mut keyring = PublisherKeyring::new();
    keyring
        .insert_base64(key_id, &public_key)
        .map_err(|error| error.to_string())?;
    let host = ModuleHost::new(
        modules_root,
        fixture.path().join("data/modules.json"),
        &core_version,
        keyring,
        Arc::new(CommunityEntitlementProvider),
    )?;
    let snapshot = host.snapshot("clx.quickapps");
    if snapshot.state != ModuleRuntimeState::Ready {
        return Err(format!("unexpected snapshot: {snapshot:?}"));
    }
    let apps = host
        .call("clx.quickapps", "clx.quickapps.list", serde_json::json!({}))
        .await?;
    if !apps.is_array() {
        return Err("Quick Apps list result was not an array".into());
    }
    host.shutdown().await;
    println!(
        "Quick Apps host/sidecar smoke passed with {} isolated app records",
        apps.as_array().map_or(0, Vec::len)
    );
    Ok(())
}
