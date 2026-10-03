// Widget "fan-out": one AI agent splits a job between 2–3 helper agents that work at the same time, then a race:
// doing it one by one vs in parallel. Good for "how the agent works" or "time saved".
// script.json: { kind: "fan-out", agent?: "AI", helpers: [{ label: "Đọc đơn" }, ...] (2–3, ≤ 12 chars),
//   serial: { label: "Lần lượt", value: "3 giờ" }, parallel: { label: "Song song", value: "40 phút", ratio?: 0.25 } }
// labels ≤ 14 chars, values ≤ 10 chars; ratio = parallel bar length (0–1). No prop.
(function () {
  const { tl, h, fadeUp, pop, css, register } = window.ExplainerKit;
  const TONES = ["var(--ok)", "var(--accent)", "var(--muted)"];
  css(`
    .fo-dot { position: absolute; display: flex; align-items: center; justify-content: center; border: 5px solid var(--ink); border-radius: 50%;
      background: var(--surface-2); font-family: var(--font-display); font-weight: 700; }
    .fo-main { left: 405px; top: 18px; width: 110px; height: 110px; font-size: 40px; color: var(--accent); border-color: var(--accent); }
    .fo-help { top: 190px; width: 92px; height: 92px; font-size: 30px; }
    .fo-lines { position: absolute; left: 0; top: 0; width: 920px; height: 200px; overflow: visible; }
    .fo-label { position: absolute; top: 292px; width: 240px; text-align: center; font-family: var(--font-display); font-size: 32px; line-height: 1.1; }
    .fo-bar { position: absolute; top: 340px; width: 180px; height: 16px; border: 3px solid var(--ink); border-radius: 10px; overflow: hidden; background: var(--surface-2); }
    .fo-bar i { position: absolute; inset: 0; transform-origin: 0 50%; }
    .fo-race { position: absolute; left: 34px; right: 34px; top: 392px; display: flex; flex-direction: column; gap: 14px; }
    .fo-row { display: grid; grid-template-columns: 210px 1fr 150px; gap: 16px; align-items: center; font-size: 28px; font-weight: 600; }
    .fo-track { position: relative; height: 30px; border: 3px solid var(--ink); border-radius: 16px; background: var(--surface-2); overflow: hidden; }
    .fo-track i { position: absolute; left: 0; top: 0; bottom: 0; transform-origin: 0 50%; display: flex; }
    .fo-track i b { flex: 1; }
    .fo-val { font-family: var(--font-display); font-size: 36px; text-align: right; }
    .fo-row.par .fo-val { color: var(--ok); }
  `);
  register("fan-out", (card, sc, at) => {
    const w = sc.widget;
    const helpers = (w.helpers || []).slice(0, 3);
    const main = h("div", "fo-dot fo-main", card, w.agent || "AI");
    pop(main, at(0.8));
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "fo-lines");
    card.appendChild(svg);
    helpers.forEach((hp, k) => {
      const cx = 460 + (k - (helpers.length - 1) / 2) * 290;
      const t = at(1.4 + k * 0.5);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
      line.setAttribute("d", `M460,132 L${cx},186`);
      line.setAttribute("style", `fill:none;stroke:${TONES[k]};stroke-width:5;stroke-dasharray:12 10`);
      svg.appendChild(line);
      tl.fromTo(line, { opacity: 0 }, { opacity: 1, duration: 0.3 }, t - 0.2);
      const dot = h("div", "fo-dot fo-help", card, "AI");
      Object.assign(dot.style, { left: `${cx - 46}px`, color: TONES[k], borderColor: TONES[k] });
      pop(dot, t);
      const label = h("div", "fo-label", card, hp.label);
      label.style.left = `${cx - 120}px`;
      fadeUp(label, t + 0.15, 0.3, 8);
      const bar = h("div", "fo-bar", card);
      bar.style.left = `${cx - 90}px`;
      const fill = h("i", "", bar);
      fill.style.background = TONES[k];
      tl.fromTo(bar, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t + 0.3);
      tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power1.inOut" }, at(3.0));
    });
    // race: the same job one by one (long bar) vs split between the helpers (short multi-colour bar)
    const race = h("div", "fo-race", card);
    const row = (d = {}, cls) => {
      const r = h("div", `fo-row ${cls}`, race);
      h("div", "", r, d.label || "");
      const fill = h("i", "", h("div", "fo-track", r));
      const val = h("div", "fo-val", r, d.value || "");
      return { r, fill, val };
    };
    const ser = row(w.serial, "ser");
    ser.fill.style.cssText = "width: 100%; background: var(--muted);";
    const par = row(w.parallel, "par");
    par.fill.style.width = `${Math.round((w.parallel?.ratio ?? 0.25) * 100)}%`;
    par.fill.innerHTML = helpers.map((_, k) => `<b style="background:${TONES[k]}"></b>`).join("");
    const tr = at(4.4);
    fadeUp(race, tr - 0.3, 0.35, 10);
    tl.fromTo(ser.fill, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "none" }, tr);
    tl.fromTo(par.fill, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.out" }, tr + 0.2);
    pop(par.val, tr + 0.7);
    pop(ser.val, tr + 1.4);
  });
})();
