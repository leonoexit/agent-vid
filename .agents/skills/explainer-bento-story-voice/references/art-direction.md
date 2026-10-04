# Think Fast & Slow → vertical programming trace

## Source coverage

All six supplied HTML files use the same Maple Story palette and square bento system. They contain 11, 12, 12,
12, 10 and 10 slides respectively (01–67). Read ref-index.md for every slide's pattern and source-manifest.json for
unchanged file hashes. This adaptation inherits the glass skill's narrative mechanics, not its surface design.

## Design tokens and typography

| Token | Source HTML | Implemented video |
| --- | --- | --- |
| Board | 1200²; 12×12 grid; 40px padding; 24px gutters; 20px frame | 1080×1920; 20px frame; 60px main inset; 24px minimum panel gutters |
| Surface | #e5e5e5 board; white/color blocks | Opaque gray board and flat blocks; no mesh or backdrop blur |
| Cards | 4px #2d3436 border; 32px radius; 12px hard shadow | Same primary tokens; smaller tokens/callouts use 3–4px borders and 5–10px offsets |
| Colors | #8ce4ff / #feee91 / #ffa239 / #ff5656 / #10b981 / #a594f9 | Same palette through named `tone` values; charcoal and white are neutrals |
| Headline | Merriweather 900, 96–140px covers; 64px h2 | Local variable Merriweather, 76px hero / 64px scene, up to two lines |
| Body | Inter, generally 38px | Local variable Inter, 30–35px narration support/captions; short labels 21–29px |
| Exact data | JetBrains Mono 700 tags | Local variable JetBrains Mono, code 29px, large values 72px, tags 21–24px |
| Counter | White pill with dark border | Persistent bottom-right scene pill; no original series numbering |
| Brand | Center watermark @lenguyen.codeai | User-supplied brand or neutral AGENTVID in header |

Fonts are bundled with their OFL licenses, from Google Fonts' `ofl/inter`, `ofl/merriweather`, `ofl/jetbrainsmono`
directories. WOFF2 releases implement the source families (Merriweather width fixed at 100 and optical size at 32; weight remains variable) without relying on a live Google Fonts request.
Serif titles wrap earlier than the parent skill's geometric sans: shorten wording, insert deliberate line breaks and
inspect Vietnamese diacritics. Character limits do not guarantee fit. Do not shrink to recreate dense source slides.

Read [text-color-icon-grammar.md](text-color-icon-grammar.md) for inline accents, emphasis precedence, icon roles and source examples. Color encodes a stable entity role, never a random new identity per scene. Suggested mapping: yellow source/data,
blue destination/read, orange operation token, purple optional secondary result, red explicit error only when labeled.
White text on the source's red/green and pastel text on white have weak contrast. This adaptation uses charcoal text
on bright fills, and white/yellow text on charcoal. For red warning surfaces use a white inset or white tag with a red border: charcoal on palette red is only about 4.06:1. Keep labels and values legible during focus/dimming.

## Legacy scaffold coordinates (not mandatory production staging)

- Header: y=50–130; kicker/tag y=159–211.
- Flowing title panel: x=60…1008, y=232; 32/36px padding. Leave its bottom above y=610.
- Persistent model: x=110, y=655; local 860×570 canvas. Keep entity borders, shadows, lids and arrows in its safe area.
- Code panel: x=60…1008, y=1260; up to three short code lines.
- Result callout: y=1512; finish before y=1640. Captions: y=1664…1814; progress/counter below.
- Intro/outro: same heading band, paired tiles y=800…1070, dark note y=1170. These introduce/recap the same example.

Keep headers in normal flow inside `.heading-copy`; title and subtitle share height. Maintain visible gutters after
hard shadows, which extend beyond border geometry. A dense source 6/6 comparison becomes two short native cards;
use stacked wide cards in a project extension if the concept needs more text. Do not scale the entire 1200² page to fit.

## Visual grammar and motion

A bento panel represents a named object, input, result or code context. Objects retain identity and state across scenes; positions, scale and grouping may change
with the explanatory focus. See composition-grammar.md before adopting the legacy coordinate bands. Reveal → operation → settle gives each scene a single focus. Lift an actual native
lid, trace a directional relation, move a numeric/address token, then commit the destination value. Use a brief scale
pulse or outline for the result, never a continuous bounce. Keep shadows rigid during motion. Generated ornaments
use flat silhouettes with dark outlines/hard shadows, not explanatory diagrams or texture-heavy cutouts.

Implemented: frame, color panels, typography, tags/counter, pairs, native box/ticket/card/reader entities,
show/open/move/morph/connect/transfer/write/focus/spotlight/pulse/code, persistent state and reversible seeking.
Existing positioned entities can compose two/four-card arrangements when labels fit. Tone is an initial style field,
not an animation event. `morph` deliberately settles to an opaque white card with a dark border.

Reference only, needing an extension in the individual project: actual bar/time charts (31/51), counted icon arrays
(20), nested groups (21/37), three-plus-two overview map (59), quote/attribution composition (55/66). Use native SVG
axes/labels and real data when creating a chart. Never fake a numeric chart with an ornamental image.

## Source quirks and boundaries

The six export scripts clone 1200² slides, rasterize with html2canvas, zip PNGs and download via FileSaver. They are
static carousel tooling, not the video pipeline. Their buttons, Save/Share/Follow prompts, author claim, watermark,
67-slide count and batch sequence do not become generated video requirements. Runtime uses the inherited HyperFrames
pipeline. Font Awesome/emoji in source show scale/placement references; use local SVG geometry when a diagram needs
an icon. No Font Awesome CDN is required by the template.

Specific details checked beyond the cover: slide 50 pins a dark result block over the lower two columns; reflow it to
a separate result band instead. Slide 59 combines 4/4/4 and 6/6 spans; keep it as map reference. Slides 31/51 contain
CSS bars, not general chart components. Think2 and think5 omit the closing `</html>`; keep source bytes unchanged.
Source h1 sizes vary (96, 100, 140); fixed-card layouts can clip long headings, so choose readable portrait sizing for each composition. Source selectors also make some dark-tag/white-inset text low contrast (58, 61, 67); the new template uses explicit readable foregrounds.
Book statistics and categorical claims are not validated by this style review. For example, slide 39's fair-coin
+$150/−$100 arithmetic yields expected net +$25, not its displayed +$50. Do not import these claims into programming
narration. Verify any newly requested factual topic independently.

## Bundled font naming

The local WOFF2 derivatives are internally renamed **Bento Story Serif / Sans / Mono** to respect the source
fonts' reserved names. Their source designs remain Merriweather / Inter / JetBrains Mono respectively.
[font-provenance.json](font-provenance.json) records input/output hashes and exact transformations; original OFL
notices are retained. This naming change does not introduce another visual style.

[Template preview](preview.jpg) shows the cover, a write operation and recap. The preview uses synthetic caption
timings for layout validation; it is not a produced voice recording.

## Narrative-dependent imagery

Use narrative-framework.md to derive subjects and compositions from the current phase. A matching palette alone
does not establish fit: reject generic mascots or repetitive pose swaps when they contribute no topic-specific role.
Native entity identity persists; supporting art can change or leave as the narrated question changes.

## Composition fidelity

See composition-grammar.md for the missing spatial vocabulary and exact source examples. The legacy template
implements one layout; the source-specific recipes are authoring guidance requiring native project work, not
additional built-in layout APIs. Simple local icons/native geometry are the default; generated art is optional.
