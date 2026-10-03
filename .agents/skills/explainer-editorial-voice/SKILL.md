---
name: explainer-editorial-voice
description: >
  Create narrated vertical explainer videos about a user-selected topic in a minimalist monochrome editorial style: off-white background, monospace typography, line art, evolving diagrams, numbered black circles, horizontal flows and journal tags. Use for educational, scientific, programming, everyday or business explainers when this style is requested. Supports local Vietnamese/English voice and karaoke captions with HyperFrames MP4 output.
metadata:
  version: "0.2.0"
---

# Editorial explainer with voice

Create one clear explanation in a 1080×1920 video. This variant inherits the local voice/timing pipeline from
`explainer-ai-for-business-voice`, with its own design and content model. Use the user's topic, audience, structure
and language; business content, savings, robots, and a seven-scene story are not prerequisites.

## Design contract

Read [design-style.json](design-style.json) for the supplied design brief. The template implements it:
- Off-white `#f5f5f1`, black `#111111`, grayscale secondary text. No colored accents, paper grain, gradients or shadows.
- IBM Plex Mono for content, code and captions; Be Vietnam Pro for the small geometric sans-serif branding area.
  Both are bundled with font licenses and support Vietnamese. Keep fonts local for reliable rendering.
- Simple, slightly asymmetric SVG outlines: flat, descriptive, no shaded mascot. A horizontal `sequence` uses
  black numbered circles and thin arrows. Other content uses centered text, comparisons, code or concise lists.
- Large quiet margins, a journal header/footer, figure tags. Leave the bottom caption band clear.
- The coffee name in the brief describes a branding treatment, not a required logo or topic. Use only the user's
  supplied brand, otherwise the neutral AGENTVID label. Respect requested names and technical terminology.

## Content decisions

Choose the story for the request: answer-first/pyramid, a worked example, cause→effect, comparison, or a procedure.
Usually 3–8 scenes and 45–90 seconds are enough; user-specified length wins. Do not require a particular number of
widget types. A scene carries one idea and a short takeaway. Use specialist terms when the audience needs them,
then explain them in familiar language. Keep numbers consistent with the narration; identify illustrative numbers.
Check external factual claims against reliable sources, and save references in the video project's facts.md when needed.

Language: explicit request → source → prompt. `vi`, `en`, or requested bilingual `mixed`; mixed English spans use
`{braces}`. All on-screen labels follow that language. Vietnamese default voice is Thùy Dung (female, Southern);
change it for the user's requested voice, not for the topic. English default is Kokoro `af_sarah`. No provider key is
needed for local narration. Captions are estimated from pauses; visually verify important words and numbers.

## Visual explanation and motion

Read [references/visual-storytelling.md](references/visual-storytelling.md) when planning the storyboard.
Choose the visual from the relationship the viewer must understand: a sequence for order, comparison for alternatives,
a persistent `diagram` for ownership/connections or changing state, and an `illustration` for physical context.
Keep a model in the same place across consecutive scenes when explaining the same system. Change its values or
focus in place; do not restart the illustration with every new sentence. Match state changes and reveals to spoken
phrases using `on`, `resultOn`, or `afterOn`. Preserve enough time to inspect the result. A still frame is useful when
nothing relevant changes; movement should reveal order, direction, cause, or a real change in state.

AI illustration is optional, not incompatible with this style. Read
[references/illustration-assets.md](references/illustration-assets.md) when a supplied or generated raster image
would explain physical context better than the built-in outlines. Use available image generation tools for suitable
assets, retain exact labels/code in HTML/SVG, and inspect the asset before rendering. Do not require an API key or
invent a model integration. Prefer code-native geometry for diagrams, charts, arrows and technical relationships.

## Production

`<skill>` is this folder. Use the repository's `source scripts/activate.sh` when available; it sets AGENTVID_HOME,
Python and the pinned local HyperFrames CLI. Use `hyperframes` from that environment. For standalone installation,
Python 3.12, Node 22+, ffmpeg and the original local-voice requirements are needed (VieNeu, Kokoro, soundfile,
faster-whisper if local recognition is desired, onnxruntime<1.23, PyAV<17). `scripts/setup-voice.py --check` reports
readiness and `scripts/setup-voice.py` installs missing local voice/model files using uv.

1. `python <skill>/scripts/new-project.py <new-dir> --language=vi|en [--voice="Thùy Dung"] [--brand="Name"]`.
   It refuses to overwrite an existing directory. Work in the copy, never the installed template.
2. Replace the sample script.json with the requested content. Save a short visual plan in storyboard.md: what each
   scene explains, what stays on screen, what changes, and the spoken cue that triggers the change. Read [references/script-schema.md](references/script-schema.md)
   for widgets/limits. The samples in references/ illustrate the schema and are not a prescribed subject.
3. `python <skill>/scripts/validate-script.py --project <dir> [--target 75]`.
4. `python <skill>/scripts/tts.py --project <dir> --engine vieneu [--voice "Thùy Dung"]`.
   Even English routes through this local wrapper to Kokoro. Project voice.json overrides shared preferences;
   explicit CLI flags win. Unchanged sections reuse audio; revise narration and run again when needed.
5. `python <skill>/scripts/sync-narration.py --project <dir> [--bgm <file> | --no-bgm]`.
   For a silent preview, skip TTS and add `--music-only`. The bundled subtle bed is optional.
6. `hyperframes lint <dir>` and `hyperframes check <dir>` must report no runtime/layout/contrast errors.
   The inherited `nested_structure_needs_subcomposition` warning is expected. Fix other actual findings.
7. Snapshot the intro, each scene after its elements appear and the outro. Use `hyperframes snapshot <dir> --at ...`;
   choose times from the printed sync plan. Open every contact sheet: code is legible, diagrams correct, no clipped
   text, no illustration over captions, and diacritics survive. For state changes, capture just before and after the
   cue as well as scene boundaries. Check that values remain changed in later frames and reverse seeking restores
   the prior state. Word timing is estimated: listen across the important cue and adjust it if necessary.
   Re-run sync after script changes.
8. `hyperframes render <dir> --quality high --output <dir>/renders/<slug>-9x16.mp4`.
   Verify duration, 1080×1920, 30 fps, a playable audio stream, and full decode with ffprobe/ffmpeg. Deliver the MP4
   with an inline preview or file link, actual length and requested voice. A preview does not authorize publishing.

## Extending the skill

The design is in template/theme.css, the scene/line-art renderers in template/editorial-engine.js, tokens/voice
in theme.json, and schema validation in scripts/validate-script.py. For a user-specific video, extend only its copy.
For an explicit skill update, keep renderer, validator and schema aligned. Preserve source/runtime and font licenses.
