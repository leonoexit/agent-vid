# Continue attention across a boundary

Choose a handoff based on the relationship between passages: carry the same result into a comparison, let a foreground piece reveal the next arrangement, or reframe an existing group around a detail. A clean cut is valid when the thought changes. Do not animate every boundary merely to advertise a transition.

For a shared anchor, match visible bounds, scale, orientation and attached labels at the join. For a cover/reveal, keep the outgoing evidence visible until the incoming layer actually covers it. Incoming and outgoing motion should share a direction and easing when they form one gesture. Never hide a page early and expose an empty canvas flash. Avoid repeated whole-page pushes as the only editing language.

The `push` helper is a tested geometry fallback, not the default art direction. `examples/cache-technical/transition-study.html` demonstrates it silently; it does not prove a good join against speech. Inspect the boundary at normal speed, then at its midpoint and ±1 frame. Captions stay in the fixed HUD. Check reverse seeking and actual encoded frames as well as the browser preview.
