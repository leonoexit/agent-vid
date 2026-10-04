# scanf v2 — final phrase-to-picture score

14 shots, 74.44 seconds. Voice: Hải Đăng, speed 1.0. Blue input is submitted history, not an unread buffer. Yellow age starts at 0; purple call converts/writes; green count records one assigned item. Code stays exact; spoken “scan ép”, “biến tuổi”, “nờ” improves Vietnamese pronunciation.

## 1. Chuẩn bị một biến (5.06s)

Ta tạo biến nguyên lưu tuổi, ban đầu bằng không. Đây là nơi sẽ nhận số người dùng nhập.

| Cue | Spoken phrase | Visible action |
|---|---|---|
| 5.41s | tạo biến | show: age  |
| 5.61s | biến nguyên | code: code  |
| 6.75s | bằng không | reveal: age  |
| 7.81s | nơi sẽ nhận | text: subtitle age: biến sẽ nhận kết quả |
| 7.81s | nơi sẽ nhận | sticker: reader-curious  |
## 2. Người dùng nhập gì? (9.48s)

Bạn gõ mười tám rồi Enter. Dữ liệu nhập lúc này là các ký tự, chưa phải giá trị trong biến tuổi.

| Cue | Spoken phrase | Visible action |
|---|---|---|
| 9.63s | Bạn gõ | show: input  |
| 10.01s | mười tám | reveal: input  |
| 12.39s | các ký tự | reveal: input  |
| 12.89s | chưa phải | spotlight: ['input']  |
| 12.89s | chưa phải | text: subtitle Chữ "18" ở đầu vào; age vẫn bằng 0 |
## 3. Gọi scanf (14.78s)

Ta dùng hàm scan ép để đọc đầu vào. Nhưng hàm cần biết đọc kiểu gì và ghi vào đâu.

| Cue | Spoken phrase | Visible action |
|---|---|---|
| 15.29s | hàm scan ép | show: scan  |
| 16.05s | đọc đầu vào | reveal: scan  |
| 17.81s | đọc kiểu gì | text: subtitle 1. Đọc kiểu gì? |
| 18.67s | ghi vào đâu | text: takeaway 2. Ghi vào đâu? |
## 4. Đọc kiểu gì? (19.76s)

Phần trăm đê yêu cầu đọc một số nguyên thập phân. Nó hướng dẫn cách hiểu các ký tự vừa nhập.

| Cue | Spoken phrase | Visible action |
|---|---|---|
| 19.91s | Phần trăm đê | set: scan %d |
| 19.91s | Phần trăm đê | code: code  |
| 21.41s | số nguyên | focus: ['scan']  |
| 23.11s | cách hiểu | text: subtitle %d → chuyển chữ số thành số nguyên |
| 23.11s | cách hiểu | sticker: reader-curious  |
## 5. Ghi vào đâu? (24.98s)

Còn dấu và trước tên biến lấy địa chỉ của biến. Địa chỉ chỉ ra nơi scan ép phải ghi kết quả.

| Cue | Spoken phrase | Visible action |
|---|---|---|
| 25.35s | dấu và | reveal: age  |
| 25.35s | dấu và | code: code  |
| 26.43s | địa chỉ của biến | spotlight: ['age']  |
| 28.43s | nơi scan ép | text: subtitle &age → địa chỉ để ghi kết quả |
## 6. Ghép thành lời gọi (30.44s)

Ghép hai phần vào lời gọi này. Địa chỉ của biến tuổi được truyền cho hàm, cùng định dạng phần trăm đê.

| Cue | Spoken phrase | Visible action |
|---|---|---|
| 30.73s | Ghép hai phần | code: code  |
| 32.37s | Địa chỉ của biến tuổi | transfer: scan &age |
| 33.99s | cùng định dạng | text: subtitle Kiểu đọc + địa chỉ đích |
## 7. Từ ký tự thành số (35.74s)

Hàm đọc các ký tự mười tám. Theo định dạng đã cho, chúng được chuyển thành số nguyên mười tám.

