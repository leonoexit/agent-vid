/* Presentation choreography only. Own data commits in story.js; use wrappers for attached labels. */
window.CutoutChoreography=(()=>{
 function place(tl,el,{from,to,start,duration=.6,ease='power3.inOut'}){
  tl.fromTo(el,from,{...to,duration,ease,immediateRender:false},start);return el;
 }
 function uncover(tl,cover,{start,x=700,y=0,rotation=7,duration=.65}){
  return place(tl,cover,{from:{x:0,y:0,rotation:0},to:{x,y,rotation},start,duration});
 }
 function draw(tl,path,{start,duration=.5}){
  const length=path.getTotalLength();gsap.set(path,{strokeDasharray:length,strokeDashoffset:length});
  tl.fromTo(path,{strokeDashoffset:length},{strokeDashoffset:0,duration,ease:'power1.inOut',immediateRender:false},start);return path;
 }
 function reframe(tl,stage,{from,to,start,duration=.7,origin='540px 960px'}){
  gsap.set(stage,{transformOrigin:origin});return place(tl,stage,{from,to,start,duration});
 }
 function push(tl,outgoing,incoming,{start,duration=.7,width=1080,direction=1}){
  if(!(duration>0&&width>0)||![1,-1].includes(direction))throw Error('Push requires positive duration/width and direction ±1');
  tl.set(incoming,{display:'block',x:direction*width},start);
  tl.fromTo(outgoing,{x:0},{x:-direction*width,duration,ease:'power2.inOut',immediateRender:false},start);
  tl.fromTo(incoming,{x:direction*width},{x:0,duration,ease:'power2.inOut',immediateRender:false},start);
  tl.set(outgoing,{display:'none'},start+duration);
 }
 return {place,uncover,draw,reframe,push};
})();
