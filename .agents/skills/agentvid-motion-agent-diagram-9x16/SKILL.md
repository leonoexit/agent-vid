---
name: agentvid-motion-agent-diagram-9x16
description: "AgentVid motion skill: explain ONE AI / automation concept (sub agents, context window, RAG, tool use, an automation flow…) in a 45–75 s vertical (1080x1920) video built as a living node diagram — the main agent tile stays on screen and changes state scene by scene: tasks pile up, a memory gauge fills, work is handed to helper agents, helpers run in parallel, what to delegate vs keep, a recap. Pencil-on-parchment look (same palette as the AI-for-business explainer), AI voice in the input's language (Vietnamese or English) with karaoke captions, soft SFX and lo-fi music, rendered to MP4 with HyperFrames. Use for 'video giải thích sub agent / context window / AI agent hoạt động thế nào', 'explain this AI concept as a diagram video', 'sơ đồ động giải thích khái niệm AI'. Works for developers and non-technical owners alike. One video type only: a concept explained through one evolving diagram."
user-invocable: true
metadata:
  author: AgentVid
  version: "1.2.0"
---

# Agent diagram explainer (9:16)

One concept, one evolving diagram. The main agent tile never leaves: every scene changes what happens around it, and
the tile glides between scenes so the video reads as one continuous board. No cuts to new "slides".
You write data (facts, script, storyboard); the scripts do voice, timing, music, mix and render.

## Inputs and language
A concept + notes, a doc, an article or a brief. **Language = the language of the input** unless the user asks for
another: `--language=vi` or `--language=en` (voice, captions and every on-screen word in that language).
Audience: write for both a developer and a business owner — plain words first, one technical term per scene at most,
explained by the picture (e.g. "bộ nhớ làm việc (context)").

## Fixed story (6–7 scenes, 45–75 s)
1. `swarm` — the pain: one agent carrying every task, the load meter racing to red; tease the answer (helper tiles).
2. `gauge` — why it hurts: the memory panel filling line by line, counter going red, "slow / costly / forgetful".
3. `handoff` — the idea: one task goes to a helper with its own memory; the main gauge stays low; helper reports back.
4. `fan-out` — scale: several helpers in parallel; one-by-one vs in-parallel race.
5. `split` — the rule: what to hand off vs what the main agent keeps.
6. `recap` — the benefit in one big line (the main agent free for the hard part).
7. `outro` — "concept = benefit" line + a call to action.
Other concepts reuse the same types (RAG: swarm = questions, gauge = what the model does not know, handoff = search
helper, fan-out = several sources…). Drop or reorder scenes, but keep the main tile's story continuous.

## Workflow
1. Setup (once): `references/setup-and-brand.md` (multix, `GEMINI_API_KEY`, `ELEVENLABS_API_KEY`, optional `SONIOX_API_KEY`;
   Vietnamese voice: `python <skill>/scripts/setup-vieneu.py`).
2. Project: `node <skill>/scripts/new-project.mjs <dir> --language=vi|en`. New dir per video. The example data is a full
   sub-agent video in that language — replace it, do not ship it.
3. `data/facts.md`: one line per claim with its source. Illustrative numbers (tokens, file counts, minutes) are fine only
   when the script says they are an example ("ví dụ", "say") and they agree between voice and screen.
4. `data/script.json`: one scene per storyboard scene; ≤ 14 words (EN) / ≤ 18 syllables (VI) per line; ~2.4 words/s EN,
   ~3.5 VI; last scene `"outro": true`. Rewrite in your own words — never copy a reference video's lines.
5. `data/storyboard.json` (`references/storyboard-reference.md`): the `topic` tag, one entry per scene, anchors on words
   the scene really says. `data/cues.json`: SFX per scene (rename ids).
6. Pipeline `references/pipeline.md`; music `references/music-and-mix.md` (lo-fi acoustic ~90 BPM, no drop needed).
7. Review `renders/contact-sheet.jpg`: labels readable, panels not touching the captions (content ends at y ≈ 1330),
   chips not covering the main tile, every Vietnamese diacritic intact.
8. `node scripts/render-and-verify.mjs --social`; report the gate numbers.

## Done when
- `build-timeline`: no warnings, "storyboard: all anchors spoken"; `hyperframes check` passed.
- `render-and-verify` all gates `ok` (1080x1920, 30 fps, −14 LUFS, peak ≤ −1 dBTP, no black).
- Every number on screen equals the spoken one and traces to `data/facts.md`.

## Do not
Hand-write scene HTML (extend the storyboard), copy a reference's script or slogans, invent "measured" numbers,
print API keys.

## Voice: one take
Never voice scenes one by one or in parallel (sub-agents): `generate-voiceover` reads the whole script in one TTS call so
the voice stays one speaker. A script over the one-call limit stops there: shorten it. `--allow-multi-take` only when the
user asks for the long version.
