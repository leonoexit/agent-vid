/* ink-dom.js: DOM helpers + hand-drawn pencil strokes shared by the ink-paper scene renderers (window.IK).
 * Strokes are SVG paths with pathLength=1 so kit.draw() writes them in like a pen. */
(function () {
  const esc = (s = "") => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function h(tag, cls, html, parent) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html != null) el.innerHTML = html;
    if (parent) parent.append(el);
    return el;
  }

  const stroke = (d, { w = 6, color = "var(--accent)", view = "0 0 100 100" } = {}) =>
    `<svg viewBox="${view}" preserveAspectRatio="none"><path class="draw" pathLength="1" d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  // a slightly wobbly tick, a hand-drawn arrow, a scribbled underline and a loose circle
  const TICK = "M14,52 C22,58 30,68 38,80 C52,52 70,28 92,8";
  const ARROW = "M4,22 C28,18 50,24 90,20 M72,6 C80,12 86,16 92,20 C84,24 78,30 72,36";
  const UNDERLINE = "M2,60 C20,40 40,70 60,48 C75,34 88,58 98,42";
  const CIRCLE = "M50,6 C80,4 98,26 96,52 C94,80 70,96 46,94 C18,92 2,70 4,46 C6,22 26,6 56,8";

  /** Plank sign with the scene title (swings down from its nails) + the "3/7" counter ring. */
  function header(el, spec, ctx) {
    const { kit } = ctx;
    if (spec.title) {
      const p = h("div", "plank rv", `<span>${MotionKit.richText(spec.title)}</span>`, el);
      kit.tl.fromTo(p, { autoAlpha: 0, y: -160, rotation: -7 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.9, ease: "elastic.out(1, 0.55)", immediateRender: false }, ctx.at(spec.at?.title, ctx.start + 0.1));
    }
    if (ctx.featureNo) {
      const c = h("div", "counter rv", `${ctx.featureNo}/${ctx.featureCount}`, el);
      kit.pop(c, ctx.start + 0.45, { from: 0.3 });
    }
  }

  const itemAt = (ctx, item, i, n) => ctx.at(item && item.at, ctx.seq(i, n));

  window.IK = { esc, h, stroke, TICK, ARROW, UNDERLINE, CIRCLE, header, itemAt };
})();
