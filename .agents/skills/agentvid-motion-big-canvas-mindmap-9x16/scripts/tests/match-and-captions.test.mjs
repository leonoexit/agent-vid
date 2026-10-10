// Unit tests for word matching (recognised words -> script tokens) and caption chunking.
// Run: node --test scripts/tests/match-and-captions.test.mjs
import assert from "node:assert/strict";
import test from "node:test";
import { buildCaptions } from "../lib/build-captions.mjs";
import { matchScene, wordsEquivalent } from "../lib/match-script-words.mjs";

const heard = (s) => s.split(" ").map((t, i) => ({ t, s: i * 0.5, e: i * 0.5 + 0.4 }));

test("exact recognition maps 1:1 and keeps the shown punctuation", () => {
  const { lines, matched } = matchScene({ lines: [{ text: "Meet AgentVid." }, { text: "Describe it." }] }, heard("Meet AgentVid. Describe it."), 3);
  assert.equal(matched, 1);
  assert.deepEqual(lines[0].words.map((w) => w.t), ["Meet", "AgentVid."]);
  assert.equal(lines[1].start, 1.0);
});

test("Vietnamese words with diacritics match", () => {
  const { matched, lines } = matchScene({ lines: [{ text: "Giới thiệu AgentVid: bạn mô tả." }] }, heard("Giới thiệu AgentVid: bạn mô tả."), 4);
  assert.equal(matched, 1);
  assert.equal(lines[0].words.at(-1).s, 2.5);
});

test("a misheard word is interpolated between its neighbours", () => {
  const { lines, matched } = matchScene({ lines: [{ text: "one two three four" }] }, heard("one too three four"), 3);
  assert.equal(matched, 0.75);
  const two = lines[0].words[1];
  assert.ok(two.s >= 0.4 && two.e <= 1.0, JSON.stringify(two));
});

test("`say` differs from `text`: shown tokens spread over the spoken span", () => {
  const { lines } = matchScene({ lines: [{ text: "version 1.2", say: "version one point two" }] }, heard("version one point two"), 3);
  assert.deepEqual(lines[0].words.map((w) => w.t), ["version", "1.2"]);
  assert.equal(lines[0].words[1].s, 0.5);
  assert.equal(lines[0].words[1].e, 1.9);
});

test("captions split by word limit and are ordered", () => {
  const words = "a b c d e f g h".split(" ").map((w, i) => [w, w, i * 0.3, i * 0.3 + 0.2]);
  const caps = buildCaptions([{ lines: [{ off: 2.4, words }] }], { maxWords: 5, maxChars: 99 });
  assert.equal(caps.length, 2);
  assert.equal(caps[0].words.length, 5);
  assert.ok(caps[0].end <= caps[1].start + 0.05);
});

test("a brand said split but heard joined (and the reverse) still matches", () => {
  const joined = matchScene({ lines: [{ text: "AgentVid.", say: "Agent Vid." }, { text: "Coming soon." }] }, heard("AgentVid. Coming soon."), 2);
  assert.equal(joined.matched, 1);
  const split = matchScene({ lines: [{ text: "Meet AgentVid today" }] }, heard("Meet Agent Vid today"), 2);
  assert.equal(split.matched, 1);
  assert.equal(split.lines[0].words[2].s, 1.5);
});

test("tone-mark placement and spoken numbers still match", () => {
  const { matched } = matchScene({ lines: [{ text: "Siêu năng lực bốn: khoá của bạn." }] }, heard("Siêu năng lực 4: khóa của bạn."), 4);
  assert.equal(matched, 1);
});

test("numeric aliases do not collapse Vietnamese semantic words", () => {
  assert.equal(matchScene({ lines: [{ text: "năng lực bốn" }] }, heard("năng lực 4"), 2).matched, 1);
  assert.equal(matchScene({ lines: [{ text: "từ Nam" }] }, heard("tư năm"), 2).matched, 0);
  assert.equal(matchScene({ lines: [{ text: "đi sau" }] }, heard("đi sáu"), 2).matched, 0.5);
  assert.equal(matchScene({ lines: [{ text: "từ sau" }] }, heard("4 6"), 2).matched, 0);
});

test("decomposed Unicode keeps tones and digit matching is precision-safe", () => {
  assert.equal(wordsEquivalent("bo\u0302\u0301n", "4"), true);
  assert.equal(wordsEquivalent("tu\u031b\u0300", "4"), false);
  assert.equal(wordsEquivalent("0004", "4"), true);
  assert.equal(wordsEquivalent("9007199254740992", "9007199254740993"), false);
});

test("a last word the recogniser timed at one instant still gets a duration", () => {
  const { lines } = matchScene({ lines: [{ text: "một hai" }] }, [{ t: "một", s: 0.1, e: 0.4 }, { t: "hai", s: 0.9, e: 0.9 }], 1);
  const w = lines[0].words.at(-1);
  assert.ok(w.e > w.s);
  assert.equal(lines[0].end, w.e);
});

