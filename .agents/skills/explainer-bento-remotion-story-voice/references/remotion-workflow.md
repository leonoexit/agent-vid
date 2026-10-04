# Experimental Remotion runtime

Independent fork of Bento 0.5, version 0.1. The art direction, source index, worked-trace contract, phrase cues,
local voice and script validation are inherited. The original skill is never edited by this workflow.

## Implemented
- Remotion 4.0.532 + React 19.1.0 own Studio, frame clock, native audio mixing and H.264 output.
- Scoped `buildStory()` preserves Bento's native HTML/SVG operations via `@remotion/gsap`.
- `sync-narration.py` writes project-data.json for React and project-data.js for inherited motion audit.
- Seconds remain the authoring clock. Remotion maps audio boundaries to 30 fps (nearest frame; at most 16.7ms rounding).
- Local fonts are bundled and awaited. Images/audio are copied to public/assets; paths remain project-relative.

This bridge does not yet provide a declarative CodeBlock/Entity/Transfer React library. No Three.js/camera feature
is implemented. Do not claim improved aesthetics or render speed from the renderer switch alone.
The existing source-specific composition recipes still require project-specific geometry.

## Workflow
1. Run scripts/new-project.py NEW_DIR --language vi, which refuses existing directories and builds a silent preview plan.
2. In NEW_DIR run npm ci, then npx remotion browser ensure on a machine without the browser cache.
3. Author script/storyboard and adapt src/build-story.js, src/stage.js, theme.css to the actual explanation.
4. Validate, synthesize voice and sync with the inherited scripts as described in SKILL.md. Sync again after any script/timing edit.
5. npm run check; npm run qa (section frames plus forward/reverse DOM equality and small raster tolerance (recorded in browser-qa.json)); npm run studio for preview; npm run still -- --frame=180 --output=snapshots/frame-180.png.
6. npm run render -- --output=renders/video.mp4. A controlled excerpt can use --frames=START-END (inclusive).
7. Inspect actual frames before/mid/after operations, deferred answers, fonts/caption zones, reverse seek and sound.
   Run motion_audit.py; document purposeful stillness and custom operations it cannot infer. Verify output with ffprobe
   and full ffmpeg decode. HyperFrames lint/check do not validate this renderer.

## Runtime rules
React owns the empty host; the GSAP adapter owns only that host's descendants. Select within scope, never globally.
Build a fresh DOM tree on each builder invocation so remounts do not duplicate entities. Attach all animation to the
provided paused timeline; no ticker/play, callbacks, timers, unseeded randomness or app-global state.
Give text/value writes explicit before/after values. Images must be loaded before an exported frame is accepted.
The official GSAP adapter resets state for each visited frame; still test forward/backward seeks and result timing.
Keep camera/layout movement separate from model operations in the motion review.

## Controlled comparison
Use an accepted Bento project copy with identical narration, timings and geometry to isolate renderer behavior.
Do not silently run an arbitrary project's script as a converter: custom renderers need an explicit scoped port.
An excerpt is a technical regression preview, not a newly authored complete worked-trace lesson.

## Upstream and licensing
- https://www.remotion.dev/docs/gsap/use-gsap-timeline
- https://www.remotion.dev/docs/the-fundamentals
- https://www.remotion.dev/docs/cli/render
- https://github.com/remotion-dev/remotion/blob/main/LICENSE.md
Remotion has its own license conditions; the original skill's license does not relicense those packages.
Preserve the bundled font/icon licenses. Keep all @remotion packages at the same pinned version.
