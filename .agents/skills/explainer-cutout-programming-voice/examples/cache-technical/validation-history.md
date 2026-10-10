# Validation — 2026-10-07

Current art direction is v0.3.6: no background imagery or generated frames. Earlier entries are historical test records; all earlier background directions, including the v0.3.4 monochrome photograph option, are superseded.

Implemented: one Contemporary Cutout programming-explainer style; standalone narrative/art/asset guidance; two original built-in ImageGen RGBA assets with exact prompts and SHA256 provenance; local fonts/GSAP; editable three-panel style study; native cache-store/cache-hit sample; new-project and schema/cue helpers.

Checked in a freshly generated silent 27-second cache project using the existing Bento narration sync utility with `--music-only --no-bgm`:

- Script schema and exact spoken cue validation passed.
- Chrome browser smoke passed: store commits 42, source retains 42, hit preserves source-call count 1, transfer proxy disappears at commit, reverse seeking reproduces sampled state.
- Synthetic word times exercised captions; the visible caption and operation snapshots were inspected. These are not measured speech timings.
- HyperFrames check passed: no runtime, layout or motion errors; 44/44 text contrast checks pass. One structural lint warning remains for the existing nested composition convention. A layout info reports intentional temporary overlap as the native copy leaves its source; proxy overlap annotations are limited to the transfer element.
- The three-panel sheet was inspected, including title/photo separation, legibility and the corrected source-call counter. Mid-transfer frames and the caption sample were inspected.
- Both original 1254×1254 PNGs are RGBA with alpha ranging 0–255 (roughly 70% and 67% transparent). Photos were inspected in the light/lime/lilac compositions and on a dark field. The raster originals remain unchanged.

Scope limits: no TTS, listening review, final encoded MP4, production pacing test, English visual fixture or cross-topic test in this skill-creation task. The static 43/42 freshness comparison is a composition specimen; the running sample implements only miss/store/hit. Template estimates are not evidence of narrated timing or audience comprehension. Subsequent videos must use their own example, imagery and state model and undergo actual audio/video review.

The bundled fonts are local, but this installed HyperFrames compiler also resolves cached Inter faces; a fresh compiler cache may require network access. Browser smoke currently targets Chrome at the standard macOS application path.

## v0.2 — iteration from the index-zero trial

Inspected the trial's storyboard, choreography source and encoded contact sheet. Its sole apple photo remained stationary after the introduction while labels/selectors changed. This evidence supports improving asset-role planning and shot staging; it does not measure the user's attention or establish perceptual timing from listening.

Added mixed-material composition guidance, gen-img briefs for metaphor/context/separable parts, clause-level shot scoring, a roughly-three-second attention review heuristic, reusable GSAP presentation helpers and a standalone 9-second motion study. The old cache starter and existing user video are preserved. The style-preview PNG remains the original palette study, not proof of the upgraded motion or asset range.

The new study uses existing generated hand/card and tray photos; no new raster family was generated in this revision. Its copy commits at 5.1s, retains source 42 and can be sought backwards deterministically. Chrome smoke checks before/after commit, transient-copy cleanup, preserved source and reverse seeking across sampled moments; screenshots inspect reveal, travel and reframing. A first reframe cropped evidence and was reduced before saving. No narrated test video, full encoded export or improved audience engagement is claimed. Test the revised skill on a new production before calling these quality issues solved.

Reproduce the focused browser check from the repository root with `node <skill>/scripts/tests/choreography-browser.cjs <skill> [screenshot-dir]`. This uses the workspace puppeteer-core and the standard macOS Chrome path. Open template/motion-study.html and use Play or the scrubber to review it in motion.

## v0.3 — generated typography and continuous joins

Inspected index-zero-orange-v2 storyboard/scene implementation and the production review. The scene builder still toggled entire pages at section boundaries; matched-object gestures used different wrapper/image sizes across the swap. This supports a discontinuous layout explanation, not a confirmed renderer fault or a listening-based timing judgment.

Changed guidance: fixed expressive text may be generated into imagery, either a complete composition or separate text-bearing parts. Dynamic data/code/captions remain native. Added an original built-in ImageGen RGBA artwork “BẢN SAO”, with exact prompt/source/hash recorded in typographic-asset-prompt.json. Inspected the wording/diacritic and its portrait placement; the asset is a single inseparable composition. It has pronounced paper texture, which is an example rather than a required texture intensity.

