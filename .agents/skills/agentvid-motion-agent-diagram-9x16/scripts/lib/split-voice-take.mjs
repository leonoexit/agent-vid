// Where to cut one voice take (the whole script read in a single TTS call) into per-scene clips.
// The recognised words are matched onto the script, which gives every scene its first and last spoken word; the cut
// between two scenes goes in the middle of the silence that lies between them (or the middle of the gap when the
// voice ran straight on).
import { matchScene } from "./match-script-words.mjs";
import { round } from "./project-io.mjs";

/**
 * Scene cuts with no recogniser (align "estimate"): scenes are separate paragraphs of the take and readers pause
 * longest between paragraphs (measured on Gemini: 0.8-1.0 s between scenes, <= 0.6 s inside). The cuts are the
 * ordered set of pauses that best trades pause length against distance from each cut's proportional position
 * (text length), solved exactly by dynamic programming; word times inside a piece come from estimateWordTimes.
 * sceneTexts: spoken text per scene -> [{ id, from, to }]
 */
export function planTakeCutsByPauses(scenes, sceneTexts, takeSeconds, pauses, { perSecond = 0.35 } = {}) {
  if (!scenes.length || scenes.length !== sceneTexts.length)
    throw new Error("scene cuts require matching non-empty scene and text arrays");
  if (sceneTexts.some((text) => typeof text !== "string" || !text.trim()))
    throw new Error("scene cuts require non-empty spoken text");
  const n = scenes.length - 1;
  const gap = 0.3;
  if (!Number.isFinite(takeSeconds) || takeSeconds <= 0) throw new Error("take duration must be finite and positive");
  if (takeSeconds < scenes.length * gap)
    throw new Error(`take is too short to split ${scenes.length} scenes with ${gap}s minimum spacing`);
  // reading time ~ words, plus a beat for every punctuation pause (short shouted lines take longer than their letters)
  const weight = (t) => t.split(/\s+/).filter(Boolean).length + 1.5 * (t.match(/[.,;:!?…]/g) || []).length;
  const total = sceneTexts.reduce((x, t) => x + weight(t), 0);
  if (!Number.isFinite(total) || total <= 0) throw new Error("scene cuts require finite spoken-text weights");
  let acc = 0;
  const guesses = sceneTexts.slice(0, -1).map((t, k) => {
    const wanted = takeSeconds * ((acc += weight(t)) / total);
    return Math.max((k + 1) * gap, Math.min(wanted, takeSeconds - (n - k) * gap));
  });
  const cand = pauses.map(([a, b]) => ({ mid: (a + b) / 2, len: b - a }))
    .filter((c) => Number.isFinite(c.mid) && Number.isFinite(c.len) && c.mid >= gap && c.mid <= takeSeconds - gap)
    .sort((a, b) => a.mid - b.mid || b.len - a.len);
  const score = (k, c) => c.len - perSecond * Math.abs(c.mid - guesses[k]);
  // best[k][j]: best total for cuts 0..k with cut k on candidate j; a cut may also fall back to its guess (score 0)
  const NONE = -1;
  const best = [], from = [];
  for (let k = 0; k < n; k++) {
    best.push(new Array(cand.length + 1).fill(-Infinity));
    from.push(new Array(cand.length + 1).fill(NONE));
    for (let j = 0; j <= cand.length; j++) {
      const at = j < cand.length ? cand[j].mid : guesses[k];
      const own = j < cand.length ? score(k, cand[j]) : 0;
      if (k === 0) { best[k][j] = own; continue; }
      for (let i = 0; i <= cand.length; i++) {
        const prevAt = i < cand.length ? cand[i].mid : guesses[k - 1];
        if (prevAt <= at - gap + 1e-9 && best[k - 1][i] + own > best[k][j])
          (best[k][j] = best[k - 1][i] + own), (from[k][j] = i);
      }
    }
  }
  const cuts = new Array(n);
  let j = n ? best[n - 1].indexOf(Math.max(...best[n - 1])) : NONE;
  for (let k = n - 1; k >= 0; k--) {
    if (j === NONE || !Number.isFinite(best[k][j])) throw new Error("could not find finite monotonic scene cuts");
    cuts[k] = j < cand.length ? cand[j].mid : guesses[k];
    j = from[k][j];
  }
  const edges = [0, ...cuts, takeSeconds];
  return scenes.map((s, i) => ({ id: s.id, from: round(edges[i]), to: round(edges[i + 1]) }));
}

/**
 * scenes: script scenes read in this take, in order; heard: [{ t, s, e }] over the take; pauses: [[start, end]].
 * -> [{ id, from, to, words }] with `words` = heard words inside the scene's piece, shifted to start at 0.
 */
export function planTakeCuts(scenes, heard, takeSeconds, pauses) {
  const { lines } = matchScene({ lines: scenes.flatMap((s) => s.lines) }, heard, takeSeconds);
  let k = 0;
  const spans = scenes.map((s) => {
    const ls = lines.slice(k, (k += s.lines.length));
    return { id: s.id, a: ls[0].start, b: ls.at(-1).end };
  });
  const cuts = [0];
  for (let i = 0; i < spans.length - 1; i++) {
    const lo = spans[i].b, hi = spans[i + 1].a;
    let cut = (lo + hi) / 2;
    if (hi <= lo + 0.05) {
      // words touch: either a real run-on, or the next scene's first word was not recognised and got an interpolated
      // time right after this scene; a silence just after this scene's last word is then the true boundary
      const near = pauses.filter(([a, b]) => b >= lo - 0.15 && a <= lo + 0.6).sort((x, y) => y[1] - y[0] - (x[1] - x[0]))[0];
      if (near) cut = (Math.max(near[0], lo - 0.15) + near[1]) / 2;
      else console.warn(`${spans[i].id} -> ${spans[i + 1].id}: no pause between the scenes, cut at ${cut.toFixed(2)} s`);
    } else {
      // the silence that overlaps the gap the most
      let best = null;
      for (const [a, b] of pauses) {
        const ov = Math.min(b, hi) - Math.max(a, lo);
        if (ov > 0 && (!best || ov > best.ov)) best = { ov, a: Math.max(a, lo), b: Math.min(b, hi) };
      }
      if (best) cut = (best.a + best.b) / 2;
    }
    cuts.push(Math.max(cut, cuts.at(-1) + 0.05));
  }
  cuts.push(takeSeconds);
  return spans.map((sp, i) => {
    const from = cuts[i], to = cuts[i + 1];
    const words = heard
      .filter((w) => (w.s + w.e) / 2 >= from && (w.s + w.e) / 2 < to)
      .map((w) => ({ t: w.t, s: round(Math.max(0, w.s - from)), e: round(Math.min(to, w.e) - from) }));
    return { id: sp.id, from: round(from), to: round(to), words };
  });
}
