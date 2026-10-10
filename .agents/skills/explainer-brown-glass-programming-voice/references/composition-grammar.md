# Compose relationships, then animate the operation

Use ref-index.md for exact source slides. Read this before writing the score. These are spatial recipes inside
one concrete case; choose them to fit the reading task rather than a six-stage narrative or a numbered list format.
The selection question is: what relationship does the viewer need to inspect now?

| Relationship / source | Portrait layout | Meaningful start → action → end | Available implementation |
| --- | --- | --- | --- |
| Question + initial evidence / 01, alt | Bare 2-line heading above two unequal evidence zones | Objects introduced in speech order; an observed result may lead; prediction answers withheld | Scaffold hero pair; asymmetric layout in study via `.noir-split` |
| Owner + code detail / 06,09 | Dominant terminal, small supporting state card or ledger below | Reveal instruction → isolate source symbol → read actual field | `.noir-terminal`, stock `code`/lineCues/code-focus; project-authored composition |
| State A → state B / 04,07 | Unequal panels with clear travel corridor, preferably vertical for long labels | Source stays → token crosses → destination commits | Stock transfer/write; complex endpoint DOM requires extension |
| Two roles / 08,10,12 | Pair with small colored top edges and short role labels | Identify roles → operate on selected object → compare result | `.noir-pair`, `.noir-role-card`, stable entities; no general grouping API |
| Ordered execution / 11,14 | Three rows with number circles and one active edge | Select row → execute actual value change → move active marker | `.noir-rail`/step CSS; state/timing/path authored in project JS |
| Verification / 15,17 | Large result plus smaller expected/observed proof | Reveal observed state → test/check → attach supported conclusion | `.noir-stat`, split/evidence + native text; no automatic test runner |
| Question clarified / 16 | Stacked panel with projecting question badge; native evidence below question | Ask → show evidence → expose one answer, not a paragraph upfront | `.noir-question`, stack/evidence; project reveal cues |
| Rule / 05,18 | Large concise takeaway, small retained example outcomes | Reuse previous objects → summarize operation → state boundary | Scaffold outro pair; centered/icon variant requires extension |

The executable examples in [editorial-motion.md](editorial-motion.md) demonstrate how to change reading priority
within these relationships. `yieldTitle`, `focusWindow` and `resultToEvidence` are opt-in geometry helpers;
code-body reveals, owner changes and commits remain explicit project operations.

## Decision record before layout

For each major beat, fill these fields in the project storyboard:

- **Relation:** concrete ownership / peer comparison / dependency / execution order / change impact / evidence.
- **Viewer task:** what must be located, tracked or compared at this moment?
- **Hierarchy:** primary evidence, supporting state, persistent context. Assign area by reading load and importance.
- **Geometry:** container meanings, alignment, start/end rectangles, route corridor and any retained anchor.
- **Reading path:** where attention starts, the native action it follows, and where its result is inspected.
- **Source evidence:** slide(s), what is visibly there, what function you infer, what you adapt or deliberately omit.
- **Motion:** start state, operation/commit, end state; identity/state that survives; hidden future facts.
- **Why this composition:** how another obvious arrangement would obscure this particular relation.

The recipe table above is a toolbox, not a finite pattern taxonomy. Narrative stage does not choose composition.
One explanation can require a detail, regrouping, route and comparison; a useful grouping can persist across
several beats. Do not target a fixed number of compositions.

`template/compositions.css` implements CSS primitives, not JSON modes. The original six static assignment studies
were phase-based samples and mainly test surface/typography. They are retained as examples, not comprehensive
reference extraction or evidence of a successful full video. Production needs the relation-led design record.

## Assess the sequence before polishing

Sketch the model with captions/headings hidden. Compare adjacent keyframes: did ownership, route, scale of evidence,
execution cursor or inspected result actually change? A new title, panel color or entrance alone does not count.
Repeated geometry is good when it supports comparing the same fields; change it when the viewer's task changes.
Track visual density (sparse question, evidence detail, active transformation, settled verification), without imposing
an alternation quota. Explain empty space as a grouping gap or motion corridor. Remove repeated introductions.

## Native transformation contract

For every project-authored operation, record element ID, start state/rect, end state/rect, source cue, duration,
commit point and next focus. Keep the same object label/value and identity accent through the reframe. Changing
which region is large does not mean recreating data. Token destination geometry must use the new bounds. Freeze
rotation for reading unfamiliar code; a 2° stack establishes layers, not continuous idle motion.

Example integer assignment score:
- Setup: terracotta `x`, readable 10; violet `y`, dash indicates “not assigned in this illustration”.
- Decode: terminal shows `int y = x;` only at its spoken cue. Highlight RHS x; do not reveal y's result yet.
- Execute: source token 10 copies to y, commits on arrival; source x remains 10. Reframe to show the result.
- Update: `x = 20;` writes only x; y keeps 10 and its violet identity. A pipeline active marker is secondary evidence.
- Verify: enlarge the **20 / 10** comparison; show which instruction changed x and why assignment did not rerun.
- Rule: retain both values while stating that this integer assignment copied the value at that moment.

Never imply that all assignment in every language behaves like independent primitive integers. The rule's boundary
belongs beside the example. A numbered source rail is not proof of execution; actual code/value changes provide it.

## Spatial safeguards

The inherited fixture uses x=72…1008 and captions y=1664…1814. A custom renderer defines its own
consistent safe area (the SRP series uses x=64…1016 and captions y=1730…1846); do not mix coordinate systems. Reflow 7/5 or 8/4 proportions into bands if two columns
would force tiny code. Limit rows/lines to what the narration currently covers. Leave room around question badges,
terminal shadows, travel corridors and Vietnamese accents. A nested white mock needs `.noir-surface-light` and
explicit child foregrounds. Don't fade inactive values below readability when the current explanation compares them.

Use static atmosphere; a glowing rail can indicate selection but is not a data operation. Native icons identify
roles and are optional. Neither photo portraits, abstract 3D backgrounds nor repeated mascots are required.
