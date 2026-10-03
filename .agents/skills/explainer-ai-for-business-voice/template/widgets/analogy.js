// Widget "analogy": explain a new idea with an everyday comparison — "AI agent ≈ a hard-working intern" — plus 2–3 points.
// script.json: { kind: "analogy", heading?: "Nói cho dễ hiểu" (optional; do not repeat the scene title), left: "AI agent", right: "Thực tập sinh chăm chỉ",
//   points: [{ text: "Làm đúng việc được dặn", ok: true }, { text: "Không tự quyết việc lớn", ok: false }] }
// left ≤ 14 chars, right ≤ 24 chars, points 2–3 (≤ 34 chars; ok:false shows a cross). No prop.
(function () {
  const { tl, h, fadeUp, pop, css, register } = window.ExplainerKit;
  css(`
    .an-head { font-size: 28px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
    .an-eq { margin-top: 20px; display: flex; align-items: center; gap: 22px; }
    .an-chip { box-sizing: border-box; padding: 16px 26px; border: 4px solid var(--ink); border-radius: 14px; font-family: var(--font-display); font-size: 44px; line-height: 1.1; }
    .an-chip.left { background: var(--accent); color: var(--on-accent); border-color: var(--accent); flex: none; }
    .an-chip.right { background: var(--surface-2); flex: 1; min-width: 0; }
    .an-sign { font-family: var(--font-display); font-size: 64px; color: var(--accent); flex: none; }
    .an-points { margin-top: 34px; display: flex; flex-direction: column; gap: 20px; }
    .an-pt { display: flex; align-items: center; gap: 18px; font-size: 34px; line-height: 1.25; }
    .an-mark { flex: none; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: 32px; font-weight: 700; color: var(--on-accent); background: var(--ok); }
    .an-pt.no .an-mark { background: var(--bad); }
  `);
  register("analogy", (card, sc, at) => {
    const w = sc.widget;
    if (w.heading) fadeUp(h("div", "an-head", card, w.heading), at(0.8), 0.35, 8);
    const eq = h("div", "an-eq", card);
    const l = h("div", "an-chip left", eq, w.left);
    const sign = h("div", "an-sign", eq, "≈");
    const r = h("div", "an-chip right", eq, w.right);
    pop(l, at(1.1));
    tl.fromTo(sign, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, at(1.6));
    tl.fromTo(r, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }, at(1.9));
    const pts = h("div", "an-points", card);
    (w.points || []).forEach((p, k) => {
      const ok = p.ok !== false;
      const row = h("div", `an-pt${ok ? "" : " no"}`, pts);
      const mark = h("div", "an-mark", row, ok ? "✓" : "✕");
      h("span", "", row, p.text);
      fadeUp(row, at(2.7 + k * 0.6), 0.35, 10);
      pop(mark, at(2.9 + k * 0.6));
    });
  });
})();
