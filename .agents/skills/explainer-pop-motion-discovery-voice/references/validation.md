# Pop Motion validation and provenance

Created 2026-10-09 as an independent trial. Baselines preserved unchanged: Pop Collage v0.6.1 and Pop Narrative v0.1.1. The user approved the revised Git video made with Narrative; that initial approval belonged to Pop Narrative. Pop Motion subsequently received its own approval below.

Copied resources: Pop Collage art references, fonts/licenses, paper backplates, neutral scaffold and production scripts; Pop Narrative story direction and readability audit. Local fixes include explicit entrance transform percentages, restoring jitter bindings after initialization and detection of images nested inside motion groups.

Motion inspiration: installed Reelcrew Motion FX Kit, `references/visual-language.md` (sentence function → visual role, changes of framing/layout/focus) and `templates/kit.js` (`push`, `focus`, `shrink`, `split`). The local helper is independently implemented for Pop's scene/caption structure. No Reelcrew talking-head DOM, renderer, sound defaults or bundled effect catalog is imported. Archival Documentary and Beat Motion remain possible references, not implemented integrations.

Technical smoke test: see `scripts/test-motion.cjs`. It exercises a generated draft in a temporary folder, fit geometry, group moves, focus return, captions outside camera movement, full-frame readability and forward/reverse seek equivalence. This does not establish editorial quality, speech synchronization or audience engagement. This creation-time smoke test was followed by narrated trials; the approved result is recorded below.

## Verified on creation

Skill metadata validation and relative-reference checks passed. The browser smoke test passed all nine checks, including a 360-frame text/paper collision scan. A sampled fixture frame was inspected. SHA-256 comparison of every existing file in both approved Pop skill folders found no changes. No obsolete standalone Pop variant was present in the active skill folders, so none was deleted. Historical videos remain intact.

## Approved image-led direction — 2026-10-09

The user approved `projects/pop-motion/lo-api-key-github-image-led/renders/lo-api-key-github-image-led-accent-9x16.mp4` (“bản này rất đẹp, duyệt skill”). Skill v0.2.0 adopts its image-led picture beats and purposeful heading accents. It preserves Pop materials, Corose headings, JetBrains Mono labels, Inter captions, minimal hand-drawn reactions and voice without music/SFX. Other Pop skill folders remain separate.

Implemented patterns: narration joined to visible object/state changes; asset variants for those changes; meaningful object continuity; labels subordinate to the action; a readable hook with a brief marker swipe. Vox supplies picture-led narration principles only; its aged-paper visual system and audio/render pipeline are not integrated. Motion FX staging remains optional. No requirement to copy this film’s key/lock metaphor, pink/purple/aqua/yellow sequence, shot count or durations.

Project evidence: 43.9-second final MP4, 25 encoded samples/playback checks; 25 browser samples and reverse seeks; 10 causal-state checks; full-frame readability review plus manual image-overlap review. Heading revision additionally checked 212 opening frames for safe bounds. Word timings remain estimated. See the project’s `visual-review.md` and `qa/` for exact checks and limits. User approval establishes this example as the direction, not measured retention or proven coverage of every topic.
