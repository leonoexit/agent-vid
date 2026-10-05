import React from 'react';
export const palette={ink:'#2d3436',yellow:'#feee91',blue:'#8ce4ff',orange:'#ffa239',purple:'#a594f9',gray:'#e5e5e5',white:'#fff'};
export function MotionTile({id,value,rect,tone='yellow',label,selected=false,archived=false,found=false,opacity=1,ghost=false}){
 const c=palette,small=rect.w<120;
 return <div data-object={id} style={{position:'absolute',left:rect.x,top:rect.y,width:rect.w,height:rect.h,border:`${small?3:4}px ${ghost?'dashed':'solid'} ${c.ink}`,borderRadius:small?15:27,background:ghost?'transparent':archived?'#d5d5d5':c[tone],boxShadow:ghost?'none':`${small?5:10}px ${small?5:10}px 0 ${c.ink}`,opacity,color:c.ink,zIndex:ghost?1:selected?6:3,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
  {!ghost&&<><span className="mono" style={{fontWeight:800,fontSize:Math.min(rect.w*.41,rect.h*.46,124),lineHeight:1.05}}>{value}</span>
   {label&&<span className="mono" style={{fontWeight:700,fontSize:small?17:Math.min(24,rect.w*.12),marginTop:small?6:16}}>{label}</span>}
   {archived&&<svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M15 78 L85 22" stroke={c.ink} strokeWidth="2.3"/></svg>}
   {found&&<div style={{position:'absolute',right:-18,top:-20,border:`3px solid ${c.ink}`,borderRadius:'50%',width:small?38:58,height:small?38:58,background:c.ink,color:c.white,display:'grid',placeItems:'center',fontSize:small?23:38}}>✓</div>}
  </>}
 </div>;
}
export function RangeOutline({rect,opacity=1,label}){return <div style={{position:'absolute',left:rect.x,top:rect.y,width:rect.w,height:rect.h,border:`4px solid ${palette.ink}`,borderRadius:34,background:palette.blue,opacity,zIndex:0}}>{label&&<span className="mono" style={{position:'absolute',left:15,top:-47,fontSize:25,fontWeight:750,background:palette.blue,padding:'7px 13px',border:`3px solid ${palette.ink}`,borderRadius:10}}>{label}</span>}</div>}
