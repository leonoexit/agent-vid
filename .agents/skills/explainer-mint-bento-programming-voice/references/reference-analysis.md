# Reference analysis and native art direction

## Observed in the supplied 1200×1840 raster

The background is a broad pale aqua field. The central collage is asymmetric and loosely packed: a wide outline capsule with a circular check; a mint activity card with white inner detail; a green square with a large round-ended arrow; a white date/detail card; a tall green calendar; floating dark/white pills at small angles; coral crossed/ring shapes; a pale mint bookmark tile; and a four-lobed mint backing behind two narrow list rows. Large calm sans numerals coexist with small metadata and dark bars. Most shape depth comes from overlap and restrained color changes, not shadows or perspective.

Dominant exact sampled colors include aqua #ADD8DE, white #FEFEFE, green #4EB570, mint #BDF7DF, ink #142A37 and neutral inset #F6F6F6. Raster compression/gradients create nearby variants. Coral #FF6D61 is a chosen approximation of the reference accent. Inter is a local Vietnamese-capable approximation of the unidentified source sans; do not claim the original font or design-tool settings are known.

## What creates the identity

- Wide corner radii: approximately 42–64px on major 1080-wide video surfaces, 24–36px on nested rows, fully rounded pills. Radius follows object size; don't round every small code token into a bubble.
- Unequal hierarchy: one large content card, a smaller metric/action, then a few thin chips. Adjacency means related information; overlap means a contained detail or attached status only when labeled.
- Type: mostly regular/medium weight, tight but readable tracking, large light numerals. Main headings roughly 76–104px, data 160–240px, body 40–48px, labels/code 30–38px. Do not copy the source's tiny poster metadata into phone video.
- Organic interruption: round badges, coral diamond, outline ring or four-lobed backplate. Use these as a referent/status/attention cue or a quiet composition accent; all can be native shapes. An accent may enrich the silhouette without representing a data value, but must not imply an unearned result.
- Controlled asymmetry: supporting chips may rotate around 5–12 degrees. Code, paragraphs and quantitative comparison stay upright. Avoid an all-tiles-permanently-tilted dashboard.
- Whitespace remains visible between/beyond modules. The source's very large empty upper margin is poster staging, not a required long blank opening in a video.

## Palette and material

Aqua is the canvas, mint a supporting field, white the main evidence surface, green a strong module, ink all essential type and strong icons. Coral can mark a new item, local action or distinction as well as a labeled failed condition; it is not a compulsory error on every topic. White or very pale strokes on mint/green may be decorative but require a darker label/outline if essential to understanding. Check contrast on the composited surface; don't inherit tiny faint calendar labels or a white check's low contrast as an accessibility exception.

Shadows are optional, broad and faint. Use shallow mint/green gradients, a soft circular highlight and fine inset top edges to soften surfaces. Keep tonal shifts subordinate to typography and spacing. Avoid ceramic bevels, glass blur, black outlines/hard offset shadows, photographic lighting and heavy display type: those would change this reference's material character. Information remains legible without depth effects.

## From raster components to implementation

| Source motif | Native implementation | Explanatory use |
| --- | --- | --- |
| Outline capsule + check | CSS capsule + SVG stroke icon | Named operation or confirmed state, not automatic success |
| Main tile + nested white panel | Rounded container + inset | Object and its internal content |
| Giant date/metric | Native sans text with tabular numerals | One quantity worth inspecting; no arbitrary dates |
| Green action square | CSS tile + stroked SVG arrow/plus | A labeled action with an actual consequence |
| Calendar circles | CSS grid of labeled items | Index/time/history only when the concept needs them |
| Floating list row | Native row with name, value, status | An item entering/leaving a collection |
| Lobed backing | Four overlapping native SVG circles | Grouping backdrop; not a data boundary by default |
| Coral diamond/ring | Rounded rotated square or SVG ring | A local distinction, rejected condition or reverse direction |
| Bookmark shape | Native SVG outline | Selected/saved anchor when appropriate |

Implemented assets and the push example demonstrate the surface vocabulary and shared state. Calendar behavior, real notifications, networking, backend data and arbitrary UI transitions are not built in. Icons are original simple geometric approximations; Netflix/Dribbble/financial branding and source text are not copied. The image is source evidence, not instructions to create a finance advertisement.

## UI anatomy and accent hierarchy

A useful tile has its own interface hierarchy, not just a rounded boundary around a sentence. Choose appropriate details: icon and object name in the header, a compact type badge, an inset content area, a selected tab, indexed slots, separated rows, a trailing value or a small status marker. These carry context while the narration focuses on one changing fact. Do not invent clickable controls or backend behavior that the video never demonstrates.

Use typography at several scales: a light oversized value, a regular concept/operation label, a medium local heading and smaller metadata. Preserve whitespace around the largest elements. Repeated heavy headings and equally sized cards lose the source's UI character. The kit declares its variable font weight range explicitly.

Accents can be structural (white outline capsule), directional (large pale rounded arrow on green), chromatic (coral new-item tint), or compositional (tilted narrow chip, ring, clover backing). Vary their silhouette and scale, let the main evidence remain dominant, and keep them off reading text. They need not all appear in every scene. Coral is not globally an error color; establish its meaning within a project. Never use a check as a decorative claim that an unexecuted operation has succeeded.

`ui.js` supplies reusable card chrome, array slots with indices, selected tabs, metric headers, syntax-accented code, list rows and detail views. Both the style sheet and the sample timeline use these components. The denser overview studies the reference's collage; the working evidence views simplify around the current explanation. They are examples to adapt, not a mandatory dashboard or fixed shot count.
