import test from 'node:test';
import assert from 'node:assert/strict';
import { adjacentPosition, connectionHandles, replaceConnection } from './roadmapGraph.js';

test('new blocks use the requested side and skip occupied positions', () => {
  assert.deepEqual(adjacentPosition({ x: 0, y: 0 }, 'right', [{ x: 310, y: 0 }, { x: 620, y: 0 }]), { x: 930, y: 0 });
  assert.deepEqual(adjacentPosition({ x: 0, y: 0 }, 'top', []), { x: 0, y: -180 });
  assert.deepEqual(adjacentPosition({ x: 0, y: 0 }, 'left', []), { x: -310, y: 0 });
});
test('edge endpoints follow block positions on both axes', () => {
  assert.deepEqual(connectionHandles({ x: 0, y: 0 }, { x: 310, y: 0 }), { sourceHandle: 'right', targetHandle: 'left' });
  assert.deepEqual(connectionHandles({ x: 0, y: 180 }, { x: 0, y: 0 }), { sourceHandle: 'top', targetHandle: 'bottom' });
});
test('reconnecting replaces the old link without losing other branches', () => {
  const links = [{ sourceId: 1, targetId: 2 }, { sourceId: 1, targetId: 3 }];
  const old = { source: '1', target: '2' };
  assert.deepEqual(replaceConnection(links, old, { source: '3', target: '2' }, [1, 2, 3]), [{ sourceId: 1, targetId: 3 }, { sourceId: 3, targetId: 2 }]);
  assert.deepEqual(replaceConnection(links, old, old, [1, 2, 3]), [{ sourceId: 1, targetId: 3 }, { sourceId: 1, targetId: 2 }]);
  assert.equal(links.length, 2);
});
test('reconnecting rejects duplicate links, cycles, self links and foreign blocks', () => {
  const links = [{ sourceId: 1, targetId: 2 }, { sourceId: 2, targetId: 3 }];
  const old = { source: '1', target: '2' };
  for (const connection of [{ source: '2', target: '3' }, { source: '3', target: '2' }, { source: '1', target: '1' }, { source: '1', target: '9' }]) {
    assert.equal(replaceConnection(links, old, connection, [1, 2, 3]), null);
  }
});
