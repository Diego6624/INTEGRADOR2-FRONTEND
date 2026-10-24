import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchReadStates, isMessageRead, markMessagesRead } from './chatReadState.js';
import { formatMessageTime } from './messageTime.js';

test('loads persisted markers from the authenticated backend', async () => {
  const states = await fetchReadStates({ get: async path => {
    assert.equal(path, '/conversation/read-state');
    return { data: [{ conversationId: 2, lastReadMessageId: 100 }] };
  } });
  assert.equal(isMessageRead(states, 2, { id: 100 }), true);
  assert.equal(isMessageRead(states, 2, { id: 101 }), false);
  assert.equal(isMessageRead(states, 3, { id: 100 }), false);
});
test('persists only the latest displayed message and propagates failures', async () => {
  let events = 0;
  globalThis.window = { dispatchEvent() { events++; } };
  const client = { put: async (path, body) => {
    assert.equal(path, '/conversation/2/read');
    assert.deepEqual(body, { lastReadMessageId: 100 });
    return { data: body };
  } };
  await markMessagesRead(client, 2, [{ id: 100 }, { id: 90 }]);
  assert.equal(events, 1);
  await markMessagesRead(client, 2, []);
  assert.equal(events, 1);
  await assert.rejects(markMessagesRead({ put: async () => { throw Error('offline'); } }, 2, [{ id: 100 }]));
  assert.equal(events, 1);
});
test('UTC and explicit offsets display the same Peru time', () => {
  assert.equal(formatMessageTime('2026-10-24T18:30:00Z'), formatMessageTime('2026-10-24T13:30:00-05:00'));
});
