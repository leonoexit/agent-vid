# Kho asset Pop

Kho chung: `asset-library/pop/`. Gallery: `asset-library/pop/index.html` (mở trực tiếp, không cần server). Công cụ: `scripts/pop-assets.py`, dùng Python/Pillow đã có sau `source scripts/activate.sh`.

Kho hiện phục vụ skill Pop Motion và giữ toàn bộ asset/lịch sử sử dụng của các dự án Pop Collage, Pop Narrative. Hai skill cũ đã được lưu trữ ngày 2026-10-10; việc này không xóa hoặc đổi đường dẫn asset. Ảnh có thể là chủ thể giải thích, nhãn chữ hoặc chi tiết của bố cục theo storyboard; không áp dụng giới hạn “chỉ là trang trí” của kho Bento.

## Quy trình khi làm video

1. Từ storyboard, xác định đối tượng, vai trò, góc nhìn, trạng thái và chất liệu cần có.
2. Tìm trong kho bằng vài từ ngắn tiếng Việt/Anh. Mở ảnh gốc của ứng viên để xem bằng mắt. So sánh silhouette, màu, góc nhìn, chữ có sẵn, độ phân giải và vùng chữ; kết quả tìm kiếm không tự quyết định độ phù hợp.
3. Chọn **dùng lại / tạo biến thể / tạo mới**. Không dùng ảnh sai vai trò chỉ vì có sẵn, không gen lại một vật phù hợp chỉ vì quên tìm. Không có quota ảnh hoặc quota tái sử dụng. Ghi quyết định ngắn gọn cùng shot score.
4. Dùng `use` để sao chép ảnh và đầy đủ metadata vào project. Dựng bằng đường dẫn local được trả về, không hotlink/symlink trực tiếp vào kho.
5. Đăng ký ảnh mới đáng tái sử dụng ngay khi đã kiểm tra hình và alpha. Sau khi render, `record` chỉ các ID thực sự xuất hiện trong phiên bản giao; `gallery` để cập nhật trang xem.

```sh
source scripts/activate.sh
python scripts/pop-assets.py search 'máy tính'
python scripts/pop-assets.py search 'lưu trữ' --category object
python scripts/pop-assets.py search --family crt-computer
python scripts/pop-assets.py show crt-purple-blank
python scripts/pop-assets.py use crt-purple-blank --project projects/pop-motion/my-video --reason 'Máy nhận tệp trong cảnh trao đổi'
```

`search` trả ứng viên theo số từ khớp, bỏ dấu tiếng Việt, có ID/đường dẫn/lịch sử dùng. Đây là tìm từ khoá có gắn thẻ, **không phải tìm ngữ nghĩa bằng AI**. Nếu không thấy, thử tên đối tượng đơn giản hoặc bộ lọc family; đừng coi một truy vấn hụt là bằng chứng kho không có. Gallery lọc theo tất cả các từ đã nhập.

`use` sao chép vào `assets/library/<id>-<hash>.<ext>`, lưu metadata cạnh ảnh, cập nhật `library-assets.json`. Không sửa script, narration hay timing. File metadata chứa cả nguồn/prompt/giấy phép và vùng chữ. Ảnh gốc trong kho không bị sửa; nếu một bản sao project đã thay đổi, công cụ từ chối ghi đè. Trạng thái `unreviewed` không đòi xin phép mới: agent tự kiểm tra phù hợp. `rejected` bị chặn; chỉ đổi đánh giá khi có căn cứ mới hoặc chỉ thị của người dùng.

## Thêm asset hoặc biến thể

Tạo metadata JSON cùng yêu cầu gen-img. Các trường bắt buộc: `id`, `name`, `category`, `family`, `description`, `tags[]`, `roles[]`, `states[]`, `origin`, `rights.note`.

