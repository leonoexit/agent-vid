import {cameraAt} from './camera.mjs';
export const WORLD={source:{x:0,y:0,w:850,h:630},compare:{x:900,y:800,w:850,h:620},result:{x:0,y:1650,w:850,h:620}};
export const WIDE={x:865,y:1135,zoom:.49,roll:0};
export const SOURCE={x:425,y:315,zoom:1.04,roll:0};
export const COMPARE={x:1325,y:1110,zoom:1.02,roll:0};
const smooth=(f,a,d)=>{const p=Math.max(0,Math.min(1,(f-a)/d));return p*p*(3-2*p)};
export function studyState(frame,timeline,example){
 if(example.values.length!==8||example.values.some((v,i,a)=>i&&v<=a[i-1])||!(example.values[3]<example.target))throw Error('Camera study requires eight increasing values with midpoint below target. Rewrite choreography for another branch.');
 const c=timeline.cues,arrival=c.compare-12,travelDuration=Math.max(18,arrival-c.travel),p=smooth(frame,c.travel,travelDuration);
 const token={x:730+(1075-730)*p,y:215+(1075-215)*p-110*Math.sin(p*Math.PI)};
 const camera=cameraAt(frame,WIDE,[
  {at:c.inspect,duration:28,to:SOURCE},
  {at:c.travel,duration:travelDuration,to:COMPARE},
  {at:c.prune,duration:28,to:{x:425,y:1955,zoom:.99,roll:0}},
  {at:c.next+4,duration:24,to:WIDE},
 ]);
 return {camera,token,selected:frame>=c.pick,travelling:frame>=c.travel,compared:frame>=c.compare,proof:frame>=c.proof,pruned:frame>=c.prune,result:frame>=c.prune};
}
