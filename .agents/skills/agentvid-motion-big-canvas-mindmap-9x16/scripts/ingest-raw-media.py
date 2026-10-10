"""Ingest customer phone photos/clips into render-ready assets. Run from the project directory:
  python scripts/ingest-raw-media.py <raw dir> [--clip <file name>] [--max-clip 8] [--focus data/media-focus.json]

Photos -> <name>-full.jpg (1080x1920 focal crop), <name>-card.jpg (long side 1200) in assets/media.
Video -> <name>-still.jpg; hero -> clip.mp4 (1080x1920, 30fps/GOP15/silent) + clip-last.jpg.
Writes media.json/contact sheet/restorable clip slot; shows labels survive. Focus: {"IMG_6155.JPG": [.45,.5]}.
"""
import argparse
import hashlib
import json
import math
import pathlib
import re
import subprocess
import sys
import unicodedata

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is missing: install pillow in the managed Python env (see setup-and-brand.md).")

W, H = 1080, 1920
IMG_EXT = {".jpg", ".jpeg", ".png", ".webp"}
VID_EXT = {".mp4", ".mov", ".m4v", ".webm"}
OUT = pathlib.Path("assets/media")

def slug(name):
    stem = unicodedata.normalize("NFKD", pathlib.Path(name).stem.lower().replace("đ", "d"))
    return re.sub(r"[^a-z0-9]+", "-", stem.encode("ascii", "ignore").decode()).strip("-") or "media"

def output_names(files, previous):
    """Keep existing unique names; reserve all outputs before processing colliding source names."""
    old = {}
    for item in previous:
        path = item.get("full") or item.get("still")
        if path and re.fullmatch(r"assets/media/[a-z0-9-]+-(full|still)\.jpg", path):
            old[item["src"]] = re.sub(r"-(full|still)$", "", pathlib.Path(path).stem)
    counts = {}
    for src in files:
        base = slug(src.name)
        counts[base] = counts.get(base, 0) + 1
    names, used = {}, set()
    for src in sorted(files, key=lambda p: (p.name not in old, p.name)):
        base = old.get(src.name) or slug(src.name)
        if base in used or (src.name not in old and counts[base] > 1):
            base = f"{slug(src.name)}-{hashlib.sha256(src.name.encode('utf8')).hexdigest()[:12]}"
        if base in used:
            raise ValueError(f"media output collision for {src.name}")
        names[src.name], used = base, used | {base}
    return names

def cover_box(w, h, tw, th, fx=0.5, fy=0.5):
    """Scale factor and crop box that cover tw x th, keeping the focal point as central as the edges allow."""
    s = max(tw / w, th / h)
    sw, sh = round(w * s), round(h * s)
    x = min(max(round(sw * fx - tw / 2), 0), sw - tw)
    y = min(max(round(sh * fy - th / 2), 0), sh - th)
    return (sw, sh), (x, y, x + tw, y + th)

def cover(im, tw, th, fx=0.5, fy=0.5):
    size, box = cover_box(im.width, im.height, tw, th, fx, fy)
    return im.resize(size, Image.LANCZOS).crop(box)

def run(*cmd):
    return subprocess.run(list(cmd), capture_output=True, text=True, check=True)

def probe(src):
    info = json.loads(run("ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type,width,height",
                          "-of", "json", str(src)).stdout)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    return v["width"], v["height"], float(info["format"]["duration"])


def loudness(src):
    """Integrated LUFS of the clip's audio, None when it has none."""
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(src), "-af", "ebur128", "-f", "null", "-"],
                       capture_output=True, text=True)
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)
    return float(m[-1]) if m else None


def ingest_photo(src, focus, name=None):
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")  # phone photos carry their rotation in EXIF
    name, (fx, fy) = name or slug(src.name), focus.get(src.name, [0.5, 0.5])
    cover(im, W, H, fx, fy).save(OUT / f"{name}-full.jpg", quality=90)
    card = im.copy()
    card.thumbnail((1200, 1200), Image.LANCZOS)
    card.save(OUT / f"{name}-card.jpg", quality=90)
    return {"kind": "photo", "src": src.name, "size": [im.width, im.height],
            "orientation": "landscape" if im.width > im.height else "portrait",
            "full": f"{OUT.as_posix()}/{name}-full.jpg", "card": f"{OUT.as_posix()}/{name}-card.jpg",
            "focus": [fx, fy], "shows": None}


def crop_filter(fx, fy):
    # iw/ih are the autorotated frame; normalize its SAR before matching Pillow's square-pixel cover math.
    return (f"scale=w='round(iw*sar)':h=ih:flags=lanczos,setsar=1,"
            f"scale=w='round(iw*max({W}/iw,{H}/ih))':h='round(ih*max({W}/iw,{H}/ih))':flags=lanczos,setsar=1,"
            f"crop={W}:{H}:'min(max(round(iw*{fx}-{W}/2),0),iw-{W})':"
            f"'min(max(round(ih*{fy}-{H}/2),0),ih-{H})':exact=1,setsar=1,fps=30,format=yuv420p")


