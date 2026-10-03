// Word timings without any recogniser (align engine "estimate", no key, no install).
// Same method as the explainer skills' local voice: cut the text at punctuation, snap each cut to the detected pause
// nearest its proportional position, then share the time inside a piece by word length (measured within ~0.1 s on
// VieNeu; good enough for captions, coarser than a recogniser on fast or uneven reads).
import { round } from "./project-io.mjs";

const weight = (s) => s.split(/\s+/).filter(Boolean).reduce((n, w) => n + w.length + 2, 0);

/**
 * text: what the clip says; clipSeconds: its length; pauses: [[start, end]] silent spans (audio-probe silences()).
 * -> [{ t, s, e }] one entry per whitespace word of `text`.
 */
export function estimateWordTimes(text, clipSeconds, pauses) {
  const chunks = text.split(/(?<=[.,;:!?…])\s+|\n+/).map((c) => c.trim()).filter(Boolean);
  if (!chunks.length) return [];
  // speech region: skip the silence at both ends
  const lead = pauses.length && pauses[0][0] < 0.02 ? pauses[0][1] : 0;
  const tail = pauses.length && pauses.at(-1)[1] > clipSeconds - 0.02 ? pauses.at(-1)[0] : clipSeconds;
  const inner = pauses.filter(([a, b]) => a > lead + 0.05 && b < tail - 0.05);
  const total = chunks.reduce((n, c) => n + weight(c), 0);
  const used = new Set();
  const edges = [];
  let acc = 0;
  for (const c of chunks.slice(0, -1)) {
    acc += weight(c);
    const guess = lead + ((tail - lead) * acc) / total;
    let best = -1;
    inner.forEach(([a, b], i) => {
      if (!used.has(i) && (best < 0 || Math.abs((a + b) / 2 - guess) < Math.abs((inner[best][0] + inner[best][1]) / 2 - guess))) best = i;
    });
    if (best >= 0 && Math.abs((inner[best][0] + inner[best][1]) / 2 - guess) < 1.2) {
      used.add(best);
      edges.push(inner[best]);
    } else edges.push([guess, guess]);
  }
  edges.sort((x, y) => x[0] - y[0]);
  const spans = [];
  let start = lead;
  for (const [a, b] of edges) {
    spans.push([start, Math.max(start, a)]);
    start = Math.max(start, b);
  }
  spans.push([start, Math.max(start, tail)]);
  const words = [];
  chunks.forEach((c, k) => {
    const [a, b] = spans[k];
    const ws = c.split(/\s+/).filter(Boolean);
    const wt = weight(c);
    let t = a;
    for (const w of ws) {
      const d = ((b - a) * (w.length + 2)) / wt;
      words.push({ t: w, s: round(t), e: round(t + d * 0.92) });
      t += d;
    }
  });
  return words;
}
