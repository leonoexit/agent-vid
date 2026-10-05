// LSP · chim sẻ / cánh cụt — project-specific Apple-style native renderer.
// Every model operation is keyed to a spoken phrase via cue(); identities persist across contexts.
(()=>{
const P=window.PLAN,tl=gsap.timeline({paused:true}),stage=document.getElementById('stage'),NS='http://www.w3.org/2000/svg';
const samples=[];window.OPERATION_SAMPLES=samples;
const sections=P.sections,sid=n=>n==='intro'||n==='outro'?n:'scene-'+n,sec=n=>sections.find(x=>x.id===sid(n));
const S=n=>sec(n).start,E=n=>sec(n).start+sec(n).dur;
const norm=x=>String(x).toLowerCase().normalize('NFC').match(/[\p{L}\p{N}]+/gu)||[];
function cue(n,phrase,occ=1){const words=sec(n).words.flatMap(w=>norm(w.w).map(token=>({token,t:w.t0}))),q=norm(phrase);let k=0;for(let i=0;i<words.length;i++){if(q.every((x,j)=>words[i+j]?.token===x)&&++k===occ)return words[i].t;}throw Error('Missing cue '+n+' '+phrase);}

// ── Native glyph family (white on coloured lens) ─────────────────────────
const W='#fff';
const G={
 parent:`<svg viewBox="0 0 100 100"><g fill="none" stroke="${W}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 62C18 48 32 40 48 41C52 30 60 27 68 28C76 29 80 35 81 40L92 44L81 47C80 60 70 72 50 73C36 74 18 72 18 62Z"/><path d="M20 60L6 54L9 63L4 70L24 66"/><path d="M34 54C42 49 54 51 62 59"/></g><circle cx="70" cy="37" r="3.6" fill="${W}"/></svg>`,
 sparrow:`<svg viewBox="0 0 100 100"><path fill="${W}" d="M23 58L5 51L9 61L3 69L26 65Z"/><path fill="${W}" d="M20 60C20 46 34 38 50 39C62 40 70 46 72 54C74 65 64 73 48 73C34 73 20 70 20 60Z"/><circle fill="${W}" cx="70" cy="42" r="12.5"/><path fill="${W}" d="M80.5 38.5L94 43.5L80.5 48Z"/><path fill="${W}" opacity=".72" d="M34 53C39 33 54 19 72 13C65 29 61 44 52 55Z"/><circle cx="73.5" cy="39.5" r="2.8" fill="#0a7c69"/></svg>`,
 penguin:`<svg viewBox="0 0 100 100"><path fill="${W}" opacity=".24" d="M50 8C67 8 76 25 76 45C76 66 71 84 61 90L39 90C29 84 24 66 24 45C24 25 33 8 50 8Z"/><path fill="${W}" d="M50 30C61 30 66 44 66 59C66 75 60 87 50 87C40 87 34 75 34 59C34 44 39 30 50 30Z"/><path fill="${W}" opacity=".6" d="M25 44C15 54 14 66 18 74C23 66 26 57 29 50Z"/><path fill="${W}" opacity=".6" d="M75 44C85 54 86 66 82 74C77 66 74 57 71 50Z"/><circle cx="42" cy="22" r="4.6" fill="${W}"/><circle cx="58" cy="22" r="4.6" fill="${W}"/><circle cx="43" cy="22.6" r="2.1" fill="#1f2633"/><circle cx="57" cy="22.6" r="2.1" fill="#1f2633"/><path fill="#ffb347" d="M44 30L56 30L50 38.5Z"/><ellipse cx="41" cy="91" rx="8.5" ry="3.6" fill="#ffb347"/><ellipse cx="59" cy="91" rx="8.5" ry="3.6" fill="#ffb347"/></svg>`,
 flyer:`<svg viewBox="0 0 100 100"><path fill="${W}" d="M5 52C19 31 36 28 50 47C64 28 81 31 95 52C81 44 64 46 50 62C36 46 19 44 5 52Z"/><path fill="none" stroke="${W}" stroke-width="4.5" stroke-linecap="round" opacity=".6" d="M30 74H52M40 84H66"/></svg>`,
 bowl:`<svg viewBox="0 0 100 100"><circle cx="37" cy="36" r="7" fill="${W}"/><circle cx="54" cy="31" r="7" fill="${W}"/><circle cx="67" cy="39" r="6" fill="${W}"/><rect x="9" y="45" width="82" height="9" rx="4.5" fill="${W}"/><path fill="${W}" d="M15 52H85C85 72 70 85 50 85C30 85 15 72 15 52Z" opacity=".85"/></svg>`,
 check:`<svg viewBox="0 0 100 100"><path d="M24 52L42 69L77 32" fill="none" stroke="${W}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
 cross:`<svg viewBox="0 0 100 100"><path d="M31 31L69 69M69 31L31 69" fill="none" stroke="${W}" stroke-width="12" stroke-linecap="round"/></svg>`,
 bang:`<svg viewBox="0 0 100 100"><rect x="43" y="16" width="14" height="46" rx="7" fill="${W}"/><circle cx="50" cy="80" r="8" fill="${W}"/></svg>`,
 ask:`<svg viewBox="0 0 100 100"><path d="M34 36C34 24 43 17 52 17C62 17 70 24 70 34C70 48 52 48 52 62" fill="none" stroke="${W}" stroke-width="11" stroke-linecap="round"/><circle cx="52" cy="82" r="7.5" fill="${W}"/></svg>`,
 letter:l=>`<svg viewBox="0 0 100 100"><text x="50" y="69" text-anchor="middle" font-family="AppleSans" font-weight="700" font-size="58" fill="${W}" letter-spacing="-2">${l}</text></svg>`
};

// ── Element helpers ───────────────────────────────────────────────────────
function mk(tag,cls,parent=stage,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;parent.appendChild(e);return e;}
function place(e,x,y,w,h){Object.assign(e.style,{left:x+'px',top:y+'px'});if(w!=null)e.style.width=w+'px';if(h!=null)e.style.height=h+'px';gsap.set(e,{autoAlpha:0});return e;}
function actor(id,html,x,y,s=1){const a=mk('div','actor',stage,html);a.id=id;gsap.set(a,{x,y,xPercent:-50,yPercent:-50,scale:s,autoAlpha:0});return a;}
function tile(id,pal,glyph,label,x,y,s=1,rz=-3,ry=-7){return actor(id,`<div class="pop tile ${pal}" style="--s:240px;--rz:${rz}deg;--ry:${ry}deg"><div class="shadow"></div><div class="bloom"></div><div class="shell"><div class="lens">${glyph}</div><div class="label mono">${label}</div></div></div>`,x,y,s);}
function chip(id,pal,glyph,text,small,x,y,s=1,cls=''){const a=actor(id,`<div class="pop chip ${cls}"><div class="dot ${pal}">${glyph}</div><span class="t">${text}</span>${small!=null?`<small>${small}</small>`:''}</div>`,x,y,s);a.t=a.querySelector('.t');a.sm=a.querySelector('small');return a;}
function badge(id,pal,glyph,x,y,s=1){return actor(id,`<div class="pop badge ${pal}">${glyph}</div>`,x,y,s);}
function appear(a,t,d=.55){tl.fromTo(a,{autoAlpha:0},{autoAlpha:1,duration:d*.6,immediateRender:false},t);tl.fromTo(a.firstElementChild,{scale:.78},{scale:1,duration:d,ease:'back.out(1.7)',immediateRender:false},t);}
function vanish(a,t,d=.35){tl.to(a,{autoAlpha:0,duration:d},t);}
function go(a,vars,t,d=.8,job){tl.to(a,{ease:'power2.inOut',...vars,duration:d},t);if(job)samples.push({job,start:t,end:t+d});}
function put(a,vars,t){tl.set(a,vars,t);}
function show(e,t,d=.5){tl.fromTo(e,{autoAlpha:0,y:22},{autoAlpha:1,y:0,duration:d,ease:'power2.out',immediateRender:false},t);}
function hide(e,t,d=.3){tl.to(e,{autoAlpha:0,duration:d},t);}
function pulse(a,t,k=1.08){tl.fromTo(a.firstElementChild||a,{scale:1},{scale:k,duration:.22,yoyo:true,repeat:1,ease:'power1.inOut',immediateRender:false},t);}
const texts=new Map();function value(e,text,t){const prev=texts.has(e)?texts.get(e):e.textContent;tl.fromTo(e,{textContent:prev},{textContent:text,duration:0,immediateRender:false},t);texts.set(e,text);}
function mark(sp,t,bg,hold){tl.to(sp,{backgroundColor:bg,duration:.2},t);if(hold)tl.to(sp,{backgroundColor:'rgba(255,255,255,0)',duration:.3},t+hold);}
function wire(d,{color='#bcc3cc',width=5,head=null}={}){const s=document.createElementNS(NS,'svg');s.setAttribute('class','wires');s.setAttribute('viewBox','0 0 1080 1920');stage.insertBefore(s,stage.firstChild);gsap.set(s,{autoAlpha:0});
 const p=document.createElementNS(NS,'path');p.setAttribute('d',d);Object.entries({fill:'none',stroke:color,'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round'}).forEach(([k,v])=>p.setAttribute(k,v));s.appendChild(p);
 let h=null;if(head){h=document.createElementNS(NS,'polygon');h.setAttribute('points',head);Object.entries({fill:'#f7f8f6',stroke:color,'stroke-width':4,'stroke-linejoin':'round'}).forEach(([k,v])=>h.setAttribute(k,v));s.appendChild(h);gsap.set(h,{opacity:0});}
 const L=p.getTotalLength();gsap.set(p,{strokeDasharray:L,strokeDashoffset:L});return{s,p,h,L};}
function draw(w,t,d=.7,job='inheritance link'){tl.set(w.s,{autoAlpha:1},t);tl.fromTo(w.p,{strokeDashoffset:w.L},{strokeDashoffset:0,duration:d,ease:'power2.inOut',immediateRender:false},t);if(w.h)tl.fromTo(w.h,{opacity:0},{opacity:1,duration:.2,immediateRender:false},t+d-.1);samples.push({job,start:t,end:t+d});}
function erase(w,t,d=.3){tl.to(w.s,{autoAlpha:0,duration:d},t);}
function shake(a,x,t){tl.to(a,{keyframes:{x:[x,x-18,x+18,x-13,x+13,x-6,x]},duration:.6,ease:'none'},t);samples.push({job:'crash shake',start:t,end:t+.6});}

// Chapter label, headings, ambient fields, counter.
const chapterText=document.getElementById('chapter-text'),chapterEl=document.getElementById('chapter');gsap.set(chapterEl,{autoAlpha:0});
let lastChapter=null;function chapter(t,text){if(text===lastChapter)return;if(lastChapter===null){value(chapterText,text,t);show(chapterEl,t+.1,.4);}else{tl.to(chapterEl,{autoAlpha:0,duration:.2},t);value(chapterText,text,t+.2);tl.to(chapterEl,{autoAlpha:1,duration:.3},t+.22);}lastChapter=text;}
const H=[];function heading(t,l1,l2,cls,l2t){H.push({t,l1,l2,cls,l2t});}
let amb=null;function ambient(name,t){const e=document.getElementById('amb-'+name);if(amb===e)return;if(amb)tl.to(amb,{opacity:0,duration:.9},t);tl.to(e,{opacity:1,duration:.9},t);amb=e;}
sections.forEach((s,i)=>value(document.getElementById('counter'),String(i+1).padStart(2,'0')+' / '+sections.length,s.start));

// ── Persistent cast ───────────────────────────────────────────────────────
const SLOT=[540,1170],WL=[190,930],WR=[890,930];
// Devices and surfaces (placed with left/top)
function pad(id,cls){const e=mk('div','pad '+cls,stage,`<div class="body"></div><div class="top"></div><div class="ring"></div><div class="glow ok"></div><div class="glow bad"></div><div class="glow sky"></div><div class="eyebrow">HÀM</div><div class="name"></div>`);e.id=id;place(e,260,1200);e.name=e.querySelector('.name');e.eye=e.querySelector('.eyebrow');e.ok=e.querySelector('.glow.ok');e.bad=e.querySelector('.glow.bad');e.sky=e.querySelector('.glow.sky');return e;}
const launch=pad('launch',''),dish=pad('dish','dish');dish.name.textContent='cho_an(chim)';
function glow(g,t,hold=1.6){tl.fromTo(g,{opacity:0},{opacity:1,duration:.3,immediateRender:false},t);if(hold)tl.to(g,{opacity:0,duration:.4},t+hold);}
const code=mk('div','code');place(code,90,470,900);
code.innerHTML='<span class="eyebrow">PYTHON · HÀM</span><span class="l1"><span class="k">def </span><span class="f fn">tha_chim</span>(<span class="hl p">chim</span><span class="hl ann"></span>):</span>\n<span class="l2">    <span class="hl call">chim.bay()</span></span>';
const C={fn:code.querySelector('.fn'),p:code.querySelector('.p'),ann:code.querySelector('.ann'),call:code.querySelector('.call'),l2:code.querySelector('.l2'),eye:code.querySelector('.eyebrow')};
const codePC=mk('div','code');place(codePC,90,1336,900);codePC.style.fontSize='32px';codePC.style.padding='26px 36px';
codePC.innerHTML='<span class="eyebrow">LỚP CON GHI ĐÈ bay()</span><span class="a"><span class="k">class </span><span class="f">ChimCanhCut</span>(Chim):\n    <span class="k">def </span><span class="f">bay</span>(self):</span>\n<span class="b">        <span class="hl r"><span class="k">raise</span> Exception(<span style="color:#c3234a">"Không biết bay!"</span>)</span></span>';
const PC={a:codePC.querySelector('.a'),b:codePC.querySelector('.b'),r:codePC.querySelector('.r')};
function consoleBox(cls,html){const e=mk('div','console '+cls,stage,html);place(e,140,1520,800);e.style.justifyContent='center';return e;}
const outFly=consoleBox('','<span class="dot"></span><span class="tag">KẾT QUẢ</span><span class="msg">Bay lên!</span>');
const outErr=consoleBox('err','<span class="dot"></span><span>Exception: Không biết bay!</span>');
const outEat=consoleBox('','<span class="dot"></span><span class="tag">KẾT QUẢ</span><span class="msg">Đang ăn</span>');
const stop=mk('div','stop',stage,'■&nbsp; Chương trình dừng');place(stop,0,880);stop.style.left='50%';stop.style.marginLeft='-170px';
const zero=mk('div','tagline',stage,'<span style="color:#0a9f7a">✓</span>&nbsp; 0 dòng bị sửa');place(zero,690,700);
const neq=mk('div','note',stage,'≠');place(neq,522,925);neq.style.font='300 64px AppleSans';neq.style.color='#c3234a';
const isBird=mk('div','tagline',stage,'Cũng là một loài chim <span style="color:#0a9f7a">✓</span>');place(isBird,0,1062);isBird.style.left='50%';isBird.style.transform='translateX(-50%)';
const lskTag=mk('div','tagline',stage,'Nguyên lý thay thế <b>Liskov</b>');place(lskTag,86,452);
const promise=mk('div','tagline',stage,'<span style="color:#5f656c;font-size:22px;letter-spacing:2px">LỜI HỨA</span>&nbsp; con chim nào cũng bay được');place(promise,0,1080);promise.style.left='50%';promise.style.transform='translateX(-50%)';
const inherit=mk('div','note',stage,'kế thừa');place(inherit,404,912);inherit.style.fontSize='26px';
const realTag=mk('div','tagline',stage,'Ngoài đời: là chim <span style="color:#0a9f7a">✓</span>');place(realTag,690,728);
const socket=mk('div','socket',stage,'<div class="cap">chỗ dùng lớp Chim</div><div class="q" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:300 120px AppleSans;color:#7468d4;opacity:0">?</div>');place(socket,405,765,270,270);const socketQ=socket.querySelector('.q');
const nameCard=mk('div','card',stage,'<div class="eyebrow">LISKOV SUBSTITUTION PRINCIPLE</div><div class="big" style="font-size:40px;top:80px">Barbara Liskov · 1987</div>');place(nameCard,190,1080,700,170);
const rule=mk('div','card',stage,'<div class="eyebrow">NGUYÊN LÝ THAY THẾ LISKOV · CHỮ L</div><div class="big">Chỗ nào dùng lớp cha, lớp con thay vào vẫn phải chạy đúng.</div>');place(rule,90,496,900,260);
const warn=mk('div','card warn',stage,'<div class="eyebrow" style="color:#bf3b55">KHI LỚP CON KHÔNG GIỮ ĐƯỢC LỜI HỨA</div><div class="big wb">Đừng để nó kế thừa lời hứa đó.</div>');place(warn,90,820,900,380);const warnBig=warn.querySelector('.wb');gsap.set(warnBig,{autoAlpha:0});
const arrowNote=mk('div','note',stage,'→');place(arrowNote,600,1063);arrowNote.style.font='400 56px AppleSans';arrowNote.style.color='#6a7078';

// Wires (created first in DOM → beneath tiles)
const HEAD=(x,y)=>`${x},${y-4} ${x-15},${y+21} ${x+15},${y+21}`;
const w1=wire('M380 1076V806',{head:HEAD(380,786)});
const w2se=wire('M290 972V900H540V778',{head:HEAD(540,758)}),w2pc=wire('M790 972V900H540V778',{head:HEAD(540,758)});
const w3bb=wire('M270 803V735H540V688',{head:HEAD(540,668)}),w3pc=wire('M810 803V735H540V688',{head:HEAD(540,668)}),w3se=wire('M270 1192V1022',{head:HEAD(270,1002)});
const w3pcHi=wire('M810 803V735H540V688',{color:'#8a75ff',width:8});
const trail=wire('M540 1060C462 966 452 850 556 760',{color:'#7cc4ff',width:7});

// Classes (tiles), chips, badges
const chim=tile('t-chim','p-violet',G.parent,'Chim',380,700,1);
const se=tile('t-se','p-mint',G.sparrow,'ChimSe',380,1180,1,3,7);
const pc=tile('t-pc','p-slate',G.penguin,'ChimCanhCut',790,1080,.875,2,6);
const bb=tile('t-bb','p-blue',G.flyer,'ChimBietBay',270,900,.79,-2,-6);
const Ltile=tile('t-L','p-coral',G.letter('L'),'Liskov',540,860,1.4,-4,-8);
const solid=['S','O','L','I','D'].map((l,i)=>tile('t-solid-'+l,l==='L'?'p-coral':'p-mist',G.letter(l),'',300+i*120,1430,.5,i%2?3:-3,i%2?6:-6));
const chimBay=chip('c-chim-bay','p-blue',G.flyer,'bay()',null,700,700);
const seBay=chip('c-se-bay','p-blue',G.flyer,'bay()',null,700,1180);
const pcBay=chip('c-pc-bay','p-blue',G.flyer,'bay()',null,790,1250,.9);
const pcBroken=chip('c-pc-broken','p-coral',G.bang,'bay()','báo lỗi',790,1250,.9,'broken');
const req=chip('c-req','p-blue',G.flyer,'bay()','lời hứa',820,1000,1,'req');
const anChim=chip('c-an','p-amber',G.bowl,'an()',null,800,640);
const anSe=chip('c-an-se','p-amber',G.bowl,'an()',null,290,1340,.9);
const anPc=chip('c-an-pc','p-amber',G.bowl,'an()',null,790,1340,.9);
const bbChip=chip('c-bb','p-blue',G.flyer,'ChimBietBay',null,790,1100,.95);
const brokenOut=chip('c-broken-out','p-coral',G.bang,'bay()','báo lỗi',330,1100,.95,'broken');
const ask=badge('b-ask','p-coral',G.ask,700,1010,1.4),ask2=badge('b-ask2','p-coral',G.ask,540,930,1.5);
const okFly=badge('b-ok-fly','p-mint',G.check,690,1080),okSocket=badge('b-ok-socket','p-mint',G.check,690,768),noSocket=badge('b-no-socket','p-coral',G.cross,690,768);
const okPc=badge('b-ok-pc','p-mint',G.check,900,820,.8),okSe2=badge('b-ok-se2','p-mint',G.check,660,1070),okPc2=badge('b-ok-pc2','p-mint',G.check,660,1070),okRule=badge('b-ok-rule','p-mint',G.check,930,520,.9);
const rings=[0,1].map(i=>{const r=actor('ring-'+i,'<div class="pop" style="width:280px;height:280px;border-radius:50%;border:7px solid #ff516f"></div>',SLOT[0],SLOT[1],.6);return r;});
// Dim parent copy used in the substitution socket
document.head.insertAdjacentHTML('beforeend','<style>.p-mist{--light:#f3f5f8;--mid:#c3cbd5;--shade:#97a2af;--bounce:#8a98a820}</style>');

function fly(a,t){tl.to(a,{x:SLOT[0]-30,y:SLOT[1]-150,rotation:-8,scale:.92,duration:.5,ease:'power2.out'},t);tl.to(a,{x:556,y:740,rotation:-14,scale:.62,autoAlpha:0,duration:.75,ease:'power2.in'},t+.5);samples.push({job:'bird flies',start:t,end:t+1.25});draw(trail,t+.1,.9,'flight trail');erase(trail,t+.95,.3);glow(launch.sky,t,1.4);}
function crash(a,t){shake(a,SLOT[0],t);glow(launch.bad,t,0);rings.forEach((r,i)=>{tl.set(r,{autoAlpha:1,scale:.6},t+i*.18);tl.to(r,{scale:1.7,autoAlpha:0,duration:.9,ease:'power2.out'},t+i*.18);});tl.to(a,{rotation:-6,y:SLOT[1]+14,duration:.4,ease:'power2.out'},t+.6);}

// ── INTRO · question ─────────────────────────────────────────────────────
const I0=S('intro');chapter(I0,'CÂU HỎI');ambient('warm',I0);
heading(I0,'Cánh cụt là chim.','Thay vào có chạy?','g-coral',cue('intro','thay vào'));
put(pc,{x:540,y:840,scale:1.25},I0);appear(pc,cue('intro','chim cánh cụt'),.7);
show(isBird,cue('intro','cũng là chim'),.45);hide(isBird,cue('intro','đang dùng chim')-.2);
const useT=cue('intro','đang dùng chim');
show(launch,cue('intro','chương trình')-.1,.5);launch.name.textContent='chương trình';launch.name.style.fontFamily='AppleSans';launch.eye.textContent='ĐANG CHẠY';
go(pc,{x:850,y:760,scale:.8},useT-.3,.7,'penguin steps aside');
put(se,{x:SLOT[0],y:SLOT[1],scale:.96},I0);appear(se,useT,.6);glow(launch.ok,useT+.3,1.4);
const swapT=cue('intro','chú cánh cụt');
go(se,{x:WL[0]+20,y:WL[1],scale:.72,autoAlpha:.45},swapT-.2,.7,'sparrow leaves the slot');
go(pc,{x:SLOT[0],y:SLOT[1],scale:.96},swapT,.8,'penguin substitutes');
appear(ask,cue('intro','chạy đúng'),.6);
show(lskTag,cue('intro','chữ l'),.5);
const X1=S(1);[launch,lskTag].forEach(e=>hide(e,X1));[ask,pc,se].forEach(a=>vanish(a,X1));

// ── 1 · Parent class makes a promise ─────────────────────────────────────
chapter(X1,'LỚP CHA · LỚP CON');ambient('violet',X1);heading(X1,'Lớp Chim','hứa sẽ bay.','g-blue');
put(chim,{x:420,y:760,scale:1.25},X1);put(chimBay,{x:810,y:760,scale:1.15},X1);
appear(chim,cue(1,'lớp chim'),.7);
appear(chimBay,cue(1,'phương thức'),.55);
show(promise,cue(1,'lời hứa'),.5);pulse(chimBay,cue(1,'cũng bay được'));

// ── 2 · Inheritance copies the promise to the child ──────────────────────
const X2=S(2);heading(X2,'Lớp con','nhận lại tất cả.','g-mint');hide(promise,X2);
go(chim,{x:380,y:660,scale:1},X2+.05,.7);go(chimBay,{x:700,y:660,scale:1},X2+.05,.7);
put(se,{x:380,y:1200,scale:1,autoAlpha:0,rotation:0},X2);appear(se,cue(2,'lớp chim sẻ'),.7);
const inh2=cue(2,'kế thừa lớp chim');draw(w1,inh2,.6);show(inherit,inh2+.3,.4);
const copy2=cue(2,'nhận lại');put(seBay,{x:700,y:660,scale:1},copy2);tl.set(seBay,{autoAlpha:1},copy2);go(seBay,{y:1200},copy2,.9,'promise copied to child');
pulse(seBay,cue(2,'kể cả'));

// ── 3 · The function that uses Chim ──────────────────────────────────────
const X3=S(3);chapter(X3,'HÀM THẢ CHIM');ambient('sky',X3);heading(X3,'Một hàm','dùng lớp Chim.','g-violet');
[chim,chimBay,seBay].forEach(a=>vanish(a,X3));erase(w1,X3);hide(inherit,X3);
go(se,{x:WL[0],y:WL[1],scale:.75},X3+.05,.8,'sparrow waits beside the function');
gsap.set(C.l2,{opacity:0});
value(launch.name,'tha_chim(chim)',X3);tl.set(launch.name,{fontFamily:'AppleMono'},X3);value(launch.eye,'HÀM',X3);
const fnT=cue(3,'hàm thả chim');show(code,fnT,.5);show(launch,fnT+.1,.5);
const paramT=cue(3,'nhận vào');mark(C.p,paramT,'#7364ef26',1.3);glow(launch.sky,paramT,1.2);
const callT=cue(3,'chim chấm bay');tl.fromTo(C.l2,{opacity:0},{opacity:1,duration:.4,immediateRender:false},callT-.1);mark(C.call,callT,'#168ff626',1.4);

// ── 4 · The function trusts the parent's promise ─────────────────────────
const X4=S(4);heading(X4,'Hàm tin','lời hứa.','g-blue');
const anyT=cue(4,'không cần biết');tl.set(socket,{left:SLOT[0]-120+'px',top:SLOT[1]-130+'px',width:'240px',height:'240px'},X4);tl.set(socket.firstChild,{opacity:0},X4);tl.set(socketQ,{opacity:1},X4);show(socket,anyT,.5);
appear(req,cue(4,'lời hứa'),.55);mark(C.call,cue(4,'lời hứa'),'#168ff626',1.6);
pulse(req,cue(4,'gọi bay'));

// ── 5 · Run with a sparrow: it flies ─────────────────────────────────────
const X5=S(5);heading(X5,'Chim sẻ.','Bay lên.','g-mint');
const inT=cue(5,'đưa vào');hide(socket,inT);go(se,{x:SLOT[0],y:SLOT[1],scale:.96},inT,.8,'sparrow enters the function');
const call5=cue(5,'hàm gọi bay');mark(C.call,call5,'#168ff630',1.6);pulse(req,call5);
const up5=cue(5,'bay lên');fly(se,up5-.15);show(outFly,up5+.2,.45);
appear(okFly,cue(5,'chạy đúng'),.55);

// ── 6 · A new child: the penguin ─────────────────────────────────────────
const X6=S(6);chapter(X6,'THÊM LỚP CON');ambient('violet',X6);heading(X6,'Cánh cụt','cũng là chim.','g-violet');
[code,launch,outFly].forEach(e=>hide(e,X6));[req,okFly].forEach(a=>vanish(a,X6));
put(chim,{x:540,y:640,scale:.917},X6);appear(chim,X6+.15,.6);
put(chimBay,{x:800,y:640,scale:1},X6);appear(chimBay,X6+.3,.5);
put(se,{x:290,y:1080,scale:.875,rotation:0,autoAlpha:0},X6);appear(se,X6+.3,.6);
put(seBay,{x:290,y:1250,scale:.9,autoAlpha:0},X6);appear(seBay,X6+.45,.5);
draw(w2se,X6+.5,.6);
const pcIn=cue(6,'lớp chim cánh cụt');put(pc,{x:1260,y:1080,scale:.875,rotation:0,autoAlpha:1},X6);go(pc,{x:790},pcIn,.9,'penguin class enters');
tl.set(pc.firstElementChild,{scale:1},X6);
draw(w2pc,cue(6,'kế thừa lớp chim'),.6);
const copy6=cue(6,'loài chim');put(pcBay,{x:800,y:640,scale:1},copy6-.4);tl.set(pcBay,{autoAlpha:1},copy6-.4);go(pcBay,{x:790,y:1250,scale:.9},copy6-.4,.9,'promise copied to penguin');

// ── 7 · Override: bay() raises ───────────────────────────────────────────
const X7=S(7);heading(X7,'Nhưng không','biết bay.','g-coral');
const cant=cue(7,'không biết bay');shake(pc,790,cant);tl.to(pcBay,{opacity:.45,duration:.3},cant);
const over=cue(7,'viết lại');gsap.set([PC.a,PC.b],{opacity:0});show(codePC,over-.1,.45);tl.fromTo(PC.a,{opacity:0},{opacity:1,duration:.4,immediateRender:false},over);
tl.to(pcBay,{rotationX:90,duration:.22,ease:'power1.in'},over+.2);tl.set(pcBay,{autoAlpha:0,rotationX:0},over+.42);
tl.set(pcBroken,{autoAlpha:1},over+.42);tl.fromTo(pcBroken,{rotationX:-90},{rotationX:0,duration:.25,ease:'power1.out',immediateRender:false},over+.42);samples.push({job:'override flips promise',start:over+.2,end:over+.67});
const err7=cue(7,'báo lỗi');tl.fromTo(PC.b,{opacity:0},{opacity:1,duration:.35,immediateRender:false},err7-.1);mark(PC.r,err7,'#ff516f22');pulse(pcBroken,err7);

// ── 8 · Prediction: hand the penguin to tha_chim ─────────────────────────
const X8=S(8);chapter(X8,'THỬ THAY VÀO');ambient('sky',X8);heading(X8,'Thả','cánh cụt?','g-coral');
[chim,chimBay,se,seBay].forEach(a=>vanish(a,X8));[w2se,w2pc].forEach(w=>erase(w,X8));hide(codePC,X8);
go(pc,{x:WL[0],y:WL[1],scale:.75},X8+.05,.8,'penguin moves to the function');go(pcBroken,{x:200,y:1090,scale:.8},X8+.05,.8);
show(code,X8+.3,.5);show(launch,X8+.35,.5);put(req,{autoAlpha:0},X8);appear(req,X8+.5,.5);
const pcInT=cue(8,'đưa chú cánh cụt');go(pc,{x:SLOT[0],y:SLOT[1],scale:.96},pcInT+.2,.8,'penguin enters the function');
const call8=cue(8,'vẫn gọi');mark(C.call,call8,'#168ff630');pulse(req,call8);
const guess=cue(8,'bạn đoán');appear(ask2,guess,.6);tl.to(ask2.firstElementChild,{scale:1.06,duration:.6,yoyo:true,repeat:3,ease:'sine.inOut'},guess+.7);

// ── 9 · Crash ────────────────────────────────────────────────────────────
const X9=S(9);ambient('alarm',X9);heading(X9,'Lỗi.','Dừng giữa chừng.','g-coral');
const boom=cue(9,'báo lỗi');vanish(ask2,boom-.3,.25);crash(pc,boom);mark(C.call,boom,'#ff516f30');show(outErr,boom+.15,.4);pulse(pcBroken,boom+.3,1.12);
show(stop,cue(9,'dừng lại'),.45);

// ── 10 · Cause: the function is unchanged; the child broke the promise ───
const X10=S(10);heading(X10,'Hàm không sai.','Lớp con thất hứa.','g-coral');
const keep=cue(10,'không hề bị sửa');hide(stop,keep-.3);mark(C.call,keep-.3,'rgba(255,255,255,0)');show(zero,keep,.45);pulse(code,keep,1.02);
const blame=cue(10,'lỗi đến từ lớp con');go(pcBroken,{x:770,y:955,scale:1},blame,.7,'broken promise moves into view');pulse(pc,blame+.4,1.05);
const vs=cue(10,'lời hứa của lớp cha');go(req,{x:310,y:955},vs-.2,.7,'promise beside broken override');show(neq,vs+.4,.35);

// ── 11 · Name the principle ──────────────────────────────────────────────
const X11=S(11);chapter(X11,'NGUYÊN LÝ');ambient('warm',X11);heading(X11,'Chữ L:','Thay thế Liskov.','g-coral');
[code,launch,outErr,zero,neq].forEach(e=>hide(e,X11));tl.set(launch.bad,{opacity:0},X11+.4);[pc,req,pcBroken].forEach(a=>vanish(a,X11));
const nameT=cue(11,'nguyên lý thay thế');appear(Ltile,nameT,.8);show(nameCard,nameT+.4,.5);
const rowT=cue(11,'chữ l');solid.forEach((t,i)=>appear(t,rowT+i*.09,.5));pulse(solid[2],rowT+.8,1.15);

// ── 12 · Statement: a child must fit wherever the parent fits ────────────
const X12=S(12);heading(X12,'Thay lớp con,','vẫn chạy đúng.','g-mint');
[Ltile,...solid].forEach(a=>vanish(a,X12));hide(nameCard,X12);
tl.set(socket,{left:'405px',top:'765px',width:'270px',height:'270px',borderColor:'#b9b0ff'},X12);tl.set(socket.firstChild,{opacity:1},X12);tl.set(socketQ,{opacity:0},X12);
const parT=cue(12,'chỗ nào dùng được lớp cha');show(socket,parT,.45);put(chim,{x:540,y:900,scale:1,autoAlpha:0},X12);appear(chim,parT+.2,.6);
const subT=cue(12,'thay bằng lớp con');go(chim,{x:190,y:900,scale:.66,autoAlpha:.4},subT,.7,'parent leaves socket');
put(se,{x:1260,y:900,scale:1,rotation:0,autoAlpha:1},X12);tl.set(se.firstElementChild,{scale:1},X12);go(se,{x:540},subT+.25,.8,'child fills socket');
const ok12=cue(12,'chạy đúng');tl.to(socket,{borderColor:'#25c694',duration:.3},ok12);appear(okSocket,ok12,.55);

// ── 13 · Real-world "is-a" is not enough ────────────────────────────────
const X13=S(13);heading(X13,'Là chim','chưa đủ.','g-coral');
const realT=cue(13,'ngoài đời');vanish(okSocket,realT-.2);go(se,{x:300,y:1290,scale:.6},realT-.2,.7,'sparrow steps out');tl.to(socket,{borderColor:'#b9b0ff',duration:.3},realT);
put(pc,{x:880,y:930,scale:.75,rotation:0,autoAlpha:0},X13);appear(pc,realT,.6);show(realTag,realT+.3,.45);
const codeT=cue(13,'trong code');hide(realTag,codeT);go(pc,{x:540,y:900,scale:1},codeT,.8,'penguin tries the socket');
shake(pc,540,codeT+.85);tl.to(socket,{borderColor:'#ff516f',duration:.25},codeT+.85);appear(noSocket,codeT+.9,.5);
const breakT=cue(13,'phá lời hứa');put(pcBroken,{x:540,y:1180,scale:1,autoAlpha:0},X13);appear(pcBroken,breakT,.55);

// ── 14 · Fix 1: the parent promises only what every bird can do ──────────
const X14=S(14);chapter(X14,'CÁCH SỬA');ambient('mint',X14);heading(X14,'Lớp cha chỉ hứa','điều chung.','g-amber');
hide(socket,X14);vanish(noSocket,X14);
go(chim,{x:540,y:640,scale:.917,autoAlpha:1},X14+.1,.9,'recompose family');go(se,{x:290,y:1080,scale:.875},X14+.1,.9);go(pc,{x:790,y:1080,scale:.875},X14+.1,.9);
go(pcBroken,{x:790,y:1250,scale:.9},X14+.1,.9);
put(chimBay,{x:800,y:640,scale:1,autoAlpha:0},X14);appear(chimBay,X14+.5,.5);put(seBay,{x:290,y:1250,scale:.9,autoAlpha:0},X14);appear(seBay,X14+.6,.5);
draw(w2se,X14+.7,.5);draw(w2pc,X14+.75,.5);
const onlyT=cue(14,'chỉ nên hứa');go(chimBay,{x:540,y:1080,scale:.9,opacity:.5},onlyT,.9,'flying promise lifted off parent');
const eatT=cue(14,'ăn');appear(anChim,eatT,.55);
put(anSe,{x:800,y:640,scale:.9},X14);put(anPc,{x:800,y:640,scale:.9},X14);
tl.set([anSe,anPc],{autoAlpha:1},eatT+.3);go(anSe,{x:290,y:1338},eatT+.3,.65,'an() inherited');go(anPc,{x:790,y:1338},eatT+.38,.65,'an() inherited');

// ── 15 · Fix 2: flying becomes its own class ─────────────────────────────
const X15=S(15);heading(X15,'Bay thành','lớp riêng.','g-blue');
const re=X15+.3;[w2se,w2pc].forEach(w=>erase(w,re));
go(chim,{x:540,y:560,scale:.833},re,.9,'make room for a new level');go(anChim,{x:790,y:560},re,.9);
go(se,{x:270,y:1290,scale:.79},re,.9);go(seBay,{x:500,y:1252,scale:.88},re,.9);go(anSe,{x:500,y:1336,scale:.88},re,.9);
go(pc,{x:810,y:900,scale:.79},re,.9);go(pcBroken,{x:810,y:1060,scale:.88},re,.9);go(anPc,{x:810,y:1145,scale:.88},re,.9);
draw(w3pc,re+.9,.5);
const bbT=cue(15,'chim biết bay');appear(bb,bbT,.65);go(chimBay,{x:500,y:900,scale:.88,opacity:1},bbT+.25,.8,'bay() docks on ChimBietBay');draw(w3bb,bbT+.5,.5);
const seT=cue(15,'chim sẻ kế thừa');draw(w3se,seT,.55);pulse(seBay,seT+.5);

// ── 16 · Fix 3: the penguin no longer promises to fly ────────────────────
const X16=S(16);heading(X16,'Cánh cụt','hết thất hứa.','g-mint');
draw(w3pcHi,cue(16,'kế thừa thẳng'),.6,'direct parent highlighted');erase(w3pcHi,cue(16,'kế thừa thẳng')+1.6,.4);
const dropT=cue(16,'không còn hứa bay');go(pcBroken,{y:1120,autoAlpha:0},dropT,.6,'broken promise removed');go(anPc,{y:1060},dropT+.5,.6);
appear(okPc,cue(16,'không còn phá'),.55);

// ── 17 · The function states the narrower requirement ────────────────────
const X17=S(17);ambient('sky',X17);heading(X17,'Hàm nói rõ:','chim biết bay.','g-blue');
[chim,anChim,bb,chimBay,pc,anPc,okPc,seBay,anSe].forEach(a=>vanish(a,X17));[w3bb,w3pc,w3se].forEach(w=>erase(w,X17));
go(se,{x:WL[0],y:WL[1],scale:.75},X17+.05,.8,'sparrow waits beside the function');
put(req,{x:820,y:1000,scale:1},X17);value(req.t,'bay()',X17);
const fn17=cue(17,'hàm thả chim');show(code,fn17,.45);show(launch,fn17+.1,.45);appear(req,fn17+.2,.5);
const only17=cue(17,'chỉ nhận');value(C.ann,': ChimBietBay',only17);mark(C.ann,only17,'#168ff626',1.8);
tl.to(req,{rotationX:90,duration:.18},only17+.1);value(req.t,'ChimBietBay',only17+.28);value(req.sm,'chỉ nhận',only17+.28);tl.to(req,{rotationX:0,duration:.2},only17+.28);samples.push({job:'requirement narrowed',start:only17,end:only17+.5});

// ── 18 · Verify: the sparrow still flies ─────────────────────────────────
const X18=S(18);chapter(X18,'KIỂM TRA');heading(X18,'Chim sẻ','vẫn bay.','g-mint');
const in18=cue(18,'thả chim sẻ');go(se,{x:SLOT[0],y:SLOT[1],scale:.96},in18-.2,.75,'sparrow enters');
const up18=cue(18,'vẫn bay lên');fly(se,up18-.1);show(outFly,up18+.25,.4);put(okFly,{autoAlpha:0},X18);appear(okFly,up18+.6,.5);

// ── 19 · Verify: cho_an accepts both children of Chim ────────────────────
const X19=S(19);ambient('mint',X19);heading(X19,'Cho ăn:','cả hai đều chạy.','g-amber');
[code,launch,outFly].forEach(e=>hide(e,X19));[req,okFly].forEach(a=>vanish(a,X19));
value(C.fn,'cho_an',X19+.35);value(C.ann,': Chim',X19+.35);value(C.call,'chim.an()',X19+.35);tl.set(C.ann,{backgroundColor:'rgba(255,255,255,0)'},X19+.35);
const eatFn=cue(19,'hàm cho ăn');show(code,eatFn,.45);show(dish,eatFn+.1,.45);mark(C.ann,eatFn+.6,'#ff9a2e2e',1.6);
put(se,{x:WL[0],y:WL[1],scale:.75,rotation:0,autoAlpha:0},X19);appear(se,X19+.4,.55);
put(pc,{x:WR[0],y:WR[1],scale:.75,rotation:0,autoAlpha:0},X19);appear(pc,X19+.5,.55);
const se19=cue(19,'đưa chim sẻ');go(se,{x:SLOT[0],y:SLOT[1],scale:.96},se19,.75,'sparrow enters cho_an');
const ok1=cue(19,'chạy đúng',1);mark(C.call,ok1-.3,'#ff9a2e2e',.9);show(outEat,ok1,.4);glow(dish.ok,ok1,1.2);appear(okSe2,ok1+.1,.5);
const pc19=cue(19,'đưa cánh cụt');go(se,{x:205,y:1215,scale:.66},pc19-.1,.7);go(okSe2,{x:290,y:1110,scale:.75},pc19-.1,.7);go(pc,{x:SLOT[0],y:SLOT[1],scale:.96},pc19+.1,.8,'penguin enters cho_an');
const ok2=cue(19,'cũng chạy đúng');mark(C.call,ok2-.3,'#ff9a2e2e',.9);tl.fromTo(outEat,{scale:1},{scale:1.04,duration:.18,yoyo:true,repeat:1,immediateRender:false},ok2);glow(dish.ok,ok2,1.4);appear(okPc2,ok2+.1,.5);

// ── OUTRO · rule and boundary ────────────────────────────────────────────
const XO=S('outro');chapter(XO,'GHI NHỚ');ambient('warm',XO);heading(XO,'Lớp con','phải thay được.','g-coral');
[code,dish,outEat].forEach(e=>hide(e,XO));[se,pc,okSe2,okPc2].forEach(a=>vanish(a,XO));
show(rule,cue('outro','thay được')-.2,.55);appear(okRule,cue('outro','chạy đúng'),.5);
show(warn,cue('outro','không giữ được'),.5);tl.fromTo(warnBig,{autoAlpha:0},{autoAlpha:1,duration:.4,immediateRender:false},cue('outro','đừng để nó'));
const fixT=cue('outro','lời hứa đó');appear(brokenOut,fixT-.3,.5);show(arrowNote,fixT,.35);appear(bbChip,fixT+.25,.55);

// ── Headings: sequential (old fades out, then new fades in; never overlapping) ──
H.forEach((h,i)=>{const e=mk('div','heading '+'',stage);e.style.display='none';const chars=Math.max(h.l1.length,h.l2.length);e.style.fontSize=Math.min(100,Math.floor(930/(chars*.55)))+'px';
 const a=mk('span','l1',e);a.textContent=h.l1;const b=mk('span','l2 '+h.cls,e);b.textContent=h.l2;
 const t0=i?h.t+.28:h.t+.1;tl.set(e,{display:'block'},t0);tl.fromTo(e,{autoAlpha:0,y:16},{autoAlpha:1,y:0,duration:.45,ease:'power2.out',immediateRender:false},t0);
 if(h.l2t){gsap.set(b,{opacity:0});tl.fromTo(b,{opacity:0},{opacity:1,duration:.45,immediateRender:false},h.l2t);}
 if(H[i+1]){tl.to(e,{autoAlpha:0,duration:.25},H[i+1].t);tl.set(e,{display:'none'},H[i+1].t+.26);}});

// ── Captions: current word highlighted; spoken spelling mapped to display spelling ──
const band=document.getElementById('captions'),display=w=>w.replace(/Lít-cốp/g,'Liskov');
sections.forEach(s=>{const chunks=[];let line=[];for(const w of s.words){if(line.length&&line.map(x=>x.w).join(' ').length+w.w.length+1>40){chunks.push(line);line=[];}line.push(w);}if(line.length)chunks.push(line);
 chunks.forEach((words,i)=>{const e=mk('div','caption-line',band);const st=Math.max(s.start,words[0].t0-.08),en=Math.min(s.start+s.dur,i+1<chunks.length?chunks[i+1][0].t0-.08:words.at(-1).t1+.3);tl.set(e,{opacity:1},st);tl.set(e,{opacity:0},en);
  words.forEach((w,j)=>{if(j)e.appendChild(document.createTextNode(' '));const sp=mk('span','caption-word',e);sp.textContent=display(w.w);tl.set(sp,{color:'#168ff6'},w.t0);tl.set(sp,{color:'#44494f'},j+1<words.length?words[j+1].t0:Math.min(en,w.t1+.25));});});});
tl.to(document.getElementById('progress'),{width:900,duration:P.total,ease:'none'},0);
window.StoryTimeline=tl;
})();
