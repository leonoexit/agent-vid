"""Generate an original instrumental BGM with Suno via Key4u, then download every returned clip.

Usage:
  python generate-bgm-suno.py --out-dir <project>/assets/audio \
      --prompt "Playful comedic cartoon chase music, pizzicato, xylophone, fast tempo, instrumental"

Key: KEY4U_API_KEY from env, else a keys file (see load_key). Never printed.
Prompt rules: describe genre / instruments / mood only. Never name songs or artists.
"""
import argparse
import json
import os
import pathlib
import sys
import time
import urllib.request

API = "https://api.key4u.vn"
PENDING = {"NOT_START", "SUBMITTED", "QUEUED", "IN_PROGRESS"}


def load_key(name="KEY4U_API_KEY"):
    """Env var first, then KEY=VALUE files: $VIDEO_SKILL_KEYS_FILE, ~/.claude/image-api-keys.env, ~/.codex/video-keys.env."""
    if os.environ.get(name):
        return os.environ[name]
    for c in [os.environ.get("VIDEO_SKILL_KEYS_FILE"), pathlib.Path.home() / ".claude" / "image-api-keys.env",
              pathlib.Path.home() / ".codex" / "video-keys.env"]:
        if c and pathlib.Path(c).exists():
            for line in pathlib.Path(c).read_text(encoding="utf8").splitlines():
                if line.startswith(name + "="):
                    return line.split("=", 1)[1].strip().strip('"')
    sys.exit(f"{name} not found")


def call(key, path, body=None):
    req = urllib.request.Request(
        API + path,
        data=json.dumps(body).encode() if body else None,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST" if body else "GET",
    )
    return json.loads(urllib.request.urlopen(req, timeout=60).read())


def main():
    # Windows consoles default to cp1252; Vietnamese output would crash print().
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser()
    ap.add_argument("--prompt", help="max 200 chars, instrumental description (omit when using --task)")
    ap.add_argument("--task", help="resume: fetch/download an already submitted task id instead of submitting")
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--model", default="chirp-v5")
    ap.add_argument("--timeout", type=int, default=600, help="seconds to wait for Suno")
    args = ap.parse_args()

    key = load_key()
    out = pathlib.Path(args.out_dir)
    out.mkdir(parents=True, exist_ok=True)
    task = args.task
    if not task:
        if not args.prompt:
            sys.exit("--prompt is required unless --task is given")
        sub = call(key, "/suno/submit/music", {
            "mv": args.model, "make_instrumental": True, "gpt_description_prompt": args.prompt[:200],
        })
        task = sub.get("data")
        if not isinstance(task, str):
            sys.exit(f"submit failed: {json.dumps(sub)[:300]}")
    print("task", task, flush=True)

    deadline = time.time() + args.timeout
    first = True
    while time.time() < deadline:
        if not first or not args.task:
            time.sleep(10)
        first = False
        data = call(key, f"/suno/fetch/{task}").get("data") or {}
        status = data.get("status")
        print("status", status, flush=True)
        if status in PENDING:
            continue
        if status != "SUCCESS":
            sys.exit(f"suno failed: {json.dumps(data)[:500]}")
        # Audio URL lives in cld2AudioUrl (not audio_url) on this proxy.
        for i, clip in enumerate(data.get("data") or []):
            url = clip.get("cld2AudioUrl") or clip.get("audio_url")
            if not url:
                continue
            dest = out / f"suno-{i}.m4a"
            # The file host rejects Python's default User-Agent (HTTP 403), so send a browser-like one.
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            dest.write_bytes(urllib.request.urlopen(req, timeout=120).read())
            print(f"saved {dest} ({clip.get('duration')}s, title={clip.get('title')!r})")
        return
    sys.exit("timed out waiting for Suno")


if __name__ == "__main__":
    main()
