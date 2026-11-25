import { t as tr } from '../i18n';
import type { ProxyHop } from '../types';
import { getWebRoute, probeWebBrowserFingerprint, type WebBrowserConfig } from '../lib/webBrowser';
import { ProxyHopEditor } from './ProxyHopEditor';

export function WebProxyChainEditor({ config, onChange }: { config: WebBrowserConfig; onChange: (route: ProxyHop[]) => void }) {
  const route = getWebRoute(config);
  const move = (index: number, step: number) => {
    const next = [...route]; [next[index], next[index + step]] = [next[index + step], next[index]]; onChange(next);
  };
  return <div className="space-y-3" data-web-chain>
    <p className="text-xs text-slate-400">{tr('Connections follow the order below. Intermediate HTTP proxies must allow CONNECT to the next hop.')}</p>
    {(route.length ? route : [undefined]).map((hop, index) => <div key={index} data-web-chain-hop={index} className="space-y-1">
      {route.length > 1 && <div className="flex justify-end gap-2 text-xs text-slate-400">
        <button type="button" data-web-hop-up={index} disabled={index === 0} onClick={() => move(index, -1)} className="rounded border border-cyber-line px-2 disabled:opacity-30" aria-label={tr('Move proxy hop up')}>↑</button>
        <button type="button" data-web-hop-down={index} disabled={index === route.length - 1} onClick={() => move(index, 1)} className="rounded border border-cyber-line px-2 disabled:opacity-30" aria-label={tr('Move proxy hop down')}>↓</button>
        <button type="button" data-web-hop-remove={index} onClick={() => onChange(route.filter((_, position) => position !== index))} className="rounded border border-cyber-line px-2 text-rose-300">{tr('Remove hop')}</button>
      </div>}
      <ProxyHopEditor value={hop} idPrefix={index === 0 ? 'web-hop' : `web-hop-${index}`} legend={route.length > 1 ? tr('Hop {number}', { number: index + 1 }) : tr('Web connection')}
        credentialNote={tr('Saved passwords and key passphrases are protected for your Windows account.')}
        onChange={value => onChange(value ? route.length ? route.map((hop, position) => position === index ? value : hop) : [value] : route.filter((_, position) => position !== index))}
        fingerprintContextKey={JSON.stringify(route.slice(0, index))}
        probeFingerprint={index ? (host, port) => probeWebBrowserFingerprint(route.slice(0, index), host, port) : undefined} />
    </div>)}
    <button type="button" data-web-chain-add disabled={route.length >= 8} onClick={() => onChange([...route, { kind: 'http', host: '', port: 9090, username: '', secret: '', authMode: 'password', keyPath: '', hostKey: '' }])}
      className="rounded border border-cyber-electric/50 px-3 py-1.5 text-xs text-cyber-electric disabled:opacity-30">{tr('Add proxy hop')}</button>
  </div>;
}
