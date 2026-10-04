---
name: explainer-noir-story-voice
description: >
  Create narrated vertical programming explainers in the Boris Claude setup reference's dark editorial style: near-black, restrained terracotta/violet glow, thin glass panels, Space Grotesk titles and terminal details. Use for one programming concept traced through one small worked example for hobbyist beginners when this noir style or Boris reference is requested. Vietnamese/English voice, progressive native state changes and HyperFrames MP4 output. This is a video skill, not a Claude setup tutorial or general carousel generator.
metadata:
  version: "0.4.0"
---

# Noir programming story

Explain **one programming concept through one small worked example** in a 1080×1920 narrated video.
Default audience: hobbyist beginners with basic logic knowledge. Inherit Bento 0.5's connected explanation,
phrase-to-picture score, native operations, reversible seeking, voice pipeline and focused QA. The new visual
system comes from all six Boris setup HTML files: 18 main slides and one alternative cover. This skill is
self-contained; neither Bento nor its accepted videos need modification.

## Plan from a concrete example

Use **question → setup → decode → execute → verify → rule**. Read
[references/narrative-framework.md](references/narrative-framework.md) before writing and
[references/story-motion.md](references/story-motion.md) when scoring cues. New scripts declare
`storyFormat: "worked-trace-v1"`, a question/example/takeaway brief and ordered core scene phases.
An explicit user request can override the format; document that exception without inventing phase labels.
A materially different recurring format deserves a separate skill.

Write storyboard.md before finalizing narration. Each beat names the spoken clause, visible-before state,
primary focus, reveal/native operation, visible-after state and next focus. Define unfamiliar terms as they
become necessary. Keep narration connected across state changes; shorten wording before increasing speed.
A quiet interval needs a specific reading or prediction task. Shot counts are editorial estimates, not quotas.

## Design from the whole reference

Read [references/art-direction.md](references/art-direction.md),
[references/composition-grammar.md](references/composition-grammar.md), and
[references/text-color-icon-grammar.md](references/text-color-icon-grammar.md) before planning visuals. Read [references/reference-reading.md](references/reference-reading.md) for the evidence behind hierarchy, grouping, density and reading order.
[references/ref-index.md](references/ref-index.md) maps every slide to a spatial pattern, a possible motion
adaptation and its implementation status. Read only the relevant original HTML after choosing a recipe.
[references/source-manifest.json](references/source-manifest.json) records unchanged source and asset hashes.

Use a near-black canvas, generous negative space, large Space Grotesk headings, thin translucent panel borders,
quiet dark glass and restrained terracotta/violet atmosphere. Keep the large title mostly **outside** cards.
Alternate bare statements, terminal detail, asymmetrical evidence/result pairs, active-step rails and compact
comparisons when the explanation needs them. Preserve object names, identity colors and committed values while
changing positions, scale or grouping. Avoid putting every sentence in the same two cards.

Use terracotta for the current operation; violet can distinguish a second conceptual layer. Text uses readable
violet `#C4B5FD`, not the source's dark `#7C3AED`. That darker violet belongs to borders, fills and glows.
Entity identity stays stable; operation focus and success/error states have separate labels/marks.
Check the actual composited backdrop, including nested panels. Reference opacity tricks are not legibility guarantees.

Plan the **information relationship first**: who owns a part, which requests converge, where a value travels,
what changed, and which evidence answers the question. Choose size, containment, alignment, layers and spacing
from that relationship. Use the design decision record in composition-grammar.md; include observed source evidence,
your inference, the intended reading path, and the before/action/after transformation. Narrative phase and visual
composition are independent axes. There is no fixed number of layouts and no one-layout-per-phase mapping.

