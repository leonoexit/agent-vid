"""Local, free narration with VieNeu-TTS (Vietnamese) + Kokoro (English lines) — no API key, runs on CPU.

Same output as tts-elevenlabs.py, so sync-narration.py works unchanged:
  <project>/assets/audio/vo-NN.mp3 (one clip per section) + <project>/timings.json (durations + word timings)

  python tts-vieneu.py --project <project> [--voice "Hải Đăng"] [--force]
  python tts-vieneu.py --text "Xin chào" --out test.mp3            # smoke test
  python tts-vieneu.py --list-voices

Needs setup-voice.py once (makes ~/.agentvid/vieneu-env); this script re-runs itself with that env's Python.
Voice: --voice, else project voice.json, else machine preference, else the theme preset (Hải Đăng).
{English} pieces inside a vo: read by Kokoro (theme "voice.en": {"engine": "kokoro", "voice": "am_michael"}),
otherwise by the Vietnamese voice. Re-runs only re-voice sections whose text (or voice) changed.
VieNeu returns no word timings, so they are estimated: text is cut at punctuation, the pauses found by ffmpeg
silencedetect anchor the cuts, and time inside each piece is shared by word length. These are estimates, not forced alignment; check important cues against the audio.
"""
import os
import pathlib
import subprocess
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import voice_common as vc  # noqa: E402

os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")  # harmless Windows warning from the model download
try:
    import vieneu  # noqa: F401
except ImportError:
    py = vc.env_python()
    if py.exists() and pathlib.Path(sys.executable).resolve() != py.resolve():
        sys.exit(subprocess.run([str(py), __file__, *sys.argv[1:]]).returncode)
    sys.exit("Local voice not installed yet: run  python <SKILL_DIR>/scripts/setup-voice.py  (once, ~2-5 min)")

import argparse  # noqa: E402
import json  # noqa: E402
import re  # noqa: E402
import tempfile  # noqa: E402
import time  # noqa: E402

GAP = 0.2  # seconds between trimmed paragraph/language pieces (after trimming each piece)


def pauses(path, dur, min_len=0.15):
    """Silent spans [(start, end)] of at least min_len seconds (ffmpeg silencedetect)."""
    out = subprocess.run(["ffmpeg", "-v", "info", "-i", str(path), "-af", f"silencedetect=noise=-35dB:d={min_len}", "-f", "null", "-"],
                         capture_output=True, text=True, encoding="utf8", errors="replace").stderr
    st = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", out)]
    en = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", out)]
    if len(st) > len(en):  # silence that runs to the end of the file
        en.append(dur)
    return list(zip(st, en))


def speech_span(path, dur):
    """First and last moment of speech. VieNeu clips open with only 30-150 ms of silence, below the pause threshold."""
    fine = pauses(path, dur, 0.02)
    start = fine[0][1] if fine and fine[0][0] < 0.01 else 0.0
    end = fine[-1][0] if fine and fine[-1][1] > dur - 0.01 else dur
    return start, end


from word_timing import estimate_words, validate_words


class Voices:
    """Loads each model on first use (VieNeu ~12 s, Kokoro ~2 s)."""

    def __init__(self, settings):
        self.s, self._vi, self._en = settings, None, None

    def vi(self, text, dest):
        if self._vi is None:
            from vieneu import Vieneu
            t = time.time()
            self._vi = Vieneu()
            print(f"VieNeu model loaded in {time.time() - t:.1f}s (voice: {self.s['vi']})")
        audio = self._vi.infer(text, voice=self.s["vi"])
        self._vi.save(audio, str(dest))

    def en(self, text, dest):
        en = self.s["en"]
        if en.get("engine") != "kokoro":
            return self.vi(text, dest)
        if self._en is None:
            from kokoro_onnx import Kokoro
            files = [vc.KOKORO_DIR / n for n in vc.KOKORO_FILES]
            if not all(f.exists() for f in files):
                sys.exit("English voice not installed: run  python <SKILL_DIR>/scripts/setup-voice.py")
            self._en = Kokoro(str(files[0]), str(files[1]))
        import soundfile as sf
        samples, rate = self._en.create(text, voice=en.get("voice") or "am_michael", speed=0.95, lang="en-us")
        sf.write(str(dest), samples, rate)


