/* ink-main.js: wires the ink-paper look around the storyboard: soft paper transitions (sweep, lift, turn, fade),
 * the pencil robot mascot (pose per scene, walks in, bobs, hops on each new scene and on drops, squashes on kick
 * downbeats), a warm paper flash on the drop, captions and the signature. Call InkTheme.build(kit).
 * Other themes built on ink paper pass options: InkTheme.build(kit, { poses, transitions, pickTransition }) —
 * `poses` maps scene type -> default mascot pose ("none" hides it), `transitions` adds entrance kinds, `outro(el, t1, nextKind)` replaces the exit. */
(function () {
  const ROTATION = ["sweep", "lift", "turn"];
  const DEFAULT_POSE = { cover: "map", stats: "magnifier", feature: null, statement: "cheer", outro: "cheer" };
  const FEATURE_POSES = ["magnifier", "confused", "map"];

  function transitions(kit) {
    const { tl } = kit;
    const ft = (el, from, to, t) => tl.fromTo(el, from, { immediateRender: false, ...to }, t);
    return {
      none: (el, t) => tl.set(el, { autoAlpha: 1 }, t),
      sweep: (el, t) => ft(el, { autoAlpha: 1, clipPath: "inset(0% 100% 0% 0%)" }, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power2.inOut" }, t),
      lift: (el, t) => ft(el, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" }, t),
      turn: (el, t) => ft(el, { autoAlpha: 0, rotationY: 28, transformPerspective: 2400, transformOrigin: "0% 50%" }, { autoAlpha: 1, rotationY: 0, duration: 0.6, ease: "power2.out" }, t),
      fade: (el, t) => ft(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: "power1.inOut" }, t),
    };
  }

  function mascot(kit, board, show, defaultPose) {
    const { T, tl, B, isKick, $ } = kit;
    const host = $("#mascot");
    const imgs = {};
    for (const pose of ["map", "magnifier", "confused", "cheer"]) {
      imgs[pose] = Object.assign(document.createElement("img"), { src: `assets/images/mascot-${pose}.png`, alt: "" });
      host.append(imgs[pose]);
    }
    let featureIdx = 0;
    let first = true;
    board.forEach((spec) => {
      const sc = T.scenes[spec.id];
      if (!sc) return;
      const pose = spec.mascot ?? defaultPose[spec.type] ?? FEATURE_POSES[featureIdx++ % FEATURE_POSES.length];
      for (const [name, img] of Object.entries(imgs)) tl.set(img, { attr: { class: name === pose ? "on" : "" } }, sc.start);
      tl.set(host, { autoAlpha: pose === "none" || !show ? 0 : 1 }, sc.start);
      if (pose === "none") return;
      if (first) {
        tl.fromTo(host, { x: -420 }, { x: 0, duration: 1.4, ease: "power2.out", immediateRender: false }, sc.start + 0.1); // walks in
        first = false;
      } else {
        tl.to(host, { y: -34, duration: 0.18, ease: "power2.out" }, sc.start + 0.05); // little hop into the new pose
        tl.to(host, { y: 0, duration: 0.35, ease: "bounce.out" }, sc.start + 0.23);
      }
    });
    tl.to(host, { rotation: 1.5, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: Math.max(1, Math.floor(T.duration / 1.8)) }, 0);
    for (let n = 0; B(n) < T.duration && n < T.outroBeat; n++) {
      if (!isKick(n) || n % 4) continue;
      tl.to(host, { scaleY: 0.97, scaleX: 1.02, duration: 0.06 }, B(n));
      tl.to(host, { scaleY: 1, scaleX: 1, duration: 0.3, ease: "power2.out" }, B(n) + 0.06);
    }
    T.drops.map(B).forEach((t) => {
      tl.to(host, { y: -60, duration: 0.2, ease: "power2.out" }, t);
      tl.to(host, { y: 0, duration: 0.45, ease: "bounce.out" }, t + 0.2);
    });
  }

  function build(kit, opts = {}) {
    const { T, tl, B, flash } = kit;
    MotionKit.brand(kit);
    const board = window.STORYBOARD.scenes;
    MotionKit.buildStoryboard(kit, {
      host: "#stage",
      transitions: { ...transitions(kit), ...opts.transitions },
      pickTransition: opts.pickTransition || ((spec, i, prev) => (i === 0 ? "none" : spec.type === "outro" ? "fade" : ROTATION.filter((k) => k !== prev)[i % 2])),
      // the old sheet stays until the new one has covered it (sweep/turn), then leaves
      outro: opts.outro || ((el, t1) => tl.set(el, { autoAlpha: 0 }, t1 + 0.65)),
    });
    mascot(kit, board, true, { ...DEFAULT_POSE, ...opts.poses });
    T.drops.map(B).forEach((t) => flash(t, 0.35));
    MotionKit.captions(kit);
    kit.finish({ fadeIn: 0.4, fadeOut: 0.9 });
  }

  window.InkTheme = { build };
})();
