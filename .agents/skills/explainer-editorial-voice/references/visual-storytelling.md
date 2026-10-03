# Choose the visual from the explanation

| What the viewer needs to understand | Visual choice | Meaningful motion |
| --- | --- | --- |
| Order or a short procedure | `sequence`, 2–4 steps | Reveal each step at its spoken phrase; then show the whole flow. |
| Two alternatives or contrasting properties | `comparison` | Keep both visible with aligned labels; reveal the second after establishing the first. |
| Connections, ownership, a changing system | `diagram` | Keep node IDs/positions; trace an existing edge, focus the target, then change the value in place. |
| One instruction causes a result | `code` or diagram note + state event | Hold the initial state, show the operation, then expose the result at its spoken cue. |
| A physical object or real-world setting | `illustration` | Establish the whole object; preserve a still image while the explanation names its parts. |
| A quantity or evidence | `stat`, or a project-specific chart | Keep labels/scales fixed. Display supplied values; animate interpolation only when it represents meaningful measured continuity. |
| A definition or recap | `callout`, `checklist`, `quote` | Calm reveal and a reading hold. Extra movement does not help here. |

A diagram is not automatically a process: use arrows only when they represent direction, access, transfer or causality.
Do not connect unrelated examples merely to fill a horizontal row. An icon must identify something in the narration.

## Continuity and attention

For one system, use the same `continuity` ID in consecutive diagram scenes. Define nodes and edges in the first scene;
later scenes contain only events. The renderer creates the model once and holds the final state into the next scene.
New narration headings can change without making the diagram disappear. Use a new ID for a different example.

An effective small sequence is: establish the starting state → focus the operation → trace the relevant connection →
change the affected value → hold the result. Keep unaffected values visible. Do not reset data for visual variety.
Avoid making objects travel if their physical position is not part of the explanation.

`on` anchors use actual wording from the scene's `vo`, ignoring capitalization/punctuation but preserving accents.
Choose an unambiguous phrase; `occurrence` selects a repeated phrase. Anchors use estimated karaoke word timings,
so they require listening and before/after snapshots. `at` is an explicit seconds-from-scene-start alternative for a
carefully tuned cue; never specify both. Silent previews distribute phrase cues by text position rather than speech.

Use `afterOn` for a takeaway that would reveal an answer prematurely, and `resultOn` for a code result. A viewer
should see the changed result long enough to inspect it. Shorten narration or split a crowded model instead of adding
more simultaneous movement. Larger charts, camera moves or diagrams can be built in the individual project when
needed; the bundled renderer supports a small, readable 2–3 node model rather than every possible visualization.

## Test the meaning

For a stateful scene, check the frame before the action, immediately after it, the next scene, and a reverse seek.
Confirm exactly which object changed, which stayed fixed, and whether the direction of the arrow matches the claim.
For code, compare visible values with the actual result. For an illustrative chart/quantity, label that status.
