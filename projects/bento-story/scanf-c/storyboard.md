# scanf: một lần nhập tuổi

Audience: người mới biết biến và phép gán. Language: vi. Hải Đăng, speed 1.0, không nhạc nền.
Art: Maple bento, serif headings, blue input / yellow variable / purple operation-status. No generated art.
The left input card records the submitted text; it is not an unread-input-buffer visualization.

| Scene | Primary focus | Reveal → operation → settle | Spoken cue/result |
| --- | --- | --- | --- |
| Hook | 18 → age | Introduce the input and target by name | A concrete question, no prerequisites |
| 1 | age then submitted text | Show age=0; type 18 ↵ into input | “mười tám”; age remains 0 before the call executes |
| 2 | %d | Expose the format; identify two characters | “phần trăm đê”; pending interpretation as decimal int |
| 3 | &age | Attach native address badge; move its token to operation card | “Ta đưa địa chỉ”; value remains 0 |
| 4 | age | Read the source; transfer converted integer; commit age=18 | “chuyển thành số nguyên”; arrival before result sentence |
| 5 | n | Replace operation card with return count 1; highlight guard | “trả về một”; n=1, age=18; guard passes |
| Recap | %d + &age | Reuse labels and one implication | Read format + destination + return check |

No decorative pauses or explicit holds. Each result remains visible while narration explains it. No extra scenes
about buffers, strings, pointer arithmetic or memory allocation. Example code snippets omit surrounding main/include;
example.c supplies the full compilable program. A token is a teaching animation, not hardware execution timing.
