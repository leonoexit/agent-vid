# Creation checks — Noir 0.1.0, revised in 0.2.0

Created 2026-10-04 from the Bento 0.5.0 workflow. No approved Bento project or original reference was edited.

## Reference and style evidence

- Read all 1,646 lines in six HTML files; rendered/inspected all 19 slides (18 + alternate cover).
- Reviewed all six style blocks/configs, inline overrides, 24 Font Awesome icon elements, heading/body/code
  hierarchy, glow/noise layers, all actual image references and the static nature of the HTML.
- Local source assets and original HTML bundled byte-for-byte; source-manifest.json records all 25 input files.
- [Full index](ref-index.md) maps every slide to adaptation and implementation status.
- Source contact sheets: [1](source-contact-1.jpg), [2](source-contact-2.jpg), [3](source-contact-3.jpg),
  [4](source-contact-4.jpg), [5](source-contact-5.jpg). These show design evidence, not a fact-checked tutorial.
- [Six portrait compositions](preview.jpg) and [editable HTML study](composition-study.html) demonstrate the
  style's different spatial relationships. All six fit 1080×1920 with no detected canvas overflow. This study
  is static, has no narration and is not the default runtime template.

## Runnable scaffold and checks

- Skill quick_validate, Python tests (32), VI/EN script validators and renderer JavaScript syntax pass.
- Fresh VI and EN projects created with new-project.py; sync run as `--music-only --no-bgm`.
  Their 104.1s / 98.8s are estimated silent test timelines, not produced voice durations.
- Browser QA inspected all 12 sections per language, operation before/middle/after frames, state after copy/write,
  backwards/forwards seeks and scene exclusivity. Values resolve to x=20,y=10; reverse seeking restores x=10,y=10
  and earlier x=10,y=— correctly. No browser errors or sampled text overflow remain.
- [Runtime contact sheet](runtime-preview.jpg) shows the actual scaffold, including a moving token. Individual
  screenshots and the QA runners are local under `.cache/noir-skill-review/` in the authoring workspace.
- Synthetic full-phrase word timings tested dark caption highlights, connection color and morph: neutral dark
  surface #141417, pale violet identity preserved, reverse seek restores purple tint. No audio was synthesized.
- All three local fonts contain the Vietnamese glyphs sampled in the review phrase. Space Grotesk upstream TTF
  is unmodified; inherited Inter/JetBrains derivatives retain hashes and OFL notices.
- HyperFrames check passed for both language projects: zero runtime errors, zero layout issues across 9 samples
  each, 62/62 text contrast checks per language. The inherited `nested_structure_needs_subcomposition` warning
  remains. This does not certify every caption/transition frame or all possible custom projects.

## Deliberate adaptations and limits

Deep violet text, overly dim inactive text and tight heading line boxes were adjusted for legibility. Default
spotlight now keeps text fully opaque and uses a thin focus outline. Explicit dim values still need review.
Code, morph, connection and karaoke colors use the new theme. Whole scenes use display+visibility to prevent
visible descendants from escaping inactive parents.

Template API is the inherited trace engine. Terminal/pair/rail/question/stat CSS primitives are shipped, while
project-specific nesting, camera, stack/reflow and rail choreography are authoring recipes. No fake events or
built-in layout names were added. Plain-text JSON remains plain text. Generated-image library starts empty.

At initial 0.1.0 creation, no new TTS recording, manual listening pass or final MP4 render was performed.
Voice defaults remain Hải Đăng / Kokoro am_michael. GSAP 3.14.2 still loads from a CDN in generated HTML; browser
QA supplied matching local bytes. Font/icon availability is local, but HTML is not certified offline.

Machine-readable source/browser/state evidence: [validation-report.json](validation-report.json).


## v0.2: relation-led revision and narrated SRP trial

The six initial studies are now explicitly documented as phase-based surface/type specimens, not six latent
reference patterns. [Reference reading](reference-reading.md) separates visible evidence, inferred function,
authoring decisions and failure modes for every slide, including the alternate cover. The composition guide
requires an information relationship, viewer task, hierarchy, geometry, reading path, provenance and native
before/action/after operation. There is no layout quota or phase-to-layout mapping.

[SRP case study](srp-case-study.md) records the implemented transformations and repairs in the first real test.
The local project has 15 sections / 107.02 seconds, synthesized Hải Đăng voice, no BGM, local pinned GSAP, and custom
persistent-node choreography. Browser QA samples all settled sections, important operation triplets, future-reveal
visibility and reverse seeks. HyperFrames check passes: zero runtime errors, zero layout findings in 9 samples,
114/114 contrast checks. The known structural warning remains. A Python example checks actual source edits,
refactor-equivalent output, both independent change requests, and a second monetary input.

These checks are scoped evidence, not proof of every frame or user approval. There is no manual listening
certification; ASR matched 400/439 normalized source words, with interpolation for remaining caption anchors.
Project qa.md records final MP4 verification. The portable template remains a trace API fixture; the case-study
choreography is project code rather than a new built-in layout API.


## v0.3: user rejection supersedes the v0.2 technical pass

The user rejected SRP v1 as too static and lacking many reference design traits. The prior numerical QA is retained
as technical history, not aesthetic or motion acceptance. Bento's copied instructions already addressed those
problems; the missing part was applying and reviewing them in the production.

The skill now supports browser-exported custom operation spans. Only model changes clear its model gaps; title
writes, fades, focus and ordinary reframes cannot. Global gap detection spans section boundaries. Regression tests
cover exclusion, cross-boundary gaps, overlapping spans and invalid times. The revised SRP project is a controlled
visual rebuild using the same narration. Its QA and review documents report actual results and remaining limits.


## v0.4: portable editorial reflow

User feedback accepts SRP v2 with reservations and subsequently accepts v3 on 2026-10-04.
The entrypoint and case study record that feedback separately from technical test results. Three opt-in geometry helpers and an editable, playable assignment
study ship in every project. The helpers require explicit start/end properties and stable IDs, use reversible GSAP
tracks and report only reframe spans. They are also used in three SRP v3 passages.

The real-browser study check exercises 18 forward/reverse seeks, heading-area release, code expansion, deferred
answers, retained primitive result, overflow and audit classification. Browser QA uses matching local GSAP 3.14.2
bytes in place of the CDN; this is not offline certification for the shipped HTML. To repeat:

```sh
node <skill>/scripts/tests/editorial-browser.cjs <new-project> <chrome-executable> <local-gsap-3.14.2.js>
```

SRP v3 compiled check: no runtime or sampled layout issues, 119/119 contrast checks; inherited nonblocking nested
structure warning remains. Intermediate checks exposed headline/chrome, moving data/code and result/label overlaps;
these were repaired by reserving paths and sequencing reveals. Direct-file overflow alone missed them.
Project qa.md records final browser, motion and encoded-file verification; sample checks do not certify every frame.
The original trace engine/JSON schema remain a fixture. No automatic compositor, raster background generation,
new voice recording or blanket reproduction of the reference is claimed.
