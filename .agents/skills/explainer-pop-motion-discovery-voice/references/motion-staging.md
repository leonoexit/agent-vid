# Pop Motion staging

Use the approved image-led Pop Motion direction: physical picture beats first, optional framing and rearrangement in support. Keep Pop’s photographic materials and continuous causal narration. A video may use a few of the mechanisms below, or leave a passage still while the viewer reads.

## Choose the explanatory job before the move

| Need in the narration | Candidate staging | What must remain clear |
|---|---|---|
| Inspect evidence within an established subject | Reframe overview → detail → context | Keep a recognizable anchor; enlarge the actual detail, not a random point |
| Add a consequence or a comparison | Move existing groups aside; place the new evidence in the cleared space | Existing meaning survives the rearrangement; destination and travel path do not obscure text |
| Explain one side of a dense relationship | Temporarily dim the explicitly inactive groups | Keep all text being discussed at full opacity; restore context when the relationship resumes |

Write this into the shot score: spoken cue, reason for the move, before/after layout, persistent anchor, readable interval and handoff into the next beat. Use Pop's narration cues; when their timestamps are estimates, inspect the move against the actual voice. The helper does not improve speech alignment by itself.

For an explicitly requested comparison, retain the script/voice when useful to isolate staging changes and save a separate output. New topics get their own picture beats and required assets; do not inherit Git or API-key layouts.

## Local helper: template/pop-motion.js

An independent Pop implementation inspired by Motion FX's framing/focus/layout vocabulary. No talking-head DOM or dependency on Reelcrew at runtime. It uses the existing GSAP file and one paused Pop timeline; every pose is explicit and arbitrary seeking must reproduce it.

Build after fonts and asset dimensions are ready. `PopMotion.create(tl, world)` creates an inner stage. Put scene groups inside this stage. Captions stay in `#captions`, outside `#world`. A scene group's outer wrapper owns composition transforms; an inner collage piece owns paper jitter. Keep photograph, its paper and its caption/credit in the same assembly.

```js
const tl = gsap.timeline({paused:true});
const M = PopMotion.create(tl, document.getElementById('world'));
const scene = M.group();
const photoGroup = M.group(scene, {x:100,y:500,width:420,height:650});
// Create photograph and label inside photoGroup; jitter their inner assembly.
const overview = {x:0,y:0,scale:1,rotation:0};
// Rectangles are authored world coordinates, BEFORE camera transforms.
const detail = PopMotion.fitRect(
  {x:100,y:500,w:420,h:650},
  {x:120,y:350,w:760,h:1000},
  1.5
);
M.frame(overview, detail, {at:4,duration:.8});
M.frame(detail, overview, {at:7,duration:.7});
M.arrange([{node:photoGroup,from:{x:100,y:500},to:{x:600,y:520,scale:.65}}],
  {at:9,duration:.7});
// M.focus([inactiveContextGroup], {at:10,until:12,opacity:.3});
// Register timeline after authoring; pre-seek then restore jitter bindings.
tl.seek(tl.duration(),true).seek(0,true);
Collage.restorePaperJitter();
window.__timelines={'pop-collage':tl};
window.REVIEW={duration:tl.duration()};
```

- `frame(fromPose,toPose,{at,duration,ease})`: animate the stage. Does not automatically zoom back; explicitly return to the right next pose.
- `arrange([{node,from,to}],options)`: transform outer groups. Use staged handoffs when simultaneous routes would cross. A pose has x/y/scale/rotation; unspecified destination fields retain the supplied start pose. Explicitly supply the actual previous pose.
- `focus(context,{at,until,opacity,fade})`: dim only the supplied inactive outer groups and restore opacity 1 by `until`. Use dedicated groups with a visible baseline of 1; don't combine with another visibility animation on the same group.
- `fitRect(subject,viewport,maxScale)`: calculate an unrotated fit. Include text/credit that must stay visible in the subject rectangle. Define viewport bounds for the composition and intended publishing surface; the sample above is illustrative, not a universal safe zone.
- The helper rejects conflicting transform intervals on the same carrier. It cannot prevent conflicts introduced by separate raw GSAP calls; give the helper exclusive ownership of that carrier's transforms.

Keep movement modest when source resolution or type readability limits the zoom. Do not move the entire canvas merely to disguise a cut. A clean cut is valid for a different time/context. No automatic continuous-camera requirement, full-scene flash, swoosh, blur, 3D, sound cue or mandatory transition count.

## Verification

Run `scripts/test-motion.cjs` after changing the helper. It checks primitive behavior, not whether a film is compelling.

For a video, run the included readability audit and visually inspect overview, mid-move, detail, restored context and joins in the encoded output. Confirm captions stay fixed, faces/evidence remain legible, moving paper doesn't hide another claim and group transforms don't cancel jitter. Pair comparisons should ask whether the same explanation is easier to follow and better paced; additional movement alone is not a win.

## Visual reaction beats

At storyboard time, consider what the viewer is likely thinking at a question, misconception, surprising comparison or reversal. Briefly explore plausible visual responses, then keep the one that clarifies the thought or adds fitting personality. Options include a minimal hand-drawn stick-figure reaction, meaningful gaze/gesture, a scale contrast, or a revealing object detail. These are possibilities, not a checklist, required character, joke quota or universal per-scene effect.

For a chosen beat, record the viewer thought, the visual response and why it fits, the voice cue/entry/exit, its gaze target or spatial relationship, and reuse/new-asset choice. Assets may represent the viewer’s thoughts even when narration does not name a person. For fictional viewer reactions, use minimal hand-drawn stick figures: a small round head, dot eyes, a few expressive mouth/eyebrow strokes, thin slightly irregular ink limbs and a clear body gesture. Pose and relationship to the subject carry the joke or thought. Keep clothing to a simple flat shape if needed, with at most one or two restrained color accents. Avoid realistic portraits, detailed comic/anime anatomy, elaborate hair, halftone skin and sticker rendering that overwhelms the drawing. Generate this as a transparent illustration when an asset is needed; intentional drawn simplicity is not the same as an anonymous stock icon or a careless SVG person. A brief puzzled glance toward an implausible cause is one example; do not copy it into unrelated scenes.

Keep the reaction subordinate to evidence and to the spoken clause. Give it time to register, then retire or hand off to the next explanatory subject. Avoid distracting motion during close reading. Humour comes from the situation, not added ridicule or invented historical behavior. Mark fictional reaction people as editorial illustration in the asset manifest; do not present them as participants or evidence. In review, judge whether the aside adds a readable point of view or merely adds clutter.
