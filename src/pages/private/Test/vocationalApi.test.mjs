import test from 'node:test';
import assert from 'node:assert/strict';
import { createVocationalApi, prepareResult, rankCareers } from './vocationalApi.js';

const questions = [
  { id: 1, opciones: [{ id: 11, careerScore: { Software: 3, Medicina: 1 } }, { id: 12, careerScore: { Medicina: 5 } }] },
  { id: 2, opciones: [{ id: 21, careerScore: { Software: 2, Medicina: 1 } }] },
];
const answers = { 1: 11, 2: 21 };
const page = content => ({ data: { content, last: true, totalPages: 1 } });

test('scores use the selected options and keep the exact backend payload spelling', () => {
  assert.deepEqual(prepareResult(questions, answers), { suggestedCareer: 'Software', vocacionalOptionIds: [11, 21] });
  assert.deepEqual(prepareResult(questions, { 1: 12, 2: 21 }), { suggestedCareer: 'Medicina', vocacionalOptionIds: [12, 21] });
});

test('unanswered questions and options belonging to another question cannot be submitted', () => {
  assert.throws(() => prepareResult(questions, { 1: 11 }), /Responde todas/);
  assert.throws(() => prepareResult(questions, { 1: 21, 2: 11 }), /Responde todas/);
  assert.throws(() => prepareResult([], {}), /No hay preguntas/);
  assert.throws(() => prepareResult([{ id: 1, opciones: [{ id: 1, careerScore: {} }] }], { 1: 1 }), /puntajes suficientes/);
});

test('ties are deterministic and invalid score values do not produce NaN', () => {
  assert.deepEqual(rankCareers([{ careerScore: { Software: 2, Medicina: 2, Invalid: '3', Other: NaN } }]),
    [{ career: 'Medicina', score: 2 }, { career: 'Software', score: 2 }]);
});

test('loads paginated questions with actual IDs, text and careerScore', async () => {
  const signal = new AbortController().signal;
  const calls = [];
  const api = createVocationalApi({ get: async (path, options) => {
    calls.push([path, options]);
    if (path === '/me') return { data: { id: 7 } };
    if (path === '/vocational-test-result') return page([]);
    return { data: { content: [{ id: options.params.page + 1, text: 'Question',
      vocacionalOptions: [{ id: 10 + options.params.page, text: 'Answer', careerScore: { Software: 2 } }] }], totalPages: 2 } };
  } });
  const loaded = await api.load(signal);
  assert.equal(loaded.userId, 7);
  assert.deepEqual(loaded.questions.map(item => item.id), [1, 2]);
  assert.equal(loaded.questions[0].texto, 'Question');
  assert.deepEqual(loaded.questions[0].opciones[0], { id: 10, texto: 'Answer', careerScore: { Software: 2 } });
  assert.ok(calls.every(([, options]) => options.signal === signal));
});

test('finds only the current user result across pages and avoids loading questions', async () => {
  const api = createVocationalApi({ get: async (path, options) => {
    if (path === '/me') return { data: { id: 7 } };
    assert.equal(path, '/vocational-test-result');
    return { data: { content: options.params.page ? [{ id: 9, userId: '7', suggestedCareer: 'Software' }] : [{ id: 8, userId: 99 }], totalPages: 2 } };
  } });
  const loaded = await api.load();
  assert.equal(loaded.result.id, 9);
  assert.deepEqual(loaded.questions, []);
});

test('submits only career and option IDs and displays the server result', async () => {
  const calls = [];
  const saved = { id: 8, userId: 7, suggestedCareer: 'Software', vocacionalOptions: [] };
  const api = createVocationalApi({ get: async () => page([]), post: async (...args) => { calls.push(args); return { data: saved }; } });
  assert.equal(await api.submit(7, questions, answers), saved);
  assert.deepEqual(calls, [['/vocational-test-result', { suggestedCareer: 'Software', vocacionalOptionIds: [11, 21] }]]);
});

test('retry reuses the existing result without a second POST', async () => {
  const saved = { id: 8, userId: 7, suggestedCareer: 'Software' };
  const api = createVocationalApi({ get: async () => page([saved]), post: async () => assert.fail('Unexpected duplicate POST') });
  assert.equal(await api.submit(7, questions, answers), saved);
});

test('conflict from another tab reloads the saved result', async () => {
  let reads = 0;
  const saved = { id: 8, userId: 7, suggestedCareer: 'Software' };
  const api = createVocationalApi({
    get: async () => page(reads++ ? [saved] : []),
    post: async () => { throw { response: { status: 409 } }; },
  });
  assert.equal(await api.submit(7, questions, answers), saved);
  assert.equal(reads, 2);
});

test('invalid question configuration and failed saves surface errors', async () => {
  const api = createVocationalApi({ get: async path => path === '/me' ? { data: { id: 7 } }
    : page(path === '/vocational-question' ? [{ id: 1, text: 'No options', vocacionalOptions: [] }] : []) });
  await assert.rejects(api.load(), /sin opciones/);
  const failure = new Error('Network');
  const broken = createVocationalApi({ get: async () => page([]), post: async () => { throw failure; } });
  await assert.rejects(broken.submit(7, questions, answers), error => error === failure);
});
