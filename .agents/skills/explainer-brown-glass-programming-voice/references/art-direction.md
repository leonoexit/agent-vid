# Boris setup reference → Brown Glass programming video

## Complete source audit

Read all 1,646 lines across six HTML files, including shared CSS, Tailwind config, inline overrides and every
slide body. Rendered and visually inspected all 19 slides, not only covers. Five batches contain 5/3/3/4/3 slides;
the sixth HTML is an alternative cover. ref-index.md maps the whole set. Source-manifest.json includes every
local asset and original HTML hash. Source images/portrait loaded in the inspection; external dependencies mean
that reproducing the original pages still needs network access.

## Tokens: observed versus implemented

| Element | Observed in source | Video adaptation implemented |
| --- | --- | --- |
| Canvas | 1200², #050505; batches have 20px #222 bottom rule, alternative has none | 1080×1920 near-black, 16px quiet bottom rule; no surrounding chunky frame |
| Grid | 1040² at (80,80), 12×12, 24px gaps; alternative uses padded flex | Main portrait inset 72px; native study uses vertical bands and 24px gaps |
| Panels | rgba(20,20,23,.4), white border .08, blur 20px, radius 32, padding 40 | Scaffold mostly opaque dark tints for stable contrast; composition panel .88 opacity, 1px border, blur 20, radius 32, padding 36 |
| Alternative cover | Radius 40/padding 48, asymmetric 4/8 footer, title 145 | Larger bare hero 96px; special asymmetric cover remains a project recipe |
| Headings | Space Grotesk, tracking −.02/−.04em; 72–145px, sometimes weight beyond font's 700 | Full local Space Grotesk variable TTF, real 700 weight; 72px scene / 96px hero, safe 1.06–1.13 line-height |
| Prose | Inter, light to semibold, white/muted, about 24–48px | Inherited licensed Inter derivative, 32px support, 35px captions, shorter prose |
| Technical text | JetBrains Mono in font config/code; generic font-mono often resolves to system monospace | Consistent local JetBrains Mono derivative for code/values, 29–30px code, 72px values |
| Primary | Terracotta #D97757, text/underline/rail/tag | Same base accent; bright value used on dark surfaces only |
| Secondary | Violet #7C3AED used even on tiny dark-background labels | Same violet for atmosphere/borders; readable #C4B5FD for text |
| Secondary semantics | Blue/green worker roles, red warning, yellow occasional badge | Identity labels/edge tints; success/error requires a label or icon, not color alone |
| Atmosphere | 800px radial spots, terracotta .08, violet .10–.20; SVG noise; abstract raster overlays .30–.60 | Static CSS radial edges + SVG grain .035. No generated background by default |
| Depth | Subtle borders, stacked terminal rotation −2 to +4°, selective soft glow | Thin panels, soft shadow, token glow; terminal component. Rotated stack is project-authored |
| Footer | Page number, low opacity watermark, source CTA | Progress rule and readable counter; neutral/user brand; no copied watermark/CTA |

The source's identity comes from **hierarchy and space**: large bare title, a small technical eyebrow with a rule,
then a meaningful relationship between unequal panels. Replacing Maple colors alone misses it. Preserve breathing
space instead of retaining all source prose. Reflow square pairs into portrait bands when code becomes crowded.

## Layering and legibility

Atmosphere stays below panels and content. Use a stable dark surface behind reading text even if abstract imagery
exists. Thin borders suggest hierarchy; active operations use a stronger terracotta edge, not a huge glow. Muted
text #94A3B8 remains readable; do not copy opacity-40 labels for information the viewer must inspect. Keep explicit
light-surface context for the rare white browser mock (source 04). Tiny illegible page numbers are not a model.

Dark violet #7C3AED on #050505 is approximately 3.58:1; it fails the 4.5:1 text target. The brighter violet text token
is an intentional adaptation. Terracotta and muted gray are checked on nested surfaces, not only the canvas.
Reference red strike-through describes a rejected claim; do not use it to erase a still-needed state value.

## Scaffold coordinates and extensions

The inherited trace fixture starts with header, title, model, code and caption bands. These are fixture coordinates,
not the production layout contract. Reserve the current project's caption/footer region, then allocate all other
area to the next reading task. See editorial-motion.md and the playable `template/editorial-study.html`: a title
yields area, a compact call opens a dominant code window, and a computed result reduces to make room for proof.
Those geometry helpers ship in the template and remain opt-in; the JSON trace fixture itself is not redesigned.
The static composition-study.html shows six phase-based style specimens from the same example and uses the shipped CSS primitives. It is not a six-pattern taxonomy; read reference-reading.md for relational analysis.
It is deliberately not a fake claim of six built-in JSON modes or a completed narrated demo.

Fonts and their license/provenance are bundled. Space Grotesk is the unchanged upstream TTF; the inherited Inter
and JetBrains WOFF2 derivatives retain their Bento Story Sans/Mono internal names for license continuity. Their
family aliases do not mean the new design uses the old style. GSAP remains the pinned network runtime dependency.

## Source boundaries

The six originals are static pages; there is no source animation timeline or video export system. Suggested token
travel, step progression and reflow are newly designed motion adaptations. No support exists for automatic native
charting or arbitrary camera/groups without project code. The source's verification badges, performance claims,
Claude instructions, portraits and save/share footer are evidence only. Original raster reuse rights were not
established. Production defaults to native geometry and local licensed icons.


## Preserve the reference's editorial contrasts in production

The rejected SRP v1 kept colors, round cards and glow but flattened the finer grammar. Choose treatments by their
information job, not by a quota. These differences should be visible in actual frames, not only named in a storyboard:

- Source 02/06: file chrome, restrained rotation and overlapping planes distinguish instances/context. Bring the
  active code upright and fully readable; layer edges rather than covering required labels. Code strips are denser
  than their surrounding explanation. Large empty uniformly tinted cards lose this contrast.
- Source 04/09: representation changes from dark source to light rendered output; a compact command can invoke a
  much larger definition. Make the input/definition/output correspondence visible, with exact produced data.
- Source 01/02/18: one phrase changes color, weight or italic treatment inside a connected headline. Avoid coloring
  every sentence or filling the page with a paragraph broken into equal cards. Large type can be the image.
- Source 07/09: a nested inset carries code or a local diff. In video, show proposal → edit → rerun → output;
  strikethrough means an obsolete claim/value, not a generic text ornament.
- Source 08/10: top-edge roles, circular semantic anchors and matching internal anatomy create a coherent pair.
  Use native symbols or the local icon family with an explicit role. Their presence does not constitute motion.
- Source 11/16/17: execution rail, projecting question badge and an oversized result have different jobs. A rail
  advances on execution; the badge frames the evidence; the result gains scale only when computed or observed.
- Source 03/06/09/15: large abstract raster scenes add dimensional atmosphere behind glass. They are a distinct
  reference layer, not something a small generic radial glow fully reproduces. A native layered-plane treatment is
  an adaptation, not pixel-equivalent reproduction. Source images remain reference-only in the SRP rebuild; no
  generated-art quota is imposed. If art is chosen later, identify its compositional job and retain readable code.

Template CSS now also offers layered terminals, code insets, command chips, local diff rows and role discs. These
are DOM primitives; projects author their geometry, stable selectors and timed states. The rebuilt SRP project
uses analogous native project components. No new automatic scene-layout API is implied.
