# Script and action schema

Top level: language (`vi`, `en`, `mixed`), title, brand?, series?, kicker?, entities, stickers?, intro, scenes, outro.
Intro/outro each contain title, subtitle, note, vo, tiles (exactly two `{value,label}`), hold?. Scenes contain title,
subtitle?, vo, events (0–24), after?, afterOn?, hold?. Values are plain display strings, not executable HTML.

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

Use references/script.example.vi.json and references/script.example.en.json for progressively revealed
integer assignment: show x=10, transfer a copy into y, then write x=20 while y remains 10. The code panel highlights
the instruction responsible for each state change. The concepts and code are explanatory data, never executed HTML.

Voice settings live in voice.json: engine, vi, en, speed (0.65–1.25), paragraph_gap (0–3).
Defaults are Hải Đăng (male Northern Vietnamese), speed 1.0 and paragraph_gap 0.2.
Blank-line-separated paragraphs get that gap; holds (0–6) extend the section after narration and default to zero.
Cue operations early enough to finish during speech; see pacing.md before adding a hold. Music-only previews
use estimated screen-reading duration and distribute phrase cues by text position; regenerate sync after edits.

## Noir tone

Entities, intro, outro and scenes accept optional `tone`: `white`, `yellow`, `blue`, `orange`, `red`, `green`,
`purple`, `dark`. Entity tone selects a dark tint, identity label and subtle border accent. `white` is a neutral
dark panel, not a light fill. Scene titles remain bare light text; scene tone does not fill a heading card.
The fixture explicitly uses orange x and purple y. Inherited default entity roles are box yellow, ticket orange,
reader blue and card neutral; author explicit tones for meaningful identity. `morph` settles the panel surface
and border to neutral dark, retaining the tone's label accent. No layout/quote/chart fields are implied.

The scaffold uses a 936px bare heading region with Space Grotesk 72px (hero 96px); cap headings at two rendered
lines. Soft shadows and open lids need clear space beyond entity bounds. Existing coordinates allow small grids,
but check internal text zones and leave a 24px gutter. Terminal stacks, nested groups, active rails and camera
changes require project-owned DOM/timeline work; see composition-grammar.md and compositions.css.

Intro/outro accept optional `connector` (1–3 display characters, default `→`). Use `=`, `≠` or `VS` when
the pair expresses equality, independence or comparison rather than movement. All text stays native.

## Progressive disclosure (inherited trace API)

- Entity `hiddenFields`: array of `label`, `value`, `detail`, `address`; hidden until a reveal. Keep known initial
  state visible when useful. Hidden fields still reserve geometry and remain hidden through unrelated set operations.
- `reveal`: target entity and fields (default ["value"]), with on/at. Reveals those fields with a short entrance.
- `text`: slot `subtitle` or `takeaway`, text ≤100 chars, on/at. Replaces the previous text in that scene's stable
  slot; text from later beats remains hidden. Omit the initial subtitle when it should open later. Keep each beat short.
- Scene `subtitleOn`, existing `afterOn`: phrase in vo. Intro/outro support `subtitleOn`, `noteOn`, `connectorOn`,
  and `tiles[i].on`. Missing cues retain legacy entrance timing; explicitly cue anything that reveals a new fact.
- `code.lineCues`: array matching lines in length, each null (visible when panel opens) or phrase in that scene's vo.
  Cue each future line no earlier than its panel. Line geometry is reserved; the text is hidden until its cue.
- `code-focus`: active integer 0–2 plus on/at. Highlight a line in the most recently displayed panel. The line
  must exist and already be visible. Order events in narration order; simultaneous actions retain author order.
- `stickers[].manual: true`: disable automatic entrance/drift. `sticker` events target the sticker ID and accept
  action `show`, `react`, `hide`. It stays visible across scenes until hidden; one reaction tilts and returns to rest.
  Manual stickers are separate from native entities and cannot be transfer or spotlight targets.
- Scene `readTask`: short reason for intentional reading/prediction stillness; shown in the audit. It does not
  suppress warnings or insert silence automatically. Use hold only when the task needs post-speech time.

Core scenes and per-scene events now allow up to 24 each. This is capacity, not a production target.
Keep title text useful before the answer: “What changes?” works where an early “y remains 10” would spoil a prediction.

## Narrative contract for new scripts (v0.3)

Set `storyFormat: "worked-trace-v1"` and `story: {question, example, takeaway}` (nonempty strings, ≤200 characters
per field). The intro is the question and the outro is the rule. Every core scene has `phase`:
`setup`, `decode`, `execute`, `verify`. All four phases must occur, in this order; consecutive scenes can share a
phase. The validator rejects missing/unknown/reversed phases for this format. The phase labels do not themselves
animate anything; events and speech cues implement the stage-to-screen contract in narrative-framework.md.

Scripts without storyFormat retain legacy validation so old videos remain usable. New production defaults use the
contract; an explicit user override must be recorded in the storyboard rather than disguised by meaningless phase tags.
Structural success does not verify factual accuracy, narrative causality, topic-appropriate art or answer withholding.

Noir spotlight defaults to full text opacity and a thin focus outline; explicit `dim` still works but must pass contrast review.
