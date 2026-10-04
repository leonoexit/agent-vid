# Noir narrative contract: one question, one visible trace, one rule

This is the default required writing structure for this skill. Preserve the approved connected progression and
progressive disclosure; do not import the business skill's sales arc, numbered list narration, chat demo or savings.
A materially different content format belongs in another skill. An explicit user request can override this default.

## Stage-to-screen contract

| Stage | What the viewer needs to understand | Narration job | What appears / moves | Keep hidden | Exit condition |
| --- | --- | --- | --- | --- | --- |
| question / intro | There is one concrete uncertainty | Ask about an observable outcome in this example | Situation, relevant pair or input; one focal question | Answer, final value, rule | Viewer knows what to watch for |
| setup | Which objects exist and their starting state | Name objects, then their known values in the same order as the reveals | Objects enter separately; initial fields/code appear as named | Future results and unused notation | Starting state is readable |
| decode | How the next instruction refers to these objects | Explain each necessary symbol through its job in the example | Isolate symbol, highlight its object, assemble the instruction incrementally | Unexplained future code and outcome | Viewer can follow the upcoming operation |
| execute | What actually changes, and why | Link action clauses to changes and consequence clauses to committed state | Source focus → native operation/token → commit → result text; repeat for needed steps | Result until operation completes | Trace reaches its actual final state |
| verify | What the result proves about the opening question | Inspect values, compare unchanged state, check a return value or relevant condition | Result detail, comparison, check line or labeled contrast | Unrun alternative presented as actual output | Opening uncertainty is resolved by visible evidence |
| rule / outro | What to reuse next time | State one takeaway and a necessary boundary | Compact recap using the same objects/notation and observed result | New concepts, new unexplained mechanism, generic CTA | Takeaway matches the demonstrated example |

Keep the order. Each middle phase gets one or more shots; a phase is not a fixed-duration slide. Within execute,
repeat the small action→consequence loop for an iteration or multi-step operation. A changed example or alternative
branch belongs only where it helps verify the same claim; clearly label it as a separate trial and reset its state.
Do not add a failure branch, prediction pause or metaphor when the concept does not need one.

## Write from the picture and the next question

First write `story.question`, `story.example`, and `story.takeaway`. Then map the stages and fill the score before
polishing vo. Each row contains phase / exact spoken clause / visible-before / primary focus / native reveal or action /
visible-after / asset role / next question. A change in what the viewer must inspect normally creates a new beat;
a change in the local question normally creates a new shot.

Narrator stance: calmly investigate the example together. Use concrete subjects and verbs. Name an object before
using its unfamiliar notation; say what an instruction does before generalizing. Connect clauses with their real
logic: “now we have…”, “so the next instruction…”, “after that write…”, “look at what stayed…”. Do not mechanically
repeat those words or begin every scene with its number. Avoid isolated bullet-point facts and definition-first lectures.

A useful local sentence pattern is **known object → action → observable consequence**. Match each part to a cue.
A short question/topic heading can appear at the shot start. Technical explanations and answer text open at their
spoken clause; do not dump the full subtitle/code/result at the beginning. Earlier known state can remain visible.
Captions transcribe speech; they do not substitute for a visual explanation.

Example beat: “Số vừa đọc” focuses the converted value; “được ghi vào biến” sends and commits the token;
“bây giờ biến giữ mười tám” opens the result. If the speech reaches the result before the token arrives, shorten the
travel or begin it earlier in the action clause. Do not hide poor alignment behind a post-speech hold.

## Map the accepted scanf progression

| Stage | Shot jobs | Main visual evidence |
| --- | --- | --- |
| Question | How does typed 18 reach age? | Input / variable pair, answer withheld |
| Setup | Create age=0; introduce typed characters | Distinct native variable and submitted-input history |
| Decode | What scanf needs; %d; &age; complete call | Format and address tied to existing entities; staged code |
| Execute | Convert characters; write the integer | Two native transfers with correct commit timing |
| Verify | Value versus address; count assigned items; check n | age=18, unchanged address, n=1, guard |
| Rule | Format tells how, address tells where, check success | Same symbols and result in a compact recap |

This approves the narrative/visible causal sequence, not the robot assets or an obligation to duplicate fourteen shots.
The source assignment samples use the same framework: question → x/y initial state → assignment notation → copy and
update → inspect y and explain no rerun → integer assignment copies the current value.

## Visual medium follows the explanatory job

Choose a native representation before considering supporting illustration. Common objects can use one coherent
icon family; properties, methods, ownership and operations use editable groups and exact native text. There is no
image-per-phase requirement. A generated scene is appropriate only when its narrative contribution exceeds what
an icon/native composition can communicate. Explain that choice before spending on generation.

Alongside each spoken clause, name the composition and the actual model transformation. For example, “contains
state and behavior” should group those elements within their owner; “calls the method” should resolve the receiver
and method; “changes state” should commit its field. Revealing those sentences as subtitles is not the same visual
interpretation. See composition-grammar.md for examples grounded in the reference.

## Review before voice/render

Check that every phase is present and ordered, the opening question is answered, and the rule follows from the result.
Read vo while following the score: each new claim must have visible evidence or a planned reveal; future answers stay
hidden. Check the native state after every operation and preserve what did not change. Review assets independently
from narration: approving a script does not approve its images. Structural validation cannot judge these semantics.
Use motion_audit.py and story-motion.md for clock-level pacing and choreography; no extra approval workflow is implied.
