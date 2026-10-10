"""Gate B (UI review): inspect still frames of every section BEFORE the final render.

  python review-ui.py --project <project> [--capture] [--no-hyperframes]

Works for explainer projects (times from project-data.js) and motion projects (data/timeline.json: one frame per scene at 85%
of its window, no caption-word check). Shared by both kits; lives in kits/review-gates.

lint and check always run (--no-hyperframes skips them, and then a pass stamp is refused). --capture also takes
`snapshot --at <the times sync-narration.py printed>`; without it the frames already in <project>/snapshots are used
(sync-narration.py deletes them whenever timing changes, and frames older than project-data.js are errors). Needs Pillow (missing = error: picture checks and the contact sheet are part of the gate).
Errors (exit 1): lint/check failed, not exactly one fresh frame per wanted time (extra or older frames are errors),
Pillow missing, a frame whose content area is empty, caption words whose timings run backwards. Warnings: content that ends high on the screen (empty lower part).
Writes <project>/review/ui-review.{json,md} and review/ui-contact-sheet.jpg. The reviewer must OPEN the contact sheet
and answer the checklist: pixels cannot see a clipped word or a stamp that hides the number it is about.
"""
import argparse
import hashlib
import importlib.util
import json
import pathlib
import re
import shutil
import subprocess
import sys

CONTENT_TOP, CONTENT_BOTTOM = 0.12, 0.82   # the band between the brand badge and the caption strip
EMPTY_INK = 0.008                          # less ink than this in the content band = nothing rendered
HIGH_END = 0.50                            # content ending above this fraction of the height leaves the screen half empty
CHECKLIST = [
    "No word is clipped, overlapped or outside its box (title, cards, stamps, receipt lines, chips).",
    "A stamp, mascot or caption never covers the number or word it is about.",
    "Vietnamese diacritics are intact on every frame; no placeholder or stray debug text.",
    "Every number on screen equals the narration of that scene and the hook.",
    "Each scene shows a picture or a chart, not only a list of sentences; the hook frame reads in under 3 seconds.",
]


def load_plan(proj):
    text = (proj / "project-data.js").read_text(encoding="utf8")
    m = re.search(r"^window\.PLAN = (.*);\s*$", text, flags=re.M)
    return json.loads(m.group(1)) if m else None


def load_motion_plan(proj):
    """Motion projects: scene windows come from data/timeline.json (scenes[id] = {start, end}), no per-word timing."""
    f = proj / "data" / "timeline.json"
    if not f.is_file():
        return None
    t = json.loads(f.read_text(encoding="utf-8-sig"))
    scenes = t["scenes"]
    # profile-intro writes scenes as a list of {id, start, duration}; the other motion themes write a {id: {start, end}} map
    pairs = [(v.get("id") or v.get("name") or f"scene-{i + 1}", v) for i, v in enumerate(scenes)] if isinstance(scenes, list) else list(scenes.items())
    return {"total": t["duration"], "sections": [
        {"id": k, "start": v["start"], "dur": v["duration"] if "duration" in v else v["end"] - v["start"], "words": []} for k, v in pairs]}


def motion_times(plan):
    """One shot per scene once its reveals are done (85% of the window, as snapshot-scenes.mjs does)."""
    return [round(s["start"] + s["dur"] * 0.85, 1) for s in plan["sections"]]


def expected_times(plan):
    """Same shots sync-narration.py prints: 3 s, 5 s and one second before each section ends."""
    return [3, 5] + [round(s["start"] + s["dur"] - 1.0, 1) for s in plan["sections"]]


