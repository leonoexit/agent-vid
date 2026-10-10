// Places every spoken line on the global timeline.
// Scene cuts sit on beats; each line is cut from its scene clip (padded, never past the midpoint to its
// neighbour) so a single line can be anchored on its own, e.g. a shout in a silent stop or a word on a drop.
import { normWord, round } from "./project-io.mjs";

/** -> [{ id, start, end, outro, lines: [{ place, segEnd, seg, tempo, on, off, words: [[key, shown, s, e]] }] }] */
export function scheduleVoiceLines(script, vo, grid) {
  const { cfg, nextBeat, time } = grid;
  const scenes = [];
  const ids = new Set();
  if (!Array.isArray(script.scenes) || !script.scenes.length) throw new Error("script needs a nonempty scenes array");
  let prevOff = 0;
  let prevVoEnd = 0;
  for (const s of script.scenes) {
    if (!s || typeof s.id !== "string" || !/^[\w-]+$/.test(s.id) || ["__proto__", "constructor", "prototype"].includes(s.id) || ids.has(s.id))
      throw new Error("script scene ids must be safe and unique");
    ids.add(s.id);
    if (!vo[s.id]) throw new Error(`${s.id}: no timings in data/vo-lines.json — run align-voiceover`);
    const a = cfg.anchors[s.id] || {};
    const tempo = s.outro ? 1 : cfg.tempo;
    const src = vo[s.id].lines;
    if (!Array.isArray(src) || !src.length) throw new Error(`${s.id}: needs nonempty voice lines`);
    src.forEach((l, i) => {
      if (!Number.isFinite(l.start) || !Number.isFinite(l.end) || l.start < 0 || l.end <= l.start || (i && l.start < src[i - 1].end))
        throw new Error(`${s.id}: invalid or overlapping source voice timing`);
      if (!Array.isArray(l.words) || !l.words.length || l.words.some((w) => !Number.isFinite(w.s) || !Number.isFinite(w.e) || w.s < l.start || w.e <= w.s || w.e > l.end + 0.001))
        throw new Error(`${s.id}: invalid word timing`);
    });
    const segs = src.map((l, i) => {
      const prevMid = i ? (src[i - 1].end + l.start) / 2 : 0;
      const nextMid = i < src.length - 1 ? (l.end + src[i + 1].start) / 2 : Infinity;
      return { a: Math.max(0, l.start - cfg.segPre, prevMid), b: Math.min(l.end + cfg.segPost, nextMid) };
    });
    const sceneAt = time(a.scene) ?? (scenes.length ? nextBeat(prevOff + cfg.cutAfter) : 0);
    if (!Number.isFinite(sceneAt) || sceneAt < 0 || sceneAt >= cfg.duration || (scenes.length && sceneAt <= scenes.at(-1).start))
      throw new Error(`${s.id}: scene cuts must increase inside duration`);
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
      if (!Number.isFinite(place) || place < 0) throw new Error(`${s.id} line ${i}: voice placement is negative or nonfinite`);
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
  for (const s of scenes) for (const l of s.lines) {
    // FFmpeg rounds adelay to milliseconds; include the retained tail at the final 48 kHz sample.
    const lastSample = Math.round(l.place * 1000) * 48 + Math.ceil((l.seg.b - l.seg.a) / l.tempo * 48000);
    if (lastSample > Math.floor(cfg.duration * 48000))
      throw new Error(`${s.id}: voice ends after duration ${cfg.duration} s — raise "duration"`);
  }
  return scenes;
}
