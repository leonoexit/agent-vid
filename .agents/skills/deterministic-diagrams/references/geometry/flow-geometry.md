# Flow & Architecture Geometry Formulas

## 1. Timeline / Git Graph Layout (Lanes)

For sequential flows like Git history or Gantt charts.

- **Lane Height (`H`)**: `80` (Distance between branches/lanes)
- **Step Width (`W`)**: `100` (Distance between commits/events)
- **Lane Y-Coordinates**:
  - Main/Master: `Y = 300`
  - Feature 1: `Y = 220` (Above)
  - Feature 2: `Y = 380` (Below)

**Formula:**
- `x_commit = StartX + Order * W`
- `y_branch = BaseY + BranchOffset`

---

## 2. System Architecture (Tiered Layout)

For 3-tier web architectures (LB -> App -> DB).

- **Tier Height**: `150`
- **Center Axis**: `X = 400`
- **Tiers**:
  - Load Balancer: `Y = 100` (Single centered)
  - App Servers: `Y = 250` (Distributed horizontally)
  - Database: `Y = 400` (Single centered or distributed)

**Formula (Distribution)**:
- `x_i = CenterX + (i - (Count-1)/2) * Spacing`
