//! Integration test: boot the router on a real TCP socket, then exercise the
//! NIP-98-authenticated room creation and health endpoints over HTTP.

use futures_util::{SinkExt, StreamExt};
use nes_protocol::nip98::sign_nip98;
use nes_session::{build_router, AppState};
use std::net::SocketAddr;

async fn spawn_test_server() -> (SocketAddr, String) {
    let state = AppState::new();
    spawn_server_with_state(state).await
}

async fn spawn_server_with_state(state: AppState) -> (SocketAddr, String) {
    let app = build_router(state);
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, app).await.unwrap();
    });
    (addr, "http://".to_string() + &addr.to_string())
}

#[tokio::test]
async fn connection_bundle_uses_configured_wss_and_no_turn_servers() {
    let state = AppState::with_signal_url("wss://nes.example.com/v1/signal".into());
    let (_addr, base) = spawn_server_with_state(state).await;
    let url = format!("{base}/v1/rooms");
    let response = reqwest::Client::new()
        .post(&url)
        .header("authorization", auth_for(TEST_KEY, &url, "POST", b"{}"))
        .header("content-type", "application/json")
        .body("{}")
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), 200);
    let value: serde_json::Value = response.json().await.unwrap();
    assert_eq!(
        value["bundle"]["signal_url"],
        "wss://nes.example.com/v1/signal"
    );
    assert!(value["bundle"].get("turn_servers").is_none());
}

// A fixed test identity (do not use in production).
const TEST_KEY: &str = "0000000000000000000000000000000000000000000000000000000000000001";

fn auth_for(private_key: &str, url: &str, method: &str, body: &[u8]) -> String {
    let event = sign_nip98(
        private_key,
        url,
        method,
        body,
        nes_protocol::nip98::now_unix(),
    )
    .unwrap();
    use base64::Engine as _;
    let encoded = base64::engine::general_purpose::URL_SAFE_NO_PAD
        .encode(serde_json::to_vec(&event).unwrap());
    format!("Nostr {encoded}")
}

#[tokio::test]
async fn health_live_serves_200() {
    let (addr, base) = spawn_test_server().await;
    let resp = reqwest::get(format!("{base}/health/live")).await.unwrap();
    assert_eq!(resp.status(), 200);
    let _ = addr;
}

#[tokio::test]
async fn create_room_requires_valid_nip98() {
    let (_addr, base) = spawn_test_server().await;
    let url = format!("{base}/v1/rooms");
    let body =
        r#"{"guest_pubkey":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}"#;

    // Without auth: 401.
    let client = reqwest::Client::new();
    let noauth = client
        .post(&url)
        .header("content-type", "application/json")
        .body(body)
        .send()
        .await
        .unwrap();
    assert_eq!(noauth.status(), 401);

    // With a signed NIP-98 event: 200 + a connection bundle.
    let now = nes_protocol::nip98::now_unix();
    let event = sign_nip98(TEST_KEY, &url, "POST", body.as_bytes(), now).unwrap();
    let event_json = serde_json::to_string(&event).unwrap();
    use base64::Engine as _;
    let encoded = base64::engine::general_purpose::URL_SAFE_NO_PAD.encode(event_json.as_bytes());
    let authed = client
        .post(&url)
        .header("authorization", format!("Nostr {encoded}"))
        .header("content-type", "application/json")
        .body(body)
        .send()
        .await
        .unwrap();
    assert_eq!(authed.status(), 200);
    let value: serde_json::Value = authed.json().await.unwrap();
    assert!(value["bundle"]["room"]["room_id"].is_string());
    assert!(value["bundle"]["ticket"].is_string());
    assert!(value["invite"]["token"].is_string());
}

#[tokio::test]
async fn replay_attack_is_rejected() {
    let (_addr, base) = spawn_test_server().await;
    let url = format!("{base}/v1/rooms");
    let body =
        r#"{"guest_pubkey":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"}"#;

    let now = nes_protocol::nip98::now_unix();
    let event = sign_nip98(TEST_KEY, &url, "POST", body.as_bytes(), now).unwrap();
    let event_json = serde_json::to_string(&event).unwrap();
    use base64::Engine as _;
    let encoded = base64::engine::general_purpose::URL_SAFE_NO_PAD.encode(event_json.as_bytes());
    let auth = format!("Nostr {encoded}");

    let client = reqwest::Client::new();
    let first = client
        .post(&url)
        .header("authorization", &auth)
        .header("content-type", "application/json")
        .body(body)
        .send()
        .await
        .unwrap();
    assert_eq!(first.status(), 200);

    // Same event replayed: 401.
    let second = client
        .post(&url)
        .header("authorization", &auth)
        .header("content-type", "application/json")
        .body(body)
        .send()
        .await
        .unwrap();
    assert_eq!(second.status(), 401);
}

