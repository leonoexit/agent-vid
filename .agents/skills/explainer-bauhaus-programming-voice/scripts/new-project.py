"""Create a fresh Bauhaus project; the bundled model is a remainder example."""
import argparse,json,pathlib,shutil

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('project',type=pathlib.Path);p.add_argument('--language',choices=['vi','en'],default='vi');a=p.parse_args()
 if a.project.exists():p.error('destination already exists; choose a new directory')
 skill=pathlib.Path(__file__).resolve().parents[1]
 shutil.copytree(skill/'template',a.project)
 shutil.copyfile(skill/f'references/script.example.{a.language}.json',a.project/'script.json')
 print(f'Created {a.project}. Adapt script.json, storyboard.md and story.js together for a new topic.')
if __name__=='__main__':main()
