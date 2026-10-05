# Factual scope

**Open/Closed Principle (OCP)** — "software entities should be open for extension, but closed for modification."
Coined by Bertrand Meyer (*Object-Oriented Software Construction*, 1988); Robert C. Martin made it the "O" in SOLID
and revisits it in *Clean Architecture* (2017), chapter 8, as a way to protect stable code from changes in details.

What the video claims:
- Adding a new behaviour should be possible by writing new code, without editing code that already works.
- This needs an extension point (here: every shipping object answers `phi()`); creating it required a one-time
  restructure of `tinh_tien`. The video says this explicitly ("sửa một lần").
- Closure is never total: you choose which kind of change to protect against (Martin: "strategic closure").
  The rule's boundary says to create such a point where change actually recurs.

What it does not claim: that every `if` is bad, that inheritance is required (Python duck typing is used; no base
class), or that OCP alone guarantees bug-free code.

Numbers (200, 20, 35, 60) are illustrative fees in thousand VND. `example.py` executes all displayed code and asserts
every result (260, 220) plus that `tinh_tien`'s source is unchanged after `HoaToc` is added.

Sources:
- [Wikipedia: Open–closed principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)
- [Robert C. Martin, "The Open-Closed Principle" (1996, PDF)](https://web.archive.org/web/20060822033314/http://www.objectmentor.com/resources/articles/ocp.pdf)
- [Clean Coder blog: The Open Closed Principle (2014)](https://blog.cleancoder.com/uncle-bob/2014/05/12/TheOpenClosedPrinciple.html)
