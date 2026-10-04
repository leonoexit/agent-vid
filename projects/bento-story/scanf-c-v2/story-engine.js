// Paused timeline: identities persist, operations move data, every state is reversible by seeking.
(() => {
 const S=window.SCRIPT,P=window.PLAN,tl=gsap.timeline({paused:true}),en=S.language==='en';
 document.documentElement.lang=en?'en':'vi';
 const add=(tag,cls,parent,value)=>{const el=document.createElement(tag);el.className=cls;if(value!=null)el.textContent=value;parent.appendChild(el);return el;};
 const stage=document.getElementById('stage'),world=document.getElementById('world');
 const headings=new Map();
 const sections=new Map(P.sections.map(s=>[s.id,s]));
 document.getElementById('brand').textContent=S.brand||'AGENTVID';document.getElementById('series').textContent=S.series||(en?'ONE IDEA AT A TIME':'TỪNG BƯỚC MỘT');
 const norm=v=>(String(v).normalize('NFC').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[]);
 function cue(event,s,vo){
  if(event.at!=null){if(event.at<0||event.at>=s.dur-.3)throw Error(`Cue outside ${s.id}`);return s.start+event.at;}
  const needle=norm(event.on),words=(s.words||[]).flatMap(w=>norm(w.w).map(token=>({token,t:w.t0})));
  const source=words.length?words:norm(vo).map((token,i,a)=>({token,t:s.start+.65+(s.dur-2)*i/a.length}));let n=event.occurrence||1;
  for(let i=0;i<=source.length-needle.length;i++)if(needle.length&&needle.every((x,j)=>x===source[i+j].token)&&!--n)return source[i].t;
  throw Error(`Missing phrase "${event.on}" in ${s.id}`);
 }
 const enter=(el,at,delay=0)=>tl.fromTo(el,{opacity:0,y:25},{opacity:1,y:0,duration:.55,ease:'power2.out'},at+delay);
 function heading(content,s,i,hero=false){
  const r=add('div','scene tone-'+(content.tone||(hero?'yellow':'blue'))+(hero?' hero':''),stage);tl.set(r,{visibility:'visible'},s.start);tl.fromTo(r,{opacity:0},{opacity:1,duration:.4},s.start);
  const last=s.id==='outro';if(!last){tl.to(r,{opacity:0,duration:.3},s.start+s.dur-.3);tl.set(r,{visibility:'hidden'},s.start+s.dur);}
  enter(add('div','kicker',r,content.kicker||(hero?S.kicker:`${en?'STEP':'BƯỚC'} ${String(i).padStart(2,'0')}`)),s.start,.1);
  const copy=add('div','heading-copy',r);
  enter(add('h1','scene-title',copy,content.title),s.start,.15);
  const slots={subtitle:add('div','scene-subtitle',copy),takeaway:add('div','takeaway',r)};headings.set(s.id,slots);
  if(content.subtitle)textBeat(slots.subtitle,content.subtitle,content.subtitleOn?cue({on:content.subtitleOn},s,content.vo):s.start+.4);
  if(content.after){const at=content.afterOn?cue({on:content.afterOn},s,content.vo):s.start+Math.max(1.5,s.dur-3);textBeat(slots.takeaway,content.after,at);}
  tl.set(document.getElementById('page-badge'),{textContent:String(i).padStart(2,'0')},s.start);return r;
 }
 function textBeat(slot,text,at){
  const el=add('span','text-beat',slot,text);el.dataset.at=at;el.style.visibility='hidden';
  tl.set(slot,{visibility:'visible'},at);tl.set(el,{visibility:'visible'},at);enter(el,at);
 }
 function hero(content,id,i){const s=sections.get(id),r=heading(content,s,i,true),art=add('div','hero-art',r);
  const mascot=add('img','hero-mascot',r);mascot.src=S.stickers.find(st=>st.id===(id==='intro'?'reader-curious':'reader-pleased')).image;mascot.alt='Robot hướng dẫn';enter(mascot,s.start,.45);
  const a=add('div','hero-tile',art);add('strong','',a,content.tiles[0].value);add('span','',a,content.tiles[0].label);
  const arrow=add('div','hero-arrow',art,content.connector||'→'),b=add('div','hero-tile',art);add('strong','',b,content.tiles[1].value);add('span','',b,content.tiles[1].label);
  enter(a,content.tiles[0].on?cue({on:content.tiles[0].on},s,content.vo):s.start+.7);enter(arrow,content.connectorOn?cue({on:content.connectorOn},s,content.vo):s.start+1);enter(b,content.tiles[1].on?cue({on:content.tiles[1].on},s,content.vo):s.start+1.2);if(content.note)enter(add('div','hero-note',r,content.note),content.noteOn?cue({on:content.noteOn},s,content.vo):s.start+1.5);
 }
 hero(S.intro,'intro',0);
 const nodes=new Map(),positions=new Map();
 (S.entities||[]).forEach(n=>{
  const el=add('div','entity '+n.kind+' tone-'+(n.tone||({box:'yellow',ticket:'orange',reader:'blue'}[n.kind]||'white')),world);el.dataset.entity=n.id;Object.assign(el.style,{left:n.x+'px',top:n.y+'px',width:n.width+'px',height:n.height+'px'});
  const label=add('div','entity-label',el,n.label),value=add('div','entity-value'+(n.value.length>4?' long':''),el,n.value),detail=add('div','entity-detail',el,n.detail||''),address=add('div','entity-address',el,n.address||'');
  if(!n.address)address.style.opacity=0;
  const fields={label,value,detail,address};(n.hiddenFields||[]).forEach(k=>fields[k].style.visibility='hidden');
  const lid=n.kind==='box'?add('div','lid',el):null;
  if(n.image){el.classList.add('has-illustration');const img=add('img','',el);img.src=n.image;img.alt=n.alt||n.label;}
  nodes.set(n.id,{el,label,value,detail,address,lid});positions.set(n.id,{x:n.x,y:n.y,width:n.width,height:n.height});
 });
 const stickers=new Map();
 (S.stickers||[]).forEach(st=>{
  const el=add('img','sticker',world);el.dataset.sticker=st.id;el.alt=st.alt||'';el.src=st.image;
  el.dataset.layoutAllowOverlap='true';el.dataset.layoutAllowOcclusion='true';
  Object.assign(el.style,{left:st.x+'px',top:st.y+'px',width:st.width+'px',height:st.height+'px'});
  el.style.transform=`rotate(${st.rotation||0}deg)`;stickers.set(st.id,el);
  const showSticker=(section,start,end)=>{
   const rotation=st.rotation||0;
   tl.set(el,{visibility:'visible'},start);
   tl.fromTo(el,{opacity:0,scale:.86,rotation:rotation-4},{opacity:.7,scale:1,rotation,duration:.5,ease:'power2.out',immediateRender:false},start);
   tl.to(el,{y:-4,rotation:rotation+2,duration:1.8,ease:'sine.inOut',repeat:1,yoyo:true},start+.5);
   tl.to(el,{opacity:0,duration:.35},end-.35);tl.set(el,{visibility:'hidden',y:0,rotation},end);
  };
  if(st.manual)return;
  if(Array.isArray(st.scenes)){
   st.scenes.forEach(number=>{const section=sections.get(`scene-${number}`);if(section)showSticker(section,section.start+.25,section.start+section.dur);});
  }else{
   const end=Math.max(0,P.total-.4);showSticker(sections.get('intro'),0,end);
  }
 });
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 860 570');svg.classList.add('connections');world.prepend(svg);
 const code=document.getElementById('code-strip');let currentCode=null;const fieldChanges=[];
 function field(node,key,value,at){fieldChanges.push({node,key,value,at});}

 function transfer(event,at,section){
  const p=positions.get(event.to),from=event.from?positions.get(event.from):{x:360,y:490,width:100,height:50};
  const token=add('div','moving-token '+(event.type==='write'?'write':event.field==='address'?'':'read'),world,event.value);
  token.dataset.layoutAllowOverlap='true';token.dataset.layoutAllowOcclusion='true';
  const start={x:from.x+from.width/2-65,y:from.y+from.height*(event.field==='address'?.8:.48)-30},end={x:p.x+p.width/2-65,y:p.y+p.height*.48-30};
  const dur=event.duration||1.05;if(at+dur+.3>section.start+section.dur)throw Error('Transfer needs a longer hold');
  tl.set(token,{visibility:'visible'},at);tl.fromTo(token,{...start,opacity:1,scale:.85},{...end,opacity:1,scale:1,duration:dur,ease:'power2.inOut',immediateRender:false},at);
  tl.to(token,{opacity:0,scale:.85,duration:.2},at+dur);tl.set(token,{visibility:'hidden'},at+dur+.2);
  if(event.commit!==false){field(nodes.get(event.to),event.commitField||'value',event.value,at+dur);tl.set(nodes.get(event.to).value,{opacity:1},at+dur);}
  tl.fromTo(nodes.get(event.to).el,{scale:1},{scale:1.035,duration:.18,repeat:1,yoyo:true,immediateRender:false},at+dur);
 }
 function connection(event,at){
  const a=positions.get(event.from),b=positions.get(event.to);const x1=a.x+a.width/2,y1=a.y+a.height+12,x2=b.x+b.width/2,y2=b.y+b.height+12;
  const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',`M${x1} ${y1} V${Math.max(y1,y2)+50} H${x2} V${y2} m-11 14 11-14 11 14`);path.setAttribute('fill','none');path.setAttribute('stroke','#2d3436');path.setAttribute('stroke-width','5');path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');path.setAttribute('pathLength','100');path.style.visibility='hidden';svg.appendChild(path);
  tl.set(path,{visibility:'visible'},at);tl.fromTo(path,{strokeDasharray:100,strokeDashoffset:100},{strokeDashoffset:0,duration:.85,ease:'none',immediateRender:false},at);
  if(event.persist===false){tl.to(path,{opacity:0,duration:.2},at+1.1);tl.set(path,{visibility:'hidden'},at+1.3);}
 }
 function spotlight(event,at){
  const dim=event.dim==null?.3:event.dim;
  nodes.forEach(({el},id)=>tl.to(el,{opacity:event.targets.includes(id)?1:dim,duration:.35,ease:'power2.out'},at));
 }
 function pulse(event,at){
  const n=nodes.get(event.target);if(!n)return;
  tl.fromTo(n.el,{scale:1},{scale:event.scale||1.06,duration:event.duration||.25,repeat:1,yoyo:true,ease:'power1.inOut',immediateRender:false},at);
 }
 function apply(event,s,vo){const at=cue(event,s,vo),n=nodes.get(event.target);
  switch(event.type){
   case 'text':textBeat(headings.get(s.id)[event.slot],event.text,at);break;
   case 'reveal':(event.fields||['value']).forEach(k=>{tl.set(n[k],{visibility:'visible'},at);tl.fromTo(n[k],{opacity:0,y:12},{opacity:1,y:0,duration:.4,immediateRender:false},at);});break;
   case 'sticker':{
    const el=stickers.get(event.target);if(event.action==='hide'){tl.to(el,{opacity:0,duration:.3},at);tl.set(el,{visibility:'hidden'},at+.3);}
    else if(event.action==='react'){const rot=(S.stickers.find(x=>x.id===event.target).rotation||0);tl.fromTo(el,{rotation:rot,scale:1},{rotation:rot+8,scale:1.05,duration:.22,repeat:1,yoyo:true,immediateRender:false},at);}
    else {tl.set(el,{visibility:'visible'},at);tl.fromTo(el,{opacity:0,scale:.8},{opacity:1,scale:1,duration:.45,immediateRender:false},at);}break;
   }
   case 'code-focus':if(!currentCode)throw Error('code-focus requires an earlier code panel');if(!currentCode.children[event.active+1]||Number(currentCode.children[event.active+1].dataset.revealAt)>at)throw Error('code-focus requires an existing visible line');[...currentCode.querySelectorAll('.code-line')].forEach((el,i)=>tl.set(el,{className:'code-line'+(i===event.active?' active':'')},at));break;
   case 'show':tl.set(n.el,{visibility:'visible',display:'block'},at);tl.fromTo(n.el,{opacity:0,scale:.8,y:40},{opacity:1,scale:1,y:0,duration:.6,ease:'power2.out',immediateRender:false},at);break;
   case 'hide':tl.to(n.el,{opacity:0,duration:.4},at);tl.set(n.el,{visibility:'hidden',display:'none'},at+.4);break;
   case 'open':tl.to(n.lid,{y:-55,rotation:-8,duration:.65,ease:'power2.inOut'},at);tl.to(n.value,{opacity:1,duration:.4},at+.25);break;
   case 'focus':nodes.forEach(({el},id)=>tl.set(el,{outlineWidth:event.targets.includes(id)?4:0},at));break;
   case 'spotlight':spotlight(event,at);break;
   case 'pulse':pulse(event,at);break;
   case 'set':for(const key of ['label','value','detail','address'])if(event[key]!=null)field(n,key,event[key],at);break;
   case 'morph':if(n.lid)tl.to(n.lid,{opacity:0,duration:.5},at);tl.to(n.el,{borderRadius:32,rotation:0,borderStyle:'solid',borderColor:'#2d3436',backgroundColor:'#ffffff',color:'#2d3436',duration:.8},at);for(const key of ['label','detail','value','address'])if(event[key]!=null)field(n,key,event[key],at+.4);break;
   case 'move':tl.to(n.el,{left:event.x,top:event.y,rotation:event.rotation||0,duration:.85,ease:'power2.inOut'},at);positions.set(event.target,{...positions.get(event.target),x:event.x,y:event.y});break;
   case 'transfer':case 'write':transfer(event,at,s);break;
   case 'connect':connection(event,at);break;
   case 'code':{
    const panel=add('div','code-content',code);add('div','code-label',panel,event.label||(en?'WORKED EXAMPLE':'VÍ DỤ C'));
    event.lines.forEach((line,i)=>{const el=add('div','code-line'+(i===event.active?' active':''),panel,line);el.dataset.revealAt=at;if(event.lineCues?.[i]){el.style.visibility='hidden';const t=cue({on:event.lineCues[i]},s,vo);el.dataset.revealAt=t;if(t<at)throw Error('Code line cue precedes panel');tl.set(el,{visibility:'visible'},t);tl.fromTo(el,{x:16},{x:0,duration:.4,immediateRender:false},t);}});currentCode=panel;
    tl.set(code,{visibility:'visible',display:'block'},at);tl.set(panel,{visibility:'visible',display:'block'},at);tl.fromTo(panel,{y:25},{y:0,duration:.55,ease:'power2.out'},at);
    // Each panel owns its interval, including reverse seeks.
    panel.dataset.at=at;break;
   }
  }
 }
 S.scenes.forEach((sc,i)=>{const s=sections.get(`scene-${i+1}`);heading(sc,s,i+1);nodes.forEach(({el})=>tl.set(el,{opacity:1,outlineWidth:0},s.start));[...(sc.events||[])].sort((a,b)=>cue(a,s,sc.vo)-cue(b,s,sc.vo)).forEach(e=>apply(e,s,sc.vo));});
 // Explicit previous field values make arbitrary forward/reverse seeks deterministic.
 const previousFields=new Map();
 fieldChanges.sort((a,b)=>a.at-b.at).forEach(({node,key,value,at})=>{
  const el=node[key],previous=previousFields.has(el)?previousFields.get(el):el.textContent;
  tl.fromTo(el,{textContent:previous},{textContent:value,duration:0,immediateRender:false},at);
  if(key==='value')tl.fromTo(el,{className:'entity-value'+(String(previous).length>4?' long':'')},{className:'entity-value'+(String(value).length>4?' long':''),duration:0,immediateRender:false},at);
  if(key==='address')tl.fromTo(el,{opacity:previous?1:0},{opacity:value?1:0,duration:0,immediateRender:false},at);
  previousFields.set(el,value);
 });
 hero(S.outro,'outro',S.scenes.length+1);
 // Text alternatives reserve one stable slot and hide earlier text at the next cue.
 headings.forEach(slots=>Object.values(slots).forEach(slot=>{const beats=[...slot.children].sort((a,b)=>Number(a.dataset.at)-Number(b.dataset.at));beats.forEach((el,i)=>{if(beats[i+1])tl.set(el,{visibility:'hidden'},Number(beats[i+1].dataset.at));});}));
 const panels=[...code.children].sort((a,b)=>Number(a.dataset.at)-Number(b.dataset.at));panels.forEach((panel,i)=>{panel.style.visibility='hidden';panel.style.display='none';if(panels[i+1])tl.set(panel,{display:'none',visibility:'hidden'},Number(panels[i+1].dataset.at));});
 const end=sections.get('outro').start;tl.to(world,{opacity:0,duration:.4},end-.4);tl.set(world,{visibility:'hidden',display:'none'},end);tl.set(code,{visibility:'hidden',display:'none'},end);
 const band=document.getElementById('captions');if(!P.sections.some(s=>(s.words||[]).length))band.style.display='none';P.sections.forEach(s=>{
  const chunks=[];let line=[];(s.words||[]).forEach(w=>{if(line.length&&line.map(x=>x.w).join(' ').length+w.w.length+1>38){chunks.push(line);line=[];}line.push(w);});if(line.length)chunks.push(line);
  chunks.forEach((words,i)=>{const el=add('div','caption-line',band),start=Math.max(s.start,words[0].t0-.06),end=Math.min(s.start+s.dur,i+1<chunks.length?chunks[i+1][0].t0-.06:words.at(-1).t1+.25);tl.set(el,{opacity:1},start);tl.set(el,{opacity:0},end);words.forEach((w,j)=>{if(j)el.appendChild(document.createTextNode(' '));const span=add('span','caption-word',el,w.w);tl.set(span,{color:'#2d3436',backgroundColor:'#feee91',textDecoration:'underline',textUnderlineOffset:'8px'},w.t0);});});
 });
 tl.to(document.getElementById('progress-fill'),{width:'100%',duration:P.total,ease:'none'},0);window.StoryTimeline=tl;
})();
