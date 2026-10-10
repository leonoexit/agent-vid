#!/usr/bin/env node
// Run from the repository root. Uses the existing puppeteer-core and local Chrome.
const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url'),{createRequire}=require('node:module');
async function main(){
 const [input,prefix]=process.argv.slice(2);
 if(!input||!prefix)throw Error('Usage: node export-cover.cjs <cover.html> <output-prefix>');
 const source=path.resolve(input),out=path.resolve(prefix);
 if(!fs.existsSync(source))throw Error('Missing cover HTML: '+source);
 const req=createRequire(path.join(process.cwd(),'package.json'));
 const puppeteer=req('puppeteer-core');
 const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox']});
 try{
 const page=await browser.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',r=>errors.push(r.url()+': '+r.failure()?.errorText));
 await page.setViewport({width:1080,height:1920,deviceScaleFactor:1});
 await page.goto(pathToFileURL(source).href,{waitUntil:'load'});
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
 const issues=await page.evaluate(()=>{
 const issues=[];const frame=document.querySelector('#cover');
 if(!frame)return ['Missing #cover'];
 const r=frame.getBoundingClientRect();if(r.x!==0||r.y!==0||r.width!==1080||r.height!==1920)issues.push('#cover must be 1080×1920 at (0,0)');
 const nodes=[...document.querySelectorAll('[data-cover-critical]')];if(!nodes.length)issues.push('Mark critical cover content for bounds checks');
 for(const n of nodes){const b=n.getBoundingClientRect();if(b.x<0||b.y<0||b.right>1080||b.bottom>1920)issues.push('Critical content outside portrait: '+n.tagName);if(n.scrollWidth>n.clientWidth+2||n.scrollHeight>n.clientHeight+2)issues.push('Critical content overflow: '+n.tagName);}
 return issues;
 });
 if(errors.length||issues.length)throw Error([...errors,...issues].join('\n'));
 fs.mkdirSync(path.dirname(out),{recursive:true});
 for(const [suffix,type,clip] of [
 ['1080x1920.png','png',{x:0,y:0,width:1080,height:1920}],
 ['1080x1920.jpg','jpeg',{x:0,y:0,width:1080,height:1920}],
 ['crop-square.jpg','jpeg',{x:0,y:420,width:1080,height:1080}],
 ['crop-4x5.jpg','jpeg',{x:0,y:285,width:1080,height:1350}]]){
 const dest=out+'-'+suffix;
 await page.screenshot({path:dest,type,...(type==='jpeg'?{quality:94}:{}),clip});console.log(dest);
 }
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
