"""Diagnose encoded cadence and authored section boundaries; not a smoothness verdict."""
import argparse,json,pathlib,re,subprocess,tempfile
p=argparse.ArgumentParser(description=__doc__);p.add_argument('video');p.add_argument('--plan',default='src/generated.json');p.add_argument('--out',default='qa/motion-audit.json');a=p.parse_args()
video=pathlib.Path(a.video).resolve();data=json.loads(pathlib.Path(a.plan).read_text());fps=data['timeline']['fps']
r=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','frame=best_effort_timestamp_time','-of','json',str(video)]))
ts=[float(f['best_effort_timestamp_time']) for f in r['frames']];gaps=[b-a for a,b in zip(ts,ts[1:])]
with tempfile.TemporaryDirectory() as temp:
 stats=pathlib.Path(temp)/'differences.txt'
 subprocess.run(['ffmpeg','-v','error','-i',str(video),'-an','-vf',f'scale=216:384,tblend=all_mode=difference,signalstats,metadata=print:file={stats}','-f','null','-'],check=True)
 frame=-1;diffs={}
 for line in stats.read_text().splitlines():
  if line.startswith('frame:'):frame=int(re.search(r'frame:(\d+)',line).group(1))+1
  if line.startswith('lavfi.signalstats.YAVG='):diffs[frame]=float(line.split('=')[-1])
report={'frames':len(ts),'expectedFrames':data['timeline']['durationInFrames'],'fps':fps,'minGap':min(gaps),'maxGap':max(gaps),'irregularGaps':sum(abs(g-1/fps)>1e-5 for g in gaps),'sectionBoundaries':[{'frame':s['start'],'lumaDifference':diffs.get(s['start']), 'neighbors':{str(f):diffs.get(f) for f in range(s['start']-2,s['start']+3)}} for s in data['timeline']['sections'][1:]],'limits':'Regular encoded cadence does not exclude playback drops. Pixel difference cannot distinguish an intentional cut from an unintended discontinuity.'}
out=pathlib.Path(a.out);out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
