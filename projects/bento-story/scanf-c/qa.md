# Production QA — scanf C / bento

- Final: renders/scanf-c-bento-9x16.mp4; 61.367 seconds; H.264 1080×1920 at 30 fps; AAC stereo 48 kHz.
- Narration: local VieNeu-TTS v3 Turbo, Hải Đăng, speed 1.0; 7 clips, no background music. Explicit holds 0;
  3.50s total lead/tail outside voiced clips. Full file decodes successfully with ffmpeg.
- Script/schema validation passes. C17 example compiled with -Wall -Wextra -Werror and passed input 18,
  matching failure abc, and EOF checks.
- HyperFrames: no runtime, layout or contrast errors; inherited nested_structure_needs_subcomposition warning only.
- Reviewed scene contact sheet and transfer checkpoints: 19 frames including each section boundary, both transfers'
  before/middle/after, and final states. Reverse seek across age=18 restores age=0, then returns to age=18;
  &age remains unchanged. Exact C operator != is rendered without typographic ligatures.
- Audio QA: local faster-whisper-small transcription of every clip plus signal/loudness checks; not a human listening
  pass. The recognizer can mishear technical terms. Script spelling is preserved. The initial timing estimator had
  nonmonotonic spans in two clips; corrected with recognizer anchors and interpolation. All 255 word spans are now
  monotonic and inside their audio sections. Cues remain estimates, not word-perfect forced alignment.
- Sources and limitations: facts.md. No external publishing. No generated images/library assets were used.
