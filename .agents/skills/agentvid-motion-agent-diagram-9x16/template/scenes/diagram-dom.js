/* diagram-dom.js: building blocks of the living node diagram (window.DG), drawn in the ink-paper look.
 * - node(): a rounded paper tile with an icon and a label; tone = main | green | blue | gold | plum.
 * - mainNode(): the main agent tile. Each diagram scene type has a fixed home (POS); when the previous scene also had
 *   the main tile, the new one starts at the old home and glides to its own, so cuts read as one continuous diagram.
 * - link(): a dashed pencil line between two points, revealed from the first point towards the second.
 * - bar(): a pencil-outlined track with a fill scaled 0..1.
 * Geometry is for the 1080x1920 canvas (this theme is 9:16 only); panel boxes live in layout.css. */
(function () {
  const { esc, h } = window.IK;
  const TONES = ["green", "blue", "gold", "plum"];
  // main tile home per scene type: centre x, y and tile size (px)
  const POS = {
    swarm: { x: 505, y: 690, s: 200 },
    gauge: { x: 190, y: 420, s: 150 },
    handoff: { x: 190, y: 410, s: 150 },
    "fan-out": { x: 505, y: 420, s: 170 },
    recap: { x: 505, y: 600, s: 200 },
  };
  const SPARK = `<svg viewBox="0 0 100 100"><path d="M50,4 C54,36 64,46 96,50 C64,54 54,64 50,96 C46,64 36,54 4,50 C36,46 46,36 50,4 Z" fill="currentColor" stroke="var(--ink)" stroke-width="4" stroke-linejoin="round"/></svg>`;
  const TICK = `<svg viewBox="0 0 100 100"><path d="M22,54 L42,72 L78,30" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const icon = (name = "braces") =>
    name === "spark" ? SPARK : `<span class="dn-glyph">${esc(name === "braces" ? "{ }" : name)}</span>`;
  const toneOf = (tone, i = 0) => tone || TONES[i % TONES.length];

  /** A diagram tile centred on (x, y) with side s. Starts hidden (.rv); the caller animates it in. */
  function node(parent, { x, y, s, tone = "main", icon: ic = "braces", label, cls = "" }) {
    const el = h("div", `dnode tone-${tone} ${cls} rv`, `<div class="dn-box">${icon(ic)}</div>${label ? `<div class="dn-label" data-layout-allow-overflow>${MotionKit.richText(label)}</div>` : ""}`, parent);
    // the main tile of the outgoing scene sits under the incoming one for the dissolve: intended overlap
    el.setAttribute("data-layout-allow-overlap", "");
    el.querySelectorAll("*").forEach((c) => c.setAttribute("data-layout-allow-overlap", ""));
    Object.assign(el.style, { left: `${x - s / 2}px`, top: `${y - s / 2}px`, width: `${s}px` });
    el.style.setProperty("--s", `${s}px`);
    return el;
  }

  const prevSpec = (ctx) => {
    const all = window.STORYBOARD.scenes;
    return all[all.findIndex((s) => s.id === ctx.sid) - 1];
  };

  /** The main agent tile at this scene type's home, gliding in from the previous scene's home when there was one. */
  function mainNode(el, spec, ctx) {
    const { kit } = ctx;
    const pos = POS[spec.type];
    const m = spec.main || {};
    const n = node(el, { ...pos, tone: "main", icon: m.icon || "spark", label: m.label ?? "Main agent", cls: "main" });
    const prev = prevSpec(ctx);
    const from = prev && POS[prev.type];
    if (from) {
      kit.tl.set(n, { autoAlpha: 1 }, ctx.start);
      kit.tl.fromTo(n, { x: from.x - pos.x, y: from.y - pos.y, scale: from.s / pos.s },
        { x: 0, y: 0, scale: 1, duration: 0.75, ease: "power3.inOut", immediateRender: false }, ctx.start);
    } else kit.pop(n, ctx.start + 0.1, { from: 0.5, d: 0.6 });
    return { el: n, ...pos };
  }

  /** Dashed pencil line from a to b ({x, y}), revealed from a towards b at time t. */
  function link(parent, a, b, t, kit, { tone = "ink", d = 0.5 } = {}) {
    const pad = 10 + 0.06 * Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y)); // room for the bow
    const x0 = Math.min(a.x, b.x) - pad, y0 = Math.min(a.y, b.y) - pad;
    const w = Math.abs(b.x - a.x) + pad * 2, hgt = Math.abs(b.y - a.y) + pad * 2;
    const ax = a.x - x0, ay = a.y - y0, bx = b.x - x0, by = b.y - y0;
    const mx = (ax + bx) / 2 + (by - ay) * 0.08, my = (ay + by) / 2 - (bx - ax) * 0.08; // slight hand-drawn bow
    const col = tone === "ink" ? "var(--ink)" : `var(--t-${tone})`;
    const wrap = h("div", "dlink rv", `<svg width="${w}" height="${hgt}" viewBox="0 0 ${w} ${hgt}"><path d="M${ax},${ay} Q${mx},${my} ${bx},${by}" fill="none" stroke="${col}" stroke-width="5" stroke-dasharray="14 12" stroke-linecap="round"/></svg>`, parent);
    Object.assign(wrap.style, { left: `${x0}px`, top: `${y0}px`, width: `${w}px`, height: `${hgt}px` });
    const horiz = Math.abs(b.x - a.x) >= Math.abs(b.y - a.y);
    const hidden = horiz ? (b.x >= a.x ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)") : (b.y >= a.y ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)");
    kit.tl.set(wrap, { autoAlpha: 1 }, t);
    kit.tl.fromTo(wrap, { clipPath: hidden }, { clipPath: "inset(0% 0% 0% 0%)", duration: d, ease: "power2.inOut", immediateRender: false }, t);
    return wrap;
  }

  /** Track + fill; returns { el, fill }. Fill starts empty (scaleX 0). */
  function bar(parent, cls = "", tone = "green") {
    const el = h("div", `dbar ${cls}`, `<div class="dbar-fill" style="background: var(--t-${tone})"></div>`, parent);
    const fill = el.firstChild;
    return { el, fill };
  }
  const fillTo = (kit, fill, t, v, d = 0.8, ease = "power2.out") =>
    kit.tl.fromTo(fill, { scaleX: 0 }, { scaleX: Math.max(0, Math.min(1, v)), duration: d, ease, immediateRender: false }, t);

  /** A small green tick badge on a tile's top-right corner at time t. */
  function doneBadge(tile, t, kit) {
    const b = h("div", "dbadge rv", TICK, tile);
    kit.pop(b, t, { from: 0.2 });
  }

  /** "Read" / "Grep" … tool tag with a stable colour per name. */
  const toolTag = (name) => {
    const k = [...String(name)].reduce((a, c) => a + c.charCodeAt(0), 0);
    return `<span class="dtool tone-${TONES[k % TONES.length]}">${esc(name)}</span>`;
  };

  /** list items may be plain strings: "text" -> { text } (a string's .at is a method, not an anchor) */
  const item = (x) => (typeof x === "string" ? { text: x } : x || {});

  window.DG = { item, POS, TONES, node, mainNode, link, bar, fillTo, doneBadge, toolTag, toneOf, icon };
})();
