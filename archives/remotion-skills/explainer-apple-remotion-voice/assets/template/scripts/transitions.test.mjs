import test from 'node:test';import assert from 'node:assert/strict';
import {sectionLayers,poseAt,glyphState} from '../src/transitions.mjs';
const sections=[{start:0},{start:100},{start:220}];
test('overlay weights conserve opacity across every section handoff',()=>{for(let f=0;f<300;f+=.25){const sum=sectionLayers(f,sections).reduce((v,s)=>v+s.opacity,0);assert.ok(Math.abs(sum-1)<1e-9)}});
test('a boundary retains both old and new content instead of a one-frame replacement',()=>{const l=sectionLayers(100,sections);assert.equal(l.length,2);assert.equal(l[0].opacity,.5);assert.equal(l[1].opacity,.5)});
test('interrupted motion starts from its current pose',()=>{const keys=[{at:0,duration:30,to:{x:100}},{at:15,duration:30,to:{x:200}}];assert.equal(poseAt(15,{x:0},keys).x,50);assert.ok(Math.abs(poseAt(14.999,{x:0},keys).x-50)<.01)});
test('glyph updates retain the previous value while blending',()=>{const g=glyphState(106,17,[{at:100,value:20}]);assert.equal(g.previous,17);assert.equal(g.value,20);assert.equal(g.blend,.5)});

test('titles never overlap while environment layers dissolve',()=>{for(let f=90;f<110;f+=.25)assert.ok(sectionLayers(f,sections).filter(x=>x.textOpacity>0).length<=1)});
