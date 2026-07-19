import React, { useState, useEffect, useRef } from 'react';
import type { WebAiProfile } from '../types';
import {
  webAiLoadProfiles,
  webAiSpawnProfile,
  webAiReposition,
  webAiSetVisible,
  webAiClose
} from '../lib/tauri';

export function WebAiPanel({ visible }: { visible: boolean }) {
  const [profiles, setProfiles] = useState<WebAiProfile[]>([]);
  const [preferredId, setPreferredId] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<WebAiProfile | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    webAiLoadProfiles()
      .then((cfg) => {
        setProfiles(cfg.profiles);
        if (cfg.preferredProfileId) {
          setPreferredId(cfg.preferredProfileId);
        }
      })
      .catch((e) => console.error('Failed to load Web AI profiles:', e));

    // No cleanup on unmount — session persists across tab switches
  }, []);

  // Monitor visibility changes — hide/show the child webview
  useEffect(() => {
    if (activeProfile) {
      webAiSetVisible(visible).catch(console.error);
    }
  }, [visible, activeProfile]);

  // Track resizing and reposition the embedded child webview
  useEffect(() => {
    if (!containerRef.current || !activeProfile) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const rect = entry.target.getBoundingClientRect();
        const layoutRect = {
          x: rect.left,
          y: rect.top,
          w: rect.width,
          h: rect.height
        };
        webAiReposition(layoutRect).catch(console.error);
      }
    });

    observer.observe(containerRef.current);
    
    // Initial position
    const rect = containerRef.current.getBoundingClientRect();
    webAiReposition({
      x: rect.left,
      y: rect.top,
      w: rect.width,
      h: rect.height
    }).catch(console.error);

    return () => {
      observer.disconnect();
    };
  }, [activeProfile]);

  const handleLaunch = async (profile: WebAiProfile) => {
    try {
      setActiveProfile(profile);
      // Wait for React to mount the container, then spawn the child webview
      setTimeout(async () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const layoutRect = {
            x: rect.left,
            y: rect.top,
            w: rect.width,
            h: rect.height
          };
          await webAiSpawnProfile(profile, layoutRect);
        }
      }, 50);
    } catch (e: any) {
      alert('Failed to launch profile: ' + String(e));
    }
  };

  const handleCloseSession = async () => {
    try {
      await webAiClose();
      setActiveProfile(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfigure = () => {
    window.dispatchEvent(new CustomEvent('open-settings', { detail: 'web-ai' }));
  };

  if (activeProfile) {
    return (
      <div className="flex flex-col h-full bg-cyber-base border border-cyber-line/30 rounded-lg overflow-hidden font-mono text-xs">
        {/* Header Bar */}
        <div className="flex justify-between items-center bg-cyber-panel/40 border-b border-cyber-line/30 px-4 py-3 select-none">
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-cyber-neon font-bold">🌐</span>
            <span className="font-bold text-slate-200">Secure Web Session:</span>
            <span className="text-cyber-electric font-semibold">{activeProfile.name}</span>
          </div>
          <button
            type="button"
            onClick={handleCloseSession}
            className="rounded border border-red-500/50 hover:bg-red-500/10 px-3 py-1.5 text-[9px] text-red-400 font-bold uppercase transition tracking-wider"
          >
            Close Session
          </button>
        </div>

        {/* Embedded webview target container */}
        <div ref={containerRef} className="flex-1 w-full bg-black relative" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-cyber-panel/20 p-8 select-none font-mono text-xs text-slate-300 text-center max-w-lg mx-auto">
      <div className="text-4xl mb-4 animate-pulse">🌐</div>
      <h2 className="font-display text-sm uppercase tracking-[0.2em] text-cyber-neon font-bold mb-2">
        Web AI Sandboxed Profiles
      </h2>
      <p className="text-slate-400 mb-6 leading-relaxed">
        Run web-based AI clients in secure, isolated child WebViews. Each profile maintains its own session cookies and local storage independently.
      </p>

      {profiles.length === 0 ? (
        <div className="rounded-lg border border-red-500/30 bg-red-950/10 p-6 w-full text-center space-y-3">
          <p className="text-red-400 font-semibold">No Web AI profiles configured.</p>
          <button
            type="button"
            onClick={handleConfigure}
            className="rounded-lg bg-cyber-neon/20 border border-cyber-neon/50 px-4 py-2 hover:bg-cyber-neon/30 transition text-cyber-neon font-bold uppercase tracking-wider text-[10px]"
          >
            Configure Web AI Settings
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-cyber-neon/30 bg-cyber-neon/5 p-5 w-full text-left space-y-4 shadow-xl">
          <div className="flex justify-between border-b border-cyber-neon/20 pb-1.5 font-bold uppercase text-[10px] text-cyber-neon">
            <span>Secure Web Assistant Profiles</span>
            <span>Isolated Environment</span>
          </div>
          <div className="space-y-2.5">
            {profiles.map((p) => {
              const isPref = preferredId === p.id;
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition duration-200 ${
                    isPref
                      ? 'border-cyber-neon bg-cyber-neon/10'
                      : 'border-cyber-line/40 bg-cyber-base/40 hover:border-cyber-neon/30'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-200">{p.name}</span>
                      {isPref && (
                        <span className="text-[8px] bg-cyber-neon text-cyber-base font-bold px-1 rounded">
                          Preferred
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">{p.defaultUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLaunch(p)}
                    className="rounded border border-cyber-neon bg-cyber-neon/10 hover:bg-cyber-neon/20 px-3 py-1.5 text-[9px] text-cyber-neon font-bold transition uppercase tracking-wider"
                  >
                    Launch Profile
                  </button>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={handleConfigure}
            className="w-full text-center block rounded border border-cyber-line/50 hover:border-cyber-neon/40 py-2 hover:bg-cyber-neon/5 text-slate-400 hover:text-cyber-neon transition uppercase text-[10px] font-bold"
          >
            Manage Profiles in Settings
          </button>
        </div>
      )}
    </div>
  );
}
