// Widget "checklist": 2–4 to-dos that appear with an empty box, then get ticked one by one.
// script.json: { kind: "checklist", heading?: "Việc cần làm", items: ["...", "..."] }  (items ≤ ~40 characters)
(function () {
  const { tl, h, fadeUp, css, register } = window.ExplainerKit;
  css(`
    .ck-head { width: 560px; font-size: 30px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--muted); }
    .ck-list { margin-top: 30px; display: flex; flex-direction: column; gap: 26px; }
    .card:has(.prop) .ck-list { margin-top: 140px; }
    .ck-item { display: flex; align-items: center; gap: 22px; font-size: 36px; line-height: 1.25; }
    .ck-box { position: relative; flex: none; width: 50px; height: 50px; box-sizing: border-box; border: 4px solid var(--ink); border-radius: 8px; background: var(--surface-2); }
    .ck-tick { position: absolute; left: 5px; top: -4px; font-size: 42px; line-height: 1; font-weight: 700; color: var(--accent); }
  `);
  register("checklist", (card, sc, at) => {
    const w = sc.widget;
    if (w.heading) fadeUp(h("div", "ck-head", card, w.heading), at(0.8), 0.35, 8);
    const list = h("div", "ck-list", card);
    const n = w.items.length;
    w.items.forEach((txt, k) => {
      const row = h("div", "ck-item", list);
      const box = h("div", "ck-box", row);
      h("span", "", row, txt);
      fadeUp(row, at(1.1 + k * 0.35), 0.3, 10);
      const tick = h("span", "ck-tick", box, "✓");
      tl.fromTo(tick, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.4)" }, at(1.3 + n * 0.35 + k * 0.55));
    });
  });
})();
