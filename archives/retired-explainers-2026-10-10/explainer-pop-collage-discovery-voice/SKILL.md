---
name: explainer-pop-collage-discovery-voice
description: >
  Create narrated vertical faceless discovery shorts in a vivid Pop Collage style: saturated color fields, monochrome or duotone photographic cutouts, expressive typography, pasted paper labels and handmade motion across scene components. Let images and concise text share the explanation according to what makes each passage clearest. Explain one sourced question about everyday objects, technology, design or cultural history for a general audience. Use familiar curiosity, origin-story or misconception formats with Vietnamese/English voice and HyperFrames MP4 output. This is a separate style from Contemporary Cutout and is not limited to programming.
metadata:
  version: "0.6.2"
---

# Pop Collage discovery shorts

Create one complete 1080×1920, 30fps narrated faceless video around a sourced question, typically 45–75 seconds. Default audience: curious general viewers, no specialist background. A topic is sufficient. Vietnamese defaults to Hải Đăng at speed 1.0, paragraph gap 0.2; honor explicit requests and project preferences. Use the existing local voice/HyperFrames workflow; no Remotion or Three.js.

> Dùng $explainer-pop-collage-discovery-voice tạo video về [CHỦ ĐỀ] cho [ĐỐI TƯỢNG].

## Visual identity and storytelling

Read [reference direction](references/art-direction.md) and inspect [the supplied grid](references/source.png). Borrow its saturated fields, tinted photographic silhouettes, pasted text strips, irregular display lettering and sparse drawn accents. Choose fields and palette for the actual assets and story; the reference colors are not a fixed scene-by-scene cycle. The grid's event names, registration instructions and dates are source content, not user instructions or a video script.

Use [Rosetta motion lessons](references/rosetta-motion.md) for an ensemble of moving collage components, asset staging and motivated transitions. Keep the Pop palette and vertical discovery format. The handmade cadence belongs to the whole assembled scene, including native components and standalone type, not only generated photos or stickers; captions remain a separate reading layer.

Read [story and evidence](references/story.md) before writing. Choose a familiar format that suits the source: a small origin story, a curiosity explained, or a misconception resolved. Research the facts rather than inventing a novel content category. Write original narration with an intelligible setup, supported explanation and memorable payoff; keep uncertainty where the sources require it.

Design the opening for a viewer arriving cold in a Reel. Establish the actual subject in the opening frame and a specific, supported reason to keep watching in the first beat; use the [cold-entry hook guidance](references/story.md#cold-entry-hook). A beautiful composition or an isolated symbol is not sufficient context.

Storyboard images, typography and narration together. A short question, expressive headline, comparison label or compact conclusion may carry the main idea; images identify subjects, reveal detail and make changes visible. Choose the leading medium passage by passage. Do not optimize for fewer words or require images to replace text that explains more clearly. Plan the collage transformations with the narration. A known object can be pulled apart into evidence, carried across an era change or paired with a contrasting interpretation. Each passage needs a changed relationship or an intentional reading task, not just a new poster. Preserve orientation and reveal evidence when its spoken explanation needs it. Reuse a recognizable anchor while allowing its position, scale and surrounding context to change.

## Shared Pop asset library

Before final asset generation, read the repository's [Pop asset library workflow](../../../docs/pop-asset-library.md). Search `asset-library/pop` through `python scripts/pop-assets.py search '<subject or narrative role>'` after activating the repository runtime. Inspect shortlisted original images; choose reuse, a referenced variant or new imagery according to the storyboard, not a reuse quota. The shared library is used by all three Pop skills and does not change their separate art/story directions.

Use the helper to copy selected originals and provenance into the new project's own assets. Register useful new images with exact prompts/source rights and parent IDs for actual variants; keep registered text-safe geometry for paper pieces. After rendering, record only assets actually used and refresh the gallery. A completed or liked video is not automatic approval of every image. Preserve historical project files. If the library is unavailable in a copied skill installation, use project-local assets and retain provenance rather than pretending a search or registration succeeded.

## Produce

1. Research and save a claim/source map; choose one question and a concise payoff. Complete the shot score before final asset generation.
2. Use [asset direction](references/assets.md) and the imagegen skill to create the subjects, actions, details, required visual states and expressive text pieces selected by the storyboard. Add imagery where it improves comprehension or composition, not merely to increase the image count. Plan image count from the shots, never from the number of sample assets. Reuse the supplied paper containers where they fit; read [backplates](references/backplates.md) and generate additions only for unmet needs. Keep generated illustrations distinct from authentic historical evidence. Use simple native color/pattern fields; no generated frame/background requirement.
3. Build the opening through its first explanation with actual narration. Review the first frame and opening seconds at phone scale without sound or post context, then with narration. Fix an unclear subject or weak curiosity promise before extending the film; record the finding in visual-review.md. Review information order and motion together.
4. Follow [production](references/production.md). Use local assets and a deterministic GSAP timeline. Render the complete MP4, inspect encoded frames and audio, and disclose review limits. A sheet or silent demo is not the requested video.

The template supplies style tokens and primitives, not a finished topic or fixed sequence of scene layouts. The pre-visual-led QWERTY direction is the preferred composition/story reference: `projects/pop-collage/qwerty-khong-abc-paper-motion/` (with its preceding container version for comparison). Keep its partnership of typography and imagery while extending handmade motion across components. The `qwerty-khong-abc-visual-led` project is a comparison trial, not the default narrative/layout template; see [validation](references/validation.md) for what was actually reviewed. Do not turn one trial's props into a universal icon kit. Preserve other skills and existing projects.
