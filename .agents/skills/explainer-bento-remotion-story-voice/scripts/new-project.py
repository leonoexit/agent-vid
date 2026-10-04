"""Create a programming bento-story project without overwriting existing work."""
import argparse
import json
import pathlib
import shutil
import subprocess
import sys

SKILL = pathlib.Path(__file__).resolve().parent.parent


def main():
    defaults = json.loads((SKILL / "theme.json").read_text())["voice"]
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("directory", type=pathlib.Path)
    p.add_argument("--language", choices=["vi", "en"], default="vi")
    p.add_argument("--voice", default=defaults["vi"])
    p.add_argument("--speed", type=float, default=defaults["speed"])
    p.add_argument("--brand")
    args = p.parse_args()
    if args.directory.exists():
        p.error("directory already exists")
    if not .65 <= args.speed <= 1.25:
        p.error("--speed must be between 0.65 and 1.25")
    shutil.copytree(SKILL / "template", args.directory, ignore=shutil.ignore_patterns("node_modules", "public", "build", "renders", "snapshots"))
    shutil.copytree(SKILL / "licenses/fonts", args.directory / "licenses/fonts")
    shutil.copyfile(SKILL / 'references/storyboard.example.md', args.directory / 'storyboard.md')
    script = json.loads((SKILL / "references" / f"script.example.{args.language}.json").read_text())
    if args.brand:
        script["brand"] = args.brand
    (args.directory / "script.json").write_text(json.dumps(script, ensure_ascii=False, indent=2) + "\n")
    voice = {**defaults, "vi": args.voice, "speed": args.speed}
    (args.directory / "voice.json").write_text(json.dumps(voice, ensure_ascii=False, indent=2) + "\n")
    subprocess.run([sys.executable, str(SKILL / "scripts/sync-narration.py"), "--project", str(args.directory), "--music-only", "--no-bgm"], check=True)
    print("Project ready:", args.directory.resolve())
    print("Run npm ci, then npm run studio / npm run check / npm run render in that directory.")
    print("Layout is a trace scaffold. Read composition-grammar.md and author the visual transformations before voice/render; generated images are optional.")


if __name__ == "__main__":
    main()
