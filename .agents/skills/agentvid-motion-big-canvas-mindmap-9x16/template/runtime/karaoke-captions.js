/* karaoke-captions.js: one caption box per TIMING.captions chunk, each word lighting up at its spoken onset.
 * Style lives in the theme CSS: .cap (position), .cap-box (box), .cw (unread word), .cw[data-s="on"] (current),
 * .cw[data-s="done"] (read). The state is an attribute set on the timeline (seek-safe), so the theme owns the look.
 * Usage: MotionKit.captions(kit, { layer: "#captions" }) */
(function () {
  function captions(kit, { layer = "#captions", enterY = 16 } = {}) {
    const { T, tl, $ } = kit;
    const host = $(layer);
    // caption box geometry from the aspect profile (data/aspect.json), overridable in the theme CSS
    const cc = T.aspect?.captions || {};
    const vars = { "--cap-bottom": cc.bottom, "--cap-width": cc.width, "--cap-size": cc.fontSize };
    for (const [k, v] of Object.entries(vars)) if (v != null) document.documentElement.style.setProperty(k, `${v}px`);
    T.captions.forEach((c) => {
      const cap = document.createElement("div");
      cap.className = "cap";
      const box = document.createElement("div");
      box.className = "cap-box";
      const spans = c.words.map(([txt], j) => {
        if (j) box.append(" ");
        const s = document.createElement("span");
        s.className = "cw";
        s.dataset.s = "wait";
        s.textContent = txt;
        box.append(s);
        return s;
      });
      cap.append(box);
      host.append(cap);
      tl.set(cap, { autoAlpha: 0 }, 0);
      tl.fromTo(cap, { autoAlpha: 0, y: enterY }, { autoAlpha: 1, y: 0, duration: 0.14, ease: "power2.out", immediateRender: false }, c.start);
      tl.to(cap, { autoAlpha: 0, duration: 0.12, ease: "power1.in" }, Math.max(c.start + 0.3, c.end - 0.12));
      c.words.forEach(([, s], j) => {
        const next = j < c.words.length - 1 ? c.words[j + 1][1] : Math.max(s + 0.35, c.end - 0.4);
        tl.set(spans[j], { attr: { "data-s": "on" } }, s);
        tl.set(spans[j], { attr: { "data-s": "done" } }, next);
      });
    });
  }
  window.MotionKit = Object.assign(window.MotionKit || {}, { captions });
})();
