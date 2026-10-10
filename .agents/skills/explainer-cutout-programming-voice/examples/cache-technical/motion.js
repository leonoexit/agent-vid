/* Reusable native primitives. The project story owns model semantics. */
window.Cutout=(()=>{
 const NS='http://www.w3.org/2000/svg',operations=[];
 const tokens=s=>String(s).normalize('NFC').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
 function node(tag,cls,parent,text,style={}){const e=document.createElement(tag);e.className=cls;if(text!=null)e.textContent=text;Object.assign(e.style,style);parent.append(e);return e;}
 function svg(tag,parent,attrs={}){const e=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);parent.append(e);return e;}
 function cue(c,p,key){let q=c.cues[key];if(!q)throw Error('Missing cue '+key);if(typeof q==='string')q={on:q};const target=tokens(q.on);let occurrence=q.occurrence||1;let words=(p.words||[]).flatMap(w=>tokens(w.w).map(token=>({token,t:w.t0})));
 if(!words.length){window.CUTOUT_ESTIMATED_TIMING=true;const ts=tokens(c.vo);words=ts.map((token,i)=>({token,t:p.voStart+(p.voDur||p.dur-.6)*i/ts.length}));}
 for(let i=0;i<=words.length-target.length;i++)if(target.every((v,j)=>v===words[i+j].token)&&!--occurrence)return words[i].t;
 throw Error('Spoken phrase absent: '+q.on);}
 function appear(tl,e,t,d=.3,job='reveal'){gsap.set(e,{autoAlpha:0});tl.fromTo(e,{autoAlpha:0},{autoAlpha:1,duration:d,ease:'power1.out',immediateRender:false},t);operations.push({kind:'reveal',job,start:t,end:t+d});}
 function move(tl,e,from,to,t,d=.65,job='move'){gsap.set(e,{x:from[0],y:from[1]});tl.fromTo(e,{x:from[0],y:from[1]},{x:to[0],y:to[1],duration:d,ease:'power2.inOut',immediateRender:false},t);operations.push({kind:'model',job,start:t,end:t+d});}
 function captions(tl,p,parent){const words=p.words||[];let group=[],groups=[];for(const w of words){if(group.length&&(group.map(x=>x.w).join(' ').length+w.w.length>38)){groups.push(group);group=[];}group.push(w);}if(group.length)groups.push(group);
 groups.forEach((g,i)=>{const r=node('div','caption',parent);const end=i+1<groups.length?groups[i+1][0].t0:Math.min(p.start+p.dur,g.at(-1).t1+.25);tl.set(r,{visibility:'visible'},g[0].t0);tl.set(r,{visibility:'hidden'},end);g.forEach((w,k)=>{const sp=node('span','',r,w.w);tl.set(sp,{backgroundColor:'#deff78'},w.t0);tl.set(sp,{backgroundColor:'transparent'},k+1<g.length?g[k+1].t0:end);});});}
 return {node,svg,cue,appear,move,captions,operations};
})();
