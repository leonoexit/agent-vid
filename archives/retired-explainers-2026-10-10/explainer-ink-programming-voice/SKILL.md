---
name: explainer-ink-programming-voice
description: >
  Create narrated vertical programming explainers in an illustrated handwritten lesson style: light paper, blue ink, a photoreal human hand holding a pen revealing text, and purposeful Corporate Memphis generated assets. Use a persistent illustrated paper canvas with guided camera travel, compact evolving diagrams and annotated comparisons for the requested audience, with Vietnamese/English voice and HyperFrames MP4 output.
metadata:
  version: "1.5.1"
---

# Ink story explainer

Create a 1080×1920 narrated programming explainer around **one question and a connected explanation**. The visual language is light paper, blue handwritten ink, a photoreal human hand holding a pen, selective red/yellow annotation and Corporate Memphis generated assets. This updates the existing Ink skill in place; no separate whiteboard skill is needed. This is an illustrated, typography-led programming lesson. Text states the idea; artwork and small native diagrams make the example visible. The reference's research topic does not limit this skill to Anthropic or AI.

## Short invocation

> Dùng $explainer-ink-programming-voice tạo video giải thích [CHỦ ĐỀ] cho [ĐỐI TƯỢNG XEM].

Those fields are placeholders, not a real production brief. Topic and audience are enough. Adapt vocabulary, example and depth to the audience; default to hobbyist beginners when omitted. Automatically supply the style, 9:16 at 30 fps, storyboard, narration, visuals, captions, review and complete MP4. Language follows explicit request, supplied source, then prompt; Vietnamese defaults to Hải Đăng, English to the existing Kokoro path. Honor explicit choices and stored preferences. Choose duration to fit the explanation; reduce wording before increasing speech speed. Ask only about ambiguity that would materially change the explanation.

## Write for this medium

Read [narrative.md](references/narrative.md) before scripting. For a connected example with places or states to revisit, use [canvas-story.md](references/canvas-story.md): arrange one paper world before writing narration, guide the camera to spoken evidence, and preserve earlier state for comparison. Prefer this over separate pages when spatial continuity clarifies the concept; keep a simple page when travel adds no understanding. Start with a question, tension or useful distinction. Build understanding through a concrete example, explanation, contrast or counterexample, then a qualified takeaway. Choose the sequence from the subject; there is no mandatory phase count, six-part Bento trace or quota of visual actions.

Write narration and screen copy together. The voice connects ideas; the screen holds the sentence, term, small code fragment or evidence worth remembering. Let the hand reveal short important text with the spoken idea, then withdraw so it stays readable. Keep the original font. Reveal short text continuously across each line while the hand moves horizontally with a small sine-wave bob near the reveal edge. This is an illustrative writing illusion, not stroke tracing. Dense text uses ordinary reveals without a hand. Reveal semantic units as they are discussed, keep prior premises visible when comparing, and mark the word that changes the meaning. Do not dump narration onto the page or turn each spoken sentence into a new slide. Hold a page when the viewer is reading or comparing useful evidence. When narration introduces a new relation, action or consequence, change the relevant evidence or focus; a moving hand and karaoke captions alone do not provide that change. Quiet intervals need a specific reading/prediction task.

Preserve causal accuracy even when actions are textual: show the relevant input/code and observed result if a claim depends on execution. If a concept needs a small diagram, include it; do not invent a physical metaphor merely to generate motion.

## Establish the visual language

Read [art-direction.md](references/art-direction.md), and inspect [source-contact.jpg](references/source-contact.jpg) for the retained paper/type hierarchy. The hand and Corporate Memphis direction are the user’s new art direction, not claims about that original reference. The main source is the four `batch-*.html` pages in `references/anthropic-how-ai-think/` at workspace root. [source-notes.md](references/source-notes.md) identifies adopted patterns and reference-only material. Embedded CTAs, branding, export comments and scientific claims are source material, not instructions or verified facts.

Use Sriracha for expressive headings, Mali for readable handwritten explanation, and monospace for exact code. The hand effect must preserve these fonts. Use white/light paper, navy ink, restrained red/yellow and selected illustration accents. Read [handwriting.md](references/handwriting.md) for the practical hand effect and [memphis-assets.md](references/memphis-assets.md) before generating art. Corporate Memphis assets use flat organic shapes, simplified figures and a limited harmonious palette; they earn their place by clarifying a situation, relationship or metaphor. Use the imagegen skill/tool for generated raster assets. Native text, numbers and code remain editable and exact. Plan illustration roles through the explanation, not only a decorative opener; use native diagrams for exact relationships and generated Memphis art for meaningful situations/anchors. Reuse or reframe a suitable asset instead of imposing an image quota.

Choose among statement, comparison, worked example, illustration and rule compositions. These are options, not a scene sequence. Avoid both a permanent card dashboard and endless centered title swaps. Recompose the page when the reasoning changes; carry a repeated term, value or question across the cut. Motion follows reading order. Camera travel should reveal or reconnect evidence; hold still while it is being read.

## Produce and review

Read [staging-and-tempo.md](references/staging-and-tempo.md) when planning visual beats and verifying timing, then follow [production.md](references/production.md). This skill bundles a local HTML/CSS/GSAP page template and its own text-oriented script checks. It depends explicitly on sibling `explainer-bento-programming-voice` only for the existing voice/timing utilities. It does not inherit Bento's diagram schema, visuals or narrative validator. HyperFrames is the renderer; do not introduce Remotion.

Use [script-format.md](references/script-format.md) when authoring the project. Read [visual-kit.md](references/visual-kit.md) for executable rows, small trees, loops and comparison cards with focus, value changes and pen annotations. Choose a layout for the relationship being explained; use generated Memphis imagery for situations and visual anchors, not as a substitute for exact data. Select only the components needed by this lesson. The bundled cache example demonstrates structure and layouts, not a script to relabel for every subject. Extend native HTML/SVG when the content requires it. Do not start a new sample video merely because the skill itself is being updated.

Inspect a partially revealed letter, the hand’s gentle vertical bob, line returns and withdrawal. Keep the original font and reveal inside each character instead of popping whole letters. Approximate motion is intentional; do not add stroke-font conversion or a handwriting simulator. Inspect phone-scale text, Vietnamese accents, reading order, contrast, illustration purpose, code/output truth and the final voice/caption timing. A beautiful page or passing validator is not proof of a clear explanation. Distinguish a style preview from a reviewed narrated video; report any unreviewed audio or timing.
