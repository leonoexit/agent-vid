# Lỡ push API key lên GitHub: xóa đi đã đủ chưa?

Bạn lỡ đẩy một API key lên GitHub công khai. Hoảng quá, xóa dòng đó, rồi commit lại. Vậy là an toàn chưa? Chưa.

Bản mới đã sạch, nhưng Git vẫn giữ lịch sử. Mở commit cũ, dòng chứa key vẫn còn nguyên. Xóa ở hiện tại không xóa được quá khứ.

Và nếu ai đó đã chép key, kể cả dọn lịch sử cũng không lấy lại được bản sao ấy. Key còn hiệu lực thì họ vẫn có thể dùng.

Ưu tiên đầu tiên: vào dịch vụ đã cấp key, thu hồi key bị lộ. Khi key cũ hết hiệu lực, bản sao của nó cũng không còn mở cửa được.

Tạo key mới, cập nhật ứng dụng qua biến môi trường hoặc kho bí mật, rồi kiểm tra nhật ký sử dụng và chi phí bất thường. Sau đó xử lý phần dữ liệu còn lộ trong kho mã.

Nhớ nhé: xóa dòng chữ là sửa mã. Thu hồi key mới là chặn quyền truy cập. Đừng nhầm hai việc đó.