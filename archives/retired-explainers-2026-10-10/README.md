# Archived explainer skills — 2026-10-10

Người dùng chọn đưa Ink, Pop Narrative và Pop Collage khỏi danh sách skill hoạt động. Các thư mục được chuyển nguyên trạng từ `.agents/skills/`; SHA-256 từng file có trong `manifest.json`.

- Ink: hướng thử nghiệm đã ngừng dùng.
- Pop Narrative và Pop Collage: giữ làm bản lịch sử; Pop Motion v0.2.0 là nhánh đang dùng.

Không xóa video, project hay kho asset. Skill trong thư mục này không được đăng ký làm skill hoạt động. Các đường dẫn lệnh và liên kết tới skill khác vẫn giữ nội dung gốc; muốn sử dụng lại, khôi phục thư mục về `.agents/skills/<tên>` và kiểm tra phụ thuộc. Pop Narrative phụ thuộc Pop Collage nên cần khôi phục cùng nhau. Không ghi đè một skill cùng tên đã có.
