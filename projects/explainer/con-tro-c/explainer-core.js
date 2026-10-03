// Shared runtime for the explainer: one paused GSAP timeline, DOM/motion helpers and the widget registry.
// Load order in index.html: theme.js -> project-data.js -> explainer-core.js -> widgets/*.js -> explainer-engine.js.
// Every helper adds tweens to the same timeline, so the whole video stays a pure function of time (seek-safe).
(function () {
  const tl = gsap.timeline({ paused: true });

  // Typography glue with no-break spaces (U+00A0): a number stays with its unit or label ("37 nghìn", "Điều 6", "NĐ 356"),
  // and a text of 3+ words keeps its last two words together, so a block never ends on one lonely word.
  const NB = "\u00a0";
  function glue(text) {
    let t = String(text).replace(/(\d[\d.,:/]*%?) (?=[\p{L}%]{1,7}(?!\p{L}))/gu, "$1" + NB)
      .replace(/(^|\s)([\p{L}.]{1,6}) (?=\d)/gu, "$1$2" + NB);
    const words = t.trim().split(" ");
    if (words.length >= 3) {
      const last = words[words.length - 1], prev = words[words.length - 2];
      if (last.length <= 10 && last.length + prev.length <= 18) t = t.replace(/ (\S+)\s*$/, NB + "$1");
    }
    return t;
  }

  function h(tag, cls, parent, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = glue(text);
    if (parent) parent.appendChild(n);
    return n;
  }
  // Scene choreography is authored on a base length; the returned `at(x)` stretches it to the real section length.
  function clock(section, base) {
    const k = Math.min(1.7, Math.max(0.8, section.dur / base));
    return (x) => section.start + x * k;
  }
  // Typewriter via proxy tween (text is a pure function of tween progress, so seeking works).
  function type(el, text, at, dur) {
    const p = { n: 0 };
    el.textContent = "";
    tl.to(p, { n: text.length, duration: dur, ease: "none", onUpdate: () => { el.textContent = text.slice(0, Math.round(p.n)); } }, at);
  }
  const fadeUp = (el, at, d = 0.45, y = 24) => tl.fromTo(el, { opacity: 0, y }, { opacity: 1, y: 0, duration: d, ease: "power2.out" }, at);
  const pop = (el, at) => tl.fromTo(el, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, at);
  const wipe = (el, at, d = 0.6) => tl.fromTo(el, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: d, ease: "power2.inOut" }, at);
  const out = (el, at) => tl.to(el, { opacity: 0, y: -20, duration: 0.4, ease: "power1.in" }, at);
  const show = (el, at) => tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.01 }, at);

  // Widgets inject their CSS at the top of <head> so theme.css (linked later) can override it.
  function css(text) {
    const s = document.createElement("style");
    s.textContent = text;
    document.head.insertBefore(s, document.head.firstChild);
  }

  // Registry: widget files call ExplainerKit.register(kind, fn); fn(card, scene, at) builds one scene's card.
  const widgets = {};
  const register = (kind, fn) => { widgets[kind] = fn; };
  // Theme signature hooks (files in widgets/ named intro-*.js, transition-*.js, caption-*.js, outro-*.js):
  //   intro(stage, ctx) / outro(stage, ctx): ctx = { S, T, s: section, at: clock(s, base), titleBox }
  //   transition(root, s): exit (and optional entry) of one scene root, timed on its section s
  //   caption(band, lines, T): lines = [{ words: [{w, t0, t1}], t0, t1 }] with show/hide times already computed
  const hooks = { intro: {}, outro: {}, transition: {}, caption: {} };
  const registerHook = (type, kind, fn) => { hooks[type][kind] = fn; };
  function hook(type, kind) {
    const fn = hooks[type][kind];
    if (!fn) throw new Error(`Unknown ${type} "${kind}". Installed: ${Object.keys(hooks[type]).join(", ")}`);
    return fn;
  }

  // Orphan audit: once fonts are in, every text block whose last line holds a single word is reported as a console error,
  // so `npx hyperframes check` fails and names the text to reword. It only measures layout; the video is unchanged.
  function auditWrap() {
    const stage = document.getElementById("stage");
    if (!stage) return;
    const found = [];
    stage.querySelectorAll("*").forEach((el) => {
      if (![...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) return;
      const words = [];
      const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let node = walk.nextNode(); node; node = walk.nextNode()) {
        const re = /\S+/g;
        for (let m = re.exec(node.data); m; m = re.exec(node.data)) {
          const r = document.createRange();
          r.setStart(node, m.index);
          r.setEnd(node, m.index + m[0].length);
          const box = r.getClientRects()[0];
          if (box && box.height > 0) words.push({ w: m[0], top: box.top, h: box.height });
        }
      }
      if (words.length < 3) return;
      const lines = [];
      words.forEach((x) => {
        const cur = lines[lines.length - 1];
        if (cur && Math.abs(x.top - cur.top) < x.h * 0.5) cur.words.push(x.w);
        else lines.push({ top: x.top, words: [x.w] });
      });
      const last = lines[lines.length - 1];
      if (lines.length > 1 && last.words.length === 1) {
        const scene = el.closest(".scene");
        const idx = scene ? [...stage.children].indexOf(scene) : -1;
        found.push(`scene #${idx} .${el.className || el.tagName}: "${el.textContent.trim()}" -> last line "${last.words[0]}"`);
      }
    });
    found.forEach((f) => console.error(`[text-wrap] lonely last word, reword or shorten: ${f}`));
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => requestAnimationFrame(auditWrap));

  // Output language (script.json `language`): "en" switches number formats and the few built-in labels; "vi" and
  // "mixed" keep the Vietnamese ones. num() = locale-formatted number, say(vi, en) = pick the built-in label.
  const lang = window.SCRIPT && window.SCRIPT.language === "en" ? "en" : "vi";
  const num = (v, d = 0) => v.toLocaleString(lang === "en" ? "en-US" : "vi-VN", { minimumFractionDigits: d, maximumFractionDigits: d });
  const say = (vi, en) => (lang === "en" ? en : vi);

  window.ExplainerKit = { tl, h, glue, lang, num, say, clock, type, fadeUp, pop, wipe, out, show, css, widgets, register, registerHook, hook, theme: window.THEME || {} };
})();
