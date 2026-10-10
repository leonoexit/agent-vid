// Karaoke captions in the language of the voice: every shown word carries its own aligned onset.
// Lines are split into chunks that fit the caption box of the aspect profile (data/aspect.json "captions").
// Opt-in keys of that profile: "protect" (phrases such as "AI Agent" that are never split across chunks) and
// "noOrphan" (true: a line never ends on a one-word chunk). Without them the split is exactly the original one.
import { round } from "./project-io.mjs";

const bare = (t) => String(t).toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");

/** glue[i] = true when words i and i+1 belong to the same protected phrase */
function protectedGlue(words, phrases) {
  const glue = new Array(words.length).fill(false);
  for (const phrase of phrases) {
    const parts = String(phrase).trim().split(/\s+/).map(bare).filter(Boolean);
    if (parts.length < 2) continue;
    for (let i = 0; i + parts.length <= words.length; i++) {
      if (parts.every((p, k) => bare(words[i + k].t) === p)) for (let k = 0; k < parts.length - 1; k++) glue[i + k] = true;
    }
  }
  return glue;
}

/** -> [{ start, end, words: [[shownText, onset]] }] */
export function buildCaptions(scenes, captionCfg = {}) {
  const maxWords = captionCfg.maxWords ?? 9;
  const maxChars = captionCfg.maxChars ?? 60;
  const protect = captionCfg.protect ?? [];
  const out = [];
  for (const s of scenes) {
    for (const l of s.lines) {
      const words = l.words.map(([, shown, on]) => ({ t: shown, s: on }));
      for (let i = 1; i < words.length; i++) if (words[i].s <= words[i - 1].s) words[i].s = round(words[i - 1].s + 0.05);
      const glue = protect.length ? protectedGlue(words, protect) : [];
      const first = out.length;
      let cur = [];
      const flush = () => cur.length && (out.push({ lineOff: l.off, words: cur }), (cur = []));
      words.forEach((w, i) => {
        const chars = cur.reduce((n, x) => n + x.t.length + 1, 0) + w.t.length;
        const tail = words.length - i <= 2 && chars <= maxChars + 6 && cur.length < maxWords + 2; // keep a short tail
        if (cur.length && !tail && !glue[i - 1] && (cur.length >= maxWords || chars > maxChars)) flush();
        cur.push(w);
        const left = words.length - i - 1;
        // prefer breaking after punctuation once the chunk has a few words and the rest is not a lone word
        if (left >= 2 && cur.length >= 3 && !glue[i] && /[,.:;?!]$/.test(w.t) && words.length > maxWords) flush();
      });
      flush();
      if (captionCfg.noOrphan) fixOrphan(out, first, words, glue);
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

/** a line never ends on a one-word chunk: pull the last word(s) of the previous chunk over (keeping protected phrases whole) */
function fixOrphan(out, first, words, glue) {
  const n = out.length - first;
  if (n < 2) return;
  const last = out[out.length - 1];
  const prev = out[out.length - 2];
  if (last.words.length !== 1 || prev.words.length < 3) return;
  const pos = (c) => words.indexOf(c.words[0]);
  let move = 1;
  while (prev.words.length - move >= 2 && glue[pos(last) - move - 1 + 0] === true && move < prev.words.length - 1) move++;
  last.words.unshift(...prev.words.splice(prev.words.length - move, move));
}
