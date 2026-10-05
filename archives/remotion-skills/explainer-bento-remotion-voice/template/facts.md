# Facts for the binary-search example

- Values are `[3,7,11,18,24,31,42,56]`, already increasing; target is 24.
- This is equality-search binary search with inclusive endpoints and floor midpoint. It is not the exact insertion-point `bisect_left` implementation.
- Executing `python scripts/check-example.py` verifies midpoints 3,5,4; compared values 18,31,24; candidate counts 8,4,1; result index4 (fifth cell).
- The sorted-order precondition makes each discarded range impossible. Official Python documentation describes sorted-list bisection and its partition invariant: https://docs.python.org/3/library/bisect.html (checked 2026-10-05).
- Three comparisons is the result for this example, not a promise for every search among eight items. The narration says nearly half, not exactly half every time.
- Original source carousel prose/CTAs are not used as factual evidence.
