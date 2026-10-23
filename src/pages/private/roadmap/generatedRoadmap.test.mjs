import test from 'node:test';
import assert from 'node:assert/strict';
import { parseGeneratedRoadmap, formatAgentReply } from './generatedRoadmap.js';
const context = { areas: ['Backend'], career: 'Sistemas', goal: 'empleo', hours: '10' };
const structured = { title: 'Backend', description: 'Plan real', category: 'Software', steps: [
  { title: 'Fundamentos', description: '**Objetivo:** Java.\n[Documentacion](https://example.com)' },
  { title: 'Proyecto', description: 'Implementar una API.' },
] };

test('structured AI roadmap preserves content and gets deterministic ordered map positions', () => {
  const roadmap = parseGeneratedRoadmap('```json\n' + JSON.stringify(structured) + '\n```', context);
  assert.equal(roadmap.createdVia, 'AI_AGENT');
  assert.equal(roadmap.isPublic, false);
  assert.deepEqual(roadmap.steps.map(step => [step.orderIndex, step.x, step.y]), [[0,360,80], [1,360,260]]);
  assert.equal(roadmap.steps[0].description, structured.steps[0].description);
});

test('phase Markdown from existing agent can be saved without losing resources', () => {
  const text = '# Roadmap\n\n### Fase 1: Java\n* **Objetivo:** dominar Java\n* [Curso](https://example.com)\n---\n### Fase 2: REST\nCrear una API.\n';
  const roadmap = parseGeneratedRoadmap(text, context);
  assert.equal(roadmap.steps.length, 2);
  assert.equal(roadmap.steps[0].title, 'Fase 1: Java');
  assert.match(roadmap.steps[0].description, /https:\/\/example.com/);
  assert.equal(roadmap.steps[1].description, 'Crear una API.');
});

test('refuses clarification, empty steps, malformed JSON, blank descriptions and oversized titles', () => {
  for (const text of ['Cual es tu nivel?', '{broken}', JSON.stringify({...structured, steps: []}),
    JSON.stringify({...structured, steps: [{ title: 'Java', description: '  ' }]}),
    JSON.stringify({...structured, title: 'a'.repeat(256)})]) {
    assert.throws(() => parseGeneratedRoadmap(text, context));
  }
});

test('chat renders structured generation as readable Markdown and preserves regular answers', () => {
  assert.match(formatAgentReply(JSON.stringify(structured)), /## 1. Fundamentos/);
  assert.equal(formatAgentReply('### Fase 1\n**Objetivo:** aprender'), '### Fase 1\n**Objetivo:** aprender');
});
