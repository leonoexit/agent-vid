(function(){'use strict';
function init(){const stage=document.getElementById('study'),tl=gsap.timeline({paused:true}),ops=[];
const record=(node,start,duration,kind,job)=>ops.push({id:node.id,start,end:start+duration,kind,job});
const ed=NoirEditorial.create(tl,record);
function n(id,cls,text,left,top,width,height){const e=document.createElement('div');e.id=id;e.className='s-node '+cls;e.textContent=text;Object.assign(e.style,{left:left+'px',top:top+'px',width:width+'px',...(height?{height:height+'px'}:{})});stage.appendChild(e);return e}
function reveal(e,t){gsap.set(e,{autoAlpha:0});tl.to(e,{autoAlpha:1,duration:.3},t);record(e,t,.3,'disclosure','open relevant evidence')}
const label=n('study-label','s-label','NOIR / VÍ DỤ CHUYỂN BỐ CỤC',64,80,952);
const title=n('question','s-title','Đổi x.\ny có đổi?',64,270,952);
const call=n('call','noir-command','y = copy(x)',64,1160,480,95);
const input=n('input','s-mono','x = 10',640,1170,350);
const code=n('definition','noir-terminal','',64,950,952,470);gsap.set(code,{autoAlpha:0});
const chrome=document.createElement('div');chrome.className='noir-terminal-bar';chrome.textContent='copy.js';code.appendChild(chrome);
const body=document.createElement('code');body.id='definition-body';body.style.fontSize='40px';body.textContent='function copy(value) {\n  return value;\n}';code.appendChild(body);gsap.set(body,{autoAlpha:0});
const cap=n('study-caption','','Một câu hỏi lớn; dữ liệu ban đầu ở vùng phụ.',64,1740,952);
ed.yieldTitle({at:2,duration:.9,tracks:[{node:title,from:{top:270,fontSize:132},to:{top:205,fontSize:52}},{node:call,from:{top:1160},to:{top:440}},{node:input,from:{top:1170},to:{top:445}}]});
tl.set(cap,{textContent:'Lệnh gọi giữ vai trò mốc; phần định nghĩa nhận diện tích đọc.'},2);
reveal(code,3.2);ed.focusWindow({at:3.2,duration:.9,tracks:[{node:code,from:{top:950,height:470,rotation:2},to:{top:640,height:520,rotation:0}}]});reveal(body,4.05);
const token=n('value-token','noir-command','10',670,465,115,85);reveal(token,4.5);tl.to(token,{left:700,top:1010,duration:.8},4.5);tl.to(token,{autoAlpha:0,duration:.15},5.3);record(token,4.5,.8,'model','argument enters visible definition');
const result=n('result','s-value','y = 10',64,650,952);reveal(result,6);record(result,6,.3,'model','copy returns primitive value');tl.to(code,{autoAlpha:0,duration:.3},5.7);tl.to([call,input],{autoAlpha:0,duration:.3},5.7);tl.set(cap,{textContent:'Hàm trả về 10. Kết quả trở thành trọng tâm.'},6);
ed.resultToEvidence({at:8,duration:.9,tracks:[{node:result,from:{top:650,fontSize:174},to:{top:380,fontSize:106}}]});
const x=n('observed-x','s-light','',64,810,440,470),y=n('observed-y','s-light','',560,810,456,470);
for(const [e,label,value] of [[x,'SAU KHI ĐỔI x','x = 20'],[y,'BẢN SAO GIỮ NGUYÊN','y = 10']]){const a=document.createElement('span');a.className='s-small';a.textContent=label;e.appendChild(a);e.appendChild(document.createTextNode(value));reveal(e,8.9)}
record(x,8.9,.3,'model','assign 20 to x while y remains 10');tl.set(cap,{textContent:'Gán x = 20. Đối chiếu: y vẫn giữ giá trị đã sao chép.'},8.9);
const rule=n('rule','s-mono','Sao chép giá trị tại thời điểm gán.',64,1460,952);reveal(rule,11);
tl.to({}, {duration:.01},14.99);window.StudyTimeline=tl;window.STUDY_OPS=ops;
const slider=document.getElementById('seek'),time=document.getElementById('time');slider.oninput=()=>{tl.pause().seek(+slider.value);time.textContent=(+slider.value).toFixed(2)};document.getElementById('play').onclick=()=>tl.paused()?tl.play(tl.time()>=15?0:tl.time()):tl.pause();tl.eventCallback('onUpdate',()=>{slider.value=tl.time();time.textContent=tl.time().toFixed(2)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
