/* Pop-specific staging. All moves use the caller's paused GSAP timeline. */
window.PopMotion = (() => {
  const finite = (v, name) => { if (!Number.isFinite(v)) throw Error(name+' must be finite'); return v; };
  const pose = (p={}) => ({x:finite(p.x??0,'x'),y:finite(p.y??0,'y'),scale:finite(p.scale??1,'scale'),rotation:finite(p.rotation??0,'rotation')});
  function fitRect(subject, viewport, maxScale=Infinity) {
    for (const r of [subject,viewport]) { for(const k of ['x','y','w','h']) finite(r[k],k); if(r.w<=0||r.h<=0)throw Error('Rectangles need positive dimensions'); }
    if(!(maxScale>0))throw Error('maxScale must be positive');
    const scale=Math.min(viewport.w/subject.w,viewport.h/subject.h,maxScale);
    return {x:viewport.x+viewport.w/2-(subject.x+subject.w/2)*scale,y:viewport.y+viewport.h/2-(subject.y+subject.h/2)*scale,scale,rotation:0};
  }
  function create(tl, world, {captions=document.getElementById('captions')}={}) {
    if(!tl||!world)throw Error('PopMotion needs a timeline and world element');
    if(captions&&world.contains(captions))throw Error('Keep captions outside the moving world');
    const stage=document.createElement('div');stage.className='pop-motion-stage';
    Object.assign(stage.style,{position:'absolute',inset:'0',transformOrigin:'0px 0px'});world.append(stage);
    gsap.set(stage,{x:0,y:0,scale:1,rotation:0,xPercent:0,yPercent:0});
    const windows=new WeakMap();
    function reserve(node,channel,at,duration){
      finite(at,'at');finite(duration,'duration');if(at<0||duration<=0)throw Error('Use nonnegative time and positive duration');
      const old=windows.get(node)||[];
      if(old.some(w=>w.channel===channel&&at<w.end-1e-7&&at+duration>w.at+1e-7))throw Error('Overlapping '+channel+' moves on the same carrier');
      windows.set(node,[...old,{channel,at,end:at+duration}]);
    }
    function tween(node,from,to,{at,duration=.65,ease='power3.inOut'}={}){
      if(!stage.contains(node)&&node!==stage)throw Error('Move a stage carrier, not captions or unrelated DOM');
      if(node.dataset.paperJitter)throw Error('Use an outer group for staging and an inner carrier for jitter');
      const a=pose(from),b=pose({...a,...to});if(a.scale<=0||b.scale<=0)throw Error('Scale must be positive');
      reserve(node,'transform',at,duration);
      tl.fromTo(node,{...a,xPercent:0,yPercent:0},{...b,xPercent:0,yPercent:0,duration,ease,immediateRender:false},at);
      return node;
    }
    function group(parent=stage,{x=0,y=0,width=1080,height=1920}={}){
      if(parent!==stage&&!stage.contains(parent))throw Error('Groups belong inside the stage');
      const e=document.createElement('div');e.className='pop-motion-group';e.dataset.motionGroup='true';
      Object.assign(e.style,{position:'absolute',left:'0',top:'0',width:width+'px',height:height+'px',transformOrigin:'0px 0px'});parent.append(e);
      gsap.set(e,{x,y,xPercent:0,yPercent:0,scale:1,rotation:0});return e;
    }
    function frame(from,to,options){return tween(stage,from,to,options);}
    function arrange(items,options){return items.map(i=>tween(i.node,i.from,i.to,options));}
    function focus(context,{at,until,opacity=.3,fade=.35}={}){
      if(!Array.isArray(context)||!context.length)throw Error('Provide explicit inactive context groups');
      if(!Number.isFinite(until)||until-at<2*fade||fade<=0||opacity<0||opacity>1)throw Error('Invalid focus window');
      for(const e of context){
        if(!stage.contains(e)||e.dataset.paperJitter)throw Error('Focus an outer context group inside the stage');
        reserve(e,'opacity',at,until-at);
        tl.fromTo(e,{opacity:1},{opacity,duration:fade,ease:'power2.out',immediateRender:false},at);
        tl.fromTo(e,{opacity},{opacity:1,duration:fade,ease:'power2.inOut',immediateRender:false},until-fade);
      }
    }
    return {stage,group,frame,arrange,focus};
  }
  return {create,fitRect};
})();
