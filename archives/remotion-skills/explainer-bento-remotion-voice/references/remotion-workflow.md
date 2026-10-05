# Remotion implementation, version 0.5

This implementation keeps Bento's art/narrative direction and local TTS, and replaces HTML/GSAP/HyperFrames with React JSX, pure frame interpolation and Remotion 4.0.532. No GSAP, HyperFrames runtime, screenshot-video background or prerendered old video is used.

## Script and timing

`script.json` contains `language`, `brand`, `story`, `example`, `intro`, `scenes`, `outro`. Each narrated section has `phase`, `title`, `vo`, `cues`. Cue shape: `{id, on, occurrence?, offsetSeconds?}`. `on` matches a normalized sequence of words in the narration; repeated phrases require a one-based occurrence. IDs are unique globally. Offsets permit reviewed timing adjustments without modifying narration.

TTS emits `timings.json`: sections `{id, file, duration, text, words:[{w,start,end}]}`. IDs are `intro`, `scene-1` onward, `outro`. `npm run sync` maps these to integer frames with 5 lead frames and 6 tail frames per section. An optional `readingHold: {seconds, task}` adds up to three seconds to that section for a named reading task. Audio durations round upward to avoid truncation. Caption groups use up to seven words and break at punctuation.

`src/generated.json` is derived and must be regenerated after narration/cues change. Never edit it to disguise stale audio. Narration text changes require TTS first; cue changes only require sync. Voice settings changes require rerunning TTS. The inherited local engine fingerprints voice/speed/gap and text for cache reuse.

For the camera starter, `visualMode: camera-study` and `cameraLayout: guided` select the framed-first composition with selective opening. `cameraLayout: open` is the experimental fully open alternative. The `framed` value or omission of `cameraLayout` selects the earlier inset viewport. All camera compositions share `CameraWorld.jsx` and the same action state. Screen-space captions remain outside the camera. `open-camera.mjs` defines reframing and presentation fades, including fading large headings during tracking. The full trace starter is unaffected.

## Implemented vs reference-only

Implemented: local fonts, Bento panels/tags, caption safe zone, frame-driven numeric tracks, phrase-cue compiler, narration sequences, caption highlighting, deterministic example state, browser preview, Remotion stills and H.264 rendering. The binary-search example implements stable tiles that move between overview, inspection, archive, expanded candidate group and original-order verification. Algorithm state is computed independently from geometry. See object-choreography.md for the reusable APIs and the supported three-comparison score.

Reference-only: old entities/actions JSON schema, GSAP timeline, `motion_audit.py`, old validator, HyperFrames commands, generated-asset catalogue and the source carousel's download/CTA behavior. Copied art documents describe those old facilities only for lineage. No promise of generic maps/charts/arrays from those documents. Create custom React components when the concept needs them.

## New topic checklist

Replace the example's question, initial state, narration and visible labels. Implement its state transitions in `Trace.jsx`; supply a semantic check against executable example output. Preserve each object's identity and causal relationship. Check operation frames, future-answer hiding, text fit and arbitrary seek order. Any new diagram is native code, not an image whose geometry must be guessed.

## Commands and sources

Run npm commands from the project directory. Packages and lockfile are project-local; the original repository's HyperFrames dependencies stay untouched. Node 22+, npm, a supported Chrome and ffmpeg/ffprobe are needed. Project audio files are copied into `public/assets/audio` for `staticFile()`.

Official sources checked 2026-10-05:
- https://www.remotion.dev/docs/the-fundamentals — current frame, components, composition metadata.
- https://www.remotion.dev/docs/renderer/render-media — H.264/AAC rendering.
- https://www.remotion.dev/docs/fonts-api/load-font — local font loading and render blocking.
- https://www.remotion.dev/docs/html5-audio — audio sequences.

Remotion has its own license terms; bundled Bento assets retain their original licenses. See https://www.remotion.dev/license when determining deployment terms.
