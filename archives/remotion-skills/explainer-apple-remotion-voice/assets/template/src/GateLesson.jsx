import React from 'react';
import {progress} from './timeline.mjs';
import {sectionLayers,poseAt,glyphState} from './transitions.mjs';
import {SculptedTile} from './Assets';
import {Gate,FormContext,ConditionContext,RuleContext} from './GateAssets';
import {gateState} from './gate-model.mjs';
import './gate.css';
const phaseContext={question:'gate',input:'form',test:'condition',denied:'gate',retry:'condition',allowed:'gate',rule:'code'};
const poses={question:{cx:225,cy:1200,size:235,rx:6,ry:-13,rz:-9,opacity:1},input:{cx:540,cy:1070,size:310,rx:0,ry:0,rz:0,opacity:1},test:{cx:280,cy:1020,size:270,rx:4,ry:-8,rz:-3,opacity:1},denied:{cx:225,cy:1210,size:235,rx:6,ry:-13,rz:-9,opacity:1},retry:{cx:280,cy:1020,size:270,rx:4,ry:-8,rz:-3,opacity:1},allowed:{cx:225,cy:1210,size:235,rx:6,ry:-13,rz:-9,opacity:1},rule:{cx:881,cy:721,size:160,rx:5,ry:10,rz:7,opacity:1}};
const labels={question:'IF / ELSE',input:'ĐẦU VÀO',test:'ĐIỀU KIỆN',denied:'NHÁNH ELSE',retry:'ĐỔI ĐẦU VÀO',allowed:'NHÁNH IF',rule:'QUY TẮC'};
function Title({phase}){
 if(phase==='question')return <>Một điều kiện.<br/><span className="gradient-word">Hai kết quả.</span></>;
 if(phase==='input')return <>Bắt đầu<br/>từ <span className="blue-word">đầu vào.</span></>;
 if(phase==='test')return <>Kiểm tra<br/><span className="gradient-word">điều kiện.</span></>;
 if(phase==='denied')return <>Điều kiện sai.<br/><span className="coral-word">Chạy else.</span></>;
 if(phase==='retry')return <>Đổi tuổi.<br/><span className="blue-word">Kiểm tra lại.</span></>;
 if(phase==='allowed')return <>Điều kiện đúng.<br/><span className="mint-word">Chạy if.</span></>;
 return <>Chọn một.<br/><span className="gradient-word">Không chạy cả hai.</span></>;
}
export function GateLesson({frame,timeline,script}){
 const e=script.example,c=timeline.cues,state=gateState(frame,c,e),layers=sectionLayers(frame,timeline.sections,20);
 const contextWeights={gate:0,form:0,condition:0,code:0};for(const l of layers)contextWeights[phaseContext[l.section.phase]]+=l.opacity;
 const p=poseAt(frame,{...poses.question,cy:1280,opacity:0},timeline.sections.map((s,i)=>({at:s.start,duration:i?28:30,to:poses[s.phase]})));
 const glyph=glyphState(frame,'?',[{at:c.ageFirst,value:e.firstAge},{at:c.ageSecond,value:e.secondAge}]);
 const gateOpacity=contextWeights.gate;
 return <>
  <div className="gate-backdrop"/>
  <div className="form-context-layer" style={{opacity:contextWeights.form}}><FormContext minimum={e.minimum}/></div>
  <div style={{position:'absolute',inset:0,opacity:contextWeights.condition}}><ConditionContext state={state} minimum={e.minimum}/><SculptedTile pose={{cx:800,cy:1020,size:270,rx:4,ry:8,rz:3,opacity:1}} value={e.minimum} label="Ngưỡng tuổi" tone="mint"/></div>
  <div className="gate-context-layer" style={{opacity:gateOpacity}}><div className="gate-floor"/><div className="gate-building"><Gate opening={state.openProgress} lamp={state.lamp}/></div>{state.branch&&<div className={`gate-result ${state.open?'pass':'stop'}`} style={{opacity:progress(frame,state.open?c.open:c.deny,14)}}>{state.open?'Cổng mở':'Cổng giữ đóng'}</div>}</div>
  <div style={{position:'absolute',inset:0,opacity:contextWeights.code}}><RuleContext minimum={e.minimum}/></div>
  <SculptedTile pose={p} value={glyph.value} previousValue={glyph.previous} blend={glyph.blend} label="Tuổi nhập" tone="blue"/>
  {layers.map(({section,textOpacity})=><div key={section.id} style={{position:'absolute',inset:0,opacity:textOpacity,pointerEvents:'none'}}><div className="chapter"><span/>{labels[section.phase]}</div><div className={`hero-heading gate-heading gate-heading-${section.phase}`}><Title phase={section.phase}/></div>{['denied','allowed'].includes(section.phase)&&<div className={`gate-code-pill ${section.phase==='allowed'?'pass':'stop'}`}><code>{section.phase==='allowed'?'if → openGate()':'else → keepClosed()'}</code></div>}</div>)}
 </>;
}
