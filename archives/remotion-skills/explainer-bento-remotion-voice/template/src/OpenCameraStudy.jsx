import React from 'react';
import {CameraRig} from './CameraRig';
import {CameraWorld} from './CameraWorld';
import {openStudyState} from './open-camera.mjs';
const ink='#2d3436';
export function OpenCameraStudy({frame,timeline,script,shot}){
 const s=openStudyState(frame,timeline,script.example),count=script.example.values.length;
 const isIntro=shot.phase==='question';
 return <>
  <div style={{position:'absolute',inset:0,background:'#e5e5e5'}}/>
  <div style={{position:'absolute',inset:0,background:'#feee91',opacity:s.close}}/>
  <div style={{position:'absolute',inset:0,background:'#8ce4ff',opacity:s.ending}}/>
  <CameraRig camera={s.camera} width={1080} height={1920} style={{left:0,top:0}}>
   <CameraWorld state={s} example={script.example} presentation={s.presentation}/>
  </CameraRig>
  <div style={{position:'absolute',top:60,left:64,right:64,display:'flex',alignItems:'center',justifyContent:'space-between',font:"700 23px 'Bento Mono'"}}><span>{script.brand} / CODE</span><span style={{background:'#a594f9',padding:'13px 20px',border:`3px solid ${ink}`,borderRadius:14}}>TÌM {script.example.target}</span></div>
  <div style={{position:'absolute',top:isIntro?155:195,left:64,right:64,opacity:s.headingOut}}>
   <div style={{font:"700 25px 'Bento Mono'",marginBottom:24}}>{isIntro?'BINARY SEARCH':'DÃY ĐÃ SẮP XẾP'}</div>
   <h1 className="title" style={{fontSize:isIntro?104:90,lineHeight:1.06}}>{isIntro?'Có cần thử\ntừng số?':shot.phase==='setup'?'Tám số.\nMột thứ tự.':'Đọc ô giữa.'}</h1>
  </div>
  <div style={{position:'absolute',left:64,top:165,opacity:(1-s.headingOut)*(1-s.close),font:"750 25px 'Bento Mono'"}}>ĐỌC GIÁ TRỊ → SO SÁNH</div>
  <div style={{position:'absolute',left:64,right:64,top:210,opacity:s.comparisonIn}}>
   <div style={{font:"700 25px 'Bento Mono'",marginBottom:28}}>MỘT PHÉP SO SÁNH</div>
   <h1 className="title" style={{fontSize:96,lineHeight:1.08}}>{s.proof?'Cả nhóm\nđều nhỏ hơn.':'So sánh\nvới mục tiêu.'}</h1>
  </div>
  <div style={{position:'absolute',left:64,right:64,top:230,opacity:s.resultHeading}}>
   <div style={{font:"700 26px 'Bento Mono'",marginBottom:22}}>THU HẸP VÙNG TÌM</div>
   <div style={{font:"900 236px/1.08 'Bento Mono'",letterSpacing:-16}}>{count}<span style={{fontSize:158,margin:'0 30px'}}>→</span>{count/2}</div>
   <div style={{font:"650 42px 'Bento Sans'",marginTop:30}}>Còn một nửa số ứng viên.</div>
  </div>
  <div style={{position:'absolute',left:64,right:64,top:1165,opacity:s.resultHeading,font:"800 62px/1.2 'Bento Serif'"}}>Tìm tiếp ở<br/>nửa bên phải.</div>
 </>;
}
