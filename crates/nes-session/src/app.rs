//! Axum router and HTTP/WS handlers for the session service.

use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Extension, Path, State,
    },
    http::StatusCode,
    middleware,
    response::{IntoResponse, Response},
    routing::{delete, get, post},
    Json, Router,
};
use nes_protocol::{
    validate_envelope, NesConnectionBundleV1, NesInviteEnvelopeV1, NesRole,
    NesRoomDirectoryEntryV1, NesRoomSnapshotV1, NesSignalEnvelopeV1, RoomState, SignalType,
};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

use crate::auth::nip98_auth;
use crate::quota::MAX_ACTIVE_ROOMS;
use crate::room::{Room, INVITE_TTL_SECS, TICKET_TTL_SECS};
use crate::state::{AppState, SignalRelay};

fn now() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs() as i64)
        .unwrap_or(0)
}

pub fn build_router(state: AppState) -> Router {
    let authed = middleware::from_fn_with_state(state.clone(), nip98_auth);

    Router::new()
        .route("/health/live", get(health_live))
        .route("/health/ready", get(health_ready))
        .route("/metrics", get(metrics))
        .route(
            "/v1/rooms",
            get(list_rooms).post(create_room).layer(authed.clone()),
        )
        .route(
            "/v1/rooms/{room_id}/join",
            post(join_room).layer(authed.clone()),
        )
        .route(
            "/v1/invites/{token}/accept",
            post(accept_invite).layer(authed.clone()),
        )
        .route(
            "/v1/rooms/{room_id}/refresh",
            post(refresh_room).layer(authed.clone()),
        )
        .route(
            "/v1/rooms/{room_id}/leave",
            post(leave_room).layer(authed.clone()),
        )
        .route(
            "/v1/rooms/{room_id}",
            delete(end_room).layer(authed.clone()),
        )
        .route("/v1/signal", get(signal_upgrade))
        .with_state(state)
}

async fn health_live() -> impl IntoResponse {
    (StatusCode::OK, "ok")
}

async fn health_ready(State(state): State<AppState>) -> impl IntoResponse {
    if state.signal_url().starts_with("ws://") || state.signal_url().starts_with("wss://") {
        (StatusCode::OK, "ready")
    } else {
        (
            StatusCode::SERVICE_UNAVAILABLE,
            "signaling URL is not configured",
        )
    }
}

async fn metrics(State(state): State<AppState>) -> impl IntoResponse {
    let rooms = state.rooms();
    format!(
        "# TYPE nes_active_rooms gauge\nnes_active_rooms {}\n",
        rooms.len()
    )
}

#[derive(Deserialize)]
struct CreateRoomRequest {
    #[serde(default)]
    guest_pubkey: Option<String>,
}

#[derive(Serialize)]
struct CreateRoomResponse {
    bundle: NesConnectionBundleV1,
    #[serde(skip_serializing_if = "Option::is_none")]
    invite: Option<NesInviteEnvelopeV1>,
}

async fn list_rooms(State(state): State<AppState>) -> Json<Vec<NesRoomDirectoryEntryV1>> {
    let rooms = state.rooms();
    let mut directory: Vec<_> = rooms
        .values()
        .filter(|room| {
            !room.is_expired() && !matches!(room.state, RoomState::Ended | RoomState::Failed)
        })
        .map(|room| NesRoomDirectoryEntryV1 {
            schema_version: 1,
            room_id: room.room_id.clone(),
            host_pubkey: room.host_pubkey.clone(),
            state: room.state,
            participant_count: if room.guest_pubkey.is_some() { 2 } else { 1 },
            joinable: room.state == RoomState::Waiting && room.guest_pubkey.is_none(),
            created_at: room.created_at,
            expires_at: room.expires_at,
        })
        .collect();
    directory.sort_by_key(|room| std::cmp::Reverse(room.created_at));
    Json(directory)
}

