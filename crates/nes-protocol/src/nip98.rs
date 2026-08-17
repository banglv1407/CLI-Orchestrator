//! NIP-98 HTTP Auth: event construction and verification.
//!
//! The desktop client constructs + signs an event (kind `27235`) with
//! `nostr` secp256k1 Schnorr. The session service verifies it against the
//! exact request URL, method, optional payload hash, and a replay cache.
//!
//! We implement Schnorr signing with the pure-Rust `k256` crate so the CLX
//! desktop app (Windows/MSVC) does not need a C toolchain for libsecp256k1.

use k256::ecdsa::signature::hazmat::{PrehashSigner, PrehashVerifier};
use k256::schnorr::SigningKey;
use sha2::{Digest, Sha256};
use std::time::{SystemTime, UNIX_EPOCH};

pub const NIP98_KIND: u32 = 27235;

/// Maximum allowed clock skew for `created_at`, in seconds.
pub const MAX_CLOCK_SKEW_SECS: i64 = 60;

/// The unsigned event fields before signature. `id` is the SHA-256 of the
/// canonical JSON serialization (per NIP-01); `sig` is a 64-byte Schnorr hex.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Nip98Event {
    pub id: String,
    pub pubkey: String,
    pub created_at: i64,
    pub kind: u32,
    pub tags: Vec<Vec<String>>,
    pub content: String,
    pub sig: String,
}

/// Build and sign a NIP-98 authorization event for a request.
///
/// `payload` is the raw request body (empty string when there is none). The
/// event `content` is empty; the payload hash is carried in a `payload` tag.
pub fn sign_nip98(
    private_key_hex: &str,
    url: &str,
    method: &str,
    payload: &[u8],
    now: i64,
) -> Result<Nip98Event, crate::NesProtocolError> {
    let signing_key = SigningKey::from_bytes(&hex::decode(private_key_hex).map_err(|_| {
        crate::NesProtocolError::InvalidJson("private key is not valid hex".into())
    })?)
    .map_err(|_| {
        crate::NesProtocolError::InvalidJson("private key is not a valid secp256k1 key".into())
    })?;
    let verifying_key = signing_key.verifying_key();
    let pubkey = hex::encode(verifying_key.to_bytes());

    let mut tags: Vec<Vec<String>> = vec![
        vec!["u".into(), url.into()],
        vec!["method".into(), method.to_ascii_uppercase()],
    ];
    if !payload.is_empty() {
        let digest = hex::encode(Sha256::digest(payload));
        tags.push(vec!["payload".into(), digest]);
    }

    let mut event = Nip98Event {
        id: String::new(),
        pubkey,
        created_at: now,
        kind: NIP98_KIND,
        tags,
        content: String::new(),
        sig: String::new(),
    };
    event.id = compute_id(&event);
    let id_bytes = hex::decode(&event.id)
        .map_err(|_| crate::NesProtocolError::InvalidJson("bad id".into()))?;
    let sig = signing_key
        .sign_prehash(&id_bytes)
        .map_err(|_| crate::NesProtocolError::InvalidJson("signing failed".into()))?;
    event.sig = hex::encode(sig.to_bytes());
    Ok(event)
}

/// Serialize an event to the canonical NIP-01 JSON form used to compute the id:
/// `[0, pubkey, created_at, kind, tags, content]`.
pub fn canonical_event_json(
    pubkey: &str,
    created_at: i64,
    kind: u32,
    tags: &[Vec<String>],
    content: &str,
) -> String {
    serde_json::to_string(&serde_json::json!([
        0, pubkey, created_at, kind, tags, content
    ]))
    .unwrap_or_default()
}

pub fn compute_id(event: &Nip98Event) -> String {
    let json = canonical_event_json(
        &event.pubkey,
        event.created_at,
        event.kind,
        &event.tags,
        &event.content,
    );
    hex::encode(Sha256::digest(json.as_bytes()))
}

