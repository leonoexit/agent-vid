# Technical Guidelines

## HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Presentation Title</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      /* Reset and base styles */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: "Inter", sans-serif;
        background: #f5f5f5;
        padding: 20px;
      }

      /* Slide container */
      .slide {
        width: 1280px;
        height: 720px;
        max-width: 100%;
        margin: 20px auto;
        background: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        page-break-after: always;
        position: relative;
        overflow: hidden;
      }

      /* Print styles for PDF export */
      @media print {
        body {
          background: white;
          padding: 0;
        }
        .slide {
          width: 1280px;
          height: 720px;
          max-width: 100%;
          margin: 0;
          box-shadow: none;
          page-break-after: always;
        }
      }

      /* Responsive for editing */
      @media screen and (max-width: 1280px) {
        .slide {
          transform: scale(0.8);
          transform-origin: top center;
        }
      }
    </style>
  </head>
  <body>
    <!-- Slide 1: Cover -->
    <div class="slide">
      <!-- Content here -->
    </div>

    <!-- Slide 2: Content -->
    <div class="slide">
      <!-- Content here -->
    </div>
  </body>
</html>
```

## Design Best Practices

1. **Fixed Dimensions**: Always use 1280x720px (16:9) or 1920x1080px for slides
2. **Safe Zones**: Keep important content 80px from edges
3. **Typography**:
   - Title: 48-72px
   - Subtitle: 32-40px
   - Body: 24-28px
   - Caption: 18-20px
4. **Contrast**: Ensure text is readable (WCAG AA: 4.5:1 minimum)
5. **Consistency**: Use same fonts, colors, and spacing throughout

## Template Patterns

### Cover Slide Template

- Large centered title (64-72px)
- Subtitle or tagline (32-40px)
- Author/date info (20-24px)
- Optional: Background gradient or image
- Optional: Logo in corner

### Content Slide Template

- Header with title (40-48px)
- Content area (flexible layout)
- Optional: Page number
- Optional: Footer with branding

### Section Divider Template

- Large section title (72-96px)
- Minimal design
- Strong visual impact

## Common CSS Patterns

### Centered Content Layout

```css
.slide-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 80px;
}
```

### Two-Column Layout

```css
.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  padding: 80px;
  height: 100%;
}
```

### Image + Text Layout

```css
.image-text {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  padding: 80px;
  align-items: center;
}
```
