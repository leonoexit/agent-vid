# Illustrated reasoning and tempo

The zero-indexed trial exposed a weak default: nearly 97 seconds, one opener illustration, then headings/note boxes. Narration about adjacent cells and moving one position had no spatial demonstration. The hand kept writing previous claims while new evidence appeared. Fix the staging and editorial rhythm; more decorative hand motion will not address either problem.

## Plan the visual explanation

For each meaningful spoken clause, record: what the viewer sees before, what becomes visible/changes, why it supports the clause, and when it must be ready. Useful changes include choosing a cell, revealing a route, comparing two states, crossing out a wrong selection, and returning to an annotated illustration. Sometimes an intentional reading hold is the right choice.

- **Typography:** state a short question, term or conclusion. Avoid duplicating the entire narration.
- **Memphis art:** establish a concrete situation or recurring visual anchor. Bring it back where it helps, with a crop, companion variant, new labels or changed focus. Generate separate cutouts if they need independent motion.
- **Native diagrams/code:** show exact arrangements, values, arrows and outcomes. Use these for the mechanism instead of writing “the cells are adjacent” inside a note box.

Do not impose a fixed count of images or an animation every few seconds. A scene nevertheless needs a visual reason to exist. If all substantive explanation after the hook is a stack of text cards, revise the storyboard before voicing it. `layout: example` merely styles blocks; it does not construct an explanatory diagram. Author project-specific HTML/SVG/GSAP when needed, keeping deterministic paused-timeline behavior.

For an indexing lesson, a possible visual is three adjacent slots with one item each. Point at the first while marking offset 0, then move the pointer one slot and mark offset 1. Put ordinal position and zero-based index on separate labelled rows. Reuse the same prop in the recap. This is an optional staging example, not a claim that every language indexes from zero or that every list is contiguous memory.

## Keep voice and picture together

Treat the voice recording as the timing reference. `monotonic-v2` timestamps are estimated from word lengths and pauses; their monotonic order does not guarantee word alignment. Inspect at least the opening, a mechanism transition and the recap against actual audio. If exact listening/alignment cannot be checked, report that rather than claiming sync is verified.

Use a content cue and a completion deadline. An item needed to understand a clause should be readable when that clause uses it, not several seconds later. Writing is a brief accent: select short words and let the hand leave before attention moves to an image, result or next claim. The helper now bounds writing against all block reveals, not only other writing jobs. Overlong/crowded phrases fall back to an ordinary reveal. This prevents collisions; it does not invent a good visual sequence.

Keep default voice speed/gaps unless user preferences or the recording justify changes. Shorten repeated questions, definitions and recaps before altering speech speed. Do not insert scene-end holds uniformly. A prediction/reading hold needs a specific task and enough material to justify it; calculate the actual gap after speech, including pipeline padding.

## Review the finished MP4

Record timestamps for the longest unchanged main-content interval, any hand/next-focus collision and scene-end silence. Ignore karaoke and hand movement when judging whether the explanatory picture develops. Review image/native evidence alongside narration, not only still screenshots. Do not infer listening review from a timing JSON or validator pass.

Check technical claims before polishing. Distinguish a teaching analogy from a language guarantee, state units in address arithmetic, and do not assert execution cost solely from how a source expression looks. Qualify takeaways instead of promising that one mnemonic prevents all future errors.
