import { tFeedback as trFeedback, t as tr, useLocale } from '../i18n';
import { useEffect, useMemo, useState } from 'react';
import {
  dashboardTestMonitor,
  dashboardUpsertMonitor,
  pickFile,
  type MonitorConfig,
  type MonitorLogSource,
  type MonitorSecrets,
  type MonitorSshHop,
} from '../lib/tauri';

interface MonitorEditorModalProps {
  open: boolean;
  monitor: MonitorConfig | null;
  onClose: () => void;
  onSaved: (monitor: MonitorConfig) => void;
}

const emptyHop = (): MonitorSshHop => ({
  host: '',
  sshPort: 22,
  user: '',
  authMode: 'password',
  keyPath: '',
  hasSecret: false,
});

const emptySource = (): MonitorLogSource => ({ kind: 'auto' });

const emptyMonitor = (): MonitorConfig => ({
  id: crypto.randomUUID(),
  label: '',
  servicePort: 8080,
  targetType: 'local',
  target: null,
  jump: null,
  targetOs: 'auto',
  logSource: emptySource(),
  legacyImported: false,
});

function SecretField({
  label,
  value,
  configured,
  required = true,
  onChange,
}: {
  label: string;
  value: string;
  configured: boolean;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1">
      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
        {label} {configured && <span className="text-green-400">{tr("· saved in vault")}</span>}
      </span>
      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={configured ? tr("Leave blank to keep saved secret") : required ? tr("Required") : tr("Optional")}
        autoComplete="new-password"
        className="w-full rounded border border-cyber-line/50 bg-cyber-base px-2.5 py-2 text-[11px] text-slate-100 outline-none focus:border-cyber-electric"
      />
    </label>
  );
}

function HopFields({
  title,
  value,
  secret,
  onChange,
  onSecretChange,
}: {
  title: string;
  value: MonitorSshHop;
  secret: string;
  onChange: (value: MonitorSshHop) => void;
  onSecretChange: (value: string) => void;
}) {
  const update = <K extends keyof MonitorSshHop>(key: K, next: MonitorSshHop[K]) =>
    onChange({ ...value, [key]: next });

  const browseKey = async () => {
    const path = await pickFile();
    if (path) update('keyPath', path);
  };

  return (
    <fieldset className="rounded-lg border border-cyber-line/40 bg-black/10 p-3 space-y-3">
      <legend className="px-1 text-[9px] font-black uppercase tracking-[0.14em] text-cyan-400">{title}</legend>
      <div className="grid grid-cols-[1fr_88px] gap-2">
        <label className="space-y-1">
          <span className="text-[9px] uppercase text-slate-500">{tr("Host")}</span>
          <input value={value.host} onChange={(e) => update('host', e.target.value)} placeholder="192.168.1.7" className="w-full rounded border border-cyber-line/50 bg-cyber-base px-2.5 py-2 text-[11px] outline-none focus:border-cyber-electric" />
        </label>
        <label className="space-y-1">
          <span className="text-[9px] uppercase text-slate-500">{tr("SSH port")}</span>
          <input type="number" min={1} max={65535} value={value.sshPort} onChange={(e) => update('sshPort', Number(e.target.value))} className="w-full rounded border border-cyber-line/50 bg-cyber-base px-2.5 py-2 text-[11px] outline-none focus:border-cyber-electric" />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="space-y-1">
          <span className="text-[9px] uppercase text-slate-500">{tr("User")}</span>
          <input value={value.user} onChange={(e) => update('user', e.target.value)} placeholder="bang" className="w-full rounded border border-cyber-line/50 bg-cyber-base px-2.5 py-2 text-[11px] outline-none focus:border-cyber-electric" />
        </label>
        <label className="space-y-1">
          <span className="text-[9px] uppercase text-slate-500">{tr("Authentication")}</span>
          <select value={value.authMode} onChange={(e) => update('authMode', e.target.value as 'password' | 'key')} className="w-full rounded border border-cyber-line/50 bg-cyber-base px-2.5 py-2 text-[11px] outline-none focus:border-cyber-electric">
            <option value="password">{tr("Password")}</option>
            <option value="key">{tr("Private key")}</option>
          </select>
        </label>
      </div>
      {value.authMode === 'key' && (
        <label className="space-y-1">
          <span className="text-[9px] uppercase text-slate-500">{tr("Private key path")}</span>
          <div className="flex gap-2">
            <input value={value.keyPath || ''} onChange={(e) => update('keyPath', e.target.value)} className="flex-1 rounded border border-cyber-line/50 bg-cyber-base px-2.5 py-2 text-[11px] outline-none focus:border-cyber-electric" />
            <button type="button" onClick={browseKey} className="rounded border border-cyber-line px-3 text-[9px] font-bold uppercase text-slate-300 hover:border-cyber-electric">{tr("Browse")}</button>
          </div>
        </label>
      )}
      <SecretField
        label={value.authMode === 'password' ? tr("Password") : tr("Key passphrase (optional)")}
        value={secret}
        configured={value.hasSecret}
        required={value.authMode === 'password'}
        onChange={onSecretChange}
      />
    </fieldset>
  );
}

