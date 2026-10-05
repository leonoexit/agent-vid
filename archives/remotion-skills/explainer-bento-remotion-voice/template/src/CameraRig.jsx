import React from 'react';
import {cameraTransform} from './camera.mjs';
export function CameraRig({camera,width,height,children,style={}}){
 return <div style={{position:'absolute',overflow:'hidden',width,height,...style}}><div style={{position:'absolute',left:0,top:0,transformOrigin:'0 0','--camera-cx':`${width/2}px`,'--camera-cy':`${height/2}px`,transform:cameraTransform(camera)}}>{children}</div></div>;
}
