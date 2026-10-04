# Full reference index — 19 rendered slides / 6 HTML files

Source: `source/`. Numbers 01–18 refer to `.slide` document order across the five batches, not section-step labels.
01-alt is a separate variant, not a nineteenth step. All HTML/CSS and rendered slides were inspected.
Implementation key: **S** = shipped trace scaffold; **C** = opt-in CSS primitive demonstrated in the composition
study (project DOM/cues still required); **R** = reference recipe requiring project-specific implementation.
The motion column is our proposed video adaptation, not animation found in the static HTML.

| Slide / file | Observed spatial and text grammar | Adaptation to a programming trace | Status |
| --- | --- | --- | --- |
| 01 — batch_1_intro_steps_1_3.html | Bare 100px heading; pill eyebrow; 7/5 footer (number, author); blurred image atmosphere | Ask outcome, stage same-example initial values, retain asymmetric hierarchy without author portrait | S bare hero/pair; R asymmetric footer |
| 02 — same | 7/5 thesis/stack; dim struck misconception; strong truth left-rule; 3 terminal windows with small rotations | Predict vs execute; separate call frames or snapshots, bring current frame forward and retain labels | C terminal/evidence; R layered stack and strike-through cue |
| 03 — same | Full-width step rule; large title; 8/4 main explanation + two metrics; image under gradient | Large active operation with two small state monitors; update counters on real commits | C split/stack; R live counters/layout |
| 04 — same | 6/6 explanation/diagram; command inset; dark terminal → white browser, arrow and mild rotation | Move return value from function pane to output pane; arrow has a real source/destination | S transfer; C terminal/light context; R endpoint mock and reflow |
| 05 — same | Centered icon, tiny spaced eyebrow, giant two-line maxim, two comparison tiles | After verification, compress the rule and retain the two observed outcomes | S recap pair; R centered icon/maxim layout |
| 06 — batch_2_steps_4_6.html | 7/5 text/code; highlighted filename card; underline; tilted terminal over monolith | Show state-owner label; select the relevant code line and connect it to the stored field | C terminal/accent; S code-focus; R owner/detail layout |
| 07 — same | 4/1/7 cause→result; red error, green lesson; nested diff inset, bottom progress strip | Run a failed condition then the corrected same-example result, explicitly reset changed trial | C split/panel; S write; R unequal comparison and diff |
| 08 — same | 6/6 role cards with violet/gray top rails; nested prompt terminals aligned at bottom | Compare source/destination roles; reveal code before executing, keep stable role colors | C pair/role-card/terminal; R synchronized group resizing |
| 09 — batch_3_steps_7_9.html | 7/5 file panel vs invocation panel; filename/status row; nested code; glowing command | One function call opens its body, executes and returns a real value | C terminal/split; S code + transfer; R invocation expansion |
| 10 — same | Two color-coded worker panels, circle icon anchors; full-width quote strip | Same-input comparison or two instances; route call only to selected receiver | C pair/icon/evidence; R receiver routing/grouping |
| 11 — same | 5/7 prose vs vertical three-step rail; active middle row has number, edge bar, inset | Follow read→copy→commit; active marker changes with actual state and value movement | C rail; R rail timing and token path |
| 12 — batch_4_steps_10_13.html | 6/6 warning vs recommended list; red inset, terracotta rule block, green checks | Guard/branch test with condition, selected path and outcome; don't imply both branches ran | C panel/pair; R branch routing and conditions |
| 13 — same | Header/body above three equal tool tiles; large icon and short role text | Source→transform→destination chain; move one data token through named stages | C panel/icon; R three-node flow |
| 14 — same | 5/7 heading vs three horizontal rows; A/B/C square badges; middle row accented | Trace iterations or three operations, retain small committed result beside each row | C stack/rail; R actual iteration ledger |
| 15 — same | Large verification statement; 7/5 checklist/evidence quote; dim abstract shield | Compare expected and observed values; close loop only after showing evidence | C split/evidence; R feedback loop geometry |
| 16 — batch_5_qa_outro.html | Two full-width stacked Q cards; badges extend beyond border; quoted answer left-rule | Question label first, then evidence, then reveal answer; retain room for badge and diacritics | C question/stack/evidence; R timed evidence opening |
| 17 — same | Paired Q cards: giant statistic vs explanation; full-width quote underneath | One large computed result beside explanation, then narrow takeaway | C stat/pair/evidence; R result-then-proof choreography |
| 18 — same | Centered final maxim with terracotta italic phrase; highlighted rule terms; two CTA cards | Recap same values and one rule; omit save/share buttons unless requested | S recap; C accent/mark; R centered composition |
| 01-alt — slide_1_alternative_hook.html | Two small top labels; huge 145px hook; emphasized attribution; 4/8 footer; larger radius; edge glows | Large beginner question with asymmetrical initial-evidence footer; omit unverified authority badges | S large bare hero; C split/panel; R asymmetric cover |

## Cross-file details checked

All six use #050505 / #D97757 / #7C3AED and Space Grotesk + Inter; five configure JetBrains Mono. The alternative
omits its explicit mono family configuration despite requesting the font URL. All use native SVG turbulence grain.
Batch 1 adds isolation/translateZ to cards; batches 2–5 omit that pair. The alternative changes corner/padding and
has an unused gradient `.verified-badge` rule. Thin border opacity and black/white tinted surfaces vary by panel.
External dependencies: Tailwind CDN, Google Fonts, Font Awesome 6.4.0, remote portrait in both covers. Five abstract
PNGs appear in the HTML (one reused on cover/03); the remaining local screenshot images are source evidence only.
No HTML export buttons/scripts or video animation were found. Source comments saying “Static” match this behavior.

Read [reference-reading.md](reference-reading.md) for observed evidence → inferred design job → application decisions across all slides. This index lists source instances; it does not prescribe a layout count.


## 0.4 implementation overlay

The table above records the initial source extraction; its R markers are not a current inventory of all project
code. `template/editorial-motion.js` now supplies explicit reversible reflow for title→evidence (01/18), selected
window/detail (02/06/09), and result→proof (17). `template/editorial-study.html` runs all three in an assignment
example. These are geometry helpers; they do not implement arbitrary file execution, data routing or tests.
The user-accepted SRP v2 implements several R recipes in project code; v3 exercises the portable helpers in
three changed passages. Read srp-case-study.md for that distinction rather than treating all R entries as absent.
