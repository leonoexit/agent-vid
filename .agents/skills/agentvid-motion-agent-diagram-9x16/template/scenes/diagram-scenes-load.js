/* diagram-scenes-load.js: the "one agent carries too much" half of the diagram story.
 *   swarm: the main tile with task chips piling around it and a pressure meter racing up; optional helper tiles
 *          pop in underneath (the answer teased) while the chips fade back.
 *   gauge: the main tile linked to a context-window panel whose rows stack up while a counter + bar climb; past the
 *          alarm value the numbers turn red, warning pills pop, and the oldest rows blur out ("forgotten").
 * Anchors ("at") follow scene-registry.js: a spoken word, "word#2", seconds after the cut, or { word, plus }. */
(function () {
  const { esc, h, itemAt } = window.IK;
  const DG = window.DG;
  const C = { green: "#3f7d3a", gold: "#a8741a", bad: "#b8412f" };
  // hand-placed chip slots around the swarm tile (centre x, y), filled in this order; ≤ 8 chips
  const SLOTS = [[285, 360], [800, 575], [215, 705], [735, 360], [505, 455], [215, 575], [800, 705], [505, 850]];

  MotionKit.registerScene("swarm", (el, s, ctx) => {
    const { kit } = ctx;
    const { tl } = kit;
    const m = DG.mainNode(el, s, ctx);
    const chips = (s.chips || []).slice(0, SLOTS.length).map(DG.item);
    const r = kit.rng(17 + chips.length);
    const chipEls = chips.map((c, i, all) => {
      const [x, y] = SLOTS[i];
      const chip = h("div", "dchip rv", esc(c.text), el);
      Object.assign(chip.style, { left: `${x + (r() - 0.5) * 20}px`, top: `${y + (r() - 0.5) * 16}px` });
      tl.set(chip, { xPercent: -50, yPercent: -50, rotation: (r() - 0.5) * 12 }, 0);
      const t = itemAt(ctx, c, i, all.length);
      kit.pop(chip, t, { from: 0.3, d: 0.4 });
      tl.to(chip, { y: (r() - 0.5) * 22, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: 1 }, t + 0.45);
      return { chip, t };
    });

    if (s.meter) {
      const mt = s.meter;
      const box = h("div", "dmeter rv", `<span class="dm-label">${esc(mt.label || "")}</span>`, el);
      const b = DG.bar(box, "dm-bar", "green");
      const val = h("span", "dm-val", "", box);
      const t0 = ctx.at(mt.at, ctx.start + 0.4);
      const t1 = Math.max(t0 + 1.5, (chipEls.at(-1)?.t ?? t0 + 1.4) + 0.6);
      const from = mt.from ?? 0, to = mt.to ?? 100;
      kit.fadeIn(box, t0 - 0.2, 0.3);
      kit.odo(val, t0, to, { from, suffix: mt.unit ?? "%", d: t1 - t0, ease: "power1.in" });
      tl.fromTo(b.fill, { scaleX: from / 100, backgroundColor: C.green },
        { scaleX: to / 100, backgroundColor: to >= 80 ? C.bad : C.gold, duration: t1 - t0, ease: "power1.in", immediateRender: false }, t0);
      if (to >= 80) tl.to(val, { color: C.bad, duration: 0.2 }, t1 - 0.3);
    }

    // the answer teased: helper tiles under the main one, chips step back
    (s.helpers || []).slice(0, 3).forEach((hp, i, all) => {
      const x = m.x + (i - (all.length - 1) / 2) * 270, y = 1010, sz = 110;
      const tone = DG.toneOf(hp.tone, i);
      const t = ctx.at(hp.at, ctx.seq(i + 1, all.length + 1));
      DG.link(el, { x: m.x, y: m.y + m.s / 2 + 58 }, { x, y: y - sz / 2 - 8 }, t - 0.3, kit, { tone });
      kit.pop(DG.node(el, { x, y, s: sz, tone, icon: hp.icon || "braces", label: hp.label }), t, { from: 0.3 });
      if (i === 0) chipEls.forEach(({ chip }) => tl.to(chip, { opacity: 0.22, duration: 0.4 }, t - 0.3));
    });
  });

  MotionKit.registerScene("gauge", (el, s, ctx) => {
    const { kit } = ctx;
    const { tl } = kit;
    const m = DG.mainNode(el, s, ctx);
    const p = s.panel || {};
    const rows = (p.rows || []).slice(0, 12);
    const panel = h("div", "dpanel dg-panel rv", `<div class="dp-title">${MotionKit.richText(p.title || "")}</div>`, el);
    const list = h("div", "dp-rows", null, panel);
    const tp = ctx.at(p.at, ctx.start + 0.35);
    DG.link(el, { x: m.x + m.s / 2 + 10, y: m.y }, { x: 436, y: m.y }, tp - 0.1, kit);
    kit.rise(panel, tp, { y: 24 });
    const times = rows.map((row, i) => Math.max(tp + 0.3, itemAt(ctx, row, i, rows.length)));
    const rowEls = rows.map((row, i) => {
      const el2 = h("div", "drow rv", `${row.tool ? DG.toolTag(row.tool) : ""}<span class="dr-text">${esc(row.text)}</span>${row.cost ? `<span class="dr-cost">${esc(row.cost)}</span>` : ""}`, list);
      kit.slideX(el2, times[i], { x: 30, d: 0.3 });
      return el2;
    });

    // counter + bar climbing with the rows; red past the alarm value
    const c = s.counter || {};
    const cb = h("div", "dcount dg-count rv", `<div class="dc-num">0</div><div class="dc-sub">${esc(c.sub || "")}</div>`, el);
    const b = DG.bar(cb, "dc-bar", "green");
    const num = cb.querySelector(".dc-num");
    const t0 = times[0] ?? ctx.start + 0.6;
    const t1 = Math.max(t0 + 1, (times.at(-1) ?? t0 + 2) + 0.3);
    const from = c.from ?? 0, to = c.to ?? 100, max = c.max ?? to;
    kit.fadeIn(cb, t0 - 0.3, 0.3);
    kit.odo(num, t0, to, { from, suffix: c.suffix || "", d: t1 - t0, ease: "none" });
    tl.fromTo(b.fill, { scaleX: from / max }, { scaleX: to / max, duration: t1 - t0, ease: "none", immediateRender: false }, t0);
    const alarm = c.alarm ?? max * 0.85;
    if (to >= alarm && to > from) {
      const ta = t0 + (t1 - t0) * Math.max(0, (alarm - from) / (to - from));
      tl.to(b.fill, { backgroundColor: C.bad, duration: 0.3 }, ta);
      tl.to(num, { color: C.bad, duration: 0.3 }, ta);
      tl.to(panel, { borderColor: C.bad, duration: 0.3 }, ta);
    }

    const wb = h("div", "dwarns", null, el);
    (s.warnings || []).slice(0, 3).map(DG.item).forEach((w, i) => kit.pop(h("div", "dwarn rv", esc(w.text), wb), ctx.at(w.at, t1 + 0.3 + i * 0.5), { from: 0.4 }));

    if (s.forget) {
      const tf = ctx.at(s.forget.at, t1 + 1.2);
      // forgotten rows: file text greys out and blurs (still ≥ 3:1 contrast); tool tags stay as they are
      const faded = rowEls.slice(0, s.forget.rows ?? 3).flatMap((r) => [...r.querySelectorAll(".dr-text, .dr-cost")]);
      tl.to(faded, { color: "#85745b", filter: "blur(2px)", duration: 0.6, stagger: 0.06 }, tf);
    }
  });
})();
