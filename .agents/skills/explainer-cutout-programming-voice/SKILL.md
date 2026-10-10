---
name: explainer-cutout-programming-voice
description: >
  Create narrated vertical programming explainers in a contemporary mixed-media cutout collage style. Use generated photographic and text-bearing foreground pieces, expressive typography and native code/data to explain one concept through a small worked example. Choose this skill for modern collage or paper-cutout programming videos with Vietnamese/English narration and HyperFrames MP4 output.
metadata:
  version: "0.6.1"
---

# Contemporary Cutout programming explainer

One programming concept, one worked example, 1080×1920 at 30 fps. Default audience: hobbyist beginners. A topic and audience are enough:

> Dùng $explainer-cutout-programming-voice tạo video giải thích [CHỦ ĐỀ] cho [ĐỐI TƯỢNG XEM].

Create a **moving collage whose composition develops with the explanation**. Photographs supply convincing material, generated lettering inhabits that material, and native marks make the mechanism exact. The work should feel assembled, separated, uncovered and recomposed during the sentence—not like finished posters waiting for narration to end.

## Working sequence

1. Read [art direction](references/art-direction.md) and [narrative](references/narrative.md). Choose the concrete example, the question it answers and the evidence viewers must see. Select a collage transformation that makes that relationship understandable—uncover, separate, assemble, recontextualize or enlarge a decisive detail—and develop narration with that transformation. These are choices, not a five-step plot. Establish the topic and an intelligible situation before asking viewers to interpret unfamiliar terminology. Write connected, audience-appropriate narration.
2. Read [choreography](references/choreography.md) and [asset generation](references/asset-generation.md). Write the shot score in `storyboard.md`: what the viewer already understands → context visible now / information held back → spoken clause and visible event → changed understanding → evidence retained for the handoff. Plan this information order throughout the video, including within scenes, not only at entrances. Decide image roles and independently moving pieces here, before fixing HTML positions. Assets and staging are designed together.
3. Generate and inspect the selected foreground assets and complete any finite label families. Fit composition to the accepted imagery. Build an **opening-to-first-payoff passage with actual narration**, so the hook, orientation and first causal explanation are tested together. Include a representative interior handoff when that treatment is not covered by the opening. Review it yourself; this is not an extra permission gate. Silent playback can debug motion but cannot establish spoken pacing.
4. Follow [production](references/production.md) and the [runtime contract](references/template-contract.md). Author the topic's model and choreography in the neutral scaffold. Finish and review the encoded video when a video is requested. Assess comprehension and visual development separately from runtime/layout checks; technical success does not establish editorial quality.

## Decisions that define this style

- Fresh photographic cutouts + flat colored paper + expressive type; simple native canvas colors. No generated frames or background imagery, including monochrome settings/surfaces. No retro/vintage styling.
- Give generated paper labels a distinct contact/cast shadow using the `paper-label` treatment in the kit; review at phone scale. Keep photo cutouts and captions independently styled.
- Generated imagery can carry subjects, fixed typography, meaningful UI content and foreground collage parts. It is not limited to decorative icons. Do not generate an empty sticker merely to overlay generic lettering.
- Choose text ownership by its use in the shot. A small authored set such as “0 BƯỚC / 1 BƯỚC / 2 BƯỚC” is a candidate for a coherent generated family even though its meaning is numerical. Calling it “model data” does not decide its medium. Code can switch whole variants. Computed/open-ended values, editable code and precise causal geometry normally remain native.
- Preserve the meaning and identity of evidence while freely changing its scale, position, grouping and crop. A result can travel into a comparison; a photo can recede as a detail becomes dominant. An entrance, highlight or page transition alone does not supply the development of a long passage.
- Reading holds are purposeful, not forbidden. Name what is being read or compared; remove repeated narration before filling time with decorative movement.

Use HyperFrames/HTML/CSS/SVG/GSAP; no Remotion or Three.js. Vietnamese defaults to Hải Đăng, male Northern Vietnamese, speed 1.0 and paragraph gap 0.2; honor explicit voice requests and stored preferences. English uses the installed Kokoro path. Bento supplies voice/timing utilities only, not a narrative or design template.

## What the package actually demonstrates

`template/` is a content-neutral authoring scaffold, deliberately unfinished. `examples/cache-technical/` preserves the old cache model and silent studies for technical reference. They demonstrate state commits, seeking and transition geometry; **they are not a quality benchmark or a default story/layout**. The [style sheet](references/style-preview.png) demonstrates palette/material only. Read [validation](references/validation.md) for actual checks and limitations. No reviewed narrated exemplar is currently bundled.

Keep image originals, prompts and provenance. Preserve existing projects. A skill-only edit does not request a new video; a requested video requires an MP4, not just a sheet or contact sheet.