function LogSourceFields({ source, onChange }: { source: MonitorLogSource; onChange: (source: MonitorLogSource) => void }) {
  const update = <K extends keyof MonitorLogSource>(key: K, value: MonitorLogSource[K]) => onChange({ ...source, [key]: value });
  return (
    <fieldset className="rounded-lg border border-cyber-line/40 bg-black/10 p-3 space-y-2">
      <legend className="px-1 text-[9px] font-black uppercase tracking-[0.14em] text-amber-400">{tr("Log source")}</legend>
      <select value={source.kind} onChange={(e) => onChange({ kind: e.target.value as MonitorLogSource['kind'] })} className="w-full rounded border border-cyber-line/50 bg-cyber-base px-2.5 py-2 text-[11px] outline-none focus:border-cyber-electric">
        <option value="auto">{tr("Automatic discovery")}</option>
        <option value="file">{tr("File path")}</option>
        <option value="systemd">{tr("systemd unit")}</option>
        <option value="container">Docker / Podman</option>
        <option value="windowsEvent">{tr("Windows Event Log")}</option>
        <option value="custom">{tr("Expert custom follow command")}</option>
      </select>
      {source.kind === 'file' && <input value={source.path || ''} onChange={(e) => update('path', e.target.value)} placeholder={tr("Absolute log path")} className="w-full rounded border border-cyber-line/50 bg-cyber-base px-2.5 py-2 text-[11px] outline-none focus:border-cyber-electric" />}
      {source.kind === 'systemd' && <input value={source.unit || ''} onChange={(e) => update('unit', e.target.value)} placeholder="api.service" className="w-full rounded border border-cyber-line/50 bg-cyber-base px-2.5 py-2 text-[11px] outline-none focus:border-cyber-electric" />}
      {source.kind === 'container' && (
        <div className="grid grid-cols-[120px_1fr] gap-2">
          <select value={source.engine || 'docker'} onChange={(e) => update('engine', e.target.value as 'docker' | 'podman')} className="rounded border border-cyber-line/50 bg-cyber-base px-2.5 py-2 text-[11px] outline-none focus:border-cyber-electric"><option value="docker">Docker</option><option value="podman">Podman</option></select>
          <input value={source.container || ''} onChange={(e) => update('container', e.target.value)} placeholder={tr("Container name or ID")} className="rounded border border-cyber-line/50 bg-cyber-base px-2.5 py-2 text-[11px] outline-none focus:border-cyber-electric" />
        </div>
      )}
      {source.kind === 'windowsEvent' && (
        <div className="grid grid-cols-2 gap-2">
          <input value={source.logName || 'Application'} onChange={(e) => update('logName', e.target.value)} placeholder={tr("Application")} className="rounded border border-cyber-line/50 bg-cyber-base px-2.5 py-2 text-[11px] outline-none focus:border-cyber-electric" />
          <input value={source.provider || ''} onChange={(e) => update('provider', e.target.value)} placeholder={tr("Provider (optional)")} className="rounded border border-cyber-line/50 bg-cyber-base px-2.5 py-2 text-[11px] outline-none focus:border-cyber-electric" />
        </div>
      )}
      {source.kind === 'custom' && (
        <>
          <textarea value={source.command || ''} onChange={(e) => update('command', e.target.value)} rows={3} placeholder={tr("Command must print initial history and continue following")} className="w-full resize-y rounded border border-amber-500/30 bg-cyber-base px-2.5 py-2 font-mono text-[10px] outline-none focus:border-amber-400" />
          <p className="text-[9px] text-amber-400/80">{tr("Expert mode executes this command verbatim only when the log drawer is opened.")}</p>
        </>
      )}
    </fieldset>
  );
}

