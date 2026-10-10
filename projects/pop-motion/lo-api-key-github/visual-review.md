# Visual and causal review

## Story and source scope
The film follows one simulated public-repository leak: delete the current line, discover the previous commit, consider a copied key, revoke at the provider, replace application configuration and review usage. The hypothetical copy is narrated conditionally. No real secret, breach or bill is claimed. Source map and caveats are in `sources.md`.

## Checks
- 25 browser samples: images/fonts decoded, no page errors, paper text fits, reverse seeking stable.
- 8 causal state assertions: original key visible; current line deleted; historical key visible; new revision still clean; both copies present; both disabled; provider reports Revoked; replacement configured.
- Readability scan: 1,317 frames at 30fps, zero text/text or text/paper failures after corrections.
- Two conservative image candidates concern the stick figure's full transparent raster rectangle at 4.87–7.03s. The original raster has broad transparent margins, clipped by the figure's CSS viewport. Actual visible figure stays at the right between the commit label and subtitles; inspect encoded 4.9/6.4s. No overlap exemption for its opaque figure pixels.
- Moved disabled keys upward so their tips do not intersect the “HẾT HIỆU LỰC” lettering. Provider enters after keys vacate its region. Two commit windows have separate settled and travel regions.
- HyperFrames lint: 0 errors, 2 inherited structural warnings. Negative-z paper pseudo-element has an isolated parent stacking context and is visible; the nested paused GSAP composition is the established renderer structure. HyperFrames check run, final result in `qa/check.json`.

## Review limits
Narrator is Hải Đăng at original local TTS speed. No music or SFX. Word timestamps are estimated, not forced-aligned. Review consists of sampled browser/encoded frames, deterministic state assertions, brief real MP4 playback and full decoder validation; it is not a claim of complete human listening or retention validation.

## Art direction
Corose headings; JetBrains Mono body/paper; Inter UI/captions. New minimalist hand-drawn stick figure and photographic brass key were generated with the built-in image tool, with exact prompts/provenance preserved. Asset reuse has no numerical quota. This video's real mechanism is shown through editable native UI; the physical keys explain copied access and invalidation.

Final encoded review: 43.9s, 1080×1920; 25 MP4 sample seeks passed, playback advanced, full FFmpeg decode returned no errors. Inspected opening deletion, historical key, duplication, provider revocation, replacement and closing comparison. The viewer was moved down after encoded inspection to leave a visible gap under the commit paper while remaining above captions. Cover critical copy fits the square crop.
