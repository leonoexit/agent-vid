---
name: explainer-pop-narrative-discovery-voice
description: >
  Experimental Pop Narrative: create a narrated vertical discovery short about one sourced origin, event or turning point in technology, design or everyday culture. Keep vivid Pop photographic collage while using a continuous causal story inspired by the installed Vox documentary skill. Use when the user asks for Pop Narrative or a Pop storytelling trial; not a step-by-step software tutorial.
metadata:
  version: "0.1.2"
---

# Pop Narrative — experimental

Produce one complete 1080×1920, 30fps short, usually 45–90 seconds, for curious general viewers. Vietnamese narration defaults to Hải Đăng at normal speed. No music or SFX unless requested. Deliver MP4, matching Facebook cover, editable project, script and claim/source map. A topic is enough; preserve the original Pop skill and old projects.

## The story carries the explanation

Find a sourced event with a concrete situation, a change that matters, a response and a consequence. Explain why each development follows the previous one. These are causal relationships, not a mandatory sequence of five title cards. Open with the actual subject and a specific tension or question understandable without post context. Begin answering promptly. Use continuous, connected narration; time markers and names orient the viewer, but do not replace causal explanation.

Write one clear idea per spoken clause, varying sentence length naturally. Let the voice connect context, decisions and consequences. Let cutouts stage the event, expose a relationship or make a consequence visible. Text anchors names, dates, important distinctions and the payoff; a short expressive headline may lead when clearer than an image. Do not turn the entire narration into text slides, or force an arbitrary text/image ratio.

A story about technology need not become a technical tutorial: explain only the mechanism needed to understand what changed. Finish by answering the opening question with an earned implication. Do not invent a villain, dialogue, deadline, exclusive cause, heroic single-inventor claim or cliffhanger. Distinguish a triggering event from deeper requirements and later development. Trace dates, numbers and quotations to sources; mark generated imagery as illustration rather than archival proof.

Before final assets, write a brief shot score: what the viewer knows, spoken causal beat, image/action, concise text, what changes, and what carries into the next passage. Voice units need not be scene cuts. A reused object changes role or relationship as the story advances; jitter and entrances alone do not develop an idea.

## Keep Pop's visual language

Read the sibling Pop [art direction](../explainer-pop-collage-discovery-voice/references/art-direction.md), inspect its [reference grid](../explainer-pop-collage-discovery-voice/references/source.png), and use its [motion guidance](../explainer-pop-collage-discovery-voice/references/rosetta-motion.md). Preserve saturated fields, photographic mono/duotone cutouts, clean white paper contours, expressive display type, pasted labels and restrained handmade motion across component assemblies. Captions remain stable.

Choose palette and field changes from the film's assets and narrative shifts. Keep foreground anchors through connected actions, or use an intentional clean cut for a new time/context. No obligatory flash, whoosh, camera recipe or poster replacement on every sentence. Do not import Vox's aged paper, restricted red/yellow palette, mandatory hard cuts, chapter count or music/SFX workflow.

Use the imagegen skill and Pop's [asset direction](../explainer-pop-collage-discovery-voice/references/assets.md). Derive images from necessary subjects, details and separable states, without a fixed image quota. Reuse the [paper backplates](../explainer-pop-collage-discovery-voice/references/backplates.md) where appropriate. Keep exact code, changing data and authentic quotations native. Backgrounds are simple native fields/patterns, not mandatory generated scenery.

## Compose readable moving assemblies

Reserve readable space for each active claim, its subject and captions. Use the actual visible paper bounds (including the height implied by its aspect ratio), not only the text baseline. A label may overlap an unimportant edge of its own subject; it must not hide another claim, a face or the detail being explained. Assign text and its paper one moving parent. Do not solve collisions by raising every label's z-index: move, resize, retire or sequence the competing assembly.

