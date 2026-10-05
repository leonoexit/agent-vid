// OCP · phí ship — project-specific native renderer. Every model operation is keyed to a spoken word (cue()).
(()=>{
const P=window.PLAN,tl=gsap.timeline({paused:true}),stage=document.getElementById('stage'),sections=P.sections,NS='http://www.w3.org/2000/svg';
const samples=[];window.OPERATION_SAMPLES=samples;
const INK='#2d3436',Y='#feee91',B='#8ce4ff',O='#ffa239',R='#ff5656',G='#10b981',PU='#a594f9',W='#ffffff',CLEAR='rgba(255,255,255,0)';
const norm=x=>String(x).toLowerCase().normalize('NFC').match(/[\p{L}\p{N}]+/gu)||[];
const sec=id=>sections.find(x=>x.id===id),start=id=>sec(id).start;
function cue(id,phrase,occ=1){const words=sec(id).words.flatMap(w=>norm(w.w).map(token=>({token,t:w.t0}))),n=norm(phrase);let k=0;for(let i=0;i<words.length;i++){if(n.every((x,j)=>words[i+j]?.token===x)&&++k===occ)return words[i].t;}throw Error('Missing cue '+id+' '+phrase);}
function el(tag,cls,parent=stage,text){const e=document.createElement(tag);e.className=cls;if(text!=null)e.textContent=text;parent.appendChild(e);return e;}
function geo(e,x,y,w,h){Object.assign(e.style,{left:x+'px',top:y+'px'});if(w!=null)e.style.width=w+'px';if(h!=null)e.style.height=h+'px';return e;}
function box(id,x,y,w,h,color=W,parent=stage,cls='panel'){const e=el('div',cls,parent);e.id=id;geo(e,x,y,w,h);Object.assign(e.style,{background:color,visibility:'hidden',display:'none'});return e;}
function txt(parent,text,x,y,size=36,cls='note',w){const e=el('div',cls,parent,text);Object.assign(e.style,{position:'absolute',left:x+'px',top:y+'px',fontSize:size+'px'});if(w)e.style.width=w+'px';return e;}
function icon(parent,name,x,y,w,h,color=INK){const I=window.ICONS[name],s=document.createElementNS(NS,'svg');s.setAttribute('viewBox',I.vb);s.setAttribute('class','ico');Object.assign(s.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});for(const d of I.d){const p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('fill',color);s.appendChild(p);}parent.appendChild(s);return s;}
function code(parent,parts,x,y,size){const e=el('div','code',parent);Object.assign(e.style,{left:x+'px',top:y+'px',fontSize:size+'px'});const s={};for(const[t,c,k]of parts){const sp=el('span',c||'',e,t);if(k){s[k]=sp;sp.classList.add('hl');}}return{e,s};}
function show(e,t,d=.55){tl.set(e,{display:'block',visibility:'visible'},t);tl.fromTo(e,{opacity:0,y:24},{opacity:1,y:0,duration:d,ease:'power2.out',immediateRender:false},t);}
function hide(e,t,d=.3){tl.to(e,{opacity:0,duration:d},t);tl.set(e,{display:'none'},t+d);}
function move(e,vars,t,d=.8,job='recompose'){tl.to(e,{...vars,duration:d,ease:'power2.inOut'},t);samples.push({job,start:t,end:t+d});}
function reveal(e,t,d=.45){tl.fromTo(e,{opacity:0},{opacity:1,duration:d,immediateRender:false},t);}
function conceal(e,t,d=.3){tl.to(e,{opacity:0,duration:d},t);}
function concealed(e){gsap.set(e,{opacity:0});return e;}
const changes=new Map();function value(e,text,t){const prev=changes.has(e)?changes.get(e):e.textContent;tl.fromTo(e,{textContent:prev},{textContent:text,duration:0,immediateRender:false},t);changes.set(e,text);}
function flash(sp,t,bg,fg,back,hold=1.1){tl.to(sp,{backgroundColor:bg,color:fg,duration:.2},t);if(back)tl.to(sp,{backgroundColor:CLEAR,color:back,duration:.3},t+hold);}
function pop(e,t,unhide=false){if(unhide)tl.set(e,{display:'block',visibility:'visible'},t);tl.fromTo(e,{scale:.4,opacity:0},{scale:1,opacity:1,duration:.4,ease:'back.out(2)',immediateRender:false},t);samples.push({job:'pop '+(e.id||e.className),start:t,end:t+.4});}
function wire(id,d,t,end,color=INK,width=6,dur=.7){const svg=document.createElementNS(NS,'svg');svg.classList.add('wire-layer');svg.setAttribute('viewBox','0 0 1080 1920');svg.style.visibility='hidden';svg.style.display='none';stage.appendChild(svg);svg.id=id;const p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('fill','none');p.setAttribute('stroke',color);p.setAttribute('stroke-width',width);p.setAttribute('stroke-linecap','round');p.setAttribute('stroke-linejoin','round');svg.appendChild(p);const length=p.getTotalLength();gsap.set(p,{strokeDasharray:length,strokeDashoffset:length});tl.set(svg,{display:'block',visibility:'visible'},t);tl.to(p,{strokeDashoffset:0,duration:dur,ease:'power2.inOut'},t);if(end)hide(svg,end,.2);samples.push({job:id,start:t,end:t+dur});return svg;}
function token(text,x,y,toX,toY,t,d=.7,bg=O){const e=el('div','token',stage,text);Object.assign(e.style,{left:x+'px',top:y+'px',background:bg});tl.set(e,{visibility:'visible'},t);tl.fromTo(e,{x:0,y:0,opacity:1},{x:toX-x,y:toY-y,duration:d,ease:'power2.inOut',immediateRender:false},t);tl.to(e,{opacity:0,duration:.15},t+d);tl.set(e,{visibility:'hidden'},t+d+.16);samples.push({job:'token '+text,start:t,end:t+d});return e;}
function heading(id,text){const e=el('div','title',stage,text);const s=sec(id);show(e,s.start+.05,.4);hide(e,s.start+s.dur-.25,.25);return e;}
const viPhases=['CÂU HỎI','HIỆN TRẠNG','HIỆN TRẠNG','NẾU SỬA TRỰC TIẾP','NGUYÊN LÝ','TÁCH LỚP','RÚT GỌN HÀM','ĐÓNG HÀM','MỞ RỘNG','LỜI GỌI','ĐỊNH TUYẾN','KẾT QUẢ','KIỂM TRA','ĐỐI CHIẾU','GHI NHỚ'];
sections.forEach((s,i)=>{value(document.getElementById('phase'),viPhases[i],s.start);value(document.getElementById('counter'),String(i+1).padStart(2,'0')+' / 15',s.start);});
const S=n=>start('scene-'+n);

// ── Persistent objects (created behind-to-front) ─────────────────────────
// Verify columns sit behind the moving blocks.
const colOld=box('col-old',64,390,560,1240,W),colNew=box('col-new',648,390,364,1240,W);
txt(colOld,'CODE CŨ',28,26,24,'eyebrow');txt(colNew,'CODE MỚI',28,26,24,'eyebrow');
// tinh_tien — the protected function (charcoal identity).
const fn=box('fn',64,430,948,400,INK);fn.classList.add('dark');
const fnEyebrow=txt(fn,'PYTHON · HÀM ĐANG CHẠY',36,28,24,'eyebrow');fnEyebrow.style.color=Y;
const L0=el('div','line',fn);geo(L0,36,86);L0.style.fontSize='38px';
const def=code(L0,[['def ','k'],['tinh_tien'],['('],['gia','','gia'],[', '],['giao','','giao'],['):']],0,4);
function branch(top,color,parts){const c=el('div','line',fn);geo(c,36,top);c.style.fontSize='38px';const m=el('div','marker',c);m.style.background=color;const cd=code(c,parts,64,4);const ok=el('div','badge',c);geo(ok,800,3,56,56);Object.assign(ok.style,{background:G,borderWidth:'3px'});const chk=icon(ok,'check',12,12,26,26,INK),q=icon(ok,'question',16,11,18,28,INK);concealed(q);concealed(c);return{c,cd,ok,chk,q};}
const brT=branch(150,B,[['if','k'],[' giao == '],['"thuong"','s'],[': phi = '],['20','n']]);
const brN=branch(220,PU,[['elif','k'],[' giao == '],['"nhanh"','s'],[': phi = '],['35','n']]);
const ghost=el('div','line ghost',fn);geo(ghost,36,290);ghost.style.fontSize='38px';code(ghost,[['elif','k'],[' giao == '],['"hoatoc"'],[': phi = '],['60']],64,4);concealed(ghost);
const L3=el('div','line',fn);geo(L3,36,290);L3.style.fontSize='38px';const ret=code(L3,[['return ','k'],['gia + '],['phi','','expr']],64,4);concealed(L3);
const plugTag=el('div','pill',fn);geo(plugTag,690,148,232,52);Object.assign(plugTag.style,{background:Y,fontSize:'21px',boxShadow:'none'});icon(plugTag,'plug',14,9,22,28,INK);txt(plugTag,'ĐIỂM MỞ RỘNG',44,11,21,'mono').style.color=INK;concealed(plugTag);
const bindGia=txt(fn,'gia = 200',100,208,28,'mono');Object.assign(bindGia.style,{background:Y,color:INK,borderRadius:'10px',padding:'2px 12px'});concealed(bindGia);
const bindGiao=txt(fn,'giao = HoaToc()',330,208,28,'mono');Object.assign(bindGiao.style,{background:O,color:INK,borderRadius:'10px',padding:'2px 12px'});concealed(bindGiao);
// Class strips (blue / purple / orange identities match the old branch markers).
function strip(id,name,color,fee,y){const e=box(id,212,y,800,160,color);e.classList.add('strip','light');const line=txt(e,'',60,10,38,'mono');const nm=code(e,[['class ','k'],[name+':']],28,20,36);const a=code(e,[['def ','k'],['phi(self):']],64,92,30);const b=code(e,[['return ','k'],[fee,'n']],334,92,30);const badge=el('div','badge',e);geo(badge,648,18,120,120);const v=txt(badge,fee,0,0,60,'mono');Object.assign(v.style,{position:'static'});const plus=[0,1].map(i=>{const p=el('div','badge',e);geo(p,14,72+i*42,28,28);Object.assign(p.style,{borderRadius:'8px',borderWidth:'3px',background:G,font:'800 22px BentoMono'});p.textContent='+';return concealed(p);});[nm.e,a.e,b.e,badge].forEach(concealed);return{e,line,nm,a,b,badge,plus};}
const sT=strip('cls-thuong','GiaoThuong',B,'20',880),sN=strip('cls-nhanh','GiaoNhanh',PU,'35',1064),sH=strip('cls-hoatoc','HoaToc',O,'60',1118);
sT.line.textContent='if giao == "thuong": phi = 20';sN.line.textContent='elif giao == "nhanh": phi = 35';

// ── 0 · Question: dominant poster + two-object hook ──────────────────────
const poster=box('poster',64,190,948,480,Y);txt(poster,'SOLID · CHỮ O',40,34,26,'eyebrow');txt(poster,'Thêm hỏa tốc:\nsửa hàm cũ?',40,92,86,'serif',870);const posterSub=txt(poster,'Nguyên lý Đóng / Mở',40,330,44,'note');const posterEn=txt(poster,'Open/Closed Principle',40,396,28,'mono');[posterSub,posterEn].forEach(concealed);
const hookFn=box('hook-fn',64,720,440,840,INK),hookNew=box('hook-new',572,720,440,840,O);
txt(hookFn,'HÀM ĐANG CHẠY',34,34,24,'eyebrow').style.color=Y;txt(hookFn,'tinh_tien()',34,120,46,'mono').style.color=W;const hookOk=el('div','badge',hookFn);geo(hookOk,120,280,200,200);hookOk.style.background=G;icon(hookOk,'check',45,45,110,110,INK);txt(hookFn,'Đang chạy ổn',34,600,40,'note').style.color=W;
txt(hookNew,'TÍNH NĂNG MỚI',34,34,24,'eyebrow');icon(hookNew,'truck-fast',60,170,320,256,INK);txt(hookNew,'Hỏa tốc',34,560,64,'serif');txt(hookNew,'phí 60 nghìn',34,660,34,'note');
const hookQ=el('div','badge',stage);geo(hookQ,478,1060,120,120);Object.assign(hookQ.style,{background:W,zIndex:6,boxShadow:'6px 6px 0 '+INK,visibility:'hidden'});icon(hookQ,'question',40,28,40,64,INK);
show(poster,.1);show(hookNew,cue('intro','thêm giao hỏa tốc'));show(hookFn,cue('intro','hàm tính tiền'));tl.set(hookQ,{visibility:'visible'},cue('intro','ra sửa'));pop(hookQ,cue('intro','ra sửa'));reveal(posterSub,cue('intro','chữ o'));reveal(posterEn,cue('intro','solid'));
[poster,hookFn,hookNew].forEach(e=>hide(e,S(1)));conceal(hookQ,S(1));tl.set(hookQ,{visibility:'hidden'},S(1)+.3);

// ── 1 · Setup: open the working function; decode its two inputs ──────────
heading('scene-1','Hàm tính tiền\nhiện tại');
show(fn,cue('scene-1','hàm tính tiền'));
const tagGia=box('tag-gia',64,880,460,120,Y),tagGiao=box('tag-giao',552,880,460,120,W);
txt(tagGia,'gia',32,30,44,'mono');txt(tagGia,'giá đơn hàng',150,38,32,'note');txt(tagGiao,'giao',32,30,44,'mono');txt(tagGiao,'cách giao',170,38,32,'note');
flash(def.s.gia,cue('scene-1','giá đơn hàng'),Y,INK,W,1.2);show(tagGia,cue('scene-1','giá đơn hàng'),.4);
flash(def.s.giao,cue('scene-1','cách giao'),W,INK,W,1.0);show(tagGiao,cue('scene-1','cách giao'),.4);
reveal(L3,cue('scene-1','cộng thêm'));flash(ret.s.expr,cue('scene-1','phí ship'),O,INK,W,.8);
hide(tagGia,S(2));hide(tagGiao,S(2));
wire('param-gia','M453 574 V720 H294 V868 l-13 -17 m13 17 l13 -17',cue('scene-1','giá đơn hàng')-.15,cue('scene-1','cộng thêm')-.1,O,8,.5);
wire('param-giao','M579 574 V745 H782 V868 l-13 -17 m13 17 l13 -17',cue('scene-1','cách giao')-.15,cue('scene-1','cộng thêm')-.1,O,8,.5);

// ── 2 · Setup: two branches + the checkout options they serve ────────────
heading('scene-2','Hai cách giao,\nhai nhánh if');
const shop=box('shop',64,890,948,550,W);txt(shop,'KHÁCH CHỌN CÁCH GIAO',36,30,24,'eyebrow');
function chip(i,label,fee,color){const c=box('chip-'+i,36+i*298,92,274,420,color,shop);c.style.borderRadius='24px';c.style.boxShadow='6px 6px 0 '+INK;icon(c,'truck-fast',62,40,150,120,INK);txt(c,label,24,196,42,'serif');const f=txt(c,fee,24,262,66,'mono');txt(c,'nghìn',24,350,24,'note');return{c,f};}
const cT=chip(0,'Thường','20',B),cN=chip(1,'Nhanh','35',PU),cH=chip(2,'Hỏa tốc','60',O);
show(shop,S(2)+.05);
reveal(brT.c,cue('scene-2','giao thường'),.35);show(cT.c,cue('scene-2','giao thường'),.4);
reveal(brN.c,cue('scene-2','giao nhanh'),.35);show(cN.c,cue('scene-2','giao nhanh'),.4);
[brT,brN].forEach((b,i)=>pop(b.ok,cue('scene-2','đã chạy ổn')+i*.12));
// Checks are hidden until their cue (pop() starts them from opacity 0).
[brT,brN].forEach(b=>gsap.set(b.ok,{opacity:0}));

// ── 3 · Decode: the old way edits the working function ───────────────────
heading('scene-3','Thêm hỏa tốc\nkiểu cũ?');
show(cH.c,cue('scene-3','thêm hỏa tốc'),.4);
const wedge=cue('scene-3','chèn một nhánh');
move(fn,{height:470},wedge,.6,'function grows');move(L3,{top:360},wedge,.6,'return pushed down');move(shop,{top:960},wedge,.6,'make room');
reveal(ghost,wedge+.3,.4);wire('chip-to-branch','M833 1044 V914 l-13 17 m13 -17 l13 17',wedge+.65,S(4),O,8,.45);
const warn=box('warn',64,1540,948,104,W);warn.style.border='5px solid '+R;icon(warn,'triangle-exclamation',34,22,56,56,R);txt(warn,'Phải sửa hàm đang chạy ổn',112,28,34,'note');
show(warn,cue('scene-3','bị sửa'),.4);
const recheck=cue('scene-3','kiểm tra lại');
[brT,brN].forEach(b=>{tl.to(b.ok,{backgroundColor:W,borderColor:R,duration:.25},recheck);conceal(b.chk,recheck,.2);reveal(b.q,recheck,.25);});
samples.push({job:'checks invalidated',start:recheck,end:recheck+.3});

// ── 4 · Decode: name the rule; undo the hypothetical edit ────────────────
heading('scene-4','Nguyên lý\nĐóng / Mở');
conceal(ghost,S(4),.25);move(L3,{top:290},S(4)+.15,.5,'undo edit');move(fn,{height:400},S(4)+.15,.5,'undo edit');
[brT,brN].forEach(b=>{tl.to(b.ok,{backgroundColor:G,borderColor:INK,duration:.25},S(4)+.3);reveal(b.chk,S(4)+.3,.2);conceal(b.q,S(4)+.3,.2);});
[shop,warn].forEach(e=>hide(e,S(4)));
const pOpen=box('p-open',64,880,462,560,G),pClosed=box('p-closed',550,880,462,560,W);
icon(pOpen,'lock-open',36,40,150,130,INK);txt(pOpen,'MỞ',36,200,96,'serif');txt(pOpen,'để mở rộng',36,330,38,'note');icon(pOpen,'plus',36,440,34,38,INK);txt(pOpen,'thêm code mới',86,438,30,'note');
icon(pClosed,'lock',36,40,114,130,INK);txt(pClosed,'ĐÓNG',36,200,96,'serif');txt(pClosed,'với sửa đổi',36,330,38,'note');txt(pClosed,'✕',36,432,34,'mono');txt(pClosed,'không sửa code cũ',86,438,30,'note');
show(pOpen,cue('scene-4','mở để mở rộng'),.45);show(pClosed,cue('scene-4','đóng với'),.45);
hide(pOpen,S(5));hide(pClosed,S(5));

// ── 5 · Decode: each branch line leaves the function and becomes a class ─
heading('scene-5','Mỗi cách giao\nmột lớp riêng');
const split=cue('scene-5','tách');
function fly(s,b,y,t){conceal(b.c,t,.15);tl.set(s.e,{display:'block',visibility:'visible',opacity:1},t);tl.fromTo(s.e,{left:100,top:430+parseFloat(b.c.style.top)-3,width:780,height:68,borderRadius:18},{left:212,top:y,width:800,height:160,borderRadius:28,duration:.9,ease:'power2.inOut',immediateRender:false},t);tl.fromTo(s.line,{opacity:1,fontSize:38,top:8},{fontSize:30,top:24,duration:.9,ease:'power2.inOut',immediateRender:false},t);conceal(s.line,t+.85,.2);reveal(s.nm.e,t+.85,.3);samples.push({job:'branch becomes class '+s.e.id,start:t,end:t+.9});}
fly(sN,brN,1064,split);fly(sT,brT,880,split+.3);
const owns=cue('scene-5','trả lời phí');[sT,sN].forEach((s,i)=>pop(s.badge,owns+i*.15));
const method=cue('scene-5','phương thức');[sT,sN].forEach(s=>{reveal(s.a.e,method,.3);reveal(s.b.e,method+.25,.3);});

// ── 6 · Decode: the function collapses to one delegating line ───────────
heading('scene-6','Hàm chỉ còn\nmột dòng');
const tight=S(6)+.1;move(fn,{height:270},tight,.7,'function collapses');move(L3,{top:150},tight,.7,'return moves up');
move(sT.e,{top:750},tight,.7,'strips close gap');move(sN.e,{top:934},tight,.7,'strips close gap');
flash(def.s.gia,cue('scene-6','lấy giá'),Y,INK,W,.9);
const rewrite=cue('scene-6','cộng với');value(ret.s.expr,'giao.phi()',rewrite);flash(ret.s.expr,rewrite,O,INK,W,1.4);samples.push({job:'return rewritten',start:rewrite,end:rewrite+.3});
const passed=cue('scene-6','được truyền');flash(def.s.giao,passed,O,INK,W,1.0);
const bus=wire('bus','M128 704 V1014 H200 l-14 -11 m14 11 l-14 11 M128 830 H200 l-14 -11 m14 11 l-14 11',passed,S(12));

// ── 7 · Decode: one restructure creates the extension point; then lock ───
heading('scene-7','Sửa một lần,\nrồi khóa lại');
value(fnEyebrow,'PYTHON · ĐÃ SỬA 1 LẦN',cue('scene-7','sửa một lần'));
reveal(plugTag,cue('scene-7','điểm mở rộng'),.35);flash(ret.s.expr,cue('scene-7','điểm mở rộng'),Y,INK,W,1.2);
const lockAt=cue('scene-7','khóa lại');
const lock=el('div','pill',stage);geo(lock,842,404,170,72);Object.assign(lock.style,{zIndex:7,visibility:'hidden'});icon(lock,'lock',22,14,32,38,INK);txt(lock,'ĐÓNG',66,18,30,'mono');
tl.set(lock,{visibility:'visible'},lockAt);tl.fromTo(lock,{y:-90,opacity:0},{y:0,opacity:1,duration:.45,ease:'bounce.out',immediateRender:false},lockAt);samples.push({job:'lock drops',start:lockAt,end:lockAt+.45});
value(fnEyebrow,'PYTHON · ĐÃ ĐÓNG',lockAt);

// ── 8 · Execute: extension = a new class in an empty slot ────────────────
heading('scene-8','Thêm hỏa tốc\nkiểu mới');
const slot=box('slot',212,1118,800,160,'rgba(255,255,255,.45)',stage,'slot');txt(slot,'+ chỗ cho cách giao mới',150,52,34,'note');
show(slot,cue('scene-8','thêm hỏa tốc'),.4);
const arrive=cue('scene-8','lớp mới');
tl.set(sH.e,{display:'block',visibility:'visible',opacity:1},arrive);tl.fromTo(sH.e,{left:1120},{left:212,duration:.8,ease:'power3.out',immediateRender:false},arrive);reveal(sH.nm.e,arrive,.2);samples.push({job:'HoaToc slides in',start:arrive,end:arrive+.8});
hide(slot,arrive,.25);
wire('bus-ext','M128 1014 V1198 H200 l-14 -11 m14 11 l-14 11',cue('scene-8','tên hỏa tốc'),S(12));
const ret60=cue('scene-8','trả về sáu mươi');reveal(sH.a.e,ret60-.35,.3);reveal(sH.b.e,ret60,.3);pop(sH.badge,ret60+.1);

// ── 9 · Execute: the call binds 200 and a HoaToc object ──────────────────
heading('scene-9','Gọi với đơn 200');
const call=box('call',64,290,948,104,W);const callCode=code(call,[['tinh_tien('],['200','','price'],[', '],['HoaToc()','','obj'],[')']],36,24,44);callCode.e.classList.add('mono');
Object.assign(callCode.s.price.style,{background:Y});Object.assign(callCode.s.obj.style,{background:O});const callUnit=txt(call,'nghìn đồng',770,36,24,'note');
show(call,cue('scene-9','gọi hàm'),.4);
const t200=cue('scene-9','hai trăm');token('200',330,300,400,500,t200,.6,Y);reveal(bindGia,t200+.6,.25);flash(def.s.gia,t200+.55,Y,INK,W,.8);
const tObj=cue('scene-9','giao hỏa tốc');token('HoaToc()',470,300,500,500,tObj,.55,O);reveal(bindGiao,tObj+.55,.25);flash(def.s.giao,tObj+.5,O,INK,W,.6);

// ── 10 · Execute: giao.phi() routes to the HoaToc class; 60 returns ─────
heading('scene-10','Phí lấy từ đâu?');
const route=cue('scene-10','giao chấm phí');flash(ret.s.expr,route,O,INK,null);
wire('route-hoatoc','M128 704 V1198 H200',route,S(12)-.3,O,12,.8);
[sT.e,sN.e].forEach(e=>tl.to(e,{opacity:.35,duration:.3},route));
const back=cue('scene-10','trả về sáu mươi');token('60',870,1140,330,630,back,.75,O);value(bindGiao,'giao.phi() = 60',back+.75);samples.push({job:'binding resolved',start:back+.75,end:back+.9});
const disp=box('dispatch',64,1340,948,250,W);txt(disp,'LỜI GỌI ĐI ĐÂU?',36,28,24,'eyebrow');
const dA=txt(disp,'giao.phi()',36,100,44,'mono'),dArr1=txt(disp,'→',312,98,44,'mono'),dB=txt(disp,'HoaToc.phi()',372,100,44,'mono'),dArr2=txt(disp,'→',716,98,44,'mono'),dC=txt(disp,'60',790,88,64,'mono');
Object.assign(dB.style,{background:O,borderRadius:'10px',padding:'0 8px'});Object.assign(dC.style,{background:O,border:'4px solid '+INK,borderRadius:'50%',width:'110px',height:'110px',lineHeight:'102px',textAlign:'center',top:'70px'});
const dNote=txt(disp,'giao là HoaToc() → dùng phi() của HoaToc',36,180,28,'note');[dArr1,dB,dArr2,dC,dNote].forEach(concealed);
show(disp,route+.2,.4);reveal(dArr1,cue('scene-10','đi tới'),.3);reveal(dB,cue('scene-10','lớp hỏa tốc'),.3);reveal(dNote,cue('scene-10','lớp hỏa tốc')+.3,.3);reveal(dArr2,back,.3);pop(dC,back+.1);hide(disp,S(11));

// ── 11 · Execute: 200 + 60 commits to 260 ────────────────────────────────
heading('scene-11','Tổng là bao nhiêu?');
const result=box('result',64,1320,948,300,Y);const resEye=txt(result,'KẾT QUẢ · HoaToc()',36,28,24,'eyebrow');
const resExpr=txt(result,'200 + 60 =',36,108,60,'mono');const resVal=txt(result,'260',520,72,128,'mono');const resUnit=txt(result,'nghìn đồng',528,250,26,'note');concealed(resExpr);concealed(resVal);concealed(resUnit);
const sum=cue('scene-11','hai trăm cộng');show(result,sum,.4);token('200 + 60',120,630,100,1420,sum,.7,Y);reveal(resExpr,sum+.7,.25);
const commit=cue('scene-11','kết quả');tl.fromTo(resVal,{opacity:0,scale:.5},{opacity:1,scale:1,duration:.45,ease:'back.out(2)',immediateRender:false},commit);reveal(resUnit,commit+.2,.3);samples.push({job:'state commit 260',start:commit,end:commit+.45});

// ── 12 · Verify: tall comparison of changed lines ────────────────────────
heading('scene-12','Code cũ có\nbị sửa không?');
const v=S(12)+.05;
[call,result].forEach(e=>hide(e,v));[bindGia,bindGiao,plugTag].forEach(e=>conceal(e,v,.25));
[sT.e,sN.e].forEach(e=>tl.to(e,{opacity:1,duration:.3},v));
show(colOld,v+.2,.4);show(colNew,v+.2,.4);
move(fn,{left:88,top:470,width:512,height:200},v+.2,.8,'fn into old column');move(fnEyebrow,{fontSize:20,top:22,left:24},v+.2);
move(L0,{fontSize:28,top:62,left:24},v+.2);move(L3,{fontSize:28,top:112,left:0},v+.2);
move(lock,{left:440,top:448,scale:.85},v+.2,.8,'lock follows fn');
function mini(s,x,y,w,h,f){move(s.e,{left:x,top:y,width:w,height:h},v+.2,.8,'class into column');move(s.nm.e,{fontSize:f,top:18,left:24},v+.2);move(s.a.e,{fontSize:f-4,top:72,left:48},v+.2);conceal(s.badge,v,.2);}
mini(sT,88,700,512,130,30);mini(sN,88,860,512,130,30);move(sT.b.e,{fontSize:26,top:72,left:282},v+.2);move(sN.b.e,{fontSize:26,top:72,left:282},v+.2);
mini(sH,672,470,316,200,28);move(sH.nm.e,{left:20},v+.2);move(sH.a.e,{fontSize:24,top:76,left:52},v+.2);move(sH.b.e,{fontSize:24,top:120,left:80},v+.2);
const oldCount=box('old-count',88,1100,512,460,W,stage);oldCount.style.boxShadow='none';oldCount.style.border='0';txt(oldCount,'0',40,10,240,'mono');txt(oldCount,'dòng cũ\nbị sửa',230,90,46,'note');icon(oldCount,'lock',240,300,60,70,INK);
const newCount=box('new-count',672,1100,316,460,G,stage);newCount.style.boxShadow='8px 8px 0 '+INK;txt(newCount,'+2',36,10,180,'mono');txt(newCount,'dòng mới',36,250,44,'note');txt(newCount,'chỉ trong HoaToc',36,320,28,'note');
pop(oldCount,cue('scene-12','không',2),true);show(newCount,cue('scene-12','hai dòng mới'),.45);sH.plus.forEach((p,i)=>pop(p,cue('scene-12','hai dòng mới')+.1+i*.12));
const restore=S(13)+.05;[colOld,colNew,oldCount,newCount].forEach(e=>hide(e,restore,.25));sH.plus.forEach(p=>conceal(p,restore,.2));

// ── 13 · Verify: the old path still gives the old answer ─────────────────
heading('scene-13','Giao thường thì sao?');
move(fn,{left:64,top:430,width:948,height:270},restore+.1,.7,'restore trace layout');move(fnEyebrow,{fontSize:24,top:28,left:36},restore+.1,.7);move(L0,{fontSize:38,top:86,left:36},restore+.1,.7);move(L3,{fontSize:38,top:150,left:36},restore+.1,.7);
move(lock,{left:842,top:404,scale:1},restore+.1,.7,'lock returns');
function full(s,y){move(s.e,{left:212,top:y,width:800,height:160},restore+.1,.7,'class strip restored');move(s.nm.e,{fontSize:36,top:20,left:28},restore+.1,.7);move(s.a.e,{fontSize:30,top:92,left:64},restore+.1,.7);move(s.b.e,{fontSize:30,top:92,left:334},restore+.1,.7);reveal(s.badge,restore+.6,.3);}
full(sT,750);full(sN,934);full(sH,1118);
wire('bus-again','M128 704 V1198 H200 l-14 -11 m14 11 l-14 11 M128 830 H200 l-14 -11 m14 11 l-14 11 M128 1014 H200 l-14 -11 m14 11 l-14 11',restore+.5,start('outro'),INK,6,.5);
value(callCode.s.obj,'GiaoThuong()',restore);tl.set(callCode.s.obj,{backgroundColor:B},restore);tl.set(callUnit,{opacity:0},restore);
const retry=cue('scene-13','giao thường');show(call,retry-.3,.35);
value(bindGiao,'giao = GiaoThuong()',retry-.3);tl.set(bindGiao,{backgroundColor:B},retry-.3);reveal(bindGia,retry-.3,.3);reveal(bindGiao,retry-.3,.3);
wire('route-thuong','M128 704 V830 H200',retry,start('outro'),B,12,.5);[sN.e,sH.e].forEach(e=>tl.to(e,{opacity:.35,duration:.3},retry));
const t20=cue('scene-13','vẫn ra');token('20',870,770,330,630,t20,.55,B);value(bindGiao,'giao.phi() = 20',t20+.55);
show(result,t20,.35);move(resExpr,{fontSize:44,top:92},t20,.01);move(resVal,{fontSize:96,left:36,top:150},t20,.01);move(resUnit,{left:230,top:205,fontSize:22},t20,.01);value(resEye,'HoaToc()',t20);
const res2=el('div','',result);geo(res2,474,0,474,300);Object.assign(res2.style,{position:'absolute',borderLeft:'4px solid '+INK,background:B});txt(res2,'GiaoThuong()',36,28,24,'eyebrow');const r2e=txt(res2,'200 + 20 =',36,92,44,'mono'),r2v=txt(res2,'220',36,150,96,'mono');concealed(res2);
const t220=cue('scene-13','hai trăm hai mươi');reveal(res2,t220,.3);tl.fromTo(r2v,{scale:.5},{scale:1,duration:.4,ease:'back.out(2)',immediateRender:false},t220);samples.push({job:'state commit 220',start:t220,end:t220+.4});
const same=el('div','pill',res2);geo(same,250,186,190,56);Object.assign(same.style,{background:G,fontSize:'22px',padding:'12px 16px'});same.textContent='✓ như trước';concealed(same);pop(same,cue('scene-13','như trước'));
// Leave the trace for the rule poster.
const o=start('outro');[fn,sT.e,sN.e,sH.e,call,result,lock].forEach(e=>hide(e,o,.3));

// ── Outro · Rule: typographic poster + witnesses + boundary ──────────────
const rule=box('rule',64,190,948,600,INK);txt(rule,'GHI NHỚ · SOLID · O',40,34,24,'eyebrow').style.color=Y;
const r1=txt(rule,'Thêm bằng\ncode mới.',40,100,92,'serif',870);r1.style.color=Y;const r2=txt(rule,'Không sửa code\nđã chạy ổn.',40,350,58,'serif',870);r2.style.color=W;[r1,r2].forEach(concealed);
show(rule,o+.05,.45);reveal(r1,cue('outro','thêm tính năng'),.4);reveal(r2,cue('outro','không sửa'),.4);
const wOld=box('w-old',64,830,462,300,W),wNew=box('w-new',550,830,462,300,O);
icon(wOld,'lock',32,32,52,60,INK);txt(wOld,'tinh_tien',104,40,36,'mono');txt(wOld,'0',32,120,110,'mono');txt(wOld,'dòng sửa',130,170,34,'note');
icon(wNew,'plus',32,34,52,58,INK);txt(wNew,'HoaToc',104,40,36,'mono');txt(wNew,'+2',32,120,110,'mono');txt(wNew,'dòng mới',190,170,34,'note');
show(wNew,cue('outro','code mới'),.4);show(wOld,cue('outro','không sửa'),.4);
const bound=box('boundary',64,1170,948,450,B);txt(bound,'ĐIỀU KIỆN',40,32,24,'eyebrow');
const b1=el('div','',bound);geo(b1,40,100,860,120);b1.style.position='absolute';icon(b1,'plug',0,8,48,64,INK);txt(b1,'Cần một điểm mở rộng:',76,0,36,'note');const b1c=txt(b1,'giao.phi()',76,56,40,'mono');Object.assign(b1c.style,{background:Y,borderRadius:'10px',padding:'2px 12px',border:'3px solid '+INK});
const b2=txt(bound,'Chỉ tạo ở chỗ thật sự\nhay thay đổi.',40,270,44,'serif',860);[b1,b2].forEach(concealed);
show(bound,cue('outro','nhưng cần'),.4);reveal(b1,cue('outro','điểm mở rộng'),.35);reveal(b2,cue('outro','chỉ nên tạo'),.4);

// Captions on a stable surface; karaoke words do not count as model motion.
const band=document.getElementById('captions');sections.forEach(s=>{const chunks=[];let line=[];for(const w of s.words){if(line.length&&line.map(x=>x.w).join(' ').length+w.w.length+1>38){chunks.push(line);line=[];}line.push(w);}if(line.length)chunks.push(line);chunks.forEach((words,i)=>{const e=el('div','caption-line',band);const st=Math.max(s.start,words[0].t0-.06),en=Math.min(s.start+s.dur,i+1<chunks.length?chunks[i+1][0].t0-.06:words.at(-1).t1+.25);tl.set(e,{opacity:1},st);tl.set(e,{opacity:0},en);words.forEach((w,j)=>{if(j)e.appendChild(document.createTextNode(' '));const sp=el('span','caption-word',e,w.w);tl.set(sp,{backgroundColor:Y},w.t0);});});});
tl.to(document.getElementById('progress'),{width:1040,duration:P.total,ease:'none'},0);window.StoryTimeline=tl;window.COMMIT_TIME=commit;
})();
