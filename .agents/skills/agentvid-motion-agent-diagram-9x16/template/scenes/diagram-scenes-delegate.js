/* diagram-scenes-delegate.js: the "split the work" half of the diagram story.
 *   handoff: main tile left, helper tile right; a task ticket flies over, the helper's own context panel fills
 *            (cells + counter + tool tags) while the main agent's own gauge stays low; a tick when it is done.
 *   fan-out: one main tile fans out to 2–4 helpers with progress bars; optional race: one-by-one vs in parallel.
 *   split:   a stamp ("don't split blindly") over two cards: what to hand off vs what the main agent keeps.
 *   recap:   the main tile with helpers orbiting, a small calm gauge and one big line underlined in pencil. */
(function () {
  const { esc, h, stroke, UNDERLINE, itemAt } = window.IK;
  const DG = window.DG;

  /** vertical gauge "main context NN%" (handoff) */
  function vGauge(el, g, t, kit) {
    const box = h("div", "dvgauge rv", `<div class="dv-label">${esc(g.label || "")}</div><div class="dv-track"><div class="dv-fill"></div></div><div class="dv-val">0%</div>`, el);
    kit.fadeIn(box, t, 0.4);
    kit.tl.fromTo(box.querySelector(".dv-fill"), { scaleY: 0 }, { scaleY: (g.value ?? 15) / 100, duration: 0.8, ease: "power2.out", immediateRender: false }, t + 0.2);
    kit.odo(box.querySelector(".dv-val"), t + 0.2, g.value ?? 15, { suffix: "%", d: 0.8 });
  }

  MotionKit.registerScene("handoff", (el, s, ctx) => {
    const { kit } = ctx;
    const { tl } = kit;
    const m = DG.mainNode(el, s, ctx);
    const hp = s.helper || {};
    const tone = hp.tone || "green";
    const hx = 810, hy = m.y, hs = 150;
    const th = ctx.at(hp.at, ctx.start + 0.5);
    const tile = DG.node(el, { x: hx, y: hy, s: hs, tone, icon: hp.icon || "braces", label: hp.label ?? "Sub agent" });
    DG.link(el, { x: m.x + m.s / 2 + 10, y: m.y }, { x: hx - hs / 2 - 10, y: hy }, th - 0.25, kit, { tone });
    kit.pop(tile, th, { from: 0.3 });
    if (s.mainGauge) vGauge(el, s.mainGauge, ctx.start + 0.3, kit);

    if (s.ticket) {
      const tk = h("div", "dticket rv", `<b>${esc(s.ticket.label || "Task")}</b><span>${esc(s.ticket.text)}</span>`, el);
      const tt = ctx.at(s.ticket.at, th + 0.5);
      kit.pop(tk, tt, { from: 0.6 });
      tl.to(tk, { x: 300, y: -170, scale: 0.3, autoAlpha: 0, duration: 0.6, ease: "power2.in" }, tt + 1.8);
    }

    const p = s.panel || {};
    const tp = ctx.at(p.at, th + 1.2);
    const tEnd = Math.min(ctx.end - 0.8, tp + (p.fill ?? 3));
    const panel = h("div", `dpanel dh-panel tone-${tone} rv`, `<div class="dp-title">${MotionKit.richText(p.title || "")}</div>`, el);
    kit.rise(panel, tp, { y: 24 });
    const grid = h("div", "dgrid", null, panel);
    const items = (p.items || []).slice(0, 20);
    items.forEach((it, i) => kit.fadeIn(h("div", "dcell rv", esc(it), grid), tp + 0.4 + ((tEnd - tp - 0.4) * i) / Math.max(1, items.length), 0.15));
    if (s.tools?.length) kit.fadeIn(h("div", "dh-tools rv", s.tools.map(DG.toolTag).join(""), el), tp + 0.3, 0.3);
    if (s.counter) {
      const cb = h("div", "dcount dh-count rv", `<div class="dc-num">0</div><div class="dc-sub">${esc(s.counter.label || "")}</div>`, el);
      kit.fadeIn(cb, tp, 0.3);
      kit.odo(cb.querySelector(".dc-num"), tp + 0.4, s.counter.to ?? items.length, { d: Math.max(0.6, tEnd - tp - 0.4), ease: "none" });
    }
    if (s.done) DG.doneBadge(tile, typeof s.done === "object" ? ctx.at(s.done.at, tEnd + 0.2) : tEnd + 0.2, kit);
  });

  MotionKit.registerScene("fan-out", (el, s, ctx) => {
    const { kit } = ctx;
    const { tl } = kit;
    const m = DG.mainNode(el, s, ctx);
    const hs = (s.helpers || []).slice(0, 4);
    const n = hs.length;
    hs.forEach((hp, i) => {
      const x = 110 + (790 * (i + 0.5)) / n, y = 780, sz = 130, tone = DG.toneOf(hp.tone, i);
      const t = itemAt(ctx, hp, i, n);
      DG.link(el, { x: m.x, y: m.y + m.s / 2 + 66 }, { x, y: y - sz / 2 - 8 }, t - 0.35, kit, { tone });
      const tile = DG.node(el, { x, y, s: sz, tone, icon: hp.icon || "braces", label: hp.label });
      kit.pop(tile, t, { from: 0.3 });
      if (hp.progress === false) return;
      const b = DG.bar(el, "df-bar rv", tone);
      b.el.style.left = `${x - 100}px`;
      const d = Math.max(1, (ctx.end - t) * 0.5);
      kit.fadeIn(b.el, t + 0.2, 0.2);
      DG.fillTo(kit, b.fill, t + 0.3, 1, d, "power1.inOut");
      DG.doneBadge(tile, t + 0.3 + d, kit);
    });

    if (!s.race) return;
    const r = s.race;
    const tr = ctx.at(r.at, ctx.start + (ctx.end - ctx.start) * 0.45);
    const box = h("div", "drace rv", null, el);
    kit.rise(box, tr - 0.2, { y: 20 });
    const row = (d = {}, inner) => {
      const el2 = h("div", "dr-row", `<div class="dr-head"><span>${esc(d.label || "")}</span><b class="rv">${esc(d.value || "")}</b></div><div class="dbar dr-bar">${inner}</div>`, box);
      return { fill: el2.querySelector(".dbar-fill"), val: el2.querySelector("b") };
    };
    const ser = row(r.serial, `<div class="dbar-fill dr-serial"></div>`);
    const segs = hs.map((hp, i) => `<i style="background: var(--t-${DG.toneOf(hp.tone, i)})"></i>`).join("");
    const par = row(r.parallel, `<div class="dbar-fill dr-par" style="width: ${Math.round((r.parallel?.ratio ?? 0.25) * 100)}%">${segs}</div>`);
    tl.fromTo(ser.fill, { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "none", immediateRender: false }, tr);
    kit.pop(ser.val, tr + 1.5, { from: 0.5 });
    tl.fromTo(par.fill, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power2.out", immediateRender: false }, tr + 0.3);
    kit.pop(par.val, tr + 0.9, { from: 0.5 });
  });

  MotionKit.registerScene("split", (el, s, ctx) => {
    const { kit } = ctx;
    if (s.stamp) {
      const stamp = DG.item(s.stamp);
      const st = h("div", "dstamp rv", esc(stamp.text), el);
      const t = ctx.at(stamp.at, ctx.start + 0.3);
      kit.tl.set(st, { xPercent: -50, rotation: -5 }, 0);
      kit.tl.fromTo(st, { autoAlpha: 0, scale: 1.8 }, { autoAlpha: 1, scale: 1, duration: 0.28, ease: "power4.in", immediateRender: false }, t);
      kit.shake(t + 0.28, 0.5);
    }
    ["left", "right"].forEach((side, k) => {
      const c = s[side];
      if (!c) return;
      const tone = c.tone || (k ? "main" : "green");
      const card = h("div", `dsplit dsplit-${side} tone-${tone} rv`,
        `<div class="ds-head"><div class="ds-icon">${DG.icon(c.icon || (k ? "spark" : "braces"))}</div><div class="ds-title">${MotionKit.richText(c.title || "")}</div></div><div class="ds-sub">${esc(c.sub || "")}</div>`, el);
      const t = ctx.at(c.at, k ? ctx.seq(1, 2) : ctx.start + 0.8);
      kit.rise(card, t, { y: 30 });
      (c.items || []).slice(0, 4).map(DG.item).forEach((it, i) => kit.slideX(h("div", "ds-item rv", esc(it.text), card), ctx.at(it.at, t + 0.5 + i * 0.45), { x: -24, d: 0.3 }));
    });
  });

  MotionKit.registerScene("recap", (el, s, ctx) => {
    const { kit } = ctx;
    const { tl } = kit;
    const m = DG.mainNode(el, s, ctx);
    const helpers = s.helpers || [{}, {}, {}];
    const orbit = h("div", "dorbit", null, el);
    Object.assign(orbit.style, { left: `${m.x - 260}px`, top: `${m.y - 260}px` });
    const minis = helpers.slice(0, 4).map((hp, i, all) => {
      const a = (-150 + (i * 360) / all.length) * (Math.PI / 180);
      const mini = DG.node(orbit, { x: 260 + 250 * Math.cos(a), y: 260 + 250 * Math.sin(a), s: 84, tone: DG.toneOf(hp.tone, i), icon: hp.icon || "braces" });
      kit.pop(mini, ctx.start + 0.4 + i * 0.15, { from: 0.3 });
      return mini;
    });
    const span = ctx.end - ctx.start;
    tl.fromTo(orbit, { rotation: 0 }, { rotation: 40, duration: span, ease: "none", immediateRender: false }, ctx.start);
    tl.fromTo(minis, { rotation: 0 }, { rotation: -40, duration: span, ease: "none", immediateRender: false }, ctx.start);

    if (s.gauge) {
      const g = h("div", "drgauge rv", `<span>${esc(s.gauge.label || "")}</span>`, el);
      const b = DG.bar(g, "", "green");
      h("b", "", `${s.gauge.value ?? 12}%`, g);
      kit.fadeIn(g, ctx.start + 0.8, 0.4);
      DG.fillTo(kit, b.fill, ctx.start + 1, (s.gauge.value ?? 12) / 100, 0.8);
    }
    if (s.text) {
      const tx = h("div", "drtext rv", `<span>${MotionKit.richText(s.text)}</span><div class="drt-line">${stroke(UNDERLINE, { w: 7 })}</div>`, el);
      const t = ctx.at(s.at, ctx.start + 1.2);
      kit.rise(tx, t, { y: 30, d: 0.6 });
      kit.draw(tx.querySelector("path"), t + 0.5, 0.6);
    }
  });
})();