Plan settled positions and travel paths together. Before new evidence arrives, make space for it. Separate branches or copies into legible destinations; retaining a previous anchor is optional when it crowds the new relationship. Allow breathing room for rotation, paper jitter and shadows. These are composition constraints, not a fixed grid or a ban on intentional collage layering.

When a named real person is central to a historical beat, prefer a sourced, credited photograph over anonymous illustrative hands. Identify a later portrait as such; do not imply it depicts the historical event.

During browser review, check inter-component occlusion in addition to text fitting inside each label. Sample every rendered frame around motion and joins, including entrance, peak overlap and settled states; inspect the longest held compositions too. Use native text bounds and visible paper bounds to flag cross-assembly intersections. Record intentional overlaps specifically, never blanket-ignore all images or all labels. Verify critical faces/details visually because rectangle checks cannot establish semantic clarity. Recheck the reported intervals in the encoded MP4. A clean overflow/contrast report alone does not establish readable layering.

## Shared Pop asset library

Before final asset generation, read the repository's [Pop asset library workflow](../../../docs/pop-asset-library.md). Search `asset-library/pop` through `python scripts/pop-assets.py search '<subject or narrative role>'` after activating the repository runtime. Inspect shortlisted original images; choose reuse, a referenced variant or new imagery according to the storyboard, not a reuse quota. The shared library is used by all three Pop skills and does not change their separate art/story directions.

Use the helper to copy selected originals and provenance into the new project's own assets. Register useful new images with exact prompts/source rights and parent IDs for actual variants; keep registered text-safe geometry for paper pieces. After rendering, record only assets actually used and refresh the gallery. A completed or liked video is not automatic approval of every image. Preserve historical project files. If the library is unavailable in a copied skill installation, use project-local assets and retain provenance rather than pretending a search or registration succeeded.

## Produce and review

Use the sibling Pop [production workflow](../explainer-pop-collage-discovery-voice/references/production.md), initializer, validator and template. Run its `scripts/new-project.py` for a fresh project; then author this trial's own script, shot score and story.js. Retain local TTS, HyperFrames and deterministic GSAP; no Remotion or Three.js. The original Pop story reference supplies hook/evidence checks; this file defines the narrative format for this variant.

When combining the inherited entrance helper with GSAP and paper jitter, explicitly reset xPercent/yPercent to zero for absolute-coordinate movement, including entrances and split/replication tweens. Otherwise image initialization can introduce an unintended percentage offset. GSAP initialization can replace the independent CSS translate/rotate properties used by the jitter helper; restore the custom-property bindings on registered carriers after timeline initialization, then verify arbitrary seeks and consecutive rendered frames. The first trial's project-local collage.js/story.js demonstrates this compatibility fix; do not change the original Pop skill implicitly.

Review the opening muted and with voice, one interior causal sequence, scene joins and final encoded output. Check whether the viewer can follow what changed and why, not only whether the composition is attractive. Verify text fit, asset transparency, reverse seeks, meaningful action timing and MP4 playback. Word timing may be estimated; disclose audiovisual review limits. A successful render or one liked video does not validate the variant broadly.

Run `node .agents/skills/explainer-pop-narrative-discovery-voice/scripts/audit-readability.cjs <project>` after activating the repository runtime. It scans the inherited Pop timeline at 30fps for text/text and text/paper intersections and reports conservative text/image candidates in `qa/readability.json`. It recognizes the Pop template's text classes; mark custom text with `data-readability-text`. Review every image candidate and record the specific compositional reason for any retained overlap. The helper does not inspect image alpha or understand faces; pair it with visual review, rather than treating zero text failures as an overall pass.

Make a dedicated cover with the subject and a truthful curiosity promise. Save the exact image prompts and distinguish illustration from documentary evidence. Record trial findings in the project rather than adding new universal rules from a single reaction.

This variant borrows continuous documentary narration and causal sequencing from the installed Reelcrew Vox style guide. It uses Pop's visual/production resources; it does not invoke the Vox renderer or sound defaults. First test: `projects/pop-narrative/vi-sao-git-ra-doi/`.
