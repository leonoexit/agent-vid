# Editorial reflow: working examples, not layout categories

Use this when the viewer's task changes from asking to inspecting, overview to code detail, or result to proof.
The source evidence is slides 01/02/06/09/17/18. Source pages are static; these transitions are newly authored.
The three helpers below are reusable geometric operations, not three discovered reference patterns or compulsory scenes.

## Run and adapt

Every new project includes `editorial-study.html`, `editorial-study.js` and `editorial-motion.js`. Open the study
in a browser, press play or scrub its slider. It uses the project's local fonts and the same pinned CDN GSAP as
the stock template. The study is a 15-second silent assignment example, not a narrated output. Its executable
code is small enough to adapt. `editorial-motion.js` is also loaded in the main index, but stock JSON events do
not call it automatically. Author the DOM and calls in the project's renderer.

```js
const editorial = NoirEditorial.create(timeline, record);
editorial.yieldTitle({at: phraseTime, duration: .8, tracks: [
  {node: heading, from: {top: 300, fontSize: 130}, to: {top: 205, fontSize: 44}},
  {node: terminal, from: {top: 920, height: 400}, to: {top: 420, height: 900}}
]});
```

`record(node,start,duration,kind,job)` is optional and compatible with the custom operation audit. All helper
spans are `reframe`: neither growing a window nor shrinking a headline proves a model change. Project code
separately scores execution, value commits and ownership changes. Coordinates and time are explicit. Every `to`
property needs a matching `from` property; stable IDs and `immediateRender:false` preserve reverse seeks.
Track nodes in a common coordinate system; for nested groups, provide each child's local coordinates. Moving
sibling code and its visual window requires tracks for both. Do not infer that overlapping windows imply ownership.

## 1. Let the question release its area — `yieldTitle`

Use when the question has been understood and its evidence needs reading room. A short, large statement can be
the opening image. Keep the same heading node, reduce its size and move it to context position; promote the actual
object/code into the area it releases. The study moves from a large assignment question to the small call site.
The SRP v3 test moves from a large print question to the containing source file.

Choose line breaks for BOTH endpoints, inspect Vietnamese accents at intermediate sizes, and preserve caption
space. Use a short label if the full heading becomes cluttered; score this as disclosure, not execution. No fixed
percentage of the page is permanently reserved for the title. Avoid dropping a completed heading into a second
unrelated heading that competes with the evidence.

## 2. Promote the selected definition — `focusWindow`

Use when a small call or object label leads to a larger implementation. Retain the compact call as an anchor,
expand the SAME window, reveal its body, then execute visible instructions. The study expands `copy(x)` into
its definition and commits `y = 10` only after input arrives. For several windows, add tracks that move the
selected one into a clear reading region and subordinate the others without hiding values currently compared.
Assign stacking order deliberately and settle rotation before unfamiliar code is read.

A source role change needs a real extraction or rerouting in addition to focus. SRP v3 moves its existing method
strips into new file boundaries while the helper rearranges context. It does not replace the strips with pictures
of final classes. Reserve a corridor and check paint order as well as bounding boxes.

## 3. Let the result invite proof — `resultToEvidence`

Use only after the value has been computed or is already known from the preceding operation. Give it typographic
priority, then reduce its size to make room for expected/observed values or source/output evidence. Keep the same
result visible during this transition. Align fields that answer the comparison question; align their values even
if one heading wraps to two lines. The study changes x after copying and shows y staying 10. SRP v3 keeps the
known 90,000 result while comparing invoice headings.

Reveal the new evidence at its own spoken cue. Do not show final answers early merely because they fit the layout.
A check mark follows the comparison, not the entrance of the cards.

## Sequence review

For each adapted example capture before / middle / after and a reverse seek. Inspect with captions hidden:
- What has the largest reading area now, and does that match the current task?
- Is a previously dominant heading now subordinate when no longer needed?
- Does the density change because detail was opened or proof added, rather than because boxes were shuffled?
- Does the causal action still read without explanatory labels? Reframes alone are not enough.

The moving objects must clear text, not just canvas edges. Review transitions to adjacent unchanged scenes too.
Use the ordinary model-gap audit independently. Do not impose sparse/dense alternation, a composition quota,
or these three examples on every concept. Native windows, type and proof carry this work; raster backgrounds
remain a separate optional choice.
