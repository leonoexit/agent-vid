"""Slice generated sketch sheets into individual transparent PNGs.

- mascot-sheet.png -> 4 figures in a row -> mascot-<pose-name>.png
- props-sheet.png  -> 3x2 grid           -> prop-<prop-name>.png
- plank.png        -> 1 cell             -> plank-sign.png

Cells are found from the white gaps between drawings (image models rarely centre figures in equal columns;
equal cells clipped raised wings and caught neighbours' slivers). If the gaps can't be found, equal cells are used.
Each cell: white background removed by flood fill from the cell border (white areas INSIDE the drawing
stay opaque), then trimmed to the drawing's bounding box. Always eyeball the results.

Usage:
  python slice-sketch-sheets.py --dir <project>/assets \
    --poses map,magnifier,confused,cheer --props papers,cabinet,computer,shelves,web,rails
"""
import argparse
import sys
import pathlib

from PIL import Image, ImageChops, ImageDraw, ImageFilter

KEY = (255, 0, 255, 255)


def cut_white(cell: Image.Image) -> Image.Image:
    im = cell.convert("RGBA")
    w, h = im.size
    marked = im.copy()
    seeds = [(x, 0) for x in range(0, w, 12)] + [(x, h - 1) for x in range(0, w, 12)] + \
            [(0, y) for y in range(0, h, 12)] + [(w - 1, y) for y in range(0, h, 12)]
    for s in seeds:
        r, g, b, _ = marked.getpixel(s)
        if r > 225 and g > 225 and b > 225:
            ImageDraw.floodfill(marked, s, KEY, thresh=38)
    # Pixels painted with the magenta key (r=255, g=0, b=255) become transparent.
    r, g, b, _ = marked.split()
    is_key = ImageChops.multiply(ImageChops.multiply(r.point(lambda v: 255 if v == 255 else 0),
                                                     g.point(lambda v: 255 if v == 0 else 0)),
                                 b.point(lambda v: 255 if v == 255 else 0))
    mask = ImageChops.invert(is_key)
    im.putalpha(mask.filter(ImageFilter.GaussianBlur(1.2)))
    box = im.getchannel("A").point(lambda a: 255 if a > 40 else 0).getbbox()
    if box:
        pad = 8
        box = (max(0, box[0] - pad), max(0, box[1] - pad), min(w, box[2] + pad), min(h, box[3] + pad))
        im = im.crop(box)
    return im


def split_by_gaps(profile, n, min_gap=3):
    """Cut positions for n segments along one axis from an ink profile (True = column/row has ink).
    Runs of ink separated by the widest gaps win; returns None when fewer than n runs exist."""
    runs, start = [], None
    for i, ink in enumerate(profile + [False]):
        if ink and start is None:
            start = i
        elif not ink and start is not None:
            runs.append([start, i])
            start = None
    merged = []
    for r in runs:  # glue runs split by hairline gaps (antialiasing, feathers)
        if merged and r[0] - merged[-1][1] < min_gap:
            merged[-1][1] = r[1]
        else:
            merged.append(r)
    while len(merged) > n:  # merge across the narrowest remaining gap (e.g. a "?" above a head)
        k = min(range(len(merged) - 1), key=lambda j: merged[j + 1][0] - merged[j][1])
        merged[k][1] = merged.pop(k + 1)[1]
    if len(merged) < n:
        return None
    cuts = [(merged[j][1] + merged[j + 1][0]) // 2 for j in range(n - 1)]
    return [0] + cuts + [len(profile)]


def ink_profile(im, axis):
    """Per-column (axis=0) or per-row (axis=1) flag: does it contain drawing (non-near-white) pixels?"""
    g = im.convert("L").point(lambda v: 255 if v < 228 else 0)
    w, h = g.size
    line = g.resize((w, 1), Image.BOX) if axis == 0 else g.resize((1, h), Image.BOX)
    return [v > 1 for v in line.getdata()]


def slice_grid(src: pathlib.Path, cols: int, rows: int, names, prefix: str, inset: float = 0.05):
    sheet = Image.open(src).convert("RGB")
    ys = split_by_gaps(ink_profile(sheet, 1), rows) or [r * sheet.height // rows for r in range(rows + 1)]
    for r in range(rows):
        band = sheet.crop((0, ys[r], sheet.width, ys[r + 1]))
        xs = split_by_gaps(ink_profile(band, 0), cols)
        if xs is None:  # fallback: equal cells with an inset against neighbours' slivers
            cw, dx = sheet.width // cols, int(sheet.width // cols * inset)
            xs = [c * cw for c in range(cols + 1)]
            boxes = [(xs[c] + dx, 0, xs[c + 1] - dx, band.height) for c in range(cols)]
        else:
            boxes = [(xs[c], 0, xs[c + 1], band.height) for c in range(cols)]
        for c, box in enumerate(boxes):
            i = r * cols + c
            if i >= len(names):
                return
            dest = src.parent / f"{prefix}{names[i]}.png"
            cut_white(band.crop(box)).save(dest)
            print("wrote", dest.name)


def main():
    # Windows consoles default to cp1252; Vietnamese output would crash print().
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", required=True)
    ap.add_argument("--poses", default="map,magnifier,confused,cheer")
    ap.add_argument("--props", required=True, help="6 names, row-major order of the props sheet")
    args = ap.parse_args()
    d = pathlib.Path(args.dir)
    if (d / "mascot-sheet.png").exists():
        slice_grid(d / "mascot-sheet.png", 4, 1, args.poses.split(","), "mascot-")
    if (d / "props-sheet.png").exists():
        slice_grid(d / "props-sheet.png", 3, 2, args.props.split(","), "prop-")
    if (d / "plank.png").exists():
        cut_white(Image.open(d / "plank.png")).save(d / "plank-sign.png")
        print("wrote plank-sign.png")


if __name__ == "__main__":
    main()
