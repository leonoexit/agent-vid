"""Voice a project with the right engine — the one command SKILL.md uses.

  python tts.py --project <project> [--engine vieneu|elevenlabs] [--voice ...] [--force]

Engine: --engine, else ~/.agentvid/voice.json "engine", else the theme preset (theme.json "voice.engine"), else vieneu
(local and free). Every other argument goes to tts-<engine>.py unchanged. Both engines write the same
assets/audio/vo-NN.mp3 + timings.json, so the next step is always sync-narration.py.
"""
import pathlib
import subprocess
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import voice_common as vc  # noqa: E402

ENGINES = ("vieneu", "elevenlabs")


def main():
    vc.utf8_stdout()
    argv, engine = list(sys.argv[1:]), None
    if "--engine" in argv:
        i = argv.index("--engine")
        engine = argv[i + 1] if i + 1 < len(argv) else None
        del argv[i:i + 2]
    project = argv[argv.index("--project") + 1] if "--project" in argv[:-1] else None
    engine = vc.voice_settings(engine, project)["engine"]
    if engine not in ENGINES:
        sys.exit(f"unknown engine {engine!r}; use one of {', '.join(ENGINES)}")
    if engine == "vieneu" and not vc.env_python().exists():
        sys.exit("Local voice not installed yet: run  python <SKILL_DIR>/scripts/setup-voice.py  (once, ~2-5 min, no key)")
    script = pathlib.Path(__file__).resolve().parent / f"tts-{engine}.py"
    sys.exit(subprocess.run([sys.executable, str(script), *argv]).returncode)


if __name__ == "__main__":
    main()
