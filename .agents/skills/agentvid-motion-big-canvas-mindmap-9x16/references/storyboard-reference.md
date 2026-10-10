# storyboard.json — big canvas mind map

`data/storyboard.json` describes the map. Never write HTML. `build-timeline` checks that every anchor is a word the scene speaks.
Anchor values: `"word"`, `"word#2"` (2nd time it is spoken) or `{ "word": "x", "plus": 0.2 }`; a plain number = seconds after the scene starts.
Words are compared lower-case without punctuation, accents kept (`"cửa"` ≠ `"cua"`). Anchors sit inside `"at"` keys only.

```json
{
  "topic": "short title",
  "root": { "label": "Hub name", "tone": "ink" },
  "scenes": [ { hook }, { branch }, …, { recap } ]
}
```
Scene ids must equal the ids in `script.json`. Types: `hook` (first), `branch` (6–10), `recap` (last).

## hook
```json
{ "id": "s01-hook", "type": "hook", "rootAt": "vẽ",
  "sticky": { "lines": [ { "text": "Line one", "at": "word" }, { "text": "= line two?", "at": "word" } ] } }
```
`rootAt`: the word on which the hub ring is drawn (default 0.9 s after the scene starts).

## branch
```json
{ "id": "s02-web", "type": "branch",
  "node": { "label": "Website", "tone": "blue", "side": "left", "row": -1, "icon": "globe", "at": "website",
            "sub": "mặt tiền cửa hàng", "subAt": "mặt", "note": "= the point", "noteAt": "nhìn",
            "strike": "the old idea", "strikeAt": "xong#2" },
  "parts": [ { "kind": "list", … }, { "kind": "tree", … } ] }
```
- `label` ≤ ~12 characters (it sits in a ring); `tone`: ink, blue, teal, purple, magenta, orange, green, brown (red is the marker colour).
- `side` left | right (default: alternate); `row`: 0, 1, … = rows under the hub, -1, -2 = rows above (default: two per row, balanced around the hub). Two branches may not share a side + row (build error).
- `at`: the word on which the ring is inked; the curve from the hub starts ~1 s earlier. `icon`: Lucide name from theme.json `icons.names`.
- `sub`: a small line under the ring. `note`: the red point, written LAST under the parts (it shrinks to fit the column);
  `strike` + `strikeAt`: an old idea written muted and struck through before the note.
- `parts`: stacked in the order given, growing away from the hub: under the node for rows 0, 1, … and above the node for rows -1, -2, … (the node sits next to the hub, the red note right above it). A group should stay under ~1000 px tall (~5 parts of 2–4 lines);
  the camera drifts down for parts below the safe box.

### Part kinds
| kind | fields | notes |
|---|---|---|
| `list` | `items: [text \| { text, icon, at }]`, `cols` 1–2, `mark: "check"`, `icons: false`, `ring: { at, tone }` | icon (draws) + text (wipes); `ring` draws a red scribble around the whole list after the last item |
| `chips` | `items: [{ text, tone, at }]` | short labels in hand-drawn rings, wrapped in rows |
| `tree` | `levels: [[{ text, icon?, at }], …]` | level 0 with one item and no icon = ringed hub label; arrows draw from each level to the next |
| `loop` | `steps: [{ text, at }]` (3–5), `center: { text, at }` | steps on a circle joined by clockwise arrows |
| `cards` | `items: [{ text, icon, tone, at }]` | 2-column grid of hand-drawn boxes |
| `icon` | `icon`, `size`, `tone`, `caption`, `at` | one big line icon with a caption |
| `note` | `text`, `tone: red \| ink \| muted`, `size`, `strike`, `strikeAt`, `at` | free handwriting line (long text shrinks to the column) |
| `sub` | `text` or `lines`, `at` | small text |

Limits checked at build (clear `[canvas] <scene id>: ...` errors): first scene `hook`, last `recap`, `root.label`, 6-10 branches (warning), label up to 12 characters (warning), known `tone` (ink, blue, teal, purple, magenta, orange, green, brown, red), known part `kind`, non-empty `items` / `levels` / `steps`, loop 3-5 steps. A warning `the pen is still writing N s after the scene ends` means items are anchored too close together: space the anchors or cut parts.
Items without `at` are spread over the part's share of the scene. The pen writes one thing at a time: items spoken closer together than
their writing time are pushed later, so anchor on words about 0.5 s apart or more.

## recap
```json
{ "id": "s10-recap", "type": "recap",
  "sticky": { "head": "optional", "items": [ { "text": "1. website", "at": "website" }, … ],
              "closing": { "lines": ["first line", "second line"], "at": "phía" } } }
```
The camera pulls back to the whole map ~2.4 s into the scene; the list sticky is written item by item; at `closing.at` it is replaced by the closing sticky.

## Writing-time table (the pen writes one thing at a time)
| Thing | Pen time |
|---|---|
| text | 0.05 s per character, 0.4–1.5 s |
| icon (list / tree / cards) | 0.4 s, drawn while the text starts |
| ring (node 0.6 s, chip 0.5 s, list ring 0.9 s), curve from the hub | 1.0 s |
| arrow | 0.35–0.4 s |
| loop of 4 steps + centre | ≈ 6 s (4 × (dot 0.3 + label ~0.5 + arc 0.35) + closing arc + centre) |
| tree of 1 + 3 items | ≈ 4 s; cards 4 ≈ 4 s; list of 4 ≈ 3 s; note ≈ 1.2 s; strike ≈ 2 s |
A branch is ~13–15 s of voice: node curve + ring ≈ 2 s, so ≈ 11 s left for parts. A loop leaves room for only one more small part.
`hyperframes check` prints `[canvas] <id>: the pen is still writing N s after the scene ends` when the sum does not fit.

## Budget
~560 Vietnamese words (≈ 138 s of voice at 4.1 words/s) for 8 branches; every branch ≈ 14 s of voice. A branch with 4–6 parts (list, tree, note) is the upper limit.
