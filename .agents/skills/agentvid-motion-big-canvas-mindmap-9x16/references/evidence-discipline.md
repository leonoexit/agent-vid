# Evidence discipline

One rule set for every step that turns observations into decisions: analysing a reference, writing facts into a
script, reporting a render gate, debugging. Short on purpose: apply the principle, the details follow from it.

1. **Sort every claim** into one of three kinds before using it:
   - **observed**: a receipt exists (file, frame, timestamp, tool output). Cite it.
   - **inferred**: reasoned from observations. State the assumptions that make it true.
   - **open**: not answerable from what you have. Write it as a question.
2. **Stay inside the evidence.** A claim is as wide as its sample: 3 frames describe 3 frames, not "the whole video";
   one page of a brand guide is not the brand. Say the sample size when you generalise.
3. **Make it traceable.** Important claims carry an id (`ledger_id`) that leads back to the file or time they rest on.
4. **Look for the counter-example before you commit.** Before choosing a route, a style or a root cause, search for one
   observation that would contradict it. Record where you looked, found or not.
5. **Measure what can be measured.** Durations, loudness, colours, sizes, word rates come from tools, never estimates.
   If it cannot be measured, say so instead of inventing a number.
6. **Act in proportion to risk.** Low-risk inferences (an easing, a font size) may go into the build. An open question
   that changes the route, the rights, the cost or a fact shown to viewers goes to the user.
7. **Report deviations, do not hide them.** A worker that cannot follow its brief reports what differs and why; the
   coordinator decides. Nobody silently widens their own scope.
8. **Numbers in, impressions out.** "Done" means the gates passed with measured values quoted, not "looks good".
