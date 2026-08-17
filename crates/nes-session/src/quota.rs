//! Quota enforcement — global room cap, per-pubkey room cap, per-IP
//! connection cap, and room-creation rate limiting.

use std::collections::HashMap;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};

pub const MAX_ACTIVE_ROOMS: usize = 10;
// One active room per pubkey is enforced by the `active_by_pubkey` map in
// `state.rs` (one entry per pubkey by construction).
pub const MAX_CONNECTIONS_PER_IP: usize = 4;
pub const MAX_CREATIONS_PER_10MIN: usize = 5;
const CREATE_WINDOW_SECS: u64 = 10 * 60;

fn now() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0)
}

pub struct QuotaTracker {
    /// source IP -> count of active participant connections.
    connections_per_ip: Mutex<HashMap<String, usize>>,
    /// (pubkey or IP) -> Vec of creation timestamps in the current window.
    creation_events: Mutex<HashMap<String, Vec<u64>>>,
}

impl QuotaTracker {
    pub fn new() -> Self {
        Self {
            connections_per_ip: Mutex::new(HashMap::new()),
            creation_events: Mutex::new(HashMap::new()),
        }
    }

    pub fn active_room_count(&self, current: usize) -> bool {
        current < MAX_ACTIVE_ROOMS
    }

    pub fn can_add_connection(&self, ip: &str) -> bool {
        let mut map = self.connections_per_ip.lock().unwrap();
        let n = map.entry(ip.to_string()).or_insert(0);
        if *n >= MAX_CONNECTIONS_PER_IP {
            return false;
        }
        *n += 1;
        true
    }

    pub fn release_connection(&self, ip: &str) {
        let mut map = self.connections_per_ip.lock().unwrap();
        if let Some(n) = map.get_mut(ip) {
            *n = n.saturating_sub(1);
            if *n == 0 {
                map.remove(ip);
            }
        }
    }

    /// Record a room-creation attempt keyed by a pubkey/IP string. Returns
    /// true if the attempt is within limits.
    pub fn record_creation(&self, key: &str) -> bool {
        let t = now();
        let mut map = self.creation_events.lock().unwrap();
        let events = map.entry(key.to_string()).or_default();
        events.retain(|&ts| t.saturating_sub(ts) < CREATE_WINDOW_SECS);
        if events.len() >= MAX_CREATIONS_PER_10MIN {
            return false;
        }
        events.push(t);
        true
    }
}

impl Default for QuotaTracker {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn room_cap_enforced() {
        assert!(QuotaTracker::new().active_room_count(9));
        assert!(!QuotaTracker::new().active_room_count(10));
    }

    #[test]
    fn connection_cap_enforced() {
        let q = QuotaTracker::new();
        for _ in 0..MAX_CONNECTIONS_PER_IP {
            assert!(q.can_add_connection("1.2.3.4"));
        }
        assert!(!q.can_add_connection("1.2.3.4"));
    }

    #[test]
    fn connection_release() {
        let q = QuotaTracker::new();
        assert!(q.can_add_connection("1.2.3.4"));
        q.release_connection("1.2.3.4");
        assert!(q.can_add_connection("1.2.3.4"));
    }

    #[test]
    fn creation_rate_limit() {
        let q = QuotaTracker::new();
        for _ in 0..MAX_CREATIONS_PER_10MIN {
            assert!(q.record_creation("pk1"));
        }
        assert!(!q.record_creation("pk1"));
    }
}
