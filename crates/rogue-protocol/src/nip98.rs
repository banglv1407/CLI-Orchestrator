use crate::error::RogueProtocolError;
use k256::schnorr::{Signature, VerifyingKey};
use sha2::{Digest, Sha256};
use std::time::{SystemTime, UNIX_EPOCH};

pub const NIP98_KIND: u64 = 27235;
pub const MAX_TIMESTAMP_DRIFT_SECS: i64 = 120; // 2 minutes

pub fn verify_nip98_auth(
    auth_header: &str,
    expected_url: &str,
    expected_method: &str,
) -> Result<String, RogueProtocolError> {
    if !auth_header.starts_with("Nostr ") {
        return Err(RogueProtocolError::InvalidSignature(
            "Missing Nostr scheme in Authorization header".into(),
        ));
    }

    let raw_token = &auth_header["Nostr ".len()..];
    let decoded_bytes = hex::decode(raw_token)
        .or_else(|_| {
            use base64::Engine;
            base64::engine::general_purpose::STANDARD.decode(raw_token)
        })
        .map_err(|e| RogueProtocolError::InvalidSignature(format!("Token decode error: {e}")))?;

    let event: serde_json::Value = serde_json::from_slice(&decoded_bytes)
        .map_err(|e| RogueProtocolError::InvalidSignature(format!("Invalid event JSON: {e}")))?;

    let pubkey_hex = event["pubkey"]
        .as_str()
        .ok_or_else(|| RogueProtocolError::MissingField("pubkey"))?;
    let created_at = event["created_at"]
        .as_i64()
        .ok_or_else(|| RogueProtocolError::MissingField("created_at"))?;
    let kind = event["kind"]
        .as_u64()
        .ok_or_else(|| RogueProtocolError::MissingField("kind"))?;
    let tags = event["tags"]
        .as_array()
        .ok_or_else(|| RogueProtocolError::MissingField("tags"))?;
    let sig_hex = event["sig"]
        .as_str()
        .ok_or_else(|| RogueProtocolError::MissingField("sig"))?;
    let id_hex = event["id"]
        .as_str()
        .ok_or_else(|| RogueProtocolError::MissingField("id"))?;

    if kind != NIP98_KIND {
        return Err(RogueProtocolError::Unauthorized(format!(
            "Expected kind {NIP98_KIND}, got {kind}"
        )));
    }

    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs() as i64;
    if (now - created_at).abs() > MAX_TIMESTAMP_DRIFT_SECS {
        return Err(RogueProtocolError::Unauthorized("Auth event timestamp expired".into()));
    }

    // Verify tag matching url and method
    let mut has_u = false;
    let mut has_m = false;
    for tag in tags {
        if let Some(arr) = tag.as_array() {
            if arr.len() >= 2 {
                let tag_name = arr[0].as_str().unwrap_or("");
                let tag_val = arr[1].as_str().unwrap_or("");
                if tag_name == "u" && tag_val.eq_ignore_ascii_case(expected_url) {
                    has_u = true;
                }
                if tag_name == "method" && tag_val.eq_ignore_ascii_case(expected_method) {
                    has_m = true;
                }
            }
        }
    }

    if !has_u || !has_m {
        return Err(RogueProtocolError::Unauthorized(
            "NIP-98 tags 'u' or 'method' mismatch".into(),
        ));
    }

    // Verify Schnorr Signature
    let pubkey_bytes = hex::decode(pubkey_hex)
        .map_err(|e| RogueProtocolError::InvalidSignature(format!("Bad pubkey hex: {e}")))?;
    let sig_bytes = hex::decode(sig_hex)
        .map_err(|e| RogueProtocolError::InvalidSignature(format!("Bad sig hex: {e}")))?;
    let id_bytes = hex::decode(id_hex)
        .map_err(|e| RogueProtocolError::InvalidSignature(format!("Bad id hex: {e}")))?;

    if pubkey_bytes.len() != 32 || sig_bytes.len() != 64 {
        return Err(RogueProtocolError::InvalidSignature("Invalid key/sig length".into()));
    }

    let verifying_key = VerifyingKey::from_bytes(&pubkey_bytes)
        .map_err(|e| RogueProtocolError::InvalidSignature(format!("Invalid pubkey: {e}")))?;
    let signature = Signature::try_from(sig_bytes.as_slice())
        .map_err(|e| RogueProtocolError::InvalidSignature(format!("Invalid signature: {e}")))?;

    verifying_key
        .verify_raw(&id_bytes, &signature)
        .map_err(|e| RogueProtocolError::InvalidSignature(format!("Schnorr verification failed: {e}")))?;

    Ok(pubkey_hex.to_string())
}
