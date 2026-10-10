# Validation scope — 0.6.0

Version 0.6.0 connects narrative choices directly to collage transformations and adds an opt-in generated-paper-label shadow in the production scaffold (`paperLabel: true` / `.paper-label`). Existing photo treatment, prior information-staging guidance and historical projects are preserved. This update does not add a new narrated exemplar. Targeted verification: a local Chrome comparison rendered the existing generated “BẢN SAO” asset with old/new treatments on light and lilac fields at 40% display scale. The new contact/cast shadows followed the cut silhouette, photo styling remained unchanged, and no JS errors occurred. The generated asset itself was not edited. New design-helper syntax and skill frontmatter validation passed. No new narrated video or encoded-motion review was performed for this update.


Version 0.5.1 adds before/during/after information staging to every explanatory beat, the storyboard and full-video editorial review. The user found `projects/cutout/index-zero-v2` visually stronger, but its opening revealed too much before the corresponding narration. This informs a video-wide staging check, not a mandatory gradual entrance for every object. This documentation refinement has not yet been validated in a new rendered video.

Version 0.5.0 tightens opening orientation, semantic continuity, action-led staging and the distinction between editorial and technical review. The storyboard now tests the opening through the first payoff. These are targeted changes following the user's rejection of `projects/cutout/index-zero`: its hook lacked context and its sustained row felt static despite technical passes. That video is not a quality benchmark; neither a new render nor an automated check makes a replacement user-approved. The package still has no curated narrated exemplar.

The 0.4.0 scaffold split and technical checks below remain historical evidence; they do not certify this revision's editorial effectiveness.

The cache example and three raster originals are preserved. Its earlier state/seek/transition checks are historical technical evidence; they are not evidence that a new topic is understandable or engaging. The old revision record lives in `examples/cache-technical/validation-history.md` for provenance only; its superseded art instructions do not apply.

Checked on 2026-10-07:

- Skill frontmatter validation passed; active local Markdown links resolve.
- Four initializer regressions passed: subject-free unfinished default; existing destination refusal; explicitly selected self-contained cache example; unknown example refusal.
- Chrome scaffold check passed: all local resources load, the draft notice and intentional `CUTOUT_UNAUTHORED` error appear, no timeline is registered, and neutral helpers expose no cache composition.
- Fresh explicit cache example passed silent narration sync, store/hit/source conservation, proxy cleanup, reverse seeking and synthetic captions.
- Relocated motion study passed reveal/commit/reframe and reverse-seek checks. Transition study passed 59 seam-coverage samples and reverse seeks with no runtime errors.
- Original cache runtime/assets are preserved byte-for-byte; prompt paths are localized to the example. New helper/story JS syntax checks passed.

Reproduce from the repo root:

```sh
python <skill>/scripts/tests/test_new_project.py
python <skill>/scripts/new-project.py <new-draft>
node <skill>/scripts/tests/scaffold-browser.cjs <new-draft>
python <skill>/scripts/new-project.py <new-example> --example cache
python <pipeline>/scripts/sync-narration.py --project <new-example> --music-only --no-bgm
node <skill>/scripts/tests/browser-smoke.cjs <new-example>
node <skill>/scripts/tests/choreography-browser.cjs <skill>
node <skill>/scripts/tests/transitions-browser.cjs <skill>
```

`<pipeline>` is the sibling Bento skill. Browser tests use workspace puppeteer-core and Chrome at the standard macOS path. These checks are technical, not a new playback/listening review. No TTS, finished production, encoded export or renewed HyperFrames check was performed in this restructuring. Production still requires its own model checks and audio/video review.
