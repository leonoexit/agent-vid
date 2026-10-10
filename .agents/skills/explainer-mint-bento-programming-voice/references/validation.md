# Validation — 2026-10-06

Initial v1.0 scope: new skill, visual kit and focused starter checks. The user deferred a full video trial.

- Inspected the supplied 1200×1840 raster and sampled dominant pixels. Preserved its exact bytes with a SHA-256 manifest. Font identity and motion remain inferred/selected, not established by the raster.
- Initially built a six-composition portrait study and visually inspected its sheet. Built local native icon silhouettes, rounded surfaces, outline capsules, nested rows, tilted chips and a four-circle SVG backplate. Branded source assets/text were not copied into the template.
- Created fresh VI and EN projects using bundled fixtures and the existing Bento sync utility in silent estimated mode. Six Python tests passed, covering both fixtures, exact/repeated phrase validation, narrative freedom, invalid holds and refusal to overwrite a destination.
- Browser checks passed for VI and EN: original item order preserved after append, in-flight proxy excluded from committed data, list/count updated together, detail view preserves state, arbitrary backward seeks, and horizontal text overflow. Synthetic timestamps exercised caption highlighting and reverse seeking; these do not test speech quality or real alignment.
- Final VI template HyperFrames 0.8.75 check passed: zero runtime, layout or motion errors across nine layout samples; 46/46 text contrast checks passed. One nonblocking nested-subcomposition editor warning remains. The compiler also resolved/cached Inter font faces; local template references alone do not guarantee an empty-cache HyperFrames compilation makes no network requests.
- Skill metadata validation and local reference links checked. The source image hash matches the manifest. Existing projects and other skills remain intact.

Not performed: TTS synthesis, listening review, narrated MP4 render/decode or user acceptance of a complete video. Style-study.html is a static specimen; story.js implements only the documented Array.push example. A new subject needs its own model, choreography, timings and visual-review.md.

## v1.1 UI refinement — 2026-10-06

The user found the initial study insufficiently close to the source: too little UI anatomy, Apple-like refinement and accent variety. Passing initial technical checks did not establish visual acceptance.

Replaced the preview with three portrait compositions, and implemented shared MintUI components used by both the study and the working timeline: header/icon/metadata, selected tabs, nested rows, indexed slots, syntax accents, dark metric headers, shallow surface highlights and coral/outline/tilted accent vocabulary. Declared the bundled font weight range, adjusted type hierarchy and separated decorative accents from explanatory state in the guidance.

Visually reviewed the updated sheet and working VI/EN frames. Fixed a chip covering a label, a metric value crowding its footer and the append proxy crossing a header. Final VI and EN browser checks pass for append order, simultaneous list/count commit, proxy exclusion, state continuity, reverse seeking, horizontal overflow and synthetic caption highlighting. Final VI HyperFrames check passes: zero runtime/layout/motion errors, nine layout samples, 76/76 text contrast checks; the existing nonblocking nested-subcomposition warning remains. Metadata validation passes.

This revision still has no real voice recording, listening review or narrated MP4 trial. The dense overview is a style specimen, not a promise that every video scene should have that density. Complete-video comprehension and visual acceptance remain to be tested.
