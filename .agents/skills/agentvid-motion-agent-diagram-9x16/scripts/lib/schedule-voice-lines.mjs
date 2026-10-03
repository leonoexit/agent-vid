// Places every spoken line on the global timeline.
// Scene cuts sit on beats; each line is cut from its scene clip (padded, never past the midpoint to its
// neighbour) so a single line can be anchored on its own, e.g. a shout in a silent stop or a word on a drop.
import { normWord, round } from "./project-io.mjs";

/** -> [{ id, start, end, outro, lines: [{ place, segEnd, seg, tempo, on, off, words: [[key, shown, s, e]] }] }] */
export function scheduleVoiceLines(script, vo, grid) {
  const { cfg, nextBeat, time } = grid;
  const scenes = [];
  let prevOff = 0;
  let prevVoEnd = 0;
  for (const s of script.scenes) {
    if (!vo[s.id]) throw new Error(`${s.id}: no timings in data/vo-lines.json — run align-voiceover`);
    const a = cfg.anchors[s.id] || {};
    const tempo = s.outro ? 1 : cfg.tempo;
    const src = vo[s.id].lines;
    const segs = src.map((l, i) => {
      const prevMid = i ? (src[i - 1].end + l.start) / 2 : 0;
      const nextMid = i < src.length - 1 ? (l.end + src[i + 1].start) / 2 : Infinity;
      return { a: Math.max(0, l.start - cfg.segPre, prevMid), b: Math.min(l.end + cfg.segPost, nextMid) };
    });
    const sceneAt = time(a.scene) ?? (scenes.length ? nextBeat(prevOff + cfg.cutAfter) : 0);
    if (scenes.length && sceneAt < prevVoEnd - 0.2) console.warn(`${s.id}: cut at ${sceneAt.toFixed(2)} clips the previous voice (${prevVoEnd.toFixed(2)})`);
    const lines = [];
    src.forEach((l, i) => {
      const seg = segs[i];
      const lead = (l.start - seg.a) / tempo;
      const anchored = time(a.lines?.[i]);
      let place;
      if (anchored != null) place = anchored - lead;
      else if (i === 0) place = sceneAt + cfg.voLead;
      else place = lines[i - 1].place + (seg.a - segs[i - 1].a) / tempo; // keep the natural gap
      // neighbouring segments meet at their midpoint, so only a real overlap (an anchor pulled a line early) warns
      if (i > 0 && place < lines[i - 1].segEnd - 0.01) {
        console.warn(`${s.id} line ${i}: overlaps the previous line, pushed later`);
        place = lines[i - 1].segEnd;
      }
      const at = (x) => round(place + (x - seg.a) / tempo);
      lines.push({
        place, seg, tempo,
        segEnd: place + (seg.b - seg.a) / tempo,
        on: at(l.start), off: at(l.end),
        words: l.words.map((w) => [normWord(w.t), w.t, at(w.s), at(w.e)]),
      });
    });
    // a scene that starts talking right on top of the previous one sounds like one run-on word
    if (scenes.length && lines[0].on - prevOff < 0.3)
      console.warn(`${s.id}: only ${(lines[0].on - prevOff).toFixed(2)} s after the previous voice — move its anchor later or drop it`);
    prevVoEnd = lines.at(-1).segEnd;
    prevOff = lines.at(-1).off;
    scenes.push({ id: s.id, outro: !!s.outro, start: sceneAt, lines });
  }
  scenes.forEach((s, i) => (s.end = i < scenes.length - 1 ? scenes[i + 1].start : cfg.duration));
  for (const s of scenes)
    for (const l of s.lines) if (l.segEnd > s.end + 0.01) console.warn(`${s.id}: voice runs past its scene end (${l.segEnd.toFixed(2)} > ${s.end.toFixed(2)})`);
  const last = scenes.at(-1)?.lines.at(-1);
  if (last && last.segEnd > cfg.duration) console.warn(`voice ends at ${last.segEnd.toFixed(2)} s, after duration ${cfg.duration} s — raise "duration"`);
  return scenes;
}
