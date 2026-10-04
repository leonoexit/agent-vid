# Visual Logic Design for DSA Diagrams

Educational diagrams for "lazy readers" require absolute visual clarity. Mixed labeling (some in nodes, some on edges) creates cognitive load and looks like a bug.

## 1. The Symmetry Rule
If the Root node has a label inside it, **ALL** significant child nodes should also have labels inside them, unless the diagram specifically focuses on the transition process.

## 2. Trie Labeling Options

### A. Node-Centric (Preferred for Summary Slides)
Labels are placed inside the circles they lead to.
- **Pros**: Balanced, looks intentional, high readability.
- **Cons**: Technically, characters are on edges, but for visuals, this is often ignored for clarity.
- **Implementation**: Set `text-anchor="middle"` and `dominant-baseline="central"` at the node's `(cx, cy)`.

### B. Edge-Centric (Strict Technical Diagram)
Labels are placed on the lines. Nodes are small or empty.
- **Pros**: Technically accurate.
- **Cons**: Can look "messy" if lines are short.
- **Implementation**: Labels must be at Midpoints: `X = (X1+X2)/2`, `Y = (Y1+Y2)/2`. 
- **CRITICAL**: Use `dominant-baseline="central"` and apply a small vertical offset (approx 10-15px) ONLY if the line is horizontal. For diagonal lines, the midpoint is usually sufficient if `text-anchor="middle"` is used.

## 3. Decision Matrix
- If slide explains "Turn-based choice" -> Use **Edge-Centric**.
- If slide explains "Structure or Prefix" -> Use **Node-Centric**.
- If the Root has text -> Use **Node-Centric** for consistency.
