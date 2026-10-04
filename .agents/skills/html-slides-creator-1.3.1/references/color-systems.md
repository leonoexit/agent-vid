# Color Systems Reference

## CSS Custom Properties Structure

Always define colors as CSS custom properties for consistency and easy theming:

```css
:root {
  /* Core palette */
  --color-primary: #667eea;
  --color-secondary: #764ba2;
  --color-accent: #8B5CF6;
  
  /* Semantic colors */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-info: #3B82F6;
  
  /* Neutrals */
  --color-bg: #ffffff;
  --color-surface: #f8fafc;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;
  
  /* Effects */
  --color-glow: rgba(102, 126, 234, 0.4);
  --color-overlay: rgba(0, 0, 0, 0.5);
}
```

## Pre-built Color Palettes

### Purple Dream (Default)

```css
:root {
  --color-primary: #667eea;
  --color-secondary: #764ba2;
  --color-accent: #a855f7;
  --color-bg: #f5f5f5;
  --color-text: #1f2937;
  --gradient-hero: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Ocean Breeze

```css
:root {
  --color-primary: #06b6d4;
  --color-secondary: #0891b2;
  --color-accent: #14b8a6;
  --color-bg: #f0fdfa;
  --color-text: #134e4a;
  --gradient-hero: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
}
```

### Sunset Blaze

```css
:root {
  --color-primary: #f97316;
  --color-secondary: #ea580c;
  --color-accent: #f59e0b;
  --color-bg: #fffbeb;
  --color-text: #78350f;
  --gradient-hero: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}
```

### Emerald Luxe

```css
:root {
  --color-primary: #10b981;
  --color-secondary: #059669;
  --color-accent: #34d399;
  --color-bg: #ecfdf5;
  --color-text: #064e3b;
  --gradient-hero: linear-gradient(135deg, #10b981 0%, #059669 100%);
}
```

### Rose Gold

```css
:root {
  --color-primary: #ec4899;
  --color-secondary: #db2777;
  --color-accent: #f472b6;
  --color-bg: #fdf2f8;
  --color-text: #831843;
  --gradient-hero: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
}
```

### Midnight OLED

```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #2563eb;
  --color-accent: #60a5fa;
  --color-bg: #000000;
  --color-surface: #0a0a0a;
  --color-text: #f8fafc;
  --color-text-muted: rgba(248, 250, 252, 0.6);
  --gradient-hero: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
}
```

### Neon Cyberpunk

```css
:root {
  --color-primary: #00ffff;
  --color-secondary: #ff00ff;
  --color-accent: #ffff00;
  --color-bg: #0a0a0f;
  --color-text: #ffffff;
  --color-glow-cyan: rgba(0, 255, 255, 0.5);
  --color-glow-magenta: rgba(255, 0, 255, 0.5);
}
```

### Corporate Navy

```css
:root {
  --color-primary: #1e3a5f;
  --color-secondary: #4a6fa5;
  --color-accent: #c9a227;
  --color-bg: #ffffff;
  --color-text: #2d3748;
  --gradient-hero: linear-gradient(135deg, #1e3a5f 0%, #4a6fa5 100%);
}
```

## Gradient Systems

### Linear Gradients

```css
/* Hero gradients */
.gradient-purple { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.gradient-blue { background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); }
.gradient-green { background: linear-gradient(135deg, #10B981 0%, #059669 100%); }
.gradient-orange { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); }
.gradient-pink { background: linear-gradient(135deg, #EC4899 0%, #DB2777 100%); }
.gradient-dark { background: linear-gradient(135deg, #1F2937 0%, #111827 100%); }

/* Multi-color aurora */
.gradient-aurora { 
  background: linear-gradient(
    135deg, 
    #06b6d4 0%, 
    #8b5cf6 33%, 
    #ec4899 66%, 
    #f97316 100%
  ); 
}
```

### Mesh Gradients (CSS Only)

```css
.mesh-gradient {
  background: 
    radial-gradient(at 40% 20%, #06b6d4 0%, transparent 50%),
    radial-gradient(at 80% 0%, #8b5cf6 0%, transparent 50%),
    radial-gradient(at 0% 50%, #ec4899 0%, transparent 50%),
    radial-gradient(at 80% 50%, #f97316 0%, transparent 50%),
    radial-gradient(at 0% 100%, #06b6d4 0%, transparent 50%);
  background-color: #1e1b4b;
}
```

### Animated Gradients

```css
.animated-gradient {
  background: linear-gradient(
    -45deg, 
    #ee7752, #e73c7e, #23a6d5, #23d5ab
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

## Contrast Guidelines (WCAG)

| Level | Ratio | Use Case |
|-------|-------|----------|
| AA Normal | 4.5:1 | Body text |
| AA Large | 3:1 | Headings 24px+ |
| AAA Normal | 7:1 | Critical text |
| AAA Large | 4.5:1 | Large headings |

### Safe Combinations

| Background | Text | Ratio |
|------------|------|-------|
| `#FFFFFF` | `#1f2937` | 14.7:1 ✓ |
| `#667eea` | `#FFFFFF` | 4.5:1 ✓ |
| `#1F2937` | `#FFFFFF` | 13.1:1 ✓ |
| `#000000` | `#FFFFFF` | 21:1 ✓ |
| `#F3F4F6` | `#111827` | 15.3:1 ✓ |

### Dangerous Combinations (Avoid)

| Background | Text | Ratio |
|------------|------|-------|
| `#667eea` | `#000000` | 4.1:1 ✗ |
| `#F59E0B` | `#FFFFFF` | 2.1:1 ✗ |
| `#10B981` | `#FFFFFF` | 2.9:1 ✗ |

## Glassmorphism Colors

```css
:root {
  /* Glass effects */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-bg-dark: rgba(0, 0, 0, 0.2);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-border-dark: rgba(255, 255, 255, 0.1);
}

.glass-light {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
}

.glass-dark {
  background: var(--glass-bg-dark);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border-dark);
}
```

## Neumorphism Colors

```css
:root {
  --neu-bg: #e0e5ec;
  --neu-shadow-light: #ffffff;
  --neu-shadow-dark: #a3b1c6;
}

.neu-raised {
  background: var(--neu-bg);
  box-shadow: 
    8px 8px 16px var(--neu-shadow-dark),
    -8px -8px 16px var(--neu-shadow-light);
}

.neu-pressed {
  background: var(--neu-bg);
  box-shadow: 
    inset 4px 4px 8px var(--neu-shadow-dark),
    inset -4px -4px 8px var(--neu-shadow-light);
}
```

## Dark Mode Support

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0f172a;
    --color-surface: #1e293b;
    --color-text: #f8fafc;
    --color-text-muted: #94a3b8;
    --color-border: #334155;
  }
}
```
