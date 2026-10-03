---
name: explainer-ai-for-business-voice
description: >
  AgentVid skill: turn one manual business process into a 60–90s vertical (1080x1920) explainer video that shows a
  non-technical business owner how an AI agent / automation takes it over — hours lost, before vs after, how the agent
  works in 3 steps, a sample chat, savings, an everyday analogy, where to start. Pencil-sketch robot style on parchment,
  free local Vietnamese or English voice (VieNeu-TTS/Kokoro, no API key) with karaoke captions, lo-fi music, rendered to MP4 with HyperFrames. The output follows an explicit Vietnamese/English request, otherwise
  the supplied source language, otherwise the prompt language. Use for "làm video giải thích AI agent / tự động hoá /
  chuyển đổi số cho doanh nghiệp", "AI làm thay việc X cho shop/công ty", "explain an AI agent to business owners".
---

# explainer-ai-for-business-voice (AgentVid)

Fixed story, one process per video: **a day eaten by manual work → before vs after → the agent's 3 steps → a sample
chat → savings → everyday analogy → where to start → closing.** 6–7 scenes. Everything on screen and every spoken word
lives in `script.json`; scripts do the rest.

## Requirements
Node 18+ (`npx hyperframes`), ffmpeg, Python 3.10+. **Voice is free and local**: VieNeu-TTS (Vietnamese) and Kokoro
(English, when supported by the theme) run on the CPU with no API key, installed once per computer by `setup-voice.py`
(step 0). Optional keys (never commit or print them), one `KEY=VALUE`
per line in `~/.agentvid/keys.env`: `KEY4U_API_KEY` for new art or Suno music, `ELEVENLABS_API_KEY` only if the user wants
ElevenLabs instead of the local voice.

## Hard rules
1. **Audience = business owners who don't code.** Never put technical words on screen or in `vo`: no API, prompt, token,
   model, LLM, workflow engine, webhook. Use plain actions such as "agent đọc tin nhắn" / "the agent reads messages",
   "tra giá" / "checks the price", "báo lại" / "reports back".
2. Numbers are examples unless the user gives real ones: say "ví dụ" / "example" in the selected language on screen
   (a heading or the outro credit) and in `vo`.
   Never promise results. Keep them plausible (hours per day × 22 working days).
3. No real brand names or logos (write "mạng xã hội" / "social network", "ứng dụng chat" / "chat app", not a product
   name). Write your own wording.
4. Never edit `<SKILL_DIR>/template`; copy it. On Windows pass non-ASCII text through files written with your file tool
   (shell heredocs can corrupt Vietnamese), and run scripts with `python`.

## Workflow (~8–10 min incl. render for 85s)
**0. First time on this computer only** — install the local voice (~2–5 min, ~1.2 GB download, no key):
```bash
python <SKILL_DIR>/scripts/setup-voice.py --check || python <SKILL_DIR>/scripts/setup-voice.py
```
If it prints a command to install `uv`, run that command, open a new terminal, and run setup again. Do this once, not per video;
it can run in the background while you research and write the script.
```bash
cp -r <SKILL_DIR>/template <project>                                    # 1. project (e.g. projects/explainer/<slug>)
# 2. Choose script.json `language`: explicit user request → source language → prompt language; then write <project>/script.json (schema below) — start from the sample already in the copy
python <SKILL_DIR>/scripts/validate-script.py --project <project> --target <seconds the user asked for, else 77>   # lengths + duration (fails if > 10% off)
python <SKILL_DIR>/scripts/tts.py --project <project>                   # 3. voice, local (~1 min per minute of video)
ffmpeg -v error -y -i <avatar.png> -vf scale=192:192 <project>/assets/watermark.png   # optional (or copy any 192px PNG)
python <SKILL_DIR>/scripts/sync-narration.py --project <project> [--bgm <music file>]  # 4. timing + audio
cd <project> && npx hyperframes lint && npx hyperframes check           # 5. must print "Check passed"
npx hyperframes snapshot --at <times printed by sync>   # intro 3 s, 5 s + 1 s before each section ends; open snapshots/contact-sheet*.jpg
npx hyperframes render --quality high --output <slug>-9x16.mp4          # ~3–4 min for 85s
```
Expected, ignore: lint warning `nested_structure_needs_subcomposition`; without a watermark file `missing_local_asset`
(add one or delete the `<img id="watermark">` line); `check` "info" lines are hints, not failures; `content_overlap` /
`canvas_overflow` in the last ~0.5 s of a scene are the scene transition, not a bug. Anything else: fix it.
A `[text-wrap] lonely last word` error names a text whose last line is one word: shorten or reword that field (do not add line breaks).
Re-run sync after any script.json change; if a `vo` changed run tts first — it only re-voices changed sections
(`--force` redoes all). **Length:** total ≈ Σ(voice seconds) + 1.25 s × sections; a scene never goes below 6.5 s,
intro 5 s, outro 6 s. This skill's voice reads ≈ 4.5 Vietnamese words (space-separated syllables) per second, measured — for
70–85 s aim at ~260–330 words of `vo` in total, ~28–36 per section. Overshooting is the most common
first-pass error: validate-script counts for you. Keep a comma or full stop at least every 25 words (captions are timed per clause).

