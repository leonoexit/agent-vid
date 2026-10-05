# Audience-led Apple storytelling

The user supplies a programming topic and an audience. Infer reasonable knowledge assumptions from that audience, record them with the storyboard, and choose the example accordingly. Topic scope stays one coherent concept; sophistication can change. A novice may need a value introduced before its syntax, while a developer may need the surprising case, boundary or tradeoff immediately. Do not make the user design the example, scenes or visual metaphors.

The working progression is situation → action → visible change → consequence → rule, when useful. These are causal relationships, not five required phases, scene types or fixed slots. Merge, repeat or reorder explanatory beats where the example calls for it. A worked question can begin at a surprising result and then trace its cause. Keep enough evidence to support the conclusion.

A shot has one dominant subject or relationship. Attach each spoken clause to what the audience can currently see. Introduce notation at the moment it becomes useful rather than in a compulsory decode scene. Let an operation produce a state, explain that consequence while it remains visible, then carry it into the next action/context. Only show the relevant code when it clarifies the behavior.

Typography, material, scale and negative space affect pacing. A large isolated asset invites attention to one action; an overview helps compare; an input scene establishes a value; an outcome scene demonstrates a consequence. Design those compositions with the script. Changing a heading on the same page repeatedly is not an action-led story. Additional camera travel is not required.

Use `storyFormat: "apple-action-v1"`, `audience` as nonempty text, and a `story` brief containing `question`, `example`, `takeaway`. `intro`, `scenes`, `outro` remain technical containers for voice and export. They are not a six-phase narrative contract. A scene's optional `phase` is any meaningful editorial label, with no mandated vocabulary, count per label or ordering. Keep the existing technical event/entity schema when using the shared scaffold.

Run this skill's `scripts/validate-script.py`, not the Bento narrative validator directly. The Apple wrapper checks its own format/audience/brief and reuses Bento's technical data/event checks on an in-memory copy without the Bento story-format marker. It does not rewrite the project or weaken Bento's own contract. Render-specific restrictions of the shared scaffold still apply; author project-specific native extensions when genuinely needed rather than claiming every diagram is supported automatically.

Review the finished story for audience fit, connected cause and effect, truthful result timing and whether the conclusion follows from the example. A format validator cannot certify any of those qualities. No new video is required merely to configure the short invocation.
