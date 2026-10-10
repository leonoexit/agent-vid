window.Collage=(()=>{
 const n=Pop.node;
 const box=(parent,cls,x,y,w,h,text)=>n('div','placed '+cls,parent,text,{left:x+'px',top:y+'px',...(w==null?{}:{width:w+'px'}),...(h==null?{}:{height:h+'px'})});
 const text=(p,cls,t,x,y,w)=>box(p,cls,x,y,w,null,t);
 function image(p,src,x,y,w,{label=false,rotation=0,alt=''}={}){const e=n('img',label?'paper-label':'photo',p);e.src=src;e.alt=alt;Object.assign(e.style,{left:x+'px',top:y+'px',width:w+'px',height:'auto',transform:`rotate(${rotation}deg)`});return e;}
 function strip(p,t,x,y,{rotation=0,color,background,size}={}){const e=box(p,'strip',x,y,null,null,t);Object.assign(e.style,{transform:`rotate(${rotation}deg)`,...(color?{color}:{}),...(background?{background}:{}),...(size?{fontSize:size+'px'}:{})});return e;}
 function backplate(p,t,x,y,{kind='white-strip',width=760,size=40,rotation=0,color}={}){
  const a=window.POP_BACKPLATES?.[kind];if(!a)throw new Error('Unknown backplate: '+kind);
  const [bx,by,bw,bh]=a.bounds,[sx,sy,sw,sh]=a.safe,k=width/bw;
  const e=box(p,'backplate',x,y,width,bh*k);e.dataset.plate=kind;e.style.transform=`rotate(${rotation}deg)`;
  const raster=n('img','backplate-image',e);raster.src=a.src;raster.alt='';raster.setAttribute('aria-hidden','true');
  Object.assign(raster.style,{left:-bx*k+'px',top:-by*k+'px',width:a.size[0]*k+'px',height:a.size[1]*k+'px'});
  const content=box(e,'backplate-safe',(sx-bx)*k,(sy-by)*k,sw*k,sh*k);
  Object.assign(content.style,{fontSize:size+'px',color:color||a.ink});n('span','backplate-copy',content,t);
  return e;
 }
 function mark(p,d,{color='#342046',width=7}={}){const s=Pop.svg('svg',p,{class:'doodle',viewBox:'0 0 1080 1920',width:1080,height:1920});return Pop.svg('path',s,{d,fill:'none',stroke:color,'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round'});}
 function enter(tl,e,t,{x=0,y=80,rotation=0,duration=.6}={}){gsap.set(e,{autoAlpha:0});tl.fromTo(e,{x,y,xPercent:0,yPercent:0,rotation,autoAlpha:0},{x:0,y:0,xPercent:0,yPercent:0,rotation:0,autoAlpha:1,duration,ease:'power3.out',immediateRender:false},t);}
 // Held, seeded offsets use independent CSS transforms so story motion stays intact.
 function paperJitter(tl,e,start,duration,{fps=6,x=3,y=2,rotation=.25,seed=1}={}){
  if(!(fps>0&&duration>0))throw new Error('paperJitter needs positive fps and duration');
  if(e.dataset.paperJitter)throw new Error('Attach paperJitter once per element');
  e.dataset.paperJitter='true';
  e.style.translate='var(--paper-x, 0px) var(--paper-y, 0px)';e.style.rotate='var(--paper-angle, 0deg)';
  const zero={'--paper-x':'0px','--paper-y':'0px','--paper-angle':'0deg'};gsap.set(e,zero);
  const noise=(n,channel)=>{let z=(Math.imul(n+1,374761393)^Math.imul(seed+channel,668265263))>>>0;z=Math.imul(z^(z>>>13),1274126177)>>>0;return ((z^(z>>>16))>>>0)/4294967295*2-1;};
  for(let i=0;i/fps<duration;i++){
   const elapsed=i/fps,gain=Math.min(1,elapsed/.25,(duration-elapsed)/.25);
   tl.set(e,{'--paper-x':(noise(i,0)*x*gain).toFixed(3)+'px','--paper-y':(noise(i,7)*y*gain).toFixed(3)+'px','--paper-angle':(noise(i,13)*rotation*gain).toFixed(4)+'deg'},start+elapsed);
  }
  tl.set(e,zero,start+duration);return e;
 }
 function draw(tl,p,t,d=.6){const len=p.getTotalLength();gsap.set(p,{strokeDasharray:len,strokeDashoffset:len});tl.to(p,{strokeDashoffset:0,duration:d,ease:'power2.inOut'},t);}
 return {box,text,image,strip,backplate,mark,enter,draw,paperJitter};
})();
