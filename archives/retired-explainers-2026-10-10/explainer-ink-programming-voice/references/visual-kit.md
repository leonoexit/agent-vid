# Small evolving diagrams — Ink 1.4

Choose the visual relation while writing the narration. A row can explain position or sequence; a small tree can distinguish a condition and its branches; a loop needs an actual return/repetition relationship; cards compare concrete states. Keep one visible example through changes instead of replacing it with another paragraph. None of these layouts is mandatory, and a moving pointer alone cannot explain a missing mechanism.

## Executable block

```json
{
  "type": "diagram", "kind": "cards", "label": "Nguồn và bản lưu",
  "at": 0.3,
  "items": [
    {"id": "source", "label": "Nguồn", "value": "100"},
    {"id": "cache", "label": "Cache", "value": "100"}
  ],
  "events": [
    {"on": "nguồn đổi giá", "action": "update", "target": "source", "value": "120"},
    {"on": "Giá trong cache", "action": "focus", "target": "cache"},
    {"on": "trả lời nhanh", "action": "circle", "target": "cache"}
  ]
}
```

The spoken phrases must exist in that section's `vo`; use `template/script.json` for a complete cache lesson example. `visual-kit-example.json` is a four-layout technical fixture with synthetic second-based cues, not a finished narrated lesson or a script to relabel.

`kind`: `row` (2–4 nodes), `tree` (2–5, first node is the root), `loop` (3–5, cyclic links), `cards` (2–6, two columns). Limits are structural, not a guarantee that copy fits. Prefer 2–3 nodes and short labels. Tree/loop include faint links from the start; colored arrows reveal the relation being discussed. Do not use a loop if the data flows only one way.

Each item needs a unique lowercase `id` (`source`, `saved-value`) and a short `label`; optional `value` is a nonempty string. Optional `src` under `assets/illustrations/` with `alt` places a small generated cutout alongside the label. Image slots are implemented; no new Memphis image library ships with this kit. Check narrow nodes carefully when combining assets, labels and values. Use a separate large image block for artwork that needs space.

Each event has exactly one `on` phrase (optional `occurrence`) or local `at` in seconds, using the same cue resolution as blocks. List events in chronological order. Leave at least .35 s after the diagram appears and .4 s before section end. If a phrase comes too early, introduce the diagram earlier or rewrite the sentence; do not silently delay the event. Leave practical reading time beyond those technical minimums.

| Action | Fields | Visible result |
|---|---|---|
| `focus` | `target` | Yellow selection and pointer move; previous selection clears. |
| `update` | `target`, `value` | Existing value changes in place. |
| `arrow` | `from`, `to` | A red path connects two different nodes. |
| `circle` | `target` | Red outline around the node. |
| `strike` | `target` | Red strike across the node; use for a rejected state/choice. |
| `underline` | `target` | Red curved line beneath the node. |
| `clear` | `target` | Removes that node's earlier annotations, including incoming arrows. It does not reset its focus/value. |

Path actions accept `duration` (.18–2.4 s; default .65) and `hand: false` to draw without a hand. With handwriting disabled for the section/script, native stroke motion remains. Short text and paths share one hand. Pending strokes are bounded by the next content cue and voice end; insufficient room uses an ordinary reveal, never a delayed voice beat. Marks persist until cleared or the page ends. Clear a rejection mark when its state becomes valid again.

## Storyboarding and review

Write each beat as **spoken claim → evidence/state → visible change → result to notice**. For example: the source price changes to 120, the stored price stays 100, focus compares the two, and narration explains staleness. A circle emphasizes existing evidence; it cannot replace a missing value change or result.

Start a page with enough context to orient the viewer. Prefer one diagram plus a short heading or takeaway. Leave captions and the hand room; check at phone scale and while the hand is present, not only after it withdraws. Alternate with purposeful Memphis illustrations, larger code/output, or quieter comparison pages as the explanation needs. Do not turn the entire video into a grid dashboard or fill every pause with marks.

Review both forward and backward seeks, every updated value, cleared marks, actual audio cues and the longest unchanged content interval. Inspect `INK_REVIEW` fallbacks: crowded timing usually calls for less copy, fewer gestures or an earlier setup. Tests and silent previews validate mechanics only. This small-diagram helper does not move the camera. The separate persistent-paper compositor in canvas-story.md provides camera travel. Automatic word alignment, image drawing, a general graph router and automatic script-to-diagram inference are not implemented.
