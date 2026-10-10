/* canvas-world.js: the map layout and the node builder (window.CWORLD).
 * layout(board): every `branch` scene becomes a group left or right of the hub, in rows (row 0 is the first row under the
 * hub, negative rows sit above it). A group below the hub has its node on top and the content under it; a group above the
 * hub has its node at the bottom, next to the hub, and the content above it, so every group grows away from the hub.
 * Group heights come from the parts' fixed heights, so the whole map is known before any text is measured.
 * Branches: each one leaves the hub ring at its own point (fanned out by row), the nearest row on a side goes straight to
 * its ring in one S-curve, farther rows run down / up their own lane outside the nearer groups (lanes nested by distance),
 * and every branch enters its ring at the outer corner facing the hub, diagonally. Brush: thick at the hub, thin at the node.
 * buildNode() draws one group: ghost ring + label (there from the start), the branch, the coloured ring, then the parts.
 * World origin = the hub centre. */
(function () {
  const { ellipse, hash } = window.CG;
  const { GW, kinds } = window.CPARTS;
  const GX = 300;          // centre of a left / right group: x = -GX / +GX
  const NODE_H = 138;      // ring block: ring + label; the sub line sits right under it
  const NODE_CY = 62;      // label centre inside the ring block
  const GAP = 24, ROW_GAP = 110, ROOT_RY = 78;
  const LABEL = 74, HUB_RY = LABEL / 2 + 24, NODE_RY = LABEL / 2 + 22;
  const LANE0 = 640, LANE_STEP = 62;                    // |x| of the first outer lane, distance between nested lanes
  const BRANCH_W = 20, RING_W = 10, HUB_W = 11;         // brush widths (max) of branch, node ring, hub ring
  const CP_ROOT = { rx: 0 }; // the hub's measured ring half-width, shared with the branch curves
  const estRx = (s) => String(s).length * 19 + 62;
  const r1 = (n) => Math.round(n * 10) / 10;

  /** the parts of a branch scene, with node.sub / node.note turned into parts */
  function partsOf(spec) {
    const n = spec.node, out = [];
    if (n.sub) out.push({ kind: "sub", text: n.sub, at: n.subAt, nodeSub: true }); // the line under the ring, not a content part
    out.push(...(spec.parts || []));
    if (n.note) out.push({ kind: "note", text: n.note, at: n.noteAt, strike: n.strike, strikeAt: n.strikeAt }); // the point comes last, as it is said
    return out;
  }

  /** y of every part and of the ring block inside a group, and the group height. Below the hub: ring block, sub, content.
   *  Above the hub: content (top to bottom, same order), ring block, sub. */
  function place(spec, upward) {
    const parts = partsOf(spec), ys = new Array(parts.length);
    let y = upward ? 0 : NODE_H, ringTop = 0;
    if (upward) {
      parts.forEach((p, i) => { if (!p.nodeSub) { ys[i] = y; y += kinds[p.kind].h(p) + GAP; } });
      ringTop = y;
      y = ringTop + NODE_H;
      parts.forEach((p, i) => { if (p.nodeSub) { ys[i] = y; y += kinds[p.kind].h(p) + GAP; } });
    } else parts.forEach((p, i) => { ys[i] = y; y += kinds[p.kind].h(p) + GAP; });
    return { parts, ys, ringTop, H: y - GAP + 10 };
  }

  function layout(board, voiced) {
    // scenes without a voice are not built by the storyboard, so they are not laid out either
    const branches = board.scenes.filter((s) => s.type === "branch" && (!voiced || voiced[s.id]));
    const items = branches.map((s, i) => {
      const side = (s.node.side || (i % 2 === 0 ? "left" : "right")) === "left" ? -1 : 1;
      const row = s.node.row ?? Math.floor(i / 2) - Math.floor(branches.length / 4); // balanced around the hub unless set
      return { id: s.id, spec: s, side, row, upward: row < 0, ...place(s, row < 0) };
    });
    const slots = {};
    for (const it of items) {
      const key = `${it.side < 0 ? "left" : "right"} row ${it.row}`;
      if (slots[key]) throw new Error(`[canvas] ${slots[key]} and ${it.id} are both at ${key}: set node.side / node.row`);
      slots[key] = it.id;
    }
    const rows = [...new Set(items.map((i) => i.row))].sort((a, b) => a - b);
    const rowH = Object.fromEntries(rows.map((r) => [r, Math.max(...items.filter((i) => i.row === r).map((i) => i.H))]));
    const top = {};
    let y = ROOT_RY + ROW_GAP;
    rows.filter((r) => r >= 0).forEach((r) => { top[r] = y; y += rowH[r] + ROW_GAP; });
    let up = -ROOT_RY - ROW_GAP;
    rows.filter((r) => r < 0).reverse().forEach((r) => { top[r] = up - rowH[r]; up = top[r] - ROW_GAP; });
    // fan: rank of each branch away from the hub on its side and direction; start angles spread within each half
    const rank = (it) => (it.row < 0 ? -it.row - 1 : it.row);
    const maxRank = (side, upward) => Math.max(0, ...items.filter((i) => i.side === side && i.upward === upward).map(rank));
    const nodes = {};
    for (const it of items) {
      // groups above the hub align on the row's bottom (nodes next to the hub), groups below on the row's top
      const t = it.upward ? top[it.row] + rowH[it.row] - it.H : top[it.row];
      const k = rank(it), step = Math.min(15, 36 / Math.max(1, maxRank(it.side, it.upward)));
      const deg = it.upward ? 218 - step * k : 142 + step * k; // left side, y down: 180 = left, 218 = upper-left, 142 = lower-left
      nodes[it.id] = { gx: it.side * GX, top: t, H: it.H, side: it.side, row: it.row, upward: it.upward, rank: k,
        startDeg: it.side < 0 ? deg : 180 - deg, ys: it.ys, ringTop: it.ringTop, labelY: t + it.ringTop + NODE_CY, spec: it.spec };
    }
    const all = Object.values(nodes);
    const track = LANE0 + LANE_STEP * Math.max(0, ...all.map((n) => n.rank - 1)) + 40; // outermost lane + brush
    const bounds = {
      minX: -track, maxX: track,
      minY: Math.min(-ROOT_RY, ...all.map((n) => n.top)) - 70, maxY: Math.max(ROOT_RY, ...all.map((n) => n.top + n.H)) + 70,
    };
    return { nodes, bounds, root: { x: 0, y: 0 } };
  }

  /** centre line of a branch: hub ring point -> (own lane) -> the node ring's outer corner, as SVG path data */
  function route(info, hubRx, nodeRx) {
    const side = info.side, th = (info.startDeg * Math.PI) / 180;
    const S = [hubRx * Math.cos(th), HUB_RY * Math.sin(th)];
    let nx = Math.cos(th) / hubRx, ny = Math.sin(th) / HUB_RY;
    const nl = Math.hypot(nx, ny); nx /= nl; ny /= nl;                       // outward normal of the hub ring
    const dir = info.labelY > 0 ? 1 : -1, ea = (40 * Math.PI) / 180;
    const E = [info.gx + side * (nodeRx + 4) * Math.cos(ea), info.labelY - dir * (NODE_RY + 2) * Math.sin(ea)];
    const tE = [-side * 0.5, dir * 0.866];                                   // travel direction when the brush reaches the ring
    const P = (p) => `${r1(p[0])},${r1(p[1])}`;
    if (info.rank === 0) { // nearest row: nothing to go around
      const d = Math.hypot(E[0] - S[0], E[1] - S[1]);
      return `M${P(S)} C${P([S[0] + nx * 0.45 * d, S[1] + ny * 0.45 * d])} ${P([E[0] - tE[0] * 0.45 * d, E[1] - tE[1] * 0.45 * d])} ${P(E)}`;
    }
    const lane = side * (LANE0 + LANE_STEP * (info.rank - 1)), span = Math.abs(E[1] - S[1]);
    const R1 = Math.min(320, span * 0.3), R2 = Math.min(280, span * 0.3);
    let A = [lane, S[1] + dir * R1], B = [lane, E[1] - dir * R2];
    if ((B[1] - A[1]) * dir <= 0) A = B = [lane, (S[1] + E[1]) / 2];
    const k1 = 0.6 * Math.abs(lane - S[0]), k2 = 0.55 * Math.hypot(E[0] - B[0], E[1] - B[1]);
    return `M${P(S)} C${P([S[0] + nx * k1, S[1] + ny * k1])} ${P([lane, A[1] - dir * 0.6 * Math.abs(A[1] - S[1])])} ${P(A)}` +
      (Math.abs(B[1] - A[1]) > 1 ? ` L${P(B)}` : "") +
      ` C${P([lane, B[1] + dir * k2])} ${P([E[0] - tE[0] * k2, E[1] - tE[1] * k2])} ${P(E)}`;
  }

  /** the hub: a label with a ghost ring that inks in at `at` */
  function buildRoot(P, board, L, c) {
    const label = board.root?.label || "";
    const grp = P.h("grp", "", P.world, { left: `${-GW / 2}px`, top: `${-NODE_CY}px`, width: `${GW}px`, height: "140px" });
    const sv = P.svg(grp, 0, 0);
    const ghost = P.path(sv, "M0,0", { cls: "ghost", width: 5 });
    ghost.setAttribute("stroke-dasharray", "14 12");
    const ring = P.path(sv, "M0,0", { color: `var(--t-${board.root?.tone || "ink"})`, width: HUB_W });
    const lab = P.h("nlabel", `<span>${MotionKit.richText(label)}</span>`, grp, { top: `${NODE_CY - LABEL / 2}px` });
    lab.firstChild.style.clipPath = "none";
    P.fit(() => {
      const w = lab.firstChild.offsetWidth || label.length * 38, rx = w / 2 + 58;
      CP_ROOT.rx = rx;
      P.setD(ghost, ellipse(GW / 2, NODE_CY, rx, HUB_RY, 11, { loops: 1, wob: 0.012 }));
      P.setD(ring, ellipse(GW / 2, NODE_CY, rx, HUB_RY, 11, { wob: 0.012 }));
    });
    const t = c.at(c.spec.rootAt, c.start + 0.9);
    const t1 = P.ink(ring, sv, t, 0.9, "power2.inOut");
    c.kit.tl.to(lab, { color: "var(--ink)", duration: 0.3, ease: "power1.out" }, t1 + 0.35);
    c.kit.tl.to(ghost, { opacity: 0, duration: 0.25 }, t1 + 0.5);
    return { grp, rootLabel: lab, tInked: t1 + 0.9 };
  }

  /** ghost branches for every node (a faint thin brush, there from the start) + the ink brushes drawn later */
  function buildCurves(P, L, board) {
    const sv = P.svg(P.world, 0, 0);
    const curves = {};
    for (const info of Object.values(L.nodes)) {
      const s = info.spec, d = route(info, estRx(board.root?.label || ""), estRx(s.node.label));
      const ghost = P.shape(sv, d, { width: 6 });
      const ink = P.path(sv, d, { color: `var(--t-${s.node.tone || "ink"})`, width: BRANCH_W, brush: "taper" });
      curves[s.id] = { ghost, ink };
    }
    return { sv, curves };
  }

  /** one branch group: ghost ring + label, ink branch, coloured ring, label turns ink, then the parts. Returns timing. */
  function buildNode(P, L, curveSet, spec, c) {
    const n = spec.node, info = L.nodes[spec.id], tl = c.kit.tl, tone = n.tone || "ink";
    const grp = P.h("grp", "", P.world, { left: `${info.gx - GW / 2}px`, top: `${info.top}px`, width: `${GW}px`, height: `${info.H}px` });
    const sv = P.svg(grp, 0, 0);
    const ringCy = info.ringTop + NODE_CY;
    const ghost = P.path(sv, "M0,0", { cls: "ghost", width: 5 });
    ghost.setAttribute("stroke-dasharray", "14 12");
    const ring = P.path(sv, "M0,0", { color: `var(--t-${tone})`, width: RING_W });
    const lab = P.h("nlabel", `<span>${MotionKit.richText(n.label)}</span>`, grp, { top: `${ringCy - LABEL / 2}px` });
    lab.firstChild.style.clipPath = "none";
    const badge = n.icon ? P.icon(grp, n.icon, { x: 0, y: ringCy - 24, size: 48, color: `var(--t-${tone})` }) : null;
    const cur = curveSet.curves[spec.id];
    P.fit(() => {
      const w = lab.firstChild.offsetWidth || String(n.label).length * 38, rx = w / 2 + 58;
      const cx = GW / 2, seed = hash(spec.id);
      P.setD(ghost, ellipse(cx, ringCy, rx, NODE_RY, seed, { loops: 1, wob: 0.012 }));
      P.setD(ring, ellipse(cx, ringCy, rx, NODE_RY, seed, { wob: 0.012 }));
      // the icon sits at the middle of the ring's outer side: the branch enters at the outer corner (above or below it)
      // and the gap between the left and right columns stays free
      if (badge) badge.style.left = `${info.side < 0 ? cx - rx - 64 : cx + rx + 16}px`;
      const d = route(info, CP_ROOT.rx || estRx(""), rx);
      P.setD(cur.ghost, d);
      P.setD(cur.ink, d);
    });

    const nodeT = c.at(n.at, c.start + 1.0);
    const curveT = Math.max(c.start + 0.1, nodeT - 1.0);
    const t1 = P.ink(cur.ink, curveSet.sv, curveT, 1.0, "power2.inOut");
    tl.to(cur.ghost, { opacity: 0, duration: 0.2 }, t1 + 1.0); // the faint branch is covered by the ink, then removed
    const t2 = P.ink(ring, sv, Math.max(nodeT, t1 + 0.9), 0.6, "power2.inOut");
    tl.to(lab, { color: "var(--ink)", duration: 0.3, ease: "power1.out" }, t2 + 0.3);
    tl.to(ghost, { opacity: 0, duration: 0.25 }, t2 + 0.5);
    if (badge) { P.drawIcon(badge, t2 + 0.2, 0.5); }

    // parts at their places in the group; each gets a share of the scene to fall back on (in speaking order)
    const parts = partsOf(spec);
    const totalH = parts.reduce((a, p) => a + kinds[p.kind].h(p), 0) || 1;
    const w0 = t2 + 0.7, w1 = Math.max(w0 + 1, c.end - 0.6);
    let acc = 0;
    const drops = [];
    parts.forEach((p, i) => {
      const k = kinds[p.kind], h = k.h(p), y = info.ys[i];
      P.stat.mark = Infinity;
      const a = w0 + ((w1 - w0) * acc) / totalH, b = w0 + ((w1 - w0) * (acc + h)) / totalH;
      const host = P.h("part", "", grp, { position: "absolute", left: "0px", top: `${y}px`, width: `${GW}px`, height: `${h}px` });
      k.build(P, host, p, {
        at: c.at, tone: p.tone || tone, seed: hash(`${spec.id}-${i}`), t0: a,
        seq: (j, m) => a + ((b - a) * j) / Math.max(1, m),
      });
      // when the pen REALLY starts on this part, and where the part sits (for the camera)
      drops.push({ kind: p.nodeSub ? "nodeSub" : p.kind, top: info.top + y, bottom: info.top + y + h, t: Number.isFinite(P.stat.mark) ? P.stat.mark : a });
      acc += h;
    });
    return { nodeT, tInked: t2 + 0.6, drops, info };
  }

  window.CWORLD = { layout, route, buildRoot, buildCurves, buildNode, NODE_CY, GW, GX };
})();
