// QA harness pinned to Remotion 4.0.532's rendering bridge; no production code depends on these globals.
const {bundle} = require('@remotion/bundler');
const {RenderInternals, ensureBrowser} = require('@remotion/renderer');
const puppeteer = require('puppeteer-core');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
(async () => {
 const root=path.resolve(__dirname,'..');process.chdir(root);
 const data=JSON.parse(fs.readFileSync('project-data.json','utf8'));
 const bundled=await bundle({entryPoint:path.join(root,'src/index.jsx'),rootDir:root});
 const server=await RenderInternals.prepareServer({webpackConfigOrServeUrl:bundled,port:null,remotionRoot:root,offthreadVideoThreads:1,logLevel:'error',indent:false,offthreadVideoCacheSizeInBytes:null,binariesDirectory:null,forceIPv4:true,sampleRate:48000});
 let browser;
 try {
  const ensured=await ensureBrowser();
  browser=await puppeteer.launch({executablePath:ensured.path,headless:true,args:['--no-sandbox']});
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>{errors.push(String(e));console.error('PAGE',String(e));});page.on('console',m=>{if(m.type()==='error')console.error('BROWSER',m.text());});
  await page.setViewport({width:1080,height:1920,deviceScaleFactor:1});
  await page.evaluateOnNewDocument(() => {window.process={env:{NODE_ENV:'production'}};window.remotion_isMainTab=true;window.remotion_puppeteerTimeout=30000;window.remotion_initialFrame=0;window.remotion_attempt=1;window.remotion_audioEnabled=false;window.remotion_videoEnabled=true;window.remotion_inputProps='{}';window.remotion_logLevel='error';window.remotion_sampleRate=48000;});
  await page.goto(server.serveUrl,{waitUntil:'networkidle0'});
  await page.waitForFunction(()=>typeof window.remotion_setBundleMode==='function');
  await page.evaluate(duration=>window.remotion_setBundleMode({type:'composition',compositionName:'BentoStory',serializedResolvedPropsWithSchema:'{}',compositionDurationInFrames:duration,compositionFps:30,compositionHeight:1920,compositionWidth:1080}),Math.ceil(data.plan.total*30));
  await page.waitForSelector('.bento-root', {timeout:10000}).catch(async e=>{console.error(await page.evaluate(()=>({text:document.body.innerText,cancel:window.remotion_cancelledError})));throw e;});
  const seek=async frame=>{await page.evaluate(f=>window.remotion_setFrame(f,'BentoStory',1),frame);await page.waitForFunction(()=>window.remotion_renderReady===true);await page.evaluate(()=>document.fonts.ready);};
  await seek(0);
  const extra=await page.evaluate(()=>{const r=document.querySelector('.bento-root');return {commit:Number(r.dataset.commitTime)||null,samples:JSON.parse(r.dataset.operationSamples||'[]')};});
  const times=data.plan.sections.map(s=>s.start+Math.min(1,s.dur/2));
  for(const s of extra.samples)times.push(s.start-.08,(s.start+s.end)/2,s.end+.08);
  if(extra.commit)times.push(extra.commit-.08,extra.commit+.08);
  const frames=[...new Set(times.map(t=>Math.max(0,Math.min(Math.ceil(data.plan.total*30)-1,Math.round(t*30)))))].sort((a,b)=>a-b);
  const capture=async f=>{await seek(f);return await page.screenshot({type:'png'});};
  fs.mkdirSync('snapshots',{recursive:true});const records=new Map();const rasterDifferences=[];
  for(const f of frames){const b=await capture(f);records.set(f,{png:b.toString('base64'),dom:await page.$eval('.bento-root',e=>e.innerHTML)});fs.writeFileSync(`snapshots/frame-${f}.png`,b);}
  for(const f of [...frames].reverse()){
   const b=await capture(f),old=records.get(f);assert.equal(await page.$eval('.bento-root',e=>e.innerHTML),old.dom,`DOM/state differs on reverse seek at ${f}`);
   if(b.toString('base64')!==old.png){
    const diff=await page.evaluate(async(a,b)=>{
     const pixels=async src=>{const i=new Image();i.src='data:image/png;base64,'+src;await i.decode();const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const ctx=c.getContext('2d');ctx.drawImage(i,0,0);return ctx.getImageData(0,0,c.width,c.height).data;};
     const x=await pixels(a),y=await pixels(b);let max=0,changed=0,significantChanged=0,totalDelta=0;
     for(let i=0;i<x.length;i+=4){let d=0;for(let c=0;c<3;c++){const delta=Math.abs(x[i+c]-y[i+c]);d=Math.max(d,delta);totalDelta+=delta;}if(d)changed++;if(d>5)significantChanged++;max=Math.max(max,d);}return {max,changed,significantChanged,meanChannelDelta:totalDelta/(x.length/4*3)};
    },old.png,b.toString('base64'));
    rasterDifferences.push({frame:f,...diff});
    // Identical DOM can rasterize edges differently in Chromium. Bound affected area and total error, and record maxima.
    assert.ok(diff.meanChannelDelta<=.01 && diff.significantChanged<=1000,`Raster difference exceeds small edge tolerance at ${f}: ${JSON.stringify(diff)}`);
   }
  }
  if(extra.commit){
   for(const [time,expected] of [[extra.commit-.08,'False'],[extra.commit+.08,'True'],[extra.commit-.08,'False']]){
    await seek(Math.round(time*30));const state=await page.evaluate(()=>({desk:document.querySelector('#desk .state')?.textContent,bed:document.querySelector('#bed .state')?.textContent}));assert.equal(state.desk,expected);assert.equal(state.bed,'False');
   }
  }
  assert.deepEqual(errors,[]);
  const report={frames:frames.length,reverseDOMEquality:true,rasterDifferences,rasterTolerance:{maxMeanChannelDelta:.01,maxPixelsOverFiveLevels:1000},commitTime:extra.commit,modelAssertions:extra.commit?'desk False→True→False, bed remains False':'generic scaffold; no project-specific assertions',browserErrors:errors,limitations:'DOM equality and bounded raster differences test seek determinism, not pedagogy, contrast or voice alignment.'};
  fs.writeFileSync('browser-qa.json',JSON.stringify(report,null,2)+'\n');console.log(report);
 } finally {if(browser)await browser.close();await server.closeServer(true);}
})().catch(e=>{console.error(e);process.exitCode=1;});
