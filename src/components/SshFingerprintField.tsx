import { useEffect, useId, useRef, useState } from 'react';
import { t as tr, tFeedback as trFeedback } from '../i18n';
import { getSshServerFingerprint, probeSshFingerprint } from '../lib/tauri';

interface Props {
  host?: string;
  port?: number;
  local?: boolean;
  value: string;
  onChange: (fingerprint: string) => void;
  probe?: (host: string, port: number) => Promise<string>;
}

export function SshFingerprintField({ host = '', port = 0, local = false, value, onChange, probe = probeSshFingerprint }: Props) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const request = useRef(0);
  const inFlight = useRef(false);
  const currentChange = useRef(onChange);
  currentChange.current = onChange;
  useEffect(() => () => { request.current++; }, []);
  useEffect(() => { setCopied(false); }, [value]);

  const canFetch = local || (!!host.trim() && Number.isInteger(port) && port > 0 && port <= 65535);
  const fetchFingerprint = async () => {
    if (inFlight.current || !canFetch) return;
    inFlight.current = true;
    const pending = ++request.current;
    setBusy(true);
    setError('');
    setCopied(false);
    try {
      const fingerprint = local
        ? await getSshServerFingerprint()
        : await probe(host.trim(), port);
      if (request.current === pending) currentChange.current(fingerprint);
    } catch (error) {
      if (request.current === pending) setError(trFeedback(error instanceof Error ? error.message : String(error)));
    } finally {
      if (request.current === pending) {
        inFlight.current = false;
        setBusy(false);
      }
    }
  };

  const copyFingerprint = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setError('');
    } catch {
      setError(tr("Cannot copy the SSH fingerprint."));
    }
  };

  return (
    <div className="space-y-2" data-ssh-fingerprint={local ? 'server' : 'remote'}>
      <label htmlFor={id} className="block text-xs text-slate-400">{tr("Server fingerprint (SHA256)")}</label>
      <input
        id={id}
        className="w-full min-w-0 bg-cyber-base border border-cyber-line rounded px-3 py-2 text-xs font-mono text-slate-200 select-text"
        placeholder="SHA256:..."
        value={value}
        readOnly={local || busy}
        onChange={event => onChange(event.target.value.trim())}
        aria-busy={busy}
        spellCheck={false}
        autoComplete="off"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={fetchFingerprint}
          disabled={busy || !canFetch}
          className="px-3 py-1.5 text-xs border border-cyber-neon/40 rounded text-cyber-neon hover:bg-cyber-neon/10 disabled:opacity-40 disabled:cursor-not-allowed"
        >{busy ? tr("Fetching fingerprint...") : tr("Get fingerprint")}</button>
        <button
          type="button"
          onClick={copyFingerprint}
          disabled={!value || busy}
          className="px-3 py-1.5 text-xs border border-cyber-line rounded text-slate-300 hover:bg-cyber-line/30 disabled:opacity-40 disabled:cursor-not-allowed"
        >{copied ? tr("Copied") : tr("Copy fingerprint")}</button>
      </div>
      <p className="text-xs text-slate-400">{local
        ? tr("Share this fingerprint with clients connecting to this SSH server.")
        : tr("Compare the fetched fingerprint with your administrator before saving.")}</p>
      {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
