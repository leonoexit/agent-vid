# LSP · Chim cánh cụt — storyboard

Apple-inspired vertical explainer (1080×1920, 30 fps) · Hải Đăng voice, speed 0.9 · ~132 s.
One concept (Liskov Substitution), one worked example (`tha_chim(chim)` + bird classes).

## Visual identities (constant through the video)

| Thing | Picture |
|---|---|
| `Chim` (parent) | violet ceramic tile, bird outline |
| `ChimSe` | mint tile, sparrow |
| `ChimCanhCut` | slate tile, penguin |
| `ChimBietBay` | blue tile, gull |
| `bay()` promise | blue chip (`lời hứa` tag when the function requires it) |
| broken `bay()` | coral chip `báo lỗi` |
| `an()` | amber bowl chip |
| function `tha_chim` | ceramic launch pad + code card + result console |
| error | coral rings, shake, Exception console, stop pill |

## Contexts

| Scenes | Context | Key state change |
|---|---|---|
| intro | question | sparrow in pad → penguin swaps in → "?" |
| 1–2 | family tree (2 levels) | Chim + bay() → ChimSe inherits, bay() copies down |
| 3–5 | launch pad | code appears, empty socket "?", sparrow flies, `Bay lên!` |
| 6–7 | family tree | penguin enters, inherits bay(); override flips chip to coral |
| 8 | launch pad | penguin enters; **1.2 s hold for prediction** |
| 9–10 | crash | shake + Exception; "0 dòng bị sửa", promise ≠ broken override |
| 11–13 | principle | L tile + SOLID row; socket test: sparrow ✓, penguin ✗ |
| 14–16 | fix tree (3 levels) | Chim keeps only an(); ChimBietBay owns bay(); penguin has no bay() |
| 17–19 | verify | `tha_chim(chim: ChimBietBay)` sparrow flies; `cho_an` works for both |
| outro | rule | rule card ✓ + warning card: bay() báo lỗi → ChimBietBay |
