# Composition is part of the explanation

Read this before storyboarding. The reference is a static carousel: its spatial hierarchy can be extracted;
its animation cannot. Motion below is our adaptation, not behavior found in the HTML.

## Evidence from all six sources

A fresh structural pass over think1–think6 finds 67 slides, 82 Font Awesome `<i>` elements, and zero `<img>`
elements. There are also emoji and CSS geometry. This does not ban illustration; it shows that generated raster
art is not the visual foundation of this reference. Source files and all six contact sheets were re-inspected.

The 12×12 square grid gives areas to claims according to their role. Large occupied panels, a few high-contrast
masses, occasional bare headings, large semantic symbols and compact tags do the work. A reusable palette alone
is not enough. Repeated full-width title / tiny center diagram / code footer leaves unused bands and loses this hierarchy.

## Spatial vocabulary → temporal adaptation

These are authoring recipes, **not schema values or shipped renderer layouts**. Choose a few suited to the
example; do not rotate them on a timer or force all of them into a video. Read the linked source markup.

| Composition | Exact source examples | Why it works | Portrait / animation adaptation |
|---|---|---|---|
| Dominant poster + support | think1/01, think3/24 & 34, think6/58 | One large icon/title owns the view; supporting claim occupies a smaller mass | Let the actual object or expression be the hero. Contract it into the next diagram to retain identity; a heading need not own the largest panel. |
| Bare heading + tall comparison | think1/02, think5/49 | Comparable objects get most of the area; no empty title card | Expand two instances into parallel panels. Match baseline/scale for the attribute being compared; preserve differing labels. |
| Asymmetric heading + icon tile | think1/05, think2/15, think3/28 | 8/4 split balances a verbal question with a compact semantic anchor | Give code/expression most of the width; the relevant object sits beside it. Open the anchor into a detail view when its role is explained. |
| One shared panel, internal split | think1/06, think4/37 | Proximity/divider says “two aspects of the same whole” | For OOP, state and behavior live within one enclosing object. Separate their areas, then visually assemble the enclosing object. Two unrelated floating cards do not communicate ownership. |
| Stacked strips / mirrored rows | think3/27 & 30, think4/42 | Read from one condition/history to another; a row contains its whole statement | Trace one operation across a wide row, then compare its before/after row. Move the selected row forward for detail and restore it with its label. |
| Native transform / count / chart | think1/09, think2/20, think3/31, think5/51 | Exact geometry carries the claim: direction, count, length or position | Assemble an expression, route a call to its receiver, or traverse real collection items. Changes must correspond to actual computation, not random token flight. |
| Nested inset / decisive result | think2/21 & 22, think4/37, think6/64 | Parent-child containment or a strong inset makes hierarchy legible | Expand the relevant field/method inside its owning object, then collapse back to the overview. Put the result adjacent to what produced it. |
| Four-cell / unequal grouped map | think4/41, think6/59 | Grid topology encodes distinct cases and groups | Only use when the example actually needs these relationships. Reveal groups in causal order; do not display unexplained cells to fill a grid. |
| Full-surface rule / quote | think1/10, think5/55, think6/66 | Typography becomes the image; reduced detail creates a deliberate final accent | Transform the observed result into one rule. Keep a small native witness from the example. No unrelated quote/CTA imported from the source. |

## Portrait constraints, not fixed slots

Keep the outer 20px frame, safe insets, hard shadows, local font families and caption band. Design the remaining
space as a composition. The old y=232 title / y=655 world / y=1260 code stack is a legacy scaffold, not the style.
A code-heavy explanation may let code occupy the main panel. A comparison may use a bare heading. A single-object
shot may make that object large. Remove a vacant panel rather than leaving a slot waiting for later content.

Keep object identity (name, stable role/color, state and relationship) across cuts. Position and size can change.
Use a visible handoff or matched object when moving from overview to detail; update connection endpoints with it.
Do not zoom the entire 9:16 page: captions and heading should not be magnified with the model. Remeasure typography
when resizing panels; scaling an already tiny label is not a readable detail shot.

Before voice synthesis, draw the composition sequence as small keyframes. Name the primary subject, relative area,
parent-child grouping, next focal destination and continuity anchor. Three consecutive keyframes differing only
in title, subtitle or accent color need redesign or a specific evidence-reading reason. This is a review heuristic,
not a quota for camera moves or layouts.

## OOP failure case → an actionable score

The rejected 81s lamp video had 15 headings but long runs of the same three-panel diagram. A late bulb fill change
and repeated subtitle replacements did not resolve the static feeling. Two generated desk/blueprint panels added
illustration without explaining object ownership or dispatch. Do not use that output as the new visual standard.

For the same subject, a useful short study would be:

1. A large, clean lamp icon beside its state; introduce the question.
2. Open the object into state and method compartments, then join them under one named enclosing object.
3. Show a class specification; instantiate two separate objects from it. Keep the class distinguishable from a live instance.
4. Bring `desk.turn_on()` into the main area. Tie `desk` to the receiver and `turn_on()` to its method; resolve `self` there.
5. Route the call to that method; then change that receiver's field. The method invocation and state update are separate visible steps.
6. Recompose as a large aligned comparison: one changed state, one unchanged. Collapse the evidence into the rule.

These beats are now demonstrated in the project-specific OOP v2 renderer (projects/bento-story/oop-lamps-v2), accepted by the user as the current best visual baseline. They are not additional built-in renderer APIs. Use an available
licensed icon family or simple native SVG; do not generate a lamp/desk raster image for this role.

## HTML Slides handoff

When using html-slides-creator, ask it for editable portrait compositions, semantic groups and planned start/end
states for each beat. Each scene must say what opens, travels, splits, joins or changes and at which spoken clause.
Preserve element identities and stable selectors for the motion stage. A static deck later captured to PNG and
panned is not this workflow. Exporting frozen video frames as a deck is a useful by-product, not evidence that a
separate slide-design stage improved the video. Export helpers and default landscape fonts do not override Bento.
