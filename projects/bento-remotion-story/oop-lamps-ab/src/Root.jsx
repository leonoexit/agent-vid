import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, staticFile, delayRender, continueRender, cancelRender} from 'remotion';
import {useGsapTimeline} from '@remotion/gsap';
import {buildStory} from './build-story';
import {stageMarkup} from './stage';
import data from '../project-data.json';
import '../theme.css';

const fps = 30;
export function BentoStory() {
  const [fontHandle] = useState(() => delayRender('Bento local fonts'));
  useEffect(() => {
    let alive = true;
    Promise.all([
      document.fonts.load('900 76px "BentoSerif"'),
      document.fonts.load('600 35px "BentoSans"'),
      ...Array.from(document.querySelectorAll('.bento-root img')).map(img => img.decode()),
      document.fonts.load('700 72px "BentoMono"'),
    ]).then(() => {if (alive) continueRender(fontHandle);}).catch(cancelRender);
    return () => {alive = false; continueRender(fontHandle);};
  }, [fontHandle]);
  const scope = useGsapTimeline(({scope, timeline}) => {
    // React owns this empty host; the adapter exclusively owns its descendants.
    scope.innerHTML = stageMarkup;
    buildStory({scope, timeline, script: data.script, plan: data.plan, asset: staticFile});
  });
  return <AbsoluteFill>
    <div ref={scope} className="bento-root" />
    {data.audio.map((a, i) => <Sequence key={i} from={Math.round(a.start * fps)} durationInFrames={Math.max(1, Math.ceil(a.duration * fps))} layout="none">
      <Audio src={staticFile(a.src)} volume={a.volume} />
    </Sequence>)}
  </AbsoluteFill>;
}
export const Root = () => <Composition id="BentoStory" component={BentoStory} width={1080} height={1920} fps={fps} durationInFrames={Math.ceil(data.plan.total * fps)} />;
