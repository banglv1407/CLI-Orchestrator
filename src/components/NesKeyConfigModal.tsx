import React, { useEffect, useState } from "react";
import {
  DEFAULT_KEY_MAPPING,
  loadKeyMapping,
  NesKeyMapping,
  NesRole,
  saveKeyMapping,
} from "../lib/nes-input";

interface NesKeyConfigModalProps {
  role?: NesRole;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (mapping: NesKeyMapping) => void;
}

type BindableKey = keyof NesKeyMapping;

const KEY_LABELS: Record<BindableKey, { label: string; desc: string }> = {
  up: { label: "D-Pad Up", desc: "Move character up" },
  down: { label: "D-Pad Down", desc: "Move character down" },
  left: { label: "D-Pad Left", desc: "Move character left" },
  right: { label: "D-Pad Right", desc: "Move character right" },
  a: { label: "Button A", desc: "Jump / Primary action" },
  b: { label: "Button B", desc: "Attack / Secondary action" },
  turboA: { label: "Turbo A (Rapid Fire)", desc: "Auto-repeat Button A ~30Hz" },
  turboB: { label: "Turbo B (Rapid Fire)", desc: "Auto-repeat Button B ~30Hz" },
  select: { label: "Select", desc: "Choose menu option" },
  start: { label: "Start", desc: "Pause / Start game" },
};

export function NesKeyConfigModal({
  role = "host",
  isOpen,
  onClose,
  onSaved,
}: NesKeyConfigModalProps) {
  const [mapping, setMapping] = useState<NesKeyMapping>(() => loadKeyMapping(role));
  const [listeningKey, setListeningKey] = useState<BindableKey | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMapping(loadKeyMapping(role));
      setListeningKey(null);
    }
  }, [isOpen, role]);

  useEffect(() => {
    if (!listeningKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === "Escape") {
        setListeningKey(null);
        return;
      }

      const keyName = e.key;
      setMapping((prev) => {
        const next = { ...prev };
        // Add new key if not already present
        const currentList = next[listeningKey] || [];
        if (!currentList.includes(keyName)) {
          next[listeningKey] = [keyName, ...currentList.filter((k) => k !== keyName)];
        }
        return next;
      });

      setListeningKey(null);
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [listeningKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveKeyMapping(role, mapping);
    onSaved?.(mapping);
    onClose();
  };

  const handleReset = () => {
    setMapping(DEFAULT_KEY_MAPPING);
  };

  const removeKey = (button: BindableKey, keyToRemove: string) => {
    setMapping((prev) => ({
      ...prev,
      [button]: (prev[button] || []).filter((k) => k !== keyToRemove),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-xl border border-cyber-line/60 bg-slate-900 shadow-2xl text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-cyber-line/40 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="text-base">🎮</span>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-cyber-neon">
              NES Controller Key Mapping ({role.toUpperCase()})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-bold px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <p className="text-[11px] text-slate-400">
            Click on a button row to bind a keyboard key. Press <kbd className="rounded bg-slate-800 px-1 py-0.5 font-mono text-[10px] text-amber-400">ESC</kbd> to cancel binding. Standard Gamepads (Xbox / PlayStation / SNES USB) are also mapped automatically.
          </p>

          <div className="space-y-2">
            {(Object.keys(KEY_LABELS) as BindableKey[]).map((btnKey) => {
              const info = KEY_LABELS[btnKey];
              const isListening = listeningKey === btnKey;
              const keys = mapping[btnKey] || [];
              const isTurbo = btnKey === "turboA" || btnKey === "turboB";

              return (
                <div
                  key={btnKey}
                  className={`flex items-center justify-between rounded-lg border p-3 transition ${
                    isListening
                      ? "border-cyber-neon bg-cyber-neon/10"
                      : isTurbo
                        ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50"
                        : "border-cyber-line/40 bg-cyber-base/40 hover:border-cyber-line"
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold ${
                          isTurbo ? "text-amber-400 font-mono" : "text-slate-200 font-mono"
                        }`}
                      >
                        {info.label}
                      </span>
                      {isTurbo && (
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-300">
                          TURBO
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{info.desc}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex flex-wrap items-center gap-1 max-w-[200px] justify-end">
                      {keys.map((k) => (
                        <span
                          key={k}
                          className="inline-flex items-center gap-1 rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-mono text-slate-200 group"
                        >
                          <span>{k === " " ? "Space" : k}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeKey(btnKey, k);
                            }}
                            className="text-slate-500 hover:text-rose-400 font-bold ml-0.5"
                            title="Remove key"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {keys.length === 0 && (
                        <span className="text-[10px] text-slate-600 italic">Unbound</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setListeningKey(isListening ? null : btnKey)}
                      className={`rounded px-2.5 py-1 text-[11px] font-semibold transition ${
                        isListening
                          ? "animate-pulse bg-cyber-neon text-slate-950 font-bold"
                          : "border border-cyber-line/60 bg-slate-800 text-slate-300 hover:text-white hover:border-cyber-neon/40"
                      }`}
                    >
                      {isListening ? "Press key…" : "+ Bind"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-cyber-line/40 px-5 py-3.5 bg-slate-950">
          <button
            type="button"
            onClick={handleReset}
            className="rounded border border-cyber-line/40 px-3 py-1.5 text-[11px] font-semibold text-slate-400 hover:text-rose-300 hover:border-rose-500/40 transition"
          >
            Reset Default
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded bg-cyber-electric px-4 py-1.5 text-[11px] font-bold text-white hover:bg-cyber-electric/80 transition"
            >
              Save Key Mapping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
