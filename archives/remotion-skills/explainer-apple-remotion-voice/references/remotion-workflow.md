# Working starter

`assets/template` is self-contained after dependency installation and voice generation. It uses Remotion 4.0.532 / React 19.1.0, local Inter and JetBrains Mono. Preserve the lockfile and font licenses.

```sh
python <skill>/scripts/new-project.py <project>
# Or use --example if-else for the form/condition/gate example.
# In this workspace, source scripts/activate.sh from the repository root first.
python <skill>/scripts/tts.py --project <project> --engine vieneu --voice 'Hải Đăng'
# Run the following from the new project:
npm ci --ignore-scripts
npm run sync
npm test
npm run stills
npm run render
```

The workspace's cached install can use `npm ci --ignore-scripts --offline --no-audit --no-fund --cache /Volumes/LeNguyen02SSD/Programming/agent-vid/.cache/npm`. Local TTS may use `HF_HUB_OFFLINE=1` after models are installed. Else run the bundled `setup-voice.py`; do not infer that missing models are installed. `REMOTION_BROWSER_EXECUTABLE` overrides Chrome discovery. Browser rendering may require the host's sandbox approval. Run the skill validator with a Python that has PyYAML.

`script.json`: `language`, `slug`, `example`, `intro`, `scenes`, `outro`. Each section has `title`, `vo`, optional `phase` label and `cues:[{id,on,occurrence?,offsetSeconds?}]`. `captionAliases` can map pronunciation tokens to displayed identifiers (the example maps “ích” to `x`) without changing audio timing. Cue IDs are unique; repeated phrases need an occurrence. `readingHold:{seconds,task}` adds an explicit 0–3s reading interval. There is no enforced phase sequence. TTS writes `timings.json`; sync rejects changed narration with stale audio, resolves cues and copies narration to `public`. `src/generated.json` is generated, not a template asset. Cue corrections without changed narration only need sync; narration changes need TTS again.

The example requires cues `createX`, `copyStart`, `changeX` and parameters `{initial:5,replacement:9}`. `src/model.mjs` samples state and transfer progress; `Lesson.jsx` renders it; `Root.jsx` supplies narration and captions. A new subject replaces model/diagram rather than keeping assignment semantics. `CameraRig.jsx` / `camera.mjs` use world coordinates and pure `cameraAt(frame, initial, keys)` with key `{at,duration,to:{x,y,zoom,roll}}`. The shared world is now1080×1920; shot targets are in `shot-plan.mjs`, assets in `Assets.jsx`. Headers/code/captions are screen overlays. The copied token follows the actual interpolated source/destination centers, so it stays attached when layouts change. Transitions must settle before action cues.

For stills: `npm run stills -- --frames=100,200,300`. The default samples sections and cue boundaries, but add transfer midpoint/arrival frames. The starter supports `--props=qa/alternate.json` with `{visualExample:{initial:2,replacement:8},muteNarration:true}`; alternate values require muted speech and captions to avoid contradicting the original voice. Final output is `renders/<slug>-9x16.mp4`. Tests check state semantics and timing failure cases; they do not assess whether the lesson is easy to understand.

Retained voice helper/source license: `agentvid-source-license.txt`; this fork does not broaden the original source's redistribution permissions.

Motion repair v0.4: `transitions.mjs` provides `sectionLayers`, `poseAt`, `glyphState`. `SculptedTile` uses fixed360px geometry and transform-only scaling. The if/else starter routes via `visualMode:gate`; its model requires cues `ageFirst,testFirst,deny,ageSecond,testSecond,open`. Its two-run script requires firstAge<minimum and secondAge>=minimum. Change the model as well as the script for another narrative. No phase vocabulary is enforced by the timeline compiler itself.
