# AgentVid

Workspace tạo video dọc 1080×1920 bằng các skill trong `.agents/skills`:

- `agentvid-motion-agent-diagram-9x16`: video 45–75 giây giải thích một khái niệm AI bằng sơ đồ động.
- `explainer-ai-for-business-voice`: video 60–90 giây giải thích AI/tự động hóa cho doanh nghiệp, giọng Việt hoặc Anh.

## Môi trường

Python **3.12**, Node.js **22+** (khuyến nghị 24), FFmpeg/FFprobe, ImageMagick 7 và eSpeak NG.
Trên macOS:

```bash
brew install python@3.12 node ffmpeg imagemagick espeak-ng
```

Máy hiện tại dùng pyenv Python 3.12.3 và nvm Node 24. `.python-version` và `.nvmrc` ghi lại các lựa chọn này.
Nếu dùng Python Homebrew, đưa `python@3.12/bin` lên PATH trước khi chạy setup.

```bash
bash scripts/setup.sh
source scripts/activate.sh
npm run doctor
npm test
```

Setup tải thư viện và model TTS/căn thời gian (vài GB); lần đầu có thể mất nhiều phút tùy mạng.
Script có thể chạy lại. Các thư viện Python được khóa trong `requirements/*.lock.txt`, Node trong `package-lock.json`;
multix được cố định phiên bản 0.7.0 trong `scripts/setup.sh`.
PyAV được giữ dưới 17 để tương thích API giải mã của faster-whisper 1.2.1.

| Thư mục | Nội dung |
| --- | --- |
| `.venv/` | Python xử lý ảnh/âm thanh: NumPy, SciPy, Pillow, uv |
| `.runtime/agentvid/vieneu-env/` | Python riêng: VieNeu, Kokoro, faster-whisper, ONNX Runtime <1.23 |
| `.runtime/agentvid/models/` | Model Kokoro và Whisper |
| `.runtime/npm/` | multix; dùng prefix riêng vì skill tìm qua `npm root -g` |
| `.cache/` | Cache Python/npm/Hugging Face và xử lý render |
| `projects/` | Các dự án video được tạo từ template |

Chạy `source scripts/activate.sh` trong mỗi terminal mới trước khi dùng skill. Lệnh này kích hoạt `.venv`,
đặt `AGENTVID_HOME`, cache và PATH cho các công cụ của dự án. Python TTS được skill tự tìm qua `AGENTVID_HOME`.
HyperFrames dùng Chrome có sẵn hoặc tải Chrome khi cần qua `hyperframes browser ensure`.

## Bắt đầu một video

Sơ đồ động:

```bash
source scripts/activate.sh
node .agents/skills/agentvid-motion-agent-diagram-9x16/scripts/new-project.mjs projects/my-diagram --language=vi
```

Video cho doanh nghiệp:

```bash
source scripts/activate.sh
cp -R .agents/skills/explainer-ai-for-business-voice/template projects/my-explainer
python .agents/skills/explainer-ai-for-business-voice/scripts/validate-script.py --project projects/my-explainer
```

Sửa kịch bản theo nội dung riêng và làm tiếp các bước trong `SKILL.md` của skill tương ứng.
Các template trong `.agents/skills` là bản gốc để sao chép.

## Kiểm tra giọng đọc

```bash
source scripts/activate.sh
python .agents/skills/explainer-ai-for-business-voice/scripts/setup-voice.py --check
python .agents/skills/agentvid-motion-agent-diagram-9x16/scripts/setup-vieneu.py --check --align
```

Setup tạo file thử giọng Việt/Anh và kết quả căn thời gian trong `.runtime/agentvid/`.
VieNeu/Kokoro và faster-whisper chạy local, không cần API key. Các chức năng dùng nhà cung cấp ngoài
(Gemini, ElevenLabs, Soniox, tạo hình/nhạc) cần key tương ứng theo hướng dẫn từng skill.
Đặt key qua biến môi trường hoặc file key cá nhân mà skill hỗ trợ; không commit key.

Git chỉ lưu mã nguồn, template, tài sản đi kèm, tài liệu và lockfile. Môi trường ảo, model, cache và render
không được đưa lên GitHub. Khi clone trên máy khác, chạy lại setup để dựng môi trường.
