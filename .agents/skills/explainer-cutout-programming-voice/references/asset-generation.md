# Choose assets from the shot

Use the installed imagegen skill and built-in image tool for raster creation/editing. Plan the foreground composition and materials before HTML placement. Select the roles that improve this specific shot: photographic subject, integrated lettering, meaningful UI content, material-bearing foreground piece, or a matched detail/view. There is no image quota and no three-image ceiling. A different visual role matters more than more files of the same icon.

Use simple native canvas colors. Do not commission frames, background photographs, monochrome surfaces, full-canvas scenery or a UI panel that is merely a disguised background. A genuine foreground UI content insert may be opaque; an isolated cutout needs true transparency.

## Decide text ownership once

| Intended use | Practical treatment |
| --- | --- |
| Fixed expressive headline or printed label | Generate the exact wording into its material; split into separate pieces if words must move independently. |
| Small, known sequence of designed states | Consider one generated family; code selects variants. Being numerical or changing over time does not force native lettering. |
| Computed/open-ended values, editable/highlighted code, exact diagram geometry, captions | Native elements usually provide the required control. |
| Deliberately plain labels alongside rich imagery | Native type is valid; use a coherent treatment rather than imitating one generated sticker poorly. |

For each family, record its intended role and actual required states. Once a generated design establishes the family, finish its siblings from the accepted master as an actual reference/edit input. Do not replace siblings with HTML solely because the number changes. If the design becomes unsuitable, redesign the entire family coherently. “Model value” or “dynamic data” alone is not a reason: describe whether this shot needs a few authored variants or open-ended computation.

Example: if the explanation requires “0 BƯỚC”, “1 BƯỚC”, “2 BƯỚC”, list these exact strings before generation; accept the first, then reference it for the others. Preserve silhouette, typography, material and lighting. Inspect the full set and align visible bounds/baselines before swapping. Do not invent extra program steps to complete an aesthetic sequence.

## A compact asset brief

Record in the project manifest: asset id; shot/job; exact text or `none`; master/reference path where applicable; required states; separable pieces/views; output paths; prompt/tool provenance. Keep original generated files. Reuse the same image when identity persists.

Brief example:

> Isolated contemporary editorial photograph of [subject/pose], [perspective/material], directional studio light from upper left. Crisp complete silhouette with transparent margins, true alpha, no floor or surrounding scenery. [Exact lettering, line breaks and how it inhabits the material, OR no text, letters, numerals, logos or watermarks.] [Required parts that remain separable.] Fresh color, no sepia or distressed historical styling. For a paper label: visible paper silhouette and subtle internal material shading, no baked external drop shadow; the renderer supplies its contact/cast shadow.

A production name such as “memory” is not permission to print “BỘ NHỚ.” Specify every intended word. Inspect accents and punctuation. Fix malformed type with an image edit/regeneration; do not hide it under an unrelated HTML patch. Avoid generating a blank sticker merely to add generic text afterward.

Generate independently moving parts as usable separate outputs. A hand/card composite cannot release its card; a single flattened title cannot animate its individual paper letters. If parts need no separation, an intact composition is efficient. Use accepted imagery as a reference for alternate views and maintain camera/light consistency.

Inspect alpha, edges, plausibility and text at intended phone scale on actual light and saturated fields. Confirm transparency is real, not a painted checkerboard. Check the overlap/crop needed by the shot. Apply the kit’s `paper-label` shadow to generated labels and inspect their alpha-following paper edge in the actual composition; keep photo treatment separate. If generation is unavailable, report the missing role rather than quietly replacing the entire image direction with native icons.

The three historical sample images and their prompt/hash manifests live in `examples/cache-technical/assets/`. They illustrate material and integrated type, not a stock inventory for every topic.

## Do not treat examples as an asset budget

The historical sample count does not determine the next film's image count. Review each storyboard passage for missing subject views, material-bearing text pieces, matched states and parts that must move independently. A hero, a hand and a title are possibilities, not a required trio or a stopping point. Generate the missing roles the shot needs even when three images already exist; finish all required siblings from the accepted reference. Reuse imagery where identity persists, and do not add redundant images merely to raise the count. Record the scene/job of each selected asset before final placement.
