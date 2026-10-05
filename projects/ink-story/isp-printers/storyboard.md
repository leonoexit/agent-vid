# Storyboard — Chữ I trong SOLID (ink-story / isp-printers)

**Audience:** người mới học lập trình (biết biến, hàm, lớp, đã nghe kế thừa). Nhịp chậm rãi: Hải Đăng, speed 0.9, paragraph_gap 0.5 s, holds đọc ở các trang bằng chứng.
**Question:** Máy in rẻ chỉ biết in — có nên bắt nó hứa cả quét và phô tô?
**Example (verified in `example.py`):** `MayVanPhong` (in_giay/quet/photo) → `MayInRe` viết hàm giả báo lỗi → `quet_hop_dong(MayInRe())` → `Exception: Không quét`. Sửa: `CoTheIn`/`CoTheQuet`/`CoThePhoto`; `quet_hop_dong(may: CoTheQuet)`; mypy báo `incompatible type "MayInRe2"; expected "CoTheQuet"` (dòng 60), và không báo gì ở phiên bản cũ.
**Takeaway:** Đừng ép một lớp phụ thuộc vào phương thức nó không dùng; chia theo việc người dùng cần, không chia vụn vô cớ.

| # | Layout | Viewer question | Screen evidence | Spoken connection |
|---|---|---|---|---|
| intro | illustration | Tại sao máy in rẻ phải biết phô tô? | Ảnh máy in nhỏ bị cuộn checklist dài phủ kín (ô đầu đánh dấu đỏ) | Câu hỏi lạ này chính là chữ I |
| 1 | statement | Interface là gì? | Note "Danh sách việc một lớp hứa làm được" | Người dùng chỉ đọc danh sách rồi gọi tên |
| 2 | example | Python viết interface thế nào? | Note "Python: lớp chỉ ghi tên việc"; code `MayVanPhong`; note máy đa năng ✓✓✓ | Ba việc hợp lý cho máy đa năng → còn máy khác? |
| 3 | example | Máy chỉ biết in thì sao? | Code `MayInRe` + khối đỏ "HAI VIỆC GIẢ" (raise) | Kế thừa = nhận cả danh sách → phải viết hàm giả |
| 4 | example (+1.5 s) | Hàm giả gây hại gì? | Code `quet_hop_dong(may: MayVanPhong)`, lời gọi với `MayInRe()`, kết quả đỏ `Exception: Không quét` | Người gọi tin danh sách → lỗi lúc chạy |
| 5 | statement | Lỗi do ai? | "Nó vốn chỉ biết in." / đỏ "Lỗi nằm ở danh sách quá to." | Chuyển trách nhiệm sang thiết kế danh sách |
| 6 | statement | Nguyên lý tên gì, nói gì? | "Interface Segregation Principle"; note vàng định nghĩa; "phụ thuộc = phải viết ra, hoặc phải biết tới" | Định nghĩa bao cả lớp hiện thực lẫn người gọi |
| 7 | example | Sửa thế nào? | Ba code block nhỏ lần lượt; "Một danh sách = một lời hứa" | Mỗi lời hứa tách riêng |
| 8 | comparison (+1.2 s) | Mỗi máy nhận gì? | Code `MayInRe(CoTheIn)`; "Không còn hàm báo lỗi giả"; code `MayDaNang(CoTheIn, CoTheQuet, CoThePhoto)` | Chỉ hứa việc làm được |
| 9 | example | Người gọi được gì? | `quet_hop_dong(may: CoTheQuet)`; note máy đa năng ✓; note đỏ máy in rẻ → mypy báo trước khi chạy | Lỗi chuyển từ lúc chạy sang lúc đọc/kiểm tra |
| 10 | comparison (+1.5 s) | Tóm lại khác gì? | Hai note trước/sau cùng thuộc tính | Chuẩn bị quy tắc |
| outro | rule (+2 s) | Nhớ gì, khi nào tách? | Vàng "Chia theo việc người dùng thật sự cần."; dấu hiệu nên tách | Giới hạn: đừng chia vụn vô cớ |

## Illustration
- `assets/illustrations/printer-checklist.jpg` — role: referent cho câu hỏi mở đầu (máy nhỏ, danh sách quá dài). Generated with the art-direction prompt (blue ballpoint, small printer overwhelmed by a long checkbox scroll, only first box ticked in red, no text). Cropped 800×800 from 1024² to remove notebook edges.

## Production notes
- Narration says "in-tơ-phây" so the Vietnamese voice pronounces it like Vietnamese devs do; `script.captionDisplay` shows "interface" in captions.
- "scan/fax" replaced by "quét/phô tô" to avoid English words in the Vietnamese voice.
- Project-level changes: code 36 px (38 mono chars fit), Mali labels on code, caption rows end at sentence punctuation/commas, blocks start at opacity 0 (fix also applied to the skill template: unrevealed blocks were visible before their cue).
- Word timings are VieNeu estimates (silence-anchored), not forced alignment.
