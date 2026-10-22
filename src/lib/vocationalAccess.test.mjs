import test from 'node:test';
import assert from 'node:assert/strict';
import { hasCompletedVocationalTest, requireVocationalTest } from './vocationalAccess.js';
const clientWith = result => ({ get: async () => result ? { data: result } : { status: 204, data: '' } });
test('missing or another user result cannot grant access', async () => {
  assert.equal(await hasCompletedVocationalTest(clientWith(null), 7), false);
  assert.equal(await hasCompletedVocationalTest(clientWith({ id: 1, userId: 99 }), 7), false);
  await assert.rejects(requireVocationalTest(clientWith(null), 7), /Completa el test/);
});
test('only a persisted result for the current user grants access', async () => {
  assert.equal(await hasCompletedVocationalTest(clientWith({ id: 42, userId: '7' }), 7), true);
  assert.equal(await hasCompletedVocationalTest(clientWith({ userId: 7 }), 7), false);
  await assert.doesNotReject(requireVocationalTest(clientWith({ id: 42, userId: 7 }), 7));
});
test('uses own-result endpoint and preserves cancellation', async () => {
  const signal = new AbortController().signal;
  const client = { get: async (path, options) => {
    assert.equal(path, '/vocational-test-result/me');
    assert.equal(options.signal, signal);
    return { data: { id: 42, userId: 7 } };
  } };
  assert.equal(await hasCompletedVocationalTest(client, 7, signal), true);
});
test('missing identity and request failures cannot authorize actions', async () => {
  assert.equal(await hasCompletedVocationalTest({ get: () => assert.fail('Unexpected request') }, null), false);
  const failure = new Error('Network');
  await assert.rejects(requireVocationalTest({ get: async () => { throw failure; } }, 7), error => error === failure);
});