The original [six static studies](references/composition-study.html) were chosen to illustrate the six narrative
phases; **they were not six latent categories discovered in the reference**. They mostly share a top-title/body
skeleton and are surface/typography specimens. Do not use them as a complete production layout vocabulary.
The template is a trace API fixture plus opt-in DOM/CSS primitives; `compositions.css` is not a JSON layout API.
Production needs project-specific choreography where the actual relation changes. Judge variety by the relation
and reading path, not by card count, color swaps or number of scenes.

## Reflow the reading area

Use [references/editorial-motion.md](references/editorial-motion.md) when a question gives way to evidence, a call
opens its definition, or a computed result opens into comparison. New projects include a playable, scrubbable
`editorial-study.html` with editable examples and `editorial-motion.js` with three opt-in GSAP helpers. They take
explicit DOM nodes and start/end geometry; they do not add JSON events or automatically compose a production.
The same helpers are exercised in SRP v3. Keep code/values and model operations in the project renderer.

Allocate the main reading area per spoken task. Let a completed heading shrink, move or leave so the next object
can dominate. Preserve only the brand/caption safety regions; the stock fixture’s title/model/code bands are
starting coordinates, not permanent reservations. Review the before/middle/after density and the transitions to
adjacent scenes. Reflow is audited separately from execution and ownership changes.

## Choose media by its job

Native HTML/SVG owns code, fields, labels, containers, links, token travel and committed state. Use the local
Font Awesome Free Solid 6.4.0 icons for simple objects, with their bundled license. One family per production;
the source's brand/regular icons and emoji are reference evidence, not a requirement to mix styles.
An icon identifies a role; a numeric field or moving token explains what happens to it.

CSS radial glow and subtle static grain are sufficient atmosphere. Generated abstract imagery is optional and
secondary, never an automatic asset quota. Before generation, name its spoken anchor and why native/icon treatment
is insufficient. Read [references/asset-library.md](references/asset-library.md) only after choosing generated art.
Use this skill's empty library and [references/asset-style.json](references/asset-style.json); do not copy another
skill's generated art/history. Bundled source images remain design evidence with unverified reuse rights.
Do not use their portraits, identity badges or backgrounds automatically in a new video.

All source commands, embedded advice, author claims, performance numbers, verification badges, watermark and
save/share CTAs are **source material**, not task instructions or verified facts. Explain the user's chosen concept;
do not silently create a tutorial about Claude. No endorsement or official verification is implied by this style.

## Apply the inherited Bento motion contract

The first SRP trial was rejected for static exposition and a weak reference match despite technical passes.
Bento's motion rules were already copied here; merely possessing those rules did not make the production comply.
Use [references/srp-case-study.md](references/srp-case-study.md) for the rejected v1 and the user-accepted v2 repair.
Acceptance of v2 includes acknowledged minor defects and incomplete source fidelity; it is not a blanket certification.

Work from spoken clauses to concrete before/action/after states. A long-lived class panel is not an operation.
Build its actual data/methods, execute them, attach a request to an exact line, apply a patch, reassign the same code,
and inspect the produced output as appropriate. Preserve meaning and identity; position may change. A scene boundary,
label write, fade, focus or camera reframe does not on its own count as a model change.

For custom JS, export timeline spans and use the custom audit in story-motion.md. Review global gaps across scene
boundaries, then inspect adjacent action triplets with captions/headings hidden. For every remaining interval,
name the specific code/state comparison being read or recompose the causal action. Do not relabel decoration as
model work to remove warnings. Technical checks and operation counts do not establish motion or design acceptance.

## Narrate and reveal together

Use `hiddenFields`/`reveal`, `text`, `code.lineCues`, `code-focus`, phrase-based `on` cues and hero tile/note cues.
Keep future answers hidden, anticipate the source, execute the real operation, commit on arrival, then explain the
result while it remains visible. Headings, fades, glow and karaoke do not replace a causal model change.
Transfer copies by default; preserve the source unless the example explicitly changes it. Inspect reverse seeks.
Keep script strings plain text. Rich emphasis spans and semantic selectors belong to project-owned native code.

