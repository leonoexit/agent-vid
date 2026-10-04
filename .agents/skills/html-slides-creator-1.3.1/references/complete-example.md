# Complete Example

A complete 3-slide presentation with export features:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Product Launch</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
      rel="stylesheet"
    />

    <!-- Export Libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>

    <style>
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
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 80px;
      }

      /* Export Controls */
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
        background: #667eea;
        color: #fff;
      }

      @media print {
        body {
          background: white;
          padding: 0;
        }
        .slide {
          margin: 0;
          box-shadow: none;
        }
        .export-controls {
          display: none !important;
        }
      }

      .cover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      .cover h1 {
        font-size: 72px;
        font-weight: 700;
        margin-bottom: 20px;
      }
      .cover p {
        font-size: 32px;
        opacity: 0.9;
      }

      .content h2 {
        font-size: 48px;
        color: #333;
        margin-bottom: 40px;
      }
      .content ul {
        font-size: 28px;
        color: #555;
        line-height: 1.8;
      }
      .content li {
        margin-bottom: 20px;
      }

      .chart-slide {
        padding: 60px 80px;
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
        justify-content: center;
        align-items: center;
        z-index: 2000;
        color: white;
        font-size: 24px;
      }

      .loading-overlay.active {
        display: flex;
      }
    </style>
  </head>
  <body>
    <!-- Export Controls -->
    <div class="export-controls">
      <button class="export-btn" id="exportPdf">Export PDF</button>
      <button class="export-btn" id="exportImages">Export Images</button>
    </div>

    <!-- Loading Overlay -->
    <div class="loading-overlay" id="loadingOverlay">
      <div>Processing slides...</div>
    </div>

    <!-- Slide 1: Cover -->
    <div class="slide cover">
      <h1>Product Launch 2025</h1>
      <p>Revolutionizing the Industry</p>
    </div>

    <!-- Slide 2: Features -->
    <div class="slide content">
      <h2>Key Features</h2>
      <ul>
        <li>10x Faster Performance</li>
        <li>Enterprise-Grade Security</li>
        <li>AI-Powered Insights</li>
        <li>Global Scalability</li>
      </ul>
    </div>

    <!-- Slide 3: Growth Chart -->
    <div class="slide chart-slide">
      <h2 style="text-align: center; margin-bottom: 40px;">User Growth</h2>
      <canvas id="growthChart" width="1000" height="500"></canvas>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
      // Chart initialization
      const ctx = document.getElementById("growthChart").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Active Users",
              data: [1200, 1900, 3000, 5000, 7500, 10000],
              borderColor: "#667eea",
              backgroundColor: "rgba(102, 126, 234, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: false,
          plugins: {
            legend: { display: true, labels: { font: { size: 18 } } },
          },
          scales: {
            y: { beginAtZero: true, ticks: { font: { size: 16 } } },
            x: { ticks: { font: { size: 16 } } },
          },
        },
      });

      // Export functionality
      document.getElementById("exportPdf").addEventListener("click", () => {
        window.print();
      });

      document
        .getElementById("exportImages")
        .addEventListener("click", async () => {
          const loadingOverlay = document.getElementById("loadingOverlay");
          loadingOverlay.classList.add("active");

          const slides = document.querySelectorAll(".slide");
          const zip = new JSZip();
          const folder = zip.folder("presentation-slides");

          for (let i = 0; i < slides.length; i++) {
            const canvas = await html2canvas(slides[i], {
              width: 1280,
              height: 720,
              scale: 2,
              logging: false,
            });

            const blob = await new Promise((resolve) => {
              canvas.toBlob(resolve, "image/png", 1.0);
            });

            folder.file(`slide-${String(i + 1).padStart(2, "0")}.png`, blob);
          }

          const zipBlob = await zip.generateAsync({ type: "blob" });
          saveAs(zipBlob, "presentation-slides.zip");

          loadingOverlay.classList.remove("active");
        });
    </script>
  </body>
</html>
```
