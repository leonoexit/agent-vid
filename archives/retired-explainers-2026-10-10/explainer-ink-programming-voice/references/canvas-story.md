# One paper, one explanation

Use this staging when a concept has a few connected places, states or steps worth revisiting. The paper is one persistent world; camera travel carries the viewer between related evidence. It is still one programming question and one worked example, not a broad 6–10-branch ecosystem survey. For a simple sentence comparison, the existing page composition may be clearer.

## Script in space

Before narration, place the example's anchors on the paper. Assign each a stable location and meaning. Write the sequence as: question → establish the example → follow a relation → change a state → revisit/compare → qualified takeaway. Adapt this sequence to the concept; don't invent a cycle or a branch to justify a camera move.

Camera arrival belongs to a spoken cue. Travel begins shortly before that cue; arrive before the viewer must inspect a number or line of code. Hold while reading and while evidence changes. Reveal enough of the destination to orient the viewer during travel. Keep earlier evidence on the paper, return to the same actual object, and pull back when seeing the relationship helps the conclusion. Do not slide between unrelated full-screen text pages on an oversized background.

Generated Memphis artwork supplies recognizable actors/props. Keep exact labels, numbers and code native. The hand writes short notes or traces a relation only when the camera is settled. It never extends a cue to finish a gesture. Camera movement does not count as a substitute for explanatory state changes.

## Start and data contract

`python <skill>/scripts/new-project.py <project> --canvas` copies the executable cache specimen from `canvas-example.json`. Adapt it to the brief. The default without `--canvas` preserves the earlier page template. Both use the same HyperFrames, voice and caption workflow. Set `canvas` on `script.json`; section `blocks` can be empty in this mode, and are not rendered. Sections still contain `title`, `vo`, `layout` and the usual voice metadata. Section titles become short fixed context headings. Captions remain fixed in screen space.

`canvas` contains:

- `width`, `height`: world dimensions in pixels.
- `items`: `{id,type,x,y,w,h,...}`. `card` takes `label`, `value`, optional `note`; `text` takes `text`, optional `fontSize` and `emphasis: "yellow"`; `image` takes local `src` under `assets/illustrations/` and `alt`. All items start hidden and retain state after being revealed.
- `links`: `{id,from,to}` referring to item IDs. Straight arrows run between item boundaries; choose geometry where the route is clear. This is not an automatic graph router.
- `events`: `{section,on|at,action,target,...}`. Section is `intro`, `scene-1`, etc., or `outro`. `on` is a phrase in that section (optional `occurrence`); `at` is local seconds. Actions: `reveal` item; `write` short text or the label of a card; `update` card with `value` (optional `handwrite:true` writes the new value, `duration` defaults to .8 s); `focus` card with yellow emphasis; `draw` link; `dim` a historical link to retain orientation while emphasizing a newer route; `circle` item; `clear` earlier marks on that target. Marks and focus persist. Path actions accept `duration` and `hand:false`. Reveal an item before updating/focusing it.
- `camera`: arrival keys `{section,on|at,cx,cy,scale,duration}`. The first key is `intro`, `at:0`, `duration:0`. Coordinates are the world point placed at screen `(540,920)`. Travel lasts `duration` before the cue (default 1.1 s), using smooth easing; the view holds between moves. Resolved travel intervals must not overlap. Typical close views use scale .9–1.1; overview scale follows actual geometry, not a fixed preset.

Items, paths, the hand and paper move together. The camera is a pure function of timeline time, so backward seeks reproduce the same view. The viewport spans y=270–1580; captions stay below it and contextual headings above it. At overview size, only main labels/values need to be read; don't require tiny notes to carry new information. Use a readable fixed summary when necessary.

## Review

Inspect world positions, destinations and mid-travel frames at phone scale. Check that the destination is visible before its evidence is referenced, no important object clips unexpectedly, and prior states remain correct on return. Review the hand relative to the visible path at multiple zoom levels; scheduled writing is bounded by camera departure as well as content/voice deadlines. `INK_CAMERA`, `INK_CANVAS_EVENTS` and `INK_REVIEW` expose the resolved schedule for diagnosis.

Check actual audio at the opening, a state change and the comparison. Existing estimated word timing is not forced alignment. Adjust measured cues as needed and report any unreviewed audio. Camera smoothness alone does not prove comprehension. Use the three questions: where should I look, what changed, and why did that produce the result?


## Make the hand part of the staging

A camera journey does not automatically schedule handwriting. `reveal`, `focus` and a normal `update` have no pen; `hand:false` explicitly removes it from paths. For a handwritten lesson, introduce short anchor labels with `write` when the camera arrives, then use writing or an annotation at useful state changes. Plan these jobs across the actual explanation; a single opener or three late gestures will not establish a writing presence. Do not impose a gesture count or keep an idle hand covering evidence. Inspect the resolved schedule AND its visibility in the viewport.

For a card, `write` reveals the frame/value normally and writes its label. You may reveal the frame during camera travel and write its label on arrival; its label stays masked until that writing job. Treat label writing as an introduction, not repeated rewriting of the same target. For a changed numeric value, `update` with `handwrite:true` can write it in place; shorten the duration only while it stays legible and finishes with the spoken value. Crowded cues still fall back to an ordinary reveal. Handwriting eligibility for long text is unchanged.
