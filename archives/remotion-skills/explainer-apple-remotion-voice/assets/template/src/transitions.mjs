import {progress} from './timeline.mjs';
export function sectionLayers(frame,sections,frames=16){
 const half=frames/2;
 return sections.map((section,i)=>{
  const enter=i===0?1:progress(frame,section.start-half,frames);
  const exit=i===sections.length-1?1:1-progress(frame,sections[i+1].start-half,frames);
  const opacity=enter*exit;
  return {section,opacity,textOpacity:progress(opacity,.5,.5)};
 }).filter(x=>x.opacity>0);
}
const mix=(a,b,p)=>Object.fromEntries(Object.keys(b).map(k=>[k,a[k]+(b[k]-a[k])*p]));
export function poseAt(frame,initial,keys){
 let from=initial,active=null;
 for(const key of keys){
  if(frame<key.at)break;
  if(active)from=mix(from,active.to,progress(key.at,active.at,active.duration));
  active=key;
 }
 return active?mix(from,active.to,progress(frame,active.at,active.duration)):initial;
}
export function glyphState(frame,initial,keys){
 let value=initial,previous=initial,blend=1;
 for(const key of keys){if(frame<key.at)break;previous=value;value=key.value;blend=progress(frame,key.at,key.duration??12);}
 return {value,previous,blend};
}
