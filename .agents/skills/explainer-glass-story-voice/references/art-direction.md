# Reference adaptation

Source: the user-supplied `references/summary-refactoring-ui-carousel/batch_01.html` through `batch_05.html` in
this repository. Batch 01 defines the main Dream State / Fresh Daylight style. The samples are static 1200×1200
carousels; this skill adapts that art direction to a narrated 1080×1920 motion composition.

| Reference feature | Video treatment |
| --- | --- |
| Rose/amber blurred blobs on almost-white | Static soft mesh framing the content; no continuous decorative drift. |
| White translucent card, 60–64px corners, subtle depth | One persistent outer glass card, plus layered explanatory cards. |
| Lexend heavy display type, Be Vietnam Pro body | Bundled local fonts with Vietnamese support; mono reserved for exact code/data. |
| Large hierarchy and deliberate contrasts | A short headline and one visual operation; explain while the result stays visible. |
| Before/after UI examples, tilted panels, arrows | Transform the same object or move the relevant information, rather than merely cross-fading slides. |
| Small watermark and circular page badge | User brand or neutral AGENTVID; scene badge/progress. Reference branding is not mandatory. |
| Tailwind/CDN icons/remote grain in the HTML | Rebuilt local CSS and original code-native shapes; fonts and images stay local. |

Palette: background #fffcfc; dark text #0f172a; body #334155; rose #fda4af/#fb7185; amber #fbbf24.
Use darker rose #be123c/#9f1239 for accent text so the soft reference colors don't reduce readability.
Default card opacity is 0.82. Keep exact technical text on high-contrast panels, not directly on a noisy blob.

The other samples explore Sunset Vivid, Nordic Mint, Midnight Pro and Aurora Borealis. Their hierarchy, contrast,
labeling and polish patterns are indexed in ref-index.md. They are not bundled palette modes. Keep Dream State
consistent across scenes; a different art style/content format belongs in a separately scoped skill.
The reference's NO ANIMATION comments describe static carousel export, not the user's video request.
