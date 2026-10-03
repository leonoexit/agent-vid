// Unit tests for the one-take voice: cutting the take into scenes and keyless word-time estimates.
// Run: node --test scripts/tests/voice-take-split.test.mjs
import assert from "node:assert/strict";
import test from "node:test";
import { estimateWordTimes } from "../lib/estimate-word-times.mjs";
import { planTakeCuts, planTakeCutsByPauses } from "../lib/split-voice-take.mjs";

// words spoken back to back from `at`, 0.4 s each with 0.1 s between
const say = (text, at) => text.split(" ").map((t, i) => ({ t, s: at + i * 0.5, e: at + i * 0.5 + 0.4 }));
const scenes = [
  { id: "s1", lines: [{ text: "Meet AgentVid." }, { text: "It edits video." }] },
  { id: "s2", lines: [{ text: "Power one: speed." }] },
  { id: "s3", lines: [{ text: "Coming soon." }] },
];

test("cuts land in the middle of the silence between scenes", () => {
  const heard = [...say("Meet AgentVid. It edits video.", 0.2), ...say("Power one: speed.", 3.4), ...say("Coming soon.", 5.9)];
  // s1 ends 2.6, s2 starts 3.4; s2 ends 4.8, s3 starts 5.9
  const pauses = [[2.65, 3.35], [4.85, 5.85]];
  const cuts = planTakeCuts(scenes, heard, 7.2, pauses);
  assert.deepEqual(cuts.map((c) => c.id), ["s1", "s2", "s3"]);
  assert.equal(cuts[0].from, 0);
  assert.equal(cuts[0].to, 3);
  assert.equal(cuts[1].to, 5.35);
  assert.equal(cuts[2].to, 7.2);
  // words are shifted to the piece and stay with their scene
  assert.deepEqual(cuts[1].words.map((w) => w.t), ["Power", "one:", "speed."]);
  assert.equal(cuts[1].words[0].s, 0.4);
});

test("a misheard scene boundary word still cuts between the scenes", () => {
  const heard = [...say("Meet AgentVid. It edits video.", 0), ...say("Tower one: speed.", 3.2), ...say("Coming soon.", 5.5)];
  const cuts = planTakeCuts(scenes, heard, 7, []);
  assert.ok(cuts[0].to >= 2.4 && cuts[0].to < 3.2, String(cuts[0].to)); // after "video." (ends 2.4), before "Tower"
  assert.equal(cuts[1].words[0].t, "Tower");
});

test("estimate: every word gets a time, pieces snap to pauses", () => {
  const words = estimateWordTimes("Xin chào các bạn. Hôm nay học tiếng Anh.", 5, [[0, 0.3], [2.1, 2.5], [4.8, 5]]);
  assert.equal(words.length, 9);
  assert.equal(words[0].s, 0.3);
  assert.ok(words[3].e <= 2.1, JSON.stringify(words[3])); // "bạn." ends before the pause
  assert.equal(words[4].s, 2.5); // "Hôm" starts after it
  assert.ok(words.at(-1).e <= 4.8);
});

test("an unrecognised first word does not pull the cut onto the previous scene's last word", () => {
  // s2 "Power" heard as "Tower": interpolation makes s2 start where s1 ends; the silence after s1 is the boundary
  const heard = [...say("Meet AgentVid. It edits video.", 0), ...say("Tower one: speed.", 3.2), ...say("Coming soon.", 5.5)];
  const cuts = planTakeCuts(scenes, heard, 7, [[2.45, 3.15], [4.65, 5.45]]);
  assert.equal(cuts[0].to, 2.8);
});

test("estimate: scene cuts take the long paragraph pauses, not shorter ones inside a scene", () => {
  const texts = ["Meet AgentVid. It edits video.", "Power one: speed.", "Coming soon."];
  // inside-scene pauses 0.3 s, between-scene pauses 0.9 s
  const pauses = [[1.2, 1.5], [2.6, 3.5], [4.1, 4.4], [5.2, 6.1]];
  const cuts = planTakeCutsByPauses(scenes, texts, 7.5, pauses);
  assert.deepEqual(cuts.map((c) => c.to), [3.05, 5.65, 7.5]);
});

test("estimate: sparse or unusable pauses fall back to finite monotonic cuts", () => {
  const dense = [
    { id: "a", lines: [{ text: "A" }] },
    { id: "b", lines: [{ text: "B" }] },
    { id: "c", lines: [{ text: "C" }] },
    { id: "d", lines: [{ text: "D" }] },
  ];
  const cuts = planTakeCutsByPauses(dense, ["A", "B", "C", "D"], 1.2, [[0.5, 0.5], [Number.NaN, 1]]);
  const edges = [cuts[0].from, ...cuts.map((cut) => cut.to)];
  assert.ok(edges.every(Number.isFinite));
  assert.ok(edges.every((edge, i) => i === 0 || edge > edges[i - 1]), JSON.stringify(edges));
});

test("estimate: impossible duration reports a domain error instead of dereferencing a sentinel", () => {
  assert.throws(() => planTakeCutsByPauses(scenes, ["A", "B", "C"], 0.5, []), /too short to split/);
  assert.throws(() => planTakeCutsByPauses([], [], 1, []), /matching non-empty/);
  assert.throws(() => planTakeCutsByPauses(scenes.slice(0, 2), ["", ""], 1, []), /non-empty spoken text/);
});