def ingest_video(src, focus, hero, max_clip, name=None):
    w, h, dur = probe(src)
    name, (fx, fy) = name or slug(src.name), focus.get(src.name, [0.5, 0.5])
    still = OUT / f"{name}-still.jpg"
    run("ffmpeg", "-v", "error", "-y", "-ss", f"{dur / 2:.2f}", "-i", str(src), "-frames:v", "1",
        "-vf", crop_filter(fx, fy), "-q:v", "2", str(still))
    lufs = loudness(src)
    item = {"kind": "video", "src": src.name, "size": [w, h], "duration": round(dur, 3), "source_lufs": lufs,
            "upscaled": h < H, "still": still.as_posix(), "focus": [fx, fy], "shows": None, "hero": hero}
    if hero:
        # a fixed short GOP lets the renderer seek any frame cheaply; the customer's phone audio is dropped
        length = min(dur, max_clip)
        run("ffmpeg", "-v", "error", "-y", "-i", str(src), "-t", f"{length:.3f}", "-vf", crop_filter(fx, fy), "-an",
            "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-g", "15", "-keyint_min", "15",
            "-sc_threshold", "0", "-movflags", "+faststart", str(OUT / "clip.mp4"))
        length = probe(OUT / "clip.mp4")[2]
        run("ffmpeg", "-v", "error", "-y", "-sseof", "-0.2", "-i", str(OUT / "clip.mp4"), "-frames:v", "1", "-q:v", "2",
            str(OUT / "clip-last.jpg"))
        item.update({"file": f"{OUT.as_posix()}/clip.mp4", "clip_duration": round(length, 3),
                     "last_frame": f"{OUT.as_posix()}/clip-last.jpg"})
    return item


def wire_clip(duration):
    """Keep a stable farm layer slot so photos-only projects can later restore the clip."""
    html = pathlib.Path("index.html")
    if not html.exists():
        return
    s = html.read_text(encoding="utf8")
    slot = "<!-- FARM_CLIP_SLOT -->"
    tag = re.search(r'<video\b(?=[^>]*\bid="clip")[^>]*></video>\n?', s)
    if tag:
        s = s.replace(tag.group(0), "" if slot in s else slot)
    if slot not in s and 'href="farm.css"' in s and '<div id="shake"' in s:
        s = s.replace('<div id="shake"', slot + '\n<div id="shake"', 1)
    if slot not in s:
        return  # other themes have no farm clip layer
    clip = (f'<video id="clip" class="layer" src="assets/media/clip.mp4" data-start="0" '
            f'data-duration="{duration:.2f}" data-track-index="2" muted playsinline></video>') if duration is not None else ""
    s = s.replace(slot, slot + clip)
    html.write_text(s, encoding="utf8")


def contact_sheet(items):
    thumbs = []
    for it in items:
        im = Image.open(it.get("full") or it.get("last_frame") or it["still"])
        im.thumbnail((270, 480))
        thumbs.append(im)
    sheet = Image.new("RGB", (270 * len(thumbs), 480), "white")
    for i, t in enumerate(thumbs):
        sheet.paste(t, (i * 270, 0))
    sheet.save(OUT / "contact-sheet.jpg", quality=85)


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("raw", type=pathlib.Path)
    ap.add_argument("--clip", help="file name of the hero clip (default: first video)")
    ap.add_argument("--max-clip", type=float, default=8.0, help="seconds of the hero clip to keep")
    ap.add_argument("--focus", default="data/media-focus.json")
    a = ap.parse_args()
    if not math.isfinite(a.max_clip) or a.max_clip <= 0:
        ap.error("--max-clip must be a positive finite number")
    OUT.mkdir(parents=True, exist_ok=True)
    fp = pathlib.Path(a.focus)
    focus = json.loads(fp.read_text(encoding="utf8")) if fp.exists() else {}
    files = sorted(p for p in a.raw.iterdir() if p.suffix.lower() in IMG_EXT | VID_EXT)
    for src, point in focus.items():
        if not isinstance(point, list) or len(point) != 2 or any(type(v) not in (int, float) or not math.isfinite(v) or not 0 <= v <= 1 for v in point):
            ap.error(f"{src}: focus must be [x, y] with finite values from 0 to 1")
    media_path = pathlib.Path("data/media.json")
    previous = json.loads(media_path.read_text(encoding="utf8")).get("items", []) if media_path.exists() else []
    names = output_names(files, previous)
    labels = {item["src"]: item.get("shows") for item in previous}
    videos = [p for p in files if p.suffix.lower() in VID_EXT]
    hero = next((p for p in videos if p.name == a.clip), videos[0] if videos else None)
    if a.clip and (hero is None or hero.name != a.clip):
        sys.exit(f"--clip {a.clip} is not a video in {a.raw}")
    items = [ingest_video(p, focus, p == hero, a.max_clip, names[p.name]) if p in videos else ingest_photo(p, focus, names[p.name]) for p in files]
    for item in items:
        item["shows"] = labels.get(item["src"])
    if not items:
        sys.exit(f"no photos or videos in {a.raw}")
    wire_clip(next((i["clip_duration"] for i in items if i.get("hero")), None))
    contact_sheet(items)
    pathlib.Path("data").mkdir(exist_ok=True)
    pathlib.Path("data/media.json").write_text(json.dumps({"items": items}, ensure_ascii=False, indent=2), encoding="utf8")
    for it in items:
        out = it.get("file") or it.get("full") or it["still"]
        print(f"{it['kind']:5} {it['src']:28} {it['size'][0]}x{it['size'][1]} -> {out}")
    if not hero:
        print("no video: the hook uses a photo (storyboard hook.bg)")
    print("next: look at assets/media/contact-sheet.jpg, fill 'shows' in data/media.json, fix focal points if a crop cuts the subject")


if __name__ == "__main__":
    main()
