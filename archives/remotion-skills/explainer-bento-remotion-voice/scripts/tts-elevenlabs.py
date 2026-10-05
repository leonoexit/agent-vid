"""ElevenLabs narration with character timestamps (Python stdlib only).

Two modes:
  1) One line (smoke test):
       python tts-elevenlabs.py --text "Xin chào" --out test.mp3
  2) A whole project: read narration from <project>/script.json and write
       <project>/assets/audio/vo-NN.mp3  (one clip per section: intro, scenes..., outro)
       <project>/timings.json            (clip durations + word timings, used by sync-narration.py)
       python tts-elevenlabs.py --project <project> [--force]   # re-runs only re-voice sections whose vo changed

Optional paid engine (the default is the free local voice, tts-vieneu.py). Run it through tts.py --engine elevenlabs.
Key: ELEVENLABS_API_KEY env var, else ~/.agentvid/keys.env, $VIDEO_SKILL_KEYS_FILE, ~/.claude/image-api-keys.env,
~/.codex/video-keys.env (KEY=VALUE lines). Never printed.
Voice: --voice or ELEVENLABS_VOICE_ID (a voice id from your own ElevenLabs "My Voices"; a library voice must be added
to your account first). Bilingual lines: English wrapped in braces inside a vo, e.g. "Hãy nói: {I agree with you.}", is
voiced by --en-voice / ELEVENLABS_EN_VOICE_ID (default: --voice) and spliced into the same clip; captions keep the words.
"""
import argparse
import base64
import json
import os
import pathlib
import sys
import tempfile
import time
import urllib.error
import urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import voice_common as vc  # noqa: E402

API = "https://api.elevenlabs.io/v1"
DEFAULT_MODEL = "eleven_v3"
GAP = 0.25  # seconds of silence between language pieces



def synth(key, voice, model, text, retries=2, lang="vi"):
    """Return (mp3_bytes, alignment) for one piece of text."""
    body = json.dumps({"text": text, "model_id": model, "language_code": lang}, ensure_ascii=False).encode("utf8")
    url = f"{API}/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128"
    for attempt in range(retries + 1):
        req = urllib.request.Request(url, data=body, method="POST", headers={
            "xi-api-key": key, "Content-Type": "application/json; charset=utf-8"})
        try:
            d = json.loads(urllib.request.urlopen(req, timeout=180).read())
            return base64.b64decode(d["audio_base64"]), d.get("alignment") or {}
        except urllib.error.HTTPError as e:
            msg = e.read().decode("utf8", "replace")[:300]
            if attempt == retries or e.code not in (429, 500, 502, 503):
                sys.exit(f"ElevenLabs HTTP {e.code}: {msg}")
            time.sleep(3 * (attempt + 1))


def words_from_alignment(al):
    """Group character timings into words: [{w, start, end}] (seconds)."""
    chars = al.get("characters") or []
    starts = al.get("character_start_times_seconds") or []
    ends = al.get("character_end_times_seconds") or []
    words, cur, t0, t1 = [], "", None, None
    for c, s, e in zip(chars, starts, ends):
        if c.isspace():
            if cur:
                words.append({"w": cur, "start": round(t0, 3), "end": round(t1, 3)})
            cur, t0 = "", None
            continue
        if t0 is None:
            t0 = s
        cur += c
        t1 = e
    if cur:
        words.append({"w": cur, "start": round(t0, 3), "end": round(t1, 3)})
    return words




def synth_mixed(key, voices, model, text, dest, language="mixed"):
    """Voice each language piece with its own voice, splice them into `dest`, return word timings shifted to match."""
    words, offset, files = [], 0.0, []
    with tempfile.TemporaryDirectory() as tmp:
        for i, (lang, piece) in enumerate(vc.split_langs(text, language)):
            audio, al = synth(key, voices[lang], model, piece, lang=lang)
            f = pathlib.Path(tmp) / f"part-{i}.mp3"
            f.write_bytes(audio)
            files.append(f)
            words += [{"w": w["w"], "start": round(w["start"] + offset, 3), "end": round(w["end"] + offset, 3)}
                      for w in words_from_alignment(al)]
            offset += vc.media_seconds(f) + GAP
        # A short breath between the two voices (plus 30 ms fades) so the hand-over does not sound cut.
        vc.splice(files, dest, GAP)
    return words



