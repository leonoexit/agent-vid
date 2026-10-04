# Skill-local generated cutouts

Contents: selection → generation/variants → installation → usage → metadata.
Everything reusable lives under **this skill's assets/library/**. Do not create a project-wide/shared catalogue,
modify another skill or scan its images for candidates. Project copies are portable outputs, not another library.
No dependency/API key is needed for the catalogue helper. Image generation is performed by the available built-in
tool; the helper writes briefs and registers results, it does not itself call a generation service.

## Optional workflow: after choosing generated art

Read narrative-framework.md first. Name the exact spoken anchor, phase, subject, editorial role, safe zone and
entrance/exit. “Friendly mascot” or “fills space” is not enough. Prefer different topic-specific subjects/compositions
where the story's question changes; keep palette/linework consistent. A recurring character needs a concrete story
role or an explicit user request.

An asset with `review.status: "rejected"` is excluded by select, install and variant request. Preserve its image and
history for old projects. A later explicit request to reconsider it warrants a revised brief/review, not silent reuse.
This status records actual feedback; it does not require user approval for every future generated image.


Plan the main explanation in native HTML/CSS/SVG first. Plan generated art as a visual anchor for decoration, a background,
or a contextual figure in a scene. It can suggest the topic or mood; it cannot be the main explanatory element,
a changing program state, or the source/destination of data. Do not start this workflow for simple objects better served by icons/native SVG. No image count or omission justification is required; zero generated assets is normal.

Keep exact code, values, addresses, labels, containers and relations native. Do not place data in a pictured cavity,
trace a relationship between generated pixels, or use OCR to recover geometry/text. The explanation must remain
understandable when the image is hidden. In storyboard.md, name the art's supporting role and keep its zone separate
from code, captions and the animated model.

