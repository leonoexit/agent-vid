---
name: explainer-pop-motion-discovery-voice
description: >
  Create image-led narrated vertical Pop Motion shorts about one sourced origin, mechanism or useful misconception in technology, design or everyday culture. Use photographic collage actions to carry a continuous causal explanation, with expressive Corose hooks and sparse labels. Use for Pop Motion; not a multi-topic list or a full software walkthrough.
metadata:
  version: "0.2.0"
---

# Pop Motion — image-led

Produce one complete 1080×1920, 30fps short, usually 45–90 seconds, for curious general viewers. Vietnamese narration defaults to Hải Đăng at normal speed. No music or SFX unless requested. Deliver MP4, matching Facebook cover, editable project, script and claim/source map. A topic is enough. The user approved the image-led API-key film with opening heading accents as this skill’s current direction. Keep Pop Collage, Pop Narrative and historical projects separate and unchanged. This skill owns its template and resources.

## The story carries the explanation

Choose a sourced origin, mechanism or useful misconception with a concrete situation, a meaningful change and an understandable consequence. Explain why each development follows the previous one. These are causal relationships, not a mandatory sequence of five title cards. Open with the actual subject and a specific tension or question understandable without post context. Begin answering promptly. Use continuous, connected narration; time markers and names orient the viewer, but do not replace causal explanation.

Write one clear idea per spoken clause, varying sentence length naturally. Let the voice connect context, decisions and consequences. Make images perform the explanation: uncover evidence, separate a copy, test a relationship, show a changed result. Plan these actions before HTML layout. Text anchors names, dates, exact technical details and concise distinctions; Corose supplies the hook and an occasional payoff. If a passage is understood only by reading its heading/card while its image decorates it, restage the image or simplify the spoken idea. Captions remain available; there is no numeric text/image quota.

A story about technology need not become a technical tutorial: explain only the mechanism needed to understand what changed. Finish by answering the opening question with an earned implication. Do not invent a villain, dialogue, deadline, exclusive cause, heroic single-inventor claim or cliffhanger. Distinguish a triggering event from deeper requirements and later development. Trace dates, numbers and quotations to sources; mark generated imagery as illustration rather than archival proof.

Before committing to a topic, state its audience payoff in one concrete sentence: what familiar situation, consequential choice or present-day mechanism will the viewer understand better? A curious old behavior alone is a weak premise. Historical discovery remains valid when its consequences make the story worth knowing; do not force every story into a tutorial. If the payoff is only that the fact is surprising, reconsider the angle before producing assets.

