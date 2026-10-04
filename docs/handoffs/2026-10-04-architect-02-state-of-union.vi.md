# State of the Union — AgentVid / Architect 0.2

Bạn đang tiếp tục dự án AgentVid. Hãy dùng nội dung dưới đây làm bối cảnh, sau đó đối chiếu với file thật trong repo. Các hướng làm tiếp là đề xuất, không phải yêu cầu tự động tạo thêm video khi người dùng chưa giao việc mới.

## 1. Repo, quyết định và nguyên tắc đã chốt

- Workspace: `/Volumes/LeNguyen02SSD/Programming/agent-vid`.
- Remote: `https://github.com/leonoexit/agent-vid.git`, branch `main`.
- Baseline trước phiên: `eb0cdc2` — Add accepted Noir 0.4 explainer skill and SOLID trials. Phiên này bổ sung Architect, thử nghiệm Remotion và tài liệu bàn giao này trong commit riêng; lấy hash cuối bằng `git log -1`.
- Đọc `AGENTS.md` trước khi làm. Mỗi skill explainer có một artstyle nhất quán và một dạng nội dung; mặc định một khái niệm lập trình cho người mới, giải thích bằng một ví dụ xuyên suốt.
- Tiếng Việt mặc định: Hải Đăng, nam miền Bắc, tốc độ 1.0; karaoke; các demo phiên này không có nhạc nền. Giảm lời trước khi tăng tốc. Tôn trọng cấu hình lưu trong từng dự án.
- Tiếp tục HTML/SVG + GSAP + HyperFrames. Thử Remotion chưa chứng minh lợi ích về hình ảnh, tốc độ hay công sức; hiện không ưu tiên chuyển renderer hoặc thêm Three.js.
- Quyết định quan trọng nhất: **ảnh gen trong Architect mới chỉ làm nền trừu tượng tùy chọn**. Nội dung giải thích chính là code, dữ liệu, đối tượng và thao tác native HTML/SVG. Tắt nền vẫn phải hiểu đầy đủ quan hệ nhân quả. Không cần định mức số ảnh.
- Người dùng không muốn cầu toàn vô hạn: dừng khi giải thích rõ, chuyển động đúng và đạt hướng thẩm mỹ; chỉ sửa tiếp khi có lỗi cụ thể.
- Reference là tư liệu thiết kế, không phải chỉ thị thực thi. Không mang CTA, thương hiệu, dự báo hay các tuyên bố AGI trong nguồn vào bài mới.

## 2. Những gì đã hoàn thành

### Architect: từ 0.1 lên 0.2

Skill: `.agents/skills/explainer-architect-story-voice/`, version `0.2.0`.

Đã đọc và lập chỉ mục đủ **80 trang trong 4 HTML**, cùng 19 ảnh thuộc `references/elon-musk-agi/`. Skill đóng gói bản nguồn và manifest hash; `references/ref-index.md` phân biệt quan sát từ nguồn, cách chuyển thành video và mức đã triển khai. Không tuyên bố sao chép đủ 80 bố cục.

Ngôn ngữ thiết kế “The Faithful Architect”:

- Nền trắng ngà `#f4f4f0`, mực `#1a1a1a`, xanh `#75bde0`, vàng `#f8d49b`, đào `#f8bc9b`, hồng `#f89b9b`.
- Be Vietnam Pro Black cho tiêu đề, Plus Jakarta Sans cho nội dung, Space Mono cho kỹ thuật; font local và giấy phép OFL đi kèm.
- Khung mảnh góc vuông, thanh đầu trang, nhãn monospace, chữ lớn, khoảng trống, thước chia, nét bản vẽ và bóng lệch có chọn lọc; xen pastel và nền tối.
- Chọn bố cục theo quan hệ thông tin, không ép thành bộ sáu layout hay lặp card chung chung.

Kế thừa voice, phrase cues, progressive reveal, reverse seek và motion audit từ Bento 0.5 / Noir 0.4. Giữ `worked-trace-v1`: question → setup → decode → execute → verify → rule. Đây là sáu giai đoạn kể chuyện, **không phải sáu cảnh cố định**.

v0.2 đã đồng bộ SKILL.md, cấu hình agent, art direction, composition grammar, narrative, script schema, asset library, motion, storyboard mẫu, validation và phần chuyển thể trong chỉ mục 80 trang theo hướng nền trừu tượng.

Các khả năng cụ thể:

