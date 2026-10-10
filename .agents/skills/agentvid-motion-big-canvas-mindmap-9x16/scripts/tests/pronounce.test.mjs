// Unit tests for the pronunciation table (script.json "pronounce"): sound changes, captions do not.
// Run: node --test scripts/tests/pronounce.test.mjs
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { after } from "node:test";
import { matchScene } from "../lib/match-script-words.mjs";
import { applyPronounce, respell, spokenText } from "../lib/project-io.mjs";

const realHome = process.env.AGENTVID_HOME;
const fakeHome = mkdtempSync(join(tmpdir(), "agentvid-home-"));
process.env.AGENTVID_HOME = fakeHome; // never read the real machine dictionary
after(() => {
  if (realHome === undefined) delete process.env.AGENTVID_HOME;
  else process.env.AGENTVID_HOME = realHome;
  rmSync(fakeHome, { recursive: true, force: true });
});
const table = { ACME: "ac mi" };
const script = (text, extra = {}) => ({ pronounce: table, scenes: [{ id: "s1", lines: [{ text, ...extra }] }] });

test("respells whole words, any case, keeps neighbours", () => {
  assert.equal(respell("Sổ tay của ACME.", table), "Sổ tay của ac mi.");
  assert.equal(respell("acme, ACME!", table), "ac mi, ac mi!");
  assert.equal(respell("ACMEshop và MyACME", table), "ACMEshop và MyACME");
});

test("replacement is literal, empty words are rejected, combining marks count as word letters", () => {
  assert.equal(respell("a ACME b", { ACME: "$& $' x" }), "a $& $' x b");
  assert.throws(() => respell("a b", { "": "x" }), /empty word/);
  assert.equal(respell("nám", { na: "x" }), "nám");
});

test("applyPronounce puts the sound in say and leaves the caption text", () => {
  const line = applyPronounce(script("Sổ tay của ACME")).scenes[0].lines[0];
  assert.equal(line.text, "Sổ tay của ACME");
  assert.equal(spokenText(line), "Sổ tay của ac mi");
});

test("an existing say is respelled too, unchanged lines stay untouched", () => {
  const out = applyPronounce({ pronounce: table, scenes: [{ id: "s", lines: [{ text: "ACME 1", say: "ACME một" }, { text: "Xin chào" }] }] });
  assert.equal(out.scenes[0].lines[0].say, "ac mi một");
  assert.equal("say" in out.scenes[0].lines[1], false);
});

test("no table: the script is returned as is", () => {
  const plain = { scenes: [{ id: "s", lines: [{ text: "ACME" }] }] };
  assert.equal(applyPronounce(plain), plain);
});

test("captions keep ACME and timings follow the 3 spoken words", () => {
  const spoken = applyPronounce(script("Xin chào ACME")).scenes[0];
  const heard = "Xin chào ac mi".split(" ").map((t, i) => ({ t, s: i * 0.4, e: i * 0.4 + 0.35 }));
  const { lines, matched } = matchScene(spoken, heard, 2);
  assert.deepEqual(lines[0].words.map((w) => w.t), ["Xin", "chào", "ACME"]);
  assert.equal(matched, 1);
  assert.ok(lines[0].words[2].s >= 0.8 - 1e-9 && lines[0].words[2].e >= 1.55 - 1e-9);
});

test("the machine dictionary applies, script pronounce wins over it, a broken file is ignored", () => {
  const home = process.env.AGENTVID_HOME;
  writeFileSync(join(home, "pronounce.json"), JSON.stringify({ ACME: "local", ZED: "zét" }));
  const line = (script) => applyPronounce(script).scenes[0].lines[0];
  const base = { scenes: [{ id: "s", lines: [{ text: "ACME và ZED" }] }] };
  assert.equal(spokenText(line(base)), "local và zét");
  assert.equal(spokenText(line({ ...base, pronounce: { ACME: "ac mi" } })), "ac mi và zét");
  writeFileSync(join(home, "pronounce.json"), "{ not json");
  assert.equal(applyPronounce(base), base);
  writeFileSync(join(home, "pronounce.json"), "{}");
});

test("a machine dictionary that is not a plain object of strings is ignored or filtered", () => {
  const home = process.env.AGENTVID_HOME;
  const base = { scenes: [{ id: "s", lines: [{ text: "ACME 0 ZED" }] }] };
  for (const bad of ["null", '["foo"]', '"foo"', "42"]) {
    writeFileSync(join(home, "pronounce.json"), bad);
    assert.equal(applyPronounce(base), base, bad);
  }
  writeFileSync(join(home, "pronounce.json"), JSON.stringify({ ACME: { x: 1 }, ZED: "zét", "": "x", 0: 5 }));
  assert.equal(spokenText(applyPronounce(base).scenes[0].lines[0]), "ACME 0 zét");
  writeFileSync(join(home, "pronounce.json"), "{}");
});
