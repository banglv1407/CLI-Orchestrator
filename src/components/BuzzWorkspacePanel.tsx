import { tFeedback as trFeedback, t as tr, useLocale, getIntlLocale } from '../i18n';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import {
  buzzGetConfig,
  buzzListChannels,
  buzzGetMessages,
  buzzGetThread,
  buzzSendMessage,
  buzzListMembers,
  buzzOpenDm,
  buzzListDms,
  buzzResolveUsers,
  buzzListAgents,
  buzzHasIdentity,
  buzzGetPubkey,
  buzzSetProfile,
  buzzGetMyProfile,
  buzzSubscribeLive,
  buzzUnsubscribeLive,
  BuzzChannel,
  BuzzMessage,
  BuzzMember,
  BuzzAgentConfig,
  BuzzDmConversation,
  BuzzUserProfile,
} from "../lib/buzz";

interface ThreadState {
  root: BuzzMessage;
  replies: BuzzMessage[];
}

const BUZZ_ICON_CHOICES = [
  "😀", "😂", "😊", "😍", "🥳", "😎", "🤔", "😢",
  "😮", "😡", "👍", "👎", "👏", "🙌", "🙏", "💪",
  "❤️", "🔥", "✨", "🎉", "✅", "❌", "⚠️", "💡",
  "🚀", "🐝", "💬", "📌", "👀", "🤝", "💯", "⭐",
];

function publishUnreadTotal(counts: Record<string, number>) {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  window.dispatchEvent(new CustomEvent("buzz-unread-count", { detail: total }));
}

function isNearScrollBottom(element: HTMLDivElement) {
  return element.scrollHeight - element.scrollTop - element.clientHeight <= 48;
}

// Extract the root id a reply belongs to. NIP-10: a reply carries a `root`
// marker tag when the thread is nested; otherwise the first `reply` tag points
// at the immediate parent (which for shallow threads is the root).
function replyRootId(msg: BuzzMessage): string | null {
  const root = msg.tags.find((t) => t[0] === "e" && t[3] === "root");
  if (root && root[1]) return root[1];
  const reply = msg.tags.find((t) => t[0] === "e" && t[3] === "reply");
  return reply && reply[1] ? reply[1] : null;
}

function isReply(msg: BuzzMessage): boolean {
  return msg.tags.some((t) => t[0] === "e" && t[3] === "reply");
}

// Merge a list of messages into existing state, keyed by id (dedup + append).
function mergeMessages(existing: BuzzMessage[], incoming: BuzzMessage[]): BuzzMessage[] {
  const seen = new Set(existing.map((m) => m.id));
  const out = [...existing];
  for (const m of incoming) {
    if (!m.id || seen.has(m.id)) continue;
    seen.add(m.id);
    out.push(m);
  }
  return out.sort((a, b) => a.created_at - b.created_at);
}

// Helper to detect if a channel returned by Buzz is actually a Direct Message
function isDmChannel(ch: BuzzChannel): boolean {
  const name = ch.name.trim().toLowerCase();
  const desc = (ch.description || "").trim().toLowerCase();
  return (
    name === "dm" ||
    name.startsWith("dm ") ||
    name.startsWith("dm-") ||
    desc.includes("direct message") ||
    desc === "dm"
  );
}

