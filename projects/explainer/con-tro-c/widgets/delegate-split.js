// Widget "delegate-split": what to hand to the AI vs what a person keeps, under a rubber stamp that slams in
// ("Giao có chọn lọc"). Good for "where to start" or the limits of automation.
// script.json: { kind: "delegate-split", stamp: "Giao có chọn lọc" (≤ 20),
//   left: { title: "Giao cho AI", items: ["Trả lời câu hỏi lặp lại", ...] }, right: { title: "Người tự làm", items: [...] } }
// title ≤ 16 chars, items 2–3 per side (≤ 22 chars). No prop.
(function () {
  const { tl, h, fadeUp, css, register } = window.ExplainerKit;
  css(`
    .ds-stamp { position: absolute; left: 50%; top: 14px; padding: 6px 22px; border: 5px solid var(--bad); border-radius: 12px; color: var(--bad);
      background: var(--surface-3); font-family: var(--font-display); font-size: 44px; line-height: 1.1; white-space: nowrap; }
    .ds-wrap { position: absolute; left: 30px; right: 30px; top: 106px; bottom: 26px; display: flex; gap: 36px; }
    .ds-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 14px; padding: 18px 20px; border: 4px solid var(--ok); border-radius: 14px; background: var(--surface-2); }
    .ds-col.keep { border-color: var(--accent); }
    .ds-title { font-family: var(--font-display); font-size: 40px; line-height: 1.1; color: var(--ok); padding-bottom: 8px; border-bottom: 3px dashed var(--ok); }
    .ds-col.keep .ds-title { color: var(--accent); border-color: var(--accent); }
    .ds-item { font-size: 29px; line-height: 1.2; padding: 10px 14px; border: 3px solid var(--ink); border-radius: 8px; background: var(--surface-3); }
  `);
  register("delegate-split", (card, sc, at) => {
    const w = sc.widget;
    const wrap = h("div", "ds-wrap", card);
    const side = (d = {}, cls, t0) => {
      const col = h("div", `ds-col ${cls}`, wrap);
      fadeUp(col, at(t0), 0.4, 14);
      h("div", "ds-title", col, d.title || "");
      (d.items || []).slice(0, 3).forEach((txt, k) => fadeUp(h("div", "ds-item", col, txt), at(t0 + 0.35 + k * 0.35), 0.3, 10));
    };
    side(w.left, "give", 1.4);
    side(w.right, "keep", 2.9);
    if (w.stamp) {
      const st = h("div", "ds-stamp", card, w.stamp);
      tl.set(st, { xPercent: -50, rotation: -4 }, 0);
      tl.fromTo(st, { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: 0.25, ease: "power4.in" }, at(0.8));
    }
  });
})();