def run(args, cwd):
    """Run `npx hyperframes <args>` without a shell (npx.cmd on Windows); (exit code, output)."""
    npx = shutil.which("npx.cmd") or shutil.which("npx")
    if not npx:
        return 127, "npx not found on PATH"
    p = subprocess.run([npx, "hyperframes", *args], cwd=cwd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    return p.returncode, (p.stdout + p.stderr).strip()


def frame_metrics(path):
    from PIL import Image
    img = Image.open(path).convert("L")
    w, h = img.size
    small = img.resize((max(1, w // 8), max(1, h // 8)))
    sw, sh = small.size
    px = small.load()
    bg = max(set(px[x, y] for x in range(sw) for y in range(sh)),
             key=lambda v: sum(px[x, y] == v for x in range(0, sw, 2) for y in range(0, sh, 2)))
    top, bottom = int(sh * CONTENT_TOP), int(sh * CONTENT_BOTTOM)
    ink = [sum(abs(px[x, y] - bg) > 40 for x in range(sw)) / sw for y in range(top, bottom)]
    rows = [i for i, v in enumerate(ink) if v > 0.01]
    return {"ink": round(sum(ink) / max(1, len(ink)), 4),
            "contentBottom": round((top + rows[-1]) / sh, 2) if rows else 0.0}


def contact_sheet(frames, dest):
    from PIL import Image, ImageDraw
    thumbs = []
    for f in frames:
        t = Image.open(f).convert("RGB")
        t.thumbnail((270, 480))
        thumbs.append((f.stem, t))
    cols = 5
    rows = -(-len(thumbs) // cols)
    sheet = Image.new("RGB", (cols * 280, rows * 505), (24, 24, 24))
    draw = ImageDraw.Draw(sheet)
    for i, (name, t) in enumerate(thumbs):
        x, y = (i % cols) * 280 + 5, (i // cols) * 505 + 20
        sheet.paste(t, (x, y))
        draw.text((x, y - 16), name[:36], fill=(230, 230, 230))
    sheet.save(dest, quality=85)


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--capture", action="store_true", help="run hyperframes lint, check and snapshot first")
    ap.add_argument("--no-hyperframes", action="store_true", help="skip lint/check (frames must already exist)")
    args = ap.parse_args()
    proj = pathlib.Path(args.project)
    errors, warnings, notes = [], [], []
    here = pathlib.Path(__file__).resolve()
    shared = here.with_name("review-gate.py")  # built skills carry a copy; the kit source keeps one in kits/review-gates
    if not shared.is_file():
        shared = here.parents[3] / "review-gates" / "review-gate.py"
    spec = importlib.util.spec_from_file_location("review_gate", shared)
    gate = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(gate)
    motion = gate.is_motion(proj)
    plan = load_motion_plan(proj) if motion else load_plan(proj)
    if not plan:
        sys.exit("data/timeline.json is missing: run build-timeline first" if motion else "project-data.js has no window.PLAN: run sync-narration.py first")
    times = motion_times(plan) if motion else expected_times(plan)
    if not motion:
        data_text = (proj / "project-data.js").read_text(encoding="utf8")
        synced = re.search(r"window\.SCRIPT = (.*?);\s*\nwindow\.PLAN", data_text, flags=re.S)
        current = json.loads((proj / "script.json").read_text(encoding="utf-8-sig"))
        if not synced or json.loads(synced.group(1)) != current:
            errors.append("project-data.js was not generated from the current script.json: run sync-narration.py, then --capture")
    start_sha = gate.inputs_sha(proj)

    hyperframes = "skipped"
    if not args.no_hyperframes:  # lint and check always run; a pass stamp is refused when they were skipped
        hyperframes = "ran"
        for label in ("lint", "check"):
            code, out = run([label], proj)
            if code != 0:
                errors.append(f"hyperframes {label} failed: {out[-400:]}")
    if args.capture:
        code, out = run(["snapshot", "--at", ",".join(str(t) for t in times)], proj)
        if code != 0:
            errors.append(f"hyperframes snapshot failed: {out[-400:]}")

    # exactly one fresh frame per wanted time: unrelated, extra or older-than-the-timing frames never count
    found = {}
    for f in sorted(p for p in (proj / "snapshots").rglob("*") if p.is_file() and not re.fullmatch(r"contact-sheet(-\d+)?\.jpg", p.name)):
        m = re.fullmatch(r"frame-\d+-at-(\d+(?:\.\d+)?)s\.png", f.name)
        if m:
            found.setdefault(float(m.group(1)), []).append(f)
        else:
            errors.append(f"unrecognised file in snapshots/: {f.name}: delete the snapshots folder and run with --capture")
    frames = []
    data_file = proj / "project-data.js"
    for t in times:
        got = found.get(float(t), [])
        if len(got) != 1:
            errors.append(f"snapshot at {t} s: {len(got)} frame(s) found, exactly 1 needed: run with --capture")
            continue
        if got[0].stat().st_mtime < gate.inputs_mtime(proj):
            errors.append(f"{got[0].name} is older than a project input file (data, html/css/js, widgets, assets): run with --capture")
        frames.append(got[0])
    extra = sorted(set(found) - {float(x) for x in times})
    mark = plan["total"] * 0.97  # hyperframes adds its own frame at 97% of the composition duration
    own = min((x for x in extra if abs(x - mark) < 0.3), key=lambda x: abs(x - mark), default=None)
    for t in extra:
        if t == own and len(found[t]) == 1:  # the one frame hyperframes adds itself
            if found[t][0].stat().st_mtime < gate.inputs_mtime(proj):
                errors.append(f"{found[t][0].name} is older than a project input file: run with --capture")
            frames.append(found[t][0])
            continue
        errors.append(f"unexpected snapshot at {t} s (stale): delete the snapshots folder and run with --capture")

    # caption words must move forward in time
    for sec in plan["sections"]:
        last = -1.0
        for w in sec.get("words", []):
            if w["t1"] < w["t0"] or w["t0"] < last - 0.001:
                errors.append(f"{sec['id']}: caption word \"{w['w']}\" has timing {w['t0']}-{w['t1']} that runs backwards; "
                              "re-run tts.py --force for that section")
                break
            last = w["t0"]

    metrics = {}
    try:
        for f in frames:
            try:
                m = metrics[f.name] = frame_metrics(f)
            except (OSError, ValueError, SyntaxError) as exc:  # truncated or corrupt image
                errors.append(f"{f.name}: cannot read the frame ({exc}): run with --capture")
                frames = [x for x in frames if x != f]
                continue
            if m["ink"] < EMPTY_INK:
                errors.append(f"{f.name}: content area looks empty (ink {m['ink']:.3f}): the scene did not render")
            elif m["contentBottom"] < HIGH_END:
                warnings.append(f"{f.name}: content ends at {int(m['contentBottom'] * 100)}% of the height: "
                                "the lower half is empty, use a taller widget or a picture")
        out = proj / "review"
        out.mkdir(exist_ok=True)
        if frames:
            contact_sheet(frames, out / "ui-contact-sheet.jpg")
    except ImportError:
        errors.append("Pillow is not installed: picture checks and the contact sheet need it (pip install pillow)")
        (proj / "review").mkdir(exist_ok=True)

    out = proj / "review"
    sha = hashlib.sha256(gate.script_file(proj).read_bytes()).hexdigest()
    data_sha = gate.inputs_sha(proj)  # every file that decides the pixels, so a later edit invalidates the review
    if data_sha != start_sha:
        errors.append("project files changed while the review ran: run it again")
    (out / "ui-review.json").write_text(json.dumps(
        {"gate": "B", "scriptSha": sha, "dataSha": data_sha, "hyperframes": hyperframes, "frames": len(frames), "times": times, "errors": errors,
         "warnings": warnings, "metrics": metrics}, ensure_ascii=False, indent=2), encoding="utf8")
    md = [f"# Gate B UI review: {proj.name}", "",
          f"{len(frames)} frame(s) at {', '.join(str(t) for t in times)} s · {len(errors)} error(s) · {len(warnings)} warning(s)",
          "", "Open `review/ui-contact-sheet.jpg` (and the full-size frames in `snapshots/`) before answering.", "",
          "## Errors"] + ([f"- {e}" for e in errors] or ["- none"]) + ["", "## Warnings"] \
        + ([f"- {w}" for w in warnings] or ["- none"]) + ["", "## Reviewer checklist"] \
        + [f"- [ ] {c}" for c in CHECKLIST] + ["", "## Verdict", "- pass / fail + notes", ""]
    (out / "ui-review.md").write_text("\n".join(md), encoding="utf8")
    for e in errors:
        print("  x", e)
    for w in warnings:
        print("  !", w)
    print(f"Gate B: {len(errors)} error(s), {len(warnings)} warning(s) -> {out / 'ui-review.md'}")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
