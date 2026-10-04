# Compiler là gì?

## 00
Bạn vừa viết một chương trình C để in lời chào. Nhưng CPU không đọc tiếng C như chúng ta. Vậy ai nối những dòng chữ này với phần cứng?

## 01
Bắt đầu từ tệp hello chấm cê. Bên trong là văn bản mà người lập trình viết, gọi là mã nguồn. Ta theo dõi một dòng.

## 02
Dòng được tô màu yêu cầu chương trình in ra chữ Chao ban, rồi xuống dòng. Hãy giữ lại ý định: khi chạy, ta muốn thấy lời chào.

## 03
Vấn đề là CPU thực thi lệnh máy, được mã hóa bằng các bit. Nó không trực tiếp lấy câu lệnh C này để làm theo. Hai phía đang dùng hai cách biểu diễn khác nhau.

## 04
Phần mềm đứng ở giữa được gọi là compiler, hay trình biên dịch. Nó đọc mã nguồn, phân tích chương trình, rồi chuyển sang dạng mã cho máy đích.

## 05
Có thể hình dung việc này như dịch một bản hướng dẫn sang cách viết mà bên nhận dùng được. Ý định in lời chào được giữ lại, còn cách biểu diễn thay đổi.

## 06
Bàn chuyển đổi trên hình chỉ là minh họa. Compiler không phải một chiếc máy riêng trong máy tính. Nó cũng là một chương trình, chẳng hạn Clang, chạy trên máy của bạn.

## 07
Bây giờ, ta dùng Clang để tạo chương trình từ tệp hello chấm cê. Công cụ đọc đầu vào và xử lý nó. Sơ đồ gom lại các bước tạo chương trình.

## 08
Lưu ý rằng tệp nguồn không biến mất. Bạn vẫn có thể mở nó để đọc và sửa. Quy trình biên dịch tạo ra một đầu ra khác, chứ không biến tệp C thành một tệp không đọc được.

## 09
Với ví dụ này, đầu ra là tệp hello có thể chạy trên máy hiện tại. Nó chứa mã máy cùng những phần cần thiết khác. Lời chào vẫn chưa xuất hiện, vì ta mới tạo chương trình.

## 10
Các ô nhỏ này tượng trưng cho lệnh máy, không phải mã nhị phân thật. Một dòng C cũng không nhất thiết thành đúng một lệnh máy. Điều cần nhớ là CPU có thể thực thi dạng lệnh đó.

## 11
Để thấy kết quả, ta chạy tệp hello vừa tạo. Hệ điều hành đưa chương trình vào hoạt động. Lúc này, CPU mới thực thi các lệnh của chương trình ấy.

## 12
Trong lúc chạy, chương trình thực hiện việc in lời chào qua các chức năng của thư viện và hệ điều hành. Trên màn hình, chữ Chao ban xuất hiện. Đó là kết quả ta đã yêu cầu trong mã nguồn.

## 13
Đặt dòng C ban đầu cạnh kết quả vừa chạy: cùng một lời chào. Compiler giúp chuyển cách biểu diễn để chương trình có thể được thực thi; nó không tự chọn nội dung lời chào thay bạn.

## 14
Ta đã nhìn thấy hai kết quả khác nhau. Biên dịch tạo ra chương trình có thể chạy. Chạy chương trình mới làm lời chào xuất hiện.

## 15
Hãy nhớ chuỗi vừa đi qua: mã nguồn C, trình biên dịch, mã máy, rồi CPU thực thi. Compiler là chiếc cầu chuyển cách biểu diễn. Còn điều chương trình làm, bắt đầu từ mã nguồn bạn viết.