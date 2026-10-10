# Runtime and example boundaries

`new-project.py <destination>` creates the neutral scaffold. It contains local fonts/GSAP, CSS vocabulary, generic helpers, an empty script and an intentionally unimplemented story. It has **no sample subject, finished composition or default timeline**. Draft validation fails until a real script is authored; opening the draft reports an authoring notice rather than pretending to be a deliverable.

Use `--example cache` only to study or test the preserved Vietnamese cache implementation. This explicitly selected example includes its original images, script, static sheet and silent studies. Do not relabel it to answer another topic. Its scene-count/language guard and cache semantics are example-specific.

Script schema: `language` vi/en, `title`, `audience`, `story` with `question/example/takeaway`, `intro`, nonempty `scenes[]`, `outro`. Each section has `title/vo`, optional `hold` and `cues`. Cue values are exact phrases or `{on, occurrence}`. The validator checks schema and cue presence; it does not validate the model or visual quality. Technical sections need not create separate visual pages.

Preserve `root`/`explainer` IDs, composition timing attributes, the AUDIO markers and composition id `cutout-programming`. Narration sync writes `project-data.js` with `SCRIPT` and `PLAN`; `PLAN.sections` supplies start/duration/word timings. Construct after DOMContentLoaded, register one paused timeline under `window.__timelines['cutout-programming']`, and extend it to `PLAN.total`.

- `design.js`: coordinate-explicit box/text/image/plane/arrow primitives only; no preset story compositions. Supply correct image aspect ratio and alt text. Pass `paperLabel: true` for generated paper labels to use the alpha-following pasted-paper shadow; direct DOM authors use `class="cutout paper-label"`.
- `motion.js`: exact phrase cues, captions, reveal/move helpers. Missing word times set `CUTOUT_ESTIMATED_TIMING`; estimated timing is not audio verification.
- `choreography.js`: optional presentation primitives; project code owns their meaning and sequence.
- `story.js`: project-owned construction, semantic state, timing and editing. Prebuild state variants and schedule visibility/transforms, so forward/reverse seeks reproduce the same result. No wall-clock animation or onComplete DOM mutation.

Keep captions outside reframed content. When adapting the example or scaffold, review all visible copy for the chosen language. No finished English visual fixture or narrated aesthetic benchmark is bundled.
