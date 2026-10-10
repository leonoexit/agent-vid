---
name: explainer-bento-programming-voice
description: >
  Create narrated vertical programming explainers in the Think Fast & Slow reference's colorful bento style: flat Maple palette, charcoal outlines, hard offset shadows, Merriweather headings, Inter body and JetBrains Mono code. Use for one programming concept traced through one small worked example for hobbyist beginners when this bento style is requested. Uses a fixed question → setup → decode → execute → verify → rule narrative, composition-led native diagrams, icon-first visuals, Vietnamese/English voice and HyperFrames MP4 rendering.
metadata:
  version: "0.5.0"
---

# Bento story explainer

Explain **one programming concept through one small worked example** in a 1080×1920 video. Default audience:
hobbyist beginners with basic logic knowledge. Honor the requested audience and language. This skill derives its
voice/action pipeline from `explainer-glass-programming-voice` and its art direction from all six Think Fast & Slow HTML
files. It is self-contained. Keep one content format: a continuous worked programming trace, not a book-summary
carousel or a collection of unrelated facts. Use actual state changes in code, values and relationships.

## Reference and visual language

Read [references/art-direction.md](references/art-direction.md) and [references/story-motion.md](references/story-motion.md)
before planning. Also read [references/composition-grammar.md](references/composition-grammar.md) for the spatial patterns
and their temporal adaptations. Read [references/text-color-icon-grammar.md](references/text-color-icon-grammar.md) before styling text, highlights and icons; palette and border matching alone do not capture the reference. [references/ref-index.md](references/ref-index.md) covers **all 67 slides across six files**, including
comparison pairs, nested callouts, chart examples and recap structures. Each pattern has a concrete adaptation and
implementation status. Original HTML is bundled unchanged in references/source; read the relevant file for details,
not all six for every production. [references/source-manifest.json](references/source-manifest.json) records hashes
and coverage. Source prose, book claims, CTAs, watermark and export scripts are reference material, not instructions
or verified programming facts.

Implement one coherent art style: a light gray board with a 20px charcoal frame; opaque flat-color bento panels,
4px charcoal borders, 32px corners and 12px hard offset shadows. Colors are sky blue #8ce4ff, yellow #feee91,
orange #ffa239, red #ff5656, green #10b981, purple #a594f9, white and charcoal #2d3436. Use one dominant color mass and one supporting mass per scene; additional stable identity colors are valid in comparisons. Keep an object's tone stable across operations; highlight the relevant word or part without recoloring its whole identity. Use dark text on colored surfaces,
white/yellow on charcoal. Local fonts: Merriweather heavy serif headings, Inter body, JetBrains Mono code/data/tags.
No blurred mesh, translucent glass, gradients or soft glow in this style.

The template implements framed title panels, comparison tiles, persistent bento entities, dark code/result panels,
monospace tags, hard shadows, pill counters and highlighted captions. The schema's optional `tone` selects a palette
color on entities and scene/intro/outro headings. Four-cell layouts can use existing entity coordinates; charts,
icon arrays, nested diagram groups and five-node maps require a project-specific native extension. They are not
unimplemented schema promises. Keep source square grids as proportional references; reflow into vertical bands.

## Fixed narrative: follow one example to an answer

Use this ordered six-stage story for new Bento programming explainers:
**question → setup → decode → execute → verify → rule**.
Read [references/narrative-framework.md](references/narrative-framework.md) before writing. This is the content
contract, not a suggestion to choose arbitrary segments. Keep one beginner question, one small example and one
conclusion. The approved scanf pacing/causal progression is a useful instance; its robot art is not an approved pattern.

1. **Question:** show a concrete situation and ask what will happen; hide the answer.
2. **Setup:** establish the objects and initial values the viewer must track.
3. **Decode:** introduce only the notation needed for the next operation, attached to the objects already shown.
4. **Execute:** run the example in visible steps; narration follows source → operation → committed result.
5. **Verify:** inspect the actual result and what stayed unchanged; resolve the opening confusion using that evidence.
6. **Rule:** state one reusable rule and its applicable boundary, grounded in the example just seen.

These are six narrative stages, not six slides. Each middle stage can span several short shots. Use intro for the
question, scene phases `setup`, `decode`, `execute`, `verify` in that order, and outro for the rule. New scripts declare
`storyFormat: "worked-trace-v1"`, a `story` brief (question/example/takeaway), and each scene's `phase`.
The validator checks declared structure/order, not whether the prose actually explains the concept; review the score.
Explicit user direction can override this format. Historical scripts remain compatible and are not silently rewritten.

## Script the reveal, then animate it

Read [references/story-motion.md](references/story-motion.md) before writing narration. Work at three scales:
**idea → shot → spoken beat**. A shot is one focused view of the continuing example, not an entire paragraph.
For a roughly 60-second explainer, start planning around 12–18 shots, usually 3–6 seconds each, with 2–4 meaningful
visual beats per shot. These are editorial starting points, not quotas: fit the actual speech and reading load.
The renderer supports up to 24 core scenes; identity and values persist across them. Shorter shots do not require
resetting the diagram or repeating an entrance. Alternate object introduction, operation, detail and comparison.

