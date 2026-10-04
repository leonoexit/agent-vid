# Tree Geometry Formulas

## 1. Binary Tree (Recursive Layout)

For a node at level `L` (Root is `L=0`) with index `i` at that level:

- **Vertical Step (`H`)**: `100`
- **Initial Width Spread (`S0`)**: `400`
- **Root**: `(X: 400, Y: 80)`

**Formulas:**
- `y_L = 80 + L * H`
- `x_L_i = x_parent ± (S0 / 2^(L+1))`

| Level | Vertical Y | Spread (S) | Parent Gap |
|-------|------------|------------|------------|
| 0 (Root)| 80        | 400        | -          |
| 1     | 180        | 200        | ±100       |
| 2     | 280        | 100        | ±50        |
| 3     | 380        | 50         | ±25        |
