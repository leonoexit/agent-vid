"""Create an unfinished topic-neutral Cutout scaffold, or an explicit technical example."""
import argparse
import shutil
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('project', type=Path)
    parser.add_argument('--example', choices=['cache'], help='Copy the cache technical example, not a production design benchmark.')
    args = parser.parse_args()
    if args.project.exists():
        parser.error('Destination already exists; choose a new project.')
    skill = Path(__file__).resolve().parents[1]
    source = skill / ('examples/cache-technical' if args.example else 'template')
    shutil.copytree(source, args.project)
    if args.example:
        print('Created cache TECHNICAL EXAMPLE:', args.project, '— use narration sync before opening index.html.')
    else:
        print('Created AUTHORING DRAFT:', args.project, '— author script, shot score, assets and story.js; validation/rendering is intentionally blocked until then.')

if __name__ == '__main__':
    main()
