"""Real phone display-matrix/SAR regressions for ingest (FFmpeg, ffprobe, Pillow required)."""
import importlib.util
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from PIL import Image

SCRIPTS = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("rotated_ingest", SCRIPTS / "ingest-raw-media.py")
ingest = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(ingest)


def ff(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *map(str, args)], check=True, capture_output=True)


def box(image):
    return image.convert("L").point(lambda p: 255 if p > 200 else 0).getbbox()


class RotatedPhoneMedia(unittest.TestCase):
    def test_autorotated_clip_and_still_keep_square_pixels_and_focal_parity(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "marker.png"
            image = Image.new("RGB", (640, 480), "black")
            image.paste("white", (0, 180, 640, 200))
            image.save(source)
            for sar in ["1/1", "3/2"]:
                with self.subTest(sar=sar):
                    project = root / sar.replace("/", "-")
                    raw = project / "raw"
                    raw.mkdir(parents=True)
                    encoded, phone = project / "encoded.mp4", raw / "phone.mp4"
                    ff("-loop", "1", "-i", source, "-t", "1", "-r", "30", "-vf", f"setsar={sar}",
                       "-c:v", "libx264", "-crf", "0", "-pix_fmt", "yuv420p", encoded)
                    ff("-display_rotation", "90", "-i", encoded, "-c", "copy", phone)
                    square = project / "displayed.png"
                    ff("-i", phone, "-frames:v", "1", "-vf", "scale=w='round(iw*sar)':h=ih,setsar=1", square)
                    with Image.open(square) as displayed:
                        self.assertEqual(displayed.size, (480 if sar == "1/1" else 320, 640))
                        expected = ingest.cover(displayed, 1080, 1920, 0.4, 0.6)
                    (project / "data").mkdir()
                    (project / "data/media-focus.json").write_text(json.dumps({"phone.mp4": [0.4, 0.6]}), encoding="utf8")
                    subprocess.run([sys.executable, str(SCRIPTS / "ingest-raw-media.py"), str(raw), "--max-clip", "0.5"],
                                   cwd=project, check=True, capture_output=True, env={**os.environ, "PYTHONIOENCODING": "utf-8"})
                    clip = project / "assets/media/clip.mp4"
                    result = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                                             "stream=width,height,sample_aspect_ratio,display_aspect_ratio:stream_side_data=rotation",
                                             "-of", "json", str(clip)], check=True, capture_output=True, text=True)
                    video = json.loads(result.stdout)["streams"][0]
                    self.assertEqual((video["width"], video["height"]), (1080, 1920))
                    self.assertEqual(video["sample_aspect_ratio"], "1:1")
                    self.assertEqual(video["display_aspect_ratio"], "9:16")
                    self.assertTrue(all(s.get("rotation", 0) == 0 for s in video.get("side_data_list", [])))
                    decoded = project / "clip-frame.png"
                    ff("-i", clip, "-frames:v", "1", decoded)
                    for path in [project / "assets/media/phone-still.jpg", decoded]:
                        with Image.open(path) as output:
                            self.assertEqual(output.size, expected.size)
                            self.assertIsNotNone(box(output))
                            self.assertTrue(all(abs(a - b) <= 3 for a, b in zip(box(output), box(expected))),
                                            (sar, path.name, box(output), box(expected)))


if __name__ == "__main__":
    unittest.main()
