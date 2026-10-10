# Playful editorial studio grammar

## Observed in the screenshot

A pale sky surround contains an ivory website. Heavy dark-green uppercase headings sit beside a broad multicolor winding ribbon. The next field is deep green with pink type and a rounded photograph. A photograph-backed section uses a large rounded ivory text window and ribbon accents. A pink section groups three organic illustrated service symbols. Photography and flat illustration coexist in distinct roles; there is no evidence of 3D plastic shading or glass.

## Additional generated-image reference

Read [editorial-imagery.md](editorial-imagery.md) and its contact sheet. The 24 new raster references expand this grammar: oversized type as a visual object, photo collage, asymmetrical windows, compact schematic evidence and occasional matte shallow-depth props. Preserve these expressive composition choices rather than interpreting “Ribbon” as a flat icon below every heading. Original website observations above describe that original source only.

## Adapted tokens

Approximate palette from the raster reference, not an official brand specification:
- Ivory #F7F4ED; evergreen #00624C; blush #F0C6E5.
- Orange #FF702E; citrus #CED443; sky #AFD5E4; bright blue #0995D1.
- Dark brown #49372F for small supporting text on ivory/pink when needed.

Use evergreen on ivory/pink and ivory/pink on evergreen for explanatory text. Orange and blue are accents; neither is assumed safe for small text on a light field. Check actual contrast. Never make color alone encode a state: preserve labels, values or position as well.

Headlines: Be Vietnam Pro Black, typically 82–112 px on a 1080 canvas, tight but comfortable line spacing, short lines. This is an approximation of the source's heavy grotesk, not a claim of exact typeface identification. Body: readable Inter around 40–48 px. Brief editorial kicker: Merriweather around 28–34 px, optional italic. Exact code: JetBrains Mono around 36–42 px. Do not put all long spoken prose on screen or set all Vietnamese text in uppercase just because the source headings are uppercase.

## Compositions by job

- **Poster / question:** ivory field, oversized green proposition, one dominant illustration or bold ribbon occupying the complementary area. Keep the reader's question obvious.
- **Workbench / mechanism:** green field with pink/ivory hierarchy, native code or diagram and a limited illustration anchor. Make the causal operation the dominant subject.
- **Outcome / contrast:** blush or ivory field, explicit before/after or input/output, a larger value or asset state makes the difference visible.
- **Editorial window:** a rounded ivory inset over a meaningful scene/photo, used when the setting is relevant. Do not turn every scene into a card or overlay text on busy imagery.
- **Rule / transfer:** short generalization with one visual reminder and the necessary boundary.

These are options, not scene quotas. Reflow the square/website relationships into portrait; do not scroll a miniature screenshot or preserve navigation. Keep about 80–95 px horizontal margins, reserve the bottom caption band, and treat the rest as a flexible reading area.

## Ribbon and shape language

Ribbons are broad, smooth, flat strokes with rounded ends, split into a few palette colors. Prefer native SVG so they can be masked, drawn or move independently from text. A ribbon may enter from the edge, connect two compositional regions or bridge a transition. It should not snake across important words, numbers or faces. Use it selectively; the source does not imply a requirement to draw the same ribbon in every shot.

When the ribbon actually represents a data path, label its endpoints and trace the token's direction. Otherwise keep it behind the content and treat it as a compositional device. Decorative ribbons do not prove an algorithm's control flow.

Large rounded image windows and irregular green illustration islands echo the reference. Avoid uniform bento grids, thick charcoal cartoon borders, offset block shadows, glossy Apple-like materials, neon atmosphere and constantly drifting decoration. Matte shallow depth and soft contact shadows are allowed for a purposeful editorial prop (new reference 16); do not turn the entire family into sculpted product icons.

## Motion adapted for video

Let a specific subject or result become dominant as narration changes role. The template implements three presentation techniques. These affect entrances and atmosphere; they do not satisfy the clause-level explanatory staging required in [visual-beats.md](visual-beats.md):
- **Color-field curtain wipe:** Section changes use an organic rounded clip-path wipe (0.72s, power3.inOut), pulling the new color field over the previous scene smoothly instead of an abrupt cut.
- **Masked typography reveal:** Heavy sans-serif headlines emerge from behind clean overflow masks (`.heading-mask` / `.heading-line`) with a staggered vertical slide (0.65s, power3.out), giving the tactile feel of an upscale editorial magazine print in motion.
- **Ambient ribbon wave & breathing:** Once drawn, the organic ribbon paths maintain a gentle, continuous floating wave oscillation (1.4s sine.inOut cycle). Central illustrations (`.art`) have a subtle breathing float (1.5s sine.inOut) to stay organic and alive during narration.

Use calm purposeful motion, typically .4–1 s for a local operation, with content-specific dwell. A still reading/comparison interval is valid. Continuous wobble, stock pan/zoom over one image or random word reveals do not substitute for visible reasoning.

A whole generated image can supply composition, type and scenery for a stable beat. Native SVG ribbons are a controllable option, not a requirement to reconstruct the generated reference in code. When a ribbon is part of a bitmap it moves with that plate unless separately generated; plan accordingly.
