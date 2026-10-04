# C — mục 0.3

## 01 · Vì sao vẫn học C?

Bạn muốn làm một chiếc máy đo nhiệt độ. Có người chọn C, người khác chọn Python, JavaScript, hoặc C cộng cộng. Vì sao có nhiều lựa chọn? Hãy đi theo một số đo để tìm hiểu.

## 02 · Một số đo. Ba công việc.

Cảm biến là bộ phận đo đại lượng ngoài đời. Giả sử nó ghi nhận hai mươi sáu độ. Hệ thống cần đọc số đo, xử lý các số đã lưu, rồi hiển thị cho chúng ta xem.

## 03 · Ai làm việc sát thiết bị?

Ngay cạnh cảm biến là một con chip nhỏ điều khiển thiết bị. Nó có bộ nhớ giữ dữ liệu, nhưng dung lượng có giới hạn. Ta cần biết chương trình dùng bao nhiêu chỗ và làm những gì.

## 04 · Kiểm soát chi tiết

C cho người viết quyền kiểm soát cách dùng dữ liệu và bộ nhớ. Ta có thể dành vùng chứa một trăm số đo, theo dõi đã lưu bao nhiêu, rồi quyết định cách xử lý khi vùng đó đầy.

## 05 · Đầy rồi thì sao?

Khi số đo mới tới, một lựa chọn là ghi đè số cũ nhất. Người viết phải kiểm tra giới hạn trước khi ghi. Ghi ngoài vùng đã dành có thể gây lỗi. Quyền kiểm soát đi cùng trách nhiệm.

## 06 · Cùng dữ liệu, việc khác

Đem dữ liệu sang máy tính để tính nhiệt độ trung bình. Python có danh sách có thể lớn thêm khi nhận số mới. Nhiều chi tiết bộ nhớ được môi trường chạy lo giúp, để bạn tập trung vào bài toán.

## 07 · Trừu tượng là gì?

Che bớt chi tiết bằng cách dùng đơn giản hơn gọi là trừu tượng. Bạn yêu cầu thêm số đo vào danh sách, thay vì tự sắp xếp vùng nhớ. Chi tiết vẫn tồn tại ở bên dưới.

## 08 · Ít việc phải tự lo hơn

Python có nhiều thư viện, tức phần mã làm sẵn để tái sử dụng. Đọc dữ liệu hay vẽ biểu đồ nhờ đó thường thuận tiện. C cũng có thư viện; lựa chọn tùy mức tiện lợi và mức kiểm soát cần thiết.

## 09 · Không phải cuộc đua tốc độ

Điều này không có nghĩa C luôn nhanh hơn Python. Tốc độ còn tùy cách giải bài toán và thư viện. Python thậm chí có thể gọi mã viết bằng C để xử lý công việc nặng ở bên dưới.

## 10 · Từ dữ liệu đến giao diện

Bây giờ, đưa nhiệt độ lên một trang web. Giao diện là phần người dùng nhìn thấy và tương tác: con số, biểu đồ, nút bấm. Khi số đo đổi, giao diện cũng cần cập nhật theo.

## 11 · Một lần bấm, một phản hồi

JavaScript thường xử lý tương tác trong trình duyệt. Bạn bấm nút làm mới; số đo vừa nhận thay cho số cũ trên màn hình. Trình duyệt chính là ứng dụng bạn dùng để mở trang web.

## 12 · Còn có phía máy chủ

JavaScript không chỉ chạy trong trình duyệt. Với môi trường như Node, nó chạy được ở máy chủ, là máy nhận yêu cầu rồi gửi dữ liệu cho ứng dụng. Đừng gắn một ngôn ngữ với duy nhất một vị trí.

## 13 · Có thể cùng làm một hệ thống

Ta có thể dùng C trong thiết bị, Python để phân tích, và JavaScript cho giao diện. Đây không phải luật bắt buộc. Các phần trao đổi số đo với nhau, tạo thành một hệ thống liền mạch.

## 14 · Tên gần nhau, nhưng khác

C cộng cộng phát triển từ C, bổ sung nhiều cơ chế tổ chức và tái sử dụng chương trình. Đây là hai ngôn ngữ riêng, có quy tắc khác nhau, chứ không đơn giản là C đính thêm vài chức năng.

## 15 · Khi có nhiều cảm biến

Nếu có nhiều loại cảm biến, C cộng cộng có lớp: cách mô tả dữ liệu và thao tác liên quan. Ta gom số đo với thao tác đọc trong một thiết kế, rồi tạo nhiều đối tượng từ đó.

## 16 · Nhiều cách tổ chức chương trình

C vẫn tổ chức được chương trình lớn bằng cách chia dữ liệu và công việc thành các phần. C cộng cộng có thêm cơ chế ngôn ngữ diễn đạt quan hệ ấy. Dùng lớp hay không còn tùy bài toán.

## 17 · 01 · Kiểm soát tài nguyên

Trở lại con chip nhỏ: C giúp kiểm soát tài nguyên, gồm bộ nhớ và năng lực xử lý. Khi chúng có giới hạn, hiểu chương trình dùng chúng ra sao là một yêu cầu thực tế.

## 18 · 02 · Phần mềm nền tảng

C hiện diện trong phần mềm hệ thống, giúp máy và chương trình khác hoạt động. Phần lớn nhân Linux viết bằng C. Nhân là phần lõi hệ điều hành, quản lý bộ nhớ và giao tiếp với thiết bị.

## 19 · 03 · Nền tảng đã có

C còn có lượng mã, thư viện và công cụ tích lũy qua nhiều năm. Thành phần đang đáp ứng tốt yêu cầu thì thay hết chưa chắc có lợi. Ngôn ngữ khác có thể kết hợp với nền tảng ấy.

## 20 · Kiểm soát cần sự cẩn thận

Quyền kiểm soát đòi hỏi cẩn thận hơn. Đọc hoặc ghi sai vùng nhớ có thể gây lỗi nghiêm trọng. Học C cần hiểu giới hạn, kiểm tra dữ liệu và dùng công cụ tìm lỗi, không chỉ chạy được chương trình.

## 21 · Công việc cần điều gì?

Với xử lý dữ liệu, hãy xét thư viện sẵn có. Với giao diện web, hãy xét môi trường trình duyệt. Khi làm sát thiết bị, mức kiểm soát thường quan trọng. Hãy bắt đầu từ yêu cầu công việc.

## 22 · Các lựa chọn có phần giao nhau

Các vùng này có phần giao nhau. Python chạy được trên một số thiết bị; C cộng cộng cũng làm phần mềm hệ thống. Ví dụ này không chia thành bốn ngăn kín. Không ngôn ngữ nào thắng mọi bài toán.

## 23 · Nhìn rõ phần bên dưới

Học C cho bạn điều gì? Hiểu dữ liệu được biểu diễn, lưu giữ và xử lý ra sao, cùng trách nhiệm người viết. Bạn đang học một công cụ với những đánh đổi cụ thể, không cần giỏi mọi ngôn ngữ trước.

## 24 · Chọn theo việc cần làm

Cùng một số đo có thể đi qua nhiều ngôn ngữ. C có chỗ đứng khi khả năng kiểm soát và nền tảng sẵn có phù hợp yêu cầu. Hãy học cách làm việc với các lựa chọn ấy, từng bước một.