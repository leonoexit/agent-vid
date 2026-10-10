# From editorial visual language to explanation

The references' strength is alternation: bold proposition, concrete visual, supporting explanation, next illustrated role. Adapt that rhythm into one programming idea. Do not inherit the website's sales funnel or a mandatory six-stage tutorial.

A useful progression is question → concrete input/situation → mechanism → visible consequence → transferable rule. Merge, repeat or reorder beats as the topic requires. A prediction may begin with an output and trace backward. The question, evidence and conclusion must remain connected.

An anchor can be a word, value, symbol or recurring image, not necessarily an illustrated machine. Use typography-led reasoning when the distinction lives in language or notation: make a claim/question, show evidence, isolate one difference, reveal its consequence, then generalize within scope. A photo/metaphor can establish context without carrying the whole mechanism. See [editorial-imagery.md](editorial-imagery.md) for examples and composition choices.

For each beat, record:
- Viewer question and the minimum prerequisite.
- Exact spoken clause.
- Visible anchor and its identity across shots.
- Before state → operation/focus → after state.
- What is exact evidence versus illustrative metaphor; which layers are a generated plate, isolated raster parts or native text/data.
- Which headline/word is dominant, its intentional line breaks, and what changes at the spoken cue.
- Why this composition/color field helps the current task.

Write these together. If an illustration already communicates the setting, remove redundant screen prose and let the voice explain the mechanism. If a generated icon merely duplicates a heading, enlarge/use it as an anchor or omit it. A constant title with different decorative pictures is not a visual story.

## Worked sample: one Python function

The starter illustrates `double(x)` returning `x * 2`. Input 3 becomes output 6; then input 5 becomes output 10 under the same rule. The workshop illustration identifies a transformation metaphor; actual inputs, code and outputs are native layers. The machine is not a literal CPU or a claim about every function.

1. Ask what a small function does with input 3; show a recognizable workshop anchor and the actual input.
2. Show the body `return x * 2`. Explain substitution and result; the returned value must appear after the operation is introduced.
3. Change only the input to 5, keep the rule/anchor identity, show 10 and explain that the operation is reused.
4. Generalize this particular function's behavior. Do not imply all functions necessarily return values, have one input or are free of side effects.

The actual sample is in template/script.json. Choose a different concrete example for the user's topic. Novices need the terms input/result introduced with the objects; experienced viewers may need a boundary or tradeoff instead. No additional simulation or human character is mandatory for every subject.

## Beat and view planning

Follow [visual-beats.md](visual-beats.md) and fill the project `storyboard.md` copied from the template. Scene labels are too coarse to plan pacing: identify the spoken clause, visible evidence/change, chosen view and what the audience should inspect after the action finishes. Preserve object identity across views; do not equate continuity with a permanently fixed full diagram. When the remaining words have no visual job, simplify the narration or add a truthful consequence/comparison rather than idle motion.

## Review

The voice must form connected prose even when the visual scene changes. The picture must make the example's important change observable, not force the audience to remember several old paragraphs. Explain the consequence while it is visible. Silent intervals need a specific reading/prediction task. Verify the example's semantics and note where an analogy stops applying.

For an image-led beat, plan the reveal/transition/dwell around a specific reading task. Do not stretch one full generated poster across a long explanation with only pan/zoom or breathing. Let evidence, a highlight, a state change or a new explanatory composition advance the thought. Ambient motion alone does not count as a content change.
