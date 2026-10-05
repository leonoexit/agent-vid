// A frame-addressable camera. World coordinates never depend on the viewport.
const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
const mix=(a,b,p)=>Object.fromEntries(['x','y','zoom','roll'].map(k=>[k,(a[k]??0)+((b[k]??0)-(a[k]??0))*p]));
export function cameraAt(frame,initial,keys){
 let from=initial,active=null;
 for(const key of keys){
  if(frame<key.at)break;
  if(active)from=mix(from,active.to,ease((key.at-active.at)/active.duration));
  active=key;
 }
 return active?mix(from,active.to,ease((frame-active.at)/active.duration)):initial;
}
export function worldToScreen(point,camera,viewport){
 const a=-((camera.roll??0)*Math.PI/180),x=point.x-camera.x,y=point.y-camera.y;
 return {x:viewport.width/2+camera.zoom*(x*Math.cos(a)-y*Math.sin(a)),y:viewport.height/2+camera.zoom*(x*Math.sin(a)+y*Math.cos(a))};
}
export const cameraTransform=c=>`translate(var(--camera-cx), var(--camera-cy)) scale(${c.zoom}) rotate(${-c.roll||0}deg) translate(${-c.x}px, ${-c.y}px)`;