async fn create_room(
    State(state): State<AppState>,
    Extension(host): Extension<String>,
    Json(req): Json<CreateRoomRequest>,
) -> Response {
    if req
        .guest_pubkey
        .as_ref()
        .is_some_and(|guest| guest.is_empty() || guest == &host)
    {
        return (StatusCode::BAD_REQUEST, "invalid guest_pubkey").into_response();
    }

    {
        let rooms = state.rooms();
        if rooms.len() >= MAX_ACTIVE_ROOMS {
            return (StatusCode::TOO_MANY_REQUESTS, "global room limit reached").into_response();
        }
        let active = state.active_by_pubkey();
        if active.contains_key(&host)
            || req
                .guest_pubkey
                .as_ref()
                .is_some_and(|guest| active.contains_key(guest))
        {
            return (
                StatusCode::CONFLICT,
                "a participant already has an active room",
            )
                .into_response();
        }
        if !state.quotas().record_creation(&host) {
            return (StatusCode::TOO_MANY_REQUESTS, "creation rate limit").into_response();
        }
    }

    let room_id = uuid::Uuid::new_v4().to_string();
    let invite_token = uuid::Uuid::new_v4().to_string();
    let ticket = uuid::Uuid::new_v4().to_string();
    let mut room = Room::new(room_id.clone(), host.clone(), req.guest_pubkey.clone());
    if req.guest_pubkey.is_some() {
        room.invite_token = Some(invite_token.clone());
        room.invite_expires_at = Some(now() + INVITE_TTL_SECS);
    }
    let ticket_expires_at = now() + TICKET_TTL_SECS;
    room.set_ticket(NesRole::Host, ticket.clone(), ticket_expires_at);
    room.transition(RoomState::Waiting).ok();

    let signal_url = state.signal_url().to_owned();

    let bundle = NesConnectionBundleV1 {
        schema_version: 1,
        role: NesRole::Host,
        room: snapshot(&room),
        signal_url,
        ticket,
        ticket_expires_at,
    };
    let invite = req.guest_pubkey.as_ref().map(|_| NesInviteEnvelopeV1 {
        schema_version: 1,
        token: invite_token,
        host_pubkey: host.clone(),
        expires_at: room.invite_expires_at.unwrap_or(0),
    });

    state.rooms().insert(room_id.clone(), room);
    let mut active = state.active_by_pubkey();
    active.insert(host, room_id.clone());
    if let Some(guest) = req.guest_pubkey {
        active.insert(guest, room_id);
    }

    Json(CreateRoomResponse { bundle, invite }).into_response()
}

#[derive(Deserialize)]
struct AcceptInviteRequest {
    #[allow(dead_code)]
    room_id: String,
}

async fn accept_invite(
    State(state): State<AppState>,
    Path(token): Path<String>,
    Extension(guest): Extension<String>,
    Json(_req): Json<AcceptInviteRequest>,
) -> Response {
    let room_id = {
        let rooms = state.rooms();
        let found = rooms
            .values()
            .find(|r| r.invite_token.as_deref() == Some(&token));
        match found {
            Some(r) if r.guest_pubkey.as_deref() == Some(&guest) && !r.invite_expired() => {
                r.room_id.clone()
            }
            _ => return (StatusCode::FORBIDDEN, "invalid or expired invitation").into_response(),
        }
    };

    let signal_url = state.signal_url().to_owned();
    let mut rooms = state.rooms();
    let room = rooms.get_mut(&room_id).unwrap();
    let guest_ticket = uuid::Uuid::new_v4().to_string();
    let ticket_expires_at = now() + TICKET_TTL_SECS;
    room.set_ticket(NesRole::Guest, guest_ticket.clone(), ticket_expires_at);
    room.transition(RoomState::Negotiating).ok();

    let bundle = NesConnectionBundleV1 {
        schema_version: 1,
        role: NesRole::Guest,
        room: snapshot(room),
        signal_url,
        ticket: guest_ticket,
        ticket_expires_at,
    };
    Json(bundle).into_response()
}

