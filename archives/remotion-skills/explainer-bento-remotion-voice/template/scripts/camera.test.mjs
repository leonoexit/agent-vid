import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cameraAt,worldToScreen} from '../src/camera.mjs';
import {studyState,WORLD} from '../src/camera-study.mjs';
const origin={x:0,y:0,zoom:1,roll:0};
test('camera centre maps to viewport centre and zoom preserves fixed world positions',()=>{
 const c={x:400,y:700,zoom:2,roll:0};
 assert.deepEqual(worldToScreen({x:400,y:700},c,{width:960,height:1190}),{x:480,y:595});
 assert.deepEqual(worldToScreen({x:500,y:750},c,{width:960,height:1190}),{x:680,y:695});
});
test('interrupted moves start from sampled pose and random seeking is deterministic',()=>{
 const keys=[{at:0,duration:100,to:{...origin,x:100}},{at:50,duration:50,to:{...origin,x:200}}];
 assert.equal(cameraAt(50,origin,keys).x,50);
 const expected=cameraAt(75,origin,keys);cameraAt(100,origin,keys);assert.deepEqual(cameraAt(75,origin,keys),expected);
 assert.equal(expected.x,125);
});
test('study preserves source, follows a read copy, conceals result until pruning',()=>{
 const example={values:[3,7,11,18,24,31,42,56],target:24},before=JSON.stringify({example,WORLD});
 const timeline={cues:{inspect:30,pick:90,travel:120,compare:200,proof:230,prune:280,next:340}};
 assert.equal(studyState(279,timeline,example).result,false);
 assert.equal(studyState(280,timeline,example).result,true);
 for(let f=120;f<=188;f++){
  const s=studyState(f,timeline,example),p=worldToScreen(s.token,s.camera,{width:960,height:1190});
  assert.ok(p.x>100&&p.x<860&&p.y>100&&p.y<1090,`token clipped at ${f}`);
 }
 assert.equal(JSON.stringify({example,WORLD}),before);
 assert.throws(()=>studyState(0,timeline,{...example,target:7}),/midpoint below target/);
});

import {openStudyState} from '../src/open-camera.mjs';
test('open compositions preserve action state and keep tracked value clear of caption safe zone',()=>{
 const example={values:[3,7,11,18,24,31,42,56],target:24};
 const timeline={cues:{inspect:96,pick:171,travel:239,compare:319,proof:356,prune:434,next:481}};
 for(let f=239;f<=319;f++){
  const s=openStudyState(f,timeline,example),base=studyState(f,timeline,example);
  assert.deepEqual(s.token,base.token);
  const p=worldToScreen(s.token,s.camera,{width:1080,height:1920});
  assert.ok(p.x-100*s.camera.zoom>=0 && p.x+100*s.camera.zoom<=1080);
  assert.ok(p.y-95*s.camera.zoom>140 && p.y+95*s.camera.zoom<1660);
 }
 assert.equal(openStudyState(433,timeline,example).resultHeading,0);
 const final=openStudyState(520,timeline,example);
 assert.equal(final.presentation.resultShell,0);assert.equal(final.result,true);
 assert.equal(final.resultHeading,1);
 const middle=openStudyState(270,timeline,example);openStudyState(520,timeline,example);
 assert.deepEqual(openStudyState(270,timeline,example),middle);
});

import {guidedStudyState} from '../src/guided-camera.mjs';
test('guided framing stays fixed during navigation and never relocates settled candidates',()=>{
 const example={values:[3,7,11,18,24,31,42,56],target:24};
 const timeline={cues:{inspect:96,pick:171,travel:239,compare:319,proof:356,prune:434,next:481}};
 for(const [from,to] of [[96,124],[239,307],[434,462]])for(let f=from;f<=to;f++)assert.equal(guidedStudyState(f,timeline,example).release,0);
 for(let f=0;f<545;f++){
  const s=guidedStudyState(f,timeline,example);
  assert.equal(s.viewport.left+s.viewport.width/2,520);
 }
 const poses=[470,490,520].map(f=>{const s=guidedStudyState(f,timeline,example);const p=worldToScreen({x:115,y:1910},s.camera,s.viewport);return{x:p.x+s.viewport.left,y:p.y+s.viewport.top};});
 assert.deepEqual(poses[0],poses[1]);assert.deepEqual(poses[1],poses[2]);
 assert.equal(guidedStudyState(433,timeline,example).result,false);
 assert.equal(guidedStudyState(470,timeline,example).ending,0);
 assert.equal(guidedStudyState(520,timeline,example).ending,1);
});
