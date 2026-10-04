# Storyboard — C curriculum 0.3

## Format override and visual contract

User explicitly requested a 3–4 minute comparative podcast for section 0.3. This project omits storyFormat and uses legacy schema validation intentionally; it does not invent setup/execute/verify tags. Bento continues to default to worked-trace-v1 for ordinary programming traces. This is not a new general podcast skill.

Audience: people beginning programming. One narrator, Hải Đăng, speed 1.0, no BGM. One temperature-system scenario; each unfamiliar necessary term is explained where first used. A section contains several phrase-level beats, not one static slide.

Colors: C blue; Python yellow; JavaScript purple; C++ orange. Colors identify languages, not exclusive capabilities. Orange moving tokens mean active data; negative destinations use an explicit text label and red border on white. Static comparison labels are not speed rankings.

Emphasis: native spans with stable generated selectors; yellow backing for the active clause, pale foreground accents only on charcoal. Icons: local FA Free Solid 6.4.0, no brand logo family or ImageGen.

| Section | Composition / source | Visible before | Spoken cue sequence | Native actions / visible after | Icon |
|---|---|---|---|---|---|
| 00 · Vì sao vẫn học C? | Poster + subject / think1/01; think3/24 | C và ba tên ngôn ngữ cùng một số đo | một chiếc máy đo nhiệt độ → nhiều lựa chọn → một số đo | Các tên tập hợp quanh bài toán; số đo trở thành điểm neo | temperature-half |
| 01 · Một số đo. Ba công việc. | Stacked flow / think1/09; think3/30 | Một số đo được cảm biến đọc | hai mươi sáu độ → đọc số đo → xử lý các số → hiển thị | Số 26 đi qua đọc → xử lý → hiển thị | temperature-half, chart-line, window-maximize |
| 02 · Ai làm việc sát thiết bị? | Nested detail / think4/37; think2/21 | Chip trong thiết bị | một con chip nhỏ → bộ nhớ → dung lượng có giới hạn → bao nhiêu chỗ | Mở vùng nhớ bên trong thiết bị và kiểm tra các ô | microchip, memory |
| 03 · Kiểm soát chi tiết | Capacity trace / think3/31 | Vùng 100 ô, chưa ghi | quyền kiểm soát → một trăm số đo → đã lưu bao nhiêu → vùng đó đầy | Ba số đi vào các ô; bộ đếm từ 0 lên 3 | native cells |
| 04 · Đầy rồi thì sao? | Reset + overwrite / think3/27; think4/42 | Ví dụ riêng: vùng đã đầy 100/100 | số đo mới tới → ghi đè số cũ nhất → kiểm tra giới hạn → đi cùng trách nhiệm | Số 28 thay ô cũ 24; đường biên chỉ giới hạn | native cells |
| 05 · Cùng dữ liệu, việc khác | List expansion / think1/09 | Bộ ba 26, 27, 25; trung bình 26 | tính nhiệt độ trung bình → danh sách → lớn thêm → lo giúp | Danh sách mở rộng nhận 28; kết quả cũ ngừng được nhấn | native list |
| 06 · Trừu tượng là gì? | Interface + internal detail / think2/21; think5/55 | Chi tiết quản lý vùng nhớ | Che bớt chi tiết → trừu tượng → thêm số đo → vẫn tồn tại | Giao diện Thêm số đo bao bọc chi tiết; chi tiết vẫn nằm dưới | native grouping |
| 07 · Ít việc phải tự lo hơn | Tool + result pair / think1/06; think3/29 | Thư viện bên cạnh dữ liệu | thư viện → phần mã làm sẵn → vẽ biểu đồ → mức kiểm soát | Đóng gói công cụ rồi nối sang biểu đồ biểu tượng | screwdriver-wrench, chart-line |
| 08 · Không phải cuộc đua tốc độ | Nested call flow / think1/07 | Python ở trên; C ở dưới | không có nghĩa → cách giải bài toán → mã viết bằng C → bên dưới | Lời gọi đi xuống C rồi kết quả quay về Python | native route |
| 09 · Từ dữ liệu đến giao diện | Browser detail / think5/51 | Giá trị 26 trên giao diện | một trang web → Giao diện → nút bấm → cập nhật theo | Đồ thị minh họa mở theo số mới; 26 thành 27 | window-maximize |
| 10 · Một lần bấm, một phản hồi | Interaction trace / think1/09 | Giá trị 27 và nút | JavaScript → bấm nút làm mới → thay cho số cũ → Trình duyệt | Nút nhận thao tác; số mới 28 thay 27 | window-maximize |
| 11 · Còn có phía máy chủ | Shared identity pair / think1/02; think4/37 | JavaScript/trình duyệt | không chỉ → máy chủ → gửi dữ liệu → duy nhất một vị trí | Mở thêm máy chủ cùng màu; yêu cầu và phản hồi đi hai chiều | server, window-maximize |
| 12 · Có thể cùng làm một hệ thống | System overview / think6/59 | Ba công việc đã biết | C trong thiết bị → Python để phân tích → JavaScript cho giao diện → không phải luật | Đặt C/Python/JS vào một ví dụ phân công; dữ liệu nối ba phần | native routes |
| 13 · Tên gần nhau, nhưng khác | History + distinction / think3/26 | C và C++ | phát triển từ C → tổ chức và tái sử dụng → hai ngôn ngữ riêng → khác nhau | Nối quan hệ lịch sử; tách hai thẻ hiện tại rõ ràng | code, boxes-stacked |
| 14 · Khi có nhiều cảm biến | Containment + instances / think2/21; think4/37 | Dữ liệu và thao tác chưa nhóm | nhiều loại cảm biến → có lớp → gom số đo → nhiều đối tượng | Gom trong thiết kế lớp; tạo ba cảm biến khác nhau | temperature-half |
| 15 · Nhiều cách tổ chức chương trình | Matched comparison / think1/02; think5/49 | Dữ liệu/hàm trong C | C vẫn tổ chức được → chia dữ liệu và công việc → cơ chế ngôn ngữ → tùy bài toán | Đường nối quan hệ ở C; khối tổ chức ở C++ | native groups |
| 16 · 01 · Kiểm soát tài nguyên | Resource inspection / think3/30 | Con chip là đối tượng chính | con chip nhỏ → kiểm soát tài nguyên → bộ nhớ và năng lực xử lý → yêu cầu thực tế | Tách hai nhánh tài nguyên: bộ nhớ và xử lý | microchip, memory, sliders |
| 17 · 02 · Phần mềm nền tảng | Nested system / think2/21 | Hệ điều hành là vùng chứa | phần mềm hệ thống → nhân Linux → phần lõi → giao tiếp với thiết bị | Mở nhân Linux rồi nối đến bộ nhớ/thiết bị | microchip, memory |
| 18 · 03 · Nền tảng đã có | Foundation + connection / think6/59 | Mã C sẵn có | lượng mã → đáp ứng tốt yêu cầu → chưa chắc có lợi → kết hợp | Giữ thành phần đáp ứng tốt rồi nối yêu cầu xuống nền tảng | native architecture |
| 19 · Kiểm soát cần sự cẩn thận | Invalid destination + guard / think4/39; think6/60 | Vùng nhớ có biên | cẩn thận hơn → sai vùng nhớ → hiểu giới hạn → công cụ tìm lỗi | Số đến ngoài vùng; bước kiểm tra loại điểm ghi không hợp lệ | shield-halved |
| 20 · Công việc cần điều gì? | Requirement rows / think3/30 | Ba nhu cầu công việc | xử lý dữ liệu → giao diện web → sát thiết bị → yêu cầu công việc | Ghép từng nhu cầu với tiêu chí lựa chọn tương ứng | chart-line, window-maximize, microchip |
| 21 · Các lựa chọn có phần giao nhau | Overlapping sets / think2/21; think6/59 | C và C++ là các lựa chọn | giao nhau → một số thiết bị → không chia → thắng mọi bài toán | Các miền giao nhau tại phần mềm hệ thống; mở chú thích Python | native sets |
| 22 · Nhìn rõ phần bên dưới | Data close-up / think1/09; think6/64 | C và các số đo quen thuộc | điều gì → dữ liệu được biểu diễn → trách nhiệm → đánh đổi | Theo ba số qua biểu diễn, lưu giữ, xử lý; gắn trách nhiệm | native cells |
| 23 · Chọn theo việc cần làm | Rule poster + witness / think5/55; think6/66 | Số đo và các vai trò đã biết | cùng một số đo → nhiều ngôn ngữ → C có chỗ đứng → từng bước một | Số đo đi qua các vai trò rồi gom thành nguyên tắc lựa chọn | native trace |

## Timing and inspection

score.json is the exact phrase score. project-data.js binds it to local narration timing. OPERATION_SAMPLES, REVEAL_SAMPLES and EMPHASIS_SAMPLES exported by the project renderer record actual selectors and times; the generated custom-motion-review.json stores them with section attribution. The stock script motion audit sees empty stock events and is not evidence that this native extension has no motion.

Scene 03 shows three of one hundred reserved slots, with an ellipsis for the remainder. Scene 04 explicitly resets to a separate full-buffer case. Scene 05 first shows the three-value mean, then appends 28 without asserting the old mean for the new list. Graph icons are symbolic, not quantitative charts.

ASR covers all 24 narration clips and refines matching word starts, with interpolation for unmatched words. It does not certify natural pronunciation or replace human listening. Keep that limitation visible in QA.
