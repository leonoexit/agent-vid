---
name: agentvid-motion-big-canvas-mindmap-9x16
description: "AgentVid motion skill: explain ONE topic that has many parts (an ecosystem, a product family, a tech stack, a business system) in a 90–180 s vertical (1080x1920) video drawn as ONE big mind map. A hand with a pen draws the hub, then each branch in its own colour while the camera travels from node to node — no cuts: ghost nodes already hang around the hub, every node is inked on the spoken word, lists, small trees, cycles, cards and red 'the point' notes are written under it, and the last move pulls back to show the whole map with a yellow sticky recap. Calm AI voice in the input's language (Vietnamese or English), soft pencil SFX, quiet lo-fi bed, rendered to MP4 with HyperFrames. Use for 'video bản đồ tư duy', 'giải thích hệ sinh thái bằng một sơ đồ lớn', 'mind map video one big canvas', 'video tổng quan nhiều nhánh'. One video type only: one map, one hub, 6–10 branches."
user-invocable: true
metadata:
  author: AgentVid
  version: "1.0.0"
---

# Big canvas mind map (9:16)

One map, one pen, one camera. The hub sits in the middle; every scene is one branch the camera travels to. The pen draws the
branch curve from the hub, inks the node ring, then writes what hangs under it on the words the voice says. Nothing is cut:
the viewer sees the whole map being built, and the last scene pulls back to show it.
You write data (facts, script, storyboard); the scripts do voice, timing, music, mix and render.

## Inputs and language
A topic with parts + notes, a doc, an article or a brief. **Language = the language of the input** unless asked otherwise:
`--language=vi` or `--language=en` (voice and every word on the map). Plain words first; one technical term per branch at most.
Fits topics that are a *set of parts that connect*; for a single idea use `agentvid-motion-agent-diagram-9x16`,
for one process step by step use an explainer skill.

## Fixed story (hook + 6–10 branches + recap, 90–180 s)
1. `hook` — a provocative question on a sticky note; the hub is inked on the cue; ghost branches hang around it.
2. `branch` × 6–10 — one part each: name it, say what it is for in one picture, end on the point (red note).
3. `recap` — the camera pulls back to the whole map; a sticky lists the parts one per spoken item; a closing sticky carries the one-line takeaway.
Order of branches = order of the story (simple parts first, the part that ties them together last). Map layout is automatic:
branches alternate left / right; `row` puts a branch above (`-1`) or below (`0`, `1`…) the hub.

## Workflow
1. Setup (once): `references/setup-and-brand.md` (multix, `ELEVENLABS_API_KEY` for music and SFX, optional `SONIOX_API_KEY`;
   Vietnamese voice: `python <skill>/scripts/setup-vieneu.py`).
2. Project: `node <skill>/scripts/new-project.mjs <dir> --language=vi|en`. New dir per video. The example data is a full video
   (an online shop as a map) — replace it, do not ship it.
3. `data/facts.md`: one line per claim with its source. Names of products, companies or features on the map must be verified facts.
4. `data/script.json`: one scene per storyboard scene; measured pace ~4.1 words/s VI (VieNeu), ~2.4 words/s EN → 90 s of voice ≈ 370 words VI, 150 s ≈ 610
   (a 564-word script read 138 s). The last scene `"outro": true`. Rewrite in your own words — never copy a reference video's lines. Words the voice
   mangles (Wi-Fi, RAM, GPS) get a `say` respelling in the line; anchors still use the words as written in `text`; `word#2` counts per scene.
5. `data/storyboard.json` (`references/storyboard-reference.md`): top `root`, then one entry per scene; every reveal is anchored on a word
   the scene says. `data/cues.json`: SFX per scene (rename ids).
6. Pipeline `references/pipeline.md`; music `references/music-and-mix.md` (lo-fi acoustic ~90 BPM, **no drop**: arrangement = the
   whole track; `fit-beat-grid.py … --min-bpm 80 --max-bpm 100` for this bed). Set `timeline-config.json` `duration` = last scene's voice end + 4 s.
   Beats at 90 BPM = seconds × 1.5: in `music-arrangement.json` use `bpm`/`beat0` from the fit, ONE segment `to: [0, floor(duration × 1.5 / 4) × 4]`
   (the track must have that many beats) and `fadeOut.beat` = (duration − 3) × 1.5. `musicDb` 0.5 lands the bed ~4–5 dB under the voice; re-measure
   with `python scripts/measure-mix-balance.py .` after `build-timeline --stems`. Sound effects can be copied from another project instead of generated.
7. `node scripts/build-timeline.mjs` must print `storyboard: all anchors spoken`. Then `npx hyperframes check`: **every `[canvas]` warning must be fixed**
   (`the pen is still writing N s after the scene ends` = too much to write in that scene, see the writing-time table in the storyboard reference; the
   check, not build-timeline, prints it). Then look at frames: `npx hyperframes snapshot --at <t1,t2,…> --describe false` — one frame per scene when its
   parts are all written, plus a camera move. The contact sheet tiles frames edge to edge; open single `snapshots/frame-*.png` to judge a 9:16 frame.
8. `node scripts/render-and-verify.mjs --social`; report the gate numbers.

## What to look at in the frames
- Each node group fits the safe box (y 360–1620) or the camera drifts down for the later parts; no part is cut by the frame edge while being written.
- Text in a column is not wider than the column (`hyperframes check` warns `container_overflow`): shorten the text, notes shrink on their own.
- Rings fit their text, the pen tip is on the stroke being drawn, no stray dots, the ghost nodes of the NEXT scene are visible at the edge.
- The recap map shows every branch; the sticky list has one line per spoken part.

## Done when
- `build-timeline`: no warnings, "storyboard: all anchors spoken"; `hyperframes check` passed with no `[canvas]` warning (info lines are intended: the recap sticky
  covering the map, and a struck-through line overlapping its own strike).
- `render-and-verify` all gates `ok` (1080x1920, 30 fps, −14 LUFS, peak ≤ −1 dBTP, no black).
- Every word on the map is something the voice says in that scene; every fact traces to `data/facts.md`.

## Do not
Hand-write scene HTML (extend the storyboard), copy a reference's script, slogans or hand art, invent numbers, put more than ~9
branches or more than ~5 parts under a node (split the topic), print API keys. No captions by design: the map carries the words.

## Render and Windows tips
- A full render takes ~4–6 min (`render-and-verify` drops to one Chrome worker when under ~3 GB of RAM is free, then it is slower: close other apps). The `-social.mp4` is
  written after the gates, wait for it before copying.
- Cancel a render: stop the node process (`taskkill //F //PID <pid>` in Git Bash; `pkill` does not exist there) and any leftover Chrome it started, otherwise a second render fights over temp files.

## Voice: one take
Never voice scenes one by one or in parallel (sub-agents): `generate-voiceover` reads the whole script in one TTS call so the voice
stays one speaker. A script over the engine's one-call limit stops there: shorten it (VieNeu has no limit).

## Review gates (before posting or selling)
Run gate A (`scripts/review-motion-script.py`) before voice and music, gate B (`scripts/review-ui.py --capture`) before render, and
render with `node scripts/render-and-verify.mjs --require-review`. Another model, subagent or person must stamp each gate.
Full steps: `references/review-gates.md`.
