import { t as tr } from '../i18n';
import type { ProxyHop } from '../types';

export function ProxyHopEditor({ value, onChange }: { value?: ProxyHop; onChange: (value?: ProxyHop) => void }) {
  const input = 'w-full bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200';
  const change = (fields: Partial<ProxyHop>) => value && onChange({ ...value, ...fields });
  return (
    <fieldset className="border border-cyber-line rounded p-3 space-y-3">
      <legend className="text-xs text-cyber-neon px-1">{tr("Outbound hop")}</legend>
      <label className="block text-xs text-slate-400">{tr("Connection")}<select className={input} value={value?.kind || 'direct'} onChange={e => {
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
          <label className="text-xs text-slate-400">{tr("Host")}<input className={input} value={value.host} placeholder="proxy.example.com" onChange={e => change({ host: e.target.value })} />
          </label>
          <label className="text-xs text-slate-400">{tr("Port")}<input className={input} type="number" min={1} max={65535} value={value.port} onChange={e => change({ port: Number(e.target.value) })} />
          </label>
        </div>
        {value.kind !== 'socks4' && <>
          <label className="block text-xs text-slate-400">{tr("Username ")}{value.kind !== 'ssh' && tr("(optional)")}
            <input className={input} autoComplete="off" value={value.username} onChange={e => change({ username: e.target.value })} />
          </label>
          {value.kind === 'ssh' && <>
            <label className="block text-xs text-slate-400">{tr("SSH authentication")}<select className={input} value={value.authMode} onChange={e => change({ authMode: e.target.value as 'password' | 'key', secret: '' })}>
                <option value="password">{tr("Password")}</option><option value="key">{tr("Private key")}</option>
              </select>
            </label>
            {value.authMode === 'key' && <label className="block text-xs text-slate-400">{tr("Private key path")}<input className={input} value={value.keyPath} onChange={e => change({ keyPath: e.target.value })} />
            </label>}
            <label className="block text-xs text-slate-400">{tr("Server fingerprint (SHA256)")}<input className={input} placeholder="SHA256:..." value={value.hostKey} onChange={e => change({ hostKey: e.target.value.trim() })} />
            </label>
            <p className="text-xs text-slate-400">{tr("Get the server fingerprint from your administrator.")}</p>
          </>}
          <label className="block text-xs text-slate-400">{value.kind === 'ssh' && value.authMode === 'key' ? tr("Key passphrase (optional)") : tr("Password")}
            <input className={input} type="password" autoComplete="new-password" value={value.secret} onChange={e => change({ secret: e.target.value })} />
          </label>
        </>}
        <p className="text-xs text-slate-400">{tr("Hop credentials are stored in the local proxy configuration alongside backend API keys.")}</p>
      </>}
    </fieldset>
  );
}
