/* One persistent paper world; camera arrival cues and content share the voice timeline. */
window.InkCanvas={async build(S,P){
 const tl=gsap.timeline({paused:true}),C=S.canvas,ns='http://www.w3.org/2000/svg',items=new Map(),jobs=[],cues=[],cameraMoves=[];
 const add=(tag,cls,parent,text)=>{const n=document.createElement(tag);n.className=cls;if(text!=null)n.textContent=text;parent.append(n);return n};
 const sections=[S.intro,...S.scenes,S.outro],timed=new Map(P.sections.map((p,i)=>[p.id,{p,c:sections[i]}]));
 const resolve=e=>{const pair=timed.get(e.section);if(!pair)throw Error('Unknown canvas section '+e.section);const {p,c}=pair;
  let t;if(e.at!=null)t=p.start+e.at;else{const norm=s=>String(s).normalize('NFC').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[],needle=norm(e.on);let occurrence=e.occurrence||1;
   let words=(p.words||[]).flatMap(w=>norm(w.w).map(token=>({token,t:w.t0})));
   if(!words.length){window.INK_PREVIEW_TIMING=true;words=norm(c.vo).map((token,i,a)=>({token,t:(p.voStart??p.start)+(p.voDur||p.dur-1)*i/a.length}));}
   for(let i=0;i<=words.length-needle.length;i++)if(needle.every((w,j)=>w===words[i+j].token)&&!--occurrence){t=words[i].t;break;}
  }if(!Number.isFinite(t)||t<p.start||t>=p.start+p.dur)throw Error('Invalid canvas cue '+JSON.stringify(e));return t;};
 const viewport=add('div','ink-canvas-viewport',document.getElementById('pages')),world=add('div','ink-world',viewport);world.dataset.section='canvas';world.setAttribute('data-layout-allow-overflow','');Object.assign(world.style,{width:C.width+'px',height:C.height+'px'});
 const svg=document.createElementNS(ns,'svg');svg.classList.add('ink-world-lines');svg.setAttribute('width',C.width);svg.setAttribute('height',C.height);world.append(svg);
 const path=d=>{const el=document.createElementNS(ns,'path');el.setAttribute('d',d);el.setAttribute('class','ink-world-path');svg.append(el);return el;};
 for(const item of C.items){const el=add('div','ink-world-item '+item.type,world);el.dataset.item=item.id;Object.assign(el.style,{left:item.x+'px',top:item.y+'px',width:item.w+'px',height:item.h+'px'});let target,value;
  if(item.type==='image'){target=add('img','',el);target.src=item.src;target.alt=item.alt;}
  else if(item.type==='card'){target=add('div','ink-world-label',el,item.label);value=add('div','ink-world-value',el,item.value);if(item.note)add('div','ink-world-note',el,item.note);}
  else{target=add('div','ink-world-copy '+(item.emphasis||''),el,item.text);if(item.fontSize)target.style.fontSize=item.fontSize+'px';}
  gsap.set(el,{opacity:0});items.set(item.id,{...item,el,target,value,marks:[],visibleAt:Infinity});
 }
 const centre=n=>({x:n.x+n.w/2,y:n.y+n.h/2});
 for(const link of C.links||[]){const a=items.get(link.from),b=items.get(link.to),A=centre(a),B=centre(b),dx=B.x-A.x,dy=B.y-A.y,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;
  const edge=n=>Math.min(n.w/2/Math.max(Math.abs(ux),.001),n.h/2/Math.max(Math.abs(uy),.001))+22;
  const sa=edge(a),sb=edge(b),x0=A.x+ux*sa,y0=A.y+uy*sa,x1=B.x-ux*sb,y1=B.y-uy*sb;
  const d=`M${x0} ${y0} L${x1} ${y1} M${x1-ux*24-uy*14} ${y1-uy*24+ux*14} L${x1} ${y1} L${x1-ux*24+uy*14} ${y1-uy*24-ux*14}`;
  const el=path(d);gsap.set(el,{opacity:0});items.set(link.id,{...link,el,path:el,marks:[]});
 }
 const keys=C.camera.map(k=>({...k,t:resolve(k),duration:k.duration??1.1})).sort((a,b)=>a.t-b.t);
 if(keys[0].t!==0)throw Error('Canvas first camera must be at intro 0');
 keys.forEach((k,i)=>{if(i&&k.t-k.duration<keys[i-1].t)throw Error('Overlapping camera travel');if(i)cameraMoves.push({start:k.t-k.duration,end:k.t});});
 const events=C.events.map(e=>({...e,t:resolve(e)})).sort((a,b)=>a.t-b.t);cues.push(...events.map(e=>e.t),...cameraMoves.map(m=>m.start));
 for(const e of events){const n=items.get(e.target),t=e.t,duration=e.duration??.65,{p,c}=timed.get(e.section);if(!n)throw Error('Unknown canvas target '+e.target);
  const until=Math.min(p.voDur?p.voStart+p.voDur:p.start+p.dur-.3,...cues.filter(x=>x>t+.001));
  if(e.action==='reveal'||e.action==='write'){
   n.visibleAt=Math.min(n.visibleAt,t);
   if(e.action==='write'&&['text','card'].includes(n.type)&&S.handwriting!==false&&c.handwriting!==false&&!cameraMoves.some(m=>t>=m.start&&t<m.end)){
    if(n.type==='card'){tl.to(n.el,{opacity:1,duration:.2},t);gsap.set(n.target,{opacity:0});}
    jobs.push({host:n.type==='card'?n.target:n.el,target:n.target,at:t,until,duration:e.duration});
   }
   else tl.to(n.el,{opacity:1,duration:.28},t);
  }else if(e.action==='update'){
   if(n.visibleAt>t)throw Error('Update before reveal '+e.target);
   const v=add('div','ink-world-value',n.el,e.value);gsap.set(v,{opacity:0});tl.to(n.value,{opacity:0,duration:.15},t);
   if(e.handwrite===true&&S.handwriting!==false&&c.handwriting!==false&&!cameraMoves.some(m=>t>=m.start&&t<m.end))jobs.push({host:v,target:v,at:t,until,duration:e.duration??.8});
   else tl.to(v,{opacity:1,duration:.22},t+.12);n.value=v;
  }else if(e.action==='focus'){
   if(n.visibleAt>t)throw Error('Focus before reveal '+e.target);
   tl.to(n.el,{backgroundColor:'#fff1a6',duration:.25},t);
  }else if(e.action==='dim'){tl.to(n.el,{opacity:.22,duration:.3},t);
  }else if(e.action==='clear')n.marks.forEach(mark=>tl.to(mark,{opacity:0,duration:.2},t));
  else{
   let ink=n.path;if(e.action==='circle'){const {x,y}=centre(n),rx=n.w/2+25,ry=n.h/2+25;ink=path(`M${x+rx} ${y} A${rx} ${ry} 0 1 1 ${x-rx} ${y} A${rx} ${ry} 0 1 1 ${x+rx} ${y}`);}
   if(!ink)throw Error('Draw requires a link');n.marks.push(ink);gsap.set(ink,{opacity:0});
   const hand=S.handwriting!==false&&c.handwriting!==false&&e.hand!==false&&!cameraMoves.some(m=>t>=m.start&&t<m.end);
   if(hand)jobs.push({kind:'path',path:ink,at:t,until,duration});
   else{const len=ink.getTotalLength();gsap.set(ink,{strokeDasharray:len,strokeDashoffset:len});tl.set(ink,{opacity:1},t);tl.to(ink,{strokeDashoffset:0,duration:Math.max(.01,Math.min(duration,until-t)),ease:'none'},t);}
  }
 }
 const heads=add('div','ink-canvas-headings',document.getElementById('explainer'));
 P.sections.forEach((p,i)=>{const h=add('div','ink-canvas-heading',heads,sections[i].title);gsap.set(h,{opacity:0});tl.to(h,{opacity:1,duration:.3},p.start);tl.to(h,{opacity:0,duration:.2},p.start+p.dur-.2);});
 await document.fonts.ready;await Promise.all([...world.querySelectorAll('img')].map(im=>im.decode()));
 window.InkHand.schedule(tl,world,jobs,P.total);await Promise.all([...world.querySelectorAll('.ink-writing-hand')].map(im=>im.decode()));
 const cameraAt=t=>{let prev=keys[0];for(const k of keys.slice(1)){if(t<k.t-k.duration)break;if(t<k.t){const u=(t-k.t+k.duration)/k.duration,v=u*u*(3-2*u);return {cx:prev.cx+(k.cx-prev.cx)*v,cy:prev.cy+(k.cy-prev.cy)*v,scale:prev.scale+(k.scale-prev.scale)*v};}prev=k;}return prev;};
 const apply=t=>{const k=cameraAt(t);world.style.transform=`translate(${540-k.cx*k.scale}px,${650-k.cy*k.scale}px) scale(${k.scale})`;};
 const proxy={t:0};tl.to(proxy,{t:P.total,duration:P.total,ease:'none',onUpdate:()=>apply(proxy.t)},0);apply(0);
 window.INK_CAMERA={keys,moves:cameraMoves,at:cameraAt};window.INK_CANVAS_EVENTS=events;
 const caps=document.getElementById('captions');for(const p of P.sections){const words=p.words||[];for(let j=0;j<words.length;j+=7){const group=words.slice(j,j+7),row=add('div','caption',caps);group.forEach(w=>{const span=add('span','',row,w.w);tl.set(span,{color:'#c0392b'},w.t0);tl.set(span,{color:'#30343b'},w.t1);});tl.set(row,{visibility:'visible'},group[0].t0);tl.set(row,{visibility:'hidden'},group.at(-1).t1);}}
 tl.set({}, {},P.total);tl.seek(.0001,false);tl.seek(0,false);window.InkTimeline=tl;window.__timelines={'ink-story':tl};return tl;
}};
