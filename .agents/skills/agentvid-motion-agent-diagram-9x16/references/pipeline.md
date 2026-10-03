# Pipeline (every agentvid-motion skill)

Run from the project directory (`<project>/`). Each step writes a file the next one reads; do not reorder.
`<skill>` = this skill's folder.

## Run modes
Two ways to run this pipeline, by **role** (never by model name) so the same skill works on Claude Code, Codex and
Antigravity: `references/director-mode.md` (director + builders + mechanic + verifiers, parallel scenes, a still
gate before animating — for a new look, a style mix, or a video that matters) and **lean** (one session plays every
role, every gate still runs — the default for this skill and any run without subagents). Role → model per runtime:
`references/agent-roster.md`. Evidence rules for every claim, gate result and report: `references/evidence-discipline.md`.
Motion vocabulary (director notes → easing/timing parameters, style-mix limits): `references/craft.md`.

| # | Command | Writes | Check |
|---|---|---|---|
| 0 | `node <skill>/scripts/new-project.mjs <project> --language=en\|vi [--brand=brand.json] [--voice=… \| --region=bac\|trung\|nam]` | project skeleton, `brand.json`, `data/*.json` | prints voice (and where it came from) + brand |
| 0b | only with customer photos / clips: copy them to `assets/raw/`, then `python scripts/ingest-raw-media.py assets/raw` | `assets/media/*`, `data/media.json`, hero `clip.mp4` wired into `index.html` | look at `assets/media/contact-sheet.jpg` |
| 1 | write `data/facts.md`, `data/script.json`, `data/storyboard.json`, `data/cues.json` (SFX: rename the example scene ids to yours) | | every on-screen claim traces to a fact |
| 2 | `node scripts/generate-voiceover.mjs` | one take `assets/audio/vo/_take-1.wav`, cut into `assets/audio/vo/<scene>.wav` + `data/align/<scene>.json` | one TTS call; every scene got words |
| 3 | `node scripts/align-voiceover.mjs` | `data/vo-lines.json` | every scene ≥ 85% matched |
| 4 | `node scripts/generate-sfx-and-music.mjs all` | `assets/audio/sfx/*.mp3`, `assets/audio/music/bgm-raw.mp3` | |
| 5 | `python scripts/fit-beat-grid.py assets/audio/music/bgm-raw.mp3 --min-bpm 100 --max-bpm 140` | (prints) | BPM, BEAT0, bar table |
| 6 | edit `data/music-arrangement.json`, then `node scripts/arrange-music.mjs` and `python scripts/verify-arrangement.py .` | `assets/audio/music/bgm.flac` | every segment `ok` (±2 ms) |
| 7 | edit `data/timeline-config.json`, then `node scripts/build-timeline.mjs --dry` | (prints schedule) | no warnings, storyboard "all anchors spoken" |
| 8 | `node scripts/build-timeline.mjs --stems` then `python scripts/measure-mix-balance.py .` | `assets/audio/mix.m4a`, TIMING in `index.html` | music 4–6 dB under speech in the busy section |
| 9 | `node scripts/snapshot-scenes.mjs` | `renders/contact-sheet.jpg` | look at it: every scene filled, nothing overlaps captions |
| 10 | `node scripts/render-and-verify.mjs --social` | `renders/<brand slug>.mp4` (master), `-social.mp4` (same size, H.264 ≤ 6 Mbps for uploading), `data/render-report.json` | all gates `ok` |

Python: any Python 3.10+ with `numpy` and `scipy` (`pip install numpy scipy`).

## Rebuild table
| Changed | Re-run |
|---|---|
| Text of a scene | `generate-voiceover` (any text change re-reads the whole script as one take) → `align-voiceover` → 7 → 8 → 9 |
| Storyboard only (titles, cards, anchors) | `build-timeline --no-audio` → 9 |
| Music | 5 → 6 → 8 |
| Anchors, drops, duration | 7 → 8 (or `--no-audio` when only visuals move) |
| Brand | edit `brand.json` → `build-timeline --no-audio` |

## One take, not one call per scene
The whole script is read in ONE TTS call, then cut into scenes at the pauses between them (word timings from one
recognition pass). Separate calls to the same voice can come back with another timbre or tone (reported on Gemini):
a different-sounding narrator or tone in some scenes. Never voice scenes in parallel (sub-agents, loops,
`--per-scene`): a scene re-voiced alone may not match the rest. `--per-scene [--only=<id>]` is only an emergency patch;
listen to it next to its neighbours. One take has a text limit (Gemini 4000 chars, Soniox 3000, ElevenLabs 2800,
VieNeu none; a 60–90 s video is ~600–1300 chars): over it the step stops and asks for a shorter script. Only when the
user explicitly wants the long version, run `generate-voiceover.mjs --allow-multi-take` (whole scenes per take; the
voice may shift between takes).

## Word timings without a key
`script.json "align": "auto"` (default) uses Soniox when `SONIOX_API_KEY` is set, else the local recogniser
(faster-whisper on CPU; install once: `python scripts/setup-vieneu.py --align`), else an estimate from pauses and word
length (always works, coarser on uneven reads). Force one with `"align": "soniox" | "local" | "estimate"`.

## Warnings that matter
- `only N% of script words were heard`: the voice skipped or mangled words; fix `say` or re-voice the scene. Exception:
  the aligner writes spoken numbers as digits ("three point thirty-four" → "3.34"); if only such words are missing, the
  timings are fine and the warning can be ignored.
- A reveal anchored to the scene's last word shows only until the cut; use `{ "word": "x", "plus": -0.3 }` or an earlier word.
- `storyboard: anchor "x" is not spoken`: that reveal falls back to an even spread; use a word the scene says.
- `cut ... clips the previous voice` / `voice runs past its scene end`: move an anchor or raise `duration`.
- `render gates failed`: read `data/render-report.json`; never ship a failed gate.

## When `hyperframes check` fails
- `text_occluded ... inside #<layer>`: a full-frame decorative layer counts as covering text whenever it is visible.
  Keep such layers `visibility: hidden` except while their effect runs (the theme already does this for its wipes).
- `content_overlap` during an entrance: words flying in may cross the line above for a few frames; the theme marks
  its own entrance words with `data-layout-allow-overlap`. Any other overlap is a real layout bug: shorten the text.
- Low contrast (`need 3:1`): a storyboard colour choice or very small text on a busy background; change the text.
