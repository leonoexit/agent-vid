// Scene transition "sweep" (AI for business / dashboard): an accent panel with chart gridlines sweeps across left to
// right, covers the cut, then uncovers the next scene.
(function () {
  const K = window.ExplainerKit;
  const { tl, h } = K;
  K.css(`
    .tr-sweep { position: absolute; inset: 0; z-index: 40; display: block; background:
      repeating-linear-gradient(0deg, rgba(255,255,255,0.14) 0 3px, transparent 3px 120px),
      repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0 3px, transparent 3px 120px), var(--accent); }
  `);
  K.registerHook("transition", "sweep", (root, s) => {
    const panel = h("div", "tr-sweep", root.parentNode);
    const end = s.start + s.dur;
    tl.fromTo(panel, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.3, ease: "power2.in" }, end - 0.32);
    tl.to(panel, { clipPath: "inset(0% 0% 0% 100%)", duration: 0.34, ease: "power2.out" }, end + 0.02);
    tl.to(root, { opacity: 0, duration: 0.01 }, end - 0.02);
  });
})();
