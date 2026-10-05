# Terminal visual revision — Code Noir 1.1

Parent project: ../terminal-la-gi. The original video is retained. This version preserves script, narration clips, timings and stored voice preferences and replaces the page-block renderer with a visual score.

Implemented: terminal/shell roles, coherent outline folder/file assets, current-directory pin, progressive filesystem branches, visible path joining, root-versus-current path trace, pin movement on cd, and an explicit missing-child target for the error. Native typography still carries exact commands and outputs. No Remotion or generated raster images are needed for this topic.

The original command verification remains recorded in the parent project's NOTES.md. This revision does not introduce new terminal-command claims. Existing narration's broad simplifications, pronunciation and estimated word timings are inherited; no new listening or factual review is claimed.

QA before render: browser sampled 18 timeline states including backward seeks; no JS errors or text overflow. Repeated state after backward seek produced identical pixels. HyperFrames check passed runtime/layout/motion and 79/79 text contrast checks after fixing overlapping command transitions and marker/cross positioning. The known nested-composition editor warning remains. Representative frames and browser-qa.json are included. Final media verification is recorded after export.

Final export: renders/terminal-la-gi-visual-v2-9x16.mp4; 94.0 seconds, 1080×1920, 30 fps, H.264 + AAC, 6,046,007 bytes. Full ffmpeg decode completed without errors. Media frames around the directory-marker transition and missing-child result inspected after encoding. Narration pronunciation/alignment retains the original review limitation.
