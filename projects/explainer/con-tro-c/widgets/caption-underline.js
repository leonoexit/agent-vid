// Captions "underline" (AI for business / pencil sketch): plain hand-lettered words, no box; each spoken word gets a
// pencil underline in the accent colour and darkens.
(function () {
  const K = window.ExplainerKit;
  const { tl, h } = K;
  K.css(`
    .cu-line { position: absolute; left: 0; right: 0; top: 10px; display: block; text-align: center; opacity: 0;
      font: 400 56px/1.3 var(--font-display); color: var(--muted); text-shadow: 0 0 10px var(--paper), 0 0 4px var(--paper); }
    .cu-word { position: relative; display: inline-block; margin: 0 0.14em; }
    .cu-mark { position: absolute; left: -4px; right: -4px; bottom: 2px; height: 8px; border-radius: 4px; background: var(--accent);
      transform-origin: left center; display: block; }
  `);
  K.registerHook("caption", "underline", (band, lines, T) => {
    lines.forEach((ln) => {
      const el = h("div", "cu-line", band);
      const words = ln.words.map((w) => {
        const span = h("span", "cu-word", el, w.w);
        return { span, mark: h("i", "cu-mark", span) };
      });
      tl.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, ln.t0);
      tl.to(el, { opacity: 0, duration: 0.12 }, Math.max(ln.t0 + 0.2, ln.t1 - 0.12));
      ln.words.forEach((w, j) => {
        tl.fromTo(words[j].mark, { scaleX: 0, rotation: -1.2 }, { scaleX: 1, rotation: -1.2, duration: 0.18, ease: "power1.out" }, w.t0);
        tl.to(words[j].span, { color: T.captionHighlight, duration: 0.06 }, w.t0);
      });
    });
  });
})();
