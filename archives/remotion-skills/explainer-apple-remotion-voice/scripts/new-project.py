"""Create a narrated vertical Apple-inspired programming explainer."""
import argparse,pathlib,shutil
root=pathlib.Path(__file__).resolve().parent.parent
p=argparse.ArgumentParser(description=__doc__);p.add_argument('directory',type=pathlib.Path);p.add_argument('--example',choices=['assignment','if-else'],default='assignment');a=p.parse_args()
if a.directory.exists():p.error('destination already exists; preserve earlier videos')
shutil.copytree(root/'assets/template',a.directory,ignore=shutil.ignore_patterns('node_modules','renders','qa','generated.json','__pycache__'))
if a.example=='if-else':
 shutil.copy2(root/'references/if-else-script.vi.json',a.directory/'script.json')
 shutil.copy2(root/'references/if-else-storyboard.md',a.directory/'storyboard.md')
print(a.directory.resolve());print('1080x1920, 30fps. Generate voice, npm ci, npm run sync, npm test, npm run stills, npm run render. Read the skill workflow for commands.')
