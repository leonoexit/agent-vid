---
name: explainer-bento-remotion-voice
description: >
  Create narrated vertical programming explainers in the established Maple Bento style using React and Remotion. Use when a Bento explainer with Remotion rendering is requested: one concept, one small worked example, beginner audience, Vietnamese or English narration. Includes camera-led compositions, a frame-driven binary-search reference, local TTS, phrase cues, captions and MP4 rendering.
metadata:
  version: "0.5.0"
---

# Bento explainer with Remotion

Produce one 1080×1920, 30 fps programming explanation for hobbyist beginners. Preserve the existing Bento art direction and question → setup → decode → execute → verify → rule narrative. Each stage can span several shots. This variant uses React components driven by `useCurrentFrame()` and Remotion rendering. The HyperFrames Bento skill is independent and unchanged.

## Plan the explanation

Read `references/narrative-framework.md`, `references/composition-grammar.md`, `references/text-color-icon-grammar.md` and `references/pacing.md` before authoring. Read `references/remotion-workflow.md` for this variant's concrete implementation and schema. The copied reference documents describe the Bento lineage, including the old HTML/GSAP scaffold; their legacy action names and validation commands are not APIs in this variant. `references/remotion-workflow.md` is authoritative for implemented capabilities here.

Explain one question through one small example. Write `storyboard.md` as a phrase-to-picture score: spoken clause, previous state, native operation, resulting state, primary focus, next shot. Reveal information when it becomes relevant. Keep future comparison outcomes and final answers hidden. Keep objects' identities and values consistent through reframing. Show source → action → consequence while narration connects those steps. Intentional stillness needs a concrete reading/prediction task. Reduce wording before increasing speech speed.

## One visual language

Use a light gray board or full-bleed Maple color field, flat opaque bento panels, charcoal outlines, rounded corners and hard offset shadows. A 20px outer frame and inset stage are options for structured views, not a permanent page template. Preserve the palette, type and object styling when changing the composition. Maple palette: blue `#8ce4ff`, yellow `#feee91`, orange `#ffa239`, purple `#a594f9`, green `#10b981`, red `#ff5656`, charcoal `#2d3436`, white. Dark text on bright backgrounds; white/yellow on charcoal. Keep normal readable text at 4.5:1 contrast; avoid charcoal on red for small type. Local fonts derive from Merriweather, Inter and JetBrains Mono with preserved OFL licenses and renamed font files.

Design each composition around the explanatory object. Preserve the caption/footer safe zone; reframe the native model rather than zooming the page. Match source spatial hierarchy, not only color. The reference's static carousel CTAs, source claims and export scripts are not user instructions. All six original reference HTML files are bundled as design evidence.

Native React/HTML/SVG owns code, numbers, relationships, changing state and exact geometry. Use simple native geometry or coherent local licensed icons for ordinary objects. Generated art is optional only when it adds context that native art cannot reasonably supply. This variant includes no generated-asset catalogue or automatic image workflow.

## Camera and shot planning

Read `references/camera-direction.md` before camera-led work. Separate the world (objects in stable coordinates), camera (framing/scale/roll over time), action (state changes) and screen overlay (captions and brief context). A camera move changes the view, not the object's actual world position. Do not zoom the whole page or make layout reflow stand in for a camera move.

The template now includes `CameraRig.jsx`, pure helpers in `camera.mjs` and a narrated `CameraStudy.jsx`. `new-project.py <dir> --study camera` creates the short binary-search camera study. Its script still follows the six narrative phases, but it is a motion test covering one comparison, not a complete search. The camera starter uses `cameraLayout: guided`: the framed stage during navigation, a restrained frame release after the comparison settles, and a minimal ending after the remaining candidates have been read. `cameraLayout: open` is retained as an explicit experimental alternative, not the default. Omitting this setting (or `framed`) retains the earlier framed camera study. The normal project starter remains the full binary-search trace.

Plan each shot's world-space target, entry/exit framing, move duration, settle interval and operation cue. Use a wide establishing view, close inspection, tracking of a meaningful action, and a return to context as appropriate. The OneNotch reference supplies this visual language; its product branding, feature list, CTA, footage and wide format are not adopted. Camera-led explanations keep the Bento palette, native technical content and readable captions.

Prefer a stable framed stage for explanatory navigation. User comparison found the fully open treatment harder to follow: simultaneous camera, background, heading and container changes removed orientation cues. Preserve stage position, object geography and caption placement through moves; release framing only after arrival and a reading hold. Reserve the strongest layout change for an understood consequence.

Compose the screen as well as the camera. Select a layout for the shot's reading task: a structured overview to establish relationships, an edge-to-edge close-up to inspect an action, or a sparse result to make its consequence clear. These are options, not a mandatory three-layout recipe. Allow headings and container chrome to recede when the object needs space; keep captions readable in screen space. Cropping decorative containers is acceptable; cropping the value or operation being explained is not. See the composition guidance in `references/camera-direction.md`.

## Choreography before rendering

