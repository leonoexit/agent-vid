(()=>{
'use strict';
const P=window.PLAN,S=window.SCORE,stage=document.getElementById('stage'),tl=gsap.timeline({paused:true});
const C={ink:'#2d3436',blue:'#8ce4ff',yellow:'#feee91',orange:'#ffa239',purple:'#a594f9',red:'#ff5656',green:'#10b981',gray:'#e5e5e5',white:'#fff'};
const OPS=[],REVEALS=[],EMPHASIS=[];let serial=0;
function el(tag,cls,parent,text){const e=document.createElement(tag);e.className=cls;if(text!=null)e.textContent=text;parent.appendChild(e);e.id='v-'+(++serial);return e;}
function pos(e,x,y,w,h){Object.assign(e.style,{left:x+'px',top:y+'px',width:w+'px',...(h==null?{}:{height:h+'px'})});return e;}
function panel(parent,x,y,w,h,tone='white'){const e=pos(el('div','panel '+(tone==='ink'?'bento-surface-dark':'bento-surface-light'),parent),x,y,w,h);e.style.background=C[tone];if(tone==='ink')e.style.color='white';return e;}
function text(parent,str,x,y,w,size=40,cls=''){const e=pos(el('div','copy '+cls,parent,str),x,y,w);e.style.fontSize=size+'px';return e;}
function rich(parent,before,focus,after,x,y,w,size=50,dark=false,tone='yellow'){const e=text(parent,'',x,y,w,size);e.classList.add(dark?'bento-surface-dark':'bento-surface-light');e.appendChild(document.createTextNode(before));const sp=el('span','bento-accent',e,focus);sp.style.setProperty('--bento-emphasis',C[tone]);e.appendChild(document.createTextNode(after));return {root:e,span:sp};}
function icon(parent,name,x,y,size=140,tone){const e=pos(el('div','bento-icon',parent),x,y,size,size);e.innerHTML=window.ICONS[name];e.setAttribute('aria-hidden','true');if(tone)e.style.color=C[tone];return e;}
function chip(parent,str,x,y,tone='white',size=33){const e=el('div','chip bento-tag',parent,str);Object.assign(e.style,{left:x+'px',top:y+'px',background:C[tone==='red'?'white':tone],borderColor:tone==='red'?C.red:C.ink,fontSize:size+'px',color:tone==='ink'?'white':C.ink});return e;}
function norm(s){return String(s).toLowerCase().normalize('NFC').match(/[\p{L}\p{N}]+/gu)||[];}
function time(i,k){const words=P.sections[i].words.flatMap(w=>norm(w.w).map(token=>({token,t:w.t0}))),n=norm(typeof k==='string'?k:S[i].cues[k]);const j=words.findIndex((_,j)=>n.every((x,z)=>words[j+z]?.token===x));if(j<0)throw Error('Cue missing '+i+': '+S[i].cues[k]);return words[j].t;}
function reveal(e,t,reason='content',d=.45){gsap.set(e,{autoAlpha:0});tl.to(e,{autoAlpha:1,duration:d},t);REVEALS.push({id:e.id,t,reason});return e;}
function move(e,vars,t,d=.8,job='recompose'){tl.to(e,{...vars,duration:d,ease:'power2.inOut'},t);OPS.push({id:e.id,start:t,end:t+d,job});}
function mark(sp,t,end,tone='yellow'){if(sp.tagName==='SPAN'){const before=getComputedStyle(sp).color;sp.classList.add('bento-mark');sp.style.backgroundColor='transparent';sp.style.color=before;}tl.to(sp,{backgroundColor:C[tone],color:C.ink,duration:.18},t);if(end)tl.to(sp,{backgroundColor:'transparent',color:C.ink,duration:.2},end);EMPHASIS.push({id:sp.id,start:t,end:end||null,tone});}
function write(e,a,b,t){tl.fromTo(e,{textContent:a},{textContent:b,duration:0,immediateRender:false},t);OPS.push({id:e.id,start:t,end:t+.1,job:'commit '+b});}
function path(parent,d,t,job='route',color='ink',dur=.9){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('line');svg.setAttribute('viewBox','0 0 1080 1920');parent.appendChild(svg);const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d',d);p.style.stroke=C[color];svg.appendChild(p);const l=p.getTotalLength();gsap.set(p,{strokeDasharray:l,strokeDashoffset:l});tl.to(p,{strokeDashoffset:0,duration:dur,ease:'power2.inOut'},t);OPS.push({id:parent.id,start:t,end:t+dur,job});return svg;}
function travel(parent,label,x,y,tx,ty,t,d=.9,tone='orange'){const e=chip(parent,label,x,y,tone);reveal(e,t,'moving data',.08);move(e,{x:tx-x,y:ty-y},t,d,'transfer '+label);const section=P.sections.find(s=>t>=s.start&&t<s.start+s.dur);tl.to(e,{autoAlpha:0,duration:.15},Math.min(t+d,section.start+section.dur-.25));return e;}
function heading(g,i){text(g,S[i].title,64,208,948,64,'serif');}
function note(g,str,t,tone='ink'){const p=panel(g,64,1370,948,205,tone);text(p,str,30,32,875,39,'label');reveal(p,t,'conclusion');return p;}
function lang(parent,name,x,y,w=430,h=480){const tones={C:'blue',Python:'yellow',JavaScript:'purple','C++':'orange'};const p=panel(parent,x,y,w,h,tones[name]);text(p,name,28,25,w-58,name==='JavaScript'?43:64,'mono');return p;}
function cells(parent,values,x,y,width=150,gap=15,tone='white'){return values.map((v,i)=>{const e=pos(el('div','memory-cell',parent,String(v)),x+i*(width+gap),y,width,115);e.style.background=C[tone];return e;});}
function thermometer(parent,x,y){const p=panel(parent,x,y,310,340,'blue');icon(p,'temperature-half',25,90,150);text(p,'SỐ ĐO',25,22,245,28,'label');const v=text(p,'26°C',165,150,125,39,'mono');return {root:p,value:v};}
const langNames=['C','Python','JavaScript','C++'];const tones=['blue','yellow','purple','orange'];langNames.forEach((n,i)=>{const p=el('div','rail-item',document.getElementById('language-rail'),n);p.style.background=C[tones[i]];});
const groups=P.sections.map((sec,i)=>{const g=el('div','shot',stage);g.id='shot-'+i;tl.set(g,{display:'block',visibility:'visible'},sec.start);tl.set(g,{display:'none',visibility:'hidden'},sec.start+sec.dur);tl.set(document.getElementById('phase'),{textContent:S[i].chapter.toUpperCase()},sec.start);tl.set(document.getElementById('counter'),{textContent:String(i+1).padStart(2,'0')+' / 24'},sec.start);heading(g,i);return g;});
// 00: Four language identities gather around one concrete task.
{
const i=0,g=groups[i],hero=panel(g,64,400,948,750,'ink');text(hero,'C',40,18,300,220,'mono').style.color=C.blue;const q=rich(hero,'Vì sao ','vẫn học','?',40,485,870,78,true);reveal(q.root,time(i,1));mark(q.span,time(i,1));const sensor=thermometer(g,65,1220);reveal(sensor.root,time(i,0));move(sensor.root,{left:390,top:1145},time(i,2),.8,'measurement becomes continuity anchor');const a=chip(hero,'Python',480,120,'yellow'),b=chip(hero,'JavaScript',440,240,'purple'),c=chip(hero,'C++',600,360,'orange');[a,b,c].forEach((e,j)=>{reveal(e,time(i,0)+1.1+j*.6);move(e,{y:70},time(i,1)+j*.15,.65,'languages gather around task');});
}
// 01: Receive -> process -> display; same measurement travels between explicit jobs.
{
const i=1,g=groups[i];const a=panel(g,64,425,948,285,'blue'),b=panel(g,64,815,948,285,'yellow'),c=panel(g,64,1205,948,285,'purple');
for(const[p,ic,title,sub]of[[a,'temperature-half','Đọc số đo','Cảm biến → tín hiệu'],[b,'chart-line','Xử lý','Các số đã lưu'],[c,'window-maximize','Hiển thị','Người dùng xem']]){icon(p,ic,30,70,140);text(p,title,210,48,660,53,'serif');text(p,sub,210,152,660,32);}
reveal(a,time(i,0));reveal(b,time(i,2));reveal(c,time(i,3));path(g,'M538 725 V800 l-13 -18 m13 18 l13 -18',time(i,2));path(g,'M538 1115 V1190 l-13 -18 m13 18 l13 -18',time(i,3));travel(g,'26°C',770,570,770,920,time(i,2));travel(g,'26°C',770,920,770,1310,time(i,3));
}
// 02: An actual memory region opens inside the device.
{
const i=2,g=groups[i],board=panel(g,64,430,948,880,'blue');icon(board,'microchip',300,70,290);text(board,'THIẾT BỊ',35,30,500,28,'label');reveal(board,time(i,0));move(board,{height:1040},time(i,1),.8,'open device to inspect memory');const mem=panel(board,40,470,860,385,'white');text(mem,'BỘ NHỚ',30,25,750,36,'mono');icon(mem,'memory',30,130,145);const cs=cells(mem,['26','27','25'],220,140,150);reveal(mem,time(i,1));const r=rich(board,'Dung lượng ','có giới hạn','',40,900,850,44);reveal(r.root,time(i,2));mark(r.span,time(i,2));cs.forEach((c,j)=>move(c,{y:-15},time(i,3)+j*.12,.45,'inspect stored slot'));
}
// 03: Capacity is labeled; only three slots are used, remaining capacity is not invented.
{
const i=3,g=groups[i],p=lang(g,'C',64,420,948,310);const r=rich(p,'Quyền ','kiểm soát','',240,125,650,48);mark(r.span,time(i,0));const dataTag=chip(p,'Dữ liệu',240,220,'white',27),memTag=chip(p,'Bộ nhớ',610,220,'white',27);reveal(dataTag,time(i,'cách dùng dữ liệu'));reveal(memTag,time(i,'bộ nhớ'));const mem=panel(g,64,865,948,440,'white');text(mem,'VÙNG CHỨA 100 SỐ ĐO',32,30,850,35,'mono');const cs=cells(mem,['—','—','—','…'],36,135,198);reveal(mem,time(i,1));[26,27,25].forEach((v,j)=>{travel(g,String(v),160,660,124+j*213,1030,time(i,2)+j*.4,.65);write(cs[j],'—',String(v),time(i,2)+j*.4+.65);});const used=text(mem,'Đã dùng: 0 / 100',36,295,850,34,'mono');[1,2,3].forEach((n,j)=>write(used,'Đã dùng: '+(n-1)+' / 100','Đã dùng: '+n+' / 100',time(i,2)+j*.4+.65));note(g,'Khi đủ 100 số, số tiếp theo đi đâu?',time(i,3));
}
// 04: Full-buffer overwrite shown as a separate, explicitly reset state.
{
const i=4,g=groups[i],p=panel(g,64,425,948,620,'blue');text(p,'VÍ DỤ KHÁC · VÙNG ĐÃ ĐẦY',30,30,860,29,'label');text(p,'100 / 100',30,100,850,86,'mono');const cs=cells(p,['24','…','26','27'],30,300,200);reveal(p,time(i,0));const tok=travel(g,'28',64,1110,95,750,time(i,1),1);write(cs[0],'24','28',time(i,1)+1);const tag=chip(g,'Ghi đè số cũ nhất',110,1110,'yellow');reveal(tag,time(i,1)+1);const boundary=panel(g,64,1260,948,300,'ink');const r=rich(boundary,'Kiểm tra ','giới hạn','\ntrước khi ghi',30,38,860,51,true);reveal(boundary,time(i,2));r.root.style.width='620px';const guardIcon=icon(boundary,'shield-halved',710,45,165,'yellow');reveal(guardIcon,time(i,3));mark(r.span,time(i,2));const warning=chip(g,'Ngoài vùng → lỗi',520,1100,'red',28);reveal(warning,time(i,'Ghi ngoài vùng'));path(g,'M960 715 V1030 H920',time(i,2),'inspect capacity boundary');
}
// 05: Concrete average and growing list; do not equate append with average.
{
const i=5,g=groups[i],p=lang(g,'Python',64,430,948,900);const list=panel(p,30,190,870,300,'white');text(list,'DANH SÁCH SỐ ĐO',25,22,800,28,'label');const cs=cells(list,['26','27','25'],28,100,185);reveal(list,time(i,1));const avg=chip(p,'Trung bình: 26°C',40,600,'ink',42);reveal(avg,time(i,0));const n=chip(list,'28',650,122,'orange',38);reveal(n,time(i,2));tl.to(avg,{autoAlpha:0,duration:.2},time(i,2));move(list,{height:380},time(i,2),.7,'list expands for new measurement');move(n,{y:20},time(i,2),.6,'append new element');const r=rich(p,'Bộ nhớ: môi trường chạy ','lo giúp','',32,780,860,39);reveal(r.root,time(i,3));mark(r.span,time(i,3));note(g,'26°C là trung bình của 26, 27, 25.',time(i,0),'white');
}
// 06: Simple operation encloses details, without claiming details disappear.
{
const i=6,g=groups[i],p=panel(g,64,425,948,960,'ink');text(p,'TRỪU TƯỢNG',32,30,850,54,'serif').style.color=C.yellow;const detail=panel(p,35,500,870,355,'white');text(detail,'Tìm chỗ → mở rộng → lưu dữ liệu',28,115,800,38);reveal(detail,time(i,0));const lid=panel(p,35,210,870,225,'yellow');text(lid,'Thêm số đo',35,75,790,61,'serif');reveal(lid,time(i,1));move(lid,{height:310},time(i,2),.7,'simple interface covers internal detail');travel(g,'28',800,600,660,820,time(i,2),.8);move(detail,{top:630,height:270},time(i,3),.7,'internal detail remains underneath');const r=rich(detail,'Chi tiết ','vẫn tồn tại','',28,30,800,40);reveal(r.root,time(i,3));mark(r.span,time(i,3));note(g,'Một cách dùng đơn giản hơn.',time(i,1),'white');
}
// 07: Tools pack into reusable library; actual illustrative measurements form chart.
{
const i=7,g=groups[i],p=lang(g,'Python',64,420,948,240);const toolbox=panel(g,64,780,450,515,'white');icon(toolbox,'screwdriver-wrench',140,65,150);text(toolbox,'THƯ VIỆN',30,280,390,43,'mono');text(toolbox,'Mã làm sẵn',30,360,390,32);reveal(toolbox,time(i,0));const chart=panel(g,570,780,430,515,'yellow');text(chart,'26 · 27 · 25',25,375,370,34,'mono');icon(chart,'chart-line',110,60,200);reveal(chart,time(i,2));move(toolbox,{left:90,width:420},time(i,1),.7,'package reusable tools');path(g,'M522 1050 H552 l-15 -10 m15 10 l-15 10',time(i,2),'reuse library for chart');note(g,'Chọn mức tiện lợi và kiểm soát cần thiết.',time(i,3));
}
// 08: Python dispatches to a C implementation and receives the result.
{
const i=8,g=groups[i],p=lang(g,'Python',64,440,948,320),c=lang(g,'C',300,950,700,345);text(p,'Yêu cầu xử lý',290,135,580,40);text(c,'Phần mã xử lý bên dưới',35,160,620,35);reveal(c,time(i,2));path(g,'M215 760 V1120 H275 l-16 -12 m16 12 l-16 12',time(i,2),'call native C implementation');travel(g,'dữ liệu',100,700,420,1050,time(i,2),1);path(g,'M950 935 V830 H870 V775 l-12 16 m12 -16 l12 16',time(i,3),'return computation result');travel(g,'kết quả',760,990,730,685,time(i,3),.9,'green');const r=note(g,'Tốc độ còn phụ thuộc cách giải và thư viện.',time(i,1),'white');
}
// 09: The same data appears in the browser, then changes the visual output.
{
const i=9,g=groups[i],web=panel(g,64,420,948,1120,'purple');const bar=panel(web,26,30,890,110,'white');icon(bar,'window-maximize',22,20,60);text(bar,'nhiệt-độ / hôm-nay',110,24,720,33,'mono');const val=text(web,'26°C',100,265,750,155,'mono');reveal(web,time(i,0));const label=text(web,'GIAO DIỆN',38,170,850,34,'label');reveal(label,time(i,1));const btn=chip(web,'Làm mới',330,820,'white',40);reveal(btn,time(i,2));path(g,'M150 1160 L350 1120 L540 1200 L750 1090 L920 1030',time(i,3),'data changes chart');write(val,'26°C','27°C',time(i,3));
}
// 10: Input -> request -> result. Button motion is tied to the click.
{
const i=10,g=groups[i],web=lang(g,'JavaScript',64,425,948,930);icon(web,'window-maximize',690,30,150);const val=text(web,'27°C',40,250,850,150,'mono');const btn=chip(web,'Làm mới',310,650,'white',43);move(btn,{scale:.94},time(i,1),.15,'button press sends request');move(btn,{scale:1},time(i,1)+.15,.18,'button releases');travel(g,'28°C',800,800,400,800,time(i,2)-.7,.7);write(val,'27°C','28°C',time(i,2));const r=rich(web,'Số mới ','thay số cũ','',40,500,850,48);reveal(r.root,time(i,2));mark(r.span,time(i,2));note(g,'Trình duyệt = ứng dụng mở trang web.',time(i,3),'white');
}
// 11: JavaScript's identity spans browser and server, rather than a fixed tier.
{
const i=11,g=groups[i],a=panel(g,64,445,450,680,'purple'),b=panel(g,560,445,440,680,'purple');icon(a,'window-maximize',125,80,185);text(a,'Trình duyệt',25,340,390,42,'serif');icon(b,'server',125,80,185);text(b,'Máy chủ',25,340,380,42,'serif');const node=chip(b,'Node.js',100,485,'white',30);reveal(b,time(i,1));path(g,'M510 1200 H995 V1150 M510 1200 H70 V1150',time(i,0),'one language spans environments');const shared=chip(g,'JavaScript',325,1210,'purple',46);reveal(shared,time(i,0));travel(g,'yêu cầu',160,970,610,970,time(i,1)+.6,.8);travel(g,'28°C',640,1050,180,1050,time(i,2),.9,'yellow');note(g,'Một ngôn ngữ có thể ở nhiều vị trí.',time(i,3));
}
// 12: Recompose as a flowing system, with qualified role labels.
{
const i=12,g=groups[i];const a=lang(g,'C',64,420,948,285),b=lang(g,'Python',64,820,948,285),c=lang(g,'JavaScript',64,1220,948,285);text(a,'Trong thiết bị',330,105,550,42);text(b,'Phân tích số đo',330,105,550,42);text(c,'Giao diện web',330,105,550,42);reveal(a,time(i,0));reveal(b,time(i,1));reveal(c,time(i,2));path(g,'M540 720 V805 l-12 -16 m12 16 l12 -16',time(i,1));path(g,'M540 1120 V1205 l-12 -16 m12 16 l12 -16',time(i,2));travel(g,'26',830,630,830,945,time(i,1));travel(g,'26',830,1025,830,1310,time(i,2));travel(g,'số đo',770,650,770,930,time(i,'Các phần trao đổi'),.8);travel(g,'số đo',770,1030,770,1320,time(i,'Các phần trao đổi')+.85,.8);const tag=chip(g,'Một ví dụ phân công',320,1560,'white',26);reveal(tag,time(i,3));
}
// 13: Historical branch becomes two distinct current languages.
{
const i=13,g=groups[i],a=lang(g,'C',64,490,440,540),b=lang(g,'C++',560,490,440,540);icon(a,'code',125,215,170);icon(b,'boxes-stacked',125,215,170);reveal(b,time(i,0));path(g,'M235 1090 V1180 H775 V1090',time(i,0),'historical relationship');const hist=chip(g,'Có quan hệ lịch sử',240,1210,'white');reveal(hist,time(i,0));move(a,{left:64,top:530},time(i,2),.75,'separate current C identity');move(b,{left:560,top:530},time(i,2),.75,'separate current C++ identity');note(g,'Hai ngôn ngữ riêng · quy tắc khác nhau.',time(i,2));
}
// 14: Class encloses related state/action, then produces distinct sensor objects.
{
const i=14,g=groups[i],spec=lang(g,'C++',64,430,948,615);text(spec,'LỚP CẢM BIẾN',230,40,650,36,'label');reveal(spec,time(i,1));const initialIcons=[0,1,2].map(j=>icon(g,'temperature-half',170+j*310,480,140));initialIcons.forEach((e,j)=>{reveal(e,time(i,0)+j*.15);move(e,{x:320-j*310,y:180,scale:.6},time(i,1),.65,'collect sensors into class description');tl.to(e,{autoAlpha:0,duration:.15},time(i,1)+.65);});const d=panel(spec,30,220,420,275,'white'),a=panel(spec,480,220,420,275,'white');text(d,'Số đo',25,35,350,48,'serif');text(d,'26°C',25,145,350,47,'mono');text(a,'Thao tác',25,35,350,48,'serif');text(a,'Đọc',25,145,350,47,'mono');reveal(d,time(i,2));reveal(a,time(i,2)+.4);move(spec,{height:565},time(i,2),.7,'enclose data and behavior in class');for(let j=0;j<3;j++){const ob=panel(g,64+j*322,1195,294,355,'orange');icon(ob,'temperature-half',82,35,120);text(ob,['26°C','27°C','25°C'][j],30,185,230,47,'mono');text(ob,'Cảm biến '+(j+1),25,270,240,26);reveal(ob,time(i,3)+j*.2);move(ob,{y:-25},time(i,3)+j*.2,.7,'instantiate distinct sensor');}}
// 15: Functions/data relations on C side, nesting on C++ side; neither is a capability ranking.
{
const i=15,g=groups[i],a=lang(g,'C',64,430,440,840),b=lang(g,'C++',560,430,440,840);const d=chip(a,'Dữ liệu',45,260,'white'),f=chip(a,'Hàm đọc',45,540,'white');reveal(a,time(i,0));path(g,'M220 830 V940 l-12 -16 m12 16 l12 -16',time(i,1),'function operates on data');const enclosure=panel(b,25,220,380,480,'white');text(enclosure,'Quan hệ\nđược diễn đạt\ntrong kiểu',25,70,320,42,'serif');reveal(b,time(i,2));move(enclosure,{height:420},time(i,2),.7,'organize relationship with language mechanisms');note(g,'C++ không bắt buộc dùng lớp cho mọi thứ.',time(i,3));
}
// 16: Resources are actual labeled capacities, not fabricated benchmarks.
{
const i=16,g=groups[i],p=panel(g,64,420,948,550,'blue');icon(p,'microchip',300,110,280);text(p,'THIẾT BỊ',30,30,800,30,'label');const a=panel(g,64,1100,440,410,'white'),b=panel(g,560,1100,440,410,'white');icon(a,'memory',130,50,160);text(a,'Bộ nhớ',30,255,370,47,'serif');icon(b,'sliders',130,50,160);text(b,'Xử lý',30,255,370,47,'serif');reveal(a,time(i,2));reveal(b,time(i,2)+.5);path(g,'M540 990 V1040 H285 V1080 M540 1040 H780 V1080',time(i,2),'inspect resource constraints');const r=rich(p,'Cần biết dùng ','bao nhiêu','',32,435,865,39);reveal(r.root,time(i,3));mark(r.span,time(i,3));
}
// 17: Nested software layers connect to hardware; kernel is a component, not all Linux software.
{
const i=17,g=groups[i],sys=panel(g,64,430,948,1130,'white');text(sys,'HỆ ĐIỀU HÀNH',30,30,850,34,'label');const kernel=panel(sys,40,245,860,420,'blue');text(kernel,'Nhân Linux',32,30,790,68,'serif');const kernelFact=text(kernel,'Phần lớn viết bằng C',32,145,790,38);reveal(kernelFact,time(i,'viết bằng C'));reveal(kernel,time(i,1));move(kernel,{top:190,height:490},time(i,2),.8,'open kernel inside operating system');const mem=chip(kernel,'Bộ nhớ',35,315,'white'),dev=chip(kernel,'Thiết bị',430,315,'white');reveal(mem,time(i,2));reveal(dev,time(i,3));icon(sys,'memory',160,840,140);icon(sys,'microchip',610,840,140);path(g,'M320 1150 V1250 M755 1150 V1250',time(i,3),'kernel communicates with hardware');
}
// 18: Existing library forms foundation, new language connects instead of replacement.
{
const i=18,g=groups[i],base=lang(g,'C',64,1080,948,460);text(base,'Mã · thư viện · công cụ',35,220,860,47,'serif');reveal(base,time(i,0));const upper=panel(g,200,430,800,475,'white');text(upper,'Thành phần\nđang đáp ứng tốt',35,55,700,62,'serif');reveal(upper,time(i,1));move(upper,{left:64,width:948},time(i,2),.8,'retain working component');const tag=chip(upper,'Kết hợp',300,315,'yellow',37);reveal(tag,time(i,3));path(g,'M290 930 V1050 M780 930 V1050',time(i,3),'connect to existing foundation');travel(g,'yêu cầu',710,850,710,1180,time(i,3),1);
}
// 19: Out of bounds write is blocked visibly by the explicit validation step.
{
const i=19,g=groups[i],mem=panel(g,64,440,948,525,'white');text(mem,'VÙNG NHỚ ĐÃ DÀNH',30,30,850,34,'mono');cells(mem,['26','27','25','…'],30,205,200);const bad=chip(g,'Ngoài vùng',600,1020,'red');reveal(bad,time(i,1));travel(g,'28',800,1250,730,1010,time(i,1),.8,'red');const guard=panel(g,64,1210,948,355,'yellow');icon(guard,'shield-halved',35,60,160);const r=rich(guard,'Kiểm tra\n','giới hạn','',245,60,645,55);reveal(guard,time(i,2));mark(r.span,time(i,2));move(bad,{x:70,y:45},time(i,2),.5,'reject invalid destination');const tools=chip(g,'Công cụ tìm lỗi',340,1100,'white',32);reveal(tools,time(i,3));
}
// 20: Requirements, not a ranking: three jobs move into corresponding decision rows.
{
const i=20,g=groups[i];const defs=[['chart-line','Dữ liệu','Thư viện thuận tiện','yellow'],['window-maximize','Web tương tác','Môi trường trình duyệt','purple'],['microchip','Sát thiết bị','Kiểm soát tài nguyên','blue']];defs.forEach(([ic,t,sub,tone],j)=>{const p=panel(g,64,430+j*365,948,280,tone);icon(p,ic,25,65,130);text(p,t,200,35,690,52,'serif');text(p,sub,200,155,690,34);reveal(p,time(i,j));move(p,{x:j===1?-12:12},time(i,j),.7,'match requirement to environment');});const r=chip(g,'Bắt đầu từ yêu cầu',260,1560,'white',28);reveal(r,time(i,3));
}
// 21: Overlapping outlines explicitly replace a four-box classification.
{
const i=21,g=groups[i];const p=panel(g,64,450,948,900,'white');const a=panel(p,45,180,550,400,'blue'),b=panel(p,365,320,530,410,'orange');text(a,'C',28,25,400,95,'mono');text(b,'C++',28,230,400,75,'mono');reveal(b,time(i,0));move(a,{width:610},time(i,0),.8,'domains overlap');const shared=panel(p,270,340,390,210,'white');text(shared,'Phần mềm\nhệ thống',25,45,330,40,'serif');reveal(shared,time(i,0)+.6);const py=chip(p,'Python: một số thiết bị',55,740,'yellow',31);reveal(py,time(i,1));note(g,'Ví dụ phân công ≠ bốn ngăn kín.',time(i,2));
}
// 22: Follow the same value through representation, storage and processing.
{
const i=22,g=groups[i],p=lang(g,'C',64,425,948,280);text(p,'Nhìn rõ phần bên dưới',210,125,690,43,'serif');
const data=panel(g,64,850,948,440,'white');const cs=cells(data,['26','—','—'],30,95,270);text(data,'BIỂU DIỄN → LƯU GIỮ → XỬ LÝ',30,295,860,32,'mono');reveal(data,time(i,1));
travel(g,'26',120,990,420,990,time(i,'lưu giữ'),.6);write(cs[1],'—','26',time(i,'lưu giữ')+.6);
travel(g,'26',420,990,720,990,time(i,'xử lý'),.6);write(cs[2],'—','26',time(i,'xử lý')+.6);
const r=note(g,'Kiểm soát đi cùng trách nhiệm.',time(i,2));const focus=r.querySelector('.copy');mark(focus,time(i,3),null,'yellow');
const choice=chip(g,'Chọn theo yêu cầu',280,750,'yellow',31);reveal(choice,time(i,3));
}
// 23: Same measurement travels across the now-known roles, then the rule resolves.
{
const i=23,g=groups[i],p=panel(g,64,430,948,710,'ink');const r=rich(p,'Chọn theo\n','việc cần làm','',35,50,860,85,true,'yellow');reveal(r.root,time(i,0));mark(r.span,time(i,2));const c=text(p,'C',35,350,200,165,'mono');c.style.color=C.blue;const sub=text(p,'Kiểm soát\n+ nền tảng phù hợp',270,390,610,48,'serif');reveal(sub,time(i,2));const xs=[64,390,716];['C','Python','JavaScript'].forEach((n,j)=>{const e=panel(g,xs[j],1280,292,230,tones[j]);text(e,n,20,80,245,n==='JavaScript'?32:43,'mono');reveal(e,time(i,1)+j*.2);});travel(g,'26°C',100,1180,760,1180,time(i,1),1.8);move(p,{height:665},time(i,2),.75,'compress known roles into takeaway');const tag=chip(g,'Từng bước một.',300,1550,'white',31);reveal(tag,time(i,3));
}
// Stable, separately timed captions. English language names keep their conventional spelling.
P.sections.forEach(sec=>{let chunks=[],line=[];for(const w of sec.words){if(line.length&&line.map(x=>x.w).join(' ').length+w.w.length+1>44){chunks.push(line);line=[];}line.push(w);}if(line.length)chunks.push(line);if(chunks.length>1&&chunks.at(-1).length<=2){const tail=chunks.pop();chunks[chunks.length-1].push(...tail);}chunks.forEach((words,i)=>{const e=el('div','caption-line',document.getElementById('captions'));const a=words[0].t0-.03,b=i+1<chunks.length?chunks[i+1][0].t0-.03:sec.start+sec.dur-.1;tl.set(e,{opacity:1},a);tl.set(e,{opacity:0},b);words.forEach((w,j)=>{if(j)e.appendChild(document.createTextNode(' '));const span=el('span','caption-word',e,w.w);tl.set(span,{backgroundColor:C.yellow},w.t0);});});});
tl.to(document.getElementById('progress'),{width:1040,duration:P.total,ease:'none'},0);
window.StoryTimeline=tl;window.OPERATION_SAMPLES=OPS;window.REVEAL_SAMPLES=REVEALS;window.EMPHASIS_SAMPLES=EMPHASIS;
})();