Changed runtime: added joined-page push helper; wired it into the cache starter in place of abrupt page visibility resets. A separate six-second transition study consumes the new image and demonstrates two directions. Chrome checks cover 59 frame-scale samples around the two joins, complete viewport coverage, forward/reverse equality and runtime errors (none). Screenshots at start/mid/end and the typography landing were inspected. This validates the demonstration geometry, not universal transition quality.

Fresh-project creation and silent narration sync passed; cache state/commit/source preservation, reverse seeking and synthetic captions passed. HyperFrames check passed with 44/44 contrast checks, no runtime/layout/motion errors or warnings; the inherited nested-subcomposition lint warning remains. Layout info includes temporary off-canvas text during the intentional joined-page push and source/proxy overlap. No full narrated or encoded test was produced in this skill-only revision. Existing user projects were not modified.

Run `node <skill>/scripts/tests/transitions-browser.cjs <skill> [screenshot-dir]` from the repo root. Actual production joins still require review with narration and short encoded intervals; the simple push is a working fallback, not the prescribed aesthetic for every scene.

## v0.3.1 — broaden the role of generated imagery

The user reports that the latest video is engaging and clarifies that generated imagery should also shape UI, layout, frames and backgrounds. Updated art/asset planning and the entrypoint accordingly, removing the implicit split where images only supply subjects and native code supplies all framing. This is guidance refinement; no new asset, renderer change or video test was produced, and existing positive motion findings are preserved. Validate a new scene composition in the next production before claiming coverage of these additional roles.

## v0.3.2 — storyboard decisions precede HTML layout

User explicitly requested that each scene consider gen-img for layout/material before deciding what code must change or animate. Updated the entrypoint, asset planning, production sequence and copied storyboard/review instructions. Added a compact per-scene medium decision record, with scene-specific rationale for major native design choices and no image quota or approval gate. The existing cache score is explicitly a minimal runtime example rather than a ready-made design decision plan. Documentation validation only; runtime, generated assets and historical projects are unchanged. Whether another agent follows these decisions still needs observation in the next production.

## v0.3.3 — referenced variants and background text ownership

Inspected index-zero-offset's actual zero-steps.png and memory-console.png, saved generation prompts, storyboard and story implementation. Only the zero-step label was generated; subsequent step statements are native. The “BỘ NHỚ” background heading was explicitly requested in the prompt, not unsolicited tool output. The user reports the resulting video regressed.

Removed the misleading blanket implication that any changing label must be native. Added guidance to complete finite authored label families from an actual accepted image reference, and to align visible bounds during swaps. Added explicit text/no-text ownership; reusable backgrounds default to no headings while intentional scene artwork/UI may integrate purposeful words. Updated the entrypoint, production and copied storyboard/review instructions together. Documentation validation only: no new images or video were generated and no user project was edited. The next production must demonstrate the required families and appropriate background use; these edits alone do not prove the aesthetic issue is solved.

## v0.3.4 — contextual monochrome background

User explicitly removed generated-frame and designed-background directions. Updated active instructions and storyboard/review templates consistently: background now means a generated photograph of a setting or surface, treated in monochrome/one hue and visually subdued under the foreground subjects. Plain native canvas color is a separate concern. UI remains available only as purposeful content, not a relabeling of a generated framing panel. Foreground typography, referenced label variants and motion helpers are preserved. Documentation validation only; no image/video generation, project edits or claimed visual test of this new treatment.

## v0.3.5 — remove background imagery

User removed the background initiative entirely. Active skill instructions, asset planning, production and storyboard/review templates now use a simple native canvas color and omit all background imagery, including the previous monochrome option. Foreground assets, label families and runtime motion remain intact. Documentation validation only; no project edits or new media.

## v0.3.6 — inside-shot choreography

Inspected index-zero-distance story.js, storyboard, review and encoded contact sheet. Read its paused GSAP timeline in Chrome: the 60.76s animation contains spatial motion in the opening/rearrangement, selector/hand travel, one memory bracket and page transitions. The Python passage from 40.40s until the outgoing transition at 51.24s has no scheduled spatial tween; the recap from 51.94s to 60.76s also has none. Fades, highlighted values and captions still change, so these are held compositions, not claims that every pixel is static. This limited inventory does not establish perceptual playback or exact voice sync.

Updated guidance to separate model changes, inside-shot presentation gestures and specific reading holds. Replaced vague hold justifications with actual intervals/clauses/evidence, added worked staging options and required honest distinction between still-frame QA and normal-speed pacing review. Existing motion primitives already support these gestures; no runtime or user project changes were made. Documentation validation only; the next production must demonstrate improvement.
