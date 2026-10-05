# Scene changes and motion diagnosis

## Environments have explanatory roles

Choose contexts from the concept: input/interface, mechanism/data diagram, observable outcome, concise code recap. A video may use only the contexts that help its lesson. A new context must answer a new question; changing background color or moving the same two cards does not demonstrate environmental range.

Identify one object that survives each transition: a value, request, item or instruction. Keep its name, color and state consistent, and narrate the causal link. Preserve endpoints when an action needs comparison. The if/else example moves the same blue age token through a form, comparator and gate. The gate is a stylized result environment, not a real product or legal access rule.

Starter routing: `visualMode:gate` uses `GateLesson.jsx`, `GateAssets.jsx`, `gate-model.mjs`; the assignment example uses `Lesson.jsx`, `Assets.jsx`, `model.mjs`. `sectionLayers` in `transitions.mjs` crossfades environment layers with weights summing to1; its separate `textOpacity` fades the old text out before revealing the new text, preventing double titles. A persistent actor is rendered once above those layers; do not duplicate it by crossfading two entire scenes. `poseAt` samples continuous positions, including interrupted motion; `glyphState` retains the old value during a short value transition.

## Frame pacing versus authored jumps

Do not assume “Remotion stutters” is a renderer failure. Check encoded presentation timestamps, frame count and consecutive-frame differences. Inspect the exact transition and compare with source sampling. A constant-frame-rate file does not rule out viewer/GPU playback drops, but missing/duplicated source frames need separate evidence.

Observed in the assignment-v2 trial:886frames had regular1/30s timestamps, and all29 frames in the265–293 transition were distinct. At section boundaries, the full-frame luma difference jumped from0 in the hold to roughly2.3–4.1 because headings/code/background layers were removed immediately. This demonstrates authored discontinuities; it does not prove they explain every reported jerk or exclude playback issues.

Implemented repair: dissolve old/new overlays over16frames, crossfade glyph changes, and keep the tile at a fixed360px geometry with compositor transforms for size. Changing the font size and box dimensions on each frame can cause text re-rasterization differences; treat that as a plausible contributor, not a proven browser bug. Do not raise fps or add fake motion blur as the first response to a cut authored into the animation.

Run `python scripts/audit-video.py renders/<file>.mp4 --plan src/generated.json --out qa/motion-audit.json` from the project for CFR and boundary pixel-difference evidence. The audit is diagnostic; a metric alone cannot judge smoothness or intent. Inspect boundary strips and essential actions too. If encoded frames look continuous but playback still jerks, compare players/performance before changing the animation again.

## Transfer evidence

Record what each test covers. Assignment exercises primitive copy, persistent object identity and close/overview framing. If/else exercises conditional branches, changing input, inclusive threshold and movement across role-specific environments. Broader claims remain untested. A new concept requires its own model, assets and narration rather than relabeling a demo.
