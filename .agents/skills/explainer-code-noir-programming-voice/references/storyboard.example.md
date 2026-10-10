# Example: print versus return in Python

Audience: beginner who knows assignment and function calls. One question: why is 5 visible while x receives None? This is a model script; actual timing comes from the generated narration, not a fixed scene quota.

## 1. Opening question

Purpose: Separate an observable console message from the value received by x.

Layout: `claim`. Heading: In ra 5. / Sao x là None?

**Narration**

Hàm đã in ra số năm. Nhưng biến nhận kết quả lại là None. Vì sao có hai kết quả khác nhau?

**Screen evidence and cues**

- At “Vì sao”: text.
  Nhìn thấy một số ≠ nhận về một số.

## 2. Evidence: print

Purpose: Keep the snippet visible, reveal printed output 5, then label x as None. Explain the absent return before concluding.

Layout: `code-output`. Heading: Số 5 đi ra đâu?

**Narration**

Trong Python, hàm total gọi print với hai cộng ba. Khi ta gọi hàm, số năm xuất hiện ở đầu ra. Nhưng hàm không có return trả giá trị, nên tự trả None. Vì vậy, x nhận None.

**Screen evidence and cues**

- At “hàm total”: PYTHON.

```python
def total():
    print(2 + 3)

x = total()
```

- At “số năm xuất hiện”: ĐẦU RA CỦA PRINT.
  5
- At “x nhận None”: GIÁ TRỊ X NHẬN.
  None

## 3. Controlled change: return

Purpose: Keep total, x and 2 + 3 constant. Replace the relevant line; reveal x = 5. State that this version prints nothing.

Layout: `code-output`. Heading: Trả về nơi gọi.

**Narration**

Bây giờ thay print bằng return hai cộng ba. Return đưa giá trị năm về nơi gọi hàm. Phép gán lưu giá trị đó vào x. Lần này, hàm không tự in gì ra, vì không còn lệnh print.

**Screen evidence and cues**

- At “thay print”: PYTHON.

```python
def total():
    return 2 + 3

x = total()
```

- At “lưu giá trị đó”: GIÁ TRỊ X NHẬN.
  5
- At “không tự in gì”: ĐẦU RA KHI CHẠY ĐOẠN CODE NÀY.
  Không có nội dung được in.

## 4. Distinction

Purpose: Hold two labelled destinations for comparison. Explicitly permit a function doing both.

Layout: `comparison`. Heading: Khác ở nơi nhận.

**Narration**

Print ghi thông tin ra đầu ra, để ta nhìn thấy. Return đưa kết quả về nơi gọi, để chương trình dùng tiếp. Đây là hai việc khác nhau; một hàm có thể làm cả hai.

**Screen evidence and cues**

- At “Print ghi thông tin”: PRINT.
  Đầu ra → người xem
- At “Return đưa kết quả”: RETURN.
  Nơi gọi → dùng tiếp
- At “một hàm có thể”: text.
  Một hàm có thể vừa print vừa return.

## 5. Transferable rule

Purpose: Answer the opening question; scope the implicit None rule to ordinary Python functions.

Layout: `rule`. Heading: Muốn dùng tiếp? / return giá trị.

**Narration**

Khi nơi gọi cần dùng kết quả, hãy trả nó về bằng return. Với hàm Python thông thường, không trả giá trị tường minh thì nơi gọi nhận None. Đừng lấy việc đã in ra làm bằng chứng rằng hàm đã trả về số đó.

**Screen evidence and cues**

- At “không trả giá trị”: text.
  Hàm Python thông thường:
không trả giá trị → None.
- At “Đừng lấy việc”: text.
  Đã in ra ≠ đã trả về.

## Semantics check

Both snippets in template/script.json were executed as ordinary Python code. The print version writes `5\n` and binds x to None; the return version writes nothing and binds x to 5. A third check confirms a function may print and return in the same call. No generated imagery, synthetic error messages or invented console logs are necessary.

A full voiced test has not been produced as part of skill creation.
