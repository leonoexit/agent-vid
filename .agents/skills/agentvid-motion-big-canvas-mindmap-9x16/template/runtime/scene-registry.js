/* scene-registry.js: builds scenes from data/storyboard.json (window.STORYBOARD) with renderers a theme registers.
 *   MotionKit.registerScene("cover", (el, spec, ctx) => { ...build DOM + tweens... })
 *   MotionKit.buildStoryboard(kit, { host: "#stage", transitions, outro, onCut, pickTransition })
 * ctx = { kit, sid, spec, index, count, start, end, at(v, fallback), seq(i, n), featureNo, featureCount }
 * Anchor values in a spec: "word" | "word#2" (2nd occurrence) | number (seconds after the scene cut)
 *   | { "word": "x", "nth": 1, "plus": 0.2 }. Anchors resolve against the scene's own spoken words, so visuals
 * follow the voice when it is re-timed. A missing word warns and falls back to `fallback`. */
(function () {
  const renderers = {};
  const registerScene = (type, fn) => (renderers[type] = fn);

  function buildStoryboard(kit, { host = "#stage", transitions, outro, onCut, pickTransition, featureTypes = ["feature"] }) {
    const board = window.STORYBOARD;
    if (!board || !board.scenes) throw new Error("window.STORYBOARD is empty: add data/storyboard.json and run build-timeline");
    const { T, $, W } = kit;
    const stage = $(host);
    // scene mixer (phase 3): window.STYLE is only set when the project has data/style.json and the skill was
    // built with --styles (see build-timeline.mjs / check-style-mix.mjs). The base style cascades from #root
    // (CSS custom properties inherit down the DOM); a per-scene override further down only re-skins that
    // scene's own subtree, so shared full-frame layers (background, captions) keep following the base.
    const STYLE = window.STYLE;
    if (STYLE) {
      const rootEl = document.getElementById("root");
      if (rootEl && STYLE.base) rootEl.dataset.style = STYLE.base;
    }
    const specs = board.scenes.filter((s) => T.scenes[s.id] || console.warn(`[storyboard] ${s.id} has no voice in script.json`));
    const ids = new Set();
    for (const spec of specs) {
      if (ids.has(spec.id)) throw new Error(`[storyboard] duplicate scene id "${spec.id}"`);
      ids.add(spec.id);
      if (spec.transition != null && !Object.hasOwn(transitions, spec.transition))
        throw new Error(`[storyboard] unknown transition "${spec.transition}" (${spec.id})`);
    }
    const features = specs.filter((s) => featureTypes.includes(s.type));
    const rows = [];
    specs.forEach((spec, index) => {
      const render = renderers[spec.type];
      if (!render) throw new Error(`[storyboard] no renderer for scene type "${spec.type}" (${spec.id})`);
      const sc = T.scenes[spec.id];
      const el = document.createElement("section");
      el.className = `scene layer scene-${spec.type}`;
      el.id = `sc-${spec.id}`;
      if (STYLE) {
        const sceneStyle = STYLE.scenes?.[spec.id] || STYLE.base;
        if (sceneStyle) el.dataset.style = sceneStyle;
        if (STYLE.chip && sceneStyle) {
          const chip = document.createElement("div");
          chip.className = "style-mix-chip";
          chip.textContent = `● style ${sceneStyle}`;
          chip.style.cssText = "position:absolute;left:24px;top:22px;z-index:999;font:700 20px/1 monospace;" +
            "letter-spacing:.02em;color:#fff;background:rgba(0,0,0,.55);padding:8px 14px;border-radius:999px;pointer-events:none;";
          el.append(chip);
        }
      }
      stage.append(el);
      const at = (v, fallback = sc.start + 0.4) => {
        if (v == null) return fallback;
        if (typeof v === "number") return sc.start + v;
        const o = typeof v === "string" ? { word: v.split("#")[0], nth: Number(v.split("#")[1] || 1) } : v;
        const hit = sc.lines.flatMap((l) => l.words).filter((w) => w[0] === norm(o.word))[(o.nth || 1) - 1];
        if (!hit) console.warn(`[storyboard] ${spec.id}: word "${o.word}" not spoken; using fallback`);
        return (hit ? hit[1] : fallback) + (o.plus || 0);
      };
      // evenly spaced default times for n items across the first 70% of the scene
      const seq = (i, n) => sc.start + 0.5 + ((sc.end - sc.start) * 0.7 * i) / Math.max(1, n);
      const ctx = { kit, sid: spec.id, spec, index, count: specs.length, start: sc.start, end: sc.end, at, seq,
        featureNo: features.indexOf(spec) + 1, featureCount: features.length };
      render(el, spec, ctx);
      rows.push([el, spec.id, spec.transition || pickTransition(spec, index, rows.at(-1)?.[2])]);
    });
    kit.windows(rows, { transitions, outro, onCut });
    return { specs, features };
  }

  const norm = (w) => String(w).toLowerCase().replace(/[^\p{L}\p{N}'-]/gu, "");

  /** "Ship *faster*" -> "Ship <em>faster</em>" (escaped); used by themes for accent words in titles */
  const richText = (s = "") =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]).replace(/\*([^*]+)\*/g, "<em>$1</em>");

  window.MotionKit = Object.assign(window.MotionKit || {}, { registerScene, buildStoryboard, richText });
})();
