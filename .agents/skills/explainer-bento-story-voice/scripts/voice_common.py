"""Shared helpers for the narration scripts (Python stdlib only, importable from any Python).

- Where local voice files live: ~/.agentvid (override with AGENTVID_HOME)
    vieneu-env/        Python 3.12 env with VieNeu-TTS (+ kokoro-onnx for English), made by setup-voice.py
    models/kokoro/     Kokoro English model files (only for skills whose theme reads English lines)
    voice.json         the user's own choice: {"engine": "vieneu", "voice": "Hải Đăng"} (optional keys)
    keys.env           API keys for paid engines (KEY=VALUE lines), never inside a project
- Which engine and voice a skill uses: voice_settings() = theme.json "voice" preset, overridden by voice.json.
- Script sections, {English} splitting, media length, key lookup: used by every tts-*.py.
- screen_seconds(): section lengths for a music-only video (no voice), used by sync-narration.py and validate-script.py.
"""
import json
import os
import pathlib
import re
import subprocess
import sys

HOME = pathlib.Path(os.environ.get("AGENTVID_HOME") or pathlib.Path.home() / ".agentvid")
VIENEU_ENV = HOME / "vieneu-env"
VOICE_JSON = HOME / "voice.json"
KOKORO_DIR = HOME / "models" / "kokoro"
KOKORO_FILES = {  # int8 model: 92 MB instead of 310 MB, same voices
    "kokoro-v1.0.int8.onnx": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx",
    "voices-v1.0.bin": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin",
}
SKILL_DIR = pathlib.Path(__file__).resolve().parent.parent
# Measured speaking rates (space-separated Vietnamese syllables per second) used to estimate video length.
ENGINE_WPS = {"vieneu": 4.5, "elevenlabs": 3.2}
DEFAULT_VOICE = {"engine": "vieneu", "vi": "Hải Đăng", "en": {"engine": "vieneu", "voice": None}}
LANGUAGE_ALIASES = {
    "vi": "vi", "vn": "vi", "vi-vn": "vi", "vietnamese": "vi", "tiếng việt": "vi", "tieng viet": "vi",
    "en": "en", "eng": "en", "en-us": "en", "en-gb": "en", "english": "en",
    "mixed": "mixed", "mix": "mixed", "bilingual": "mixed", "multilingual": "mixed",
}


def utf8_stdout():
    # Windows consoles default to cp1252; Vietnamese output would crash print().
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def env_python():
    """The local voice env's interpreter (may not exist yet)."""
    return VIENEU_ENV / ("Scripts/python.exe" if os.name == "nt" else "bin/python")


def theme_json():
    p = SKILL_DIR / "theme.json"
    return json.loads(p.read_text(encoding="utf8")) if p.exists() else {}


def voice_settings(engine=None, project=None):
    """Skill preset <- machine defaults <- project voice.json <- explicit engine.
    Returns {engine, vi, en{engine, voice}, wps}."""
    s = json.loads(json.dumps(DEFAULT_VOICE))
    preset = theme_json().get("voice", {})
    proj_voice = pathlib.Path(project or ".") / "voice.json"
    if project and proj_voice.exists():
        preset = json.loads(proj_voice.read_text(encoding="utf8"))
    s.update({k: v for k, v in preset.items() if k != "en"})
    s["en"].update(preset.get("en", {}))
    if VOICE_JSON.exists():
        user = json.loads(VOICE_JSON.read_text(encoding="utf8"))
        if user.get("engine"):
            s["engine"] = user["engine"]
        if user.get("voice"):
            s["vi"] = user["voice"]
    # Per-project voice choices override machine-wide defaults in this variant.
    if project and proj_voice.exists():
        chosen = json.loads(proj_voice.read_text(encoding="utf8"))
        s.update({k: v for k, v in chosen.items() if k not in {"en", "voice"}})
        if chosen.get("voice"):
            s["vi"] = chosen["voice"]
        s["en"].update(chosen.get("en", {}))
    if engine:
        s["engine"] = engine
    # A theme may carry its narrator's measured rate ("wps"); it applies only while that same engine + voice is used.
    same_voice = s["engine"] == preset.get("engine", s["engine"]) and s["vi"] == preset.get("vi", s["vi"])
    s["wps"] = preset["wps"] if preset.get("wps") and same_voice else ENGINE_WPS.get(s["engine"], 3.2)
    return s


