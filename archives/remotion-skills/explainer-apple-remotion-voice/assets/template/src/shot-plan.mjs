import {progress} from './timeline.mjs';
const lerp=(a,b,t)=>a+(b-a)*t;
const blend=(a,b,t)=>Object.fromEntries(Object.keys(b).map(k=>[k,lerp(a[k],b[k],t)]));
// Coordinates describe the shared portrait stage. Identity survives reframing.
export const poses={
 question:{x:{cx:265,cy:960,size:350,rx:10,ry:-17,rz:-12,opacity:1},y:{cx:822,cy:1180,size:285,rx:9,ry:15,rz:12,opacity:1}},
 setup:{x:{cx:540,cy:1080,size:500,rx:9,ry:-10,rz:-5,opacity:1},y:{cx:1220,cy:1210,size:250,rx:9,ry:15,rz:15,opacity:0}},
 copy:{x:{cx:280,cy:1090,size:340,rx:5,ry:-9,rz:-5,opacity:1},y:{cx:800,cy:1090,size:340,rx:5,ry:9,rz:5,opacity:1}},
 change:{x:{cx:345,cy:1110,size:445,rx:7,ry:-12,rz:-7,opacity:1},y:{cx:835,cy:940,size:245,rx:5,ry:8,rz:6,opacity:1}},
 verify:{x:{cx:222,cy:1220,size:245,rx:7,ry:-12,rz:-8,opacity:1},y:{cx:740,cy:1080,size:445,rx:6,ry:10,rz:5,opacity:1}},
 rule:{x:{cx:287,cy:1120,size:345,rx:6,ry:-10,rz:-6,opacity:1},y:{cx:794,cy:1120,size:345,rx:6,ry:10,rz:6,opacity:1}}
};
export function stagePoses(frame,timeline){
 const index=timeline.sections.findIndex(s=>frame>=s.start&&frame<s.start+s.duration);
 const i=index<0?timeline.sections.length-1:index,shot=timeline.sections[i],to=poses[shot.phase];
 if(!to)throw Error(`No shot layout for ${shot.phase}`);
 const from=i===0?{x:{...to.x,cx:215,cy:1110,size:495,rz:-22},y:{...to.y,cx:1040,cy:1310,size:220,opacity:0}}:poses[timeline.sections[i-1].phase];
 const p=progress(frame,shot.start,i===0?46:28);
 return {x:blend(from.x,to.x,p),y:blend(from.y,to.y,p)};
}
export function transferPosition(pose,p){
 const a={x:pose.x.cx,y:pose.x.cy-pose.x.size*.09},b={x:pose.y.cx,y:pose.y.cy-pose.y.size*.09};
 return {x:lerp(a.x,b.x,p),y:lerp(a.y,b.y,p)-160*Math.sin(Math.PI*p)};
}
