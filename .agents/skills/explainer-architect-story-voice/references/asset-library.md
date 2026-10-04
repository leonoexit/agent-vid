# Image plates and native explanation

New generated images serve as abstract backgrounds. Plan palette/material, quiet reading region, crop and why the background is useful. Keep source/operation/result as native geometry; the background carries none of those roles. No quotas: zero images is valid. Full-canvas size is compatible with a secondary role.

Brief: ivory negative space, restrained pastel translucent planes or material folds, soft directional light; no letters, diagrams, arrows, UI, literal programming props or objects pretending to be the computation. Keep the active region quiet. One background can span multiple shots; no image-per-scene rule. A topic in the brief describes the lesson context, not an instruction to paint its mechanism.

Use an absolute layer behind the native model, with pointer-events:none. Put code/captions on opaque ivory or dark surfaces when needed; do not solve background contrast by reducing text opacity. Keep pastel fields, thin framing, rulers, large type and selective offset shadows even without imagery. Hide the background during QA: the operation and outcome must remain clear.

Use the built-in ImageGen tool, one call per distinct asset. Opaque plates use transparent_background=false; cutouts use true. Preserve actual returned pixels/alpha. No API-key fallback without explicit user request. Save exact prompts, input reference roles and returned origin in project asset requests. Copy all used assets into the project.

The existing `request`, `register`, `select`, `install`, `install-sticker` and `record` commands are inherited. `request --background opaque|transparent` defaults to opaque except stickers; new requests record usage: abstract-background. Transparent backgrounds are abstract layers, not character/prop stickers. Entity/sticker installation is retained for compatibility. `register` accepts RGB/RGBA PNGs; requested transparent art must have an alpha channel. It does not visually certify transparency. Review the actual image before registration.

```
python <skill>/scripts/asset-library.py request --project <dir> --id <id> --subject '<lesson context>' --role plate --state quiet --operation '<atmosphere and reserved reading area>' --background opaque
python <skill>/scripts/asset-library.py register --image <generated.png> --metadata <dir>/asset-requests/<id>.json
python <skill>/scripts/asset-library.py install-plate --asset <id> --project <dir> --plate-id <scene-art-id> --reason '<why it appears>'
```

`install-plate` writes plates.json (`plates`: id, image, alt, background, usage) and asset-manifest.json with hash, family, plate ID, reason and full origin/prompt. It refuses duplicate plate IDs and corrupt source bytes. It does not change script.json, create timeline events or record a use. Project code chooses the plate's geometry and when it appears; use a separate background DOM layer; native subjects sit above it. Legacy metadata without usage is marked legacy-unspecified, not silently relabeled. Static image pixels are not a model-operation endpoint. Refer to the image's native frame or a clearly labeled overlay.

After a successful render export actual visible plate IDs to plate-usage.json (`{"plates":["id"]}`), then `record --project <dir>`. Only matching installed and reported plates count. This evidence is deliberately independent of arbitrary timeline implementations. Do not count installed-but-unused art. Record again after an edit updates the same video entry.

Keep IDs immutable, reject mismatched styles, preserve source hashes and retain rejected-art history. Background and crop changes are reframes. The exact style prompt is in asset-style.json; keep historical metadata intact, but do not reuse a literal-subject plate as the new background default.

`select` defaults to assets tagged usage: abstract-background. Use --include-legacy only to maintain an existing project; this does not reclassify its old illustrations.
