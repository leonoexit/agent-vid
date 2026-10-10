# What is reusable and what must be authored

Common script: `language` vi/en, `title`, `audience`, `story:{question,example,takeaway}`, `intro`, `scenes`, `outro`. Each section contains `title`, `vo`, optional `hold`, and `cues:{projectOwnedName: phrase | {on,occurrence}}`. Cue phrases must occur in the corresponding voice text. Narrative phase names are not required/enumerated.

The shared sync utility writes SCRIPT and PLAN in project-data.js. PLAN.sections contains absolute start/dur/voStart/voDur/words; word times are t0/t1. Preserve root/explainer IDs and AUDIO markers in index.html for duration/audio injection. Wait for DOMContentLoaded when building because HyperFrames may hoist scripts.

`mint.css`: rounded surfaces, palette, type, chips, lobed backplate, captions. `icons.js`: original inline SVG symbols (check, cross, arrow-up-right, arrow-left, plus, bookmark, array, terminal, chevron) with round line caps. `motion.js`: cue lookup, primitive reveals/translations, caption highlighting and an operation record. `ui.js`: shared `MintUI` surfaces and component anatomy (hero, chrome, array/slot, metric, code, row, detail) used in both the sheet and timeline. Helpers accept dimensions, position and supported language options; the array/metric/detail helpers are tailored to the small starter, not arbitrary responsive widgets. `story.js`: the actual model and scene staging.

The starter specifically implements two Array.push operations with an intervening detail view. Its fields `before`, `item` and `items` are **sample data**, not a universal UI JSON schema. The renderer rejects incompatible sequences. A new topic needs appropriate native nodes/relationships and its own project-authored choreography. `style-study.html` demonstrates compositional vocabulary without registering automatic layout modes.

Visible states are preconstructed and switched on the timeline so seeking is reversible. `MINT_COMMITS` records the append/commit times for testing. Each slot has a value marked `[data-item]` and a separate visible zero-based index. A traveling proxy is separate from committed `[data-item]` nodes. At commit, the new item appears, the proxy disappears and `[data-count]` switches to the new value. This is sample-specific correctness, not a general state engine.

Typography approximates the raster; no exact original typeface or motion was supplied. A cover, calendar, real notification system or backend integration is not generated automatically by this skill.
