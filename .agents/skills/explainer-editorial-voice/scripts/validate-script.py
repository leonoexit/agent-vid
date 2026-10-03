"""Validate renderable content and estimate duration; no subject or story formula is enforced."""
import argparse
import json
import math
import pathlib
import sys
import re
import unicodedata

import voice_common as vc

ICONS = {"box", "pin", "document", "magnifier", "cup", "clock", "beaker", "leaf", "code", "lightbulb", "arrow", "check"}
KINDS = {"sequence", "comparison", "code", "callout", "checklist", "stat", "quote", "diagram", "illustration"}


def tokens(value):
    return re.findall(r"[^\W_]+", unicodedata.normalize("NFC", str(value)).lower())


def validate(script, voiced=True):
    errors = []

    def string(value, path, maximum, required=True):
        if not isinstance(value, str) or (required and not value.strip()):
            errors.append(f"{path}: expected {'non-empty ' if required else ''}text")
        elif len(value) > maximum:
            errors.append(f"{path}: {len(value)} characters; limit {maximum}")

    def icon(value, path):
        if value is not None and (not isinstance(value, str) or value not in ICONS):
            errors.append(f"{path}: unknown icon {value!r}")

    def items(value, path, low, high):
        if not isinstance(value, list) or not low <= len(value) <= high:
            errors.append(f"{path}: expected {low}–{high} entries")
            return []
        return value

    def cue(value, scene, path):
        if not isinstance(value, dict):
            errors.append(f"{path}: expected cue object")
            return
        if ("on" in value) == ("at" in value):
            errors.append(f"{path}: choose on (spoken phrase) or at (seconds), exactly one")
        elif "at" in value:
            at = value["at"]
            if not isinstance(at, (int, float)) or isinstance(at, bool) or not math.isfinite(at) or at < 0:
                errors.append(f"{path}.at: expected non-negative finite seconds")
        else:
            string(value["on"], f"{path}.on", 100)
            occurrence = value.get("occurrence", 1)
            if not isinstance(occurrence, int) or isinstance(occurrence, bool) or occurrence < 1:
                errors.append(f"{path}.occurrence: expected positive integer")
                return
            needle, spoken = tokens(value["on"]), tokens(scene.get("vo", ""))
            matches = sum(spoken[i:i+len(needle)] == needle for i in range(len(spoken)-len(needle)+1)) if needle else 0
            if matches < occurrence:
                errors.append(f'{path}.on: phrase/occurrence not found in scene narration')

    models = {}
    previous = None
    try:
        vc.script_language(script)
    except ValueError as exc:
        errors.append(str(exc))
    for key, limit in {"title": 40, "subtitle": 70, "brand": 22, "series": 22, "tag": 36, "edition": 14, "kicker": 30}.items():
        if key in script or key == "title":
            string(script.get(key), key, limit)
    for part in ("intro", "outro"):
        value = script.get(part)
        if not isinstance(value, dict):
            errors.append(f"{part}: expected object")
            continue
        for key, limit in {"line1": 40, "line2a": 36, "line2b": 36, "line2": 75, "line3": 90, "credit": 80}.items():
            if key in value or key == "line1":
                string(value.get(key), f"{part}.{key}", limit, key not in {"credit", "line2a", "line2b"})
        icon(value.get("icon"), f"{part}.icon")
        if voiced:
            string(value.get("vo"), f"{part}.vo", 1500)
    scenes = items(script.get("scenes"), "scenes", 1, 12)
    for i, scene in enumerate(scenes, 1):
        path = f"scene {i}"
        if not isinstance(scene, dict):
            errors.append(f"{path}: expected object")
            continue
        string(scene.get("title"), f"{path}.title", 44)
        for key, limit in {"subtitle": 75, "after": 90}.items():
            if key in scene:
                string(scene[key], f"{path}.{key}", limit, False)
        if voiced:
            string(scene.get("vo"), f"{path}.vo", 1500)
        w = scene.get("widget", {})
        if not isinstance(w, dict) or not isinstance(w.get("kind"), str) or w.get("kind") not in KINDS:
            errors.append(f"{path}.widget: choose {', '.join(sorted(KINDS))}")
            continue
        kind = w["kind"]
        if "afterOn" in scene:
            cue({"on": scene["afterOn"]}, scene, f"{path}.afterOn")
        if kind != "diagram":
            previous = None
        if kind == "sequence":
            steps = items(w.get("steps"), f"{path}.steps", 1, 4)
            for j, step in enumerate(steps):
                if not isinstance(step, dict):
                    errors.append(f"{path}.steps[{j}]: expected object")
                    continue
                string(step.get("title"), f"{path}.steps[{j}].title", 24)
                if step.get("text") is not None:
                    string(step["text"], f"{path}.steps[{j}].text", 56, False)
                icon(step.get("icon"), f"{path}.steps[{j}].icon")
                if "on" in step:
                    cue(step, scene, f"{path}.steps[{j}]")
        elif kind == "comparison":
            for side in ("left", "right"):
                d = w.get(side, {})
                if not isinstance(d, dict):
                    errors.append(f"{path}.{side}: expected object")
                    continue
                string(d.get("title"), f"{path}.{side}.title", 28)
                icon(d.get("icon"), f"{path}.{side}.icon")
                for j, value in enumerate(items(d.get("items"), f"{path}.{side}.items", 1, 4)):
                    string(value, f"{path}.{side}.items[{j}]", 45)
                if "total" in d:
                    string(d["total"], f"{path}.{side}.total", 24)
        elif kind == "code":
            string(w.get("code"), f"{path}.code", 400)
            if isinstance(w.get("code"), str):
                lines = w["code"].splitlines()
                if len(lines) > 7 or any(len(line) > 38 for line in lines):
                    errors.append(f"{path}.code: at most 7 lines, 38 characters per line")
            for key, limit in {"language": 24, "result": 90}.items():
                if key in w:
                    string(w[key], f"{path}.{key}", limit)
            if "resultOn" in w:
                cue({"on": w["resultOn"]}, scene, f"{path}.resultOn")
        elif kind == "callout":
            string(w.get("text"), f"{path}.text", 90)
            if "detail" in w:
                string(w["detail"], f"{path}.detail", 90)
            icon(w.get("icon"), f"{path}.icon")
        elif kind == "checklist":
            for j, value in enumerate(items(w.get("items"), f"{path}.items", 1, 5)):
                string(value, f"{path}.items[{j}]", 65)
        elif kind == "stat":
            for j, value in enumerate(items(w.get("items"), f"{path}.items", 1, 2)):
                if not isinstance(value, dict):
                    errors.append(f"{path}.items[{j}]: expected object")
                    continue
                v = value.get("value")
                if not isinstance(v, (int, float)) or isinstance(v, bool) or not math.isfinite(v) or len(str(v)) > 8:
                    errors.append(f"{path}.items[{j}].value: finite number, at most 8 characters")
                string(value.get("label"), f"{path}.items[{j}].label", 45)
                if "unit" in value:
                    string(value["unit"], f"{path}.items[{j}].unit", 20, False)
        elif kind == "diagram":
            key = w.get("continuity")
            string(key, f"{path}.continuity", 40)
            if not isinstance(key, str):
                continue
            if key in models:
                if previous != key:
                    errors.append(f"{path}: continuity must use consecutive diagram scenes")
                if any(field in w for field in ("nodes", "edges", "note")):
                    errors.append(f"{path}: initialize nodes/edges/note only in the first continuity scene")
            else:
                nodes = items(w.get("nodes"), f"{path}.nodes", 2, 3)
                ids = []
                for j, n in enumerate(nodes):
                    if not isinstance(n, dict):
                        errors.append(f"{path}.nodes[{j}]: expected object")
                        continue
                    for field, limit in {"id": 24, "label": 18, "value": 14, "detail": 24}.items():
                        if field != "detail" or field in n:
                            string(n.get(field), f"{path}.nodes[{j}].{field}", limit)
                    if isinstance(n.get("id"), str):
                        ids.append(n["id"])
                if len(ids) != len(set(ids)):
                    errors.append(f"{path}: duplicate node IDs")
                edges = items(w.get("edges", []), f"{path}.edges", 0, 3)
                pairs = set()
                for e in edges:
                    if not isinstance(e, dict) or e.get("from") not in ids or e.get("to") not in ids or e.get("from") == e.get("to"):
                        errors.append(f"{path}: edge must connect two existing, different node IDs")
                    else:
                        pair = (e["from"], e["to"])
                        if pair in pairs:
                            errors.append(f"{path}: duplicate edge")
                        pairs.add(pair)
                models[key] = (set(ids), pairs)
                if "note" in w:
                    string(w["note"], f"{path}.note", 70, False)
            previous = key
            ids, pairs = models[key]
            for j, e in enumerate(items(w.get("events", []), f"{path}.events", 0, 8)):
                ep = f"{path}.events[{j}]"
                cue(e, scene, ep)
                if not isinstance(e, dict):
                    continue
                if not any(field in e for field in ("set", "focus", "edge", "note")):
                    errors.append(f"{ep}: provide a state or emphasis change")
                if "set" in e:
                    if not isinstance(e["set"], dict):
                        errors.append(f"{ep}.set: expected node ID → display text")
                    else:
                        for node, value in e["set"].items():
                            if node not in ids:
                                errors.append(f"{ep}.set: unknown node {node}")
                            string(value, f"{ep}.set.{node}", 14)
                if "focus" in e:
                    for node in items(e["focus"], f"{ep}.focus", 0, 3):
                        if not isinstance(node, str) or node not in ids:
                            errors.append(f"{ep}.focus: unknown node {node}")
                if "edge" in e:
                    edge = e["edge"]
                    if not isinstance(edge, dict) or not isinstance(edge.get("from"), str) or not isinstance(edge.get("to"), str) or (edge["from"], edge["to"]) not in pairs:
                        errors.append(f"{ep}.edge: use an initialized edge")
                if "note" in e:
                    string(e["note"], f"{ep}.note", 70, False)
        elif kind == "illustration":
            src = w.get("src")
            string(src, f"{path}.src", 180)
            if isinstance(src, str):
                asset = pathlib.PurePosixPath(src)
                if not src.startswith("assets/illustrations/") or ".." in asset.parts or "\\" in src or asset.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp", ".svg"}:
                    errors.append(f"{path}.src: use a local image inside assets/illustrations/")
            string(w.get("alt"), f"{path}.alt", 180)
            if "caption" in w:
                string(w["caption"], f"{path}.caption", 100)
        elif kind == "quote":
            string(w.get("text"), f"{path}.text", 180)
            if "author" in w:
                string(w["author"], f"{path}.author", 55)
    return errors


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--project", type=pathlib.Path, required=True)
    ap.add_argument("--target", type=float)
    ap.add_argument("--music-only", action="store_true")
    args = ap.parse_args()
    try:
        script = json.loads((args.project / "script.json").read_text(encoding="utf-8-sig"))
        if not isinstance(script, dict):
            raise ValueError("script.json must contain an object")
    except (OSError, ValueError) as exc:
        sys.exit(str(exc))
    problems = validate(script, not args.music_only)
    for i, scene in enumerate(script.get("scenes", []), 1):
        w = scene.get("widget", {}) if isinstance(scene, dict) else {}
        if isinstance(w, dict) and w.get("kind") == "illustration" and isinstance(w.get("src"), str):
            if not (args.project / w["src"]).is_file():
                problems.append(f"scene {i}: missing illustration asset {w['src']}")
    if not problems:
        language = vc.script_language(script)
        if args.music_only:
            seconds = sum(vc.screen_seconds(script).values())
        else:
            voice = vc.voice_settings(project=args.project)
            seconds = 0
            for i, (_, vo) in enumerate(vc.sections(script)):
                duration = sum(len(t.split()) / (2.5 if lang == "en" else voice["wps"]) for lang, t in vc.split_langs(vo, language))
                seconds += max(5 if i == 0 else 6 if i == len(script["scenes"]) + 1 else 6.5, duration + 1.25)
            print(f"Estimated duration: {seconds:.1f}s; {len(script['scenes'])} scenes")
        if args.target and abs(seconds - args.target) > 0.15 * args.target:
            problems.append(f"estimate {seconds:.1f}s differs from target {args.target:.1f}s by more than 15%; adjust narration")
    for problem in problems:
        print(f"  x {problem}")
    print("OK" if not problems else f"{len(problems)} problem(s)")
    sys.exit(bool(problems))


if __name__ == "__main__":
    main()
