/* Native Code Noir assets and small GSAP composition helpers. No animation loop. */
window.NoirVisuals = (() => {
 const NS='http://www.w3.org/2000/svg';
 const shapes={
  folder:'M6 18V12h19l7 7h26v34H6Z M6 24h52',
  file:'M15 5h23l12 12v42H15Z M38 5v14h12 M24 31h17 M24 40h17 M24 49h11',
  terminal:'M5 10h54v44H5Z M5 20h54 M13 29l8 7-8 7 M29 44h15',
  shell:'M23 13l-8 8 8 8 M41 35l8 8-8 8 M36 10L28 54',
  pin:'M32 58S13 39 13 24a19 19 0 0 1 38 0c0 15-19 34-19 34Z M32 16a8 8 0 1 0 0 16 8 8 0 1 0 0-16',
  keyboard:'M4 18h56v31H4Z M12 26h3 M23 26h3 M34 26h3 M45 26h3 M12 34h3 M23 34h3 M34 34h3 M45 34h3 M17 42h30',
  check:'M12 33l13 13 28-29',
  cross:'M16 16l32 32 M48 16L16 48'
 };
 function svg(tag,attrs={},parent){const e=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));if(parent)parent.appendChild(e);return e;}
 function icon(name,{size=64,color='currentColor',label}={}){
  if(!shapes[name])throw Error('Unknown Noir icon '+name);
  const e=svg('svg',{viewBox:'0 0 64 64',width:size,height:size,fill:'none',stroke:color,'stroke-width':2.5,'stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':label?'false':'true'});
  if(label)svg('title',{},e).textContent=label;svg('path',{d:shapes[name]},e);return e;
 }
 function path(parent,d,color='#8be9fd',width=3){return svg('path',{d,fill:'none',stroke:color,'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round',pathLength:1},parent);}
 function draw(tl,p,at,duration=.6){gsap.set(p,{strokeDasharray:1,strokeDashoffset:1});tl.to(p,{strokeDashoffset:0,duration,ease:'power1.inOut'},at);return p;}
 function reveal(tl,e,at,{duration=.35,y=14}={}){gsap.set(e,{autoAlpha:0});tl.fromTo(e,{autoAlpha:0,y},{autoAlpha:1,y:0,duration,ease:'power2.out',immediateRender:false},at);return e;}
 function move(tl,e,from,to,at,duration=.8){tl.fromTo(e,from,{...to,duration,ease:'power2.inOut',immediateRender:false},at);return e;}
 return {svg,icon,path,draw,reveal,move};
})();
