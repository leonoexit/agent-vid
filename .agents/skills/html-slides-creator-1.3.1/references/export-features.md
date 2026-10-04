# Export Features

## Exporting to PDF

**Method**: Use browser's built-in print function

1. Open HTML file in Chrome/Edge
2. Press `Cmd+P` (Mac) or `Ctrl+P` (Windows)
3. Settings:
   - Destination: Save as PDF
   - Layout: Landscape
   - Paper size: A4 or Letter
   - Margins: None
   - Background graphics: ON
4. Click "Save"

## Built-in Export Controls

Always include export functionality for user convenience.

### HTML Structure for Export Controls

```html
<!-- Add to body -->
<div class="export-controls">
  <button class="export-btn" id="exportPdf">Export PDF</button>
  <button class="export-btn" id="exportImages">Export Images (ZIP)</button>
</div>

<div class="loading-overlay" id="loadingOverlay">
  <div class="loading-text">Processing...</div>
  <div class="progress-bar">
    <div class="progress-fill" id="progressFill"></div>
  </div>
</div>
```

### Required Libraries

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
```

### Export Control Styles

```css
.export-controls {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  display: flex;
  gap: 15px;
  background: rgba(0, 0, 0, 0.9);
  padding: 15px;
  border-radius: 8px;
}

.export-btn {
  padding: 12px 24px;
  background: #fff;
  color: #000;
  border: none;
  font-weight: 600;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.export-btn:hover {
  background: #000;
  color: #fff;
  box-shadow: 0 0 0 2px #fff;
}

@media print {
  .export-controls {
    display: none !important;
  }
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  color: white;
  font-size: 24px;
}

.loading-overlay.active {
  display: flex;
}

.progress-bar {
  width: 300px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin-top: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #667eea;
  width: 0%;
  transition: width 0.3s;
}
```

### JavaScript Implementation

See: `scripts/export.js`

## Export Best Practices

1. **Always include both PDF and Image export options**
2. **Use high-resolution capture (scale: 2) for images**
3. **Show progress for long operations**
4. **Add keyboard shortcuts (Ctrl+P for PDF, Ctrl+S for Images)**
5. **Test export quality across browsers**
6. **Consider file size optimization for large presentations**
