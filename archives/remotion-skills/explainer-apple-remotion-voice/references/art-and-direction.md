# OneNotch-inspired portrait direction

## Evidence to preserve

Read the source contact sheets alongside the first preview. At0–5.5s the reference has saturated feature circles inside white sculpted icon housings, slanted surfaces, cast shadows, different object scales, generous whitespace and a coral/pink word accent. At44–50s the view changes scale around an actual source→action→result. These are central features, not optional finishing touches. A gray documentation layout with bold Inter alone misses the reference.

## Materials and color

Neutral canvas #f7f8f6. Ink #161719. Ceramic assets use a white front, slightly cooler edge, broad contact shadow, soft color bounce and a directional highlight. Inner colored lenses use a limited, intentional palette: coral #ff516f with warm #ffb08e light and magenta #de389d shadow for x; blue #168ff6 with cyan #7ce2ff light and violet #7364ef shadow for y; mint/teal for the copy icon. The colors identify objects/operations, not memory addresses or data types.

Inter headlines around100–145px at1080×1920; JetBrains Mono code around40–48px; value glyphs scale with their asset. Use coral→pink title accents sparingly. Fonts and colors alone do not establish the style: silhouettes, material highlights, scale and negative space matter. Avoid thin gray outline cards with a floating number as the only visual asset.

## Reusable asset kit

`src/Assets.jsx` provides `SculptedTile`, `CopyGlyph`, `ValueToken`, `CodeCapsule`. `theme.css` supplies their layered materials. Tiles have a stable label, color family and value. The token has layered sheets to communicate a copy; the original remains. The play triangle in a code capsule indicates the instruction being shown, not an interactive control or simulated mouse action. These are native CSS/SVG assets, not source footage or physically rendered3D models.

For a new concept, author a small coherent kit that expresses its objects and actions. Do not append unrelated ornaments to fill whitespace. Keep procedural native diagrams where exact state matters; use separately authored illustrative assets only when their contribution is visible.

## Shot grammar

Use a shared stage with continuous object identity. A stable subject need not occupy one screen coordinate forever. `shot-plan.mjs` holds target poses and frame-driven28-frame transitions. `camera.mjs` provides the shared world-to-screen camera. CSS perspective gives icon surfaces a mild tilt; it must not make labels unreadable.

The included sequence changes framing deliberately:
- Question: floating x/y/copy assets, typographic question, compact three-line code reveal.
- Setup: x becomes the large subject; y leaves the view. The number appears when the voice identifies it.
- Copy: x/y share the frame; camera/layout settles before a duplicate5 crosses. Original5 stays in x.
- Change: x becomes prominent, with y smaller but still readable. Only x changes to9.
- Verify: attention moves to y while x remains as context.
- Rule: pull back to both; a brief scoped rule closes the lesson.

Captions stay below the stage around y=1700. Keep critical assets within x=60–1020 and above y=1600. These are safe limits, not permanent layout slots. Check perspective bounds, values and captions during movement. Leave code/camera still during the crucial copy and overwrite. Avoid continuous bobbing or an unrelated background change at every beat.

## Review against the failed first trial

Check four dimensions before final output: recognizable designed assets, reference-derived color/material, meaningful shot-scale changes, and action continuity. Compare actual keyframes to `detail-intro.jpg` and `detail-drag.jpg`. If only the heading and digits differ across the storyboard, the film is still effectively a slide. This review is qualitative; do not convert it into claims of improved viewer comprehension.