def load_key(name):
    """API key from the env var, else ~/.agentvid/keys.env, $VIDEO_SKILL_KEYS_FILE, or the older key files. Never printed."""
    if os.environ.get(name):
        return os.environ[name]
    candidates = [HOME / "keys.env", os.environ.get("VIDEO_SKILL_KEYS_FILE"),
                  pathlib.Path.home() / ".claude" / "image-api-keys.env",
                  pathlib.Path.home() / ".codex" / "video-keys.env"]
    for c in candidates:
        if c and pathlib.Path(c).exists():
            for line in pathlib.Path(c).read_text(encoding="utf8").splitlines():
                if line.startswith(name + "="):
                    return line.split("=", 1)[1].strip().strip('"')
    sys.exit(f"{name} not found: add a line {name}=... to {HOME / 'keys.env'} (or set the env var)")


def sections(script):
    """Narrated sections in playback order: intro, each scene, outro."""
    out = [("intro", script["intro"].get("vo", ""))]
    out += [(f"scene-{i + 1}", sc.get("vo", "")) for i, sc in enumerate(script["scenes"])]
    out.append(("outro", script["outro"].get("vo", "")))
    return out


def normalize_language(value):
    """Return vi, en, or mixed; reject present but invalid values."""
    key = str(value).strip().lower().replace("_", "-")
    if not key or value is None:
        raise ValueError(f"unsupported script language {value!r}; use vi, en, or mixed")
    if key in LANGUAGE_ALIASES:
        return LANGUAGE_ALIASES[key]
    if key.startswith("en-"):
        return "en"
    if key.startswith("vi-"):
        return "vi"
    raise ValueError(f"unsupported script language {value!r}; use vi, en, or mixed")


def script_language(script):
    """Normalized top-level narration language; an absent field keeps the legacy Vietnamese default."""
    return "vi" if "language" not in script else normalize_language(script["language"])


def split_langs(text, language="vi"):
    """Split narration into routed pieces; braces retain the legacy English override."""
    default_lang = "en" if normalize_language(language) == "en" else "vi"
    out = []
    for k, piece in enumerate(re.split(r"\{([^{}]*)\}", text)):
        if piece.strip():
            out.append(("en" if k % 2 else default_lang, piece.strip()))
    return out


def media_seconds(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                       capture_output=True, text=True)
    return float(r.stdout.strip() or 0)


def splice(files, dest, gap):
    """Join audio pieces with `gap` s of silence (30 ms fade-in each) into one mp3."""
    inputs = sum((["-i", str(f)] for f in files), [])
    pre = "".join(f"[{i}:a]aresample=44100,afade=t=in:d=0.03,apad=pad_dur={gap}[p{i}];" for i in range(len(files)))
    chain = pre + "".join(f"[p{i}]" for i in range(len(files))) + f"concat=n={len(files)}:v=0:a=1[a]"
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", chain, "-map", "[a]",
            "-ar", "44100", "-b:a", "128k", str(dest)], check=True)


# ---------- music-only timing: no voice, so each section lasts long enough to read what is on screen ----------
READ_WPS = 5.0  # Vietnamese syllables read per second (silent reading of short screen text)
SCREEN_LIMITS = {"intro": (7.0, 7.0), "scene": (7.0, 11.0), "outro": (6.0, 9.0)}  # (min, max) seconds
SKIP_KEYS = {"kind", "icon", "vo", "pose", "prop", "from", "highlight", "you", "answer", "descending"}


def screen_words(node):
    """Words a viewer has to read in one section: every string except narration and layout keys."""
    if isinstance(node, str):
        return len(node.split())
    if isinstance(node, dict):
        return sum(screen_words(v) for k, v in node.items() if k not in SKIP_KEYS)
    if isinstance(node, list):
        return sum(screen_words(v) for v in node)
    return 0


def screen_seconds(script):
    """{section id: seconds} for a music-only video: 2.5 s for the entrance animations + reading time, clamped."""
    out = {"intro": SCREEN_LIMITS["intro"][0]}
    for i, sc in enumerate(script["scenes"]):
        lo, hi = SCREEN_LIMITS["scene"]
        out[f"scene-{i + 1}"] = round(min(hi, max(lo, 2.5 + screen_words(sc) / READ_WPS)), 2)
    lo, hi = SCREEN_LIMITS["outro"]
    out["outro"] = round(min(hi, max(lo, 2.5 + screen_words(script["outro"]) / READ_WPS)), 2)
    return out
