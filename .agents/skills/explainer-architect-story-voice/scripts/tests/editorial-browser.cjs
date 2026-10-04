const fs=require('fs'),path=require('path'),assert=require('assert'),puppeteer=require('puppeteer-core');
(async()=>{
 const dir=path.resolve(process.argv[2]);
 const http=require('http');
 const server=http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const f=path.resolve(dir,'.'+pathname);if(!f.startsWith(dir+path.sep)){res.writeHead(403);return res.end();}try{const raw=fs.readFileSync(f);res.setHeader('Content-Type',({'.css':'text/css','.js':'text/javascript','.ttf':'font/ttf','.html':'text/html'}[path.extname(f)]||'application/octet-stream'));res.end(raw);}catch{res.writeHead(404);res.end();}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url='http://127.0.0.1:'+server.address().port;
 const b=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox','--allow-file-access-from-files']});
 try{
  const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.setViewport({width:1080,height:1920});
  await p.goto(url+'/editorial-study.html',{waitUntil:'domcontentloaded',timeout:15000});await p.evaluate(async()=>{await Promise.race([document.fonts.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('Fonts did not load')),10000))]);return true;});assert.deepEqual(errors,[]);
  const ids=['headline','source','source-value','destination','destination-value','token','result','evidence','assignment','update','copy-note'];
  const snap=async t=>{await p.evaluate(t=>{StudyTimeline.pause().seek(t,false);},t);return p.evaluate(ids=>Object.fromEntries(ids.map(id=>{const n=document.getElementById(id),b=n.getBoundingClientRect(),s=getComputedStyle(n);return [id,{text:n.textContent,rect:[b.x,b.y,b.width,b.height].map(x=>+x.toFixed(3)),opacity:s.opacity,visibility:s.visibility,background:s.backgroundColor}]})),ids);};
  const times=[0,2,3.5,4.49,4.5,5.1,5.69,5.71,6.4,8.5,8.99,9.01,10.8,12.4,13.4,17.5],expected={};
  fs.mkdirSync(dir+'/snapshots',{recursive:true});
  for(const t of times){expected[t]=await snap(t);await p.screenshot({path:dir+`/snapshots/study-${t}.png`});}
  for(const t of [...times].reverse())assert.deepEqual(await snap(t),expected[t],'reverse seek '+t);
  assert.equal(expected[5.69]['destination-value'].text,'?');assert.equal(expected[5.71]['destination-value'].text,'10');assert.equal(expected[5.71]['source-value'].text,'10');
  assert.equal(expected[8.99]['source-value'].text,'10');assert.equal(expected[9.01]['source-value'].text,'20');assert.equal(expected[9.01]['destination-value'].text,'10');
  assert.equal(expected[8.5].result.visibility,'hidden');assert.equal(expected[10.8].result.visibility,'visible');
  const before=await snap(6.4);await p.evaluate(()=>document.getElementById('background-toggle').click());assert.deepEqual(await snap(6.4),before,'background cannot carry native state or layout');
  const ops=await p.evaluate(()=>STUDY_OPS);assert.equal(ops.filter(o=>o.kind==='model').length,2);assert(ops.filter(o=>o.id==='result'||o.id==='evidence').every(o=>o.kind!=='model'));
  await p.screenshot({path:dir+'/snapshots/background-hidden.png'});
  if(fs.existsSync(dir+'/project-data.js')){await p.goto(url+'/index.html');await p.evaluate(async()=>{await Promise.race([document.fonts.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('Fonts did not load')),10000))]);return true;});await p.evaluate(()=>{StoryTimeline.seek(30,false);StoryTimeline.seek(12,false)});}
  assert.deepEqual(errors,[]);
  const result={status:'pass',studySeeks:times.length*2,checks:['copy commits on arrival','copy preserves source','write changes only x','result deferred','reverse text/geometry','background-hidden equivalence','model/reframe distinction','new project fixture loads'],runtimeErrors:errors};
  fs.writeFileSync(dir+'/study-qa.json',JSON.stringify(result,null,2)+'\n');console.log(result);
 }finally{await b.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e);process.exit(1)});
