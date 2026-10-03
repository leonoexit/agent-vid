# AgentVid · AI cho doanh nghiệp · giọng đọc + phụ đề

Giải thích cho chủ doanh nghiệp không rành kỹ thuật: một việc làm tay → AI agent làm thay, tiết kiệm bao nhiêu.

- Robot phác chì, không một từ kỹ thuật trên màn hình
- Một ngày bị ăn giờ, trước/sau, agent làm 3 bước, chat mẫu, tiết kiệm, ví von đời thường, bắt đầu từ đâu
- Hợp cho người bán giải pháp AI, tư vấn chuyển đổi số

Kết quả: video dọc 1080×1920 (Reels, TikTok, Shorts) dài 60–90 giây, có lời đọc tiếng Việt hoặc tiếng Anh, phụ đề chạy theo giọng, nhạc nền,
xuất MP4. Mỗi video làm trong khoảng 10 phút, gồm cả thời gian render.

**Giọng đọc miễn phí, chạy ngay trên máy bạn** (VieNeu-TTS cho tiếng Việt, Kokoro cho tiếng Anh): không cần API key,
không tốn phí theo lượt, không cần card đồ hoạ.
Bản này làm được cả video chỉ có nhạc nền (không lời, không phụ đề).

## 1. Cần có
- **Claude Code** hoặc **Codex CLI**: là "người làm video"; có thể ra lệnh bằng tiếng Việt hoặc tiếng Anh.
- **Node.js 18+**, **Python 3.10+**, **ffmpeg** (Windows: `winget install Gyan.FFmpeg`; macOS: `brew install ffmpeg`).
- Khoảng **1,2 GB ổ đĩa** cho giọng đọc (tải một lần).
- Không bắt buộc: key Key4u (vẽ thêm hình cùng phong cách, tạo nhạc Suno), key ElevenLabs (nếu thích giọng ElevenLabs hơn).

## 2. Cài đặt
Giải nén, được thư mục `explainer-ai-for-business-voice/`.

- **Claude Code:** chép thư mục vào `~/.claude/skills/explainer-ai-for-business-voice/` (dùng cho mọi dự án) hoặc `<dự án>/.claude/skills/explainer-ai-for-business-voice/`.
- **Codex:** chép vào `~/.agents/skills/explainer-ai-for-business-voice/` (dùng cho mọi dự án) hoặc `<dự án>/.agents/skills/explainer-ai-for-business-voice/`.
  Mở phiên Codex mới sau khi cài để skill được nạp.

**Cài giọng đọc (một lần cho mỗi máy, 2–5 phút):** mở Claude Code / Codex và gõ
```
Cài giọng đọc cho skill explainer-ai-for-business-voice giúp tôi
```
Agent sẽ chạy `python scripts/setup-voice.py`: cài `uv` nếu máy chưa có (nó đưa bạn một lệnh để chạy), tạo môi trường
Python riêng ở `~/.agentvid/vieneu-env`, tải mô hình giọng (~600 MB) rồi đọc thử một câu. Tự làm bằng tay cũng được:
```
python <đường-dẫn-skill>/scripts/setup-voice.py
```
Máy yếu: đọc giọng mất khoảng 1–2 phút cho mỗi phút video. Mọi thứ nằm trong `~/.agentvid/`; xoá thư mục đó là gỡ sạch.

## 3. Làm video đầu tiên
Mở Claude Code / Codex trong một thư mục trống rồi gõ:
```
Làm video: AI agent nhắc công nợ và đối soát hoá đơn cho công ty phân phối nhỏ
```
Agent sẽ tự: tìm hiểu nội dung → viết kịch bản → đọc giọng → dựng hình → kiểm tra → render. File MP4 nằm trong thư mục dự án.
Nếu không nói rõ ngôn ngữ, agent theo ngôn ngữ của nguồn nội dung; nếu không có nguồn, agent theo ngôn ngữ prompt.

Muốn chạy thử ngay không cần viết gì: `template/script.json` đã có sẵn một kịch bản mẫu, bảo agent "làm video từ kịch bản mẫu".

## 4. Đổi giọng, dùng nhạc riêng, làm bản không lời
- **Giọng khác:** skill có sẵn một giọng hợp phong cách. Xem danh sách 25 giọng (nam/nữ, Bắc/Trung/Nam): bảo agent
  "liệt kê giọng đọc" (`tts-vieneu.py --list-voices`), rồi "dùng giọng Ngọc Huyền cho video này" hoặc "cho mọi video".
- **ElevenLabs (trả phí, tuỳ chọn):** lưu key vào `~/.agentvid/keys.env` (ngoài mọi dự án, không chia sẻ file này):
  ```
  ELEVENLABS_API_KEY=...
  ```
  rồi bảo agent "đọc bằng ElevenLabs, giọng <voice id trong mục My Voices của bạn>".
- **Nhạc của bạn:** "dùng nhạc nền D:/nhac/bai-cua-toi.mp3" (bên trong là `sync-narration.py --bgm <file>`).
- **Không lời:** "làm bản chỉ có nhạc": video không giọng, không phụ đề, dùng nhạc nền có sẵn.

## 5. Lỗi hay gặp
| Hiện tượng | Cách xử lý |
|---|---|
| `setup-voice.py` báo thiếu `uv` | Chạy đúng lệnh nó in ra, mở terminal mới, chạy lại setup |
| Tải mô hình giọng bị ngắt | Chạy lại `setup-voice.py`: phần đã xong được bỏ qua |
| `npx hyperframes` báo thiếu Chrome | Chạy `npx hyperframes doctor`, làm theo hướng dẫn |
| Chữ tiếng Việt lỗi dấu | Đừng dán tiếng Việt vào dòng lệnh; agent ghi vào file (skill đã dặn) |
| Video dài quá / ngắn quá | Bảo agent "rút còn 60 giây": nó dùng `validate-script.py` để ước độ dài trước khi render |
| Giọng đọc sai một từ | Bảo agent viết lại câu đó (số và ký hiệu viết thành chữ), rồi đọc lại riêng đoạn đó |

## 6. Điều khoản
Xem `LICENSE.txt`. Tóm tắt: dùng cho video của bạn (cá nhân và thương mại), không bán lại / chia sẻ lại skill.
Giọng tiếng Việt dùng VieNeu-TTS (Apache-2.0), tiếng Anh dùng Kokoro-82M (Apache-2.0) qua kokoro-onnx (MIT);
âm thanh tạo trên máy bạn được dùng thương mại theo giấy phép của các dự án đó.

Hỗ trợ và các skill khác: **AgentVid**.
