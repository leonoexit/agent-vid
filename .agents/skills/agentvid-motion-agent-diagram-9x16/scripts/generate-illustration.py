"""Generate one isolated illustration with Key4u gpt-image-2 and cut its white background to transparency.

Use only for things the customer has no photo of and HTML/SVG cannot draw well (a ginger root, a steaming cup).
Never use it to fake a photo of the customer's own product, farm or people.

  python scripts/generate-illustration.py "<subject>" assets/media/illus-<name>.png [--style "<look>"]

The prompt = subject + style + a fixed "isolated on pure white, no text" ending. The white area connected to the
image border becomes transparent (inner whites such as glass highlights stay), then the result is cropped to its
content and scaled to fit 900 px. Key: KEY4U_API_KEY (env, $AGENTVID_KEYS_FILE, ~/.agentvid/keys.env,
~/.claude/ai-api-keys.env, ~/.claude/image-api-keys.env); KEY4U_BASE_URL optional. Needs numpy + scipy + Pillow.
"""
import argparse
import base64
import io
import json
import os
import pathlib
import sys
import urllib.error
import urllib.request

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

KEY_FILES = [os.environ.get("AGENTVID_KEYS_FILE"), pathlib.Path.home() / ".agentvid" / "keys.env",
             pathlib.Path.home() / ".claude" / "ai-api-keys.env", pathlib.Path.home() / ".claude" / "image-api-keys.env"]
STYLE = ("hand-drawn ink line illustration with a soft warm watercolor wash, rustic countryside kitchen feel, "
         "low saturation")
END = (". Single object centered, isolated on a plain pure white background, generous white margin, no shadow on "
       "the background, no brand logos, no readable letters, no words, no numbers.")


def key(name):
    if os.environ.get(name):
        return os.environ[name]
    for f in KEY_FILES:
        if f and pathlib.Path(f).exists():
            for line in pathlib.Path(f).read_text(encoding="utf8").splitlines():
                if line.strip().startswith(name + "="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None


def generate(prompt):
    k = key("KEY4U_API_KEY") or sys.exit("KEY4U_API_KEY not found (see references/setup-and-brand.md)")
    base = (key("KEY4U_BASE_URL") or "https://api.key4u.vn/v1").rstrip("/")
    body = json.dumps({"model": "gpt-image-2", "prompt": prompt, "size": "1024x1024", "n": 1}).encode("utf8")
    req = urllib.request.Request(f"{base}/images/generations", data=body, method="POST",
                                 headers={"Authorization": f"Bearer {k}", "Content-Type": "application/json"})
    try:
        data = json.loads(urllib.request.urlopen(req, timeout=300).read())
    except urllib.error.HTTPError as e:
        sys.exit(f"Key4u HTTP {e.code}: {e.read().decode('utf8', 'replace')[:200]}")
    return Image.open(io.BytesIO(base64.b64decode(data["data"][0]["b64_json"]))).convert("RGB")


def cut_white(im, threshold=232):
    """Transparent background: near-white pixels connected to the border; soft 1 px edge."""
    a = np.asarray(im).astype(int)
    labels, _ = ndimage.label(a.min(axis=2) > threshold)
    border = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))) - {0}
    alpha = Image.fromarray((~np.isin(labels, list(border)) * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(1.2))
    out = im.convert("RGBA")
    out.putalpha(alpha)
    out = out.crop(out.getbbox())
    out.thumbnail((900, 900), Image.LANCZOS)
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("subject")
    ap.add_argument("out", type=pathlib.Path)
    ap.add_argument("--style", default=STYLE)
    a = ap.parse_args()
    a.out.parent.mkdir(parents=True, exist_ok=True)
    raw = generate(f"{a.subject.rstrip('.')}. {a.style}{END}")
    raw.save(a.out.with_name(a.out.stem + "-raw.png"))
    img = cut_white(raw)
    img.save(a.out)
    print(f"{a.out} {img.size[0]}x{img.size[1]} (raw kept next to it)")


if __name__ == "__main__":
    main()
