---
name: html-slides-creator-131
description: Create jaw-dropping, production-ready HTML presentations with bold aesthetic directions, professional typography, and stunning visual effects. Exports to PDF and image ZIP. Use when creating slides, presentations, pitch decks, carousels, or any visual storytelling content.
---

# HTML Slides Creator Pro

Create presentation slides that look like they cost $50k+ from a design agency.

## Overview

This skill builds beautiful, standalone HTML presentations that:

- Work in any browser and offline (single HTML file)
- Export perfectly to PDF via browser print (Cmd/Ctrl+P)
- Export to image ZIP for social media
- Use characterful fonts for professional typography
- Feature bold aesthetic directions (glassmorphism, brutalism, aurora, etc.)

## Prerequisites

**Good for:**

- Offline presentations
- High-impact visual storytelling
- Pitch decks that impress
- Social media carousels
- Tutorial/educational content
- Full design control

**Not ideal for:**

- Real-time collaboration
- Native PowerPoint compatibility required

## STEP 1: Choose One Bold Aesthetic Direction (commit 100%)

| Style Category             | Core Keywords                                      | Color Palette                                | Signature Effects                                            |
| -------------------------- | -------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| Minimalism & Swiss         | clean, grid-based, whitespace, typography-first    | Monochrome + one bold accent                 | Razor-sharp hierarchy, subtle hover lifts, perfect alignment |
| Neumorphism                | soft ui, embossed, subtle depth, monochromatic     | Single pastel + light/dark variations        | Multi-layer soft shadows, no hard borders                    |
| Glassmorphism              | frosted glass, translucent, blur, layered          | Aurora backgrounds + semi-transparent whites | backdrop-filter: blur(), glowing borders, floating layers    |
| Brutalism                  | raw, asymmetric, high contrast, intentionally bold | Harsh primaries, black/white, neon           | Sharp corners, huge bold text, exposed grid                  |
| Claymorphism               | clay, chunky 3D, bubbly, double shadows            | Candy pastels, soft gradients                | Inner + outer shadows, squishy effects                       |
| Aurora / Mesh Gradient     | aurora, mesh gradient, luminous, flowing           | Teal → purple → pink blends                  | Animated CSS gradients, color breathing                      |
| Retro-Futurism / Cyberpunk | vaporwave, 80s sci-fi, neon glow, glitch           | Neon cyan/magenta on deep black              | Scanlines, glitch effects, long glowing shadows              |
| Dark OLED Luxury           | deep black, subtle glow, premium, cinematic        | #000000 + vibrant accents                    | Minimal glows, velvet textures, cinematic entrances          |
| Vibrant Block / Maximalist | bold blocks, duotone, high contrast, energetic     | Complementary brights, neon on dark          | Large colorful sections, dramatic hover scales               |
| Organic / Biomorphic       | fluid shapes, blobs, curved, nature-inspired       | Earthy or muted pastels                      | SVG morphing, gooey effects, irregular borders               |

## STEP 2: Non-Negotiable Design Rules

### Typography Rules

**NEVER use default AI fonts:**

- ❌ Inter, Roboto, Arial, system-ui, sans-serif

**USE characterful fonts:**

- Headlines: Clash Display, Neue Machina, Obviously, Space Grotesk, Sora
- Body: Outfit, Plus Jakarta Sans, Satoshi, General Sans, DM Sans
- Accent: Cabinet Grotesk, Switzer, Archivo

### Design Principles

- CSS custom properties everywhere (`--color-primary`, `--font-main`, etc.)
- One dominant color + sharp accent(s)
- At least one signature detail (grain texture, custom cursor, animated mesh, diagonal split)
- Break the centered-card grid: use asymmetry, overlap, diagonal flow
- Heroic, perfectly timed motion > scattered micro-animations
- Full WCAG AA/AAA contrast, focus styles, semantic HTML
- Support `prefers-reduced-motion`

## STEP 3: Perfect Images System

When slides need images (hero, background, product shots):

### Option 1: Real Stock Photos

Use ONLY real Unsplash/Pexels/Pixabay URLs with direct parameters:

```html
<img
  src="https://images.unsplash.com/photo-1708282114148-9e0e8d0f83?w=1920&q=80"
  alt="Developer focused on code in dark luxury studio"
/>
```

### Option 2: AI Image Generation Prompts

For custom visuals, provide copy-paste-ready prompts:

```
[IMAGE PROMPT START]
Cinematic photograph of [exact scene], dramatic rim lighting,
ultra-realistic, perfect composition, 16:9 --ar 16:9 --v 6 --q 2
[IMAGE PROMPT END]
```

**NEVER invent fake URLs or use placeholder images.**

## STEP 4: Slide Generation Workflow

1. **Research & Plan**

   - Clarify topic, audience, purpose, style preference
   - Gather comprehensive info via web search
   - Decide which slides need charts, diagrams, images

2. **Structure & Design**

   - Plan slide sequence (cover → agenda → content → conclusion)
   - Choose aesthetic direction from table above
   - Define 3-5 color palette (primary, secondary, accent, background, text)
   - Select 2 fonts (headline + body)

3. **Build Slides**

   - Create title slide with bold typography
   - Build content slides with consistent styling
   - Add visual elements:
     - **Charts**: Chart.js via CDN
     - **Diagrams**: Canvas 2D API
     - **Icons**: Lucide or inline SVG
   - Review consistency, flow, visual impact

4. **Always Include Export Features**
   - PDF export button
   - Image ZIP export button
   - See `{baseDir}/references/export-features.md`

## Output Formats

- **Standard (16:9)**: 1280x720px or 1920x1080px - business presentations
- **Square (1:1)**: 1080x1080px - social media carousels

## Resources

### References

| File                                                 | Content                                              |
| ---------------------------------------------------- | ---------------------------------------------------- |
| `{baseDir}/references/aesthetic-styles.md`           | Detailed aesthetic direction guide with CSS patterns |
| `{baseDir}/references/typography-guide.md`           | Font pairings and loading patterns                   |
| `{baseDir}/references/color-systems.md`              | Color palettes and CSS custom properties             |
| `{baseDir}/references/technical-guidelines.md`       | HTML structure, responsive patterns                  |
| `{baseDir}/references/charts-diagrams.md`            | Chart.js, Canvas 2D patterns                         |
| `{baseDir}/references/export-features.md`            | PDF & Image ZIP export                               |
| `{baseDir}/references/carousel-design-principles.md` | Design for long carousels (50-100+ slides)           |
| `{baseDir}/references/complete-example.md`           | Full example presentation                            |

### Templates

Pre-built HTML templates in `{baseDir}/assets/`:

| Template                   | Use Case                | Aesthetic                      |
| -------------------------- | ----------------------- | ------------------------------ |
| `cover-glassmorphism.html` | Title slides            | Frosted glass, aurora bg       |
| `cover-brutalist.html`     | Bold title slides       | Raw, high contrast             |
| `cover-minimal.html`       | Clean title slides      | Swiss, typography-first        |
| `content-modern.html`      | Bullet points           | Soft shadows, gradient accents |
| `chart-dark-luxury.html`   | Data visualization      | OLED black, glowing charts     |
| `two-column-glass.html`    | Comparisons             | Glassmorphism cards            |
| `image-hero.html`          | Full-bleed image + text | Cinematic overlay              |
| `diagram-flow.html`        | Flowcharts, processes   | Clean with accent colors       |

### Scripts

| Script                        | Purpose                             |
| ----------------------------- | ----------------------------------- |
| `{baseDir}/scripts/export.js` | Export functionality (PDF + Images) |
