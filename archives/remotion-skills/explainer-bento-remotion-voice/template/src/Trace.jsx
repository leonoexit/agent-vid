import React,{useMemo} from 'react';
import {Panel,Tag} from './ui';
import {progress} from './timeline.mjs';
import {poseAt,boxAround} from './motion.mjs';
import {MotionTile,RangeOutline,palette as C} from './MotionTile';
import {buildChoreography,sampleChoreography} from './search-choreography.mjs';
const CaptionLine=({children,y=1340,color=C.ink})=><div style={{position:'absolute',top:y,left:65,right:65,font:'700 32px/1.35 Bento Sans',textAlign:'center',color,zIndex:8}}>{children}</div>;
function History({steps,frame,start}){return <div style={{position:'absolute',left:72,top:1100,width:590}}><div className="kicker">ĐÃ SO SÁNH</div><div style={{display:'flex',gap:15,alignItems:'center',marginTop:25}}>{steps.map((s,i)=><React.Fragment key={i}><div style={{width:150,height:135,display:'grid',placeItems:'center',font:'800 61px Bento Mono',background:i===steps.length-1?C.yellow:C.white,border:`4px solid ${C.ink}`,borderRadius:22,boxShadow:`6px 6px 0 ${C.ink}`,opacity:progress(frame,start+i*10,14),transform:`translateY(${(1-progress(frame,start+i*10,14))*25}px)`}}>{s.value}</div>{i<steps.length-1&&<span style={{fontSize:28}}>→</span>}</React.Fragment>)}</div></div>}
function Summary({steps,frame,start}){return <div style={{position:'absolute',left:65,right:65,top:590,display:'flex',gap:25}}>{steps.map((s,i)=><div key={i} style={{flex:1,background:[C.blue,C.yellow,C.orange][i],border:`4px solid ${C.ink}`,borderRadius:30,boxShadow:`10px 10px 0 ${C.ink}`,height:510,padding:'24px 18px',opacity:progress(frame,start+i*7,18),transform:`translateY(${(1-progress(frame,start+i*7,18))*50}px)`}}><div className="mono" style={{fontSize:112,fontWeight:850,lineHeight:1.2,textAlign:'center'}}>{s.ids.length}</div><div className="mono" style={{textAlign:'center',fontSize:23}}>ứng viên</div><div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,marginTop:38}}>{s.ids.map(id=><div key={id} style={{height:50,border:`3px solid ${C.ink}`,background:C.white,borderRadius:10,display:'grid',placeItems:'center',font:'750 24px Bento Mono'}}>#{id}</div>)}</div></div>)}</div>}
export function BinarySearch({frame:f,timeline,script,shot,visualTest=false}){
 const c=timeline.cues,has=k=>f>=c[k],p=(k,d=22)=>progress(f,c[k],d);
 const model=useMemo(()=>buildChoreography(script.example,c),[script.example,c]);
 const rects=sampleChoreography(model,f),{trace}=model;
 const verify=f>=c.trail-28,rule=has('rule');
 const stepIndex=has('mid3')?2:has('mid2')?1:0,step=trace.steps[stepIndex];
 const selected=step.mid,comparisonFrame=[c.compare1,c.compare2,c.found][stepIndex];
 const compareOn=f>=comparisonFrame;
 const inStation=has('pick1')&&!verify && !(f>=c.discard1&&f<c.mid2) && !(f>=c.shrink2&&f<c.mid3);
 const firstArchive=has('discard1'),secondArchive=has('shrink2');
 const isArchived=id=>!verify&&((firstArchive&&trace.steps[0].discarded.includes(id))||(secondArchive&&trace.steps[1].discarded.includes(id)));
 const arrayMode=has('mid3')?model.one:has('mid2')||has('shrink1')?model.remaining:has('mid1')?model.row:model.overview;
 const target=poseAt(f,model.targetInitial,model.targetKeys);
 const outlines=poseAt(f,boxAround(Object.values(model.overview)),model.bounds);
 const headline=shot.phase==='question'?'Bỏ nửa dãy.\nCó bỏ nhầm?':shot.phase==='setup'?'Thứ tự cho ta\nmột manh mối.':shot.phase==='rule'?'Có thứ tự,\nmới loại được.':shot.phase==='verify'?'Tìm thấy.\nNhìn lại đường đi.':shot.title;
 const title=shot.id==='scene-4'?`${trace.steps[0].value} so với ${script.example.target}`:shot.id==='scene-5'?`Bỏ được\ncả ${trace.steps[0].discarded.length} ô.`:shot.id==='scene-8'?`Lần này,\nbỏ bên ${trace.steps[1].relation==='<'?'trái':'phải'}.`:headline;
 const phase={question:'CÂU HỎI',setup:'ĐIỀU KIỆN',decode:'ĐỌC CÁCH LÀM',execute:'CHẠY VÍ DỤ',verify:'KIỂM CHỨNG',rule:'QUY TẮC'}[shot.phase];
 return <>
  <div style={{position:'absolute',left:62,top:135,right:60,zIndex:10}}><div className="kicker">{visualTest?'THỬ DỮ LIỆU · KHÔNG LỜI':phase}</div><h1 className="title" style={{fontSize:shot.phase==='question'||shot.phase==='rule'?78:66,maxWidth:920}}>{title}</h1></div>
  {!verify&&has('bounds')&&<RangeOutline rect={outlines} opacity={p('bounds')*(1-p('mid3',15))} label={has('shrink2')?`${trace.steps[2].ids.length} ỨNG VIÊN`:has('shrink1')?`${trace.steps[1].ids.length} ỨNG VIÊN`:'VÙNG CÒN TÌM'}/>}
  {!has('bounds')&&<div className="mono" style={{position:'absolute',left:68,top:375,fontWeight:750,fontSize:25}}>{has('sorted')?'DÃY ĐÃ TĂNG DẦN':'8 SỐ · TÌM MỘT SỐ'}</div>}
  {has('order')&&!has('bounds')&&<svg style={{position:'absolute',left:85,top:962,width:840,height:95}} viewBox="0 0 840 95"><path d="M0 26 H824 l-16 -13 m16 13 l-16 13" fill="none" stroke={C.ink} strokeWidth="5" strokeDasharray="870" strokeDashoffset={870*(1-p('order',28))}/><text x="0" y="82" fontSize="26" fontFamily="Bento Sans" fontWeight="700">nhỏ hơn</text><text x="685" y="82" fontSize="26" fontFamily="Bento Sans" fontWeight="700">lớn hơn</text></svg>}
  {verify&&!rule&&<div className="mono" style={{position:'absolute',left:65,top:371,fontWeight:750,fontSize:25}}>DÃY BAN ĐẦU · GIỮ NGUYÊN THỨ TỰ</div>}
  {inStation&&stepIndex<2&&arrayMode[selected]&&<MotionTile id={`slot-${selected}`} rect={arrayMode[selected]} ghost/>}
  {model.ids.map(id=><MotionTile key={id} id={`value-${id}`} value={script.example.values[id]} rect={rects[id]} label={`#${id}`} archived={isArchived(id)} tone={(inStation&&id===selected)||(has('found')&&id===trace.index)?'orange':'yellow'} selected={inStation&&id===selected} found={has('found')&&id===trace.index} opacity={progress(f,5+id*2,15)}/>)}
  <MotionTile id="target" value={script.example.target} rect={target} tone="purple" label="CẦN TÌM" opacity={1-p('rule',15)}/>
  {inStation&&<div style={{position:'absolute',left:454,width:133,top:stepIndex===0?1083:stepIndex===1?1166:743,textAlign:'center',font:'850 100px Bento Mono',opacity:compareOn?progress(f,comparisonFrame,9):0,zIndex:9}}>{step.relation}</div>}

  {shot.phase==='question'&&<div style={{position:'absolute',left:65,top:1130,width:520}}><div style={{font:'900 57px/1.18 Bento Serif'}}>Không thử<br/>từng ô.</div><div style={{fontSize:34,marginTop:28,lineHeight:1.4}}>Dựa vào đâu để bỏ<br/>cả một nhóm?</div></div>}
  {shot.phase==='setup'&&<Panel style={{left:65,top:1120,width:535,height:281,background:C.blue}}><div className="kicker">ĐIỀU KIỆN</div><div style={{font:'900 49px/1.18 Bento Serif'}}>Dãy đã<br/>sắp xếp.</div></Panel>}
  {shot.id==='scene-2'&&<Panel style={{left:65,top:1130,width:535,height:265,background:C.ink,color:C.white}}><div className="kicker" style={{color:C.yellow}}>HAI MỐC</div><div className="mono" style={{fontSize:39}}>L = 0 · R = {model.ids.length-1}</div><div style={{fontSize:27,marginTop:22}}>Chỉ số bắt đầu từ 0.</div></Panel>}
  {has('mid1')&&!has('compare1')&&!(f>=c.pick1&&f<c.pick1+23)&&<>
    <div className="mono" style={{position:'absolute',top:800,left:65,right:65,textAlign:'center',fontSize:40,fontWeight:750}}>mid = ⌊(0 + {model.ids.length-1}) / 2⌋{has('pick1')?` = ${trace.steps[0].mid}`:''}</div>
    {has('value1')&&<CaptionLine y={1330}>Ô thứ {trace.steps[0].mid+1} mang giá trị {trace.steps[0].value}.</CaptionLine>}
  </>}
  {inStation&&compareOn&&!has('proof1')&&<CaptionLine>{step.relation==='<'?'Nhỏ hơn → tìm sang phải':'Lớn hơn → tìm sang trái'}</CaptionLine>}
  {has('proof1')&&!has('discard1')&&<Panel style={{left:68,top:795,width:905,height:130,background:C.ink,color:C.yellow,padding:22}}><div className="mono" style={{textAlign:'center',fontSize:32,fontWeight:750}}>{trace.steps[0].discarded.map(i=>script.example.values[i]).join(', ')} {trace.steps[0].relation==='<'?'≤':'≥'} {trace.steps[0].value} {trace.steps[0].relation} {script.example.target}</div><div style={{textAlign:'center',fontSize:24,marginTop:8,color:C.white}}>Cả nhóm không thể là số cần tìm.</div></Panel>}
  {firstArchive&&!verify&&f>=c.discard1+25&&!(f>=c.shrink2&&f<c.shrink2+27)&&<div className="mono" style={{position:'absolute',left:98,top:1380,fontSize:23,fontWeight:750}}>ĐÃ LOẠI · GIỮ VỊ TRÍ GỐC</div>}
  {f>=c.shrink1+30&&!has('mid2')&&<div style={{position:'absolute',left:65,top:1145,width:515}}><div className="mono" style={{fontWeight:850,fontSize:112}}>{model.ids.length} → {trace.steps[1].ids.length}</div><div style={{fontSize:29,fontWeight:700,marginTop:12}}>Mốc {trace.steps[0].relation==='<'?'trái':'phải'} chuyển sang #{trace.steps[0].relation==='<'?trace.steps[1].left:trace.steps[1].right}.</div></div>}
  {has('compare2')&&!has('shrink2')&&<div style={{position:'absolute',left:66,top:365,right:66,font:'750 30px Bento Mono',textAlign:'center'}}>{has('proof2')?`${trace.steps[1].discarded.map(i=>script.example.values[i]).join(', ')} ${trace.steps[1].relation} ${script.example.target}`:`${step.value} ${step.relation} ${script.example.target} → tìm bên ${step.relation==='<'?'phải':'trái'}`}</div>}
  {f>=c.shrink2+27&&!has('mid3')&&<div style={{position:'absolute',top:966,left:100,width:500}}><div className="mono" style={{fontSize:106,fontWeight:850}}>{trace.steps[1].ids.length} → {trace.steps[2].ids.length}</div><div style={{fontSize:30,fontWeight:700}}>Chỉ còn vùng #{trace.steps[2].left}…#{trace.steps[2].right}.</div></div>}
  {has('found')&&!verify&&<CaptionLine y={1070}>Khớp mục tiêu. Dừng tại đây.</CaptionLine>}
  {verify&&!rule&&<><History steps={trace.steps} frame={f} start={c.trail+2}/>{has('result')&&<Panel style={{left:72,top:1345,width:864,height:160,background:C.ink,color:C.yellow}}><div style={{font:'800 46px Bento Mono'}}>{script.example.target} → ô thứ {trace.index+1}</div><div style={{fontSize:25,marginTop:10,color:C.white}}>Chỉ số {trace.index} trong dãy ban đầu.</div></Panel>}</>}
  {rule&&<><Summary steps={trace.steps} frame={f} start={c.rule+27}/>{has('boundary')&&<Panel style={{left:65,top:1160,width:908,height:160,background:C.ink,color:C.yellow}}><div style={{font:'800 36px/1.3 Bento Sans'}}>Chưa sắp xếp?<br/>Không thể loại theo cách này.</div></Panel>}</>}
 </>;
}
