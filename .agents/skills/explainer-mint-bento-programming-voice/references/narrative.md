# One object, useful related views

The reference invites a glance from an object to its count, detail, status or history. Use that affordance to explain state. The viewer follows a specific operation and sees why nearby information changes. The teaching unit is a connected example, not a tour of attractive tiles.

## Routes to choose from

**Action and consequence:** establish just enough current state, perform one meaningful action, inspect what changed and what stayed. Fits array push/pop, queue operations, an event handler or changing one argument.

**Detail and summary:** make a compact quantity or status concrete by opening its source detail. Show how the detail supports the summary, then change one relevant input. Fits array length, count queries, cache hit/miss or a request's status. Never imply a summary UI controls the underlying model merely because it animates first.

**Same task, different outcome:** preserve the task/input and show a second condition or mechanism. Align corresponding evidence before stating the distinction. Fits shallow copy versus shared reference or awaited versus pending results, with appropriate audience prerequisites.

These are writing choices, not required stages or a layout enum. A result-first question can be suitable; a tutorial need not begin with a problem/failure. Keep the claim within what the example establishes. One object can have two views; those views are not necessarily independent objects.

## Narration and staging

For every meaningful clause name the focal object, current state, operation, result and reading task. Bind the clause to the exact point where evidence changes. Introduce labels when they become useful: “ô này là số phần tử của chính mảng bên cạnh.” Explain the consequence while the result is visible, not after cutting to a new decorative composition.

A title asks; the main tile demonstrates; a small chip preserves a needed fact. When a detail becomes important, give it area rather than compressing the whole layout. Reframe when the viewer's task changes; preserve state and identity across that reframe. Source cohesion comes from rounded surfaces/palette/type, not one frozen full-screen dashboard.

Stage the interface according to the spoken task: establish the object's identity, expose the content needed for the question, perform the operation, then emphasize the affected value or open its detail. A header/type badge can remain as orientation while a row or counter changes; do not read every micro-label aloud. A selected tab or expanded panel must clarify the current view, rather than imply a second execution. Collapse or remove supporting chrome when a mechanism needs more room. The richer UI vocabulary is not a reason to add more unrelated facts.

Use gen-img only if a meaningful real-world referent needs it. Core mechanisms should be native values, code, rows, pointers, groups or state markers. Don't add an unrelated illustration to compensate for a narration-only scene.

## Starter: JavaScript Array.push

Begin with items = [A, B]. Show `items.push("C")` and move C to the end. Commit the third item and length=3 together when the append completes. Open a closer view to explain that the list and length tile describe the same state. Repeat with D to produce [A, B, C, D] and length=4. Conclude that push mutates this existing array by appending; length reflects its item count. The starter does not teach push's return value, sparse arrays or immutable update patterns.

A duration/shot count isn't a storytelling rule. Keep a reading view still if it supports the current clause; otherwise reduce duplicate narration or show a relevant comparison. Avoid both constant incidental motion and a sequence of static UI screenshots with only fading titles.
