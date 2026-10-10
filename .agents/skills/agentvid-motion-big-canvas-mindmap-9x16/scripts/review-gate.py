"""Record and enforce the review gates of one video project (state in <project>/review/gates.json).

  python review-gate.py stamp   --project <p> --gate A|B|C --reviewer <who> --author <builder> --verdict pass|fail
                                [--notes "..."] [--artifact <rendered.mp4>   (gate C)] [--reviewer-kind model|subagent|human]
  python review-gate.py require --project <p> [--gates A,B] [--purpose channel|sale]   exit 1 unless each gate passed on the
                                CURRENT files; sale = A, B and C, each stamp naming its --reviewer-kind
  python review-gate.py render  --project <p> --output <out.mp4> [--quality high]   require A,B, then hyperframes render
  python review-gate.py receipt --project <p> --output <out.mp4>   motion projects: record which inputs produced the MP4
                                (render-and-verify.mjs calls it after the render it runs itself)
  python review-gate.py status  --project <p>                  effective state of A, B, C (stale/failed -> exit 1)

Gate A = content (review-script.py), B = UI frames (review-ui.py), C = the rendered MP4 (frames + the words that are easy
to mispronounce). The reviewer must be a different session or model than the builder: --reviewer and --author are both
required for a pass and may not be equal. A pass stamp is refused when its report is missing, has errors, was made for
another script.json / project-data.js, lint+check were skipped (gate B), or the report has warnings and --notes does not
say how they were resolved. `require` also rejects a stamp once script.json (A, B, C), project-data.js (B, C) or the
stamped MP4 (C) changed. Gate C also needs the receipt `render` writes, so only a file rendered from the current files can be stamped. Use `render` instead of calling hyperframes render directly. This is a process guard between
cooperating agents, not protection against someone editing review/gates.json by hand.
"""
import argparse
import datetime
import hashlib
import json
import pathlib
import re
import shutil
import subprocess
import sys

REPORT = {"A": "content-review.json", "B": "ui-review.json"}


def file_sha(path):
    return hashlib.sha256(pathlib.Path(path).read_bytes()).hexdigest()


MOTION_SCRIPTS = ("data/script.json", "data/storyboard.json", "data/timeline-config.json")
MOTION_SKIP = {"render-report.json", "production-log.json"}  # bookkeeping written during and after the render (render-and-verify.mjs, production-log.py): outputs, not inputs


def is_motion(proj):
    """A motion-kit project keeps its script under data/; an explainer project has script.json at the root."""
    proj = pathlib.Path(proj)
    return not (proj / "script.json").exists() and any((proj / f).exists() for f in MOTION_SCRIPTS)


def script_file(proj):
    """The file whose hash a stamp is bound to: script.json (explainer) or the motion script/storyboard/timeline."""
    proj = pathlib.Path(proj)
    if (proj / "script.json").exists() or not is_motion(proj):
        return proj / "script.json"
    return next(proj / f for f in MOTION_SCRIPTS if (proj / f).exists())


def input_files(proj):
    """Everything that decides the rendered pixels and sound. Explainer: script.json, project-data.js (timing, words), the
    root html/css/js, widgets/, palettes/ and assets/. Motion: root html/css/js and brand.json, data/, scenes/, runtime/
    and assets/. Reports, snapshots and renders are not inputs."""
    proj = pathlib.Path(proj)
    motion = is_motion(proj)
    files = [p for p in proj.glob("*") if p.is_file() and (p.suffix in (".html", ".css", ".js") or p.name == "script.json"
                                                         or (motion and p.name == "brand.json"))]
    for sub in (("data", "scenes", "runtime", "assets") if motion else ("widgets", "palettes", "assets")):
        files += [p for p in (proj / sub).rglob("*") if p.is_file() and p.name not in MOTION_SKIP] if (proj / sub).is_dir() else []
    return sorted(files)