/// Verify a NIP-98 event against the expected request properties.
///
/// Checks (in order): kind, `created_at` within skew, exact `u` URL and
/// `method` tags, `payload` tag matches the body hash when a body is present,
/// event id recomputes correctly, and the Schnorr signature verifies for the
/// claimed pubkey.
pub fn verify_nip98(
    event: &Nip98Event,
    url: &str,
    method: &str,
    payload: &[u8],
    now: i64,
) -> Result<(), crate::NesProtocolError> {
    if event.kind != NIP98_KIND {
        return Err(crate::NesProtocolError::InvalidJson(
            "wrong event kind".into(),
        ));
    }
    if (event.created_at - now).abs() > MAX_CLOCK_SKEW_SECS {
        return Err(crate::NesProtocolError::InvalidJson(
            "event created_at outside clock skew".into(),
        ));
    }
    // recompute id
    let recomputed = compute_id(event);
    if recomputed != event.id {
        return Err(crate::NesProtocolError::InvalidJson(
            "event id mismatch".into(),
        ));
    }
    // tags
    let url_ok = event
        .tags
        .iter()
        .any(|t| t.len() >= 2 && t[0] == "u" && t[1] == url);
    let method_ok = event
        .tags
        .iter()
        .any(|t| t.len() >= 2 && t[0] == "method" && t[1] == method.to_ascii_uppercase());
    if !url_ok || !method_ok {
        return Err(crate::NesProtocolError::InvalidJson(
            "u/method tag mismatch".into(),
        ));
    }
    if !payload.is_empty() {
        let expected = hex::encode(Sha256::digest(payload));
        let payload_ok = event
            .tags
            .iter()
            .any(|t| t.len() >= 2 && t[0] == "payload" && t[1] == expected);
        if !payload_ok {
            return Err(crate::NesProtocolError::InvalidJson(
                "payload hash mismatch".into(),
            ));
        }
    }
    // signature
    let pubkey_bytes = hex::decode(&event.pubkey)
        .map_err(|_| crate::NesProtocolError::InvalidJson("bad pubkey".into()))?;
    let sig_bytes = hex::decode(&event.sig)
        .map_err(|_| crate::NesProtocolError::InvalidJson("bad sig".into()))?;
    let id_bytes = hex::decode(&event.id)
        .map_err(|_| crate::NesProtocolError::InvalidJson("bad id".into()))?;

    let vk = k256::schnorr::VerifyingKey::from_bytes(&pubkey_bytes)
        .map_err(|_| crate::NesProtocolError::InvalidJson("invalid pubkey".into()))?;
    let sig = k256::schnorr::Signature::try_from(sig_bytes.as_slice())
        .map_err(|_| crate::NesProtocolError::InvalidJson("invalid signature".into()))?;
    vk.verify_prehash(&id_bytes, &sig).map_err(|_| {
        crate::NesProtocolError::InvalidJson("signature verification failed".into())
    })?;

    Ok(())
}

pub fn now_unix() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs() as i64)
        .unwrap_or(0)
}

#[cfg(test)]
mod tests {
    use super::*;

    // A fixed test key (do not use in production).
    const TEST_KEY: &str = "0000000000000000000000000000000000000000000000000000000000000001";

    #[test]
    fn sign_then_verify_roundtrip() {
        let now = 1_700_000_000;
        let url = "https://nes.example.com/v1/rooms";
        let payload = b"{\"guest_pubkey\":\"abc\"}";
        let event = sign_nip98(TEST_KEY, url, "POST", payload, now).unwrap();
        assert_eq!(event.kind, NIP98_KIND);
        assert_eq!(event.sig.len(), 128);
        verify_nip98(&event, url, "POST", payload, now).unwrap();
    }

    #[test]
    fn verify_rejects_wrong_url() {
        let now = 1_700_000_000;
        let event = sign_nip98(TEST_KEY, "https://nes.example.com/a", "POST", b"x", now).unwrap();
        assert!(verify_nip98(&event, "https://nes.example.com/b", "POST", b"x", now).is_err());
    }

    #[test]
    fn verify_rejects_wrong_payload() {
        let now = 1_700_000_000;
        let event = sign_nip98(TEST_KEY, "https://nes.example.com/a", "POST", b"x", now).unwrap();
        assert!(verify_nip98(&event, "https://nes.example.com/a", "POST", b"y", now).is_err());
    }

    #[test]
    fn verify_rejects_stale() {
        let now = 1_700_000_000;
        let event = sign_nip98(TEST_KEY, "https://nes.example.com/a", "POST", b"x", now).unwrap();
        assert!(verify_nip98(
            &event,
            "https://nes.example.com/a",
            "POST",
            b"x",
            now + 1000
        )
        .is_err());
    }

    #[test]
    fn verify_rejects_tampered_sig() {
        let now = 1_700_000_000;
        let mut event =
            sign_nip98(TEST_KEY, "https://nes.example.com/a", "POST", b"x", now).unwrap();
        // flip a hex char in the signature
        let mut chars: Vec<char> = event.sig.chars().collect();
        chars[0] = if chars[0] == '0' { '1' } else { '0' };
        event.sig = chars.into_iter().collect();
        assert!(verify_nip98(&event, "https://nes.example.com/a", "POST", b"x", now).is_err());
    }
}
