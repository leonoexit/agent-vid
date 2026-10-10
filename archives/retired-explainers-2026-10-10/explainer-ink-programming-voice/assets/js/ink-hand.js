/* Native-font wipes and annotation strokes share one pen schedule.
   A cue is never delayed to wait for the hand. Content wins over the effect. */
window.InkHand={schedule(tl,page,jobs,end){
 if(!jobs.length)return;
 const segments=[],report=window.INK_REVIEW||(window.INK_REVIEW=[]);
 jobs.sort((a,b)=>a.at-b.at);
 const prepared=jobs.map((job,j)=>{
  const room=Math.min(jobs[j+1]?.at??end-.65,job.until??end-.65)-job.at-.18;
  if(job.kind==='path'){
   const duration=Math.min(job.duration??.7,room);
   const mode=duration>=.18?'path':'reveal';
   report.push({section:page.dataset.section,mode,start:job.at,end:job.at+Math.max(0,duration),deadline:job.until,reason:mode==='reveal'?'crowded annotation cue':undefined});
   return{...job,duration,mode};
  }
  const count=[...new Intl.Segmenter('vi',{granularity:'grapheme'}).segment(job.target.textContent)].filter(x=>!/^\s+$/.test(x.segment)).length;
  const duration=Math.min(2.4,job.duration??Math.max(1.6,count*.25),room);
  if(!count||count>32||duration<Math.max(.7,count*.065)){
   job.host.dataset.inkMode='reveal';tl.fromTo(job.host,{opacity:0},{opacity:1,duration:.25,immediateRender:false},job.at);
   report.push({section:page.dataset.section,mode:'reveal',start:job.at,reason:'long text or insufficient writing time'});return null;
  }
  gsap.set(job.host,{y:0});job.host.dataset.inkMode='wave';job.target.classList.add('ink-wave-text');
  return{...job,duration};
 }).filter(Boolean);
 const origin=page.getBoundingClientRect();
 prepared.forEach(job=>{
  if(job.kind==='path'){
   const path=job.path,len=path.getTotalLength();gsap.set(path,{opacity:0,strokeDasharray:len,strokeDashoffset:len});
   if(job.mode==='reveal'){tl.set(path,{opacity:1,strokeDashoffset:0},job.at);return;}
   const m=path.getScreenCTM();
   tl.set(path,{opacity:1},job.at);tl.fromTo(path,{strokeDashoffset:len},{strokeDashoffset:0,duration:job.duration,ease:'none',immediateRender:false},job.at);
   segments.push({start:job.at,end:job.at+job.duration,point:u=>{const p=path.getPointAtLength(len*u);return{x:m.a*p.x+m.c*p.y+m.e-origin.left,y:m.b*p.x+m.d*p.y+m.f-origin.top};}});return;
  }
  const {host,target,at,duration}=job,box=target.getBoundingClientRect(),fs=parseFloat(getComputedStyle(target).fontSize),pad=fs*.22,lines=[];
  const walker=document.createTreeWalker(target,NodeFilter.SHOW_TEXT);let node;
  while((node=walker.nextNode()))for(const g of new Intl.Segmenter('vi',{granularity:'grapheme'}).segment(node.textContent)){
   if(/^\s+$/.test(g.segment))continue;const range=document.createRange();range.setStart(node,g.index);range.setEnd(node,g.index+g.segment.length);const r=range.getBoundingClientRect();if(!r.width)continue;
   let line=lines.find(l=>Math.abs(l.top-r.top)<fs*.2);
   if(!line){line={top:r.top,bottom:r.bottom,left:r.left,right:r.right};lines.push(line);}else{line.left=Math.min(line.left,r.left);line.right=Math.max(line.right,r.right);line.bottom=Math.max(line.bottom,r.bottom);}
  }
  lines.sort((a,b)=>a.top-b.top);
  const lift=.18,writeTime=duration-lift*(lines.length-1),totalWidth=lines.reduce((s,l)=>s+l.right-l.left+pad,0);
  if(!lines.length||writeTime<.3){host.dataset.inkMode='reveal';tl.fromTo(host,{opacity:0},{opacity:1,duration:.25,immediateRender:false},at);return;}
  tl.set(host,{opacity:1,y:0},at);
  const polygon=(i,x)=>{const top=i?((lines[i-1].bottom+lines[i].top)/2-box.top):-pad,bottom=i<lines.length-1?((lines[i].bottom+lines[i+1].top)/2-box.top):box.height+pad;return`polygon(${-pad}px ${-pad}px,${box.width+pad}px ${-pad}px,${box.width+pad}px ${top}px,${x}px ${top}px,${x}px ${bottom}px,${-pad}px ${bottom}px)`;};
  gsap.set(target,{clipPath:polygon(0,-pad)});let cursor=at;
  lines.forEach((line,i)=>{
   const startX=line.left-box.left-pad*.4,endX=line.right-box.left+pad*.6,width=endX-startX,dur=writeTime*width/totalWidth,amplitude=Math.min(11,Math.max(4,fs*.095)),wavelength=fs*.52;
   if(i)cursor+=lift;
   tl.fromTo(target,{clipPath:polygon(i,startX)},{clipPath:polygon(i,endX),duration:dur,ease:'none',immediateRender:false},cursor);
   segments.push({start:cursor,end:cursor+dur,point:u=>({x:box.left-origin.left+startX+width*u,y:line.bottom-origin.top-fs*.7+amplitude*Math.sin(width*u/wavelength*Math.PI*2)})});cursor+=dur;
  });
  tl.set(target,{clipPath:'none'},cursor);report.push({section:page.dataset.section,mode:'wave',start:at,end:cursor,deadline:job.until});
 });
 const rig=window.InkPen.install(tl,page,segments,end);if(rig)page.inkPen=rig;
}};
