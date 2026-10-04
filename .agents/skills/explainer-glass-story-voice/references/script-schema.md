# Script and action schema

Top level: language (`vi`, `en`, `mixed`), title, brand?, series?, kicker?, entities, stickers?, intro, scenes, outro.
Intro/outro each contain title, subtitle, note, vo, tiles (exactly two `{value,label}`), hold?. Scenes contain title,
subtitle?, vo, events (0–12), after?, afterOn?, hold?. Values are plain display strings, not executable HTML.

Entities (1–6) have a unique id, kind (`box`, `ticket`, `card`, `reader`), label, value, detail?, address?,
x, y, width, height. Coordinates are local to the 860×570 visual stage, at canvas (110,655). Use 2–3 simultaneous
objects for a beginner explanation. Objects initially stay hidden until `show`.
An optional `image` is a local assets/illustrations path; alt? supplies descriptive text. The template gives
illustrated cards separate image/data zones (minimum width 300, height 250; reader height 160). Use
scripts/asset-library.py install to attach a selected cutout and retain provenance. See asset-library.md for selection,
variants and actual-use history. The image is secondary decoration or a contextual figure; it is never the main
explanatory model, a program state, a capacity grid or a transfer destination. Background layers need a project-specific
renderer extension; the entity image field is not a background API. A flat prop cannot animate its own lid; use native geometry or project-specific parts.

`stickers` are an optional separate decorative layer. Each sticker has `id`, `image` (a local
`assets/illustrations/` PNG), `alt`, `x`, `y`, `width`, `height`, optional `rotation`, and optional `scenes` (a list
of 1-based scene numbers; omit it for a persistent ornament). Coordinates are local to the 860×570 visual stage.
Keep stickers in safe corner zones, use zero to two per scene, and keep them out of code, captions, takeaways,
moving-token paths and native explanatory geometry. The renderer fades them in/out gently; they are not entities and
cannot be a `focus`, `connect`, `transfer` or `write` target. Install them with `asset-library.py install-sticker` so
the project manifest retains the immutable image hash, family and reason.

Text limits: scene title 52, subtitle 100, vo 1500, after 100; entity label 25, value 14, detail 40, address 20.
Hero title 45 (choose a phrase that fits two display lines), subtitle 90, note 120; tile value 8 and label 24.
Titles and subtitles share a flowing stack, preserving explicit newlines. Author at most two title lines and keep
subtitle copy short enough to stay above the persistent stage. Honor user requests to skip checks/snapshots.

Every action has `type` and exactly one trigger: `on` (phrase in that scene's vo, occurrence? defaults to 1) or
`at` (seconds after scene start). Use narration order. Case/punctuation do not affect matching; accents do.

| type | Additional fields | Meaning |
| --- | --- | --- |
| show / hide | target | Introduce/remove one entity, keeping its state. |
| open | target of kind box | Lift the lid and expose the existing value. |
| focus | targets: IDs ([] clears) | Outline emphasis without moving/resizing the objects. |
| spotlight | targets: IDs, dim? (0.1–0.8) | Keep one primary entity readable while dimming unrelated entities. |
| pulse | target, scale? (1.01–1.2), duration? (0.2–1.2) | Mark the committed result with a short native emphasis. |
| set | target, any label/value/detail/address | Discrete display change; unrelated fields stay unchanged. |
| morph | target, optional label/value/detail/address | Settle a metaphor into a regular card while preserving identity. |
| move | target, x, y, rotation? | Reposition the same entity; keep it within the visual stage. |
| connect | from, to, persist? (true by default) | Draw a directional relation; false briefly traces an existing relation. |
| transfer | from, to, value, field? (`value`/`address`) | Move an explicit token from source to destination, retaining source data. |
| write | to, value | Send an operation token to overwrite the target's value. |
| code | lines: 1–3 strings, active? index, label? | Replace the code panel and highlight the currently explained line. |

Transfer/write also accept duration (0.4–2.5 seconds, default 1.05), commit (default true), commitField
(default value; label/detail/address also possible). Destination updates at arrival; source changes require an
explicit `set`. Physical travel is illustrative, not a claim about memory hardware. A persistent connection is drawn
between the positions at its creation; use a fresh connection after a structural move rather than leaving stale arrows.

Use references/script.example.vi.json for a complete pointer trace and references/script.example.en.json for
integer assignment: show x=10, transfer a copy into y, then write x=20 while y remains 10. The code panel highlights
the instruction responsible for each state change. The concepts and code are explanatory data, never executed HTML.

Voice settings live in voice.json: engine, vi, en, speed (0.65–1.25), paragraph_gap (0–3).
Defaults are Hải Đăng (male Northern Vietnamese), speed 1.0 and paragraph_gap 0.2.
Blank-line-separated paragraphs get that gap; holds (0–6) extend the section after narration and default to zero.
Cue operations early enough to finish during speech; see pacing.md before adding a hold. Music-only previews
use estimated screen-reading duration and distribute phrase cues by text position; regenerate sync after edits.
