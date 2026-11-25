import { t as tr } from '../i18n';
import { hideWebMiniPanel, type WebMiniPreferences, type WebMiniTab } from '../lib/webMini';

export function WebMiniPlacementControl({ value, onChange }: { value: WebMiniPreferences; onChange: (value: WebMiniPreferences) => void }) {
  return <select data-web-mini-placement aria-label={tr('Mini web panels')} value={value.placement} onChange={event => onChange({ ...value, placement: event.target.value as WebMiniPreferences['placement'] })}
    className="h-8 max-w-[160px] rounded border border-cyber-line bg-cyber-base px-2 text-xs text-slate-300">
    <option value="hidden">{tr('Mini web: hidden')}</option><option value="right">{tr('Mini web: right')}</option><option value="bottom">{tr('Mini web: bottom')}</option><option value="both">{tr('Mini web: both')}</option>
  </select>;
}

export function WebMiniPanel({ panel, tabs, preferences, onPreferences, onActivate, onClose, onAdd }: {
  panel: 'right' | 'bottom'; tabs: WebMiniTab[]; preferences: WebMiniPreferences;
  onPreferences: (preferences: WebMiniPreferences) => void; onActivate: (id: string) => void; onClose: (id: string) => void; onAdd: () => void;
}) {
  const compact = preferences.display === 'title-only';
  return <aside data-mini-web-panel={panel} aria-label={panel === 'right' ? tr('Web tabs on the right') : tr('Web tabs at the bottom')}
    onContextMenu={event => event.stopPropagation()}
    className={panel === 'right' ? 'flex h-full w-[200px] shrink-0 flex-col border-l border-cyber-electric/30 bg-cyber-base/60 p-2' : 'flex shrink-0 flex-col border-t border-cyber-electric/30 bg-cyber-base/60 px-3 py-2'}
    style={panel === 'bottom' ? { height: compact ? 82 : 176 } : undefined}>
    <div className="mb-2 flex shrink-0 items-center gap-1 text-[10px] text-cyber-electric">
      <span className="min-w-0 flex-1 truncate font-semibold">{tr('Mini web')}</span>
      <select data-web-mini-display aria-label={tr('Web preview display')} value={preferences.display} onChange={event => onPreferences({ ...preferences, display: event.target.value as WebMiniPreferences['display'] })} className="min-w-0 rounded border border-cyber-line bg-cyber-base p-1 text-[10px] text-slate-300">
        <option value="preview">{tr('Preview')}</option><option value="title-only">{tr('Title only')}</option>
      </select>
      <button type="button" onClick={onAdd} aria-label={tr('New web tab')} title={tr('New web tab')} className="rounded px-1 hover:bg-white/10">+</button>
      <button type="button" data-web-mini-hide={panel} onClick={() => onPreferences({ ...preferences, placement: hideWebMiniPanel(preferences.placement, panel) })} aria-label={tr('Hide web panel')} title={tr('Hide web panel')} className="rounded px-1 text-slate-400 hover:bg-white/10">×</button>
    </div>
    <div className={panel === 'right' ? 'flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto' : 'flex min-h-0 flex-1 gap-2 overflow-x-auto overflow-y-hidden'}>
      {tabs.map(tab => <div key={tab.id} data-mini-web-card={tab.id} className={`relative shrink-0 overflow-hidden rounded border ${tab.active ? 'border-cyber-electric bg-cyber-electric/10' : 'border-cyber-line bg-cyber-panel/60 hover:border-cyber-electric/60'}`} style={panel === 'bottom' ? { width: compact ? 220 : 192 } : undefined}>
        <button type="button" data-mini-web-tab={tab.id} onClick={() => onActivate(tab.id)} aria-current={tab.active ? 'page' : undefined} aria-label={tr('Open web tab: {title}', { title: tab.title || tr('New tab') })} title={tab.url || tab.title}
          className="flex h-full w-full flex-col text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyber-electric">
          <span className="block w-full truncate py-1.5 pl-2 pr-7 text-[11px] text-slate-200">{tab.loading ? '◌ ' : tab.error ? '! ' : ''}{tab.title || tr('New tab')}</span>
          {!compact && <><span className="flex h-[78px] w-full items-center justify-center overflow-hidden border-y border-cyber-line/50 bg-cyber-base">
            {tab.preview ? <img data-web-mini-preview src={tab.preview} alt="" className="h-full w-full object-contain object-top" /> : <span aria-hidden="true" className="text-2xl text-cyber-electric/40">◎</span>}
          </span><span className="block w-full truncate px-2 py-1 text-[9px] text-slate-500">{tab.url || tr('New tab')}</span></>}
        </button>
        <button type="button" data-mini-web-close={tab.id} onClick={() => onClose(tab.id)} aria-label={tr('Close web tab')} title={tr('Close web tab')} className="absolute right-1 top-1 rounded px-1 text-xs text-slate-500 hover:bg-rose-400/10 hover:text-rose-300">×</button>
      </div>)}
    </div>
  </aside>;
}
