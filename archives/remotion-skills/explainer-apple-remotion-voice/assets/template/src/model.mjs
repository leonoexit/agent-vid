import {progress} from './timeline.mjs';
export const COPY_FRAMES=42;
export function validateExample(example){
 if(!Number.isFinite(example.initial)||!Number.isFinite(example.replacement))throw Error('Number assignment needs finite numbers');
 if(example.initial===example.replacement)throw Error('Choose distinct numbers to make the change visible');
 return example;
}
export function assignmentState(frame,cues,example){
 validateExample(example);
 for(const id of ['createX','copyStart','changeX'])if(!Number.isFinite(cues[id]))throw Error(`Missing action cue: ${id}`);
 if(cues.copyStart<cues.createX+20||cues.changeX<cues.copyStart+COPY_FRAMES+20)throw Error('Actions overlap; leave time to read the committed state');
 const copyEnd=cues.copyStart+COPY_FRAMES;
 return {x:frame<cues.createX?null:frame<cues.changeX?example.initial:example.replacement,
  y:frame<copyEnd?null:example.initial,
  copying:frame>=cues.copyStart&&frame<copyEnd,
  copyProgress:progress(frame,cues.copyStart,COPY_FRAMES),
  changeProgress:progress(frame,cues.changeX,14),
  copied:frame>=copyEnd,changed:frame>=cues.changeX};
}
