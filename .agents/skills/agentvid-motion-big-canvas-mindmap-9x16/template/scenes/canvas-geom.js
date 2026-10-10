/* canvas-geom.js: pure geometry for the hand-drawn look (window.CG). Every function returns an SVG path "d" string and is
 * deterministic: wobble comes from a seeded PRNG, never Math.random, so every frame renders identically.
 * Paths are meant to be drawn on with stroke-dashoffset (pathLength="1" on the element) and followed by the pen. */
(function () {
  const rng = (seed) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const r1 = (n) => Math.round(n * 10) / 10;
  const hash = (s) => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7);

  /** Closed-ish scribble ellipse: starts at the upper left, overshoots a little past the start (a pen loop). */
  function ellipse(cx, cy, rx, ry, seed = 1, { loops = 1.07, wob = 0.045, start = -150 } = {}) {
    const rnd = rng(seed);
    const n = 64, a0 = (start * Math.PI) / 180, ph = [rnd() * 6, rnd() * 6, rnd() * 6];
    const pts = [];
    for (let i = 0; i <= n * loops; i++) {
      const a = a0 + (i / n) * Math.PI * 2;
      const grow = 1 + ((i / n) * 0.035); // the second lap sits slightly outside the first, like a re-traced ring
      const w = 1 + wob * (Math.sin(a * 2 + ph[0]) * 0.6 + Math.sin(a * 3 + ph[1]) * 0.4);
      pts.push([cx + Math.cos(a) * rx * w * grow, cy + Math.sin(a) * ry * w * grow]);
    }
    return "M" + pts.map((p) => `${r1(p[0])},${r1(p[1])}`).join(" L");
  }

  /** Wobbly rectangle with a small overshoot at the closing corner. */
  function rect(x, y, w, h, seed = 1, { jitter = 3 } = {}) {
    const rnd = rng(seed);
    const j = () => (rnd() - 0.5) * 2 * jitter;
    const p = [[x + j(), y + j()], [x + w + j(), y + j()], [x + w + j(), y + h + j()], [x + j(), y + h + j()], [x + j() - 1, y + j() + 8]];
    return "M" + p.map((q) => `${r1(q[0])},${r1(q[1])}`).join(" L");
  }

  /** Straight stroke with a hand-drawn bow. */
  function line(x0, y0, x1, y1, seed = 1, bow = 0.03) {
    const rnd = rng(seed);
    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1;
    const k = (rnd() - 0.5) * 2 * bow * len;
    const mx = (x0 + x1) / 2 - (dy / len) * k, my = (y0 + y1) / 2 + (dx / len) * k;
    return `M${r1(x0)},${r1(y0)} Q${r1(mx)},${r1(my)} ${r1(x1)},${r1(y1)}`;
  }

  /** Arrow: a bowed shaft plus a two-stroke head, one path so it draws in a single pen move. */
  function arrow(x0, y0, x1, y1, seed = 1, head = 22) {
    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len, a = 0.45;
    const hx = (s) => x1 - head * (ux * Math.cos(a * s) - uy * Math.sin(a * s));
    const hy = (s) => y1 - head * (uy * Math.cos(a * s) + ux * Math.sin(a * s));
    return `${line(x0, y0, x1, y1, seed)} M${r1(hx(1))},${r1(hy(1))} L${r1(x1)},${r1(y1)} L${r1(hx(-1))},${r1(hy(-1))}`;
  }

  /** Branch from the hub to a node: leaves the hub sideways, runs down (or up) a vertical track outside the groups,
   *  then hooks into the ring from outside. `track` is the |x| of that vertical run (a different one per row). */
  function branch(from, to, side, track = 660) {
    const x = side * track, dir = Math.sign(to.y - from.y) || 1;
    const y1 = to.y - dir * Math.min(150, Math.abs(to.y - from.y) * 0.4);
    return `M${r1(from.x)},${r1(from.y)} C${r1(from.x + side * 260)},${r1(from.y)} ${r1(x)},${r1(from.y + dir * Math.min(120, Math.abs(y1) * 0.5))} ${r1(x)},${r1(y1)} ` +
      `C${r1(x)},${r1(to.y)} ${r1(to.x + side * 110)},${r1(to.y)} ${r1(to.x)},${r1(to.y)}`;
  }

  /** Underline / strike stroke across a box. */
  const stroke = (x0, x1, y, seed = 1) => line(x0, y, x1, y + (seed % 5) - 2, seed, 0.01);

  /** Point on a circle, degrees clockwise from 12 o'clock. */
  const onCircle = (cx, cy, r, deg) => [cx + r * Math.sin((deg * Math.PI) / 180), cy - r * Math.cos((deg * Math.PI) / 180)];

  /** Circular arc as a path (clockwise) between two angles. */
  function arc(cx, cy, r, d0, d1) {
    const a = onCircle(cx, cy, r, d0), b = onCircle(cx, cy, r, d1);
    return `M${r1(a[0])},${r1(a[1])} A${r},${r} 0 ${d1 - d0 > 180 ? 1 : 0} 1 ${r1(b[0])},${r1(b[1])}`;
  }


  /** Clockwise arc with an arrowhead at its end (cycle diagrams). */
  function arcArrow(cx, cy, r, d0, d1, head = 18) {
    const th = (d1 * Math.PI) / 180, b = onCircle(cx, cy, r, d1);
    const t = [Math.cos(th), Math.sin(th)], rot = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
    const h1 = rot(t, 0.5), h2 = rot(t, -0.5);
    return `${arc(cx, cy, r, d0, d1)} M${r1(b[0] - head * h1[0])},${r1(b[1] - head * h1[1])} L${r1(b[0])},${r1(b[1])} L${r1(b[0] - head * h2[0])},${r1(b[1] - head * h2[1])}`;
  }

  /** Width along a stroke, u = 0..1 of its length. taper: thick root -> thin tip; press: thin in, full, thin out. */
  const PROFILES = {
    taper: (w, u) => Math.max(2.4, w * 0.17) + (w - Math.max(2.4, w * 0.17)) * Math.pow(1 - u, 1.15),
    press: (w, u) => Math.max(1.1, w * 0.15) + (w - Math.max(1.1, w * 0.15)) * Math.pow(Math.sin(Math.PI * u), 0.6),
  };

  /** Brush outline around a centre line `d` (any SVG path, several M sub-paths allowed): a closed filled polygon per
   *  sub-path whose half-width follows the profile. `sampler` is a rendered <path> used for getPointAtLength. */
  function ribbon(sampler, d, profile, w) {
    const prof = PROFILES[profile] || PROFILES.press;
    return String(d).split(/(?=M)/).filter((x) => x.trim()).map((sub) => {
      sampler.setAttribute("d", sub);
      const len = sampler.getTotalLength();
      if (!(len > 0.5)) return "";
      const n = Math.max(16, Math.min(420, Math.round(len / 5)));
      const pts = Array.from({ length: n + 1 }, (_, i) => sampler.getPointAtLength((len * i) / n));
      const left = [], right = [];
      pts.forEach((p, i) => {
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n, i + 1)];
        const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1, h = prof(w, i / n) / 2;
        left.push(`${r1(p.x - (dy / l) * h)},${r1(p.y + (dx / l) * h)}`);
        right.push(`${r1(p.x + (dy / l) * h)},${r1(p.y - (dx / l) * h)}`);
      });
      return `M${left.join(" L")} L${right.reverse().join(" L")} Z`;
    }).join(" ");
  }

  window.CG = { rng, hash, ellipse, rect, line, arrow, branch, stroke, onCircle, arc, arcArrow, ribbon, PROFILES, r1 };
})();
