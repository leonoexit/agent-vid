"""Word timings of a voice clip with a local speech recogniser (faster-whisper, CPU, no API key).

Run with the shared local-voice Python (called by lib/recognise-words.mjs):
  <vieneu-env python> transcribe-words-local.py <clip.wav> --language vi --out words.json [--model small] [--prompt-file script.txt]
Writes [{"t": word, "s": start, "e": end}] in seconds. The script text as prompt biases spelling towards the script
(the matcher maps heard words back onto the script anyway, so a few misheard words only cost interpolation).
Install once: python scripts/setup-vieneu.py --align  (faster-whisper + the "small" model, ~500 MB, cached in
<AGENTVID_HOME>/models/whisper).
"""
import argparse
import json
import os
import pathlib
import time

HOME = pathlib.Path(os.environ.get("AGENTVID_HOME", pathlib.Path.home() / ".agentvid"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("clip")
    ap.add_argument("--language", default="vi")
    ap.add_argument("--out", required=True)
    ap.add_argument("--model", default=os.environ.get("AGENTVID_WHISPER_MODEL", "small"))
    ap.add_argument("--prompt-file")
    a = ap.parse_args()

    from faster_whisper import WhisperModel  # late import: --help works without the env

    t0 = time.time()
    model = WhisperModel(a.model, device="cpu", compute_type="int8", download_root=str(HOME / "models" / "whisper"))
    prompt = pathlib.Path(a.prompt_file).read_text(encoding="utf8")[-600:] if a.prompt_file else None
    segments, _ = model.transcribe(a.clip, language=a.language, word_timestamps=True, initial_prompt=prompt,
                                   condition_on_previous_text=False, beam_size=5)
    words = [{"t": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)}
             for seg in segments for w in (seg.words or []) if w.word.strip()]
    pathlib.Path(a.out).write_text(json.dumps(words, ensure_ascii=False), encoding="utf8")
    print(f"local asr ({a.model}): {len(words)} words in {time.time() - t0:.1f}s", flush=True)


if __name__ == "__main__":
    main()
