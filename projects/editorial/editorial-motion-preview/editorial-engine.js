// One paused, seekable timeline. Illustrations are SVG outlines with no texture or shading.
(() => {
  const S=window.SCRIPT, P=window.PLAN, tl=gsap.timeline({paused:true});
  document.documentElement.lang=S.language==='en'?'en':'vi';
  const en=S.language==='en', stage=document.getElementById('stage');
  const text=(tag,cls,parent,value)=>{const el=document.createElement(tag); el.className=cls; if(value!=null)el.textContent=value; parent.appendChild(el); return el;};
  const paths={
    box:'<path d="M18 36 50 18 82 36v43L50 96 18 79Z M18 36l32 18 32-18 M50 54v42 M34 27l32 18"/>',
    pin:'<path d="M73 43c0 21-23 48-23 48S27 64 27 43a23 23 0 1 1 46 0Z"/><circle cx="50" cy="43" r="8"/>',
    document:'<path d="M28 12h31l15 15v63H28Z M59 12v17h15 M38 43h26 M38 55h26 M38 67h18"/>',
    magnifier:'<circle cx="42" cy="42" r="25"/><path d="m61 61 24 24 M31 42h22 M42 31v22"/>',
    cup:'<path d="M20 34h51v35a17 17 0 0 1-17 17H37a17 17 0 0 1-17-17Z M71 40h9a11 11 0 0 1 0 22h-9 M15 91h66 M32 22c-7-9 6-12 0-20 M48 22c-7-9 6-12 0-20"/>',
    clock:'<circle cx="50" cy="50" r="34"/><path d="M50 25v27l18 11 M50 16v6 M50 78v6 M16 50h6 M78 50h6"/>',
    beaker:'<path d="M35 10h30 M39 10v31L19 81q-4 9 7 9h48q11 0 7-9L61 41V10 M29 65h43 M36 74h5 M57 81h5"/>',
    leaf:'<path d="M18 82C-2 30 44 11 85 15c5 47-24 79-67 67Z M18 82l49-49 M38 62V43 M54 46h19"/>',
    code:'<path d="m32 25-20 25 20 25 M68 25l20 25-20 25 M59 16 41 84"/>',
    lightbulb:'<path d="M32 67c0-10-14-15-14-31a32 32 0 0 1 64 0c0 16-14 21-14 31Z M34 77h32 M37 87h26 M43 96h14 M43 67V46h14v21"/>',
    arrow:'<path d="M12 50h76 M69 32l19 18-19 18"/>',
    check:'<circle cx="50" cy="50" r="35"/><path d="m29 49 14 14 28-29"/>'
  };
  const icon=(name,parent,cls='line-art')=>{
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');
    svg.setAttribute('stroke-width','2.3');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
    svg.setAttribute('aria-hidden','true');svg.classList.add(cls);svg.innerHTML=paths[name||'document'];parent.appendChild(svg);return svg;
  };
  const enter=(el,at,delay=0)=>tl.fromTo(el,{opacity:0,y:16},{opacity:1,y:0,duration:0.45,ease:'power2.out'},at+delay);
  const sections=new Map(P.sections.map(s=>[s.id,s]));
  document.getElementById('brand').textContent=S.brand||'AGENTVID';
  document.getElementById('series').textContent=S.series||(en?'FIELD NOTES':'GHI CHÚ');
  document.getElementById('topic-tag').textContent=S.tag||S.title;
  document.getElementById('edition').textContent=S.edition||(en?'ED. 001':'TẬP 001');
  function root(section,hero=false){
    const el=text('div','scene'+(hero?' hero':''),stage);
    tl.set(el,{visibility:'visible'},section.start);
    tl.fromTo(el,{opacity:0},{opacity:1,duration:0.4},section.start);
    if(section.id!=='outro'){
      tl.to(el,{opacity:0,duration:0.3},section.start+section.dur-0.3);
      tl.set(el,{visibility:'hidden'},section.start+section.dur);
    }
    return el;
  }
  function hero(id,title,subtitle,detail,art){
    const s=sections.get(id),r=root(s,true);
    enter(text('div','figure-tag',r,id==='intro'?(S.kicker||(en?'ONE CLEAR IDEA':'MỘT Ý RÕ RÀNG')):(en?'TAKEAWAY':'ĐIỀU CẦN NHỚ')),s.start,0.1);
    enter(text('h1','scene-title',r,title),s.start,0.25);
    enter(text('div','scene-subtitle',r,subtitle),s.start,0.55);
    const a=text('div','hero-art',r);icon(art,a);enter(a,s.start,0.9);
    if(detail)enter(text('div','hero-note',r,detail),s.start,1.2);
  }
  hero('intro',S.title,[S.intro.line1,S.intro.line2a,S.intro.line2b].filter(Boolean).join(' '),S.subtitle,S.intro.icon||'document');
  // Anchor to the spoken phrase, not arbitrary delays. Missing anchors fail visibly.
  const tokens=v=>(String(v).normalize('NFC').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[]);
  function cueTime(cue,section){
    if(cue.at!=null){
      if(cue.at<0||cue.at>section.dur-0.3)throw new Error(`Cue outside ${section.id}`);
      return section.start+cue.at;
    }
    const needle=tokens(cue.on),words=section.words||[];
    const spoken=words.flatMap(w=>tokens(w.w).map(token=>({token,time:w.t0})));
    // Silent previews have no word timings; distribute anchors by their position in the narration.
    const source=spoken.length?spoken:tokens(section.narration||'').map((token,i,a)=>({token,time:section.start+0.6+(section.dur-1.5)*i/a.length}));
    let occurrence=cue.occurrence||1;
    for(let i=0;i<=source.length-needle.length;i++){
      if(needle.length&&needle.every((token,j)=>token===source[i+j].token)&&!--occurrence)return source[i].time;
    }
    throw new Error(`Unmatched cue "${cue.on}" in ${section.id}`);
  }
  S.scenes.forEach((sc,i)=>{sections.get(`scene-${i+1}`).narration=sc.vo||'';});
  const diagrams=new Map();
  function diagram(w,s){
    let model=diagrams.get(w.continuity);
    if(!model){
      const wrap=text('div','content persistent-diagram',stage),row=text('div','diagram-row',wrap);
      wrap.dataset.continuity=w.continuity;
      const nodes=new Map(),edges=new Map();
      w.nodes.forEach((n,i)=>{
        const box=text('div','diagram-node',row);box.dataset.node=n.id;
        text('div','diagram-label',box,n.label);
        const value=text('div','diagram-value',box,n.value);
        if(n.detail)text('div','diagram-detail',box,n.detail);
        nodes.set(n.id,{box,value});
      });
      const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('viewBox','0 0 920 150');svg.classList.add('diagram-edges');row.appendChild(svg);
      w.edges.forEach(e=>{
        const a=w.nodes.findIndex(n=>n.id===e.from),b=w.nodes.findIndex(n=>n.id===e.to),width=920/w.nodes.length;
        const x1=(a+0.5)*width,x2=(b+0.5)*width;
        const path=document.createElementNS(svg.namespaceURI,'path');
        const direction=Math.sign(x2-x1),tip=x2-direction*12;
        path.setAttribute('d',`M${x1} 12 V85 H${tip} M${tip-direction*13} 73 L${tip} 85 L${tip-direction*13} 97`);
        path.setAttribute('pathLength','100');path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');path.setAttribute('stroke-width','2');
        svg.appendChild(path);edges.set(`${e.from}:${e.to}`,path);
      });
      const note=text('div','diagram-note',wrap,w.note||'');
      model={wrap,nodes,edges,note,end:s.start+s.dur};diagrams.set(w.continuity,model);
      tl.set(wrap,{visibility:'visible'},s.start);enter(wrap,s.start,0.4);
    }else model.end=s.start+s.dur;
    (w.events||[]).forEach(event=>{
      const at=cueTime(event,s);
      Object.entries(event.set||{}).forEach(([id,value])=>tl.set(model.nodes.get(id).value,{textContent:value},at));
      if(event.focus){
        model.nodes.forEach(({box},id)=>tl.set(box,{outlineWidth:event.focus.includes(id)?3:0},at));
      }
      if(event.note!=null)tl.set(model.note,{textContent:event.note},at);
      if(event.edge){
        const path=model.edges.get(`${event.edge.from}:${event.edge.to}`);
        tl.fromTo(path,{strokeDasharray:100,strokeDashoffset:100},{strokeDashoffset:0,duration:Math.min(0.7,s.start+s.dur-at-0.1),ease:'none'},at);
      }
    });
  }
  const widgets={
    sequence(card,w,s){
      const row=text('div','sequence'+(w.steps.length===4?' four':''),card);
      w.steps.forEach((d,i)=>{
        if(i)enter(icon('arrow',row,'sequence-arrow'),s.start,0.8+i*0.45);
        const node=text('div','sequence-node',row);
        text('div','number',node,String(i+1));icon(d.icon,node);
        text('div','sequence-title',node,d.title);if(d.text)text('div','sequence-text',node,d.text);
        enter(node,d.on?cueTime(d,s):s.start,d.on?0:0.6+i*0.6);
      });
    },
    comparison(card,w,s){
      const row=text('div','comparison',card);
      [w.left,w.right].forEach((d,i)=>{
        const col=text('div','comparison-col',row);
        text('div','small-heading',col,d.title);if(d.icon)icon(d.icon,col);
        const list=text('ul','bullet-list',col);(d.items||[]).forEach(t=>text('li','',list,t));
        if(d.total)text('div','result',col,d.total);enter(col,s.start,0.5+i*0.65);
      });
    },
    code(card,w,s){
      const panel=text('div','code-panel',card);
      text('div','code-label',panel,w.language||'CODE');
      text('pre',w.code.split('\n').length>5?'dense':'',panel,w.code);enter(panel,s.start,0.6);
      if(w.result)enter(text('div','code-result',card,w.result),w.resultOn?cueTime({on:w.resultOn},s):s.start,w.resultOn?0:2.0);
    },
    callout(card,w,s){
      const wrap=text('div','callout',card);icon(w.icon||'lightbulb',wrap);
      text('div','callout-text',wrap,w.text);if(w.detail)text('div','callout-detail',wrap,w.detail);enter(wrap,s.start,0.6);
    },
    checklist(card,w,s){
      const wrap=text('div','checklist',card);
      w.items.forEach((v,i)=>{const row=text('div','check-row',wrap);text('div','check-index',row,String(i+1));text('div','',row,v);enter(row,s.start,0.5+i*0.45);});
    },
    stat(card,w,s){
      const row=text('div','stat-row',card);
      w.items.forEach((v,i)=>{const box=text('div','stat-cell',row);text('div','stat-value',box,String(v.value));if(v.unit)text('div','stat-unit',box,v.unit);text('div','stat-label',box,v.label);enter(box,s.start,0.6+i*0.6);});
    },
    illustration(card,w,s){
      const wrap=text('figure','illustration',card),img=document.createElement('img');
      img.src=w.src;img.alt=w.alt;wrap.appendChild(img);
      if(w.caption)text('figcaption','illustration-caption',wrap,w.caption);
      enter(wrap,s.start,0.5);
    },
    diagram(card,w,s){diagram(w,s);},
    quote(card,w,s){
      const wrap=text('div','quote',card,`“${w.text}”`);if(w.author)text('div','quote-author',wrap,w.author);enter(wrap,s.start,0.6);
    }
  };
  S.scenes.forEach((sc,i)=>{
    const s=sections.get(`scene-${i+1}`),r=root(s);
    enter(text('div','figure-tag',r,`${en?'FIG.':'HÌNH'} ${String(i+1).padStart(2,'0')} / ${String(S.scenes.length).padStart(2,'0')}`),s.start,0.05);
    enter(text('h2','scene-title',r,sc.title),s.start,0.2);
    if(sc.subtitle)enter(text('div','scene-subtitle',r,sc.subtitle),s.start,0.35);
    widgets[sc.widget.kind](text('div','content',r),sc.widget,s);
    if(sc.after)enter(text('div','takeaway',r,sc.after),sc.afterOn?cueTime({on:sc.afterOn},s):s.start,sc.afterOn?0:1.8);
  });
  diagrams.forEach(model=>{tl.to(model.wrap,{opacity:0,duration:0.3},model.end-0.3);tl.set(model.wrap,{visibility:'hidden'},model.end);});
  hero('outro',S.outro.line1,S.outro.line2,S.outro.line3,S.outro.icon||'check');
  if(S.outro.credit){const c=text('div','caption-credit',stage,S.outro.credit);tl.set(c,{visibility:'hidden'},0);tl.set(c,{visibility:'visible'},sections.get('outro').start);}
  const band=document.getElementById('captions');
  P.sections.forEach(s=>{
    const chunks=[];let line=[];
    (s.words||[]).forEach(w=>{if(line.length&&line.map(x=>x.w).join(' ').length+w.w.length+1>36){chunks.push(line);line=[];}line.push(w);});
    if(line.length)chunks.push(line);
    if(chunks.length>1&&chunks.at(-1).length===1&&chunks.at(-2).length>2)chunks.at(-1).unshift(chunks.at(-2).pop());
    chunks.forEach((words,i)=>{
      const el=text('div','caption-line',band),start=Math.max(s.start,words[0].t0-0.08);
      const end=Math.min(s.start+s.dur,i+1<chunks.length?chunks[i+1][0].t0-0.08:words.at(-1).t1+0.2);
      tl.set(el,{opacity:1},start);tl.set(el,{opacity:0},end);
      words.forEach((w,j)=>{if(j)el.appendChild(document.createTextNode(' '));const word=text('span','caption-word',el,w.w);tl.set(word,{textDecoration:'underline',textUnderlineOffset:'9px'},w.t0);});
    });
  });
  tl.set({}, {}, P.total); // Retain the full audio tail when the scene is visually static.
  window.EditorialTimeline=tl;
})();