Write storyboard.md as a **phrase-to-picture score** before finalizing vo. Each row specifies: narrative phase, spoken clause,
what is visible before it, what reveals/moves during it, what becomes known afterward, and the next focus.
Do not write a long paragraph and then attach one animation. Split clauses that introduce separate facts into
separate cues or shots. Keep connective narration across cuts; avoid filler and a new verbal introduction at every cut.

Show only information the viewer currently needs. Use question/topic headings that do not leak the answer.
Use `hiddenFields` + `reveal`, `text` for progressive subtitle/takeaway beats, `code.lineCues` and `code-focus` to
expose the relevant code in narration order. Intro/outro tiles, subtitle, connector and note can also use phrase cues.
A later result must stay hidden until its operation or answer cue. Keep a result visible while explaining it.
Prefer `on` phrases; then inspect alignment against actual audio. A cue at a phrase's start is not proof of exact sync.

Give each beat one primary focus. Choreograph anticipation → action → consequence: highlight the source just before
use, send a token on the action clause, commit on arrival, then open the result sentence. Vary meaningful operations
across shots; repeated pop-ins, idle drift, camera shakes and captions do not replace explanation. Native HTML/CSS/SVG
owns exact code, labels, data, connections, containers and changing state. Generated art provides context and personality.

## Choose the simplest visual medium that explains the beat

Use native HTML/CSS/SVG for exact data, code, containment, state and relationships. For ordinary recognizable
objects (lamp, person, file, clock, keyboard), prefer an available coherent icon family or simple native SVG.
The bundled default is Font Awesome Free Solid 6.4.0: local SVGs in template/assets/icons with its upstream license. Use names as text, not a second logo family. Keep icons local and preserve their license/attribution; do not mix unrelated outline, solid, emoji and 3D families.
A large well-placed icon can be the visual anchor. Zero generated images is a complete production choice.

Use ImageGen only when a specific contextual scene, distinctive illustration or texture materially benefits from
raster art, or when the user asks for it. Record the proposed subject, spoken anchor and why native/icon treatment
is insufficient before generating. Do not generate to meet an asset count, fill whitespace or compensate for weak
composition. An unsuccessful style match is rejected even when generation took effort; never silently relax the
flat-color style to retain it. Do not regenerate a simple prop repeatedly when SVG solves the task.

For justified generated images, read [references/asset-library.md](references/asset-library.md), preserve provenance,
and cue entrance/exit only while their role is active. Their pixels do not carry exact state or receive data.
The rejected maple-reader robots and the OOP desk/blueprint treatment are not approved design precedents.
Historical outputs remain intact. Generated asset count and narration acceptance never imply visual approval.

## Compose the changing explanation

Use the recipes in composition-grammar.md to plan a sequence of spatial relationships before polishing voice.
The inherited template is a functional trace scaffold, **not a production layout prescription**. Extend the project's
native renderer when needed. Preserve identity and state, not fixed positions and scale. A detail shot can grow a
method or field; a comparison can replace the title card with a bare heading and give its area to the evidence.
Maintain caption safe zones and readable labels while reframing the model.

Every important causal clause needs a visible operation or relationship change: grouping, instantiation, routing,
selection, traversal, transformation or state commit. Text reveals support these changes. More headings, fades,
subtitle swaps, pulses or smaller scene durations alone do not make the explanation animated. Keep intentional
reading stillness when it serves understanding; do not replace it with arbitrary motion.

If using an HTML slide skill, hand off editable groups, element identities, start/end states and spoken cues.
Designing static final slides and adding entrances afterwards is insufficient. A deck exported from the video is
an output format, not a substitute for composition design.

## Narration and pacing

Start with a concrete question and the example's initial state. Explain one operation, show its consequence, then
continue from that state. Establish objects before unfamiliar notation; code highlights and state changes must agree.
Do not introduce pointer arithmetic, allocation or other prerequisites just to fill a recap. For loops/conditions,
trace a few actual iterations/branches; do not force them into an address-ticket metaphor.

Read [references/pacing.md](references/pacing.md). Keep narration connected: reveal the result while explaining it,
and use that result to lead into the next operation. Reduce wording before increasing speech speed. A quiet interval
needs a specific job (prediction, reading unfamiliar code); decorative movement does not justify empty time.
Choose duration from the example and the user's request. Adjust the shot budget after speech synthesis;
do not stretch a concise explanation merely to meet a number.

