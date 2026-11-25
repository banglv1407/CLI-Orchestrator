import { useEffect, useMemo, useRef, useState } from 'react';
import { t as tr } from '../i18n';
import type { SessionInfo } from '../types';
import { canLinkTerminal, layoutTerminalGraph, type GraphDirection, type TerminalLinks } from '../lib/terminalLinks';

interface Props {
  sessions: SessionInfo[];
  links: TerminalLinks;
  activeId: string | null;
  titleFor: (session: SessionInfo) => string;
  onSelect: (id: string, additive: boolean) => void;
  onLink: (child: string, parent: string | null) => void;
  onContextMenu: (event: React.MouseEvent, session: SessionInfo) => void;
}

export function TerminalGraph({ sessions, links, activeId, titleFor, onSelect, onLink, onContextMenu }: Props) {
  const [direction, setDirection] = useState<GraphDirection>(() => {
    try { return localStorage.getItem('clx-terminal-graph-direction') === 'vertical' ? 'vertical' : 'horizontal'; } catch { return 'horizontal'; }
  });
  const [expanded, setExpanded] = useState(true);
  const activeNode = useRef<HTMLButtonElement | null>(null);
  const graph = useMemo(() => layoutTerminalGraph(sessions.map(s => s.id), links, direction), [sessions, links, direction]);
  useEffect(() => {
    try { localStorage.setItem('clx-terminal-graph-direction', direction); } catch { /* Optional preference. */ }
  }, [direction]);
  useEffect(() => { activeNode.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }, [activeId, expanded, direction]);
  if (sessions.length < 2) return null;
  const parentId = activeId && sessions.some(s => s.id === links[activeId]) ? links[activeId] : '';
  return (
    <section data-terminal-graph={direction} className="shrink-0 border-t border-cyber-line/60 bg-cyber-base/80 text-slate-300">
      <div className="flex flex-wrap items-center gap-2 px-3 py-1.5 text-[11px]">
        <button type="button" data-terminal-graph-toggle aria-expanded={expanded} onClick={() => setExpanded(!expanded)} className="font-semibold text-cyber-electric hover:text-white">{expanded ? '▾ ' : '▸ '}{tr('Terminal links')}</button>
        {expanded && <>
          <label className="ml-auto flex items-center gap-1.5">
            <span>{tr('Parent terminal')}</span>
            <select data-terminal-graph-parent value={parentId} disabled={!activeId} onChange={e => activeId && onLink(activeId, e.target.value || null)} className="max-w-40 rounded border border-cyber-line bg-cyber-panel px-1 py-0.5">
              <option value="">{tr('No link')}</option>
              {sessions.filter(s => activeId && canLinkTerminal(links, activeId, s.id)).map(s => <option key={s.id} value={s.id}>{titleFor(s)}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-1.5">
            <span>{tr('Direction')}</span>
            <select data-terminal-graph-direction value={direction} onChange={e => setDirection(e.target.value as GraphDirection)} className="rounded border border-cyber-line bg-cyber-panel px-1 py-0.5">
              <option value="horizontal">{tr('Horizontal')}</option>
              <option value="vertical">{tr('Vertical')}</option>
            </select>
          </label>
        </>}
      </div>
      {expanded && <div className="max-h-48 overflow-auto scrollbar-thin" data-terminal-graph-canvas>
        <div className="relative" style={{ width: graph.width, height: graph.height }}>
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 text-cyber-electric/65" width={graph.width} height={graph.height}>
            {graph.edges.map(edge => <path key={edge.child} data-terminal-link-child={edge.child} data-terminal-link-parent={edge.parent} d={edge.path} fill="none" stroke="currentColor" strokeWidth="1.5" />)}
          </svg>
          {graph.nodes.map(node => {
            const session = sessions.find(s => s.id === node.id)!;
            const title = titleFor(session);
            return <button key={node.id} type="button" ref={node.id === activeId ? activeNode : undefined} data-terminal-graph-node={node.id} aria-pressed={node.id === activeId}
              onClick={e => onSelect(node.id, e.ctrlKey || e.metaKey)} onContextMenu={e => onContextMenu(e, session)} title={title}
              style={{ left: node.x, top: node.y, width: 168, height: 48 }}
              className={`absolute rounded-md border px-2 text-left transition focus-visible:ring-1 focus-visible:ring-cyber-electric ${node.id === activeId ? 'border-cyber-electric bg-cyber-panel text-cyber-electric' : 'border-cyber-line bg-cyber-panel text-slate-300 hover:border-cyber-electric/60'}`}>
              <span className="block truncate font-mono text-[11px] font-semibold">{title}</span>
              <span className="block truncate text-[10px] text-slate-400">{session.workingDir || session.cliName}</span>
            </button>;
          })}
        </div>
      </div>}
    </section>
  );
}
