import React from 'react';
export function Captions({section,frame,aliases={}}){
 const words=section.words;
 const index=words.findIndex((w,i)=>frame>=w.startFrame&&frame<(words[i+1]?.startFrame??w.endFrame+7));
 if(index<0)return null;
 const groups=[];let group=[];
 words.forEach((w,i)=>{group.push({...w,index:i});if(group.length>=7||/[.!?,;:]$/.test(w.w)){groups.push(group);group=[];}});if(group.length)groups.push(group);
 return <div className="captions">{groups.find(g=>g.some(w=>w.index===index))?.map(w=><span key={w.index} style={{color:w.index===index?'#0071e3':'#54545b'}}>{w.w.replace(/^(\p{L}+)(.*)$/u,(_,word,tail)=>(aliases[word]??word)+tail)} </span>)}</div>;
}
