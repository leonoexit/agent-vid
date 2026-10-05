# Terminal là gì? — production notes

Source: `references/c-podcast`, Kỳ 0 · 0.8 (Shell, Command, Current directory, Path).
Audience: người mới hoàn toàn, sắp học C. Style: Code Noir. Voice: VieNeu Hải Đăng.

## One question

"Gõ `ls` thì liệt kê thư mục nào?" → answered in scene 2 (current directory),
extended to relative paths and stress-tested by `cd code` + the same `ls code`.

## Command verification (2026-10-05, macOS 15.1, /bin/ls, zsh)

A sandbox mirror `an/{Desktop/, code/hello.c}` was created and the commands run:

| Location   | Command    | Actual output                            |
|------------|------------|------------------------------------------|
| `an`       | `pwd`      | `…/an` (shown as `/Users/an` for user An)|
| `an`       | `ls`       | `Desktop<TAB>code`                       |
| `an`       | `ls code`  | `hello.c`                                |
| `an/code`  | `ls code`  | `ls: code: No such file or directory`, exit 1 |
| `an/code`  | `ls <abs>/code` | `hello.c`                           |

The home folder is deliberately simplified (labelled "VÍ DỤ RÚT GỌN"); a real macOS
home has more folders. GNU ls on Linux words the error differently, hence the
"(macOS)" label.

## Project-specific extensions

- Narration spells commands phonetically for the Vietnamese TTS (el-ét, pi-đáp-liu-đi,
  xi-đi, sheo, tơ-mi-nồ…). `script.json.captionDisplay` maps those spoken words back to
  the real tokens in captions (`noir.js` → `display()`); reveal cues still use spoken words.
- `.result` uses `white-space: pre-wrap` so the multi-column `ls` output keeps its spacing.

## QA (2026-10-05)

- validate-script OK; `hyperframes check` passed (runtime, layout 9 samples, motion, 55/55 contrast);
  only the known nested-structure lint warning.
- 11 settled/mid frames inspected (`snapshots/`): no overflow, Vietnamese glyphs OK, caption map works.
- Render: `renders/terminal-la-gi-9x16.mp4`, 1080×1920, 30 fps, 94.0 s, AAC audio, full decode OK.
- Not reviewed by ear: pronunciation of phonetic tokens (tơ-mi-nồ, el-ét, pi-đáp-liu-đi, xi-đi, sheo,
  zét-sheo, đét-tóp, hé-lô) and estimated word timings (VieNeu gives no word alignment).
