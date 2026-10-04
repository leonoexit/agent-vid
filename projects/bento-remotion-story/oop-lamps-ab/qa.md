# Bento Remotion 0.1 integration trial

Independent skill: `.agents/skills/explainer-bento-remotion-story-voice`. Original Bento 0.5 remains unchanged.
This is a scoped GSAP bridge hosted by React/Remotion, not a fully declarative React renderer.

## Controlled material
Accepted OOP lamps v2 source: same script, voice settings, timings, narration files and geometry.
`comparison-source.json` records source hashes. Full composition is 81.27 s; the delivered integration excerpt
is frames 1099–2219 inclusive (36.633–74.000 s on the source clock; 1121 frames / 37.367 s of video).
Hải Đăng voice, speed 1.0, original karaoke cues, no BGM; 1080×1920 at 30 fps.

## Checks completed
- Skill validator and 34 Python unit tests, including new-project overwrite refusal, actual WAV scheduling,
  portable asset copying, and traversal rejection.
- New project from the independent template: composition bundle check, forward/reverse section-frame QA,
  and a two-second Remotion render. Sample is silent; no new TTS was needed to test the integration.
- OOP example executed: desk.on=True and bed.on=False.
- Custom OOP operations: before/mid/after samples and section views, forward then reverse. See browser-qa.json.
  All sampled DOM states match exactly. Pixel comparisons permit bounded Chromium edge antialiasing;
  every difference is recorded, so this is not a claim of byte-identical screenshots.
- Explicit commit assertions at 55.31 s: desk False→True; bed stays False; seeking back restores desk False.
- Browser has no runtime errors. Voice assets are identical to the existing accepted demo.

## Concrete fix found during inspection
The inherited body background was outside Remotion's captured surface, producing black in MP4.
The project now paints its background/color/font on the composition host. Local fonts are awaited.

## Limits
This trial validates integration and preserves the existing choreography; it does not establish that Remotion
improves visual quality, speed, or authoring effort. No new 3D/camera feature is included.
The inherited JSON motion audit reports text-only runs because this accepted OOP project implements motion in
its custom renderer, not JSON events. Its operation samples and frame inspection provide the relevant evidence.
No new full manual voice-listening or comprehensive automated contrast/occlusion audit was performed.
HyperFrames lint/check are not applicable to the React runtime. No commit or push.

Final MP4: H.264/AAC 48kHz, 1080×1920, 30 fps; ffprobe metadata saved. Full ffmpeg decode completed with zero errors.
