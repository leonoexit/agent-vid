export const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export const mix=(a,b,p)=>a+(b-a)*p;
export function mixRect(a,b,p){return Object.fromEntries(['x','y','w','h'].map(k=>[k,mix(a[k],b[k],p)]));}
// Each transition starts from the sampled pose at its start, so interrupted moves stay continuous.
export function poseAt(frame,initial,keys){
 let base=initial,previous=null;
 for(const key of keys){
  if(key.at>frame)break;
  if(previous)base=mixRect(base,previous.to,ease((key.at-previous.at)/previous.duration));
  previous=key;
 }
 return previous?mixRect(base,previous.to,ease((frame-previous.at)/previous.duration)):base;
}
export function gridRects(ids,{x,y,w,h,columns=4,gap=24}){
 const rows=Math.ceil(ids.length/columns),cw=(w-gap*(columns-1))/columns,ch=(h-gap*(rows-1))/rows;
 return Object.fromEntries(ids.map((id,i)=>[id,{x:x+(i%columns)*(cw+gap),y:y+Math.floor(i/columns)*(ch+gap),w:cw,h:ch}]));
}
export function rowRects(ids,{x,y,w,h,gap=16}){return gridRects(ids,{x,y,w,h,columns:ids.length,gap});}
export function boxAround(rects,pad=22){const xs=rects.map(r=>r.x),ys=rects.map(r=>r.y),right=rects.map(r=>r.x+r.w),bottom=rects.map(r=>r.y+r.h);return{x:Math.min(...xs)-pad,y:Math.min(...ys)-pad,w:Math.max(...right)-Math.min(...xs)+pad*2,h:Math.max(...bottom)-Math.min(...ys)+pad*2};}
