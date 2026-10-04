// Exercise the shipped editable study in a real browser, including arbitrary reverse seeks.
const fs=require('fs'),path=require('path'),assert=require('assert'),puppeteer=require('puppeteer-core');
(async()=>{
const [project,browserPath='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',localGsap]=process.argv.slice(2);if(!project)throw Error('Usage: node editorial-browser.cjs <new-project> [browser-executable] [local-gsap-3.14.2]');
const dir=path.resolve(project),browser=await puppeteer.launch({executablePath:browserPath,headless:true,args:['--no-sandbox','--allow-file-access-from-files']});
try{const page=await browser.newPage();await page.setViewport({width:1080,height:1920});const errors=[];page.on('pageerror',e=>errors.push(e.message));
if(localGsap){await page.setRequestInterception(true);page.on('request',r=>r.url().includes('/gsap@3.14.2/')?r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync(localGsap)}):r.continue());}
await page.goto('file://'+dir+'/editorial-study.html');await page.evaluate(()=>document.fonts.ready);assert.deepEqual(errors,[]);await page.waitForFunction(()=>!!window.StudyTimeline);
fs.mkdirSync(dir+'/editorial-review',{recursive:true});
const snapshot=async t=>{await page.evaluate(t=>{StudyTimeline.seek(t,false)},t);return page.evaluate(()=>Object.fromEntries(['question','call','input','definition','definition-body','value-token','result','observed-x','observed-y'].map(id=>{const n=document.getElementById(id),b=n.getBoundingClientRect(),s=getComputedStyle(n);return [id,{text:n.textContent,x:+b.x.toFixed(3),y:+b.y.toFixed(3),w:+b.width.toFixed(3),h:+b.height.toFixed(3),opacity:+s.opacity,visibility:s.visibility,font:s.fontSize}]})));};
const times=[0,1,2.45,3,3.65,4.3,5,6.7,8.4,9.8,14],expected={};for(const t of times){expected[t]=await snapshot(t);await page.screenshot({path:dir+'/editorial-review/t-'+t+'.png'});}
for(const t of [14,3,9.8,0,6.7,4.3,14])assert.deepEqual(await snapshot(t),expected[t],'reverse seek at '+t);
assert(expected[1].question.h>expected[3].question.h*1.8,'heading releases actual area');assert(expected[4.3].definition.h>expected[3.65].definition.h,'definition gains reading area');assert.equal(expected[5]['definition-body'].visibility,'visible');assert.equal(expected[5].result.opacity,0,'no result before execution');assert.equal(expected[6.7]['observed-x'].opacity,0,'comparison remains deferred');assert.equal(expected[9.8]['observed-y'].text,'BẢN SAO GIỮ NGUYÊNy = 10');assert(expected[9.8].result.h<expected[6.7].result.h,'result yields to proof');
assert.equal(await page.evaluate(()=>STUDY_OPS.filter(o=>o.job.includes('reading')||o.job.includes('headline')||o.job.includes('computed result makes')).every(o=>o.kind==='reframe')),true);
const overflow=await page.evaluate(()=>[...document.querySelectorAll('#study .s-node')].filter(n=>n.scrollWidth>n.clientWidth+3).map(n=>n.id));assert.deepEqual(overflow,[]);
console.log(JSON.stringify({status:'pass',seeks:times.length+7,checks:['reversible geometry','title releases space','definition expansion','deferred answers','stable result','overflow','reframe audit classification'],runtimeErrors:errors,gsapSource:localGsap?'matching local test bytes':'CDN'},null,2));
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
