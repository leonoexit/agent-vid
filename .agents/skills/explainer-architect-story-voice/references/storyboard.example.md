# Assignment: production starter score

12 shots (intro + 10 core + recap); estimate the duration, then fit the real narration. Examples are native
choreography starters, not finished production assets. Both language JSON files follow this score.

| Shot | Discovery | Native reveal / motion | Result retained |
| --- | --- | --- | --- |
| Hook | Will both variables change? | Cue x, y and the question separately | Answer hidden |
| 1 | Meet x | Card, then identifying subtitle | x label; number hidden |
| 2 | Initial value | Declaration → reveal 10 → detail | x = 10 |
| 3 | Meet y | Card → separate identity → dash explanation | y not assigned on screen |
| 4 | Read the instruction | Deferred second code line → source spotlight | int y = x; |
| 5 | Read the source | Source focus → current-value text → read meaning | x = 10 |
| 6 | Copy to destination | Token travels → commit → result sentence | y = 10 |
| 7 | Source survives | Source spotlight → comparison → both focus | x = 10, y = 10 |
| 8 | Update x | Deferred third line → write token → replacement explanation | x = 20 |
| 9 | Inspect y | y spotlight → value text → highlight update | y = 10 |
| 10 | Assignment happens once | Earlier-line highlight → no rerun → implication | State stays x=20, y=10 |
| Recap | Generalize | Cue outcome tiles and explanation separately | Independent integers |

For production, expand each row with the exact vo phrase and its resolved cue time. Do not count the heading
entrance, karaoke or decorative bounce as sufficient choreography. If a shot feels repetitive, combine it with its
neighbor while retaining the staged beats; do not pad speech to keep twelve shots.

## Phase mapping

Question: intro. Setup: shots 1–3. Decode: 4–5. Execute: 6–8. Verify: 9–10. Rule: outro.
The JSON examples carry the same phase fields. Expand each score row with visible-before, spoken clause, visible-after
and the next question; phase tags alone do not prove a causal explanation.

## Composition and media choices before production

The sample JSON exercises the trace API; it does not implement the full reference's design vocabulary.
Use composition-grammar.md to sketch the overview, code detail, transfer and comparison views before rendering.
Preserve x/y names and values while giving the currently explained part sufficient area. Merge text-only shots
when they repeat the same evidence. Do not keep twelve shots just because the fixture has twelve sections.

For this assignment example, native values, arrows and code are sufficient; no generated images are planned.
Use a coherent local icon only if it helps identify a role. A request for illustration would require a separate
specific purpose and brief, not automatically a document-copy metaphor.

## Native motion study (v0.2)
The included editorial-study.html is a separate 18s silent implementation exercise. At 4.5–5.7s copyValue moves 10 from x to y and commits on arrival; x remains 10. At 9s writeValue changes x to 20; y remains 10. At 12–13.2s resultToEvidence reframes the observed result. At 14–18s read the two final values and the bounded integer-assignment rule. The abstract CSS backdrop can be disabled without changing model state or layout. Generated backgrounds, when used, take this same subordinate layer.
