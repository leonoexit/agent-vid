document.addEventListener('DOMContentLoaded',async()=>{
const C=Collage,P=Pop,tl=gsap.timeline({paused:true}),world=document.getElementById('world'),S=PLAN.sections,U=[SCRIPT.intro,...SCRIPT.scenes,SCRIPT.outro],T=PLAN.total;
const b=(p,c,x,y,w,h)=>C.box(p,c,x,y,w,h),cue=(i,k)=>P.cue(U[i],S[i],k),st=i=>S[i].start,en=i=>S[i].start+S[i].dur;
let stage;function txt(p,t,x,y,w,size=40,cls='body',color='#342046'){if(p===world)p=stage;let e=C.text(p,cls,t,x,y,w);Object.assign(e.style,{fontSize:size+'px',color});e.dataset.readabilityText='true';return e}
function life(e,a,z=T){gsap.set(e,{autoAlpha:0});tl.set(e,{autoAlpha:1},a);if(z<T)tl.set(e,{autoAlpha:0},z)}
function jitter(e,seed=1){C.paperJitter(tl,e,0,T,{fps:7,x:2,y:1.4,rotation:.17,seed})}
function group(x,y,w=600,h=600,seed=1){let a=b(stage,'actor',0,0,w,h),i=b(a,'carrier',0,0,w,h);gsap.set(a,{x,y,transformOrigin:'0 0',xPercent:0,yPercent:0});jitter(i,seed);return {a,i,w,h}}
function sprite(p,id,x,y,w){const a=ART[id],[l,t,r,bot]=a.bounds,k=w/(r-l),h=(bot-t)*k;let e=b(p,'sprite',x,y,w,h);e.style.overflow='hidden';let im=C.image(e,a.src,-l*k,-t*k,a.size[0]*k,{alt:id});im.style.filter='none';e.dataset.asset=id;return {e,im,w,h}}
function photo(id,x,y,w,seed=1){let a=ART[id],h=w*(a.bounds[3]-a.bounds[1])/(a.bounds[2]-a.bounds[0]);let g=group(x,y,w,h,seed),s=sprite(g.i,id,0,0,w);g.im=s.im;g.sprite=s.e;return g}
function move(g,pose,t,d=.65){tl.to(g.a,{...pose,duration:d,ease:'power3.inOut'},t)}
function tag(p,t,x,y,w=540,size=34,kind='white-strip'){if(p===world)p=stage;let e=C.backplate(p,t,x,y,{width:w,size,kind});jitter(e,Math.round(x+y+w));return e}
function reveal(e,t,dy=35){gsap.set(e,{autoAlpha:0});tl.fromTo(e,{y:dy,autoAlpha:0},{y:0,autoAlpha:1,duration:.4,ease:'power3.out',immediateRender:false},t)}
const bg=b(world,'field',0,0,1080,1920);world.prepend(bg);bg.style.background='#edb1da';
const wash=b(bg,'wash',820,-200,580,2400);wash.style.background='#fff064';gsap.set(wash,{rotation:12});tl.to(wash,{x:600,duration:.7},st(1));
tl.to(bg,{backgroundColor:'#7546d9',duration:.5},st(2)).to(bg,{backgroundColor:'#83d9e9',duration:.5},st(3)).to(bg,{backgroundColor:'#fff064',duration:.5},st(4)).to(bg,{backgroundColor:'#edb1da',duration:.5},st(5));
stage=b(world,'picture-stage',0,0,1080,1640);stage.style.overflow='hidden';
const opening=group(75,100,940,350,10);
const hook=txt(opening.i,'',0,0,940,110,'display hook-heading');
hook.innerHTML='Lộ <span class="hook-accent hook-key"><i aria-hidden="true"></i><span>API key.</span></span><br><span class="hook-accent hook-question"><i aria-hidden="true"></i><span>Xóa là xong?</span></span>';
const keyAccent=hook.querySelector('.hook-key i'),questionAccent=hook.querySelector('.hook-question i'),question=hook.querySelector('.hook-question');
gsap.set([keyAccent,questionAccent],{scaleX:0,transformOrigin:'0% 50%'});
tl.to(keyAccent,{scaleX:1,duration:.52,ease:'power2.out'},.08);
tl.to(questionAccent,{scaleX:1,duration:.48,ease:'power2.inOut'},cue(0,'commit')+.45);
tl.to(question,{rotation:-1.4,scale:1.025,duration:.16,ease:'power2.out'},cue(0,'no')-.12).to(question,{rotation:0,scale:1,duration:.25,ease:'power2.inOut'},cue(0,'no')+.04);
life(opening.a,0,st(1));
const repoTag=tag(world,'GitHub · công khai',105,1390,660,35);life(repoTag,0,st(1));
// A physical code stack carries the credential. Erasing its current mark does not erase history.
const doc=photo('source-code-bundle',135,495,710,11);life(doc.a,0,st(2)+.3);
const mark=sprite(doc.i,'brass-key-pop',220,210,320);mark.e.id='current-key-mark';
const eraser=photo('eraser-pop-magenta',790,700,285,14);const del=cue(0,'delete')+.1;life(eraser.a,del-.3,del+1.3);
move(eraser,{x:365,y:830,rotation:-10},del-.3,.3);move(eraser,{x:565,y:760,rotation:4},del,.22);move(eraser,{x:365,y:835,rotation:-10},del+.22,.22);move(eraser,{x:560,y:770,rotation:4},del+.44,.22);tl.to(mark.e,{height:0,duration:.62,ease:'none'},del+.05);move(eraser,{x:1100,y:680,rotation:20},del+.85,.4);
const figure=photo('viewer-stick-puzzled',785,1170,190,15);figure.sprite.style.filter='none';life(figure.a,cue(0,'commit')+.35,st(1));tl.fromTo(figure.a,{x:1090,rotation:12},{x:785,rotation:0,duration:.55,ease:'power3.out',immediateRender:false},cue(0,'commit')+.35);
// Pull aside the clean copy and expose a prior physical record with the key still on it.
move(doc,{x:65,y:530,scale:.56,rotation:-8},st(1),.7);
const newTag=tag(world,'BẢN MỚI',65,1080,430,32);life(newTag,st(1)+.7,st(2));
const old=photo('source-code-bundle',470,675,620,21);gsap.set(old.a,{scale:.8});const oldmark=sprite(old.i,'brass-key-pop',190,190,285);oldmark.e.id='historical-key-mark';life(old.a,cue(1,'history')-.2,st(2)+.25);tl.fromTo(old.a,{x:65,y:620,scale:.56,rotation:-8},{x:495,y:785,scale:.8,rotation:7,duration:.9,ease:'power3.inOut',immediateRender:false},cue(1,'history')-.2);
tl.set(newTag,{autoAlpha:0},cue(1,'history')-.2);tl.set(newTag,{autoAlpha:1},cue(1,'history')+.75);
const oldTag=tag(world,'COMMIT CŨ',560,1400,430,32,'yellow-strip');life(oldTag,cue(1,'old'),st(2));
const histTitle=txt(world,'Lịch sử',100,205,750,98,'display');life(histTitle,st(1),st(2));jitter(histTitle,23);
// A key is lifted from the old sheet, then another copy leaves it.
const keyA=photo('brass-key-pop',670,970,320,31);gsap.set(keyA.a,{scale:.72,rotation:7});life(keyA.a,st(2),st(4)+.3);tl.set(oldmark.e,{autoAlpha:0},st(2));
move(doc,{x:-800,y:360,rotation:-30},st(2),.55);move(old,{x:1180,y:620,rotation:30},st(2),.55);move(keyA,{x:80,y:1040,scale:1,rotation:0},st(2),.7);
const lock=group(365,430,380,574,32);const closed=sprite(lock.i,'padlock-mint-closed',0,0,380),open=sprite(lock.i,'padlock-mint-open',0,0,380);closed.e.id='lock-closed';open.e.id='lock-open';open.e.style.filter='drop-shadow(2px 0 0 white) drop-shadow(-2px 0 0 white)';life(lock.a,st(2)+.25,T);gsap.set(open.e,{autoAlpha:0});tl.fromTo(lock.a,{y:150,scale:.7,autoAlpha:0},{y:430,scale:1,autoAlpha:1,duration:.65,ease:'power3.out',immediateRender:false},st(2)+.25);
const service=tag(world,'DỊCH VỤ',340,230,450,33);life(service,st(2)+.95,st(4)+3.5);
const copyAt=cue(2,'copy'),activeAt=cue(2,'active');const keyB=photo('brass-key-pop',80,1040,320,33);keyB.a.id='copied-key';life(keyB.a,copyAt,T);move(keyB,{x:715,y:1110,scale:.78,rotation:10},copyAt,.75);
const copyTag=tag(world,'BẢN SAO',615,1460,400,31);life(copyTag,copyAt+.7,st(3));
// The copied active key reaches the lock and access opens.
move(keyB,{x:265,y:890,scale:.625,rotation:-45},activeAt-.35,.65);tl.set(closed.e,{autoAlpha:0},activeAt+.45);tl.set(open.e,{autoAlpha:1},activeAt+.45);move(lock,{y:413,rotation:-3},activeAt+.45,.18);move(lock,{y:430,rotation:0},activeAt+.63,.2);
// Revoke at provider. The same old key is tried again and fails.
move(keyA,{x:65,y:1190,scale:.75,rotation:0},st(3),.65);move(keyB,{x:710,y:1190,scale:.75,rotation:0},st(3),.65);
const revoke=group(85,275,420,88,40),button=b(revoke.i,'revoke-control',0,0,420,88);txt(button,'Revoke key',25,20,375,38,'ui','#fffdf7');life(revoke.a,st(3)+.65,st(4));
// Replace service label with a focused provider action only, never a full dashboard.
tl.set(service,{autoAlpha:0},st(3));
const hand=photo('hand-pointing-magenta',555,350,190,41);const rev=cue(3,'revoke')+.5;life(hand.a,rev-.65,rev+.3);move(hand,{x:515,y:315,rotation:-5},rev-.65,.45);tl.to(button,{scale:.94,duration:.09},rev-.09).to(button,{scale:1,backgroundColor:'#566573',duration:.2},rev);
tl.set(open.e,{autoAlpha:0},rev);tl.set(closed.e,{autoAlpha:1},rev);tl.to([keyA.sprite,keyB.sprite],{filter:'grayscale(1)',opacity:.35,duration:.35},rev);
const revokedTag=tag(world,'THU HỒI',340,250,460,35,'yellow-strip');life(revokedTag,rev+.35,st(4));tl.set(revoke.a,{autoAlpha:0},rev+.35);
const retry=cue(3,'copy');move(keyB,{x:265,y:890,scale:.625,rotation:-45},retry,.4);move(keyB,{x:180,y:890,rotation:-52},retry+.45,.16);move(keyB,{x:710,y:1190,scale:.75,rotation:0},retry+.65,.45);
const deny=txt(world,'×',790,725,220,180,'ui','#ed3654');life(deny,retry+.4,st(4));tl.fromTo(deny,{scale:.4,rotation:-15},{scale:1,rotation:0,duration:.25,immediateRender:false},retry+.4);
// A replacement restores app access, then the camera's subject becomes the usage evidence.
move(keyA,{x:-400,y:1600,rotation:-30},st(4),.5);move(keyB,{x:1200,y:1600,rotation:30},st(4),.5);
const fresh=photo('brass-key-pop',-400,1150,320,50);life(fresh.a,cue(4,'new')-.2,cue(4,'logs')+.3);move(fresh,{x:100,y:1170,scale:.85,rotation:0},cue(4,'new')-.2,.55);
const freshTag=tag(world,'KEY MỚI',85,1480,445,34,'white-strip');life(freshTag,cue(4,'new')-.2,cue(4,'logs')-.35);
const configured=cue(4,'env')+.4;move(fresh,{x:265,y:890,scale:.625,rotation:-45},cue(4,'env')-.4,.65);tl.set(closed.e,{autoAlpha:0},configured);tl.set(open.e,{autoAlpha:1},configured);
const good=txt(world,'✓',790,740,220,130,'ui','#247052');life(good,configured,cue(4,'logs')-.35);const auditAt=cue(4,'logs')-.35;move(lock,{x:1200,y:350,rotation:12},auditAt,.6);move(fresh,{x:1150,y:860,rotation:5},auditAt,.6);
const receipt=photo('usage-receipt-pop',205,395,405,52);life(receipt.a,auditAt+.3,st(5));tl.fromTo(receipt.a,{y:1800,rotation:8},{y:395,rotation:-5,duration:.65,ease:'power3.out',immediateRender:false},auditAt+.3);
const magnify=photo('magnifier-pop-violet',560,810,410,53);life(magnify.a,cue(4,'logs'),st(5));move(magnify,{x:305,y:625,rotation:-15},cue(4,'logs'),.55);move(magnify,{x:355,y:900,rotation:0},cue(4,'logs')+.65,.75);
const auditTag=tag(world,'Logs · chi phí',90,1430,760,35);life(auditTag,cue(4,'logs')+.45,cue(4,'cleanup')+.1);
// Cleanup remains after revocation and audit. The grey secret mark is only residue now.
const cleanAt=cue(4,'cleanup')-.55;move(receipt,{x:65,y:455,scale:.76,rotation:-10},cleanAt,.55);move(magnify,{x:205,y:715,scale:.7,rotation:-10},cleanAt,.55);
const cleanup=photo('source-code-bundle',680,860,350,54),residue=sprite(cleanup.i,'brass-key-pop',105,105,145);residue.e.style.opacity='.3';residue.e.style.filter='grayscale(1)';life(cleanup.a,cleanAt,T);tl.fromTo(cleanup.a,{x:1200},{x:680,duration:.45,immediateRender:false},cleanAt);
const erase2=photo('eraser-pop-magenta',850,1030,180,55);life(erase2.a,cleanAt+.55,T);move(erase2,{x:745,y:1030,rotation:-10},cleanAt+.55,.25);move(erase2,{x:875,y:1000,rotation:5},cleanAt+.8,.23);move(erase2,{x:745,y:1030,rotation:-10},cleanAt+1.03,.23);tl.to(residue.e,{height:0,duration:.6},cleanAt+.7);
// Earned closing comparison, carried by the physical props rather than two text cards.
const finish=txt(world,'Xóa ≠ Thu hồi',70,220,950,108,'display');life(finish,st(5),T);jitter(finish,60);
move(cleanup,{x:90,y:820,scale:1.1,rotation:-7},st(5),.65);move(erase2,{x:85,y:1260,scale:1.1,rotation:0},st(5),.65);
tl.set(open.e,{autoAlpha:0},st(5));tl.set(closed.e,{autoAlpha:1},st(5));move(lock,{x:650,y:720,scale:.86,rotation:0},st(5),.7);
tl.set(keyB.a,{autoAlpha:1},st(5));move(keyB,{x:600,y:1270,scale:.63,rotation:-45},st(5),.7);
const endLeft=tag(world,'Xóa mã',70,1510,420,34),endRight=tag(world,'Chặn quyền',600,1510,440,34);life(endLeft,cue(5,'text')-.35,T);life(endRight,cue(5,'revoke')-.3,T);
move(keyB,{x:535,y:1165,rotation:-45},cue(5,'revoke')-.3,.3);move(keyB,{x:470,y:1210,rotation:-58},cue(5,'revoke')+.05,.2);
S.forEach(s=>P.captions(tl,s,document.getElementById('captions')));
await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));tl.set({}, {},T);tl.seek(T,true).seek(0,true);C.restorePaperJitter();window.REVIEW={duration:T,sections:S,estimatedWordTiming:true,imageLedTrial:true};window.__timelines={'pop-collage':tl};
});
