import React from 'react';
export function Gate({opening=0,lamp='neutral'}){
 const signal=lamp==='green'?'#2bd3a0':lamp==='red'?'#fb6481':'#bac8cf';
 return <svg viewBox="0 0 700 720" width="700" height="720" style={{overflow:'visible'}}>
  <defs>
   <linearGradient id="gate-wall" x2=".8" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#dce4ed"/></linearGradient>
   <linearGradient id="gate-glass" x2=".9" y2="1"><stop stopColor="#e9faff" stopOpacity=".94"/><stop offset=".5" stopColor="#a6dff4" stopOpacity=".8"/><stop offset="1" stopColor="#85bdf0" stopOpacity=".65"/></linearGradient>
   <linearGradient id="gate-room" x2="0" y2="1"><stop stopColor="#d0ecff"/><stop offset=".65" stopColor="#e8ddff"/><stop offset="1" stopColor="#faf4fb"/></linearGradient>
   <filter id="gate-shadow" x="-40%" y="-30%" width="180%" height="180%"><feDropShadow dx="0" dy="16" stdDeviation="17" floodColor="#3f5870" floodOpacity=".13"/></filter>
   <clipPath id="gate-opening"><rect x="181" y="159" width="338" height="450" rx="12"/></clipPath>
  </defs>
  <ellipse cx="350" cy="672" rx="292" ry="24" fill="#566776" opacity=".10"/>
  <path d="M180 580H520L636 666H66Z" fill="#f0f4f7" stroke="white" strokeWidth="4"/>
  <path d="M305 584H395L428 654H272Z" fill={opening>0?'#a7e6d8':'#d8e3eb'} opacity=".65"/>
  <rect x="177" y="154" width="346" height="453" rx="12" fill="url(#gate-room)"/>
  <g clipPath="url(#gate-opening)">
   <g transform={`translate(${-174*opening},0)`}><rect x="182" y="161" width="167" height="449" rx="15" fill="url(#gate-glass)" stroke="#ffffff" strokeWidth="5"/><path d="M201 196L290 171M201 219L328 184" stroke="white" strokeWidth="9" opacity=".5"/><rect x="324" y="330" width="10" height="78" rx="5" fill="#ffffffdd"/></g>
   <g transform={`translate(${174*opening},0)`}><rect x="351" y="161" width="167" height="449" rx="15" fill="url(#gate-glass)" stroke="#ffffff" strokeWidth="5"/><path d="M369 196L480 171M369 220L500 189" stroke="white" strokeWidth="9" opacity=".5"/><rect x="366" y="330" width="10" height="78" rx="5" fill="#ffffffdd"/></g>
  </g>
  <g filter="url(#gate-shadow)"><rect x="89" y="85" width="94" height="540" rx="35" fill="url(#gate-wall)" stroke="white" strokeWidth="5"/><rect x="517" y="85" width="94" height="540" rx="35" fill="url(#gate-wall)" stroke="white" strokeWidth="5"/><rect x="75" y="63" width="551" height="114" rx="43" fill="url(#gate-wall)" stroke="white" strokeWidth="5"/></g>
  <circle cx="350" cy="119" r="23" fill={signal} opacity=".16"/><circle cx="350" cy="119" r="12" fill={signal}/>
  <text x="350" y="33" textAnchor="middle" fontFamily="Apple Sans" fontSize="18" letterSpacing="3" fill="#8b99a3">CỔNG MINH HỌA</text>
 </svg>;
}
export function FormContext({minimum}){return <div className="age-form"><div className="form-chrome"><span>● ● ●</span><span>access.demo</span></div><h3>Kiểm tra tuổi</h3><div className="form-policy">Điều kiện trong ví dụ: đủ {minimum} tuổi</div><div className="form-field-label">TUỔI VỪA NHẬP</div><div className="form-button">Kiểm tra <span>→</span></div></div>}
export function ConditionContext({state,minimum}){return <div className="condition-bench"><div className="bench-title"><code>age &gt;= {minimum}</code></div><div className="comparator">≥</div><svg viewBox="0 0 1080 1920" className="branch-wires"><path d="M540 1130V1190Q540 1220 510 1220H320Q280 1220 280 1270" fill="none" stroke={state.result===false?'#f28c9e':'#dee4e7'} strokeWidth="6"/><path d="M540 1130V1190Q540 1220 570 1220H760Q800 1220 800 1270" fill="none" stroke={state.result===true?'#44c8a5':'#dee4e7'} strokeWidth="6"/></svg><div className={`branch-option branch-false ${state.result===false?'chosen':''}`}>Sai <span>else</span></div><div className={`branch-option branch-true ${state.result===true?'chosen':''}`}>Đúng <span>if</span></div>{state.result!==null&&<div className="comparison-result" style={{opacity:state.testProgress}}>{state.age} {state.result?'≥':'<'} {minimum} <span>→ {state.result?'ĐÚNG':'SAI'}</span></div>}</div>}
export function RuleContext({minimum}){return <div className="rule-editor"><div className="editor-title">Mỗi lần, một nhánh.</div><div className="editor-code"><div><span className="kw">if</span> (age &gt;= {minimum}) {'{'}</div><div className="chosen-code">  openGate(); <span>← mở</span></div><div>{'}'} <span className="kw">else</span> {'{'}</div><div className="muted-code">  keepClosed();</div><div>{'}'}</div></div><div className="editor-note"><span>Đúng → mở</span><span>Sai → giữ đóng</span></div></div>}
