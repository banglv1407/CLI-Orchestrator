import { useState, useEffect, useRef } from 'react';
import type { SshConnection } from '../types';
import { pickFile } from '../lib/tauri';

interface SshConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  connection: SshConnection | null; // null if adding new
  existingGroups: string[];
  onSave: (connection: SshConnection) => void;
}

export function SshConnectionModal({
  isOpen,
  onClose,
  connection,
  existingGroups,
  onSave,
}: SshConnectionModalProps) {
  const [protocol, setProtocol] = useState<'ssh' | 'rdp'>('ssh');
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState(22);
  const [user, setUser] = useState('');
  const [authMode, setAuthMode] = useState<'password' | 'key'>('password');
  const [keyPath, setKeyPath] = useState('');
  const [password, setPassword] = useState('');
  const [group, setGroup] = useState('Default');
  const [newGroupInput, setNewGroupInput] = useState('');
  const [showNewGroupInput, setShowNewGroupInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // RDP specific states
  const [rdpResolution, setRdpResolution] = useState<'fullscreen' | '1080p' | '720p' | 'custom'>('1080p');
  const [rdpShareClipboard, setRdpShareClipboard] = useState(true);
  const [rdpShareDrives, setRdpShareDrives] = useState(false);

  // Track if port has been modified by user to avoid overriding it
  const isPortEdited = useRef(false);

  // Sync state with connection when modal opens
  useEffect(() => {
    if (isOpen) {
      isPortEdited.current = !!connection;
      if (connection) {
        setProtocol(connection.protocol || 'ssh');
        setName(connection.name);
        setHost(connection.host);
        setPort(connection.port);
        setUser(connection.user);
        setAuthMode(connection.authMode || 'password');
        setKeyPath(connection.keyPath || '');
        setPassword(connection.password || '');
        setGroup(connection.group || 'Default');
        setRdpResolution(connection.rdpResolution || '1080p');
        setRdpShareClipboard(connection.rdpShareClipboard !== false);
        setRdpShareDrives(!!connection.rdpShareDrives);
        setShowNewGroupInput(false);
        setNewGroupInput('');
      } else {
        setProtocol('ssh');
        setName('');
        setHost('');
        setPort(22);
        setUser('');
        setAuthMode('password');
        setKeyPath('');
        setPassword('');
        setGroup(existingGroups[0] || 'Default');
        setRdpResolution('1080p');
        setRdpShareClipboard(true);
        setRdpShareDrives(false);
        setShowNewGroupInput(false);
        setNewGroupInput('');
      }
      setErrorMsg(null);
    }
  }, [isOpen, connection, existingGroups]);

  // Auto update port default if user switches protocol and has NOT custom edited it
  const handleProtocolChange = (nextProto: 'ssh' | 'rdp') => {
    setProtocol(nextProto);
    if (!isPortEdited.current) {
      setPort(nextProto === 'ssh' ? 22 : 3389);
    }
  };

  if (!isOpen) return null;

  const handleBrowseKey = async () => {
    try {
      const path = await pickFile();
      if (path) {
        setKeyPath(path);
      }
    } catch (e) {
      console.error('Failed to pick private key file:', e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    const trimmedHost = host.trim();
    const trimmedUser = user.trim();

    if (!trimmedName || !trimmedHost || !trimmedUser) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (protocol === 'ssh' && authMode === 'key' && !keyPath.trim()) {
      setErrorMsg('Please specify a private key path.');
      return;
    }

    const finalGroup = showNewGroupInput ? newGroupInput.trim() : group;
    if (!finalGroup) {
      setErrorMsg('Please select or specify a group.');
      return;
    }

    onSave({
      id: connection ? connection.id : crypto.randomUUID(),
      name: trimmedName,
      protocol,
      host: trimmedHost,
      port,
      user: trimmedUser,
      authMode: protocol === 'ssh' ? authMode : undefined,
      keyPath: protocol === 'ssh' && authMode === 'key' ? keyPath.trim() : undefined,
      password: (protocol === 'rdp' || authMode === 'password') ? password : undefined,
      group: finalGroup,
      rdpResolution: protocol === 'rdp' ? rdpResolution : undefined,
      rdpShareClipboard: protocol === 'rdp' ? rdpShareClipboard : undefined,
      rdpShareDrives: protocol === 'rdp' ? rdpShareDrives : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg rounded-2xl border border-cyber-line bg-cyber-panel/90 p-6 shadow-neon-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-4 flex items-center justify-between border-b border-cyber-line pb-3">
          <h2 className="font-display text-base font-bold uppercase tracking-[0.15em] text-cyber-electric">
            {connection ? 'Edit VM Connection' : 'Add VM Connection'}
          </h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition text-lg"
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="rounded border border-rose-500/50 bg-rose-950/30 p-2.5 text-rose-300 font-medium">
              ⚠ {errorMsg}
            </div>
          )}

          {/* Protocol Toggle (SSH / RDP) */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Protocol / Giao thức
            </label>
            <div className="flex rounded-lg bg-cyber-base/60 p-1 border border-cyber-line/50">
              <button
                type="button"
                onClick={() => handleProtocolChange('ssh')}
                className={`flex-1 rounded-md py-1.5 font-bold uppercase tracking-wider transition-all ${
                  protocol === 'ssh'
                    ? 'text-cyber-neon bg-cyber-neon/10 shadow-neon-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📟 SSH (Terminal)
              </button>
              <button
                type="button"
                onClick={() => handleProtocolChange('rdp')}
                className={`flex-1 rounded-md py-1.5 font-bold uppercase tracking-wider transition-all ${
                  protocol === 'rdp'
                    ? 'text-cyber-electric bg-cyber-electric/10 shadow-neon-blue-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                💻 RDP (Remote Desktop)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Connection Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AWS Staging"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyber-electric"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Group / Category *
              </label>
              {showNewGroupInput ? (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    required
                    placeholder="New Group Name"
                    value={newGroupInput}
                    onChange={(e) => setNewGroupInput(e.target.value)}
                    className="flex-1 rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyber-electric"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewGroupInput(false)}
                    className="rounded border border-cyber-line px-2 text-slate-300 hover:text-white"
                  >
                    Select
                  </button>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="flex-1 rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-100 outline-none transition focus:border-cyber-electric font-semibold"
                  >
                    {existingGroups.length === 0 ? (
                      <option value="Default">Default</option>
                    ) : (
                      existingGroups.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))
                    )}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewGroupInput(true)}
                    className="rounded border border-cyber-electric/40 px-2 py-0.5 text-cyber-electric hover:bg-cyber-electric/10 transition"
                  >
                    + New
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Host / IP Address *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 192.168.1.100 or example.com"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyber-electric"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Port *
              </label>
              <input
                type="number"
                required
                value={port}
                onChange={(e) => {
                  isPortEdited.current = true;
                  setPort(parseInt(e.target.value, 10) || (protocol === 'ssh' ? 22 : 3389));
                }}
                className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-100 outline-none transition focus:border-cyber-electric"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Username *
            </label>
            <input
              type="text"
              required
              placeholder={protocol === 'ssh' ? 'e.g. root or ubuntu' : 'e.g. Administrator'}
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyber-electric"
            />
          </div>

          {/* Protocol SSH specific options */}
          {protocol === 'ssh' && (
            <>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Authentication Method
                </label>
                <div className="flex rounded-lg bg-cyber-base/60 p-1 border border-cyber-line/50">
                  <button
                    type="button"
                    onClick={() => setAuthMode('password')}
                    className={`flex-1 rounded-md py-1.5 font-bold uppercase tracking-wider transition-all ${
                      authMode === 'password'
                        ? 'text-cyber-electric bg-cyber-electric/10 shadow-neon-blue-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('key')}
                    className={`flex-1 rounded-md py-1.5 font-bold uppercase tracking-wider transition-all ${
                      authMode === 'key'
                        ? 'text-cyber-electric bg-cyber-electric/10 shadow-neon-blue-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Private Key
                  </button>
                </div>
              </div>

              {authMode === 'password' ? (
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Password (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password for VM"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded border border-cyber-line bg-cyber-base pl-3 pr-10 py-2 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyber-electric"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white transition"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Private Key Path *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. C:\Users\july1\.ssh\id_rsa"
                      value={keyPath}
                      onChange={(e) => setKeyPath(e.target.value)}
                      className="flex-1 rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyber-electric font-mono text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={handleBrowseKey}
                      className="rounded border border-cyber-electric bg-cyber-electric/15 px-3 py-2 font-bold uppercase tracking-wider text-cyber-electric transition hover:bg-cyber-electric/25"
                    >
                      Browse
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Protocol RDP specific options */}
          {protocol === 'rdp' && (
            <>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Password (Optional)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Saved login password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded border border-cyber-line bg-cyber-base pl-3 pr-10 py-2 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyber-electric"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white transition"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    RDP Resolution
                  </label>
                  <select
                    value={rdpResolution}
                    onChange={(e) => setRdpResolution(e.target.value as any)}
                    className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-slate-100 outline-none transition focus:border-cyber-electric font-semibold"
                  >
                    <option value="fullscreen">🖥 Fullscreen</option>
                    <option value="1080p">📺 1080p (1920x1080)</option>
                    <option value="720p">📺 720p (1280x720)</option>
                    <option value="custom">📺 Custom Default</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 pt-2 justify-center select-none">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="rdp-clipboard"
                      checked={rdpShareClipboard}
                      onChange={(e) => setRdpShareClipboard(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-cyber-line bg-cyber-base text-cyber-electric outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="rdp-clipboard" className="font-semibold text-slate-300 cursor-pointer text-[10px] uppercase">
                      Share Clipboard
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="rdp-drives"
                      checked={rdpShareDrives}
                      onChange={(e) => setRdpShareDrives(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-cyber-line bg-cyber-base text-cyber-electric outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="rdp-drives" className="font-semibold text-slate-300 cursor-pointer text-[10px] uppercase">
                      Share Local Drives
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          <footer className="flex justify-end gap-3 pt-3 border-t border-cyber-line">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-cyber-line px-4 py-2 font-bold uppercase tracking-wider text-slate-300 hover:bg-cyber-line/20 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded border border-cyber-electric bg-cyber-electric/15 px-5 py-2 font-bold uppercase tracking-wider text-cyber-electric hover:bg-cyber-electric/25 transition shadow-neon-blue-sm"
            >
              Save Connection
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