def main():
    vc.utf8_stdout()
    ap = argparse.ArgumentParser()
    ap.add_argument("--project")
    ap.add_argument("--text")
    ap.add_argument("--out")
    ap.add_argument("--voice", default=os.environ.get("ELEVENLABS_VOICE_ID"), help="ElevenLabs voice id")
    ap.add_argument("--en-voice", default=os.environ.get("ELEVENLABS_EN_VOICE_ID"),
                    help="voice id for {English} pieces inside a vo (default: --voice)")
    ap.add_argument("--model", default=DEFAULT_MODEL, help="eleven_v3 (best Vietnamese) | eleven_flash_v2_5 (fast/cheap)")
    ap.add_argument("--force", action="store_true", help="re-voice every section, even unchanged ones")
    args = ap.parse_args()
    if not args.voice:
        sys.exit("ElevenLabs needs a voice id: pass --voice <id> or set ELEVENLABS_VOICE_ID "
                 "(copy it from ElevenLabs > My Voices). Or use the free local voice: tts.py without --engine.")
    args.en_voice = args.en_voice or args.voice
    key = vc.load_key("ELEVENLABS_API_KEY")

    if args.text:
        audio, al = synth(key, args.voice, args.model, args.text)
        pathlib.Path(args.out or "tts-test.mp3").write_bytes(audio)
        ends = al.get("character_end_times_seconds") or [0]
        print(f"ok {args.model}: {len(audio)} bytes, {ends[-1]:.2f}s, {len(words_from_alignment(al))} words")
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
    # Re-runs only re-voice sections whose text changed (saves API cost; unchanged takes keep their exact length).
    ident = f"{args.voice}+en:{args.en_voice}:language={language}"
    prev_t = json.loads(tpath.read_text(encoding="utf8")) if tpath.exists() else {}
    old = {} if args.force or prev_t.get("voice") != ident or prev_t.get("model") != args.model else {
        e["id"]: e for e in prev_t.get("sections", [])}
    timings = {"voice": ident, "model": args.model, "sections": []}
    for n, (sid, text) in enumerate(vc.sections(script)):
        entry = {"id": sid, "file": None, "duration": 0.0, "words": [], "text": text.strip()}
        prev = old.get(sid)
        if prev and prev.get("text") == text.strip() and prev.get("file") and (proj / prev["file"]).exists():
            timings["sections"].append(prev)
            print(f"{sid}: unchanged, kept {prev['duration']:.2f}s")
            continue
        if text.strip():
            f = adir / f"vo-{n:02d}.mp3"
            pieces = vc.split_langs(text, language)
            if not pieces:
                sys.exit(f"{sid}: narration contains no speakable text")
            if len(pieces) > 1:
                words = synth_mixed(key, {"vi": args.voice, "en": args.en_voice}, args.model, text.strip(), f, language)
            else:
                lang, piece = pieces[0]
                voice = args.en_voice if lang == "en" else args.voice
                audio, al = synth(key, voice, args.model, piece, lang=lang)
                f.write_bytes(audio)
                words = words_from_alignment(al)
            entry.update(file=f"assets/audio/{f.name}", duration=round(words[-1]["end"] if words else 0.0, 3), words=words)
            print(f"{sid}: {entry['duration']:.2f}s  {text[:50]}")
        timings["sections"].append(entry)
    (proj / "timings.json").write_text(json.dumps(timings, ensure_ascii=False, indent=1), encoding="utf8")
    print("wrote timings.json")


if __name__ == "__main__":
    main()
