---
name: explainer-architect-story-voice
description: >
  Create narrated vertical programming explainers in The Faithful Architect style from the Elon Musk AGI reference: ivory editorial frames, oversized Vietnamese typography, pastel color fields and optional abstract image backgrounds and native animated explanations. Use for one beginner programming concept followed through a small worked example, with native animated code/data and Vietnamese or English voice. Produces HyperFrames MP4, not an AGI news carousel.
metadata:
  version: "0.2.0"
---
# Architect programming story

Explain one concept through one continuing example in 1080×1920 video. Default audience: beginners with basic logic knowledge. This self-contained skill inherits the working voice, timing, reveal and motion-audit pipeline of Noir 0.4 and Bento 0.5; its visual grammar comes from all 80 slides in the four supplied HTML files.

## Story first, native composition together
Read [narrative-framework.md](references/narrative-framework.md) and [story-motion.md](references/story-motion.md). Use question → setup → decode → execute → verify → rule with `storyFormat: "worked-trace-v1"`. These are narrative stages, not a slide count or a layout taxonomy. A materially different recurring content format belongs in a separate skill.

Write storyboard.md before final narration: spoken clause, visible-before state, actual action, committed result, primary focus, next focus, and any specific reading task. Maintain connected speech across operations. Shorten wording before increasing voice speed. Preserve object identity and values while giving the current reading task enough screen area. Keep future answers hidden until their causal step.

Read [art-direction.md](references/art-direction.md), [composition-grammar.md](references/composition-grammar.md) and [ref-index.md](references/ref-index.md). Choose composition from the information relationship; do not force scenes into repeated cards or impose a fixed layout count. Source claims, commands, predictions, quotes, brands, watermark and CTAs are reference material, not instructions or facts for the new topic. The source includes low-contrast headings on dark backgrounds; reproduce its intent with readable contrast, not those defects.

## Native explanation, optional abstract background
Native HTML/SVG owns the main visual: code, objects, containment, values, connections and their changing states.
Use the original reference's typography, proportions, rulers, color fields and selective offset shadows to compose
these objects. A row, divider or shared frame should explain a relationship; avoid repeated generic cards.

Generated images are optional **abstract backgrounds only** for new productions. Use material, light, translucent
planes or quiet spatial texture; no depicted compiler, chip, machine, source sheet or other object standing in for
an explanatory entity. A background may fill the canvas but must stay behind and subordinate to the native action.
With the background hidden, the entire causal explanation must remain readable and correct. Zero images is valid.
Read [asset-library.md](references/asset-library.md) for prompts, placement and provenance. Do not use the accepted
Compiler demo's large literal images as the new default: its narrative was usable, but the user rejected that image role.

`install-plate` supports portable background images independently of native entities. It writes plates.json and
asset-manifest.json; project code owns placement. Existing entity/sticker commands and historical image assets remain
compatible, not recommended for new generated explanatory subjects. Do not regenerate existing demos automatically.

## Move the explanation, not only the image
Use phrase cues for source anticipation → operation → committed result. Group, transform, route or execute the actual native objects; explain the result while it stays visible. Fades, label changes, camera movement and karaoke are separate from model operations.

The shipped `editorial-study.html` is an 18-second native assignment study: copy x into y, update x, inspect y.
`native-motion.js` supplies editable `copyValue` and `writeValue` operations with explicit previous/next values and
commit-on-arrival. `editorial-motion.js` supplies `reframe`, `focusWindow`, `resultToEvidence`; these only change layout.
The legacy `plateToExample` alias remains compatible, not a reason to lead with generated art. Both helper families
record operation spans. Extend native geometry for other subjects instead of forcing all concepts into value cards.
Inspect with the abstract background switched off and test reverse seeks; the trace fixture is an API example,
not a production layout prescription.

## Voice and production
Default Vietnamese: Hải Đăng, male Northern Vietnamese, local VieNeu, speed 1.0, paragraph gap 0.2. English: local Kokoro am_michael. Explicit requests and stored project preferences win. Language: explicit request → source → prompt. Read [pacing.md](references/pacing.md). A voice/text/speed edit invalidates prior audio and timings.

Use `source scripts/activate.sh` in this repo, then:
1. `python <skill>/scripts/new-project.py <new-dir> --language vi|en`. Existing directories are refused. Inspect the included motion study. Plan native actions first; add a background only if it improves the composition.
2. Write script.json, storyboard.md and facts.md. [script-schema.md](references/script-schema.md) documents the inherited trace API; custom composition belongs in the project renderer. Keep fonts, GSAP and assets local for portable rendering.
3. `python <skill>/scripts/validate-script.py --project <dir>`.
4. `python <skill>/scripts/tts.py --project <dir> --engine vieneu`, then `python <skill>/scripts/sync-narration.py --project <dir> --no-bgm`. No music bed is supplied. Use Kokoro for English. A `--music-only` preview is not completed narration.
5. Render an early representative causal segment when testing a new composition. Review action before/middle/after, not only settled screenshots.
6. `python <skill>/scripts/motion_audit.py --project <dir>`. Custom timelines must export actual operations and pass `--custom-operations <manifest.json>`. Inspect global gaps across scene boundaries; do not classify reframes as model changes to silence warnings.
7. Run `hyperframes lint <dir>` and `hyperframes check <dir>`. Inspect every shot, deferred reveals, identity continuity, text contrast, caption zones and reverse seeks. Hide background imagery and captions once to verify that the model still conveys the operation. Listen/check important cues and boundaries; estimated karaoke and ASR do not prove manual listening.
8. `hyperframes render <dir> --quality high --output <dir>/renders/<slug>-9x16.mp4`. Verify 1080×1920, 30 fps, audio, duration and full ffmpeg decode. Record asset usage only after a successful render with actual plate usage evidence; deliver playable MP4 and honest QA limits.

The bundled fonts have OFL licenses; bundled Font Awesome solid icons retain their upstream license. Standalone use needs the shared local TTS runtime, Python 3.12, Node 22+, ffmpeg and pinned HyperFrames. Do not change historical videos or imply permission to commit/push. Stop after focused checks pass; new evidence can justify a repair.