test("a zero-length word never overlaps its neighbour or leaves the clip", () => {
  const mid = matchScene({ lines: [{ text: "một hai ba" }] }, [{ t: "một", s: 0.1, e: 0.4 }, { t: "hai", s: 0.9, e: 0.9 }, { t: "ba", s: 0.92, e: 1.2 }], 2).lines[0].words;
  assert.ok(mid[1].e > mid[1].s && mid[1].e <= mid[2].s + 1e-9);
  const tail = matchScene({ lines: [{ text: "một hai" }] }, [{ t: "một", s: 0.1, e: 0.4 }, { t: "hai", s: 1, e: 1 }], 1).lines[0];
  const last = tail.words.at(-1);
  assert.ok(last.e > last.s && last.e <= 1 + 1e-9 && tail.end <= 1 + 1e-9);
});

test("zero-length words across a line boundary and in a run get separate durations inside the clip", () => {
  const heard = [{ t: "một", s: 0.1, e: 0.3 }, { t: "hai", s: 0.5, e: 0.5 }, { t: "ba", s: 0.5, e: 0.5 }, { t: "bốn", s: 0.5, e: 0.5 }, { t: "năm", s: 0.51, e: 0.8 }];
  const { lines } = matchScene({ lines: [{ text: "một hai" }, { text: "ba bốn năm" }] }, heard, 1);
  const all = lines.flatMap((l) => l.words);
  all.forEach((w, i) => { assert.ok(w.e > w.s, w.t); if (i) assert.ok(w.s >= all[i - 1].e - 1e-9, w.t); assert.ok(w.e <= 1 + 1e-9); });
});

test("a zero-length word squeezed between touching neighbours borrows time from the previous word", () => {
  const heard = [{ t: "một", s: 0.1, e: 0.5 }, { t: "hai", s: 0.5, e: 0.5 }, { t: "ba", s: 0.5, e: 0.9 }];
  const all = matchScene({ lines: [{ text: "một hai ba" }] }, heard, 1).lines[0].words;
  all.forEach((w, i) => { assert.ok(w.e > w.s, w.t); if (i) assert.ok(w.s >= all[i - 1].e - 1e-9, w.t); });
});

test("when the previous word is too short to lend time the next word lends instead", () => {
  const heard = [{ t: "một", s: 0.499, e: 0.5 }, { t: "hai", s: 0.5, e: 0.5 }, { t: "ba", s: 0.5, e: 1 }];
  const all = matchScene({ lines: [{ text: "một hai ba" }] }, heard, 1).lines[0].words;
  all.forEach((w, i) => { assert.ok(w.e > w.s, w.t); if (i) assert.ok(w.s >= all[i - 1].e - 1e-9, w.t); });
});

test("borrowing never collapses the lending neighbour at timestamp resolution", () => {
  const heard = [{ t: "một", s: 0.997, e: 0.998 }, { t: "hai", s: 0.999, e: 0.999 }, { t: "ba", s: 0.999, e: 1 }];
  const all = matchScene({ lines: [{ text: "một hai ba" }] }, heard, 1).lines[0].words;
  all.forEach((w, i) => { if (all.length === 3) assert.ok(w.e >= w.s, w.t); if (i) assert.ok(w.s >= all[i - 1].e - 1e-9, w.t); });
  assert.ok(all.filter((w) => w.e > w.s).length >= 2);
});

test("opt-in caption rules keep a protected phrase whole and never end a line on one word", () => {
  const line = (text) => ({ off: 0, words: text.split(" ").map((t, i) => [t, t, i * 0.3]) });
  const text = (cfg, ...lines) => buildCaptions([{ lines: lines.map(line) }], cfg).map((c) => c.words.map((w) => w[0]).join(" "));
  const base = { maxWords: 5, maxChars: 30 };
  assert.deepEqual(text(base, "Lần tới ai khoe AI Agent, anh em hỏi một câu thôi."), ["Lần tới ai khoe AI", "Agent, anh em hỏi một câu thôi."]);
  assert.deepEqual(text({ ...base, protect: ["AI Agent"] }, "Lần tới ai khoe AI Agent, anh em hỏi một câu thôi."), ["Lần tới ai khoe AI Agent,", "anh em hỏi một câu thôi."]);
  assert.deepEqual(text(base, "Nó có tự nhìn lại không? Nằm nhóm nào không quan trọng.").at(-1), "trọng.");
  assert.deepEqual(text({ ...base, noOrphan: true }, "Nó có tự nhìn lại không? Nằm nhóm nào không quan trọng.").at(-1), "quan trọng.");
});
