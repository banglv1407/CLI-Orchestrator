use serde::{Deserialize, Serialize};

pub const PROTOCOL_VERSION: u32 = 1;
pub const MAX_PLAYERS_PER_ROOM: usize = 20;
pub const MIN_PLAYERS_PER_ROOM: usize = 4;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum PlayerRole {
    SystemEngineer, // Crewmate equivalent
    RogueAgent,     // Impostor equivalent
    Spectator,      // Dead / observer
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum GameState {
    Lobby,
    Running,
    Meeting,
    GameOver,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlayerInfo {
    pub pubkey: String,
    pub name: String,
    pub color: String, // Hex or Color ID
    pub role: Option<PlayerRole>,
    pub is_alive: bool,
    pub is_host: bool,
    pub x: f32,
    pub y: f32,
    pub current_room: String,
    pub tasks_completed: usize,
    pub total_tasks: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RoomConfig {
    pub max_players: usize,
    pub rogue_count: usize,
    pub kill_cooldown_secs: u32,
    pub meeting_duration_secs: u32,
    pub discussion_duration_secs: u32,
    pub task_count_per_player: usize,
    pub emergency_meetings_per_player: usize,
    pub anonymous_voting: bool,
    pub confirm_ejects: bool,
}

impl Default for RoomConfig {
    fn default() -> Self {
        Self {
            max_players: 10,
            rogue_count: 2,
            kill_cooldown_secs: 25,
            meeting_duration_secs: 60,
            discussion_duration_secs: 15,
            task_count_per_player: 4,
            emergency_meetings_per_player: 1,
            anonymous_voting: false,
            confirm_ejects: true,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SabotageType {
    Blackout,        // Lights out -> Low crew visibility
    ReactorMeltdown, // 30s countdown -> Critical failure
    CoolantLeak,     // O2 countdown equivalent
    CommsJam,        // Hide task map & security cameras
    DoorLock,        // Lock specific room doors for 10s
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "action", content = "data", rename_all = "snake_case")]
pub enum ClientAction {
    Move { x: f32, y: f32, vx: f32, vy: f32 },
    UseVent { vent_id: String },
    Kill { target_pubkey: String },
    ReportBody { body_pubkey: String },
    CallEmergencyMeeting,
    Vote { target_pubkey: Option<String> }, // None = Skip
    TriggerSabotage { sabotage_type: SabotageType, target_room: Option<String> },
    FixSabotage { sabotage_type: SabotageType, part_id: usize },
    CompleteTask { task_id: String },
    SendChatMessage { text: String, is_meeting: bool },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "event", content = "data", rename_all = "snake_case")]
pub enum ServerEvent {
    PlayerJoined { player: PlayerInfo },
    PlayerLeft { pubkey: String },
    LobbyUpdate { players: Vec<PlayerInfo>, config: RoomConfig },
    GameStarted { your_role: PlayerRole, rogue_team: Vec<String>, tasks: Vec<String> },
    PositionSync { players: Vec<(String, f32, f32, bool)> }, // pubkey, x, y, is_alive
    EmergencyAlarm { reporter_pubkey: String, reason: String },
    MeetingStarted { discussion_time: u32, voting_time: u32 },
    VoteCast { voter_pubkey: String },
    MeetingResult { exiled_pubkey: Option<String>, was_rogue: Option<bool>, votes: Vec<(String, Option<String>)> },
    SabotageTriggered { sabotage_type: SabotageType, time_remaining_secs: Option<u32> },
    SabotageFixed { sabotage_type: SabotageType },
    TaskProgressUpdate { completed_total: usize, required_total: usize },
    GameOver { winning_team: PlayerRole, rogues: Vec<String>, summary: String },
    ChatMessage { sender_pubkey: String, sender_name: String, text: String, is_ghost_only: bool },
}
