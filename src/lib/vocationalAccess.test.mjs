import test from 'node:test';
import assert from 'node:assert/strict';
import { hasCompletedVocationalTest, requireVocationalTest } from './vocationalAccess.js';

const clientWith = content => ({ get: async () => ({ data: { content, last: true } }) });

test('a user without a saved result cannot access restricted actions', async () => {
  const client = clientWith([]);
  assert.equal(await hasCompletedVocationalTest(client, 7), false);
  await assert.rejects(requireVocationalTest(client, 7), /Completa el test vocacional/);
});

test('another user result never grants access', async () => {
  const client = clientWith([{ id: 1, userId: 99 }]);
  assert.equal(await hasCompletedVocationalTest(client, 7), false);
});

test('only a persisted result for the current user grants access', async () => {
  assert.equal(await hasCompletedVocationalTest(clientWith([{ id: 42, userId: '7' }]), 7), true);
  assert.equal(await hasCompletedVocationalTest(clientWith([{ userId: 7 }]), 7), false);
  await assert.doesNotReject(requireVocationalTest(clientWith([{ id: 42, userId: 7 }]), 7));
});

test('searches all pages and preserves cancellation', async () => {
  const signal = new AbortController().signal;
  let calls = 0;
  const client = { get: async (path, options) => {
    assert.equal(path, '/vocational-test-result');
    assert.equal(options.signal, signal);
    calls++;
    return { data: { content: options.params.page ? [{ id: 42, userId: 7 }] : [{ id: 41, userId: 9 }], totalPages: 2 } };
  } };
  assert.equal(await hasCompletedVocationalTest(client, 7, signal), true);
  assert.equal(calls, 2);
});

test('missing identity and request failures cannot authorize access', async () => {
  assert.equal(await hasCompletedVocationalTest({ get: () => assert.fail('Unexpected request') }, null), false);
  const failure = new Error('Network');
  const client = { get: async () => { throw failure; } };
  await assert.rejects(hasCompletedVocationalTest(client, 7), error => error === failure);
  await assert.rejects(requireVocationalTest(client, 7), error => error === failure);
});

test('roadmap prerequisite rejects before a creation action can run', async () => {
  let created = false;
  async function create() {
    await requireVocationalTest(clientWith([]), 7);
    created = true;
  }
  await assert.rejects(create());
  assert.equal(created, false);
});
