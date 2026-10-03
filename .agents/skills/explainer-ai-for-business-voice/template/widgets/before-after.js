// Widget "before-after": two columns — the process done by hand vs done by an AI agent — steps then a total.
// script.json: { kind: "before-after",
//   left:  { title: "Làm tay", items: ["Đọc từng tin", "Chép vào sổ", "Báo giá"], total: "3 giờ" },
//   right: { title: "Có AI agent", items: ["Agent đọc và trả lời", "Người duyệt đơn"], total: "20 phút" } }
// Items 2–4 per side (≤ 22 chars), total ≤ 10 chars. No prop (both columns use the full card).
(function () {
  const { tl, h, fadeUp, pop, css, register } = window.ExplainerKit;
  css(`
    .ba-wrap { position: absolute; inset: 26px 30px; display: flex; gap: 70px; }
    .ba-col { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .ba-title { font-family: var(--font-display); font-size: 40px; padding-bottom: 8px; border-bottom: 4px solid var(--ink); }
    .ba-col.right .ba-title { color: var(--ok); border-color: var(--ok); }
    .ba-list { margin-top: 18px; display: flex; flex-direction: column; gap: 14px; }
    .ba-item { font-size: 29px; line-height: 1.2; padding: 10px 14px; border: 3px solid var(--ink); border-radius: 8px; background: var(--surface-2); }
    .ba-col.left .ba-item { color: var(--muted); border-style: dashed; }
    .ba-col.right .ba-item { border-color: var(--ok); }
    .ba-total { margin-top: auto; font-family: var(--font-display); font-size: 64px; line-height: 1; color: var(--bad); }
    .ba-col.right .ba-total { color: var(--ok); }
    .ba-arrow { position: absolute; left: 50%; top: 50%; width: 64px; height: 64px; margin: -32px 0 0 -32px; border-radius: 50%; background: var(--accent);
      color: var(--on-accent); display: flex; align-items: center; justify-content: center; font-size: 40px; font-weight: 700; }
  `);
  register("before-after", (card, sc, at) => {
    const w = sc.widget;
    const wrap = h("div", "ba-wrap", card);
    const side = (d, cls, t0) => {
      const col = h("div", `ba-col ${cls}`, wrap);
      fadeUp(h("div", "ba-title", col, d.title), at(t0), 0.35, 8);
      const list = h("div", "ba-list", col);
      d.items.forEach((txt, k) => fadeUp(h("div", "ba-item", list, txt), at(t0 + 0.3 + k * 0.3), 0.3, 10));
      if (d.total) pop(h("div", "ba-total", col, d.total), at(t0 + 0.4 + d.items.length * 0.3));
    };
    side(w.left, "left", 0.8);
    const arrow = h("div", "ba-arrow", card, "→");
    tl.fromTo(arrow, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.4, ease: "back.out(2)" }, at(1.9));
    side(w.right, "right", 2.2);
  });
})();
