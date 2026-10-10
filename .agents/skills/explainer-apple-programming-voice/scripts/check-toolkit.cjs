const {createRequire}=require('node:module');
const req=createRequire(process.cwd()+'/package.json');const puppeteer=req('puppeteer-core');const assert=require('node:assert/strict');
const path=require('node:path'),fs=require('node:fs');
const root=path.resolve(__dirname,'..');
const gsapFile=process.argv[2];if(!gsapFile)throw Error('Pass the existing project gsap.min.js path');
const scratch=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'apple-kit-qa-'));
(async()=>{const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox']});try{
const p=await browser.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.setViewport({width:1080,height:1920});await p.goto('file://'+root+'/assets/visual-kit.html');await p.evaluate(()=>document.fonts.ready);
await p.screenshot({path:path.join(scratch,'kit.png'),fullPage:true});
assert.equal(await p.evaluate(()=>document.querySelectorAll('#native-family .as-object svg').length),7);
await p.setContent('<style>body{margin:0}#world{position:absolute;inset:0;width:1080px;height:1920px}#bg{position:absolute;inset:0;background:#f7f8f6}#hud{position:absolute;top:1580px;width:1000px;height:176px}#value{font-size:70px}#typed{font-size:40px}#rail{position:absolute;top:700px;width:900px}#diff{position:absolute;top:900px;width:900px}</style><div id="bg"></div><div id="world"><div id="typed"></div><div id="value"></div><div id="moving"></div><button id="button">Save</button><div id="rail"></div><div id="diff"></div></div><div id="hud"></div>');
await p.addStyleTag({path:root+'/assets/apple-assets.css'});
await p.addScriptTag({path:path.resolve(gsapFile)});
await p.addScriptTag({path:root+'/assets/apple-story.js'});
await p.evaluate(()=>{const A=AppleStory,tl=window.T=gsap.timeline({paused:true});const g=id=>document.getElementById(id);
const object=A.object('folder',{tone:'violet',label:'repo'});g('moving').append(object);
A.type(tl,g('typed'),'return x * 2',1,1);A.values(tl,g('value'),[{at:0,text:'2'},{at:3,text:'3'}]);A.press(tl,g('button'),2.2);A.transfer(tl,g('moving'),{x:100,y:200},{x:600,y:200},2,.7);
const rail=A.history(['One','Two','Three']);g('rail').append(rail);[0,1,2].forEach(i=>A.historyStep(tl,rail,i,i*2));
const diff=A.diff('x = 2','x = 3');g('diff').append(diff);A.showDiff(tl,diff,3,4);
A.camera(tl,g('world'),{at:4.5,until:5.5,focus:{x:600,y:700},scale:1.1});
A.camera(tl,g('world'),{at:7,until:8,focus:{x:300,y:700},scale:1.15});
A.context(tl,g('bg'),{at:3,from:'#f7f8f6',to:'#edf7f1'});
A.caption(tl,g('hud'),{start:1,end:3,words:[{text:'Mỗi',t0:1,t1:1.5},{text:'commit',t0:1.5,t1:2.5,color:'#006b54',emphasis:true},{text:'lưu.',t0:2.5,t1:3}]});
A.caption(tl,g('hud'),{start:3,end:5,words:[{text:'Bản mới',t0:3,t1:5}]});
tl.to({}, {duration:.1},9);});
const state=async t=>{await p.evaluate(t=>{T.seek(t,false);},t);return p.evaluate(()=>({value:[...document.querySelectorAll('#value span')].filter(n=>getComputedStyle(n).visibility!=='hidden').map(n=>n.textContent).join(''),caption:[...document.querySelectorAll('.as-caption')].filter(n=>getComputedStyle(n).display!=='none').map(n=>n.textContent),world:document.querySelector('#world').style.transform,children:document.querySelectorAll('*').length,styles:[...document.querySelectorAll('body *')].map(n=>{const s=getComputedStyle(n);return [s.transform,s.opacity,s.visibility,s.display,s.backgroundColor]})}));};
assert.equal((await state(2.9)).value,'2');assert.equal((await state(3.1)).value,'3');
const times=[.01,1.6,2.4,3.2,4.8,5.8,6.5,7.8,8.8],saved=[];
for(const t of times){saved.push({t,state:await state(t),png:await p.screenshot()});}
for(const x of [...saved].reverse()){assert.deepEqual(await state(x.t),x.state);const after=await p.screenshot();const sharp=req('sharp');const a=await sharp(x.png).raw().toBuffer(),b=await sharp(after).raw().toBuffer();let changed=0,max=0;for(let i=0;i<a.length;i++){const d=Math.abs(a[i]-b[i]);if(d){changed++;max=Math.max(max,d);}}assert.ok(changed<200&&max<=32,'Pixel difference beyond tiny raster antialias tolerance at '+x.t+': '+changed+'/'+max);}
assert.deepEqual((await state(.01)).caption,[]);assert.equal((await state(1.6)).caption.length,1);assert.equal((await state(3.2)).caption.length,1);assert.deepEqual((await state(5.2)).caption,[]);
assert.equal(await p.evaluate(()=>gsap.getProperty(document.querySelector('#world'),'scale')),1.1);
await state(6.5);assert.equal(await p.evaluate(()=>gsap.getProperty(document.querySelector('#world'),'scale')),1);
assert.deepEqual(errors,[]);console.log('PASS: values, captions, camera return, 9 forward/backward computed-style and pixel comparisons (tiny raster AA tolerance), no DOM growth or browser errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