- `category`: `object`, `paper`, `lettering`, `person`.
- `tags`: cả tên Việt/Anh, chất liệu/màu và các từ thường tìm. `roles`: vai trò nội dung như lưu trữ, truyền tệp, ghi chú. `states`: điều thực sự nhìn thấy như màn hình trống, mở, đóng, nhìn thẳng. Không ghi khả năng chuyển động mà ảnh phẳng không có.
- `family` nhóm vật/bộ liên quan. `variant_of` chỉ dùng khi thật sự tạo từ asset cha; hai ảnh máy tính tạo độc lập có thể cùng family nhưng không giả là biến thể của nhau.
- `origin.kind=generated`: ghi `tool`, **prompt nguyên văn**, `reference_asset_ids` và chuỗi sửa ảnh nếu có. Dùng ảnh cha làm reference theo imagegen skill khi cần giữ nhận dạng. Giữ cả prompt ban đầu lẫn prompt chỉnh sửa chữ, không chỉ lưu prompt cuối.
- `origin.kind=photo`: ghi `source_url`, `author`, `license`, thêm `license_url`, ngày chụp, cách xử lý nếu có. Quyền dùng thuộc từng ảnh; không coi toàn bộ kho là public domain. Khi dùng ảnh Linus năm 2014, giữ attribution/CC BY-SA và không trình bày là ảnh sự kiện năm 2005.
- `origin.kind=unknown`: chỉ để giữ nguồn chưa rõ; `use` sẽ chặn đến khi làm rõ provenance. Không tự đặt giấy phép.
- `safe_text_rect: [x,y,w,h]`, `visible_bounds`, `recommended_ink` cho giấy trống, tọa độ **pixel của ảnh gốc**. Chữ phải nằm trong safe; chiều cao giấy theo đúng tỷ lệ, không kéo méo. Thumbnail chỉ để xem nhanh, không lấy làm asset render.

Có thể lấy `items/<id>/metadata.json` làm mẫu, bỏ các trường do công cụ tính như file/hash/size/added_at và sửa toàn bộ nội dung nguồn. Không chép prompt/credit của ảnh khác.

```sh
python scripts/pop-assets.py register --image /absolute/path/generated.png --metadata /absolute/path/request.json
python scripts/pop-assets.py validate
python scripts/pop-assets.py gallery
```

Ảnh PNG/JPEG/WebP được sao chép nguyên byte. Công cụ đo kích thước, alpha bounds, tạo thumbnail riêng, từ chối ID hoặc byte đã có. Có alpha không chứng minh ảnh tách nền đẹp: vẫn xem trên nền sáng/tối. Đăng ký bản mới bằng ID mới, không ghi đè original cũ. Không dùng công cụ thumbnail để “sửa” nội dung ảnh gen.

## Ghi nhận dùng và đánh giá

```sh
python scripts/pop-assets.py record --project projects/pop-motion/my-video --render projects/pop-motion/my-video/renders/final.mp4 --asset crt-purple-blank --asset paper-white-note
python scripts/pop-assets.py review crt-purple-blank --status usable --note 'Agent đã xem alpha và chi tiết ở kích thước video; không phải người dùng duyệt riêng.'
python scripts/pop-assets.py gallery
```

`record` yêu cầu render tồn tại và danh sách ID đã cài, kiểm tra hash bản sao. Tác giả phải chọn các asset thật sự lên hình; công cụ không suy ra từ pixel. Ghi lại cùng project cập nhật lịch sử dùng, không đếm thành video mới. Một ảnh cài vào project nhưng bỏ ở bản cuối không nên có trong danh sách. `usage.json` không đo retention hay chất lượng.

`review.status`: `unreviewed` / `usable` / `rejected`; note phải phân biệt nhận xét agent với lời duyệt của người dùng. Video được thích không tự duyệt từng asset. Các ảnh nhập lần đầu giữ trạng thái `unreviewed`; tay gõ bàn phím có sẵn nhưng không được ghi là đã dùng trong Git V2.

## Cấu trúc và bảo toàn

- `catalog.json`: chỉ mục tìm kiếm; không cần đọc toàn kho vào context.
- `items/<id>/original.*`: nguyên file ảnh; giữ ổn định bằng SHA-256.
- `items/<id>/metadata.json`: nguồn, prompt, variant, review, hình học.
- `items/<id>/thumbnail.png`: bản xem trước sinh tự động.
- `usage.json`: các project đã dùng, phiên bản render mới nhất được ghi.
- `index.html`: gallery sinh từ dữ liệu, xem chi tiết/prompt, lọc/tìm và đổi nền kiểm tra alpha.

Chạy các lệnh ghi tuần tự; lock ngắn bảo vệ khỏi hai agent ghi catalogue cùng lúc. Khi báo busy, thử lại; chỉ xoá lock sau khi xác minh tiến trình cũ đã kết thúc. Nếu chỉnh metadata bằng tay, cần đồng bộ catalogue; ưu tiên CLI và `validate`.

Kho không tự xoá ảnh ít dùng, không đổi file trong project cũ, không tự gen hay gọi dịch vụ. Đợt nhập đầu chỉ lấy 15 ảnh hoàn chỉnh từ hai project hiện còn trên máy và bộ backplate; không tự giải nén/nhập toàn bộ lịch sử đã lưu trữ.
