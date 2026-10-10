/* Small explanatory compositions inspired by the supplied mindmap part vocabulary.
   This module is independent of its big-canvas format, camera, fonts and pipeline. */
window.InkVisuals={build(parent,spec,{tl,cue,enter,jobs,revealCues,useHand,end}){
 const ns='http://www.w3.org/2000/svg',stage=document.createElement('div');stage.className='block ink-diagram';stage.dataset.kind=spec.kind;parent.append(stage);
 const nodes=new Map(),count=spec.items.length,kind=spec.kind,H=kind==='loop'?620:kind==='tree'?440:kind==='cards'?Math.ceil(count/2)*178+30:310;
 stage.style.height=H+'px';stage.setAttribute('role','group');stage.setAttribute('aria-label',spec.label);
 const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox',`0 0 900 ${H}`);svg.classList.add('ink-diagram-lines');svg.setAttribute('aria-hidden','true');stage.append(svg);
 const positions=spec.items.map((item,i)=>{
  if(kind==='tree')return i?{x:900*(i-.5)/(count-1),y:320,w:Math.min(220,800/(count-1)),h:160}:{x:450,y:90,w:270,h:160};
  if(kind==='loop'){const a=-Math.PI/2+i*Math.PI*2/count;return{x:450+285*Math.cos(a),y:310+205*Math.sin(a),w:205,h:106};}
  if(kind==='cards')return{x:225+(i%2)*450,y:95+Math.floor(i/2)*178,w:375,h:160};
  return{x:900*(i+.5)/count,y:160,w:Math.min(245,810/count),h:160};
 });
 const path=(d,cls)=>{const p=document.createElementNS(ns,'path');p.setAttribute('d',d);p.setAttribute('class',cls);svg.append(p);return p;};
 const route=(a,b)=>{
  const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;
  const inset=n=>Math.min(n.w/2/Math.max(Math.abs(ux),.001),n.h/2/Math.max(Math.abs(uy),.001))+10;
  const s=inset(a),e=inset(b),x0=a.x+ux*s,y0=a.y+uy*s,x1=b.x-ux*e,y1=b.y-uy*e;
  return`M${x0} ${y0} L${x1} ${y1} M${x1-ux*15-uy*8} ${y1-uy*15+ux*8} L${x1} ${y1} L${x1-ux*15+uy*8} ${y1-uy*15-ux*8}`;
 };
 if(kind==='tree')positions.slice(1).forEach(p=>path(route(positions[0],p),'ink-ghost-link'));
 if(kind==='loop')positions.forEach((p,i)=>path(route(p,positions[(i+1)%count]),'ink-ghost-link'));
 spec.items.forEach((item,i)=>{
  const pos=positions[i],el=document.createElement('div');el.className='ink-diagram-node';el.dataset.node=item.id;if(item.value!=null)el.classList.add('has-value');
  Object.assign(el.style,{left:pos.x-pos.w/2+'px',top:pos.y-pos.h/2+'px',width:pos.w+'px',height:pos.h+'px'});stage.append(el);
  if(item.src){const img=document.createElement('img');img.src=item.src;img.alt=item.alt||'';el.append(img);el.classList.add('has-asset');}
  const label=document.createElement('div');label.className='ink-node-label';label.textContent=item.label;el.append(label);
  const value=document.createElement('div');value.className='ink-node-value';value.textContent=item.value??'';el.append(value);nodes.set(item.id,{...pos,el,label,value,marks:[]});
 });
 const at=cue(spec);stage.dataset.cue=String(at);enter(stage,at);revealCues.push(at);
 const pointer=document.createElement('div');pointer.className='ink-diagram-pointer';pointer.textContent='↑';stage.append(pointer);gsap.set(pointer,{autoAlpha:0,x:0,y:0});
 let selected=null,lastPointer={x:0,y:0},lastTime=at;
 for(const event of spec.events||[]){
  const t=cue(event);if(t<at+.35||t+.4>end)throw Error('Diagram event needs time after its reveal and before scene end');
  if(t<lastTime)throw Error('Diagram events must be ordered by cue');lastTime=t;revealCues.push(t);
  const node=nodes.get(event.target),duration=Math.min(event.duration??.65,end-t-.2);
  if(event.action==='focus'){
   if(selected)tl.to(selected.el,{backgroundColor:'#fffefa',borderColor:'#adb4db',duration:.2},t);
   tl.to(node.el,{backgroundColor:'#fff1a6',borderColor:'#1a237e',duration:.2},t);
   const point={x:node.x-24,y:node.y+node.h/2+4};
   tl.fromTo(pointer,{...lastPointer,autoAlpha:selected?1:0},{...point,autoAlpha:1,duration:.3,ease:'power2.inOut',immediateRender:false},t);lastPointer=point;selected=node;
  }else if(event.action==='update'){
   node.el.classList.add('has-value');const replacement=document.createElement('div');replacement.className='ink-node-value';replacement.textContent=event.value;node.el.append(replacement);gsap.set(replacement,{opacity:0});
   tl.to(node.value,{opacity:0,duration:.16},t);tl.fromTo(replacement,{opacity:0},{opacity:1,duration:.2,immediateRender:false},t+.12);node.value=replacement;
  }else if(event.action==='clear'){
   node.marks.forEach(mark=>tl.to(mark,{opacity:0,duration:.2},t));
  }else{
   let d;
   if(event.action==='arrow')d=route(nodes.get(event.from),nodes.get(event.to));
   else if(event.action==='circle'){const rx=node.w/2+15,ry=node.h/2+14;d=`M${node.x+rx} ${node.y} A${rx} ${ry} 0 1 1 ${node.x-rx} ${node.y} A${rx} ${ry} 0 1 1 ${node.x+rx} ${node.y}`;}
   else if(event.action==='strike')d=`M${node.x-node.w/2+8} ${node.y+8} L${node.x+node.w/2-8} ${node.y-8}`;
   else d=`M${node.x-node.w/2+8} ${node.y+node.h/2+10} Q${node.x} ${node.y+node.h/2+18} ${node.x+node.w/2-8} ${node.y+node.h/2+10}`;
   const ink=path(d,'ink-annotation');ink.style.opacity='0';(node||nodes.get(event.to)).marks.push(ink);
   if(useHand&&event.hand!==false)jobs.push({kind:'path',path:ink,at:t,duration});
   else{const len=ink.getTotalLength();gsap.set(ink,{strokeDasharray:len,strokeDashoffset:len});tl.set(ink,{opacity:1},t);tl.fromTo(ink,{strokeDashoffset:len},{strokeDashoffset:0,duration,ease:'none',immediateRender:false},t);}
  }
 }
 return stage;
}};
