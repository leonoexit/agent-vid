// Narrated explainer engine: builds the DOM from window.SCRIPT and one seekable timeline timed by window.PLAN
// (section starts/durations + word timings, see sync-narration.py). Fixed zones reused by every scene:
// title block, main card (drawn by a registered widget), "before" note, "after" note, mascot, caption band.
// Each theme picks its own signature from window.THEME: intro, scene transition, caption style, outro (hook files
// widgets/intro-*.js, transition-*.js, caption-*.js, outro-*.js); defaults are the robot-sketch ones.
(function () {
  const K = window.ExplainerKit;
  const { tl, h, clock, fadeUp, wipe } = K;
  const T = Object.assign({ titleImage: null, poses: { intro: "map", outro: "cheer" }, captionHighlight: "#a24d15",
    intro: "terminal", transition: "rise", caption: "pill", outro: "plank" }, K.theme);
  const S = window.SCRIPT;
  const P = window.PLAN;
  const sec = (id) => P.sections.find((x) => x.id === id);
  const stage = document.getElementById("stage");

  function titleBox(parent, text, badge) {
    const wrap = h("div", "title-box", parent);
    if (T.titleImage) h("img", "title-img", wrap).src = T.titleImage;
    h("div", "title-text", wrap, text);
    if (badge) h("div", "badge", parent, badge);
    return wrap;
  }

  // ---------- intro ----------
  const si = sec("intro");
  K.hook("intro", T.intro)(stage, { S, T, s: si, at: clock(si, 7), titleBox });

  // ---------- scenes ----------
  const transition = K.hook("transition", T.transition);
  S.scenes.forEach((sc, i) => {
    const s = sec(`scene-${i + 1}`);
    const at = clock(s, 8);
    const root = h("div", `scene layout-${sc.layout || T.layout || "notes"}`, stage);
    K.show(root, s.start);
    const title = h("div", "scene-title", root);
    titleBox(title, sc.title, `${i + 1}/${S.scenes.length}`);
    tl.fromTo(title, { opacity: 0, y: -60, rotation: -3 }, { opacity: 1, y: 0, rotation: 0, duration: 0.55, ease: "back.out(1.6)" }, s.start);

    const card = h("div", "card", root);
    tl.fromTo(card, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }, at(0.45));
    const w = sc.widget || {};
    if (sc.prop) {
      const prop = h("img", `prop prop-${w.kind}`, card);
      prop.src = `assets/prop-${sc.prop}.png`;
      fadeUp(prop, at(0.8), 0.5, 12);
    }
    const build = K.widgets[w.kind];
    if (!build) throw new Error(`Unknown widget kind "${w.kind}" in scene ${i + 1}. Installed: ${Object.keys(K.widgets).join(", ")}`);
    build(card, sc, at);

    const before = h("div", "note note-before", root);
    h("div", "note-label", before, S.labels.before);
    h("div", "note-text", before, sc.before);
    wipe(before, at(4.2));
    const after = h("div", "note note-after", root);
    h("div", "note-label accent", after, S.labels.after);
    h("div", "note-text", after, sc.after);
    wipe(after, at(5.2));
    const m = h("img", "mascot scene-mascot", root);
    m.src = `assets/mascot-${sc.pose}.png`;
    tl.fromTo(m, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.6)" }, at(4.9));
    transition(root, s);
  });

  // ---------- outro ----------
  const so = sec("outro");
  K.hook("outro", T.outro)(stage, { S, T, s: so, at: clock(so, 7), titleBox });

  // ---------- captions: narration words -> lines of <= 30 chars with show/hide times; no narration -> none ----------
  const band = h("div", `captions captions-${T.caption}`, stage);
  const MAX_CHARS = 30;
  const lines = [];
  P.sections.forEach((s) => {
    let line = [];
    const own = [];
    s.words.forEach((w) => {
      const len = line.reduce((a, x) => a + x.w.length + 1, 0);
      if (line.length && len + w.w.length > MAX_CHARS) { own.push(line); line = []; }
      line.push(w);
    });
    if (line.length) own.push(line);
    // No orphan: a one-word last line borrows the previous line's last word.
    const n = own.length;
    if (n > 1 && own[n - 1].length === 1 && own[n - 2].length > 2) own[n - 1].unshift(own[n - 2].pop());
    own.forEach((ln, k) => {
      const t0 = ln[0].t0 - 0.12;
      const t1 = k + 1 < own.length ? own[k + 1][0].t0 - 0.12 : ln[ln.length - 1].t1 + 0.35;
      lines.push({ words: ln, t0, t1 });
    });
  });
  if (lines.length) K.hook("caption", T.caption)(band, lines, T);

  window.ExplainerTimeline = tl;
})();
