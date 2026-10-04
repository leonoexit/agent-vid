# SRP Noir production trial — 2026-10-04

Result: rendered `renders/solid-s-noir-9x16.mp4` successfully. This is the first real narrated test of the v0.2
relation-led guidance, not an aesthetic baseline approved by the user.

## Content and design

One original invoice example; the S in SOLID means Single Responsibility Principle. See facts.md for primary
source, interpretation and limits. The screen uses symbolic state traces, not copyable Python. The executable
example runs actual source versions: refactor preserves the initial output; discount-policy change affects
Calculator only; heading change affects Presenter only; an additional input checks that totals are calculated.
The contract stays numeric total + heading. No claim of eliminating every coupled change is made.

All 19 source slides informed the skill's revised evidence/inference/decision table. The trial implements
containment, extraction of the same nodes, request routes, data transfer, changing code-inspection scale,
visible output verification, and density changes. Fifteen sections are timing units; they are not a layout quota.
No generated images, reference portraits or reference business claims are used. Source references are static;
this project's motion is newly authored. Native CSS/DOM/SVG owns the rendered information.

## Completed checks

- Skill validation and 32 Python tests pass; project script validator passes.
- `scripts/example.py` passes original/refactored equivalence, two actual independent source edits and a second
  invoice input. Results/source hashes are in example-results.json.
- Browser QA samples all 15 settled sections, key operation before/middle/after states and nonsequential seeks.
  61 recorded operations are diagnostics, not a quality target. Zero sampled text overflow, reveal leaks,
  browser errors or external requests. Assertions cover extracted identities, changed total, changed heading,
  and restoring 100000 before the discount trial. See custom-motion-review.json and scripts/qa.cjs.
- Images reviewed across every settled section and important extraction/transfer states. Fixed hidden labels,
  overlapping transitions, an early answer in the header, and an output update that was not visible.
- HyperFrames compiled runtime passes with zero runtime errors and zero layout findings in 9 samples;
  114/114 sampled contrast checks pass. See hyperframes-check.txt.
- MP4: H.264, 1080×1920, 30 fps, 3211 frames, 107.033333 seconds. AAC stereo, 48 kHz,
  107.029 seconds. 12,641,170 bytes. ffprobe recorded in render-metadata.json.
- Full `ffmpeg -v error -i ... -f null -` decode exits 0 without errors. Frames extracted from the actual MP4
  were inspected for font rendering, scene content and visible results.
- Audio is present; mean level -21.6 dBFS, peak -1.5 dBFS. No BGM. Fifteen local VieNeu clips, Hải Đăng, speed 1.0.
  Original wording retained. Local Whisper-small provides 400/439 matched normalized source-word anchors;
  the remaining anchors are interpolated. See audio-review.json and alignment-report.json.
- Source, font, audio and final-file hashes are in media-provenance.json.

## Limits and retained warnings

No manual listening pass is claimed. ASR contains Vietnamese/homophone and acronym recognition errors; it is not
proof of pronunciation quality or exact karaoke synchronization. Listening feedback on the test remains useful.
Visual checks sample states/transitions and do not certify every intermediate frame. User aesthetic acceptance
is pending.

HyperFrames retains the nonblocking nested_structure_needs_subcomposition lint warning: this project registers
one custom timeline with nested scene DOM. The stock motion audit warns because it reads stock JSON events;
this renderer authors motion in custom JS. It is supplemented with real operation/seek evidence rather than
fictional events. Generic template choreography was not changed into an automatic SRP/layout generator.

The rendered project uses local GSAP and fonts and issued zero external requests in browser QA. The portable
skill's generic template still references pinned GSAP on a CDN; the project is not proof that every template is
offline. The MP4 is self-contained. No publishing, commit or push was performed.

## Reproduce

From the AgentVid repository, activate `scripts/activate.sh`. Dependencies/voice models must already be installed.

```sh
python projects/noir-story/solid-s-invoice/scripts/example.py
node projects/noir-story/solid-s-invoice/scripts/qa.cjs
hyperframes check projects/noir-story/solid-s-invoice
hyperframes render projects/noir-story/solid-s-invoice --quality high --output projects/noir-story/solid-s-invoice/renders/solid-s-noir-9x16.mp4
```

Narration/voice changes require new TTS, alignment and project-data synchronization before rendering. Do not run
alignment repeatedly on already-refined timings; timings-estimated.json preserves the initial timing evidence.
