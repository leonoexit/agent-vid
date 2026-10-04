# AgentVid

Workspace tạo video dọc 1080×1920 bằng các skill trong `.agents/skills`:

- `agentvid-motion-agent-diagram-9x16`: video 45–75 giây giải thích một khái niệm AI bằng sơ đồ động.
- `explainer-ai-for-business-voice`: video 60–90 giây giải thích AI/tự động hóa cho doanh nghiệp, giọng Việt hoặc Anh.
- `explainer-editorial-voice`: video giải thích đa chủ đề, nền trắng ngà/đen đơn sắc, chữ monospace, SVG nét và bố cục editorial. Hỗ trợ sơ đồ giữ nguyên qua nhiều cảnh, thay đổi trạng thái theo lời đọc và ảnh minh họa (có thể tạo bằng AI). Giọng Việt/Anh; nội dung và cấu trúc theo yêu cầu người dùng.
- `explainer-glass-story-voice`: chuyên giải thích một khái niệm lập trình qua một ví dụ chạy từng bước, phong cách Dream State glass-card rose/amber. Mặc định Hải Đăng nam miền Bắc, nhịp đọc tự nhiên và thao tác nối tiếp.
- `explainer-code-atlas-voice`: chuyên giải thích một khái niệm lập trình bằng một execution trace liên tục trên bảng Code Atlas. Một audio master điều khiển các mốc từ, code, ô nhớ và đường dữ liệu; mọi trạng thái được tính lại từ thời gian nên có thể tua chính xác.

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
(Gemini, ElevenLabs, Soniox, tạo hình/nhạc qua API) cần key tương ứng theo hướng dẫn từng skill.
Asset editorial cũng có thể tạo bằng công cụ imagegen tích hợp nếu phiên làm việc cung cấp công cụ đó.
Đặt key qua biến môi trường hoặc file key cá nhân mà skill hỗ trợ; không commit key.

Git chỉ lưu mã nguồn, template, tài sản đi kèm, tài liệu và lockfile. Môi trường ảo, model, cache và render
không được đưa lên GitHub. Khi clone trên máy khác, chạy lại setup để dựng môi trường.

## Phiên bản editorial

Ví dụ yêu cầu tự nhiên: “Dùng skill explainer-editorial-voice, làm video 60 giây giải thích con trỏ trong C
cho người mới, theo pyramid principle, giọng nữ miền Nam.”

Tạo dự án mới:

```bash
source scripts/activate.sh
python .agents/skills/explainer-editorial-voice/scripts/new-project.py projects/editorial/my-topic --language vi --voice "Thùy Dung"
```

Sửa nội dung trong script.json, rồi thực hiện pipeline trong SKILL.md của skill. Skill mới dùng các môi trường đã cài;
không cần thêm phụ thuộc hệ thống. Thiết kế gốc được lưu trong design-style.json để tiếp tục tối ưu.

## Phiên bản glass story

Ví dụ: “Dùng skill explainer-glass-story-voice, giải thích phép gán trong C cho người học code vì sở thích;
cho thấy giá trị thay đổi theo từng dòng lệnh.” Mặc định giọng Hải Đăng nam miền Bắc; có thể yêu cầu giọng khác.

```bash
source scripts/activate.sh
python .agents/skills/explainer-glass-story-voice/scripts/new-project.py projects/glass-story/my-topic --language vi
```

Kịch bản mới dùng đối tượng và các thao tác show/open/morph/transfer/write theo lời đọc. Mặc định speed=1.0,
paragraph_gap=0.2 và hold=0; kết quả được giữ trên hình trong lúc lời giải thích tiếp tục. Chỉ thêm khoảng nghỉ có
mục đích cụ thể. Nguồn 5 HTML/80 slide và bảng tra cứu nằm trong references/ của skill; một style Dream State
được triển khai, các style khác chỉ là tham chiếu. Các skill mới sẽ chuyên một style và một dạng nội dung.
Bản demo con trỏ trước ở projects/glass-story/con-tro-c giữ cấu hình Thái Sơn của lần test đó; video render nằm
trong renders/ và không đưa vào Git.

## Phiên bản Code Atlas liên tục

Ví dụ: “Dùng skill explainer-code-atlas-voice, giải thích input buffer size trong C cho người mới.” Skill dùng một
bản đọc duy nhất thay vì tạo audio theo từng cảnh. Các `chapter` chỉ thay tiêu đề; code, ô nhớ và trạng thái tiếp tục
tồn tại trên cùng một bảng.

```bash
source scripts/activate.sh
python .agents/skills/explainer-code-atlas-voice/scripts/new-project.py projects/code-atlas/input-buffer --language vi
python .agents/skills/explainer-code-atlas-voice/scripts/validate-script.py --project projects/code-atlas/input-buffer
python .agents/skills/explainer-code-atlas-voice/scripts/tts-master.py --project projects/code-atlas/input-buffer
python .agents/skills/explainer-code-atlas-voice/scripts/sync-master.py --project projects/code-atlas/input-buffer
```

Mặc định dùng Hải Đăng và căn từ bằng faster-whisper local. Mẫu kèm skill là một execution trace hoàn chỉnh về
`char name[8]` và `fgets`, dùng để thay nội dung chứ không phải cấu trúc bắt buộc cho mọi chủ đề.
