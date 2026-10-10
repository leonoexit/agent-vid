---
name: explainer-apple-slim-programming-voice
description: >
  Experimental Apple Slim: make a complete narrated vertical programming explainer with Apple-inspired sculpted materials and a matching cover, while choosing the story, assets, compositions and choreography freely for the topic. Use for Apple Slim or a requested lean-instruction trial. Retains the existing local TTS/HyperFrames production path.
metadata:
  version: "0.1.0"
---

# Apple Slim

Explain one programming/computing concept for the requested audience. A topic and audience are enough; default to curious beginners. Deliver a complete 1080×1920/30fps video and matching Facebook video-cover PNG/JPG with editable HTML. Vietnamese voice: Hải Đăng, normal speed. No music or SFX unless requested. Preserve the stable Apple skill and historical projects.

## Direct the film

Find the question the viewer actually has. Choose a small example that makes the answer visible; use a real, reproducible result when practical. Resolve the core explanation before decorating it. Do not invent a problem just because it is easy to animate. Verify claims and keep a source map.

Write a short shot plan with the spoken idea, what changes on screen and what the viewer now understands. Choose the number and length of shots from that explanation. No mandatory six-phase sequence, fixed title/diagram slots, universal camera recipe, repeated card layout, or required asset count. Technical voice sections are not mandatory visual cuts.

Make the opening subject and reason to watch clear without post context. Build evidence during the narration, preserve identities when following an object and hold meaningful results long enough to read. Let a new view reveal something; avoid motion that only fills time. Shorten wording before speeding up speech. Keep exact code/data native and correct.

## Apple visual identity

Use expressive large sans-serif type, off-white or carefully chosen dark fields, generous negative space, sculpted objects, convincing soft shadows and directional light. Coral/magenta, blue/cyan/violet and mint/teal are available accents; assign colors according to the actual topic. The result should feel deliberately staged and tactile. A pale dashboard with rounded cards is insufficient.

Choose or make assets for this film. The sibling Apple skill's `assets/apple-assets.css`, `assets/apple-story.js`, local fonts and visual kit are optional resources, not a scene template or checklist. Read its [art direction](../explainer-apple-programming-voice/references/art-direction.md) or inspect its reference images only when needed to resolve style. Generated art is welcome where it improves the explanation; use the imagegen skill then. Do not add Remotion, Three.js or a renderer comparison.

## Produce with existing tools

From the repository root, `source scripts/activate.sh`. Author a fresh project and its HTML/CSS/SVG/GSAP visual layer; no new engine is needed. Use the sibling Bento skill's `scripts/tts.py` and `scripts/sync-narration.py --no-bgm` for narration and timing. Read Apple's [production reference](../explainer-apple-programming-voice/references/production.md) for the technical script/audio contract, not creative structure. Use `storyFormat: apple-action-v1`; validate through Apple's script validator. Timestamps supplied by the local voice pipeline may be estimated; inspect important spoken-action landmarks.

Keep a paused deterministic timeline in `window.__timelines`, local fonts/images, stable captions, audio markers and correct composition dimensions/duration. Run HyperFrames lint/check, inspect settled frames and mid-transitions, then render the full MP4. Check exact semantic states, text collisions, direction of actions, encoded frames, audio and file playback. Technical success is not proof of a compelling explanation. Disclose review limits.

Make a dedicated cover from this film's strongest subject and clear question, not an arbitrary transition frame. Apple's [cover exporter](../explainer-apple-programming-voice/scripts/export-cover.cjs) can export portrait and crop previews from editable HTML. Inspect it at phone size. Deliver video and cover; do not publish them.

This trial borrows Brag Slim's concise creative brief and room for project-specific decisions, not its product-ad format, soundtrack requirement, duration or tool routing. [Reference](https://github.com/latent-spaces/brag/blob/main/skills/brag-slim/SKILL.md). First test: `projects/apple-slim/doi-duoi-file/`; record results there rather than adding rules for every local implementation choice.
