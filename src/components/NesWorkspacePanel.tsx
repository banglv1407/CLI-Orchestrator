import { tFeedback as trFeedback, t as tr, useLocale } from '../i18n';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  nesGetConfig,
  nesSaveConfig,
  nesTestServer,
  nesOpenRom,
  nesCreatePublicRoom,
  nesListRooms,
  nesJoinRoom,
  nesLeaveRoom,
  nesEndRoom,
  nesSaveState,
  nesLoadState,
  nesHasState,
  NesConnectionBundleV1,
  NesRelayConfigV1,
  NesRoomDirectoryEntryV1,
  NesRomPayloadV1,
} from "../lib/nes";
import {
  NesEmulator,
  NES_NATIVE_HEIGHT,
  NES_NATIVE_WIDTH,
} from "../lib/nes-emulator";
import { SnesEmulator } from "../lib/snes-emulator";
import {
  NesControllerInput,
  NesKeyMapping,
  NES_BIT_UP,
  NES_BIT_DOWN,
  NES_BIT_LEFT,
  NES_BIT_RIGHT,
} from "../lib/nes-input";
import { NES_REACTIONS, NesNetplaySession, NesNetplayStatus, NesReactionId } from "../lib/nes-netplay";
import { NesKeyConfigModal } from "./NesKeyConfigModal";
import { NesLayaBot } from "../lib/nes-laya-bot";
import { NesLayaBotControl } from "./NesLayaBotControl";
import { pickFile } from "../lib/tauri";

type Mode = "home" | "host-setup" | "waiting" | "host-game" | "guest-invite" | "guest-game";