export function BuzzWorkspacePanel({ isVisible = true }: { isVisible?: boolean }) {
  const locale = useLocale();
  const [channels, setChannels] = useState<BuzzChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<BuzzChannel | null>(null);
  const [messages, setMessages] = useState<BuzzMessage[]>([]);
  const [members, setMembers] = useState<BuzzMember[]>([]);
  const [agents, setAgents] = useState<BuzzAgentConfig[]>([]);
  const [dms, setDms] = useState<BuzzDmConversation[]>([]);
  const [dmProfiles, setDmProfiles] = useState<Record<string, BuzzUserProfile>>({});
  const [messageProfiles, setMessageProfiles] = useState<Record<string, BuzzUserProfile>>({});
  const [myPubkey, setMyPubkey] = useState<string>("");
  const [unreadByConversation, setUnreadByConversation] = useState<Record<string, number>>({});
  const selectedChannelRef = useRef<BuzzChannel | null>(null);
  const isVisibleRef = useRef(isVisible);
  const myPubkeyRef = useRef("");
  const knownMessageIdsByConversationRef = useRef(new Map<string, Set<string>>());
  const initializedConversationsRef = useRef(new Set<string>());
  const hasCompletedInitialSyncRef = useRef(false);
  const mainMessagesRef = useRef<HTMLDivElement>(null);
  const threadMessagesRef = useRef<HTMLDivElement>(null);
  const mainWasAtBottomRef = useRef(true);
  const threadWasAtBottomRef = useRef(true);
  const pendingInitialScrollRef = useRef<string | null>(null);

  // Separate composer buffers for the main channel vs the thread panel.
  const [mainInput, setMainInput] = useState("");
  const [threadInput, setThreadInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasIdentity, setHasIdentity] = useState(false);
  const [liveState, setLiveState] = useState<string>("idle");
  const [liveError, setLiveError] = useState<string | null>(null);

  // Profile (display name / about / avatar) editor
  const [profileName, setProfileName] = useState("");
  const [profileAbout, setProfileAbout] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  // Mention autocomplete (shared across composers)
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const threadInputRef = useRef<HTMLInputElement>(null);

  // Thread view
  const [activeThread, setActiveThread] = useState<ThreadState | null>(null);

  // Direct message modal
  const [showDmModal, setShowDmModal] = useState(false);
  const [dmPubkey, setDmPubkey] = useState("");

  // Collapsible section state for the left rail (Explorer-style accordion).
  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [dmsExpanded, setDmsExpanded] = useState(true);

  useEffect(() => {
    loadInitial();
  }, []);

  async function loadInitial() {
    try {
      const cfg = await buzzGetConfig();
      // Relay URL lives in Settings now; no per-workspace input.
      void cfg;
    } catch (e) {
      console.warn("Failed to load Buzz config:", e);
    }
    refreshIdentity();
    fetchChannels();
    loadAgents();
    loadDms();
    buzzGetPubkey()
      .then((pubkey) => {
        myPubkeyRef.current = pubkey;
        setMyPubkey(pubkey);
      })
      .catch(() => {});
  }

  function updateUnreadCounts(
    update: (current: Record<string, number>) => Record<string, number>,
  ) {
    setUnreadByConversation((current) => {
      const next = update(current);
      publishUnreadTotal(next);
      return next;
    });
  }

  function markConversationRead(conversationId: string) {
    updateUnreadCounts((current) => {
      if (!current[conversationId]) return current;
      const next = { ...current };
      delete next[conversationId];
      return next;
    });
  }

  function rememberMessages(conversationId: string, incoming: BuzzMessage[]) {
    let known = knownMessageIdsByConversationRef.current.get(conversationId);
    if (!known) {
      known = new Set<string>();
      knownMessageIdsByConversationRef.current.set(conversationId, known);
    }

    const unseen: BuzzMessage[] = [];
    for (const message of incoming) {
      if (!message.id || known.has(message.id)) continue;
      known.add(message.id);
      unseen.push(message);
    }
    return unseen;
  }

  function countUnreadMessages(conversationId: string, incoming: BuzzMessage[]) {
    if (localStorage.getItem("clx-buzz-background-notifications") === "false") return;
    const ownPubkey = myPubkeyRef.current;
    if (!ownPubkey) return;
    const count = incoming.filter((message) => message.pubkey !== ownPubkey).length;
    if (count === 0) return;
    updateUnreadCounts((current) => ({
      ...current,
      [conversationId]: (current[conversationId] ?? 0) + count,
    }));
  }

  // Opening Buzz only marks the conversation actually on screen as read.
  // Unread messages in other channels and DMs remain visible in their badges.
  useEffect(() => {
    isVisibleRef.current = isVisible;
    if (isVisible && selectedChannel) {
      markConversationRead(selectedChannel.channel_id);
    }
  }, [isVisible, selectedChannel]);

  useEffect(() => {
    selectedChannelRef.current = selectedChannel;
  }, [selectedChannel]);

  useEffect(() => {
    myPubkeyRef.current = myPubkey;
  }, [myPubkey]);

  useEffect(() => {
    const clearUnread = () => {
      setUnreadByConversation({});
      publishUnreadTotal({});
    };
    const markCurrentRead = () => {
      const conversationId = selectedChannelRef.current?.channel_id;
      if (conversationId) markConversationRead(conversationId);
    };
    window.addEventListener("buzz-clear-unread", clearUnread);
    window.addEventListener("buzz-mark-current-read", markCurrentRead);
    return () => {
      window.removeEventListener("buzz-clear-unread", clearUnread);
      window.removeEventListener("buzz-mark-current-read", markCurrentRead);
    };
  }, []);

  // Live message receiver and per-conversation unread dispatcher. The listener
  // is wired once and reads current UI state through refs, avoiding duplicate
  // listeners while channels change.
  useEffect(() => {
    let unlistenMessage: (() => void) | undefined;
    let unlistenStatus: (() => void) | undefined;
    let unlistenEose: (() => void) | undefined;
    let cancelled = false;

    const wire = async () => {
      const off = await listen<BuzzMessage>("buzz-live-message", (ev) => {
        const msg = ev.payload;
        const msgChannelId = msg.tags.find((t) => t[0] === "h")?.[1];
        if (!msgChannelId) return;
        const unseen = rememberMessages(msgChannelId, [msg]);
        if (unseen.length === 0) return;

        const currentChannel = selectedChannelRef.current;

        // 1. If this message is for the currently viewed channel/DM, append it
        if (currentChannel && msgChannelId === currentChannel.channel_id) {
          setMessages((prev) => mergeMessages(prev, [msg]));

          // If a thread is open and this message replies into it, append there too
          setActiveThread((prev) => {
            if (prev && replyRootId(msg) === prev.root.id) {
              return { root: prev.root, replies: mergeMessages(prev.replies, [msg]) };
            }
            return prev;
          });
        }

        // The first relay subscription replays stored history before EOSE.
        // Reconnect replay is counted only for ids not seen in this app run, so
        // messages missed during a connection gap still become unread once.
        if (hasCompletedInitialSyncRef.current) {
          countUnreadMessages(msgChannelId, unseen);
        }
      });
      unlistenMessage = off;

      const offStatus = await listen<{ state: string; error?: string }>(
        "buzz-live-status",
        (ev) => {
          setLiveState(ev.payload.state);
          if (ev.payload.error) setLiveError(ev.payload.error);
        },
      );
      unlistenStatus = offStatus;

      const offEose = await listen("buzz-live-eose", () => {
        for (const conversationId of knownMessageIdsByConversationRef.current.keys()) {
          initializedConversationsRef.current.add(conversationId);
        }
        hasCompletedInitialSyncRef.current = true;
      });
      unlistenEose = offEose;

      if (cancelled) {
        off();
        offStatus();
        offEose();
        return;
      }

      // Subscribe only after all listeners exist; otherwise a fast relay can
      // deliver EOSE before the UI is ready and leave unread counting disabled.
      buzzSubscribeLive("all").catch((e) =>
        console.warn("live subscribe to all streams failed:", e),
      );
    };
    wire();

    return () => {
      cancelled = true;
      unlistenMessage?.();
      unlistenStatus?.();
      unlistenEose?.();
      buzzUnsubscribeLive().catch(() => {});
    };
  }, []);

  // Pure public channels (excluding any channel that is a DM)
  const publicChannels = useMemo(() => {
    return channels.filter((c) => !isDmChannel(c));
  }, [channels]);

  // Direct Message channels found inside channels list
  const channelDms = useMemo(() => {
    return channels.filter((c) => isDmChannel(c));
  }, [channels]);

  // Combined DM list from both `dms` (buzzListDms) and `channelDms`
  const allDms = useMemo(() => {
    const map = new Map<string, { dmId: string; participants: string[]; nameFallback?: string }>();

    // Add DMs from `dms list`
    for (const d of dms) {
      map.set(d.dm_id, { dmId: d.dm_id, participants: d.participants });
    }

    // Add DM channels from `channels list`
    for (const cd of channelDms) {
      if (!map.has(cd.channel_id)) {
        map.set(cd.channel_id, {
          dmId: cd.channel_id,
          participants: [],
          nameFallback: cd.name !== "DM" ? cd.name : undefined,
        });
      }
    }

    return Array.from(map.values());
  }, [dms, channelDms]);

  // Auto-resolve members for DM channels to extract participant pubkeys & profiles
  useEffect(() => {
    const fetchDmMappings = async () => {
      const neededPubkeys = new Set<string>();

      for (const dmItem of allDms) {
        if (dmItem.participants.length === 0) {
          try {
            const mems = await buzzListMembers(dmItem.dmId);
            for (const m of mems) {
              if (m.pubkey) {
                dmItem.participants.push(m.pubkey);
                neededPubkeys.add(m.pubkey);
              }
            }
          } catch {
            // ignore failure
          }
        }
      }

      if (neededPubkeys.size > 0) {
        try {
          const profiles = await buzzResolveUsers([...neededPubkeys]);
          setDmProfiles((prev) => {
            const next = { ...prev };
            for (const p of profiles) next[p.pubkey] = p;
            return next;
          });
        } catch {
          // ignore
        }
      }
    };

    if (allDms.length > 0) {
      void fetchDmMappings();
    }
  }, [allDms]);

  async function fetchChannels() {
    setLoading(true);
    setError(null);
    try {
      const list = await buzzListChannels();
      setChannels(list);
      // Auto-select the first public channel if none selected
      const pubList = list.filter((c) => !isDmChannel(c));
      if (pubList.length > 0 && !selectedChannel) {
        selectChannel(pubList[0]);
      }
    } catch (e: any) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function loadDms() {
    try {
      const list = await buzzListDms();
      setDms(list);
      // Resolve participant profiles for names + avatars.
      const pubkeys = new Set<string>();
      for (const dm of list) for (const p of dm.participants) pubkeys.add(p);
      if (pubkeys.size > 0) {
        const profiles = await buzzResolveUsers([...pubkeys]);
        const map: Record<string, BuzzUserProfile> = {};
        for (const p of profiles) map[p.pubkey] = p;
        setDmProfiles(map);
      }
    } catch (e) {
      console.warn("Failed to load DMs:", e);
    }
  }

  function selectChannel(ch: BuzzChannel) {
    selectedChannelRef.current = ch;
    setSelectedChannel(ch);
    setActiveThread(null);
    setMessages([]);
    setMembers([]);
    mainWasAtBottomRef.current = true;
    pendingInitialScrollRef.current = ch.channel_id;
    if (isVisibleRef.current) markConversationRead(ch.channel_id);
    fetchMessages(ch.channel_id);
    fetchMembers(ch.channel_id);
  }

  async function fetchMessages(channelId: string) {
    setLoadingMessages(true);
    try {
      const msgs = await buzzGetMessages(channelId, 50);
      rememberMessages(channelId, msgs);
      initializedConversationsRef.current.add(channelId);
      setMessages(msgs);
      void resolveMessageAuthors(msgs);
    } catch (e: any) {
      setError(String(e));
    } finally {
      setLoadingMessages(false);
    }
  }

  async function resolveMessageAuthors(incoming: BuzzMessage[]) {
    const pubkeys = [...new Set(incoming.map((message) => message.pubkey).filter(Boolean))];
    if (pubkeys.length === 0) return;

    try {
      const profiles = await buzzResolveUsers(pubkeys);
      if (profiles.length === 0) return;
      const byPubkey: Record<string, BuzzUserProfile> = {};
      for (const profile of profiles) byPubkey[profile.pubkey] = profile;

      setMessageProfiles((current) => ({ ...current, ...byPubkey }));
      setDmProfiles((current) => ({ ...current, ...byPubkey }));
      setMembers((current) =>
        current.map((member) => {
          const profile = byPubkey[member.pubkey];
          if (!profile) return member;
          return {
            ...member,
            display_name: profile.display_name || profile.name || member.display_name,
            picture: profile.picture || member.picture,
          };
        }),
      );
    } catch (e) {
      console.warn("Failed to resolve Buzz message authors:", e);
    }
  }

  async function fetchMembers(channelId: string) {
    setLoadingMembers(true);
    try {
      const list = await buzzListMembers(channelId);
      setMembers(list);
    } catch (e) {
      console.warn("Failed to load members:", e);
    } finally {
      setLoadingMembers(false);
    }
  }

  // Poll the active channel every 5s but MERGE by id (no full replace, so the
  // view never "reloads" — new messages append, nothing flickers).
  useEffect(() => {
    if (!selectedChannel) return;
    const id = window.setInterval(() => {
      void pollMessages(selectedChannel.channel_id);
    }, 5000);
    return () => window.clearInterval(id);
  }, [selectedChannel]);

  async function pollMessages(channelId: string) {
    try {
      const msgs = await buzzGetMessages(channelId, 50);
      const wasInitialized = initializedConversationsRef.current.has(channelId);
      const unseen = rememberMessages(channelId, msgs);
      initializedConversationsRef.current.add(channelId);
      setMessages((prev) => mergeMessages(prev, msgs));
      void resolveMessageAuthors(msgs);
      if (wasInitialized) countUnreadMessages(channelId, unseen);
    } catch {
      // Silent — background poll failures must not spam the error banner.
    }
  }

  async function openThread(msg: BuzzMessage) {
    if (!selectedChannel) return;
    setLoadingThread(true);
    threadWasAtBottomRef.current = true;
    try {
      const replies = await buzzGetThread(selectedChannel.channel_id, msg.id, 50);
      const root = replies.find((r) => r.id === msg.id) ?? msg;
      const rest = replies.filter((r) => r.id !== msg.id);
      setActiveThread({ root, replies: rest });
      void resolveMessageAuthors(replies);
    } catch (e: any) {
      setError(`Failed to load thread: ${e}`);
    } finally {
      setLoadingThread(false);
    }
  }

  function closeThread() {
    setActiveThread(null);
  }

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const viewport = mainMessagesRef.current;
      const channelId = selectedChannel?.channel_id;
      const forceInitialScroll = Boolean(
        channelId &&
          pendingInitialScrollRef.current === channelId &&
          !loadingMessages &&
          initializedConversationsRef.current.has(channelId),
      );
      if (viewport && (forceInitialScroll || mainWasAtBottomRef.current)) {
        viewport.scrollTop = viewport.scrollHeight;
        mainWasAtBottomRef.current = true;
      }
      if (forceInitialScroll) {
        pendingInitialScrollRef.current = null;
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages, loadingMessages, selectedChannel?.channel_id]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const viewport = threadMessagesRef.current;
      if (viewport && threadWasAtBottomRef.current) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeThread, loadingThread]);

  async function handleSendMain(e: React.FormEvent) {
    e.preventDefault();
    const channelId = selectedChannel?.channel_id;
    if (!channelId || !mainInput.trim()) return;
    await sendMessage(channelId, mainInput.trim(), undefined, () => setMainInput(""));
  }

  async function handleSendThread(e: React.FormEvent) {
    e.preventDefault();
    const channelId = selectedChannel?.channel_id;
    if (!channelId || !activeThread || !threadInput.trim()) return;
    await sendMessage(channelId, threadInput.trim(), activeThread.root.id, () =>
      setThreadInput(""),
    );
  }

  function appendIcon(icon: string, composer: "main" | "thread") {
    if (composer === "main") {
      setMainInput((current) => `${current}${icon}`);
      window.setTimeout(() => mainInputRef.current?.focus(), 0);
    } else {
      setThreadInput((current) => `${current}${icon}`);
      window.setTimeout(() => threadInputRef.current?.focus(), 0);
    }
  }

  async function sendMessage(
    channelId: string,
    content: string,
    replyTo: string | undefined,
    onSuccess: () => void,
  ) {
    const mentions = activeMentions();
    const optimisticId = `pending-${Date.now()}`;
    const now = Math.floor(Date.now() / 1000);

    // Optimistically append so the UI responds instantly (no reload).
    const optimistic: BuzzMessage = {
      id: optimisticId,
      pubkey: myPubkey || "self",
      content,
      created_at: now,
      kind: 9,
      tags: [
        ["h", channelId],
        ...(replyTo ? [["e", replyTo, "", "reply"]] : []),
      ],
    };
    setMessages((prev) => mergeMessages(prev, [optimistic]));
    onSuccess();

    try {
      const eventId = await buzzSendMessage(channelId, content, replyTo, mentions);
      if (eventId) {
        // Replace the pending placeholder with the confirmed event id.
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticId ? { ...m, id: eventId } : m)),
        );
      }
      if (replyTo && activeThread) {
        // Append the reply into the open thread without a full reload.
        setActiveThread((prev) => {
          if (!prev) return prev;
          const confirmed: BuzzMessage = {
            id: eventId || optimisticId,
            pubkey: myPubkey || "self",
            content,
            created_at: now,
            kind: 9,
            tags: [
              ["h", channelId],
              ["e", replyTo, "", "reply"],
            ],
          };
          return { root: prev.root, replies: mergeMessages(prev.replies, [confirmed]) };
        });
      }
    } catch (e: any) {
      setError(`Send failed: ${e}`);
    }
  }

  // Extract mention pubkeys from the current input (members whose @Name appears).
  function activeMentions(): string[] {
    const input = mainInput || threadInput;
    const atMatches = input.match(/@(\S+)/g) ?? [];
    const names = atMatches.map((m) => m.slice(1));
    return members
      .filter((m) => {
        const label = memberLabel(m);
        return names.some((n) => label === n || m.display_name === n);
      })
      .map((m) => m.pubkey);
  }

  function memberLabel(m: BuzzMember): string {
    return m.display_name || m.pubkey.slice(0, 8);
  }

  // ---- Mention autocomplete (shared) ----
  function onInputChange(value: string, which: "main" | "thread") {
    if (which === "main") setMainInput(value);
    else setThreadInput(value);
    const at = value.lastIndexOf("@");
    if (at >= 0 && !value.slice(at + 1).includes(" ")) {
      setMentionQuery(value.slice(at + 1).toLowerCase());
      setMentionIndex(0);
    } else {
      setMentionQuery(null);
    }
  }

  function mentionCandidates(): BuzzMember[] {
    if (mentionQuery === null) return [];
    const q = mentionQuery;
    return members
      .filter((m) => memberLabel(m).toLowerCase().includes(q) || m.pubkey.includes(q))
      .slice(0, 6);
  }

  function applyMention(m: BuzzMember) {
    const label = memberLabel(m);
    if (activeThread) {
      const at = threadInput.lastIndexOf("@");
      const prefix = threadInput.slice(0, at);
      const suffix = threadInput.slice(at + 1);
      const spaceIdx = suffix.indexOf(" ");
      const rest = spaceIdx >= 0 ? suffix.slice(spaceIdx) : "";
      setThreadInput(`${prefix}@${label} ${rest}`);
      threadInputRef.current?.focus();
    } else {
      const at = mainInput.lastIndexOf("@");
      const prefix = mainInput.slice(0, at);
      const suffix = mainInput.slice(at + 1);
      const spaceIdx = suffix.indexOf(" ");
      const rest = spaceIdx >= 0 ? suffix.slice(spaceIdx) : "";
      setMainInput(`${prefix}@${label} ${rest}`);
      mainInputRef.current?.focus();
    }
    setMentionQuery(null);
  }

  function onComposerKeyDown(e: React.KeyboardEvent) {
    const cands = mentionCandidates();
    if (mentionQuery !== null && cands.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMentionIndex((i) => (i + 1) % cands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setMentionIndex((i) => (i - 1 + cands.length) % cands.length);
      } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        applyMention(cands[mentionIndex]);
      } else if (e.key === "Escape") {
        setMentionQuery(null);
      }
    }
  }

  async function loadAgents() {
    try {
      const list = await buzzListAgents();
      setAgents(list);
    } catch (e) {
      console.warn("Failed to load agents:", e);
    }
  }

  async function refreshIdentity() {
    try {
      setHasIdentity(await buzzHasIdentity());
    } catch (e) {
      console.warn("Failed to check identity:", e);
    }
  }

  async function loadMyProfile() {
    try {
      const profile = await buzzGetMyProfile();
      if (profile) {
        setProfileName(profile.display_name || profile.name || "");
        setProfileAbout(profile.about || "");
        setProfileAvatar(profile.picture || "");
      }
    } catch (e) {
      console.warn("Failed to load own profile:", e);
    }
  }

  async function handleSaveProfile() {
    setError(null);
    if (!profileName.trim()) {
      setError("Display name cannot be empty.");
      return;
    }
    try {
      await buzzSetProfile(profileName.trim(), profileAbout.trim(), profileAvatar.trim());
      setShowProfile(false);
    } catch (e: any) {
      setError(`Save profile failed: ${e}`);
    }
  }

  async function handleOpenDm() {
    const pk = dmPubkey.trim();
    if (!pk) {
      setError("Enter a user pubkey (64-hex) or pick from members.");
      return;
    }
    await openDmWithUser(pk);
  }

  async function openDmWithUser(pubkey: string) {
    setError(null);
    const pk = pubkey.trim();
    if (!pk) return;
    if (pk === myPubkeyRef.current) {
      setError("You cannot open a direct message with yourself.");
      return;
    }

    const member = members.find((candidate) => candidate.pubkey === pk);
    const knownProfile = dmProfiles[pk];
    const profile: BuzzUserProfile | undefined = knownProfile ?? (member
      ? {
          pubkey: member.pubkey,
          display_name: member.display_name,
          picture: member.picture,
        }
      : undefined);

    try {
      const res = await buzzOpenDm([pk]);
      if (res.dm_id) {
        if (profile) {
          setDmProfiles((current) => ({ ...current, [pk]: profile }));
        }
        setDmPubkey("");
        setShowDmModal(false);
        await loadDms();
        openDmChannel(res.dm_id, [pk], profile);
      } else {
        setError("Failed to open DM: no dm_id returned.");
      }
    } catch (e: any) {
      setError(`Open DM failed: ${e}`);
    }
  }

  // Open a DM conversation as a synthetic channel (fetch by its dm_id).
  function openDmChannel(
    dmId: string,
    participants: string[],
    profileOverride?: BuzzUserProfile,
  ) {
    const other =
      participants.filter((p) => p !== myPubkeyRef.current)[0] ?? participants[0];
    const profile = profileOverride ?? (other ? dmProfiles[other] : undefined);
    const name = profile?.display_name || profile?.name || (other ? other.slice(0, 8) : "DM");
    const ch: BuzzChannel = {
      channel_id: dmId,
      name,
      description: "Direct message",
      created_at: Math.floor(Date.now() / 1000),
    };
    selectChannel(ch);
  }

  // Group top-level messages and their replies for the thread summary view.
  const topLevel = messages.filter((m) => !isReply(m));
  const repliesByRoot: Record<string, BuzzMessage[]> = {};
  for (const m of messages) {
    if (!isReply(m)) continue;
    const rootId = replyRootId(m);
    if (!rootId) continue;
    (repliesByRoot[rootId] ??= []).push(m);
  }

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 flex-col font-sans">
      {/* Top Header (identity + profile only; config lives in Settings) */}
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 bg-slate-950">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-400">{tr("🐝 Buzz Workspace")}</span>
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-bold ${
              hasIdentity ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
            }`}
          >
            {hasIdentity ? tr("IDENTITY OK") : tr("NO IDENTITY")}
          </span>
        </div>
        <button
          onClick={() => {
            setShowProfile(true);
            loadMyProfile();
          }}
          className="rounded bg-slate-800 px-2 py-1 text-xs text-amber-300 hover:bg-slate-700 transition-colors"
        >{tr("Profile")}</button>
      </div>

      {error && (
        <div className="bg-rose-900/50 border-b border-rose-700 px-4 py-1.5 text-xs text-rose-200 flex justify-between">
          <span>{tr("Error: ")}{trFeedback(error ?? '')}</span>
          <button onClick={() => setError(null)} className="text-rose-400 font-bold">✕</button>
        </div>
      )}

      {/* Main 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Explorer-style collapsible sections */}
        <div className="w-56 border-r border-slate-800 bg-slate-950/50 flex flex-col select-none">
          <div className="flex-1 overflow-y-auto p-2 space-y-3">
            {/* Channels Card (collapsible) */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setChannelsExpanded((v) => !v)}
                className="w-full flex items-center justify-between px-1 py-1 text-[11px] font-bold text-slate-400 hover:text-slate-200 uppercase tracking-wider group"
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-[9px] transition-transform text-slate-500 group-hover:text-slate-300">
                    {channelsExpanded ? "▼" : "▶"}
                  </span>
                  <span>{tr("Channels")}</span>
                </span>
                <span className="text-[10px] text-slate-600 font-mono font-normal">
                  {channels.length}
                </span>
              </button>

              {channelsExpanded && (
                <div className="space-y-0.5 pl-1">
                  {loading && <Spinner label={tr("Loading...")} />}
                  {!loading && publicChannels.length === 0 && (
                    <div className="text-[11px] text-slate-500 px-2 py-1">{tr("No channels")}</div>
                  )}
                  {publicChannels.map((ch) => (
                    <button
                      key={ch.channel_id}
                      onClick={() => selectChannel(ch)}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex flex-col ${
                        selectedChannel?.channel_id === ch.channel_id
                          ? "bg-amber-500/20 text-amber-300 font-medium"
                          : "hover:bg-slate-800 text-slate-300"
                      }`}
                    >
                      <span className="flex w-full items-center gap-2">
                        <span className="truncate"># {ch.name}</span>
                        <UnreadBadge count={unreadByConversation[ch.channel_id] ?? 0} />
                      </span>
                      {ch.description && (
                        <span className="text-[10px] text-slate-500 truncate">
                          {ch.description}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Messages Card (collapsible) */}
            <div className="space-y-1">
              <div className="w-full flex items-center justify-between px-1 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setDmsExpanded((v) => !v)}
                  className="flex items-center gap-1.5 hover:text-slate-200 group flex-1 text-left"
                >
                  <span className="text-[9px] transition-transform text-slate-500 group-hover:text-slate-300">
                    {dmsExpanded ? "▼" : "▶"}
                  </span>
                  <span>{tr("Direct Messages")}</span>
                </button>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-600 font-mono font-normal">
                    {allDms.length}
                  </span>
                  <button
                    onClick={() => setShowDmModal(true)}
                    title={tr("New direct message")}
                    className="text-amber-400 hover:text-amber-300 text-xs font-bold px-1 rounded hover:bg-slate-800"
                  >
                    +
                  </button>
                </div>
              </div>

              {dmsExpanded && (
                <div className="space-y-0.5 pl-1">
                  {allDms.length === 0 ? (
                    <div className="text-[11px] text-slate-500 px-2 py-1">{tr("No direct messages. Click + to start.")}</div>
                  ) : (
                    allDms.map((dm) => {
                      const other =
                        dm.participants.filter((p) => p !== myPubkey)[0] ?? dm.participants[0];
                      const profile = other ? dmProfiles[other] : undefined;
                      const label =
                        profile?.display_name ||
                        profile?.name ||
                        dm.nameFallback ||
                        (other ? other.slice(0, 8) : tr("Direct Message"));

                      return (
                        <button
                          key={dm.dmId}
                          onClick={() => openDmChannel(dm.dmId, dm.participants)}
                          className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center gap-2 ${
                            selectedChannel?.channel_id === dm.dmId
                              ? "bg-amber-500/20 text-amber-300 font-medium"
                              : "hover:bg-slate-800 text-slate-300"
                          }`}
                        >
                          <Avatar name={label} picture={profile?.picture} size="sm" />
                          <span className="truncate">{label}</span>
                          <UnreadBadge count={unreadByConversation[dm.dmId] ?? 0} />
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Column: Message Thread & Composer */}
        <div className="flex-1 flex flex-col bg-slate-900">
          {selectedChannel ? (
            <>
              <div className="px-4 py-2 border-b border-slate-800 text-sm font-semibold flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="flex items-center gap-2">
                    {selectedChannel.description === "Direct message" ? "@" : "#"} {selectedChannel.name}
                    <LiveIndicator state={liveState} error={trFeedback(liveError ?? '')} />
                  </span>
                  <div className="truncate font-mono text-[9px] font-normal text-slate-500" title={selectedChannel.channel_id}>{tr("Channel ID: ")}{selectedChannel.channel_id}
                  </div>
                </div>
                <button onClick={() => fetchMessages(selectedChannel.channel_id)} className="text-xs text-slate-400 hover:text-slate-200">{tr("Refresh")}</button>
              </div>

              <div
                ref={mainMessagesRef}
                onScroll={(event) => {
                  mainWasAtBottomRef.current = isNearScrollBottom(event.currentTarget);
                }}
                className="flex-1 overflow-y-auto p-4 space-y-3"
              >
                {loadingMessages ? (
                  <Spinner label={tr("Loading messages...")} />
                ) : topLevel.length === 0 ? (
                  <div className="text-xs text-slate-500">{tr("No messages in this stream.")}</div>
                ) : (
                  topLevel.map((msg) => (
                    <MessageCard
                      key={msg.id}
                      msg={msg}
                      members={members}
                      profiles={messageProfiles}
                      replyCount={(repliesByRoot[msg.id] ?? []).length}
                      replyAuthors={(repliesByRoot[msg.id] ?? []).map((r) => r.pubkey)}
                      onOpenThread={() => openThread(msg)}
                      onOpenDm={(pubkey) => void openDmWithUser(pubkey)}
                      myPubkey={myPubkey}
                    />
                  ))
                )}
              </div>

              <Composer
                inputRef={mainInputRef}
                value={mainInput}
                placeholder={tr("Message {v0}{v1}...", { v0: String(selectedChannel.description === "Direct message" ? "@" : "#"), v1: String(selectedChannel.name) })}
                onChange={(v) => onInputChange(v, "main")}
                onKeyDown={onComposerKeyDown}
                onSubmit={handleSendMain}
                mentionCandidates={mentionCandidates()}
                mentionIndex={mentionIndex}
                onApplyMention={applyMention}
                onPickIcon={(icon) => appendIcon(icon, "main")}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-500">{tr("Select a channel to view conversation")}</div>
          )}
        </div>

        {/* Right Column: Thread view OR Members/Agents */}
        {activeThread ? (
          <div className="w-80 border-l border-slate-800 bg-slate-950/50 flex flex-col">
            <div className="p-3 border-b border-slate-800 font-medium text-xs text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>{tr("Thread")}</span>
              <button onClick={closeThread} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>
            <div
              ref={threadMessagesRef}
              onScroll={(event) => {
                threadWasAtBottomRef.current = isNearScrollBottom(event.currentTarget);
              }}
              className="flex-1 overflow-y-auto p-3 space-y-3"
            >
              {loadingThread ? (
                <Spinner label={tr("Loading thread...")} />
              ) : (
                <>
                  <MessageCard
                    msg={activeThread.root}
                    members={members}
                    profiles={messageProfiles}
                    onOpenThread={() => {}}
                    onOpenDm={(pubkey) => void openDmWithUser(pubkey)}
                    myPubkey={myPubkey}
                    isRoot
                  />
                  {activeThread.replies.map((r) => (
                    <MessageCard
                      key={r.id}
                      msg={r}
                      members={members}
                      profiles={messageProfiles}
                      onOpenThread={() => {}}
                      onOpenDm={(pubkey) => void openDmWithUser(pubkey)}
                      myPubkey={myPubkey}
                    />
                  ))}
                </>
              )}
            </div>
            <Composer
              inputRef={threadInputRef}
              value={threadInput}
              placeholder={tr("Reply in thread...")}
              onChange={(v) => onInputChange(v, "thread")}
              onKeyDown={onComposerKeyDown}
              onSubmit={handleSendThread}
              mentionCandidates={mentionCandidates()}
              mentionIndex={mentionIndex}
              onApplyMention={applyMention}
              onPickIcon={(icon) => appendIcon(icon, "thread")}
            />
          </div>
        ) : (
          <div className="w-64 border-l border-slate-800 bg-slate-950/50 flex flex-col p-3">
            <div className="font-medium text-xs text-slate-400 uppercase tracking-wider mb-2">{tr("Members")}</div>
            <div className="flex-1 overflow-y-auto space-y-1.5">
              {loadingMembers ? (
                <Spinner label={tr("Loading members...")} />
              ) : (
                members.map((m) => (
                  <button
                    key={m.pubkey}
                    onClick={() => void openDmWithUser(m.pubkey)}
                    disabled={m.pubkey === myPubkey}
                    title={m.pubkey === myPubkey ? tr("This is you") : tr("Message {v0}", { v0: String(memberLabel(m)) })}
                    className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-slate-800 text-slate-300 flex items-center gap-2"
                  >
                    <Avatar name={memberLabel(m)} picture={m.picture} size="sm" />
                    <span className="truncate">{memberLabel(m)}</span>
                    <span className="ml-auto text-[9px] text-slate-500">{m.role}</span>
                  </button>
                ))
              )}
              {!loadingMembers && members.length === 0 && (
                <div className="text-xs text-slate-500">{tr("No members loaded.")}</div>
              )}
            </div>
            <div className="font-medium text-xs text-slate-400 uppercase tracking-wider mt-4 mb-2">{tr("Managed Agents")}</div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {agents.length === 0 ? (
                <div className="text-xs text-slate-500">{tr("No agents configured.")}</div>
              ) : (
                agents.map((ag) => (
                  <div key={ag.agent_id} className="p-2 bg-slate-900 border border-slate-800 rounded text-xs">
                    <div className="font-semibold text-slate-200">{ag.name}</div>
                    <div className="text-[10px] text-slate-400">{tr("Status: ")}{tr(String(ag.status))}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile Editor Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 w-96">
            <h3 className="text-sm font-semibold text-slate-100 mb-3">{tr("Edit Profile")}</h3>
            <label className="text-xs text-slate-400 block mb-1">{tr("Display name")}</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder={tr("Your name")}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none mb-3"
            />
            <label className="text-xs text-slate-400 block mb-1">{tr("About")}</label>
            <input
              type="text"
              value={profileAbout}
              onChange={(e) => setProfileAbout(e.target.value)}
              placeholder={tr("Short bio (optional)")}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none mb-3"
            />
            <label className="text-xs text-slate-400 block mb-1">{tr("Avatar URL")}</label>
            <input
              type="text"
              value={profileAvatar}
              onChange={(e) => setProfileAvatar(e.target.value)}
              placeholder={tr("https://… (optional)")}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowProfile(false)}
                className="px-3 py-1.5 text-xs rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
              >{tr("Cancel")}</button>
              <button
                onClick={handleSaveProfile}
                className="px-3 py-1.5 text-xs rounded bg-amber-600 text-slate-100 hover:bg-amber-500 font-medium"
              >{tr("Save")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Message Modal */}
      {showDmModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 w-96">
            <h3 className="text-sm font-semibold text-slate-100 mb-3">{tr("New Direct Message")}</h3>
            <p className="text-xs text-slate-400 mb-2">{tr("Enter a user pubkey (64-hex) or pick from members.")}</p>
            <input
              type="text"
              value={dmPubkey}
              onChange={(e) => setDmPubkey(e.target.value)}
              placeholder={tr("64-char hex pubkey")}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none mb-3"
            />
            {members.length > 0 && (
              <div className="max-h-40 overflow-y-auto mb-3 space-y-1">
                {members.map((m) => (
                  <button
                    key={m.pubkey}
                    onClick={() => setDmPubkey(m.pubkey)}
                    className="w-full text-left px-2 py-1 rounded text-xs hover:bg-slate-800 text-slate-300 flex items-center gap-2"
                  >
                    <Avatar name={memberLabel(m)} picture={m.picture} size="sm" />
                    {memberLabel(m)} <span className="text-slate-500 font-mono">({m.pubkey.slice(0, 10)}…)</span>
                  </button>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDmModal(false)} className="px-3 py-1.5 text-xs rounded bg-slate-800 text-slate-300 hover:bg-slate-700">{tr("Cancel")}</button>
              <button onClick={handleOpenDm} className="px-3 py-1.5 text-xs rounded bg-amber-600 text-slate-100 hover:bg-amber-500 font-medium">{tr("Open DM")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Sub-components ----

function UnreadBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      className="ml-auto min-w-5 rounded-full bg-amber-500 px-1.5 py-0.5 text-center text-[9px] font-bold leading-none text-slate-950"
      aria-label={tr('{count} unread messages', { count })}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-400 py-2 px-1">
      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-600 border-t-amber-400" />
      {label && <span>{tr(label)}</span>}
    </div>
  );
}

function LiveIndicator({ state, error }: { state: string; error?: string | null }) {
  const color =
    state === "ready"
      ? "bg-emerald-400"
      : state === "connecting" || state === "backoff"
        ? "bg-amber-400"
        : "bg-slate-600";
  const label =
    state === "ready"
      ? "live"
      : state === "connecting"
        ? "connecting"
        : state === "backoff"
          ? error
            ? "auth failed"
            : "reconnecting"
          : "polling";
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-slate-400" title={error ?? undefined}>
      <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
      {tr(label)}
    </span>
  );
}

function Avatar({
  name,
  picture,
  size,
}: {
  name: string;
  picture?: string;
  size: "sm" | "md";
}) {
  const dims = size === "sm" ? "h-5 w-5 text-[9px]" : "h-7 w-7 text-[11px]";
  if (picture) {
    return (
      <img
        src={picture}
        alt={name}
        className={`${dims} rounded-full object-cover bg-slate-700 shrink-0`}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }
  return (
    <span className={`${dims} rounded-full bg-slate-700 flex items-center justify-center shrink-0`}>
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

function MessageCard({
  msg,
  members,
  profiles,
  replyCount,
  replyAuthors,
  onOpenThread,
  onOpenDm,
  myPubkey,
  isRoot,
}: {
  msg: BuzzMessage;
  members: BuzzMember[];
  profiles: Record<string, BuzzUserProfile>;
  replyCount?: number;
  replyAuthors?: string[];
  onOpenThread: () => void;
  onOpenDm: (pubkey: string) => void;
  myPubkey: string;
  isRoot?: boolean;
}) {
  const member = members.find((m) => m.pubkey === msg.pubkey);
  const profile = profiles[msg.pubkey];
  const displayName =
    profile?.display_name || profile?.name || member?.display_name || msg.pubkey.slice(0, 12);
  const hasReplyTag = msg.tags.some((t) => t[0] === "e" && t[3] === "reply");
  const authors = replyAuthors ?? [];
  const uniqueAuthors = [...new Set(authors)].slice(0, 4);
  const canOpenDm = Boolean(msg.pubkey && msg.pubkey !== myPubkey);

  return (
    <div className={`flex gap-2 bg-slate-950/40 p-2.5 rounded border ${isRoot ? "border-amber-500/40" : "border-slate-800/60"}`}>
      <Avatar name={displayName} picture={profile?.picture || member?.picture} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 text-[11px] text-slate-400 mb-1">
          <div className="min-w-0">
            {canOpenDm ? (
              <button
                type="button"
                onClick={() => onOpenDm(msg.pubkey)}
                title={tr("Open direct message with {v0}", { v0: String(displayName) })}
                className="block font-mono text-amber-400 hover:text-amber-200 hover:underline"
              >
                {displayName}
              </button>
            ) : (
              <span className="block font-mono text-amber-400">{displayName}</span>
            )}
            <span className="block max-w-64 truncate font-mono text-[9px] text-slate-600" title={msg.pubkey}>{tr("User ID: ")}{msg.pubkey}
            </span>
          </div>
          <span>{new Date(msg.created_at * 1000).toLocaleTimeString(getIntlLocale())}</span>
        </div>
        <div className="text-xs text-slate-200 whitespace-pre-wrap break-words">{msg.content}</div>
        {!isRoot && (
          <div className="mt-1 flex items-center gap-3 text-[10px] text-slate-500">
            <button onClick={onOpenThread} className="hover:text-amber-400 transition-colors">
              {replyCount !== undefined && replyCount > 0
                ? tr(replyCount === 1 ? '💬 {count} reply' : '💬 {count} replies', { count: replyCount })
                : hasReplyTag
                  ? tr("↩ View thread")
                  : tr("💬 Reply in thread")}
            </button>
            {uniqueAuthors.length > 0 && (
              <span className="flex items-center -space-x-1.5">
                {uniqueAuthors.map((pk) => {
                  const m = members.find((mm) => mm.pubkey === pk);
                  const nm = m?.display_name || pk.slice(0, 8);
                  return <Avatar key={pk} name={nm} picture={m?.picture} size="sm" />;
                })}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Composer({
  inputRef,
  value,
  placeholder,
  onChange,
  onKeyDown,
  onSubmit,
  mentionCandidates,
  mentionIndex,
  onApplyMention,
  onPickIcon,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSubmit: (e: React.FormEvent) => void;
  mentionCandidates: BuzzMember[];
  mentionIndex: number;
  onApplyMention: (m: BuzzMember) => void;
  onPickIcon: (icon: string) => void;
}) {
  const [showIconPicker, setShowIconPicker] = useState(false);

  return (
    <div className="relative">
      {!showIconPicker && mentionCandidates.length > 0 && (
        <div className="absolute bottom-full left-3 mb-1 w-64 bg-slate-800 border border-slate-700 rounded shadow-lg overflow-hidden z-10">
          {mentionCandidates.map((m, i) => (
            <button
              key={m.pubkey}
              onClick={() => onApplyMention(m)}
              onMouseEnter={() => {}}
              className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center gap-2 ${
                i === mentionIndex ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-700/50"
              }`}
            >
              <Avatar name={m.display_name || m.pubkey} picture={m.picture} size="sm" />
              <span className="truncate">{m.display_name || m.pubkey.slice(0, 12)}</span>
              <span className="ml-auto text-[9px] text-slate-500 font-mono">{m.role}</span>
            </button>
          ))}
        </div>
      )}
      {showIconPicker && (
        <div className="absolute bottom-full left-3 mb-1 grid w-72 grid-cols-8 gap-1 rounded border border-slate-700 bg-slate-800 p-2 shadow-xl z-20">
          {BUZZ_ICON_CHOICES.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => {
                onPickIcon(icon);
                setShowIconPicker(false);
              }}
              className="flex h-8 w-8 items-center justify-center rounded text-lg hover:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-400"
              title={tr("Add {v0}", { v0: String(icon) })}
              aria-label={tr("Add {v0}", { v0: String(icon) })}
            >
              {icon}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={onSubmit} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
        <button
          type="button"
          onClick={() => setShowIconPicker((open) => !open)}
          className={`rounded border px-2.5 text-base transition-colors ${
            showIconPicker
              ? "border-amber-500 bg-amber-500/15 text-amber-300"
              : "border-slate-700 bg-slate-800 text-slate-300 hover:border-amber-500 hover:text-amber-300"
          }`}
          title={tr("Choose an icon")}
          aria-label={tr("Choose an icon")}
          aria-expanded={showIconPicker}
        >
          ☺
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
        />
        <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-slate-100 text-xs px-4 py-1.5 rounded font-medium transition-colors">{tr("Send")}</button>
      </form>
    </div>
  );
}
