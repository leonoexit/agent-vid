document.addEventListener('DOMContentLoaded',async()=>{
const C=Collage,P=Pop,tl=gsap.timeline({paused:true}),world=document.getElementById('world'),S=PLAN.sections,U=[SCRIPT.intro,...SCRIPT.scenes,SCRIPT.outro],T=PLAN.total;
const b=(p,c,x,y,w,h,t)=>C.box(p,c,x,y,w,h,t),text=(p,t,x,y,w,size=50,cls='body',color='#342046')=>{let e=C.text(p,cls,t,x,y,w);Object.assign(e.style,{fontSize:size+'px',color});e.dataset.readabilityText='true';return e},cue=(i,k)=>P.cue(U[i],S[i],k),st=i=>S[i].start,en=i=>S[i].start+S[i].dur;
const life=(e,a,z=T)=>{gsap.set(e,{autoAlpha:0});tl.set(e,{autoAlpha:1},a);if(z<T)tl.set(e,{autoAlpha:0},z)},show=(e,t,dy=40)=>{gsap.set(e,{autoAlpha:0});tl.fromTo(e,{y:dy,autoAlpha:0},{y:0,autoAlpha:1,duration:.45,ease:'power3.out',immediateRender:false},t)},jitter=(e,seed=1)=>C.paperJitter(tl,e,0,T,{x:1.5,y:1,rotation:.12,seed});
const grp=(x,y,w=950,h=500)=>{let a=b(world,'assembly',x,y,w,h),i=b(a,'inner',0,0,w,h);jitter(i,Math.round(x+y));return {a,i}};
const paper=(p,t,x,y,w=880,size=40,kind='white-strip')=>C.backplate(p,t,x,y,{width:w,size,kind});
const KEY='assets/library/brass-key-pop-a35804a9b9.png',FIG='assets/library/viewer-stick-puzzled-674398e470.png';
const bg=b(world,'field',0,0,1080,1920);world.prepend(bg);bg.style.background='#edb1da';
const slab=b(bg,'slab',830,-100,430,2200);slab.style.background='#fff064';slab.style.transform='rotate(12deg)';
tl.to(slab,{x:450,duration:.6,ease:'power2.inOut'},st(1));tl.to(bg,{backgroundColor:'#7546d9',duration:.55},st(2));tl.to(bg,{backgroundColor:'#83d9e9',duration:.55},st(3));tl.to(bg,{backgroundColor:'#fff064',duration:.55},st(4));tl.to(bg,{backgroundColor:'#edb1da',duration:.55},st(5));
const scenes=S.map((s,i)=>{let e=b(world,'scene',0,0,1080,1650);life(e,s.start,en(i));return e});
function title(i,t,size=112,color='#342046'){let e=text(scenes[i],t,75,155,940,size,'display',color);jitter(e,70+i);return e}
text(scenes[0],'API KEY / GITHUB CÔNG KHAI',80,78,950,29,'body');title(0,'Xóa rồi.\nHết lộ?');
const repo=grp(65,550,950,510),win=b(repo.i,'window',0,0,950,510);
b(win,'chrome',0,0,950,82);['#ff6058','#febc2e','#28c840'].forEach((c,i)=>b(win,'traffic',26+i*31,30,18,18).style.background=c);
text(win,'demo / weather-app',210,23,680,31,'ui');text(win,'GitHub · public · config.js',35,113,870,30,'ui');
b(win,'rule',30,169,890,1).style.background='#d9dbe4';
text(win,'1  const city = "Hanoi";',38,206,875,34,'code');
const row=b(win,'key-highlight',25,263,900,65);row.style.background='#f0445928';const code=text(win,'2  API_KEY = "DEMO_INVALID"',38,275,875,34,'code');code.id='leaked-line';
text(win,'3  loadWeather(city);',38,356,870,34,'code');
text(win,'Mô phỏng · key giả, không sử dụng được',35,455,880,24,'ui muted');
const del=cue(0,'delete')+.38,commit=cue(0,'commit')+.2;tl.to([code,row],{autoAlpha:0,x:-30,duration:.26},del);
const clean=text(win,'Đã xóa dòng chứa key',38,279,870,34,'ui good');life(clean,del+.3,st(2));
const c1=paper(scenes[0],'Commit mới: xóa key',80,1150,820,38,'white-strip');show(c1,commit);jitter(c1,8);
// Crop transparent margins through a CSS viewport, leaving original pixels intact.
const figure=b(scenes[0],'figure',690,1285,240,390);figure.style.overflow='hidden';let fi=C.image(figure,FIG,-122,-148,450,{alt:'Người que vẽ tay bối rối'});fi.style.filter='none';show(figure,commit+.35,15);jitter(figure,13);
const q=text(scenes[0],'Ổn chưa?',130,1405,510,72,'display');life(q,commit+.35,en(0));
const no=paper(scenes[0],'CHƯA.',110,1530,460,43,'yellow-strip');show(no,cue(0,'no')-.1,15);
// History preserves the older version even after a clean new commit.
title(1,'Bản mới sạch.\nLịch sử còn.');tl.to(repo.a,{y:-50,scale:.86,transformOrigin:'top left',duration:.6,ease:'power2.inOut'},st(1));
const old=grp(150,1130,850,360),ow=b(old.i,'window',0,0,850,360);text(ow,'Commit trước · config.js',30,30,800,32,'ui');b(ow,'rule',25,85,800,1).style.background='#ddd';
const oldrow=b(ow,'key-highlight',20,125,810,75);oldrow.style.background='#fff064';text(ow,'API_KEY = "DEMO_INVALID"',36,147,790,32,'code').id='historical-key';text(ow,'Key vẫn nằm trong phiên bản cũ',30,265,790,29,'ui');life(old.a,cue(1,'old')-.25,st(2));tl.fromTo(old.a,{x:30,y:70},{x:0,y:0,duration:.6,ease:'power3.out',immediateRender:false},cue(1,'old')-.25);
const history=paper(scenes[1],'LỊCH SỬ COMMIT',150,980,700,34,'yellow-strip');show(history,cue(1,'history')-.2);jitter(history,17);
const footer1=text(scenes[1],'Xóa hiện tại ≠ xóa quá khứ',80,1530,920,38,'body');life(footer1,cue(1,'key')+.3,en(1));
tl.to(repo.a,{x:-1100,autoAlpha:0,duration:.55,ease:'power2.in'},st(2));
// A copied credential remains usable independently of a cleaned repository.
title(2,'Nếu key đã\nbị chép lại?',112,'#fffdf7');
const keyA=grp(90,610,410,425),keyB=grp(585,800,360,375);const ai=C.image(keyA.i,KEY,0,0,410,{alt:'Chìa khóa gốc — ẩn dụ quyền truy cập'}),bi=C.image(keyB.i,KEY,0,0,360,{alt:'Bản sao chìa khóa — giả định đã bị chép'});life(keyA.a,st(2)+.55,st(4));life(keyB.a,cue(2,'copy'),st(4));tl.fromTo(keyA.a,{y:85,rotation:-8},{y:0,rotation:0,duration:.55,immediateRender:false},st(2)+.55);tl.fromTo(keyB.a,{x:-460,y:-160,scale:.7},{x:0,y:0,scale:1,duration:.75,ease:'power3.inOut',immediateRender:false},cue(2,'copy'));
const orig=paper(scenes[2],'KEY GỐC',75,1210,440,34),copy=paper(scenes[2],'BẢN SAO',580,1210,430,34);life(orig,st(2)+.2,en(2));show(copy,cue(2,'copy')+.7);
const still=paper(scenes[2],'Còn hiệu lực → còn dùng được',75,1440,930,36,'yellow-strip');show(still,cue(2,'active')-.2);jitter(still,28);
// The provider changes validity. Keep both physical copies present but disabled.
title(3,'Thu hồi key.\nNgay ở nơi cấp.',105);tl.to(keyA.a,{x:70,y:510,scale:.6,duration:.65,ease:'power2.inOut'},st(3));tl.to(keyB.a,{x:45,y:320,scale:.68,duration:.65,ease:'power2.inOut'},st(3));
const provider=grp(65,520,950,530),pw=b(provider.i,'window',0,0,950,530);life(provider.a,st(3)+.7,st(4));text(pw,'DỊCH VỤ CẤP KEY',35,35,865,30,'ui');text(pw,'API keys',35,98,865,52,'ui');text(pw,'DEMO_INVALID',35,203,800,39,'code');text(pw,'Giao diện minh họa',35,463,850,23,'ui muted');
const active=text(pw,'Active',670,105,240,31,'ui good'),revoked=text(pw,'Revoked',650,105,270,31,'ui bad');const rev=cue(3,'revoke')+.55;life(active,st(3),rev);life(revoked,rev,st(4));
const button=b(pw,'revoke-button',35,300,420,89);const bt=text(button,'Revoke key',28,23,370,36,'ui light');const done=text(button,'Đã thu hồi',28,23,370,36,'ui light');life(bt,st(3),rev);life(done,rev,st(4));tl.to(button,{scale:.96,duration:.1},rev-.1).to(button,{scale:1,backgroundColor:'#576771',duration:.18},rev);
tl.to([ai,bi],{opacity:.28,filter:'grayscale(1)',duration:.5},rev);const invalid=paper(scenes[3],'HẾT HIỆU LỰC',135,1490,810,43,'white-strip');show(invalid,cue(3,'invalid'),20);jitter(invalid,38);
// Replacement, deployment configuration and audit are distinct follow-through actions.
title(4,'Thay key.\nKiểm tra dấu vết.',105);
const env=grp(65,525,950,400),ew=b(env.i,'window',0,0,950,400);life(env.a,st(4),st(5));text(ew,'ỨNG DỤNG / ENVIRONMENT',35,30,870,29,'ui');text(ew,'API_KEY',35,117,860,37,'code');const newkey=text(ew,'NEW_DEMO_INVALID',35,185,880,38,'code');newkey.id='replacement-key';life(newkey,cue(4,'new'),st(5));const configured=text(ew,'Đã cập nhật cấu hình',35,296,870,31,'ui good');life(configured,cue(4,'env')+.25,st(5));
const logs=grp(95,1040,890,400),lw=b(logs.i,'window',0,0,890,400);life(logs.a,cue(4,'logs')-.3,st(5));text(lw,'RÀ SOÁT SỬ DỤNG',35,32,815,30,'ui');text(lw,'Nhật ký yêu cầu',35,131,810,39,'ui');text(lw,'Chi phí bất thường',35,236,810,39,'ui');b(lw,'rule',35,208,805,1).style.background='#ddd';
const cleanup=paper(scenes[4],'Sau đó: xử lý dữ liệu còn lộ',70,1500,940,34,'white-strip');show(cleanup,cue(4,'cleanup')-.6,20);
// Close the exact distinction opened by the first deletion.
title(5,'Đừng nhầm\nhai việc này.',114);
const endA=paper(scenes[5],'Xóa dòng → sửa mã',80,660,920,44,'white-note');show(endA,st(5)+.15);jitter(endA,61);
const endB=paper(scenes[5],'Thu hồi key\n→ chặn quyền truy cập',80,1100,920,43,'white-note');show(endB,cue(5,'revoke')-.6);jitter(endB,62);
S.forEach(s=>P.captions(tl,s,document.getElementById('captions')));
await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));tl.set({}, {},T);tl.seek(T,true).seek(0,true);C.restorePaperJitter();window.REVIEW={duration:T,sections:S,estimatedWordTiming:true};window.__timelines={'pop-collage':tl};
});
