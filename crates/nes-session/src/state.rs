//! Application state — the in-memory room registry and quota counters.

use crate::auth::ReplayCache;
use crate::quota::QuotaTracker;
use crate::room::Room;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tokio::sync::broadcast;

#[derive(Debug, Clone)]
pub(crate) struct SignalRelay {
    pub role: nes_protocol::NesRole,
    pub message: String,
}

#[derive(Clone)]
pub struct AppState {
    inner: Arc<Inner>,
}

struct Inner {
    rooms: Mutex<HashMap<String, Room>>,
    /// pubkey -> room_id for the active room a pubkey currently occupies.
    active_by_pubkey: Mutex<HashMap<String, String>>,
    signal_channels: Mutex<HashMap<String, broadcast::Sender<SignalRelay>>>,
    quotas: QuotaTracker,
    replay: ReplayCache,
    signal_url: String,
}

impl AppState {
    pub fn new() -> Self {
        Self::with_signal_url("ws://localhost:8080/v1/signal".into())
    }

    pub fn with_signal_url(signal_url: String) -> Self {
        Self {
            inner: Arc::new(Inner {
                rooms: Mutex::new(HashMap::new()),
                active_by_pubkey: Mutex::new(HashMap::new()),
                signal_channels: Mutex::new(HashMap::new()),
                quotas: QuotaTracker::new(),
                replay: ReplayCache::new(),
                signal_url,
            }),
        }
    }

    pub fn signal_url(&self) -> &str {
        &self.inner.signal_url
    }

    pub fn rooms(&self) -> std::sync::MutexGuard<'_, HashMap<String, Room>> {
        self.inner.rooms.lock().unwrap()
    }

    pub fn active_by_pubkey(&self) -> std::sync::MutexGuard<'_, HashMap<String, String>> {
        self.inner.active_by_pubkey.lock().unwrap()
    }

    pub(crate) fn signal_channel(&self, room_id: &str) -> broadcast::Sender<SignalRelay> {
        let mut channels = self.inner.signal_channels.lock().unwrap();
        channels
            .entry(room_id.to_string())
            .or_insert_with(|| broadcast::channel(32).0)
            .clone()
    }

    pub(crate) fn remove_signal_channel(&self, room_id: &str) {
        self.inner.signal_channels.lock().unwrap().remove(room_id);
    }

    pub fn quotas(&self) -> &QuotaTracker {
        &self.inner.quotas
    }

    pub fn replay(&self) -> &ReplayCache {
        &self.inner.replay
    }
}
