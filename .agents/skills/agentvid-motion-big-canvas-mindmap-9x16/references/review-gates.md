# Review gates (before a video is published or sold)

The session that built the video does **not** approve it. Ask another party to run the gates and stamp them. Use the gates
for the owner's own channels and for every demo that is posted publicly or sold; for a throwaway draft they are optional.

| Gate | When | Run | Reviewer must |
|---|---|---|---|
| **A content** | after `data/script.json` and `data/storyboard.json`, before voice and music | `python scripts/review-motion-script.py --project .` | read `review/content-review.md`, resolve every warning (fix it or write why it is fine), open each source in `data/facts.md`, answer the checklist |
| **B UI** | after `build-timeline`, before render | `python scripts/review-ui.py --project . --capture` | open `review/ui-contact-sheet.jpg` and the frames in `snapshots/`, answer the checklist |
| **C render** | after render | open the MP4 at the hook, one frame per scene and the outro; with a voice, read the transcript and caption timing | confirm it matches what gate B approved |

Render with the guard on (it refuses unless A and B passed on the **current** files, and records what produced the MP4):
```bash
node scripts/render-and-verify.mjs --require-review        # or set "review": {"required": true} in data/theme.json
```
Record each verdict (the reviewer and the builder must be different; a pass with warnings needs `--notes` saying how each was resolved):
```bash
python scripts/review-gate.py stamp --project . --gate A --reviewer "<who>" --reviewer-kind model|subagent|human --author "<builder>" --verdict pass --notes "..."
python scripts/review-gate.py stamp --project . --gate B ...
python scripts/review-gate.py stamp --project . --gate C --artifact renders/<video>.mp4 ...
python scripts/review-gate.py status  --project .                      # stale or missing gates exit 1
python scripts/review-gate.py require --project . --purpose sale       # a demo that is sold: A, B and C, each stamp naming its reviewer kind
```
Editing the script, storyboard, composition, data or assets after a stamp makes it stale: review again.

## How strict
- **Own channel**: A and B must pass (the render guard), C is recommended. Any reviewer kind is fine.
- **Sold demo** (`--purpose sale`): A, B and C must pass and every stamp names its `--reviewer-kind`. Prefer a different model or a person for C;
  a fresh subagent is acceptable for A and B.

## Who reviews when only one tool is installed
1. A different model or tool (for example Codex reviewing a Claude build).
2. A fresh subagent of your own tool with only this task: *"Review the video project at <project>. Run the gate script, read the report, open every cited source and each frame, answer the checklist item by item and list every defect with the file and field. Do not edit any project file; run the `review-gate.py stamp` command yourself with your own name as reviewer. End with PASS or FAIL."* The builder only fixes and re-runs; it never runs the stamp for it.
3. The person who requested the video, stamping with their own name.

The builder reviewing its own work in the same session is not a review. The script only compares the two names: this is procedural
separation, not proof of identity, so keep the stamps honest.
