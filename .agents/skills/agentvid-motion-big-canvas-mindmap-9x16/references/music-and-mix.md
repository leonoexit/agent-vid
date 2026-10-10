# Music, beat sync and mix

## Generate
`data/music-plan.json` is an ElevenLabs composition plan: BPM, key and instruments in `positive_global_styles`, the intent
of each part in its section. ElevenLabs does not honour section lengths, so expect the drop in the wrong place and fix
it with the arrangement, not by regenerating. Own music instead: copy it to `assets/audio/music/bgm-raw.mp3`.

## Read the grid
`fit-beat-grid.py` prints `BPM`, `BEAT0` and one row per bar: kick marks (`K`) and loudness. Loud rows with `KKKK`
are the drop; quiet rows without kicks are intros/breakdowns; a sudden jump from quiet to loud is where a build resolves.

## Arrange (data/music-arrangement.json)
- Put the fitted `bpm` and `beat0` in. Each segment copies whole bars: `{ "to": [a, b], "from": c }` means target beats
  a–b take the source beats starting at c. Use multiples of 4. The first segment must start at 0.
- Pick the story's big moment (usually a `statement` scene or the first feature) and make its beat the target start of
  the segment copied from the source drop. Take the 16 beats before the source drop as the build before it.
- A gap between segments is a silent stop (a shout line right before the drop).
- `fadeOut.beat` = where the music fades; end the last segment a few bars later.
- Verify: `python scripts/verify-arrangement.py .` must print `ok` for every segment.

## Timeline (data/timeline-config.json)
| Key | Meaning |
|---|---|
| `duration` | video length in seconds; ≥ last voice end + 3–5 s for the outro |
| `tempo` | speed-up of energetic lines (1.08 for Gemini EN; 1.0 for VieNeu) |
| `kick` | beat ranges `[from, to)` where the full beat plays: drives pulses and stronger cut flashes |
| `drops` | beats that get the big flash + shake |
| `anchors` | `{ "<scene>": { "scene": T, "lines": [T, null, ...] } }`, T = seconds or `{ "beat": n, "plus": s }` |
| `musicDb` | music vs voice before ducking (default -3). Each +1 dB moves the measured balance ~1 dB: measured 9 dB under → set musicDb ≈ +1 |
Scenes without an anchor cut on the first beat after the previous voice ends. Anchor the drop scene's `scene` to the
drop beat; anchor the outro to a calm part.

## Mix targets (measured on the reference videos)
Music ~4–6 dB under the voice in the busy section (`measure-mix-balance.py . --body <start> <end>`), final mix
−14 LUFS, true peak ≤ −1 dBTP (render-and-verify checks both). ~10 dB under reads as "there is no music".
