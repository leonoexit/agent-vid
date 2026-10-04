// ===== PDF EXPORT FUNCTIONALITY =====
// Uses browser's native print dialog to save slides as PDF
document.getElementById("exportPdf").addEventListener("click", () => {
  window.print(); // Triggers browser print dialog (user can select "Save as PDF")
});

// ===== IMAGES ZIP EXPORT FUNCTIONALITY =====
// Exports all slides as individual PNG images packaged in a ZIP file
// Uses clone technique to avoid rendering issues with original slides
document
  .getElementById("exportImages")
  .addEventListener("click", async function () {
    // Get all slide elements from the DOM
    const slides = document.querySelectorAll(".slide");

    // UI elements for loading feedback
    const loadingOverlay = document.getElementById("loadingOverlay");
    const progressFill = document.getElementById("progressFill");

    // 1. Show loading overlay to inform user export is in progress
    if (loadingOverlay) loadingOverlay.classList.add("active");

    // Initialize ZIP file structure
    const zip = new JSZip();
    const folder = zip.folder("slides"); // Create "slides" folder inside ZIP

    // 2. Create hidden container for cloned slides
    // This container positions slides at (0,0) to avoid scroll-related capture issues
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.zIndex = "-9999"; // Place behind everything
    container.style.opacity = "0"; // Make invisible to user
    document.body.appendChild(container);

    try {
      // Wait for all fonts to load to ensure proper text rendering
      await document.fonts.ready;

      // Process each slide individually
      for (let i = 0; i < slides.length; i++) {
        const originalSlide = slides[i];

        // 3. CLONE & RESET STYLES
        // Create a deep copy of the slide to manipulate without affecting original
        const clonedSlide = originalSlide.cloneNode(true);

        // Reset positioning styles to ensure slide is captured from top-left corner
        clonedSlide.style.margin = "0";
        clonedSlide.style.transform = "none"; // Remove any CSS transforms
        clonedSlide.style.boxShadow = "none"; // Remove shadows to prevent edge clipping

        // Add cloned slide to hidden container
        container.appendChild(clonedSlide);

        // Update progress bar if it exists
        if (progressFill) {
          const percent = Math.round(((i + 1) / slides.length) * 100);
          progressFill.style.width = `${percent}%`;
        }

        // Brief pause to allow browser to render the cloned DOM element
        await new Promise((resolve) => setTimeout(resolve, 50));

        // 4. CAPTURE SCREENSHOT OF CLONED SLIDE
        const canvas = await html2canvas(clonedSlide, {
          scale: 2, // 2x resolution for retina/high-DPI displays
          useCORS: true, // Allow cross-origin images if properly configured
          backgroundColor: "#ffffff", // Ensure white background (no transparency)
          logging: false, // Disable console logging
          width: originalSlide.offsetWidth, // Use actual slide width
          height: originalSlide.offsetHeight, // Use actual slide height
          windowWidth: originalSlide.offsetWidth, // Viewport width for rendering
          windowHeight: originalSlide.offsetHeight, // Viewport height for rendering
          x: 0, // Start capture from x=0
          y: 0, // Start capture from y=0
          scrollX: 0, // No horizontal scroll offset
          scrollY: 0, // No vertical scroll offset
        });

        // Clean up: remove cloned slide after capture
        container.removeChild(clonedSlide);

        // Convert canvas to PNG blob
        const blob = await new Promise((resolve) => {
          canvas.toBlob(resolve, "image/png", 1.0); // 1.0 = maximum quality
        });

        // Add image to ZIP with padded filename (e.g., slide-01.png, slide-02.png)
        folder.file(`slide-${String(i + 1).padStart(2, "0")}.png`, blob);
      }

      // 5. Generate and download ZIP file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "presentation-slides.zip"); // Uses FileSaver.js library
    } catch (error) {
      // Error handling: log and alert user
      console.error("Export failed:", error);
      alert("Export failed: " + error.message);
    } finally {
      // Cleanup: remove temporary container and hide loading overlay
      document.body.removeChild(container);
      if (loadingOverlay) loadingOverlay.classList.remove("active");
    }
  });
