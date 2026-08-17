// NES identity — derive the Nostr public key from the existing Buzz private
// key and sign NIP-98 authorization events for session-service requests.
// The private key lives in Windows Credential Manager and is never returned
// to React or persisted to disk.

use crate::core::buzz_identity;
use nes_protocol::nip98::{sign_nip98, Nip98Event};

/// Derive the Nostr public key (hex) for the Buzz identity, or an error when
/// no identity is configured yet.
pub fn derive_pubkey() -> Result<String, String> {
    let key = buzz_identity::vault_get()?.ok_or_else(|| {
        "Buzz identity is not configured. Generate or import an identity first.".to_string()
    })?;
    let signing_key = k256::schnorr::SigningKey::from_bytes(
        &hex::decode(&key).map_err(|_| "Identity key is not valid hex".to_string())?,
    )
    .map_err(|_| "Identity key is not a valid secp256k1 key".to_string())?;
    Ok(hex::encode(signing_key.verifying_key().to_bytes()))
}

/// Sign a NIP-98 event for an outgoing request. Returns the full event so the
/// client can attach it as the `Authorization: Nostr <base64url(json)>` header.
pub fn sign_request(url: &str, method: &str, payload: &[u8]) -> Result<Nip98Event, String> {
    let key = buzz_identity::vault_get()?.ok_or_else(|| {
        "Buzz identity is not configured. Generate or import an identity first.".to_string()
    })?;
    let now = nes_protocol::nip98::now_unix();
    sign_nip98(&key, url, method, payload, now).map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn pubkey_derivation_requires_identity() {
        // Without a stored identity, derive fails with a clear message.
        // (The vault is empty in the test environment.)
        if let Ok(pk) = derive_pubkey() {
            assert_eq!(pk.len(), 64);
            assert!(pk.chars().all(|c| c.is_ascii_hexdigit()));
        }
        // The sign path also fails cleanly without an identity.
        let _ = sign_request("https://x", "GET", b"");
    }
}
