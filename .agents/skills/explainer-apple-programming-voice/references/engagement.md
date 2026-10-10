# Captions, focus and visual rhythm

Write the clause, its visible change, semantic identity and focus decision in the storyboard together. Consider a muted viewing pass: can the viewer identify the action and result from visuals plus captions? Do not add unexplained motion to compensate for an unclear script.

## Captions

Use one project-level semantic color map for assets, labels and caption keywords. For example, a repo can be violet and commits mint; these assignments are not universal. Bright material colors need darker readable caption relatives (e.g. violet #6244b8, mint #006b54 on off-white). Keep ordinary words dark. Color supplements the actual name/shape; a viewer should not need color vision to follow.

Keep a line or short two-line phrase visible while spoken. Use actual word timing after narration sync, and keep TTS phonetic spelling separate from display text. Group by phrase and measured rendered width; do not assume a fixed character count fits every line. A subtle active-word background can follow speech. Reserve a short 1.03–1.06 transform pulse for meaningful keywords, not every spoken word; reserve enough spacing so the transform never overlaps neighboring glyphs. Do not animate font size/reflow.

Captions stay in a screen-space HUD outside the camera wrapper, with a stable opaque or sufficiently quiet backing if necessary. Starting portrait placement: left 86px, right 116px, top 1580px, height 176px. These are internal design margins, not guaranteed Facebook safe areas. Adjust around actual content and inspect at 360×640; interface overlays vary. Captions must not obscure the changing value/code or run beyond the frame.

## Camera

Use a modest push-in or short pan when a small important change would otherwise be missed, such as quantity 2 → 3 or a new history node. First establish the subject and destination. Start focus before the decisive action, hold through its explanation, then return to overview before the next relationship. Keep both source and destination visible when explaining transfer/copy.

The helper uses a dedicated world wrapper, explicit stage coordinates, scale 1–1.2 and a return to neutral. Begin around 1.08–1.14 and 0.5–0.8s travel; these are craft starting points. Camera intervals must not overlap. Compose around the focus rather than leaving blank edges. Do not simultaneously zoom the HUD, move the subject away, and swap the headline. Skip camera movement when the scene already reads well. No random drift, perpetual breathing or added renderer dependency.

## Context fields

Use a softly tinted field when the explanatory role changes, not a mechanical color rotation by chapter. Useful starting fields: paper #f7f8f6, cool #eef4fb for inspection, lilac #f1eef9 for history/relationships, mint #edf7f1 for result, warm #faf0eb for a question. Roles and associations may differ by topic; document the chosen map. Preserve object identity colors across backgrounds and transitions.

Crossfade or tween the background layer separately from the subject and HUD. A field change gives rhythm; a new context also needs a meaningful composition or evidence change. No required six phases or fixed scene count.

## Review

Inspect immediately before/during/after state changes, focused shots and the return to overview. Scrub forward then backward and compare the same timestamps. Look for repeated append operations, future values visible early, caption collisions and flashes at scene boundaries. Check the final encoded video for stutter; browser-only success is insufficient. Report audio/timing reviews not performed.

For each scene, also inspect the interval after its principal action finishes. Confirm that the remaining narration is supported by visible evidence or an intentional reading/comparison task. Fix small unnoticed changes through scale/composition and asset clarity; fix unsupported narration through better staging or shorter wording. Caption animation and ambient motion alone do not establish progress. Check selected intervals in the final encode and record what was actually reviewed; no fixed animation-rate quota is required.
