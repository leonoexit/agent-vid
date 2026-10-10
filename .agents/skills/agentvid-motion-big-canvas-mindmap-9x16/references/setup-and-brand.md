# Setup, providers and brand

## One-time setup
| Need | Install / check |
|---|---|
| Node 20+, ffmpeg + ffprobe (full build), ImageMagick 7 (`magick`) | on PATH |
| Python 3.10+ with numpy, scipy | `pip install numpy scipy` |
| HyperFrames | nothing to install; scripts run `npx --yes hyperframes@0.8.75` (downloads Chromium once) |
| multix | `npm install -g @mrgoonie/multix` |
| Local Vietnamese voice (only for `vieneu`) | `python scripts/setup-vieneu.py` (~2–5 min, ~1.1 GB, CPU; pins `onnxruntime<1.23`) |
| Word timings without any key | `python scripts/setup-vieneu.py --align` (adds faster-whisper + its model, ~500 MB) |

## Keys
Read at run time from the environment, then `~/.agentvid/keys.env`, then `~/.claude/ai-api-keys.env`
(`NAME=value` lines). Never copy keys into the project, plans or reports, and never print them.

| Key | Used for |
|---|---|
| `GEMINI_API_KEY` | Gemini TTS (default English voice) |
| `SONIOX_API_KEY` | optional: best word timings (used first when set), Soniox TTS; without it timings run locally |
| `ELEVENLABS_API_KEY` | SFX + music (paid plan for music); optional TTS; forced alignment only if the key has that permission |
| `KEY4U_API_KEY` | optional: one illustration with `scripts/generate-illustration.py` (gpt-image-2) when there is no photo |

## Voices (data/script.json "voice")
| engine | voice examples | notes |
|---|---|---|
| `gemini` | Puck (bright launch), Fenrir (hype), Kore | `style` steers delivery; best English energy in tests |
| `vieneu` | Thanh Bình (male, Bắc); all presets by region below | free, local, Vietnamese only; tempo 1.0 |
| `soniox` | Adrian, Daniel, Grace, Nina | clear but calm; any voice speaks any language |
| `elevenlabs` | voice id | `model` eleven_v3 by default |
VieNeu presets by region (`node <skill>/scripts/new-project.mjs --list-voices`; `--region=nam` picks one with the
theme voice's gender, `--voice="Thùy Dung"` picks by name):

| Region | Male | Female |
|---|---|---|
| Bắc (Northern) | Thanh Bình, Hải Đăng, Thiện Minh, Thiền Tâm Đức, Minh Đức | Ngọc Huyền, Trúc Ly, Mai Anh, Ngọc Linh, Đoan Trang |
| Trung (Central) | Quang Sơn | Ngọc Trân |
| Nam (Southern) | Thái Sơn, Minh Triết, Đức Trí, Adam | Thùy Dung, Thục Đoan, Mỹ Duyên, Kim Thanh |

Your default for every project: `~/.agentvid/voice.json` (shared with the explainer skills). `{"voice": "Thùy Dung"}`
renames the Vietnamese VieNeu voice; per language: `{"vi": {"engine": "vieneu", "voice": "Thùy Dung"},
"en": {"engine": "gemini", "voice": "Puck"}}`. `new-project` flags win over the file; it prints which one decided.

Voice language = caption language (`"language": "en"` or `"vi"`). Captions show `text`; `say` only fixes pronunciation
(e.g. `"text": "v3.2", "say": "version three point two"`).

## Brand (brand.json in the project)
| Field | Where it shows |
|---|---|
| `name`, `slug` | `slug` names the output file |
| `signature`, `signatureAt` | handwritten signature bottom-right ("" hides it) |
| `logo` (dark backgrounds), `logoOnLight`, `logoMark` | cover, outro, chat avatar |
| `tagline`, `outroLine`, `url`, `hudLabel` | defaults for text the storyboard does not set |
| `colors.primary / secondary / accent` | the brand gradient on accents, badges, lines, captions |
Logos must be transparent PNGs (an opaque logo shows as a box; new-project warns). To cut a flat background colour:
`magick logo.png -fuzz 12% -transparent "#181a2b" logo-transparent.png` (use the logo's own background colour).
With `--brand`, fields you leave out start empty (tagline, url, outroLine) or follow `name` (slug, signature, hudLabel).
Change brand for one video: edit `brand.json`, then `build-timeline --no-audio`. New project with another brand:
`new-project.mjs ... --brand=path/to/brand.json` (a relative `logo` path is copied into the project).
