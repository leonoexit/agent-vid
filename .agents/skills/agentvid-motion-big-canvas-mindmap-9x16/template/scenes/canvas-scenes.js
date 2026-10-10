/* canvas-scenes.js: the three scene types of the big-canvas mind map, registered with MotionKit.registerScene.
 *   hook    a sticky note asks the question, the hub is inked in; ghost branches already hang around it
 *   branch  the camera travels to one node, the pen draws its curve + ring, then writes the parts under it
 *   recap   the camera pulls back to the whole map; a sticky lists the points, a second one carries the closing line
 * The scenes only describe WHAT happens on the map; layout, camera and pen are shared (canvas-world / canvas-pen / canvas-painter).
 * CanvasScenes.state is filled by canvas-main before MotionKit.buildStoryboard runs. */
(function () {
  const VIS = { top: 360, bottom: 1620 }; // TikTok + Reels safe box (portrait-9x16-universal)
  const S = { state: null };
  const st = () => S.state;

  /** a sticky note in screen space: lines of text written under the pen, popped in at t */
  function sticky(P, tl, { lines, x, y, w, rot = -3, big = false, cls = "", head, t, writeAt }) {
    const overlay = document.getElementById("overlay");
    const el = P.h(`sticky ${big ? "big" : ""} ${cls}`, "", overlay, { left: `${x}px`, top: `${y}px`, width: `${w}px` });
    el.dataset.rot = String(rot);
    if (head) P.h("head", `<span>${MotionKit.richText(head)}</span>`, el);
    const spans = lines.map((l) => {
      const row = P.h("sl", `<span>${MotionKit.richText(l)}</span>`, el);
      return row.firstChild;
    });
    gsap.set(el, { rotation: rot, autoAlpha: 0 });
    tl.fromTo(el, { autoAlpha: 0, scale: 0.7, rotation: rot - 6 }, { autoAlpha: 1, scale: 1, rotation: rot, duration: 0.45, ease: "back.out(1.8)", immediateRender: false }, t);
    return { el, spans, ready: t + 0.5 }; // text is written only once the note has settled (the pen maths ignores the pop scale)
  }

  MotionKit.registerScene("hook", (el, spec, c) => {
    const { P, L, board, rig, kit } = st();
    st().curveSet = CWORLD.buildCurves(P, L, board);
    CWORLD.buildRoot(P, board, L, c);
    rig.camKey({ t: 0, cx: 0, cy: -30, s: 0.9 });
    const sk = spec.sticky;
    if (sk) {
      const lines = (sk.lines || [sk.text]).map((l) => (typeof l === "string" ? { text: l } : l));
      const note = sticky(P, kit.tl, { lines: lines.map((l) => l.text), x: 80, y: 400, w: 560, t: c.start + 0.15 });
      note.spans.forEach((sp, i) => P.writeScreen(sp, Math.max(note.ready, c.at(lines[i].at, c.start + 0.7 + i * 0.8))));
      kit.tl.to(note.el, { autoAlpha: 0, y: -50, duration: 0.5, ease: "power2.in" }, c.end - 0.6);
    }
  });

  MotionKit.registerScene("branch", (el, spec, c) => {
    const { P, L, rig, curveSet } = st();
    const info = L.nodes[spec.id];
    const r = CWORLD.buildNode(P, L, curveSet, spec, c);
    if (P.stat.lastEnd > c.end - 0.6) // the last words must be readable before the camera moves on
      console.warn(`[canvas] ${spec.id}: the pen finishes ${(P.stat.lastEnd - c.end).toFixed(1)} s from the scene end (needs <= -0.6): anchor the last items on earlier words or cut parts`);
    const arrive = Math.max(c.start + 1.0, Math.min(r.nodeT + 0.3, c.start + 2.4));
    if (info.upward) {
      // node next to the hub at the bottom of the view, the content above it; a group taller than the safe box looks up
      // while its top parts are written and comes back down for the last one (the point, next to the node)
      const low = info.top + info.H + 30 - (VIS.bottom - rig.SCREEN.cy), high = info.top - 30 - (VIS.top - rig.SCREEN.cy);
      rig.camKey({ t: arrive, d: Math.min(2.0, arrive - c.start), cx: info.gx, cy: low, s: 1 });
      if (high < low) {
        const content = r.drops.filter((d) => d.kind !== "nodeSub");
        if (content.length) {
          rig.camKey({ t: content[0].t + 0.6, d: 1.0, cx: info.gx, cy: high, s: 1, ease: "power2.inOut" });
          rig.camKey({ t: content.at(-1).t + 0.6, d: 1.0, cx: info.gx, cy: low, s: 1, ease: "power2.inOut" });
        }
      }
      return;
    }
    let cy = info.labelY + 420;
    rig.camKey({ t: arrive, d: Math.min(2.0, arrive - c.start), cx: info.gx, cy, s: 1 });
    // content that would fall below the safe box makes the camera drift down as that part starts
    for (const d of r.drops) {
      const seen = cy + (VIS.bottom - rig.SCREEN.cy);
      if (d.bottom + 40 > seen) {
        cy = d.bottom + 40 - (VIS.bottom - rig.SCREEN.cy);
        rig.camKey({ t: d.t + 0.8, d: 1.0, cx: info.gx, cy, s: 1, ease: "power2.inOut" });
      }
    }
  });

  MotionKit.registerScene("recap", (el, spec, c) => {
    const { P, L, rig, kit } = st();
    // the whole map inside the safe box: centre of the box = (VIS.top + VIS.bottom) / 2
    const b = L.bounds, fit = Math.min(1000 / (b.maxX - b.minX), (VIS.bottom - VIS.top) / (b.maxY - b.minY));
    const mid = (VIS.top + VIS.bottom) / 2 - rig.SCREEN.cy;
    rig.camKey({ t: c.start + 2.4, d: 2.4, cx: (b.minX + b.maxX) / 2, cy: (b.minY + b.maxY) / 2 - mid / fit, s: fit, ease: "power2.inOut" });
    const sk = spec.sticky || {};
    const items = (sk.items || []).map((i) => (typeof i === "string" ? { text: i } : i));
    let listEnd = c.start;
    let note = null;
    if (items.length) {
      note = sticky(P, kit.tl, { lines: items.map((i) => i.text), x: 120, y: 430, w: 680, big: false, cls: "list", head: sk.head, rot: -2, t: c.start + 2.6 });
      note.spans.forEach((sp, i) => P.writeScreen(sp, Math.max(note.ready, c.at(items[i].at, c.start + 3.4 + i * 1.2))));
      listEnd = P.stat.lastEnd;
    }
    if (sk.closing) {
      // the closing line waits for the list to be written, then replaces it
      const t = Math.max(c.at(sk.closing.at, c.end - 5), listEnd + 0.7);
      const lines = sk.closing.lines, need = lines.length * 1.1 + 0.8;
      if (t + need > kit.T.duration - 1.0) console.warn(`[canvas] ${spec.id}: the closing sticky needs until ${(t + need).toFixed(1)} s but the video ends at ${kit.T.duration} s: raise duration or shorten the list`);
      if (note) kit.tl.to(note.el, { autoAlpha: 0, y: -40, duration: 0.4, ease: "power2.in" }, t - 0.5);
      const closing = sticky(P, kit.tl, { lines, x: 116, y: 640, w: 706, big: true, rot: 2, t: t - 0.3 }); // w = content width (+68 padding); rotated corners stay inside x 80-900
      closing.spans.forEach((sp, i) => P.writeScreen(sp, closing.ready + i * 0.9));
    }
  });

  window.CanvasScenes = S;
})();
