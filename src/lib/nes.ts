import { invoke } from "@tauri-apps/api/core";

export interface NesRelayConfigV1 {
  schema_version: number;
  service_base_url: string;
}

export interface NesRomPayloadV1 {
  name: string;
  size_bytes: number;
  sha256: string;
}

export interface NesRomOpenResult {
  payload: NesRomPayloadV1;
  data_b64: string;
}

export async function nesGetConfig(): Promise<NesRelayConfigV1> {
  return invoke<NesRelayConfigV1>("nes_get_config");
}

export async function nesSaveConfig(config: NesRelayConfigV1): Promise<void> {
  return invoke<void>("nes_save_config", { config });
}

export async function nesTestServer(config: NesRelayConfigV1): Promise<void> {
  return invoke<void>("nes_test_server", { config });
}

export async function nesOpenRom(path: string): Promise<NesRomOpenResult> {
  return invoke<NesRomOpenResult>("nes_open_rom", { path });
}

// ── Room / session commands (US-042) ───────────────────────────────────────
// Room lifecycle talks to the nes-session service over NIP-98-authenticated
// HTTP. The input-only WSS session (US-045) uses the role-specific ticket in
// the returned connection bundle.

export interface NesRoomSnapshotV1 {
  schema_version: number;
  room_id: string;
  host_pubkey: string;
  guest_pubkey: string | null;
  state: string;
  created_at: number;
  expires_at: number;
}

export interface NesRoomDirectoryEntryV1 {
  schema_version: number;
  room_id: string;
  host_pubkey: string;
  state: "waiting" | "negotiating" | "connected" | "reconnecting";
  participant_count: number;
  joinable: boolean;
  created_at: number;
  expires_at: number;
}

export interface NesConnectionBundleV1 {
  schema_version: number;
  role: "host" | "guest";
  room: NesRoomSnapshotV1;
  signal_url: string;
  ticket: string;
  ticket_expires_at: number;
}

export interface NesInviteEnvelopeV1 {
  schema_version: number;
  token: string;
  host_pubkey: string;
  expires_at: number;
}

export async function nesGetPubkey(): Promise<string> {
  return invoke<string>("nes_get_pubkey");
}

export async function nesCreateRoomAndInvite(
  config: NesRelayConfigV1,
  guestPubkey: string,
): Promise<[NesConnectionBundleV1, NesInviteEnvelopeV1]> {
  return invoke<[NesConnectionBundleV1, NesInviteEnvelopeV1]>(
    "nes_create_room_and_invite",
    { config, guestPubkey },
  );
}

export async function nesCreatePublicRoom(
  config: NesRelayConfigV1,
): Promise<NesConnectionBundleV1> {
  return invoke<NesConnectionBundleV1>("nes_create_public_room", { config });
}

export async function nesListRooms(
  config: NesRelayConfigV1,
): Promise<NesRoomDirectoryEntryV1[]> {
  return invoke<NesRoomDirectoryEntryV1[]>("nes_list_rooms", { config });
}

export async function nesJoinRoom(
  config: NesRelayConfigV1,
  roomId: string,
): Promise<NesConnectionBundleV1> {
  return invoke<NesConnectionBundleV1>("nes_join_room", { config, roomId });
}

export async function nesAcceptInvite(
  config: NesRelayConfigV1,
  token: string,
): Promise<NesConnectionBundleV1> {
  return invoke<NesConnectionBundleV1>("nes_accept_invite", { config, token });
}

export async function nesRefreshConnection(
  config: NesRelayConfigV1,
  roomId: string,
): Promise<NesConnectionBundleV1> {
  return invoke<NesConnectionBundleV1>("nes_refresh_connection", { config, roomId });
}

export async function nesLeaveRoom(config: NesRelayConfigV1, roomId: string): Promise<void> {
  return invoke<void>("nes_leave_room", { config, roomId });
}

export async function nesEndRoom(config: NesRelayConfigV1, roomId: string): Promise<void> {
  return invoke<void>("nes_end_room", { config, roomId });
}