Run `python <skill>/scripts/asset-library.py select --role <role> --state <state> --query <short-subject-terms>`.
Use `--importance support` for secondary cutouts. Optional: `--subject <exact-subject-alias>`, repeated
`--action move|scale|rotate|fade|...`,
`--project <dir>` (exclude this video's own prior use), `--limit 5`.

Example: `select --role locator --state blank --query 'địa chỉ con trỏ' --action fade --importance support --project <dir>`.
Roles are descriptive IDs, e.g. container, locator, ordered-collection, decision-point or sticker. States describe visible
conditions, e.g. open, blank, stacked or waiting. These describe the pictured subject, not its authority in the
explanation: existing container/locator assets are still secondary art. Register roles/states as actual art needs arise.

The helper filters style, role, state, capabilities and an optional exact subject alias. Search terms match normalized
metadata/aliases (Vietnamese accents ignored); it ranks textual fit first and recent-use counts second. It reads the
local catalogue but returns only a shortlist. This is keyword retrieval, not semantic understanding: decide whether
the picture supports the scene without carrying the narrated operation, and try simpler aliases when the query misses a suitable image.

Return values:
- `reuse`: choose a compatible candidate, then install it. A novel image never outranks a wrong role/state.
- `variant`: when `--importance hero` is explicitly used for a prominent contextual figure, all compatible families
  appeared among the last 6 recorded videos. Here hero means visual prominence only, never the main explanatory
  model. Prefer a different suitable figure or make a targeted variant. Reuse is permitted when
  continuity or meaning warrants it. This recommendation does not automatically spend time generating an image.
- `generate`: no candidate matches the requested metadata/query. Check the short query, then reconsider whether a native/icon composition is sufficient. Request new art only if the
  storyboard independently justifies generation. The main explanation stays code-native.

The catalogue may include rejected assets and historical use. Existing files and usage are not approval. Select only eligible art; generate only already-justified images, not merely request JSON. A missing library match does not establish a need for generation. Preserve identity within one video; vary content
and visual identities across videos. Support props may repeat. Cosmetic variants share one family so usage stays visible.

## Creating a new asset or variant

`python <skill>/scripts/asset-library.py request --project <dir> --id <new-id> --family <new-family> \
  --subject '<concrete object>' --role <role> --state <state> --operation '<secondary visual role in the scene>' --tag '<search aliases>'`

For a variant, use `--variant-of <existing-id> --change '<specific change>'` instead of inventing a new family.
A new visual identity gets a new family; a new color, pose or state of the same prop retains its family.

For a decorative sticker, set `--role sticker`. The helper uses `references/asset-style.json`'s sticker prompt:
transparent, text-free and composed for the stated narrative role in a dedicated safe zone. A sticker is not an explanatory entity and cannot
represent a buffer, value, relationship or result.

The command saves asset-requests/<id>.json with the full prompt and metadata. Use its prompt with the built-in image
creation tool and `transparent_background: true`. For variants, reference the parent image using the tool's supported
reference mechanism. Copy/register the actual generated local PNG; do not substitute another skill's imagery or
silently use a paid/API fallback. If generation is unavailable, report that and proceed with suitable existing/native art.

`python <skill>/scripts/asset-library.py register --image <generated.png> --metadata <dir>/asset-requests/<id>.json`

Add useful English/Vietnamese aliases before registering. The command retains the full prompt in the asset's
metadata.json, stores an immutable image and updates the compact catalogue. Duplicate IDs/bytes are rejected.
A flat cutout can move/scale/rotate/fade for a secondary entrance or transition. Use native geometry for explanatory
operations such as opening a container, filling storage or changing data; do not build their mechanics from generated parts.
Do not declare a capability the artwork does not support. Register new versions rather than overwriting old images.

## Installing a selection

`python <skill>/scripts/asset-library.py install --asset <id> --project <dir> --entity <entity-id> \
  --reason '<how this image decorates or contextualizes the scene>'`

This copies just that image to assets/illustrations/<id>-<hash>.png, attaches image/alt to the existing script entity,
and saves asset-manifest.json with a stable video UUID, family, image hash, entity and reason. It does not change voice
or narration, record a view, copy the whole library, render a video or initiate QA/OCR/audits.
This template provides a side-by-side illustration/data zone for cards at least 300×250 (readers 300×160).
Create a fresh project with new-project.py. Installing into an older template is refused; explicitly migrate a
project copy first if needed, preserving any custom renderer work.
Use card/ticket for a static prop. A box with an `open` cue uses native lid geometry; do not attach a flat cutout to
pretend its photographed lid moves. A large hero illustration still needs a distinct native zone for exact state;
use it only as a contextual figure and keep it separate from labels, slots and transfer destinations.

Install a sticker separately so its provenance is recorded without attaching it to a data entity:

```bash
python <skill>/scripts/asset-library.py install-sticker \
  --asset <sticker-id> --project <dir> --sticker-id <scene-sticker-id> \
  --reason 'keyboard context when the narration introduces typed input' --x 18 --y 18 \
  --width 112 --height 112 --rotation -6 --scenes 1,3
```

The command copies the immutable PNG into `assets/illustrations/`, adds a `stickers[]` entry to `script.json`, and
records the file hash/family/reason in `asset-manifest.json`. Review the generated coordinates against the code,
caption and takeaway zones; keep zero to two stickers per scene. For a persistent ornament, remove `scenes`. Prefer `manual: true` and explicit `sticker` show/react/hide events
for speech-driven choreography; the install helper sets geometry/provenance, then edit script.json for these cues.

## Backgrounds and contextual figures

The helper manages transparent PNG cutouts attached to entities and the separate sticker layer; it is not a background-layer installer.
For a full background or contextual scene image, use the corresponding prompt in asset-style.json, generate with
`transparent_background: false`, and save the local result under the video's assets/illustrations. Record the exact
prompt, file and secondary role in that project's asset request/storyboard. Extend the project's renderer for the
background or figure layer; do not disguise a full background as a data entity. Do not claim the cutout helper has
registered or counted an image it cannot handle.

Keep backgrounds quiet with a clear central content area and no generated text/code. Place native explanatory
cards above them on an opaque or sufficiently solid dark surface. A figure may occupy a dedicated scene zone;
it remains contextual, while native diagrams show every operation and result.

## Recording actual use

After successful rendering, run `python <skill>/scripts/asset-library.py record --project <dir>`.
It records library images still attached to scripted entities with a show cue and installed stickers present in
`stickers[]`. It counts each asset/family once per video, irrespective of scene count. Re-recording an edit updates the
same video; it does not inflate counts or move an old video to the newest position. Failed/canceled drafts are not
recorded. No external publishing is performed.
These are authored video uses, not measured impressions or retention analytics. Manually changed illustration layers
need their manifest/show linkage updated before recording; the helper does not inspect pixels or OCR a rendered file.
The history file is created on first real use; no other skill’s asset or usage history is copied.

## Metadata and persistence

An asset is registered with id, family, style, role, subjects[], states[], capabilities[], tags[], description,
and origin {kind, tool, prompt, reference_asset_ids?}. Optional variant_of points to an existing asset in the same family.
Registration adds a file path, sha256, dimensions, alpha-channel flag and added_at. An alpha channel is file metadata,
not a claim that every background pixel was visually inspected. Keep the tool's generated transparency intact.

- assets/library/catalog.json: compact searchable records; do not load the entire catalogue into the prompt.
- assets/library/<id>/image.png and metadata.json: original bytes and complete provenance/prompt.
- assets/library/usage.json: chronological unique video uses, created when recording the first completed video.
- references/asset-style.json: this skill's generation recipe, default capabilities and recent-use window.

JSON files are inspectable and require no external service. Run metadata-changing commands one at a time; a short
skill-local lock prevents simultaneous catalogue/history writes. Preserve the catalogue and history when moving or
updating this skill. Project copies and manifests preserve old videos even as the library grows.
