"""Gate A (content review), motion edition: check what a viewer will read and hear BEFORE any voice, music or render work.

  python review-motion-script.py --project <project> [--theme <project>/data/theme.json]

Reads data/script.json (the spoken and captioned lines, `source`), data/storyboard.json and data/profile.json (on-screen text),
brand.json (name, tagline) and, for brand words only, the string literals of index.html and scenes/*.js.
Errors (exit 1): script.json without a `source` that says where the facts come from or that they are examples; a real
brand, product or person name from the theme's `review.brandBlocklist` in the script or storyboard; any text matching the
theme's `review.forbiddenText` [{pattern, note}] (house rules such as "no dashes or arrows"), spoken or on screen.
Warnings (each needs a written answer in the stamp notes): absolute claims, numbers with no facts.md and no "example/estimate"
wording, a blocklisted brand inside the composition source, the theme's `review.risks` patterns, a script of one scene.
Writes <project>/review/content-review.{json,md}. The reviewer must read the md, open the cited sources and answer the checklist.
"""
import argparse
import hashlib
import importlib.util
import json
import pathlib
import re
import sys
import unicodedata

ABSOLUTE = ["tuyệt đối", "chắc chắn", "luôn luôn", "không bao giờ", "100%", "guaranteed", "always", "never", "definitely",
            "absolutely", "number one", "số một", "#1"]
EXAMPLE_CUES = ["ví dụ", "minh hoạ", "minh họa", "ước tính", "số minh hoạ", "không có số", "example", "illustrative", "estimate",
                "sample", "no figures", "no measured", "not measured"]
NUMBER = re.compile(r"\d")
CHECKLIST = [
    "Every claim and number on screen or in the voice has a source in facts.md or is labelled an example.",
    "No real brand, product, company or person name appears unless the project is about it.",
    "The first line is a hook a stranger understands in 3 seconds; no jargon the audience does not know.",
    "The voice says what the captions show; nothing promises a result.",
]


def load_gate():
    here = pathlib.Path(__file__).resolve()
    shared = here.with_name("review-gate.py")  # built skills carry a copy; the kit source keeps one in kits/review-gates
    if not shared.is_file():
        shared = here.parents[3] / "review-gates" / "review-gate.py"
    spec = importlib.util.spec_from_file_location("review_gate", shared)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def read_json(path):
    return json.loads(pathlib.Path(path).read_text(encoding="utf-8-sig")) if pathlib.Path(path).is_file() else None


def strings(node):
    if isinstance(node, str):
        yield unicodedata.normalize("NFC", node)
    elif isinstance(node, dict):
        for v in node.values():
            yield from strings(v)
    elif isinstance(node, list):
        for v in node:
            yield from strings(v)


# keys whose strings are identifiers, files, colours or enums, not words a viewer reads
NOT_TEXT_KEYS = {"id", "type", "kind", "icon", "color", "colour", "bg", "fg", "pose", "prop", "style", "src", "path", "url", "font", "align",
                 "side", "anchor", "ease", "easing", "variant", "mode", "shape", "asset", "image", "photo", "logo", "layout", "slug", "lang", "language"}


def visible_strings(node, key=""):
    """Strings that can be read on screen: everything except values under identifier-like keys, and bare numbers/paths/colours."""
    if isinstance(node, str):
        s = node.strip()
        if key not in NOT_TEXT_KEYS and re.search(r"[^\W\d_]{2,}", s) and not re.fullmatch(r"[#\w./:-]+\.(?:png|jpe?g|svg|webp|mp4|m4a|json|js)", s, re.I):
            yield s
    elif isinstance(node, dict):
        for k, v in node.items():
            yield from visible_strings(v, k)
    elif isinstance(node, list):
        for v in node:
            yield from visible_strings(v, key)


def source_literals(proj):
    """String literals of the composition source: words that can reach the screen without passing through the data files."""
    out = []
    files = [proj / "index.html", *sorted((proj / "scenes").glob("*.js"))] if (proj / "scenes").is_dir() else [proj / "index.html"]
    for f in files:
        if f.is_file():
            out += re.findall(r"""["'`]([^"'`\n]{3,120})["'`]""", f.read_text(encoding="utf-8", errors="replace"))
    return out


