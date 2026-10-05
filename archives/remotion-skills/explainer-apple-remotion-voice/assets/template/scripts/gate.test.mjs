import test from 'node:test';import assert from 'node:assert/strict';
import {checkAge,gateState} from '../src/gate-model.mjs';
const e={firstAge:17,secondAge:20,minimum:18},c={ageFirst:50,testFirst:150,deny:250,ageSecond:350,testSecond:450,open:550};
test('inclusive boundary:17 fails,18 and20 pass',()=>{assert.equal(checkAge(17,18),false);assert.equal(checkAge(18,18),true);assert.equal(checkAge(20,18),true)});
test('a failing run selects only else and keeps the gate closed',()=>{const s=gateState(300,c,e);assert.equal(s.branch,'else');assert.equal(s.result,false);assert.equal(s.openProgress,0)});
test('changing input clears the old branch until the condition runs again',()=>{const s=gateState(380,c,e);assert.equal(s.age,20);assert.equal(s.result,null);assert.equal(s.branch,null);assert.equal(s.open,false)});
test('a passing run opens only after its action cue',()=>{assert.equal(gateState(549,c,e).open,false);const s=gateState(580,c,e);assert.equal(s.branch,'if');assert.equal(s.openProgress,1)});
test('reverse seeking restores earlier input/result',()=>{const a=gateState(300,c,e);gateState(600,c,e);assert.deepEqual(gateState(300,c,e),a)});
test('invalid ages and incorrectly ordered action plans fail',()=>{assert.throws(()=>checkAge(NaN,18));assert.throws(()=>gateState(0,{...c,open:1},e),/order/)});

import fs from 'node:fs';
const generated=new URL('../src/generated.json',import.meta.url);
if(fs.existsSync(generated)){
 const d=JSON.parse(fs.readFileSync(generated));
 if(d.script.visualMode==='gate')test('actual narrated gate actions occur after their context movement settles',()=>{
  for(const cue of Object.values(d.timeline.cues)){
   const scene=d.timeline.sections.find(s=>cue>=s.start&&cue<s.start+s.duration);
   assert.ok(cue>=scene.start+28);
   gateState(cue,d.timeline.cues,d.script.example);
  }
 });
}