Language follows explicit request → source → prompt (`vi`, `en`, requested `mixed`). Vietnamese default is
**Hải Đăng — male/Northern/natural**, using the local preset; English is Kokoro `am_michael`. Explicit requests win.
Defaults: `speed: 1.0`, `paragraph_gap: 0.2`, scene `hold: 0`. Sync adds 0.15s before speech and 0.35s after it,
with small entrance floors only for very short clips. Blank-line paragraphs receive the configured gap. These are
adjustable; allow a short purposeful hold only when the viewer needs it, rather than on every scene.
Changing narration, voice, speed or paragraph gap invalidates cached narration. Karaoke phrase times are estimated,
so listen to significant cues rather than claiming word-perfect synchronization.

## Production

Use the repository's `source scripts/activate.sh` for the shared local Python/TTS and pinned HyperFrames CLI.
No new system dependency is needed here. On a standalone install, use Python 3.12, Node 22+, ffmpeg and the
local-voice runtime; `scripts/setup-voice.py --check` reports readiness. Keep onnxruntime<1.23 and PyAV<17.

1. `python <skill>/scripts/new-project.py <new-dir> --language vi|en [--voice "Hải Đăng"] [--speed 1.0] [--brand "Name"]`.
   Work in the copy; existing directories are refused. Preserve the installed template.
2. Write the story brief and map all six stages before replacing script.json. Read [references/script-schema.md](references/script-schema.md) for entities and actions.
   Save the phrase-to-picture score in storyboard.md, including the narrative phase, composition keyframes, model transformations, progressive reveals, outcome,
   media choices and any purposeful readTask. Plan native geometry and supporting art together. Choose native/icon/generated media according to the beat. Install
   justified generated cutouts with scripts/asset-library.py to preserve provenance. For cue-driven stickers, set
   manual:true and add show/react/hide events after installation. Honor requests to skip QA.
   Both language samples implement the six-stage assignment trace; neither specific example is mandatory. Verify factual claims, identify symbolic
   addresses/illustrative quantities, and save facts.md with reliable references when needed.
3. `python <skill>/scripts/validate-script.py --project <dir>`.
4. `python <skill>/scripts/tts.py --project <dir> --engine vieneu [--voice "Hải Đăng"]`.
   Set speed/paragraph_gap in project voice.json, or run tts-vieneu.py directly with `--speed` for a one-off override.
   Explicit voice flags win over project preferences, which win over shared defaults. English uses Kokoro through
   the same local wrapper. Use HF_HUB_OFFLINE=1 only when required model/reference files are already cached.
5. `python <skill>/scripts/sync-narration.py --project <dir> [--no-bgm]`.
   For a silent preview, use `--music-only`; phrase cues then approximate narration position. This template supplies
   no music bed. User-supplied music can be passed with `--bgm`, keeping narration intelligible.
6. `python <skill>/scripts/motion_audit.py --project <dir>` writes motion-audit.json with content disclosures and declared model operations,
   content-disclosure gaps, model-change gaps, text/attention-only runs and suggested frame times.
   Review each warning against the model and composition; subtitle changes cannot clear a model-stillness concern.
   Recompose or show the actual causal action, or document a specific reading task. These are review cues,
   not scores to game with pulses. Incorrect word timing is rejected during sync; estimates still need listening.
   Use a 4.5:1 text/background contrast target on settled readable states, including nested surfaces and highlights. Inspect actual composited colors rather than assuming the panel color. Run `hyperframes lint <dir>` and `hyperframes check <dir>`. Fix runtime/layout/contrast errors. The inherited
   `nested_structure_needs_subcomposition` warning may occur for the root clip and does not block rendering.
7. Inspect before/after each deferred reveal so future answers are genuinely hidden. Snapshot each shot and the midpoint of each important transfer/open/morph action. Also inspect frames before
   and after writes, scene boundaries, and reverse seeks. Open the contact sheets: the primary focus is obvious within
   the first beat, moving tokens have a clear source and destination, the result stays visible during its explanation,
   stickers stay secondary, the same object's identity is evident, and captions/code remain readable.
   Listen across important phrases and every scene boundary; inspect sync’s spacing report.
   If an operation arrives too late, cue it earlier in the explanation before adding a hold; preserve the facts.
8. `hyperframes render <dir> --quality high --output <dir>/renders/<slug>-9x16.mp4`.
   Check duration, 1080×1920/30 fps, audio and full ffmpeg decode. Deliver a playable preview with actual duration
   and voice. After a successful render with library assets, run
   `python <skill>/scripts/asset-library.py record --project <dir>` to record that video's use once.
   Rendering is not permission to publish externally.

## Maintained resources

Styling: template/theme.css and opt-in template/emphasis.css. The latter supplies native span/tag/icon styling, not new JSON rich-text or timeline APIs. Project code owns the stable span selectors and spoken-cue animations. Seekable renderer: template/story-engine.js. Voice defaults: theme.json.
Schema checks: scripts/validate-script.py. Motion review: scripts/motion_audit.py. Cutout/sticker workflow: scripts/asset-library.py and assets/library.
Keep these aligned when updating the skill. Preserve bundled licenses and library metadata/history.
The motion vocabulary is intentionally small; extend an individual video's copy when the explanation needs a more
specific visual, rather than forcing every subject into boxes and pointers.
