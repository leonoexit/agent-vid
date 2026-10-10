/* canvas-pen.js: the camera and the pen, both pure functions of time (window.CP).
 * One driver tween calls apply(t) on every seek, so the camera move and the pen position can never disagree and
 * nothing depends on tween order. Geometry that depends on fonts (where a text line currently ends) is read from the
 * DOM inside apply(), never baked into a tween.
 *   const rig = CP.create(kit, { world, pen });
 *   rig.camKey({ t, d, cx, cy, s, ease })   camera ARRIVES at (cx, cy, zoom s) at time t after travelling for d seconds
 *   rig.penSeg({ t0, t1, at(u) -> {x, y, screen?}, ease, wobble })   the pen tip follows at(u) while t0 <= t <= t1
 *   rig.install()                            call once, after every key and segment is registered */
(function () {
  const SCREEN = { cx: 540, cy: 980 }; // the world point (cx, cy) of a camera key sits here (inside the TikTok + Reels safe box)
  const GLIDE = 0.6, ENTER_FROM = [0.6, 0.8], ENTER_DIST = 560, MAX_FLY = 760, FADE = 0.3, LINGER = 1.0, LONG_GAP = 3.5;
  const LIFT = [70, 95], LIFT_T = 0.45; // after a stroke the hand lifts aside (down-right) so the words it just wrote are readable

  const lerp = (a, b, u) => a + (b - a) * u;
  const ease = (name) => gsap.parseEase(name || "none");

  // Hand holding a black brush pen (assets/images/hand-pen.png, generated, background cut, forearm faded out). The pen tip is
  // at (TIP.x, TIP.y) of the image; HAND_H = on-screen height of the sprite.
  const HAND = { src: "assets/images/hand-pen.png", w: 446, h: 500 }, TIP = { x: 3, y: 3 }, HAND_H = 250;

  function create(kit, { world, pen }) {
    const T = kit.T;
    const keys = [];
    const segs = [];
    const penTip = pen.querySelector(".pen-art");
    const k = HAND_H / HAND.h;
    penTip.innerHTML = `<div class="pen-shadow"></div><img src="${HAND.src}" alt="" width="${HAND.w * k}" height="${HAND_H}">`;
    Object.assign(penTip.style, { left: `${-TIP.x * k}px`, top: `${-TIP.y * k}px` });

    const camKey = (k) => {
      const prev = keys.at(-1);
      // keys arrive in order: a key asked for earlier than the previous arrival is pushed just after it
      const t = prev ? Math.max(k.t, prev.t + 0.1) : k.t;
      keys.push({ ease: "power3.inOut", ...k, t, d: prev ? Math.max(0.05, Math.min(k.d ?? 1.2, t - prev.t)) : 0 });
    };
    const penSeg = (s) => segs.push({ ease: "none", wobble: false, ...s });

    function camAt(t) {
      let cur = keys[0];
      for (let j = 1; j < keys.length; j++) {
        const k = keys[j], start = k.t - k.d;
        if (t <= start) return cur;
        if (t < k.t) {
          const u = ease(k.ease)((t - start) / k.d);
          return { cx: lerp(cur.cx, k.cx, u), cy: lerp(cur.cy, k.cy, u), s: Math.exp(lerp(Math.log(cur.s), Math.log(k.s), u)) };
        }
        cur = k;
      }
      return cur;
    }
    const toScreen = (p, c) => (p.screen ? p : { x: SCREEN.cx + (p.x - c.cx) * c.s, y: SCREEN.cy + (p.y - c.cy) * c.s });

    function penAt(t, c) {
      let i = -1;
      for (let j = 0; j < segs.length; j++) if (segs[j].t0 <= t) i = j; else break;
      const prev = segs[i], next = segs[i + 1];
      if (prev && t <= prev.t1) {
        const u = Math.min(1, Math.max(0, (t - prev.t0) / Math.max(1e-6, prev.t1 - prev.t0)));
        const p = toScreen(prev.at(ease(prev.ease)(u)), c);
        const w = prev.wobble ? [Math.sin(t * 41) * 1.6, Math.sin(t * 29) * 2.6] : [0, 0];
        return { x: p.x + w[0], y: p.y + w[1], a: 1 };
      }
      const tip = prev && toScreen(prev.at(1), c);
      const lifted = (tt) => { const k = ease("power2.out")(Math.min(1, Math.max(0, (tt - prev.t1) / LIFT_T))); return { x: tip.x + LIFT[0] * k, y: tip.y + LIFT[1] * k }; };
      const end = prev && lifted(t);
      if (!next) return end ? { ...end, a: t < prev.t1 + LINGER ? 1 : Math.max(0, 1 - (t - prev.t1 - LINGER) / FADE) } : { x: 0, y: 0, a: 0 };
      const begin = toScreen(next.at(0), c);
      const gap = prev ? next.t0 - prev.t1 : Infinity;
      const glide = Math.min(GLIDE, gap);
      const g0 = next.t0 - glide;
      // resting after the previous stroke: visible, but a long wait fades the hand out until the next move starts
      if (t < g0) {
        if (!end) return { x: 0, y: 0, a: 0 };
        const k = t - prev.t1 - LINGER;
        return { ...end, a: gap <= LONG_GAP || k <= 0 ? 1 : Math.max(0, 1 - k / FADE) };
      }
      const u = ease("power2.inOut")((t - g0) / glide);
      if (prev && glide < 0.35 && Math.hypot(begin.x - tip.x, begin.y - tip.y) > 450) // too far for a glide this short: fade across
        return { ...(u < 0.5 ? lifted(g0) : begin), a: Math.abs(2 * u - 1) };
      // the glide starts where the resting hand is at the start of the glide
      let from = (prev && lifted(g0)) || { x: begin.x + ENTER_FROM[0] * ENTER_DIST, y: begin.y + ENTER_FROM[1] * ENTER_DIST };
      const dist = Math.hypot(begin.x - from.x, begin.y - from.y);
      if (dist > MAX_FLY) from = { x: begin.x + ((from.x - begin.x) / dist) * MAX_FLY, y: begin.y + ((from.y - begin.y) / dist) * MAX_FLY };
      const a = !end || gap > LONG_GAP ? Math.min(1, (t - g0) / FADE) : 1;
      return { x: lerp(from.x, begin.x, u), y: lerp(from.y, begin.y, u), a };
    }

    const worldEl = world;
    function apply(t) {
      const c = camAt(t);
      worldEl.style.transform = `translate(${SCREEN.cx - c.cx * c.s}px, ${SCREEN.cy - c.cy * c.s}px) scale(${c.s})`;
      const p = penAt(t, c);
      pen.style.opacity = String(p.a);
      pen.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
      kit.onFrame?.(t, c);
    }

    function install() {
      if (!keys.length) throw new Error("no camera keys");
      segs.sort((a, b) => a.t0 - b.t0);
      const proxy = { t: 0 };
      kit.tl.to(proxy, { t: T.duration, duration: T.duration, ease: "none", onUpdate: () => apply(proxy.t) }, 0);
      apply(0);
    }
    return { camKey, penSeg, install, camAt, penAt, apply, SCREEN };
  }

  /** world position of an element (offset chain up to the world layer; no transforms between them) */
  function worldPos(el, worldEl) {
    let x = 0, y = 0, n = el;
    while (n && n !== worldEl) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { x, y };
  }

  window.CP = { create, worldPos, SCREEN };
})();