def content_files(proj):
    """What gate A reviews: the script file itself (explainer) or, for motion, every file that carries words: the script,
    storyboard, profile, brand, the theme's review policy and the composition source. Voice, music and timing made
    after gate A are not content."""
    proj = pathlib.Path(proj)
    if not is_motion(proj):
        return [script_file(proj)]
    names = ["data/script.json", "data/storyboard.json", "data/profile.json", "data/theme.json", "data/facts.md", "brand.json", "index.html"]
    files = [proj / n for n in names if (proj / n).is_file()]
    files += sorted((proj / "scenes").glob("*.js")) if (proj / "scenes").is_dir() else []
    return files


def content_sha(proj):
    proj = pathlib.Path(proj)
    h = hashlib.sha256()
    for p in content_files(proj):
        h.update(p.relative_to(proj).as_posix().encode() + b"\x00" + file_sha(p).encode() + b"\x00")
    return h.hexdigest()


def inputs_mtime(proj):
    """Modification time of the newest input file: snapshots taken before it are stale."""
    return max(p.stat().st_mtime for p in input_files(proj))


def inputs_sha(proj):
    """One digest of input_files()."""
    proj = pathlib.Path(proj)
    files = input_files(proj)
    h = hashlib.sha256()
    for p in sorted(files):
        h.update(p.relative_to(proj).as_posix().encode() + b"\x00" + file_sha(p).encode() + b"\x00")
    return h.hexdigest()


def load(proj):
    f = proj / "review" / "gates.json"
    return json.loads(f.read_text(encoding="utf8")) if f.exists() else {}


def clean(value):
    return " ".join((value or "").split()).lower()


def stamp(args):
    proj = pathlib.Path(args.project)
    gate = args.gate.upper()
    now = inputs_sha(proj)  # one digest for both the check and the stored stamp
    entry = {"verdict": args.verdict, "reviewer": " ".join(args.reviewer.split()), "author": " ".join((args.author or "").split()),
             "at": datetime.datetime.now().isoformat(timespec="seconds"), "scriptSha": file_sha(script_file(proj)), "contentSha": content_sha(proj), "reviewerKind": args.reviewer_kind or "",
             "notes": args.notes or ""}
    if args.verdict == "pass":
        if not clean(args.reviewer) or not clean(args.author):
            sys.exit("a pass needs both --reviewer and --author (non-blank)")
        if clean(args.reviewer) == clean(args.author):
            sys.exit("reviewer must not be the author: ask another session or model to review")
        if gate in REPORT:
            f = proj / "review" / REPORT[gate]
            if not f.exists():
                sys.exit(f"gate {gate}: run the review script first ({REPORT[gate]} is missing)")
            rep = json.loads(f.read_text(encoding="utf8"))
            if rep["scriptSha"] != entry["scriptSha"]:
                sys.exit(f"gate {gate}: the report is for an older script.json: re-run the review script")
            if gate == "A" and rep.get("contentSha") and rep["contentSha"] != entry["contentSha"]:
                sys.exit("gate A: the reviewed text, storyboard, brand, policy or composition changed after the report: re-run the review script")
            if gate == "A" and rep.get("theme") and (not pathlib.Path(rep["theme"]).is_file()
                                                    or file_sha(rep["theme"]) != rep.get("themeSha")):
                sys.exit("gate A: theme.json changed (or vanished) after the report: re-run review-script.py")
            if gate == "A" and rep.get("theme"):
                entry["theme"], entry["themeSha"] = rep["theme"], rep["themeSha"]
            if rep["errors"]:
                sys.exit(f"gate {gate}: {len(rep['errors'])} error(s) in the report: fix them, then re-run the review script")
            if rep["warnings"] and not clean(args.notes):
                sys.exit(f"gate {gate}: {len(rep['warnings'])} warning(s): --notes must say how each was resolved or why it is fine")
            if gate == "B":
                if rep.get("hyperframes") != "ran":
                    sys.exit("gate B: lint/check were skipped: re-run review-ui.py without --no-hyperframes")
                if rep["dataSha"] != now:
                    sys.exit("gate B: project files changed after the frames were taken: re-run review-ui.py --capture")
        if gate in "BC":
            entry["dataSha"] = now
        if gate == "C":
            art = pathlib.Path(args.artifact or "")
            if not args.artifact or art.suffix.lower() != ".mp4" or not art.is_file():
                sys.exit("gate C: --artifact <the rendered .mp4> is required")
            if problems(proj, ["B"]):
                sys.exit("gate C: gate B is not passed on the current files")
            entry["artifact"], entry["artifactSha"] = str(art.resolve()), file_sha(art)
            receipt = proj / "review" / "render-receipt.json"  # written by `render`: which inputs produced which file
            got = json.loads(receipt.read_text(encoding="utf8")) if receipt.exists() else {}
            if got.get("artifactSha") != entry["artifactSha"] or got.get("inputsSha") != now:
                sys.exit("gate C: this MP4 was not produced by `review-gate.py render` from the current project files: render again")
    state = load(proj)
    state[gate] = entry
    (proj / "review").mkdir(exist_ok=True)
    (proj / "review" / "gates.json").write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf8")
    print(f"gate {gate}: {args.verdict} by {entry['reviewer']}")


