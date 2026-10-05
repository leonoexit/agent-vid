import test from 'node:test';import assert from 'node:assert/strict';
import {assignmentState,COPY_FRAMES} from '../src/model.mjs';
import {compileTimeline,sectionList} from '../src/timeline.mjs';
const cues={createX:30,copyStart:100,changeX:220};
for(const example of [{initial:5,replacement:9},{initial:2,replacement:8},{initial:-3,replacement:0}]){
 test(`copy is independent of later assignment: ${JSON.stringify(example)}`,()=>{
  assert.equal(assignmentState(29,cues,example).x,null);
  assert.equal(assignmentState(30,cues,example).x,example.initial);
  const mid=assignmentState(121,cues,example);assert.equal(mid.x,example.initial);assert.equal(mid.y,null);assert.equal(mid.copying,true);
  assert.equal(assignmentState(100+COPY_FRAMES,cues,example).y,example.initial);
  const final=assignmentState(220,cues,example);assert.equal(final.x,example.replacement);assert.equal(final.y,example.initial);
  assert.deepEqual(assignmentState(121,cues,example),mid);
 });
}
test('overlapping actions cannot silently erase the copy',()=>assert.throws(()=>assignmentState(0,{...cues,changeX:110},{initial:5,replacement:9}),/overlap/));
test('an incomplete action plan fails',()=>assert.throws(()=>assignmentState(0,{},{initial:5,replacement:9}),/cue/));
const shots=Array.from({length:3},()=>({vo:'một hai',cues:[]}));shots[0].cues=[{id:'copy',on:'hai'}];
const script={intro:shots[0],scenes:[shots[1]],outro:shots[2]};
const timings={sections:sectionList(script).map(s=>({id:s.id,text:s.vo,file:'assets/audio/test.mp3',duration:1,words:[{w:'một',start:0,end:.3},{w:'hai',start:.4,end:.8}]}))};
test('audio maps to frames without imposing a six-phase lesson',()=>{const t=compileTimeline(script,timings);assert.equal(t.durationInFrames,123);assert.equal(t.cues.copy,17)});
test('changed narration cannot reuse old audio',()=>{const altered=structuredClone(script);altered.intro.vo='ba';assert.throws(()=>compileTimeline(altered,timings),/stale/)});
test('missing cue fails before rendering',()=>{const altered=structuredClone(script);altered.intro.cues[0].on='ba';assert.throws(()=>compileTimeline(altered,timings),/cue/)});
