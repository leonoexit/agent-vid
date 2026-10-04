# Skill-local generated cutouts

Contents: selection → generation/variants → installation → usage → metadata.
Everything reusable lives under **this skill's assets/library/**. Do not create a project-wide/shared catalogue,
modify another skill or scan its images for candidates. Project copies are portable outputs, not another library.
No dependency/API key is needed for the catalogue helper. Image generation is performed by the available built-in
tool; the helper writes briefs and registers results, it does not itself call a generation service.

## Selection from the storyboard

Plan the main explanation in native HTML/CSS/SVG first. Choose generated art only for decoration, a background,
or a contextual figure in a scene. It can suggest the topic or mood; it cannot be the main explanatory element,
a changing program state, or the source/destination of data. Omit it when it adds no visual value.

Keep exact code, values, addresses, labels, containers and relations native. Do not place data in a pictured cavity,
trace a relationship between generated pixels, or use OCR to recover geometry/text. The explanation must remain
understandable when the image is hidden. In storyboard.md, name the art's supporting role and keep its zone separate
from code, captions and the animated model.

Run `python <skill>/scripts/asset-library.py select --role <role> --state <state> --query <short-subject-terms>`.
Use `--importance support` for secondary cutouts. Optional: `--subject <exact-subject-alias>`, repeated
`--action move|scale|rotate|fade|...`,
`--project <dir>` (exclude this video's own prior use), `--limit 5`.

Example: `select --role locator --state blank --query 'địa chỉ con trỏ' --action fade --importance support --project <dir>`.
Roles are descriptive IDs, e.g. container, locator, ordered-collection or decision-point. States describe visible
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
- `generate`: no candidate matches the requested metadata/query. Check the short query, then request new art if the
  library lacks suitable supporting art. The main explanation stays code-native.

The current small starter collection is not a universal metaphor set. Preserve identity within one video; vary content
and visual identities across videos. Support props may repeat. Cosmetic variants share one family so usage stays visible.

## Creating a new asset or variant

`python <skill>/scripts/asset-library.py request --project <dir> --id <new-id> --family <new-family> \
  --subject '<concrete object>' --role <role> --state <state> --operation '<secondary visual role in the scene>' --tag '<search aliases>'`

For a variant, use `--variant-of <existing-id> --change '<specific change>'` instead of inventing a new family.
A new visual identity gets a new family; a new color, pose or state of the same prop retains its family.

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
The v0.3 template provides a side-by-side illustration/data zone for cards at least 300×250 (readers 300×160).
Create a fresh project with new-project.py. Installing into an older template is refused; explicitly migrate a
project copy first if needed, preserving any custom renderer work.
Use card/ticket for a static prop. A box with an `open` cue uses native lid geometry; do not attach a flat cutout to
pretend its photographed lid moves. A large hero illustration still needs a distinct native zone for exact state;
use it only as a contextual figure and keep it separate from labels, slots and transfer destinations. The starter box is visibly open, and cannot represent a closed state.

## Backgrounds and contextual figures

The helper currently manages transparent PNG cutouts attached to entities; it is not a background-layer installer.
For a full background or contextual scene image, use the corresponding prompt in asset-style.json, generate with
`transparent_background: false`, and save the local result under the video's assets/illustrations. Record the exact
prompt, file and secondary role in that project's asset request/storyboard. Extend the project's renderer for the
background or figure layer; do not disguise a full background as a data entity. Do not claim the cutout helper has
registered or counted an image it cannot handle.

Keep backgrounds quiet with a clear central content area and no generated text/code. Place native explanatory
cards above them on an opaque or sufficiently solid light surface. A figure may occupy a dedicated scene zone;
it remains contextual, while native diagrams show every operation and result.

## Recording actual use

After successful rendering, run `python <skill>/scripts/asset-library.py record --project <dir>`.
It records only library images still attached to scripted entities with a show cue. It counts each asset/family once
per video, irrespective of scene count. Re-recording an edit updates the same video; it does not inflate counts or move
an old video to the newest position. Failed/canceled drafts are not recorded. No external publishing is performed.
These are authored video uses, not measured impressions or retention analytics. Manually changed illustration layers
need their manifest/show linkage updated before recording; the helper does not inspect pixels or OCR a rendered file.
The history file is created on first real use; starter assets are not falsely marked as already used by older demos.

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
