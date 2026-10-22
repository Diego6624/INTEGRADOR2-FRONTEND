import test from 'node:test';
import assert from 'node:assert/strict';
import { createVocationalApi, prepareResult } from './vocationalApi.js';
const questions = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, opciones: [{ id: i * 5 + 1, texto: 'Nada' }, { id: i * 5 + 5, texto: 'Mucho' }] }));
const answers = Object.fromEntries(questions.map(q => [q.id, q.opciones[1].id]));
const saved = { id: 8, userId: 7, suggestedCareer: 'Software', ranking: [{ career: 'Software', score: 20, maxScore: 20, percentage: 100 }] };
const noResult = { status: 204, data: '' };
test('only sends selected IDs: the backend owns career and score', () => {
  assert.deepEqual(prepareResult(questions, answers), { vocacionalOptionIds: questions.map(q => q.opciones[1].id) });
  assert.throws(() => prepareResult(questions, {}), /Responde todas/);
  assert.throws(() => prepareResult(questions, { ...answers, 1: 999 }), /Responde todas/);
  assert.throws(() => prepareResult([], {}), /No hay preguntas/);
});
test('loads all question pages and preserves cancellation', async () => {
  const signal = new AbortController().signal;
  const api = createVocationalApi({ get: async (path, options) => {
    assert.equal(options.signal, signal);
    if (path === '/me') return { data: { id: 7 } };
    if (path === '/vocational-test-result/me') return noResult;
    assert.equal(path, '/vocational-question');
    return { data: { content: questions.slice(options.params.page * 15, (options.params.page + 1) * 15).map(q => ({ id: q.id, text: 'Pregunta', vocacionalOptions: q.opciones.map(o => ({ id: o.id, text: o.texto })) })), totalPages: 2 } };
  } });
  const loaded = await api.load(signal);
  assert.equal(loaded.questions.length, 30);
  assert.equal(loaded.questions[29].opciones[1].id, 150);
});
test('loads the saved server ranking without fetching questions', async () => {
  const api = createVocationalApi({ get: async path => {
    if (path === '/me') return { data: { id: 7 } };
    assert.equal(path, '/vocational-test-result/me');
    return { data: saved };
  } });
  assert.deepEqual(await api.load(), { userId: 7, result: saved, questions: [] });
});
test('submit displays the actual server result and ignores browser scores', async () => {
  const calls = [];
  const api = createVocationalApi({ get: async () => noResult, post: async (...args) => { calls.push(args); return { data: saved }; } });
  assert.equal(await api.submit(7, questions, answers), saved);
  assert.deepEqual(calls, [['/vocational-test-result', { vocacionalOptionIds: questions.map(q => q.opciones[1].id) }]]);
});
test('retry reuses an existing result without another POST', async () => {
  const api = createVocationalApi({ get: async () => ({ data: saved }), post: async () => assert.fail('Duplicate POST') });
  assert.equal(await api.submit(7, questions, answers), saved);
});
test('concurrent conflict reloads the saved result', async () => {
  let reads = 0;
  const api = createVocationalApi({ get: async () => reads++ ? { data: saved } : noResult,
    post: async () => { throw { response: { status: 409 } }; } });
  assert.equal(await api.submit(7, questions, answers), saved);
  assert.equal(reads, 2);
});
test('incomplete configuration and request failures surface errors', async () => {
  for (const count of [0, 19, 41]) {
    const api = createVocationalApi({ get: async path => path === '/me' ? { data: { id: 7 } } : path.endsWith('/me') ? noResult : { data: { content: Array.from({ length: count }, (_, i) => ({ id: i, vocacionalOptions: [{ id: 1 }, { id: 2 }] })) } } });
    await assert.rejects(api.load(), /entre 20 y 40/);
  }
  const failure = new Error('Network');
  const api = createVocationalApi({ get: async () => noResult, post: async () => { throw failure; } });
  await assert.rejects(api.submit(7, questions, answers), error => error === failure);
});
