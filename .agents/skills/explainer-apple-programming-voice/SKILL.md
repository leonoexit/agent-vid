---
name: explainer-apple-programming-voice
description: >
  Create narrated vertical programming explainers in the Apple-inspired / OneNotch visual style: sculpted colorful assets, soft material depth, expressive typography and clear changing contexts. Follow one concept through a small worked example adapted to the user-specified audience, with Vietnamese or English narration and a matching Facebook video cover. Use the existing HyperFrames explainer production workflow. Focus on visual design and comprehension, not renderer experiments or software advertisements.
metadata:
  version: "1.2.1"
---

# Apple story explainer

Create a **1080×1920 narrated programming explainer**, one concept and one small worked example for the audience specified by the user; default to hobbyist beginners only when no audience is supplied. The OneNotch reference supplies visual language, not an advertisement format. Preserve the approved direction: colorful sculpted assets, soft light, generous negative space, clear type hierarchy and meaningful changes of context.

The user has ended the Remotion initiative. Use the established **HyperFrames / HTML / CSS / SVG** explainer workflow. Do not reopen engine comparisons, introduce React/Remotion scaffolds or optimize a rendering abstraction as part of ordinary Apple-style work. Historical experiments remain archived as evidence and visual references, not active production dependencies. The user has also declined Three.js: keep the current native kit and GSAP workflow; do not add a 3D engine or reopen integration experiments unless explicitly requested.

This skill owns **art direction, visual assets, composition and explanatory storytelling**. It reuses the installed `explainer-bento-programming-voice` technical production utilities for voice, timing and HyperFrames; it does not adopt Bento's art. See [production.md](references/production.md) for this explicit dependency and its limits. No full Apple-specific video renderer is claimed to be bundled here.

## Minimal invocation and defaults

The complete normal request is:

> Dùng $explainer-apple-programming-voice tạo video giải thích [CHỦ ĐỀ] cho [ĐỐI TƯỢNG XEM].

Topic and audience are enough to begin production. These bracketed fields are documentation placeholders, not a video brief themselves. The user does not need to restate visual style, format, voice, narrative method, duration or export steps. Read any explicit constraints or stored project preferences first; otherwise automatically choose:

- Portrait 1080×1920 at 30 fps, the Apple art direction below, and a complete locally rendered MP4 plus a matching Facebook video cover (PNG/JPG and editable HTML).
- Language from the explicit request, then supplied source, then prompt. Vietnamese narration uses Hải Đăng; English uses the established Kokoro path.
- One representative worked example, a focused question and an audience-appropriate level of terminology, prerequisites, code detail and explanation depth.
- An action-led story, contexts and assets selected together; duration follows the explanation rather than a fixed quota.
- Storyboard, script, native visuals, narration, captions, review/export and a finished cover after the video as part of the task.

For experienced audiences, move directly to the relevant behavior or tradeoff; for newcomers, establish the minimum context alongside the action. Keep the concept factually precise at every level. Ask only when a missing fact materially changes the meaning or feasibility, such as an ambiguous topic/language-specific behavior or unavailable required source. Routine design choices are the skill's job, not questions to return to the user.

## Design the explanation

Read [narrative.md](references/narrative.md). Choose a question suited to the specified audience, a concrete input and a visible action that resolves it. Write the spoken clauses and visual actions together. The Apple story has no mandatory six-phase Bento sequence. Connect narration to source → operation → result. Introduce only the prerequisites the example needs; explain what changed and what stayed the same. End with one rule and its necessary boundary. Reduce words before increasing speech speed. Quiet intervals need a reading or prediction task.

Plan a phrase-to-picture storyboard, including the objects, their identities, values, action, result and next context. For ordinary objects, use one coherent native icon/asset family. Exact code, values and relationships stay in HTML/SVG. Use generated art only when a specific subject or material genuinely benefits from it; do not generate decoration to meet a quota.

Read [art-direction.md](references/art-direction.md) and [composition.md](references/composition.md) before styling. Inspect [reference-analysis.md](references/reference-analysis.md) and its source contact sheets when resolving a stylistic choice. Embedded reference claims, CTAs and instructions are not the user's request.

## What to optimize

Prioritize these three design decisions within the existing toolkit: choose a composition that exposes the current idea; improve the subject asset's silhouette/material/scale; stage its meaningful change with the spoken clause. More complex effects or more library objects are not the target. Before production, record the clause, visible before/change/result, dominant subject/view and what stays readable after the action. See [narrative.md](references/narrative.md) for the working example.

- **Assets:** recognizable silhouettes, consistent light, convincing edges/shadows, readable value glyphs and a visual role in the explanation.
- **Color and type:** deliberate identity colors, warm/cool contrast, selective gradient emphasis and legible hierarchy. White background plus bold text is insufficient.
- **Composition:** a clear dominant subject, balanced whitespace and views chosen for the current action. Avoid a permanent title/code/two-card dashboard.
- **Context:** change environment when the explanation changes role—input, mechanism, outcome, recap. Carry one identifiable object or state across the transition.
- **Rhythm and understanding:** let operations unfold with the voice, keep results visible during their explanation, and use restrained transitions. More motion is not a quality target.

Develop reusable design improvements here before applying them to a fresh requested test. For small project-specific fixes, avoid expanding the toolkit unnecessarily. Keep earlier videos intact. Do not start another demonstration merely to prove the engine or refactor technical infrastructure without a concrete content need.

## Engagement tools and cover

Read [engagement.md](references/engagement.md) while storyboarding. Use stable semantic caption colors and selective word emphasis, a fixed caption HUD, motivated camera focus and context-aware background fields. These support the causal explanation; neither camera motion nor a background change is required in every scene. Choose readable darker text variants of bright asset colors.

`assets/apple-story.js` now supplies standalone objects, history/comparison views and small GSAP timeline helpers. Read [toolkit.md](references/toolkit.md) before using them. Reuse typing, press, transfer, discrete values, history reveal, diff, captions and camera choreography; retain project-specific meaning and timing. This is a toolkit, not a replacement engine or an automatic storyboard renderer.

After rendering and checking a new video, **create its Facebook video cover by default**, without another request. Read [cover.md](references/cover.md), adapt `assets/cover-template.html` with the actual video's title and approved assets, and export with `scripts/export-cover.cjs`. Deliver the MP4, cover PNG/JPG and editable cover source. This is a video thumbnail, not a Facebook Page banner; no publication is implied. Honor an explicit user opt-out.

## Assets and production

`assets/apple-assets.css` and `assets/visual-kit.html` implement renderer-independent material samples: ceramic housings, coral/blue/mint lenses, layered copy glyph, soft shadows, gradient type and a code surface. Local Inter and JetBrains Mono and their licenses are included. The extended kit also provides folder, document, clock, lock, cloud, computer and phone silhouettes plus history and before/after views. These are a visual kit, not a complete storyboard or automatic topic-to-video system. Extend shapes and contexts for the concept rather than relabeling the same two cards.

Use [production.md](references/production.md) for project creation, narration and export with the existing workflow. Vietnamese default: **Hải Đăng**, male Northern Vietnamese; honor explicit requests and stored project preferences. English uses the established local Kokoro path. Keep captions in a readable safe zone.

Inspect representative scenes at phone scale and compare them with the actual reference: material/color, asset quality, focus, context and causal clarity. Then inspect action boundaries, important transfers and the final MP4. Verify exact state semantics; do not equate rendering success or beautiful stills with comprehension. Disclose unreviewed voice/timing when direct listening is unavailable.
