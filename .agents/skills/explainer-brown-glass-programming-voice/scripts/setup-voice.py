"""One-time setup of the free local voice (VieNeu-TTS, + Kokoro when the skill reads English lines). Safe to re-run.

  python setup-voice.py                 # install (skips what is already there), then a 2-second test read
  python setup-voice.py --check         # only report: exit 0 = ready, 1 = not ready
  python setup-voice.py --voice "Hải Đăng"   # also make this voice your default for every skill (~/.agentvid/voice.json)

What it does (first run ~2–5 min, ~1.2 GB disk, no GPU and no API key needed):
  1. needs `uv` (a Python installer); if missing it prints the one-line command to install it
  2. makes ~/.agentvid/vieneu-env (Python 3.12) and installs `vieneu` (+ `kokoro-onnx` for English lines)
  3. downloads the voice model on the test read (VieNeu v3 Turbo ~580 MB; Kokoro int8 ~120 MB)
  4. writes ~/.agentvid/voice.json {"engine": "vieneu"} so tts.py uses the local voice
Set AGENTVID_HOME to put everything somewhere else.
"""
import argparse
import json
import os
import pathlib
import shutil
import subprocess
import sys
import time
import urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import voice_common as vc  # noqa: E402

UV_HINT = {
    "nt": 'powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"',
    "posix": "curl -LsSf https://astral.sh/uv/install.sh | sh",
}


def step(n, msg):
    print(f"[{n}/4] {msg}", flush=True)


def needs_english():
    """True when this skill (or a theme bundled in it) reads {English} lines with Kokoro."""
    themes = [vc.theme_json()] + [json.loads(p.read_text(encoding="utf8")) for p in vc.SKILL_DIR.glob("themes/*/theme.json")]
    return any(t.get("voice", {}).get("en", {}).get("engine") == "kokoro" for t in themes)


def env_has(module):
    py = vc.env_python()
    return py.exists() and subprocess.run([str(py), "-c", f"import {module}"], capture_output=True).returncode == 0


def status():
    en = needs_english()
    ok = {"env": vc.env_python().exists(), "vieneu": env_has("vieneu")}
    if en:
        ok["kokoro"] = env_has("kokoro_onnx") and all((vc.KOKORO_DIR / n).exists() for n in vc.KOKORO_FILES)
    return ok


def download(url, dest):
    tmp = dest.with_suffix(dest.suffix + ".part")
    with urllib.request.urlopen(url, timeout=60) as r, open(tmp, "wb") as f:
        size, got, last = int(r.headers.get("Content-Length") or 0), 0, 0
        while chunk := r.read(1 << 20):
            f.write(chunk)
            got += len(chunk)
            if size and got * 10 // size > last:
                last = got * 10 // size
                print(f"    {dest.name}: {got * 100 // size}%", flush=True)
    tmp.replace(dest)


def main():
    vc.utf8_stdout()
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--voice", help="make this VieNeu voice your default for all skills")
    args = ap.parse_args()
    st = status()
    if args.check:
        print(json.dumps({"home": str(vc.HOME), **st}))
        sys.exit(0 if all(st.values()) else 1)

    t0 = time.time()
    step(1, "checking uv")
    uv = shutil.which("uv")
    if not uv:
        print("  uv is not installed. Install it with this one command, open a new terminal, then re-run this script:")
        print("    " + UV_HINT["nt" if os.name == "nt" else "posix"])
        sys.exit(2)

    step(2, f"Python env {vc.VIENEU_ENV}")
    vc.HOME.mkdir(parents=True, exist_ok=True)
    if not st["env"]:
        subprocess.run([uv, "venv", "--python", "3.12", str(vc.VIENEU_ENV)], check=True)
    pkgs = [] if st["vieneu"] else ["vieneu"]
    if needs_english() and not env_has("kokoro_onnx"):
        pkgs += ["kokoro-onnx", "soundfile"]
    if pkgs:
        print(f"  installing {', '.join(pkgs)} (~1 min)")
        subprocess.run([uv, "pip", "install", "--python", str(vc.env_python()), *pkgs, "onnxruntime<1.23", "av<17"], check=True)
    else:
        print("  already installed")

    step(3, "voice models")
    if needs_english():
        vc.KOKORO_DIR.mkdir(parents=True, exist_ok=True)
        for name, url in vc.KOKORO_FILES.items():
            if not (vc.KOKORO_DIR / name).exists():
                print(f"  downloading English voice {name}")
                download(url, vc.KOKORO_DIR / name)
    prefs = json.loads(vc.VOICE_JSON.read_text(encoding="utf8")) if vc.VOICE_JSON.exists() else {}
    prefs["engine"] = "vieneu"
    if args.voice:
        prefs["voice"] = args.voice
    vc.VOICE_JSON.write_text(json.dumps(prefs, ensure_ascii=False, indent=1), encoding="utf8")

    step(4, "test read (the first run downloads the Vietnamese model, ~580 MB)")
    test = vc.HOME / "voice-test.mp3"
    text = "Xin chào, giọng đọc đã sẵn sàng." + (" {Ready to go.}" if needs_english() else "")
    tts = pathlib.Path(__file__).resolve().parent / "tts-vieneu.py"
    r = subprocess.run([str(vc.env_python()), str(tts), "--text", text, "--out", str(test)])
    if r.returncode:
        sys.exit("test read failed (see the error above); re-run this script to retry")
    print(f"done in {time.time() - t0:.0f}s: voice {vc.voice_settings('vieneu')['vi']}, test file {test}")
    print("next: python <SKILL_DIR>/scripts/tts.py --project <project>")


if __name__ == "__main__":
    main()
