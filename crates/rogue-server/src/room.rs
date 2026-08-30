use std::collections::HashMap;
use parking_lot::RwLock;
use rogue_protocol::*;
use rand::seq::SliceRandom;

pub struct GameRoom {
    pub room_id: String,
    pub host_pubkey: String,
    pub state: GameState,
    pub config: RoomConfig,
    pub players: HashMap<String, PlayerInfo>,
    pub votes: HashMap<String, Option<String>>, // voter -> target
    pub active_sabotage: Option<SabotageType>,
    pub sabotage_timer: Option<u32>,
    pub emergency_cooldown: u32,
    pub emergency_called_by: Vec<String>,
}

impl GameRoom {
    pub fn new(room_id: String, host_pubkey: String, config: RoomConfig) -> Self {
        Self {
            room_id,
            host_pubkey,
            state: GameState::Lobby,
            config,
            players: HashMap::new(),
            votes: HashMap::new(),
            active_sabotage: None,
            sabotage_timer: None,
            emergency_cooldown: 15,
            emergency_called_by: Vec::new(),
        }
    }

    pub fn add_player(&mut self, player: PlayerInfo) -> Result<(), &'static str> {
        if self.players.len() >= self.config.max_players {
            return Err("Room is full");
        }
        if self.state != GameState::Lobby {
            return Err("Game already in progress");
        }
        self.players.insert(player.pubkey.clone(), player);
        Ok(())
    }

    pub fn remove_player(&mut self, pubkey: &str) {
        self.players.remove(pubkey);
    }

    pub fn start_game(&mut self) -> Result<(), &'static str> {
        if self.players.len() < MIN_PLAYERS_PER_ROOM {
            return Err("Not enough players to start (minimum 4)");
        }

        let mut keys: Vec<String> = self.players.keys().cloned().collect();
        let mut rng = rand::thread_rng();
        keys.shuffle(&mut rng);

        let rogue_count = self.config.rogue_count.min(keys.len() / 2).max(1);
        let rogue_keys: Vec<String> = keys.iter().take(rogue_count).cloned().collect();

        for (pubkey, p) in self.players.iter_mut() {
            p.is_alive = true;
            p.x = 400.0;
            p.y = 300.0;
            p.tasks_completed = 0;
            p.total_tasks = self.config.task_count_per_player;
            if rogue_keys.contains(pubkey) {
                p.role = Some(PlayerRole::RogueAgent);
            } else {
                p.role = Some(PlayerRole::SystemEngineer);
            }
        }

        self.state = GameState::Running;
        self.votes.clear();
        self.active_sabotage = None;
        Ok(())
    }

    pub fn cast_vote(&mut self, voter_pubkey: &str, target_pubkey: Option<String>) {
        if self.state == GameState::Meeting {
            self.votes.insert(voter_pubkey.to_string(), target_pubkey);
        }
    }

    pub fn check_game_over(&self) -> Option<(PlayerRole, String)> {
        let mut living_engineers = 0;
        let mut living_rogues = 0;
        let mut all_tasks_done = true;

        for p in self.players.values() {
            if p.is_alive {
                match p.role {
                    Some(PlayerRole::SystemEngineer) => {
                        living_engineers += 1;
                        if p.tasks_completed < p.total_tasks {
                            all_tasks_done = false;
                        }
                    }
                    Some(PlayerRole::RogueAgent) => {
                        living_rogues += 1;
                    }
                    _ => {}
                }
            }
        }

        if living_rogues == 0 {
            return Some((PlayerRole::SystemEngineer, "All Rogue Agents neutralized!".into()));
        }
        if living_rogues >= living_engineers {
            return Some((PlayerRole::RogueAgent, "Rogue Agents overpowered the Core Engineers!".into()));
        }
        if all_tasks_done && living_engineers > 0 {
            return Some((PlayerRole::SystemEngineer, "All Quantum Calibrations restored!".into()));
        }

        None
    }
}
