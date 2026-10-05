/* Native page composition on the existing HyperFrames/GSAP timeline. */
function buildInk() {
 const S=window.SCRIPT,P=window.PLAN,tl=gsap.timeline({paused:true});
 const pages=document.getElementById('pages'),caps=document.getElementById('captions');
 document.documentElement.lang=S.language==='en'?'en':'vi';document.title=S.title;
 const add=(tag,cls,parent,text)=>{const e=document.createElement(tag);e.className=cls;if(text!=null)e.textContent=text;parent.appendChild(e);return e;};
 const norm=s=>String(s).normalize('NFC').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
 const cue=(b,c,p)=>{
  if(b.at!=null)return p.start+b.at;
  const needle=norm(b.on);let occurrence=b.occurrence||1;
  let words=(p.words||[]).flatMap(w=>norm(w.w).map(token=>({token,t:w.t0})));
  if(!words.length){window.INK_PREVIEW_TIMING=true;const tokens=norm(c.vo);words=tokens.map((token,i)=>({token,t:p.voStart+(p.voDur||p.dur-1)*i/tokens.length}));}
  for(let i=0;i<=words.length-needle.length;i++)if(needle.every((w,j)=>w===words[i+j].token)&&!--occurrence)return words[i].t;
  throw Error('Missing ink cue: '+b.on);
 };
 const enter=(el,at)=>tl.fromTo(el,{opacity:0,y:12},{opacity:1,y:0,duration:.32,ease:'power2.out',immediateRender:false},at);
 const content=[S.intro,...S.scenes,S.outro];
 content.forEach((c,i)=>{
  const p=P.sections[i];if(!p)throw Error('Missing timed section '+i);
  const page=add('article','page '+c.layout,pages);page.dataset.section=p.id;
  tl.set(page,{visibility:'visible'},p.start);tl.set(page,{visibility:'hidden'},p.start+p.dur);
  if(c.kicker)enter(add('div','kicker',page,c.kicker),p.start);
  const title=add('h1','',page,c.title);enter(title,p.start);
  const blocks=add('div','blocks',page);
  c.blocks.forEach(b=>{
   let e;
   if(b.type==='image'){
    e=add('figure','block image',blocks);const img=add('img','',e);img.src=b.src;img.alt=b.alt;
    if(b.text)add('figcaption','',e,b.text);
   }else{
    e=add(b.type==='code'?'pre':'div','block '+b.type,blocks);
    if(b.label)add('span','label',e,b.label);
    add('span',b.emphasis||'',e,b.text);
   }
   const at=cue(b,c,p);if(at<p.start||at+.6>p.start+p.dur)throw Error('Reveal needs reading time in '+p.id);
   e.dataset.cue=String(at);enter(e,at);
  });
  const words=p.words||[];
  for(let j=0;j<words.length;j+=7){
   const group=words.slice(j,j+7),row=add('div','caption',caps);
   group.forEach(w=>{const span=add('span','',row,w.w);tl.set(span,{color:'#c0392b'},w.t0);tl.set(span,{color:'#30343b'},w.t1);});
   tl.set(row,{visibility:'visible'},group[0].t0);tl.set(row,{visibility:'hidden'},group[group.length-1].t1);
  }
 });
 tl.set({}, {}, P.total);window.InkTimeline=tl;window.__timelines={'ink-story':tl};
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", buildInk, {once:true}); else buildInk();
