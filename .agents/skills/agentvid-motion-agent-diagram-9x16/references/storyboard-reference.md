# Storyboard reference (agent diagram, 9:16)

`data/storyboard.json` = `{ "topic": "Sub agent", "scenes": [ { "id": "<same id as script.json>", "type": "...", ... } ] }`,
in script order. `topic` is the small tag top-left on diagram scenes (≤ 18 characters), with one progress segment per
scene top-right. Text fields accept `*word*` for the accent colour.
Anchors (`"at"`): a word the scene speaks (`"sub"`), its n-th occurrence (`"một#2"`), seconds after the cut (`1.2`) or
`{ "word": "x", "plus": 0.3 }`. Items without one spread evenly. Only use the key `at` for anchors.

Common fields: `main: { label, icon }` — the main tile (label default "Main agent", icon `spark`). Icons: `spark`,
`braces` ("{ }"), or ≤ 3 characters. Tones: `main` (rust), `green`, `blue`, `gold`, `plum`; helpers default to
green, blue, gold, plum in order. Diagram scenes hide the pencil robot; `statement` / `outro` show it.

## Diagram scene types
| type | fields | limits |
|---|---|---|
| `swarm` | `main`, `chips: [{ text, at }]`, `meter: { label, from, to, unit, at }`, `helpers: [{ label, icon, tone, at }]` | chips ≤ 7, ≤ 18 chars; helpers ≤ 3 (they fade the chips back) |
| `gauge` | `main`, `panel: { title, at, rows: [{ tool, text, cost, at }] }`, `counter: { from, to, max, alarm, suffix, sub }`, `warnings: [{ text, at }]`, `forget: { at, rows }` | rows ≤ 12, text ≤ 16 chars; warnings ≤ 3, ≤ 10 chars; counter turns red past `alarm` (default 85% of max) |
| `handoff` | `main`, `helper: { label, icon, tone, at }`, `mainGauge: { label, value }`, `ticket: { label, text, at }`, `panel: { title, at, fill, items: [] }`, `counter: { to, label }`, `tools: []`, `done: { at }` | ticket text ≤ 40 chars; items ≤ 20, ≤ 14 chars; `fill` = seconds the cells take (3) |
| `fan-out` | `main`, `helpers: [{ label, icon, tone, at, progress }]`, `race: { at, serial: { label, value }, parallel: { label, value, ratio } }` | helpers 2–4, label ≤ 12 chars; `ratio` = parallel bar length 0–1 |
| `split` | `stamp: { text, at }`, `left` / `right`: `{ title, sub, icon, tone, at, items: [{ text, at }] }` | stamp ≤ 20 chars; title ≤ 16, sub ≤ 28, items ≤ 4 × ≤ 18 chars; left = hand off (green), right = keep (rust) |
| `recap` | `main`, `helpers: [{ tone, icon }]`, `gauge: { label, value }`, `text`, `at` | text ≤ 18 chars, one `*accent*`, underlined in pencil |

## Ink-paper scene types (also available)
`cover`, `stats`, `feature` (cards `checklist`, `steps`, `compare`, `chat`, `prop`), `statement`, `outro` — same
fields as the ink-paper skills: `statement { text, sub, at }`, `outro { line, cta, at: { line, cta } }`.
Their plank title sits where the HUD is, so the HUD hides on them.

## Example (from the bundled Vietnamese sample)
```json
{ "id": "s03-handoff", "type": "handoff", "main": { "label": "AI chính" },
  "helper": { "label": "Sub agent", "at": "sub" }, "mainGauge": { "label": "bộ nhớ chính", "value": 18 },
  "ticket": { "label": "Nhiệm vụ", "text": "Tìm mọi chỗ gọi API thanh toán", "at": "nhiệm" },
  "panel": { "title": "Bộ nhớ riêng", "at": "riêng", "fill": 3, "items": ["api/pay.ts", "lib/retry.ts"] },
  "counter": { "to": 38, "label": "file đã đọc" }, "tools": ["Read", "Grep", "Bash"], "done": { "at": "gọn" } }
```
