# Script schema

Use JSON text, not handwritten scene HTML. Top level:

```json
{
  "language": "vi",
  "title": "Một ý rõ ràng",
  "subtitle": "Dành cho người mới",
  "brand": "AGENTVID",
  "series": "GHI CHÚ",
  "tag": "CHỦ ĐỀ / GHI CHÚ",
  "edition": "TẬP 001",
  "intro": {"line1": "Ý chính", "line2a": "Phần giải thích", "line2b": "", "icon": "lightbulb", "vo": "Lời mở đầu."},
  "scenes": [{"title": "Một ý trong cảnh", "subtitle": "Bối cảnh ngắn", "widget": {"kind": "callout", "text": "Thông điệp chính", "icon": "document"}, "after": "Điều cần nhớ", "vo": "Lời giải thích."}],
  "outro": {"line1": "Điều cần nhớ", "line2": "Kết luận ngắn", "line3": "Một việc để thử", "icon": "check", "credit": "Nguồn hoặc ghi chú", "vo": "Lời kết."}
}
```

`brand`, `series`, `tag`, `edition`, `kicker`, scene `subtitle` and `after` are optional. `before`, mascot poses and
business labels are not required. Intro line2a/line2b can be omitted. For music-only previews, vo can be omitted.
Technical symbols/code live in widget strings. Write narration as natural spoken language; no need to start each
scene with its number. Use short clauses for estimated karaoke timing.

Widgets:

| kind | Fields | Useful for |
| --- | --- | --- |
| sequence | steps: 1–4 objects `{title, text?, icon?}` | Horizontal process, cause→effect, concept relationships |
| comparison | left/right `{title, items: 1–4 strings, icon?, total?}` | Two options or two states |
| code | code, language?, result? | Short code or equations; at most 7 lines, 38 chars/line |
| callout | text, detail?, icon? | One claim, definition or observation |
| checklist | items: 1–5 strings | Recap or practice steps |
| stat | items: 1–2 `{value: number, label, unit?}` | Real or explicitly illustrative values, no invented intermediate count-up |
| diagram | continuity, nodes/edges/note on first scene, events | One stable model with timed state changes |
| illustration | src, alt, caption? | Local supplied or AI-generated explanatory image |
| quote | text, author? | User-supplied quote or a short compliant attributed excerpt |

Built-in outline icons: box, pin, document, magnifier, cup, clock, beaker, leaf, code, lightbulb, arrow, check.
Choose a descriptive icon; a coffee cup is optional, not branding. The engine defaults to document for omitted icons.
For a new icon, add original SVG paths to the copied engine, keep black strokes/no shading, and update that copy's validator.

Main limits: title 40 chars, scene title 44, scene subtitle 75, scene takeaway 90; sequence title 24 and text 56;
comparison title 28, item 45; checklist item 65; callout text 90 and detail 90; quote 180. The validator catches
structural errors and rough text limits; browser checks/contact sheets decide whether a particular composition fits.
Shorten a crowded field rather than shrinking the entire page.

Frames are fixed at 1080×1920. Header 84–145; figure tag 240; scene title 320–470; subtitle 510–600;
main visuals 660–1270; takeaway 1330–1460; footer 1515; captions 1660–1825; credits 1860.
Keep 3–4 diagram nodes at most per row; split a larger process across scenes. Preserve calm negative space.

## Persistent diagram and spoken cues

Use 2–3 nodes with short display values; the renderer keeps their positions across consecutive scenes. In the
first scene, define `nodes` (unique id, label ≤18 chars, value ≤14, detail? ≤24), `edges` (0–3 from/to ID pairs),
and an optional `note` (≤70). The next consecutive scene uses the same `continuity` but omits nodes/edges/note.
Reuse that key only for consecutive scenes; a later separate model needs a new key.

```json
{
  "title": "Sửa đúng một chỗ",
  "widget": {
    "kind": "diagram", "continuity": "pointer-example",
    "nodes": [
      {"id": "p", "label": "p", "value": "&x", "detail": "Giữ địa chỉ"},
      {"id": "x", "label": "x", "value": "10", "detail": "Dữ liệu"}
    ],
    "edges": [{"from": "p", "to": "x"}],
    "note": "int x = 10; int *p = &x;",
    "events": [
      {"on": "đi theo địa chỉ", "edge": {"from": "p", "to": "x"}, "focus": ["x"]},
      {"on": "thành hai mươi", "set": {"x": "20"}, "note": "*p = 20;  →  x = 20"}
    ]
  },
  "vo": "Mình đi theo địa chỉ, rồi sửa dữ liệu thành hai mươi."
}
```

Each of 0–8 events has exactly one of `on` (phrase in vo) or `at` (non-negative seconds from scene start).
`occurrence` defaults to 1. One event can combine `set` (ID → string), `focus` (IDs, [] clears focus), `edge`
(trace an initialized edge), and `note` (replace the note; "" clears it). Values change discretely and persist;
focus alters the outline width, without new colors. Cues must be ordered in the intended narration sequence.
The runtime rejects anchors missing from synced word timings and seconds outside the scene.

Other optional cues: `sequence.steps[i].on` (and occurrence), `code.resultOn`, scene `afterOn`. No cue preserves
legacy timing. These cue phrases must appear in that scene's vo. Cues are approximate until listened to in the render.

An illustration uses a relative `assets/illustrations/…` path to PNG, JPEG, WebP or SVG; the validator checks the
file exists. Include `alt` (≤180) describing the illustration and an optional `caption` (≤100). Inspect raster style
and factual suitability as described in [illustration-assets.md](illustration-assets.md).
