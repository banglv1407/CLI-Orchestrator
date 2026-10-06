import { t as tr } from '../i18n';
import React, { useState, useEffect, useRef } from "react";
import { NesLayaBot, LayaBotStatus } from "../lib/nes-laya-bot";

interface NesLayaBotControlProps {
  bot: NesLayaBot | null;
  romLoaded: boolean;
  disabled?: boolean;
}

export function NesLayaBotControl({ bot, romLoaded, disabled }: NesLayaBotControlProps) {
  const [status, setStatus] = useState<LayaBotStatus | null>(() => bot?.getStatus() ?? null);
  const [showConfig, setShowConfig] = useState(false);
  const [inputUrl, setInputUrl] = useState(() => bot?.getBaseUrl() ?? "http://127.0.0.1:8000");
  const [isPinging, setIsPinging] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bot) return;
    setStatus(bot.getStatus());
    bot.onStatusChange = (newStatus) => {
      setStatus({ ...newStatus });
    };
    void bot.checkHealth();
  }, [bot]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowConfig(false);
      }
    }
    if (showConfig) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showConfig]);

  if (!bot) return null;

  const handleToggle = () => {
    if (!bot) return;
    bot.setEnabled(!bot.isEnabled());
  };

  const handleSaveUrl = async () => {
    if (!bot) return;
    setIsPinging(true);
    bot.setBaseUrl(inputUrl);
    await bot.checkHealth();
    setIsPinging(false);
  };

  const handleSelectProfile = (profileId: string) => {
    if (!bot) return;
    bot.setProfile(profileId);
  };

  const isEnabled = status?.enabled ?? false;
  const isOnline = status?.serverOnline ?? false;
  const profiles = bot.getAllProfiles();
  const targetPlayer = status?.targetPlayer ?? 1;

  return (
    <div className="relative inline-flex items-center gap-1">
      {/* Bot Active / Deactive Toggle Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled || !romLoaded}
        className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-bold transition disabled:opacity-40 ${
          isEnabled
            ? "border border-emerald-500/70 bg-emerald-500/20 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)] hover:bg-emerald-500/30"
            : "border border-cyber-line/40 bg-cyber-base/40 text-slate-400 hover:text-slate-200 hover:border-cyber-line/80"
        }`}
        title={isEnabled ? tr("Tắt AI Bot tự chơi") : tr("Bật Laya AI Bot tự động chơi")}
      >
        <span className="text-[12px]">🤖</span>
        <span>{tr("AI Bot: ")}{isEnabled ? tr("ON") : tr("OFF")}</span>
        <span className="rounded bg-black/40 px-1 py-0.2 text-[9px] font-mono text-cyan-300">
          P{targetPlayer === 3 ? "1+2" : targetPlayer}
        </span>
        {isEnabled && (
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isOnline ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
            }`}
            title={isOnline ? tr("Laya Service Online") : tr("Laya Service Offline")}
          />
        )}
      </button>

      {/* Auto-detected Profile Badge */}
      {status?.profileTitle && (
        <span
          className="hidden md:inline-flex items-center rounded border border-cyber-line/40 bg-cyber-base/50 px-2 py-0.5 text-[10px] font-semibold text-cyber-neon"
          title={tr("Game profile đang kích hoạt: {v0}", { v0: tr(status.profileTitle) })}
        >
          🎮 {tr(status.profileTitle)}
        </span>
      )}

      {/* Quick Status Pill when enabled */}
      {isEnabled && status && (
        <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-black/40 border border-cyber-line/30 rounded px-1.5 py-0.5">
          <span className="text-cyan-300 font-bold">{status.lastAction}</span>
          {status.latencyMs > 0 && (
            <span className="text-slate-500">({status.latencyMs}ms)</span>
          )}
        </div>
      )}

      {/* Settings Gear */}
      <button
        type="button"
        onClick={() => {
          setInputUrl(bot.getBaseUrl());
          setShowConfig((prev) => !prev);
        }}
        className="rounded border border-cyber-line/40 bg-cyber-base/40 p-1 text-[11px] text-slate-400 hover:text-cyber-neon hover:border-cyber-neon/40 transition"
        title={tr("Cấu hình URL Laya Service & Game Profile")}
      >
        ⚙️
      </button>

      {/* Config Popover */}
      {showConfig && (
        <div
          ref={popoverRef}
          className="absolute left-0 top-full mt-2 z-50 w-84 rounded-lg border border-cyber-line/60 bg-slate-900/95 p-3.5 shadow-xl backdrop-blur-md"
        >
          <div className="mb-2.5 flex items-center justify-between border-b border-cyber-line/30 pb-1.5">
            <span className="text-[11px] font-bold text-cyber-neon tracking-wide uppercase">{tr("Cấu hình Laya Bot")}</span>
            <div className="flex items-center gap-1 text-[10px]">
              <span
                className={`h-2 w-2 rounded-full ${
                  isOnline ? "bg-emerald-400" : "bg-rose-500"
                }`}
              />
              <span className={isOnline ? "text-emerald-400 font-semibold" : "text-rose-400"}>
                {isOnline ? tr("Online") : tr("Offline")}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {/* Target Player (P1 Auto vs P2 Co-op vs Dual P1+P2) */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">{tr("Vai trò điều khiển (Target Slot)")}</label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => bot.setTargetPlayer(1)}
                  className={`rounded px-1.5 py-1 text-[10px] font-bold transition border text-center ${
                    targetPlayer === 1
                      ? "border-cyber-neon bg-cyber-neon/15 text-cyber-neon shadow-[0_0_6px_rgba(6,182,212,0.3)]"
                      : "border-cyber-line/40 bg-black/40 text-slate-400 hover:text-slate-200"
                  }`}
                  title={tr("Bot tự chơi Player 1")}
                >{tr("🎮 P1 Auto")}</button>
                <button
                  type="button"
                  onClick={() => bot.setTargetPlayer(2)}
                  className={`rounded px-1.5 py-1 text-[10px] font-bold transition border text-center ${
                    targetPlayer === 2
                      ? "border-cyber-neon bg-cyber-neon/15 text-cyber-neon shadow-[0_0_6px_rgba(6,182,212,0.3)]"
                      : "border-cyber-line/40 bg-black/40 text-slate-400 hover:text-slate-200"
                  }`}
                  title={tr("Boss chơi P1, Bot tự lái P2 làm đồng đội")}
                >{tr("👥 P2 Co-op")}</button>
                <button
                  type="button"
                  onClick={() => bot.setTargetPlayer(3)}
                  className={`rounded px-1.5 py-1 text-[10px] font-bold transition border text-center ${
                    targetPlayer === 3
                      ? "border-cyber-neon bg-cyber-neon/15 text-cyber-neon shadow-[0_0_6px_rgba(6,182,212,0.3)]"
                      : "border-cyber-line/40 bg-black/40 text-slate-400 hover:text-slate-200"
                  }`}
                  title={tr("Bot tự lái CẢ HAI xe (Player 1 + Player 2)")}
                >{tr("⚡ Cả P1+P2")}</button>
              </div>
              <p className="mt-1 text-[9px] text-slate-500">
                {targetPlayer === 1
                  ? tr("Bot tự chơi P1. Nếu Boss bấm phím, hướng phím của Boss sẽ tự động ghi đè.")
                  : targetPlayer === 2
                  ? tr("Boss tự do điều khiển P1, Bot tự động lái P2 (hỗ trợ Contra, Jackal, Xe tăng...).")
                  : tr("Bot tự động điều khiển CẢ HAI người chơi (P1 & P2) cùng phối hợp tác chiến!")}
              </p>
            </div>

            {/* Game Profile Selector */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">{tr("Game Profile (Tự động nhận diện ROM)")}</label>
              <select
                value={status?.profileId ?? "generic"}
                onChange={(e) => handleSelectProfile(e.target.value)}
                className="w-full rounded border border-cyber-line/50 bg-black/60 px-2 py-1 text-xs text-slate-200 outline-none focus:border-cyber-neon transition"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                    {tr(p.title)}
                  </option>
                ))}
              </select>
            </div>

            {/* API URL */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">{tr("Laya Service URL")}</label>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="http://127.0.0.1:8000"
                className="w-full rounded border border-cyber-line/50 bg-black/60 px-2 py-1 text-xs font-mono text-slate-200 outline-none focus:border-cyber-neon transition"
              />
            </div>

            {/* Realtime Logs link */}
            <div>
              <a
                href={`${bot.getBaseUrl()}/logs`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 w-full rounded border border-cyber-neon/40 bg-cyber-neon/10 hover:bg-cyber-neon/20 px-2 py-1.5 text-[11px] font-bold text-cyber-neon transition"
              >
                <span>📊</span>
                <span>{tr("Mở Realtime Logs Dashboard (/logs)")}</span>
              </a>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-cyber-line/20">
              <button
                type="button"
                onClick={() => void handleSaveUrl()}
                disabled={isPinging}
                className="rounded bg-cyber-electric/90 hover:bg-cyber-electric px-3 py-1 text-[11px] font-bold text-white transition disabled:opacity-50"
              >
                {isPinging ? tr("Đang test...") : tr("Lưu & Kiểm tra")}
              </button>
              <button
                type="button"
                onClick={() => setShowConfig(false)}
                className="text-[11px] text-slate-400 hover:text-slate-200"
              >{tr("Đóng")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
