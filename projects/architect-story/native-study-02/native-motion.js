/* Native semantic operations. Layout and background movement belong to editorial-motion.js. */
window.ArchitectNative={create(timeline,record=()=>{}){
 const node=n=>{if(!n?.id)throw Error('Native operations need stable node IDs');return n;};
 const write=({destination,before,value,at})=>timeline.fromTo(node(destination),{textContent:String(before)},{textContent:String(value),duration:0,immediateRender:false},at);
 return {
  copyValue({source,destination,token,value,before,at,duration=1,from,to}){
   node(source);node(destination);node(token);
   if(before==null||value==null)throw Error('Copy requires explicit previous and copied values');
   timeline.set(token,{textContent:String(value),visibility:'visible',opacity:1},at);
   timeline.fromTo(token,from,{...to,duration,ease:'power2.inOut',immediateRender:false},at);
   write({destination,before,value,at:at+duration});timeline.set(token,{visibility:'hidden',opacity:0},at+duration);
   record(destination,at,duration,'model',`copy ${source.id} into ${destination.id}; preserve source`);
  },
  writeValue({destination,before,value,at,duration=.4}){
   if(before==null||value==null)throw Error('Write requires explicit previous and next values');
   write({destination,before,value,at});
   timeline.fromTo(destination,{backgroundColor:'transparent'},{backgroundColor:'#f8d49b',duration:duration/2,repeat:1,yoyo:true,immediateRender:false},at);
   record(destination,at,duration,'model',`write ${value} into ${destination.id}`);
  }
 };
}};
