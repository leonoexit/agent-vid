# QA — C language landscape, curriculum 0.3

## Delivered result

- Bento skill 0.5.0; separate comparative-podcast narrative override recorded in storyboard.md.
- Video: `renders/c-language-landscape-03-9x16.mp4`, **230.50 s**, 1080×1920, H.264, 30 fps; AAC, 48 kHz, stereo.
- Hải Đăng, local VieNeu, speed 1.0, no music. 24 narration sections. The first script read too long; narration was shortened instead of accelerating speech.
- All four requested topics included: C vs Python, JavaScript, C++, and why C remains used. Definitions appear with their first necessary use. Temperature readings and the 100-slot capacity are explicitly illustrative.

## Validation performed

- Skill quick_validate passes; all 32 existing Bento tests pass; project script validator and JS syntax checks pass.
- All 67 reference slides, six shared CSS blocks, inline declarations and 82 Font Awesome icon tags reviewed. Original six HTML hashes unchanged.
- Local FA Free Solid 6.4.0 subset, 16 SVGs plus original license and hashes verified in skill and project. Fonts and their licenses retained. No ImageGen assets.
- HyperFrames check passes; lint has zero errors and the known `nested_structure_needs_subcomposition` warning for the custom root.
- Browser QA visits every section, operation triplets, deferred reveals, and arbitrary reverse seeks. No overflow or settled contrast findings. No reveal leaks. One caption line at every sampled readable frame. Every native committed value is asserted after its write, including the capacity counter incrementing 1 → 2 → 3.
- Minimum measured settled content contrast: **4.95:1**. Charcoal-on-red was 4.06:1 and was replaced with charcoal on white, red border. The lesson was also added to the skill. This is a sampled settled-state result, not an assertion about every intermediate opacity during a fade.
- Rendered scene contact sheets and motion midpoint sheets visually reviewed. The memory/device icon mapping and short trailing caption fragments were corrected before the final render.
- Full final MP4 decodes through ffmpeg with no error. All 24 section samples were also extracted from the MP4 and compared with browser snapshots; visual compositions agree. Pixel differences include compression, color conversion and frame rounding.

## Motion and timing evidence

`custom-motion-review.json` contains real DOM/SVG operation intervals, emphasis spans, deferred reveals and remaining reading intervals. It distinguishes native operations from content/attention changes. Longer holds retain a concrete comparison, definition or concluding rule while narrated. These counts are diagnostics, not proof of audience retention.

The stock `motion-audit.json` deliberately retains warnings: script.json has empty stock event lists because this project authors its own timeline. It cannot measure the custom renderer. We did not fabricate stock events or phase names to make that audit appear green.

## Audio limitation

All 24 full clips were processed with local faster-whisper small. 907 of 959 source tokens received matching word-start anchors; the remainder were monotonically interpolated. The source wording remains intact. `audio-review.json` retains the ASR transcripts and limitations.

**This is automated audio review, not a human listening pass.** ASR makes errors on Vietnamese consonants and names such as Python, JavaScript, C and Linux; those transcriptions alone cannot certify or disprove pronunciation quality. No claim is made that every spoken word or voice nuance has been listened to and approved. Audio is present and decodable in the final MP4.

## Reproduce / boundaries

- From the repository with its dependencies: `node projects/bento-story/c-language-landscape-03/scripts/qa.cjs`.
- Then `.venv/bin/python projects/bento-story/c-language-landscape-03/scripts/review.py` regenerates visual review sheets and custom motion evidence.
- HTML runtime uses the pinned GSAP CDN. Browser QA intercepts it with the bundled matching 3.14.2 copy; license header preserved. The MP4 is self-contained.
- OOP v2, reference HTML and existing user deletions were preserved. No Git commit or push performed.
