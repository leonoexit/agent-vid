# Script and storyboard

The executable example is `template/script.json`. Use `storyFormat: "ink-reasoning-v1"`, language `vi`, `en` or `mixed`, a title, audience text and a story brief with question/example/takeaway. The example field describes concrete evidence; this skill does not require a step-by-step simulation.

`intro`, `scenes[]`, `outro` are voice/timing containers, not mandatory pedagogical phases. Each contains:
- `layout`: statement, comparison, example, illustration or rule (freely selected).
- `title`, `vo`: nonempty screen heading and narration; optional `kicker`.
- `blocks`: 1–4 reading units. Shorten or split a crowded page; the limit does not certify fit.
- optional `hold` (0–6 s) with `readTask` explaining the reading/prediction purpose.

A block's `type` is text, note, code, result or image. Text blocks have `text`, optional `label`, and optional `emphasis: "red"` or `"yellow"`. A label belongs to its content and appears with it. Image blocks have `src` under `assets/illustrations/`, meaningful `alt`, and an optional short `text` caption. Use at most one main image per page as a design default. Code is literal text, never HTML or an image.

Every block has either `on` (an exact spoken phrase, optional positive `occurrence`) or `at` (local seconds from section start). Prefer phrases for narration. The template resolves them against `PLAN.sections[].words`; without words it estimates for preview and sets `window.INK_PREVIEW_TIMING=true`. Never call estimated placement final alignment. `at` is for measured or deliberately opening content; verify it after voice changes. Keep enough reading time after reveal; the runtime's .6-second minimum is only a technical floor.

The storyboard also records the viewer's question, why each piece of evidence matters, narration-to-picture cues and each illustration's role. Do not add fake entities, tiles or setup/decode/execute/verify phases merely to satisfy the Bento validator. This skill has its own validator.

Custom layouts or emphasis can be authored in the project's native HTML/CSS/GSAP, preserving the paused HyperFrames timeline. Extend the corresponding project validation when needed. The starter is not an exhaustive diagram system.
