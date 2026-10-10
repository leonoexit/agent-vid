# Reusable paper containers

A backplate is a foreground paper piece carrying a label. It is not a full-frame background, frame or scene illustration. The supplied library is under `template/assets/backplates/`; the project initializer copies it and `backplates.js` into each new project.

Use a hybrid workflow: inspect the supplied pieces first, reuse a suitable material and aspect ratio, then generate a new piece when the actual copy or art direction does not fit. Do not require a fresh generation for every label or video. Do not stretch an old piece, shrink type below readable size or force a long paragraph onto a narrow strip to avoid creating a needed asset.

| Kind | Use | Text |
| --- | --- | --- |
| white-strip | a single long statement | dark ink |
| white-note | a short statement or two short lines | dark ink |
| purple-strip | qualifier, caveat, contrasting statement | white |
| yellow-strip | result or emphasized fact | dark ink |

The library's four assets were generated with the built-in image tool using the user-supplied reference as a style input. Original transparent PNGs are unmodified. `catalog.json` saves prompts, hashes, original dimensions, visible bounds and manually selected safe text rectangles. Coordinates are `[x,y,width,height]` in original pixels; safe rectangles are conservative and avoid torn edges/curls. `backplates.js` is the synchronous runtime subset; update both when adding a piece.

```js
const label = Collage.backplate(scene, 'MỘT Ý QUAN TRỌNG', 90, 700, {
  kind: 'white-strip', width: 800, size: 42, rotation: -2
});
// Animate the returned wrapper: raster, lettering and shadow travel together.
Collage.enter(timeline, label, spokenCue, {x: -80, y: 0});
```

`width` describes the visible paper width. The helper scales both axes equally and excludes transparent margins from layout sizing. Lettering is native, centered in the registered safe area, and uses explicit newline breaks; it never auto-shrinks or silently wraps. Wait for fonts and image decode before review. Check the rendered text bounds against its safe rectangle, including Vietnamese accents. Shorten/split wording, enlarge the plate, choose a different ratio or generate a new ratio when it does not fit. The shadow follows image alpha and is applied only once.

For a new piece, specify blank paper, true transparency, exact material/color/aspect ratio, a broad uncluttered interior and no baked cast shadow. Inspect the result before registering bounds and safe area. Keep text-bearing expressive heroes generated with their exact wording when that is the stronger design choice. Do not turn all text, captions or headlines into containers.
