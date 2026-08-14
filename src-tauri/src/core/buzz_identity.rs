// Buzz identity vault — stores the Nostr private key in Windows Credential
// Manager and exposes generation/import primitives. The private key never
// lives in plaintext on disk or in React state; it is only read at spawn time
// and injected into the buzz.exe child process environment.

const BUZZ_IDENTITY_TARGET: &str = "CLX-Buzz-Identity";

#[cfg(target_os = "windows")]
fn wide_null(value: &str) -> Vec<u16> {
    use std::os::windows::ffi::OsStrExt;
    std::ffi::OsStr::new(value)
        .encode_wide()
        .chain(std::iter::once(0))
        .collect()
}

#[cfg(target_os = "windows")]
pub fn vault_set(secret: &str) -> Result<(), String> {
    use windows_sys::Win32::Security::Credentials::{
        CredWriteW, CREDENTIALW, CRED_PERSIST_LOCAL_MACHINE, CRED_TYPE_GENERIC,
    };
    use zeroize::Zeroize;
    let mut target = wide_null(BUZZ_IDENTITY_TARGET);
    let mut user = wide_null("CLX Buzz Identity");
    let mut blob = secret.as_bytes().to_vec();
    let credential = CREDENTIALW {
        Flags: 0,
        Type: CRED_TYPE_GENERIC,
        TargetName: target.as_mut_ptr(),
        Comment: std::ptr::null_mut(),
        LastWritten: unsafe { std::mem::zeroed() },
        CredentialBlobSize: blob.len() as u32,
        CredentialBlob: blob.as_mut_ptr(),
        Persist: CRED_PERSIST_LOCAL_MACHINE,
        AttributeCount: 0,
        Attributes: std::ptr::null_mut(),
        TargetAlias: std::ptr::null_mut(),
        UserName: user.as_mut_ptr(),
    };
    let ok = unsafe { CredWriteW(&credential, 0) };
    blob.zeroize();
    if ok == 0 {
        return Err(format!(
            "Windows Credential Manager rejected the Buzz identity: {}",
            std::io::Error::last_os_error()
        ));
    }
    Ok(())
}

#[cfg(not(target_os = "windows"))]
pub fn vault_set(_secret: &str) -> Result<(), String> {
    Err("Buzz identity vault is Windows-only in V1".to_string())
}

#[cfg(target_os = "windows")]
pub fn vault_get() -> Result<Option<String>, String> {
    use windows_sys::Win32::Security::Credentials::{
        CredFree, CredReadW, CREDENTIALW, CRED_TYPE_GENERIC,
    };
    let target = wide_null(BUZZ_IDENTITY_TARGET);
    let mut pointer: *mut CREDENTIALW = std::ptr::null_mut();
    let ok = unsafe { CredReadW(target.as_ptr(), CRED_TYPE_GENERIC, 0, &mut pointer) };
    if ok == 0 || pointer.is_null() {
        return Ok(None);
    }
    let credential = unsafe { &*pointer };
    let bytes = unsafe {
        std::slice::from_raw_parts(
            credential.CredentialBlob,
            credential.CredentialBlobSize as usize,
        )
    };
    let result = String::from_utf8(bytes.to_vec())
        .map(Some)
        .map_err(|error| format!("Stored Buzz identity is not UTF-8: {error}"));
    unsafe { CredFree(pointer.cast()) };
    result
}

#[cfg(not(target_os = "windows"))]
pub fn vault_get() -> Result<Option<String>, String> {
    Ok(None)
}

#[cfg(target_os = "windows")]
pub fn vault_delete() -> Result<(), String> {
    use windows_sys::Win32::Security::Credentials::{CredDeleteW, CRED_TYPE_GENERIC};
    let target = wide_null(BUZZ_IDENTITY_TARGET);
    let ok = unsafe { CredDeleteW(target.as_ptr(), CRED_TYPE_GENERIC, 0) };
    if ok == 0 {
        let error = std::io::Error::last_os_error();
        if error.raw_os_error() != Some(1168) {
            return Err(format!("Failed to delete Buzz identity: {error}"));
        }
    }
    Ok(())
}

#[cfg(not(target_os = "windows"))]
pub fn vault_delete() -> Result<(), String> {
    Ok(())
}

/// Generate a fresh Nostr private key (32 random bytes, hex-encoded).
/// The corresponding public key is derived by the buzz CLI itself; CLX does not
/// need secp256k1 locally for V1.
pub fn generate_private_key() -> String {
    use rand::RngExt;
    let mut rng = rand::rng();
    let mut bytes = [0u8; 32];
    rng.fill(&mut bytes);
    hex::encode(bytes)
}
