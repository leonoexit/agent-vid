# Audience-led Apple storytelling

The user supplies a programming topic and an audience. Infer reasonable knowledge assumptions from that audience, record them with the storyboard, and choose the example accordingly. Topic scope stays one coherent concept; sophistication can change. A novice may need a value introduced before its syntax, while a developer may need the surprising case, boundary or tradeoff immediately. Do not make the user design the example, scenes or visual metaphors.

The working progression is situation → action → visible change → consequence → rule, when useful. These are causal relationships, not five required phases, scene types or fixed slots. Merge, repeat or reorder explanatory beats where the example calls for it. A worked question can begin at a surprising result and then trace its cause. Keep enough evidence to support the conclusion.

A shot has one dominant subject or relationship. Attach each spoken clause to what the audience can currently see. Introduce notation at the moment it becomes useful rather than in a compulsory decode scene. Let an operation produce a state, explain that consequence while it remains visible, then carry it into the next action/context. Only show the relevant code when it clarifies the behavior.

Typography, material, scale and negative space affect pacing. A large isolated asset invites attention to one action; an overview helps compare; an input scene establishes a value; an outcome scene demonstrates a consequence. Design those compositions with the script. Changing a heading on the same page repeatedly is not an action-led story. Additional camera travel is not required.

Use `storyFormat: "apple-action-v1"`, `audience` as nonempty text, and a `story` brief containing `question`, `example`, `takeaway`. `intro`, `scenes`, `outro` remain technical containers for voice and export. They are not a six-phase narrative contract. A scene's optional `phase` is any meaningful editorial label, with no mandated vocabulary, count per label or ordering. Keep the existing technical event/entity schema when using the shared scaffold.

Run this skill's `scripts/validate-script.py`, not the Bento narrative validator directly. The Apple wrapper checks its own format/audience/brief and reuses Bento's technical data/event checks on an in-memory copy without the Bento story-format marker. It does not rewrite the project or weaken Bento's own contract. Render-specific restrictions of the shared scaffold still apply; author project-specific native extensions when genuinely needed rather than claiming every diagram is supported automatically.

Review the finished story for audience fit, connected cause and effect, truthful result timing and whether the conclusion follows from the example. A format validator cannot certify any of those qualities. No new video is required merely to configure the short invocation.

## Clause-led staging with the existing Apple kit

Use the project storyboard to record:

| Spoken clause / actual cue after sync | Visible before → change → result | Dominant asset and view | What remains visible while the consequence is explained |
|---|---|---|---|

Choose the view from the evidence. An overview establishes relationships; a detail exposes an operation; a comparison shows its consequence. These are options, not a mandatory camera sequence. Keep identities consistent while changing scale, grouping or emphasis. Prefer a better arrangement or larger subject before adding camera motion. Use the current HTML/CSS/SVG assets and GSAP helpers; generated art remains available when it materially improves a specific subject.

Example: for “a new save point appears,” first establish the history, then give the new node and its label enough space to read as they appear. For “the earlier version is still there,” direct attention to the earlier node and the retained state. A short side-by-side comparison may explain this better than more travel. Do not leave both clauses on a distant rail while only the subtitles change. This is a staging example, not an assertion that the helper automatically implements version history semantics.

If an operation ends early, ask whether the rest of the narration explains a visible result, makes a comparison, or repeats the obvious. Keep the result for the first, compose evidence for the second, shorten the third. Do not fill a gap with perpetual float or stretch a small movement to the length of a paragraph. Stillness is useful for reading, comparison and explanation of a clearly visible consequence.
