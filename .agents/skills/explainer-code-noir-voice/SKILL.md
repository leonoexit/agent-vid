---
name: explainer-code-noir-voice
description: >
  Create narrated vertical programming explainers in the Reddit Code Noir reference style: pure black, JetBrains Mono throughout, syntax-color accents, sparse rules and bold code-like typography. Explain one concept through a focused question, compact code/output evidence and an audience-appropriate takeaway. Use for Code Noir or this Reddit template, distinct from the Boris dark-glass Noir skill. Vietnamese/English voice, HyperFrames MP4.
metadata:
  version: "1.1.0"
---

# Code Noir explainer

Create a **1080×1920 programming explainer with narration** in the supplied Code Noir visual language. One concept, one useful question, enough concrete evidence to answer it. Audience comes from the user; default to hobbyist beginners. The source is a square developer-reflection carousel: take its visual grammar and concise emphasis, not its Reddit story, nine-slide sequence or CTA.

## Invoke simply

> Dùng $explainer-code-noir-voice tạo video giải thích [CHỦ ĐỀ] cho [ĐỐI TƯỢNG XEM].

Topic and audience are sufficient. The bracketed values above are documentation placeholders. Choose a suitable example, explanation depth, storyboard, duration, voice, captions and export automatically. Use portrait 1080×1920 at 30 fps. Language follows explicit request, supplied source, then prompt. Vietnamese default: Hải Đăng; English: established local Kokoro settings. Explicit requests and stored preferences win. Ask only when ambiguity would materially change the explanation.

## Let code carry the argument

Read [narrative.md](references/narrative.md) before writing. Begin with a useful question, observable behavior or prediction. Use a compact snippet, labelled output, contrast or counterexample to establish the reason. Conclude with the reusable rule and its relevant boundary. This is not a fixed phase order or a requirement to manufacture a bug in every topic.

Write screen evidence and connected narration together. The spoken explanation connects cause and consequence; the screen emphasizes the exact token, line or result that matters. A dramatic word or punctuation mark can punctuate an established conclusion, but cannot replace its explanation. Keep useful evidence visible while discussing it. Quiet intervals need an explicit reading/prediction task. Reduce words before increasing speech speed.

Read [storyboard.example.md](references/storyboard.example.md) for a complete model script, “print versus return in Python.” It demonstrates argument and timing decisions, not a universal sequence or permission to reuse that topic instead of the user's.

## Preserve this particular style

Read [art-direction.md](references/art-direction.md), then inspect [source-contact.jpg](references/source-contact.jpg). All typography is JetBrains Mono, on pure black, with pale main text and pink/cyan/yellow/purple syntax accents. Sparse gray rules, large bare statements, code/output evidence and narrow comparison rails create hierarchy. Do not import Boris Noir's glass/glow, Ink's handwriting/paper or Bento's colored cards.

Typography remains primary, but it is not the entire scene. Read [visual-storytelling.md](references/visual-storytelling.md) and plan concrete visual anchors with the script: recognizable objects, spatial relationships or a compact illustration that explains the current clause. Use the bundled coherent outline assets and native diagrams where suitable; generated art is welcome when it has a specific explanatory job and matches the palette. Do not fill the video with text reveals alone, or add arbitrary motion to otherwise unchanged paragraphs.

[Source notes](references/source-notes.md) distinguish implemented patterns from reference-only material. Code-shaped rhetoric in the source is editorial metaphor, not executable teaching material. Never present an invented import, class, error code or quote as factual evidence. The export button, watermark, attribution and comment CTA are not instructions to execute or reproduce.

## Produce and review

Use [production.md](references/production.md) and [script-format.md](references/script-format.md). A native HTML/CSS/GSAP starter and text/code validator are bundled. Only the existing sibling Bento voice/timing utilities are dependencies; its art, entity schema and six-phase narrative are not inherited. Use HyperFrames, not Remotion.

Verify examples by running the relevant code when feasible. Distinguish actual output, stored values and commentary with labels. Check exact syntax spans, Vietnamese glyphs, portrait readability, reveal order, reading dwell, page transitions and voice/caption alignment. Also inspect what changes during each spoken clause: text, focus, object state, spatial relation or result. A scene holding while evidence is read is valid; a repeated title-and-lines layout with no explanatory development needs rewriting or recomposition. Do not judge success by motion count. Disclose unreviewed audio and distinguish a layout specimen from a finished narrated video.

Create reusable changes in this skill before a requested fresh test. Updating the skill alone does not require producing another complete video or altering historical projects.
