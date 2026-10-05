/* Code Noir visual score: original narration, redesigned native illustrations. */
function buildCodeNoir(){
 const S=window.SCRIPT,P=window.PLAN,V=window.NoirVisuals,tl=gsap.timeline({paused:true}),pages=document.getElementById('pages'),caps=document.getElementById('captions');
 document.title=S.title;document.documentElement.lang='vi';
 const add=(tag,cls,parent,text)=>{const e=document.createElement(tag);e.className=cls;if(text!=null)e.textContent=text;parent.append(e);return e;};
 const place=(e,x,y,w,h)=>{Object.assign(e.style,{left:x+'px',top:y+'px'});if(w)e.style.width=w+'px';if(h)e.style.height=h+'px';return e;};
 const text=(p,cls,value,x,y,w=908)=>place(add('div','copy '+cls,p,value),x,y,w);
 const norm=s=>String(s).normalize('NFC').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
 const cue=(p,phrase,occ=1)=>{const n=norm(phrase),w=(p.words||[]).flatMap(w=>norm(w.w).map(token=>({token,t:w.t0})));for(let i=0;i<=w.length-n.length;i++)if(n.every((v,j)=>v===w[i+j].token)&&!--occ)return w[i].t;throw Error('Missing cue '+phrase+' in '+p.id);};
 const show=(e,at,o)=>V.reveal(tl,e,at,o);const hide=(e,at)=>tl.to(e,{autoAlpha:0,duration:.2},at);
 const overlay=p=>{const e=V.svg('svg',{viewBox:'0 0 1080 1600',class:'world'},p);return e;};
 function arrow(svg,d,color,at){const path=V.path(svg,d,color,4);V.draw(tl,path,at,.65);return path;}
 function command(p,value,at,label='LỆNH GÕ VÀO'){const e=add('div','command',p);e.append(V.icon('terminal'));const v=add('span','',e,value);add('span','label',e,label);show(e,at);return {e,v};}
 function terminal(p,x,y,w,h){const e=place(add('div','terminal',p),x,y,w,h),bar=add('div','terminal-top',e);bar.append(V.icon('terminal'));add('span','',bar,'TERMINAL');return e;}
 function line(term,value,y,cls=''){return place(add('div','line '+cls,term,value),38,y);}
 function tree(p,at,{root=false,file=false,marker='home'}={}){
  const svg=overlay(p),positions={root:[140,660],home:[465,825],desktop:[230,1070],code:[710,1070],file:[650,1330],ghost:[910,1330]},nodes={},links={};
  const defs={root:['folder','/'],home:['folder','/Users/an'],desktop:['folder','Desktop'],code:['folder','code'],file:['file','hello.c'],ghost:['folder','code ?']};
  const paths={root:'M140 750 V770 H465 V754',desktop:'M465 914 V970 H230 V999',code:'M465 914 V970 H710 V999',file:'M710 1159 V1220 H650 V1259',ghost:'M710 1159 V1220 H910 V1259'};
  for(const [key,d] of Object.entries(paths)){const a=V.path(svg,d,'#555',3);gsap.set(a,{autoAlpha:0});links[key]=a;}
  for(const [key,[icon,name]] of Object.entries(defs)){const [x,y]=positions[key],n=place(add('div','node '+key,p),x,y);n.append(V.icon(icon));add('div','name',n,name);gsap.set(n,{autoAlpha:0});nodes[key]=n;}
  const reveal=(key,time)=>{show(nodes[key],time);if(links[key]){tl.set(links[key],{autoAlpha:1},time);V.draw(tl,links[key],time,.55);}};
  reveal('home',at);if(root)reveal('root',at+.15);if(file)reveal('file',at+.35);
  const m=add('div','marker',p);m.append(V.icon('pin'));add('span','',m,'ĐANG Ở ĐÂY');
  const mp={home:{x:0,y:0},code:{x:245,y:245}};place(m,440,675);gsap.set(m,{autoAlpha:0,...mp[marker]});tl.fromTo(m,{autoAlpha:0,y:mp[marker].y+10},{autoAlpha:1,y:mp[marker].y,duration:.3,immediateRender:false},at+.1);
  function go(to,time){const from=to==='code'?mp.home:mp.code;V.move(tl,m,from,mp[to],time,.8);}
  function trace(key,time,color='#8be9fd'){return arrow(svg,paths[key],color,time);}
  return {nodes,links,marker:m,reveal,trace,go,positions};
 }
 const sections=[S.intro,...S.scenes,S.outro];
 sections.forEach((c,i)=>{
  const p=P.sections[i],q=s=>cue(p,s),start=p.start,shot=add('article','shot',pages);shot.dataset.section=p.id;
  tl.set(shot,{display:'block'},start);tl.set(shot,{display:'none'},start+p.dur);
  const kicker=add('div','kicker',shot,c.kicker),heading=add('h1','',shot);if(c.titleRuns)c.titleRuns.forEach(r=>add('span',r.token,heading,r.text));else heading.textContent=c.title;
  show(kicker,start);show(heading,start+.05);
  if(i===0){
   const term=terminal(shot,86,540,908,420);show(term,start+.3);const input=line(term,'> ls',112,'cyan');show(input,q('gõ el-ét'));
   const group=place(add('div','file-preview',term),38,246,780);group.append(V.icon('folder',{size:58,color:'#f1fa8c'}));add('span','',group,'Desktop    code');show(group,q('danh sách tên file'));
   const target=place(add('div','marker',shot),120,1080,850);target.append(V.icon('pin',{size:84}));add('span','',target,'DANH SÁCH NÀY THUỘC THƯ MỤC NÀO?');show(target,q('trong thư mục nào'));
   const hint=text(shot,'com','Một vị trí → một danh sách.',86,1220);show(hint,q('Trả lời được câu này'));
  } else if(i===1){
   const term=terminal(shot,86,550,530,430);show(term,q('là cửa sổ'));const input=line(term,'> ls',120,'cyan');show(input,q('nhận chữ bạn gõ'));
   const sh=place(add('div','component',shot),720,590,274,280);sh.append(V.icon('shell',{size:86}));add('span','pink',sh,'shell');add('small','',sh,'chương trình');show(sh,q('chương trình đọc lệnh'));
   const svg=overlay(shot);arrow(svg,'M620 685 H711 M698 673 L711 685 698 697','#8be9fd',q('đọc lệnh'));
   const packet=place(add('div','transfer',shot,'ls'),555,645);show(packet,q('đọc lệnh'));V.move(tl,packet,{x:0},{x:142},q('đọc lệnh'),.6);hide(packet,q('đọc lệnh')+.7);
   const run=q('cho nó chạy');arrow(svg,'M856 878 V940 H620 M635 928 L620 940 635 952','#f1fa8c',run);
   const output=line(term,'Desktop\ncode',226,'yellow');show(output,run+.6);
   const z=text(shot,'pink','zsh',738,1060,250);show(z,q('zét-sheo'));
   const note=text(shot,'','Terminal hiện chữ.\nShell đọc lệnh và cho chạy.',86,1230);show(note,q('Máy nào cũng có'));
  } else if(i===2){
   const t=tree(shot,q('đứng trong một thư mục'));
   const cmd=command(shot,'pwd',q('Lệnh pi-đáp-liu-đi'));
   const output=text(shot,'purple','/Users/an',86,592);show(output,q('thư mục nhà'));
   const at=q('không kèm gì thêm');hide(output,at);tl.set(cmd.v,{textContent:'ls'},at);t.reveal('desktop',at+.35);t.reveal('code',at+.75);t.trace('desktop',at);t.trace('code',at+.45);
   const result=add('div','path-strip yellow',shot,'Desktop    code');show(result,q('đét-tóp và code'));
  } else if(i===3){
   const t=tree(shot,start+.2);t.reveal('desktop',start+.2);t.reveal('code',start+.2);
   const cmd=command(shot,'',q('gõ el-ét'));const ls=add('span','cyan',cmd.v,'ls'),space=add('span','',cmd.v,' '),arg=add('span','yellow',cmd.v,'code');show(arg,q('rồi chữ code'));
   const a=text(shot,'label cyan','TÊN LỆNH',86,612,300),b=text(shot,'label yellow','ĐỐI SỐ',430,612,300);show(a,q('Từ đầu là tên lệnh'));show(b,q('Phần sau là đối số'));
   t.trace('code',q('làm việc với cái gì'),'#f1fa8c');t.reveal('file',q('Kết quả'));t.trace('file',q('Kết quả'),'#f1fa8c');
   const result=add('div','path-strip yellow',shot,'hello.c');show(result,q('hé-lô chấm xi'));
  } else if(i===4){
   const t=tree(shot,start+.2);t.reveal('desktop',start+.2);t.reveal('code',start+.2);
   const expr=add('div','expression',shot),base=add('span','base',expr,'/Users/an/'),seg=add('span','segment',expr,'code');show(seg,q('Chữ code ở đây'));show(base,q('lấy thư mục nhà'));
   const label=text(shot,'label','VỊ TRÍ HIỆN TẠI + ĐƯỜNG DẪN',86,605);show(label,q('tính từ thư mục hiện tại'));
   const at=q('nối thêm code');tl.to(expr,{gap:0,duration:.7,ease:'power2.inOut'},at);tl.fromTo(seg,{x:100},{x:0,duration:.7,ease:'power2.inOut',immediateRender:false},at);t.trace('code',at,'#f1fa8c');
   const result=add('div','path-strip',shot,'/Users/an/code');show(result,at+.5);
  } else if(i===5){
   const t=tree(shot,start+.2,{root:true});t.reveal('code',start+.2);t.reveal('desktop',start+.2);
   const relative=command(shot,'code',q('tương đối tính từ'),'TƯƠNG ĐỐI');t.trace('code',q('chỗ bạn đang đứng'),'#f1fa8c');
   const at=q('là tuyệt đối');hide(relative.e,at-.25);const abs=command(shot,'/Users/an/code',at,'TUYỆT ĐỐI');abs.e.style.fontSize='44px';t.trace('root',at,'#8be9fd');t.trace('code',at+.7,'#8be9fd');
   const windows=text(shot,'com','Ví dụ trên Windows:\nC:\\Users\\an\\code',86,1430);windows.style.fontSize='34px';show(windows,q('Trên Windows'));
  } else if(i===6){
   const t=tree(shot,start+.15);t.reveal('desktop',start+.2);t.reveal('code',start+.2);t.reveal('file',start+.25);
   const cmd=command(shot,'cd code',q('Gõ xi-đi code'));
   const moved=q('đang đứng bên trong code');t.go('code',q('Gõ xi-đi code')+.4);t.trace('code',q('Gõ xi-đi code')+.2,'#ff79c6');
   tl.set(cmd.v,{textContent:'ls code'},q('gõ lại đúng lệnh'));t.reveal('ghost',q('máy đi tìm'));t.trace('ghost',q('máy đi tìm'),'#ff79c6');
   const cross=place(add('div','visual-icon',shot),923,1240,70,70);cross.append(V.icon('cross',{size:70,color:'#ff79c6'}));show(cross,q('Không có thư mục đó'));
   const err=add('div','path-strip pink',shot,'ls: code: No such file or directory');err.style.fontSize='34px';show(err,q('báo lỗi'));
   const path=text(shot,'label','ĐANG TÌM: /Users/an/code/code',86,595);show(path,q('máy đi tìm'));
  } else {
   const t=tree(shot,start+.2,{marker:'code'});t.reveal('desktop',start+.2);t.reveal('code',start+.2);t.reveal('file',start+.2);
   const cmd=command(shot,'ls → thư mục hiện tại',q('Mọi lệnh làm việc'),'');cmd.e.style.fontSize='39px';
   t.trace('file',q('tương đối được tính'),'#f1fa8c');
   const at=q('hãy gõ pi-đáp-liu-đi');tl.set(cmd.v,{textContent:'pwd'},at);const result=add('div','path-strip purple',shot,'/Users/an/code');show(result,at+.8);
  }
  const shown=S.captionDisplay||{},display=w=>{const m=String(w).match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);if(!m)return w;const v=shown[m[2]]??shown[m[2].toLowerCase()];return v==null?w:m[1]+v+m[3];};
  const words=p.words||[];for(let j=0;j<words.length;j+=7){const group=words.slice(j,j+7),row=add('div','caption',caps);group.forEach(w=>{const span=add('span','',row,display(w.w));tl.set(span,{color:'#8be9fd'},w.t0);tl.set(span,{color:'#e5e5e5'},w.t1);});tl.set(row,{visibility:'visible'},group[0].t0);tl.set(row,{visibility:'hidden'},group.at(-1).t1);}
 });
 tl.set({}, {}, P.total);window.CodeNoirTimeline=tl;window.__timelines={'code-noir':tl};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',buildCodeNoir,{once:true});else buildCodeNoir();
