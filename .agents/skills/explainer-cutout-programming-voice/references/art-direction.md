# Visual grammar

This direction was developed from the user's contemporary collage brief, not extracted from a historical reference. Mix credible photographic material, visibly flat paper geometry and editorial lettering. Let differences between materials remain visible.

Use fresh paper #F6F7F2 and ink #18201F, with cobalt #2548F4, lime #DAFC63, coral #FF735B and lilac #E0D8F3 as starting accents. Choose a subset per shot and preserve identity colors. Paper edges can be irregular and lightly fibrous. Generated paper labels need a clearly readable contact shadow and a modest soft cast shadow, so their cut edges read as separate pasted pieces. Avoid sepia, distressed newsprint, antique props, typewriter fonts, obligatory tape and heavy aging.

Compose with a few large overlapping pieces and strong scale contrast. A photo can cross a flat paper edge; generated lettering can interlock with its subject; native marks can connect an object to an exact abstract representation. Avoid uniformly sized stickers or photos parked inside repeated panels. Keep a quiet region around the current evidence. Simple native canvas color is the backdrop; no generated background images or framing plates.

Use Inter/sans for editable type and JetBrains Mono for code (bundled, with licenses). Starting sizes at 1080px width: titles 90–125px, labels 36–48px, code 32–42px. Measure Vietnamese accents and actual line lengths. Generated headlines may use another compatible expressive treatment. Captions remain a stable, separately readable HUD.

Change hierarchy as the argument develops: intimate subject/detail → spread of related evidence → comparison → dominant result are possible movements, not mandatory layouts. A recognizable anchor can resize, move or become a detail. Do not reserve fixed title-top, hero-middle and answer-bottom slots throughout the film.

Photographic contour edging and CSS shadows can connect materials. Keep the stronger pasted-paper shadow specific to generated labels, rather than applying it equally to photos, code and captions. Rotate short accent pieces sparingly; keep code and long comparisons upright. Decorative crops may bleed, but preserve necessary evidence and anatomy. A printed arrow is decoration unless its endpoints truly express the mechanism. If something must pass behind a rim or release from a hand, commission separable parts; a single bitmap supplies no independent geometry.


## Pasted-paper label depth

Use `class="cutout paper-label"` on a generated paper label, or `CutoutDesign.img(parent, {..., paperLabel: true})`. The kit uses alpha-following `drop-shadow`: a tight 1px/3px/1px contact shadow at 30% ink plus a 5px/11px/5px soft shadow at 22% ink (at the 1080px design scale). This replaces the photo cutout's white contour treatment for labels, preserving their generated paper silhouette. Tune the two CSS variables if a particular asset needs it.

Light comes from upper left; the shadow falls down/right. Keep it close enough to suggest paper pasted onto a surface, not a floating card. Review actual generated edges on the chosen canvas, in overlaps and at phone scale. Avoid a rectangular `box-shadow` around a transparent PNG, dark halos around every letter, or duplicate shadows on both image and wrapper. A label already carrying a strong external shadow may need reduced CSS strength; preserve its internal folds and material shading.
