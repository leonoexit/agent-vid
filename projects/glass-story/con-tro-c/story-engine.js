// Paused timeline: identities persist, operations move data, every state is reversible by seeking.
(() => {
 const S=window.SCRIPT,P=window.PLAN,tl=gsap.timeline({paused:true}),en=S.language==='en';
 document.documentElement.lang=en?'en':'vi';
 const add=(tag,cls,parent,value)=>{const el=document.createElement(tag);el.className=cls;if(value!=null)el.textContent=value;parent.appendChild(el);return el;};
 const stage=document.getElementById('stage'),world=document.getElementById('world');
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
  const r=add('div','scene'+(hero?' hero':''),stage);tl.set(r,{visibility:'visible'},s.start);tl.fromTo(r,{opacity:0},{opacity:1,duration:.4},s.start);
  const last=s.id==='outro';if(!last){tl.to(r,{opacity:0,duration:.3},s.start+s.dur-.3);tl.set(r,{visibility:'hidden'},s.start+s.dur);}
  enter(add('div','kicker',r,content.kicker||(hero?S.kicker:`${en?'STEP':'BƯỚC'} ${String(i).padStart(2,'0')}`)),s.start,.1);
  enter(add('h1','scene-title',r,content.title),s.start,.15);if(content.subtitle)enter(add('div','scene-subtitle',r,content.subtitle),s.start,.4);
  if(content.after){const at=content.afterOn?cue({on:content.afterOn},s,content.vo):s.start+Math.max(1.5,s.dur-3);enter(add('div','takeaway',r,content.after),at);}
  tl.set(document.getElementById('page-badge'),{textContent:String(i).padStart(2,'0')},s.start);return r;
 }
 function hero(content,id,i){const s=sections.get(id),r=heading(content,s,i,true),art=add('div','hero-art',r);
  const a=add('div','hero-tile',art);add('strong','',a,content.tiles[0].value);add('span','',a,content.tiles[0].label);
  const arrow=add('div','hero-arrow',art,'→'),b=add('div','hero-tile',art);add('strong','',b,content.tiles[1].value);add('span','',b,content.tiles[1].label);
  enter(a,s.start,.7);enter(arrow,s.start,1);enter(b,s.start,1.2);if(content.note)enter(add('div','hero-note',r,content.note),s.start,1.5);
 }
 hero(S.intro,'intro',0);
 const nodes=new Map(),positions=new Map();
 (S.entities||[]).forEach(n=>{
  const el=add('div','entity '+n.kind,world);el.dataset.entity=n.id;Object.assign(el.style,{left:n.x+'px',top:n.y+'px',width:n.width+'px',height:n.height+'px'});
  const label=add('div','entity-label',el,n.label),value=add('div','entity-value'+(n.value.length>4?' long':''),el,n.value),detail=add('div','entity-detail',el,n.detail||''),address=add('div','entity-address',el,n.address||'');
  if(!n.address)address.style.opacity=0;
  const lid=n.kind==='box'?add('div','lid',el):null;
  if(n.image){const img=add('img','',el);img.src=n.image;img.alt=n.alt||n.label;}
  nodes.set(n.id,{el,label,value,detail,address,lid});positions.set(n.id,{x:n.x,y:n.y,width:n.width,height:n.height});
 });
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 860 570');svg.classList.add('connections');world.prepend(svg);
 const code=document.getElementById('code-strip');
 function field(node,key,value,at){tl.set(node[key],{textContent:value},at);if(key==='address')tl.set(node.address,{opacity:value?1:0},at);}
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
  const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',`M${x1} ${y1} V${Math.max(y1,y2)+50} H${x2} V${y2} m-11 14 11-14 11 14`);path.setAttribute('fill','none');path.setAttribute('stroke','#be123c');path.setAttribute('stroke-width','5');path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');path.setAttribute('pathLength','100');path.style.visibility='hidden';svg.appendChild(path);
  tl.set(path,{visibility:'visible'},at);tl.fromTo(path,{strokeDasharray:100,strokeDashoffset:100},{strokeDashoffset:0,duration:.85,ease:'none',immediateRender:false},at);
  if(event.persist===false){tl.to(path,{opacity:0,duration:.2},at+1.1);tl.set(path,{visibility:'hidden'},at+1.3);}
 }
 function apply(event,s,vo){const at=cue(event,s,vo),n=nodes.get(event.target);
  switch(event.type){
   case 'show':tl.set(n.el,{visibility:'visible'},at);tl.fromTo(n.el,{opacity:0,scale:.8,y:40},{opacity:1,scale:1,y:0,duration:.6,ease:'power2.out',immediateRender:false},at);break;
   case 'hide':tl.to(n.el,{opacity:0,duration:.4},at);tl.set(n.el,{visibility:'hidden'},at+.4);break;
   case 'open':tl.to(n.lid,{y:-55,rotation:-8,duration:.65,ease:'power2.inOut'},at);tl.to(n.value,{opacity:1,duration:.4},at+.25);break;
   case 'focus':nodes.forEach(({el},id)=>tl.set(el,{outlineWidth:event.targets.includes(id)?4:0},at));break;
   case 'set':for(const key of ['label','value','detail','address'])if(event[key]!=null)field(n,key,event[key],at);break;
   case 'morph':if(n.lid)tl.to(n.lid,{opacity:0,duration:.5},at);tl.to(n.el,{borderRadius:32,rotation:0,borderStyle:'solid',borderColor:'#cbd5e1',backgroundColor:'#ffffff',duration:.8},at);for(const key of ['label','detail','value','address'])if(event[key]!=null)field(n,key,event[key],at+.4);break;
   case 'move':tl.to(n.el,{left:event.x,top:event.y,rotation:event.rotation||0,duration:.85,ease:'power2.inOut'},at);positions.set(event.target,{...positions.get(event.target),x:event.x,y:event.y});break;
   case 'transfer':case 'write':transfer(event,at,s);break;
   case 'connect':connection(event,at);break;
   case 'code':{
    const panel=add('div','code-content',code);add('div','code-label',panel,event.label||(en?'WORKED EXAMPLE':'VÍ DỤ C'));
    event.lines.forEach((line,i)=>add('div','code-line'+(i===event.active?' active':''),panel,line));
    tl.set(code,{visibility:'visible',display:'block'},at);tl.set(panel,{visibility:'visible',display:'block'},at);enter(panel,at);
    // Each panel owns its interval, including reverse seeks.
    panel.dataset.at=at;break;
   }
  }
 }
 S.scenes.forEach((sc,i)=>{const s=sections.get(`scene-${i+1}`);heading(sc,s,i+1);(sc.events||[]).forEach(e=>apply(e,s,sc.vo));});
 const panels=[...code.children].sort((a,b)=>Number(a.dataset.at)-Number(b.dataset.at));panels.forEach((panel,i)=>{panel.style.visibility='hidden';panel.style.display='none';if(panels[i+1])tl.set(panel,{display:'none',visibility:'hidden'},Number(panels[i+1].dataset.at));});
 const end=sections.get('outro').start;tl.to(world,{opacity:0,duration:.4},end-.4);tl.set(world,{visibility:'hidden',display:'none'},end);tl.set(code,{visibility:'hidden',display:'none'},end);
 hero(S.outro,'outro',S.scenes.length+1);
 const band=document.getElementById('captions');P.sections.forEach(s=>{
  const chunks=[];let line=[];(s.words||[]).forEach(w=>{if(line.length&&line.map(x=>x.w).join(' ').length+w.w.length+1>38){chunks.push(line);line=[];}line.push(w);});if(line.length)chunks.push(line);
  chunks.forEach((words,i)=>{const el=add('div','caption-line',band),start=Math.max(s.start,words[0].t0-.06),end=Math.min(s.start+s.dur,i+1<chunks.length?chunks[i+1][0].t0-.06:words.at(-1).t1+.25);tl.set(el,{opacity:1},start);tl.set(el,{opacity:0},end);words.forEach((w,j)=>{if(j)el.appendChild(document.createTextNode(' '));const span=add('span','caption-word',el,w.w);tl.set(span,{color:'#9f1239',textDecoration:'underline',textUnderlineOffset:'8px'},w.t0);});});
 });
 tl.to(document.getElementById('progress-fill'),{width:'100%',duration:P.total,ease:'none'},0);window.StoryTimeline=tl;
})();
