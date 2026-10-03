"""Check a project's script.json before voicing: text lengths that overflow the layout, and the estimated video length.

  python validate-script.py --project <project> [--target 75]

Checks the shared zones (title, intro, notes, outro) against fixed limits, flags any widget string over 60 characters,
and estimates the length from the narration: Σ(words / engine rate, {English} words / 2.5) + 1.25 s per section, with the
per-section minimums used by sync-narration.py (intro 5 s, scene 6.5 s, outro 6 s). Engine rate (Vietnamese words per
second, measured): local VieNeu 4.5, ElevenLabs 3.2 — the same engine tts.py will use. Exit code 1 when a limit is broken.
With the local voice it also warns about runs of > 25 words without punctuation (caption timing is estimated per clause).
--music-only (automatic in a music-only skill, which has no tts.py): the length comes from the screen text instead
(same rule as sync-narration.py --music-only) and `vo` is ignored.
"""
import argparse
import json
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import voice_common as vc  # noqa: E402

WPS = 3.2  # replaced by the engine's measured rate in main()
EN_WPS = 2.5  # {English} pieces: slower native voice + a 0.25 s pause at each hand-over
LIMITS = {
    "title": 26, "subtitle": 32,
    "intro.prompt": 34, "intro.line1": 18, "intro.line2a": 20, "intro.line2b": 22,
    "outro.line1": 18, "outro.line2": 22, "outro.line3": 30, "outro.credit": 60,
    "scene.title": 26, "scene.before": 45, "scene.after": 36,
}
WIDGET_MAX = 60
WIDGET_KEY_MAX = {"quote": 120}  # widgets that are built for longer text


def words(text):
    return len(re.sub(r"[{}]", " ", text or "").split())


def speech_seconds(text, language="vi"):
    """Estimate routed narration; mixed/legacy English inserts include their established pause allowance."""
    pieces = vc.split_langs(text or "", language)
    seconds = sum(len(piece.split()) / (EN_WPS if lang == "en" else WPS) for lang, piece in pieces)
    if vc.normalize_language(language) == "en":
        return seconds
    return seconds + sum(lang == "en" for lang, _ in pieces) * 0.5


def widget_strings(node, path):
    """Yield (path, text) for every string inside a widget definition."""
    if isinstance(node, str):
        yield path, node
    elif isinstance(node, dict):
        for k, v in node.items():
            yield from widget_strings(v, f"{path}.{k}")
    elif isinstance(node, list):
        for i, v in enumerate(node):
            yield from widget_strings(v, f"{path}[{i}]")


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--target", type=float, help="wanted length in seconds (warns when the estimate is > 10%% off)")
    ap.add_argument("--engine", help="vieneu | elevenlabs (default: the one tts.py uses)")
    ap.add_argument("--music-only", action="store_true", help="estimate a video without voice")
    args = ap.parse_args()
    music = args.music_only or not (pathlib.Path(__file__).resolve().parent / "tts.py").exists()
    global WPS
    voice = vc.voice_settings(args.engine, args.project)
    WPS = voice["wps"]
    s = json.loads((pathlib.Path(args.project) / "script.json").read_text(encoding="utf-8-sig"))
    try:
        language = vc.script_language(s)
    except ValueError as exc:
        sys.exit(str(exc))
    narration_rate = EN_WPS if language == "en" else WPS
    theme = pathlib.Path(__file__).resolve().parent.parent / "theme.json"
    if theme.exists():  # the skill's own limits (same numbers as its SKILL.md) override the shared defaults
        LIMITS.update(json.loads(theme.read_text(encoding="utf8")).get("limits", {}))

    problems = []

    def check(key, text, limit):
        if text and len(text) > limit:
            problems.append(f"{key}: {len(text)} chars > {limit}  \"{text}\"")

    for k in ["title", "subtitle"]:
        check(k, s.get(k), LIMITS[k])
    for part in ["intro", "outro"]:
        for k, v in s.get(part, {}).items():
            if f"{part}.{k}" in LIMITS:
                check(f"{part}.{k}", v, LIMITS[f"{part}.{k}"])
    for i, sc in enumerate(s.get("scenes", []), 1):
        for k in ["title", "before", "after"]:
            check(f"scene {i}.{k}", sc.get(k), LIMITS[f"scene.{k}"])
        kind = sc.get("widget", {}).get("kind", "")
        for path, text in widget_strings(sc.get("widget", {}), f"scene {i}.widget"):
            field = re.sub(r"\[\d+\]", "", path.rsplit(".", 1)[-1])  # items[2] -> items, points[0].text -> text
            check(path, text, LIMITS.get(f"w.{kind}.{field}", WIDGET_KEY_MAX.get(field, WIDGET_MAX)))

    # Length estimate: same minimums as sync-narration.py.
    secs = [("intro", s.get("intro", {}).get("vo", ""), 5.0)]
    secs += [(f"scene {i}", sc.get("vo", ""), 6.5) for i, sc in enumerate(s.get("scenes", []), 1)]
    secs.append(("outro", s.get("outro", {}).get("vo", ""), 6.0))
    total, total_words = 0.0, 0
    if music:
        secs = []
        total = sum(vc.screen_seconds(s).values())
    for name, vo, floor in secs:
        if vo.strip() and not vc.split_langs(vo, language):
            problems.append(f"{name}: narration contains no speakable text")
        n = words(vo)
        total_words += n
        total += max(floor, speech_seconds(vo, language) + 1.25)
        if voice["engine"] == "vieneu":
            for run in re.split(r"[.,;:!?{}]", vo or ""):
                if len(run.split()) > 25:
                    problems.append(f"{name}: {len(run.split())} words without punctuation - add a comma or split the sentence")
    if music:
        print(f"{len(s.get('scenes', []))} scenes, music only -> about {total:.0f} s (from the screen text)")
    else:
        rate_label = "mixed rates" if language == "mixed" else f"{narration_rate} words/s"
        print(f"{len(s.get('scenes', []))} scenes, {total_words} words of vo -> about {total:.0f} s "
              f"({voice['engine']} voice, {language}, {rate_label})")
    if args.target and abs(total - args.target) > 0.1 * args.target:
        fix = (f"{'remove' if total > args.target else 'add'} a scene or shorten/lengthen screen text" if music else
               f"{'cut' if total > args.target else 'add'} about {abs(total - args.target) * narration_rate:.0f} words")
        problems.append(f"estimated {total:.0f} s vs target {args.target:.0f} s: {fix}")
    for p in problems:
        print("  x", p)
    print("OK" if not problems else f"{len(problems)} problem(s): fix script.json and run this again")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
