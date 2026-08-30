use thiserror::Error;

#[derive(Debug, Error)]
pub enum RogueProtocolError {
    #[error("Unknown protocol version: {0}")]
    UnknownVersion(u32),
    #[error("Missing required field: {0}")]
    MissingField(&'static str),
    #[error("Payload exceeds maximum size: {0} > {1}")]
    PayloadTooLarge(usize, usize),
    #[error("Invalid signature: {0}")]
    InvalidSignature(String),
    #[error("Unauthorized action: {0}")]
    Unauthorized(String),
    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),
}
