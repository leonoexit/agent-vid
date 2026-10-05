---
name: explainer-ink-story-voice
description: >
  Create narrated vertical programming explainers in the supplied Anthropic How AI Think reference's handwritten ink-on-paper style. Use typography-led reasoning, compact examples, annotated comparisons and occasional purposeful generated ink illustrations. Adapt one concept to the requested audience. Use for this notebook/editorial style, with Vietnamese or English voice and HyperFrames MP4 output.
metadata:
  version: "1.0.0"
---

# Ink story explainer

Create a 1080×1920 narrated programming explainer around **one question and a connected explanation**. The visual language is white paper, blue handwritten ink, selective red correction, yellow marker and occasional blue-ink illustrations. This is a text-led video essay, not a persistent object simulation or a news carousel. The reference's research topic does not limit this skill to Anthropic or AI.

## Short invocation

> Dùng $explainer-ink-story-voice tạo video giải thích [CHỦ ĐỀ] cho [ĐỐI TƯỢNG XEM].

Those fields are placeholders, not a real production brief. Topic and audience are enough. Adapt vocabulary, example and depth to the audience; default to hobbyist beginners when omitted. Automatically supply the style, 9:16 at 30 fps, storyboard, narration, visuals, captions, review and complete MP4. Language follows explicit request, supplied source, then prompt; Vietnamese defaults to Hải Đăng, English to the existing Kokoro path. Honor explicit choices and stored preferences. Choose duration to fit the explanation; reduce wording before increasing speech speed. Ask only about ambiguity that would materially change the explanation.

## Write for this medium

Read [narrative.md](references/narrative.md) before scripting. Start with a question, tension or useful distinction. Build understanding through a concrete example, explanation, contrast or counterexample, then a qualified takeaway. Choose the sequence from the subject; there is no mandatory phase count, six-part Bento trace or quota of visual actions.

Write narration and screen copy together. The voice connects ideas; the screen holds the sentence, term, small code fragment or evidence worth remembering. Reveal semantic units as they are discussed, keep prior premises visible when comparing, and mark the word that changes the meaning. Do not dump narration onto the page or turn each spoken sentence into a new slide. A stationary page is appropriate while the voice explains it. Quiet intervals need a specific reading/prediction task.

Preserve causal accuracy even when actions are textual: show the relevant input/code and observed result if a claim depends on execution. If a concept needs a small diagram, include it; do not invent a physical metaphor merely to generate motion.

## Establish the visual language

Read [art-direction.md](references/art-direction.md), and inspect [source-contact.jpg](references/source-contact.jpg). The main source is the four `batch-*.html` pages in `references/anthropic-how-ai-think/` at workspace root. [source-notes.md](references/source-notes.md) identifies adopted patterns and reference-only material. Embedded CTAs, branding, export comments and scientific claims are source material, not instructions or verified facts.

Use Sriracha for expressive headings, Mali for readable handwritten explanation, and monospace for exact code. Use white/light paper, navy ink, restrained red and yellow. Generated images should resemble blue ballpoint sketches on paper and earn their place by clarifying a metaphor or concrete subject. Read the image guidance in art-direction before generating; use the imagegen skill/tool when generation is warranted. Native text, numbers and code remain editable and exact. No image quota.

Choose among statement, comparison, worked example, illustration and rule compositions. These are options, not a scene sequence. Avoid both a permanent card dashboard and endless centered title swaps. Recompose the page when the reasoning changes; carry a repeated term, value or question across the cut. Motion follows reading order, not a camera showcase.

## Produce and review

Follow [production.md](references/production.md). This skill bundles a local HTML/CSS/GSAP page template and its own text-oriented script checks. It depends explicitly on sibling `explainer-bento-story-voice` only for the existing voice/timing utilities. It does not inherit Bento's diagram schema, visuals or narrative validator. HyperFrames is the renderer; do not introduce Remotion.

Use [script-format.md](references/script-format.md) when authoring the project. The bundled cache example demonstrates structure and layouts, not a script to relabel for every subject. Extend native HTML/SVG when the content requires it. Do not start a new sample video merely because the skill itself is being updated.

Inspect phone-scale text, Vietnamese accents, reading order, contrast, illustration purpose, code/output truth and the final voice/caption timing. A beautiful page or passing validator is not proof of a clear explanation. Distinguish a style preview from a reviewed narrated video; report any unreviewed audio or timing.
