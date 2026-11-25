export type TerminalLinks = Record<string, string>;
export type GraphDirection = 'horizontal' | 'vertical';
const STORAGE_KEY = 'clx-terminal-links';

export function canLinkTerminal(links: TerminalLinks, child: string, parent: string): boolean {
  const seen = new Set([child]);
  let id: string | undefined = parent;
  while (id) {
    if (seen.has(id)) return false;
    seen.add(id);
    id = links[id];
  }
  return true;
}

export function readTerminalLinks(): TerminalLinks {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    const links: TerminalLinks = Object.create(null);
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      for (const [child, parent] of Object.entries(raw).slice(-500)) {
        if (typeof parent === 'string' && child && parent && canLinkTerminal(links, child, parent)) links[child] = parent;
      }
    }
    return links;
  } catch { return {}; }
}

export function saveTerminalLinks(links: TerminalLinks): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(Object.entries(links).slice(-500)))); } catch { /* Usable without storage. */ }
}

// A forest: each terminal has at most one parent. Missing parents become roots.
export function layoutTerminalGraph(ids: readonly string[], links: TerminalLinks, direction: GraphDirection) {
  const live = new Set(ids);
  const parents: TerminalLinks = Object.create(null);
  for (const id of ids) {
    const parent = links[id];
    if (live.has(parent) && canLinkTerminal(parents, id, parent)) parents[id] = parent;
  }
  const children = new Map(ids.map(id => [id, [] as string[]]));
  for (const id of ids) if (parents[id]) children.get(parents[id])!.push(id);
  const positions = new Map<string, { depth: number; slot: number }>();
  let slot = 0;
  for (const root of ids.filter(id => !parents[id])) {
    const stack: Array<{ id: string; depth: number; visited: boolean }> = [{ id: root, depth: 0, visited: false }];
    while (stack.length) {
      const item = stack.pop()!;
      const descendants = children.get(item.id)!;
      if (!item.visited && descendants.length) {
        stack.push({ ...item, visited: true });
        for (const id of [...descendants].reverse()) stack.push({ id, depth: item.depth + 1, visited: false });
      } else {
        const center = descendants.length
          ? (positions.get(descendants[0])!.slot + positions.get(descendants[descendants.length - 1])!.slot) / 2
          : slot++;
        positions.set(item.id, { depth: item.depth, slot: center });
      }
    }
  }
  const nodes = ids.map(id => {
    const pos = positions.get(id)!;
    return { id, x: 12 + (direction === 'horizontal' ? pos.depth * 212 : pos.slot * 190), y: 12 + (direction === 'horizontal' ? pos.slot * 70 : pos.depth * 88) };
  });
  const byId = new Map(nodes.map(node => [node.id, node]));
  const edges = Object.entries(parents).map(([child, parent]) => {
    const a = byId.get(parent)!, b = byId.get(child)!;
    const path = direction === 'horizontal'
      ? `M ${a.x + 168} ${a.y + 24} H ${a.x + 190} V ${b.y + 24} H ${b.x}`
      : `M ${a.x + 84} ${a.y + 48} V ${a.y + 68} H ${b.x + 84} V ${b.y}`;
    return { child, parent, path };
  });
  return { nodes, edges, width: Math.max(192, ...nodes.map(n => n.x + 180)), height: Math.max(72, ...nodes.map(n => n.y + 60)) };
}
