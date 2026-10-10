/* Native Apple story primitives. Requires the project's existing GSAP only for motion.
   Build DOM once; schedule all states on a paused parent timeline. No timers or callbacks. */
(()=>{'use strict';
let uid=0;
const palette={coral:['#ffb08e','#ff516f','#c82978'],blue:['#7ce2ff','#168ff6','#6250cc'],mint:['#9bf4bf','#25c694','#007b7c'],violet:['#d4c2ff','#9875f5','#6244b8']};
const shapes={
 folder:'<path d="M26 65Q26 49 42 49H92L110 68H208Q224 68 224 84V184Q224 204 204 204H46Q26 204 26 184Z" fill="url(#M)"/><path d="M26 98Q26 84 42 84H213Q230 84 226 102L213 185Q210 204 191 204H44Q26 204 26 185Z" fill="url(#L)"/>',
 document:'<path d="M61 28H154L199 73V209Q199 223 185 223H61Q47 223 47 209V42Q47 28 61 28Z" fill="url(#L)"/><path d="M154 28V62Q154 73 166 73H199" fill="url(#M)"/><path d="M79 110H166M79 140H166M79 170H142" stroke="url(#M)" stroke-width="12" stroke-linecap="round"/>',
 clock:'<circle cx="128" cy="126" r="96" fill="url(#M)"/><circle cx="128" cy="126" r="77" fill="url(#L)"/><path d="M128 75V127L164 150" fill="none" stroke="url(#M)" stroke-width="13" stroke-linecap="round"/><circle cx="128" cy="126" r="10" fill="url(#M)"/>',
 lock:'<path d="M80 114V78a48 48 0 0 1 96 0V114" fill="none" stroke="url(#L)" stroke-width="24"/><rect x="54" y="105" width="148" height="120" rx="29" fill="url(#M)"/><circle cx="128" cy="151" r="13" fill="#fff"/><path d="M128 157V180" stroke="#fff" stroke-width="11" stroke-linecap="round"/>',
 cloud:'<path d="M61 197C7 197 10 127 52 120C53 58 143 39 169 99C226 81 259 160 216 185Q204 197 185 197Z" fill="url(#M)"/><path d="M58 131C64 77 124 71 149 106" stroke="#ffffff80" stroke-width="8" fill="none" stroke-linecap="round"/>',
 computer:'<rect x="22" y="33" width="212" height="151" rx="23" fill="url(#L)"/><rect x="35" y="46" width="186" height="120" rx="12" fill="url(#M)"/><path d="M104 184L98 214H158L152 184" fill="url(#L)"/><rect x="72" y="214" width="112" height="13" rx="6" fill="url(#L)"/>',
 phone:'<rect x="66" y="15" width="124" height="226" rx="29" fill="url(#L)"/><rect x="76" y="25" width="104" height="206" rx="22" fill="url(#M)"/><rect x="107" y="31" width="42" height="10" rx="5" fill="#222536"/><path d="M111 219H145" stroke="#fff" stroke-width="5" stroke-linecap="round"/>'
};
function el(tag,cls,text){const n=document.createElement(tag);n.className=cls||'';if(text!=null)n.textContent=text;return n;}
function object(kind,{tone='blue',label=''}={}){
 if(!shapes[kind]||!palette[tone])throw Error('Unknown Apple object/tone');
 const n=el('figure','as-object'),id='as'+(++uid),c=palette[tone];
 const shape=shapes[kind].replaceAll('#M','#'+id+'m').replaceAll('#L','#'+id+'l');
 n.innerHTML=`<svg viewBox="0 0 256 270" aria-hidden="true"><defs><linearGradient id="${id}m" x2=".85" y2="1"><stop stop-color="${c[0]}"/><stop offset=".5" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></linearGradient><linearGradient id="${id}l" x2=".75" y2="1"><stop stop-color="#fff"/><stop offset=".6" stop-color="#f7f9fc"/><stop offset="1" stop-color="#cdd5e1"/></linearGradient></defs><ellipse cx="128" cy="250" rx="76" ry="8" fill="#263c5320"/><g class="as-solid">${shape}</g></svg>`;
 if(label)n.append(el('figcaption','',label));return n;
}
function history(labels){const n=el('div','as-history');n.setAttribute('role','list');labels.forEach((label,i)=>{const item=el('div','as-stop');item.setAttribute('role','listitem');item.append(el('b','',String(i+1)),el('span','',label));n.append(item);});return n;}
function comparison(before,after){const n=el('div','as-comparison');for(const [title,text] of [['Trước',before],['Sau',after]]){const c=el('section');c.append(el('h3','',title),el('pre','',text));n.append(c);}return n;}
function diff(before,after){const n=el('div','as-diff');n.append(el('pre','as-removed','− '+before),el('pre','as-added','+ '+after));return n;}
function init(node,vars){if(!window.gsap)throw Error('Load the existing GSAP before scheduling Apple motion');gsap.set(node,vars);}
function reveal(tl,node,at,duration=.4){init(node,{autoAlpha:0});tl.fromTo(node,{autoAlpha:0},{autoAlpha:1,duration,immediateRender:false,ease:'power2.out'},at);return node;}
function type(tl,node,text,at,duration=.8){node.replaceChildren();const chars=Array.from(text);chars.forEach((char,i)=>{const s=el('span','as-char',char);node.append(s);init(s,{opacity:0});tl.set(s,{opacity:1},at+duration*(i+1)/Math.max(1,chars.length));});return node;}
function press(tl,node,at){tl.fromTo(node,{scale:1},{scale:.95,duration:.12,repeat:1,yoyo:true,ease:'power1.inOut',immediateRender:false},at);}
function transfer(tl,node,from,to,at,duration=.7){init(node,from);tl.fromTo(node,from,{...to,duration,ease:'power2.inOut',immediateRender:false},at);}
function values(tl,node,states){if(!states.length||states.some((s,i)=>!Number.isFinite(s.at)||s.at<0||(i&&s.at<=states[i-1].at)))throw Error('Value states need increasing nonnegative times');node.replaceChildren();node.classList.add('as-values');const nodes=states.map(s=>el('span','',String(s.text)));nodes.forEach((n,i)=>{node.append(n);init(n,{autoAlpha:0});tl.set(n,{autoAlpha:1},states[i].at);if(states[i+1])tl.set(n,{autoAlpha:0},states[i+1].at);});return nodes;}
function historyStep(tl,rail,index,at){const n=rail.children[index];if(!n)throw Error('History index out of bounds');return reveal(tl,n,at);}
function showDiff(tl,node,removeAt,addAt){if(addAt<removeAt)throw Error('Diff addition precedes removal');reveal(tl,node.children[0],removeAt);reveal(tl,node.children[1],addAt);}
// Absolute transforms: camera is a dedicated wrapper. Caption HUD remains outside.
function camera(tl,world,{at,until,focus,scale=1.1,center={x:540,y:930},duration=.55}){
 if(scale<1||scale>1.2||until<at+duration)throw Error('Camera needs scale 1–1.2 and a readable hold');
 const pose={x:center.x-focus.x*scale,y:center.y-focus.y*scale,scale};
 init(world,{transformOrigin:'0 0',x:0,y:0,scale:1});
 tl.fromTo(world,{x:0,y:0,scale:1},{...pose,duration,ease:'power2.inOut',immediateRender:false},at);
 tl.fromTo(world,pose,{x:0,y:0,scale:1,duration,ease:'power2.inOut',immediateRender:false},until);
}
function context(tl,layer,{at,from='#f7f8f6',to,duration=.65}){tl.fromTo(layer,{backgroundColor:from},{backgroundColor:to,duration,ease:'sine.inOut',immediateRender:false},at);}
// One pre-grouped caption line; display text may differ from TTS spelling.
function caption(tl,host,{words,start,end}){
 if(!words.length||!Number.isFinite(start)||!Number.isFinite(end)||end<=start||words.some((w,i)=>!Number.isFinite(w.t0)||!Number.isFinite(w.t1)||w.t0<start||w.t1>end||w.t1<=w.t0||(i&&w.t0<words[i-1].t0)))throw Error('Invalid caption timing');
 const line=el('div','as-caption');host.append(line);init(line,{display:'none'});tl.set(line,{display:'block'},start);tl.set(line,{display:'none'},end);
 words.forEach((w,i)=>{if(i)line.append(' ');const span=el('span',w.color?'as-keyword':'',w.text);if(w.color)span.style.color=w.color;line.append(span);const off=Math.min(w.t1,words[i+1]?.t0??end);tl.fromTo(span,{backgroundColor:'rgba(22,23,25,0)'},{backgroundColor:'#16171914',duration:.08,immediateRender:false},w.t0);tl.set(span,{backgroundColor:'rgba(22,23,25,0)'},off);if(w.emphasis){tl.fromTo(span,{scale:1},{scale:1.05,duration:Math.min(.13,(off-w.t0)/2),repeat:1,yoyo:true,immediateRender:false,ease:'sine.inOut'},w.t0);}});return line;
}
window.AppleStory={object,history,comparison,diff,reveal,type,press,transfer,values,historyStep,showDiff,camera,context,caption};
})();
