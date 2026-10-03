# Con trỏ trong C

Video tiếng Việt cho người học code vì sở thích, chỉ biết logic cơ bản. Giọng VieNeu: Thùy Dung (preset nữ miền Nam).

Áp dụng pyramid principle: kết luận ở đầu (con trỏ giữ địa chỉ), ba ý hỗ trợ (địa chỉ, đọc, sửa), rồi ví dụ C và bài tập.
Kế thừa skill explainer-ai-for-business-voice; chỉ điều chỉnh bản sao của template cho bài học này.

Ví dụ minh họa: `int x = 10; int *p = &x; *p = 20;` → `x == 20`. Các số là giá trị trong ví dụ, không phải địa chỉ bộ nhớ thực.
Trong khai báo `int *p`, dấu sao chỉ kiểu con trỏ; trong biểu thức `*p`, dấu sao truy cập đối tượng được trỏ tới.

Nguồn đối chiếu:
- https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Pointers.html
- https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Address-of-Data.html
- https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Pointer-Dereference.html
- https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Pointer-Declarations.html

Chạy từ root repository sau `source scripts/activate.sh`:

```bash
python .agents/skills/explainer-ai-for-business-voice/scripts/tts.py --project projects/explainer/con-tro-c --engine vieneu --voice "Thùy Dung"
python .agents/skills/explainer-ai-for-business-voice/scripts/sync-narration.py --project projects/explainer/con-tro-c
hyperframes check projects/explainer/con-tro-c
hyperframes render projects/explainer/con-tro-c --quality high --output projects/explainer/con-tro-c/renders/con-tro-c-9x16.mp4
```
