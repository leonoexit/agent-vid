# Director mode and lean mode

Roles and models: `agent-roster.md`. Evidence rules: `evidence-discipline.md`. Motion vocabulary: `craft.md`.

## Pick the mode
| Mode | When | Who |
|---|---|---|
| **director** | new look or style mix, long video (> ~45 s), a launch that matters; the runtime can spawn subagents or call another CLI | director + 2–4 builders + mechanic + verifier |
| **lean** (`--lean`) | public niche skills (style already locked), short videos, runtimes without subagents, tight budget | one session plays every role; every gate still runs |
Lean never means fewer checks: it means fewer readers. Read only SKILL.md, the chosen style's `profile.json` +
`choreography.md`, and the pipeline reference.

## Director mode, step by step
1. **Director** writes facts → script → `data/style.json` (`base` + per-scene styles, by slug or alias from the
   style catalog) → storyboard.
2. **Still gate** (director): render one still per scene before any animation (snapshot mode of the kit) and review the
   contact sheet: layout, contrast, overflow, one idea per scene, the style reads at a glance. Fix before building.
3. **Builders** (2–3 scenes each, in parallel) get a scene brief, never the conversation:
   ```json
   {"scene_id": "s04", "window": {"start": 21.2, "end": 29.6}, "lines": ["…"], "anchors": [{"word": "blueprint", "at": 23.1}],
    "style": "blueprint-engineering", "scene_type": "diagram", "choreography_ref": "styles/blueprint-engineering/choreography.md",
    "files_allowed": ["scenes/s04-*.js"], "forbidden": ["index.html timeline", "other scenes", "audio"]}
   ```
   Return: the scene fragment + the kit's check for that scene + `{"status", "deviations": []}`.
4. **Mechanic**: voice/alignment, beat grid, mix, lint fixes, snapshots, render and gates.
5. **Director review**: contact sheet + deviations → director notes in `craft.md` terms ("push in 1.08 on 'director'",
   "slam on beat 12") → builders fix. Max 2 rounds, then **escalation** role.
6. **Verifiers**: logic (gates, numbers, facts on screen, timing) and creative (taste) on models different from the
   builders. Findings go back as director notes.

## Scene brief rules
- One scene type per brief; the choreography of that type in the style is the default, not a suggestion.
- A repeated scene type follows the same choreography every time (consistency beats novelty).
- Builders report deviations instead of widening scope (another scene, the timeline, the audio are off limits).

## Report
Quote measured gate values, the number of director rounds, which roles ran on which models, and open questions.
