# Text, color and icon grammar

Read when storyboarding/styling a Bento video. These decisions complement composition-grammar.md; they do not replace its meaningful model operations. The six source HTML files are static. Spoken timing, selective reveals and moving highlights below are our video adaptation.

## Source evidence, all six batches

All 67 slides, shared CSS, inline style declarations and 82 Font Awesome icon elements were reviewed, along with all six contact sheets. Sources request Font Awesome 6.4.0. They also use emoji; this adaptation standardizes on one local Solid family. A source's use of a color is evidence of a design choice, not a universal semantic meaning.

| Source / global slide | Observed detail | Adaptation |
|---|---|---|
| think1 / 07–09 | Yellow phrase in a dark causal sentence; bold inline words inside result prose; compact monospace causal tags | Highlight the spoken clause inside native text; let tags travel only when a real relation is being explained |
| think1 / 01, 05–06 | Hero brain, compact eye-slash tile, battery and burger pair | Icon size follows its role: subject, attention anchor or comparison witness |
| think2 / 15–16 | Large differently colored numbers; discounted price colored inside a sentence; tag icon matched to context | Isolate the compared value without repainting the full sentence; label both meanings |
| think2 / 19–20 | One icon versus a counted array | Exact quantities require exact native counts; no decorative pseudo-statistics |
| think3 / 28–30 | Buy/sell text carries opposing colors; icon and label form one unit; alternating row hierarchy | Keep a shared alignment and typography while separating the compared cases with labeled color |
| think3 / 33 | Inset quote with colored left rule and bold internal clause | A left rule marks an aside/evidence block; emphasis opens on the relevant clause |
| think4 / 38–39, 45–46 | Gains/losses tags, colored outlines, selected decision text; matched face symbols | Color may express state, but labels and symbols must carry the distinction too; use contrasting foregrounds |
| think5 / 49, 55–56 | Dark micro-tags inside bright panels; one yellow clause in a dark quote; emotionally contrasting phrases | Distinguish identity tags from temporary focus. A one-clause accent is stronger than coloring the whole quotation |
| think6 / 59–60, 63–66 | Group colors, short status tags, contrasting outcome text, enlarged quotation symbol | Group color expresses identity; status stays local; type may become the hero while a small icon anchors context |

Charcoal #2d3436 on palette red #ff5656 measures about 4.06:1, below this skill's 4.5:1 content-text target. Put error text on a white inset/tag with a red border, or use red as a non-text accent. Do not copy low-contrast pastel text on white, white on red/green, faint gray tags, embedded CTAs or the source's book claims. Native highlight backgrounds in video are an adaptation; the sources use tags, insets and colored spans rather than a timed marker system.

## Choose the smallest emphasis that communicates the job

- **Accent text:** relate a word/value to an already identified object, or isolate the decisive clause. On a dark surface use palette colors; on a light surface use ink or place the palette color behind ink text. Do not invent darker palette derivatives by default.
- **Highlight backing:** temporarily select the words being explained. Use dark ink on yellow/orange, with padding that survives line wraps. Leave previously explained text readable when the backing settles back. Captions have a separate karaoke function; they are not model motion.
- **Tag:** a persistent short type, identity or status label, not a second subtitle. Use a compact monospace treatment. Reveal a new status when its cause has been established.
- **Oversized type:** make an actual value, comparison or conclusion the subject. Do not enlarge unsupported performance numbers or display unspoken conclusions early.
- **Inset / left rule:** frame a subordinate explanation without letting it compete with the main object. Its text colors resolve against its own surface.

One spoken beat has one primary focus. A visible sentence may contain several semantic spans, but only the one currently being explained gets temporary emphasis. Do not add highlight effects on every word of diagram text.

## Resolve color roles

1. Assign entity/group identity colors in the storyboard and preserve them through reframing.
2. Encode status in a labeled local field/tag. Never rely on red/green alone; red is for a stated error/negative outcome, not a default comparison participant.
3. Apply temporary attention to a child word, outline or operation token; restore its prior treatment afterward if that meaning is transient. Never repaint an entire entity and accidentally imply another identity.
4. Resolve foreground against the actual nearest opaque background. Nested white cards do not inherit yellow/white foregrounds from dark ancestors. Validate focus, normal and settled dim states; prefer size/composition over making necessary content unreadably faint.

One dominant color mass and one supporting mass is a compositional default, not a two-color ceiling. A multi-entity comparison may need additional stable identity colors. Use charcoal/white/gray as breathing room. No fixed 60/30/10 area ratio, automatic harmony score or universal color-to-language mapping is claimed.

## Icon system

Default assets: Font Awesome Free Solid **6.4.0**, local SVG subset in template/assets/icons, upstream LICENSE.txt and a URL/hash manifest alongside it. Inline the trusted local SVG when a part needs coloring; set currentColor from its owning group and mark redundant icons aria-hidden. Do not fetch icon fonts or mix in emoji/brand logos at runtime.

Use one of three roles: hero subject (roughly 140–240px), panel anchor (64–120px), or tag/row marker (28–48px), adjusted for actual composition. Pair related icons at equal visual weight, not merely equal viewBox width. Keep their baseline/label spacing consistent. Add only icons whose role is named in the score; fetch further assets from the pinned upstream release and preserve their license/provenance. Native geometry remains right for data, arrows and state.

## Implementation and timing

Shipped: **emphasis.css** with .bento-accent, .bento-mark, .bento-tag and .bento-icon, plus explicit .bento-surface-light/.bento-surface-dark context and --bento-emphasis color. These are opt-in DOM/CSS primitives. theme.css imports the stylesheet. Existing plain-string JSON fields and renderer behavior remain compatible.

Project code creates native spans with textContent, stable IDs/data selectors and scoped style classes. It schedules reveal/highlight/restore at matched spoken phrases on the seekable GSAP timeline. No arbitrary HTML in script.json; no implied rich-text renderer API. Project-specific layouts and choreography still need authored code.

Record phrase → selector → emphasis reason → actual background → reveal/settle time in the storyboard. Check arbitrary reverse seeking as well as linear playback; avoid callback-only mutations whose results persist after seeking backward. A new accent is not sufficient evidence of a model operation.

## Review

At settled readable frames target at least **4.5:1** for content text against its actual background, including tags and highlights. Measure computed colors and inspect rendered frames. Transition opacity is evaluated visually; do not claim every fade frame meets the settled target. Inspect line breaks/diacritics, padding, icon balance, and one-focus hierarchy at real phone scale. Keep meaningful reading holds; reject long stretches of color-only animation where a relationship should move.

The accepted OOP v2 establishes the composition/motion baseline. New work should add this finer grammar without reverting to static title/card/code bands. Visual acceptance of that project does not automatically approve later outputs.
