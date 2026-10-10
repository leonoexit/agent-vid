# Lộ API key: thử kể bằng ảnh

Bản image-led có accent đã được người dùng duyệt ngày 2026-10-09 và được đưa vào hướng dẫn Pop Motion v0.2.0. Giữ nguyên kịch bản, 6 đoạn giọng Hải Đăng và thời lượng 43,88 giây của `../lo-api-key-github` để so sánh cách dựng.

## Xem kết quả

- Video mới: `renders/lo-api-key-github-image-led-accent-9x16.mp4`
- Bản trước accent: `renders/lo-api-key-github-image-led-9x16.mp4`
- Cover: `cover/lo-api-key-github-image-led-1080x1920.jpg` (kèm crop vuông và 4:5).
- Preview: `index.html`.

## Thay đổi thử nghiệm

Ảnh mang hành động: tẩy key trên bản hiện tại; kéo ra commit cũ vẫn còn key; tách bản sao; thử mở ổ khóa; bấm thu hồi; bản sao thử lại và thất bại; thay key rồi soi tờ USAGE. Chữ chỉ còn hook, tên thực thể, nhãn phân biệt và phụ đề karaoke.

Giữ màu Pop, giấy dán, Corose cho heading, JetBrains Mono cho nhãn, Inter cho phụ đề, người que vẽ tối giản. Không nhạc/SFX. HTML/CSS/GSAP + HyperFrames, không Remotion. Mượn nguyên tắc picture beats của Vox; không nhập giao diện giấy báo cũ hoặc pipeline âm thanh của Vox.

5 ảnh mới: cục tẩy, ổ khóa đóng/mở cùng mẫu, kính lúp, tờ USAGE; 6 asset dùng lại. Các ảnh là ẩn dụ minh họa, không phải ảnh chứng cứ. Prompt chính xác và nguồn ảnh lưu trong `assets/*.json`; danh sách dùng thực tế trong `assets/manifest.json` và `library-assets.json`. Không có token hoặc số tiền thật.

## Kiểm chứng

Xem `visual-review.md`, `qa/browser-review.json`, `qa/story-state-review.json`, `qa/readability.json`, `qa/mp4-review.json`. Lời đọc và mốc karaoke kế thừa; mốc từng từ vẫn là ước lượng, không tuyên bố đã forced-align. `qa/skill-unchanged.json` so sánh SHA256 toàn bộ skill với đầu lượt này.

Bản cũ được giữ nguyên. Người dùng đã duyệt bản accent; các snapshot `skill-before`/`skill-unchanged` ghi nhận giai đoạn thử trước khi phê duyệt.

## Chỉnh accent mở đầu

API key được quét highlight vàng ngay đầu clip; câu hỏi có vệt trắng chạy ngang khi lời đọc chuyển sang đánh giá an toàn, rồi nhấn nhẹ một lần ở “Chưa”. Lượt chỉnh accent chỉ thay heading cảnh đầu. Sau khi được duyệt, nguyên tắc kể bằng ảnh và accent được tích hợp vào skill v0.2.0.
