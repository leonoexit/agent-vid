import React from 'react';
// Native, seekable assets: no raster cards or reference-footage dependency.
const palette={coral:{a:'#ffb08e',b:'#ff516f',c:'#de389d',glow:'#ff627846'},blue:{a:'#7ce2ff',b:'#168ff6',c:'#7364ef',glow:'#4695ed40'},mint:{a:'#9bf4bf',b:'#25c694',c:'#009b9b',glow:'#24bf9d40'}};
export function SculptedTile({pose,value,label,tone='coral',reveal=1,oldValue,overwrite=1,halo=1,previousValue,blend=1}){
 const c=palette[tone],z=pose.size;
 return <div className="tile-anchor" style={{left:0,top:0,width:360,height:360,opacity:pose.opacity,transform:`translate3d(${pose.cx}px,${pose.cy}px,0) translate(-50%,-50%) scale(${z/360})`}}>
  <div className="contact-shadow" style={{opacity:.6*halo}}/>
  <div className="color-bloom" style={{background:c.glow,opacity:halo}}/>
  <div className="sculpted-tile" style={{transform:`perspective(1400px) rotateX(${pose.rx}deg) rotateY(${pose.ry}deg) rotateZ(${pose.rz}deg)`,fontSize:360}}>
   <div className="ceramic-edge"/>
   <div className="ceramic-front">
    <div className="color-lens" style={{background:`radial-gradient(ellipse at 28% 12%,${c.a} 0%,transparent 62%),linear-gradient(145deg,${c.b},${c.c})`,boxShadow:`0 .035em .065em -.012em ${c.glow},inset 0 .005em .006em #ffffff70,inset 0 -.006em .018em #0000000e`}}>
     <div className="lens-shine"/>
     {oldValue!==undefined&&overwrite<1&&<div className="lens-value" style={{opacity:1-overwrite,transform:`translateY(${-70*overwrite}px) scale(${1-.18*overwrite})`}}>{oldValue}</div>}
     {previousValue!==undefined&&blend<1&&<div className="lens-value" style={{opacity:1-blend}}>{previousValue??'—'}</div>}
     <div className="lens-value" style={{opacity:reveal*overwrite*blend,transform:`translateY(${(1-overwrite)*65}px) scale(${.82+.18*reveal})`}}>{value??'—'}</div>
    </div>
    <div className="tile-label">{label}</div>
   </div>
  </div>
 </div>;
}
export function CopyGlyph({style={}}){return <div className="copy-glyph" style={style}><div className="copy-glyph-disc"><svg viewBox="0 0 80 80"><rect x="15" y="13" width="34" height="41" rx="9" fill="none" stroke="white" strokeWidth="5" opacity=".58"/><rect x="30" y="27" width="34" height="41" rx="9" fill="none" stroke="white" strokeWidth="5"/></svg></div><span>Sao chép</span></div>}
export function ValueToken({x,y,value,p}){return <div className="value-token" style={{left:x,top:y,transform:`translate(-50%,-50%) rotate(${Math.sin(p*Math.PI)*-9}deg) scale(${.72+.28*Math.sin(Math.PI*p)})`,opacity:Math.min(1,p*8,(1-p)*10)}}><div className="token-under"/><div className="token-face">{value}</div></div>}
export function CodeCapsule({phase,example,opacity=1}){
 const code=phase==='setup'?<>let <b>x</b> = <em>{example.initial}</em>;</>:phase==='change'?<><b>x</b> = <em>{example.replacement}</em>;</>:<>let <b>y</b> = <b>x</b>;</>;
 const history=phase==='verify'||phase==='rule';
 const color=history?'history':phase==='change'||phase==='setup'?'coral':'blue';
 return <div className={`code-capsule ${color}`} style={{opacity}}><span className="run-dot">{history?'↶':'▶'}</span><code>{code}</code></div>;
}