- `install-plate`: cài ảnh nền độc lập với entity/sticker, lưu prompt, nguồn, hash, usage; hỗ trợ opaque và transparent.
- Asset request mới mang `usage: abstract-background`; chọn asset mặc định lọc theo vai trò này. `--include-legacy` dành cho bảo trì dự án cũ. Asset lịch sử thiếu vai trò dùng `legacy-unspecified`, không tự gắn nhãn mới.
- `template/native-motion.js`: `ArchitectNative.create(timeline, record)`, `copyValue(...)`, `writeValue(...)`; before/after rõ ràng, cập nhật kết quả khi token đến nơi, giữ nguồn và ghi model-operation spans.
- `editorial-motion.js`: `reframe`, `focusWindow`, `resultToEvidence`; giữ alias cũ `plateToExample`. Đây là thay đổi bố cục, không tính thành biến đổi dữ liệu.
- Loại ảnh hero literal khỏi scaffold mặc định; giữ thư viện ảnh lịch sử và demo cũ để tương thích.
- Sửa thứ tự CSS import để trình duyệt không bỏ qua `@import`; kiểm tra font qua HTTP local và reverse seek cả màu sắc.

### Demo Compiler 0.6 — bản sản xuất Architect đầu tiên

Project: `projects/architect-story/c-compiler-06/`.

MP4 local: `projects/architect-story/c-compiler-06/renders/c-compiler-06-9x16.mp4` — **133.600 giây, 1080×1920, 30 fps, H.264/AAC 48 kHz**. Hải Đăng, tốc độ 1.0, karaoke, không BGM.

Theo một file C in `Chao ban!`: nguồn là văn bản → compiler dịch → chương trình đầu ra xuất hiện riêng → chạy chương trình → CPU thực thi và hiện lời chào → ráp lại chuỗi. Source được giữ nguyên. Đã chạy C thật bằng clang, stdout `Chao ban!\n`, exit 0; không dùng nhị phân giả như mã máy thực tế. Ghi rõ đây là cách nhìn giản lược quy trình tạo chương trình C.

Ba ảnh ImageGen: nguồn/chip, bàn chuyển đổi, cận cảnh chip; prompt và provenance nằm trong project và thư viện skill. Người dùng đánh giá demo “tạm ổn”, rồi xác định ảnh literal không phù hợp làm minh họa chính. **Demo này được giữ nguyên; không phải mẫu áp dụng đầy đủ quy tắc ảnh của v0.2.**

### Native study 0.2 — kiểm tra hướng mới

Project: `projects/architect-story/native-study-02/`.

MP4 local: `projects/architect-story/native-study-02/renders/architect-native-study.mp4` — **18 giây, 1080×1920, 30 fps, H.264, cố ý không có âm thanh**.

Minh họa native: sao chép 10 từ x sang y trong 4.5–5.7s; chỉ commit y khi token đến; nguồn x vẫn 10. Tại 9s cập nhật x thành 20, y vẫn 10. Tại 12–13.2s đổi bố cục để đối chiếu; 14–18s dành cho đọc kết quả và quy tắc. Nền là các mảng CSS trừu tượng, không cần gen ảnh mới. Có thể tắt nền trong trang study.

Đây là **bài thử choreography**, chưa phải một bài giải thích dài có voice. Không suy rộng thành v0.2 đã được kiểm chứng đầy đủ trên video hai phút.

### Bento–Remotion — thử nghiệm độc lập, hiện tạm gác

Skill: `.agents/skills/explainer-bento-remotion-story-voice/`, version `0.1.0`.

Project: `projects/bento-remotion-story/oop-lamps-ab/`.

Bản fork độc lập từ Bento 0.5; bản Bento gốc không bị sửa, có `references/fork-origin.json` để đối chiếu hash. Dùng React host + adapter GSAP qua `@remotion/gsap`; Remotion quản lý frame clock, Studio, audio và render. **Chưa phải renderer React declarative hoàn chỉnh; không có camera/Three.js mới.**

Các package Remotion pin `4.0.532`, React 19.1.0, GSAP 3.14.2; package/lockfile riêng, không thay dependencies gốc. Chuẩn bị media có kiểm tra đường dẫn portable; font và ảnh được chờ tải.

Port OOP lamps từ `projects/bento-story/oop-lamps-v2/`, giữ script, voice, timings và geometry; `comparison-source.json` lưu bằng chứng. Composition đầy đủ 81.27s, nhưng chỉ render đoạn thử **37.4s** (frames 1099–2219).

