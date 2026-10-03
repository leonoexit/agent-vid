/* ink-cards.js: feature card kinds checklist, steps, compare, chat, prop (IK.cards[kind](area, card, ctx)).
 * Every item may carry "at" (a spoken word or seconds after the cut); items without one spread evenly. */
(function () {
  const { esc, h, stroke, TICK, ARROW, itemAt } = window.IK;
  const cards = (window.IK.cards = window.IK.cards || {});

  // checklist: boxes that get a pencil tick as each item is said
  cards.checklist = (area, c, ctx) => {
    const card = h("div", "card checklist rv", c.label ? `<div class="label">${esc(c.label)}</div>` : "", area);
    ctx.kit.rise(card, ctx.start + 0.35, { y: 30 });
    (c.items || []).forEach((it, i, all) => {
      const row = h("div", "check-row rv", `<div class="box">${stroke(TICK, { w: 7, color: "var(--ok)" })}</div><span>${esc(it.text)}</span>`, card);
      const t = itemAt(ctx, it, i, all.length);
      ctx.kit.slideX(row, t - 0.1, { x: -30, d: 0.35 });
      ctx.kit.draw(row.querySelector("path"), t + 0.15, 0.35);
    });
  };

  // steps: numbered cards joined by hand-drawn arrows (row on 16:9, column on 9:16 via layout.css)
  cards.steps = (area, c, ctx) => {
    const row = h("div", "steps", null, area);
    (c.items || []).forEach((it, i, all) => {
      if (i) {
        const a = h("div", "step-arrow", stroke(ARROW, { w: 5, color: "var(--ink)", view: "0 0 100 40" }), row);
        ctx.kit.draw(a.querySelector("path"), itemAt(ctx, it, i, all.length) - 0.35, 0.3);
      }
      const card = h("div", "card step rv", `<span class="num">${i + 1}</span><div class="step-title">${MotionKit.richText(it.title || "")}</div><div class="step-text">${esc(it.text || "")}</div>`, row);
      ctx.kit.rise(card, itemAt(ctx, it, i, all.length), { y: 36, d: 0.5 });
    });
  };

  // compare: "before" dashed column vs "after" solid green column, each with an optional total
  cards.compare = (area, c, ctx) => {
    const card = h("div", "card compare rv", null, area);
    ctx.kit.rise(card, ctx.start + 0.3, { y: 30 });
    const col = (side) => {
      const d = c[side] || { items: [] };
      h("div", `cmp-head ${side}`, esc(d.title || side), card);
    };
    col("before"); h("div", "", "", card); col("after");
    const cols = ["before", "after"].map((side) => {
      const d = c[side] || { items: [] };
      const colEl = h("div", `cmp-col ${side}`, null, null);
      const t0 = ctx.at(c.at?.[side], side === "before" ? ctx.start + 0.6 : ctx.seq(1, 2));
      (d.items || []).forEach((it, i) => {
        const item = h("div", "cmp-item rv", esc(typeof it === "string" ? it : it.text), colEl);
        ctx.kit.fadeIn(item, t0 + i * 0.25, 0.3);
      });
      if (d.total) ctx.kit.pop(h("div", "cmp-total rv", esc(d.total), colEl), t0 + (d.items || []).length * 0.25 + 0.2, { from: 0.6 });
      return [colEl, t0];
    });
    card.append(cols[0][0]);
    const arrow = h("div", "cmp-arrow rv", "→", card);
    ctx.kit.pop(arrow, cols[1][1] - 0.2, { from: 0.4 });
    card.append(cols[1][0]);
  };

  // chat: bubbles, user right (accent), agent left (paper)
  cards.chat = (area, c, ctx) => {
    const card = h("div", "card chat rv", null, area);
    ctx.kit.rise(card, ctx.start + 0.3, { y: 30 });
    (c.messages || []).forEach((m, i, all) => {
      const who = m.from === "user" ? "user" : "agent";
      const row = h("div", `bubble-row ${who} rv`, `<div class="bubble">${esc(m.text)}</div>`, card);
      ctx.kit.rise(row, itemAt(ctx, m, i, all.length), { y: 18, d: 0.35, ease: "back.out(1.6)" });
    });
  };

  // prop: a pencil prop drawing (built-in name or your own image) with 1-3 sticky notes (tone bad|ok|plain)
  cards.prop = (area, c, ctx) => {
    const box = h("div", "prop", null, area);
    const img = h("img", "prop-img rv", null, box);
    img.src = c.src || `assets/images/prop-${c.prop || "workflow"}.png`;
    ctx.kit.pop(img, ctx.at(c.at, ctx.start + 0.35), { from: 0.85, d: 0.6, ease: "power3.out" });
    const notes = h("div", "notes", null, box);
    (c.notes || []).forEach((n, i, all) => {
      const note = h("div", `note ${n.tone || ""} rv`, `${n.label ? `<b>${esc(n.label)}</b>` : ""}<span>${esc(n.text)}</span>`, notes);
      ctx.kit.rise(note, itemAt(ctx, n, i + 1, all.length + 1), { y: 26, d: 0.45 });
    });
  };
})();
