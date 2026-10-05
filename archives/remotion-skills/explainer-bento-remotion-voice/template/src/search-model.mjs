export function binarySearch(values,target){
 if(!Array.isArray(values)||!values.length||values.length>8||values.some(v=>!Number.isFinite(v))||!Number.isFinite(target))throw Error('Use 1–8 finite numeric values');
 if(values.some((v,i)=>i>0&&v<values[i-1]))throw Error('Binary search needs sorted values');
 const steps=[];let left=0,right=values.length-1;
 while(left<=right){const mid=Math.floor((left+right)/2),value=values[mid],relation=value===target?'=':value<target?'<':'>';
  const nextLeft=relation==='<'?mid+1:left,nextRight=relation==='>'?mid-1:right;
  steps.push({left,right,mid,value,relation,ids:Array.from({length:right-left+1},(_,i)=>left+i),discarded:relation==='<'?Array.from({length:mid-left+1},(_,i)=>left+i):relation==='>'?Array.from({length:right-mid+1},(_,i)=>mid+i):[],nextLeft,nextRight});
  if(relation==='=')return{steps,index:mid};left=nextLeft;right=nextRight;
 }
 return{steps,index:-1};
}
export function scoredSearch(example){const trace=binarySearch(example.values,example.target);if(trace.steps.length!==3||trace.index<0||trace.steps[2].ids.length!==1)throw Error('This voice score requires a successful three-comparison search ending in one candidate. Re-author score/audio for other traces.');return trace;}