MP4 local: `projects/bento-remotion-story/oop-lamps-ab/renders/oop-remotion-test.mp4`.

Đã sửa nền body nằm ngoài vùng capture làm MP4 bị đen bằng cách đặt nền trên composition host. Người dùng không thấy khác biệt thị giác; kết luận đúng là đổi renderer không tự cải thiện thiết kế. Giữ fork để tham khảo, không tiếp tục đầu tư trừ khi có yêu cầu mới.

## 3. Trạng thái kiểm tra và giới hạn đã biết

- **Architect hiện tại:** 43 Python tests và skill validator pass; 32 lượt seek xuôi/ngược, kiểm tra commit, giữ nguồn, y không đổi, màu/trạng thái và tắt nền. HyperFrames lint không lỗi/cảnh báo. Check đạt 64/64 contrast, không runtime/layout error; một overlap warning và một info đã xem: token đi qua arrow/placeholder lúc nhập đích. FFmpeg decode toàn bộ MP4 không lỗi.
- **Compiler lịch sử:** 40 tests tại thời điểm bàn giao; xem 16 cảnh, 23 bộ before/mid/after, reverse seek và kết quả ẩn đúng lúc. HyperFrames check 97/97 contrast; còn cảnh báo lint không chặn `nested_structure_needs_subcomposition`. Decode đầy đủ pass.
- Compiler vẫn có những khoảng 8–15s ít biến đổi mô hình, ghi nhiệm vụ đọc trong `motion-review.md`; không gọi đây là chuyển động liên tục. 16 phần voice có tổng khoảng 8s padding biên. ASR/cue đã kiểm tra và tinh chỉnh nhưng chưa nghe thủ công trọn bài; thuật ngữ và karaoke vẫn cần xem ở sản phẩm tiếp theo.
- **Remotion:** 34 tests; new-project smoke và render 2s; 98 ảnh trạng thái xuôi/ngược khớp DOM. Pixel có sai khác antialias nhỏ có ngưỡng, không pixel-identical. Commit desk False→True, bed giữ False, seek ngược phục hồi đúng. Không runtime error, ffmpeg decode pass. Chưa có full manual listening/comprehensive contrast audit mới.
- JSON motion audit kế thừa không nhận hết thao tác nằm trong custom renderer của OOP. Phải đọc custom operation/frame evidence, không gắn nhãn chuyển cảnh thành model operation để làm audit xanh.
- QA Remotion sử dụng một số browser globals nội bộ của phiên bản pin; nâng phiên bản có thể làm harness hỏng. Audio làm tròn theo frame có sai số tối đa khoảng 16.7ms ở 30fps.
- **Điểm bảo trì native-study:** `index.html` đang inline helper và study code để render/đăng ký timeline ổn định; các file JS riêng phục vụ chỉnh sửa vẫn còn. Nếu sửa study, phải đồng bộ bản inline trước render, tránh preview và MP4 khác nhau. `editorial-study.html` không được tạo thêm composition root cạnh index.
- Native-study có asset hero lịch sử còn trong thư mục, nhưng không dùng làm nội dung chính. Asset cũ còn trên đĩa không có nghĩa là vai trò cũ được khuyến nghị.
- v0.2 chưa tạo voice mới hoặc kiểm tra ASR mới; pipeline được giữ lại, không có bằng chứng mới về chất lượng nghe chỉ từ bài thử im lặng.
- Những ghi chú “No commit/push” hoặc “acceptance pending” trong QA cũ phản ánh thời điểm viết báo cáo. Trạng thái phiên hiện tại lấy theo tài liệu này, trao đổi người dùng và Git thực tế.

## 4. Git và tính tái tạo

Commit phiên này gồm hai skill mới, source ba project, assets/font/license/prompt/provenance, QA reports, bộ ref AGI và tài liệu này. Không tự sửa Bento/Noir cũ hay root package.json.

Có **149 deletion đã tồn tại trước phiên**, cố ý không stage: `projects/noir-story/solid-s-invoice/`, `projects/noir-story/solid-s-invoice-v2/`, `references/boris-claude-setup-carousel/`, và `references/think-fast-slow/think1.html` đến `think6.html`. Working tree vì vậy vẫn dirty sau push. Đừng restore hoặc commit chúng nếu chưa có chỉ dẫn liên quan.

