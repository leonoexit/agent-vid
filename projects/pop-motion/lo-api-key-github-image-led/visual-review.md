# Review — image-led trial

User approved the accent revision on 2026-10-09; its direction is now incorporated into Pop Motion v0.2.0. The checks below describe the preceding project-only test stage. Skill SHA256 comparison: all 41 files unchanged (see exact count in `qa/skill-unchanged.json`). Original project preserved.

## Completed checks

- Browser: 25 sampled frames, scene boundaries, reverse seeking; no JavaScript errors or paper text-fit failures.
- Causal assertions: 10 passed. Current page loses key; historical page retains it; copied key opens service before revoke; fails after revoke; replacement opens service; closing shot keeps old key invalid.
- Readability: all 1,317 frames at 30 fps; no text/text or text/paper failures. Two conservative raw-image bounds candidates reviewed: COMMIT CŨ sits below opaque document pixels; entering receipt is clipped by picture stage above captions. Sprite image raw bounds include transparent padding and are not visibility bounds.
- HyperFrames lint/runtime/layout/contrast check: zero errors. Warnings include nested timeline structure, negative-z paper pseudo-elements and raw sprite bounds outside clipped wrappers; actual paper labels are visible in encoded samples. Contrast check: 50/50 passed.
- Final H264/AAC MP4: 1080×1920, 43.9 seconds, 25 decoded browser samples, playback advances, no video error. FFmpeg full decode completed without reported errors. Inspected encoded contact sheet across all sections and cover square crop.

## Scope and limits

Reuses existing Hải Đăng audio and estimated karaoke word timing; no new transcription or forced alignment, no full human listening claim. Lock/key and USAGE paper are symbolic illustrations, not literal service UI or evidence of an incident. The image-led direction is a test, not a demonstrated engagement improvement. No skill update until user feedback.

## Opening accent revision

Added yellow marker wipe behind API key and white question underline swipe; one small question emphasis on the spoken negative answer. Browser review rerun: 25 samples and reverse seeks passed. Opening checked at 30 fps (212 frames): heading within safe bounds, no collision with image area. Skill hash comparison remains unchanged. Encoded revision QA: `qa/mp4-accent-review.json`. Prior delivered MP4 retained separately.
