import React from 'react';
import {Composition,AbsoluteFill,Sequence,Audio,staticFile,useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/fonts';
import data from './generated.json';
import {sectionAt} from './timeline.mjs';
import {Lesson} from './Lesson';
import {GateLesson} from './GateLesson';
import {Captions} from './Captions';
import './theme.css';
for(const [family,file] of [['Apple Sans','sans'],['Apple Mono','mono']])loadFont({family,url:staticFile(`assets/fonts/apple-${file}.woff2`),weight:'100 900'});
const Video=({visualExample,muteNarration=false})=>{
 const frame=useCurrentFrame(),{timeline}=data,script=visualExample?{...data.script,example:visualExample}:data.script,shot=sectionAt(timeline,frame);
 if(visualExample&&!muteNarration)throw Error('Alternate data requires muteNarration');
 const Visual=script.visualMode==='gate'?GateLesson:Lesson;
 return <AbsoluteFill className="canvas"><Visual frame={frame} timeline={timeline} script={script} shot={shot}/>
  {!muteNarration&&<Captions section={shot} frame={frame} aliases={script.captionAliases}/>}
  {!muteNarration&&timeline.sections.map(s=><Sequence key={s.id} from={s.audioStart} durationInFrames={s.audioDuration} layout="none"><Audio src={staticFile(s.file)}/></Sequence>)}
  <div className="endline"><span>CODE, MADE CLEAR.</span><span>01 / GIÁ TRỊ</span></div>
 </AbsoluteFill>;
};
export const Root=()=> <Composition id="AppleExplainer" component={Video} width={1080} height={1920} fps={data.timeline.fps} durationInFrames={data.timeline.durationInFrames}/>;
