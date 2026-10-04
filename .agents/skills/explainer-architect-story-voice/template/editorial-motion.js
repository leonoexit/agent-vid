/* Explicit, seekable geometry. These operations reframe reading; never count as model execution. */
window.ArchitectEditorial={create(timeline,record=()=>{}){
 const op=(name,{at,duration=.8,tracks})=>{for(const {node,from,to} of tracks){
 if(!node?.id)throw Error('Editorial tracks need stable node IDs');
 timeline.fromTo(node,from,{...to,duration,ease:'power2.inOut',immediateRender:false},at);
 record(node,at,duration,'reframe',name);
 }};
 return {reframe:spec=>op('native reading region changes geometry',spec),plateToExample:spec=>op('illustration yields reading area to native example',spec),focusWindow:spec=>op('inspect image within a native crop window',spec),resultToEvidence:spec=>op('committed result opens into evidence comparison',spec)};
}};
