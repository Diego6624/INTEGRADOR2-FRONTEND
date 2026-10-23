import test from 'node:test';
import assert from 'node:assert/strict';
import { canConnect, layoutConnections, linearConnections } from './roadmapGraph.js';
import { parseGeneratedRoadmap } from './generatedRoadmap.js';

test('branching and convergence are valid, while cycles and duplicate links are rejected', () => {
  const ids = [1,2,3,4];
  const links = [{ sourceId: 1, targetId: 2 }, { sourceId: 1, targetId: 3 }, { sourceId: 2, targetId: 4 }];
  assert.equal(canConnect(links, 3, 4, ids), true);
  for (const [source,target] of [[1,1],[1,2],[4,1],[9,1],[1,9]]) assert.equal(canConnect(links,source,target,ids),false);
});

test('legacy chain is sorted without mutating the existing steps', () => {
  const steps = [{id:3,orderIndex:2},{id:1,orderIndex:0},{id:2,orderIndex:1}];
  assert.deepEqual(linearConnections(steps), [{sourceId:1,targetId:2},{sourceId:2,targetId:3}]);
  assert.equal(steps[0].id,3);
});

test('parallel nodes are laid out beside each other and converge on a later level', () => {
  const positions=layoutConnections(4,[{source:0,target:1},{source:0,target:2},{source:1,target:3},{source:2,target:3}]);
  assert.equal(positions[1].y,positions[2].y);
  assert.notEqual(positions[1].x,positions[2].x);
  assert.ok(positions[3].y>positions[1].y);
});

test('generated branches survive validation and reject cycles or dangling indexes', () => {
  const data = { title:'Backend', description:'Plan', category:'Software', steps:Array.from({length:4},(_,i)=>({title:`Paso ${i}`,description:'Contenido'})),
    connections:[{source:0,target:1},{source:0,target:2},{source:1,target:3},{source:2,target:3}] };
  const context={areas:['Backend'],career:'Sistemas',goal:'empleo',hours:'10'};
  assert.deepEqual(parseGeneratedRoadmap(JSON.stringify(data),context).connections,data.connections);
  for (const connection of [{source:3,target:0},{source:0,target:10},{source:0,target:1}]) {
    assert.throws(()=>parseGeneratedRoadmap(JSON.stringify({...data,connections:[...data.connections,connection]}),context));
  }
  assert.deepEqual(parseGeneratedRoadmap(JSON.stringify({...data,connections:[]}),context).connections,[]);
});
