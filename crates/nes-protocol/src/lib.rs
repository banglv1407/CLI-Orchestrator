//! Shared NES multiplayer wire contracts.
//!
//! This crate is the single source of truth for the versioned DTOs and the
//! signaling envelope that cross between the CLX desktop app (host/guest) and
//! the `nes-session` Linux service. Keeping them here prevents the two
//! deployables from drifting on the wire format.
//!
//! It has no tokio/tauri/axum dependency so it can be linked into both sides.

pub mod controller;
pub mod dto;
pub mod error;
pub mod nip98;
pub mod signaling;

pub use controller::{
    validate_bitmask, BIT_A, BIT_B, BIT_DOWN, BIT_L, BIT_LEFT, BIT_R, BIT_RIGHT, BIT_SELECT,
    BIT_START, BIT_UP, BIT_X, BIT_Y, CONTROLLER_MASK_OPPOSING, CONTROLLER_MASK_VALID,
};
pub use dto::*;
pub use error::NesProtocolError;
pub use signaling::{validate_envelope, NesSignalEnvelopeV1, SignalType};
