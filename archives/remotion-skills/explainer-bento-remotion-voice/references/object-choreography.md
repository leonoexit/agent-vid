# Object-led Bento choreography

This guidance applies to the Remotion variant. It responds to a concrete failure: version 0.1 put a small array between a large title and a text panel, so moving to Remotion was barely visible. Do not use that layout as a production default.

## Compose around a state change

Start with a list of stable objects, their relationships, and the operation each spoken clause describes. For each operation specify before geometry, action geometry, committed state and after geometry. The model should own the central canvas. A title is context, not the largest object by default. Treat negative space as a resource for a coming movement or readable comparison, not an inherited empty slot.

Use moves with explanatory meaning: select an object into an inspection area; put two comparable objects on the same baseline; contract excluded members into a labeled archive; expand the remaining group into the freed space; reconnect the final object with its original position. Match shape, ID, number and color across the transition. When a direct layout tween piles objects over each other, compact them first, move along separate axes, then expand at the destination. Delay arriving text/history until objects have cleared that area. Avoid whole-page camera zooms that enlarge captions and decorations along with the model.

The current binary-search example implements this as 8-item overview → row for midpoint decoding → midpoint and target at a comparison station → rejected group in an archive and surviving group expanded → a second comparison → one surviving object → return to the original array. This sequence is specific to the example. Choose different operations for objects, functions, queues or other concepts.

## Implemented primitives

- `gridRects(ids, bounds)` / `rowRects(ids, bounds)`: derive object rectangles from stable IDs and available space.
- `poseAt(frame, initialRect, keys)`: sample transitions `{at, duration, to}` without history or timers. An interrupted transition begins at its actual sampled pose. Author keys in time order.
- `MotionTile`: one persistent React element per semantic object, with original ID label, color, archive and result states. Its text scales within the current rectangle; do not scale the complete page.
- `RangeOutline`: grouping region behind the current candidate layout.
- `binarySearch` / `scoredSearch`: compute the actual example state separately from drawing. The example score supports three successful comparisons ending in one candidate; incompatible inputs fail explicitly.
- `buildChoreography` / `sampleChoreography`: map concept-specific state and spoken cue times to each object's poses. This is a worked reference, not a general diagram compiler.

Text changes, pulses, coloring and entrance fades may support an operation. They are not the operation. A midpoint should visibly come from its source slot; exclusions should visibly change the available group. If a source slot is needed during inspection, show a ghost, not an unexplained second live object. Label copies used for history as history.

## Prove reuse and correctness

Test both the computed result and important intermediate states against the real algorithm. Sample poses in arbitrary order, including reverse seeks. Inspect transitions before/mid/after arrival; commit labels must not precede the operation.

For the included score, a compatible second dataset `[2,6,10,14,20,26,32,38]`, target 10 should produce 14 → 6 → 10, with candidate counts 8 → 3 → 1 and the opposite branch directions with the same motion code. Use `visualExample` with `muteNarration: true` to make silent test stills. Alternate data with the old voice is rejected. Other search paths/lengths require adapting the speech and score; this check is not evidence that every possible dataset has a complete narration.

When comparing video versions, preserve audio bytes, narration, FPS and duration unless the user requests content changes. Keep the previous video. Record visual improvements separately from technical evidence (component reuse, data-driven state, seek tests, render time). Do not claim these visual operations are exclusive to Remotion or that the engine automatically makes better designs.
