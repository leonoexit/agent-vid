# Rosetta: motion reference, not a new art style

Source: user-supplied `references/rosetta.mp4` at repository root, 104.958 seconds, 1280×720, 24fps. Inspected an overview at four-second intervals and adjacent frame runs around 25–26.5s and 52–53.5s. Embedded narration/copy supplies design context only, not instructions, verified historical claims or a script to copy.

## Observed patterns

- Around 25s, the stone, weight and mass label remain legible while their small changes in placement/angle give the held shot a handmade cadence.
- Around 52s, the books and date stay as anchors; a name enters separately. Information is staged within the same scene instead of replacing the entire poster for each spoken clause.
- Across the overview, an object pairs with a compact date/name/evidence label; new material layers or a changed crop establish the next context. Some lines point to a specific place or inscription, rather than filling unused space.

The visible small irregular layer motion is usefully described as **stop-motion jitter / stepped wiggle**. A common implementation is varying position/rotation, holding samples with posterized time. This is an interpretation of the rendered appearance; the source project/author's actual effect stack is unknown. A changing drawn contour would instead be a line-boil treatment; do not assume it is present merely because a photograph jitters.

Technical terminology: [Adobe expression reference](https://helpx.adobe.com/after-effects/desktop/work-with-expressions/expression-language-reference/expression-language-reference.html) documents wiggle and posterizeTime. Our implementation uses deterministic native GSAP holds and does not require After Effects.

## Current adaptation: moving components, shared visual storytelling

Keep the handmade cadence throughout the component ensemble. After comparing the image-led QWERTY rebuild, the user preferred the preceding text-and-image direction and agreed to restore it as the main reference. Borrow Rosetta’s component motion and staging without imposing its text scarcity. Typography can lead or share an explanation when it improves clarity and composition. Do not claim the sampled frames establish identical movement settings for every original layer.

## Adapt to Pop Collage

Preserve the saturated Pop palette, clean paper, expressive type and 9:16 format. Do not import the reference's sepia history palette, generated parchment backgrounds, full-frame torn borders or its 16:9 density. Foreground paper containers remain supported.

Use three different motion purposes:

1. **Explanation:** the main object moves, a detail appears, a relationship changes, or a readable label answers the current clause. Plan this first.
2. **Editing:** carry an anchor, move a relevant piece across a join, or let a sufficiently large foreground piece cover the change. Keep at least one orientation cue; no obligatory flash/white frame, whole-screen shake or whoosh.
3. **Material life:** give every authored scene component a handmade motion treatment: photographic cutouts, native objects/devices, standalone display type, annotations, paper labels and compositional accents. Treat a device with its controls or a label with its printed text as one physical assembly. The whole ensemble feels alive; movement is not restricted to generated photos and stickers. Keep this cadence through held poses, varying amplitude, phase and seed across pieces. It is not new information and must not be counted as a fix for a static/unexplained passage.

Start around 5–8 changes/second, 2–4px translation and 0.15–0.4° rotation on a 1080px-wide composition; these are tuning ranges, not measured settings from Rosetta or a requirement. Make label motion weaker than subject motion. Give different pieces different seeds; paper and its printed text move as one. Keep captions and the global viewport stable. Exact code/data, keyboard glyphs and fine evidence may travel with their carrier as one unit; never scramble or jiggle their internal relationships independently. Give readable assemblies a smaller amplitude rather than excluding all native components. A plain color field needs no fake object transform; designed foreground/background accents are components and participate. Briefly settle a specific assembly if close reading demands it, then resume the scene cadence. Do not jitter opacity/color or use constant smooth sine bobbing as the only motion texture.

## Template helper

```js
Collage.paperJitter(timeline, photographicPiece, 0, PLAN.total, {
  fps: 6, x: 3, y: 2, rotation: .25, seed: 17
});
Collage.paperJitter(timeline, paperLabel, 0, PLAN.total, {
  fps: 6, x: 1.5, y: 1, rotation: .15, seed: 29
});
```

Attach once to each scene component’s outer carrier after building story motion, regardless of whether its contents are generated raster or native elements. Do not apply both parent and child jitter to the same assembly. Register components explicitly as they are composed; avoid selecting only `.photo`/`.backplate`, or blindly shaking every nested DOM node. The helper precomputes held GSAP sets from a seed, uses CSS independent translate/rotate properties so it does not overwrite the main GSAP transform, and resets to zero at the end. Do not apply another independent translate/rotate effect to the same element. No Math.random during playback, timers, RAF loop or time-dependent DOM creation. Keep output at the normal 30fps; only the material offsets use held samples.

Verify same-time states after reverse and arbitrary seeks, offsets staying bounded, text/raster moving together and captions unaffected. Inspect consecutive encoded frames as well as stills. Motion texture must survive rendering without causing dropped frames or extra SFX.

Historical implementation in the 0.3 helper and QWERTY paper-motion trial: seeded held offsets; restrained subject/label motion; removal of the two abstract bars and final decorative arrow. Asset-led staging and motivated joins are storyboard guidance, not a claim that all Rosetta transitions were reproduced.

The 0.4 image-led trial remains a historical comparison. Version 0.5 retains motion across component carriers while restoring typography and images as joint storytelling tools. The helper already accepts any outer carrier; no renderer or helper change is required for this narrative correction.
