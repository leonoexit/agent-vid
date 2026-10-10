---
name: explainer-mint-bento-programming-voice
description: >
  Create narrated vertical programming explainers in the supplied Mint Bento style: pale aqua canvas, mint/green/white rounded UI tiles, dark ink, large light sans numbers, outline capsules and restrained tilted chips. Explain one concept through a small example whose changing state connects a main object with its relevant detail or summary views. Use for this flat Apple-like bento direction with Vietnamese or English narration and HyperFrames MP4 output.
metadata:
  version: "1.1.0"
---

# Mint Bento programming explainer

One programming concept, one concrete example, adapted to the requested audience. Default: hobbyist beginners; 1080×1920, 30 fps, Vietnamese Hải Đăng male Northern voice, speed 1.0, paragraph gap 0.2. English uses local Kokoro am_michael. Explicit requests and stored preferences win. A topic and audience are enough:

> Dùng $explainer-mint-bento-programming-voice tạo video giải thích [CHỦ ĐỀ] cho [ĐỐI TƯỢNG XEM].

## Read the reference as a visual system

Read [reference-analysis.md](references/reference-analysis.md), [narrative.md](references/narrative.md) and [motion.md](references/motion.md). Inspect [the original](references/source.png) and [the implemented style sheet](references/style-preview.png). The source is one static UI collage; it does not supply motion, a font identity, a teaching script or software behavior.

Use soft aqua space around an asymmetrical cluster: large white/mint detail cards, a compact green action tile, dark capsules, oversized light-weight numbers and a few off-axis chips. One dominant object and its supporting views make the hierarchy. Borders are mostly absent; white outline capsules and broad corner radii are distinctive. Keep surfaces flat or very shallow, with restrained mint gradients. The kit is native HTML/CSS/SVG; gen-img is optional only for a topic-specific referent that benefits from it.

Build actual UI anatomy inside the tiles: object icon/name, concise metadata, nested content, a selected row/tab or status where meaningful. Use light giant data, regular headings and compact interface labels to create hierarchy. The Apple-like quality comes from precise spacing, optical balance, rounded icon geometry and restrained surface highlights; a pastel rectangle with a headline is insufficient. Read the component guidance in reference-analysis.md.

Extract the source's softness, typography, card proportions, icon silhouettes and overlap. Do not import its brands, finance claims, date, watermark or pretend banking interactions are required. A calendar is for meaningful time/history; a percentage needs a real denominator; an arrow needs a direction or action. The reference is not permission to fill every scene with dashboard widgets.

## Let connected state determine the story

Use a small action and inspect its consequence through the views that actually help: an array and its length, a queue and its first item, a function call and its returned value, a request and its status. Main view, detail and summary must describe one consistent state. Put that relationship into the narration; several nice-looking unrelated cards are not an explanation.

Useful routes include action → related state changes → explanation, detail → summary consistency, or a changed condition → compared outcome. Choose the route by the viewer's uncertainty, not a mandatory six-phase sequence. [narrative.md](references/narrative.md) explains the choices and their limits. Before rendering, score each spoken clause with what is visible before, what changes, what becomes true afterwards and what the viewer should inspect.

A rounded card is a reading area, not a permanent stage. Let an important tile enlarge or open, let a completed summary become a small chip, and remove unrelated widgets. Keep a recognizable label/object through the reflow. Camera travel is optional; it cannot replace actual code/data changes. Small tilted chips add rhythm; important code and moving evidence remain level and legible.

## Build and verify

Follow [production.md](references/production.md) and [template-contract.md](references/template-contract.md). The starter includes local fonts/GSAP, native icons, shared MintUI components used by both the style sheet and the working timeline, a caption/cue helper and a worked JavaScript push example. Its choreography is example-specific: adapt script.json, story.js and storyboard.md together for a new topic. The sibling Bento voice/timing utilities are an explicit production dependency; its design and narrative are not inherited. No Remotion or Three.js.

Vietnamese text uses the bundled Inter approximation with complete accents; JetBrains Mono is reserved for code. Scope unknown source details honestly. Keep every changing value native and commit related views together. Review before/middle/after, reverse seeks, phone-scale type, contrast, result timing and the longest unchanged intervals. A still comparison can be purposeful; an idle dashboard under long narration is not. Complete visual-review.md with actual evidence rather than equating a render pass with comprehension.

Creating/updating the skill does not automatically request a narrated test video. Preserve existing projects. [validation.md](references/validation.md) distinguishes implemented assets and checks from untested production behavior.
