# AgentVid

Workspace tạo video dọc 1080×1920 bằng các skill trong `.agents/skills`:

- `agentvid-motion-agent-diagram-9x16`: video 45–75 giây giải thích một khái niệm AI bằng sơ đồ động.
- `explainer-ai-for-business-voice`: video 60–90 giây giải thích AI/tự động hóa cho doanh nghiệp, giọng Việt hoặc Anh.
- `explainer-editorial-voice`: video giải thích đa chủ đề, nền trắng ngà/đen đơn sắc, chữ monospace, SVG nét và bố cục editorial. Hỗ trợ sơ đồ giữ nguyên qua nhiều cảnh, thay đổi trạng thái theo lời đọc và ảnh minh họa (có thể tạo bằng AI). Giọng Việt/Anh; nội dung và cấu trúc theo yêu cầu người dùng.
- `explainer-glass-programming-voice`: chuyên giải thích một khái niệm lập trình qua một ví dụ chạy từng bước, phong cách Dream State glass-card rose/amber. Mặc định Hải Đăng nam miền Bắc, nhịp đọc tự nhiên và thao tác nối tiếp.
- `explainer-code-atlas-voice`: chuyên giải thích một khái niệm lập trình bằng một execution trace liên tục trên bảng Code Atlas. Một audio master điều khiển các mốc từ, code, ô nhớ và đường dữ liệu; mọi trạng thái được tính lại từ thời gian nên có thể tua chính xác.

## Tên gọi các programming explainer hiện tại

Các skill giữ nguyên phong cách và quy trình, dùng tên `explainer-<phong-cách>-programming-voice`.

- `explainer-apple-programming-voice`
- `explainer-apple-edit-programming-voice`: bản thử riêng từ Apple, bổ sung storyboard thao tác, SFX theo sự kiện và kiểm tra chuyển cảnh; chưa thay thế bản Apple ổn định.
- `explainer-architect-programming-voice`
- `explainer-bento-programming-voice`
- `explainer-bauhaus-programming-voice`: hình học phẳng, chữ lớn, mảng màu Bauhaus; giải thích bằng thao tác trên ví dụ và kiểm chứng quy tắc.
- `explainer-code-noir-programming-voice`
- `explainer-glass-programming-voice`
- `explainer-brown-glass-programming-voice`
- `explainer-ribbon-programming-voice`
- `explainer-mint-bento-programming-voice`: thẻ UI phẳng bo mềm, nền aqua/mint; theo dõi một đối tượng qua các góc nhìn và trạng thái liên quan.
- `explainer-cutout-programming-voice`: mixed-media collage hiện đại, ảnh gen-img tách nền, giấy màu sáng và chữ lớn; tách lớp, đối chiếu và ghép lại để giải thích một ví dụ lập trình.

Ví dụ: `Dùng $explainer-apple-programming-voice tạo video giải thích closure cho người mới học JavaScript.`

## Skill đã lưu trữ

Ink, Pop Narrative và Pop Collage được đưa khỏi `.agents/skills` ngày 2026-10-10. Bản gốc và hướng dẫn khôi phục nằm trong [archives](archives/retired-explainers-2026-10-10/README.md). Video và kho asset được giữ nguyên. Nhánh Pop đang dùng là `explainer-pop-motion-discovery-voice` v0.2.0, kể bằng ảnh và hành động.

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

## Reelcrew

CLI Reelcrew **0.2.25** được cài ngày 2026-10-08 từ installer chính thức `https://reelcrew.io/install.sh`.
Installer đã xác thực SHA-256 và chữ ký Ed25519 của bản phát hành. Runtime, cấu hình và đăng nhập nằm ở
`.runtime/reelcrew/` (đã được Git bỏ qua). `REELCREW_SKILLS_DIR` trỏ vào `.agents/skills` của dự án;
không đổi shell profile cá nhân. Các explainer hiện có tiếp tục dùng quy trình hiện tại.

```bash
source scripts/activate.sh
reelcrew --help
# Hoặc gọi trực tiếp, không cần activate:
./scripts/reelcrew --help
```

Máy hiện tại đã kích hoạt và cài 15 skill video cùng skill điều phối Reelcrew. Trên máy mới, đăng nhập và hoàn tất cấu hình trong terminal:

```bash
./scripts/reelcrew login
./scripts/reelcrew setup
```

Reelcrew mặc định tạo skill stub cho Claude Code; đường dẫn đã được chuyển về `.agents/skills` của project,
và các skill đã được phiên Codex hiện tại nhận diện. Không lưu thông tin đăng nhập/API key vào Git.

Trạng thái kiểm tra ngày 2026-10-08: tải video, render/export, HyperFrames 0.8.79, tách người và adapter ảnh Codex đã được nhận diện.
Voice Reelcrew dùng VieNeu sẵn có tại `.runtime/agentvid/vieneu-env/bin/python`, mặc định **Hải Đăng**;
wrapper dùng chung cache Hugging Face của dự án. Không thay pipeline/HyperFrames 0.8.75 của các explainer hiện có.
Transcription, nhạc và SFX qua dịch vụ ngoài chưa cấu hình; Whisper local của pipeline cũ vẫn dùng riêng,
chưa có adapter Whisper trong Reelcrew. Không tự bật preset ElevenLabs hoặc dịch vụ trả phí.

Để cài lại CLI vào đúng chỗ trên một máy macOS khác, tải và kiểm tra installer trước khi chạy:

```bash
curl -fsSL https://reelcrew.io/install.sh -o /tmp/reelcrew-install.sh
REELCREW_HOME="$PWD/.runtime/reelcrew" \
REELCREW_SKILLS_DIR="$PWD/.agents/skills" \
REELCREW_INSTALL_PATH=no REELCREW_NO_INPUT=1 \
sh /tmp/reelcrew-install.sh
```

Lệnh cài lại lấy phiên bản hiện hành từ nhà phát hành; không khóa ở 0.2.25.

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

Ví dụ: “Dùng skill explainer-glass-programming-voice, giải thích phép gán trong C cho người học code vì sở thích;
cho thấy giá trị thay đổi theo từng dòng lệnh.” Mặc định giọng Hải Đăng nam miền Bắc; có thể yêu cầu giọng khác.

```bash
source scripts/activate.sh
python .agents/skills/explainer-glass-programming-voice/scripts/new-project.py projects/glass-story/my-topic --language vi
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

## Kho asset Pop dùng chung

Mở [gallery](asset-library/pop/index.html) để tìm vật thể, giấy và chữ có sẵn. Agent dùng `scripts/pop-assets.py` để tìm kiếm, đăng ký ảnh/biến thể, sao chép vào project và ghi nhận sử dụng. Xem [quy trình và lệnh](docs/pop-asset-library.md). Kho dùng chung cho Pop Collage, Pop Narrative và Pop Motion; các project giữ bản asset độc lập.
