# Charts & Diagrams

## Adding Charts (Chart.js)

Use Chart.js via CDN for data visualization:

```html
<canvas id="myChart" width="600" height="400"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
  const ctx = document.getElementById("myChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          label: "Revenue",
          data: [12, 19, 3, 5],
          backgroundColor: "#4F46E5",
        },
      ],
    },
    options: {
      responsive: false,
      plugins: { legend: { display: true } },
    },
  });
</script>
```

### Supported Chart Types

- `bar` - Bar chart (vertical)
- `horizontalBar` - Horizontal bar chart
- `line` - Line chart
- `pie` - Pie chart
- `doughnut` - Doughnut chart
- `radar` - Radar/spider chart
- `polarArea` - Polar area chart

### Chart Best Practices

1. Set `responsive: false` for fixed-size slides
2. Use consistent colors from your palette
3. Keep legends readable (font size 16-18px)
4. Limit data points for clarity (max 8-10)

## Adding Diagrams (Canvas 2D)

Use Canvas 2D API for custom flowcharts, timelines, and diagrams:

```html
<canvas id="diagram" width="800" height="400"></canvas>
<script>
  const canvas = document.getElementById("diagram");
  const ctx = canvas.getContext("2d");

  // Draw flowchart box
  ctx.fillStyle = "#4F46E5";
  ctx.fillRect(100, 50, 200, 80);
  ctx.fillStyle = "white";
  ctx.font = "20px Inter";
  ctx.fillText("Step 1", 150, 95);

  // Draw arrow
  ctx.strokeStyle = "#4F46E5";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 90);
  ctx.lineTo(400, 90);
  ctx.stroke();
</script>
```

### Helper Functions

#### Draw Rounded Rectangle

```javascript
function drawRoundedRect(ctx, x, y, width, height, radius, fillColor) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
}
```

#### Draw Arrow

```javascript
function drawArrow(ctx, fromX, fromY, toX, toY, color) {
  const headLength = 15;
  const angle = Math.atan2(toY - fromY, toX - fromX);

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Arrowhead
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}
```

### Diagram Use Cases

- **Flowcharts**: Process flows, decision trees
- **Timelines**: Project milestones, historical events
- **Architecture diagrams**: System components, data flow
- **Org charts**: Team structure, hierarchies