async fn join_room(
    State(state): State<AppState>,
    Path(room_id): Path<String>,
    Extension(guest): Extension<String>,
) -> Response {
    let signal_url = state.signal_url().to_owned();
    let mut rooms = state.rooms();
    let Some(room) = rooms.get_mut(&room_id) else {
        return (StatusCode::NOT_FOUND, "room not found").into_response();
    };
    if room.host_pubkey == guest {
        return (StatusCode::BAD_REQUEST, "host cannot join as player 2").into_response();
    }
    if room.is_expired() || room.state != RoomState::Waiting || room.guest_pubkey.is_some() {
        return (StatusCode::CONFLICT, "room is no longer joinable").into_response();
    }
    {
        let active = state.active_by_pubkey();
        if active.contains_key(&guest) {
            return (StatusCode::CONFLICT, "player already has an active room").into_response();
        }
    }

    room.guest_pubkey = Some(guest.clone());
    let guest_ticket = uuid::Uuid::new_v4().to_string();
    let ticket_expires_at = now() + TICKET_TTL_SECS;
    room.set_ticket(NesRole::Guest, guest_ticket.clone(), ticket_expires_at);
    room.transition(RoomState::Negotiating).ok();
    let bundle = NesConnectionBundleV1 {
        schema_version: 1,
        role: NesRole::Guest,
        room: snapshot(room),
        signal_url,
        ticket: guest_ticket,
        ticket_expires_at,
    };
    drop(rooms);
    state.active_by_pubkey().insert(guest, room_id);
    Json(bundle).into_response()
}

async fn refresh_room(
    State(state): State<AppState>,
    Path(room_id): Path<String>,
    Extension(pubkey): Extension<String>,
) -> Response {
    let mut rooms = state.rooms();
    let Some(room) = rooms.get_mut(&room_id) else {
        return (StatusCode::NOT_FOUND, "room not found").into_response();
    };
    let Some(role) = room.role_for(&pubkey) else {
        return (StatusCode::FORBIDDEN, "not a participant").into_response();
    };
    let ticket = uuid::Uuid::new_v4().to_string();
    let ticket_expires_at = now() + TICKET_TTL_SECS;
    room.set_ticket(role, ticket.clone(), ticket_expires_at);
    let signal_url = state.signal_url().to_owned();
    let bundle = NesConnectionBundleV1 {
        schema_version: 1,
        role,
        room: snapshot(room),
        signal_url,
        ticket,
        ticket_expires_at,
    };
    Json(bundle).into_response()
}

async fn leave_room(
    State(state): State<AppState>,
    Path(room_id): Path<String>,
    Extension(pubkey): Extension<String>,
) -> Response {
    let mut rooms = state.rooms();
    let Some(room) = rooms.get_mut(&room_id) else {
        return (StatusCode::NOT_FOUND, "room not found").into_response();
    };
    if room.role_for(&pubkey).is_none() {
        return (StatusCode::FORBIDDEN, "not a participant").into_response();
    }
    room.transition(RoomState::Ended).ok();
    drop(rooms);
    cleanup_room(&state, &room_id);
    (StatusCode::OK, "left").into_response()
}

async fn end_room(
    State(state): State<AppState>,
    Path(room_id): Path<String>,
    Extension(pubkey): Extension<String>,
) -> Response {
    let mut rooms = state.rooms();
    let Some(room) = rooms.get_mut(&room_id) else {
        return (StatusCode::NOT_FOUND, "room not found").into_response();
    };
    if room.host_pubkey != pubkey {
        return (StatusCode::FORBIDDEN, "only the host may end the room").into_response();
    }
    room.transition(RoomState::Ended).ok();
    drop(rooms);
    cleanup_room(&state, &room_id);
    (StatusCode::OK, "ended").into_response()
}

async fn signal_upgrade(State(state): State<AppState>, ws: WebSocketUpgrade) -> Response {
    ws.on_upgrade(move |socket| handle_signal(state, socket))
}

