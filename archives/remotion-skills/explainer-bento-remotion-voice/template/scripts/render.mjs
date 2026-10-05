import fs from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia,renderStill,openBrowser} from '@remotion/renderer';
const data=JSON.parse(fs.readFileSync('src/generated.json'));
const chrome=process.env.REMOTION_BROWSER_EXECUTABLE || (fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined);
const propsArg=process.argv.find(a=>a.startsWith('--props='));
const inputProps=propsArg?JSON.parse(fs.readFileSync(propsArg.slice(8))):{};
const serveUrl=await bundle({entryPoint:path.resolve('src/index.jsx'),publicDir:path.resolve('public')});
const browser=await openBrowser('chrome',{browserExecutable:chrome});
try {
 const composition=await selectComposition({serveUrl,id:'BentoExplainer',inputProps,puppeteerInstance:browser});
 if(process.argv.includes('--stills')){
  const qaDir=process.argv.find(a=>a.startsWith('--qa-dir='))?.slice(9)||'qa';
  fs.mkdirSync(qaDir,{recursive:true});
  const requested=process.argv.find(a=>a.startsWith('--frames='));
  const frames=requested?requested.split('=')[1].split(',').map(Number):[...new Set([...data.timeline.sections.map(s=>s.start+Math.min(s.duration-1,50)),...Object.values(data.timeline.cues).flatMap(f=>[Math.max(0,f-1),f+10,f+25])])].filter(f=>f<composition.durationInFrames).sort((a,b)=>a-b);
  for(const frame of frames)await renderStill({serveUrl,composition,inputProps,frame,output:`${qaDir}/frame-${String(frame).padStart(5,'0')}.png`,imageFormat:'png',scale:.5,puppeteerInstance:browser});
  fs.writeFileSync(`${qaDir}/frames.json`,JSON.stringify(frames));console.log(`Rendered ${frames.length} QA frames.`);
 }else{
  fs.mkdirSync('renders',{recursive:true});let last=-1;const start=Date.now();
  await renderMedia({serveUrl,composition,inputProps,codec:'h264',audioCodec:'aac',crf:18,outputLocation:`renders/${data.script.slug || 'bento-explainer'}-9x16.mp4`,puppeteerInstance:browser,concurrency:4,onProgress:p=>{const n=Math.floor(p.progress*10);if(n!==last){last=n;console.log(`Render ${n*10}%`);}}});
  fs.writeFileSync('render-report.json',JSON.stringify({renderer:'Remotion 4.0.532',seconds:(Date.now()-start)/1000,width:composition.width,height:composition.height,fps:composition.fps,durationInFrames:composition.durationInFrames},null,2));
 }
}finally{await browser.close({silent:true});}
