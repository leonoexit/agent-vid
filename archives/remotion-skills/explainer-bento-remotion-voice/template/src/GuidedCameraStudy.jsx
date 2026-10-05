import React from 'react';
import {CameraRig} from './CameraRig';
import {CameraWorld} from './CameraWorld';
import {guidedStudyState} from './guided-camera.mjs';
const ink='#2d3436';
export function GuidedCameraStudy({frame,timeline,script,shot}){
 const s=guidedStudyState(frame,timeline,script.example),r=s.viewport;
 return <>
  <div style={{position:'absolute',left:44,top:125,right:44}}><div className="kicker">MỘT PHÉP SO SÁNH · TÌM {script.example.target}</div><h1 className="title" style={{fontSize:62}}>{shot.title}</h1></div>
  <div style={{position:'absolute',...r,background:'#eeeae2',borderRadius:30,opacity:1-s.release}}/>
  <div style={{position:'absolute',...r,background:'#8ce4ff',opacity:s.ending}}/>
  <CameraRig camera={s.camera} width={r.width} height={r.height} style={{left:r.left,top:r.top,borderRadius:30*(1-s.release)}}>
   <CameraWorld state={s} example={script.example} presentation={s.presentation}/>
  </CameraRig>
  <div style={{position:'absolute',...r,border:`3px solid ${ink}`,borderRadius:30,opacity:1-s.release,pointerEvents:'none'}}/>
  <div style={{position:'absolute',left:76,top:478,opacity:s.endingTitle}}>
   <div style={{font:"750 24px 'Bento Mono'",marginBottom:24}}>VÙNG TÌM CÒN LẠI</div>
   <div style={{font:"900 164px/1 'Bento Mono'",letterSpacing:-8}}>{script.example.values.length} → {script.example.values.length/2}</div>
  </div>
  <div style={{position:'absolute',left:46,top:1595,font:"700 23px 'Bento Mono'"}}>8 PHẦN TỬ <span style={{margin:'0 20px'}}>→</span> 1 PHÉP SO SÁNH <span style={{margin:'0 20px'}}>→</span> {s.pruned?'CÒN 4':'…'}</div>
 </>;
}
