/* motion-runtime.js: shared, deterministic timeline helpers for every agentvid-motion composition.
 * Load after GSAP and after the TIMING / BRAND blocks:  const kit = MotionKit.create(window.TIMING);
 * Rules: every time comes from TIMING (never Date / rAF / CSS animations); randomness only via kit.rng(seed);
 * build all DOM before the first tween; the renderer seeks window.__timelines.main frame by frame. */
(function () {
  function create(T) {
    const tl = gsap.timeline({ paused: true });
    window.__timelines = window.__timelines || {};
    window.__timelines.main = tl;

    const $ = (s, r = document) => (typeof s === "string" ? r.querySelector(s) : s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const SC = T.scenes;
    const B = (n) => T.beat0 + T.beatLen * n; // time of quarter note n
    const beatAt = (t) => Math.round((t - T.beat0) / T.beatLen);
    const isKick = (n) => T.kick.some(([a, b]) => n >= a && n < b);
    const norm = (w) => w.toLowerCase().replace(/[^\p{L}\p{N}'-]/gu, "");
    const hit = (sid, word, nth) => {
      if (!SC[sid]) return console.warn(`[timing] unknown scene ${sid}`), null;
      const h = SC[sid].lines.flatMap((l) => l.words).filter((w) => w[0] === norm(word))[nth - 1];
      if (!h) console.warn(`[timing] "${word}" #${nth} missing in ${sid}`);
      return h;
    };
    /** onset / end of a spoken word; falls back to the scene start so a typo never breaks the render */
    const W = (sid, word, nth = 1) => (hit(sid, word, nth) || [0, SC[sid]?.start ?? 0])[1];
    const WE = (sid, word, nth = 1) => (hit(sid, word, nth) || [0, 0, SC[sid]?.start ?? 0])[2];
    const line = (sid, i) => SC[sid].lines[i];
    const rng = (seed) => () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    // ---- entrance vocabulary (all seek-safe fromTo tweens) ----
    const ft = (e, from, to, t) => tl.fromTo(e, from, { immediateRender: false, ...to }, t);
    const pop = (e, t, o = {}) => ft(e, { autoAlpha: 0, scale: o.from ?? 0.4 }, { autoAlpha: 1, scale: 1, duration: o.d ?? 0.45, ease: o.ease ?? "back.out(2.2)", stagger: o.stagger ?? 0 }, t);
    const rise = (e, t, o = {}) => ft(e, { autoAlpha: 0, y: o.y ?? 40 }, { autoAlpha: 1, y: 0, duration: o.d ?? 0.5, ease: o.ease ?? "power3.out", stagger: o.stagger ?? 0 }, t);
    const slideX = (e, t, o = {}) => ft(e, { autoAlpha: 0, x: o.x ?? -80 }, { autoAlpha: 1, x: 0, duration: o.d ?? 0.5, ease: o.ease ?? "power3.out", stagger: o.stagger ?? 0 }, t);
    const flipIn = (e, t, o = {}) => ft(e, { autoAlpha: 0, rotationX: o.rx ?? -70, transformPerspective: 900 }, { autoAlpha: 1, rotationX: 0, duration: o.d ?? 0.55, ease: o.ease ?? "back.out(1.6)", stagger: o.stagger ?? 0.05 }, t);
    const fadeIn = (e, t, d = 0.4) => ft(e, { autoAlpha: 0 }, { autoAlpha: 1, duration: d, ease: "power1.out" }, t);
    const fadeOut = (e, t, d = 0.3) => tl.to(e, { autoAlpha: 0, duration: d, ease: "power1.in" }, t);
    /** SVG stroke draw; elements need pathLength="1" and class "draw" (dasharray 1) */
    const draw = (e, t, d = 0.6, ease = "power2.inOut") => ft(e, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, ease }, t);
    const bump = (e, t, s = 1.12) => (tl.to(e, { scale: s, duration: 0.08, ease: "power2.out" }, t), tl.to(e, { scale: 1, duration: 0.35, ease: "elastic.out(1,0.5)" }, t + 0.08));
    /** reveal text char by char (the element keeps its final text; visibility is stepped) */
    function typeIn(e, t, cps = 28) {
      const el = $(e);
      const text = el.textContent;
      el.textContent = "";
      const spans = [...text].map((c) => Object.assign(document.createElement("span"), { textContent: c }));
      spans.forEach((s) => el.append(s));
      tl.set(spans, { visibility: "hidden" }, 0);
      spans.forEach((s, i) => tl.set(s, { visibility: "visible" }, t + i / cps));
      return t + spans.length / cps;
    }
    /** count a number up: element text goes from `from` to `to` (integers, optional suffix) */
    function odo(e, t, to, o = {}) {
      const el = $(e);
      const box = { v: o.from ?? 0 };
      tl.set(el, { textContent: `${o.prefix ?? ""}${box.v}${o.suffix ?? ""}` }, 0);
      tl.to(box, { v: to, duration: o.d ?? 1.2, ease: o.ease ?? "power2.out", onUpdate: () => (el.textContent = `${o.prefix ?? ""}${Math.round(box.v).toLocaleString("en-US")}${o.suffix ?? ""}`) }, t);
    }
    /** split an element's words into .w spans for staggered headline entrances */
    const splitWords = (el) => ((el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ")), $$(".w", el));
    /** keyframes from the voice envelope between t0 and t1 (mouths, waveforms, meters): map(v) -> vars */
    function envKeys(e, t0, t1, map, step = 2 / T.fps) {
      for (let t = t0; t < t1; t += step) {
        const v = T.env[Math.min(T.env.length - 1, Math.round(t * T.fps))] || 0;
        tl.to(e, { ...map(v), duration: step, ease: "none" }, t);
      }
      tl.to(e, { ...map(0), duration: 0.1 }, t1);
    }

    // ---- punctuation on shared full-frame layers ----
    function flash(t, a = 0.45, sel = "#flash") {
      tl.to(sel, { opacity: a, duration: 0.03, ease: "none" }, t);
      tl.to(sel, { opacity: 0, duration: 0.35, ease: "power2.out" }, t + 0.03);
    }
    function shake(t, amp = 1, sel = "#shake") {
      const r = rng(Math.round(t * 1000));
      for (let i = 0; i < 8; i++) tl.to(sel, { x: (r() - 0.5) * 24 * amp, y: (r() - 0.5) * 16 * amp, duration: 0.035, ease: "none" }, t + i * 0.035);
      tl.to(sel, { x: 0, y: 0, duration: 0.08 }, t + 0.28);
    }
    /** scale a wrapper ~1% on kick downbeats until the outro */
    function beatPulse(sel = "#pulse", amount = 0.01, every = 4) {
      for (let n = 0; B(n) < T.duration && n < T.outroBeat; n++) {
        if (!isKick(n) || n % every) continue;
        tl.to(sel, { scale: 1 + amount, duration: 0.05, ease: "power1.out" }, B(n));
        tl.to(sel, { scale: 1, duration: 0.33, ease: "power2.out" }, B(n) + 0.05);
      }
    }

    /**
     * Scene windows: rows [selector, sceneId, kind]. `transitions[kind](el, t0)` plays the entrance at the
     * scene start and `outro(el, t1, nextKind)` the exit just before the next scene. `onCut(t0, i)` adds accents.
     */
    function windows(rows, { transitions, outro, onCut }) {
      rows.forEach(([sel, sid, kind], i) => {
        const el = $(sel);
        if (!el || !SC[sid]) return console.warn(`[windows] missing ${sel} or scene ${sid}`);
        const t0 = SC[sid].start;
        const next = rows[i + 1];
        const t1 = next ? SC[next[1]].start : T.duration;
        tl.set(el, { autoAlpha: 0 }, 0);
        (transitions[kind] || transitions.none)(el, t0);
        if (next) outro(el, t1, next[2]);
        if (onCut) onCut(t0, i);
      });
    }

    /** pin the timeline length to the video length and fade from / to black */
    function finish({ fadeSel = "#fade", fadeIn: fi = 0.3, fadeOut: fo = 1.0 } = {}) {
      tl.fromTo(fadeSel, { opacity: 1 }, { opacity: 0, duration: fi }, 0);
      tl.to(fadeSel, { opacity: 1, duration: fo, ease: "power1.in" }, T.duration - fo);
      tl.set({}, {}, T.duration);
    }

    return { T, tl, $, $$, SC, B, beatAt, isKick, W, WE, line, rng, pop, rise, slideX, flipIn, fadeIn, fadeOut, draw, bump, typeIn, odo, splitWords, envKeys, flash, shake, beatPulse, windows, finish };
  }
  window.MotionKit = Object.assign(window.MotionKit || {}, { create });
})();
