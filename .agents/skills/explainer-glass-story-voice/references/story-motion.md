# Make the operation visible

Plan in states, not slides: what exists, what is known, what action happens, what changes, and what stays fixed.
Use a stable visual identity to reduce the viewer's memory burden. Build explanatory metaphors with native
HTML/CSS/SVG. A native metaphor can transform into technical notation on screen: the same container becomes a variable, the same address ticket becomes a pointer. Explain the limits of
that metaphor; a symbolic address in the illustration is not a literal C address or extra copied data.

Generated art is a separate secondary layer: decoration, background or contextual figure. Its fade/move does not
stand in for a program operation. Keep changing state, causal arrows and data transfers in the native model; do not
morph an AI image into an exact memory container or target its pictured interior. Design the trace to remain clear
with that secondary layer hidden. A small gen-img sticker is permitted as an ornamental layer, but it must have no
text, code, number, arrow, label, UI or data-bearing interior. Keep it outside the primary model's reading path and
never use it as the only cue for a technical state.

| Explanatory job | Motion vocabulary |
| --- | --- |
| Introduce a real object | `show`, then `open` when a hidden content matters |
| Establish a relationship | `focus`, then `connect` in the real direction |
| Move/copy information | `transfer`: visible token from the source field to the destination |
| Change data at a location | `write`: operation token arrives and commits the new value there |
| Bridge analogy to notation | `morph`: preserve identity/position, relabel and settle the shape |
| Reorganize one model | `move`: preserve the object while changing its location |
| Direct the eye | `spotlight`: dim unrelated entities; `focus`: outline the local target |
| Mark a commit/result | `pulse`: briefly scale the changed native entity after the operation |
| Show an instruction and its consequence | `code` and a matched transfer/write, hold the result |

A transfer commits the displayed destination value after arrival; it does not automatically remove source data.
For a physical conserved quantity, explicitly update both quantities and account for the item in transit. For a
read/copy, retain the source value. For an update through a pointer, keep the stored address unchanged. Do not add
arrows that imply causality or movement absent from the explanation.

Anchor actions to actual phrases in `vo`; punctuation/capitalization are ignored, accents retained. Use an
unambiguous phrase/occurrence. Put actions in narration order. A token needs roughly 0.8–1.3 seconds to traverse the
stage. Leave the result visible during the explanation that follows. A title can fade while the underlying model remains.
At the start of each scene, establish one primary focus; during the middle beat, perform one operation; during the
last beat, pulse or otherwise emphasize the committed result. Avoid several simultaneous operations until the
relationship is already familiar. Physical travel of a data token is a visual metaphor, not hardware timing.

## Attention pass

Before rendering, annotate each scene in `storyboard.md` with:

- `primary`: the one entity or relation the viewer should watch;
- `operation`: the one visible change and the phrase that triggers it;
- `settle`: the final state that remains while the narration explains the consequence;
- `decoration`: sticker IDs or ornaments, if any, kept outside the model's visual path.

Use zero to two stickers per scene. A sticker may fade, drift or gently rotate, but it must not pulse, receive a
causal connection, sit under a moving token, or overlap code/captions/takeaways. If the primary action is not obvious
in a contact-sheet frame without listening to the audio, simplify the decoration and strengthen the native staging.

Keep paragraphs connected; blank lines add the configured 0.2s pause. Default `hold` is zero. Read the result during
speech; if a prediction needs a quiet moment, explain its job in storyboard.md and keep it brief. See pacing.md.
Never reveal a prediction answer before its thinking interval ends. Show precise code only once its
objects are familiar. In C, distinguish `*` in a pointer declaration from `*p` used as a dereference expression.

Before delivery, inspect an action's start/middle/end and seek back across its state change. Verify source values,
destination values, labels and code agree. If an asset, diagram or chart needs a richer representation, extend the
project instead of squeezing it into the default small-card layout.
