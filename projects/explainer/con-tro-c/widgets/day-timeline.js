// Widget "day-timeline": one working day as a bar of hours; the blocks eaten by manual work fill in one by one.
// script.json: { kind: "day-timeline", heading?: "...", start: 8, end: 17,
//   blocks: [{ from: 8, to: 9.5, label: "Trả lời inbox" }] (1–4, label ≤ 16 chars), summary?: "Mất 3 giờ mỗi ngày" (≤ 30) }
// Hours are 24h numbers (9.5 = 9:30). No prop (the hour scale uses the full card width).
(function () {
  const { tl, h, fadeUp, css, register } = window.ExplainerKit;
  css(`
    .dt-head { font-size: 30px; font-weight: 600; line-height: 1.3; color: var(--ink); }
    .dt-bar { position: absolute; left: 34px; right: 34px; top: 205px; height: 96px; box-sizing: border-box; border: 4px solid var(--ink); border-radius: 10px; background: var(--surface-2); overflow: hidden; }
    .dt-hour { position: absolute; top: 166px; width: 80px; margin-left: -40px; text-align: center; font-size: 24px; color: var(--muted); }
    .dt-tick { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--shadow); }
    .dt-block { position: absolute; top: 0; bottom: 0; background: repeating-linear-gradient(135deg, var(--bad) 0 10px, color-mix(in srgb, var(--bad) 70%, white) 10px 20px);
      border-left: 3px solid var(--ink); border-right: 3px solid var(--ink); transform-origin: left center; }
    .dt-label { position: absolute; top: 318px; width: 250px; margin-left: -125px; text-align: center; font-size: 26px; line-height: 1.2; font-weight: 600; color: var(--bad); }
    .dt-sum { position: absolute; left: 34px; right: 34px; bottom: 30px; text-align: center; font-family: var(--font-display); font-size: 44px; color: var(--accent); }
  `);
  register("day-timeline", (card, sc, at) => {
    const w = sc.widget;
    const start = w.start != null ? w.start : 8;
    const end = w.end != null ? w.end : 17;
    const W = 834; // inner width of the bar: card 910 inside its border - 2 x 34 margin - 2 x 4 bar border
    const x = (hr) => ((hr - start) / (end - start)) * W;
    if (w.heading) fadeUp(h("div", "dt-head", card, w.heading), at(0.8), 0.35, 8);
    const bar = h("div", "dt-bar", card);
    fadeUp(bar, at(1.0), 0.4, 10);
    const step = end - start > 10 ? 2 : 1;
    for (let hr = start; hr <= end; hr += step) {
      const lab = h("div", "dt-hour", card, `${hr}h`);
      lab.style.left = `${38 + x(hr)}px`;
      fadeUp(lab, at(1.1), 0.3, 6);
      if (hr > start && hr < end) h("div", "dt-tick", bar).style.left = `${x(hr) - 1}px`;
    }
    (w.blocks || []).forEach((b, k) => {
      const blk = h("div", "dt-block", bar);
      blk.style.left = `${x(b.from)}px`;
      blk.style.width = `${x(b.to) - x(b.from)}px`;
      const t = at(1.6 + k * 0.7);
      tl.fromTo(blk, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.out" }, t);
      const lab = h("div", "dt-label", card, b.label);
      lab.style.left = `${38 + Math.min(W - 125, Math.max(125, (x(b.from) + x(b.to)) / 2))}px`;
      if (k % 2) lab.style.top = "390px"; // stagger neighbours so labels never collide
      fadeUp(lab, t + 0.25, 0.3, -8);
    });
    if (w.summary) fadeUp(h("div", "dt-sum", card, w.summary), at(1.9 + (w.blocks || []).length * 0.7), 0.45, 12);
  });
})();
