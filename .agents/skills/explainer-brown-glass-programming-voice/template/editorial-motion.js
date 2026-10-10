/* Noir editorial reflow. Opt-in DOM/GSAP helpers; narration and model commits remain project-owned. */
(function(root){'use strict';
 function create(timeline,record=()=>{}){
  function reflow({at,duration=.8,tracks,job}){
   if(!Number.isFinite(at)||at<0||!Number.isFinite(duration)||duration<=0||!tracks?.length)throw Error('Editorial reflow needs valid time, duration and tracks');
   tracks.forEach(({node,from,to})=>{
    if(!node?.id||!from||!to)throw Error('Editorial track needs a stable DOM id and explicit from/to states');
    for(const key of Object.keys(to))if(!(key in from))throw Error('Missing reversible start value for '+key);
    // Explicit states prevent call order or a previously visited scene becoming the starting geometry.
    timeline.fromTo(node,from,{...to,duration,ease:'power2.inOut',immediateRender:false},at);
    record(node,at,duration,'reframe',job);
   });
  }
  return {
   yieldTitle: spec=>reflow({...spec,job:spec.job||'headline yields reading area to evidence'}),
   focusWindow: spec=>reflow({...spec,job:spec.job||'selected definition takes reading priority'}),
   resultToEvidence: spec=>reflow({...spec,job:spec.job||'computed result makes room for comparison'})
  };
 }
 root.NoirEditorial={create};
})(typeof window==='undefined'?globalThis:window);
