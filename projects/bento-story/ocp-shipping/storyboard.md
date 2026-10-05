# OCP · phí ship — phrase-to-picture score

Story brief — **Question:** shop thêm giao hỏa tốc: có phải mở hàm tính tiền đang chạy ổn ra sửa?
**Example:** `tinh_tien(gia, giao)`; thường 20, nhanh 35 → tách lớp có `phi()` → thêm `HoaToc` 60 → `tinh_tien(200, HoaToc())`.
**Takeaway:** thêm tính năng bằng code mới qua một điểm mở rộng; không sửa code đã chạy ổn; chỉ tạo điểm đó ở chỗ hay thay đổi.

Renderer: project-specific native renderer (story-engine.js), same approach as accepted OOP v2. script.json carries
narration/phase only; its events are empty because cues live in the engine (matched to synced word times).
Media: zero generated images. Font Awesome Free Solid 6.4.0 local icons (truck-fast, lock, lock-open, plus,
triangle-exclamation, plug, check) — provenance in assets/icons/manifest.json.

Stable identities: `tinh_tien` = charcoal code panel (the protected code). GiaoThuong = blue, GiaoNhanh = purple,
HoaToc = orange (in the old code, the branch lines carry the same color markers before they become classes).
Order value / result = yellow. Warning = white tag with red border (never charcoal text on red).

Source treatments: think1/01 dominant poster (intro), think2/15 asymmetric anchor (code + icon), think3/27 stacked strips
(three classes), think1/09 native transform (lines leave the function → classes), think5/49 tall comparison (verify),
think6/64 decisive result inset, think1/10 typographic rule (outro). Motion is newly authored.

| # / phase | Spoken clause (cue) | Visible before | Reveal / model operation | Visible after | Next focus |
|---|---|---|---|---|---|
| intro / question | “thêm giao hỏa tốc” | poster question | orange HoaToc tile with truck + “?” enters | function tile + HoaToc tile | “đang chạy ổn” |
| | “đang chạy ổn” / “ra sửa” | | charcoal tinh_tien tile + check; “?” connector between | answer withheld | SOLID O |
| 1 / setup | “hàm tính tiền hiện tại” | empty stage | code panel opens: `def tinh_tien(gia, giao):` | header line | params |
| | “giá đơn hàng” / “cách giao” | def line | `gia`, `giao` params highlighted in turn | — | return |
| | “cộng thêm phí ship” | | `return gia + phi` line reveals (gap reserved for branches) | skeleton | branches |
| 2 / setup | “giao thường” / “giao nhanh” | skeleton | blue-marked `if` line, purple-marked `elif` line type in | 2 branches | status |
| | “đã chạy ổn” | | green checks attach to both branch lines; truck icons beside | working state | add hỏa tốc |
| 3 / decode | “chèn một nhánh mới” | 2 checked branches | return line pushed down; orange dashed `elif … hoatoc` wedges in | 3 branches (hypothetical, tagged NẾU) | consequence |
| | “bị sửa” / “kiểm tra lại” | | warning tag “ĐANG SỬA HÀM CŨ”; old checks flip to “?” | risk visible | principle |
| 4 / decode | “Đóng Mở” | risk state | hypothetical line retracts, checks restore; panel contracts upward | original code | two words |
| | “mở để mở rộng” / “đóng với việc sửa đổi” | | green MỞ panel (lock-open, plus) / white ĐÓNG panel (lock) | principle split | how? |
| 5 / decode | “một lớp riêng” | principle panels | MỞ/ĐÓNG leave; blue + purple lines **fly out** of the function and expand into class strips | 2 class strips | phi() |
| | “phương thức phí” | strips | `def phi(self): return 20/35` lines reveal; value badges | classes own fees | function |
| 6 / decode | “chỉ còn một dòng” | gaps in function | function collapses; `return gia + phi` rewrites to `return gia + giao.phi()` | one-line body | relation |
| | “được truyền vào” | | `giao.phi()` highlighted; connector traces from it to both strips | call relationship | closure |
| 7 / decode | “điểm mở rộng” | relation | plug tag “ĐIỂM MỞ RỘNG” attaches to `giao.phi()` | | lock |
| | “khóa lại” | | lock badge drops onto function corner; tag “ĐÓNG” | closed function | add hỏa tốc |
| 8 / execute | “thêm hỏa tốc” | 2 strips, locked fn | dashed empty third slot opens | slot | new class |
| | “lớp mới tên Hỏa Tốc” / “sáu mươi” | slot | orange HoaToc strip slides into slot; `return 60` reveals; connector extends | 3 strips, lock unchanged | call |
| 9 / execute | “đơn hai trăm” / “Hỏa Tốc” | 3 strips | call bar `tinh_tien(200, HoaToc())`; yellow 200 token → `gia`; orange token → `giao` | bindings row | inside |
| 10 / execute | “giao chấm phí” / “trả về sáu mươi” | bindings | `giao.phi()` focus; route traced to HoaToc strip; 60 token returns | `return 200 + 60` | sum |
| 11 / execute | “cộng sáu mươi” / “hai trăm sáu mươi” | 200 + 60 | result inset opens; 260 commits on “kết quả” | 260 | verify |
| 12 / verify | “sửa dòng nào” / “Không” | trace | recompose: tall comparison — CODE CŨ column (fn + 2 classes) vs CODE MỚI (HoaToc); “0 dòng sửa” | 0 vs +2 | old path |
| | “hai dòng mới” | | “+2 dòng mới” counter on HoaToc column | evidence | old path |
| 13 / verify | “giao thường” / “hai trăm hai mươi” | columns | restore strips; route fn → GiaoThuong; 20 token; result row adds 220 beside 260 | 260 & 220 | rule |
| outro / rule | “code mới” / “không sửa code” | — | dark rule poster; witness tiles +2 / 0 | rule | boundary |
| | “điểm mở rộng” / “hay thay đổi” | | boundary inset: `giao.phi()` + “chỉ ở chỗ hay thay đổi” | full rule | end |

No readTask: every scene has a narrated operation. Boundary honesty: scene 7 states the one-time restructure.
