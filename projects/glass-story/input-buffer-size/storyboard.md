# Storyboard: Input buffer size trong C

## Audience and scope

- Người mới học C nhưng đã biết Python.
- Một ví dụ duy nhất: `char name[8]` và `fgets(name, sizeof name, stdin)`.
- Không giải thích toàn bộ stdin internals; chỉ giải thích sức chứa của vùng nhớ đích và phần input còn lại sau một lần đọc.

## Stable model

- `buffer`: vùng nhớ `name[8]`, tám ô `char`, ô cuối dành cho `\\0`.
- `stdin`: input đang chờ, bắt đầu là `HoChiMinh\\n`.
- `next`: kết quả của lần gọi `fgets` tiếp theo.

## Scene changes

1. Tạo và mở vùng nhớ tám ô.
2. Đặt giới hạn `7 ký tự + '\\0'`.
3. Nối `stdin` với buffer qua lời gọi `fgets`.
4. Cho người dùng nhập chín chữ cái và Enter.
5. Chuyển `HoChiMi` vào buffer, giữ `nh\\n` trong stdin.
6. Chuyển phần còn lại vào lần đọc kế tiếp.
7. Chốt công thức `8 → 7 + 1` và khác biệt với Python.

Không dùng asset gen-img: sơ đồ native đã đủ để biểu diễn toàn bộ thao tác và trạng thái.

