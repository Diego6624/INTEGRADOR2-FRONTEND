import test from 'node:test';
import assert from 'node:assert/strict';
import { buildNodes, createRoadmapApi, errorMessage } from './roadmapApi.js';

test('loads every page and forwards cancellation and sort options', async () => {
  const signal = new AbortController().signal;
  const calls = [];
  const api = createRoadmapApi({ get: async (path, options) => {
    calls.push({ path, options });
    return { data: { content: [{ id: options.params.page + 1 }], totalPages: 2 } };
  } });
  assert.deepEqual(await api.fetchAllPages('/roadmap/user', { signal, params: { sort: 'createdAt,desc' } }), [{ id: 1 }, { id: 2 }]);
  assert.deepEqual(calls.map(item => item.options.params.page), [0, 1]);
  assert.equal(calls[0].options.signal, signal);
  assert.equal(calls[0].options.params.sort, 'createdAt,desc');
  assert.equal(calls[0].options.params.size, 100);
});

test('empty and final pages stop pagination', async () => {
  let calls = 0;
  const api = createRoadmapApi({ get: async () => { calls++; return { data: { content: [], totalPages: 10 } }; } });
  assert.deepEqual(await api.fetchAllPages('/roadmap'), []);
  assert.equal(calls, 1);
  const final = createRoadmapApi({ get: async () => ({ data: { content: [{ id: 1 }], last: true, totalPages: 10 } }) });
  assert.deepEqual(await final.fetchAllPages('/roadmap'), [{ id: 1 }]);
});

test('nodes preserve zero, negative and fractional positions and sort without mutating steps', () => {
  const steps = [
    { id: 3, title: 'Third', orderIndex: 2 },
    { id: 1, title: 'First', orderIndex: 0, x: 0, y: -25.5 },
    { id: 2, title: 'Second', orderIndex: 1, x: null, y: null },
  ];
  const nodes = buildNodes(steps);
  assert.deepEqual(nodes.map(item => item.id), ['1', '2', '3']);
  assert.deepEqual(nodes[0].position, { x: 0, y: -25.5 });
  assert.deepEqual(nodes[1].position, { x: 360, y: 220 });
  assert.deepEqual(steps.map(item => item.id), [3, 1, 2]);
});

test('drag persistence only sends x and y to the step endpoint', async () => {
  const calls = [];
  const api = createRoadmapApi({ put: async (...args) => { calls.push(args); return { data: { x: 0, y: -12.75 } }; } });
  await api.savePosition('15', { x: 0, y: -12.75, title: 'must not overwrite' });
  assert.deepEqual(calls, [['/roadmap-step/15', { x: 0, y: -12.75 }]]);
});

test('progress uses POST for a new record and PUT for an existing record', async () => {
  const calls = [];
  const api = createRoadmapApi({
    post: async (...args) => calls.push(['POST', ...args]),
    put: async (...args) => calls.push(['PUT', ...args]),
  });
  await api.saveStatus('15', 'HECHO');
  await api.saveStatus('15', 'PENDIENTE', { id: 42 });
  await api.saveStatus('15', 'OMITIR', { id: 42 });
  assert.deepEqual(calls, [
    ['POST', '/user-step-progress', { status: 'HECHO', roadmapStepId: 15 }],
    ['PUT', '/user-step-progress/42', { status: 'PENDIENTE' }],
    ['PUT', '/user-step-progress/42', { status: 'OMITIR' }],
  ]);
});

test('creation sends the backend DTO fields and manual creation source', async () => {
  const calls = [];
  const api = createRoadmapApi({ post: async (...args) => calls.push(args) });
  await api.createRoadmap({ title: 'Backend', description: 'Java', category: 'Software', isPublic: false });
  await api.createStep(9, { title: 'Spring', description: 'REST', orderIndex: 0, x: 360, y: 80 });
  assert.deepEqual(calls, [
    ['/roadmap', { title: 'Backend', description: 'Java', category: 'Software', isPublic: false, createdVia: 'MANUAL' }],
    ['/roadmap-step', { title: 'Spring', description: 'REST', orderIndex: 0, x: 360, y: 80, roadmapId: 9 }],
  ]);
});

test('request failures propagate and backend validation messages are readable', async () => {
  const failure = { response: { data: { mensaje: 'No autorizado' } } };
  const api = createRoadmapApi({ put: async () => { throw failure; } });
  await assert.rejects(api.savePosition(1, { x: 1, y: 2 }), error => error === failure);
  assert.equal(errorMessage(failure, 'Fallback'), 'No autorizado');
  assert.equal(errorMessage({ response: { data: [{ campo: 'title', mensaje: 'required' }] } }, 'Fallback'), 'required');
  assert.equal(errorMessage(new Error('Network'), 'Fallback'), 'Fallback');
});


test('generated roadmap is saved in one request with every step, while forcing private AI source', async () => {
  const calls = [];
  const api = createRoadmapApi({ post: async (...args) => { calls.push(args); return { data: { id: 5 } }; } });
  const steps = [{ title: 'Java', description: 'Practice', orderIndex: 0, x: 360, y: 80 }];
  await api.createGeneratedRoadmap({ title: 'Backend', description: 'Plan', category: 'Software', steps, isPublic: true, createdVia: 'MANUAL' });
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0], ['/roadmap', { title: 'Backend', description: 'Plan', category: 'Software', steps, isPublic: false, createdVia: 'AI_AGENT' }]);
});

test('step edits preserve coordinates and delete failures propagate to keep UI data', async () => {
  const calls = [];
  const failure = new Error('Request rejected');
  const api = createRoadmapApi({
    put: async (...args) => calls.push(args),
    delete: async path => { calls.push(path); throw failure; },
  });
  await api.updateStep(12, { title: 'New title', description: 'New content' });
  assert.deepEqual(calls[0], ['/roadmap-step/12', { title: 'New title', description: 'New content' }]);
  await assert.rejects(api.deleteStep(12), error => error === failure);
  await assert.rejects(api.deleteRoadmap(7), error => error === failure);
});