export function MonitorEditorModal({ open, monitor, onClose, onSaved }: MonitorEditorModalProps) {
  const locale = useLocale();
  const [draft, setDraft] = useState<MonitorConfig>(emptyMonitor);
  const [targetSecret, setTargetSecret] = useState('');
  const [jumpSecret, setJumpSecret] = useState('');
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error' | 'warn'; text: string; targetOs?: string; unverifiedSsh?: boolean } | null>(null);

  useEffect(() => {
    if (!open) return;
    setDraft(monitor ? structuredClone(monitor) : emptyMonitor());
    setTargetSecret('');
    setJumpSecret('');
    setMessage(null);
  }, [open, monitor]);

  const secrets = useMemo<MonitorSecrets>(() => ({
    targetSecret: targetSecret || undefined,
    jumpSecret: jumpSecret || undefined,
  }), [targetSecret, jumpSecret]);

  if (!open) return null;

  const ensureSsh = () => setDraft((current) => ({ ...current, targetType: 'ssh', target: current.target || emptyHop() }));
  const testConnection = async () => {
    setTesting(true);
    setMessage(null);
    try {
      const result = await dashboardTestMonitor(draft, secrets);
      setMessage({ type: 'ok', text: result.message, targetOs: result.targetOs, unverifiedSsh: result.unverifiedSsh });
    } catch (error) {
      setMessage({ type: 'error', text: String(error) });
    } finally {
      setTesting(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const result = await dashboardUpsertMonitor(draft, secrets);
      onSaved(result.monitor);
      if (!result.vaultPersistent && draft.targetType === 'ssh' && (targetSecret || jumpSecret)) {
        setDraft(result.monitor);
        setTargetSecret('');
        setJumpSecret('');
        setMessage({ type: 'warn', text: 'OS credential vault is unavailable. Secrets are session-only and will be requested after restart.' });
      } else {
        onClose();
      }
    } catch (error) {
      setMessage({ type: 'error', text: String(error) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-cyber-line bg-cyber-panel shadow-2xl">
        <header className="flex items-center justify-between border-b border-cyber-line/50 px-5 py-3">
          <div><h2 className="font-display text-sm font-black uppercase tracking-[0.14em] text-cyber-electric">{monitor ? tr("Edit monitor") : tr("Add monitor")}</h2><p className="mt-0.5 text-[9px] text-slate-500">{tr("TCP · local, direct SSH, or one jump host")}</p></div>
          <button type="button" onClick={onClose} className="text-lg text-slate-500 hover:text-white">×</button>
        </header>
        <div className="flex-1 space-y-4 overflow-y-auto p-5 text-slate-200">
          {message && <div className={`rounded border px-3 py-2 text-[10px] ${message.type === 'ok' ? 'border-green-500/40 bg-green-500/10 text-green-300' : message.type === 'warn' ? 'border-amber-500/40 bg-amber-500/10 text-amber-300' : 'border-red-500/40 bg-red-500/10 text-red-300'}`}>{trFeedback(message.text)}{message.targetOs && ` · ${message.targetOs}`}{message.unverifiedSsh && <>{' · '}{tr('Host key unverified')}</>}</div>}
          <div className="grid grid-cols-[1fr_110px] gap-3">
            <label className="space-y-1"><span className="text-[9px] uppercase text-slate-500">{tr("Name")}</span><input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder={tr("API staging")} className="w-full rounded border border-cyber-line/50 bg-cyber-base px-2.5 py-2 text-[11px] outline-none focus:border-cyber-electric" /></label>
            <label className="space-y-1"><span className="text-[9px] uppercase text-slate-500">{tr("TCP port")}</span><input type="number" min={1} max={65535} value={draft.servicePort} onChange={(e) => setDraft({ ...draft, servicePort: Number(e.target.value) })} className="w-full rounded border border-cyber-line/50 bg-cyber-base px-2.5 py-2 text-[11px] outline-none focus:border-cyber-electric" /></label>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-cyber-line/40 bg-cyber-base/40 p-1">
            <button type="button" onClick={() => setDraft({ ...draft, targetType: 'local', target: null, jump: null })} className={`rounded py-2 text-[10px] font-bold uppercase ${draft.targetType === 'local' ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-500'}`}>{tr("Local machine")}</button>
            <button type="button" onClick={ensureSsh} className={`rounded py-2 text-[10px] font-bold uppercase ${draft.targetType === 'ssh' ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-500'}`}>{tr("SSH target")}</button>
          </div>
          {draft.targetType === 'ssh' && draft.target && (
            <>
              <div className="rounded border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[9px] text-amber-300">{tr("SSH host-key verification is OFF for this feature. Target and jump routes are unverified.")}</div>
              <label className="space-y-1"><span className="text-[9px] uppercase text-slate-500">{tr("Target OS")}</span><select value={draft.targetOs} onChange={(e) => setDraft({ ...draft, targetOs: e.target.value as MonitorConfig['targetOs'] })} className="w-full rounded border border-cyber-line/50 bg-cyber-base px-2.5 py-2 text-[11px] outline-none"><option value="auto">{tr("Auto detect")}</option><option value="linux">Linux / Ubuntu / Red Hat</option><option value="windows">Windows OpenSSH</option></select></label>
              <HopFields title={tr("Final target")} value={draft.target} secret={targetSecret} onSecretChange={setTargetSecret} onChange={(target) => setDraft({ ...draft, target })} />
              <label className="flex items-center gap-2 text-[10px] text-slate-400"><input type="checkbox" checked={!!draft.jump} onChange={(e) => setDraft({ ...draft, jump: e.target.checked ? emptyHop() : null })} />{tr(" Connect through one jump host")}</label>
              {draft.jump && <HopFields title={tr("Jump host")} value={draft.jump} secret={jumpSecret} onSecretChange={setJumpSecret} onChange={(jump) => setDraft({ ...draft, jump })} />}
            </>
          )}
          <LogSourceFields source={draft.logSource} onChange={(logSource) => setDraft({ ...draft, logSource })} />
        </div>
        <footer className="flex items-center justify-end gap-2 border-t border-cyber-line/50 px-5 py-3">
          <button type="button" onClick={testConnection} disabled={testing || saving} className="rounded border border-cyan-500/40 px-3 py-1.5 text-[9px] font-bold uppercase text-cyan-300 disabled:opacity-50">{testing ? tr("Testing…") : tr("Test connection")}</button>
          <button type="button" onClick={onClose} className="rounded border border-cyber-line px-3 py-1.5 text-[9px] font-bold uppercase text-slate-400">{tr("Cancel")}</button>
          <button type="button" onClick={save} disabled={saving || testing} className="rounded border border-cyber-electric/50 bg-cyber-electric/10 px-4 py-1.5 text-[9px] font-black uppercase text-cyber-electric disabled:opacity-50">{saving ? tr("Saving…") : tr("Save monitor")}</button>
        </footer>
      </div>
    </div>
  );
}
