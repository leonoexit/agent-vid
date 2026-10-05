"""Create a self-contained Bento Remotion project; never overwrite existing work."""
import argparse,json,pathlib,shutil
SKILL=pathlib.Path(__file__).resolve().parent.parent
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('directory',type=pathlib.Path)
p.add_argument('--voice',default='Hải Đăng')
p.add_argument('--speed',type=float,default=1.0)
p.add_argument('--study',choices=['camera'])
a=p.parse_args()
if a.directory.exists():p.error('directory already exists')
if not .65<=a.speed<=1.25:p.error('speed must be between 0.65 and 1.25')
shutil.copytree(SKILL/'template',a.directory,ignore=shutil.ignore_patterns('node_modules','renders','qa','build','audio','generated.json','timings.json','timing-report.json','render-report.json'))
v=json.loads((a.directory/'voice.json').read_text());v.update(vi=a.voice,speed=a.speed)
(a.directory/'voice.json').write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
if a.study=='camera':
 shutil.copy2(SKILL/'references/script.camera-study.vi.json',a.directory/'script.json')
 shutil.copy2(SKILL/'references/storyboard.camera-study.md',a.directory/'storyboard.md')
print(a.directory.resolve())
print('Starter: camera study.' if a.study=='camera' else 'Starter: Vietnamese binary search. Rewrite script.json, storyboard.md and src/Trace.jsx together for a new concept. Run TTS, npm ci, npm run sync, npm run stills, npm run render.')
