import {progress} from './timeline.mjs';
export function checkAge(age,minimum){
 if(!Number.isInteger(age)||!Number.isInteger(minimum)||age<0||minimum<0)throw Error('Ages must be nonnegative integers');
 return age>=minimum;
}
export function gateState(frame,c,e){
 for(const k of ['ageFirst','testFirst','deny','ageSecond','testSecond','open'])if(!Number.isFinite(c[k]))throw Error(`Missing gate cue ${k}`);
 const order=['ageFirst','testFirst','deny','ageSecond','testSecond','open'];
 if(order.some((k,i)=>i&&c[k]<=c[order[i-1]]))throw Error('Gate action cues out of order');
 const second=frame>=c.ageSecond,age=frame<c.ageFirst?null:second?e.secondAge:e.firstAge;
 const tested=second?frame>=c.testSecond:frame>=c.testFirst;
 const result=age===null||!tested?null:checkAge(age,e.minimum);
 const branch=frame>=c.open?'if':frame>=c.ageSecond?null:frame>=c.deny?'else':null;
 if(checkAge(e.firstAge,e.minimum)||!checkAge(e.secondAge,e.minimum))throw Error('This two-run demonstration needs a failing age then a passing age');
 return {age,result,branch,open:frame>=c.open,openProgress:progress(frame,c.open,30),lamp:frame>=c.open?'green':branch==='else'?'red':'neutral',testProgress:tested?progress(frame,second?c.testSecond:c.testFirst,14):0};
}
