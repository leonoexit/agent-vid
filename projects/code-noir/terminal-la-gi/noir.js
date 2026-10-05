/* Native page composition on the existing HyperFrames/GSAP timeline. */
function buildCodeNoir() {
 const S=window.SCRIPT,P=window.PLAN,tl=gsap.timeline({paused:true});
 const pages=document.getElementById('pages'),caps=document.getElementById('captions');
 document.documentElement.lang=S.language==='en'?'en':'vi';document.title=S.title;
 const add=(tag,cls,parent,text)=>{const e=document.createElement(tag);e.className=cls;if(text!=null)e.textContent=text;parent.appendChild(e);return e;};
 const write=(el,text,runs)=>{if(runs)runs.forEach(r=>add('span',r.token||'plain',el,r.text));else el.textContent=text;};
 const shown=S.captionDisplay||{};
 const display=w=>{const m=String(w).match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);if(!m)return w;const core=m[2];const v=shown[core]??shown[core.toLowerCase()];return v==null?w:m[1]+v+m[3];};
 const norm=s=>String(s).normalize('NFC').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
 const cue=(b,c,p)=>{
  if(b.at!=null)return p.start+b.at;
  const needle=norm(b.on);let occurrence=b.occurrence||1;
  let words=(p.words||[]).flatMap(w=>norm(w.w).map(token=>({token,t:w.t0})));
  if(!words.length){window.CODE_NOIR_PREVIEW_TIMING=true;const tokens=norm(c.vo);words=tokens.map((token,i)=>({token,t:p.voStart+(p.voDur||p.dur-1)*i/tokens.length}));}
  for(let i=0;i<=words.length-needle.length;i++)if(needle.every((w,j)=>w===words[i+j].token)&&!--occurrence)return words[i].t;
  throw Error('Missing Code Noir cue: '+b.on);
 };
 const enter=(el,at)=>{gsap.set(el,{autoAlpha:0});tl.fromTo(el,{autoAlpha:0,y:10},{autoAlpha:1,y:0,duration:.28,ease:'power2.out',immediateRender:false},at);};
 const content=[S.intro,...S.scenes,S.outro];
 content.forEach((c,i)=>{
  const p=P.sections[i];if(!p)throw Error('Missing timed section '+i);
  const page=add('article','page '+c.layout,pages);page.dataset.section=p.id;
  tl.set(page,{display:'flex'},p.start);tl.set(page,{display:'none'},p.start+p.dur);
  if(c.kicker)enter(add('div','kicker',page,c.kicker),p.start);
  const title=add('h1','',page);write(title,c.title,c.titleRuns);enter(title,p.start);
  const blocks=add('div','blocks',page);
  c.blocks.forEach(b=>{
   const e=add(b.type==='code'?'pre':'div','block '+b.type,blocks);
   if(b.label)add('span','label',e,b.label);
   const value=add('span',b.emphasis||'',e);write(value,b.text,b.runs);
   const at=cue(b,c,p);if(at<p.start||at+.6>p.start+p.dur)throw Error('Reveal needs reading time in '+p.id);
   e.dataset.cue=String(at);enter(e,at);
  });
  const words=p.words||[];
  for(let j=0;j<words.length;j+=7){
   const group=words.slice(j,j+7),row=add('div','caption',caps);
   group.forEach(w=>{const span=add('span','',row,display(w.w));tl.set(span,{color:'#8BE9FD'},w.t0);tl.set(span,{color:'#E5E5E5'},w.t1);});
   tl.set(row,{visibility:'visible'},group[0].t0);tl.set(row,{visibility:'hidden'},group[group.length-1].t1);
  }
 });
 tl.set({}, {}, P.total);window.CodeNoirTimeline=tl;window.__timelines={'code-noir':tl};
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", buildCodeNoir, {once:true}); else buildCodeNoir();
