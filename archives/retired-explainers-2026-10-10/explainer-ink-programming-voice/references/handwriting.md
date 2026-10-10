# Native-font writing illusion

Keep Sriracha/Mali and their normal letterforms. The user explicitly chose a simple illusion: the hand moves horizontally with a small vertical sine wave while a mask reveals the original text continuously. Do not substitute a stroke alphabet, convert fonts into pen paths, or require anatomical finger animation. Corporate Memphis applies to illustrations, not the photoreal hand.

## Implemented starter

`assets/js/ink-hand.js` leaves the native text intact. After fonts load, DOM Range measurements identify wrapped/explicit lines without splitting letters into replacement glyphs. A stepped polygon clip reveals all completed lines and the current line up to its moving edge. The final mask is removed so the original accents and italic overhangs remain intact.

The hand's horizontal position follows the same reveal progress. A modest sine wave (roughly 4–11 px at the 1080-wide canvas scale) provides vertical writing motion. This does not trace the actual strokes inside a letter. At a line return, the hand briefly lifts/fades, moves to the next line and resumes; it withdraws at the end. Text appears continuously inside characters, not one whole character at a time.

Layout and GSAP animation are built once; playback does not append DOM, use random jitter or depend on wall-clock timers. Wait for `window.__timelines['ink-story']` after fonts and hand-image decode before seeking. Existing HyperFrames rendering is unchanged.

## Story and timing

Write short questions, terms or takeaways. Reveal dense code and long prose normally. Keep enough time after writing to read the evidence; the hand is an accent, not the subject of the lesson.

Starter defaults are adjustable: up to 32 non-space graphemes, approximately 0.25 seconds per grapheme, 1.6–2.4 seconds per unit, bounded by the next content cue (including images, code and results), the voice end and section end. Long text or crowded cues fall back to an ordinary reveal without a hand. The helper records `data-ink-mode="wave"` or `"reveal"` on the host for diagnosis. Character support comes from the original font; there is no separate animation alphabet. Shorten screen copy instead of racing the hand to fit narration.

Opt-outs remain optional booleans: `handwriting: false` globally/on a section, or `handwrite: false` on text/note blocks. Short headings are eligible by default; text/note blocks require `handwrite: true` to opt into writing. Code, results, images and captions retain ordinary reveals. Sweeping generated images is not implemented. Diagram arrow/circle/strike/underline paths are implemented in visual-kit.md; these use the same pen as text, while focus and value changes use ordinary motion.

## Shared pen for annotations

`ink-pen.js` owns one hand per page, shared by text and diagram path jobs. Its position depends only on timeline time, with lift, short glide and withdrawal between jobs. It never postpones a content cue to finish writing. `ink-hand.js` shortens or removes the hand effect when the next cue leaves insufficient time. For diagram paths the nib follows the same SVG path progress as the visible stroke; text still uses the intentionally approximate sine-wave illusion. Inspect `window.INK_REVIEW` for writing spans, deadlines and ordinary-reveal fallbacks. A passing deadline check does not prove alignment to recorded speech.

## Hand asset

Reuse `assets/hand-pen-real.png`, the generated photographic-looking cutout with alpha. See [hand-asset.md](hand-asset.md) for provenance/prompt. The original is 1254×1254, nib near (190,223); the helper scales that anchor to its 520×520 display size. A CSS mask feathers the forearm end. Update the approximate nib anchor if replacing the asset; do not use a cartoon hand. Captions remain above the hand layer.

## Review

Check original font shapes before/after the effect, continuous reveal inside a character, modest up/down motion, Vietnamese accents, natural and explicit line wrapping, and hand withdrawal. Inspect forward/backward seeks. Check fallback copy stays readable and no hand accompanies it. Judge the illusion at normal playback speed; exact nib-to-letter-stroke matching is not a requirement. Distinguish a silent motion preview from a reviewed narrated video.


Canvas card labels and opted-in value changes use the same native-font pen scheduler. See canvas-story.md. A low count of scheduled jobs is a staging problem, not necessarily a hand-asset or renderer failure; inspect what actions were requested before debugging visibility.
