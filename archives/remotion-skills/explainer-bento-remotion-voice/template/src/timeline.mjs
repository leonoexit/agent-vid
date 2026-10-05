export const normalize = (s) => s.toLocaleLowerCase('vi').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
export const sectionList = (s) => [{...s.intro,id:'intro'},...s.scenes.map((v,i)=>({...v,id:`scene-${i+1}`})),{...s.outro,id:'outro'}];
export function compileTimeline(script,timings,fps=30) {
 const shots=sectionList(script), expected=['question','setup','decode','execute','verify','rule'];
 let phase=-1, cursor=0; const cues={}, sections=[];
 for(const shot of shots){
  const next=expected.indexOf(shot.phase);
  if(next<phase || next<0 || next>phase+1) throw Error(`Invalid narrative phase: ${shot.phase}`);
  phase=next;
  const audio=timings.sections.find(a=>a.id===shot.id);
  if(!audio || audio.text!==shot.vo || !audio.file || !(audio.duration>0)) throw Error(`Missing/stale audio: ${shot.id}`);
  let end=0;
  for(const w of audio.words){if(!(w.start>=end && w.end>w.start && w.end<=audio.duration+.02))throw Error(`Invalid words: ${shot.id}`);end=w.end;}
  const hold=shot.readingHold;
  if(hold && (!(hold.seconds>0 && hold.seconds<=3) || !hold.task))throw Error(`Reading hold needs a task and 0–3 seconds: ${shot.id}`);
  const lead=5, tail=6+Math.ceil((hold?.seconds||0)*fps), duration=lead+Math.ceil(audio.duration*fps)+tail;
  const words=audio.words.map(w=>({...w,startFrame:cursor+lead+Math.round(w.start*fps),endFrame:cursor+lead+Math.ceil(w.end*fps)}));
  for(const c of shot.cues||[]){
   if(cues[c.id]!==undefined)throw Error(`Duplicate cue ${c.id}`);
   const phrase=normalize(c.on).split(' '), tokens=audio.words.map(w=>normalize(w.w));
   const matches=tokens.flatMap((_,i)=>phrase.every((p,j)=>tokens[i+j]===p)?[i]:[]);
   const hit=matches[(c.occurrence||1)-1];
   if(hit===undefined || (matches.length>1&&!c.occurrence))throw Error(`Missing/ambiguous cue ${c.id}: ${c.on}`);
   cues[c.id]=cursor+lead+Math.round((audio.words[hit].start+(c.offsetSeconds||0))*fps);
   if(cues[c.id]<cursor || cues[c.id]>=cursor+duration)throw Error(`Cue outside section: ${c.id}`);
  }
  sections.push({...shot,start:cursor,duration,audioStart:cursor+lead,audioDuration:Math.ceil(audio.duration*fps),file:audio.file,words});cursor+=duration;
 }
 if(phase!==5)throw Error('Missing rule');
 return {fps,width:1080,height:1920,durationInFrames:cursor,cues,sections,timingMethod:'TTS pause-assisted estimates, not forced alignment'};
}
export function sectionAt(plan,frame){return plan.sections.find(s=>frame>=s.start && frame<s.start+s.duration)||plan.sections.at(-1);}
export const clamp=(v)=>Math.max(0,Math.min(1,v));
export function progress(frame,from,duration=20){const t=clamp((frame-from)/duration);return t*t*(3-2*t);}
export function track(frame,initial,keys){let v=initial;for(const k of keys){if(frame<k.at)break;const p=progress(frame,k.at,k.duration??20);v=v+(k.value-v)*p;}return v;}
