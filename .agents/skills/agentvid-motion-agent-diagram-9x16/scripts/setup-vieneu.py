"""One-time setup of the free local Vietnamese voice (VieNeu-TTS). Safe to re-run.

  python scripts/setup-vieneu.py            # create the env if missing, then a short test read
  python scripts/setup-vieneu.py --align    # also the local word aligner (faster-whisper "small", ~500 MB): captions
                                            # without any API key
  python scripts/setup-vieneu.py --check    # exit 0 when ready, 1 when not

Makes <AGENTVID_HOME or ~/.agentvid>/vieneu-env (Python 3.12 via `uv`) and installs `vieneu`.
First run: ~2-5 min, ~1.1 GB (the model downloads on the test read). CPU only, no API key.
The AgentVid explainer skills share the same env, so it may already exist.
onnxruntime is pinned below 1.23: newer builds broke fresh installs (VieNeu/Kokoro fail to load).
"""
import os
import pathlib
import shutil
import subprocess
import sys
import re

HOME = pathlib.Path(os.environ.get("AGENTVID_HOME", pathlib.Path.home() / ".agentvid"))
ENV = HOME / "vieneu-env"
PY = ENV / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
ONNX_PIN = "onnxruntime<1.23"
ONNXRUNTIME_VERSION = re.compile(
    r"^(?P<release>\d+(?:\.\d+)+)(?P<pre>(?:a|b|rc)\d+)?"
    r"(?P<post>\.post\d+)?(?P<dev>\.dev\d+)?"
    r"(?:\+[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*)?$"
)
UV_HINT = {
    "nt": 'powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"',
    "posix": "curl -LsSf https://astral.sh/uv/install.sh | sh",
}


def has(module):
    return PY.exists() and subprocess.run([str(PY), "-c", f"import {module}"], capture_output=True).returncode == 0


def onnx_version_supported(version):
    match = ONNXRUNTIME_VERSION.fullmatch(version or "")
    if not match:
        return False
    release = tuple(map(int, match.group("release").split(".")))
    release = (release + (0, 0, 0))[:3]
    boundary = (1, 23, 0)
    if release != boundary:
        return release < boundary
    return bool(match.group("pre") or (match.group("dev") and not match.group("post")))


def installed_onnx_version():
    if not PY.exists():
        return None
    code = "import importlib.metadata as m; print(m.version('onnxruntime'))"
    result = subprocess.run([str(PY), "-c", code], capture_output=True, text=True)
    return result.stdout.strip() if result.returncode == 0 else None


def ready():
    return (has("vieneu") and onnx_version_supported(installed_onnx_version())
            and ("--align" not in sys.argv or has("faster_whisper")))


def main():
    if "--check" in sys.argv:
        is_ready = ready()
        version = installed_onnx_version()
        detail = "" if version and onnx_version_supported(version) else f" (onnxruntime {version or 'missing'}; need <1.23)"
        print("ready" if is_ready else f"not ready: {ENV}{detail}")
        sys.exit(0 if is_ready else 1)
    if not ready():
        uv = shutil.which("uv")
        if not uv:
            sys.exit(f"`uv` is missing. Install it with:\n  {UV_HINT['nt' if os.name == 'nt' else 'posix']}\nthen re-run this script.")
        HOME.mkdir(parents=True, exist_ok=True)
        if not PY.exists():
            subprocess.run([uv, "venv", "--python", "3.12", str(ENV)], check=True)
        pkgs = ([] if has("vieneu") else ["vieneu"]) + (["faster-whisper"] if "--align" in sys.argv and not has("faster_whisper") else [])
        subprocess.run([uv, "pip", "install", "--python", str(PY), *pkgs, ONNX_PIN], check=True)
    test = HOME / "vieneu-test.wav"
    code = f"from vieneu import Vieneu; t=Vieneu(); t.save(t.infer('Xin chào, giọng đọc đã sẵn sàng.', voice='Thanh Bình'), r'{test}')"
    subprocess.run([str(PY), "-c", code], check=True, env={**os.environ, "PYTHONIOENCODING": "utf-8"})
    print(f"VieNeu ready: {PY}\ntest read: {test}")
    if "--align" in sys.argv:  # the first run downloads the recogniser model: do it now, on the test read
        asr = pathlib.Path(__file__).with_name("transcribe-words-local.py")
        subprocess.run([str(PY), str(asr), str(test), "--language", "vi", "--out", str(HOME / "align-test.json")], check=True,
                       env={**os.environ, "PYTHONIOENCODING": "utf-8", "HF_HUB_DISABLE_SYMLINKS_WARNING": "1"})
        print('local aligner ready: script.json "align": "auto" (or "local") now works without a key')


if __name__ == "__main__":
    main()
