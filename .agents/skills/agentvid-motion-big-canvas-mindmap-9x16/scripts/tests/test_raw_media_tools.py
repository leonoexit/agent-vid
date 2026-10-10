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
from unittest import mock
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

    def test_real_ffmpeg_crop_matches_photo_focus_center(self):
        with tempfile.TemporaryDirectory() as tmp:
            src, out = Path(tmp) / "source.png", Path(tmp) / "crop.png"
            im = Image.new("RGB", (2560, 1440), "black")
            im.paste("white", (1080, 0, 1120, 1440))
            im.save(src)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-frames:v", "1", "-vf",
                            ingest.crop_filter(0.4, 0.5), str(out)], check=True)
            photo = ingest.cover(im, 1080, 1920, 0.4, 0.5).convert("L").point(lambda p: 255 if p > 230 else 0)
            with Image.open(out) as decoded:
                video = decoded.convert("L").point(lambda p: 255 if p > 230 else 0)
            self.assertEqual(video.size, photo.size)
            self.assertLessEqual(abs(video.getbbox()[0] - photo.getbbox()[0]), 1)
            self.assertLessEqual(abs(video.getbbox()[2] - photo.getbbox()[2]), 1)

    def test_collision_names_are_stable_and_keep_existing_names(self):
        files = [Path(n) for n in ["a b.jpg", "a-b.png", "chanh.JPG", "chanh.png", "đỏ.jpg", "🍯.png"]]
        names = ingest.output_names(files, [])
        self.assertEqual(len(set(names.values())), len(files))
        self.assertEqual(names, ingest.output_names(list(reversed(files)), []))
        previous = [{"src": "a b.jpg", "full": "assets/media/a-b-full.jpg"}]
        self.assertEqual(ingest.output_names(files, previous)["a b.jpg"], "a-b")
        self.assertNotEqual(ingest.output_names(files, previous)["a-b.png"], "a-b")

    def test_clip_slot_round_trip_is_idempotent(self):
        with tempfile.TemporaryDirectory() as tmp, mock.patch.object(ingest.pathlib, "Path", wraps=Path) as path:
            html = Path(tmp) / "index.html"
            html.write_text('<div><video id="clip" data-duration="8"></video></div>', encoding="utf8")
            path.side_effect = lambda value: html if value == "index.html" else Path(value)
            ingest.wire_clip(None)
            self.assertNotIn("<video", html.read_text())
            ingest.wire_clip(2.5)
            ingest.wire_clip(2.5)
            self.assertEqual(html.read_text().count('<video id="clip"'), 1)
            self.assertIn('data-duration="2.50"', html.read_text())
            ingest.wire_clip(None)
            self.assertNotIn("<video", html.read_text())
            html.write_text('<link href="farm.css"><div id="shake"></div>', encoding="utf8")
            ingest.wire_clip(1)
            self.assertIn('<video id="clip"', html.read_text())  # old photos-only projects had no marker


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
    def test_real_collision_ingest_preserves_labels_when_focus_changes(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp = Path(tmp)
            raw = tmp / "raw"
            raw.mkdir()
            for name, color in [("a b.jpg", "red"), ("a-b.png", "blue"), ("đỏ.jpg", "green"), ("🍯.png", "yellow")]:
                Image.new("RGB", (160, 90), color).save(raw / name)
            command = ["python", str(SCRIPTS / "ingest-raw-media.py"), str(raw)]
            env = {**os.environ, "PYTHONIOENCODING": "utf-8"}
            subprocess.run(command, cwd=tmp, env=env, check=True, capture_output=True)
            path = tmp / "data/media.json"
            media = json.loads(path.read_text(encoding="utf8"))
            outputs = {i["src"]: i["full"] for i in media["items"]}
            self.assertEqual(len(set(outputs.values())), 4)
            for i in media["items"]:
                i["shows"] = "seller annotation: " + i["src"]
            path.write_text(json.dumps(media), encoding="utf8")
            (tmp / "data/media-focus.json").write_text(json.dumps({"a b.jpg": [0.4, 0.5]}), encoding="utf8")
            subprocess.run(command, cwd=tmp, env=env, check=True, capture_output=True)
            again = json.loads(path.read_text(encoding="utf8"))["items"]
            self.assertEqual({i["src"]: i["full"] for i in again}, outputs)
            self.assertTrue(all(i["shows"] == "seller annotation: " + i["src"] for i in again))
            with Image.open(tmp / outputs["a b.jpg"]) as red, Image.open(tmp / outputs["a-b.png"]) as blue:
                self.assertGreater(red.getpixel((500, 500))[0], 200)
                self.assertGreater(blue.getpixel((500, 500))[2], 200)

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
            with Image.open(proj / "assets/media/field-full.jpg") as photo:
                self.assertEqual(photo.size, (1080, 1920))
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
