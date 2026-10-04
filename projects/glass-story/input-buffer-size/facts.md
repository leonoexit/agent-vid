# Facts: Input buffer size trong C

- `char name[8]` tạo một mảng gồm 8 phần tử kiểu `char`; trong ví dụ này `sizeof name` bằng 8 vì `name` vẫn là mảng tại điểm gọi.
- `fgets(name, n, stdin)` đọc nhiều nhất `n - 1` ký tự, dừng sau newline nếu newline đến trước giới hạn, và ghi ký tự null kết thúc chuỗi khi đọc thành công.
- Với input `HoChiMinh\\n`, có 9 chữ cái và một newline. Với `n = 8`, lần gọi đầu nhận `HoChiMi` rồi thêm `\\0`; phần `nh\\n` còn lại trong stream để lần đọc sau nhận.
- “Input buffer size” trong video là sức chứa của vùng nhớ đích truyền cho hàm đọc (`name`), không phải một tuyên bố về toàn bộ cơ chế buffering nội bộ của `stdin`.

## References

- ISO/IEC 9899:2011 public draft N1570, §6.7.6.2 (array declarators), §6.5.3.4 (`sizeof`), §7.21.7.2 (`fgets`): https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf
- C17 `fgets` contract, same public draft, §7.21.7.2. The video uses the illustrative input and labels the quantity as a worked example, not a measurement.

