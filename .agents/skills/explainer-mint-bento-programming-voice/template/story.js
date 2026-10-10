/* Array.push example. Shared MintUI components supply the visual system; this file owns state and timing. */
function buildMintBento(){
 const B=MintBento,U=MintUI,S=SCRIPT,P=PLAN,vi=S.language==='vi',tl=gsap.timeline({paused:true}),commits=[];
 const pages=document.getElementById('pages'),caps=document.getElementById('captions');document.title=S.title;document.documentElement.lang=S.language;
 function top(page,c,operation){U.hero(page,operation,340,146,666,194,operation==='Array'?'array':'plus');const tag=U.box(page,'ui-popover',76,254,253,82,'JavaScript');tag.style.transform='rotate(-13deg)';U.text(page,'title',c.title,74,408,925);}
 function badge(page,text,x,y,w=530){const e=U.box(page,'ui-popover ui-dark',x,y,w,90);e.style.background='linear-gradient(135deg,#173440,#142a37)';e.style.color='#fff';e.style.transform='rotate(-7deg)';U.icon(e,'check','',20,23,38,'#bdf7df');U.text(e,'label',text,76,25,w-96);return e;}
 function append(page,c,p,index){
  const before=index===0?['A','B']:['A','B','C'],item=index===0?'C':'D';if(JSON.stringify(c.before)!==JSON.stringify(before)||c.item!==item)throw Error('Starter supports consecutive push C then D; adapt story.js for another model.');
  top(page,c,'push()');const a=U.array(page,before,{y:708,vi}),m=U.metric(page,before.length,{y:1130,vi});
  const code=U.code(page,item,{y:1130,vi});B.appear(tl,code,B.cue(c,p,'code'));
  const next=U.slot(a.bar,item,before.length,true);gsap.set(next,{autoAlpha:0});
  const proxy=U.box(page,'datum proxy',0,0,176,140,item);proxy.dataset.proxy=item;
  const target=[a.x+28+24+before.length*199,a.y+188+25],start=[1060,target[1]],at=B.cue(c,p,'append'),commit=at+.62;
  B.appear(tl,proxy,at,.12,'new item in flight');B.move(tl,proxy,start,target,at,.62,'append '+item);
  const newCount=U.text(m.panel,'number',String(before.length+1),27,94,236);newCount.style.fontSize='176px';newCount.dataset.count=String(before.length+1);gsap.set(newCount,{autoAlpha:0});
  tl.set([next,newCount],{autoAlpha:1},commit);tl.set([proxy,m.value],{autoAlpha:0},commit);
  const result=badge(page,vi?'Đã thêm '+item+' vào items':'Added '+item+' to items',84,1430,540);B.appear(tl,result,B.cue(c,p,'result'),.2,'inspect committed state');
  const increment=U.box(page,'ui-popover',496,1356,160,81,'+1');increment.style.fontSize='42px';increment.style.transform='rotate(8deg)';U.box(increment,'ui-dot',105,34,12,12).style.background='#ff6d61';B.appear(tl,increment,B.cue(c,p,'result'));
  if(B.cue(c,p,'result')<commit)throw Error('Result narrated before append commits; revise cue/timing.');commits.push({section:p.id,item,start:at,commit,before:before.length,after:before.length+1});
 }
 function inspect(page,c,p){if(JSON.stringify(c.items)!=='["A","B","C"]')throw Error('Inspection must follow C append.');
  const nav=U.box(page,'ui-popover',74,160,346,82);U.icon(nav,'array','',16,17,48);U.text(nav,'label','items / Array',84,23,240);U.text(page,'title',c.title,74,310,924);
  const m=U.metric(page,3,{x:74,y:560,w:360,h:450,vi});m.value.style.fontSize='260px';m.value.style.top='102px';m.panel.lastChild.style.top='386px';
  const detail=U.detail(page,{x:464,y:560,w:542,h:450,vi});B.appear(tl,detail,B.cue(c,p,'inspect'));U.text(detail,'ui-meta',vi?'Hai góc nhìn, một đối tượng.':'Two views, one object.',28,388,484);
  const a=U.array(page,c.items,{y:1110,vi,newLast:true});const focus=U.box(page,'outline',60,1096,960,400);focus.style.borderRadius='66px';B.appear(tl,focus,B.cue(c,p,'match'));
  const link=U.box(page,'ui-ring',860,955,130,130);U.icon(link,'arrow-left','',16,16,76);B.appear(tl,link,B.cue(c,p,'match'));
  tl.fromTo(m.panel,{scale:1},{scale:1.025,duration:.25,repeat:1,yoyo:true,ease:'power1.inOut',immediateRender:false},B.cue(c,p,'match'));
 }
 function hero(page,c,p){
  U.hero(page,'Array',340,168,666,196,'array');U.text(page,'title',c.title,74,393,930);
  const code=U.code(page,'C',{x:74,y:650,w:656,vi});B.appear(tl,code,B.cue(c,p,'question'));
  const action=U.box(page,'ui-action',750,650,256,222);U.icon(action,'arrow-up-right','',44,27,170);B.appear(tl,action,B.cue(c,p,'question'));
  U.array(page,['A','B'],{x:230,y:892,w:776,vi});const diamond=U.box(page,'ui-diamond',77,974,126,126);MintIcons.add(diamond,'plus');
  U.metric(page,2,{x:74,y:1282,w:342,h:310,vi});const meter=page.lastChild;meter.querySelector('.number').style.fontSize='150px';meter.lastChild.style.top='265px';
  U.box(page,'clover',452,1266,398,336);const properties=U.card(page,446,1308,560,176);properties.style.borderRadius='30px';U.text(properties,'ui-meta',vi?'Đang xem':'Viewing',26,20,210);U.text(properties,'ui-heading','items',26,56,270);U.box(properties,'ui-badge',382,49,144,48,'Array');U.text(properties,'ui-meta',vi?'Cùng đối tượng trong suốt ví dụ.':'Same object throughout this example.',26,120,510);
  badge(page,vi?'Trạng thái ban đầu':'Initial state',628,528,359);
 }
 function outro(page,c,p){top(page,c,'push()');U.array(page,['A','B','C','D'],{y:790,vi,newLast:true});const done=U.box(page,'ui-action',74,1200,252,285);U.icon(done,'check','',41,58,170);const proof=U.card(page,352,1200,654,285);const rows=U.box(proof,'ui-rows',20,20,614,245);U.row(rows,'+ ',vi?'Vị trí thêm':'Append position',vi?'Cuối':'End',null,{accent:true});U.row(rows,'[ ]',vi?'Mảng thay đổi':'Changed array','items',null,{selected:true});B.appear(tl,proof,B.cue(c,p,'rule'));}
 if(S.scenes.length!==3)throw Error('Adapt sample choreography when changing scene structure.');
 [S.intro,...S.scenes,S.outro].forEach((c,i)=>{const p=P.sections[i],page=B.node('article','page',pages);page.dataset.section=p.id;tl.set(page,{display:'block'},p.start);tl.set(page,{display:'none'},p.start+p.dur);if(i===0)hero(page,c,p);else if(i===1)append(page,c,p,0);else if(i===2)inspect(page,c,p);else if(i===3)append(page,c,p,1);else outro(page,c,p);B.captions(tl,p,caps);});
 tl.set({}, {},P.total);window.__timelines={'mint-bento-programming':tl};window.MINT_COMMITS=commits;window.MINT_OPS=B.operations;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',buildMintBento,{once:true});else buildMintBento();
