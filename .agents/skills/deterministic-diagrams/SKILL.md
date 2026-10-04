---
name: deterministic-diagrams
description: Generates technically accurate SVG diagrams for data structures, trees, and system architectures using absolute coordinate systems. Ensures visual symmetry and educational clarity for complex technical concepts.
---

# Deterministic Diagrams

Produce technically correct and visually balanced visualizations by moving away from estimated CSS layouts to absolute SVG coordinate geometry. This skill focuses on mathematical precision and visual logic.

## Quick Start

To generate a perfectly aligned 3-node tree:
1. Use `<svg viewBox="0 0 800 600">`.
2. Define Root at `(400, 100)`.
3. Draw connectors first, then nodes, then text.
4. Use `text-anchor="middle"` and `dominant-baseline="central"` for perfect centering.

## Workflows

### 1. Visual Logic Selection
Before implementation, decide on the labeling strategy based on the educational goal:
- **Consistency**: If the Root has a label inside, all significant children must have labels inside.
- **Complexity**: For dense trees, use **Node-Centric** labeling to keep the layout clean.
- **Reference**: [references/visual-logic-design.md](references/visual-logic-design.md)

### 2. Geometric Implementation
1. **Layer 1 (Connectors)**: Calculate midpoints for labels using `(X1+X2)/2`.
2. **Layer 2 (Shapes)**: Place circles/rects at exact calculated coordinates.
3. **Layer 3 (Labels)**: Overlay text last. Use high-contrast colors (Ink #2c3e50, Red #e74c3c).

## Resources

- **Geometry Modules**:
  - [Tree Geometry](references/geometry/tree-geometry.md)
  - [Linear Geometry](references/geometry/linear-geometry.md)
  - [Flow & Architecture](references/geometry/flow-geometry.md)
  - [Labeling Precision](references/geometry/labeling-precision.md)

- **Design Patterns**:
  - [Visual Logic Design](references/design/visual-logic-design.md)

- **Assets**:
  - [Node-Centric Trie Template](assets/trie-node-centric-template.svg): Strategic label placement for Trie structures.
  - [Binary Tree Template](assets/binary-tree-template.svg): Perfectly balanced 3-level tree.
  - [Git Graph Template](assets/git-graph-template.svg): Timeline-based commit history.
  - [System Architecture](assets/architecture-template.svg): 3-tier layout (LB-Web-DB).

## Precision Standards
- **Symmetry Check**: Ensure `X_left = Center - Offset` and `X_right = Center + Offset`.
- **Text Alignment**: Always use `dominant-baseline="central"` to prevent font-specific vertical shifting.
