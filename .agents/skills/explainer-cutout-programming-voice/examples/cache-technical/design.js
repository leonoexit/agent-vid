/* Shared design vocabulary. Native data values are separate from photographic pixels. */
window.CutoutDesign=(()=>{const B=Cutout;
const box=(p,cls,x,y,w,h,text)=>B.node('div','placed '+cls,p,text,{left:x+'px',top:y+'px',...(w?{width:w+'px'}:{}),...(h?{height:h+'px'}:{})});
const text=(p,cls,t,x,y,w)=>box(p,cls,x,y,w,null,t);
function img(p,name,x,y,w,rotation=0){const e=B.node('img','cutout',p);e.src='assets/images/'+name+'.png';e.alt=name==='hand-card'?'Bàn tay cầm thẻ xanh':'Khay lưu trữ màu lime';Object.assign(e.style,{left:x+'px',top:y+'px',width:w+'px',height:w+'px',transform:'rotate('+rotation+'deg)'});return e;}
function plane(p,color,x,y,w,h,rotation=0){const e=box(p,'color-plane',x,y,w,h);e.style.background=color;e.style.transform='rotate('+rotation+'deg)';return e;}
function top(p,title,eyebrow='LẬP TRÌNH / MỘT Ý TƯỞNG'){text(p,'meta',eyebrow,76,105,920);text(p,'title',title,76,225,920);}
function arrow(p,d,color='#2548f4'){const s=B.svg('svg',p,{class:'arrow',viewBox:'0 0 1080 1920',width:1080,height:1920});B.svg('path',s,{d,fill:'none',stroke:color,'stroke-width':7,'stroke-linecap':'round','stroke-linejoin':'round'});return s;}
function scene(p,{cached=false,calls=0}={}){
 plane(p,'#e0d8f3',52,705,588,712,-3);text(p,'meta','CACHE / BẢN ĐÃ LƯU',85,768,550);img(p,'lime-tray',38,817,634,-7);
 const cache=box(p,'data-paper',129,899,418,154);cache.style.transform='rotate(-5deg)';text(cache,'label','A',22,16,110);const cachedValue=text(cache,'num',cached?'42':'—',168,21,215);cachedValue.dataset.cache='';
 const source=box(p,'data-paper',692,724,312,375);source.style.background='#18201f';source.style.color='#fff';text(source,'meta','NGUỒN',27,29,260);text(source,'label','A',27,87,220);text(source,'num','42',27,168,260).dataset.source='';
 const count=text(p,'counter',String(calls),698,1170,294);count.dataset.calls='';text(p,'meta','LƯỢT GỌI NGUỒN',698,1124,294);
 const response=box(p,'answer',76,1360,928,102,'Yêu cầu A');return {cache,cachedValue,source,count,response};
}
function hook(p){top(p,'Hỏi lại.\nLấy ở đâu?','CACHE / DÙNG LẠI KẾT QUẢ');plane(p,'#dafc63',42,640,934,845,-5);text(p,'title','CACHE',55,680,950).style.cssText+='font-size:192px;letter-spacing:-12px;color:#2548f4;z-index:2';img(p,'hand-card',195,793,790,9);const label=box(p,'slip',91,1344,498,108,'Một lần nữa?');label.style.transform='rotate(-6deg)';box(p,'stamp',835,510,151,151,'A → ?');}
function freshness(p){top(p,'Có sẵn ≠\nmới nhất.','CACHE / GIỚI HẠN CẦN NHỚ');plane(p,'#ff735b',610,755,390,494,5);const src=box(p,'data-paper',633,785,343,371);text(src,'meta','NGUỒN ĐÃ ĐỔI',24,28,300);text(src,'num','43',26,128,285);text(p,'meta','BẢN TRONG CACHE',76,750,535);img(p,'lime-tray',5,838,649,-10);const val=box(p,'data-paper',118,917,380,151);val.style.transform='rotate(-5deg)';text(val,'num','42',45,10,290);const rule=box(p,'slip',108,1330,875,116,'Cần cập nhật hoặc bỏ bản cũ.');rule.style.transform='rotate(2deg)';}
return {box,text,img,plane,top,arrow,scene,hook,freshness};})();
