# Camera direction for Bento explainers

Use this when the brief asks for pans, close-ups, following an action, or a product-film feel. Preserve the Maple Bento art direction and the one-concept worked example. Remotion is the frame-driven renderer; camera direction must be designed explicitly.

## Four independent layers

1. World: objects have stable coordinates across shots. A camera move must not relocate the diagram's objects.
2. Action: selection, a read token, comparison, exclusion and derived result. Reading an array value creates a clearly labelled copy; it never removes the original value.
3. Camera: viewport centre, zoom and optional roll. Use CameraRig.jsx and camera.mjs. Its pure sampler supports seeking and starts interrupted movements from their current pose.
4. Overlay: title, goal, captions, brand, progress. Keep these outside the camera transform.

## Shot design

Write a shot list before code: what viewers must see, why the shot changes, the world object being followed, the cue that triggers it, arrival deadline and reading hold. Establish geography, push into the object, follow the meaningful action to its destination, hold on evidence, then either reopen context or isolate the consequence, depending on the reading task. Do not zoom at every sentence. Settle before important reading. Scale must keep numbers legible at a close shot; the wide is for relationships. Hold the final composition long enough to recognize the reduction.

Use native CSS transforms for 2D framing. Perspective or a real 3D camera is optional and should serve the content. Do not describe a 2D rig as real 3D. Avoid motion blur on code or captions. Apply shadows and depth in the established hard-shadow style.

## Reference provenance

User supplied `references/FDown.vn_Tai_video_Facebook_720p (HD)_6e4a.mp4` (OneNotch advertisement). Studied examples: 2–5s detail-to-overview, 44–50s file action with close processing/result, 52–56s screen overview/detail/window arrangement, 60–63s devices-to-feature detail. These are editorial patterns inferred from frames, not evidence of its source code or a specific rendering engine. Adopt motivated reframing, readable holds and persistent UI geography. Product branding, footage, feature list, CTA, landscape composition, soundtrack and perspective effects remain references and are not implemented in this study.

## Built-in study

`new-project.py <directory> --study camera` selects `visualMode: camera-study`. It runs one binary-search comparison, not a completed search: 18 < 24 removes indices 0–3, leaving indices 4–7. It retains the six narrative phases and local voice/caption pipeline. The source array is unchanged; an inspection token copies the midpoint's value. Unsupported input branches fail rather than silently producing incorrect narration.

Tune shot durations against generated TTS cues, not guessed seconds. Inspect the middle of pans and zooms, as well as resting frames. Verify no clipped hero object, captions outside the rig, no premature answer reveal, and the final view's readability. If time is short, reduce narration/shot count before accelerating speech. Update reusable source here before copying it into a demo project.

## Screen composition and shot variety

The original camera study kept an outer page border, inset viewport, title band and footer throughout. A camera move within that fixed shell can still feel boxed in. For a more open treatment, make the viewport the full canvas and let each shot allocate space to its subject.

- Structured overview: visible panels/connectors, enough context to understand the route. The outer page frame is optional.
- Close action: extend a Maple color field to the screen edges; remove redundant station chrome and let the objects dominate. Nearby context may leave the frame, while essential values remain readable. Fade the large heading during a tracking move if the object crosses its space.
- Minimal consequence: reduce labels, show the remaining candidates and one large result. A return to the entire world is useful when geography matters; it is not required at every ending.

Choose these based on content, not a quota or a new animation for each sentence. Keep typography, palette and hard shadows consistent. World positions remain fixed; presentation can fade station shells/context and overlays can change size or visibility. Keep source objects intact, label read copies, and derive result labels from the model. Avoid showing the conclusion before the narrated operation.

Implemented in v0.4: `cameraLayout: open` uses `OpenCameraStudy.jsx` with the full-canvas camera score in `open-camera.mjs`. `CameraWorld.jsx` supplies the same objects to both open and framed compositions. The v0.4 starter selected open; v0.5 now selects guided. Existing scripts without this flag keep framed behavior. The open study ends on four candidates and a large 8 → 4, with a purposeful reading hold. No 3D perspective, depth-of-field or soundtrack changes are implemented.

## Stable navigation with selective opening (v0.5 default)

User comparison: the open study was richer in layout but harder to follow than framed. Treat that as evidence to preserve orientation, not a request to eliminate variety. Keep a stable stage, headings, object geography and caption zone while the camera travels. Change one dominant visual dimension at a time. A border may recede after the camera has arrived; a minimal result may follow once the remaining values are visible and understood. Do not make open composition the general default merely because it looks more varied in stills.

The `guided` study retains the framed camera route through the result station. During the comparison hold, the viewport widens symmetrically by 40 px per side and its border recedes, preserving the screen centre and every object's scale/position. It restores that frame before the next pan. After arriving at the result and holding, the stage opens to a blue field with a large 8 → 4. The four candidate tiles do not move when their surrounding panel disappears. Title, caption zone, page frame and footer remain in place. The final pullback is omitted to allow a readable result hold. The older `framed` and experimental `open` options remain available explicitly.

Inspect move/arrival/release separately. Check that widening the viewport does not shift its centre, no release overlaps camera travel, the result is not shown early, and candidate positions stay stable across the ending. Preserve audio and duration for comparison; user feedback, not visual variety alone, determines whether to promote a layout.
