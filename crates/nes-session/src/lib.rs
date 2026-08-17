//! `nes-session` — the NES multiplayer session service.
//!
//! Runs as an Axum HTTPS/WSS service on Linux. It authenticates rooms via
//! NIP-98, maintains in-memory room state, carries input-only synchronization,
//! and enforces quotas. It never runs the emulator or stores game content.

mod app;
mod auth;
mod quota;
mod room;
mod state;

pub use app::build_router;
pub use state::AppState;

pub const SERVICE_VERSION: &str = env!("CARGO_PKG_VERSION");
