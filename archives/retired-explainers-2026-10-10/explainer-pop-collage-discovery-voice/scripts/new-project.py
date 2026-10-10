"""Create a neutral Pop Collage authoring draft without overwriting user work."""
import argparse,shutil
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('project',type=Path)
a=p.parse_args()
if a.project.exists(): p.error('Destination already exists.')
shutil.copytree(Path(__file__).resolve().parents[1]/'template',a.project)
print('Created draft:',a.project,'— author script, sources, assets and story.js before rendering.')
