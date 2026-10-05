import {cameraAt} from './camera.mjs';
import {studyState} from './camera-study.mjs';
import {progress} from './timeline.mjs';
// Same world/action model, different shot composition. No object relocation.
export function openStudyState(frame,timeline,example){
 const state=studyState(frame,timeline,example),c=timeline.cues;
 const arrival=c.compare-12,travelDuration=Math.max(18,arrival-c.travel);
 const close=progress(frame,arrival-15,24),ending=progress(frame,c.prune,28);
 const camera=cameraAt(frame,{x:865,y:1000,zoom:.50,roll:0},[
  {at:c.inspect,duration:28,to:{x:425,y:280,zoom:1.13,roll:0}},
  {at:c.travel,duration:travelDuration,to:{x:1325,y:1120,zoom:1.4,roll:0}},
  {at:c.prune,duration:28,to:{x:425,y:1940,zoom:1.16,roll:0}},
 ]);
 const headingOut=1-progress(frame,c.travel-7,17);
 const leaving=progress(frame,c.prune,10);
 const comparisonIn=progress(frame,arrival+3,15)*(1-leaving);
 return {...state,camera,close,ending,headingOut,comparisonIn,
  presentation:{source:1-close,compare:1,result:1-close+close*progress(frame,c.prune+8,16),connections:1-close,compareShell:1-close,resultShell:1-leaving},
  resultHeading:progress(frame,c.prune+18,14),
 };
}
