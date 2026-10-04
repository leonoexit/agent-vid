# Noir SRP v2 review

This revision responds to the user's rejection of v1. It is a new candidate, not an approved style baseline.
The script, word timing, voice configuration and all fifteen voice clips are byte-identical to v1; see
controlled-comparison.json. No new TTS or listening certification is implied.

## What was checked

- All settled sections, before/mid/after native operations and reverse seeks in scripts/qa.cjs. No sampled
  overflow, future-reveal leak or browser runtime error. Amount restores to 100000 before the discount run,
  becomes 90000 after it; heading restores before the formatting change.
- Three muted action triplets with headings/captions hidden: actual code extraction, computed-value handoff and
  proportional subtraction. All settled sections were visually inspected in contact sheets and selected full frames.
- HyperFrames compiled check: no runtime errors, no layout findings across 9 samples; 122/122 sampled contrast
  checks pass. The known nested_structure_needs_subcomposition warning remains nonblocking.
- Skill 0.3 frontmatter validation and 36 Python tests pass. Four new tests verify that custom reframes/text do not
  erase model gaps, gaps cross scene boundaries, overlapping spans merge, and invalid times are rejected.
- Existing executable invoice example is unchanged and checks actual source revisions with two inputs. Onscreen
  snippets are symbolic state traces, not copyable Python. A changed policy marks the result unknown until rerun.
- Custom model-stillness audit retains seven global intervals longer than three seconds. They are explicitly
  reviewed in motion-review.md; no attempt is made to make the warning count zero with decorative operations.

## Limits

This is sampled visual/technical QA. It does not certify every transition frame or user satisfaction. The original
ASR-based timing has known recognition/interpolation limitations and no manual listening pass. Same audio was
reused so the visual difference can be judged directly.

Terminal layers, local diffs, role discs, projecting badges, dark-source/light-output contrast and inline type
emphasis are implemented. The original reference's dimensional raster background scenes are not used; native
planes and glass are a partial depth adaptation. No source portraits, authority claims or CTA are imported.

The encoded output is H.264, 1080×1920, 30 fps, 3,211 frames / 107.033 seconds, with AAC 48 kHz stereo audio.
Actual encoded frames were inspected at 17, 52.5, 71 and 86 seconds. This exposed a subtraction label partially
occluded by its moving segment; the label was moved outside its path and checked at 70.5, 71, 71.5 and 72 seconds
before rerendering. Audio helper scripts now resolve this project from their own location instead of pointing to v1.

Final render metadata and hashes are recorded by render-metadata.json and media-provenance.json. The final file
is decoded in full and actual encoded frames are checked after rendering. No publishing, commit or push.
