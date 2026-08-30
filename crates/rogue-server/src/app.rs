use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Path, State,
    },
    response::IntoResponse,
    routing::get,
    Router,
};
use futures_util::{SinkExt, StreamExt};
use parking_lot::RwLock;
use rogue_protocol::*;
use std::{collections::HashMap, sync::Arc};
use tower_http::cors::CorsLayer;

use crate::room::GameRoom;

#[derive(Clone)]
pub struct AppState {
    pub rooms: Arc<RwLock<HashMap<String, GameRoom>>>,
}

pub fn create_router() -> Router {
    let state = AppState {
        rooms: Arc::new(RwLock::new(HashMap::new())),
    };

    Router::new()
        .route("/health", get(|| async { "OK" }))
        .route("/ws/:room_id", get(ws_handler))
        .layer(CorsLayer::permissive())
        .with_state(state)
}

async fn ws_handler(
    ws: WebSocketUpgrade,
    Path(room_id): Path<String>,
    State(state): State<AppState>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, room_id, state))
}

async fn handle_socket(socket: WebSocket, room_id: String, state: AppState) {
    let (mut sender, mut receiver) = socket.split();

    // Ensure room exists
    {
        let mut rooms = state.rooms.write();
        rooms.entry(room_id.clone()).or_insert_with(|| {
            GameRoom::new(
                room_id.clone(),
                "host_placeholder".into(),
                RoomConfig::default(),
            )
        });
    }

    while let Some(Ok(msg)) = receiver.next().await {
        if let Message::Text(text) = msg {
            if let Ok(action) = serde_json::from_str::<ClientAction>(&text) {
                // Process game action
                tracing::debug!("Received action in room {}: {:?}", room_id, action);
            }
        }
    }
}
