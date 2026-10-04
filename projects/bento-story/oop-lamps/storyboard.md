# OOP · phrase-to-picture score

Format: question → setup → decode → execute → verify → rule. 15 shots. One question, one class-based Python example. Beginners with basic logic knowledge.

HTML Slides contributes vertical card composition and a printable native HTML deck. Bento supplies Maple typography/palette, narrative, cued animation and voice. The generic landscape / agenda / font defaults are deliberately overridden by the requested portrait Bento style.

| Shot / phase | Spoken clause | Before | Visible action / knowledge after |
|---|---|---|---|
| 1 / setup | có trạng thái | Previous shot state persists; future fields/code hidden | show: data |
| 1 / setup | đang bật hay tắt | Previous shot state persists; future fields/code hidden | text: Trạng thái: bật / tắt |
| 1 / setup | cần nhớ | Previous shot state persists; future fields/code hidden | text: Dữ liệu mô tả trạng thái |
| 2 / setup | có hành vi | Previous shot state persists; future fields/code hidden | show: behavior |
| 2 / setup | như bật lên | Previous shot state persists; future fields/code hidden | text: Hành vi: bật đèn |
| 2 / setup | một phương thức | Previous shot state persists; future fields/code hidden | text: Phương thức = thao tác của đối tượng |
| 3 / decode | Gom dữ liệu | Previous shot state persists; future fields/code hidden | focus: ['data', 'behavior'] |
| 3 / decode | một đối tượng | Previous shot state persists; future fields/code hidden | text: ĐỐI TƯỢNG = DỮ LIỆU + HÀNH VI |
| 3 / decode | ý tưởng nền tảng | Previous shot state persists; future fields/code hidden | text: Object: một đối tượng trong chương trình |
| 4 / decode | Để tạo | Previous shot state persists; future fields/code hidden | hide: data |
| 4 / decode | Để tạo | Previous shot state persists; future fields/code hidden | hide: behavior |
| 4 / decode | một lớp | Previous shot state persists; future fields/code hidden | show: class |
| 4 / decode | bản thiết kế | Previous shot state persists; future fields/code hidden | text: Class · bản mô tả dùng chung |
| 4 / decode | tên Lamp | Previous shot state persists; future fields/code hidden | code: ['class Lamp:'] |
| 5 / decode | mỗi đèn mới | Previous shot state persists; future fields/code hidden | code: ['def __init__(self):', '    self.on = False'] |
| 5 / decode | thuộc tính on | Previous shot state persists; future fields/code hidden | text: Thuộc tính · dữ liệu của đối tượng |
| 5 / decode | đang tắt | Previous shot state persists; future fields/code hidden | text: on = False → đèn tắt |
| 6 / decode | Phương thức bật | Previous shot state persists; future fields/code hidden | code: ['def turn_on(self):', '    self.on = True'] |
| 6 / decode | Từ self | Previous shot state persists; future fields/code hidden | code-focus:  |
| 6 / decode | chính đối tượng | Previous shot state persists; future fields/code hidden | text: self → đối tượng nhận lời gọi |
| 7 / execute | tạo một đối tượng | Previous shot state persists; future fields/code hidden | code: ['desk = Lamp()'] |
| 7 / execute | đèn bàn | Previous shot state persists; future fields/code hidden | show: desk |
| 7 / execute | trạng thái ban đầu | Previous shot state persists; future fields/code hidden | text: desk · một đối tượng của lớp Lamp |
| 8 / execute | Tạo tiếp | Previous shot state persists; future fields/code hidden | code: ['desk = Lamp()', 'bed = Lamp()'] |
| 8 / execute | đèn ngủ | Previous shot state persists; future fields/code hidden | show: bed |
| 8 / execute | một đối tượng khác | Previous shot state persists; future fields/code hidden | text: Hai lần tạo → hai đối tượng riêng |
| 9 / execute | gọi phương thức | Previous shot state persists; future fields/code hidden | code: ['desk.turn_on()'] |
| 9 / execute | đèn bàn | Previous shot state persists; future fields/code hidden | focus: ['desk'] |
| 9 / execute | Phần trước | Previous shot state persists; future fields/code hidden | text: desk → đối tượng nhận lời gọi |
| 9 / execute | phần sau | Previous shot state persists; future fields/code hidden | text: turn_on() → hành vi được gọi |
| 10 / execute | self ở đây | Previous shot state persists; future fields/code hidden | code: ['# self chính là desk', 'self.on = True'] |
| 10 / execute | chuyển thành đúng | Previous shot state persists; future fields/code hidden | set: desk |
| 10 / execute | đèn bật | Previous shot state persists; future fields/code hidden | text: desk.on = True |
| 11 / verify | đèn ngủ | Previous shot state persists; future fields/code hidden | spotlight: ['bed'] |
| 11 / verify | vẫn tắt | Previous shot state persists; future fields/code hidden | code: ['desk.on  # True', 'bed.on   # False'] |
| 11 / verify | không nhận lời gọi | Previous shot state persists; future fields/code hidden | text: Lời gọi chỉ tác động lên desk |
| 12 / verify | Hai đối tượng | Previous shot state persists; future fields/code hidden | focus: ['desk', 'bed'] |
| 12 / verify | dùng chung cách bật | Previous shot state persists; future fields/code hidden | text: Cùng lớp Lamp → cùng cách bật |
| 12 / verify | trạng thái riêng | Previous shot state persists; future fields/code hidden | text: desk: bật   ·   bed: tắt |
| 13 / verify | đối tượng | Previous shot state persists; future fields/code hidden | focus: ['desk'] |
| 13 / verify | chứa dữ liệu | Previous shot state persists; future fields/code hidden | code: ['desk.on', 'desk.turn_on()'] |
| 13 / verify | gọi hành vi | Previous shot state persists; future fields/code hidden | code-focus:  |
| 13 / verify | thay đổi dữ liệu | Previous shot state persists; future fields/code hidden | text: Dữ liệu và hành vi gắn với một đối tượng |

