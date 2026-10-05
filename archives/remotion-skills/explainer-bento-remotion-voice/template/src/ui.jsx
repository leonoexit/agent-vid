import React from 'react';
export const Panel=({children,className='',style={}})=><div className={`panel ${className}`} style={style}>{children}</div>;
export const Tag=({children,style={}})=><div className="tag" style={style}>{children}</div>;
export function Captions({section,frame}){
 const words=section.words; let index=words.findIndex((w,i)=>frame>=w.startFrame && frame<(words[i+1]?.startFrame??w.endFrame+7));
 if(index<0)return null;
 // Short stable groups; punctuation can close a phrase early.
 const groups=[];let g=[];
 words.forEach((w,i)=>{g.push({...w,index:i});if(g.length>=7 || /[.!?,;:]$/.test(w.w)){groups.push(g);g=[];}});if(g.length)groups.push(g);
 const group=groups.find(g=>g.some(w=>w.index===index));
 return <div className="captions">{group?.map(w=><span key={w.index} style={{background:w.index===index?'#feee91':'transparent'}}>{w.w} </span>)}</div>;
}
