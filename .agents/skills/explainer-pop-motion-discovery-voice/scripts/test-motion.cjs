const fs=require('fs'),os=require('os'),path=require('path'),assert=require('assert/strict'),cp=require('child_process'),pp=require('puppeteer-core');
(async()=>{
 const skill=path.resolve(__dirname,'..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'pop-motion-')),project=path.join(tmp,'fixture');
 cp.execFileSync('python3',[path.join(skill,'scripts/new-project.py'),project]);
 assert.throws(()=>cp.execFileSync('python3',[path.join(skill,'scripts/new-project.py'),project],{stdio:'pipe'}),'initializer must refuse overwrite');
 fs.writeFileSync(path.join(project,'story.js'),`document.addEventListener('DOMContentLoaded',async()=>{
 await document.fonts.ready;
 const tl=gsap.timeline({paused:true}),M=PopMotion.create(tl,document.getElementById('world'));
 document.getElementById('world').style.background='#fff064';
 const A=M.group(undefined,{x:100,y:500,width:360,height:380}),B=M.group(undefined,{x:620,y:500,width:340,height:380});
 A.id='test-a';B.id='test-b';
 const aa=Collage.backplate(A,'CHI TIẾT',20,70,{width:300,size:28});
 const bb=Collage.backplate(B,'BỐI CẢNH',20,70,{width:300,size:28});
 Collage.paperJitter(tl,aa,0,12,{seed:6});Collage.paperJitter(tl,bb,0,12,{seed:2});
 const sub=document.createElement('div');sub.className='caption';sub.id='test-caption';sub.textContent='Phụ đề giữ nguyên vị trí.';sub.style.visibility='visible';document.getElementById('captions').append(sub);
 await Promise.all([...document.images].map(i=>i.decode()));
 const home={x:0,y:0,scale:1,rotation:0},detail=PopMotion.fitRect({x:100,y:500,w:360,h:380},{x:110,y:360,w:780,h:900},1.25);
 M.frame(home,detail,{at:1,duration:1});M.frame(detail,home,{at:4,duration:1});
 M.focus([B],{at:.5,until:5.5,opacity:.3});
 M.arrange([{node:A,from:{x:100,y:500},to:{x:100,y:950,scale:.9}},{node:B,from:{x:620,y:500},to:{x:620,y:950,scale:.9}}],{at:6,duration:1});
 M.arrange([{node:A,from:{x:100,y:950,scale:.9},to:{x:100,y:500,scale:1}},{node:B,from:{x:620,y:950,scale:.9},to:{x:620,y:500,scale:1}}],{at:9,duration:1});
 window.rejected={};
 try{M.frame(home,detail,{at:1.5,duration:1})}catch(e){rejected.conflict=e.message}
 try{PopMotion.fitRect({x:0,y:0,w:0,h:1},{x:0,y:0,w:1,h:1})}catch(e){rejected.rect=e.message}
 try{PopMotion.create(tl,document.getElementById('root'))}catch(e){rejected.captions=e.message}
 tl.set({}, {},12);tl.seek(12,true).seek(0,true);Collage.restorePaperJitter();
 window.__timelines={'pop-collage':tl};window.REVIEW={duration:12};window.TEST={detail};
});`);
 const browser=await pp.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox','--allow-file-access-from-files']});
 try{
 const p=await browser.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.setViewport({width:1080,height:1920});await p.goto('file://'+project+'/index.html');await p.waitForFunction(()=>window.TEST);
 assert.deepEqual(errors,[]);
 const frame=async t=>p.evaluate(t=>{__timelines['pop-collage'].seek(t,true);const nums=e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(x=>Math.round(x*1000)/1000)};return {a:nums(document.getElementById('test-a')),b:nums(document.getElementById('test-b')),caption:nums(document.getElementById('test-caption')),alpha:+getComputedStyle(document.getElementById('test-b')).opacity,stage:getComputedStyle(document.querySelector('.pop-motion-stage')).transform,styles:[...document.querySelectorAll('[data-paper-jitter]')].map(e=>e.style.cssText)}} ,t);
 const times=[0,.7,1.5,2.5,4.5,5.7,6.5,7.5,9.5,10.5,11.5],saved=[];
 for(const t of times)saved.push(await frame(t));
 for(let i=times.length-1;i>=0;i--)assert.deepEqual(await frame(times[i]),saved[i],'reverse seek '+times[i]);
 saved.forEach(s=>assert.deepEqual(s.caption,saved[0].caption,'captions moved with camera'));
 assert.equal(saved[3].alpha,.3);assert.equal(saved[5].alpha,1);assert.equal(saved[3].a[2],450);assert.equal(saved[7].a[1],950);assert.equal(saved[9].a[1],500);
 assert(saved[3].styles.every(s=>s.includes('var(--paper-x')),'jitter binding lost');
 const rejected=await p.evaluate(()=>rejected);assert(rejected.conflict&&rejected.rect&&rejected.captions);
 await frame(7.5);await p.screenshot({path:path.join(tmp,'fixture.png')});
 }finally{await browser.close()}
 cp.execFileSync(process.execPath,[path.join(skill,'scripts/audit-readability.cjs'),project],{stdio:'pipe'});
 console.log(JSON.stringify({pass:true,checks:['initializer refuses overwrite','camera fit','group reflow','focus restore','fixed captions','reverse seeks','jitter binding','invalid/conflicting moves rejected','360-frame readability'],fixture:project},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
