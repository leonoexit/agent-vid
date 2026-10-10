function buildStory(){
const W=document.getElementById('world'),P=PLAN,units=[SCRIPT.intro,...SCRIPT.scenes,SCRIPT.outro],tl=gsap.timeline({paused:true}),C=Collage;
const start=i=>P.sections[i].start,end=i=>start(i)+P.sections[i].dur,q=(i,k)=>Pop.cue(units[i],P.sections[i],k);
const set=(e,v,t)=>tl.set(e,v,t),move=(e,v,t,d=.65)=>tl.to(e,{...v,duration:d,ease:'power3.inOut'},t);
const pieces=[];let seed=0;
function life(e,a,b,small=false){pieces.push(e);C.paperJitter(tl,e,a,b-a,{seed:++seed,fps:6,x:small?1.3:2.8,y:small?.8:1.8,rotation:small?.12:.24});return e;}
function txt(p,t,x,y,w,size=90,color='#342046',cls='display'){let e=C.text(p,cls,t,x,y,w);Object.assign(e.style,{fontSize:size+'px',color});return e;}
function label(p,t,x,y,w=720,size=40,kind='white-strip'){return C.backplate(p,t,x,y,{width:w,size,kind});}
function pic(p,name,x,y,w){return C.image(p,'assets/'+name+'.png',x,y,w,{alt:'Minh họa cắt giấy: '+name});}
function enter(e,t,x=0,y=70,d=.5){C.enter(tl,e,t,{x,y,duration:d});}
function out(e,t,x=0,y=-90,d=.35){move(e,{x,y,autoAlpha:0},t,d);}
const field=C.box(W,'field',0,0,1080,1920);field.style.background='#fff064';
const dots=C.box(W,'dots',0,0,1080,1920);dots.style.opacity='.33';
const side=C.box(W,'side-paper',870,-130,360,2400);side.style.background='#edb1da';side.dataset.layoutAllowOverflow='true';gsap.set(side,{rotation:9});life(side,0,P.total,true);
const scenes=units.map((_,i)=>{let e=C.box(W,'scene',0,0,1080,1920);set(e,{autoAlpha:1},start(i));if(i<units.length-1)set(e,{autoAlpha:0},start(i+1));return e;});
function part(i,e,when=start(i),options={}){life(e,start(i),end(i),options.small);if(when>0||options.animate)enter(e,when,options.x||0,options.y??60);return e;}
const computer=pic(W,'computer',105,760,740);life(computer,0,P.total);gsap.set(computer,{rotation:-6,transformOrigin:'50% 60%'});
const penguin=pic(W,'penguin',715,1000,310);life(penguin,0,end(0));gsap.set(penguin,{rotation:8});out(penguin,start(1)-.32,150,80);
const gitHero=pic(scenes[0],'git-title',90,300,650);life(gitHero,0,end(0),true);
life(txt(scenes[0],'Vì sao',90,140,800,115),0,end(0),true);
life(txt(scenes[0],'ra đời?',390,555,600,122),0,end(0),true);
const date=label(scenes[0],'2005',625,205,360,38,'purple-strip');life(date,0,end(0),true);
const freeTicket=label(scenes[0],'BitKeeper\nDùng miễn phí',78,1280,640,42,'white-note');life(freeTicket,0,end(0),true);
move(freeTicket,{rotation:-8},q(0,'loss')-.2,.2);out(freeTicket,q(0,'loss')+.15,-900,20,.7);
const lost=label(scenes[0],'MẤT QUYỀN DÙNG MIỄN PHÍ',70,1300,890,34,'purple-strip');part(0,lost,q(0,'loss')+.5,{x:120,y:0,small:true});
move(computer,{rotation:3,scale:.9,y:-45},q(0,'git')-.25,.6);
// Context. Preserve the machine while contributions assemble around it.
set(field,{background:'#7546d9'},start(1));set(side,{background:'#83d9e9'},start(1));
part(1,txt(scenes[1],'Cùng sửa.\nCùng ghép.',70,155,960,115,'#fff064'),start(1));
part(1,label(scenes[1],'Trước 2005 · nhân Linux',75,450,850,34),start(1)+.25,{small:true});
move(computer,{x:-35,y:135,scale:.74,rotation:-5},start(1),.65);
const keeper=label(scenes[1],'BitKeeper',430,700,530,52,'yellow-strip');part(1,keeper,q(1,'tool'),{x:130,y:0,small:true});
const bundle=pic(scenes[1],'source-bundle',595,1000,390);part(1,bundle,q(1,'changes'),{x:180,y:30});
for(let k=0;k<3;k++){const e=C.box(scenes[1],'patch',95+k*280,580,230,130);e.innerHTML='<span>Thay đổi '+(k+1)+'</span><i></i><i></i><i></i>';part(1,e,q(1,'changes')+k*.16,{y:-60,small:true});set(e.querySelector('span'),{autoAlpha:0},q(1,'merge')+k*.13);move(e,{x:520-k*210,y:445+k*16,scale:.7,rotation:10-k*8},q(1,'merge')+k*.13,.7);}
// The license changes; source code and the computer are not destroyed.
set(field,{background:'#edb1da'},start(2));set(side,{background:'#f04459'},start(2));
part(2,txt(scenes[2],'Rồi thỏa thuận\nđổ vỡ.',75,160,950,105),start(2));
move(computer,{x:5,y:50,scale:.88,rotation:3},start(2),.65);
const bitLabel=label(scenes[2],'BitKeeper',75,600,630,58);part(2,bitLabel,start(2)+.1,{small:true});
const free2=label(scenes[2],'MIỄN PHÍ',330,780,610,59,'yellow-strip');part(2,free2,start(2)+.2,{small:true});
move(free2,{rotation:-14},q(2,'break'),.25);out(free2,q(2,'free'),850,-160,.75);
part(2,label(scenes[2],'2005: chấm dứt miễn phí',75,1280,900,35,'purple-strip'),q(2,'free')+.2,{x:-100,y:0,small:true});
part(2,txt(scenes[2],'Cần công cụ mới.',75,1430,920,61),q(2,'need')-.15,{y:20});
// Requirements appear as actions/relationships, not a list of technology buzzwords.
set(field,{background:'#7546d9'},start(3));set(side,{background:'#fff064'},start(3));
part(3,txt(scenes[3],'Thay thế.\nNhưng phải đủ sức.',65,150,970,91,'#fffdf7'),start(3));
move(computer,{x:-100,y:0,scale:.58,rotation:-3},start(3),.6);
const fast=label(scenes[3],'NHANH',535,590,450,42,'yellow-strip');part(3,fast,q(3,'fast'),{x:-360,y:0,small:true});
const branchLabel=label(scenes[3],'NHIỀU NHÁNH',190,1060,710,48);part(3,branchLabel,q(3,'branches'),{small:true});
const lane=[];for(let k=0;k<3;k++){let e=pic(scenes[3],'source-bundle',545,870,210);gsap.set(e,{autoAlpha:0});life(e,start(3),end(3));set(e,{autoAlpha:1},q(3,'branches')+k*.13);move(e,{x:(k-1)*245,y:k===1?-100:25,rotation:(k-1)*12},q(3,'branches')+k*.13,.65);lane.push(e);}
part(3,label(scenes[3],'PHÂN TÁN',150,1320,720,58,'yellow-strip'),q(3,'distributed'),{x:-100,y:0,small:true});
out(computer,start(4)-.45,-900,100,.45);
// Building the response, then an authentic metadata milestone.
set(field,{background:'#83d9e9'},start(4));set(side,{background:'#edb1da'},start(4));
part(4,txt(scenes[4],'Linus Torvalds',70,160,950,96),start(4));
part(4,label(scenes[4],'Người tạo ra Linux',80,345,810,40),start(4)+.15,{small:true});
const hands=pic(scenes[4],'typing-hands',85,710,930);part(4,hands,start(4)+.1,{x:-100,y:80});
const createdGit=pic(scenes[4],'git-title',310,430,500);part(4,createdGit,q(4,'build'),{x:100,y:-30,small:true});
move(hands,{scale:.81,y:100,rotation:-4},q(4,'date'),.6);
const evidence=C.box(scenes[4],'evidence',75,1115,900,355);evidence.innerHTML='<div class="evidence-kicker">KHO MÃ GIT · BẢN LƯU ĐẦU TIÊN</div><strong>07.04.2005</strong><div class="commit-meta">Linus Torvalds · e83c516</div><div class="evidence-note">Mốc ghi trong lịch sử kho mã</div>';part(4,evidence,q(4,'date'),{x:-110,y:0,small:true});
// Replication is deliberate and visible; the local change is a separate native piece.
set(field,{background:'#83d9e9'},start(5));set(side,{background:'#7546d9'},start(5));
part(5,txt(scenes[5],'Lịch sử dự án.\nTrên từng máy.',65,145,950,104),start(5));
const machines=[],histories=[];
for(let k=0;k<3;k++){
 const x=55+k*335;const m=pic(scenes[5],'computer',x,610+(k===1?65:0),310);machines.push(m);part(5,m,start(5)+k*.12,{x:k===0?-80:80,y:0});
 const h=pic(scenes[5],'source-bundle',x+38,1090,225);histories.push(h);part(5,h,q(5,'copy')+k*.18,{y:-120});
 part(5,txt(scenes[5],['Máy A','Máy B','Máy C'][k],x+45,1010,240,34,'#342046','mono'),start(5)+.35+k*.1,{small:true});
}
const local=C.box(scenes[5],'patch new-change',100,1270,240,130);local.innerHTML='<span>Thay đổi mới</span><i></i><i></i>';part(5,local,q(5,'local'),{y:40,small:true});
const copies=[];for(let k=1;k<3;k++){let e=C.box(scenes[5],'patch new-change',100,1270,240,130);e.innerHTML='<span>Thay đổi mới</span><i></i><i></i>';gsap.set(e,{autoAlpha:0});life(e,start(5),end(5),true);set(e,{autoAlpha:1},q(5,'join')+(k-1)*.12);move(e,{x:k*335,y:-35,rotation:k===1?-5:5},q(5,'join')+(k-1)*.12,.8);gsap.set(e.querySelector('span'),{autoAlpha:0});set(e.querySelector('span'),{autoAlpha:1},q(5,'join')+(k-1)*.12+.75);copies.push(e);}
// Answer the opening without turning it into a command tutorial.
set(field,{background:'#fff064'},start(6));set(side,{background:'#edb1da'},start(6));
part(6,txt(scenes[6],'Một nhu cầu thật.',65,160,970,95),start(6));
part(6,pic(scenes[6],'git-title',110,345,660),start(6)+.1,{x:-70,y:0,small:true});
set(computer,{autoAlpha:1,x:0,y:75,scale:.78,rotation:-5},start(6));
const finalPenguin=pic(scenes[6],'penguin',730,1030,275);part(6,finalPenguin,start(6)+.3,{x:100,y:0});
part(6,label(scenes[6],'Cộng tác tiếp.',80,1260,870,54),q(6,'why'),{small:true});
part(6,label(scenes[6],'Ở quy mô lớn.',190,1400,730,44,'purple-strip'),q(6,'community')-.7,{x:100,y:0,small:true});
// Captions carry normalized proper names while retaining audio timing.
function displayWords(words){const patterns=[['bít','ki','pờ','BitKeeper'],['li','nớt','tô','van','Linus Torvalds'],['gít','Git']];let out=[];const norm=x=>String(x).toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');for(let i=0;i<words.length;i++){let found=false;for(const m of patterns){let n=m.length-1;if(m.slice(0,n).every((s,j)=>norm(words[i+j]?.w||'')===s)){out.push({w:m[n],t0:words[i].t0,t1:words[i+n-1].t1});i+=n-1;found=true;break;}}if(!found)out.push(words[i]);}return out;}
P.sections.forEach(s=>Pop.captions(tl,{...s,words:displayWords(s.words)},document.getElementById('captions')));
tl.set({}, {},P.total);tl.seek(P.total,true);tl.seek(0,true);pieces.forEach(e=>{e.style.translate='var(--paper-x, 0px) var(--paper-y, 0px)';e.style.rotate='var(--paper-angle, 0deg)';});window.__timelines={'pop-collage':tl};window.REVIEW={duration:P.total,sections:P.sections,cues:units.map((u,i)=>Object.fromEntries(Object.keys(u.cues).map(k=>[k,q(i,k)]))),pieces:pieces.length};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',buildStory,{once:true});else buildStory();
