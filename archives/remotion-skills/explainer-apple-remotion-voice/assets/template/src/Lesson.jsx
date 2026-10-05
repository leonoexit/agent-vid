import React from 'react';
import {assignmentState} from './model.mjs';
import {progress} from './timeline.mjs';
import {stagePoses,transferPosition} from './shot-plan.mjs';
import {SculptedTile,CopyGlyph,ValueToken,CodeCapsule} from './Assets';
import {cameraAt,cameraTransform} from './camera.mjs';
import {sectionLayers,glyphState} from './transitions.mjs';
const names={question:'GÁN BIẾN',setup:'01 / TẠO BIẾN',copy:'02 / SAO CHÉP',change:'03 / GÁN LẠI',verify:'KẾT QUẢ',rule:'GIÁ TRỊ SỐ · JAVASCRIPT'};
function Heading({phase,initial}){
 if(phase==='question')return <>Đổi x.<br/><span className="gradient-word">y có đổi theo?</span></>;
 if(phase==='setup')return <>Bắt đầu<br/>với <span className="coral-word">một số.</span></>;
 if(phase==='copy')return <>Giữ bản gốc.<br/><span className="gradient-word">Tạo bản sao.</span></>;
 if(phase==='change')return <>Đổi <span className="coral-word">x.</span></>;
 if(phase==='verify')return <>y vẫn giữ<br/><span className="blue-word">số {initial}.</span></>;
 return <>Giá trị<br/><span className="gradient-word">ở lúc gán.</span></>;
}

function Overlay({frame,shot,e,state,c,textAlpha}){
 const phase=shot.phase,intro=phase==='question',create=progress(frame,c.createX,12);
 return <>  <div className={`ambient ambient-${phase}`}/>
  <div style={{opacity:textAlpha}}>
  <div className="chapter"><span/>{names[phase]}</div>
  <div className={`hero-heading heading-${phase}`}><Heading phase={phase} initial={e.initial}/></div>
  {intro&&<>
   <CopyGlyph style={{left:765,top:660,width:166,height:180,opacity:progress(frame,24,24),transform:`rotate(${9-5*progress(frame,24,24)}deg) translateY(${15*(1-progress(frame,24,24))}px)`}}/>
   <div className="intro-code" style={{opacity:progress(frame,80,23),transform:`translateY(${20*(1-progress(frame,80,23))}px)`}}><span className="code-dots"><i/><i/><i/></span><code>let x = {e.initial};<br/>let y = x;<br/>x = {e.replacement};</code><span className="intro-code-label">Thử ba dòng này.</span></div>
  </>}
  {!intro&&<div className={`instruction instruction-${phase}`} style={{opacity:1,transform:`translateY(${0}px)`}}><CodeCapsule phase={phase} example={e}/>{phase==='verify'&&<div className="instruction-note">Đã chạy ở bước trước.</div>}{phase==='rule'&&<div className="instruction-note">Lúc gán: x = {e.initial}</div>}</div>}
  {phase==='setup'&&state.x!==null&&<div className="under-label" style={{opacity:create}}><span className="status-dot coral"/>x đang giữ {e.initial}</div>}
  {phase==='copy'&&<div className="copy-labels" style={{opacity:1}}><span style={{left:280}}>x giữ nguyên</span><span style={{left:800,color:state.copied?'#117bd2':'#8c919b'}}>{state.copied?`y nhận ${e.initial}`:state.copying?'Đang nhận…':'Chờ bản sao'}</span></div>}
  {phase==='change'&&state.changed&&<div className="unchanged-badge" style={{opacity:state.changeProgress}}><span className="status-dot blue"/>y vẫn là {e.initial}</div>}
  {phase==='verify'&&<div className="verify-note" style={{opacity:1}}>Giữ giá trị đã nhận.<br/><span>Không chạy theo x.</span></div>}
  {phase==='rule'&&<div className="rule-note" style={{opacity:1}}>Sao chép giá trị số.<br/><span>Tại thời điểm thực hiện phép gán.</span></div>}
</div></>;
}
export function Lesson({frame,timeline,script}){
 const e=script.example,c=timeline.cues,state=assignmentState(frame,c,e),pose=stagePoses(frame,timeline);
 const camera=cameraAt(frame,{x:540,y:960,zoom:1.08,roll:0},[
  {at:0,duration:46,to:{x:540,y:960,zoom:1,roll:0}},
  ...timeline.sections.slice(1).map(s=>({at:s.start,duration:28,to:{x:540,y:960,zoom:['setup','change','verify'].includes(s.phase)?1.035:1,roll:0}}))
 ]);
 const token=transferPosition(pose,state.copyProgress);
 const gx=glyphState(frame,'x',[{at:timeline.sections[1].start,value:'—'},{at:c.createX,value:e.initial},{at:c.changeX,value:e.replacement}]);
 const gy=glyphState(frame,'y',[{at:timeline.sections[2].start,value:'—'},{at:c.copyStart+42,value:e.initial}]);
 return <>
  {sectionLayers(frame,timeline.sections).map(({section,opacity,textOpacity})=><div key={section.id} style={{position:'absolute',inset:0,opacity}}><Overlay frame={frame} shot={section} e={e} state={state} c={c} textAlpha={textOpacity/opacity}/></div>)}
  <div className="asset-world" style={{'--camera-cx':'540px','--camera-cy':'960px',transform:cameraTransform(camera)}}>
   <SculptedTile pose={pose.x} value={gx.value} previousValue={gx.previous} blend={gx.blend} label="Biến x" tone="coral"/>
   <SculptedTile pose={pose.y} value={gy.value} previousValue={gy.previous} blend={gy.blend} label="Biến y" tone="blue"/>
   {state.copying&&<>
    <svg className="transfer-path" viewBox="0 0 1080 1920"><defs><linearGradient id="flow"><stop stopColor="#ff6386"/><stop offset="1" stopColor="#249ef9"/></linearGradient></defs><path d={`M ${pose.x.cx} ${pose.x.cy-30} Q 540 ${pose.x.cy-355} ${pose.y.cx} ${pose.y.cy-30}`} fill="none" stroke="url(#flow)" strokeWidth="4" opacity=".2" strokeDasharray="3 14" strokeLinecap="round"/></svg>
    <ValueToken x={token.x} y={token.y} value={e.initial} p={state.copyProgress}/>
   </>}
  </div>
 </>;
}
