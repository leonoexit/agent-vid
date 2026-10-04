/* Native semantic visuals. Image assets provide context only. No raster slide animation. */
(()=>{
const tl=window.StoryTimeline,P=window.PLAN,S=window.SCRIPT,world=document.getElementById('world');
const norm=s=>s.toLowerCase().normalize('NFC').match(/[\p{L}\p{N}]+/gu)||[];
function cue(id,phrase){const s=P.sections.find(s=>s.id===id),w=s.words.flatMap(w=>norm(w.w).map(token=>({token,t:w.t0}))),n=norm(phrase);let k=w.findIndex((_,i)=>n.every((x,j)=>w[i+j]?.token===x));if(k<0)throw Error('Visual phrase missing: '+phrase);return w[k].t;}
const svg=(color)=>`<svg viewBox="0 0 280 180" class="native-lamp" aria-label="Đèn minh họa trạng thái" xmlns="http://www.w3.org/2000/svg"><path class="light-beam" d="M179 71 L254 160 L139 160 Z" fill="#feee91" stroke="#2d3436" stroke-width="3" opacity="0"/><g fill="none" stroke="#2d3436" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"><path d="M53 151 L89 90 L154 33"/><path fill="${color}" d="M44 152 H111 L120 168 H35 Z"/><circle cx="89" cy="90" r="11" fill="${color}"/><path fill="${color}" d="M139 25 Q170 4 183 34 L211 67 L159 99 Z"/><path class="lamp-bulb" d="M178 84 Q193 110 203 82" fill="#e5e5e5"/></g></svg>`;
for(const[id,col]of[['desk','#ffa239'],['bed','#a594f9']])document.querySelector(`[data-entity="${id}"]`).insertAdjacentHTML('beforeend',svg(col));
const lit=cue('scene-10','chuyển thành đúng');
tl.fromTo('[data-entity="desk"] .lamp-bulb',{fill:'#e5e5e5'},{fill:'#feee91',duration:.25,immediateRender:false},lit);
tl.fromTo('[data-entity="desk"] .light-beam',{opacity:0},{opacity:1,duration:.3,immediateRender:false},lit);
function art(parent,file,cls,start,end){const x=document.createElement('img');x.className='context-art '+cls;x.src='assets/illustrations/'+file+'.png';x.alt=file==='reading-desk'?'Góc bàn đọc sách với đèn':'Bản thiết kế đèn và dụng cụ vẽ';x.style.visibility='hidden';parent.appendChild(x);tl.set(x,{visibility:'visible'},start);tl.fromTo(x,{opacity:0,y:25},{opacity:1,y:0,duration:.55,immediateRender:false},start);tl.to(x,{opacity:0,duration:.3},end-.3);tl.set(x,{visibility:'hidden'},end);return x;}
art(document.querySelector('.hero'),'reading-desk','desk-context',.25,P.sections[0].dur);
art(world,'design-plan','plan-context',cue('scene-4','bản thiết kế'),P.sections.find(s=>s.id==='scene-7').start);
const ns='http://www.w3.org/2000/svg',branches=document.createElementNS(ns,'svg');branches.classList.add('class-branches');branches.setAttribute('viewBox','0 0 860 570');world.prepend(branches);
for(const[id,section,phrase,x]of[['desk','scene-7','đèn bàn',195],['bed','scene-8','đèn ngủ',645]]){const line=document.createElementNS(ns,'path');line.setAttribute('d',`M420 168 V185 H${x} V208 m-7 -8 l7 8 l7 -8`);line.setAttribute('fill','none');line.setAttribute('stroke','#2d3436');line.setAttribute('stroke-width','4');branches.appendChild(line);const length=line.getTotalLength();gsap.set(line,{strokeDasharray:length,strokeDashoffset:length});tl.to(line,{strokeDashoffset:0,duration:.5},cue(section,phrase));}
// Semantic grouping joins the already introduced data and behavior without resetting them.
const brace=document.createElement('div');brace.className='object-brace';brace.textContent='MỘT ĐỐI TƯỢNG';world.appendChild(brace);gsap.set(brace,{opacity:0});tl.to(brace,{opacity:1,duration:.4},cue('scene-3','một đối tượng'));tl.to(brace,{opacity:0,duration:.2},P.sections.find(s=>s.id==='scene-4').start);
})();
