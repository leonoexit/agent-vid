// Maps recognised words (with timings) onto the script's own tokens.
// Recognition can merge, split or mishear words, so tokens are matched by longest common subsequence
// on normalised text; unmatched tokens get times interpolated between their matched neighbours.
import { round, spokenText, wordTokens } from "./project-io.mjs";

// Spoken numbers often come back as digits. Keep lexical keys distinct and apply aliases only against a digit token;
// otherwise Vietnamese "Nam"/"năm" and "từ"/"tư" become false semantic matches.
const NUMBER_WORDS = {
  zero: "0", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9", ten: "10",
  một: "1", hai: "2", ba: "3", bốn: "4", tư: "4", tứ: "4", năm: "5", sáu: "6", bảy: "7", tám: "8", chín: "9", mười: "10",
};

/**
 * Lexical key keeps tone identity but records tone marks separately from their vowel position, so orthographic
 * variants such as "khoá"/"khóa" match while semantic pairs such as "sau"/"sáu" remain distinct.
 */
const TONE_MARKS = /[\u0300\u0301\u0303\u0309\u0323]/g;
const keyParts = (t) => {
  const nfd = String(t).toLowerCase().normalize("NFD").replace(/[^\p{L}\p{N}\p{M}'-]/gu, "").replace(/đ/g, "d");
  return { base: nfd.replace(TONE_MARKS, ""), tones: (nfd.match(TONE_MARKS) || []).sort().join("") };
};
export const matchKey = (t) => {
  const { base, tones } = keyParts(t);
  return `${base}|${tones}`;
};
const NUMBERS = new Map(Object.entries(NUMBER_WORDS).map(([word, value]) => [matchKey(word), value]));

const numericValue = (t) => {
  const { base } = keyParts(t);
  if (/^\d+$/.test(base)) return base.replace(/^0+(?=\d)/, "");
  return NUMBERS.get(matchKey(t));
};

export const wordsEquivalent = (a, b) => {
  const ak = matchKey(a), bk = matchKey(b);
  const aNumeric = /^\d+$/.test(keyParts(a).base), bNumeric = /^\d+$/.test(keyParts(b).base);
  return ak === bk || (aNumeric || bNumeric) && numericValue(a) === numericValue(b);
};

const joinedKey = (...tokens) => {
  const parts = tokens.map(keyParts);
  return `${parts.map((part) => part.base).join("")}|${parts.flatMap((part) => [...part.tones]).sort().join("")}`;
};

/** LCS pairs [i, j] between arrays a and b of normalised strings. */
function lcsPairs(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--) dp[i][j] = wordsEquivalent(a[i], b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const pairs = [];
  for (let i = 0, j = 0; i < n && j < m; ) {
    if (wordsEquivalent(a[i], b[j])) pairs.push([i++, j++]);
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return pairs;
}

/**
 * Brand names get written joined or split ("Agent Vid" said, "AgentVid" heard, or the reverse): split a heard word
 * that equals two adjacent script words, and join two heard words that equal one script word, so both still match.
 */
export function reconcileCompounds(tokens, heard) {
  const norms = tokens.map(matchKey);
  const single = new Set(norms);
  const pairs = new Map();
  for (let i = 0; i < norms.length - 1; i++) pairs.set(joinedKey(tokens[i], tokens[i + 1]), [tokens[i], tokens[i + 1]]);
  const out = [];
  for (let j = 0; j < heard.length; j++) {
    const w = heard[j], n = matchKey(w.t), next = heard[j + 1];
    if (!single.has(n) && pairs.has(n)) {
      const [a, b] = pairs.get(n);
      const mid = w.s + ((w.e - w.s) * a.length) / (a.length + b.length);
      out.push({ t: a, s: w.s, e: mid }, { t: b, s: mid, e: w.e });
    } else if (next && !single.has(n) && single.has(joinedKey(w.t, next.t))) {
      out.push({ t: w.t + next.t, s: w.s, e: next.e });
      j++;
    } else out.push(w);
  }
  return out;
}

/** Times for every token: matched ones from `heard`, the rest spread evenly between neighbours. */
function timeTokens(tokens, heard, clipEnd) {
  const times = tokens.map(() => null);
  for (const [i, j] of lcsPairs(tokens, heard.map((w) => w.t))) times[i] = { s: heard[j].s, e: heard[j].e };
  for (let i = 0; i < times.length; i++) {
    if (times[i]) continue;
    let k = i;
    while (k < times.length && !times[k]) k++;
    const from = i ? times[i - 1].e : heard[0]?.s ?? 0;
    const to = k < times.length ? times[k].s : Math.max(from, heard.at(-1)?.e ?? clipEnd);
    const step = (to - from) / (k - i);
    for (let x = i; x < k; x++) times[x] = { s: from + step * (x - i), e: from + step * (x - i + 1) };
  }
  return times;
}

/**
 * Shown tokens (`text`) take the times of the spoken tokens (`say`) they are equal to; every run of unequal
 * shown tokens is spread over the matching run of spoken tokens between those anchors
 * ("version 1.2" vs "version one point two": "1.2" spans "one point two").
 */
function mapShownTokens(shown, spoken, times) {
  const anchors = [[-1, -1], ...lcsPairs(shown, spoken), [shown.length, spoken.length]];
  const out = new Array(shown.length);
  for (let k = 0; k < anchors.length - 1; k++) {
    const [i0, j0] = anchors[k];
    const [i1, j1] = anchors[k + 1];
    if (i0 >= 0) out[i0] = times[j0];
    const n = i1 - i0 - 1;
    if (!n) continue;
    // time window of the unmatched spoken run (or the gap between the anchors when there is none)
    const from = j1 - j0 > 1 ? times[j0 + 1].s : (times[j0]?.e ?? times[0].s);
    const to = j1 - j0 > 1 ? times[j1 - 1].e : (times[j1]?.s ?? times.at(-1).e);
    const step = (to - from) / n;
    for (let x = 0; x < n; x++) out[i0 + 1 + x] = { s: from + step * x, e: from + step * (x + 1) };
  }
  return shown.map((t, i) => ({ t, s: round(out[i].s), e: round(out[i].e) }));
}

/**
 * scene = { lines: [{ text, say? }] }, heard = [{ t, s, e }] -> { lines: [{ start, end, words: [{ t, s, e }] }], matched }
 * Word `t` is the displayed token from `text` (captions show it); timings follow the spoken tokens.
 */
export function matchScene(scene, rawHeard, clipEnd) {
  const spoken = scene.lines.map((l) => wordTokens(spokenText(l)));
  const flat = spoken.flat();
  const heard = reconcileCompounds(flat, rawHeard);
  const times = timeTokens(flat, heard, clipEnd);
  const matched = flat.length ? lcsPairs(flat, heard.map((w) => w.t)).length / flat.length : 1;
  let k = 0;
  const lines = scene.lines.map((line, li) => {
    const st = times.slice(k, (k += spoken[li].length));
    const words = mapShownTokens(wordTokens(line.text), spoken[li], st);
    return { start: words[0].s, end: words.at(-1).e, words };
  });
  return { lines, matched: round(matched, 2) };
}
