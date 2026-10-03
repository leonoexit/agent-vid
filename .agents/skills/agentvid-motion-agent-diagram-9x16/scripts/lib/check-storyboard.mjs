// Static checks of data/storyboard.json against the scheduled voice, run by build-timeline before rendering:
// every storyboard scene has a voiced scene, types are known to the theme, and every word anchor is spoken.
// Warnings, not errors: the runtime falls back gracefully, but each warning is a visual beat that will drift.
import { normWord } from "./project-io.mjs";

/** Collects anchor values ("word", "word#2", { word }) from any `at` key, at any depth of a spec. */
function anchors(node, out = []) {
  if (Array.isArray(node)) node.forEach((n) => anchors(n, out));
  else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (k === "at") {
        if (typeof v === "string" || (v && typeof v === "object" && v.word)) out.push(v);
        else if (v && typeof v === "object") Object.values(v).forEach((x) => (typeof x === "string" || x?.word) && out.push(x));
      } else anchors(v, out);
    }
  }
  return out;
}

export function checkStoryboard(board, scenes, knownTypes = []) {
  const warn = [];
  const byId = new Map(scenes.map((s) => [s.id, s]));
  for (const spec of board.scenes || []) {
    const sc = byId.get(spec.id);
    if (!sc) { warn.push(`${spec.id}: no scene with this id in script.json`); continue; }
    if (knownTypes.length && !knownTypes.includes(spec.type)) warn.push(`${spec.id}: unknown scene type "${spec.type}" (theme has ${knownTypes.join(", ")})`);
    const words = sc.lines.flatMap((l) => l.words).map((w) => w[0]);
    for (const a of anchors(spec)) {
      const [word, nth] = typeof a === "string" ? [a.split("#")[0], Number(a.split("#")[1] || 1)] : [a.word, a.nth || 1];
      if (words.filter((w) => w === normWord(word)).length < nth) warn.push(`${spec.id}: anchor "${word}"${nth > 1 ? ` #${nth}` : ""} is not spoken in this scene`);
    }
  }
  for (const s of scenes) if (!(board.scenes || []).some((b) => b.id === s.id)) warn.push(`${s.id}: voiced scene has no storyboard entry (screen stays empty)`);
  return warn;
}
