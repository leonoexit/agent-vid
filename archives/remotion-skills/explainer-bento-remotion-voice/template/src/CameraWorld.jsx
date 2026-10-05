import React from 'react';
import {WORLD} from './camera-study.mjs';
const ink='#2d3436',yellow='#feee91',blue='#8ce4ff',purple='#a594f9';
const box={position:'absolute',border:`4px solid ${ink}`,borderRadius:28,boxShadow:`10px 10px 0 ${ink}`};
function Station({rect,label,color='white',children,shell=1,opacity=1}){return <div style={{position:'absolute',left:rect.x,top:rect.y,width:rect.w,height:rect.h,opacity}}><div style={{...box,inset:0,background:color,opacity:shell}}/><div style={{position:'absolute',left:30,right:30,top:30,font:"800 30px 'Bento Mono'",borderBottom:`3px solid ${ink}`,paddingBottom:20,opacity:shell}}>{label}</div>{children}</div>}
function Tile({value,x,y,color='white',dim=false,small=false,label}){return <div style={{...box,left:x,top:y,width:small?160:200,height:small?150:190,background:color,opacity:dim?.28:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',font:`800 ${small?72:90}px 'Bento Mono'`}}>{value}{label&&<span style={{font:"700 18px 'Bento Mono'"}}>{label}</span>}</div>}
export function CameraWorld({state:s,example,presentation={}}){const v=example.values,t=example.target;return <>
  <svg opacity={presentation.connections ?? 1} width="1950" height="2470" style={{position:'absolute',left:-100,top:-100,overflow:'visible'}}><defs><pattern id="dots" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="2" fill="#d2cfc6"/></pattern><marker id="arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke={ink} strokeWidth="1.4"/></marker></defs><rect width="1950" height="2470" fill="url(#dots)"/><path d="M 805 730 C 805 920, 1210 680, 1210 880" fill="none" stroke={ink} strokeWidth="9" markerEnd="url(#arrow)"/><path d="M 1310 1530 C 1310 1700, 720 1550, 720 1730" fill="none" stroke={ink} strokeWidth="9" markerEnd="url(#arrow)"/></svg>
  <Station opacity={presentation.source ?? 1} rect={WORLD.source} label="01 / DÃY ĐÃ SẮP XẾP">
   {v.map((n,i)=><Tile key={i} value={n} x={35+i%4*205} y={140+Math.floor(i/4)*210} small color={i===3&&s.selected?yellow:'white'} dim={s.pruned&&i<4} label={`index ${i}`}/>)}
   <div style={{position:'absolute',bottom:24,left:36,font:"700 25px 'Bento Mono'"}}>{s.pruned?'Loại index 0–3 khỏi vùng tìm':'0 → 7 · tăng dần'}</div>
  </Station>
  <Station opacity={presentation.compare ?? 1} shell={presentation.compareShell ?? 1} rect={WORLD.compare} label="02 / SO SÁNH VỚI MỤC TIÊU" color={yellow}>
   <div style={{...box,left:75,top:180,width:200,height:190,borderStyle:'dashed',boxShadow:'none',background:'#fff8c9'}}/>
   <Tile value={t} x={550} y={180} color={purple} label="MỤC TIÊU"/>
   <div style={{position:'absolute',left:335,top:205,font:"900 110px 'Bento Mono'"}}>{s.compared?'<':'?'}</div>
   <div style={{position:'absolute',top:420,left:35,right:35,background:s.proof?'white':'transparent',border:s.proof?`3px solid ${ink}`:'3px solid transparent',borderRadius:18,padding:18,font:"800 35px 'Bento Mono'",textAlign:'center',opacity:s.proof?1:0}}>{v.slice(0,3).join(', ')} ≤ {v[3]} &lt; {t}<div style={{font:"650 26px 'Bento Sans'",marginTop:12}}>Cả nhóm đều nhỏ hơn mục tiêu.</div></div>
  </Station>
  <Station opacity={presentation.result ?? 1} shell={presentation.resultShell ?? 1} rect={WORLD.result} label="03 / VÙNG TÌM TIẾP" color={blue}>
   {s.result?v.slice(4).map((n,i)=><Tile key={i} value={n} x={35+i%4*205} y={185} small color="white" label={`index ${i+4}`}/>):<div style={{position:'absolute',left:40,right:40,top:200,textAlign:'center',font:"900 130px 'Bento Serif'"}}>?</div>}
   <div style={{position:'absolute',left:36,bottom:75,opacity:presentation.resultShell ?? 1,font:"800 64px 'Bento Serif'"}}>{s.result?'8 số → còn 4 số':'Thu hẹp phạm vi'}</div>
  </Station>
  {s.travelling&&<div style={{opacity:presentation.compare ?? 1}}><Tile value={v[3]} x={s.token.x-100} y={s.token.y-95} color={yellow} label="GIÁ TRỊ VỪA ĐỌC"/></div>}
</>;}
