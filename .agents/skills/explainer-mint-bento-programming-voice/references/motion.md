# Controlled UI motion with explanatory state

The supplied image is static. Motion here is an authored adaptation: short purposeful translations, an item joining a list, a detail expanding, a summary becoming a chip, or a status changing after its condition is met. Use ease-out for opening/focus and ease-in-out for travel; settle before result inspection. Avoid idle float, continuous card wobble, spring overshoot on data and decorative camera patrols.

Native data and the caption HUD have separate responsibilities. Maintain identity labels/colors across reflow, and reserve a consistent caption region. A diagonal accent must not pass across code or current values. Important reading surfaces stay level.

For a linked-state action define a commit time. An in-flight token is not yet a committed list item. At arrival reveal/update the actual model and derived count/status together, remove the traveling proxy, then inspect the result. Do not double-count the proxy as data. If the illustration is a copy, preserve its source; if it is a move, update the source appropriately.

Use the actual word timings in PLAN. The bundled cue resolver falls back to estimates only for an explicitly silent preview. All transforms and discrete state changes belong to the paused GSAP timeline, without wall-clock timers, mutable onComplete state, random layouts or CSS autoplay. Arbitrary reverse seeks must restore both visuals and values.

Review before, mid-action and after; count model items separately from a traveling proxy; compare every linked view at commit. Check the longest spans with no new evidence and record the viewer's task. Reframing, fading, highlighting and a changing palette are staging, not model changes. A browser test covers its own assertions, not general comprehension.