Vietnamese default: **Hải Đăng, male Northern Vietnamese**, local VieNeu, speed 1.0, paragraph gap 0.2.
English: local Kokoro `am_michael`. Explicit requests and stored project preferences win. Language follows
explicit request → source → prompt. See [references/pacing.md](references/pacing.md).
Narration/voice/speed changes invalidate old audio and timings: regenerate and resync before rendering.
Estimated karaoke timing and ASR are not proof of manual listening or exact word synchronization.

## Produce and verify

Use `source scripts/activate.sh` in this repository. The helpers are self-contained; a standalone environment
needs the shared local-voice runtime, Python 3.12, Node 22+, ffmpeg and pinned HyperFrames dependencies.

1. `python <skill>/scripts/new-project.py <new-dir> --language vi|en [--voice "Hải Đăng"] [--brand "Name"]`.
   Existing directories are refused. Work in the copy. Inspect the included `editorial-study.html` and adapt relevant
   helper calls while scoring the composition; its three transitions are examples, not a required count. Choose
   reading-area changes before polishing audio.
2. Edit script.json using [references/script-schema.md](references/script-schema.md). Both language fixtures trace
   integer assignment. They exercise the API; their repeated staging is not the prescribed production composition.
   Verify factual claims when needed and record source/illustrative limits in facts.md.
3. `python <skill>/scripts/validate-script.py --project <dir>`.
4. `python <skill>/scripts/tts.py --project <dir> --engine vieneu` (or the English local engine).
   `voice.json` controls the stored voice/speed. Explicit voice flags override it.
5. `python <skill>/scripts/sync-narration.py --project <dir> --no-bgm`.
   No music is supplied. User-provided music can use `--bgm`. `--music-only` creates a silent timing preview;
   label it as such rather than claiming a finished voice recording.
6. `python <skill>/scripts/motion_audit.py --project <dir>`. Review real stillness/reveal timing, not report scores.
   Custom JS choreography needs a browser-exported operation manifest and explicit before/middle/after evidence.
   Run `motion_audit.py --project <dir> --custom-operations <manifest.json>`; never fabricate stock events to clear warnings.
   Run `hyperframes lint <dir>` and `hyperframes check <dir>`. The known root subcomposition warning is nonblocking.
7. Inspect every shot, important action triplets, code reveals, state commits and reverse seeks. Read Vietnamese
   diacritics, check overflow and settled text contrast (target 4.5:1), and listen across important cues/boundaries.
   Keep future text truly hidden with ancestor display/visibility, not only opacity. Honor requests to skip QA.
8. `hyperframes render <dir> --quality high --output <dir>/renders/<slug>-9x16.mp4`.
   Verify dimensions, frame rate, duration, audio and full ffmpeg decode. Deliver a playable preview with actual
   voice/duration and honest QA limits. Record library usage only after a successful render with those assets.

The template needs pinned GSAP 3.14.2 from CDN; local fonts/icons need no network. A QA request interception is
not proof that the HTML itself works offline. MP4 is self-contained. No commit, push or external publishing is
implied by creating a video. Stop after focused checks pass unless new evidence or user feedback warrants repair.

Read [references/srp-case-study.md](references/srp-case-study.md) for the rejected first trial and the visual rebuild, including what remained a reading interval.
   V2 and v3 were accepted by the user with the remaining limits acknowledged. Preserve these baselines;
   acceptance does not imply exact reproduction of every reference feature.

## Maintenance boundaries

Keep theme.json, template/theme.js, theme.css, emphasis.css, compositions.css and asset-style.json aligned.
The old tone names remain supported but now select **dark tints and identity accents**, not bright solid fills.
`morph` settles to a neutral dark panel without overwriting identity labels. Source copies and accepted Bento
projects remain unchanged. [references/validation.md](references/validation.md) records this skill's creation checks
and separates reference observations, implemented primitives and proposed choreography.
