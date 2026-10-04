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
  type BuzzProxyConfig,
  type BuzzProxyKind,
} from "../lib/buzz";
import { nesGetConfig, nesSaveConfig } from "../lib/nes";
import { NesKeyConfigModal } from "./NesKeyConfigModal";

export function BuzzNesSettings() {
  // Buzz relay
  const [relayUrl, setRelayUrl] = useState("https://buzz.happyplatform.io.vn");
  const [allowInsecure, setAllowInsecure] = useState(false);
  const [savingRelay, setSavingRelay] = useState(false);
  const [relayMsg, setRelayMsg] = useState<string | null>(null);

  // Buzz proxy hop (SSH dynamic SOCKS5 / HTTP CONNECT)
  const [proxyKind, setProxyKind] = useState<BuzzProxyKind>("none");
  const [proxyHost, setProxyHost] = useState("");
  const [proxyPort, setProxyPort] = useState(22);
  const [proxyUser, setProxyUser] = useState("");
  const [proxySecret, setProxySecret] = useState("");
  const [proxyAuthMode, setProxyAuthMode] = useState<"password" | "key">("password");
  const [proxyKeyPath, setProxyKeyPath] = useState("");
  const [hasSavedSecret, setHasSavedSecret] = useState(false);

  // Buzz identity
  const [hasIdentity, setHasIdentity] = useState(false);
  const [importKey, setImportKey] = useState("");
  const [identityMsg, setIdentityMsg] = useState<string | null>(null);

  // NES service URL
  const [nesUrl, setNesUrl] = useState("");
  const [savingNes, setSavingNes] = useState(false);
  const [nesMsg, setNesMsg] = useState<string | null>(null);
  const [showKeyConfig, setShowKeyConfig] = useState(false);

  // NES proxy hop (SSH dynamic SOCKS5 / HTTP CONNECT)
  const [nesProxyKind, setNesProxyKind] = useState<BuzzProxyKind>("none");
  const [nesProxyHost, setNesProxyHost] = useState("");
  const [nesProxyPort, setNesProxyPort] = useState(22);
  const [nesProxyUser, setNesProxyUser] = useState("");
  const [nesProxySecret, setNesProxySecret] = useState("");
  const [nesProxyAuthMode, setNesProxyAuthMode] = useState<"password" | "key">("password");
  const [nesProxyKeyPath, setNesProxyKeyPath] = useState("");
  const [hasSavedNesSecret, setHasSavedNesSecret] = useState(false);

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
        const url = cfg.relayUrl || cfg.relay_url;
        if (url) setRelayUrl(url);
        setAllowInsecure(Boolean(cfg.allowInsecure ?? cfg.allow_insecure));
        if (cfg.proxy && cfg.proxy.kind !== "none") {
          setProxyKind(cfg.proxy.kind);
          setProxyHost(cfg.proxy.host || "");
          setProxyPort(cfg.proxy.port || (cfg.proxy.kind === "ssh" ? 22 : 8080));
          setProxyUser(cfg.proxy.user || "");
          setProxyAuthMode((cfg.proxy.authMode || cfg.proxy.auth_mode) === "key" ? "key" : "password");
          setProxyKeyPath(cfg.proxy.keyPath || cfg.proxy.key_path || "");
          // Backend never returns the secret; only report that one is stored.
          setHasSavedSecret(Boolean(cfg.proxy.secret));
        }
      })
      .catch((e) => console.warn("Failed to load Buzz config:", e));
    buzzHasIdentity().then(setHasIdentity).catch(() => {});
    nesGetConfig()
      .then((cfg) => {
        setNesUrl(cfg.service_base_url);
        if (cfg.proxy && cfg.proxy.kind !== "none") {
          setNesProxyKind(cfg.proxy.kind);
          setNesProxyHost(cfg.proxy.host || "");
          setNesProxyPort(cfg.proxy.port || (cfg.proxy.kind === "ssh" ? 22 : 8080));
          setNesProxyUser(cfg.proxy.user || "");
          setNesProxyAuthMode((cfg.proxy.authMode || cfg.proxy.auth_mode) === "key" ? "key" : "password");
          setNesProxyKeyPath(cfg.proxy.keyPath || cfg.proxy.key_path || "");
          setHasSavedNesSecret(Boolean(cfg.proxy.secret));
        }
      })
      .catch((e) => console.warn("Failed to load NES config:", e));
  }, []);

  async function saveRelay(e: React.FormEvent) {
    e.preventDefault();
    setSavingRelay(true);
    setRelayMsg(null);
    try {
      let proxy: BuzzProxyConfig | null = null;
      if (proxyKind !== "none" && proxyHost.trim()) {
        proxy = {
          kind: proxyKind,
          host: proxyHost.trim(),
          port: proxyPort,
          user: proxyUser.trim() || null,
          // Only send a fresh secret when typed; empty keeps the stored one.
          secret: proxySecret.trim() ? proxySecret : null,
          authMode: proxyAuthMode,
          keyPath: proxyAuthMode === "key" && proxyKeyPath.trim() ? proxyKeyPath.trim() : null,
        };
        if (proxyKind === "ssh") {
          if (!proxy.user) throw new Error("SSH hop requires a username");
          if (proxy.authMode === "password" && !proxy.secret && !hasSavedSecret) {
            throw new Error("SSH hop password is required");
          }
          if (proxy.authMode === "key" && !proxy.keyPath) {
            throw new Error("SSH hop key path is required");
          }
        }
      }
      await buzzSetConfig({
        relayUrl: relayUrl.trim(),
        allowInsecure,
        proxy,
      });
      setProxySecret("");
      setHasSavedSecret(hasSavedSecret || Boolean(proxy));
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
      let proxy: BuzzProxyConfig | null = null;
      if (nesProxyKind !== "none" && nesProxyHost.trim()) {
        proxy = {
          kind: nesProxyKind,
          host: nesProxyHost.trim(),
          port: nesProxyPort,
          user: nesProxyUser.trim() || null,
          secret: nesProxySecret.trim() ? nesProxySecret : null,
          authMode: nesProxyAuthMode,
          keyPath: nesProxyAuthMode === "key" && nesProxyKeyPath.trim() ? nesProxyKeyPath.trim() : null,
        };
        if (nesProxyKind === "ssh") {
          if (!proxy.user) throw new Error("SSH hop requires a username");
          if (proxy.authMode === "password" && !proxy.secret && !hasSavedNesSecret) {
            throw new Error("SSH hop password is required");
          }
          if (proxy.authMode === "key" && !proxy.keyPath) {
            throw new Error("SSH hop key path is required");
          }
        }
      }
      await nesSaveConfig({
        schema_version: 1,
        service_base_url: nesUrl.trim(),
        proxy,
      });
      setNesProxySecret("");
      setHasSavedNesSecret(hasSavedNesSecret || Boolean(proxy));
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

          <label className="flex items-center justify-between rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-4 text-xs text-slate-200 cursor-pointer">
            <div>
              <span className="font-semibold">Allow Insecure TLS</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Allow self-signed or invalid certificates</p>
            </div>
            <input
              type="checkbox"
              checked={allowInsecure}
              onChange={(e) => setAllowInsecure(e.target.checked)}
              className="accent-cyan-400 w-4 h-4 cursor-pointer"
            />
          </label>

          {/* Proxy Hop (SSH / HTTP) */}
          <div className="rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs text-slate-200">Connection Hop (Proxy)</span>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Route relay traffic through an SSH tunnel or HTTP proxy.
                </p>
              </div>
              <select
                value={proxyKind}
                onChange={(e) => {
                  const kind = e.target.value as BuzzProxyKind;
                  setProxyKind(kind);
                  if (kind === "ssh") setProxyPort(22);
                  if (kind === "http") setProxyPort(8080);
                }}
                className="rounded border border-cyber-line bg-cyber-base px-2 py-1 text-xs text-slate-200 outline-none focus:border-cyber-neon"
              >
                <option value="none">Direct (no hop)</option>
                <option value="ssh">SSH Tunnel</option>
                <option value="http">HTTP CONNECT Proxy</option>
              </select>
            </div>

            {proxyKind !== "none" && (
              <div className="space-y-2.5 border-t border-cyber-line/30 pt-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={proxyKind === "ssh" ? "hop.example.com" : "proxy.example.com"}
                    value={proxyHost}
                    onChange={(e) => setProxyHost(e.target.value)}
                    className="flex-1 rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-xs text-cyber-neon outline-none focus:border-cyber-neon"
                  />
                  <input
                    type="number"
                    min={1}
                    max={65535}
                    value={proxyPort}
                    onChange={(e) => setProxyPort(Number(e.target.value) || 0)}
                    className="w-20 rounded border border-cyber-line bg-cyber-base px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-cyber-neon"
                    title="Port"
                  />
                </div>

                {proxyKind === "ssh" && (
                  <>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="SSH username"
                        value={proxyUser}
                        onChange={(e) => setProxyUser(e.target.value)}
                        className="flex-1 rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-cyber-neon"
                      />
                      <select
                        value={proxyAuthMode}
                        onChange={(e) => setProxyAuthMode(e.target.value === "key" ? "key" : "password")}
                        className="rounded border border-cyber-line bg-cyber-base px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-cyber-neon"
                        title="Auth mode"
                      >
                        <option value="password">Password</option>
                        <option value="key">Private Key</option>
                      </select>
                    </div>
                    {proxyAuthMode === "password" ? (
                      <input
                        type="password"
                        placeholder={hasSavedSecret ? "Password stored — type to replace" : "SSH password"}
                        value={proxySecret}
                        onChange={(e) => setProxySecret(e.target.value)}
                        className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-cyber-neon"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="C:\\path\\to\\id_ed25519 (passphrase below, optional)"
                        value={proxyKeyPath}
                        onChange={(e) => setProxyKeyPath(e.target.value)}
                        className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-cyber-neon font-mono"
                      />
                    )}
                    {proxyAuthMode === "key" && (
                      <input
                        type="password"
                        placeholder={hasSavedSecret ? "Passphrase stored — type to replace" : "Key passphrase (optional)"}
                        value={proxySecret}
                        onChange={(e) => setProxySecret(e.target.value)}
                        className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-cyber-neon"
                      />
                    )}
                    <p className="text-[10px] text-slate-500">
                      CLX opens a local dynamic SOCKS5 listener (127.0.0.1:31080) through this SSH
                      server and routes all relay traffic via it.
                    </p>
                  </>
                )}

                {proxyKind === "http" && (
                  <p className="text-[10px] text-slate-500">
                    Relay requests are sent via HTTP CONNECT through this proxy host:port.
                  </p>
                )}
              </div>
            )}
          </div>

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

          {/* NES Proxy Hop (SSH / HTTP) */}
          <div className="rounded-lg border border-cyber-line/60 bg-cyber-base/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs text-slate-200">Connection Hop (Proxy)</span>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Route session-service traffic through an SSH tunnel or HTTP proxy.
                </p>
              </div>
              <select
                value={nesProxyKind}
                onChange={(e) => {
                  const kind = e.target.value as BuzzProxyKind;
                  setNesProxyKind(kind);
                  if (kind === "ssh") setNesProxyPort(22);
                  if (kind === "http") setNesProxyPort(8080);
                }}
                className="rounded border border-cyber-line bg-cyber-base px-2 py-1 text-xs text-slate-200 outline-none focus:border-cyber-neon"
              >
                <option value="none">Direct (no hop)</option>
                <option value="ssh">SSH Tunnel</option>
                <option value="http">HTTP CONNECT Proxy</option>
              </select>
            </div>

            {nesProxyKind !== "none" && (
              <div className="space-y-2.5 border-t border-cyber-line/30 pt-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={nesProxyKind === "ssh" ? "hop.example.com" : "proxy.example.com"}
                    value={nesProxyHost}
                    onChange={(e) => setNesProxyHost(e.target.value)}
                    className="flex-1 rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-xs text-cyber-neon outline-none focus:border-cyber-neon"
                  />
                  <input
                    type="number"
                    min={1}
                    max={65535}
                    value={nesProxyPort}
                    onChange={(e) => setNesProxyPort(Number(e.target.value) || 0)}
                    className="w-20 rounded border border-cyber-line bg-cyber-base px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-cyber-neon"
                    title="Port"
                  />
                </div>

                {nesProxyKind === "ssh" && (
                  <>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="SSH username"
                        value={nesProxyUser}
                        onChange={(e) => setNesProxyUser(e.target.value)}
                        className="flex-1 rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-cyber-neon"
                      />
                      <select
                        value={nesProxyAuthMode}
                        onChange={(e) => setNesProxyAuthMode(e.target.value === "key" ? "key" : "password")}
                        className="rounded border border-cyber-line bg-cyber-base px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-cyber-neon"
                        title="Auth mode"
                      >
                        <option value="password">Password</option>
                        <option value="key">Private Key</option>
                      </select>
                    </div>
                    {nesProxyAuthMode === "password" ? (
                      <input
                        type="password"
                        placeholder={hasSavedNesSecret ? "Password stored — type to replace" : "SSH password"}
                        value={nesProxySecret}
                        onChange={(e) => setNesProxySecret(e.target.value)}
                        className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-cyber-neon"
                      />
                    ) : (
                      <>
                        <input
                          type="text"
                          placeholder="C:\\path\\to\\id_ed25519"
                          value={nesProxyKeyPath}
                          onChange={(e) => setNesProxyKeyPath(e.target.value)}
                          className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-cyber-neon font-mono"
                        />
                        <input
                          type="password"
                          placeholder={hasSavedNesSecret ? "Passphrase stored — type to replace" : "Key passphrase (optional)"}
                          value={nesProxySecret}
                          onChange={(e) => setNesProxySecret(e.target.value)}
                          className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-cyber-neon"
                        />
                      </>
                    )}
                    <p className="text-[10px] text-slate-500">
                      CLX opens a local dynamic SOCKS5 listener (127.0.0.1:31080) through this SSH
                      server and routes all session-service traffic via it.
                    </p>
                  </>
                )}

                {nesProxyKind === "http" && (
                  <p className="text-[10px] text-slate-500">
                    Session-service requests are sent via HTTP CONNECT through this proxy host:port.
                  </p>
                )}
              </div>
            )}
          </div>

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
