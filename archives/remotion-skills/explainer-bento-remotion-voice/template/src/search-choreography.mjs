import {gridRects,rowRects,poseAt,boxAround} from './motion.mjs';
import {scoredSearch} from './search-model.mjs';
export function buildChoreography(example,c){
 const trace=scoredSearch(example),ids=example.values.map((_,i)=>i);
 const overview=gridRects(ids,{x:66,y:433,w:908,h:485,columns:4,gap:22});
 const row=rowRects(ids,{x:60,y:584,w:920,h:145,gap:14});
 const archive=rowRects(ids,{x:98,y:1430,w:842,h:83,gap:14});
 const remaining=gridRects(trace.steps[1].ids,{x:130,y:452,w:780,h:590,columns:2,gap:28});
 const one=gridRects(trace.steps[2].ids,{x:315,y:525,w:410,h:335,columns:1,gap:24});
 const left1={x:150,y:1010,w:280,h:260},right1={x:610,y:1010,w:280,h:260};
 const left2={x:150,y:1100,w:280,h:248},right2={x:610,y:1100,w:280,h:248};
 const left3={x:130,y:650,w:340,h:330},right3={x:610,y:650,w:300,h:330};
 const targetInitial={x:678,y:1120,w:296,h:282};
 const tileKeys=Object.fromEntries(ids.map(i=>[i,[]]));
 const add=(i,at,to,duration=24)=>tileKeys[i].push({at,to,duration});
 const reflow=(group,at,dest,duration=28,axis='x')=>{
  const d=duration/4;
  for(const i of group){
   const start=poseAt(at,overview[i],tileKeys[i]);
   const compact={x:start.x+start.w/2-34,y:start.y+start.h/2-34,w:68,h:68};
   const goal=dest[i],landing={x:goal.x+goal.w/2-34,y:goal.y+goal.h/2-34,w:68,h:68};
   const corner={...compact,[axis]:landing[axis]};
   add(i,at,compact,d);add(i,at+d,corner,d);add(i,at+d*2,landing,d);add(i,at+d*3,goal,d);
  }
 };
 const archiveTo=(i,at,duration=27)=>{
  const start=poseAt(at,overview[i],tileKeys[i]);
  const compact={x:start.x+start.w/2-36,y:start.y+start.h/2-36,w:72,h:72};
  add(i,at,compact,8);add(i,at+8,archive[i],duration-8);
 };
 reflow(ids,c.mid1-12,row,48,'x');
 add(trace.steps[0].mid,c.pick1,left1,23);
 // Whole excluded group goes to its original-index archive slot; remaining objects take the freed space.
 for(const i of trace.steps[0].discarded)archiveTo(i,c.discard1,25);
 reflow(trace.steps[1].ids,c.shrink1,remaining,30,'y');
 add(trace.steps[1].mid,c.mid2,left2,22);
 for(const i of trace.steps[1].discarded)archiveTo(i,c.shrink2);
 for(const i of trace.steps[2].ids)add(i,c.shrink2,one[i],27);
 add(trace.steps[2].mid,c.mid3,left3,24);
 reflow(ids,c.trail-28,overview,28,'y');reflow(ids,c.rule,archive,27,'x');
 const targetKeys=[{at:c.pick1,to:right1,duration:23},{at:c.shrink1,to:{...right2,y:1140},duration:27},{at:c.mid2,to:right2,duration:22},{at:c.shrink2,to:{x:640,y:960,w:260,h:260},duration:27},{at:c.mid3,to:right3,duration:24},{at:c.trail-28,to:{x:720,y:1100,w:210,h:205},duration:28},{at:c.rule,to:{x:800,y:1430,w:140,h:83},duration:27}];
 const bounds=[{at:c.bounds,to:boxAround(Object.values(overview)),duration:18},{at:c.mid1-12,to:boxAround(Object.values(row)),duration:48},{at:c.shrink1,to:boxAround(Object.values(remaining)),duration:30},{at:c.shrink2,to:boxAround(Object.values(one)),duration:27}];
 return{trace,ids,overview,row,archive,remaining,one,tileKeys,targetInitial,targetKeys,bounds,left1,left2,left3};
}
export function sampleChoreography(model,frame){return Object.fromEntries(model.ids.map(id=>[id,poseAt(frame,model.overview[id],model.tileKeys[id]) ]));}
