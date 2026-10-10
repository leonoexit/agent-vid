# Starter storyboard — Array.push

Replace for the requested topic. Main object: one JavaScript array items. List and length are linked views of this object, not two independently modified arrays. The moving letter is a proxy until the append commits.

| Beat | Cue | Native before → action → after | Reading task |
| --- | --- | --- | --- |
| Question | question | [A,B], length 2 → show push(C) | What should change? No premature C or length 3 |
| Append C | code, append | Show line → C moves to end → commit [A,B,C] and length 3 together | Existing A/B keep their order |
| Result | result | Native committed state stays | Explain changed count while it is visible |
| Detail | inspect, match | Same state; promote count and open source list | Three items correspond to 3; no new execution |
| Append D | code, append, result | [A,B,C] → D joins → [A,B,C,D], length 4 | Same operation, changed input |
| Rule | rule | Four-item array with concise scoped conclusion | push mutates this existing array |

Before TTS record actual planned focus and result reading windows per clause. After sync record real times and important before/middle/after evidence. A still inspection is intentional only while the viewer is comparing these linked views. Do not simply change labels over this model for unrelated topics.
