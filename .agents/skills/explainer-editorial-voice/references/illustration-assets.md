# Supplied and AI-generated illustrations

The monochrome editorial style permits raster assets. Use them when physical shape, context or a metaphor carries
information that a tiny icon cannot: a cutaway of a kettle, a person sorting receipts, or an unfamiliar apparatus.
SVG remains a better fit for exact connections, coordinates, data, code and small reusable symbols.

1. Choose a single visual job and the area it must fit: the `illustration` widget has a 920×510 image area above a
   short caption. Choose a crop with useful negative space, not a dense full-page poster.
2. Reuse an appropriate user-supplied asset, or generate a fresh image with the available image-generation tool.
   Follow that tool's instructions. Transparent background works well; off-white matching `#f5f5f1` is also suitable.
   If generation is unavailable, make an original code-native SVG where practical and disclose the fallback.
3. Art-direct for black contour line art: simple thin outlines, slightly irregular hand-drawn character, flat,
   no shading, no gradients, no photographic texture or colored accents. Request no text, numbers, logos or arrows.
   Overlay exact labels and technical geometry in HTML/SVG in the project when needed.
4. Inspect the actual generated asset. Check the depicted mechanism/anatomy/object when relevant, unwanted gray
   washes, shading, extra parts and any accidental writing. Simplify or regenerate an unsuitable asset.
5. Copy the final image to the project's `assets/illustrations/` using a descriptive versioned filename. Do not rely
   on a remote URL or a file outside the project. Save the prompt and asset origin in `asset-notes.md`; do not claim
   an existing template image was newly generated. Keep supplied licensing/attribution when applicable.
6. Reference it as `{ "kind": "illustration", "src": "assets/illustrations/kettle-v1.png", "alt": "Cutaway kettle", "caption": "Water heated from below" }`.
   Check the render for composition, visual consistency and caption clearance. AI images are illustrative;
   verify explanatory claims independently. The renderer preserves the image rather than inventing a mechanism.

Example generation brief, adapt to the actual subject:

> One simple cutaway of a stovetop kettle, showing water inside and a small spout, side view. Minimal editorial
> black contour line art, thin consistent strokes with a light hand-drawn feel, flat vector-like outlines,
> no shading, no gray fill, no gradients, no texture, no text, no numbers, no arrows, no logo. Transparent
> background, wide 16:9 composition with generous negative space. Clear silhouette at phone size.

Do not generate images for every scene by default. One useful recurring illustration often explains better than
several unrelated pictures. A style reference guides line quality; it does not make its brand or objects mandatory.
