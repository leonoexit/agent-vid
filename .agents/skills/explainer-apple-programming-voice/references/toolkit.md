# Small native toolkit

Copy `assets/apple-assets.css`, `assets/apple-story.js` and the fonts/licenses into a new project. Load the CSS, the project's existing local GSAP, then this helper before building the paused story timeline. No new engine or package is needed. Construct DOM after DOMContentLoaded (or immediately if already ready). Register the project timeline with HyperFrames as before. The helper does not perform registration, resolve voice cues, group captions or generate the story for you.

`AppleStory.object(kind, {tone, label})` returns an unmounted figure. Kinds: folder, document, clock, lock, cloud, computer, phone. Tones: coral, blue, mint, violet. These have distinct silhouettes, shared light/material and native SVG gradients; all fit a 256×270 viewBox. Resize the figure with CSS; labels remain editable. Do not put every silhouette back into an identical tile. New topics may need new geometry or generated subjects.

`history(labels)`, `comparison(before, after)` and `diff(before, after)` return unmounted native views. Text arguments are plain text, not HTML. The history is a presentational rail, not a Git DAG; adding a node is not a generic proof of a saved operation. Diff is two exact lines with −/+ markers, not a diff algorithm. Comparison has editable Vietnamese Trước/Sau headings.

All motion helpers add to the caller's timeline. Resolve `at`/`until` from actual narration cues. Build once before the first seek; no appending DOM or triggering timers during playback.

```js
const A = AppleStory;
const doc = A.object('document', {tone:'violet', label:'notes.txt'});
world.append(doc);
A.transfer(tl, doc, {x:100,y:400}, {x:600,y:400}, cue('lưu bản này'), .7);
A.press(tl, buttonInner, cue('bấm lưu'));
A.type(tl, codeLine, 'return x * 2', cue('nhân hai'), .9);
A.values(tl, valueLabel, [{at:0,text:'2'}, {at:cue('thành ba'),text:'3'}]);
A.camera(tl, world, {at:8,until:10,focus:{x:620,y:950},scale:1.12});
A.context(tl, background, {at:12,from:'#f7f8f6',to:'#edf7f1'});
```

- `reveal(tl,node,at,duration=.4)` schedules a first reveal. Use project timeline hide/show operations for later reuse; don't reinitialize a used node halfway through construction.
- `type` creates hidden character spans once, preserving final text layout; it does not simulate editable input or reflow text like a terminal. Pass the full exact text once per node.
- `values` builds layered discrete states once. Times must increase; values switch exactly, never interpolate 2.37 commits. Use one track per value node.
- `press` uses a dedicated inner element at neutral scale 1. `transfer` uses a positioned outer wrapper with explicit from/to transform properties. Do not animate the same transform through two helpers at once.
- `historyStep(tl,rail,index,at)` reveals one prebuilt node; call for each node before rendering. Existing nodes remain. Add project-specific connectors and labels where the actual history requires them.
- `showDiff(tl,diffNode,removeAt,addAt)` reveals the old/new rows. Keep row order and exact content truthful to the topic.
- `camera` assumes a dedicated world at x=0,y=0,scale=1 with origin 0 0. The default screen center is (540,930). Its return lasts `duration` after `until`; don't overlap camera intervals. HUD must be a sibling.
- `context` needs an explicit `from` matching the preceding field. Does not alter semantics or identity colors.

```js
A.caption(tl, hud, {start:2,end:4,words:[
  {text:'Mỗi',t0:2,t1:2.35},
  {text:'commit',t0:2.35,t1:3,color:'#006b54',emphasis:true},
  {text:'giữ một bản.',t0:3,t1:4}
]});
```

`caption` consumes one pre-grouped line of display text with absolute timing. Keep source word times, use a phrase entry only when phrase timing is intentional. Key colors persist while the line is shown; the read cue is a neutral highlight, plus optional subtle scale emphasis. The caller handles phrase mapping and line breaking, avoids overlapping line intervals and reviews measured overflow. No CSS animation, setTimeout, callback text mutation or randomness is used, so the same timeline time can be sampled reproducibly. Verify this in each project, especially custom extensions.

For changes to these primitives, run `node <apple-skill>/scripts/check-toolkit.cjs <path-to-existing-local-gsap.min.js>` from the repository root. It uses the existing puppeteer-core/sharp and local Chrome, checks discrete values, caption visibility and camera return, and compares nine forward/backward samples. Computed states must match exactly; image comparison permits only tiny raster antialias differences. This synthetic check does not replace reviewing a real video's explanatory timing.
