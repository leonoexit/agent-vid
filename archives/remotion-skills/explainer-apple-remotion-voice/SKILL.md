---
name: explainer-apple-remotion-voice
description: >
  Create narrated vertical programming explainers with Apple-inspired / OneNotch visual direction and Remotion. Explain one concept through a small worked example for beginners, with sculpted colorful assets, changing shot compositions, persistent object identity, motivated framing and Vietnamese or English voice. Use for Apple-style programming explainers and further Remotion experiments in this workspace; not software advertisements.
metadata:
  version: "0.4.0"
---

# Apple-inspired programming explainer

Make a **1080×1920, 30 fps narrated explainer**, tracing one programming concept through one small example. Audience: hobbyist beginners with basic logic knowledge. The OneNotch reference supplies art and shot direction; it does not change the format into a software launch film. Future Remotion experiments requested in this style belong here. Preserve the Bento skills and historical videos.

Read [scene-and-motion.md](references/scene-and-motion.md) when choosing environments or diagnosing uneven motion. Read [art-and-direction.md](references/art-and-direction.md) before planning visuals, and [remotion-workflow.md](references/remotion-workflow.md) before generating a project. [reference-analysis.md](references/reference-analysis.md) distinguishes observed source patterns from implemented features.

## Explanation before motion

Choose a question whose answer can be demonstrated on screen. Introduce only the objects the example needs; run a concrete action, show its state change, then explain the consequence. Finish with a short rule and its necessary boundary. Use this causal progression flexibly; there is no mandatory six-slide structure or duration quota. Roughly 30–50 seconds suits the bundled example.

Write narration and observable states together. Prefer explicit names over ambiguous pronouns. Keep each essential action in view while the voice describes it. Do not require reading code, learning several new terms and following a traveling camera simultaneously. Reduce copy before speeding up speech. Quiet intervals need a stated reading/prediction task.

Stable object identity is the explanatory anchor; this does not require fixed screen positions or a frozen dashboard. Establish the subject, move into a meaningful detail, stage the action and return to context. Retain enough context during essential state changes to identify the affected object and compare before/after. An attractive frame or successful render does not prove comprehension. Avoid the prior Stack/Undo failure: too many interacting ideas and visual operations made the explanation hard to follow despite polished motion.

The bundled **number assignment** example is a working starting point, not a universal metaphor for every language or value type. It demonstrates JavaScript primitive numbers (`let x = 5; let y = x; x = 9;`). Do not generalize its copy behavior to object cloning or turn logical variable cards into claims about physical memory layout. A different concept needs a matching semantic model and diagram. A second implemented example, `--example if-else`, follows an age token through an input form, condition workbench, gate response and code recap. Two tested examples do not establish general reliability across all programming topics.

## Visual grammar

Read the reference as a complete visual language: sculpted, colorful feature assets; clean negative space; coral/pink typography accents; visible shifts between overview and detail; objects connecting the shots. A white background with bold type, pale cards and a tiny zoom is not an adequate adaptation. The user rejected the first portrait trial for precisely that reason.

Use designed assets as subjects. The bundled native asset kit has ceramic icon housings, saturated gradient lenses, edge highlights, contact shadows, colored reflected light, a copy glyph and a layered value token. Use material cues consistently and keep glyphs legible. Expand the kit for a new topic instead of forcing every concept into two generic cards. Native CSS/SVG assets are appropriate for precise diagrams; custom raster/3D art may be used when it adds material qualities the native kit cannot supply.

Compose shots around the action rather than reserve permanent rows for title, full code, diagram, summary and footer. For this starter: icon-led question → one large subject → two-object copy → close-up of the changed x → focus on unchanged y → shared conclusion. Persistent identity, color and narrative order connect these layouts. The full code is introduced once; the relevant instruction returns near the active subject. Captions remain in screen space.

Use white/neutral space with localized coral, blue and mint assets and coral-to-magenta title accents, derived from the reference. Keep color roles consistent; do not flood the background with unrelated gradients. Camera/reframing must change the shot visibly and settle before an important transfer or reading. Preserve both endpoints during a copy. No arbitrary 1.06 zoom ceiling, no mandatory fixed title row, no camera drift for its own sake. The skill bundles a 2D camera and perspective-styled assets, not a physically simulated 3D scene.

## Production and review

1. Update reusable resources before testing an improvement. Create a fresh project with `scripts/new-project.py` and author its `script.json`, semantic model and storyboard.
2. Generate local narration, compile phrase cues, then preview. Vietnamese default: **Hải Đăng**, male Northern Vietnamese; honor explicit voice and stored project preferences. English uses the bundled Kokoro path. Keep captions outside camera transforms.
3. Use pure frame-driven state; random seeking must not change the result. Keep asset geometry fixed and animate transform scale rather than changing font/box dimensions every frame. Blend adjacent scene layers and glyph changes; do not replace a large visible overlay in one frame unless an intentional cut is appropriate. Check actual concept correctness, transfer completion and no premature result reveal. Test with alternate values when the example is parameterized.
4. Inspect an opening, close-up, transfer midpoint and result at phone scale, and compare those frames with the actual source contact sheets. Check asset material, color, framing and continuity, not merely absence of clipping. If the frames look like one slide with swapped text, revise before final rendering. Inspect action boundaries and intermediate frames. Render the MP4, check full decode, audio metadata and representative encoded frames. Listen when audio playback review is available; otherwise disclose that the voice and timing have not been reviewed by ear. Pause-assisted word timing is approximate.
5. Deliver the local MP4 and record what was tested. For engine/style comparisons, hold example, narration and duration constant and change one major variable. Separate a motion repair on an existing film from a transfer test on a different topic. Report technical benefits separately from aesthetic or comprehension judgments.

Implemented: portrait shot choreography, reusable native sculpted assets, perspective transforms, local fonts/TTS, word captions, phrase cues, 2D camera framing and deterministic renders. Real 3D camera, depth-of-field optics, beat-synced soundtrack and automated pedagogical evaluation are not implemented. No music is required; use it only when it supports intelligibility.
