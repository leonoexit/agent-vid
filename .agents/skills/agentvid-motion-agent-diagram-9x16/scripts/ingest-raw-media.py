"""Ingest a folder of raw customer media (phone photos + phone clips) into render-ready assets.

Run from the project directory:
  python scripts/ingest-raw-media.py <raw dir> [--clip <file name>] [--max-clip 8] [--focus data/media-focus.json]

Photos -> assets/media/<name>-full.jpg  1080x1920 cover crop around a focal point (full-bleed scenes, Ken Burns)
          assets/media/<name>-card.jpg  long side 1200, original aspect (cards, polaroids, frames)
Videos -> assets/media/<name>-still.jpg a middle frame, usable like a photo
The hero clip (--clip, else the first video) -> assets/media/clip.mp4: 1080x1920 cover crop, 30 fps CFR, GOP 15,
          no audio, at most --max-clip seconds (seek-safe for HyperFrames) + assets/media/clip-last.jpg (holds the
          last frame after the clip ends). index.html's <video id="clip"> gets the real duration, or is removed
          when there is no video at all.
Also writes data/media.json (sizes, orientation, loudness, outputs, "shows": null for you to fill) and
assets/media/contact-sheet.jpg. Focal points: {"IMG_6155.JPG": [0.45, 0.5]} (x, y in 0..1, default centre).
Customer media keeps its owner's rights: assets/raw and assets/media stay out of git.
"""
import argparse
import json
import pathlib
import re
import subprocess
import sys

from PIL import Image, ImageOps

W, H = 1080, 1920
IMG_EXT = {".jpg", ".jpeg", ".png", ".webp"}
VID_EXT = {".mp4", ".mov", ".m4v", ".webm"}
OUT = pathlib.Path("assets/media")


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", pathlib.Path(name).stem.lower()).strip("-")


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


def ingest_photo(src, focus):
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")  # phone photos carry their rotation in EXIF
    name, (fx, fy) = slug(src.name), focus.get(src.name, [0.5, 0.5])
    cover(im, W, H, fx, fy).save(OUT / f"{name}-full.jpg", quality=90)
    card = im.copy()
    card.thumbnail((1200, 1200), Image.LANCZOS)
    card.save(OUT / f"{name}-card.jpg", quality=90)
    return {"kind": "photo", "src": src.name, "size": [im.width, im.height],
            "orientation": "landscape" if im.width > im.height else "portrait",
            "full": f"{OUT.as_posix()}/{name}-full.jpg", "card": f"{OUT.as_posix()}/{name}-card.jpg",
            "focus": [fx, fy], "shows": None}


def crop_filter(fx, fy):
    return (f"scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,"
            f"crop={W}:{H}:(iw-{W})*{fx}:(ih-{H})*{fy},fps=30,format=yuv420p")


def ingest_video(src, focus, hero, max_clip):
    w, h, dur = probe(src)
    name, (fx, fy) = slug(src.name), focus.get(src.name, [0.5, 0.5])
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
    """Set the real clip length on <video id="clip"> in index.html, or drop the element when there is no clip."""
    html = pathlib.Path("index.html")
    if not html.exists():
        return
    s = html.read_text(encoding="utf8")
    tag = re.search(r'<video id="clip"[^>]*></video>\n?', s)
    if not tag:
        return
    if duration is None:
        s = s.replace(tag.group(0), "")
    else:
        s = s.replace(tag.group(0), re.sub(r'data-duration="[^"]*"', f'data-duration="{duration:.2f}"', tag.group(0)))
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
    OUT.mkdir(parents=True, exist_ok=True)
    fp = pathlib.Path(a.focus)
    focus = json.loads(fp.read_text(encoding="utf8")) if fp.exists() else {}
    files = sorted(p for p in a.raw.iterdir() if p.suffix.lower() in IMG_EXT | VID_EXT)
    videos = [p for p in files if p.suffix.lower() in VID_EXT]
    hero = next((p for p in videos if p.name == a.clip), videos[0] if videos else None)
    if a.clip and (hero is None or hero.name != a.clip):
        sys.exit(f"--clip {a.clip} is not a video in {a.raw}")
    items = [ingest_video(p, focus, p == hero, a.max_clip) if p in videos else ingest_photo(p, focus) for p in files]
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
