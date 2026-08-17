//! Room state machine — the in-memory domain object for a two-player room.

use nes_protocol::{NesRole, RoomState};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

pub const MAX_ROOM_LIFETIME_SECS: i64 = 4 * 60 * 60; // four hours
pub const INVITE_TTL_SECS: i64 = 10 * 60; // ten minutes
pub const TICKET_TTL_SECS: i64 = 30; // thirty seconds

fn now() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs() as i64)
        .unwrap_or(0)
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Room {
    pub room_id: String,
    pub host_pubkey: String,
    pub guest_pubkey: Option<String>,
    pub state: RoomState,
    pub created_at: i64,
    pub expires_at: i64,
    pub invite_token: Option<String>,
    pub invite_expires_at: Option<i64>,
    pub host_ticket: Option<String>,
    pub host_ticket_expires_at: Option<i64>,
    pub guest_ticket: Option<String>,
    pub guest_ticket_expires_at: Option<i64>,
    pub host_seq: u64,
    pub guest_seq: u64,
}

impl Room {
    pub fn new(room_id: String, host_pubkey: String, guest_pubkey: Option<String>) -> Self {
        let created = now();
        Self {
            room_id,
            host_pubkey,
            guest_pubkey,
            state: RoomState::Creating,
            created_at: created,
            expires_at: created + MAX_ROOM_LIFETIME_SECS,
            invite_token: None,
            invite_expires_at: None,
            host_ticket: None,
            host_ticket_expires_at: None,
            guest_ticket: None,
            guest_ticket_expires_at: None,
            host_seq: 0,
            guest_seq: 0,
        }
    }

    /// Legal transitions for the state machine. Returns the new state, or an
    /// error when the transition is not allowed.
    pub fn transition(&mut self, to: RoomState) -> Result<RoomState, String> {
        use RoomState::*;
        let legal = match (self.state, to) {
            (Idle, Creating) => true,
            (Creating, Waiting) => true,
            (Waiting, Negotiating) => true,
            (Negotiating, Connected) => true,
            (Connected, Reconnecting) => true,
            (Reconnecting, Connected) => true,
            (Reconnecting, Failed) => true,
            (Reconnecting, Ended) => true,
            // Terminal states have no outgoing transitions.
            (Ended, _) => false,
            (Failed, _) => false,
            // Anything ending the room is allowed from any non-terminal state.
            (_, Ended) => !matches!(self.state, Ended | Failed),
            (_, Failed) => !matches!(self.state, Ended | Failed),
            _ => false,
        };
        if !legal {
            return Err(format!("illegal transition {:?} -> {:?}", self.state, to));
        }
        self.state = to;
        Ok(self.state)
    }

    pub fn is_expired(&self) -> bool {
        now() >= self.expires_at
    }

    pub fn invite_expired(&self) -> bool {
        self.invite_expires_at.map(|t| now() >= t).unwrap_or(true)
    }

    pub fn ticket_expired(&self, role: NesRole) -> bool {
        let expires_at = match role {
            NesRole::Host => self.host_ticket_expires_at,
            NesRole::Guest => self.guest_ticket_expires_at,
        };
        expires_at.map(|t| now() >= t).unwrap_or(true)
    }

    pub fn ticket_for(&self, role: NesRole) -> Option<&str> {
        match role {
            NesRole::Host => self.host_ticket.as_deref(),
            NesRole::Guest => self.guest_ticket.as_deref(),
        }
    }

    pub fn set_ticket(&mut self, role: NesRole, ticket: String, expires_at: i64) {
        match role {
            NesRole::Host => {
                self.host_ticket = Some(ticket);
                self.host_ticket_expires_at = Some(expires_at);
            }
            NesRole::Guest => {
                self.guest_ticket = Some(ticket);
                self.guest_ticket_expires_at = Some(expires_at);
            }
        }
    }

    pub fn consume_ticket(&mut self, role: NesRole) {
        match role {
            NesRole::Host => self.host_ticket = None,
            NesRole::Guest => self.guest_ticket = None,
        }
    }

    pub fn role_for(&self, pubkey: &str) -> Option<NesRole> {
        if pubkey == self.host_pubkey {
            Some(NesRole::Host)
        } else if self.guest_pubkey.as_deref() == Some(pubkey) {
            Some(NesRole::Guest)
        } else {
            None
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn room() -> Room {
        Room::new("r1".into(), "host".into(), Some("guest".into()))
    }

    #[test]
    fn happy_path_transitions() {
        let mut r = room();
        assert_eq!(
            r.transition(RoomState::Waiting).unwrap(),
            RoomState::Waiting
        );
        assert_eq!(
            r.transition(RoomState::Negotiating).unwrap(),
            RoomState::Negotiating
        );
        assert_eq!(
            r.transition(RoomState::Connected).unwrap(),
            RoomState::Connected
        );
    }

    #[test]
    fn reconnect_cycle() {
        let mut r = room();
        r.transition(RoomState::Waiting).unwrap();
        r.transition(RoomState::Negotiating).unwrap();
        r.transition(RoomState::Connected).unwrap();
        assert_eq!(
            r.transition(RoomState::Reconnecting).unwrap(),
            RoomState::Reconnecting
        );
        assert_eq!(
            r.transition(RoomState::Connected).unwrap(),
            RoomState::Connected
        );
        assert_eq!(
            r.transition(RoomState::Reconnecting).unwrap(),
            RoomState::Reconnecting
        );
        assert_eq!(r.transition(RoomState::Failed).unwrap(), RoomState::Failed);
    }

    #[test]
    fn no_transition_from_terminal() {
        let mut r = room();
        r.transition(RoomState::Ended).unwrap();
        assert!(r.transition(RoomState::Connected).is_err());
        let mut f = room();
        f.transition(RoomState::Failed).unwrap();
        assert!(f.transition(RoomState::Connected).is_err());
    }

    #[test]
    fn illegal_jump_rejected() {
        let mut r = room();
        // Creating -> Connected is not allowed directly.
        assert!(r.transition(RoomState::Connected).is_err());
    }

    #[test]
    fn role_assignment() {
        let r = room();
        assert_eq!(r.role_for("host"), Some(NesRole::Host));
        assert_eq!(r.role_for("guest"), Some(NesRole::Guest));
        assert_eq!(r.role_for("other"), None);
    }
}
