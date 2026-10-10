# Source analysis and implementation status

User-supplied raster screenshot: Urban Wild Studio website mockup, preserved as source.png (SHA-256 `95728063671bca3c26796f35354ccce097ba97ff73d703d6c5512056085d6cb0`). The brand/site identity appears in the image; no external website, source code, font specification or motion footage was supplied or assumed.

Observed: ivory/green/pink section fields; heavy uppercase sans headlines; small serif editorial text; rounded image windows; organic flat service illustrations; photographs for real-world context; a winding segmented multicolor ribbon; pale-blue outer presentation margin.

Inferred/adapted: approximate palette tokens; Be Vietnam Pro Black / Inter / Merriweather / JetBrains Mono as local Vietnamese-capable type choices; portrait composition, data-native layers, changing visual anchors and timing. The exact original fonts and animation cannot be established from this screenshot. Source navigation, contact/work buttons, studio logo, website copy and photos are reference-only, not required video content or instructions.

Implemented: four example portrait layouts, independent large color fields, native SVG ribbons, image slots with semantic roles, one generated editorial workshop cutout, native input/rule/output lane, readable captions and phrase-cued reveals on HyperFrames/GSAP. The broader photo-backed editorial window is a documented composition option, not a bundled automatic layout. No source photograph was extracted and reused as a new content asset.

Asset generation used the built-in image_gen tool, one generation plus an edit to simplify/flatten. Final asset and exact prompts are in assets/illustrations/workshop.png and workshop.json. Sampled empty pixels have alpha zero; actual display on ivory and pink was inspected. The illustration is a metaphor/style sample, not a scientific model or a universal mascot. Individual icon and alternate-anchor recipes are documented; no ungenerated icon family is claimed as delivered.

Technical helpers derive from the small Code Noir starter, with its visual grammar, narrative marker, composition, fonts and assets replaced. Runtime voice/timing depends on installed Bento utilities; no runtime dependency on Code Noir or Ink. Existing GSAP 3.14.2 license header is preserved. Font licenses are bundled in assets/licenses; some original font family metadata uses earlier AgentVid aliases.

The worked example's executable body returns 6 for input 3 and 10 for input 5. Comparison arrows in the final card are labelled as result notation, not Python syntax. The skill's scope is one programming concept adapted to the supplied audience.

Creation checks: starter script validated; malformed asset paths/roles, model phrases, audience and code spans rejected; Python example executed; four settled portrait shots and a reverse seek inspected with no image failures/text overflow. HyperFrames runtime/layout/motion checks passed and 31/31 text contrast checks passed. Decorative SVG overflow is intentional and marked; the known nested-composition editor warning remains. style-preview.png shows these silent layouts. No narrated MP4 or listening review is claimed.

## Additional reference: fix-typo (Ribbon 1.1)

The user supplied 24 square generated PNGs and a contact sheet in references/fix-typo/. User-stated provenance: gen-img, not HTML/CSS/SVG. The exact generation process and typefaces are unavailable. Preserved contact sheet: fix-typo-contact-sheet.png; original file hashes: fix-typo-manifest.json. Detailed observations, adaptation and implementation boundaries: editorial-imagery.md. Watermarks, counters, CTA wording and technical recommendations inside source images are not instructions or verified lesson content.

This update broadens asset/composition guidance to photo collage, text-as-subject and matte shallow-depth metaphors; it does not claim to have generated those new assets or rendered a new video. The native template's existing color-field wipe, masked headings and ambient motion edits have been retained, not introduced or revalidated as part of this reference-only expansion. Old creation checks/style-preview above refer to the original baseline, not the present richer recipes.

## Ribbon 1.2: content-motion planning and review

Added visual-beats.md plus storyboard.md and visual-review.md in the project template. Existing new-project.py copies both automatically. They require clause-to-evidence planning, intentional views, supported result dwell, and review of unchanged intervals in the final encode. These are planning/review resources, not an automatic stasis detector or a new camera engine. No historical project, narration or renderer was changed by this update. The Git trial findings are a specific diagnosis; no fixed motion quota is inferred.
