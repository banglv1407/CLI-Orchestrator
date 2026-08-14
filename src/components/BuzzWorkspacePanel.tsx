import React, { useEffect, useRef, useState } from "react";
import {
  buzzGetConfig,
  buzzSetConfig,
  buzzListChannels,
  buzzGetMessages,
  buzzGetThread,
  buzzSendMessage,
  buzzListMembers,
  buzzOpenDm,
  buzzListAgents,
  buzzHasIdentity,
  buzzGenerateIdentity,
  buzzImportIdentity,
  buzzClearIdentity,
  BuzzChannel,
  BuzzMessage,
  BuzzMember,
  BuzzAgentConfig,
} from "../lib/buzz";

interface ThreadState {
  root: BuzzMessage;
  replies: BuzzMessage[];
}

export function BuzzWorkspacePanel() {
  const [relayUrl, setRelayUrl] = useState("https://buzz.happyplatform.io.vn");
  const [channels, setChannels] = useState<BuzzChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<BuzzChannel | null>(null);
  const [messages, setMessages] = useState<BuzzMessage[]>([]);
  const [members, setMembers] = useState<BuzzMember[]>([]);
  const [agents, setAgents] = useState<BuzzAgentConfig[]>([]);
  const [inputContent, setInputContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasIdentity, setHasIdentity] = useState(false);
  const [importKey, setImportKey] = useState("");

  // Mention autocomplete
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Thread view
  const [activeThread, setActiveThread] = useState<ThreadState | null>(null);

  // Direct message
  const [showDmModal, setShowDmModal] = useState(false);
  const [dmPubkey, setDmPubkey] = useState("");

  useEffect(() => {
    loadConfig();
    refreshIdentity();
    fetchChannels();
    loadAgents();
  }, []);

  async function loadConfig() {
    try {
      const cfg = await buzzGetConfig();
      if (cfg.relay_url) setRelayUrl(cfg.relay_url);
    } catch (e) {
      console.warn("Failed to load Buzz config:", e);
    }
  }

  async function fetchChannels() {
    setLoading(true);
    setError(null);
    try {
      const list = await buzzListChannels(relayUrl);
      setChannels(list);
      if (list.length > 0 && !selectedChannel) {
        selectChannel(list[0]);
      }
    } catch (e: any) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  function selectChannel(ch: BuzzChannel) {
    setSelectedChannel(ch);
    setActiveThread(null);
    fetchMessages(ch.channel_id);
    fetchMembers(ch.channel_id);
  }

  async function fetchMessages(channelId: string) {
    try {
      const msgs = await buzzGetMessages(channelId, 30);
      setMessages(msgs);
    } catch (e: any) {
      setError(String(e));
    }
  }

  async function fetchMembers(channelId: string) {
    try {
      const list = await buzzListMembers(channelId);
      setMembers(list);
    } catch (e) {
      console.warn("Failed to load members:", e);
    }
  }

  async function openThread(msg: BuzzMessage) {
    if (!selectedChannel) return;
    try {
      const replies = await buzzGetThread(selectedChannel.channel_id, msg.id, 50);
      // Thread includes the root as first element; separate it.
      const root = replies.find((r) => r.id === msg.id) ?? msg;
      const rest = replies.filter((r) => r.id !== msg.id);
      setActiveThread({ root, replies: rest });
    } catch (e: any) {
      setError(`Failed to load thread: ${e}`);
    }
  }

  function closeThread() {
    setActiveThread(null);
  }

  async function handleSendMessage(
    e: React.FormEvent,
    targetChannelId?: string,
    replyTo?: string,
    threadMode = false,
  ) {
    e.preventDefault();
    const channelId = targetChannelId ?? selectedChannel?.channel_id;
    if (!channelId || !inputContent.trim()) return;

    try {
      const mentions = activeMentions();
      await buzzSendMessage(channelId, inputContent.trim(), replyTo, mentions);
      setInputContent("");
      if (threadMode && replyTo) {
        // Refresh thread after reply.
        await openThread({ ...activeThread!.root });
      } else {
        fetchMessages(channelId);
      }
    } catch (e: any) {
      setError(`Send failed: ${e}`);
    }
  }

  // Extract mention pubkeys from the current input (members whose @Name appears).
  function activeMentions(): string[] {
    const atMatches = inputContent.match(/@(\S+)/g) ?? [];
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

  // ---- Mention autocomplete ----
  function onInputChange(value: string) {
    setInputContent(value);
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
    const at = inputContent.lastIndexOf("@");
    const label = memberLabel(m);
    const prefix = inputContent.slice(0, at);
    const suffix = inputContent.slice(at + 1);
    const spaceIdx = suffix.indexOf(" ");
    const rest = spaceIdx >= 0 ? suffix.slice(spaceIdx) : "";
    const next = `${prefix}@${label} ${rest}`;
    setInputContent(next);
    setMentionQuery(null);
    inputRef.current?.focus();
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

  async function handleGenerateIdentity() {
    setError(null);
    try {
      await buzzGenerateIdentity();
      setHasIdentity(true);
      fetchChannels();
    } catch (e: any) {
      setError(`Generate identity failed: ${e}`);
    }
  }

  async function handleImportIdentity() {
    setError(null);
    if (!importKey.trim()) {
      setError("Paste a 64-char hex private key or nsec first.");
      return;
    }
    try {
      await buzzImportIdentity(importKey.trim());
      setHasIdentity(true);
      setImportKey("");
      fetchChannels();
    } catch (e: any) {
      setError(`Import identity failed: ${e}`);
    }
  }

  async function handleClearIdentity() {
    setError(null);
    try {
      await buzzClearIdentity();
      setHasIdentity(false);
    } catch (e: any) {
      setError(`Clear identity failed: ${e}`);
    }
  }

  async function handleOpenDm() {
    setError(null);
    const pk = dmPubkey.trim();
    if (!pk) {
      setError("Enter a user pubkey (64-hex) or select from the member list.");
      return;
    }
    try {
      const res = await buzzOpenDm([pk]);
      if (res.dm_id) {
        setDmPubkey("");
        setShowDmModal(false);
        // Refresh channel list so the new DM appears (if supported), else jump via id.
        await fetchChannels();
        const dmChannel = channels.find((c) => c.channel_id === res.dm_id);
        if (dmChannel) {
          selectChannel(dmChannel);
        } else {
          setError(`DM opened (id: ${res.dm_id}) — refresh channels to see it.`);
        }
      } else {
        setError("Failed to open DM: no dm_id returned.");
      }
    } catch (e: any) {
      setError(`Open DM failed: ${e}`);
    }
  }

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 flex-col font-sans">
      {/* Top Header / Relay Config */}
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 bg-slate-950">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-400">🐝 Buzz Workspace</span>
          <span className="text-xs text-slate-400">({relayUrl})</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-bold ${
              hasIdentity ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
            }`}
          >
            {hasIdentity ? "IDENTITY OK" : "NO IDENTITY"}
          </span>
          {!hasIdentity && (
            <button
              onClick={handleGenerateIdentity}
              className="rounded bg-emerald-600 px-2 py-1 text-xs font-medium hover:bg-emerald-500 transition-colors"
            >
              Generate
            </button>
          )}
          <button
            onClick={handleClearIdentity}
            className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Clear
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="password"
            placeholder="Import 64-hex key"
            className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-200 border border-slate-700 w-40 focus:outline-none"
            value={importKey}
            onChange={(e) => setImportKey(e.target.value)}
          />
          <button
            onClick={handleImportIdentity}
            className="rounded bg-slate-700 px-2 py-1 text-xs font-medium hover:bg-slate-600 transition-colors"
          >
            Import
          </button>
          <input
            type="text"
            className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-200 border border-slate-700 w-64 focus:outline-none"
            value={relayUrl}
            onChange={(e) => setRelayUrl(e.target.value)}
          />
          <button
            onClick={() => {
              buzzSetConfig({ relay_url: relayUrl, allow_insecure: false });
              fetchChannels();
            }}
            className="rounded bg-amber-600 px-2 py-1 text-xs font-medium hover:bg-amber-500 transition-colors"
          >
            Connect Relay
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-900/50 border-b border-rose-700 px-4 py-1.5 text-xs text-rose-200 flex justify-between">
          <span>Error: {error}</span>
          <button onClick={() => setError(null)} className="text-rose-400 font-bold">✕</button>
        </div>
      )}

      {/* Main 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Navigation / Channels */}
        <div className="w-56 border-r border-slate-800 bg-slate-950/50 flex flex-col">
          <div className="p-3 border-b border-slate-800 font-medium text-xs text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Streams & Channels</span>
            <button
              onClick={() => setShowDmModal(true)}
              title="New direct message"
              className="text-amber-400 hover:text-amber-300 text-sm font-bold px-1"
            >
              +
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading && <div className="text-xs text-slate-500 p-2">Loading channels...</div>}
            {channels.map((ch) => (
              <button
                key={ch.channel_id}
                onClick={() => selectChannel(ch)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex flex-col ${
                  selectedChannel?.channel_id === ch.channel_id
                    ? "bg-amber-500/20 text-amber-300 font-medium"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                <span># {ch.name}</span>
                {ch.description && <span className="text-[10px] text-slate-500 truncate">{ch.description}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Center Column: Message Thread & Composer */}
        <div className="flex-1 flex flex-col bg-slate-900">
          {selectedChannel ? (
            <>
              <div className="px-4 py-2 border-b border-slate-800 text-sm font-semibold flex items-center justify-between">
                <span># {selectedChannel.name}</span>
                <button onClick={() => fetchMessages(selectedChannel.channel_id)} className="text-xs text-slate-400 hover:text-slate-200">
                  Refresh
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-xs text-slate-500">No messages in this stream.</div>
                ) : (
                  messages.map((msg) => (
                    <MessageCard
                      key={msg.id}
                      msg={msg}
                      members={members}
                      onOpenThread={() => openThread(msg)}
                    />
                  ))
                )}
              </div>

              <Composer
                inputRef={inputRef}
                value={inputContent}
                placeholder={`Message #${selectedChannel.name}...`}
                onChange={onInputChange}
                onKeyDown={onComposerKeyDown}
                onSubmit={(e) => handleSendMessage(e)}
                mentionCandidates={mentionCandidates()}
                mentionIndex={mentionIndex}
                onApplyMention={applyMention}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
              Select a channel to view conversation
            </div>
          )}
        </div>

        {/* Right Column: Thread view OR Members/Agents */}
        {activeThread ? (
          <div className="w-80 border-l border-slate-800 bg-slate-950/50 flex flex-col">
            <div className="p-3 border-b border-slate-800 font-medium text-xs text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Thread</span>
              <button onClick={closeThread} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <MessageCard msg={activeThread.root} members={members} onOpenThread={() => {}} isRoot />
              {activeThread.replies.map((r) => (
                <MessageCard key={r.id} msg={r} members={members} onOpenThread={() => {}} />
              ))}
            </div>
            <Composer
              inputRef={inputRef}
              value={inputContent}
              placeholder="Reply in thread..."
              onChange={onInputChange}
              onKeyDown={onComposerKeyDown}
              onSubmit={(e) => handleSendMessage(e, selectedChannel?.channel_id, activeThread.root.id, true)}
              mentionCandidates={mentionCandidates()}
              mentionIndex={mentionIndex}
              onApplyMention={applyMention}
            />
          </div>
        ) : (
          <div className="w-64 border-l border-slate-800 bg-slate-950/50 flex flex-col p-3">
            <div className="font-medium text-xs text-slate-400 uppercase tracking-wider mb-2">
              Members
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5">
              {members.map((m) => (
                <button
                  key={m.pubkey}
                  onClick={() => {
                    setDmPubkey(m.pubkey);
                    setShowDmModal(true);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-slate-800 text-slate-300 flex items-center gap-2"
                >
                  <span className="h-5 w-5 rounded-full bg-slate-700 flex items-center justify-center text-[9px]">
                    {memberLabel(m).slice(0, 1).toUpperCase()}
                  </span>
                  <span className="truncate">{memberLabel(m)}</span>
                  <span className="ml-auto text-[9px] text-slate-500">{m.role}</span>
                </button>
              ))}
              {members.length === 0 && (
                <div className="text-xs text-slate-500">No members loaded.</div>
              )}
            </div>
            <div className="font-medium text-xs text-slate-400 uppercase tracking-wider mt-4 mb-2">
              Managed Agents
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {agents.length === 0 ? (
                <div className="text-xs text-slate-500">No agents configured.</div>
              ) : (
                agents.map((ag) => (
                  <div key={ag.agent_id} className="p-2 bg-slate-900 border border-slate-800 rounded text-xs">
                    <div className="font-semibold text-slate-200">{ag.name}</div>
                    <div className="text-[10px] text-slate-400">Status: {ag.status}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Direct Message Modal */}
      {showDmModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 w-96">
            <h3 className="text-sm font-semibold text-slate-100 mb-3">New Direct Message</h3>
            <p className="text-xs text-slate-400 mb-2">Enter a user pubkey (64-hex) or pick from members.</p>
            <input
              type="text"
              value={dmPubkey}
              onChange={(e) => setDmPubkey(e.target.value)}
              placeholder="64-char hex pubkey"
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none mb-3"
            />
            {members.length > 0 && (
              <div className="max-h-40 overflow-y-auto mb-3 space-y-1">
                {members.map((m) => (
                  <button
                    key={m.pubkey}
                    onClick={() => setDmPubkey(m.pubkey)}
                    className="w-full text-left px-2 py-1 rounded text-xs hover:bg-slate-800 text-slate-300"
                  >
                    {memberLabel(m)} <span className="text-slate-500 font-mono">({m.pubkey.slice(0, 10)}…)</span>
                  </button>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDmModal(false)} className="px-3 py-1.5 text-xs rounded bg-slate-800 text-slate-300 hover:bg-slate-700">
                Cancel
              </button>
              <button onClick={handleOpenDm} className="px-3 py-1.5 text-xs rounded bg-amber-600 text-slate-100 hover:bg-amber-500 font-medium">
                Open DM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Sub-components ----

function MessageCard({
  msg,
  members,
  onOpenThread,
  isRoot,
}: {
  msg: BuzzMessage;
  members: BuzzMember[];
  onOpenThread: () => void;
  isRoot?: boolean;
}) {
  const member = members.find((m) => m.pubkey === msg.pubkey);
  const displayName = member?.display_name || msg.pubkey.slice(0, 12);
  const hasReplyTag = msg.tags.some((t) => t[0] === "e" && t[3] === "reply");
  return (
    <div className={`flex flex-col bg-slate-950/40 p-2.5 rounded border ${isRoot ? "border-amber-500/40" : "border-slate-800/60"}`}>
      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
        <span className="font-mono text-amber-400">{displayName}</span>
        <span>{new Date(msg.created_at * 1000).toLocaleTimeString()}</span>
      </div>
      <div className="text-xs text-slate-200 whitespace-pre-wrap">{msg.content}</div>
      {!isRoot && (
        <div className="mt-1 flex items-center gap-3 text-[10px] text-slate-500">
          <button onClick={onOpenThread} className="hover:text-amber-400 transition-colors">
            {hasReplyTag ? "↩ View thread" : "💬 Reply in thread"}
          </button>
        </div>
      )}
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
}) {
  return (
    <div className="relative">
      {mentionCandidates.length > 0 && (
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
              <span className="h-4 w-4 rounded-full bg-slate-600 flex items-center justify-center text-[8px]">
                {(m.display_name || m.pubkey).slice(0, 1).toUpperCase()}
              </span>
              <span className="truncate">{m.display_name || m.pubkey.slice(0, 12)}</span>
              <span className="ml-auto text-[9px] text-slate-500 font-mono">{m.role}</span>
            </button>
          ))}
        </div>
      )}
      <form onSubmit={onSubmit} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
        />
        <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-slate-100 text-xs px-4 py-1.5 rounded font-medium transition-colors">
          Send
        </button>
      </form>
    </div>
  );
}
