# Direct the passage, not just its entrance

Before generating, fill the compact shot score in the scaffold's `storyboard.md`. A shot is a visual passage; it need not match a TTS section. Describe how the composition starts, develops during the spoken clause, and hands attention onward. Then specify the independent layers needed to perform it. Carry the explanatory transformation chosen in narrative.md through the passage: its landing should reveal a relationship, not just finish a movement. Paper labels move with their lettering and shadow as one piece; settle a placed label close to the receiving surface rather than leaving it perpetually hovering.

Keep two kinds of change distinct:

- **Model action:** an operation changes the program state. Its result commits at the correct point; a transfer proxy is not an extra stored value.
- **Presentation action:** bring evidence closer, part overlapping pieces, pivot an attached cluster, carry a result into a comparison, or reorganize layers around the consequence. This changes what is prominent without falsifying the model.

Use this freedom inside a passage. Preserving identity does not require parking objects at fixed coordinates. Hold briefly on a newly arrived result so it can be read, then let that result motivate the next arrangement. Avoid repetitive float/wobble, constant zoom and movement with no attention target.

## Example of a developed passage (a directing proposal, not a tested clip)

For “Gán y bằng x, ta sao chép giá trị. Đổi x thành chín, y vẫn là bốn”:

| Spoken beat | Visual development | Semantic constraint |
| --- | --- | --- |
| Assign y from x | Start close on x=4; make room for y; a separate copy travels to it and lands as 4. | x retains 4; y commits once, at arrival. |
| Change x to 9 | Bring the pair into a clear side-by-side comparison while replacing x's value. | Only x changes; presentation does not imply assignment to y. |
| y remains 4 | Move emphasis toward y, keeping changed x visible as context; reveal the equality/difference evidence and land. | Viewers can inspect both current values. |
| Consequence | Carry this comparison into the concluding statement instead of replacing it with a summary poster. | Keep the evidence attached to the claim. |

This is appropriate for copied primitive values, not a general claim about references/objects. Select generated finite variants or native numerals based on the shot's art direction; motion logic is independent of that choice.

## Make the action carry the explanation

For a sustained passage, identify the dominant object at its start and end, the relationship made visible between them, and which spoken clause motivates that change. Decide these before choosing animation helpers. A repeated entrance preset cannot stand in for selecting, extracting, measuring, correcting or comparing.

Review the main evidence after mentally removing captions, title changes and decorative entrances. If it stays parked while several explanatory clauses pass, decide whether viewers are performing a necessary reading task or whether the passage needs a shorter line or a developed action. Reframe around the operation, bring a relevant detail forward, or carry a result into the next comparison when that makes the mechanism clearer. Do not add arbitrary movement to meet an animation quota. Preserve order and state, not fixed screen coordinates.

## Stage the order of understanding

For every explanatory beat, decide what viewers should know before, during and after it. Apply this throughout the video, including inside a continuous scene:

- **Before:** show enough context to understand the next operation. Hold back details or outcomes whose early appearance would compete with that operation, expose a result prematurely or imply it has already happened.
- **During:** coordinate the relevant reveal, selection, movement or state change with the spoken clause. Give viewers time to locate the subject before manipulating it; land the evidence when the narration needs it. A reveal that arrives after its explanation can be as confusing as one that arrives too early.
- **After:** retain the evidence needed for the next inference. Reduce or remove completed information when it competes for attention; preserve enough continuity to follow the same example.

This is information staging, not a requirement to animate every noun or hide everything until its exact spoken word. An entire list may need to be visible before selecting an item; the selection result still follows the operation. Existing objects can change emphasis or state without exiting and re-entering. Simultaneous visibility is appropriate when it enables a comparison or an intentional reading task.

## Rhythm and handoffs

Time important action landmarks to actual spoken phrases; give travel enough duration to read, and land the result when the voice names it. If the sentence allows no room, edit it or simplify the action. Do not squeeze all meaningful motion into the opening second and let the remaining narration explain a finished still.

Roughly three seconds without new evidence or a new visual relationship is a useful inspection trigger, not an automatic failure or a mandatory animation interval. Identify the longest holds, listen to those clauses and decide: valid reading/comparison, redundant words to cut, or a missed opportunity to develop the staging. Caption changes, fading labels and a page slide alone do not demonstrate this development.

Read [transitions](transitions.md) for joins. `choreography.js` provides `place`, `uncover`, `draw`, `reframe` and `push`; these are primitives, not a director. Use wrapper transforms for a subject and attached label. Keep captions outside moving/reframed groups. Prebuild states on a seekable GSAP timeline; avoid timers and callback-created DOM.
