# Aesthetic Styles Reference

## Glassmorphism

Frosted glass effects with vibrant backdrops.

### CSS Pattern

```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --color-accent: #a855f7;
}

.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
}

/* Animated background orbs */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(50px, -50px) scale(1.1); }
  50% { transform: translate(-30px, 30px) scale(0.95); }
  75% { transform: translate(-50px, -30px) scale(1.05); }
}
```

### Signature Effects
- Aurora gradient backgrounds (teal → purple → pink)
- Floating blurred orbs
- Glowing borders
- Light reflections

---

## Dark OLED Luxury

Deep black backgrounds with subtle glows and premium feel.

### CSS Pattern

```css
:root {
  --color-bg: #000000;
  --color-surface: #0a0a0a;
  --color-accent: #10b981; /* emerald */
  --color-glow: rgba(16, 185, 129, 0.3);
}

body {
  background: var(--color-bg);
}

.card {
  background: var(--color-surface);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 40px var(--color-glow);
}

/* Cinematic entrance */
.slide {
  animation: cinematic-in 1s ease-out;
}

@keyframes cinematic-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### Signature Effects
- True #000000 black
- Subtle accent glows
- Velvet textures
- Minimal but impactful animations

---

## Brutalism

Raw, bold, intentionally unpolished.

### CSS Pattern

```css
:root {
  --color-primary: #000000;
  --color-accent: #ff3366;
  --color-bg: #ffffff;
  --font-display: 'Clash Display', sans-serif;
}

.slide {
  border: 4px solid var(--color-primary);
}

h1 {
  font-size: 120px;
  font-weight: 900;
  text-transform: uppercase;
  line-height: 0.9;
}

.brutalist-box {
  background: var(--color-accent);
  transform: rotate(-2deg);
  box-shadow: 8px 8px 0 var(--color-primary);
}
```

### Signature Effects
- Huge bold typography
- Hard shadows (no blur)
- Intentional rotation/skew
- High contrast colors
- Exposed grid structure

---

## Aurora / Mesh Gradient

Flowing, luminous gradients inspired by northern lights.

### CSS Pattern

```css
:root {
  --gradient-aurora: linear-gradient(
    135deg,
    #06b6d4 0%,
    #8b5cf6 25%,
    #ec4899 50%,
    #f97316 75%,
    #06b6d4 100%
  );
}

.aurora-bg {
  background: var(--gradient-aurora);
  background-size: 400% 400%;
  animation: aurora-shift 15s ease infinite;
}

@keyframes aurora-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Mesh gradient (CSS) */
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

### Signature Effects
- Smooth color transitions
- Animated gradient movement
- Multiple radial gradients layered
- Luminous, glowing feel

---

## Minimalism & Swiss Style

Clean, grid-based, typography-focused.

### CSS Pattern

```css
:root {
  --color-bg: #ffffff;
  --color-text: #111111;
  --color-accent: #0066ff;
  --font-display: 'Space Grotesk', sans-serif;
  --grid-unit: 20px;
}

.slide {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--grid-unit);
  padding: calc(var(--grid-unit) * 4);
}

h1 {
  font-size: 72px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

/* Subtle hover lift */
.card:hover {
  transform: translateY(-4px);
  transition: transform 0.3s ease;
}
```

### Signature Effects
- Generous whitespace
- Strict grid alignment
- Single accent color
- Micro-interactions only
- Perfect typography hierarchy

---

## Neumorphism

Soft, embossed UI with subtle depth.

### CSS Pattern

```css
:root {
  --color-bg: #e0e5ec;
  --shadow-light: #ffffff;
  --shadow-dark: #a3b1c6;
}

body {
  background: var(--color-bg);
}

.neu-raised {
  background: var(--color-bg);
  border-radius: 20px;
  box-shadow: 
    8px 8px 16px var(--shadow-dark),
    -8px -8px 16px var(--shadow-light);
}

.neu-pressed {
  background: var(--color-bg);
  border-radius: 20px;
  box-shadow: 
    inset 4px 4px 8px var(--shadow-dark),
    inset -4px -4px 8px var(--shadow-light);
}
```

### Signature Effects
- No hard borders
- Dual shadows (light/dark)
- Monochromatic palette
- Press/release animations

---

## Retro-Futurism / Cyberpunk

80s sci-fi vibes with neon and glitch effects.

### CSS Pattern

```css
:root {
  --color-bg: #0a0a0f;
  --color-neon-cyan: #00ffff;
  --color-neon-magenta: #ff00ff;
  --font-display: 'Orbitron', sans-serif;
}

/* Neon glow text */
.neon-text {
  color: var(--color-neon-cyan);
  text-shadow: 
    0 0 5px var(--color-neon-cyan),
    0 0 10px var(--color-neon-cyan),
    0 0 20px var(--color-neon-cyan),
    0 0 40px var(--color-neon-cyan);
}

/* Scanlines overlay */
.scanlines::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.1) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
}

/* Glitch effect */
@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(2px, -2px); }
  60% { transform: translate(-2px, -2px); }
  80% { transform: translate(2px, 2px); }
}
```

### Signature Effects
- Neon cyan/magenta on black
- CRT scanlines
- Glitch animations
- Chrome/metallic accents
- Grid backgrounds

---

## Accessibility Requirements

All styles MUST include:

```css
/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus styles */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
}
```
