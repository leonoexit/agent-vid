# Art direction derived from the supplied Bauhaus series

## What makes this reference recognizable

Five HTML files contain fifty square 1200×1200 posters with a 20px cream rim. The family uses Be Vietnam Pro, despite a stale “Outfit” comment, plus Space Mono. Its recurring contrasts are massive sans headlines versus small mono labels, a large geometric mass versus empty space, cream versus a full navy/red/yellow field, and a short assertion versus a contained piece of evidence. Repeated circles, rails and quarter-circles connect the family without requiring identical layouts.

Use the source atlas to recover the actual pattern, not just its palette. Examples: slide 1 is an off-axis headline balanced by an oversized cropped circle and low semicircle; 7 gives the number and its explanation different color territories; 11 stacks two colored roof panels over a headline; 16 places an offset proof rectangle across a split field; 27 constructs a clock from native HTML/SVG; 35 changes count inside repeated circles; 39 uses stepped funnel widths. Each can suggest a different reading path.

The source combines circles/quarters/triangles, short bars, rules, strikethroughs, square outlines, occasional tilted proof panels and hard shadows. Use one dominant geometric gesture per composition unless the data itself requires many units. Decorative circles may crop; a circle representing one datum may not disappear partly beyond the frame. Texture is sparse: faint diagonal hatch or dot grid, never grain over text by default.

## Tokens and contrast

| Token | Exact source | Use |
| --- | --- | --- |
| Navy | #134686 | Primary ink, full fields, structural rails |
| Vermilion | #ED3F27 | Large geometric mass, operation accent, key distinction |
| Amber | #FEB21A | Field, highlight strip, active item or result surround |
| Cream | #FDF4E3 | Paper, negative space, reverse type on navy |

Use navy on cream/amber and cream/amber on navy for body text. Do not blindly inherit red-on-navy, yellow-on-red, white-on-red or small red-on-cream lettering: several source pairings have insufficient contrast at small sizes. Keep red as a shape, use a cream inset with navy text when needed, and measure the final pairing (aim 4.5:1 for normal text; large display text still needs 3:1). Colors must not be the sole carrier of state: add label, position, shape or count.

Do not adopt the undefined `--c-green` in files 2/3/5; it is a source defect, not a fifth palette color. A few source white/grey panels are secondary neutrals, not permission for a rainbow. The three main colors are compositional resources, not a universal red=bad/yellow=wait/blue=good semantic code.

## Portrait type and space

At 1080×1920 start with 84px side margins, a 100–120px top inset and a caption zone around y=1640–1820. Adapt these for platform overlays; they are not permanent title/model/code bands. Heading range roughly 88–132px, key numbers 180–300px, explanation 42–54px, code/labels 32–42px. Check at phone scale, and enlarge detail instead of shrinking an entire diagram.

Use intentional line breaks, not word breaking through Vietnamese syllables or code identifiers. Source 0.9 heading line height can collide with Vietnamese accents; the kit starts at 1.12 and leaves overflow space. Use 900 uppercase for short propositions, regular sentence case for longer explanation. Space Mono is for compact code/metadata, not whole narration. Avoid displaying the same paragraph in heading, body and captions.

A field boundary separates roles, scale can promote a result, alignment makes comparison measurable, a heavy rule anchors reading. Geometric accents should emerge from those decisions. Reflow paired square layouts into stacked or unequal portrait areas while preserving the relationship; two tiny side-by-side paragraphs are not faithful adaptation.

## Implementation boundaries

Implemented: CSS tokens, local type, geometric silhouettes, divided fields/insets, SVG dot groups and reusable seekable reveal/move helpers. The starter demonstrates grouping, a changed input, a zero remainder and captions from actual word timing.

Reference only until authored per project: funnel filtering, branching, bar growth, clock mechanisms, crossed-out alternatives, richer call/definition reflows. The static reference does not establish camera choreography, pacing or educational effectiveness. Brand icons are not bundled; use native labeled silhouettes or a licensed consistent local icon family if a new subject needs them. No remote icon dependency is necessary for the starter.
