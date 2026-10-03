// Widget "load-meter": the workload piling up on one person (or one AI) — task slips stack up from the bottom of the
// card while a pressure gauge on the right climbs and turns red. Good for "a day eaten by manual work".
// script.json: { kind: "load-meter", heading?: "...", items: ["Trả lời inbox", "Nhập hoá đơn", ...] (3–6, ≤ 20 chars),
//   meter: { label: "Áp lực", from: 30, to: 95 } }   (percent; ≥ 80 ends red). No prop.
(function () {
  const { tl, h, fadeUp, pop, css, register } = window.ExplainerKit;
  css(`
    .lm-head { width: 520px; font-size: 30px; font-weight: 600; line-height: 1.3; color: var(--ink); }
    .lm-pile { position: absolute; left: 34px; width: 500px; bottom: 30px; display: flex; flex-direction: column-reverse; gap: 10px; }
    .lm-slip { align-self: flex-start; padding: 10px 18px; border: 3px solid var(--ink); border-radius: 8px; background: var(--surface-2);
      font-size: 29px; line-height: 1.15; white-space: nowrap; box-shadow: 4px 4px 0 var(--shadow); }
    .lm-side { position: absolute; left: 600px; right: 30px; top: 30px; bottom: 30px; display: flex; flex-direction: column; align-items: center; }
    .lm-label { font-size: 28px; font-weight: 600; color: var(--muted); }
    .lm-num { font-family: var(--font-display); font-size: 96px; line-height: 1.05; color: var(--ok); }
    .lm-track { position: relative; flex: 1; width: 86px; margin-top: 12px; border: 4px solid var(--ink); border-radius: 18px; background: var(--surface-2); overflow: hidden; }
    .lm-fill { position: absolute; left: 0; right: 0; bottom: 0; height: 100%; transform-origin: 50% 100%; transform: scaleY(0); background: var(--ok); }
  `);
  const cssVar = (name, fallback) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  register("load-meter", (card, sc, at) => {
    const w = sc.widget;
    const m = w.meter || {};
    const from = m.from ?? 30, to = m.to ?? 95;
    if (w.heading) fadeUp(h("div", "lm-head", card, w.heading), at(0.8), 0.35, 8);
    const pile = h("div", "lm-pile", card);
    const items = (w.items || []).slice(0, 6);
    items.forEach((txt, k) => {
      const slip = h("div", "lm-slip", pile, txt);
      slip.style.marginLeft = `${[0, 60, 20, 90, 40, 110][k]}px`; // a messy stack, not a list
      tl.set(slip, { rotation: k % 2 ? 1.8 : -1.6 }, 0);
      tl.fromTo(slip, { opacity: 0, y: -90 }, { opacity: 1, y: 0, duration: 0.4, ease: "bounce.out" }, at(1.0 + k * 0.55));
    });
    const side = h("div", "lm-side", card);
    h("div", "lm-label", side, m.label || "");
    const num = h("div", "lm-num", side);
    const fill = h("div", "lm-fill", h("div", "lm-track", side));
    fadeUp(side, at(0.9), 0.4, 12);
    // gauge and number climb while the slips land (proxy tween: text is a pure function of time)
    const t0 = at(1.0), dur = Math.max(1.2, at(1.0 + items.length * 0.55) - t0);
    const bad = cssVar("--bad", "#b8412f"), ok = cssVar("--ok", "#3f7d3a"), mid = cssVar("--hl", "#f3c56a");
    const end = to >= 80 ? bad : mid;
    const p = { v: from };
    num.textContent = `${from}%`;
    tl.to(p, { v: to, duration: dur, ease: "power1.in", onUpdate: () => { num.textContent = `${Math.round(p.v)}%`; } }, t0);
    tl.fromTo(fill, { scaleY: from / 100, backgroundColor: ok }, { scaleY: to / 100, backgroundColor: end, duration: dur, ease: "power1.in" }, t0);
    tl.fromTo(num, { color: ok }, { color: end, duration: dur, ease: "power1.in" }, t0);
    if (to >= 80) pop(num, t0 + dur);
  });
})();