**Language.** Set top-level `script.json.language` to `"vi"`, `"en"`, or `"mixed"`. The local runtime uses VieNeu for
Vietnamese and Kokoro for English; captions follow the narration words. For mixed speech, keep Vietnamese unwrapped and
wrap English spans in `{braces}`. Existing scripts without `language` remain Vietnamese.
**Voice.** This skill's Vietnamese narrator is **Hải Đăng** (VieNeu-TTS preset). List others: `python <SKILL_DIR>/scripts/tts-vieneu.py --list-voices`.
One video: `tts.py --project <project> --voice "Hải Đăng"`; every video: `setup-voice.py --voice "Hải Đăng"`.
Paid alternative: `ELEVENLABS_API_KEY=...` in `~/.agentvid/keys.env`, then `tts.py --project <project> --engine elevenlabs --voice <voice id>`
(a voice id from the user's own ElevenLabs "My Voices").
**Music only** (no voice, no captions): skip step 3 and run `sync-narration.py --project <project> --music-only`; each scene then
lasts long enough to read its screen text (7–11 s). Running sync without the flag brings the voice back.
**Music:** the bundled calm lo-fi bed is used automatically; the user's own track: `--bgm <file>`. New track (needs Key4u):
`python <SKILL_DIR>/scripts/generate-bgm-suno.py --out-dir <project>/assets/audio --prompt "<genre, instruments, mood, instrumental>"`,
then put the chosen file at `<project>/assets/audio/bgm-source.m4a`.

## Output language
Choose one language before writing `script.json`: an explicit user request wins; otherwise follow the supplied source
content; otherwise follow the user's prompt. If those signals conflict or are unclear, ask once; if there is no answer,
default to Vietnamese. Set top-level `language` to `"vi"` or `"en"`, and write every on-screen field in that language.
Use `"mixed"` only when the user asks for bilingual content or the source meaningfully mixes both languages.
For `language: "vi"` or `"en"`, write `vo` normally; the runtime selects VieNeu or Kokoro. For `"mixed"`, leave
Vietnamese unwrapped and wrap each English span in braces, for example `Agent sẽ nói: {Your order is ready.}`. Captions
are generated from the selected narration and therefore use the same language.

## script.json
Top-level `language` (`"vi"` | `"en"` | `"mixed"`), `title` (≤ 22 chars, the process: "AI trả lời inbox" / "AI answers inbox"),
`subtitle` (≤ 30), `intro {prompt ≤ 32, line1 ≤ 18, line2a ≤ 16, line2b ≤ 20, vo}`,
`labels {before, after}` (for example `"Trước đây"` / `"Với AI agent"` or `"Before"` / `"With an AI agent"`), `scenes[]` (6–7),
`outro {line1 ≤ 18, line2 ≤ 20, line3 ≤ 28, credit ≤ 55, vo}` — longer lines wrap under the watermark.
Intro = notifications pile up: `prompt` is the first notification (its first number becomes the unread counter, e.g. "Inbox: 57 tin nhắn chưa đọc"), a clock spins, then the hook `line1` / `line2a line2b`, then the title + `subtitle`. Outro: `line1`, `line2`, then `line3` on a big "start" button.
Scene: `title` (≤ 24 chars), `pose` (`map` | `magnifier` | `confused` | `cheer`), optional `prop` (only with `stat` and
`checklist`: `workflow` | `invoices` | `clock` | `counter` | `inbox` | `phone`), `widget`, `before` (the pain, ≤ 40 chars),
`after` (the gain, ≤ 36 chars — its box is narrower), `vo` (1–3 sentences, 7–12 s).

| widget `kind` | fields | use for |
|---|---|---|
| `day-timeline` | `heading`, `start`/`end` (hours, e.g. 8/18), `blocks[{from, to, label ≤ 18}]` (1–4), `summary` ≤ 26 | hours lost in one day |
| `before-after` | `left{title, items[2–4] ≤ 22, total ≤ 10}`, `right{…}` | manual vs agent: steps + time |
| `flow-3step` | `heading`, `steps[3]{icon, title ≤ 12, text ≤ 34}`; icon: `inbox gear report chat doc check clock money cart phone` | how the agent works |
| `chat` | `heading`, `them`/`me` names, `messages[2–4]{from: them\|me, text ≤ 60}` | a real-looking exchange |
| `stat` | `heading`, `items[{value, to?, suffix, label, prefix?, decimals?}]` (1–2; `to` = range "5–7"; number + suffix ≤ 11 chars) | hours / money saved |
| `analogy` | `heading?` (optional, never the scene title), `left ≤ 14`, `right ≤ 24`, `points[2–3]{text ≤ 34, ok}` (ok:false = limit) | agent ≈ everyday thing |
| `checklist` | `heading`, `items[2–4]` (≤ 34 chars) | first steps |
| `load-meter` | `heading?`, `items[3–6]` (≤ 20, task slips piling up), `meter{label ≤ 14, from, to}` (%, ≥ 80 ends red) | one person drowning in manual work |
| `fan-out` | `agent?` (≤ 4, default "AI"), `helpers[2–3]{label ≤ 14}`, `serial{label ≤ 14, value ≤ 10}`, `parallel{label, value, ratio?}` | agent splits a job, parallel vs one by one |
| `delegate-split` | `stamp` ≤ 20, `left{title ≤ 16, items[2–3] ≤ 22}` (give to AI), `right{…}` (keep for people) | what to automate vs keep |
Use at least 5 different widgets. `heading` ≤ 36 chars (≤ 30 with a prop). No `prop` on the other widgets (they use the full card).
`vo`: write numbers as spoken words in the selected language ("hai mươi phút" / "twenty minutes"); the screen keeps
digits. Start scene `vo` with its spoken number ("Một." / "One.", "Hai." / "Two.").
**Layout per scene** (optional scene field `layout`): `notes` (card + two notes + mascot), `card` (a bigger card, only the
`after` line — `before` is still required but not shown —, small mascot: for dense widgets), `speaker` (big mascot + speech bubble with `before` small and `after` big).
Default in this theme: `speaker`. Mix 2 layouts in a video for rhythm.

## New art (optional)
Style, robot and poses are locked in `<SKILL_DIR>/theme.json`. New props for another industry (~70s, needs Key4u):
```bash
python <SKILL_DIR>/scripts/generate-theme-assets.py --theme <SKILL_DIR>/theme.json --out-dir <project>/assets --only props \
  --props "truck: a delivery truck|crate: a wooden crate|forklift: a forklift|tablet: a tablet on a stand|form: a paper form|bell: a service bell"
```
Look at the cut-outs before use; `prop` = the name before the colon.

## Check before render
The number in the intro hook must equal the one shown later (e.g. the timeline total or the stat).
Snapshot each section 1 s before it ends (everything has appeared by then): no text overflowing a box or a bubble,
day-timeline labels not colliding, captions readable and in the selected language, all characters intact
(especially Vietnamese diacritics), numbers identical to `vo` and across scenes,
no technical jargon anywhere on screen.

## Files
`template/` (index.html, theme.css, engine, widgets, robot + props, plank title, fonts Mali/Be Vietnam Pro, `audio/bgm-default.m4a`),
`scripts/` (setup-voice, tts → tts-vieneu / tts-elevenlabs, validate-script, sync-narration, generate-theme-assets, slice-sketch-sheets, generate-bgm-suno), `theme.json`.
