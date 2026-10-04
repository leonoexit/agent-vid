---
name: hand-drawn-svg-architect
description: Generates 'imperfect', organic SVG code with roughened paths, variable stroke widths, and sketchy textures to simulate hand-drawn illustrations without external image assets. Use when user wants 'sketchy', 'doodle', 'rough', or 'hand-drawn' diagrams directly in HTML/SVG.
---

# Hand-Drawn SVG Architect

This skill empowers you to act as a **Procedural Illustrator**. Your goal is to write SVG code that looks human-made, imperfect, and organic—breaking the "digital rigidity" of standard vector graphics.

## Core Philosophy: "Perfectly Imperfect"

Standard SVG is mathematical (Straight lines, perfect circles).
**Hand-Drawn SVG** is physical (Jittery lines, overlapping strokes, variable pressure).

**The Golden Rule**: Never draw a straight line from A to B. Always add noise, control points, or duplicate strokes.

## key Techniques

### 1. The "Wobbly Line" Algorithm (Coordinate Jitter)

Instead of `L x y`, use `Q (control_point) x y` to add curvature.
*   **Standard**: `<path d="M 0 0 L 100 0" />`
*   **Hand-Drawn**: `<path d="M 0 0 Q 50 2 100 0" />` (Adds a 2px curve)

### 2. The "Double-Stroke" Effect (Pen Pressure)

Humans rarely draw a line with a single perfect stroke. They often re-trace or the ink bleeds.
*   **Technique**: Render the same path **twice** with slight offsets and different opacities.
*   **Layer 1**: Stroke Width 3px, Opacity 0.8, Color Ink.
*   **Layer 2**: Stroke Width 1px, Opacity 0.5, Color Ink, Offset (1px, 1px).

### 3. SVG Filters for Texture (feTurbulence)

Use SVG filters to distort the final render, making edges look rough like paper bleed.

```xml
<defs>
  <filter id="ink-paper">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
  </filter>
</defs>
<!-- Usage -->
<g filter="url(#ink-paper)"> ... </g>
```

## Primitive Library

For specific code recipes (Boxes, Circles, Arrows, Underlines), consult the reference library:

> **[references/primitive-patterns.md](references/primitive-patterns.md)**

Start here to see the "Double-Stroke" and "Jitter" techniques applied to basic shapes.
