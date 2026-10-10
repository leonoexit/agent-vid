/* Native editorial compositions with Studio Ribbon motion:
   - Color-field curtain wipe between sections
   - Masked typography reveal for prominent headlines
   - Ambient ribbon wave motion and illustration breathing
   - Shared voice/timing, independent visual grammar. */
function buildRibbon(){
 const S=window.SCRIPT,P=window.PLAN,tl=gsap.timeline({paused:true}),NS='http://www.w3.org/2000/svg';
 const pages=document.getElementById('pages'),caps=document.getElementById('captions');
 document.title=S.title;document.documentElement.lang=S.language==='en'?'en':'vi';
 const add=(tag,cls,p,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;p.append(e);return e;};
 const write=(el,text,runs)=>{if(runs)runs.forEach(r=>add('span',r.token||'',el,r.text));else el.textContent=text;};
 const norm=s=>String(s).normalize('NFC').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
 const cue=(event,c,p)=>{if(event.at!=null)return p.start+event.at;const needle=norm(event.on);let occ=event.occurrence||1;let words=(p.words||[]).flatMap(w=>norm(w.w).map(token=>({token,t:w.t0})));if(!words.length){window.RIBBON_PREVIEW_TIMING=true;const n=norm(c.vo);words=n.map((token,i)=>({token,t:p.voStart+(p.voDur||p.dur-1)*i/n.length}));}for(let i=0;i<=words.length-needle.length;i++)if(needle.every((v,j)=>v===words[i+j].token)&&!--occ)return words[i].t;throw Error('Missing ribbon cue: '+event.on);};
 const enter=(e,at,delta=16)=>{gsap.set(e,{autoAlpha:0});tl.fromTo(e,{autoAlpha:0,y:delta},{autoAlpha:1,y:0,duration:.45,ease:'power2.out',immediateRender:false},at);};

 function ribbon(page,layout,at,dur){
  if(layout==='workbench')return;
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 1080 1920');svg.setAttribute('class','ribbon-decoration');svg.setAttribute('aria-hidden','true');svg.setAttribute('data-layout-allow-overflow','true');page.append(svg);
  const paths=layout==='rule'?[['M-50 1360 C180 1220 90 1680 260 1580','#ced443'],['M260 1580 C480 1430 180 1320 420 1250','#ff702e'],['M420 1250 C650 1190 740 1560 1120 1420','#afd5e4']]:[['M1020 -80 C910 40 1090 80 990 180','#afd5e4'],['M990 180 C860 330 1150 330 1040 460','#0995d1'],['M1040 460 C930 590 1130 700 1050 830','#ced443']];
  paths.forEach(([d,color],i)=>{const p=document.createElementNS(NS,'path');for(const [k,v]of Object.entries({d,fill:'none',stroke:color,'stroke-width':64,'stroke-linecap':'round',pathLength:1,'data-layout-allow-overflow':'true'}))p.setAttribute(k,v);svg.append(p);gsap.set(p,{strokeDasharray:1,strokeDashoffset:1});tl.to(p,{strokeDashoffset:0,duration:.75,ease:'power1.inOut'},at+i*.22);});
  /* Ambient ribbon wave motion */
  const ambT=at+0.85,rem=dur-1.2;
  if(rem>1.5){const cycles=Math.max(1,Math.floor(rem/2.8));tl.to(svg,{y:'+=16',rotation:1.2,transformOrigin:'50% 50%',duration:1.4,ease:'sine.inOut',yoyo:true,repeat:cycles*2-1},ambT);}
 }

 const allSections=[S.intro,...S.scenes,S.outro];
 const pageElements=[];

 allSections.forEach((c,i)=>{
  const p=P.sections[i];if(!p)throw Error('Missing section');
  const page=add('article','page '+c.layout,pages);page.dataset.section=p.id;
  page.style.zIndex=10+i;
  pageElements.push(page);

  /* ── Color-field Curtain Wipe ── */
  tl.set(page,{display:'block'},p.start);
  if(i>0){
   tl.fromTo(page,{clipPath:'inset(100% 0% 0% 0% round 48px 48px 0 0)'},{clipPath:'inset(0% 0% 0% 0% round 0px 0px 0 0)',duration:.72,ease:'power3.inOut',immediateRender:false},p.start);
   const prevPage=pageElements[i-1];
   if(prevPage)tl.set(prevPage,{display:'none'},p.start+.72);
  }
  if(i===allSections.length-1){
   tl.set(page,{display:'none'},p.start+p.dur);
  }

  ribbon(page,c.layout,p.start+(i?.28:.2),p.dur);
  const light=c.layout==='workbench';
  tl.set(caps,{color:light?'#f7f4ed':'#00624c'},p.start+(i?.36:0));

  /* ── Kicker & Masked Typography Reveal ── */
  if(c.kicker){
   const k=add('div','kicker',page,c.kicker);
   gsap.set(k,{autoAlpha:0});
   tl.fromTo(k,{autoAlpha:0,y:-10},{autoAlpha:1,y:0,duration:.45,ease:'power2.out',immediateRender:false},p.start+(i?.28:0));
  }

  const heading=add('h1','',page);
  const lines=c.title.split('\n');
  const titleT=p.start+(i?.38:.08);
  lines.forEach((lineText,lineIdx)=>{
   const mask=add('div','heading-mask',heading);
   const lineEl=add('span','heading-line',mask);
   if(c.titleRuns&&lines.length===1)write(lineEl,lineText,c.titleRuns);
   else lineEl.textContent=lineText;
   gsap.set(lineEl,{yPercent:135});
   tl.fromTo(lineEl,{yPercent:135},{yPercent:0,duration:.65,ease:'power3.out',immediateRender:false},titleT+lineIdx*.09);
  });

  /* ── Illustration (Floating Breathing) ── */
  if(c.illustration){
   const art=add('img','art',page);art.src=c.illustration.src;art.alt=c.illustration.alt;
   enter(art,p.start+(i?.45:.25),24);
   const floatT=p.start+(i?.9:.7);
   const remArt=p.dur-(floatT-p.start);
   if(remArt>1.5){
    const floatCycles=Math.max(1,Math.floor(remArt/3.0));
    tl.to(art,{y:'-=12',duration:1.5,ease:'sine.inOut',yoyo:true,repeat:floatCycles*2-1},floatT);
   }
  }

  /* ── Blocks & Model ── */
  const blocks=add('div','blocks',page);
  c.blocks.forEach(b=>{
   const e=add(b.type==='code'?'pre':'div','block '+b.type,blocks);
   if(b.label)add('span','label',e,b.label);
   const v=add('span',b.emphasis||'',e);
   write(v,b.text,b.runs);
   const at=cue(b,c,p);
   if(at+.6>p.start+p.dur)throw Error('Not enough result dwell');
   enter(e,at);
  });

  if(c.model){
   const m=c.model,model=add('div','model',page);
   const a=add('div','model-part input',model);add('span','label',a,'ĐẦU VÀO');add('div','value',a,m.input);
   const op=add('div','operator',model,m.rule);
   const b=add('div','model-part output',model);add('span','label',b,'KẾT QUẢ');add('div','value',b,m.output);
   const t1=cue({on:m.inputOn},c,p),t2=cue({on:m.ruleOn},c,p),t3=cue({on:m.outputOn},c,p);
   if(t3<t2||t2<t1)throw Error('Model cues must follow input/rule/output order');
   enter(a,t1);enter(op,t2);enter(b,t3);
   const packet=add('div','packet',model);gsap.set(packet,{autoAlpha:0});
   const travel=Math.min(.65,Math.max(.1,t3-t2));
   tl.fromTo(packet,{autoAlpha:1,x:0},{autoAlpha:1,x:410,duration:travel,ease:'power2.inOut',immediateRender:false},t3-travel);
   tl.set(packet,{autoAlpha:0},t3);
  }

  /* ── Karaoke Captions ── */
  const words=(p.words||[]).map(w=>({...w,d:w.w}));const groups=[];let g=[];
  const txt=a=>a.map(x=>x.d).join(' ');
  words.forEach(w=>{
   const len=txt(g).length;
   if(g.length&&(len+w.d.length+1>36||/[.?!:]$/.test(g.at(-1).d)&&len>16)){groups.push(g);g=[];}
   g.push(w);
  });
  if(g.length)groups.push(g);
  for(let j=groups.length-1;j>0;j--){
   const a=groups[j-1],b=groups[j];
   if(txt(b).length<16&&txt(a).length+txt(b).length<58){groups.splice(j-1,2,a.concat(b));}
  }
  const hl=c.layout==='workbench'?{color:'#00624c',backgroundColor:'#ced443'}:{color:'#f7f4ed',backgroundColor:'#00624c'};
  groups.forEach((grp,j)=>{
   const row=add('div','caption',caps);
   const st=grp[0].t0-.05,en=j+1<groups.length?groups[j+1][0].t0-.05:Math.min(p.start+p.dur,grp.at(-1).t1+.35);
   tl.set(row,{visibility:'visible'},st);
   tl.set(row,{visibility:'hidden'},en);
   grp.forEach((w,k)=>{
    const sp=add('span','',row,w.d);
    tl.set(sp,hl,w.t0);
    tl.set(sp,{color:'inherit',backgroundColor:'rgba(0,0,0,0)'},k+1<grp.length?grp[k+1].t0:en);
   });
  });
 });

 tl.set({}, {}, P.total);
 window.RibbonTimeline=tl;
 window.__timelines={'ribbon-story':tl};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',buildRibbon,{once:true});else buildRibbon();
