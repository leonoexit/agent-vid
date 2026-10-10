/* canvas-painter.js: the one place that turns "write this / draw that at time t" into DOM + tweens + a pen move (window.CPaint).
 * Everything that writes or draws goes through the painter, so the pen can only be on one stroke at a time: a request that
 * comes while the pen is busy starts when it is free (visuals and pen shift together and never disagree).
 * Geometry that depends on fonts (text widths) is re-fitted by the registered `fits` once fonts are loaded; tweens only
 * ever animate clip-path / dashoffset / colour / opacity, never a size.
 * Strokes are brush strokes: a filled outline whose width changes along the line ("taper" = thick root to thin tip for
 * branches, "press" = thin in, full, thin out for rings / arrows / strikes), shown through a mask whose centre line is drawn
 * on with stroke-dashoffset, so the ink appears exactly where the pen tip is. path() returns that centre line. */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const PEN_GAP = 0.05;

  function create(kit, world, rig) {
    const fits = [];
    const busy = []; // reserved pen intervals [a, b], any build order
    let brushes = 0;
    // one hidden path used to sample any centre line (getPointAtLength needs a rendered SVG element)
    const sampler = (() => {
      const s = document.createElementNS(NS, "svg");
      s.setAttribute("style", "position:absolute;width:0;height:0;visibility:hidden");
      const q = document.createElementNS(NS, "path");
      s.append(q);
      document.body.append(s);
      return q;
    })();
    const stat = { lastEnd: 0, mark: Infinity }; // latest pen end so far; earliest start since the last reset (parts / scenes read these)
    const tl = kit.tl;
    /** first start >= t0 where the pen is free for d seconds (requests are placed by time, not by build order) */
    const claim = (t0, d) => {
      let t = t0;
      for (const [a, b] of [...busy].sort((x, y) => x[0] - y[0])) if (t < b && t + d + PEN_GAP > a) t = b;
      busy.push([t, t + d + PEN_GAP]);
      stat.lastEnd = Math.max(stat.lastEnd, t + d);
      stat.mark = Math.min(stat.mark, t);
      return t;
    };

    /** a div with a class, optional inner html and inline style, appended to parent */
    function h(cls, html = "", parent, style = {}) {
      const e = document.createElement("div");
      e.className = cls;
      if (html) e.innerHTML = html;
      Object.assign(e.style, style);
      parent?.append(e);
      return e;
    }
    /** an absolutely positioned (x, y) box holding an svg whose user units are world pixels */
    function svg(parent, x = 0, y = 0) {
      const box = h("psvg-box", "", parent, { position: "absolute", left: `${x}px`, top: `${y}px`, width: "0", height: "0" });
      const s = document.createElementNS(NS, "svg");
      s.setAttribute("class", "psvg");
      s.setAttribute("width", "1");
      s.setAttribute("height", "1");
      box.append(s);
      s.box = box;
      return s;
    }
    /** a plain stroke (cls "ghost": dashed rings) or a brush stroke (cls "draw", see the header); set its shape with setD() */
    function path(s, d, { color = "var(--ink)", width = 7, cls = "draw", brush = "press" } = {}) {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("class", cls);
      if (cls !== "draw") {
        p.setAttribute("stroke", color);
        p.setAttribute("stroke-width", String(width));
        s.append(p);
        setD(p, d);
        return p;
      }
      const id = `brush-${++brushes}`;
      const mask = document.createElementNS(NS, "mask");
      mask.setAttribute("id", id);
      p.setAttribute("pathLength", "1");
      p.setAttribute("stroke", "#fff");
      p.setAttribute("stroke-width", String(width * 2.4 + 8)); // wider than the brush everywhere, so the mask front is the pen
      mask.append(p);
      const rib = document.createElementNS(NS, "path");
      rib.setAttribute("fill", color);
      rib.setAttribute("mask", `url(#${id})`);
      s.append(mask, rib);
      p.brush = { rib, width, profile: brush };
      setD(p, d);
      return p;
    }
    /** a filled brush shape with no draw-on (ghost branches: the faint map that is there from the start) */
    function shape(s, d, { color = "var(--ghost)", width = 6, brush = "taper" } = {}) {
      const rib = document.createElementNS(NS, "path");
      rib.setAttribute("fill", color);
      rib.setAttribute("class", "ghost-fill");
      s.append(rib);
      rib.brush = { rib, width, profile: brush, shapeOnly: true };
      setD(rib, d);
      return rib;
    }
    /** new centre line for a stroke; its brush outline follows */
    function setD(p, d) {
      if (!p.brush?.shapeOnly) p.setAttribute("d", d);
      if (p.brush) p.brush.rib.setAttribute("d", CG.ribbon(sampler, d, p.brush.profile, p.brush.width));
    }

    /** draw a path on in one pen move; the pen tip rides the same eased progress. Returns the start time actually used. */
    function ink(p, s, t0, d = 0.7, ease = "power2.inOut") {
      const t = claim(t0, d);
      tl.set(p, { opacity: 1 }, t); // hidden until its pen move starts (a zero-length dash would leave a dot)
      tl.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, ease, immediateRender: false }, t);
      rig.penSeg({
        t0: t, t1: t + d, ease, wobble: false,
        at: (u) => {
          // length read live: a ring is re-fitted when the fonts load, so a cached length would go stale
          const o = CP.worldPos(s.box, world), q = p.getPointAtLength(p.getTotalLength() * u);
          return { x: o.x + q.x, y: o.y + q.y };
        },
      });
      return t;
    }

    /** reveal a text span left to right under the pen; returns the start time actually used */
    function write(span, t0, d) {
      const dur = d ?? Math.min(1.1, Math.max(0.35, span.textContent.length * 0.036));
      const t = claim(t0, dur);
      tl.fromTo(span, { clipPath: "inset(-15% 101% -15% -3%)" }, { clipPath: "inset(-15% -3% -15% -3%)", duration: dur, ease: "none", immediateRender: false }, t);
      rig.penSeg({
        t0: t, t1: t + dur, wobble: true,
        at: (u) => {
          const o = CP.worldPos(span, world);
          return { x: o.x + u * span.offsetWidth, y: o.y + span.offsetHeight * 0.84 };
        },
      });
      span.style.clipPath = "inset(-15% 101% -15% -3%)";
      tl.set(span, { clipPath: "inset(-15% 101% -15% -3%)" }, 0);
      return t;
    }
    /** same wipe for a span that lives in screen space (stickies): pen position is a screen point */
    function writeScreen(span, t0, d) {
      const dur = d ?? Math.min(1.1, Math.max(0.35, span.textContent.length * 0.036));
      const t = claim(t0, dur);
      tl.fromTo(span, { clipPath: "inset(-15% 101% -15% -3%)" }, { clipPath: "inset(-15% -3% -15% -3%)", duration: dur, ease: "none", immediateRender: false }, t);
      rig.penSeg({
        t0: t, t1: t + dur, wobble: true,
        at: (u) => {
          // layout position inside the (rotated) sticky, then rotated about the sticky's top-centre like its CSS transform
          const overlay = document.getElementById("overlay"), note = span.closest(".sticky");
          const o = CP.worldPos(span, overlay), n = CP.worldPos(note, overlay);
          const px = o.x + u * span.offsetWidth, py = o.y + span.offsetHeight * 0.84;
          const a = (parseFloat(note.dataset.rot || "0") * Math.PI) / 180, ox = n.x + note.offsetWidth / 2, oy = n.y;
          const dx = px - ox, dy = py - oy;
          return { screen: true, x: ox + dx * Math.cos(a) - dy * Math.sin(a), y: oy + dx * Math.sin(a) + dy * Math.cos(a) };
        },
      });
      span.style.clipPath = "inset(-15% 101% -15% -3%)";
      tl.set(span, { clipPath: "inset(-15% 101% -15% -3%)" }, 0);
      return t;
    }

    /** a text line: container (.tx) with an inner span that is the thing being written */
    function text(parent, str, { x = 0, y = 0, w = 560, align = "c", cls = "", size, color } = {}) {
      const box = h(`tx ${align} ${cls}`, `<span>${MotionKit.richText(str)}</span>`, parent, { left: `${x}px`, top: `${y}px`, width: `${w}px` });
      if (size) box.style.fontSize = `${size}px`;
      if (color) box.style.color = color;
      return box.firstChild;
    }

    /** a line icon (Lucide) at (x, y), `size` px square, tinted `color`; draw-on children carry class "draw" */
    function icon(parent, name, { x = 0, y = 0, size = 44, color = "var(--ink)", sw = 2 } = {}) {
      const inner = (window.MORPH_ICONS || {})[name];
      if (!inner) throw new Error(`[canvas] unknown icon "${name}" (theme.json icons.names)`);
      const wrap = h("ico-box", "", parent, { position: "absolute", left: `${x}px`, top: `${y}px`, width: `${size}px`, height: `${size}px`, color });
      wrap.innerHTML = `<svg class="ico" viewBox="0 0 24 24" width="${size}" height="${size}" style="stroke-width:${sw}">${inner.replace(/<(\w+) /g, '<$1 class="draw" ')}</svg>`;
      return wrap;
    }
    const drawIcon = (wrap, t, d = 0.4) => {
      const parts = [...wrap.querySelectorAll(".draw")];
      tl.set(parts, { opacity: 1 }, t);
      tl.fromTo(parts, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, ease: "power2.out", stagger: 0.04, immediateRender: false }, t);
    };

    const relayout = () => fits.forEach((f) => f());
    const fit = (fn) => { fits.push(fn); fn(); };

    return { h, svg, path, shape, setD, ink, write, writeScreen, text, icon, drawIcon, fit, relayout, claim, stat, kit, world, rig };
  }

  window.CPaint = { create };
})();
