import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { loadTimeline } from "../lib/timeline-config.mjs";
import { scheduleVoiceLines } from "../lib/schedule-voice-lines.mjs";
import { voiceEnvelope } from "../lib/render-audio-mix.mjs";

function withGrid(config, fn, arrangement) {
  const root = mkdtempSync(join(tmpdir(), "motion-timing-"));
  try {
    mkdirSync(join(root, "data"));
    writeFileSync(join(root, "data/timeline-config.json"), JSON.stringify({ duration: 10, ...config }));
    if (arrangement) writeFileSync(join(root, "data/music-arrangement.json"), JSON.stringify(arrangement));
    return fn(() => loadTimeline(root));
  } finally { rmSync(root, { recursive: true, force: true }); }
}

test("malformed numerical config fails before scheduling or mixing", () => {
  for (const cfg of [
    { duration: -1 }, { duration: null }, { bpm: 0 }, { bpm: -20 }, { bpm: "120" },
    { fps: 0 }, { fps: 29.97 }, { fps: "30" }, { tempo: 0 }, { segPre: -1 }, { voLead: -1 },
    { anchors: { s: { scene: -1 } } }, { anchors: { s: { lines: [11] } } },
    { anchors: { s: { scene: { beat: "2" } } } }, { anchors: { s: { lines: {} } } },
    { anchors: { s: { scene: { beat: 2, typo: 1 } } } },
    { drops: [-1] }, { kick: [[4, 2]] }, { kick: [[1, 30]] }, { beat0: -1 },
    { outroBed: 11 }, { fadeOut: 11 },
  ]) withGrid(cfg, (load) => assert.throws(load), cfg.arrangement);
  withGrid({}, (load) => assert.throws(load, /bpm/), { bpm: 0 });
  withGrid({ anchors: { s: { scene: { beat: 2, plus: -0.2 }, lines: [null, 3] } } }, (load) => {
    assert.equal(load().time({ beat: 2, plus: -0.2 }), 0.8);
    assert.equal(load().cfg.fps, 30);
  });
});

const script = { scenes: [{ id: "s" }] };
const voice = (end) => ({ s: { lines: [{ start: 0, end, words: [{ t: "hello", s: 0, e: end }] }] } });
test("retained voice tail beyond duration is a hard failure", () => {
  withGrid({ duration: 1, tempo: 1, voLead: 0, segPost: 0.15, fadeOut: 0.5 }, (load) => {
    assert.throws(() => scheduleVoiceLines(script, voice(0.9), load()), /voice ends after duration/);
    assert.ok(Math.abs(scheduleVoiceLines(script, voice(0.8), load())[0].lines[0].segEnd - 0.95) < 1e-9);
  });
  withGrid({ duration: 1, tempo: 1, voLead: 0.0006, segPost: 0, fadeOut: 0.5 }, (load) =>
    assert.throws(() => scheduleVoiceLines(script, voice(0.9992), load()), /voice ends after duration/));
});

test("duplicate script ids and invalid source timings fail before scheduling", () => {
  withGrid({}, (load) => {
    assert.throws(() => scheduleVoiceLines({ scenes: [{ id: "s" }, { id: "s" }] }, voice(1), load()), /unique/);
    assert.throws(() => scheduleVoiceLines(script, { s: { lines: [] } }, load()), /nonempty/);
    assert.throws(() => scheduleVoiceLines(script, voice(-1), load()), /invalid/);
    assert.throws(() => scheduleVoiceLines({ scenes: [{ id: "../escape" }] }, {}, load()), /safe/);
  });
});

test("voice envelope indexes real samples at every supported integer fps", () => {
  for (const fps of [7, 24, 30, 60]) {
    const env = voiceEnvelope(new Float32Array(24000).fill(0.5), 1, fps);
    assert.equal(env.length, fps);
    assert.ok(env.every((x) => Number.isFinite(x) && x === 1));
  }
  assert.deepEqual(voiceEnvelope(new Float32Array(), 1, 7), Array(7).fill(0));
});
