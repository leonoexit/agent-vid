// Widget "stat": 1–2 big numbers that count up, each with a unit and a caption (fines, deadlines, money, hours).
// script.json: { kind: "stat", heading?: "...", items: [{ value: 3, to?: 5, prefix?: "", suffix: " tỷ đồng", label: "phạt tối đa", decimals?: 0 }] }
// `to` turns the number into a range ("2–3 triệu"); both ends count up together.
// Count-up is a proxy tween (the digits are a pure function of time, so seeking and rendering stay exact).
(function () {
  const { tl, h, fadeUp, css, register, num: fmt } = window.ExplainerKit;
  css(`
    .stat-head { width: 560px; font-size: 30px; font-weight: 600; line-height: 1.3; color: var(--ink); }
    .stat-row { position: absolute; left: 34px; right: 34px; bottom: 34px; display: flex; gap: 26px; }
    .stat-box { flex: 1; min-width: 0; box-sizing: border-box; padding: 20px 26px; border: 3px solid var(--ink); border-radius: 8px; background: var(--surface-2); }
    .stat-num { font-family: var(--font-display); font-weight: 700; font-size: 112px; line-height: 1; color: var(--accent); white-space: nowrap; }
    .stat-row.two .stat-num { font-size: 100px; }
    .stat-unit { font-size: 0.42em; font-weight: 700; margin-left: 6px; }
    .stat-label { margin-top: 12px; font-size: 28px; line-height: 1.25; color: var(--ink); }
  `);
  register("stat", (card, sc, at) => {
    const w = sc.widget;
    if (w.heading) fadeUp(h("div", "stat-head", card, w.heading), at(0.8), 0.35, 8);
    const row = h("div", `stat-row${w.items.length > 1 ? " two" : ""}`, card);
    w.items.forEach((it, k) => {
      const box = h("div", "stat-box", row);
      const num = h("div", "stat-num", box);
      const digits = h("span", "", num);
      h("span", "stat-unit", num, it.suffix || "");
      h("div", "stat-label", box, it.label || "");
      const d = it.decimals || 0;
      const t = at(1.4 + k * 1.6);
      fadeUp(box, t, 0.4, 16);
      // Show the two real states directly; counting from zero would imply extra assignments.
      digits.textContent = (it.prefix || "") + fmt(it.value, d);
      tl.fromTo(digits, { opacity:0, scale:0.9 }, { opacity:1, scale:1, duration:0.5, ease:"back.out(1.4)" }, t+0.2);
    });
  });
})();
