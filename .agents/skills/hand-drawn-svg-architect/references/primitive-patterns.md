# Primitive Patterns

## 1. Hand-Drawn Box

Never use `<rect>`. Use a closed `<path>` with 4 distinct curves.

```xml
<!-- A "Square" that looks drawn by hand -->
<path d="M 10 10 Q 50 8 90 12 Q 92 50 88 90 Q 50 92 10 88 Q 8 50 10 10" 
      fill="none" stroke="var(--color-ink)" stroke-width="2" stroke-linecap="round" />
```

## 2. Hand-Drawn Circle

Never use `<circle>`. Use 2-3 overlapping arcs or a deformed ellipse path.

```xml
<!-- A "Circle" made of two messy arcs -->
<path d="M 50 10 A 40 40 0 1 0 50 90 A 40 40 0 1 0 50 10" 
      fill="none" stroke="var(--color-ink)" stroke-width="2" stroke-dasharray="100 10" />
<!-- Overlay a second customized Arc for "messiness" -->
<path d="M 45 15 A 38 38 0 1 0 55 95" 
      fill="none" stroke="var(--color-ink)" stroke-width="1.5" opacity="0.6" />
```

## 3. Hand-Drawn Arrow

1.  **Shaft**: A Bezier curve (not a straight line).
2.  **Head**: Two separate short strokes, slightly mismatched in length/angle.

```xml
<!-- Shaft -->
<path d="M 10 50 Q 50 45 90 50" stroke="black" fill="none" class="rough-line"/>
<!-- Head -->
<path d="M 80 40 L 90 50 L 82 62" stroke="black" fill="none" class="rough-line"/>
```

## 4. The "Grant Snider" Underline

```xml
<svg width="200" height="20" viewBox="0 0 200 20">
  <!-- A wavy, double-stroke underline -->
  <path d="M 5 10 Q 50 5 100 10 T 195 10" 
        stroke="var(--color-warm)" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M 10 12 Q 55 8 105 12 T 190 11" 
        stroke="var(--color-warm)" stroke-width="1" fill="none" opacity="0.5" stroke-linecap="round"/>
</svg>
```
