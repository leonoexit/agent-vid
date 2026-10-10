# Template contract and honest extension boundary

Common script shape: `language` vi/en, `title`, `audience`, `story:{question,example,takeaway}`, `intro`, `scenes`, `outro`. Every section has `title`, `vo`, optional `hold` and a `cues` object mapping a project-owned name to an exact spoken phrase or `{on,occurrence}`. Cue names are not narrative phases. `intro/scenes/outro` are voice/timeline containers, not a prescribed teaching order.

The shared sync utility writes `window.SCRIPT` and `window.PLAN`: sections have id/start/dur/voStart/voDur/words (absolute t0/t1). It injects audio between AUDIO markers in index.html. `#root` and `#explainer` durations are updated by that utility; preserve those IDs and markers.

`motion.js` owns cue resolution, DOM/SVG construction helpers, timeline reveals/translations, captions and review operations. `story.js` owns the worked example's nodes and meaning. The shipped scenes use sample-only fields `n`, `view`, `result`; they demonstrate 7/8/9 modulo 3 and reject incompatible values rather than quietly render false mathematics. Replace these builders when adapting the topic. There is no generic `layout` enum and no automatic arbitrary code execution.

`bauhaus.css` offers color fields, silhouettes, display type, panel/rail styles and caption safety. `style-study.html` is an editable six-specimen contact sheet. It demonstrates multiple compositions rather than promising six automatic video modes. Caption words appear only when synced timing exists; missing timing sets `BAUHAUS_ESTIMATED_TIMING` in the preview.

To add a new case: define actual model state and operations first; add project-owned native nodes; connect named spoken cues to transformations; ensure future states begin hidden; register all changes on the same paused timeline. Reuse the visual tokens instead of freezing the sample's positions. Test final values, action boundaries and backward seeking with data relevant to that case.
