export function linearConnections(steps) {
  const sorted = [...steps].sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id);
  return sorted.slice(1).map((step, index) => ({ sourceId: sorted[index].id, targetId: step.id }));
}

export function canConnect(links, sourceId, targetId, ids) {
  const source = String(sourceId), target = String(targetId);
  if (source === target || !ids.map(String).includes(source) || !ids.map(String).includes(target)
    || links.some(link => String(link.sourceId) === source && String(link.targetId) === target)) return false;
  const visited = new Set();
  const stack = [target];
  while (stack.length) {
    const current = stack.pop();
    if (current === source) return false;
    if (visited.has(current)) continue;
    visited.add(current);
    links.filter(link => String(link.sourceId) === current).forEach(link => stack.push(String(link.targetId)));
  }
  return true;
}

export function layoutConnections(count, connections) {
  const levels = Array(count).fill(0);
  for (let pass = 0; pass < count; pass++) {
    for (const { source, target } of connections) levels[target] = Math.max(levels[target], levels[source] + 1);
  }
  return levels.map((level, index) => {
    const peers = levels.map((value, i) => value === level ? i : -1).filter(i => i >= 0);
    return { x: 360 + (peers.indexOf(index) - (peers.length - 1) / 2) * 300, y: 80 + level * 180 };
  });
}

export function adjacentPosition(origin, direction, occupied) {
  const offsets = { top: [0, -180], bottom: [0, 180], left: [-310, 0], right: [310, 0] };
  const [dx, dy] = offsets[direction];
  let position = { x: origin.x + dx, y: origin.y + dy };
  while (occupied.some(item => Math.abs(item.x - position.x) < 250 && Math.abs(item.y - position.y) < 100)) {
    position = { x: position.x + dx, y: position.y + dy };
  }
  return position;
}

export function connectionHandles(source, target) {
  const dx = target.x - source.x, dy = target.y - source.y;
  if (Math.abs(dx) > Math.abs(dy)) return { sourceHandle: dx >= 0 ? 'right' : 'left', targetHandle: dx >= 0 ? 'left' : 'right' };
  return { sourceHandle: dy >= 0 ? 'bottom' : 'top', targetHandle: dy >= 0 ? 'top' : 'bottom' };
}

export function replaceConnection(links, oldEdge, connection, ids) {
  const remaining = links.filter(link => String(link.sourceId) !== oldEdge.source || String(link.targetId) !== oldEdge.target);
  if (!canConnect(remaining, connection.source, connection.target, ids)) return null;
  return [...remaining, { sourceId: Number(connection.source), targetId: Number(connection.target) }];
}
