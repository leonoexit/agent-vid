/* canvas-main.js: wires the big-canvas mind map. Builds the camera/pen rig and the painter, lays the map out from the storyboard,
 * lets MotionKit build the scenes (each scene adds its part of the map and its camera keys), then installs the single driver
 * tween that moves camera and pen from the clock. Call CanvasTheme.build(kit). */
(function () {
  const TONES = ["ink", "blue", "teal", "purple", "magenta", "orange", "green", "brown", "red"];
  const NEEDS = { list: "items", chips: "items", cards: "items", tree: "levels", loop: "steps" };

  /** the documented limits (storyboard-reference.md), as errors that name the scene instead of a TypeError deep in a builder */
  function validateBoard(board, T) {
    const fail = (id, msg) => { throw new Error(`[canvas] ${id}: ${msg}`); };
    const scenes = board.scenes || [];
    if (!scenes.length || scenes[0].type !== "hook") fail(scenes[0]?.id || "storyboard", 'the first scene must be type "hook"');
    if (scenes.at(-1).type !== "recap") fail(scenes.at(-1).id, 'the last scene must be type "recap"');
    if (!board.root?.label) fail("storyboard", "root.label is missing (the hub)");
    scenes.filter((s) => !T.scenes[s.id]).forEach((s) => console.warn(`[canvas] ${s.id}: no voice in script.json, the scene is skipped`));
    const branches = scenes.filter((s) => s.type === "branch" && T.scenes[s.id]);
    if (branches.length < 2 || branches.length > 10) console.warn(`[canvas] ${branches.length} branches: the map reads best with 6-10`);
    for (const s of branches) {
      const n = s.node;
      if (!n?.label) fail(s.id, "node.label is missing");
      if (n.label.length > 12) console.warn(`[canvas] ${s.id}: label "${n.label}" is over 12 characters (the ring gets wide)`);
      if (!TONES.includes(n.tone || "ink")) fail(s.id, `unknown node.tone "${n.tone}" (${TONES.join(", ")})`);
      (s.parts || []).forEach((p, i) => {
        if (!CPARTS.kinds[p.kind]) fail(s.id, `parts[${i}]: unknown kind "${p.kind}" (${Object.keys(CPARTS.kinds).join(", ")})`);
        const key = NEEDS[p.kind];
        if (key && (!Array.isArray(p[key]) || !p[key].length)) fail(s.id, `parts[${i}] (${p.kind}): "${key}" must be a non-empty array`);
        if (p.kind === "loop" && (p.steps.length < 3 || p.steps.length > 5)) fail(s.id, `parts[${i}] (loop): 3-5 steps, got ${p.steps.length}`);
        if (p.kind === "tree" && p.levels.some((l) => !Array.isArray(l) || !l.length)) fail(s.id, `parts[${i}] (tree): every level needs items`);
        if (p.tone && !TONES.includes(p.tone)) fail(s.id, `parts[${i}]: unknown tone "${p.tone}"`);
        (p.items || []).forEach((it) => { if (it.tone && !TONES.includes(it.tone)) fail(s.id, `parts[${i}]: unknown item tone "${it.tone}"`); });
      });
    }
  }

  function build(kit) {
    const { $, tl } = kit;
    const board = window.STORYBOARD;
    const world = $("#world"), pen = $("#pen");
    const rig = CP.create(kit, { world, pen });
    const P = CPaint.create(kit, world, rig);
    validateBoard(board, kit.T);
    const L = CWORLD.layout(board, kit.T.scenes);
    CanvasScenes.state = { kit, rig, P, L, board, curveSet: null };

    MotionKit.buildStoryboard(kit, {
      host: "#stage",
      transitions: { none: () => {} },
      outro: () => {},
      pickTransition: () => "none",
    });

    // text widths decide ring sizes: re-fit once the fonts are in (geometry only, no tween reads a size)
    let fitted = false;
    kit.onFrame = () => {
      if (!fitted && document.fonts && document.fonts.status === "loaded") { fitted = true; P.relayout(); }
    };
    if (document.fonts) document.fonts.ready.then(() => { fitted = true; P.relayout(); });
    rig.install();
    kit.finish({ fadeOut: 1.2, fadeIn: 0.4 });
  }
  window.CanvasTheme = { build };
})();
