/* ink-scenes.js: scene types cover, stats, feature, statement, outro for the ink-paper theme.
 * Every scene may set "mascot": "map|magnifier|confused|cheer|none" (default picked per type, see ink-main.js). */
(function () {
  const { esc, h, stroke, UNDERLINE, CIRCLE, header, itemAt } = window.IK;
  const B = () => window.BRAND || {};

  // cover: logo, title written in, subtitle, version pill
  MotionKit.registerScene("cover", (el, s, ctx) => {
    const { kit } = ctx;
    const box = h("div", "cover-box", null, el);
    const logo = h("img", "cover-logo rv", null, box);
    logo.src = B().logoOnLight || B().logo || "";
    kit.rise(logo, ctx.at(s.at?.logo, ctx.start + 0.15), { y: 24, d: 0.7 });
    if (s.title) kit.rise(h("div", "cover-title rv", MotionKit.richText(s.title), box), ctx.at(s.at?.title, ctx.start + 0.8), { y: 30, d: 0.6 });
    if (s.subtitle) kit.fadeIn(h("div", "cover-sub rv", esc(s.subtitle), box), ctx.at(s.at?.subtitle, ctx.start + 1.4), 0.5);
    if (s.version) kit.pop(h("div", "pill rv", esc(s.version), box), ctx.at(s.at?.version, ctx.start + 1.9), { from: 0.6 });
  });

  // stats: big handwritten numbers with a scribbled underline each
  MotionKit.registerScene("stats", (el, s, ctx) => {
    header(el, s, ctx);
    const row = h("div", "area stats", null, el);
    (s.stats || []).forEach((st, i, all) => {
      const t = itemAt(ctx, st, i, all.length);
      const card = h("div", "card stat rv", `<div class="stat-num">0</div><div class="stat-line">${stroke(UNDERLINE, { w: 7 })}</div><div class="stat-label">${esc(st.label || "")}</div>`, row);
      ctx.kit.rise(card, t - 0.15, { y: 36 });
      const num = card.querySelector(".stat-num");
      if (typeof st.value === "number") ctx.kit.odo(num, t, st.value, { prefix: st.prefix || "", suffix: st.suffix || "", d: 1.0 });
      else num.textContent = st.value;
      ctx.kit.draw(card.querySelector("path"), t + 0.6, 0.5);
    });
  });

  // feature: plank title + one card (ink-cards.js)
  MotionKit.registerScene("feature", (el, s, ctx) => {
    header(el, s, ctx);
    const area = h("div", "area", null, el);
    const card = s.card || { kind: "checklist", items: [] };
    const draw = window.IK.cards[card.kind];
    if (!draw) throw new Error(`[ink-paper] unknown card kind "${card.kind}" in ${s.id}`);
    draw(area, card, ctx);
  });

  // statement: one handwritten line, the *accent* part circled in pencil
  MotionKit.registerScene("statement", (el, s, ctx) => {
    const { kit } = ctx;
    const wrap = h("div", "statement", null, el);
    const box = h("div", "statement-sheet rv", null, wrap);
    kit.rise(box, ctx.start + 0.1, { y: 30, d: 0.5 });
    const text = h("div", "state-text rv", MotionKit.richText(s.text || ""), box);
    const t = ctx.at(s.at, ctx.start + 0.2);
    kit.rise(text, t, { y: 30, d: 0.6 });
    const em = text.querySelector("em");
    if (em) {
      em.style.position = "relative";
      em.insertAdjacentHTML("beforeend", stroke(CIRCLE, { w: 6 }));
      const svg = em.querySelector("svg");
      Object.assign(svg.style, { position: "absolute", left: "-12%", top: "-18%", width: "124%", height: "136%", overflow: "visible" });
      kit.draw(em.querySelector("path"), t + 0.5, 0.7);
    }
    if (s.sub) kit.fadeIn(h("div", "state-sub rv", MotionKit.richText(s.sub), box), ctx.at(s.at_sub, t + 1.0), 0.6);
  });

  // outro: logo, promise line, call-to-action pill
  MotionKit.registerScene("outro", (el, s, ctx) => {
    const { kit } = ctx;
    const box = h("div", "outro-box", null, el);
    const logo = h("img", "outro-logo rv", null, box);
    logo.src = B().logoOnLight || B().logo || "";
    kit.rise(logo, ctx.start + 0.2, { y: 20, d: 0.9 });
    const line = s.line ?? B().outroLine;
    if (line) kit.rise(h("div", "outro-line rv", MotionKit.richText(line), box), ctx.at(s.at?.line, ctx.start + 0.8), { y: 24, d: 0.7 });
    const cta = s.cta ?? B().url;
    if (cta) kit.pop(h("div", "pill rv", `▶ ${esc(cta)}`, box), ctx.at(s.at?.cta, ctx.start + 1.5), { from: 0.7 });
  });
})();
