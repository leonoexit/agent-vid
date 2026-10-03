/* diagram-main.js: wires the agent-diagram theme. Reuses the ink-paper build (paper, mascot, captions, signature,
 * fades) and adds: a quick dissolve between diagram scenes (the main tile glides, so the diagram reads as one
 * continuous board), no mascot on diagram scenes (the tiles are the characters), and a HUD — topic tag + one progress
 * segment per scene — shown only on diagram scenes (ink scenes keep their plank title in that spot).
 * Call DiagramTheme.build(kit). */
(function () {
  const DIAGRAM = ["swarm", "gauge", "handoff", "fan-out", "split", "recap"];

  function hud(kit) {
    const { T, tl, $ } = kit;
    const { h } = window.IK;
    const board = window.STORYBOARD;
    const host = $("#hud");
    host.querySelector(".hud-topic").innerHTML = board.topic ? `${window.DG.icon("spark")}<span>${MotionKit.richText(board.topic)}</span>` : "";
    const specs = board.scenes.filter((s) => T.scenes[s.id]);
    const segs = specs.map(() => h("i", "", "<b></b>", host.querySelector(".hud-segs")).firstChild);
    tl.set(host, { autoAlpha: 0 }, 0);
    tl.set(segs, { scaleX: 0 }, 0);
    specs.forEach((s, i) => {
      const t = T.scenes[s.id].start;
      tl.set(host, { autoAlpha: DIAGRAM.includes(s.type) ? 1 : 0 }, t);
      tl.fromTo(segs[i], { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power2.out", immediateRender: false }, t);
    });
  }

  function build(kit) {
    const { tl } = kit;
    hud(kit);
    InkTheme.build(kit, {
      poses: Object.fromEntries(DIAGRAM.map((k) => [k, "none"])),
      transitions: {
        dissolve: (el, t) => tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: "power1.inOut", immediateRender: false }, t),
      },
      // a dissolve is a crossfade (the old board fades while the new one fades in); other kinds cover the old sheet first
      outro: (el, t1, next) => (next === "dissolve" ? tl.to(el, { autoAlpha: 0, duration: 0.35, ease: "power1.inOut" }, t1) : tl.set(el, { autoAlpha: 0 }, t1 + 0.65)),
      pickTransition: (spec, i) => (i === 0 ? "none" : spec.type === "outro" ? "fade" : DIAGRAM.includes(spec.type) ? "dissolve" : "lift"),
    });
  }

  window.DiagramTheme = { build };
})();
