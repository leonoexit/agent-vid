// Resolves data/cues.json into absolute SFX events. Each cue has `sfx`, optional `vol` (0.5) and `offset`,
// and exactly one anchor: { scene, word, nth? } spoken word onset | { beat } | { abs } seconds | { scene, at } after the cut.
// Word and beat anchors survive re-timing, so prefer them.
import { normWord, round } from "./project-io.mjs";

export function resolveSfxCues(cues, scenes, grid) {
  const sceneOf = (id) => {
    const s = scenes.find((x) => x.id === id);
    if (!s) throw new Error(`cue: unknown scene "${id}"`);
    return s;
  };
  const wordTime = (id, word, nth = 1) => {
    const key = normWord(word);
    const hits = sceneOf(id).lines.flatMap((l) => l.words).filter((w) => w[0] === key);
    if (hits.length < nth) throw new Error(`cue: "${word}" #${nth} not found in ${id}`);
    return hits[nth - 1][2];
  };
  const known = new Set(scenes.map((s) => s.id));
  return cues.filter((c) => {
    if (!c.scene || known.has(c.scene)) return true;
    console.warn(`cue "${c.sfx}": scene "${c.scene}" is not in script.json — skipped (edit data/cues.json)`);
    return false;
  }).map((c) => {
    let t;
    if (c.word) t = wordTime(c.scene, c.word, c.nth);
    else if (c.beat != null) t = grid.beat(c.beat);
    else if (c.abs != null) t = c.abs;
    else if (c.scene) t = sceneOf(c.scene).start + (c.at || 0);
    else throw new Error(`cue for "${c.sfx}" has no anchor (word, beat, abs or scene+at)`);
    return { sfx: c.sfx, vol: c.vol ?? 0.5, t: Math.max(0, round(t + (c.offset || 0))) };
  });
}
