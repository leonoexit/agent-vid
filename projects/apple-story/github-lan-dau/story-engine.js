// GitHub lần đầu · repo + commit — project-specific Apple-style native renderer.
// Every model operation is keyed to a spoken phrase via cue(); identities persist across contexts:
// violet = repo, amber = the banana quantity, mint beads = commits (numbered 1-2-3), dashed coral = not committed.
(()=>{
const P=window.PLAN,SC=window.SCRIPT,tl=gsap.timeline({paused:true}),stage=document.getElementById('stage'),NS='http://www.w3.org/2000/svg';
const samples=[];window.OPERATION_SAMPLES=samples;
const sections=P.sections,sid=n=>n==='intro'||n==='outro'?n:'scene-'+n,sec=n=>sections.find(x=>x.id===sid(n));
const S=n=>sec(n).start;
const norm=x=>String(x).toLowerCase().normalize('NFC').match(/[\p{L}\p{N}]+/gu)||[];
function cue(n,phrase,occ=1){const words=sec(n).words.flatMap(w=>norm(w.w).map(token=>({token,t:w.t0}))),q=norm(phrase);let k=0;for(let i=0;i<words.length;i++){if(q.every((x,j)=>words[i+j]?.token===x)&&++k===occ)return words[i].t;}throw Error('Missing cue '+n+' '+phrase);}

// ── Native glyph family (white on coloured lens) ─────────────────────────
const W='#fff';
const BAN=`<svg viewBox="0 0 100 100"><path d="M12 34C14 66 44 90 86 80C92 78 92 70 86 68C64 62 46 48 34 30C32 20 12 22 12 34Z" fill="#ffd23f" stroke="#d99a00" stroke-width="4" stroke-linejoin="round"/><path d="M22 38C28 58 46 72 70 74" fill="none" stroke="#fff3b0" stroke-width="5" stroke-linecap="round"/><path d="M14 30L10 16L24 20Z" fill="#6b4a1e"/><circle cx="88" cy="74" r="4.5" fill="#6b4a1e"/></svg>`;
const G={
 folder:`<svg viewBox="0 0 100 100"><path d="M12 30C12 25 16 22 21 22H40L48 31H79C84 31 88 35 88 40V72C88 77 84 80 79 80H21C16 80 12 77 12 72Z" fill="${W}"/></svg>`,
 commit:`<svg viewBox="0 0 100 100"><path d="M4 50H31M69 50H96" stroke="${W}" stroke-width="9" stroke-linecap="round"/><circle cx="50" cy="50" r="17" fill="none" stroke="${W}" stroke-width="9"/></svg>`,
 cloud:`<svg viewBox="0 0 100 100"><path d="M28 76C16 76 8 68 8 58C8 48 16 41 26 41C29 29 39 22 51 22C65 22 75 32 77 44C86 45 93 52 93 61C93 70 86 76 77 76Z" fill="${W}"/></svg>`,
 banana:`<svg viewBox="0 0 100 100"><path d="M12 34C14 66 44 90 86 80C92 78 92 70 86 68C64 62 46 48 34 30C32 20 12 22 12 34Z" fill="${W}"/><path d="M14 30L10 16L24 20Z" fill="${W}" opacity=".75"/></svg>`,
 globe:`<svg viewBox="0 0 100 100"><g fill="none" stroke="${W}" stroke-width="7"><circle cx="50" cy="50" r="36"/><ellipse cx="50" cy="50" rx="15" ry="36"/><path d="M15 50H85M22 30H78M22 70H78"/></g></svg>`,
 lock:`<svg viewBox="0 0 100 100"><path d="M32 46V34C32 23 40 16 50 16C60 16 68 23 68 34V46" fill="none" stroke="${W}" stroke-width="9" stroke-linecap="round"/><rect x="20" y="44" width="60" height="44" rx="12" fill="${W}"/></svg>`,
 clock:`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="36" fill="none" stroke="${W}" stroke-width="8"/><path d="M50 30V52L64 60" fill="none" stroke="${W}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
 pencil:`<svg viewBox="0 0 100 100"><path d="M22 78L26 60L66 20L80 34L40 74Z" fill="#2b2f36"/><path d="M60 26L74 40" stroke="#fff" stroke-width="5"/><path d="M22 78L26 60L40 74Z" fill="#ffb347"/></svg>`,
 check:`<svg viewBox="0 0 100 100"><path d="M24 52L42 69L77 32" fill="none" stroke="${W}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
 cross:`<svg viewBox="0 0 100 100"><path d="M31 31L69 69M69 31L31 69" fill="none" stroke="${W}" stroke-width="12" stroke-linecap="round"/></svg>`,
 ask:`<svg viewBox="0 0 100 100"><path d="M34 36C34 24 43 17 52 17C62 17 70 24 70 34C70 48 52 48 52 62" fill="none" stroke="${W}" stroke-width="11" stroke-linecap="round"/><circle cx="52" cy="82" r="7.5" fill="${W}"/></svg>`,
 note:`<svg viewBox="0 0 100 100"><rect x="22" y="14" width="56" height="72" rx="10" fill="${W}"/><path d="M34 36H66M34 50H66M34 64H54" stroke="#7364ef" stroke-width="6" stroke-linecap="round"/></svg>`
};
const bananas=n=>`<span class="bananas">${Array.from({length:n},()=>`<span class="b">${BAN}</span>`).join('')}</span>`;

// ── Element helpers ───────────────────────────────────────────────────────
function mk(tag,cls,parent=stage,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;parent.appendChild(e);return e;}
function place(e,x,y,w,h){Object.assign(e.style,{left:x+'px',top:y+'px'});if(w!=null)e.style.width=w+'px';if(h!=null)e.style.height=h+'px';gsap.set(e,{autoAlpha:0});return e;}
function inner(parent,cls,x,y,w,h,html){const e=mk('div',cls,parent,html);return place(e,x,y,w,h);}
function actor(id,html,x,y,s=1){const a=mk('div','actor',stage,html);a.id=id;gsap.set(a,{x,y,xPercent:-50,yPercent:-50,scale:s,autoAlpha:0});return a;}
function tile(id,pal,glyph,label,x,y,s=1,rz=-3,ry=-7,mono=true){return actor(id,`<div class="pop tile ${pal}" style="--s:240px;--rz:${rz}deg;--ry:${ry}deg"><div class="shadow"></div><div class="bloom"></div><div class="shell"><div class="lens">${glyph}</div><div class="label${mono?' mono':''}">${label}</div></div></div>`,x,y,s);}
function chip(id,pal,glyph,text,x,y,s=1){const a=actor(id,`<div class="pop chip"><div class="dot ${pal}">${glyph}</div><span class="t">${text}</span></div>`,x,y,s);a.t=a.querySelector('.t');return a;}
function badge(id,pal,glyph,x,y,s=1){return actor(id,`<div class="pop badge ${pal}">${glyph}</div>`,x,y,s);}
function appear(a,t,d=.55){tl.fromTo(a,{autoAlpha:0},{autoAlpha:1,duration:d*.6,immediateRender:false},t);tl.fromTo(a.firstElementChild,{scale:.78},{scale:1,duration:d,ease:'back.out(1.7)',immediateRender:false},t);}
function vanish(a,t,d=.35){tl.to(a,{autoAlpha:0,duration:d},t);}
function go(a,vars,t,d=.8,job){tl.to(a,{ease:'power2.inOut',...vars,duration:d},t);if(job)samples.push({job,start:t,end:t+d});}
function put(a,vars,t){tl.set(a,vars,t);}
function show(e,t,d=.5){tl.fromTo(e,{autoAlpha:0,y:22},{autoAlpha:1,y:0,duration:d,ease:'power2.out',immediateRender:false},t);}
function fadeIn(e,t,d=.4){tl.fromTo(e,{autoAlpha:0},{autoAlpha:1,duration:d,immediateRender:false},t);}
function hide(e,t,d=.3){tl.to(e,{autoAlpha:0,duration:d},t);}
function pulse(a,t,k=1.08){tl.fromTo(a.firstElementChild&&a.classList.contains('actor')?a.firstElementChild:a,{scale:1},{scale:k,duration:.22,yoyo:true,repeat:1,ease:'power1.inOut',immediateRender:false},t);}
function press(e,t){tl.fromTo(e,{scale:1},{scale:.94,duration:.12,yoyo:true,repeat:1,ease:'power1.inOut',immediateRender:false},t);samples.push({job:'button press',start:t,end:t+.24});}
const texts=new Map();function value(e,text,t){const prev=texts.has(e)?texts.get(e):e.textContent;tl.fromTo(e,{textContent:prev},{textContent:text,duration:0,immediateRender:false},t);texts.set(e,text);}
function type(e,text,t,d){const n=[...text].length;for(let i=1;i<=n;i++)value(e,[...text].slice(0,i).join(''),t+(i-1)*d/n);samples.push({job:'typing',start:t,end:t+d});}
function mark(sp,t,bg,hold){tl.to(sp,{backgroundColor:bg,duration:.2},t);if(hold)tl.to(sp,{backgroundColor:'rgba(255,255,255,0)',duration:.3},t+hold);}
function cls(e,c,t){tl.set(e,{attr:{class:c}},t);}
function wire(d,{color='#cfd6de',width=6,dash=null}={}){const s=document.createElementNS(NS,'svg');s.setAttribute('class','wires');s.setAttribute('viewBox','0 0 1080 1920');stage.insertBefore(s,stage.firstChild);gsap.set(s,{autoAlpha:0});
 const p=document.createElementNS(NS,'path');p.setAttribute('d',d);Object.entries({fill:'none',stroke:color,'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round'}).forEach(([k,v])=>p.setAttribute(k,v));s.appendChild(p);
 const L=p.getTotalLength();gsap.set(p,{strokeDasharray:dash?dash:L,strokeDashoffset:dash?0:L});return{s,p,L,dash};}
function draw(w,t,d=.7,job='line draws'){tl.set(w.s,{autoAlpha:1},t);if(w.dash){tl.fromTo(w.s,{opacity:0},{opacity:1,duration:d,immediateRender:false},t);}else tl.fromTo(w.p,{strokeDashoffset:w.L},{strokeDashoffset:0,duration:d,ease:'power2.inOut',immediateRender:false},t);samples.push({job,start:t,end:t+d});}
function erase(w,t,d=.3){tl.to(w.s,{autoAlpha:0,duration:d},t);}
function shake(a,x,t){tl.to(a,{keyframes:{x:[x,x-16,x+16,x-11,x+11,x-5,x]},duration:.55,ease:'none'},t);samples.push({job:'shake',start:t,end:t+.55});}

// Chapter label, headings, ambient fields, counter.
const chapterText=document.getElementById('chapter-text'),chapterEl=document.getElementById('chapter');gsap.set(chapterEl,{autoAlpha:0});
let lastChapter=null;function chapter(t,text){if(text===lastChapter)return;if(lastChapter===null){value(chapterText,text,t);show(chapterEl,t+.1,.4);}else{tl.to(chapterEl,{autoAlpha:0,duration:.2},t);value(chapterText,text,t+.2);tl.to(chapterEl,{autoAlpha:1,duration:.3},t+.22);}lastChapter=text;}
const H=[];function heading(t,l1,l2,c2,l2t,c1=''){H.push({t,l1,l2,c1,c2,l2t});}
let amb=null;function ambient(name,t){const e=document.getElementById('amb-'+name);if(amb===e)return;if(amb)tl.to(amb,{opacity:0,duration:.9},t);tl.to(e,{opacity:1,duration:.9},t);amb=e;}
sections.forEach((s,i)=>value(document.getElementById('counter'),String(i+1).padStart(2,'0')+' / '+sections.length,s.start));

// ── Surfaces (DOM order = depth: wires < surfaces < actors < snaps < dialog) ──
// Browser window (stylised, labelled as a simplified illustration)
const win=mk('div','window');place(win,90,470,900,1130);
win.innerHTML='<div class="bar"><div class="dots"><i></i><i></i><i></i></div><div class="url"><span class="u">github.com</span></div></div><div class="demo">GIAO DIỆN MINH HỌA · RÚT GỌN</div>';
const url=win.querySelector('.u');
const avatar=inner(win,'avatar',40,122);gsap.set(avatar,{autoAlpha:1});
const plus=inner(win,'plus',776,122,null,null,'+');gsap.set(plus,{autoAlpha:1});
const menu=inner(win,'menu',386,206,470,null,'<div class="it a">New repository</div><div class="it">Import repository</div>');const menuA=menu.querySelector('.a');
const ftitle=inner(win,'formtitle',50,226,null,null,'Create a new repository');
const fname=inner(win,'flabel',50,318,null,null,'Repository name *');
const field=inner(win,'field',50,360,800,null,'<span class="v"></span><span class="caret"></span>');const fieldV=field.querySelector('.v');
const hint=inner(win,'hint',50,470,null,null,'Viết không dấu, không khoảng trắng');
const fvis=inner(win,'flabel',50,560,null,null,'Ai được xem?');
const opt=(x,pal,glyph,t,d)=>inner(win,'opt '+pal,x,600,null,null,`<div class="ic">${glyph}</div><div class="radio"><b></b></div><div class="t">${t}</div><div class="d">${d}</div>`);
const optPub=opt(50,'p-blue',G.globe,'Public','Ai cũng xem được'),optPri=opt(482,'p-slate',G.lock,'Private','Chỉ bạn xem');
const togrow=inner(win,'togrow',50,836,800,null,'<div class="t">Add README</div><div class="toggle"><b></b></div>');const tog=togrow.querySelector('.toggle'),togB=tog.querySelector('b');
const create=inner(win,'btn-green',50,966,800,null,'Create repository');

// README paper card / editor (one object from S5 to S9)
const file=mk('div','file');place(file,90,640,900,470);
file.innerHTML=`<div class="hd"><div class="fic"></div><div class="fname">README.md</div><div class="pen">${G.pencil}</div></div><div class="body"><span class="ln"><span class="h"># banh-chuoi</span></span><span class="ln l2"><span class="qty"></span><span class="rest"></span><span class="caret"></span>${bananas(3)}</span></div><div class="flash"></div>`;
const pen=file.querySelector('.pen'),qty=file.querySelector('.qty'),rest=file.querySelector('.rest'),fcaret=file.querySelector('.caret'),fl=file.querySelector('.flash'),fb=[...file.querySelectorAll('.bananas .b')];
gsap.set(fl,{inset:0});gsap.set(fcaret,{opacity:0});fb.forEach(b=>gsap.set(b,{autoAlpha:0,scale:.5}));
const cbtn=inner(file,'cbtn',560,16,null,null,'Commit changes…');
const stDraft=mk('div','status draft',stage,'Chưa vào lịch sử');place(stDraft,90,1160);
const stSaved=mk('div','status saved',stage,'✓ Đã lưu vào lịch sử');place(stSaved,90,1160);
const tagReadme=mk('div','tagline',stage,'Tệp chữ giới thiệu dự án');place(tagReadme,560,1020);

// History panel
const hist=mk('div','hist');place(hist,90,520,900,860);
hist.innerHTML=`<div class="clk">${G.clock}</div><div class="tt">Commits</div>`;
const rowData=[['Thêm chuối','hôm nay'],['Thêm công thức','hôm qua'],['Initial commit','hôm qua']];
const rows=rowData.map(([m,w],i)=>{const r=inner(hist,'row',40,150+i*200,null,null,`<div class="msg"><span>${m}</span></div><div class="meta"><span class="who"><i class="av"></i>bạn</span><span>·</span><span class="when">${w}</span></div>`);r.style.right='40px';r.msg=r.querySelector('.msg span');r.who=r.querySelector('.who');r.when=r.querySelector('.when');return r;});
const newtag=mk('div','newtag',stage,'MỚI NHẤT');place(newtag,770,700);

// Diff card
const diff=mk('div','diff');place(diff,90,600,900,500);
diff.innerHTML=`<div class="hd"><div class="m">Thêm chuối</div><div class="f">README.md · 1 dòng bị bỏ, 1 dòng mới</div></div>`;
const dl=(c,sg,txt,top,n,tag)=>{const e=inner(diff,'dline '+c,0,top,null,104,`<span class="sg">${sg}</span>${txt}${n?bananas(n):''}${tag?`<em>${tag}</em>`:''}`);gsap.set(e,{autoAlpha:1});return e;};
const dCtx=dl('ctx',' ','# banh-chuoi',140,0),dDel=dl('',  '-','2 quả chuối',254,2,'bị bỏ'),dAdd=dl('','+','3 quả chuối',368,3,'chữ mới');

// Prediction task and old/new snapshots
const task=mk('div','task',stage,'<b>ĐOÁN TRƯỚC</b>Tệp đã sửa thành 3 quả. Bản 2 quả chuối còn trong GitHub không?');place(task,90,540,900);
const snapNow=mk('div','snap',stage,`<div class="in"># banh-chuoi\n<span class="q3">3</span> quả chuối</div>`);place(snapNow,650,1000);
const snapOld=mk('div','snap big',stage,`<div class="in"># banh-chuoi\n<span class="q3">2</span> quả chuối</div>`);place(snapOld,190,770);
const tagNow=mk('div','tagline',stage,'Hiện tại');place(tagNow,650,930);
const tagOld=mk('div','tagline',stage,'Bản lúc: Thêm công thức');place(tagOld,190,690);
const draft=mk('div','snap draft',stage,`<div class="in"># banh-chuoi\n<span class="q3">4</span> quả chuối</div>`);place(draft,640,960);
const tagDraft=mk('div','tagline',stage,'Bản nháp · chưa commit');place(tagDraft,630,890);
const tagRepo=mk('div','tagline',stage,'Tệp + lịch sử thay đổi');place(tagRepo,0,1220);tagRepo.style.left='50%';gsap.set(tagRepo,{xPercent:-50});
const noteRepo=mk('div','note',stage,'ngăn chứa dự án');const noteCommit=mk('div','note',stage,'điểm lưu có ghi chú');
place(noteRepo,310,975);place(noteCommit,770,975);gsap.set([noteRepo,noteCommit],{xPercent:-50});

// Wires
const wUp=wire('M250 1060C250 950 350 880 440 850',{color:'#7cc4ff',width:7}),wDown=wire('M640 850C730 880 850 960 850 1070',{color:'#7cc4ff',width:7});
const wRepo=wire('M540 668V840',{color:'#c9c0ff',width:6});
const rail1=wire('M110 1380H850'),rail2=wire('M110 1300H980');

// ── Actors ────────────────────────────────────────────────────────────────
const JAR=[['repository',300,580],['pull request',760,640],['branch',250,760],['merge',560,800],['commit',850,820],['fork',420,960],['clone',740,1000],['issue',260,1140],['push',600,1160],['Actions',850,1200]];
const jars=JAR.map(([t,x,y],i)=>{const a=actor('jar-'+i,`<div class="pop jar">${t}</div>`,x,y,1);gsap.set(a,{rotation:(i%3-1)*3});return a;});
const tRepo=tile('t-repo','p-violet',G.folder,'repo',310,820,1,-3,-7);
const tCommit=tile('t-commit','p-mint',G.commit,'commit',770,820,1,3,7);
const tBanana=tile('t-banana','p-amber',G.banana,'bánh chuối',540,1320,.78,-2,-5,false);
const tCloud=tile('t-cloud','p-blue',G.cloud,'GitHub',540,740,1.15,-2,-6,false);
const laptop=actor('laptop','<div class="pop laptop"><div class="shadow"></div><div class="lid"><div class="scr"><div class="mini-file"></div></div></div><div class="base"></div><div class="notch"></div><div class="cap">máy của bạn</div></div>',250,1170);
const phone=actor('phone','<div class="pop phone"><div class="shadow"></div><div class="body"><div class="scr"><div class="mini-file"></div></div></div><div class="cap">máy khác</div></div>',850,1180);
const lapFile=laptop.querySelector('.mini-file'),phFile=phone.querySelector('.mini-file');
const fileChip=chip('c-file','p-amber',G.banana,'công thức',250,1080,.9);
const okLap=badge('b-ok-lap','p-mint',G.check,370,1040,.8),okPh=badge('b-ok-ph','p-mint',G.check,940,1050,.8);
const folder=actor('folder',`<div class="pop folder"><div class="shadow"></div><div class="back"></div><div class="tab"></div><div class="sheet"></div><div class="front"><div class="kind">REPO</div><div class="name">một dự án</div><div class="lock">${G.lock}</div></div></div>`,540,1000);
const fSheet=folder.querySelector('.sheet'),fName=folder.querySelector('.name'),fLock=folder.querySelector('.lock');gsap.set(fSheet,{y:90});
const clockB=badge('b-clock','p-violet',G.clock,720,890,.9);
const BX=[190,470,750];
const bead=(id,n,x,y,ghost)=>actor(id,`<div class="pop bead ${ghost?'ghost':'p-mint'}"><div class="core"><div class="num">${n}</div></div></div>`,x,y,1);
const beads=[1,2,3].map(n=>bead('bead-'+n,n,BX[n-1],1380));
const ghost=bead('ghost','?',BX[1],1380,true);
const blab=[['Initial commit','tự động · hôm qua'],['Thêm công thức','hôm qua'],['Thêm chuối','hôm nay']].map(([m,s],i)=>{const e=mk('div','blabel',stage,`${m}<small>${s}</small>`);place(e,BX[i],1440);gsap.set(e,{xPercent:-50});return e;});
const infoMsg=chip('c-msg','p-violet',G.note,'Thêm công thức',300,1215,.85),infoTime=chip('c-time','p-violet',G.clock,'hôm qua',760,1215,.85);
const ask=badge('b-ask','p-coral',G.ask,470,1170,1.3),okOld=badge('b-ok-old','p-mint',G.check,470,1170,1.3),noGhost=badge('b-no-ghost','p-coral',G.cross,930,1210,.9);
const snap=mk('div','snap',stage,`<div class="in"># banh-chuoi\n<span class="sq">2</span> quả chuối</div>`);place(snap,390,780);const snapQ=snap.querySelector('.sq');
// Dialog sits above everything
const dim=mk('div','dim',stage);
const dialog=mk('div','dialog');place(dialog,120,760,840,400);
dialog.innerHTML='<div class="tt">Commit changes</div><div class="lb">Commit message</div><div class="in"><span class="v"></span><span class="caret"></span></div><div class="ok">Commit changes</div>';
const dlgV=dialog.querySelector('.v'),dlgOk=dialog.querySelector('.ok');

function flash(t){tl.fromTo(fl,{opacity:0},{opacity:.85,duration:.12,immediateRender:false},t);tl.to(fl,{opacity:0,duration:.45},t+.12);samples.push({job:'snapshot flash',start:t,end:t+.57});}
function pin(x,y,t,job){put(snap,{autoAlpha:1,x:0,y:0,scale:.9,left:'660px',top:'915px'},t);tl.fromTo(snap,{scale:.6,autoAlpha:0},{scale:.9,autoAlpha:1,duration:.35,ease:'back.out(1.6)',immediateRender:false},t);
 return t2=>{tl.to(snap,{x:x-810,y:y-1010,scale:.18,duration:.75,ease:'power2.in'},t2);tl.to(snap,{autoAlpha:0,duration:.15},t2+.7);samples.push({job,start:t2,end:t2+.85});};}

// ── INTRO · two words out of a cloud of jargon ──────────────────────────
const I0=S('intro');chapter(I0,'LẦN ĐẦU MỞ GITHUB');ambient('warm',I0);
heading(I0,'Lần đầu mở GitHub?','Chỉ cần hai từ.','g-coral',cue('intro','hai từ'));
const jarT=cue('intro','lần đầu');jars.forEach((a,i)=>appear(a,jarT-.2+i*.16,.5));
const strange=cue('intro','chữ lạ');jars.forEach((a,i)=>pulse(a,strange+i*.04,1.06));
const calm=cue('intro','đừng lo');jars.forEach((a,i)=>{if(i!==0&&i!==4)go(a,{autoAlpha:0,y:'+=40',scale:.85},calm+i*.03,.6);});
samples.push({job:'jargon clears',start:calm,end:calm+.9});
const repoT=cue('intro','ri-pô');go(jars[0],{x:310,y:820,autoAlpha:0,scale:.7},repoT-.3,.6,'repository chip becomes repo');appear(tRepo,repoT,.7);
const comT=cue('intro','com-mít');go(jars[4],{x:770,y:820,autoAlpha:0,scale:.7},comT-.3,.6,'commit chip becomes commit');appear(tCommit,comT,.7);
appear(tBanana,cue('intro','bánh chuối'),.7);
const X1=S(1);[tRepo,tCommit,tBanana].forEach(a=>vanish(a,X1));

// ── 1 · GitHub keeps projects online ─────────────────────────────────────
chapter(X1,'GITHUB LÀ GÌ');ambient('sky',X1);heading(X1,'GitHub:','cất dự án trên mạng.','g-blue');
appear(laptop,X1+.15,.6);tl.set(lapFile,{opacity:1},X1);appear(phone,X1+.3,.6);
appear(tCloud,cue(1,'trang web'),.7);
const upT=cue(1,'cất dự án');put(fileChip,{x:250,y:1080,scale:.9},X1);appear(fileChip,upT-.35,.4);draw(wUp,upT-.1,.7,'path to GitHub');go(fileChip,{x:540,y:730,scale:.35,autoAlpha:0},upT+.15,.9,'recipe uploads into GitHub');
pulse(tCloud,cue(1,'tệp nằm'),1.06);
const anyT=cue(1,'máy nào');draw(wDown,anyT,.7,'path to another device');tl.fromTo(phFile,{opacity:0},{opacity:1,duration:.3,immediateRender:false},anyT+.6);
const openT=cue(1,'mở được');appear(okLap,openT-.1,.45);appear(okPh,openT+.05,.45);

// ── 2 · Each project = one repo ──────────────────────────────────────────
const X2=S(2);chapter(X2,'REPO');ambient('violet',X2);heading(X2,'Mỗi dự án:','một repo.','g-violet');
[laptop,phone,fileChip,okLap,okPh].forEach(a=>vanish(a,X2));[wUp,wDown].forEach(w=>erase(w,X2));
go(tCloud,{x:540,y:590,scale:.55},X2+.05,.8,'GitHub steps back');
const boxT=cue(2,'ngăn riêng');draw(wRepo,boxT-.2,.4);appear(folder,boxT,.75);
pulse(folder,cue(2,'gọi là ri-pô'),1.05);
go(fSheet,{y:0},cue(2,'chứa các tệp'),.7,'files go into the repo');
const histT=cue(2,'lịch sử');appear(clockB,histT,.55);show(tagRepo,histT+.2,.45);

// ── 3 · Create the first repo (+ → New repository → name) ────────────────
const X3=S(3);chapter(X3,'TẠO REPO');ambient('sky',X3);heading(X3,'Tạo repo','đầu tiên.','g-blue');
[tCloud,folder,clockB].forEach(a=>vanish(a,X3));erase(wRepo,X3);hide(tagRepo,X3);
show(win,cue(3,'tạo ri-pô')-.2,.55);
const plusT=cue(3,'dấu cộng');press(plus,plusT);tl.to(plus,{borderColor:'#168ff6',duration:.2},plusT);show(menu,plusT+.25,.35);
const newT=cue(3,'chọn niu');tl.to(menuA,{backgroundColor:'#e8f3ff',color:'#1170d0',duration:.2},newT);press(menuA,newT+.35);
hide(menu,newT+.8,.25);tl.to(plus,{borderColor:'#e3e7ec',duration:.2},newT+.8);value(url,'github.com/new',newT+.85);
fadeIn(ftitle,newT+.9);fadeIn(fname,newT+1.0);fadeIn(field,newT+1.05);
const nameT=cue(3,'đặt tên');cls(field,'field focus',nameT-.1);type(fieldV,'banh-chuoi',nameT+.1,1.2);
show(hint,cue(3,'không dấu'),.4);

// ── 4 · Visibility, README, Create ───────────────────────────────────────
const X4=S(4);heading(X4,'Ai được xem?','Rồi bấm Create.','g-violet');
cls(field,'field',X4);hide(field.querySelector('.caret'),X4,.1);hide(hint,X4);
fadeIn(fvis,X4+.1);fadeIn(optPub,X4+.2);fadeIn(optPri,X4+.3);fadeIn(togrow,X4+.4);fadeIn(create,X4+.5);
const priT=cue(4,'prai-vịt');tl.to(optPri,{borderColor:'#168ff6',boxShadow:'0 0 0 7px #168ff622',duration:.25},priT);tl.to(optPri.querySelector('.radio b'),{opacity:1,duration:.2},priT);pulse(optPri,priT+.1,1.04);
const pubT=cue(4,'pắp-lích');tl.to(optPub,{borderColor:'#ffb08e',duration:.2},pubT);pulse(optPub,pubT+.1,1.04);tl.to(optPub,{borderColor:'#e3e7ec',duration:.3},cue(4,'ai cũng xem')+.9);
const rdT=cue(4,'rít-mi');tl.to(tog,{backgroundColor:'#25c694',duration:.25},rdT);go(togB,{x:44},rdT,.25,'README switched on');
const crT=cue(4,'cri-ết');press(create,crT);tl.to(create,{boxShadow:'0 5px 0 #17803f,0 0 0 10px #2fbf5f33',duration:.25},crT);

// ── 5 · The repo exists: README + first commit made automatically ────────
const X5=S(5);chapter(X5,'REPO ĐẦU TIÊN');ambient('violet',X5);heading(X5,'Repo đã có','một tệp README.','g-violet');
hide(win,X5,.35);
value(fName,'banh-chuoi',X5);tl.set(fLock,{opacity:1},X5);
put(folder,{x:300,y:870,scale:.85},X5);appear(folder,cue(5,'xong'),.7);
const rdmT=cue(5,'tệp rít-mi');put(file,{x:-240,y:-10,scale:.2},X5);tl.set(file,{autoAlpha:1},rdmT);go(file,{x:220,y:-15,scale:.48},rdmT,.8,'README comes out of the repo');
show(tagReadme,cue(5,'giới thiệu'),.45);
const autoT=cue(5,'tự lưu');draw(rail1,autoT-.2,.6,'history rail');appear(beads[0],autoT+.25,.6);show(blab[0],autoT+.45,.4);pulse(beads[0],cue(5,'điểm đầu tiên'),1.12);

// ── 6 · Edit: pencil, type "2 quả chuối" ─────────────────────────────────
const X6=S(6);chapter(X6,'SỬA TỆP');ambient('sky',X6);heading(X6,'Ghi công thức','vào tệp.','g-amber');
vanish(folder,X6);hide(tagReadme,X6);
go(file,{x:0,y:0,scale:1},X6+.1,.9,'README opens large');
const penT=cue(6,'cây bút');pulse(pen,penT,1.18);cls(file,'file editing',penT+.3);tl.to(fcaret,{opacity:1,duration:.1},penT+.35);
const tyT=cue(6,'hai quả chuối');value(qty,'2',tyT);type(rest,' quả chuối',tyT+.12,.9);
[0,1].forEach(i=>tl.to(fb[i],{autoAlpha:1,scale:1,duration:.35,ease:'back.out(2)'},tyT+1.05+i*.15));

// ── 7 · Not in history until commit: dialog + message ────────────────────
const X7=S(7);heading(X7,'Chưa vào lịch sử','cho đến khi commit.','g-coral');
const notT=cue(7,'chưa vào lịch sử');show(stDraft,notT,.4);appear(ghost,notT+.2,.5);
const btnT=cue(7,'nút com-mít');fadeIn(cbtn,btnT-.5,.3);press(cbtn,btnT);
const askT=cue(7,'hỏi');tl.to(dim,{opacity:.09,duration:.3},askT-.2);show(dialog,askT-.15,.45);
type(dlgV,'Thêm công thức',cue(7,'gõ ghi chú')+.3,1.1);
const okT=cue(7,'xác nhận');press(dlgOk,okT);hide(dialog,okT+.45,.3);tl.to(dim,{opacity:0,duration:.3},okT+.45);
tl.to(fcaret,{opacity:0,duration:.1},okT+.5);cls(file,'file',okT+.5);hide(cbtn,okT+.5,.2);

// ── 8 · What a commit is: snapshot + message + time → pinned bead ────────
const X8=S(8);chapter(X8,'COMMIT LÀ GÌ');ambient('mint',X8);heading(X8,'Commit =','một điểm lưu.','g-mint');
hide(stDraft,X8+.1);
pulse(ghost,cue(8,'một lần lưu'),1.12);
appear(infoMsg,cue(8,'ghi chú'),.5);appear(infoTime,cue(8,'thời điểm'),.5);
const shotT=cue(8,'chụp lại');flash(shotT);const fly8=pin(BX[1],1380,shotT+.15,'snapshot pinned as commit 2');
const pinT=cue(8,'ghim lên');fly8(pinT-.1);go(infoMsg,{x:BX[1],y:1440,scale:.4,autoAlpha:0},pinT,.7);go(infoTime,{x:BX[1],y:1440,scale:.4,autoAlpha:0},pinT+.05,.7);
vanish(ghost,pinT+.55,.15);appear(beads[1],pinT+.6,.55);show(blab[1],pinT+.8,.4);show(stSaved,pinT+.9,.4);

// ── 9 · Next day: 2 → 3, commit "Thêm chuối" ─────────────────────────────
const X9=S(9);chapter(X9,'SỬA LẦN HAI');ambient('sky',X9);heading(X9,'Hôm sau:','2 thành 3.','g-amber');
hide(stSaved,X9);
const sweetT=cue(9,'chưa đủ ngọt');pulse(qty,sweetT,1.25);
const flipT=cue(9,'thành số ba');cls(file,'file editing',flipT-.3);
tl.to(qty,{rotationX:90,duration:.15},flipT);value(qty,'3',flipT+.15);tl.to(qty,{rotationX:0,duration:.18},flipT+.15);samples.push({job:'quantity 2 → 3',start:flipT,end:flipT+.33});
tl.to(fb[2],{autoAlpha:1,scale:1,duration:.35,ease:'back.out(2)'},flipT+.3);
put(ghost,{x:BX[2],y:1380},flipT);show(stDraft,flipT+.45,.35);appear(ghost,flipT+.5,.45);
const c9=cue(9,'rồi com-mít');cls(file,'file',c9);flash(c9);value(snapQ,'3',c9);const fly9=pin(BX[2],1380,c9+.1,'snapshot pinned as commit 3');fly9(c9+.7);
hide(stDraft,c9+.9);vanish(ghost,c9+1.25,.15);
const msg9=cue(9,'thêm chuối');appear(beads[2],Math.max(msg9,c9+1.3),.55);show(blab[2],Math.max(msg9,c9+1.3)+.2,.4);show(stSaved,Math.max(msg9,c9+1.3)+.3,.4);

// ── 10 · History list: three commits, newest on top ──────────────────────
const X10=S(10);chapter(X10,'LỊCH SỬ');ambient('violet',X10);heading(X10,'Lịch sử:','ba điểm lưu.','g-violet');
hide(file,X10);hide(stSaved,X10);
const listT=cue(10,'mục com-mít');show(hist,listT-.1,.5);erase(rail1,listT);blab.forEach(e=>hide(e,listT,.25));
rows.forEach(r=>gsap.set(r,{autoAlpha:0}));
const RY=[755,955,1155];
go(beads[2],{x:205,y:RY[0]},listT+.2,.9,'commit 3 to the top row');go(beads[1],{x:205,y:RY[1]},listT+.25,.9);go(beads[0],{x:205,y:RY[2]},listT+.3,.9);
rows.forEach((r,i)=>fadeIn(r,listT+.6+i*.15,.4));
const threeT=cue(10,'ba điểm lưu');beads.forEach((b,i)=>pulse(b,threeT+(2-i)*.15,1.1));
show(newtag,cue(10,'mới nhất'),.4);
const gT=cue(10,'ghi chú gì');rows.forEach(r=>mark(r.msg,gT,'#ede9ff',1.2));
const wT=cue(10,'ai lưu');rows.forEach(r=>mark(r.who,wT,'#ffe8ee',1.0));
const lT=cue(10,'lúc nào');rows.forEach(r=>mark(r.when,lT,'#e3f2ff',1.2));

// ── 11 · Open commit 3: red line removed, green line added ───────────────
const X11=S(11);chapter(X11,'XEM THAY ĐỔI');ambient('sky',X11);heading(X11,'Đỏ: chữ bị bỏ.','Xanh: chữ mới.','g-mint',null,'g-coral');
const openT11=cue(11,'mở điểm lưu');pulse(rows[0],openT11,1.03);
hide(hist,openT11+.45,.35);hide(newtag,openT11+.45,.3);vanish(beads[0],openT11+.45);vanish(beads[1],openT11+.45);
go(beads[2],{x:160,y:660,scale:.78},openT11+.5,.8,'commit 3 opens');
[dDel,dAdd].forEach(e=>gsap.set(e,{backgroundColor:'#ffffff'}));
show(diff,openT11+.6,.5);
const tint=cue(11,'tô màu');tl.to(dDel,{backgroundColor:'#ffebee',duration:.4},tint);tl.to(dAdd,{backgroundColor:'#e6f9ef',duration:.4},tint+.15);
const redT=cue(11,'dòng đỏ');pulse(dDel,redT,1.03);tl.fromTo(dDel.querySelector('em'),{opacity:0},{opacity:1,duration:.3,immediateRender:false},redT);
const grT=cue(11,'dòng xanh');pulse(dAdd,grT,1.03);tl.fromTo(dAdd.querySelector('em'),{opacity:0},{opacity:1,duration:.3,immediateRender:false},grT);
dDel.querySelector('em').style.opacity=0;dAdd.querySelector('em').style.opacity=0;

// ── 12 · Prediction: is the 2-banana version still there? ────────────────
const X12=S(12);chapter(X12,'ĐOÁN THỬ');ambient('warm',X12);heading(X12,'Bản hai quả','còn không?','g-coral');
hide(diff,X12,.35);
blab.forEach((e,i)=>put(e,{top:'1360px'},X12));
put(beads[2],{scale:1},X12+.35);go(beads[2],{x:BX[2],y:1300},X12+.1,.8,'commits return to the rail');
put(beads[0],{x:BX[0],y:1300,scale:1},X12);put(beads[1],{x:BX[1],y:1300,scale:1},X12);appear(beads[0],X12+.3,.5);appear(beads[1],X12+.4,.5);
draw(rail2,X12+.2,.6);blab.forEach((e,i)=>show(e,X12+.6+i*.1,.4));
show(task,cue(12,'câu hỏi'),.5);
show(tagNow,X12+.7,.4);show(snapNow,X12+.75,.45);
const q12=cue(12,'hai quả chuối');appear(ask,q12,.55);pulse(beads[1],q12+.2,1.12);
tl.to(ask.firstElementChild,{scale:1.06,duration:.6,yoyo:true,repeat:3,ease:'sine.inOut'},cue(12,'còn không')+.4);

// ── 13 · Answer: yes — open commit 2, the old file is intact ─────────────
const X13=S(13);chapter(X13,'KẾT QUẢ');ambient('mint',X13);heading(X13,'Vẫn còn.','Bản cũ nằm yên.','g-mint');
hide(task,X13);
const yesT=cue(13,'vẫn còn');vanish(ask,yesT-.1,.2);appear(okOld,yesT,.55);
const old=cue(13,'mở điểm lưu');pulse(beads[1],old,1.15);tl.to([snapNow,tagNow],{opacity:.5,duration:.4},old);
show(tagOld,old+.3,.4);show(snapOld,old+.35,.5);
pulse(snapOld,cue(13,'hai quả chuối'),1.04);
const keepT=cue(13,'không xoá bản cũ');beads.forEach((b,i)=>pulse(b,keepT+i*.18,1.12));
const allT=cue(13,'mỗi com-mít');beads.forEach((b,i)=>tl.to(b.querySelector('.core'),{boxShadow:'0 0 0 10px #25c69433,0 12px 22px -8px #24bf9d55',duration:.3},allT+i*.12));

// ── 14 · Boundary: an uncommitted edit has no save point ─────────────────
const X14=S(14);chapter(X14,'LƯU Ý');ambient('alarm',X14);heading(X14,'Chưa commit','= chưa có lịch sử.','g-coral');
[snapOld,snapNow,tagOld,tagNow].forEach(e=>hide(e,X14));vanish(okOld,X14);
beads.forEach(b=>tl.to(b.querySelector('.core'),{boxShadow:'0 12px 22px -8px #24bf9d30,0 5px 12px #24334826',duration:.3},X14));
const doneT=cue(14,'đã com-mít');beads.forEach((b,i)=>pulse(b,doneT+i*.15,1.12));
const dT=cue(14,'phần sửa');show(tagDraft,dT,.4);show(draft,dT+.05,.45);put(ghost,{x:930,y:1300},X14);appear(ghost,dT+.4,.5);
const noT=cue(14,'không có điểm lưu');shake(ghost,930,noT);appear(noGhost,noT+.3,.45);tl.to([draft,tagDraft],{autoAlpha:0,y:40,duration:.8,ease:'power2.in'},noT+.9);samples.push({job:'draft disappears',start:noT+.9,end:noT+1.7});
const remT=cue(14,'nhớ com-mít');put(cbtn,{autoAlpha:0},X14);
const cbtn2=mk('div','cbtn',stage,'Commit changes…');place(cbtn2,0,1480);cbtn2.style.left='50%';gsap.set(cbtn2,{xPercent:-50});show(cbtn2,remT-.2,.4);press(cbtn2,remT+.3);

// ── OUTRO · rule ─────────────────────────────────────────────────────────
const XO=S('outro');chapter(XO,'GHI NHỚ');ambient('warm',XO);heading(XO,'Sửa xong,','nhớ commit.','g-coral');
vanish(ghost,XO);vanish(noGhost,XO);
put(tRepo,{x:310,y:800,scale:1},XO);put(tCommit,{x:770,y:800,scale:1},XO);
const rT=cue('outro','ri-pô là');appear(tRepo,rT,.7);show(noteRepo,rT+.4,.4);
const cT=cue('outro','mỗi com-mít');appear(tCommit,cT,.7);show(noteCommit,cT+.4,.4);
press(cbtn2,cue('outro','sửa xong'));
const bT=cue('outro','bản cũ');beads.forEach((b,i)=>pulse(b,bT+i*.15,1.12));

// ── Headings: sequential (old fades out, then new fades in; never overlapping) ──
H.forEach((h,i)=>{const e=mk('div','heading',stage);e.style.display='none';const chars=Math.max(h.l1.length,h.l2.length);e.style.fontSize=Math.min(100,Math.floor(930/(chars*.55)))+'px';
 const a=mk('span','l1 '+h.c1,e);a.textContent=h.l1;const b=mk('span','l2 '+h.c2,e);b.textContent=h.l2;
 const t0=i?h.t+.28:h.t+.1;tl.set(e,{display:'block'},t0);tl.fromTo(e,{autoAlpha:0,y:16},{autoAlpha:1,y:0,duration:.45,ease:'power2.out',immediateRender:false},t0);
 if(h.l2t){gsap.set(b,{opacity:0});tl.fromTo(b,{opacity:0},{opacity:1,duration:.45,immediateRender:false},h.l2t);}
 if(H[i+1]){tl.to(e,{autoAlpha:0,duration:.25},H[i+1].t);tl.set(e,{display:'none'},H[i+1].t+.26);}});

// ── Captions: current word highlighted; spoken spelling mapped to display spelling ──
const MAP=Object.entries(SC.captionDisplay||{}).sort((a,b)=>b[0].length-a[0].length);
function display(w){for(const[k,v]of MAP){const re=new RegExp('^'+k+'(?=[^\\p{L}]|$)','iu');const m=w.match(re);if(m){const cap=m[0][0]!==m[0][0].toLowerCase();return w.replace(re,cap?v[0].toUpperCase()+v.slice(1):v);}}return w;}
const band=document.getElementById('captions');
sections.forEach(s=>{const chunks=[];let line=[];for(const w of s.words){const d=display(w.w);if(line.length&&line.map(x=>x.d).join(' ').length+d.length+1>40){chunks.push(line);line=[];}line.push({...w,d});}if(line.length)chunks.push(line);
 chunks.forEach((words,i)=>{const e=mk('div','caption-line',band);const st=Math.max(s.start,words[0].t0-.08),en=Math.min(s.start+s.dur,i+1<chunks.length?chunks[i+1][0].t0-.08:words.at(-1).t1+.3);tl.set(e,{opacity:1},st);tl.set(e,{opacity:0},en);
  words.forEach((w,j)=>{if(j)e.appendChild(document.createTextNode(' '));const sp=mk('span','caption-word',e);sp.textContent=w.d;tl.set(sp,{color:'#168ff6'},w.t0);tl.set(sp,{color:'#44494f'},j+1<words.length?words[j+1].t0:Math.min(en,w.t1+.25));});});});
tl.to(document.getElementById('progress'),{width:900,duration:P.total,ease:'none'},0);
window.StoryTimeline=tl;
})();
