"""Tests for the raw-media ingest (focal cover crop, clip wiring, end-to-end on synthetic media) and the
illustration background cut.

Run: python -m unittest discover -s scripts/tests   (needs ffmpeg, numpy, scipy, Pillow)
"""
import importlib.util
import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path

from PIL import Image

SCRIPTS = Path(__file__).resolve().parents[1]


def load(name):
    spec = importlib.util.spec_from_file_location(name.replace("-", "_"), SCRIPTS / f"{name}.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


ingest = load("ingest-raw-media")
illus = load("generate-illustration")


class CoverBox(unittest.TestCase):
    def test_landscape_photo_keeps_focal_point_and_clamps_to_edges(self):
        (sw, sh), box = ingest.cover_box(2560, 1440, 1080, 1920, 0.5, 0.5)
        self.assertEqual(sh, 1920)
        self.assertEqual(box[2] - box[0], 1080)
        self.assertAlmostEqual((box[0] + 540) / sw, 0.5, places=2)
        _, left = ingest.cover_box(2560, 1440, 1080, 1920, 0.0, 0.5)
        self.assertEqual(left[0], 0)  # a focal point at the edge cannot push the crop outside the image
        _, right = ingest.cover_box(2560, 1440, 1080, 1920, 1.0, 0.5)
        self.assertEqual(right[2], sw)


class CutWhite(unittest.TestCase):
    def test_border_white_is_transparent_inner_white_stays(self):
        im = Image.new("RGB", (200, 200), "white")
        for x in range(60, 140):
            for y in range(60, 140):
                inner = 90 <= x < 110 and 90 <= y < 110
                im.putpixel((x, y), (255, 255, 255) if inner else (200, 120, 30))
        out = illus.cut_white(im)
        self.assertTrue(80 <= out.size[0] <= 90, out.size)  # cropped to the object (+ the soft edge)
        self.assertLess(out.getpixel((0, 0))[3], 128)  # corner area is background
        cx, cy = out.size[0] // 2, out.size[1] // 2
        self.assertEqual(out.getpixel((cx, cy))[3], 255)  # enclosed white (a glass highlight) is kept


class IngestEndToEnd(unittest.TestCase):
    def test_photo_and_clip_become_render_ready_and_index_is_wired(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp = Path(tmp)
            raw = tmp / "raw"
            raw.mkdir()
            Image.new("RGB", (1600, 900), (120, 160, 60)).save(raw / "field.jpg")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "testsrc=size=720x1280:rate=25",
                            "-f", "lavfi", "-i", "anullsrc", "-t", "3", "-shortest", str(raw / "pour.mp4")], check=True)
            proj = tmp / "proj"
            proj.mkdir()
            (proj / "index.html").write_text('<div>\n<video id="clip" class="layer" src="assets/media/clip.mp4" '
                                             'data-start="0" data-duration="8" muted></video>\n</div>', encoding="utf8")
            subprocess.run(["python", str(SCRIPTS / "ingest-raw-media.py"), str(raw), "--max-clip", "2"],
                           cwd=proj, check=True, capture_output=True)
            media = json.loads((proj / "data" / "media.json").read_text(encoding="utf8"))
            kinds = sorted(i["kind"] for i in media["items"])
            self.assertEqual(kinds, ["photo", "video"])
            self.assertEqual(Image.open(proj / "assets/media/field-full.jpg").size, (1080, 1920))
            probe = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate",
                                    "-of", "json", str(proj / "assets/media/clip.mp4")], capture_output=True, text=True)
            streams = json.loads(probe.stdout)["streams"]
            self.assertEqual([s["codec_type"] for s in streams], ["video"])  # phone audio dropped
            self.assertEqual((streams[0]["width"], streams[0]["height"], streams[0]["r_frame_rate"]), (1080, 1920, "30/1"))
            self.assertIn('data-duration="2.00"', (proj / "index.html").read_text(encoding="utf8"))
            self.assertTrue((proj / "assets/media/clip-last.jpg").exists())

    def test_no_video_removes_the_clip_element(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp = Path(tmp)
            (tmp / "raw").mkdir()
            Image.new("RGB", (900, 1600), "orange").save(tmp / "raw" / "jar.png")
            (tmp / "index.html").write_text('<a>\n<video id="clip" data-duration="8"></video>\n</a>', encoding="utf8")
            subprocess.run(["python", str(SCRIPTS / "ingest-raw-media.py"), str(tmp / "raw")], cwd=tmp, check=True,
                           capture_output=True, env={**os.environ, "PYTHONIOENCODING": "utf-8"})
            self.assertNotIn("<video", (tmp / "index.html").read_text(encoding="utf8"))


if __name__ == "__main__":
    unittest.main()
