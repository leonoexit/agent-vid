"""Create an industrial technical-grid programming project without overwriting work."""
import argparse
import json
import pathlib
import shutil

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
    shutil.copytree(SKILL / "template", args.directory)
    shutil.copytree(SKILL / "licenses/fonts", args.directory / "licenses/fonts")
    script = json.loads((SKILL / "references" / f"script.example.{args.language}.json").read_text())
    if args.brand:
        script["brand"] = args.brand
    (args.directory / "script.json").write_text(json.dumps(script, ensure_ascii=False, indent=2) + "\n")
    voice = {**defaults, "vi": args.voice, "speed": args.speed}
    (args.directory / "voice.json").write_text(json.dumps(voice, ensure_ascii=False, indent=2) + "\n")
    print("Project ready:", args.directory.resolve())


if __name__ == "__main__":
    main()
