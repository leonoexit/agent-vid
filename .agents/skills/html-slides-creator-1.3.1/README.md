# HTML Slides Creator Pro v1.3.1

A Claude skill for creating **jaw-dropping, production-ready** HTML presentation slides that look like they cost $50k+ from a design agency.

## What's New in v1.3.1

### 🎨 Bold Aesthetic Directions
Choose from 10 distinct visual styles:
- **Glassmorphism** - Frosted glass with aurora backgrounds
- **Dark OLED Luxury** - Deep black with subtle glows
- **Brutalism** - Raw, bold, high contrast
- **Minimalism & Swiss** - Clean, grid-based, typography-first
- **Aurora / Mesh Gradient** - Flowing, luminous gradients
- **Neumorphism** - Soft, embossed UI
- **Retro-Futurism / Cyberpunk** - Neon, glitch, scanlines
- **Claymorphism** - Chunky 3D, bubbly
- **Vibrant Block / Maximalist** - Bold colors, energetic
- **Organic / Biomorphic** - Fluid shapes, nature-inspired

### ✨ Professional Typography
- Banned: Inter, Roboto, Arial (default AI fonts)
- Included: Outfit, Space Grotesk, Sora, Clash Display, Bebas Neue, and more
- Pre-configured font pairings for different aesthetics

### 🖼️ Perfect Images System
- Real Unsplash/Pexels URLs with proper parameters
- AI image generation prompts (Flux/Midjourney ready)
- Zero fake URLs, zero placeholder images

### 📊 Enhanced Templates
- `cover-glassmorphism.html` - Stunning frosted glass covers
- `cover-brutalist.html` - Bold, impactful titles
- `cover-minimal.html` - Clean Swiss-style covers
- `content-modern.html` - Card-based content with soft shadows
- `chart-dark-luxury.html` - OLED black with glowing charts
- `two-column-glass.html` - Glassmorphism comparisons
- `image-hero.html` - Cinematic full-bleed images
- `diagram-flow.html` - Clean process diagrams

## Installation

### Global Installation (Recommended)

```bash
mkdir -p ~/.claude/skills/html-slides-creator
cp -r html-slides-skill-1.3.1/* ~/.claude/skills/html-slides-creator/
```

### Project-Specific Installation

```bash
mkdir -p .claude/skills/html-slides-creator
cp -r html-slides-skill-1.3.1/* .claude/skills/html-slides-creator/
```

## Usage

Simply ask Claude:

```
Create a 5-slide pitch deck with glassmorphism style about AI automation
```

```
Build a dark luxury presentation for our Q4 financial results
```

```
Make brutalist slides for a startup pitch - bold and memorable
```

## Output Formats

- **16:9 Standard**: 1280x720px or 1920x1080px
- **1:1 Square**: 1080x1080px (for social media carousels)

## Export Options

1. **PDF**: Press `Cmd+P` (Mac) or `Ctrl+P` (Windows)
2. **Image ZIP**: Built-in export button

## File Structure

```
html-slides-skill-1.3.1/
├── SKILL.md                          # Main skill instructions
├── README.md                         # This file
├── assets/                           # HTML templates
│   ├── cover-glassmorphism.html
│   ├── cover-brutalist.html
│   ├── cover-minimal.html
│   ├── content-modern.html
│   ├── chart-dark-luxury.html
│   ├── two-column-glass.html
│   ├── image-hero.html
│   └── diagram-flow.html
├── references/                       # Documentation
│   ├── aesthetic-styles.md           # Detailed style guide
│   ├── typography-guide.md           # Font recommendations
│   ├── color-systems.md              # Color palettes
│   ├── technical-guidelines.md       # HTML/CSS patterns
│   ├── charts-diagrams.md            # Chart.js patterns
│   ├── export-features.md            # Export functionality
│   └── carousel-design-principles.md # Long carousel design
└── scripts/
    └── export.js                     # Export functionality
```

## Design Philosophy

This skill follows the **frontend-design-pro** principles:

1. **Commit 100% to one aesthetic** - No mixing styles
2. **Never use default fonts** - Character over convention
3. **One dominant color + sharp accent** - Clear visual hierarchy
4. **Break the grid** - Asymmetry, overlap, diagonal flow
5. **Heroic motion > scattered micro-interactions**
6. **Full WCAG accessibility** - AA/AAA contrast, focus styles
7. **Support reduced motion** - Respect user preferences

## Version History

- **v1.3.1** - Added frontend-design-pro integration, bold aesthetics, professional typography
- **v1.2.0** - Added carousel design principles
- **v1.1.0** - Added export features
- **v1.0.0** - Initial release

## License

This skill is provided as-is for use with Claude.
