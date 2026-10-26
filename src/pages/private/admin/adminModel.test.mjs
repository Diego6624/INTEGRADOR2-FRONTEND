import test from 'node:test';
import assert from 'node:assert/strict';
import { filterRows, emptyFilters, prepareBody } from './adminModel.js';
const rows = [
 { id: 1, title: 'Backend', userId: 7, isPublic: true, likesCount: 12, createdAt: '2026-10-01T12:00:00' },
 { id: 2, title: 'Frontend', userId: 8, isPublic: false, likesCount: 2, createdAt: '2026-10-20T12:00:00' },
];
test('author search accepts accented names, email and ID, combined with metric and status filters', () => {
 const users = [{ id: 7, name: 'Jose Perez', email: 'jose@example.test' }, { id: 8, name: 'Maria', email: 'maria@example.test' }];
 for (const author of ['Jose', 'jose@example', '7']) assert.deepEqual(filterRows(rows, { ...emptyFilters, author, status: 'public', metric: 'likesCount', min: '10' }, 'roadmaps', users).map(row => row.id), [1]);
 assert.equal(filterRows(rows, { ...emptyFilters, metric: 'likesCount', max: '5' }, 'roadmaps').length, 1);
 assert.equal(rows[0].id, 1);
});
test('date range includes the end date and numeric ordering works across all records', () => {
 assert.deepEqual(filterRows(rows, { ...emptyFilters, from: '2026-10-20', to: '2026-10-20' }, 'roadmaps').map(row => row.id), [2]);
 assert.deepEqual(filterRows(rows, { ...emptyFilters, order: 'likesCount:desc' }, 'roadmaps').map(row => row.id), [1, 2]);
});
test('user filters combine active status and role', () => {
 const users = [{ id: 1, active: true, role: 'ADMINISTRADOR' }, { id: 2, active: false, role: 'ESTUDIANTE' }];
 assert.deepEqual(filterRows(users, { ...emptyFilters, status: 'inactive', role: 'ESTUDIANTE' }, 'users').map(row => row.id), [2]);
});
test('question filters find alternatives and careers and expose missing alternatives', () => {
 const questions = [{ id: 1, text: 'Pregunta', optionsCount: 1, vocacionalOptions: [{ text: 'Crear software', careerScore: { Sistemas: 4 } }] }, { id: 2, text: 'Otra', optionsCount: 0 }];
 assert.deepEqual(filterRows(questions, { ...emptyFilters, query: 'software' }, 'questions').map(row => row.id), [1]);
 assert.deepEqual(filterRows(questions, { ...emptyFilters, status: 'without' }, 'questions').map(row => row.id), [2]);
});
test('payloads exclude server metrics and preserve passwords when editing without a new one', () => {
 const body = prepareBody('users', { name: ' Ana ', email: 'ana@example.test', role: 'ESTUDIANTE', active: true, password: '', postsCount: 999 });
 assert.equal(body.password, null); assert.equal(body.name, 'Ana'); assert.equal('postsCount' in body, false);
 assert.deepEqual(prepareBody('posts', { title: ' Title ', content: ' Text ', userId: '7', tagIds: [1], views: 9 }), { title: 'Title', content: 'Text', userId: 7, tagIds: [1] });
});
test('option scores reject missing careers, duplicates, negative and fractional scores', () => {
 for (const scores of [[], [{ career: '', score: 1 }], [{ career: 'A', score: -1 }], [{ career: 'A', score: 1.5 }], [{ career: 'A', score: 1 }, { career: 'a', score: 2 }]]) assert.throws(() => prepareBody('options', { text: 'Test', scores }));
 assert.deepEqual(prepareBody('options', { text: ' Test ', scores: [{ career: 'Software', score: '4' }] }), { text: 'Test', careerScore: { Software: 4 } });
});