#[tokio::test]
async fn public_room_is_listed_and_only_one_guest_can_claim_it() {
    let (_addr, base) = spawn_test_server().await;
    let client = reqwest::Client::new();
    let rooms_url = format!("{base}/v1/rooms");
    let create_body = b"{}";
    let created = client
        .post(&rooms_url)
        .header(
            "authorization",
            auth_for(TEST_KEY, &rooms_url, "POST", create_body),
        )
        .header("content-type", "application/json")
        .body(create_body.as_slice())
        .send()
        .await
        .unwrap();
    assert_eq!(created.status(), 200);
    let created_json: serde_json::Value = created.json().await.unwrap();
    let room_id = created_json["bundle"]["room"]["room_id"]
        .as_str()
        .unwrap()
        .to_string();
    assert!(created_json.get("invite").is_none());

    let listed = client.get(&rooms_url).send().await.unwrap();
    assert_eq!(listed.status(), 200);
    let directory: serde_json::Value = listed.json().await.unwrap();
    assert_eq!(directory[0]["room_id"], room_id);
    assert_eq!(directory[0]["participant_count"], 1);
    assert_eq!(directory[0]["joinable"], true);
    assert!(directory[0].get("ticket").is_none());

    let join_url = format!("{base}/v1/rooms/{room_id}/join");
    let joined = client.post(&join_url).send().await.unwrap();
    assert_eq!(joined.status(), 200);
    let joined_json: serde_json::Value = joined.json().await.unwrap();
    assert_eq!(joined_json["role"], "guest");
    assert!(joined_json["room"]["guest_pubkey"].is_string());

    let rejected = client.post(&join_url).send().await.unwrap();
    assert_eq!(rejected.status(), 409);
}

#[tokio::test]
async fn signaling_fans_out_between_authenticated_room_roles() {
    let (addr, base) = spawn_test_server().await;
    let client = reqwest::Client::new();
    let rooms_url = format!("{base}/v1/rooms");
    let created = client
        .post(&rooms_url)
        .header(
            "authorization",
            auth_for(TEST_KEY, &rooms_url, "POST", b"{}"),
        )
        .header("content-type", "application/json")
        .body("{}")
        .send()
        .await
        .unwrap();
    let host_bundle: serde_json::Value = created.json().await.unwrap();
    let room_id = host_bundle["bundle"]["room"]["room_id"].as_str().unwrap();
    let host_ticket = host_bundle["bundle"]["ticket"].as_str().unwrap();

    let join_url = format!("{base}/v1/rooms/{room_id}/join");
    let joined = client.post(&join_url).send().await.unwrap();
    let guest_bundle: serde_json::Value = joined.json().await.unwrap();
    let guest_ticket = guest_bundle["ticket"].as_str().unwrap();

    let signal_url = format!("ws://{addr}/v1/signal");
    let (mut host_ws, _) = tokio_tungstenite::connect_async(&signal_url).await.unwrap();
    let (mut guest_ws, _) = tokio_tungstenite::connect_async(&signal_url).await.unwrap();
    host_ws
        .send(tokio_tungstenite::tungstenite::Message::Text(
            serde_json::json!({ "ticket": host_ticket, "room_id": room_id })
                .to_string()
                .into(),
        ))
        .await
        .unwrap();
    guest_ws
        .send(tokio_tungstenite::tungstenite::Message::Text(
            serde_json::json!({ "ticket": guest_ticket, "room_id": room_id })
                .to_string()
                .into(),
        ))
        .await
        .unwrap();
    tokio::time::sleep(std::time::Duration::from_millis(25)).await;

    let ready = serde_json::json!({
        "v": 1,
        "type": "rom_ready",
        "room_id": room_id,
        "seq": 1,
        "payload": { "sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }
    });
    host_ws
        .send(tokio_tungstenite::tungstenite::Message::Text(
            ready.to_string().into(),
        ))
        .await
        .unwrap();

    let relayed = tokio::time::timeout(std::time::Duration::from_secs(1), guest_ws.next())
        .await
        .unwrap()
        .unwrap()
        .unwrap();
    let relayed_json: serde_json::Value = serde_json::from_str(relayed.to_text().unwrap()).unwrap();
    assert_eq!(relayed_json["type"], "rom_ready");
    assert_eq!(relayed_json["room_id"], room_id);
}
