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
