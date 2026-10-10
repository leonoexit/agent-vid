"""Create an Ink project without altering an existing project."""
import argparse
import shutil
from pathlib import Path

p = argparse.ArgumentParser(description=__doc__)
p.add_argument('project', type=Path)
p.add_argument('--canvas', action='store_true', help='Start with one persistent paper and a camera path')
a = p.parse_args()
skill = Path(__file__).resolve().parents[1]
if a.project.exists():
    p.exit(1, 'Choose a new project directory; destination already exists.\n')
a.project.parent.mkdir(parents=True, exist_ok=True)
shutil.copytree(skill / 'template', a.project)
shutil.copytree(skill / 'assets', a.project / 'assets')
if a.canvas:
    shutil.copy2(skill / 'references' / 'canvas-example.json', a.project / 'script.json')
print(f'Created {a.project}. Replace script.json with the requested topic and audience before production.')
