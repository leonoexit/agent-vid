# scanf v2 verification

- Separate project; v1 unchanged. 14 shots, 74.44 seconds planned, 1080×1920 at 30 fps.
- Hải Đăng, speed 1.0; phonetic Vietnamese narration for scanf, n and variable age. Exact C notation stays native.
- Two generated transparent PNGs in one Maple robot family; registered with prompts, references, hashes and immutable project copies. The generated raster has slight fill variation; native panels and diagram retain the exact flat palette.
- Local ASR word-start anchors + monotonic interpolation improve cue placement. This is estimated alignment, not a human listening certification. Audio QA transcripts and alignment report are in .cache/scanf-c-v2.
- 36 frames cover every shot/boundary and before/mid/after three transfers. Inspected contact sheet and full-size transfer frame. Assertions: images decode; address/count are hidden before cues; age writes 0→18 and reverses correctly.
- Fixed forward-test findings: child fields could escape a hidden entity; lazy text changes could retain later values on backward seeks. Explicit display state and previous field values fix them. Spotlight dim set to 0.7 to preserve address text contrast.
- HyperFrames final check: zero runtime, layout and contrast errors/warnings. One existing root nested_structure_needs_subcomposition lint warning.
- C example compiles with -std=c17 -Wall -Wextra -Werror. Input 18 prints age=18; abc and EOF exit with status 1.
- No claim that scanf consumes an entire input line or safely validates arbitrary out-of-range input.

- Final MP4: 74.466667 seconds, 8,479,865 bytes, H.264 1080×1920 30 fps + AAC 48 kHz stereo. Full ffmpeg decode passed; actual video frame inspected.
- Generic renderer regression passed for arbitrary forward/reverse seeks (including detail text and hidden parents); fixes saved back to skill. All 20 existing tests still pass.
- Library usage recorded for both generated assets after successful render.