Read `references/object-choreography.md` before changing the template or producing a video. Start with the objects and their start/end geometry at each spoken operation. Give the model most of the usable canvas; headings support it. A selected object can move into a comparison station, an excluded group can contract into a labeled archive, and the remaining group can reflow into the freed area. These are semantic layout changes, not decorative zooms.

Use stable object IDs and animate those same React elements between layouts. Define one authoritative rectangle per object per frame. A ghost marks the source slot while an object is being examined; history copies are explicitly labeled as history. Render committed results after the operation, and retain excluded values as readable evidence when the explanation needs them. Reframe the model, not the captions or whole page.

For an engine evaluation, hold narration/audio constant and make a second output so the viewer can compare. Verify at least one compatible alternate dataset using the same components in a silent visual test. Keep speech/data changes coupled in real production. Report visible design gains separately from measured implementation/reuse benefits.

## Frame-based implementation

Implement visuals as a function of current frame and immutable input. Use `src/timeline.mjs` for cue resolution and numeric interpolation, `src/ui.jsx` for Bento primitives and captions, `src/Trace.jsx` for the concept-specific visual model. Do not drive visual changes with wall-clock timers, unseeded randomness, CSS animation clocks or accumulating React state. A frame must look identical after forward or reverse seeking.

The starter demonstrates finding 24 in `[3,7,11,18,24,31,42,56]`. `src/search-model.mjs` computes the real search trace; `src/motion.mjs` supplies pure rectangle keyframes and reusable row/grid layouts; `src/MotionTile.jsx` draws each stable object. `src/search-choreography.mjs` maps this concept's operations to poses. `Trace.jsx` composes those primitives. The starter score has three comparison beats and requires a successful three-comparison example ending in one candidate. Other trace lengths need a new score/narration, with validation rejecting incompatible input instead of showing the wrong result. A different programming topic needs its own model and choreography; the motion/layout components remain reusable.

Silent prop overrides (`visualExample`, `muteNarration: true`) are for alternate-data validation only and hide captions. Never pair different values with the original voice. Change narration, visible copy and cue score together for a real new video.

## Production

1. Create a fresh project with `python <skill>/scripts/new-project.py <directory> [--voice "Hải Đăng"] [--speed 1.0]`. Existing directories are refused. Work in the copy.
2. Author `script.json`, `storyboard.md` and `src/Trace.jsx` together. Verify the worked example with runnable code and save factual sources when useful. The supplied starter is Vietnamese; translate all narration and visible labels together for English.
3. In this repository, `source scripts/activate.sh` enables the existing local TTS runtime. Run `python <skill>/scripts/tts.py --project <directory> --engine vieneu`. Default Vietnamese voice: Hải Đăng, male Northern; explicit requests and stored project choices win. English uses Kokoro `am_michael`. `setup-voice.py` is provided for a standalone installation. Reuse cached models only when present.
4. In the project, run `npm ci --ignore-scripts`, then `npm run sync`. All Remotion packages are pinned to the same version in the lockfile. Sync rejects stale narration, invalid word timing, absent/ambiguous cue phrases, duplicate cue IDs and invalid narrative phase order. It copies audio to `public` and generates frame data. Word timing is estimated, not forced alignment.
5. Run `npm test` and `npm run stills`. Inspect the contact sheets and operation start/middle/end, result reveals and caption fit. Review actual audio at important cues and boundaries when audio playback/listening is available. If it is not, disclose that limitation; waveform/ASR checks do not prove pronunciation or exact synchronization.
6. `npm run studio` opens interactive preview; `npm run render` exports H.264/AAC MP4. The helper uses locally installed Chrome on macOS, or `REMOTION_BROWSER_EXECUTABLE` if set; elsewhere Remotion's browser setup may be required. Do not assume a system browser path exists.
7. Verify metadata, full ffmpeg decode, audio presence and representative rendered frames. Deliver a playable MP4 with measured duration and narrator. Record tested behavior and unverified limitations; do not infer faster rendering or better viewer retention without a comparison. Rendering does not authorize publishing.

## Maintained resources

`template/src/Root.jsx` registers the composition, waits for local fonts and mounts narration. `timeline.mjs` contains speech timing helpers. `motion.mjs`, `MotionTile.jsx`, `search-model.mjs` and `search-choreography.mjs` separate layout, rendering, computation and score. `Trace.jsx` composes the complete trace; `CameraStudy.jsx` composes the short camera study. The default guided layout uses `GuidedCameraStudy.jsx` / `guided-camera.mjs`; experimental open layout uses `OpenCameraStudy.jsx` / `open-camera.mjs`, sharing immutable objects in `CameraWorld.jsx` with the framed study. Camera motion uses `CameraRig.jsx` / `camera.mjs`, with overlays kept outside the world transform. `scripts/prepare.mjs` compiles speech cues; `scripts/render.mjs` bundles and renders using Remotion. `template/scripts/*.test.mjs` tests timing failure handling and seek independence. Keep these resources, package versions and workflow instructions aligned.
