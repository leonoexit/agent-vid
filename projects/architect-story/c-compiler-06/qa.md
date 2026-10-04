# Compiler 0.6 — delivery checks

Date: 2026-10-04. First Architect production; user aesthetic acceptance pending.

- Final: `renders/c-compiler-06-9x16.mp4`, 133.600 seconds, 1080×1920, 30 fps, H.264 + AAC 48 kHz, 17,440,236 bytes. ffmpeg full decode exited 0 with an empty error log.
- Voice: local VieNeu Hải Đăng, speed 1.0, paragraph gap 0.2; no BGM. Text reduced before increasing speed. 16 voiced sections; 8 seconds total boundary padding across the whole production.
- Audio check: local faster-whisper transcription of all sections, with matched-word anchors plus interpolation refining original script timings. Original estimates retained in timings-estimated.json. ASR occasionally misrecognizes Vietnamese consonants and code terms; this is not proof of manual listening or perfect word synchronization. A full manual listening pass is not claimed.
- Script validator passed. Real C compiled and ran with Apple clang 16.0.0: stdout `Chao ban!\n`, exit 0, source retained. See example-results.json and scripts/check_example.py.
- Skill: 40 unit tests passed, covering inherited narrative/reveal/motion/pacing and new plate functionality. Skill creator quick_validate passed. All local Markdown links resolve; source manifest matches four HTML files / 80 slides plus source assets.
- New-project smoke passed: Vietnamese fixture validates and syncs; browser loads its trace and local fonts/GSAP. Editable motion study passed 16 forward/reverse seeks, deferred result, stable copy, plate crop and reframe/model classification.
- Demo browser checks passed: no runtime errors, no text overflow across 16 scene samples; reverse seeks reproduce source/program/greeting/compiler geometry and text. 23 before/middle/after triplets cover model operations of at least 0.19 seconds. Additional assertions check hidden future stdout, hidden executable before creation, and retained source afterward.
- Muted triplets inspected with shot headings and captions hidden. Tokens retain explicit source/destination labels; source, generated program and observed stdout remain distinct. All scene samples inspected; cover and stdout frames also extracted from the final MP4.
- HyperFrames check passed: runtime 0 errors; layout 0 issues across 9 samples; 97/97 text contrast checks passed. Lint retains only the inherited nonblocking `nested_structure_needs_subcomposition` warning. The final HTML waits for DOM readiness before building the timeline.
- An early 26.4-second compilation segment was rendered and inspected before full export. Its separate HTML is retained as `prototype.html.fixture` so it cannot become an accidental second runtime entrypoint. It is an earlier visual trial, not the final deliverable.
- Motion audit retains narrated reading/interpretation intervals. See motion-review.md for each interval and task. Plate camera/crop, typography, fades and karaoke do not count as model work. Continuous model mutation is not claimed.
- Three built-in ImageGen outputs were inspected, registered, installed and observed visible in scenes before usage history was recorded. Prompt/provenance: asset-requests/*.json and asset-manifest.json. All runtime media is local; original generated files were left in place.

Implemented source characteristics: editorial perimeter/header, very heavy Vietnamese type, monospace detail, ivory/pastel/dark rhythm, ruled native artifacts, selective offset shadow, image-led opening, illustrated analogy, cropped chip detail, bordered annotation, changing reading area. The source's portraits, branding, predictions, all 80 exact layouts and unrelated photographic looks remain reference-only. This is a 2D composition with generated depth cues, not a Three.js scene.

No old skill or accepted demo was edited. Existing workspace deletions were preserved. No commit/push performed.
