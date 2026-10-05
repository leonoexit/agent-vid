import {cameraAt} from './camera.mjs';
import {studyState,WIDE,SOURCE,COMPARE} from './camera-study.mjs';
import {progress} from './timeline.mjs';
// Framed navigation; release the frame only after the subject has settled.
export function guidedStudyState(frame,timeline,example){
 const state=studyState(frame,timeline,example),c=timeline.cues;
 const travelDuration=Math.max(18,c.compare-12-c.travel);
 const camera=cameraAt(frame,WIDE,[
  {at:c.inspect,duration:28,to:SOURCE},
  {at:c.travel,duration:travelDuration,to:COMPARE},
  {at:c.prune,duration:28,to:{x:425,y:1955,zoom:.99,roll:0}},
 ]);
 const emphasis=progress(frame,c.compare+10,18)*(1-progress(frame,c.prune-20,14));
 const ending=progress(frame,Math.max(c.next+4,c.prune+40),20);
 const release=Math.max(emphasis,ending);
 return {...state,camera,emphasis,ending,release,endingTitle:progress(frame,Math.max(c.next+4,c.prune+40)+10,12),
  viewport:{left:40-40*release,top:380,width:960+80*release,height:1190},
  presentation:{source:1-ending,compare:1-ending,resultShell:1-ending,connections:1-ending},
 };
}
