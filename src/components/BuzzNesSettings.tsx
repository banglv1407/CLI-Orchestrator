// Buzz & NES settings — the single home for Buzz relay URL, Buzz identity, and
// NES session-service URL. The Buzz workspace header no longer carries config
// controls; it links here instead.

import React, { useEffect, useState } from "react";
import {
  buzzGetConfig,
  buzzSetConfig,
  buzzHasIdentity,
  buzzGenerateIdentity,
  buzzImportIdentity,
  buzzClearIdentity,
} from "../lib/buzz";
import { nesGetConfig, nesSaveConfig } from "../lib/nes";
import { NesKeyConfigModal } from "./NesKeyConfigModal";

export function BuzzNesSettings() {
  // Buzz relay
  const [relayUrl, setRelayUrl] = useState("https://buzz.happyplatform.io.vn");
  const [allowInsecure, setAllowInsecure] = useState(false);
  const [savingRelay, setSavingRelay] = useState(false);
  const [relayMsg, setRelayMsg] = useState<string | null>(null);

  // Buzz identity
  const [hasIdentity, setHasIdentity] = useState(false);
  const [importKey, setImportKey] = useState("");
  const [identityMsg, setIdentityMsg] = useState<string | null>(null);

  // NES service URL
  const [nesUrl, setNesUrl] = useState("");
  const [savingNes, setSavingNes] = useState(false);
  const [nesMsg, setNesMsg] = useState<string | null>(null);
  const [showKeyConfig, setShowKeyConfig] = useState(false);

  // Background execution toggles
  const [nesKeepAlive, setNesKeepAlive] = useState<boolean>(() => {
    return localStorage.getItem("clx-nes-keep-alive") !== "false";
  });
  const [buzzNotifications, setBuzzNotifications] = useState<boolean>(() => {
    return localStorage.getItem("clx-buzz-background-notifications") !== "false";
  });

  const toggleNesKeepAlive = (enabled: boolean) => {
    setNesKeepAlive(enabled);
    localStorage.setItem("clx-nes-keep-alive", String(enabled));
  };

  const toggleBuzzNotifications = (enabled: boolean) => {
    setBuzzNotifications(enabled);
    localStorage.setItem("clx-buzz-background-notifications", String(enabled));
    if (!enabled) {
      window.dispatchEvent(new CustomEvent("buzz-clear-unread"));
    }
  };

  useEffect(() => {
    buzzGetConfig()
      .then((cfg) => {
        if (cfg.relay_url) setRelayUrl(cfg.relay_url);
        setAllowInsecure(cfg.allow_insecure);
      })
      .catch((e) => console.warn("Failed to load Buzz config:", e));
    buzzHasIdentity().then(setHasIdentity).catch(() => {});
    nesGetConfig()
      .then((cfg) => setNesUrl(cfg.service_base_url))
      .catch((e) => console.warn("Failed to load NES config:", e));
  }, []);

  async function saveRelay(e: React.FormEvent) {
    e.preventDefault();
    setSavingRelay(true);
    setRelayMsg(null);
    try {
      await buzzSetConfig({
        relay_url: relayUrl.trim(),
        allow_insecure: allowInsecure,
      });
      setRelayMsg("Saved.");
    } catch (err) {
      setRelayMsg(`Save failed: ${err}`);
    } finally {
      setSavingRelay(false);
      setTimeout(() => setRelayMsg(null), 2500);
    }
  }

  async function handleGenerate() {
    setIdentityMsg(null);
    try {
      await buzzGenerateIdentity();
      setHasIdentity(true);
      setIdentityMsg("Identity generated.");
    } catch (err) {
      setIdentityMsg(`Generate failed: ${err}`);
    }
  }

  async function handleImport() {
    setIdentityMsg(null);
    if (!importKey.trim()) {
      setIdentityMsg("Paste a 64-char hex private key first.");
      return;
    }
    try {
      await buzzImportIdentity(importKey.trim());
      setHasIdentity(true);
      setImportKey("");
      setIdentityMsg("Identity imported.");
    } catch (err) {
      setIdentityMsg(`Import failed: ${err}`);
    }
  }

  async function handleClear() {
    setIdentityMsg(null);
    try {
      await buzzClearIdentity();
      setHasIdentity(false);
      setIdentityMsg("Identity cleared.");
    } catch (err) {
      setIdentityMsg(`Clear failed: ${err}`);
    }
  }

  async function saveNes(e: React.FormEvent) {
    e.preventDefault();
    setSavingNes(true);
    setNesMsg(null);
    try {
      await nesSaveConfig({ schema_version: 1, service_base_url: nesUrl.trim() });
      setNesMsg("Saved.");
    } catch (err) {
      setNesMsg(`Save failed: ${err}`);
    } finally {
      setSavingNes(false);
      setTimeout(() => setNesMsg(null), 2500);
    }
  }

  return (
    <div className="space-y-6">
      {/* Buzz relay */}
      <div className="space-y-3">
        <div>
          <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 border-b border-cyber-line/20 pb-2 font-bold">
            Buzz Relay
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">
            Connection used by the Buzz workspace chat.
          </p>
        </div>
        <form onSubmit={saveRelay} className="space-y-3">
          <label className="flex items-center justify-between rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-4 text-xs text-slate-200">
            <div>
              <span className="font-semibold">Relay URL</span>
              <p className="text-[10px] text-slate-500 mt-0.5">https:// or wss:// endpoint</p>
            </div>
            <input
              type="text"
              value={relayUrl}
              onChange={(e) => setRelayUrl(e.target.value)}
              className="rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-xs text-cyber-neon outline-none focus:border-cyber-neon w-72"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={savingRelay}
              className="rounded border border-cyber-neon/60 bg-cyber-neon/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-cyber-neon hover:bg-cyber-neon/20 disabled:opacity-50"
            >
              {savingRelay ? "Saving…" : "Save Relay"}
            </button>
            {relayMsg && <span className="text-[10px] text-slate-400">{relayMsg}</span>}
          </div>
        </form>
      </div>

      {/* Buzz identity */}
      <div className="space-y-3">
        <div>
          <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 border-b border-cyber-line/20 pb-2 font-bold">
            Buzz Identity
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">
            Your Nostr private key (stored in Windows Credential Manager, never on disk).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-bold ${
              hasIdentity ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
            }`}
          >
            {hasIdentity ? "IDENTITY OK" : "NO IDENTITY"}
          </span>
          <button
            onClick={handleGenerate}
            className="rounded border border-cyber-neon/60 bg-cyber-neon/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-cyber-neon hover:bg-cyber-neon/20"
          >
            Generate
          </button>
          <button
            onClick={handleClear}
            className="rounded border border-cyber-line/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-rose-300 hover:border-rose-500/40"
          >
            Clear
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="password"
            placeholder="Import 64-hex private key"
            value={importKey}
            onChange={(e) => setImportKey(e.target.value)}
            className="rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-xs text-cyber-neon outline-none focus:border-cyber-neon w-72"
          />
          <button
            onClick={handleImport}
            className="rounded border border-cyber-line/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 hover:text-cyber-neon hover:border-cyber-neon/40"
          >
            Import
          </button>
        </div>
        {identityMsg && <div className="text-[10px] text-slate-400">{identityMsg}</div>}
      </div>

      {/* NES service */}
      <div className="space-y-3">
        <div>
          <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 border-b border-cyber-line/20 pb-2 font-bold">
            NES Session Service
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">
            Base URL of the nes-session relay for multiplayer NES.
          </p>
        </div>
        <form onSubmit={saveNes} className="space-y-3">
          <label className="flex items-center justify-between rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-4 text-xs text-slate-200">
            <div>
              <span className="font-semibold">Service URL</span>
              <p className="text-[10px] text-slate-500 mt-0.5">e.g. http://127.0.0.1:8080</p>
            </div>
            <input
              type="text"
              value={nesUrl}
              onChange={(e) => setNesUrl(e.target.value)}
              className="rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-xs text-cyber-neon outline-none focus:border-cyber-neon w-72"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={savingNes}
              className="rounded border border-cyber-neon/60 bg-cyber-neon/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-cyber-neon hover:bg-cyber-neon/20 disabled:opacity-50"
            >
              {savingNes ? "Saving…" : "Save Service"}
            </button>
            {nesMsg && <span className="text-[10px] text-slate-400">{nesMsg}</span>}
          </div>
        </form>
      </div>

      {/* NES Controller Controls */}
      <div className="space-y-3">
        <div>
          <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 border-b border-cyber-line/20 pb-2 font-bold">
            NES Controller Mapping
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">
            Configure keyboard keys and Turbo Rapid-Fire buttons for NES emulation.
          </p>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-4 text-xs text-slate-200">
          <div>
            <span className="font-semibold">Button Mapping & Turbo Keys</span>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Customize D-Pad, A, B, Turbo A, Turbo B, Select, Start
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowKeyConfig(true)}
            className="rounded border border-cyber-neon/60 bg-cyber-neon/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-cyber-neon hover:bg-cyber-neon/20"
          >
            Configure Keys…
          </button>
        </div>
      </div>

      {/* Background Execution & Notifications */}
      <div className="space-y-3">
        <div>
          <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 border-b border-cyber-line/20 pb-2 font-bold">
            Background Execution & Badges
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">
            Control resource preservation and unread message notifications.
          </p>
        </div>

        <div className="space-y-2">
          <label className="flex items-center justify-between rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-4 text-xs text-slate-200 cursor-pointer hover:border-cyber-line">
            <div>
              <span className="font-semibold">Keep NES game state when switching tabs</span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Preserves ROM execution in memory so the game never resets unless explicitly exited.
              </p>
            </div>
            <input
              type="checkbox"
              checked={nesKeepAlive}
              onChange={(e) => toggleNesKeepAlive(e.target.checked)}
              className="h-4 w-4 rounded border-cyber-line accent-cyber-neon"
            />
          </label>

          <label className="flex items-center justify-between rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-4 text-xs text-slate-200 cursor-pointer hover:border-cyber-line">
            <div>
              <span className="font-semibold">Keep Buzz live connection & show unread badges</span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Displays a red badge count on the Buzz sidebar icon when new messages arrive.
              </p>
            </div>
            <input
              type="checkbox"
              checked={buzzNotifications}
              onChange={(e) => toggleBuzzNotifications(e.target.checked)}
              className="h-4 w-4 rounded border-cyber-line accent-amber-500"
            />
          </label>
        </div>
      </div>

      <NesKeyConfigModal
        role="host"
        isOpen={showKeyConfig}
        onClose={() => setShowKeyConfig(false)}
      />
    </div>
  );
}
