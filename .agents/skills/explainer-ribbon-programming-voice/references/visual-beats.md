# Design a sequence of visible reasoning

## The unit is a thought, not a page

Break the narration into meaningful clauses: a setup, action, consequence, distinction or test. A beat should let the viewer see a new fact, inspect a relevant detail, compare evidence, or deliberately read/predict. It does not need a new shot or physical movement. Captions, a title entrance, a background wipe and an idle floating illustration do not by themselves count as advancing the explanation.

For each beat record the spoken cue, visible before/after, the subject at phone scale, chosen view and what remains on screen during the rest of the clause. Use `template/storyboard.md` as a starting format, replacing its example for the requested topic. Add exact times after TTS/sync; guessed timestamps should remain labelled estimates.

Preserve the identity of the example, not necessarily its position or scale. Overview establishes relationships; a close view exposes the operation; a result or comparison proves what it did. These are choices, not a required three-shot cycle. Keep both endpoints visible during a transfer when the relationship is the lesson. Show a relationship before cropping away the orientation cues. A short persistent diagram can be ideal; a long persistent diagram needs changes of emphasis or evidence that a phone viewer can actually perceive.

## Resolve an action that finishes too early

Ask what the remaining narration adds:
- **A consequence:** enlarge or isolate the result and its relevant context.
- **A distinction:** compare the changed state with the state that stayed unchanged.
- **A mechanism:** reveal an intermediate step only if it exists in the actual model; do not invent activity to fill time.
- **A reading/prediction task:** hold the evidence still for that task.
- **A repetition of what is already obvious:** shorten/merge the wording, then regenerate voice and timing.

Do not stretch a one-second transfer to cover an entire paragraph, accelerate the narrator to hide poor staging, or force an animation every few seconds. Local reveals can progressively establish a state, but simply adding another caption-like note is weak when the visual example itself can provide the evidence. Highlight only what the voice is explaining; repeated random highlighting is also decoration.

## Composition decisions that matter

- Give the changing value/object enough screen area to be identifiable at phone size. If a counter is the proof, a tiny badge in a large dashboard is insufficient.
- De-emphasize irrelevant regions without hiding evidence needed to understand the action. Use layout, crop, scale, grouping or contrast; camera travel is optional.
- Carry a recognizable filename, token, identity color or silhouette when recomposing. Avoid showing unrelated new art just for variety.
- Use a dominant word/result in Ribbon's editorial style when it sharpens the point. Move back to precise code/data when the voice explains why.
- Whole generated plates are appropriate for stable beats. If the explanation needs an internal change, arrange native evidence or separate generated parts before production.

## Example: why the Git trial feels static

Observed in `projects/ribbon-story/git-lenh-hang-ngay/`: a shared GitHub/machine stage runs from about 27.2s to 145.6s of a 163.8s video. The `git add` section lasts about 16.4s; its main transfer takes 1s at about 76.3s. These are findings about this trial, not universal timing limits. The issue is the small change plus long unchanged composition, not use of gen-img or a ban on persistent diagrams.

A stronger clause plan for that section could be:

| Spoken idea | Visible evidence / focus | What survives the cut |
|---|---|---|
| Select this change with `git add` | Establish the edited line and staging destination; show the actual command near them | Same filename and changed line |
| The selected change is prepared | Show the selected content represented in staging; keep the working file visible so the metaphor does not imply deletion | Same change identity |
| `git status` now reports it as staged | Put the relevant output beside the staged content; align the two descriptions | Staged content and filename |
| No new commit was created yet | Compare the staging selection with the unchanged history count, making that count legible | Existing history and staged selection |

This is a storyboard proposal, not a correction already applied to that video. A box is a metaphor; no claim that staging literally removes a file or that Git objects behave like physical storage. Topic semantics must remain verified in production.

## Review the content, then the final encode

Use project `visual-review.md` to record actual intervals and decisions; do not pre-mark it passed. Before final render, scrub each operation before/during/after and inspect at a phone-sized preview. Run two complementary passes: briefly ignore captions/ambient motion to see whether the explanatory visual advances, then check the complete frame with captions and voice to see whether it remains connected.

Inspect the longest spans with no new explanatory evidence or focus. Record their start/end, what the narration says, what the viewer can learn from the held image, and either a justified keep or a specific revision. Review holds even if ribbons, cursor blinks or karaoke are moving. A legitimate hold can last longer than an unhelpful one; there is no static-duration quota, required camera count, scene count or animation-density score.

Resolve intervals where the voice makes a new important claim but the picture has already finished and neither demonstrates nor directs attention to that claim. A completed action followed by explanation of its visible consequence can pass; motion is not required for the sake of motion. If the entire sequence feels repetitive despite clause-level reveals, re-evaluate composition and scope. For broad requested topics, organize a coherent worked journey and remove redundant setup; do not silently omit requested coverage or multiply tiny disconnected lessons.

After render, inspect these same intervals and important cue boundaries in the encoded MP4. Technical lint, contrast checks and a grid of attractive stills cannot certify pacing. Document what was actually watched/listened to and any limits. Do not use claims of “all checks passed” to replace the interval review. Preserve historical outputs; create a new version when revising an existing project.
