import fs from 'node:fs';
import path from 'node:path';
import {compileTimeline} from '../src/timeline.mjs';
const script=JSON.parse(fs.readFileSync('script.json')),timings=JSON.parse(fs.readFileSync('timings.json'));
const timeline=compileTimeline(script,timings);
for(const s of timeline.sections){
 const file=path.resolve(s.file),root=process.cwd()+path.sep;
 if(!file.startsWith(root)||!s.file.startsWith('assets/audio/'))throw Error('Audio must live in project assets/audio');
 fs.mkdirSync(path.dirname(`public/${s.file}`),{recursive:true});fs.copyFileSync(file,`public/${s.file}`);
}
fs.writeFileSync('src/generated.json',JSON.stringify({script,timeline},null,2));
fs.writeFileSync('timing-report.json',JSON.stringify({duration:timeline.durationInFrames/timeline.fps,voice:timings.voice,method:timeline.timingMethod,spacingFrames:11*timeline.sections.length,cues:timeline.cues},null,2));
console.log(`Prepared ${timeline.sections.length} shots; ${(timeline.durationInFrames/timeline.fps).toFixed(2)} seconds.`);
