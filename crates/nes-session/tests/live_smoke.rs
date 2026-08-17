//! Opt-in smoke test against a running NES session service.
//! The test creates and immediately ends one in-memory public room.

use nes_protocol::nip98::sign_nip98;

const TEST_KEY: &str = "0000000000000000000000000000000000000000000000000000000000000004";

fn auth_for(url: &str, method: &str, body: &[u8]) -> String {
    let event = sign_nip98(TEST_KEY, url, method, body, nes_protocol::nip98::now_unix()).unwrap();
    use base64::Engine as _;
    let encoded = base64::engine::general_purpose::URL_SAFE_NO_PAD
        .encode(serde_json::to_vec(&event).unwrap());
    format!("Nostr {encoded}")
}

#[tokio::test]
#[ignore = "requires NES_LIVE_BASE and a running service"]
async fn live_public_room_create_list_end_roundtrip() {
    let base = std::env::var("NES_LIVE_BASE")
        .expect("NES_LIVE_BASE must point to the running service")
        .trim_end_matches('/')
        .to_string();
    let rooms_url = format!("{base}/v1/rooms");
    let client = reqwest::Client::new();

    let created = client
        .post(&rooms_url)
        .header("authorization", auth_for(&rooms_url, "POST", b"{}"))
        .header("content-type", "application/json")
        .body("{}")
        .send()
        .await
        .unwrap();
    assert_eq!(created.status(), 200);
    let created_json: serde_json::Value = created.json().await.unwrap();
    let room_id = created_json["bundle"]["room"]["room_id"]
        .as_str()
        .unwrap()
        .to_string();

    let listed = client
        .get(&rooms_url)
        .header("authorization", auth_for(&rooms_url, "GET", b""))
        .send()
        .await
        .unwrap();
    assert_eq!(listed.status(), 200);
    let rooms: serde_json::Value = listed.json().await.unwrap();
    assert!(rooms
        .as_array()
        .unwrap()
        .iter()
        .any(|room| room["room_id"] == room_id && room["joinable"] == true));

    let end_url = format!("{base}/v1/rooms/{room_id}");
    let ended = client
        .delete(&end_url)
        .header("authorization", auth_for(&end_url, "DELETE", b""))
        .send()
        .await
        .unwrap();
    assert_eq!(ended.status(), 200);
}
