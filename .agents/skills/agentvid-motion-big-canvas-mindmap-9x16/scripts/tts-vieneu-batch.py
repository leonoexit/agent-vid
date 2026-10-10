"""Synthesise many lines with local VieNeu-TTS in one process (the model loads once).

Usage (called by generate-voiceover.mjs with the vieneu-env Python):
  python tts-vieneu-batch.py <jobs.json> [--voice "Thanh Bình"]
jobs.json = [{"text": "...", "out": "C:/.../s01-cover.wav"}, ...]. Writes 48 kHz mono WAV files.
"""
import argparse
import json
import pathlib
import subprocess
import tempfile
import time


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("jobs")
    ap.add_argument("--voice", default="Thanh Bình")
    a = ap.parse_args()
    jobs = json.loads(pathlib.Path(a.jobs).read_text(encoding="utf8"))

    from vieneu import Vieneu  # imported late so --help works without the env

    t0 = time.time()
    tts = Vieneu()
    print(f"vieneu: model loaded in {time.time() - t0:.1f}s, voice {a.voice}", flush=True)
    for job in jobs:
        t = time.time()
        out = pathlib.Path(job["out"])
        out.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory() as tmp:
            raw = pathlib.Path(tmp) / "raw.wav"
            tts.save(tts.infer(job["text"], voice=a.voice), str(raw))
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-ar", "48000", "-ac", "1", str(out)], check=True)
        print(f"vieneu: {out.name} in {time.time() - t:.1f}s", flush=True)


if __name__ == "__main__":
    main()