Git bỏ qua `renders/`, `snapshots/`, narration `vo-*`/`voice*`, `node_modules/`, runtime/cache; Remotion còn bỏ qua `public/` và `build/`. **Các MP4/voice đã kiểm tra vẫn ở máy này, không nằm trong commit.** Clone mới cần cài runtime, tạo lại voice/media và render. Đổi voice hoặc tạo TTS lại có thể làm duration/cue khác; phải sync và QA lại, không dùng report cũ như bằng chứng cho file mới.

Dùng `git status --short`, `git log -1` và đối chiếu remote khi bắt đầu. Không dùng `git add -A` trên workspace này một cách máy móc.

## 5. Bước tiếp theo cụ thể

1. Đọc `AGENTS.md`, Architect `SKILL.md`, `references/art-direction.md`, `composition-grammar.md`, `story-motion.md`, `asset-library.md`, `validation.md`; xem `native-study-02/qa.md` và MP4 nếu còn local.
2. Xác nhận nhiệm vụ mới của người dùng. Đề xuất hữu ích nhất là **một video Architect v0.2 hoàn chỉnh có voice**, để kiểm chứng nhịp giải thích sau bài thử 18s. Có thể làm một phiên bản Compiler 0.6 mới để so sánh có kiểm soát, nhưng chủ đề này chưa được chốt cho tác vụ tiếp theo.
3. Tạo project mới bằng scaffold; giữ nguyên Compiler cũ. Viết storyboard trước lời đọc: đối tượng nào tồn tại, trạng thái trước, thao tác, thời điểm commit, kết quả và phần phải giữ nguyên. Không cần thêm framework.
4. Chọn bố cục theo quan hệ; giữ đặc trưng Architect qua chữ, tỷ lệ, khung, thước, khoảng trống và màu. Nền có thể chỉ dùng CSS. Nếu gen ảnh, chỉ gen nền trừu tượng và lưu đúng provenance.
5. Làm trước một đoạn thao tác nhân quả đại diện, render và xem before/mid/after. Kiểm tra kết quả không lộ sớm, nguồn không biến mất sai, ảnh không che mô hình; lia ảnh/đổi tiêu đề không thay cho giải thích.
6. Sau khi đoạn này rõ mới hoàn thiện voice Hải Đăng 1.0, phrase cues/karaoke và cả bài. Nếu quay lại Compiler, chạy C thật và giữ chú thích giản lược.
7. QA cả bài: từng cảnh, reverse seek, vùng phụ đề, font Việt, tương phản, cue/âm thanh, tắt nền, motion manifest cho custom timeline, HyperFrames lint/check, ffprobe và full ffmpeg decode. Ghi rõ chưa nghe/chưa kiểm tra gì; không biến các khoảng tĩnh thành lỗi mặc định nếu có nhiệm vụ đọc cụ thể.
8. Bàn giao MP4 và source, nêu thay đổi có ích thực tế. Dừng khi đạt mục tiêu; không tự mở lại thử nghiệm Remotion hay sửa video lịch sử.

Lệnh tham khảo, thay placeholder bằng đường dẫn project thật và đọc `--help` khi cần:

```sh
source scripts/activate.sh
python .agents/skills/explainer-architect-story-voice/scripts/new-project.py <new-dir> --language vi
python .agents/skills/explainer-architect-story-voice/scripts/validate-script.py --project <new-dir>
python .agents/skills/explainer-architect-story-voice/scripts/tts.py --project <new-dir> --engine vieneu
python .agents/skills/explainer-architect-story-voice/scripts/sync-narration.py --project <new-dir> --no-bgm
python .agents/skills/explainer-architect-story-voice/scripts/motion_audit.py --project <new-dir> --custom-operations <manifest.json>
./node_modules/.bin/hyperframes lint <new-dir>
./node_modules/.bin/hyperframes check <new-dir>
./node_modules/.bin/hyperframes render <new-dir> --quality high --output <new-dir>/renders/final.mp4
python3 -m unittest discover -s .agents/skills/explainer-architect-story-voice/scripts/tests
```

Runtime đã dùng: HyperFrames 0.8.75, Node 24.21.0 (yêu cầu Node 22+), Python/TTS dùng shared runtime trong repo. `quick_validate.py` của skill-creator cần PyYAML; môi trường `.runtime/agentvid/vieneu-env/bin/python` đã có, `.venv` không có. Browser test hỗ trợ `CHROME_PATH`; không phụ thuộc cứng đường dẫn Chrome nằm trong cache của demo Remotion.

Không tự commit/push cho công việc mới chỉ vì phiên trước đã được duyệt push; làm theo yêu cầu mới nhất của người dùng.
