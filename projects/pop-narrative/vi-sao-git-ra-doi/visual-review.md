# V2 review — 2026-10-09

## User-reported defects and correction

The previous review verified text fit inside paper and layout bounds, but missed cross-component overlap. The purple 2005 strip covered “Cần công cụ mới” at 22.2–23.17 s. In the requirements passage, a retained computer, branch bundles and their label competed for the same space. These were composition/QA failures, not blank-frame or video-codec failures.

V2 separates paper and text vertically, retires the computer before the branch arrangement, gives each bundle its own destination, and resets transform percentages during movement. Short entrance/exit collisions found by the full-frame check were also removed. History bundles no longer travel through machine labels; new-change cards have a separate lower lane. A real, dated and credited portrait of Linus replaces anonymous generated hands.

## Browser verification

- Reusable skill audit: 1,656 frames at 30 fps; zero text/text or text/paper intersection findings in V2.
- The same checker with the previous story detects five distinct text/paper pairs, including the reported sentence hidden under the purple strip. This establishes that the added check catches the observed defect.
- 24 sampled compositions, six joins at ±1 frame, text fit and reverse-seek comparisons pass. No browser page errors.
- HyperFrames runtime/layout: no errors or warnings. Contrast 38/38 at sampled times. The existing nested-composition lint warning remains; it does not concern overlap. HyperFrames' built-in motion check is disabled, so it is not claimed as validation.

## Specific image-bound candidates reviewed

The geometric checker conservatively includes transparent image margins, transformed rectangles and font line metrics. It does not establish whether pixels overlap. All remaining categories were inspected in sampled compositions:

- Opening “Vì sao” / GIT and “ra đời?” / GIT or computer: visible lettering is separated; rectangular/font bounds are larger than visible ink.
- Opening BitKeeper/free-use and loss labels / computer: paper deliberately covers the lower case/keyboard edge, not the screen. Loss label / penguin overlaps the lower body, leaving head and recognition silhouette visible.
- Loss scene free-use label / computer: the label sits just above the monitor; a rotated bounding corner is included. The 2005 label covers the base of the computer; the monitor and the separate conclusion remain clear.
- Payoff “Cộng tác tiếp.” / computer and penguin: intentional foreground banner over lower silhouettes, leaving monitor/head visible. “Ở quy mô lớn.” / computer: below the significant machine features. Both paper statements stay separate from each other and captions.

These are specific retained layer relationships, not an exemption for all images or labels. All requirements-scene collisions, history/name crossings and history/change-card overlaps were removed.

## Review limits

Full-frame checks assess geometry, not aesthetic quality or factual meaning. Visual review uses sampled images and critical encoded intervals; no claim of continuous human audiovisual playback or independent transcript alignment. Speech is unchanged from V1; word timestamps remain estimated. See sources.md for evidence and portrait attribution.

## Encoded V2 result

Final file: renders/vi-sao-git-ra-doi-v2-9x16.mp4. H.264 Main/yuv420p + AAC; 1080×1920, 30fps, 55.2 seconds. Full ffmpeg decode completed without error. Browser MP4 validation passed at 28 timestamps and playback advanced normally. Visually inspected encoded 22.9 s, 27 s and 38 s: formerly hidden sentence is clear, three branches are separated and the Linus portrait/credit/Git/commit card are legible.