def voice_section(voices, text, dest, language="vi"):
    """Voice one section (splicing language pieces) into dest mp3; return estimated word timings."""
    words, offset, files = [], 0.0, []
    pieces = [(lang, paragraph.strip()) for lang, piece in vc.split_langs(text, language) for paragraph in re.split(r"\n\s*\n", piece) if paragraph.strip()]
    if not pieces:
        raise ValueError("narration contains no speakable text")
    with tempfile.TemporaryDirectory() as tmp:
        for i, (lang, piece) in enumerate(pieces):
            f = pathlib.Path(tmp) / f"part-{i}.wav"
            (voices.en if lang == "en" else voices.vi)(piece, f)
            speed = voices.s.get("speed", 1.0)
            if speed != 1.0:
                paced = f.with_name(f"paced-{i}.wav")
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(f), "-af", f"atempo={speed}", str(paced)], check=True)
                f = paced
            dur = vc.media_seconds(f)
            span = speech_span(f, dur)
            if len(pieces) > 1:
                # Cut each piece's own leading/trailing silence so the hand-over pause is exactly GAP, not GAP + ~0.5 s.
                a, b = max(0.0, span[0] - 0.03), min(dur, span[1] + 0.06)
                cut = f.with_name(f"cut-{i}.wav")
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(f), "-af", f"atrim={a}:{b},asetpts=N/SR/TB", str(cut)],
                               check=True)
                f, dur, span = cut, b - a, (span[0] - a, span[1] - a)
            words += [{"w": w["w"], "start": round(w["start"] + offset, 3), "end": round(w["end"] + offset, 3)}
                      for w in estimate_words(piece, span, pauses(f, dur))]
            files.append(f)
            offset += dur + GAP
        vc.splice(files, dest, GAP if len(files) > 1 else 0)
    return words


def main():
    vc.utf8_stdout()
    ap = argparse.ArgumentParser()
    ap.add_argument("--project")
    ap.add_argument("--text")
    ap.add_argument("--out")
    ap.add_argument("--voice", help="VieNeu preset name, e.g. \"Hải Đăng\" (see --list-voices)")
    ap.add_argument("--speed", type=float, help="Pitch-preserving pace, 0.65–1.25; default from voice.json")
    ap.add_argument("--force", action="store_true", help="re-voice every section, even unchanged ones")
    ap.add_argument("--list-voices", action="store_true")
    args = ap.parse_args()
    settings = vc.voice_settings("vieneu", args.project)
    if args.voice:
        settings["vi"] = args.voice
    global GAP
    GAP = float(settings.get("paragraph_gap", 0.2))
    if not 0 <= GAP <= 3:
        ap.error("paragraph_gap must be between 0 and 3 seconds")
    settings["speed"] = args.speed if args.speed is not None else settings.get("speed", 1.0)
    if not 0.65 <= settings["speed"] <= 1.25:
        ap.error("--speed must be between 0.65 and 1.25")
    if args.list_voices:
        from vieneu import Vieneu
        for label, _ in Vieneu().list_preset_voices():
            print(label)
        return
    voices = Voices(settings)

    if args.text:
        out = pathlib.Path(args.out or "tts-test.mp3")
        t = time.time()
        words = voice_section(voices, args.text, out)
        print(f"ok vieneu:{settings['vi']}: {vc.media_seconds(out):.2f}s audio, {len(words)} words, {time.time() - t:.1f}s")
        return

    proj = pathlib.Path(args.project)
    script = json.loads((proj / "script.json").read_text(encoding="utf-8-sig"))
    try:
        language = vc.script_language(script)
    except ValueError as exc:
        sys.exit(str(exc))
    adir = proj / "assets" / "audio"
    adir.mkdir(parents=True, exist_ok=True)
    tpath = proj / "timings.json"
    ident = f"vieneu:{settings['vi']}" + (f"+kokoro:{settings['en'].get('voice')}" if settings["en"].get("engine") == "kokoro" else "")
    ident += f":language={language}:speed={settings['speed']}:gap={GAP}:timing=monotonic-v2"
    prev_t = json.loads(tpath.read_text(encoding="utf8")) if tpath.exists() else {}
    # Keep sections whose text is unchanged, unless the voice changed or --force.
    old = {} if args.force or prev_t.get("voice") != ident else {e["id"]: e for e in prev_t.get("sections", [])}
    timings = {"voice": ident, "model": "VieNeu-TTS-v3-Turbo", "sections": []}
    t_all = time.time()
    for n, (sid, text) in enumerate(vc.sections(script)):
        text = text.strip()
        entry = {"id": sid, "file": None, "duration": 0.0, "words": [], "text": text}
        prev = old.get(sid)
        if prev and prev.get("text") == text and prev.get("file") and (proj / prev["file"]).exists():
            timings["sections"].append(prev)
            print(f"{sid}: unchanged, kept {prev['duration']:.2f}s")
            continue
        if text:
            t = time.time()
            f = adir / f"vo-{n:02d}.mp3"
            try:
                words = voice_section(voices, text, f, language)
            except ValueError as exc:
                sys.exit(f"{sid}: {exc}")
            validate_words(words, vc.media_seconds(f))
            entry.update(file=f"assets/audio/{f.name}", duration=round(vc.media_seconds(f), 3), words=words)
            print(f"{sid}: {entry['duration']:.2f}s (synth {time.time() - t:.1f}s)  {text[:50]}")
        timings["sections"].append(entry)
    tpath.write_text(json.dumps(timings, ensure_ascii=False, indent=1), encoding="utf8")
    print(f"wrote timings.json ({time.time() - t_all:.0f}s)")


if __name__ == "__main__":
    main()
