import { t as tr, tFeedback as trFeedback } from '../i18n';
import { useRef, useState } from 'react';
import { pickFile } from '../lib/tauri';
import type { ProxyHop } from '../types';
import { SshFingerprintField } from './SshFingerprintField';

export function ProxyHopEditor({ value, onChange, idPrefix, credentialNote, legend, probeFingerprint, fingerprintContextKey }: { value?: ProxyHop; onChange: (value?: ProxyHop) => void; idPrefix?: string; credentialNote?: string; legend?: string; probeFingerprint?: (host: string, port: number) => Promise<string>; fingerprintContextKey?: string }) {
  const [keyError, setKeyError] = useState('');
  const [keyBusy, setKeyBusy] = useState(false);
  const current = useRef(value); current.current = value;
  const input = 'w-full bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200';
  const change = (fields: Partial<ProxyHop>) => value && onChange({ ...value, ...fields });
  const chooseKey = async () => {
    setKeyError(''); setKeyBusy(true);
    try { const path = await pickFile(); if (path && current.current?.kind === 'ssh' && current.current.authMode === 'key') onChange({ ...current.current, keyPath: path }); }
    catch (error) { setKeyError(String(error)); }
    finally { setKeyBusy(false); }
  };
  return (
    <fieldset className="border border-cyber-line rounded p-3 space-y-3">
      <legend className="text-xs text-cyber-neon px-1">{legend ?? tr("Outbound hop")}</legend>
      <label className="block text-xs text-slate-400">{tr("Connection")}<select id={idPrefix ? `${idPrefix}-kind` : undefined} className={input} value={value?.kind || 'direct'} onChange={e => {
          const kind = e.target.value as ProxyHop['kind'] | 'direct';
          onChange(kind === 'direct' ? undefined : {
            kind, host: '', port: kind === 'ssh' ? 22 : kind === 'https' ? 443 : kind === 'http' ? 8080 : 1080,
            username: '', secret: '', keyPath: '', authMode: 'password', hostKey: '',
          });
        }}>
          <option value="direct">{tr("Direct")}</option>
          <option value="http">{tr("HTTP proxy")}</option>
          <option value="https">{tr("HTTPS proxy (TLS to proxy)")}</option>
          <option value="socks4">{tr("SOCKS4 (no authentication)")}</option>
          <option value="socks5">{tr("SOCKS5 (remote DNS)")}</option>
          <option value="ssh">{tr("SSH tunnel")}</option>
        </select>
      </label>
      {value && <>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-slate-400">{tr("Connection host")}<input id={idPrefix ? `${idPrefix}-host` : undefined} className={input} value={value.host} placeholder="proxy.example.com" onChange={e => change({ host: e.target.value, ...(value.kind === 'ssh' ? { hostKey: '' } : {}) })} />
          </label>
          <label className="text-xs text-slate-400">{tr("Port")}<input id={idPrefix ? `${idPrefix}-port` : undefined} className={input} type="number" min={1} max={65535} value={value.port} onChange={e => change({ port: Number(e.target.value), ...(value.kind === 'ssh' ? { hostKey: '' } : {}) })} />
          </label>
        </div>
        {value.kind !== 'socks4' && <>
          <label className="block text-xs text-slate-400">{tr("Username ")}{value.kind !== 'ssh' && tr("(optional)")}
            <input id={idPrefix ? `${idPrefix}-username` : undefined} className={input} autoComplete="off" value={value.username} onChange={e => change({ username: e.target.value })} />
          </label>
          {value.kind === 'ssh' && <>
            <label className="block text-xs text-slate-400">{tr("SSH authentication")}<select id={idPrefix ? `${idPrefix}-auth` : undefined} className={input} value={value.authMode} onChange={e => change({ authMode: e.target.value as 'password' | 'key', secret: '' })}>
                <option value="password">{tr("Password")}</option><option value="key">{tr("Private key")}</option>
              </select>
            </label>
            {value.authMode === 'key' && <label className="block text-xs text-slate-400">{tr("Private key path")}<div className="flex gap-2"><input id={idPrefix ? `${idPrefix}-key-path` : undefined} className={`${input} min-w-0 flex-1`} value={value.keyPath} onChange={e => change({ keyPath: e.target.value })} /><button type="button" onClick={() => void chooseKey()} disabled={keyBusy} className="shrink-0 rounded border border-cyber-line px-3 py-2 text-xs text-slate-300 hover:border-cyber-neon disabled:opacity-40">{tr('Choose key file')}</button></div>
            </label>}
            <SshFingerprintField
              key={JSON.stringify([value.host, value.port, fingerprintContextKey])}
              host={value.host}
              port={value.port}
              value={value.hostKey}
              onChange={hostKey => change({ hostKey })}
              probe={probeFingerprint}
            />
          </>}
          <label className="block text-xs text-slate-400">{value.kind === 'ssh' && value.authMode === 'key' ? tr("Key passphrase (optional)") : tr("Password")}
            <input id={idPrefix ? `${idPrefix}-secret` : undefined} className={input} type="password" autoComplete="new-password" value={value.secret} onChange={e => change({ secret: e.target.value })} />
          </label>
        </>}
        <p className="text-xs text-slate-400">{credentialNote ?? tr("Hop credentials are stored in the local proxy configuration alongside backend API keys.")}</p>
        {keyError && <p role="alert" className="text-xs text-rose-300">{trFeedback(keyError)}</p>}
      </>}
    </fieldset>
  );
}
