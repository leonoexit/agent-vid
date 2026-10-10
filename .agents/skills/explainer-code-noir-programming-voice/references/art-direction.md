# Code Noir visual grammar

The source is `references/reddit_carousel_noir_template.html` at workspace root. The supplied local copy and contact sheet preserve the design reference. It contains 9 static square pages, not a motion reference. Portrait reflow and motion are our adaptations.

## Palette and typography

- Pure black `#000000`; thin structural lines `#333333`; primary text `#E5E5E5`; supporting prose about `#BBBBBB`.
- Keywords / decisive operation: pink `#FF79C6`. Functions / relevant action: cyan `#8BE9FD`. Strings / literal-result emphasis: yellow `#F1FA8C`. Variables: purple `#BD93F9`.
- Source comment blue `#6272A4` and dim gray `#666666` are lifted to `#9BA8D2` and `#A2A2A2` for small explanatory labels. The darker source gray stays in nonessential dividers/decorations only. Review actual composited contrast.
- **JetBrains Mono throughout**, regular through extra bold. Headings about 80–100 px, short verdict 120–150 px, prose 40–46 px, code 38–42 px at 1080 width. Monospace is wide: shorten lines or recompose rather than shrinking until unreadable. Check Vietnamese marks. The bundled font is variable weight 100–800.

Use syntax color structurally in real code. For prose, color one important phrase without implying it is executable. Keep semantic roles stable. Do not turn the entire page into rainbow highlighting. Actual snippets remain syntactically valid; decorative pseudo-code, if genuinely useful, needs an explicit metaphor/pseudocode label.

## Composition repertoire

Choose by information role; no prescribed order or count:

- **Claim/question:** a large left-aligned proposition, a short context/comment line and enough silence in the layout for it to register.
- **Code → output:** compact code separated by fine gray rules, then a labelled output or stored value. The result is visually distinct from source code; body narration explains the link.
- **Comparison rails:** two short, parallel statements with cyan and pink left rules. Label the same attribute on each side; avoid unrelated pros/cons lists.
- **Verdict:** one decisive term, value or operator made large, plus its plain-language meaning. Use after establishing evidence, not as unexplained hype.
- **Rule:** a concise generalization, cyan divider and one important boundary or check.

The starter reserves about 86 px horizontal margin, a main area ending near y=1555 and a bottom caption band beginning near y=1650. This is a usable starting point, not permanent header/code/output bands. Allocate the main area differently for the task. Do not stretch the square reference into portrait or render every page in the same card.

Line numbers, when useful, should correspond to real visible lines. Original fake line numbers, import statements, class metaphors and 404 motifs are reference-only decoration. Do not add arbitrary progress fractions or a desktop IDE chrome. Bare black and type can anchor a deliberate statement, but should not be the default treatment of every explanatory beat.

## Motion and assets

Typography owns hierarchy; a coherent visual asset gives the topic a recognizable referent. Use the local outline family in `assets/js/noir-visuals.js` (terminal, shell/program, folder, file, location pin, keyboard, check, cross) or extend that stroke language for the subject. These are native SVG assets, not an obligatory icon checklist. The shell glyph denotes software, not CPU hardware. Keep labels and numbers native.

Choose a dominant asset, an annotated relationship or a spatial model when it helps the clause. Enlarge a terminal for input/output, let a file tree occupy the main area for paths, then move the current-directory marker when `cd` changes context. A small icon attached to the same static paragraph on every scene does not solve monotony.

Use motion to develop meaning: reveal an object, follow a connector, move the anchor, unfold a child, replace a value, compare two destinations, then hold the result during explanation. Headings may shrink or move aside as the evidence becomes dominant. Most object transitions can take .5–1 s; choose timing from narration/readability, not a movement quota. Quiet reading still belongs in this style. No idle float loops, repeated pulsing, fake cursor activity or compulsory camera travel.

Generated imagery is available when a subject or metaphor benefits from a visual illustration. Keep it isolated on black with a restrained palette and a deliberate silhouette; exact logic, code and labels remain native. Record its explanatory role before generation. Do not turn this into glass/glow or a generic cinematic background style.

Read visual-storytelling.md for the storyboard and review contract. The bundled helper only provides SVG shapes, line drawing, reveal and movement on a supplied GSAP timeline; it does not automatically choreograph a subject.
