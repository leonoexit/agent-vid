# Labeling Precision (The "Tech-Stack")

To prevent "floating text" or misalignment, always use these mathematical constraints:

## 1. Midpoint Formula (Edge Labels)

For an edge between `(x1, y1)` and `(x2, y2)`:
- `x_label = (x1 + x2) / 2`
- `y_label = (y1 + y2) / 2`

**Diagonal Offset**: If text overlaps the line, add a perpendicular offset:
- `x_offset = x_label + (delta_y * scale)`
- `y_offset = y_label - (delta_x * scale)`

## 2. SVG Typography Centering

Never rely on default browser alignment. For elements inside containers (Nodes):
- `text-anchor="middle"`: Centers horizontally at the `x` coordinate.
- `dominant-baseline="central"`: Centers vertically at the `y` coordinate (Ignores font descenders).

**CSS Enhancement**:
```css
text-rendering: optimizeLegibility;
-webkit-font-smoothing: antialiased;
```

## 3. Node-Centric Consistency
- **Rule**: If `Node_Parent` has text inside, `Node_Child` **MUST** have text inside.
- **Symmetry**: `abs(X_child_left - X_parent) == abs(X_child_right - X_parent)`.
