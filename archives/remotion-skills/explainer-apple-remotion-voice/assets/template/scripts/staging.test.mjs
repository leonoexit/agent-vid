import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {stagePoses,transferPosition} from '../src/shot-plan.mjs';
const generated=new URL('../src/generated.json',import.meta.url);
// Run against the actual narrated plan once sync has generated it.
if(fs.existsSync(generated)){
 const {timeline,script}=JSON.parse(fs.readFileSync(generated));
 if(script.visualMode!=='gate'){
 test('shot layout is settled before the copy and overwrite cues',()=>{
  for(const id of ['copyStart','changeX']){
   const f=timeline.cues[id];assert.deepEqual(stagePoses(f,timeline),stagePoses(f-1,timeline));
  }
 });
 test('both objects remain visible throughout the copy and after overwrite',()=>{
  for(const start of [timeline.cues.copyStart,timeline.cues.changeX])for(let f=start;f<=start+42;f++){
   const p=stagePoses(f,timeline);
   for(const v of Object.values(p)){
    assert.equal(v.opacity,1);
    // Conservative room for tilted edges and the shared <=1.035 camera zoom.
    assert.ok(v.cx-v.size*.61>30&&v.cx+v.size*.61<1050);
    assert.ok(v.cy-v.size*.61>740&&v.cy+v.size*.61<1620);
   }
  }
 });
 test('copy path starts at source and ends at destination, including reverse seeking',()=>{
  const p=stagePoses(timeline.cues.copyStart,timeline);
  assert.deepEqual(transferPosition(p,0),{x:p.x.cx,y:p.x.cy-p.x.size*.09});
  const end=transferPosition(p,1);assert.equal(end.x,p.y.cx);assert.ok(Math.abs(end.y-(p.y.cy-p.y.size*.09))<1e-9);
  const mid=stagePoses(280,timeline);stagePoses(650,timeline);stagePoses(20,timeline);assert.deepEqual(stagePoses(280,timeline),mid);
 });
 }
}