def review(proj, theme):
    rv = (theme or {}).get("review", {})
    errors, warnings = [], []
    script = read_json(proj / "data" / "script.json")
    board = read_json(proj / "data" / "storyboard.json")
    profile = read_json(proj / "data" / "profile.json")
    brand = read_json(proj / "brand.json")
    spoken = [ln.get("text", "") for sc in (script or {}).get("scenes", []) for ln in sc.get("lines", [])]
    on_screen = list(strings(board)) + list(strings(profile)) + [s for k in ("name", "tagline", "outroLine") for s in strings((brand or {}).get(k))]
    texts = [unicodedata.normalize("NFC", t) for t in spoken] + on_screen
    joined = " ".join(texts).lower()

    if not (any(t.strip() for t in spoken) or list(visible_strings(board)) or list(visible_strings(profile))):
        errors.append("no text to review: data/script.json, data/storyboard.json or data/profile.json is missing or has no text")
    for name, doc in (("storyboard", board), ("profile", profile)):
        if doc is not None and not list(visible_strings(doc)):
            errors.append(f"data/{name}.json has no text")
    if script is not None:
        if not (script.get("scenes") or []):
            errors.append("data/script.json has no scenes")
        source = unicodedata.normalize("NFC", script.get("source") or "").strip().lower()
        if not source:
            errors.append('script.json needs a "source": where the facts come from, or that the numbers are examples')
        if len((script.get("scenes") or [])) < 2:
            warnings.append("the script has fewer than 2 scenes: a motion video needs a beginning and an ending")
    else:
        source = ""
    for brand_name in rv.get("brandBlocklist", []):
        pat = re.compile(rf"(?<!\w){re.escape(unicodedata.normalize('NFC', brand_name))}(?!\w)", re.I)
        if any(pat.search(t) for t in texts):
            errors.append(f"real brand/product name in the script or storyboard: {brand_name}")
        elif any(pat.search(t) for t in source_literals(proj)):
            warnings.append(f"{brand_name} appears in the composition source (index.html or scenes/*.js): check it is not shown on screen")
    for rule in rv.get("forbiddenText", []):  # opt-in per theme; an error, unlike `risks`
        forbidden = re.compile(unicodedata.normalize("NFC", rule["pattern"]))
        for text in texts:
            hit = forbidden.search(text)
            if hit:
                errors.append(f"forbidden text {hit.group(0)!r}: {rule['note']}")
                break
    for word in ABSOLUTE:
        if re.search(rf"(?<!\w){re.escape(word)}(?!\w)", joined):
            warnings.append(f'absolute claim "{word}": remove it or show the source')
    facts = proj / "data" / "facts.md"
    has_numbers = any(NUMBER.search(t) for t in texts)
    if has_numbers and not (facts.is_file() and facts.read_text(encoding="utf-8", errors="replace").strip()) \
            and not any(c in source or c in joined for c in EXAMPLE_CUES):
        warnings.append("numbers on screen or in the voice, but no data/facts.md and no 'example/estimate' wording: add the source")
    for risk in rv.get("risks", []):
        if re.search(risk["pattern"], joined, re.I):
            warnings.append(f"policy/legal risk: {risk['note']}")
    return errors, warnings, rv.get("checklist", [])


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--theme", help="theme.json with a review block (default: <project>/data/theme.json)")
    args = ap.parse_args()
    proj = pathlib.Path(args.project)
    gate = load_gate()
    if not gate.is_motion(proj):
        sys.exit("not a motion project (no data/script.json, storyboard.json or timeline-config.json); explainer projects use review-script.py")
    theme_file = pathlib.Path(args.theme) if args.theme else proj / "data" / "theme.json"
    theme = read_json(theme_file) if theme_file.is_file() else {}
    errors, warnings, extra = review(proj, theme)
    sha = hashlib.sha256(gate.script_file(proj).read_bytes()).hexdigest()
    out = proj / "review"
    out.mkdir(exist_ok=True)
    (out / "content-review.json").write_text(json.dumps(
        {"gate": "A", "scriptSha": sha, "contentSha": gate.content_sha(proj), "errors": errors, "warnings": warnings}, ensure_ascii=False, indent=2), encoding="utf8")
    md = [f"# Gate A content review (motion): {proj.name}", "", f"{len(errors)} error(s) · {len(warnings)} warning(s)", "", "## Errors"] \
        + ([f"- {e}" for e in errors] or ["- none"]) + ["", "## Warnings"] + ([f"- {w}" for w in warnings] or ["- none"]) \
        + ["", "## Reviewer checklist"] + [f"- [ ] {c}" for c in CHECKLIST + extra] + ["", "## Verdict", "- pass / fail + notes", ""]
    (out / "content-review.md").write_text("\n".join(md), encoding="utf8")
    for e in errors:
        print("  x", e)
    for w in warnings:
        print("  !", w)
    print(f"Gate A: {len(errors)} error(s), {len(warnings)} warning(s) -> {out / 'content-review.md'}")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
