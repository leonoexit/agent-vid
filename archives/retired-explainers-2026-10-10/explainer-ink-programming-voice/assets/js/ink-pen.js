/* One hand per page, evaluated from time. Adapted conceptually from the supplied
   big-canvas pen rig: lift, glide and withdraw without delaying content cues. */
window.InkPen={install(tl,page,segments,end){
 if(!segments.length)return;
 segments.sort((a,b)=>a.start-b.start);
 const hand=document.createElement('img');hand.src='assets/hand-pen-real.png';hand.className='ink-writing-hand';hand.alt='';hand.setAttribute('aria-hidden','true');page.append(hand);
 const width=parseFloat(getComputedStyle(hand).width),tip={x:width*190/1254,y:width*223/1254};
 const lerp=(a,b,u)=>({x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u});
 const smooth=u=>u*u*(3-2*u),lift=(p,u)=>({x:p.x+34*u,y:p.y+40*u});
 function at(t){
  let prev=null,next=null;
  for(const s of segments){if(t<s.start){next=s;break;}prev=s;if(t<=s.end)return{...s.point((t-s.start)/(s.end-s.start)),alpha:1};}
  const from=prev?prev.point(1):null,to=next?next.point(0):null;
  const elapsed=prev?t-prev.end:Infinity;
  const lifted=from&&lift(from,smooth(Math.min(1,elapsed/.16)));
  const gap=prev&&next?next.start-prev.end:Infinity;
  const glide=next?Math.min(.3,gap/2):0;
  if(next&&t>=next.start-glide){
   const u=smooth((t-next.start+glide)/glide);
   const near=lifted&&Math.hypot(to.x-lifted.x,to.y-lifted.y)<500&&gap<.9;
   return{...lerp(near?lift(from,1):lift(to,1),to,u),alpha:near?1:u};
  }
  if(prev&&elapsed<.16)return{...lifted,alpha:1-elapsed/.16};
  return{...(lifted||to||{x:0,y:0}),alpha:0};
 }
 const apply=t=>{const p=at(t);hand.style.opacity=String(p.alpha);hand.style.visibility=p.alpha>0?'visible':'hidden';hand.style.transform=`translate(${p.x-tip.x}px,${p.y-tip.y}px)`;};
 const proxy={t:0};tl.to(proxy,{t:end,duration:end,ease:'none',onUpdate:()=>apply(proxy.t)},0);apply(0);
 return{hand,at,apply};
}};
