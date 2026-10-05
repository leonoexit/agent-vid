# Factual scope

**Liskov Substitution Principle (LSP)** — the "L" in SOLID. Barbara Liskov stated the idea in her 1987 OOPSLA
keynote *Data Abstraction and Hierarchy*; Liskov & Wing formalised behavioural subtyping in 1994. Robert C. Martin
popularised it as: *functions that use references to base classes must be able to use objects of derived classes
without knowing it.*

What the video claims:
- Wherever code works with the parent type, an object of the child type must be usable there and the program must
  still behave correctly ("thay được").
- A child class must keep the parent's promises (its behavioural contract). Throwing a new exception from an
  overridden method that the parent promised would work is a classic violation.
- Real-world "is-a" (a penguin is a bird) is not sufficient; the relationship must hold for the *behaviour* the
  code relies on.
- A standard fix: make the parent promise only what every child can do (`an()`), move the narrower promise
  (`bay()`) into its own class (`ChimBietBay`), and let the function ask for that narrower type.

What it does not claim: that inheritance is bad, that every override violates LSP, or that Python enforces the
type hint `chim: ChimBietBay` (hints document the contract; Python does not check them at run time).

`example.py` runs every displayed fragment: before the fix `tha_chim(ChimSe())` prints "Bay lên!" and
`tha_chim(ChimCanhCut())` raises `Exception("Không biết bay!")`; after the fix both birds work with `cho_an`, and
`ChimCanhCut` no longer has `bay`.

Pronunciation: narration writes "Lít-cốp" so the Vietnamese voice reads the name; captions display "Liskov".

Sources:
- [Wikipedia: Liskov substitution principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle)
- [Liskov & Wing, "A Behavioral Notion of Subtyping" (1994)](https://doi.org/10.1145/197320.197383)
- [Robert C. Martin, "The Liskov Substitution Principle" (1996, PDF)](https://web.archive.org/web/20151128004108/http://www.objectmentor.com/resources/articles/lsp.pdf)
