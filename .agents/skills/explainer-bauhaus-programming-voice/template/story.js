/* Worked remainder example, NOT a generic topic/layout engine. Replace these builders for a new subject. */
function buildBauhaus(){
 const B=Bauhaus,S=window.SCRIPT,P=window.PLAN,tl=gsap.timeline({paused:true}),vi=S.language==='vi';
 const pages=document.getElementById('pages'),caps=document.getElementById('captions');
 document.title=S.title;document.documentElement.lang=S.language;
 const put=(p,tag,cls,text,x,y,w)=>B.node(tag,'placed '+cls,p,text,{left:x+'px',top:y+'px',...(w?{width:w+'px'}:{})});
 const field=(p,cls,x,y,w,h)=>B.node('div','field '+cls,p,null,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
 const heading=(page,c,y=210)=>put(page,'h1','',c.title,66,y,870);
 function hero(page,c,p){
  const disk=field(page,'red circle',710,-140,560,560);disk.dataset.layoutAllowOverflow='true';field(page,'amber rail',66,175,16,170);
  put(page,'div','eyebrow',c.label,104,182,650);heading(page,c,390);
  const block=put(page,'div','equation','7 % 3 = ?',66,820,880);B.appear(tl,block,B.cue(c,p,'equation'));
  field(page,'navy semi-up',66,1140,550,275);field(page,'amber circle',720,1270,136,136);
 }
 const positions=[[158,630],[270,630],[382,630],[158,860],[270,860],[382,860],[724,690],[724,840],[724,990]];
 function dot(svg,i,pos){const g=B.svg('g',svg,{'data-dot':i});B.svg('circle',g,{r:40,fill:'#ED3F27'});gsap.set(g,{x:pos[0],y:pos[1]});return g;}
 function grouping(page,c,p,index){
  if(c.n!==[7,8,9][index]||c.view!==['group','change','exact'][index]||c.result!==`${c.n} % 3 = ${c.n%3}`)throw Error('Starter geometry only supports 7/8/9 modulo 3; author the model for another case.');
  if(index===0){field(page,'navy',0,1140,1044,744);}else if(index===1){field(page,'amber',550,0,494,1560);}else{field(page,'red',0,0,1044,1884);field(page,'cream',36,36,972,1530);}
  put(page,'div','eyebrow',vi?'MỖI NHÓM 3 CHẤM':'THREE DOTS PER GROUP',66,120,900);heading(page,c,215);
  const svg=B.svg('svg',page,{viewBox:'0 0 1044 1560',width:1044,height:1560,style:'position:absolute;left:0;top:0;pointer-events:none'});
  const boxes=[600,830,1060].map(y=>B.svg('rect',svg,{x:80,y:y-65,width:410,height:175,rx:0,fill:'none',stroke:'#134686','stroke-width':5}));
  const divider=B.svg('line',svg,{x1:570,y1:505,x2:570,y2:1110,stroke:'#134686','stroke-width':3,'stroke-dasharray':'12 14'});
  const label1=B.svg('text',svg,{x:80,y:515});label1.textContent=vi?'NHÓM ĐỦ':'FULL GROUPS';
  const label2=B.svg('text',svg,{x:648,y:515});label2.textContent=vi?'CÒN LẠI':'REMAINDER';
  const ds=[];
  if(index===0){
   for(let i=0;i<7;i++){const initial=[148+(i%4)*192,625+Math.floor(i/4)*200];const d=dot(svg,i,initial);ds.push(d);B.appear(tl,d,B.cue(c,p,'gather')+i*.035,.18,'introduce seven items');B.move(tl,d,initial,positions[i],B.cue(c,p,i<3?'first':i<6?'second':'rest'),.65,'group conserved item '+i);}
   B.appear(tl,boxes[0],B.cue(c,p,'first'));B.appear(tl,boxes[1],B.cue(c,p,'second'));gsap.set(boxes[2],{autoAlpha:0});
   for(const e of [label1,label2,divider])B.appear(tl,e,B.cue(c,p,'first'));
  }else{
   for(let i=0;i<c.n;i++){const initial=i===c.n-1?[925,positions[i][1]]:positions[i];const d=dot(svg,i,initial);ds.push(d);if(i===c.n-1){B.appear(tl,d,B.cue(c,p,'add'));B.move(tl,d,initial,positions[i],B.cue(c,p,'add'),.65,'add one item');}}
   gsap.set(boxes[2],{autoAlpha:0});
   if(index===2){for(let i=6;i<9;i++)B.move(tl,ds[i],positions[i],[158+(i-6)*112,1090],B.cue(c,p,'third'),.7,'complete third group');B.appear(tl,boxes[2],B.cue(c,p,'third'));
    const zero=B.svg('text',svg,{x:724,y:840,'text-anchor':'middle',style:'font-size:144px;font-weight:900'});zero.textContent='0';B.appear(tl,zero,B.cue(c,p,'result'),.2,'empty remainder');
   }
  }
  const result=put(page,'div','result-strip',c.result,66,1280,912);result.dataset.result='true';B.appear(tl,result,B.cue(c,p,'result'),.25,'commit explained remainder');
  if(index!==2){const r=put(page,'div','note',vi?'Hai nhóm đủ. Phần còn lại chưa đủ ba.':'Two full groups. The rest cannot fill three.',80,1450,870);if(index===0)r.style.color='#FDF4E3';B.appear(tl,r,B.cue(c,p,'result'));}
  const last=B.cue(c,p,'result');if(last+.65>p.start+p.dur)throw Error('Result needs reading time');
 }
 function rule(page,c,p){field(page,'navy',0,0,1044,1884);const circle=field(page,'cream circle',66,140,350,350);put(circle,'div','hero-number','%',50,22,270);const h=heading(page,c,610);h.style.color='#FDF4E3';field(page,'amber',66,950,180,14);const line=put(page,'div','body',vi?'Chia hết → dư 0':'Exact division → remainder 0',66,1060,850);line.style.color='#FEB21A';B.appear(tl,line,B.cue(c,p,'rule'));const n=put(page,'div','proof note',c.note,66,1340,890);B.appear(tl,n,B.cue(c,p,'limit'));}
 const sections=[S.intro,...S.scenes,S.outro];if(S.scenes.length!==3)throw Error('Adapt sample story.js when changing its scenes.');
 sections.forEach((c,i)=>{const p=P.sections[i],page=B.node('article','page',pages);page.dataset.section=p.id;
 tl.set(page,{display:'block'},p.start);tl.set(page,{display:'none'},p.start+p.dur);
 if(i===0)hero(page,c,p);else if(i===sections.length-1)rule(page,c,p);else grouping(page,c,p,i-1);
 const badge=field(page,'amber circle',924,1560,72,72);Object.assign(badge.style,{display:'flex',alignItems:'center',justifyContent:'center',font:'28px BauMono'});badge.textContent=String(i+1).padStart(2,'0');
 B.captions(tl,p,caps);
 });
 tl.set({}, {}, P.total);window.__timelines={'bauhaus-programming':tl};window.BAUHAUS_OPS=B.operations;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',buildBauhaus,{once:true});else buildBauhaus();
