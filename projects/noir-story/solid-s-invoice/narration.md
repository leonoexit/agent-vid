# S trong SOLID — lời kể

## 01. Một lớp. Hai lời nhờ sửa.

Đổi mẫu hóa đơn, vì sao phải mở cả lớp tính tiền? Theo dõi hai yêu cầu thay đổi để hiểu chữ S trong SOLID.

## 02. Bên trong lớp hóa đơn

Ta có một lớp hóa đơn. Lớp là nơi gom dữ liệu và các hàm liên quan. Trong ví dụ này, nó đang ôm cả hai phần việc.

## 03. Tính tiền và trình bày

Một hàm tính số tiền khách phải trả. Hàm kia trình bày hóa đơn thành bản in. Hai hàm cùng nằm trong một lớp, nhưng ai yêu cầu chúng thay đổi?

## 04. Yêu cầu thứ nhất

Bộ phận kinh doanh muốn đổi mức giảm giá. Yêu cầu này tác động đến cách tính tiền, dù mẫu hóa đơn vẫn giữ nguyên.

## 05. Yêu cầu thứ hai

Bộ phận vận hành muốn đổi tiêu đề bản in. Cách tính tiền không đổi. Vậy một lớp đang phải đáp ứng hai nhóm yêu cầu độc lập.

## 06. Một lý do để thay đổi

S là nguyên tắc đơn trách nhiệm. Một mô đun nên có một lý do để thay đổi: phục vụ một nhóm nhu cầu gắn kết. Ở đây, hai nhóm đang đổi vì hai lý do khác nhau.

## 07. Tách theo lý do thay đổi

Ta tách mã theo hai lý do ấy. Giữ nguyên dữ liệu hóa đơn, rồi chuyển phần tính toán sang lớp tính tiền.

## 08. Một nơi lo trình bày

Phần tạo bản in chuyển sang lớp trình bày. Vẫn hai phần việc cũ, nhưng mỗi lớp giờ có ranh giới trách nhiệm rõ hơn.

## 09. Hai lớp vẫn phối hợp

Khi tạo hóa đơn, dữ liệu đi vào phần tính tiền. Kết quả được chuyển cho phần trình bày để tạo bản in. Tách trách nhiệm vẫn cho phép các phần phối hợp.

## 10. Thử đổi mức giảm giá

Thử yêu cầu đầu tiên: kinh doanh đổi giảm giá từ không lên mười phần trăm. Ta sửa quy tắc ở lớp tính tiền. Phần trình bày giữ nguyên.

## 11. Kết quả: 90.000 đồng

Với hóa đơn một trăm nghìn đồng, số phải trả còn chín mươi nghìn. Chạy lại, bản in nhận số tiền mới mà không cần sửa mã trình bày.

## 12. Thử đổi tiêu đề bản in

Giờ vận hành muốn đổi tiêu đề thành phiếu thanh toán. Ta sửa lớp trình bày. Quy tắc giảm giá ở lớp tính tiền vẫn như cũ.

## 13. Số tiền vẫn đúng

Chạy lại cùng dữ liệu: tiêu đề đã đổi, số tiền vẫn là chín mươi nghìn. Hai yêu cầu vừa rồi đã đi đến hai nơi sửa riêng biệt.

## 14. Không phải đếm số hàm

Đơn trách nhiệm không có nghĩa mỗi lớp chỉ có một hàm. Lớp tính tiền có thể cộng hàng, tính giảm giá, rồi tính tổng, nếu chúng cùng phục vụ quy tắc tính tiền.

## 15. Điều gì khiến mã phải đổi?

Khi xem một lớp, hãy hỏi: ai cần nó thay đổi, và vì sao? Gom phần mã đổi cùng lý do, tách phần đổi vì lý do độc lập. Đó là chữ S trong SOLID.