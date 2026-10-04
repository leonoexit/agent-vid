# Content grounding

Primary source: Robert C. Martin, [The Single Responsibility Principle](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html), 2014-05-08, checked 2026-10-04.

SRP groups a module around a cohesive source of change requests. Several functions can serve that same responsibility.
The video applies this interpretation to our original invoice example: pricing policy and printable presentation
are independent concerns for the fictional Sales and Operations groups. A group is a role, not an individual coder.
This is one illustrative boundary choice, not a claim that every invoice system must use these exact classes.

All class names, dialogue, monetary amounts, discount policy, code and tests are authored for this demo. No source
code is copied. A 100000-unit subtotal at 10 percent discount gives 90000. Changing the heading doesn't alter arithmetic.
The mock presenter produces printable text rather than generating a binary PDF; the screen says “bản in” accordingly.
The contract is a numeric total + heading. Real contract changes can affect both classes; SRP reduces unrelated change
coupling and does not guarantee zero bugs or zero integration impact. No architecture performance claims are made.

The screen uses symbolic code/state (including `10%`) for legibility; it is not copyable Python.
`scripts/example.py` executes actual before/after Python source, edits the discount policy in Calculator only,
then the heading in Presenter only, and checks both the narrated input and a second amount.

V2 is a visual-only revision using identical narration. `total = ?` after a policy edit explicitly marks the result
as invalid until rerun. Old and current receipts compare outputs under the same input; their aligned amount is evidence.
The numeric bar has a genuine 90/10 split (846/94 pixels in a 940-pixel total), not decorative data visualization.
