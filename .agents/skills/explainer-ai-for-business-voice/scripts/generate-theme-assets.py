"""Generate a theme's illustration set with Key4u gpt-image-2 and cut it into transparent PNGs.

Reads the locked art direction from theme.json ("art": prompt_style, mascot, poses, props, header), so every
image in a skill keeps the same style. Sheets are generated in parallel (~70s), then sliced:
  mascot-sheet.png (4 poses in one row, one image -> consistent character) -> assets/mascot-<pose>.png
  props-sheet.png  (3x2 grid)                                             -> assets/prop-<name>.png
  header.png       (optional title sign)                                  -> assets/<header.file>

Usage:
  python generate-theme-assets.py --theme <skill>/theme.json --out-dir <project>/assets [--only mascot,props,header]
      [--props "name: description|name: description|... (6)"]   # new props for one video, same style
The mascot is always an original design; prompts forbid logos and readable text.
Key: KEY4U_API_KEY (env var, $VIDEO_SKILL_KEYS_FILE, ~/.claude/image-api-keys.env or ~/.codex/video-keys.env).
"""
import argparse
import base64
import concurrent.futures
import importlib.util
import json
import os
import pathlib
import sys
import urllib.error
import urllib.request

API = "https://api.key4u.vn/v1/images/generations"
END = " No brand logos, no trademarks, no readable letters, no words, no numbers."


def load_key(name="KEY4U_API_KEY"):
    if os.environ.get(name):
        return os.environ[name]
    for c in [os.environ.get("VIDEO_SKILL_KEYS_FILE"), pathlib.Path.home() / ".claude" / "image-api-keys.env",
              pathlib.Path.home() / ".codex" / "video-keys.env"]:
        if c and pathlib.Path(c).exists():
            for line in pathlib.Path(c).read_text(encoding="utf8").splitlines():
                if line.startswith(name + "="):
                    return line.split("=", 1)[1].strip().strip('"')
    sys.exit(f"{name} not found")


def generate(key, prompt, dest):
    body = json.dumps({"model": "gpt-image-2", "prompt": prompt, "size": "1536x1024", "n": 1}).encode("utf8")
    req = urllib.request.Request(API, data=body, method="POST",
                                 headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    try:
        data = json.loads(urllib.request.urlopen(req, timeout=300).read())
    except urllib.error.HTTPError as e:
        return False, f"{dest.name}: HTTP {e.code} {e.read().decode('utf8', 'replace')[:200]}"
    dest.write_bytes(base64.b64decode(data["data"][0]["b64_json"]))
    return True, f"{dest.name}: ok"


def load_slicer():
    path = pathlib.Path(__file__).with_name("slice-sketch-sheets.py")
    spec = importlib.util.spec_from_file_location("slicer", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def parse_props(text):
    """'name: description|...' -> {name: description} (exactly 6)."""
    out = {}
    for part in text.split("|"):
        name, _, desc = part.partition(":")
        out[name.strip()] = desc.strip()
    if len(out) != 6:
        sys.exit("--props needs exactly 6 'name: description' items")
    return out


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser()
    ap.add_argument("--theme", required=True)
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--only", default="mascot,props,header")
    ap.add_argument("--props", help="override the theme's props for one video")
    args = ap.parse_args()
    art = json.loads(pathlib.Path(args.theme).read_text(encoding="utf8"))["art"]
    style = art["prompt_style"] + " "
    out = pathlib.Path(args.out_dir)
    out.mkdir(parents=True, exist_ok=True)
    only = set(args.only.split(","))
    props = parse_props(args.props) if args.props else art["props"]
    poses = art["poses"]

    jobs = {}
    if "mascot" in only:
        jobs["mascot-sheet.png"] = (style + "Character sheet: the SAME original character drawn 4 times in a single row, evenly spaced "
                                    f"with wide white gaps, full body each: {art['mascot']}. "
                                    + " ".join(f"Pose {i + 1}: {p}." for i, p in enumerate(poses.values())) + END)
    if "props" in only:
        jobs["props-sheet.png"] = (style + "A 3 by 2 grid of six separate isolated objects with wide white gaps between them, each centered "
                                   "in its cell: " + "; ".join(f"({i + 1}) {d}" for i, d in enumerate(props.values())) + "." + END)
    if "header" in only and art.get("header"):
        jobs["header.png"] = style + art["header"]["prompt"] + END

    key = load_key()
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(jobs) or 1) as pool:
        results = dict(zip(jobs, pool.map(lambda kv: generate(key, kv[1], out / kv[0]), jobs.items())))
    for ok, msg in results.values():
        print(msg)

    slicer = load_slicer()
    if results.get("mascot-sheet.png", (False,))[0]:
        slicer.slice_grid(out / "mascot-sheet.png", 4, 1, list(poses), "mascot-")
    if results.get("props-sheet.png", (False,))[0]:
        slicer.slice_grid(out / "props-sheet.png", 3, 2, list(props), "prop-")
    if results.get("header.png", (False,))[0]:
        slicer.cut_white(slicer.Image.open(out / "header.png")).save(out / art["header"]["file"])
        print("wrote", art["header"]["file"])
    print("Look at every cut-out on the theme background before using it (stray slivers, logos, text).")


if __name__ == "__main__":
    main()
