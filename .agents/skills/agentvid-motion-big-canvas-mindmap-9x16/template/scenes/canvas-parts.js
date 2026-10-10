/* canvas-parts.js: the content blocks that hang under a node (window.CPARTS). A part has a fixed height (h(spec)), so the
 * map layout never depends on measured text, and build(P, host, spec, g) that places DOM inside `host` (a box GW wide at
 * the part's slot) and schedules its writing through the painter P.
 *   g = { at(anchor, fallback), seq(i, n), tone, seed, t0 }   t0 = earliest start (the node has been inked)
 * Kinds: sub, note, list, chips, tree, loop, cards, icon. Item times come from `at` anchors on spoken words; items without
 * one are spread across the scene. Sizes are for the 1080-wide frame. */
(function () {
  const { ellipse, rect, line, arrow, onCircle, arc, hash, r1 } = window.CG;
  const GW = 560;
  const ROW = 62;
  const col = (t) => `var(--t-${t || "ink"})`;
  const TONES = ["blue", "teal", "purple", "magenta", "orange", "green", "brown"];
  const estW = (s, per = 18) => String(s).length * per; // only used to place chips; rings are re-fitted from the real width

  /** ring around a text span: rx/ry follow the measured text once fonts are loaded */
  function ringAround(P, s, span, g, color, seedKey, { padX = 34, padY = 14, width = 7 } = {}) {
    const p = P.path(s, "M0,0", { color, width });
    P.fit(() => {
      const w = span.offsetWidth || 120, hgt = span.offsetHeight || 40;
      const o = CP.worldPos(span, P.world), b = CP.worldPos(s.box, P.world);
      P.setD(p, ellipse(o.x - b.x + w / 2, o.y - b.y + hgt / 2, w / 2 + padX, hgt / 2 + padY, hash(seedKey), { wob: 0.012 }));
    });
    return p;
  }

  const sub = {
    h: (s) => (s.lines ? 54 * s.lines.length : 46), // several lines: room for stacked Vietnamese marks between them
    build(P, host, s, g) {
      (s.lines || [s.text]).forEach((str, i) => {
        const sp = P.text(host, str, { y: i * 54, cls: "sub " + (s.tone === "red" ? "note" : ""), align: "c", size: Math.min(36, Math.floor(1040 / Math.max(1, str.length))) });
        P.write(sp, g.at(i === 0 ? s.at : undefined, g.t0 + i * 0.7));
      });
    },
  };

  const note = {
    h: (s) => (s.strike ? 120 : 62),
    build(P, host, s, g) {
      const size = Math.min(s.size || 48, Math.floor(1040 / Math.max(1, String(s.text).length))); // a long point shrinks to fit its column
      let y = 0;
      if (s.strike) {
        const old = P.text(host, s.strike, { y, cls: "old", size: size * 0.82 });
        const t = P.write(old, g.at(s.strikeAt, g.t0));
        const sv = P.svg(host, 0, 0);
        const sp = P.path(sv, "M0,0", { color: "var(--accent)", width: 8.5 });
        P.fit(() => {
          const o = CP.worldPos(old, P.world), b = CP.worldPos(sv.box, P.world);
          const w = old.offsetWidth || 200, cy = o.y - b.y + old.offsetHeight * 0.56, x0 = o.x - b.x - 10;
          P.setD(sp, line(x0, cy, x0 + w + 20, cy - 6, g.seed + 3, 0.01));
        });
        P.ink(sp, sv, t + 0.5, 0.35, "power2.out");
        y = 58;
      }
      const cls = s.tone === "ink" ? "" : s.tone === "muted" ? "mute" : "note";
      const sp = P.text(host, s.text, { y, cls: cls, size });
      P.write(sp, g.at(s.at, g.t0 + (s.strike ? 1.0 : 0)));
    },
  };

  const list = {
    h: (s) => Math.ceil(s.items.length / (s.cols || 1)) * ROW + (s.ring ? 56 : 0),
    build(P, host, s, g) {
      const cols = s.cols || 1, colW = GW / cols, top = s.ring ? 28 : 0, tone = col(s.iconTone || g.tone);
      const spans = [];
      s.items.forEach((it, i) => {
        const item = typeof it === "string" ? { text: it } : it;
        const x = (i % cols) * colW + 6, y = top + Math.floor(i / cols) * ROW;
        const t = g.at(item.at, g.seq(i, s.items.length));
        let tx = x;
        if (item.icon && s.icons !== false) {
          const ic = P.icon(host, item.icon, { x: x, y: y + 8, size: 40, color: tone });
          P.drawIcon(ic, t);
          tx = x + 54;
        } else if (s.mark) {
          const m = P.text(host, s.mark === "check" ? "✓" : s.mark, { x, y: y + 4, w: 40, align: "l", size: 36, color: tone });
          P.write(m, t, 0.2);
          tx = x + 48;
        }
        const sp = P.text(host, item.text, { x: tx, y: y + 6, w: colW - (tx - x), align: "l", size: s.size || 36 });
        P.write(sp, t + 0.05);
        spans.push(sp);
      });
      if (s.ring) {
        const sv = P.svg(host, 0, 0);
        const w = GW, hgt = Math.ceil(s.items.length / cols) * ROW;
        const p = P.path(sv, ellipse(w / 2, top + hgt / 2, w / 2 * 1.14 + 6, hgt / 2 * 1.2 + 14, g.seed, { wob: 0.012 }), { color: col(s.ring.tone || "red"), width: 8 });
        P.ink(p, sv, g.at(s.ring.at, g.seq(s.items.length, s.items.length)), 0.9, "power2.inOut");
      }
    },
  };

  /** chips: rounded outlines around short labels, wrapped into rows */
  const chips = {
    rows(s) {
      const rows = [[]]; let w = 0;
      s.items.forEach((it, i) => {
        const cw = estW(typeof it === "string" ? it : it.text) + 56;
        if (w + cw > GW && rows.at(-1).length) { rows.push([]); w = 0; }
        rows.at(-1).push({ i, cw }); w += cw + 14;
      });
      return rows;
    },
    h(s) { return chips.rows(s).length * 78; },
    build(P, host, s, g) {
      chips.rows(s).forEach((row, r) => {
        const total = row.reduce((a, c) => a + c.cw + 14, -14);
        let x = (GW - total) / 2;
        row.forEach((c) => {
          const raw = s.items[c.i], item = typeof raw === "string" ? { text: raw } : raw;
          const box = P.h("chip", "", host, { left: `${x}px`, top: `${r * 78}px`, width: `${c.cw}px` });
          const sp = P.text(box, item.text, { w: c.cw, y: 11 });
          const sv = P.svg(box, 0, 0);
          const p = ringAround(P, sv, sp, g, col(item.tone || TONES[c.i % TONES.length]), `${g.seed}-${c.i}`, { padX: 30, padY: 12 });
          const t = g.at(item.at, g.seq(c.i, s.items.length));
          const t1 = P.ink(p, sv, t, 0.5, "power2.inOut");
          P.write(sp, t1 + 0.1, 0.35);
          x += c.cw + 14;
        });
      });
    },
  };

  /** tree: levels of icon + caption items, arrows from each level to the next */
  const LVL = 112, ARW = 62;
  const tree = {
    h: (s) => s.levels.length * LVL + (s.levels.length - 1) * ARW,
    build(P, host, s, g) {
      const pos = (l, i) => ({ x: (GW * (i + 0.5)) / s.levels[l].length, y: l * (LVL + ARW) });
      const total = s.levels.flat().length;
      let flat = 0;
      s.levels.forEach((lvl, l) => {
        lvl.forEach((raw, i) => {
          const it = typeof raw === "string" ? { text: raw } : raw, p = pos(l, i);
          const t = g.at(it.at, g.seq(flat++, total));
          if (l > 0) {
            const q = pos(l - 1, Math.min(s.levels[l - 1].length - 1, Math.floor((i * s.levels[l - 1].length) / lvl.length)));
            const sv = P.svg(host, 0, 0);
            const a = P.path(sv, arrow(q.x, q.y + (it.ring || s.levels[l - 1][0].ring ? 70 : 100), p.x, p.y - 4, g.seed + l * 7 + i, 20), { width: 6 });
            P.ink(a, sv, t - 0.25, 0.4, "power2.out");
          }
          if (it.icon) {
            const ic = P.icon(host, it.icon, { x: p.x - 28, y: p.y, size: 56, color: col(it.tone || g.tone) });
            P.drawIcon(ic, t + 0.2);
            const cw = Math.min(220, GW / lvl.length - 8);
            const cap = P.h("cap", `<span>${MotionKit.richText(it.text)}</span>`, host, { left: `${p.x - cw / 2}px`, top: `${p.y + 62}px`, width: `${cw}px` });
            P.write(cap.firstChild, t + 0.3);
          } else {
            const sp = P.text(host, it.text, { x: p.x - 140, y: p.y + 26, w: 280, size: 42, cls: "b" });
            const sv = P.svg(host, 0, 0);
            const ring = ringAround(P, sv, sp, g, col(it.tone || g.tone), `${g.seed}-t${l}${i}`, { padX: 40, padY: 18 });
            const t1 = P.ink(ring, sv, t, 0.55, "power2.inOut");
            P.write(sp, t1 + 0.1);
          }
        });
      });
    },
  };

  /** loop: 3–5 steps around a circle joined by clockwise arrows; optional centre label. Labels stay inside the group. */
  const R = 108, LOOP_H = 360, LBL_W = 150;
  const loop = {
    h: () => LOOP_H,
    build(P, host, s, g) {
      const cx = GW / 2, cy = LOOP_H / 2, n = s.steps.length, tone = col(g.tone);
      const pts = s.steps.map((_, i) => onCircle(cx, cy, R, (360 / n) * i));
      const arc = (j, t) => { // clockwise arrow from step j to step j+1
        const sv = P.svg(host, 0, 0), d0 = (360 / n) * j + 17, d1 = (360 / n) * (j + 1) - 17;
        P.ink(P.path(sv, window.CG.arcArrow(cx, cy, R, d0, d1, 18), { color: tone, width: 6 }), sv, t, 0.35, "power2.out");
      };
      let tLast = g.t0;
      s.steps.forEach((raw, i) => {
        const st = typeof raw === "string" ? { text: raw } : raw, p = pts[i], t = g.at(st.at, g.seq(i, n));
        if (i > 0) arc(i - 1, t - 0.35);
        const dot = P.svg(host, 0, 0);
        const dp = P.path(dot, ellipse(p[0], p[1], 15, 15, g.seed + i, { wob: 0.01 }), { color: tone, width: 8 });
        const t1 = P.ink(dp, dot, t, 0.3, "power2.out");
        const dx = p[0] - cx, dy = p[1] - cy, k = 1 + 46 / Math.hypot(dx, dy);
        const lx = cx + dx * k, ly = cy + dy * k, side = Math.abs(dx) < 10 ? "c" : dx > 0 ? "l" : "r";
        const left = side === "c" ? lx - LBL_W / 2 : side === "l" ? lx - 10 : lx - LBL_W + 10;
        const sp = P.text(host, st.text, { x: left, y: ly - 20, w: LBL_W, align: side, size: 30 });
        tLast = P.write(sp, t1 + 0.05) + 0.4;
      });
      if (s.closed !== false) arc(n - 1, tLast);
      if (s.center) {
        const sp = P.text(host, s.center.text, { x: cx - 100, y: cy - 22, w: 200, size: Math.min(38, Math.floor(300 / Math.max(1, s.center.text.length))), cls: "b" });
        P.write(sp, g.at(s.center.at, g.t0 + 0.2));
      }
    },
  };

  /** cards: a grid of hand-drawn boxes, each with an icon and a label */
  const CW_ = 262, CH = 84, CG_ = 16;
  const cards = {
    h: (s) => Math.ceil(s.items.length / 2) * (CH + CG_) - CG_,
    build(P, host, s, g) {
      s.items.forEach((raw, i) => {
        const it = typeof raw === "string" ? { text: raw } : raw;
        const x = (i % 2) * (CW_ + 36), y = Math.floor(i / 2) * (CH + CG_);
        const t = g.at(it.at, g.seq(i, s.items.length));
        const sv = P.svg(host, 0, 0);
        const p = P.path(sv, rect(x, y, CW_, CH, g.seed + i * 5), { color: col(it.tone || g.tone), width: 6 });
        const t1 = P.ink(p, sv, t, 0.55, "power2.inOut");
        let tx = x + 10;
        if (it.icon) {
          const ic = P.icon(host, it.icon, { x: x + 16, y: y + 22, size: 40, color: col(it.tone || g.tone) });
          P.drawIcon(ic, t1);
          tx = x + 62;
        }
        const sp = P.text(host, it.text, { x: tx, y: y + 26, w: CW_ - (tx - x) - 6, align: "l", size: 32 });
        P.write(sp, t1 + 0.05);
      });
    },
  };

  /** icon: one big line icon with a caption */
  const iconPart = {
    h: (s) => (s.size || 150) + 46,
    build(P, host, s, g) {
      const size = s.size || 150, color = col(s.tone || g.tone);
      const ic = P.icon(host, s.icon, { x: GW / 2 - size / 2, y: 0, size, color, sw: 1.6 });
      const t = g.at(s.at, g.t0);
      P.drawIcon(ic, t, 0.9);
      if (s.caption) {
        const cap = P.text(host, s.caption, { y: size + 4, size: 34 });
        P.write(cap, t + 0.5);
      }
    },
  };

  window.CPARTS = { GW, kinds: { sub, note, list, chips, tree, loop, cards, icon: iconPart } };
})();
