import React from 'react';
import {CameraRig} from './CameraRig';
import {CameraWorld} from './CameraWorld';
import {studyState} from './camera-study.mjs';
const ink='#2d3436',yellow='#feee91',blue='#8ce4ff',purple='#a594f9';
const box={position:'absolute',border:`4px solid ${ink}`,borderRadius:28,boxShadow:`10px 10px 0 ${ink}`};
export function CameraStudy({frame,timeline,script,shot}){
 const s=studyState(frame,timeline,script.example),v=script.example.values,t=script.example.target;
 return <>
 <div style={{position:'absolute',left:44,top:125,right:44}}><div className="kicker">MỘT PHÉP SO SÁNH · TÌM {t}</div><h1 className="title" style={{fontSize:62}}>{shot.title}</h1></div>
 <CameraRig camera={s.camera} width={960} height={1190} style={{left:40,top:380,border:`3px solid ${ink}`,borderRadius:30,background:'#eeeae2'}}>
  <CameraWorld state={s} example={script.example}/>
 </CameraRig>
 <div style={{position:'absolute',left:46,top:1595,font:"700 23px 'Bento Mono'"}}>8 PHẦN TỬ <span style={{margin:'0 20px'}}>→</span> 1 PHÉP SO SÁNH <span style={{margin:'0 20px'}}>→</span> {s.pruned?'CÒN 4':'…'}</div>
 </>;
}