function decodeB64(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export function NesWorkspacePanel({ isVisible = true }: { isVisible?: boolean }) {
  const [mode, setMode] = useState<Mode>("home");
  const [config, setConfig] = useState<NesRelayConfigV1>({ schema_version: 1, service_base_url: "" });
  const [serviceUrl, setServiceUrl] = useState("");
  const [serverStatus, setServerStatus] = useState<"unknown" | "ok" | "error">("unknown");
  const [serverError, setServerError] = useState<string | null>(null);
  const [testingServer, setTestingServer] = useState(false);

  const [romPayload, setRomPayload] = useState<NesRomPayloadV1 | null>(null);
  const [romData, setRomData] = useState<Uint8Array | null>(null);
  const [romError, setRomError] = useState<string | null>(null);
  const [romOpen, setRomOpen] = useState(false);

  const [autoSavedNotice, setAutoSavedNotice] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("1");
  const [hasSaveSlot, setHasSaveSlot] = useState<boolean>(false);

  // Emulator runtime
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const emuRef = useRef<NesEmulator | SnesEmulator | null>(null);
  const inputRef = useRef<NesControllerInput | null>(null);
  const [emuStatus, setEmuStatus] = useState<string>("Ready to load a ROM.");
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [romLoaded, setRomLoaded] = useState(false);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const wasRunningBeforeHiddenRef = useRef<boolean>(false);
  const netplayRef = useRef<NesNetplaySession | null>(null);
  const layaBotRef = useRef<NesLayaBot | null>(null);
  if (!layaBotRef.current) {
    layaBotRef.current = new NesLayaBot();
  }
  const [pendingJoinRoomId, setPendingJoinRoomId] = useState<string | null>(null);
  const [pendingHostRomName, setPendingHostRomName] = useState<string | null>(null);
  const [rooms, setRooms] = useState<NesRoomDirectoryEntryV1[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [activeBundle, setActiveBundle] = useState<NesConnectionBundleV1 | null>(null);
  const [netplayStatus, setNetplayStatus] = useState<NesNetplayStatus>("waiting");
  const [netplayDetail, setNetplayDetail] = useState<string | null>(null);
  const [activeReaction, setActiveReaction] = useState<{ id: NesReactionId; sender: "host" | "guest" } | null>(null);
  const reactionTimerRef = useRef<number | null>(null);

  const showReaction = useCallback((id: NesReactionId, sender: "host" | "guest") => {
    if (reactionTimerRef.current !== null) window.clearTimeout(reactionTimerRef.current);
    setActiveReaction({ id, sender });
    reactionTimerRef.current = window.setTimeout(() => {
      setActiveReaction(null);
      reactionTimerRef.current = null;
    }, 2600);
  }, []);

  const handleReaction = useCallback((id: NesReactionId) => {
    const bundle = activeBundle;
    if (!bundle || !["synced", "paused"].includes(netplayStatus)) return;
    if (netplayRef.current?.sendReaction(id)) showReaction(id, bundle.role);
  }, [activeBundle, netplayStatus, showReaction]);

  const checkSlotStatus = useCallback(async (slot: string, sha: string) => {
    try {
      const exists = await nesHasState(sha, slot);
      setHasSaveSlot(exists);
    } catch {
      setHasSaveSlot(false);
    }
  }, []);

  useEffect(() => {
    if (romPayload?.sha256) {
      void checkSlotStatus(selectedSlot, romPayload.sha256);
    }
  }, [romPayload, selectedSlot, checkSlotStatus]);

  const handleSaveState = useCallback(async (slot = selectedSlot) => {
    const emu = emuRef.current;
    if (!emu || !romPayload?.sha256) return;
    try {
      // SNES getState() may be async on some cores — await the snapshot.
      const json =
        emu instanceof SnesEmulator ? await emu.serializeAsync() : emu.serialize();
      if (!json) {
        setSaveError("⚠ Save failed — the emulator is not ready. Try again in a moment.");
        setAutoSavedNotice(null);
        return;
      }
      await nesSaveState(romPayload.sha256, slot, json);
      await checkSlotStatus(slot, romPayload.sha256);
      setSaveError(null);
      setAutoSavedNotice(`Saved state to Slot ${slot.toUpperCase()}`);
      setTimeout(() => setAutoSavedNotice(null), 3000);
    } catch (e) {
      setSaveError(`⚠ Save failed: ${String(e)}`);
      setAutoSavedNotice(null);
      console.warn("Failed to save state:", e);
    }
  }, [selectedSlot, romPayload, checkSlotStatus]);

  const handleLoadState = useCallback(async (slot = selectedSlot) => {
    const emu = emuRef.current;
    if (!emu || !romPayload?.sha256) return;
    try {
      const json = await nesLoadState(romPayload.sha256, slot);
      if (!json) {
        setSaveError("⚠ No save state found in this slot.");
        setAutoSavedNotice(null);
        return;
      }
      // deserialize() validates the envelope and reports failure instead of
      // feeding a corrupt snapshot to the emulator core (which can hang it).
      const loaded = emu.deserialize(json);
      if (!loaded) {
        setSaveError("⚠ Load failed — the save file is corrupted or unreadable.");
        setAutoSavedNotice(null);
        return;
      }
      setSaveError(null);
      setAutoSavedNotice(`Loaded state from Slot ${slot.toUpperCase()}`);
      setTimeout(() => setAutoSavedNotice(null), 3000);
    } catch (e) {
      setSaveError(`⚠ Load failed: ${String(e)}`);
      setAutoSavedNotice(null);
      console.warn("Failed to load state:", e);
    }
  }, [selectedSlot, romPayload]);

  useEffect(() => {
    void loadConfig();
    return () => {
      emuRef.current?.stop();
      emuRef.current = null;
      netplayRef.current?.stop();
      if (reactionTimerRef.current !== null) window.clearTimeout(reactionTimerRef.current);
    };
  }, []);

  async function loadConfig() {
    try {
      const cfg = await nesGetConfig();
      setConfig(cfg);
      setServiceUrl(cfg.service_base_url);
      if (cfg.service_base_url.trim()) void refreshRooms(cfg);
    } catch (e) {
      console.warn("Failed to load NES config:", e);
    }
  }

  async function refreshRooms(nextConfig: NesRelayConfigV1 = config) {
    if (!nextConfig.service_base_url.trim()) {
      setRooms([]);
      return;
    }
    setRoomsLoading(true);
    try {
      setRooms(await nesListRooms(nextConfig));
      setRoomError(null);
    } catch (e) {
      setRoomError(String(e));
    } finally {
      setRoomsLoading(false);
    }
  }

  useEffect(() => {
    if (mode !== "home" || !config.service_base_url.trim()) return;
    void refreshRooms(config);
    const timer = window.setInterval(() => void refreshRooms(config), 5_000);
    return () => window.clearInterval(timer);
  }, [mode, config]);

  async function handleSaveConfig() {
    const next: NesRelayConfigV1 = {
      schema_version: 1,
      service_base_url: serviceUrl.trim(),
      proxy: config.proxy,
    };
    try {
      await nesSaveConfig(next);
      setConfig(next);
      setServerStatus("unknown");
      setServerError(null);
    } catch (e) {
      setServerError(String(e));
    }
  }

  async function handleTestServer() {
    setTestingServer(true);
    setServerError(null);
    try {
      await nesTestServer({
        schema_version: 1,
        service_base_url: serviceUrl.trim(),
        proxy: config.proxy,
      });
      setServerStatus("ok");
    } catch (e) {
      setServerStatus("error");
      setServerError(String(e));
    } finally {
      setTestingServer(false);
    }
  }

  async function handlePickRom() {
    setRomError(null);
    try {
      const path = await pickFile();
      if (!path) return;
      const result = await nesOpenRom(path);
      setRomPayload(result.payload);
      setRomData(decodeB64(result.data_b64));
      setRomOpen(false);
    } catch (e) {
      setRomError(String(e));
    }
  }

  async function handleStartHostGame() {
    if (!romData) return;
    setRoomError(null);
    try {
      const nextConfig: NesRelayConfigV1 = {
        schema_version: 1,
        service_base_url: serviceUrl.trim(),
        proxy: config.proxy,
      };
      if (!nextConfig.service_base_url) {
        throw new Error("Set the NES session service URL before hosting a public room.");
      }
      await nesSaveConfig(nextConfig);
      setConfig(nextConfig);
      if (!romPayload) {
        throw new Error("Choose a local ROM before hosting a public room.");
      }
      const bundle = await nesCreatePublicRoom(nextConfig, romPayload.name);
      setActiveBundle(bundle);
      setNetplayStatus("connecting");
      setMode("host-game");
    } catch (e) {
      setRoomError(String(e));
    }
  }

  function handleStartSoloGame() {
    if (!romData) return;
    setRoomError(null);
    setNetplayDetail(null);
    setActiveBundle(null);
    setMode("host-game");
  }

  async function handleJoinRoom(room: NesRoomDirectoryEntryV1) {
    setPendingJoinRoomId(room.room_id);
    setPendingHostRomName(room.host_rom_name);
    setRoomError(null);
    setMode("guest-invite");
  }

  async function handleConfirmGuestJoin() {
    if (!pendingJoinRoomId || !romData || !romPayload) return;
    setRoomError(null);
    try {
      const bundle = await nesJoinRoom(config, pendingJoinRoomId);
      setActiveBundle(bundle);
      setNetplayStatus("connecting");
      setMode("guest-game");
    } catch (e) {
      setRoomError(String(e));
      await refreshRooms(config);
    }
  }

  // ── Host game runtime ──
  useEffect(() => {
    if (mode !== "host-game" && mode !== "guest-game") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isSnes = romPayload?.console === "snes";
    let cancelled = false;

    // Both engines expose the same surface the panel and netplay expect.
    type Engine = NesEmulator | SnesEmulator;
    let engine: Engine | null = null;
    const setEngine = (e: Engine) => {
      engine = e;
      emuRef.current = e;
    };

    if (!isSnes) {
      const emu = new NesEmulator(canvas, {
        onStatus: (s) => setEmuStatus(s),
      });
      setEngine(emu);
      if (romData) {
        try {
          emu.loadRom(romData);
          setRomLoaded(true);
          if (romPayload) {
            layaBotRef.current?.setRom(romPayload.name, romData);
          }
        } catch (e) {
          setEmuStatus(`Failed to load ROM: ${String(e)}`);
        }
      }
    } else {
      // SNES boots asynchronously; the panel unlocks once the core is ready.
      setEmuStatus("Booting SNES core…");
      const snes = new SnesEmulator(canvas, {
        onStatus: (s) => setEmuStatus(s),
      });
      setEngine(snes);
      void (async () => {
        if (!romData || cancelled) return;
        try {
          await snes.loadRomAsync(romData);
          if (cancelled) return;
          setRomLoaded(true);
          snes.start();
        } catch (e) {
          setEmuStatus(`Failed to load ROM: ${String(e)}`);
        }
      })();
    }

    const role = activeBundle?.role === "guest" ? "guest" : "host";
    const input = new NesControllerInput(role);
    inputRef.current = input;
    const detach = input.attach();
    const poll = activeBundle
      ? null
      : window.setInterval(() => {
          const humanMask = input.readBitmask();
          const bot = layaBotRef.current;
          if (bot && bot.isEnabled() && engine instanceof NesEmulator) {
            bot.updateState(engine.getRam());
            const target = bot.getTargetPlayer();
            const p1BotMask = bot.getButtonMask(1);
            const p2BotMask = bot.getButtonMask(2);

            if (target === 1) {
              if (humanMask !== 0) {
                // Human is actively pressing buttons: Human has 100% immediate priority on P1
                engine.setPlayerInput(1, humanMask);
              } else {
                // Hands-off: Bot controls Player 1
                engine.setPlayerInput(1, p1BotMask);
              }
              engine.setPlayerInput(2, 0);
            } else if (target === 2) {
              // Bot plays Player 2 (Co-op partner): human is pure P1, bot is pure P2
              engine.setPlayerInput(1, humanMask);
              engine.setPlayerInput(2, p2BotMask);
            } else {
              // Target === 3 (Dual Auto: Bot controls both P1 and P2 simultaneously!)
              if (humanMask !== 0) {
                engine.setPlayerInput(1, humanMask);
              } else {
                engine.setPlayerInput(1, p1BotMask);
              }
              engine.setPlayerInput(2, p2BotMask);
            }
          } else {
            engine?.setPlayerInput(1, humanMask);
          }
        }, 1000 / 60);

    return () => {
      cancelled = true;
      if (poll !== null) window.clearInterval(poll);
      detach();
      engine?.stop();
      emuRef.current = null;
      inputRef.current = null;
      setRomLoaded(false);
      layaBotRef.current?.setEnabled(false);
    };
  }, [mode, romData, activeBundle, romPayload]);

  useEffect(() => {
    if (!activeBundle) return;
    const isHost = activeBundle.role === "host" && mode === "host-game";
    const isGuest = activeBundle.role === "guest" && mode === "guest-game";
    if (!isHost && !isGuest) return;

    const emulator = emuRef.current;
    const localInput = inputRef.current;
    if (!emulator || !localInput || !romPayload) return;
    const session = new NesNetplaySession({
      bundle: activeBundle,
      emulator,
      localInput,
      romSha256: romPayload.sha256,
      onStatus: (status, detail) => {
        setNetplayStatus(status);
        setNetplayDetail(detail ?? null);
        if (status === "synced") {
          setRunning(true);
          setPaused(false);
        } else if (status === "paused") {
          setRunning(false);
          setPaused(true);
        } else if (status === "failed" || status === "peer-left") {
          setRunning(false);
        }
      },
    });
    session.onReaction = (id, sender) => showReaction(id, sender);
    session.onAutoSave = (reason: string) => {
      if (!romPayload?.sha256) return;
      void (async () => {
        try {
          const json =
            emulator instanceof SnesEmulator
              ? await emulator.serializeAsync()
              : emulator.serialize();
          if (json) {
            await nesSaveState(romPayload.sha256, "auto", json);
            void checkSlotStatus(selectedSlot, romPayload.sha256);
            setAutoSavedNotice("Auto-saved stage upon player disconnect!");
          }
        } catch (err) {
          console.warn("Auto-save failed on peer left:", err);
        }
      })();
    };
    netplayRef.current = session;
    void session.start().catch((error) => {
      setNetplayStatus("failed");
      setNetplayDetail(String(error));
    });
    return () => {
      session.stop();
      if (netplayRef.current === session) netplayRef.current = null;
    };
  }, [activeBundle, mode, romPayload]);

  // Handle visibility changes (keep-alive vs pause audio)
  useEffect(() => {
    const keepAlive = localStorage.getItem("clx-nes-keep-alive") !== "false";
    const emu = emuRef.current;
    if (!emu) return;

    if (!isVisible) {
      // Tab hidden: remember running state
      wasRunningBeforeHiddenRef.current = running;
      if (running) {
        if (activeBundle) netplayRef.current?.setPaused(true);
        else emu.pause();
      }
    } else {
      // Tab became visible again: if it was running and keepAlive is true, resume
      if (wasRunningBeforeHiddenRef.current && keepAlive) {
        if (activeBundle) netplayRef.current?.setPaused(false);
        else if (!paused) emu.resume();
      }
    }
  }, [isVisible, running, paused, activeBundle]);

  const toggleRun = useCallback(() => {
    const emu = emuRef.current;
    if (!emu || !romLoaded) return;
    if (activeBundle) {
      netplayRef.current?.setPaused(running);
      return;
    }
    if (running) {
      emu.pause();
      setPaused(true);
      setRunning(false);
    } else {
      if (paused) emu.resume();
      else emu.start();
      setPaused(false);
      setRunning(true);
    }
  }, [running, paused, romLoaded, activeBundle]);

  const handleReset = useCallback(() => {
    if (activeBundle) netplayRef.current?.reset();
    else emuRef.current?.reset();
  }, [activeBundle]);

  const handleBackHome = useCallback(() => {
    if (activeBundle) {
      const action = activeBundle.role === "host" ? nesEndRoom : nesLeaveRoom;
      void action(config, activeBundle.room.room_id).catch(() => undefined);
    }
    setActiveBundle(null);
    setPendingJoinRoomId(null);
    setMode("home");
  }, [activeBundle, config]);

  // Manual explicit quit: stop emulation and free ROM memory
  const handleQuitGame = useCallback(() => {
    if (activeBundle) {
      const action = activeBundle.role === "host" ? nesEndRoom : nesLeaveRoom;
      void action(config, activeBundle.room.room_id).catch(() => undefined);
    }
    setActiveBundle(null);
    emuRef.current?.stop();
    emuRef.current = null;
    setRomData(null);
    setRomPayload(null);
    setRomLoaded(false);
    setRunning(false);
    setPaused(false);
    setMode("home");
  }, [activeBundle, config]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-cyber-base text-slate-100">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-cyber-line px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xs uppercase tracking-[0.2em] text-cyber-neon font-bold">{tr("🎮 NES Multiplayer")}</h2>
          {mode !== "home" && (
            <button
              type="button"
              onClick={handleBackHome}
              className="rounded border border-cyber-line/40 px-2 py-0.5 text-[10px] font-semibold text-slate-400 hover:text-white hover:border-cyber-neon/40 transition"
            >{tr("← Home")}</button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {autoSavedNotice && (
            <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 animate-pulse">
              ✨ {tr(autoSavedNotice ?? '')}
            </span>
          )}
          {saveError && (
            <span className="rounded bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[11px] font-semibold text-rose-300">
              {trFeedback(saveError ?? '')}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowKeyConfig(true)}
            className="rounded border border-cyber-line/50 bg-cyber-base/60 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:border-amber-400 hover:text-amber-200 transition flex items-center gap-1.5"
            title={tr("Configure Controller Key Mapping")}
          >
            <span>{tr("⌨️ Controls")}</span>
          </button>
          <span className="text-[10px] text-slate-500">{tr("Windows x64 · input-only WSS")}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {mode === "home" && (
          <HomeView
            config={config}
            serverStatus={serverStatus}
            serverError={trFeedback(serverError ?? '')}
            onTestServer={handleTestServer}
            testingServer={testingServer}
            onHostGame={() => setMode("host-setup")}
            rooms={rooms}
            roomsLoading={roomsLoading}
            roomError={trFeedback(roomError ?? '')}
            onRefreshRooms={() => void refreshRooms(config)}
            onJoinRoom={(room) => void handleJoinRoom(room)}
          />
        )}
        {(mode === "host-setup" || mode === "waiting") && (
          <HostSetupView
            serviceUrl={serviceUrl}
            setServiceUrl={setServiceUrl}
            onSaveConfig={handleSaveConfig}
            romPayload={romPayload}
            romError={trFeedback(romError ?? '')}
            sessionError={trFeedback(roomError ?? '')}
            onPickRom={handlePickRom}
            onStart={handleStartHostGame}
            onStartSolo={handleStartSoloGame}
            waiting={mode === "waiting"}
          />
        )}
        {mode === "host-game" && (
          <HostGameView
            canvasRef={canvasRef}
            romPayload={romPayload}
            isSnes={romPayload?.console === "snes"}
            emuStatus={emuStatus}
            running={running}
            paused={paused}
            romLoaded={romLoaded}
            layaBot={layaBotRef.current}
            onToggleRun={toggleRun}
            onReset={handleReset}
            onQuitGame={handleQuitGame}
            onOpenControls={() => setShowKeyConfig(true)}
            netplayStatus={netplayStatus}
            netplayDetail={netplayDetail}
            online={activeBundle?.role === "host"}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            hasSaveSlot={hasSaveSlot}
            onSaveState={handleSaveState}
            onLoadState={handleLoadState}
            reaction={activeReaction}
            onReact={handleReaction}
          />
        )}
        {mode === "guest-invite" && (
          <GuestInviteView
            roomId={pendingJoinRoomId}
            hostRomName={pendingHostRomName}
            romPayload={romPayload}
            error={romError ?? roomError}
            onPickRom={handlePickRom}
            onJoin={() => void handleConfirmGuestJoin()}
          />
        )}
        {mode === "guest-game" && (
          <GuestGameView
            canvasRef={canvasRef}
            room={activeBundle?.room ?? null}
            status={netplayStatus}
            detail={netplayDetail}
            running={running}
            paused={paused}
            romLoaded={romLoaded}
            romPayload={romPayload}
            onToggleRun={toggleRun}
            onReset={handleReset}
            onLeave={handleBackHome}
            onOpenControls={() => setShowKeyConfig(true)}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            hasSaveSlot={hasSaveSlot}
            onSaveState={handleSaveState}
            onLoadState={handleLoadState}
            reaction={activeReaction}
            onReact={handleReaction}
          />
        )}
      </div>

      {/* Controller Key Mapping Modal */}
      <NesKeyConfigModal
        role={activeBundle?.role === "guest" ? "guest" : "host"}
        isOpen={showKeyConfig}
        onClose={() => setShowKeyConfig(false)}
        onSaved={(newMapping) => {
          inputRef.current?.setMapping(newMapping);
        }}
      />
    </div>
  );
}

function HomeView(props: {
  config: NesRelayConfigV1;
  serverStatus: "unknown" | "ok" | "error";
  serverError: string | null;
  onTestServer: () => void;
  testingServer: boolean;
  onHostGame: () => void;
  rooms: NesRoomDirectoryEntryV1[];
  roomsLoading: boolean;
  roomError: string | null;
  onRefreshRooms: () => void;
  onJoinRoom: (room: NesRoomDirectoryEntryV1) => void;
}) {
  const hasUrl = props.config.service_base_url.trim().length > 0;
  return (
    <div className="grid gap-4">
      <div className="rounded-xl border border-cyber-line/40 bg-cyber-panel/60 p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">{tr("Session Service")}</h3>
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
              props.serverStatus === "ok"
                ? "bg-emerald-500/15 text-emerald-400"
                : props.serverStatus === "error"
                  ? "bg-rose-500/15 text-rose-400"
                  : "bg-slate-500/15 text-slate-400"
            }`}
          >
            {props.serverStatus === "ok" ? tr("OK") : props.serverStatus === "error" ? tr("Error") : tr("Not tested")}
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          {hasUrl ? props.config.service_base_url : tr("No service URL configured. Set it in Host Setup.")}
        </p>
        {props.serverError && <p className="mt-2 text-[11px] text-rose-400">{props.serverError}</p>}
        <button
          type="button"
          onClick={props.onTestServer}
          disabled={props.testingServer}
          className="mt-3 rounded border border-cyber-line/40 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:text-white hover:border-cyber-neon/40 transition disabled:opacity-50"
        >
          {props.testingServer ? tr("Testing…") : tr("Test server")}
        </button>
      </div>

      <div className="rounded-xl border border-cyber-line/40 bg-cyber-panel/60 p-5">
        <h3 className="text-sm font-semibold text-slate-200">{tr("Host a Game")}</h3>
        <p className="mt-1 text-[11px] text-slate-400">{tr("Both players load the same ROM locally; only controller input is sent through the room service.")}</p>
        <button
          type="button"
          onClick={props.onHostGame}
          className="mt-3 rounded bg-cyber-electric px-4 py-2 text-[12px] font-bold text-white hover:bg-cyber-electric/80 transition"
        >{tr("Host Game")}</button>
      </div>

      <div className="rounded-xl border border-cyber-line/40 bg-cyber-panel/60 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">{tr("Live Rooms")}</h3>
            <p className="mt-1 text-[11px] text-slate-500">{tr("Open rooms can be claimed by exactly one Player 2.")}</p>
          </div>
          <button
            type="button"
            onClick={props.onRefreshRooms}
            disabled={props.roomsLoading || !hasUrl}
            className="rounded border border-cyber-line/40 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:border-cyber-neon/40 hover:text-white disabled:opacity-40"
          >
            {props.roomsLoading ? tr("Refreshing…") : tr("Refresh")}
          </button>
        </div>
        {props.roomError && <p className="mt-3 text-[11px] text-rose-400">{trFeedback(props.roomError ?? '')}</p>}
        <div className="mt-3 grid gap-2">
          {!props.roomsLoading && props.rooms.length === 0 && (
            <div className="rounded border border-dashed border-cyber-line/40 px-3 py-4 text-center text-[11px] text-slate-500">{tr("No live rooms yet. Start one and wait for Player 2.")}</div>
          )}
          {props.rooms.map((room) => (
            <div key={room.room_id} className="flex items-center justify-between rounded border border-cyber-line/30 bg-cyber-base/50 px-3 py-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-200">
                  <span>{room.joinable ? tr("Waiting for Player 2") : tr(room.state)}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[9px] uppercase ${room.joinable ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"}`}>
                    {room.participant_count}/2
                  </span>
                </div>
                <div className="mt-1 truncate font-mono text-[10px] text-slate-500" title={room.host_pubkey}>{tr("Host ")}{room.host_pubkey.slice(0, 12)}{tr("… · Room ")}{room.room_id.slice(0, 8)}
                </div>
                <div className="mt-1 truncate font-mono text-[11px] text-emerald-300" title={room.host_rom_name}>
                  ROM: {room.host_rom_name}
                </div>
              </div>
              <button
                type="button"
                onClick={() => props.onJoinRoom(room)}
                disabled={!room.joinable}
                className="ml-3 rounded bg-cyber-electric px-3 py-1.5 text-[11px] font-bold text-white hover:bg-cyber-electric/80 disabled:bg-slate-700 disabled:text-slate-500"
              >
                {room.joinable ? tr("Join as P2") : tr("Full")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HostSetupView(props: {
  serviceUrl: string;
  setServiceUrl: (v: string) => void;
  onSaveConfig: () => void;
  romPayload: NesRomPayloadV1 | null;
  romError: string | null;
  sessionError: string | null;
  onPickRom: () => void;
  onStart: () => void;
  onStartSolo: () => void;
  waiting: boolean;
}) {
  return (
    <div className="grid max-w-2xl gap-4">
      <div className="rounded-xl border border-cyber-line/40 bg-cyber-panel/60 p-5">
        <h3 className="text-sm font-semibold text-slate-200">{tr("1 · Service URL")}</h3>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={props.serviceUrl}
            onChange={(e) => props.setServiceUrl(e.target.value)}
            placeholder="https://nes.example.com"
            className="flex-1 rounded border border-cyber-line bg-cyber-base px-3 py-2 text-[12px] text-slate-200 placeholder-slate-600 outline-none focus:border-cyber-electric"
          />
          <button
            type="button"
            onClick={props.onSaveConfig}
            className="rounded border border-cyber-line/40 px-3 py-2 text-[11px] font-semibold text-slate-300 hover:text-white hover:border-cyber-neon/40 transition"
          >{tr("Save")}</button>
        </div>
        <p className="mt-1 text-[10px] text-slate-500">{tr("Public URLs must be HTTPS/WSS. Plain HTTP is allowed only for localhost development.")}</p>
      </div>

      <div className="rounded-xl border border-cyber-line/40 bg-cyber-panel/60 p-5">
        <h3 className="text-sm font-semibold text-slate-200">{tr("2 · Local ROM")}</h3>
        <button
          type="button"
          onClick={props.onPickRom}
          className="mt-2 rounded border border-cyber-line/40 px-3 py-2 text-[11px] font-semibold text-slate-300 hover:text-white hover:border-cyber-neon/40 transition"
        >{tr("Choose ROM (.nes / .sfc / .smc)…")}</button>
        {props.romPayload && (
          <div className="mt-3 rounded bg-cyber-base/60 px-3 py-2 text-[11px] font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyber-neon/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-cyber-neon">
                {props.romPayload.console}
              </span>
              <span className="text-emerald-400">{props.romPayload.name}</span>
            </div>
            <div className="text-slate-500">
              {(props.romPayload.size_bytes / 1024).toFixed(1)} KiB · sha256 {props.romPayload.sha256.slice(0, 12)}…
            </div>
          </div>
        )}
        {props.romError && <p className="mt-2 text-[11px] text-rose-400">{props.romError}</p>}
        <p className="mt-2 text-[10px] text-slate-500">{tr("The ROM stays on this machine. It is never uploaded or shared. NES (.nes) and SNES (.sfc/.smc/.fig/.swc) files ≤ 16 MiB are accepted.")}</p>
      </div>

      <div className="rounded-xl border border-cyber-line/40 bg-cyber-panel/60 p-5">
        <h3 className="text-sm font-semibold text-slate-200">{tr("3 · Choose Play Mode")}</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!props.romPayload}
            onClick={props.onStartSolo}
            className="rounded border border-emerald-400/50 bg-emerald-500/10 px-4 py-2 text-[12px] font-bold text-emerald-300 hover:bg-emerald-500/20 transition disabled:opacity-40"
          >{tr("Play Solo")}</button>
          <button
            type="button"
            disabled={!props.romPayload || props.waiting || !props.serviceUrl.trim()}
            onClick={props.onStart}
            className="rounded bg-cyber-electric px-4 py-2 text-[12px] font-bold text-white hover:bg-cyber-electric/80 transition disabled:opacity-40"
          >
            {props.waiting ? tr("Waiting for Player 2…") : tr("Host Public Room")}
          </button>
        </div>
        {props.sessionError && <p className="mt-2 text-[11px] text-rose-400">{props.sessionError}</p>}
        <p className="mt-1 text-[10px] text-slate-500">{tr("Solo never contacts the room service. Public hosting adds the room to Live Rooms and waits for Player 2.")}</p>
      </div>
    </div>
  );
}

type ResolutionMode = "auto" | "1x" | "2x" | "3x" | "4x" | "fit";

type VisibleReaction = { id: NesReactionId; sender: "host" | "guest" } | null;

function NesReactionPicker(props: { enabled: boolean; onReact: (id: NesReactionId) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        disabled={!props.enabled}
        onClick={() => setOpen((value) => !value)}
        className="rounded border border-fuchsia-400/40 bg-fuchsia-500/10 px-3 py-1.5 text-[12px] font-semibold text-fuchsia-200 hover:bg-fuchsia-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        aria-expanded={open}
      >{tr("😀 Reactions")}</button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 flex w-56 flex-wrap gap-1 rounded-lg border border-fuchsia-400/30 bg-slate-950/95 p-2 shadow-xl">
          {NES_REACTIONS.map((reaction) => (
            <button
              key={reaction.id}
              type="button"
              className="rounded px-2 py-1 text-lg hover:bg-fuchsia-500/20"
              title={tr(reaction.label)}
              aria-label={tr(reaction.label)}
              onClick={() => { props.onReact(reaction.id); setOpen(false); }}
            >
              {reaction.emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NesReactionOverlay({ reaction }: { reaction: VisibleReaction }) {
  if (!reaction) return null;
  const item = NES_REACTIONS.find((candidate) => candidate.id === reaction.id);
  if (!item) return null;
  const player = reaction.sender === "host" ? "P1" : "P2";
  return (
    <div className={`pointer-events-none absolute top-5 z-10 flex items-center gap-2 rounded-full border border-white/25 bg-slate-950/80 px-3 py-2 text-2xl shadow-lg ${reaction.sender === "host" ? "left-5" : "right-5"}`}>
      <span>{item.emoji}</span><span className="text-[10px] font-bold text-slate-200">{player}</span>
    </div>
  );
}

function HostGameView(props: {
  canvasRef: React.Ref<HTMLCanvasElement>;
  romPayload: NesRomPayloadV1 | null;
  isSnes: boolean;
  emuStatus: string;
  running: boolean;
  paused: boolean;
  romLoaded: boolean;
  layaBot: NesLayaBot | null;
  onToggleRun: () => void;
  onReset: () => void;
  onQuitGame: () => void;
  onOpenControls: () => void;
  netplayStatus: NesNetplayStatus;
  netplayDetail: string | null;
  online: boolean;
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
  hasSaveSlot: boolean;
  onSaveState: (slot?: string) => void;
  onLoadState: (slot?: string) => void;
  reaction: VisibleReaction;
  onReact: (id: NesReactionId) => void;
}) {
  const locale = useLocale();
  const [resMode, setResMode] = useState<ResolutionMode>(() => {
    return (localStorage.getItem("clx-nes-res-mode") as ResolutionMode) || "auto";
  });
  const [containerSize, setContainerSize] = useState<{ w: number; h: number }>({ w: 800, h: 600 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({
          w: entry.contentRect.width,
          h: entry.contentRect.height,
        });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleResChange = (mode: ResolutionMode) => {
    setResMode(mode);
    localStorage.setItem("clx-nes-res-mode", mode);
  };

  // The canvas backing store remains 256x240. Only its CSS dimensions change,
  // so every fixed/auto mode performs exactly one nearest-neighbor scale.
  const isSnes = props.romPayload?.console === "snes";
  const canvasDimensions = useMemo(() => {
    if (resMode === "1x") return { width: NES_NATIVE_WIDTH, height: NES_NATIVE_HEIGHT };
    if (resMode === "2x") return { width: NES_NATIVE_WIDTH * 2, height: NES_NATIVE_HEIGHT * 2 };
    if (resMode === "3x") return { width: NES_NATIVE_WIDTH * 3, height: NES_NATIVE_HEIGHT * 3 };
    if (resMode === "4x") return { width: NES_NATIVE_WIDTH * 4, height: NES_NATIVE_HEIGHT * 4 };
    if (resMode === "fit") {
      const fitScale = Math.min(
        containerSize.w / NES_NATIVE_WIDTH,
        containerSize.h / NES_NATIVE_HEIGHT,
      );
      return {
        width: NES_NATIVE_WIDTH * fitScale,
        height: NES_NATIVE_HEIGHT * fitScale,
      };
    }

    // Auto Crisp: Calculate the highest integer scale (1x, 2x, 3x, 4x, etc.) that fits inside container
    const maxScaleX = Math.floor(containerSize.w / NES_NATIVE_WIDTH);
    const maxScaleY = Math.floor(containerSize.h / NES_NATIVE_HEIGHT);
    const bestScale = Math.max(1, Math.min(maxScaleX, maxScaleY));

    return {
      width: NES_NATIVE_WIDTH * bestScale,
      height: NES_NATIVE_HEIGHT * bestScale,
    };
  }, [resMode, containerSize]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={props.onToggleRun}
            disabled={!props.romLoaded || (props.online && !["synced", "paused"].includes(props.netplayStatus))}
            className="rounded bg-cyber-electric px-4 py-1.5 text-[12px] font-bold text-white hover:bg-cyber-electric/80 transition disabled:opacity-40"
          >
            {props.running ? tr("Pause") : props.paused ? tr("Resume") : tr("Play")}
          </button>
          <button
            type="button"
            onClick={props.onReset}
            disabled={!props.romLoaded || (props.online && !["synced", "paused"].includes(props.netplayStatus))}
            className="rounded border border-cyber-line/40 px-3 py-1.5 text-[12px] font-semibold text-slate-300 hover:text-white hover:border-cyber-neon/40 transition disabled:opacity-40"
          >{tr("Reset")}</button>
          <button
            type="button"
            onClick={props.onQuitGame}
            className="rounded border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-[12px] font-semibold text-rose-300 hover:bg-rose-500/20 hover:border-rose-400 transition"
            title={tr("Stop emulation and unload ROM")}
          >{tr("⏹️ Exit Game")}</button>
          <button
            type="button"
            onClick={props.onOpenControls}
            className="rounded border border-cyber-line/40 bg-cyber-base/50 px-3 py-1.5 text-[12px] font-semibold text-amber-300 hover:text-amber-200 hover:border-amber-400 transition"
          >{tr("⌨️ Controls")}</button>

          {!props.isSnes && (
            <NesLayaBotControl bot={props.layaBot} romLoaded={props.romLoaded} />
          )}

          <NesReactionPicker enabled={props.online && ["synced", "paused"].includes(props.netplayStatus)} onReact={props.onReact} />

          {/* Save / Load State Controls */}
          <div className="flex items-center gap-1.5 ml-1 rounded border border-cyber-line/40 bg-cyber-base/40 px-2 py-1 text-xs">
            <span className="text-[10px] text-slate-400 font-mono">{tr("Slot:")}</span>
            <select
              value={props.selectedSlot}
              onChange={(e) => props.onSelectSlot(e.target.value)}
              className="bg-transparent text-[11px] font-semibold text-cyber-neon outline-none cursor-pointer"
            >
              <option value="1" className="bg-slate-900 text-slate-200">{tr("Slot 1")}</option>
              <option value="2" className="bg-slate-900 text-slate-200">{tr("Slot 2")}</option>
              <option value="3" className="bg-slate-900 text-slate-200">{tr("Slot 3")}</option>
              <option value="auto" className="bg-slate-900 text-slate-200">{tr("Auto Save")}</option>
            </select>
            <button
              type="button"
              onClick={() => props.onSaveState(props.selectedSlot)}
              disabled={!props.romLoaded}
              className="rounded bg-indigo-600/80 hover:bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white transition disabled:opacity-40"
              title={tr("Save snapshot to current slot")}
            >{tr("💾 Save")}</button>
            <button
              type="button"
              onClick={() => props.onLoadState(props.selectedSlot)}
              disabled={!props.romLoaded || !props.hasSaveSlot}
              className="rounded border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 transition disabled:opacity-40"
              title={tr("Load snapshot from current slot")}
            >{tr("📂 Load")}</button>
          </div>

          {/* Resolution Selector */}
          <div className="flex items-center gap-1 ml-2 rounded border border-cyber-line/40 bg-cyber-base/40 px-2 py-1 text-xs">
            <span className="text-[10px] text-slate-400 font-mono">{tr("Res:")}</span>
            <select
              value={resMode}
              onChange={(e) => handleResChange(e.target.value as ResolutionMode)}
              className="bg-transparent text-[11px] font-semibold text-cyber-neon outline-none cursor-pointer"
            >
              <option value="auto" className="bg-slate-900 text-slate-200">{tr("Auto Crisp (Pixel-Perfect)")}</option>
              <option value="1x" className="bg-slate-900 text-slate-200">1x (256×240)</option>
              <option value="2x" className="bg-slate-900 text-slate-200">2x (512×480)</option>
              <option value="3x" className="bg-slate-900 text-slate-200">3x (768×720)</option>
              <option value="4x" className="bg-slate-900 text-slate-200">4x (1024×960)</option>
              <option value="fit" className="bg-slate-900 text-slate-200">{tr("Fit (Native Aspect)")}</option>
            </select>
          </div>

          <span className="text-[11px] text-slate-500">{props.emuStatus}</span>
          <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${!props.online || props.netplayStatus === "synced" ? "bg-emerald-500/15 text-emerald-400" : props.netplayStatus === "failed" ? "bg-rose-500/15 text-rose-400" : "bg-amber-500/15 text-amber-300"}`}>
            {!props.online ? tr("Solo") : props.netplayStatus === "synced" ? tr("ROM matched · input sync") : props.netplayStatus}
          </span>
        </div>
        {props.romPayload && (
          <span className="text-[11px] font-mono text-emerald-400">
            {props.romPayload.name}
          </span>
        )}
      </div>

      <div
        ref={containerRef}
        className="flex-1 min-h-0 rounded-xl border border-cyber-line/40 bg-black/90 p-2 flex items-center justify-center overflow-hidden relative"
      >
        <canvas
          ref={props.canvasRef}
          width={NES_NATIVE_WIDTH}
          height={NES_NATIVE_HEIGHT}
          className="block shadow-2xl"
          style={{
            ...canvasDimensions,
            imageRendering: "pixelated",
            ...(isSnes ? { display: "none" } : {}),
          }}
        />
        <NesReactionOverlay reaction={props.reaction} />
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
        <span>{props.online ? props.netplayDetail ?? tr("Player 1: local ROM · waiting for Player 2 ROM hash") : tr("Player 1: Keyboard + Gamepad · local solo session")}</span>
        <span>{tr("Native 256x240 Framebuffer · 44.1kHz Hi-Fi Audio")}</span>
      </div>
    </div>
  );
}

function GuestInviteView(props: {
  roomId: string | null;
  romPayload: NesRomPayloadV1 | null;
  error: string | null;
  hostRomName: string | null;
  onPickRom: () => void;
  onJoin: () => void;
}) {
  return (
    <div className="mx-auto grid max-w-2xl gap-4 rounded-xl border border-cyber-line/40 bg-cyber-panel/60 p-5">
      <div>
        <h3 className="text-sm font-semibold text-slate-200">{tr("Join as Player 2")}</h3>
        <p className="mt-1 font-mono text-[10px] text-slate-500">{tr("Room ")}{props.roomId?.slice(0, 8) ?? tr("unknown")}</p>
      </div>
      <div className="rounded border border-cyber-line/30 bg-cyber-base/50 p-4">
        {props.hostRomName && (
          <p className="mt-2 font-mono text-[11px] text-emerald-300" title={props.hostRomName}>{tr("Host ROM: ")}{props.hostRomName}
          </p>
        )}
        <p className="text-[11px] text-slate-300">{tr("Choose your own local copy of the ROM.")}</p>
        <button type="button" onClick={props.onPickRom} className="mt-3 rounded border border-cyber-line/40 px-3 py-2 text-[11px] font-semibold text-slate-300 hover:border-cyber-neon/40 hover:text-white">{tr("Choose ROM (.nes / .sfc / .smc)…")}</button>
        {props.romPayload && (
          <div className="mt-3 rounded bg-cyber-base px-3 py-2 font-mono text-[10px] text-emerald-400">
            <span className="mr-2 rounded bg-cyber-neon/20 px-1.5 py-0.5 font-bold uppercase text-cyber-neon">{props.romPayload.console}</span>
            {props.romPayload.name} · sha256 {props.romPayload.sha256.slice(0, 12)}…
          </div>
        )}
        <p className="mt-2 text-[10px] text-slate-500">{tr("Only the SHA-256 is compared privately. ROM bytes never leave this machine.")}</p>
      </div>
      {props.error && <p className="text-[11px] text-rose-400">{trFeedback(props.error ?? '')}</p>}
      <button type="button" disabled={!props.romPayload || !props.roomId} onClick={props.onJoin} className="w-fit rounded bg-cyber-electric px-4 py-2 text-[12px] font-bold text-white disabled:opacity-40">{tr("Verify ROM & Join")}</button>
    </div>
  );
}

function GuestGameView(props: {
  canvasRef: React.Ref<HTMLCanvasElement>;
  room: NesConnectionBundleV1["room"] | null;
  status: NesNetplayStatus;
  detail: string | null;
  running: boolean;
  paused: boolean;
  romLoaded: boolean;
  romPayload: NesRomPayloadV1 | null;
  onToggleRun: () => void;
  onReset: () => void;
  onLeave: () => void;
  onOpenControls: () => void;
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
  hasSaveSlot: boolean;
  onSaveState: (slot?: string) => void;
  onLoadState: (slot?: string) => void;
  reaction: VisibleReaction;
  onReact: (id: NesReactionId) => void;
}) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between rounded-xl border border-cyber-line/40 bg-cyber-panel/60 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">{tr("Player 2")}</h3>
          <p className="mt-1 font-mono text-[10px] text-slate-500">{tr("Room ")}{props.room?.room_id.slice(0, 8) ?? tr("connecting")} · {tr(props.detail ?? props.status)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {props.room?.host_rom_name && (
            <p className="mt-1 font-mono text-[11px] text-emerald-300" title={props.room.host_rom_name}>{tr("Host ROM: ")}{props.room.host_rom_name}
            </p>
          )}
          <button type="button" onClick={props.onToggleRun} disabled={!props.romLoaded || !["synced", "paused"].includes(props.status)} className="rounded bg-cyber-electric px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-40">
            {props.running ? tr("Pause") : props.paused ? tr("Resume") : tr("Play")}
          </button>
          <button type="button" onClick={props.onReset} disabled={!props.romLoaded || !["synced", "paused"].includes(props.status)} className="rounded border border-cyber-line/40 px-3 py-1.5 text-[11px] font-semibold text-slate-300 disabled:opacity-40">{tr("Reset")}</button>
          <button type="button" onClick={props.onOpenControls} className="rounded border border-amber-400/40 px-3 py-1.5 text-[11px] font-semibold text-amber-300">{tr("⌨️ P2 Controls")}</button>

          <NesReactionPicker enabled={["synced", "paused"].includes(props.status)} onReact={props.onReact} />

          {/* Save / Load State for Guest */}
          <div className="flex items-center gap-1.5 rounded border border-cyber-line/40 bg-cyber-base/40 px-2 py-1 text-xs">
            <span className="text-[10px] text-slate-400 font-mono">{tr("Slot:")}</span>
            <select
              value={props.selectedSlot}
              onChange={(e) => props.onSelectSlot(e.target.value)}
              className="bg-transparent text-[11px] font-semibold text-cyber-neon outline-none cursor-pointer"
            >
              <option value="1" className="bg-slate-900 text-slate-200">{tr("Slot 1")}</option>
              <option value="2" className="bg-slate-900 text-slate-200">{tr("Slot 2")}</option>
              <option value="3" className="bg-slate-900 text-slate-200">{tr("Slot 3")}</option>
              <option value="auto" className="bg-slate-900 text-slate-200">{tr("Auto Save")}</option>
            </select>
            <button
              type="button"
              onClick={() => props.onSaveState(props.selectedSlot)}
              disabled={!props.romLoaded}
              className="rounded bg-indigo-600/80 hover:bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white transition disabled:opacity-40"
              title={tr("Save snapshot to current slot")}
            >{tr("💾 Save")}</button>
            <button
              type="button"
              onClick={() => props.onLoadState(props.selectedSlot)}
              disabled={!props.romLoaded || !props.hasSaveSlot}
              className="rounded border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 transition disabled:opacity-40"
              title={tr("Load snapshot from current slot")}
            >{tr("📂 Load")}</button>
          </div>

          <button type="button" onClick={props.onLeave} className="rounded border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-[11px] font-semibold text-rose-300">{tr("Leave Room")}</button>
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl border border-cyber-line/40 bg-black/90 p-2">
        <canvas
          ref={props.canvasRef}
          width={NES_NATIVE_WIDTH}
          height={NES_NATIVE_HEIGHT}
          className="max-h-full max-w-full bg-black shadow-2xl"
          style={{ imageRendering: "pixelated", aspectRatio: "256 / 240", width: "auto", height: "100%" }}
        />
        <NesReactionOverlay reaction={props.reaction} />
      </div>
      <div className="flex items-center justify-between text-[10px] text-slate-500">
        <span>{props.romPayload?.name ?? tr("Local ROM")}{tr(" · only P2 input and state hashes leave this machine.")}</span>
        <span className={props.status === "synced" ? "text-emerald-400" : props.status === "failed" ? "text-rose-400" : "text-amber-300"}>
          {tr(String(props.status))}
        </span>
      </div>
    </div>
  );
}
