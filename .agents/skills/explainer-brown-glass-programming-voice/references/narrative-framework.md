# Brown Glass: investigate a concrete case

Explain one programming concept through one small case, adapted to the audience. Let a practical question determine the order in which evidence appears. Brown Glass uses editorial hierarchy: a large short proposition establishes the question, a code window exposes the relevant detail, unequal panels distinguish evidence and consequence, and a result gains prominence when it is inspected. These are visual resources for reasoning, not compulsory scenes.

Keep Bento's useful disciplines: connected narration, exact state, meaningful operations, phrase-to-picture cues and readable evidence. The six-stage question/setup/decode/execute/verify/rule order is no longer required for new Brown Glass scripts. A chronological trace remains useful when the viewer needs it, without a separate scene for every symbol or preliminary definition.

## Choose a route from the viewer's uncertainty

| Route | Useful progression | Example | Visual emphasis |
| --- | --- | --- | --- |
| Unexpected result | Observe a result → inspect the relevant code → reconstruct its cause → reproduce/check the result → state a bounded explanation | “Why did x change while y stayed the same?” | Large observed values; code detail takes over; reproduce the assignment; compare the values. |
| Change and impact | A concrete requested change → inspect where the work lives → apply the change → see its consequences → compare a more suitable organization | “Why does changing the invoice format touch the calculation?” | A local diff, affected responsibility, actual output, before/after comparison of the same change. |
| Similar-looking concepts | Put a useful distinction in context → try the same small situation → inspect the differing effect → decide when each fits | “print and return both give me a result?” | Matched code/input, console output versus returned value, clear destination/role labels. |

These are flexible writing options, not an enum, phase checklist or required plot. Combine, shorten or use another route when it answers the question more clearly. Do not manufacture a bug, suspense, a failed solution or a before/after improvement. Keep broad product tours, ranked lists and software advertisements outside this format.

## Write narration and evidence together

First specify `story.question`, `story.example` and `story.takeaway`. An optional `story.approach` explains the chosen route in a short free-text sentence. For each beat record the viewer's question, exact spoken clause, visible evidence before/after, operation or comparison, primary focus and the next question. Scene boundaries follow a changed reading task, not a fixed phase count.

Narrator stance: calmly inspect the case with the viewer. Use concrete verbs: read, copy, call, return, patch, rerun, compare. A useful connection is observation → relevant cause → evidence supporting that cause. Introduce notation where it becomes necessary; combine a symbol explanation with its use when that is easier to follow. Remove repeated setup and conclusions before speeding up the voice.

An outcome-first opening may show the answer immediately: “x is 20, but y is still 10.” The unresolved question is **why**. Do not withhold known evidence simply to preserve suspense. If the viewer is asked to predict an unknown result, keep that answer hidden until the operation or prediction interval completes. When replaying earlier execution, explicitly say “go back before x changed,” reset the example's native state and identify the replay. Never present a future result as the current state of that replay. Merely inspecting an earlier code line is different: preserve current values and explain that the line is being read, not executed again.

For comparisons, use the same input/task where appropriate, explain what differs and avoid presenting unlike examples as proof. For change-impact cases, show the actual patch and its effect before claiming an improvement. A native token transfer is useful only when something is actually copied/moved; don't force token travel into a conceptual distinction merely to increase motion.

## Let the reading task shape the composition

- A bare headline can establish a tension or concise finding. It should not duplicate a full spoken paragraph.
- A dominant terminal/code window lets the viewer inspect the line responsible for a result. Supporting state stays visible if needed.
- Layered/inset panels separate caller/definition, source/output, or old/new code. Depth alone is decoration; labels explain the relation.
- Matched panels compare the same attribute or distinguish roles. They need not be equal-sized when one contains more evidence.
- Enlarge a result when it becomes the evidence under inspection; retain the code or earlier state that explains it.

Read composition-grammar.md and story-motion.md for supported primitives and project-authored extensions. The reference is a set of static designs, not a supplied video timeline. Do not promise automatic camera work or layouts that the template does not implement. Generated imagery is optional: use it for a situation or referent that benefits from illustration, while exact code/data remain native.

## Review the argument, not the phase labels

Read the narration alone: is the question clear and each inference connected? Inspect the picture sequence: does the necessary evidence exist when used, and does a replay/alternative have an explicit state reset? Read both together: do operations finish with their claimed result, and does the takeaway stay within the example's language/type assumptions?

A comparison or code-reading interval can be deliberately still. Name what the viewer should compare/read; don't replace evidence with a long sequence of headings, pulses or captions. Keep custom-operation audits and truthful classification, but treat gap/shot-count warnings as review aids rather than quotas. The validator checks brief, cues, geometry and native actions; it cannot establish factual accuracy or explanatory quality.
