import React from 'react';
import {Composition,AbsoluteFill,Sequence,Audio,staticFile,useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/fonts';
import data from './generated.json';
import {sectionAt} from './timeline.mjs';
import {BinarySearch} from './Trace';
import {CameraStudy} from './CameraStudy';
import {OpenCameraStudy} from './OpenCameraStudy';
import {GuidedCameraStudy} from './GuidedCameraStudy';
import {Captions} from './ui';
import './theme.css';
for(const [family,file] of [['Bento Serif','serif'],['Bento Sans','sans'],['Bento Mono','mono']])loadFont({family,url:staticFile(`assets/fonts/bento-story-${file}.woff2`),weight:'100 900'});
const Video=({visualExample, muteNarration=false})=>{const frame=useCurrentFrame(),{timeline}=data,script=visualExample?{...data.script,example:visualExample}:data.script,shot=sectionAt(timeline,frame);
 const open=script.visualMode==='camera-study'&&script.cameraLayout==='open';
 const Visual=script.visualMode==='camera-study'?(open?OpenCameraStudy:script.cameraLayout==='guided'?GuidedCameraStudy:CameraStudy):BinarySearch;
 if(visualExample&&!muteNarration)throw Error("Alternate data requires muteNarration to prevent mismatched speech.");
 return <AbsoluteFill className={`board ${open?"open-camera":""}`}>{!open&&<div className="brand">{script.brand}<span>CODE / EXPLAINED</span></div>}
  <Visual frame={frame} timeline={timeline} script={script} shot={shot} visualTest={Boolean(visualExample)}/>
  {!muteNarration&&<Captions section={shot} frame={frame}/>}
  {!open&&<div className="footer"><span>{script.topicLabel || "PROGRAMMING"}</span><span>{String(timeline.sections.indexOf(shot)+1).padStart(2,'0')} / {timeline.sections.length}</span></div>}
  <div className="progress" style={{width:`${frame/timeline.durationInFrames*100}%`}}/>
  {!muteNarration&&timeline.sections.map(s=><Sequence key={s.id} from={s.audioStart} durationInFrames={s.audioDuration} layout="none"><Audio src={staticFile(s.file)}/></Sequence>)}
 </AbsoluteFill>;};
export const Root=()=> <Composition id="BentoExplainer" component={Video} width={1080} height={1920} fps={data.timeline.fps} durationInFrames={data.timeline.durationInFrames}/>;
