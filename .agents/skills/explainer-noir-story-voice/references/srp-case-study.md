# Production trial: S / Single Responsibility Principle

The first narrated v0.2 trial follows one invoice through two independent change requests. The user rejected this trial for static pacing and insufficient design character.
It is a failure case, not an approved style baseline. Project in the AgentVid repository: `projects/noir-story/solid-s-invoice`.
It is optional evidence; the skill does not require that project to exist when copied elsewhere.

## What was implemented

- A shared `Invoice` boundary contains calculation and presentation. The same two DOM nodes leave that boundary;
  their labels change to `InvoiceCalculator` and `InvoicePresenter`. Shared data remains outside the new boundaries.
- Small request sources point into the large owner being inspected. The arrows explicitly mean requests here.
- The extracted peers reflow into a data path. Numeric tokens travel between them; arrows now mean data, with labels.
- Pricing code becomes the large reading area while unchanged presentation becomes a smaller witness. After the
  discount changes, the new total appears in an actual invoice output. Unchanged code can receive changed data.
- The next trial reverses the active owner: presentation expands, pricing contracts. A new heading appears on the
  output while 90,000 remains. Same verification grammar supports comparison rather than forced visual variety.
- The calculator then contains three related functions, countering the one-responsibility-equals-one-method mistake.
- A sparse definition follows observed evidence. The ending retains the known request sources and owners.

Fifteen voice sections are editorial timing units, not fifteen layout categories. Six narrative phases do not
choose six visual patterns. The static reference supports the grouping/hierarchy choices; movement and timing are
newly authored. No carousel portraits, authority badges, CTA, performance claims or generated images are imported.

## Concrete repairs discovered during production

A direct-file browser pass was insufficient: HyperFrames 0.8.75 hoisted external scripts during compilation.
The project now initializes DOM-dependent code on DOMContentLoaded and registers its timeline there, while keeping
the expected registry declaration in HTML. Test compiled playback as well as the local file.

An opaque owner hid scene labels placed behind it. Labels now occupy a deliberate foreground layer. A data tile
crossed the owner header on first reveal; its starting rectangle was moved into its reading zone. A travelling
number crossed a destination title; its arrival point moved into the destination's free area. The returning
Presenter is revealed after its repositioning so it does not cross the Calculator's text.

A phase header originally exposed the next answer early; it now contains only phase/context. The first pricing
verification originally updated a hidden output; it now visibly shows the received amount. These are meaning and
reading-order repairs, not extra decoration.

## Evidence and limits

The project stores storyboard.md, facts.md, an executable source-revision example, custom-motion-review.json,
hyperframes-check.txt, voice/timing records, ASR review, and qa.md. Important operation triplets and all settled
sections were sampled. Reverse seek checks restore old identities/amounts; future reveals stay hidden. The stock
motion audit does not understand this custom JS; its warnings are retained, not silenced with fictional events.

The rendered trial uses Hải Đăng at speed 1.0 with no music. ASR anchors refine original-word captions; unmatched
words use interpolation. ASR is not a manual listening pass or a guarantee of exact pronunciation/synchronization.
See the project's QA for actual render metadata and remaining limitations. User aesthetic acceptance of v1 was explicitly rejected.


## v0.3 rebuild: a controlled comparison, not a certification

Repository project: `projects/noir-story/solid-s-invoice-v2`. Same voice clips, script and timing. Changes occur in
the visual explanation: a receipt opens into its source file; data passes through two methods; independent pending
patches attach to exact operations; the same code strips leave the shared file; a numeric segment is subtracted;
the computed amount reaches the print; old/new headings are compared with aligned amounts. Three cohesive
operations execute inside one calculator. The rule is grounded in grouping actual known code labels.

Fine design features implemented: terminal chrome and layered source/output, selective italic/accent phrases,
role discs/top edges, code insets, local old/new diff rows, a numbered execution rail, a projecting question/check
badge, light print evidence, oversized actual result, and a quiet layered native plane. Raster 3D backgrounds from
the source are still reference-only. There is no claim that CSS atmosphere completely reproduces them.

The custom audit separates model spans from reframing, disclosure, attention and chrome, and finds gaps across cuts.
Read the project's motion-review.md for remaining intervals and actual reading tasks. The user accepted v2 as substantially better and usable, while noting minor defects and incomplete reference
fidelity. That acceptance is user feedback, distinct from technical test results.


## v0.4: portable editorial operations and a focused v3 trial

The accepted v2 remains unchanged. `projects/noir-story/solid-s-invoice-v3` reuses its exact narration/timing and
changes three passages: opening (section 0), two-part refactor (6–7), and output comparison (12). Headlines release
space, selected file/code pairs gain reading priority, and a known large result makes room for aligned evidence.
The helpers used there also ship in `template/editorial-motion.js`. A separate playable 15-second assignment
study in every new project shows how to adapt them without depending on the SRP repository files.

This adds tested geometric building blocks, not a general automatic compositor. Raster depth, arbitrary charts,
branch layouts and full adaptation of every source composition are not claimed. The user accepted v3 on
2026-10-04 and authorized committing/pushing the current state. See its QA for measured checks and the preserved
audio limitations; further perfection is not required for this baseline.
