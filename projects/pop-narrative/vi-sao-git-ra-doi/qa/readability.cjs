const fs=require('fs'),path=require('path'),pp=require('puppeteer-core');
(async()=>{
 const root=path.resolve(__dirname,'..'),old=process.argv.includes('--old');
 const browser=await pp.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox','--allow-file-access-from-files']});
 try{
 const page=await browser.newPage();await page.setViewport({width:1080,height:1920});
 if(old){await page.setRequestInterception(true);page.on('request',r=>r.url().endsWith('/story.js')?r.respond({contentType:'application/javascript',body:fs.readFileSync(root+'/revisions/v1/story.js','utf8')}):r.continue());}
 await page.goto('file://'+root+'/index.html');await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()))});
 const report=await page.evaluate(()=>{
 const timeline=__timelines['pop-collage'],duration=REVIEW.duration,failures=new Map(),imageCandidates=new Map();
 const selector='.display,.mono,.backplate-copy,.patch span,.evidence-kicker,.evidence strong,.commit-meta,.evidence-note,.portrait-print>div,.caption';
 const texts=[...document.querySelectorAll(selector)],plates=[...document.querySelectorAll('.backplate')],photos=[...document.querySelectorAll('#world>.photo,.scene>.photo,.portrait-print')];
 const shown=e=>{for(let a=e;a&&a!==document;a=a.parentElement){let c=getComputedStyle(a);if(c.visibility==='hidden'||c.display==='none'||+c.opacity<.15)return false;}return true;};
 const box=r=>({x:r.left,y:r.top,w:r.width,h:r.height});
 const rects=e=>{const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),out=[];while(walker.nextNode()){if(!walker.currentNode.textContent.trim())continue;let r=document.createRange();r.selectNodeContents(walker.currentNode);out.push(...[...r.getClientRects()].map(box));}return out;};
 const hit=(a,b)=>Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>3&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>3;
 const name=e=>(e.textContent.trim().slice(0,80)||e.alt||e.className).replace(/\s+/g,' ');
 const record=(map,key,t)=>{const r=map.get(key)||{pair:key,first:t,last:t,frames:0};r.last=t;r.frames++;map.set(key,r);};
 for(let f=0;f<Math.ceil(duration*30);f++){
 const t=f/30;timeline.seek(t,true);
 const active=texts.filter(shown).map(e=>({e,r:rects(e)}));
 const p=plates.filter(shown).map(e=>({e,r:box(e.getBoundingClientRect())}));
 const images=photos.filter(shown).map(e=>({e,r:box(e.getBoundingClientRect())}));
 for(let i=0;i<active.length;i++){
 const a=active[i];
 for(let j=i+1;j<active.length;j++){const b=active[j];if(a.e.contains(b.e)||b.e.contains(a.e))continue;if(a.r.some(x=>b.r.some(y=>hit(x,y))))record(failures,'text: '+name(a.e)+' / '+name(b.e),t);}
 for(const b of p)if(!b.e.contains(a.e)&&a.r.some(x=>hit(x,b.r)))record(failures,'paper: '+name(a.e)+' / '+name(b.e),t);
 for(const b of images)if(!b.e.contains(a.e)&&a.r.some(x=>hit(x,b.r)))record(imageCandidates,'image bounds: '+name(a.e)+' / '+name(b.e),t);
 }
 }
 return {frames:Math.ceil(duration*30),fps:30,failures:[...failures.values()],imageCandidates:[...imageCandidates.values()],limits:'Text/paper intersections are conservative geometric checks. Image bounds are manual-review candidates, not alpha-aware occlusion verdicts.'};
 });
 fs.writeFileSync(__dirname+(old?'/readability-v1.json':'/readability.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(report.failures.length&&!old)process.exitCode=1;
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