| Cue | Spoken phrase | Visible action |
|---|---|---|
| 36.06s | đọc các ký tự | spotlight: ['input', 'scan']  |
| 37.55s | Theo định dạng | transfer: scan 18 |
| 38.99s | chuyển thành | set: scan  |
| 39.35s | số nguyên mười tám | text: subtitle "18" → số nguyên 18 |
## 8. Ghi vào biến age (40.72s)

Số vừa đọc được ghi vào địa chỉ đã truyền. Khi ghi xong, biến tuổi đổi từ không thành mười tám.

| Cue | Spoken phrase | Visible action |
|---|---|---|
| 40.87s | Số vừa đọc | transfer: age 18 |
| 42.85s | Khi ghi xong | focus: ['age']  |
| 42.85s | Khi ghi xong | sticker: reader-curious  |
| 43.75s | biến tuổi đổi | set: age  |
| 43.75s | biến tuổi đổi | sticker: reader-pleased  |
| 44.63s | thành mười tám | text: takeaway age = 18 |
## 9. Giá trị và địa chỉ (45.86s)

Nhìn lại: biến tuổi đang giữ mười tám. Còn địa chỉ của biến tuổi vẫn là nơi hàm vừa ghi vào.

| Cue | Spoken phrase | Visible action |
|---|---|---|
| 46.79s | biến tuổi đang giữ | spotlight: ['age']  |
| 47.21s | giữ mười tám | text: subtitle age: giá trị 18 |
| 48.31s | địa chỉ của biến tuổi | text: takeaway &age: địa chỉ của biến |
## 10. scanf còn trả về gì? (51.16s)

Hàm còn trả về số mục đã gán thành công. Ở đây chỉ có một mục, nên kết quả trả về là một.

| Cue | Spoken phrase | Visible action |
|---|---|---|
| 51.40s | Hàm còn | hide: scan  |
| 52.01s | số mục | show: count  |
| 52.01s | số mục | code: code  |
| 54.21s | một mục | reveal: count  |
| 55.41s | trả về là một | reveal: count  |
| 55.41s | trả về là một | text: subtitle n = 1: đã gán được một số |
| 55.41s | trả về là một | sticker: reader-pleased  |
## 11. Kiểm tra trước khi dùng (56.54s)

Ta kiểm tra nờ có bằng một không. Nếu không, đừng dùng biến tuổi như một lần nhập số thành công.

| Cue | Spoken phrase | Visible action |
|---|---|---|
| 56.85s | kiểm tra nờ | code: code  |
| 57.61s | bằng một | spotlight: ['count']  |
| 58.89s | đừng dùng biến tuổi | text: takeaway Chỉ dùng kết quả khi n == 1 |
## 12. Theo dõi trọn đường đi (61.68s)

Vậy dữ liệu đi từ chữ nhập vào, qua bước đọc số, rồi được ghi vào biến tuổi. Sau đó kiểm tra kết quả trả về.

| Cue | Spoken phrase | Visible action |
|---|---|---|
| 62.73s | chữ nhập vào | focus: ['input']  |
| 63.67s | bước đọc số | text: subtitle Đọc theo %d |
| 64.85s | ghi vào biến tuổi | focus: ['age']  |
| 64.85s | ghi vào biến tuổi | text: takeaway Ghi qua &age |
| 66.69s | kết quả trả về | focus: ['count']  |

## Generated anchors

Two immutable PNGs from one Maple reader family, curious and pleased. Safe zone x=652,y=355,w=198,h=210. Curious guide enters after initial variable setup; a small reaction follows the format explanation; pose changes after the write. The pleased guide reacts once at the count result. No continuous drift, data in artwork, or generated technical text. Hero mascot sits in the separate gap above the pair. Prompt/source hashes in asset-manifest and asset-requests.

## Reference adaptation

Implements Maple bento palette, outlined cards, hard shadows, serif titles, native code, comparisons and word-linked disclosure. No source CTA/export behavior or unsupported charts/camera APIs.