def problems(proj, gates):
    state, script = load(proj), file_sha(script_file(proj))
    data = inputs_sha(proj)
    out = []
    for g in gates:
        s = state.get(g)
        if not s:
            out.append(f"gate {g}: not reviewed")
        elif s["verdict"] != "pass":
            out.append(f"gate {g}: reviewer {s['reviewer']} said {s['verdict']}: {s['notes']}")
        elif s["scriptSha"] != script:
            out.append(f"gate {g}: {script_file(proj).name} changed after the review: review again")
        elif g == "A" and s.get("contentSha") and s["contentSha"] != content_sha(proj):
            out.append("gate A: the reviewed text, storyboard, brand, policy or composition changed after the review: review again")
        elif s.get("theme") and (not pathlib.Path(s["theme"]).is_file() or file_sha(s["theme"]) != s["themeSha"]):
            out.append(f"gate {g}: theme.json changed after the review: review again")
        elif g in "BC" and s.get("dataSha") != data:
            out.append(f"gate {g}: project files (timing, narration, html/css/js, widgets, assets) changed after the review: review again")
        elif g == "C" and (not pathlib.Path(s.get("artifact", "")).is_file() or file_sha(s["artifact"]) != s["artifactSha"]):
            out.append("gate C: the stamped MP4 is missing or was replaced: review the current render")
    return out


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("stamp")
    s.add_argument("--project", required=True)
    s.add_argument("--gate", required=True, choices=list("ABCabc"))
    s.add_argument("--reviewer", required=True)
    s.add_argument("--author")
    s.add_argument("--verdict", required=True, choices=["pass", "fail"])
    s.add_argument("--notes")
    s.add_argument("--artifact", help="gate C: the rendered MP4 that was reviewed")
    s.add_argument("--reviewer-kind", choices=["model", "subagent", "human"], help="what kind of reviewer: a different model/tool, a fresh subagent, or a person")
    r = sub.add_parser("require")
    r.add_argument("--project", required=True)
    r.add_argument("--gates", default="A,B")
    r.add_argument("--purpose", choices=["channel", "sale"], default="channel",
                   help="sale (a demo or product sold publicly) = A, B and C, every stamp naming its reviewer kind")
    rc = sub.add_parser("receipt")
    rc.add_argument("--project", required=True)
    rc.add_argument("--output", required=True)
    rc.add_argument("--expect-inputs-sha", required=True, help="the `hash` taken before the render (required): the receipt is refused, and the MP4 removed, if the files changed since")
    sub.add_parser("hash").add_argument("--project", required=True)
    t = sub.add_parser("status")
    t.add_argument("--project", required=True)
    w = sub.add_parser("render")
    w.add_argument("--project", required=True)
    w.add_argument("--output", required=True)
    w.add_argument("--quality", default="high", choices=["draft", "standard", "high"])
    args = ap.parse_args()
    if args.cmd == "stamp":
        stamp(args)
        return
    proj = pathlib.Path(args.project)
    if args.cmd == "hash":
        print(inputs_sha(proj))
        return
    if args.cmd == "receipt":
        out = pathlib.Path(args.output)
        if not out.is_file():
            sys.exit(f"no MP4 at {out}")
        now = inputs_sha(proj)
        if not re.fullmatch(r"[0-9a-f]{64}", args.expect_inputs_sha or ""):
            sys.exit("--expect-inputs-sha must be the 64-character hash printed by `review-gate.py hash` before the render")
        if args.expect_inputs_sha != now:
            out.unlink(missing_ok=True)
            sys.exit("project files changed during the render: output removed, review again and re-render")
        (proj / "review").mkdir(exist_ok=True)
        (proj / "review" / "render-receipt.json").write_text(json.dumps(
            {"artifact": str(out.resolve()), "artifactSha": file_sha(out), "inputsSha": now}), encoding="utf8")
        print(f"receipt written for {out.name}")
        return
    gates = args.gates.upper().split(",") if args.cmd == "require" else ["A", "B"] if args.cmd == "render" else list("ABC")
    if args.cmd == "require" and args.purpose == "sale":
        gates = list("ABC")
    bad = problems(proj, gates)
    if args.cmd == "require" and args.purpose == "sale":
        state = load(proj)
        bad += [f"gate {g}: sale needs --reviewer-kind on the stamp (model, subagent or human)" for g in gates
                if state.get(g, {}).get("verdict") == "pass" and not state[g].get("reviewerKind")]
    for b in bad:
        print("  x", b)
    if args.cmd == "render" and is_motion(proj):
        sys.exit("motion project: render with scripts/render-and-verify.mjs (it requires A and B and writes the receipt)")
    if args.cmd == "status":
        failed = {b.split(":")[0].split()[1] for b in bad}
        print("; ".join(f"{g}: {'stale/missing' if g in failed else 'pass'}" for g in gates))
    else:
        print("review gates OK" if not bad else f"{len(bad)} gate(s) not passed: do not render")
    if bad:
        sys.exit(1)
    if args.cmd == "render":
        if any(c in args.output for c in '&|<>^%"!'):  # npx.cmd is a batch file: keep cmd.exe metacharacters out of the path
            sys.exit("--output must not contain & | < > ^ % \" !")
        npx = shutil.which("npx.cmd") or shutil.which("npx")
        if not npx:
            sys.exit("npx not found on PATH")
        cmd = [npx, "hyperframes", "render", "--quality", args.quality, "--output", str(pathlib.Path(args.output).resolve())]
        before = inputs_sha(proj)
        pathlib.Path(args.output).unlink(missing_ok=True)  # a failed render must not leave an older file to be stamped
        code = subprocess.run(cmd, cwd=proj).returncode  # argument list, no shell: the path is never interpreted
        out = pathlib.Path(args.output)
        if code != 0:
            out.unlink(missing_ok=True)  # never leave a partial file for gate C to stamp
        if inputs_sha(proj) != before:  # an input changed while rendering: the file mixes reviewed and unreviewed state
            out.unlink(missing_ok=True)
            sys.exit("project files changed during the render: output removed, review again and re-render")
        if code == 0 and not out.is_file():
            sys.exit("render finished without producing the output file")
        if code == 0:
            (proj / "review").mkdir(exist_ok=True)
            (proj / "review" / "render-receipt.json").write_text(json.dumps(
                {"artifact": str(out.resolve()), "artifactSha": file_sha(out), "inputsSha": before}), encoding="utf8")
        sys.exit(code)


if __name__ == "__main__":
    main()
