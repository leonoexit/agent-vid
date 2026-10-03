// Karaoke captions in the language of the voice: every shown word carries its own aligned onset.
// Lines are split into chunks that fit the caption box of the aspect profile (data/aspect.json "captions").
import { round } from "./project-io.mjs";

/** -> [{ start, end, words: [[shownText, onset]] }] */
export function buildCaptions(scenes, captionCfg = {}) {
  const maxWords = captionCfg.maxWords ?? 9;
  const maxChars = captionCfg.maxChars ?? 60;
  const out = [];
  for (const s of scenes) {
    for (const l of s.lines) {
      const words = l.words.map(([, shown, on]) => ({ t: shown, s: on }));
      for (let i = 1; i < words.length; i++) if (words[i].s <= words[i - 1].s) words[i].s = round(words[i - 1].s + 0.05);
      let cur = [];
      const flush = () => cur.length && (out.push({ lineOff: l.off, words: cur }), (cur = []));
      words.forEach((w, i) => {
        const chars = cur.reduce((n, x) => n + x.t.length + 1, 0) + w.t.length;
        const tail = words.length - i <= 2 && chars <= maxChars + 6 && cur.length < maxWords + 2; // keep a short tail
        if (cur.length && !tail && (cur.length >= maxWords || chars > maxChars)) flush();
        cur.push(w);
        const left = words.length - i - 1;
        // prefer breaking after punctuation once the chunk has a few words and the rest is not a lone word
        if (left >= 2 && cur.length >= 3 && /[,.:;?!]$/.test(w.t) && words.length > maxWords) flush();
      });
      flush();
    }
  }
  out.forEach((c, i) => {
    c.start = round(c.words[0].s - 0.12);
    const next = out[i + 1];
    const natural = next && next.lineOff === c.lineOff ? next.words[0].s - 0.12 : c.lineOff + 0.5;
    c.end = round(next ? Math.min(natural, next.words[0].s - 0.16) : natural);
  });
  return out.map(({ start, end, words }) => ({ start, end, words: words.map((w) => [w.t, w.s]) }));
}
