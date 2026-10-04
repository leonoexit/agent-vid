# Verification

- Script contract and cue validation passed; 15 sections, question → setup → decode → execute → verify → rule.
- Runnable Python assertions pass: separate instances, both initially False; desk True / bed False after the call.
- Local ASR checked all 15 speech clips; word-start anchors improve cue timing with interpolation for unmatched terms. This is not a word-perfect listening certification.
- 15 scene frames and 4 operation frames inspected. Lamp SVG/value overlap fixed. Arbitrary reverse/forward seek gives False → True deterministically, with matching SVG state. All contextual images decode. No overflowing text widths.
- Semantic-motion audit has no stillness/long-shot warnings. Its missing-art warning is documented: custom opaque panels are outside its sticker detector.
- HyperFrames check: pass. Only inherited nested_structure_needs_subcomposition warning remains.
- MP4 full ffmpeg decode: pass. H.264 1080×1920, 30 fps; AAC stereo 48 kHz; duration 81.266667 s. Rendered operation frame inspected.
- PDF: 15 pages, portrait 810×1440 pt (9:16); page 11 rendered and inspected. ZIP: 15 PNGs at 1080×1920, exported from the native HTML deck without video captions.
- Two ImageGen contextual panels selected editorially; user approval is pending feedback, not assumed. Exact prompts and unused halo experiments retained in asset-provenance.json. No rejected robot assets reused.
