use rogue_protocol::*;
use std::collections::HashMap;

pub const PROXIMITY_HEARING_RADIUS: f32 = 350.0;

pub fn can_hear_proximity(
    sender: &PlayerInfo,
    receiver: &PlayerInfo,
    is_meeting: bool,
) -> bool {
    // During meetings: Everyone alive can talk to everyone alive. Dead players can only talk to dead players.
    if is_meeting {
        if sender.is_alive {
            return receiver.is_alive;
        } else {
            return !receiver.is_alive; // Ghost-to-ghost only
        }
    }

    // In-game exploration: Dead players cannot talk to living players
    if !sender.is_alive {
        return !receiver.is_alive;
    }

    if !receiver.is_alive {
        return true; // Ghosts can hear everything from living players
    }

    // Proximity calculation for living players
    let dx = sender.x - receiver.x;
    let dy = sender.y - receiver.y;
    let dist_sq = dx * dx + dy * dy;

    dist_sq <= (PROXIMITY_HEARING_RADIUS * PROXIMITY_HEARING_RADIUS)
}