async fn handle_signal(state: AppState, mut socket: WebSocket) {
    // First message must be the single-use ticket within 5 seconds.
    let authed = tokio::time::timeout(std::time::Duration::from_secs(5), socket.recv()).await;
    let Ok(Some(Ok(Message::Text(text)))) = authed else {
        let _ = socket.send(Message::Close(None)).await;
        return;
    };
    let v: serde_json::Value = match serde_json::from_str(&text) {
        Ok(v) => v,
        Err(_) => {
            let _ = socket.send(Message::Close(None)).await;
            return;
        }
    };
    let (Some(ticket), Some(room_id)) = (
        v.get("ticket").and_then(|t| t.as_str()),
        v.get("room_id").and_then(|t| t.as_str()),
    ) else {
        let _ = socket.send(Message::Close(None)).await;
        return;
    };

    let role = {
        let mut rooms = state.rooms();
        rooms.get_mut(room_id).and_then(|room| {
            let role = [NesRole::Host, NesRole::Guest]
                .into_iter()
                .find(|role| room.ticket_for(*role) == Some(ticket) && !room.ticket_expired(*role));
            if let Some(role) = role {
                room.consume_ticket(role);
            }
            role
        })
    };
    let Some(role) = role else {
        let _ = socket.send(Message::Close(None)).await;
        return;
    };

    let sender = state.signal_channel(room_id);
    let mut receiver = sender.subscribe();

    loop {
        tokio::select! {
            incoming = socket.recv() => {
                let Some(Ok(msg)) = incoming else { break; };
                let text = match msg {
                    Message::Text(text) => text.to_string(),
                    Message::Close(_) => break,
                    _ => continue,
                };
                let envelope: NesSignalEnvelopeV1 = match serde_json::from_str(&text) {
                    Ok(envelope) => envelope,
                    Err(error) => {
                        let _ = socket.send(Message::Text(
                            format!("{{\"error\":\"invalid envelope: {error}\"}}").into(),
                        )).await;
                        continue;
                    }
                };
                if envelope.room_id != room_id {
                    let _ = socket.send(Message::Text("{\"error\":\"cross-room signaling rejected\"}".into())).await;
                    continue;
                }
                if let Err(error) = validate_envelope(&envelope) {
                    let _ = socket.send(Message::Text(
                        format!("{{\"error\":\"{error}\"}}").into(),
                    )).await;
                    continue;
                }

                let sequence_ok = {
                    let mut rooms = state.rooms();
                    rooms.get_mut(room_id).is_some_and(|room| {
                        let last = match role {
                            NesRole::Host => &mut room.host_seq,
                            NesRole::Guest => &mut room.guest_seq,
                        };
                        if envelope.seq <= *last {
                            false
                        } else {
                            *last = envelope.seq;
                            if envelope.signal_type == SignalType::Input {
                                room.transition(RoomState::Connected).ok();
                            }
                            true
                        }
                    })
                };
                if !sequence_ok {
                    let _ = socket.send(Message::Text("{\"error\":\"stale signaling sequence\"}".into())).await;
                    continue;
                }
                let _ = sender.send(SignalRelay { role, message: text });
            }
            relay = receiver.recv() => {
                match relay {
                    Ok(relay) if relay.role != role => {
                        if socket.send(Message::Text(relay.message.into())).await.is_err() {
                            break;
                        }
                    }
                    Ok(_) => {}
                    Err(tokio::sync::broadcast::error::RecvError::Lagged(_)) => continue,
                    Err(tokio::sync::broadcast::error::RecvError::Closed) => break,
                }
            }
        }
    }

    let peer_left = serde_json::to_string(&NesSignalEnvelopeV1 {
        v: 1,
        signal_type: SignalType::PeerLeft,
        room_id: room_id.to_string(),
        seq: u64::MAX,
        payload: serde_json::json!({}),
    })
    .unwrap_or_default();
    let _ = sender.send(SignalRelay {
        role,
        message: peer_left,
    });
}

fn snapshot(room: &Room) -> NesRoomSnapshotV1 {
    NesRoomSnapshotV1 {
        schema_version: 1,
        room_id: room.room_id.clone(),
        host_pubkey: room.host_pubkey.clone(),
        guest_pubkey: room.guest_pubkey.clone(),
        state: room.state,
        created_at: room.created_at,
        expires_at: room.expires_at,
    }
}

fn cleanup_room(state: &AppState, room_id: &str) {
    if let Some(room) = state.rooms().remove(room_id) {
        let mut active = state.active_by_pubkey();
        active.remove(&room.host_pubkey);
        if let Some(guest) = room.guest_pubkey {
            active.remove(&guest);
        }
    }
    state.remove_signal_channel(room_id);
}
