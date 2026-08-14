import { invoke } from "@tauri-apps/api/core";

export interface BuzzRelayConfig {
  relay_url: string;
  allow_insecure: boolean;
  identity_pubkey?: string;
}

export interface BuzzChannel {
  channel_id: string;
  name: string;
  description: string;
  created_at: number;
}

export interface BuzzMessage {
  id: string;
  pubkey: string;
  content: string;
  created_at: number;
  kind: number;
  tags: string[][];
}

export interface BuzzUserProfile {
  pubkey: string;
  display_name?: string;
  name?: string;
  picture?: string;
  about?: string;
}

export interface BuzzMember {
  pubkey: string;
  role: string;
  display_name?: string;
  picture?: string;
}

export interface BuzzDmResult {
  dm_id: string;
  accepted: boolean;
  event_id?: string;
}

export interface BuzzAgentConfig {
  agent_id: string;
  name: string;
  instructions: string;
  project_root: string;
  assigned_channels: string[];
  allowlist_pubkeys: string[];
  autostart: boolean;
  status: string;
}

export async function buzzGetConfig(): Promise<BuzzRelayConfig> {
  return invoke<BuzzRelayConfig>("buzz_get_config");
}

export async function buzzSetConfig(config: BuzzRelayConfig): Promise<void> {
  return invoke<void>("buzz_set_config", { config });
}

export async function buzzListChannels(relayUrl?: string): Promise<BuzzChannel[]> {
  return invoke<BuzzChannel[]>("buzz_list_channels", { relayUrl });
}

export async function buzzGetMessages(channelId: string, limit?: number): Promise<BuzzMessage[]> {
  return invoke<BuzzMessage[]>("buzz_get_messages", { channelId, limit });
}

export async function buzzGetThread(channelId: string, eventId: string, limit?: number): Promise<BuzzMessage[]> {
  return invoke<BuzzMessage[]>("buzz_get_thread", { channelId, eventId, limit });
}

export async function buzzSendMessage(
  channelId: string,
  content: string,
  replyTo?: string,
  mentions?: string[],
): Promise<string> {
  return invoke<string>("buzz_send_message", { channelId, content, replyTo, mentions });
}

export async function buzzListMembers(channelId: string): Promise<BuzzMember[]> {
  return invoke<BuzzMember[]>("buzz_list_members", { channelId });
}

export async function buzzResolveUsers(pubkeys: string[]): Promise<BuzzUserProfile[]> {
  return invoke<BuzzUserProfile[]>("buzz_resolve_users", { pubkeys });
}

export async function buzzOpenDm(pubkeys: string[]): Promise<BuzzDmResult> {
  return invoke<BuzzDmResult>("buzz_open_dm", { pubkeys });
}

export async function buzzListAgents(): Promise<BuzzAgentConfig[]> {
  return invoke<BuzzAgentConfig[]>("buzz_list_agents");
}

export async function buzzAddAgent(agent: BuzzAgentConfig): Promise<void> {
  return invoke<void>("buzz_add_agent", { agent });
}

export async function buzzHasIdentity(): Promise<boolean> {
  return invoke<boolean>("buzz_has_identity");
}

export async function buzzGenerateIdentity(): Promise<string> {
  return invoke<string>("buzz_generate_identity");
}

export async function buzzImportIdentity(key: string): Promise<void> {
  return invoke<void>("buzz_import_identity", { key });
}

export async function buzzClearIdentity(): Promise<void> {
  return invoke<void>("buzz_clear_identity");
}
