# Native script format

Use `template/script.json` as the executable example. Set `storyFormat: "code-noir-v1"`, a language (`vi`, `en`, `mixed`), title, audience text and a story brief (`question`, `example`, `takeaway`). Replace the example with the requested subject; do not relabel its Python content.

`intro`, `scenes[]`, `outro` are timing containers, not mandated story phases. Each contains:
- `layout`: claim, code-output, comparison, verdict or rule.
- `title`, `vo`: screen heading and connected narration; optional `kicker`.
- `blocks`: 1–4 readable units of type text, note, code or result. A block has exact `text`, optional `label`, and optional `emphasis` (kw/fn/str/com/var).
- Optional `hold` of 0–6 seconds paired with `readTask` naming its reading/prediction purpose.

Use literal newlines/indentation for code. Optional `runs` on a block or `titleRuns` on a heading is an array of `{text, token}`. Token is plain, kw, fn, str, com or var. Concatenating the run text must reproduce the exact canonical `text` or `title`, including spaces and newlines. The validator checks this to prevent code corruption during styling. The renderer uses textContent, not HTML interpolation.

Every block declares either `on` (an exact phrase from its section narration, with optional positive `occurrence`) or `at` (local seconds). Prefer phrase anchors for voice. Timing comes from shared PLAN word timestamps. If none exist, preview placement is estimated and `window.CODE_NOIR_PREVIEW_TIMING` is true; do not describe that as verified alignment. The .6-second runtime check after each reveal is only a technical minimum, not sufficient reading time for a whole snippet.

No entities, fake tile pairs or ordered setup/decode/execute/verify phases are required. Use this skill's validator, not Bento's. For project-specific custom native visuals, extend the local layout/validation intentionally while preserving deterministic seeking and the voice timeline.