## Art score
- Reading desk: intro at “Hai chiếc đèn”; everyday context. Large framed image below heading; exits at first core shot. It never encodes program state.
- Design sheet: class analogy at “bản thiết kế”, exits when first instance is created. A separate composition, not a recurring mascot.
- Native lamp SVGs: enter with desk/bed instances. Only desk lamp changes at “chuyển thành đúng”; bed stays off. No generated pixels carry code or values.
- Intro holds its question; no result is shown. Method definition in decode describes potential behavior, not an executed state change.
- Class/instance creation relationship is a native branching diagram. State remains attached to stable object names/colors.
- No extra quiet holds. One short code fragment per shot; full runnable example lives in example.py.

## Implementation / QA notes

- Two opaque ImageGen panels are implemented in oop-visuals.js, not the cutout/sticker API. The existing library requires alpha-channel cutouts, so these are preserved project-locally with exact prompts in asset-provenance.json. The audit warning “No supporting art installed” is a detector limitation for custom context panels; both images were visually checked.
- State and behavior cards start with data centered; data moves left to make room for behavior.
- Additional verify cues reveal bed.on = False and the shared method definition. The semantic-motion audit has no long-interval warnings after these edits.
- The 15-page HTML deck is a frozen native DOM export of the same 15 video scenes, in ../oop-lamps-deck/index.html. Video keeps native objects and phrase-timed changes; it does not animate screenshots. PDF and PNG ZIP are pre-exported for offline download.
- HyperFrames 0.8.75 check passes with the original CDN GSAP reference. Its local-script bundling produced a null-element startup error; local GSAP remains available for direct browser QA, but the render entry uses the verified CDN loading path.
- Voice timing refined with local Whisper anchors and interpolation, not claimed word-perfect. No background music.
