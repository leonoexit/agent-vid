# A spoken beat changes what the viewer sees

Follow narrative-framework.md first: question → setup → decode → execute → verify → rule.
Plan that trace at three scales: idea, shot, beat. A 60-second first draft often needs 12–18 shots,
not five headings over long voice paragraphs. A shot usually carries one short claim in 3–6 seconds. A beat is a
meaningful reveal, attention shift, operation or consequence inside that shot; 2–4 is a useful planning range.
Timing follows the synthesized speech and code-reading load. The goal is connected discovery, not frantic cutting.

## Phrase-to-picture score

Use these columns in storyboard.md:

| Shot / beat | Spoken phrase | Visible before | Reveal or action | Visible afterward | Asset / focus |
| --- | --- | --- | --- | --- | --- |
| Initial state | “create a variable” | Empty stage | Show the x card, hide its future fields | Label x | Topic-specific context, if needed |
| Initial value | “starts at ten” | x label | Reveal value 10 and declaration line | x = 10 | Native x is primary |
| Copy | “read the value of x” | x = 10, y not assigned | Highlight source, reveal assignment | x remains 10 | Native x is primary |
| Copy result | “store that value in y” | Known source and destination | Move token and commit on arrival | y = 10 | Destination/result is primary |
| Separate update | “now x becomes twenty” | x = y = 10 | Reveal update line, write x = 20 | x = 20, y = 10 | Shift primary focus x → y |

A storyboard row without a visible change needs an editorial reason. A result sentence opens when the result
becomes true on screen. Do not reveal it in a headline, subtitle, code line or decorative sign beforehand.
For prediction, hide the answer and name a brief reading/thinking job. Use readTask plus a documented quiet interval.

## Choreography

- Establish: introduce objects in the order named, then expose their relevant fields. Do not show all future labels.
- Anticipate: use focus or spotlight on the source/instruction shortly before acting.
- Operate: open, transfer, write, connect or move on the corresponding action phrase. A token usually needs
  0.8–1.3 seconds. Start early enough that arrival agrees with the narrated result; never commit after the scene cut.
- Resolve: commit at arrival, reveal the result explanation, retain the new state for the next shot.
- Reframe: when the question changes, change the model view or grouping if it helps reveal the next relationship.
  A changed heading or spotlight alone is an attention cue, not a new model composition. Native object
  identity survives the cut. Do not replay every object's entrance or dissolve the whole diagram on every sentence.

Vary shot jobs: overview → detail → code build → operation → comparison → prediction/payoff → recap.
These are shot treatments inside the fixed narrative phases; choose them to serve each phase, not as a separate story order. A section with
several substantial clauses needs more shot boundaries or staged reveals, not faster narration.

The renderer supplies progressive fields, text alternatives, line-by-line code, code focus, native motion and
cued stickers. Camera zoom, nested charts and arbitrary group transformations require a project-specific extension;
do not claim they exist. Keep all operations on native geometry. Transfer copies by default: source data stays until
an explicit set changes it. An address stays unchanged when a pointer writes the stored value.

## Supporting art

Choose native geometry or a coherent local icon family for simple objects. Generated images are optional and
need a role that benefits from illustration; do not assign an image to each narrative phase. See SKILL.md's medium
selection and composition-grammar.md. Use a justified image only while its role is active. Decorative motion and
new artwork do not count as explanatory motion.

## Review on the real clock

Run motion_audit.py after sync. Review intervals longer than 3 seconds without a semantic change and shots over
8 seconds. The report separates content disclosures from model changes; captions, pulses and attention shifts do not
count as model operations. Read both sets of intervals and inspect consecutive text/attention-only scenes. Some stillness is valuable for reading unfamiliar
code: preserve it with a named readTask. Otherwise shorten, split or stage the next real fact.
A high beat count does not prove quality: watch a preview with sound, then muted. In both cases the focus and causal
sequence should be clear. Review image safe zones, action start/middle/end, unseen future answers and reverse seeks.
Word estimates are not alignment guarantees. Listen at key cues and move/rewrite the clause if action and speech
arrive apart. Keep connected vo across cuts, default hold 0, and reduce wording before increasing speed.

Review several adjacent shots muted, with captions and subtitle layers hidden. Can the model show what was
created, selected, related or changed? If not, fix that operation before adding text or increasing shot count.
The script audit cannot measure a custom renderer's layout, camera or native SVG changes; inspect those explicitly.
