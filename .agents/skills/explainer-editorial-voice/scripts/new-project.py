"""Copy the editorial template into a new directory; keep the installed skill immutable."""
import argparse
import json
import pathlib
import shutil

SKILL = pathlib.Path(__file__).resolve().parent.parent


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", type=pathlib.Path)
    parser.add_argument("--language", choices=["vi", "en"], default="vi")
    parser.add_argument("--voice", help="Vietnamese VieNeu preset; default: Thùy Dung")
    parser.add_argument("--brand", help="Text brand in the header; no logo is invented")
    args = parser.parse_args()
    if args.directory.exists():
        parser.error(f"directory already exists: {args.directory}")
    shutil.copytree(SKILL / "template", args.directory)
    script = json.loads((SKILL / "references" / f"script.example.{args.language}.json").read_text(encoding="utf8"))
    if args.brand:
        script["brand"] = args.brand
    (args.directory / "script.json").write_text(json.dumps(script, ensure_ascii=False, indent=2) + "\n", encoding="utf8")
    prefs = {"engine": "vieneu", "vi": args.voice or "Thùy Dung", "en": {"engine": "kokoro", "voice": "af_sarah"}}
    (args.directory / "voice.json").write_text(json.dumps(prefs, ensure_ascii=False, indent=2) + "\n", encoding="utf8")
    print(f"Project ready: {args.directory.resolve()} ({args.language})")
    print("Edit script.json, validate, generate voice, then sync and render.")


if __name__ == "__main__":
    main()
