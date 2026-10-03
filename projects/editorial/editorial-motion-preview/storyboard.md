# Editorial v0.2 demonstration

The narration and Thùy Dung audio are reused unchanged from the first editorial preview so the visual difference is easy to compare. No new AI raster asset was generated for this demonstration.

| Scene | Explanation | Hold | Change / spoken cue |
| --- | --- | --- | --- |
| 1 | A pointer stores the box location, not copied data. | p=&x, x=10; two stable nodes. | Focus x on “chiếc hộp”; focus p and trace p→x on “ghi địa chỉ hộp”. |
| 2 | Address and pointed-to data are different. | Same nodes, positions and current values. | &x note on “Dấu và”; trace on “Pê giữ”; focus x and *p note on “Còn dấu sao”. |
| 3 | Writing through p changes x. | p=&x remains fixed. | Show *p=20 on “Giờ gán”; trace on “đi theo địa chỉ”; set x=20 and reveal the result on “thành hai mươi”. |
| 4 | Try the next value yourself. | Final result from the example is established. | Replace the finished model with practice instructions. |

The graph is one DOM model across scenes 1–3. Phrase anchors use estimated word timings, not speech recognition precision. Browser seeking in both directions restores x=10 before the update and x=20 after it. Node coordinates remain constant during focus changes and across scene boundaries.
