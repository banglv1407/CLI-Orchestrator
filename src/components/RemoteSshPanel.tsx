import React, { useState, useEffect, useCallback } from 'react';
import {
  startSshServer,
  stopSshServer,
  getSshServerStatus,
  getSshServerConfig,
  saveSshServerConfig,
  type SshServerConfig,
} from '../lib/tauri';

export function RemoteSshPanel() {
  const [sshServerRunning, setSshServerRunning] = useState(false);
  const [sshServerPort, setSshServerPort] = useState(2222);
  const [sshServerIp, setSshServerIp] = useState('127.0.0.1');
  const [sshServerLoading, setSshServerLoading] = useState(false);
  const [sshServerErr, setSshServerErr] = useState<string | null>(null);
  const [sshServerLogs, setSshServerLogs] = useState<string[]>([]);
  const [sshServerConfig, setSshServerConfig] = useState<SshServerConfig>({
    username: 'admin',
    password: 'admin',
    publicKeys: [],
  });
  const [newPublicKey, setNewPublicKey] = useState('');

  const fetchSshServerStatus = useCallback(async () => {
    try {
      const status = await getSshServerStatus();
      setSshServerRunning(status.running);
      setSshServerPort(status.port);
      setSshServerIp(status.localIp);
      setSshServerLogs(status.logs);
    } catch (err) {
      console.error('Failed to get SSH server status:', err);
    }
  }, []);

  const fetchSshServerConfig = useCallback(async () => {
    try {
      const config = await getSshServerConfig();
      setSshServerConfig(config);
    } catch (err) {
      console.error('Failed to get SSH server config:', err);
    }
  }, []);

  useEffect(() => {
    fetchSshServerStatus();
    fetchSshServerConfig();
    const interval = setInterval(fetchSshServerStatus, 3000);
    return () => clearInterval(interval);
  }, [fetchSshServerStatus, fetchSshServerConfig]);

  const handleUpdateSshConfig = async (updated: SshServerConfig) => {
    try {
      await saveSshServerConfig(updated);
      setSshServerConfig(updated);
    } catch (err: any) {
      console.error('Failed to save SSH server config:', err);
      setSshServerErr(err?.message || String(err));
    }
  };

  const handleToggleSshServer = async () => {
    setSshServerLoading(true);
    setSshServerErr(null);
    try {
      if (sshServerRunning) {
        await stopSshServer();
        setSshServerRunning(false);
      } else {
        await startSshServer(sshServerPort);
        setSshServerRunning(true);
      }
      await fetchSshServerStatus();
    } catch (err: any) {
      console.error('Failed to toggle SSH server:', err);
      setSshServerErr(err?.message || String(err));
    } finally {
      setSshServerLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-cyber-panel/40 p-6 select-none">
      <div className="flex shrink-0 items-center justify-between border-b border-cyber-line/50 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-base uppercase tracking-[0.2em] text-cyber-neon font-bold">Remote Access</h2>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider uppercase ${
            sshServerRunning ? 'bg-cyber-neon/10 text-cyber-neon border border-cyber-neon/30 animate-pulse' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
          }`}>
            {sshServerRunning ? '🟢 Active' : '🔴 Inactive'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1.5 scrollbar-thin">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column: Server Control & Auth */}
          <div className="space-y-6">
            {/* Server Control Card */}
            <div className="rounded-xl border border-cyber-line/50 bg-cyber-panel/40 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">SSH Server</span>
                <button
                  type="button"
                  onClick={handleToggleSshServer}
                  disabled={sshServerLoading}
                  className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition ${
                    sshServerRunning
                      ? 'bg-red-500/20 hover:bg-red-500/35 text-red-400 border border-red-500/40 shadow-neon-red-sm'
                      : 'bg-cyber-neon/20 hover:bg-cyber-neon/35 text-cyber-neon border border-cyber-neon/40 shadow-neon-sm'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {sshServerLoading ? 'Processing...' : sshServerRunning ? 'Stop Server' : 'Start Server'}
                </button>
              </div>

              {sshServerErr && (
                <div className="text-xs text-red-400 bg-red-950/20 border border-red-500/30 p-3 rounded-lg font-mono leading-relaxed">
                  ⚠ {sshServerErr}
                </div>
              )}

              <div className="space-y-3">
                <label className="block space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Server Port</span>
                  <input
                    type="number"
                    value={sshServerPort}
                    disabled={sshServerRunning}
                    onChange={(e) => setSshServerPort(parseInt(e.target.value, 10) || 2222)}
                    className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-xs font-mono font-semibold text-slate-100 placeholder-slate-500 outline-none focus:border-cyber-neon transition disabled:opacity-50"
                  />
                </label>
              </div>
            </div>

            {/* Server Configuration Card */}
            <div className="rounded-xl border border-cyber-line/50 bg-cyber-panel/40 p-4 space-y-4">
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">Server Authentication</h3>
              
              <div className="space-y-3">
                <label className="block space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Username</span>
                  <input
                    type="text"
                    value={sshServerConfig.username}
                    onChange={(e) => handleUpdateSshConfig({ ...sshServerConfig, username: e.target.value })}
                    placeholder="e.g. admin"
                    className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-xs font-mono font-semibold text-slate-100 placeholder-slate-500 outline-none focus:border-cyber-neon transition"
                  />
                </label>

                <label className="block space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Password Auth</span>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={sshServerConfig.password || ''}
                      onChange={(e) => handleUpdateSshConfig({ ...sshServerConfig, password: e.target.value || undefined })}
                      placeholder="Leave empty to disable password login"
                      className="flex-1 rounded border border-cyber-line bg-cyber-base px-3 py-2 text-xs font-mono font-semibold text-slate-100 placeholder-slate-500 outline-none focus:border-cyber-neon transition"
                    />
                    {sshServerConfig.password && (
                      <button
                        type="button"
                        onClick={() => handleUpdateSshConfig({ ...sshServerConfig, password: undefined })}
                        className="px-3.5 py-2 text-xs border border-red-500/30 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 font-bold"
                        title="Disable Password Auth"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </label>

                {/* Public Keys Section */}
                <div className="space-y-2 pt-2 border-t border-cyber-line/30">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Authorized Public Keys ({sshServerConfig.publicKeys.length})</span>
                  
                  {sshServerConfig.publicKeys.length > 0 && (
                    <div className="max-h-24 overflow-y-auto space-y-1.5 scrollbar-thin border border-cyber-line bg-cyber-base/40 p-2 rounded">
                      {sshServerConfig.publicKeys.map((key, index) => (
                        <div key={index} className="flex items-center justify-between text-[10px] font-mono bg-cyber-panel/50 p-2 rounded border border-cyber-line/20 text-slate-300">
                          <span className="truncate flex-1 pr-2" title={key}>
                            {key.substring(0, 30)}...{key.substring(key.length - 20)}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedKeys = [...sshServerConfig.publicKeys];
                              updatedKeys.splice(index, 1);
                              handleUpdateSshConfig({ ...sshServerConfig, publicKeys: updatedKeys });
                            }}
                            className="text-red-400 hover:text-red-300 px-2 font-bold text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPublicKey}
                      onChange={(e) => setNewPublicKey(e.target.value)}
                      placeholder="Paste ssh-rsa/ssh-ed25519 public key"
                      className="flex-1 rounded border border-cyber-line bg-cyber-base px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 outline-none focus:border-cyber-neon transition"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newPublicKey.trim()) return;
                        const updatedKeys = [...sshServerConfig.publicKeys, newPublicKey.trim()];
                        handleUpdateSshConfig({ ...sshServerConfig, publicKeys: updatedKeys });
                        setNewPublicKey('');
                      }}
                      className="px-4 py-2 text-xs bg-cyber-neon/20 hover:bg-cyber-neon/35 text-cyber-neon border border-cyber-neon/40 rounded font-bold uppercase tracking-wider"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                💡 Note: Restart the SSH Server to apply authentication changes.
              </div>
            </div>
          </div>

          {/* Right Column: connection instructions & logs */}
          <div className="space-y-6">
            {/* Instruction Panel */}
            <div className="rounded-xl border border-cyber-electric/40 bg-cyber-electric/5 p-4 space-y-3">
              <h3 className="text-xs uppercase font-bold tracking-wider text-cyber-electric">Connection Instruction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Other machines on your network can connect directly to your CLX sessions.
              </p>

              <div className="space-y-1.5 font-mono text-xs">
                <div className="text-slate-400 font-semibold">Command:</div>
                <div className="relative flex items-center justify-between rounded border border-cyber-line/65 bg-[#0d162a] p-3 pr-10 text-cyber-electric select-all">
                  <span>ssh {sshServerConfig.username}@{sshServerIp} -p {sshServerPort}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`ssh ${sshServerConfig.username}@${sshServerIp} -p ${sshServerPort}`);
                      alert('Copied connection command to clipboard!');
                    }}
                    className="absolute right-3 text-slate-500 hover:text-cyber-electric transition"
                    title="Copy command"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 .06.44l3.122 3.12a1.5 1.5 0 0 1 .439 1.061V16.5A1.5 1.5 0 0 1 15.5 18h-7A1.5 1.5 0 0 1 7 16.5v-13Zm1.5-.5a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V7h-3a1 1 0 0 1-1-1V3H8.5Z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="text-xs font-mono leading-relaxed space-y-1 text-slate-500">
                <div>🔐 Active Credentials:</div>
                <div>• Username: <span className="text-slate-300 font-bold">{sshServerConfig.username}</span></div>
                {sshServerConfig.password ? (
                  <div>• Password: <span className="text-slate-300 font-bold">{sshServerConfig.password}</span></div>
                ) : (
                  <div className="text-red-400">• Password authentication is disabled</div>
                )}
                {sshServerConfig.publicKeys.length > 0 && (
                  <div className="text-cyber-neon/80">• Public Key Authentication is active ({sshServerConfig.publicKeys.length} key(s))</div>
                )}
              </div>
            </div>

            {/* Collaborative details */}
            <div className="rounded-xl border border-cyber-line/30 bg-cyber-base/20 p-4 text-xs leading-relaxed text-slate-400 space-y-2">
              <div className="font-bold text-slate-300 flex items-center gap-2">
                <span>💡</span> Collaborative REPL Shell
              </div>
              <p>
                Connected users enter a custom shell displaying all active sessions. Pressing <span className="text-cyber-neon font-mono font-bold">Ctrl+X</span> or <span className="text-cyber-neon font-mono font-bold">Ctrl+Q</span> detaches from a session.
              </p>
            </div>

            {/* Server Logs */}
            <div className="rounded-xl border border-cyber-line/50 bg-cyber-panel/40 p-4 space-y-3">
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">Server Logs</h3>
              <div className="h-40 overflow-y-auto scrollbar-thin bg-black/60 rounded border border-cyber-line/30 p-3 font-mono text-[10px] text-slate-300 space-y-1 select-text">
                {sshServerLogs.length === 0 ? (
                  <div className="text-slate-500 italic">No logs yet.</div>
                ) : (
                  sshServerLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed break-all">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
