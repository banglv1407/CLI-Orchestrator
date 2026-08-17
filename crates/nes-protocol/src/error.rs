use thiserror::Error;

#[derive(Debug, Error)]
pub enum NesProtocolError {
    #[error("unknown protocol version: {0}")]
    UnknownVersion(u32),
    #[error("invalid controller bitmask: {0:#04x}")]
    InvalidBitmask(u8),
    #[error("impossible opposing directions in bitmask: {0:#04x}")]
    OpposingDirections(u8),
    #[error("invalid signaling type")]
    InvalidSignalType,
    #[error("missing required field: {0}")]
    MissingField(&'static str),
    #[error("signal payload too large: {0} bytes (max {1})")]
    PayloadTooLarge(usize, usize),
    #[error("SDP too large: {0} bytes (max {1})")]
    SdpTooLarge(usize, usize),
    #[error("too many ICE candidates: {0} (max {1})")]
    TooManyCandidates(usize, usize),
    #[error("non-relay ICE candidate rejected")]
    NonRelayCandidate,
    #[error("invalid JSON: {0}")]
    InvalidJson(String),
}
