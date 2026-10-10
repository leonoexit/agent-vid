# Starter script

Use `storyFormat: "ribbon-example-v1"`, language, title, audience and a story brief (`question`, `example`, `takeaway`). `intro`, `scenes[]`, `outro` are shared audio/timing containers, not mandatory teaching phases. The worked example is `template/script.json`.

Each section contains title, vo, optional kicker, layout and blocks. Starter layouts are poster, workbench, outcome, rule; these are implemented examples, not the complete composition vocabulary. The editorial-window recipe in art-direction is available for project-specific native implementation and is not a fifth JSON layout already supported.

Blocks use text/note/code/result with exact text, optional label and a cue. Optional runs/titleRuns contain `{text, token}`; concatenation must equal canonical text. Token roles plain/kw/fn/str/com/var are accepted for compatibility, but their styling follows this palette, not Code Noir. `code` means a monospace surface: any displayed pseudocode or result notation must be clearly labelled as such, never passed off as executable code.

Each block uses `on` (exact narration phrase; optional positive occurrence) OR `at` (local seconds). A positive hold needs a readTask. Shared PLAN word timestamps determine reveals; without them the renderer sets `RIBBON_PREVIEW_TIMING` and estimates placement for a silent preview. Treat estimated word timings as estimates even after synthesis. Review important operations against real speech.

Optional illustration is `{src, alt, role}`. Use an existing local assets/illustrations/ path, meaningful alt text and an explanatory role. The starter introduces the image near section start; a more precise asset change belongs in project choreography. Verify the actual file, alpha and placement.

Optional model is the simple worked-example lane: input, rule, output strings plus inputOn/ruleOn/outputOn phrases. It renders native values and a short transfer marker. Cue order must be input → rule → output; this is a constraint of this lane, not of every possible story. It is not a general-purpose execution simulator. Different data structures require native project-specific diagrams instead of forcing every topic into the same three boxes.

For an arbitrary subject, write storyboard.md with spoken clause, anchor, state change and composition. Extend the project's HTML/SVG/GSAP as needed while keeping the paused HyperFrames timeline, accessibility labels and voice hooks. A schema check cannot verify factual accuracy, image usefulness, overflow or intelligibility.