Read the [story and picture-beat guidance](references/story.md) before final assets. Write a brief shot score: what the viewer knows, spoken causal beat, image action with visible before/after states, required assets or variants, indispensable text, and what carries into the next passage. Voice units need not be scene cuts. A reused object changes role or relationship as the story advances; jitter and entrances alone do not develop an idea. Before finalizing the shot score, consider the viewer’s likely reaction at questions, misconceptions and reversals. Read the [reaction-beat guidance](references/motion-staging.md#visual-reaction-beats) to select a useful visual interpretation and any missing asset; do not limit images to nouns spoken aloud.

## Keep Pop's visual language

Read the copied Pop [art direction](references/art-direction.md), inspect its [reference grid](references/source.png), and use its [motion guidance](references/rosetta-motion.md). Preserve saturated fields, photographic mono/duotone cutouts, clean white paper contours, expressive display type, pasted labels and restrained handmade motion across component assemblies. Keep Corose for short headings. Restore the original Pop body hierarchy: JetBrains Mono for concise body copy and paper labels, Inter for captions and contextual application UI. Do not switch body copy to a serif face. Follow the typography roles and font provenance in the art direction. Captions remain stable. Give the opening heading a purposeful marker/paper accent on its key term or question; see [heading accents](references/art-direction.md#opening-heading-accents).

Choose palette and field changes from the film's assets and narrative shifts. Keep foreground anchors through connected actions, or use an intentional clean cut for a new time/context. No obligatory flash, whoosh, camera recipe or poster replacement on every sentence. Do not import Vox's aged paper, restricted red/yellow palette, mandatory hard cuts, chapter count or music/SFX workflow.

Use the imagegen skill and Pop's [asset direction](references/assets.md). Derive images from necessary subjects, details and separable states, without a fixed image quota. Reuse the [paper backplates](references/backplates.md) where appropriate. Choose the visual representation and material in the storyboard before coding: photographic cutout, text-bearing print, paper label, standalone type or a meaningful interface excerpt. Prefer photographic detail for physical subjects; do not substitute generic SVG drawings. Do not default to rounded cards, pills or icons inside circular badges. When a UI symbol is itself the subject, show it in a recognizable interface excerpt with enough context to explain its function. SVG supports necessary relations, precise geometry and contextual interface details, not a default illustration kit. Read [material and container guidance](references/art-direction.md#materials-and-text-containers) before building labels and captions. Keep exact code, changing data and authentic quotations native. Backgrounds are simple native fields/patterns, not mandatory generated scenery.

## Compose readable moving assemblies

Reserve readable space for each active claim, its subject and captions. Use the actual visible paper bounds (including the height implied by its aspect ratio), not only the text baseline. A label may overlap an unimportant edge of its own subject; it must not hide another claim, a face or the detail being explained. Assign text and its paper one moving parent. Do not solve collisions by raising every label's z-index: move, resize, retire or sequence the competing assembly.

Plan settled positions and travel paths together. Before new evidence arrives, make space for it. Separate branches or copies into legible destinations; retaining a previous anchor is optional when it crowds the new relationship. Allow breathing room for rotation, paper jitter and shadows. These are composition constraints, not a fixed grid or a ban on intentional collage layering.

When a named real person is central to a historical beat, prefer a sourced, credited photograph over anonymous illustrative hands. Identify a later portrait as such; do not imply it depicts the historical event.

During browser review, check inter-component occlusion in addition to text fitting inside each label. Sample every rendered frame around motion and joins, including entrance, peak overlap and settled states; inspect the longest held compositions too. Use native text bounds and visible paper bounds to flag cross-assembly intersections. Record intentional overlaps specifically, never blanket-ignore all images or all labels. Verify critical faces/details visually because rectangle checks cannot establish semantic clarity. Recheck the reported intervals in the encoded MP4. A clean overflow/contrast report alone does not establish readable layering.

## Stage the explanation

Read [motion staging](references/motion-staging.md) before the shot score. It defines the selective Motion FX contribution and the local `pop-motion.js` API. For each chosen staging beat, name what becomes easier to understand, the current and next composition, the persistent anchor and the spoken cue. Prefer a small set of effective changes over one effect per sentence. A still, readable composition remains valid.

Use the local helpers for overview/detail reframing, explicit ensemble rearrangement and temporary dimming of inactive context. Keep the subject's paper jitter on its inner carrier, composition motion on an outer group and captions outside the moving stage. These are available mechanisms, not required effects in every shot. No automatic zoom loop, flash, whip, blur, music or SFX. Keep Pop's materials, palette and narrative choices.

## Shared Pop asset library

Before final asset generation, read the repository's [Pop asset library workflow](../../../docs/pop-asset-library.md). Search `asset-library/pop` through `python scripts/pop-assets.py search '<subject or narrative role>'` after activating the repository runtime. Inspect shortlisted original images; choose reuse, a referenced variant or new imagery according to the storyboard, not a reuse quota. The shared library is used by all three Pop skills and does not change their separate art/story directions.

Use the helper to copy selected originals and provenance into the new project's own assets. Register useful new images with exact prompts/source rights and parent IDs for actual variants; keep registered text-safe geometry for paper pieces. After rendering, record only assets actually used and refresh the gallery. A completed or liked video is not automatic approval of every image. Preserve historical project files. If the library is unavailable in a copied skill installation, use project-local assets and retain provenance rather than pretending a search or registration succeeded.

## Produce and review

Use this skill's [production workflow](references/production.md), initializer, validator and template. Run this skill's `scripts/new-project.py` for a fresh project; then author the project's script, shot score and story.js. Retain local TTS, HyperFrames and deterministic GSAP; no Remotion or Three.js. The story reference defines image-led narration and hook/evidence checks for this skill. The neutral scaffold is not a finished visual template.

When combining the inherited entrance helper with GSAP and paper jitter, explicitly reset xPercent/yPercent to zero for absolute-coordinate movement, including entrances and split/replication tweens. Otherwise image initialization can introduce an unintended percentage offset. GSAP initialization can replace the independent CSS translate/rotate properties used by the jitter helper; restore the custom-property bindings on registered carriers after timeline initialization, then verify arbitrary seeks and consecutive rendered frames. The copied entrance helper includes the percentage reset. Call `Collage.restorePaperJitter()` after timeline initialization/pre-seek to restore its CSS bindings; inspect arbitrary seeks.

Review the opening muted and with voice, one interior causal sequence, scene joins and final encoded output. Check whether the viewer can follow what changed and why, not only whether the composition is attractive. Verify text fit, asset transparency, reverse seeks, meaningful action timing and MP4 playback. Word timing may be estimated; disclose audiovisual review limits. A successful render or one liked video does not validate the variant broadly.

Run `node .agents/skills/explainer-pop-motion-discovery-voice/scripts/audit-readability.cjs <project>` after activating the repository runtime. It scans the inherited Pop timeline at 30fps for text/text and text/paper intersections and reports conservative text/image candidates in `qa/readability.json`. It recognizes the Pop template's text classes; mark custom text with `data-readability-text`. Review every image candidate and record the specific compositional reason for any retained overlap. The helper does not inspect image alpha or understand faces; pair it with visual review, rather than treating zero text failures as an overall pass.

Make a dedicated cover with the subject and a truthful curiosity promise. Save the exact image prompts and distinguish illustration from documentary evidence. Record project findings without turning the example’s props, palette sequence or timestamps into universal requirements.

Approved visual/story baseline: [API-key image-led project](../../../projects/pop-motion/lo-api-key-github-image-led/README.md), specifically `renders/lo-api-key-github-image-led-accent-9x16.mp4`. Inspect its storyboard and `story.js` for physical picture beats and the restrained opening marker accents. Borrow the decision process, not its exact props/layouts. Motion FX contributes optional staging vocabulary; Vox contributes narration-led picture beats, without its aged-paper look or production stack. See [validation and provenance](references/validation.md) for scope and evidence.
