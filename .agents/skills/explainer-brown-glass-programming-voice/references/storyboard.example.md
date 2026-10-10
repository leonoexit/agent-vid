# Brown Glass case storyboard — why did y stay at 10?

This is the startup fixture, not a prescribed scene count or universal layout. It demonstrates an observed-result opening, explicit replay, and native evidence. Adapt composition to each reading task using composition-grammar.md; the two-card template only supplies working state/motion primitives.

Audience: beginners who know variables and integers. Language: Vietnamese (English fixture mirrors the same case). Scope: two ordinary C integer variables; do not generalize the rule to reference aliasing.

Question: after `int x = 10; int y = x; x = 20;`, why is y still 10?

| Beat | Spoken reasoning | Visible evidence and staging | Connection |
|---|---|---|---|
| Observed result | A run ended at x=20, y=10. Why? | Reveal the two result tiles on their spoken numbers. Mark this as a completed run. | The result creates a specific causal question; it is not a prediction answer being spoiled. |
| Replay the assignment | Go back before x changed. Create x=10, declare y from x. | Enter replay with native x=10 and y=—; show/reveal nodes and the two code lines on spoken clauses. The dash is an illustration placeholder, not a C value. | The explicit time change prevents the reset from looking like an unexplained mutation. |
| Read, then copy | The line reads the current ten and copies it to y. | Focus source, transfer a copy, commit y=10 on arrival, then focus both. Keep x=10 visible. | Read the resulting equality while explaining that copying did not remove x's value. |
| Only x changes | The next line writes 20 to x. y keeps the earlier copy. | Add and focus `x = 20;`, write 20 to x, compare x=20/y=10 after arrival. | Reproduce the observed result with an explicit cause. |
| Inspect the earlier line | The y declaration already ran; changing x does not run it again. | Focus the earlier code line while preserving final values. This is inspection, not execution: no transfer or value reset. | Explain the missing causal link, not merely repeat the numbers. |
| Rule | Assignment copies a value when it runs, for these integer variables. | Brief result comparison and scoped takeaway. | Answer the opening question without introducing another concept. |

## Production review

- Record each clause's state before/after, focal target, action, and result-reading window in the project storyboard.
- Use actual synthesized word timing before judging transfer/write duration. Complete movement before narration claims its result.
- Retain a still view while the viewer reads relevant evidence; shorten or restage stretches with no reading or reasoning purpose. Do not add arbitrary camera motion to satisfy a beat quota.
- The fixture demonstrates one route. For a refactor, organize around a concrete requested change and its impact; for a comparison, hold input/task constant and show the different effects. Do not force an unexpected-result hook onto either.
- Run schema, cue, pacing and motion checks. A valid JSON fixture is not evidence that a final narrated video has been visually reviewed.
