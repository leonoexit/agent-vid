import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  acquireProjectLock, assertSafeSceneId, fileSha256, invalidateSceneAudioCaches, planSynthesisTakes,
  synthesisCacheMatches, synthesisKey, synthesizeFresh, synthesizeWithRetries, validateVoiceScenes, withProjectLock,
} from "../lib/voice-take-cache.mjs";

const temp = () => mkdtempSync(join(tmpdir(), "agentvid-voice-cache-"));

test("failed synthesis cannot accept or replace a pre-existing canonical take", async () => {
  const out = join(temp(), "take.wav");
  writeFileSync(out, "old paid take");
  let attempted;
  await assert.rejects(synthesizeFresh(out, async (stage) => {
    attempted = stage;
    writeFileSync(stage, "partial");
    throw new Error("provider failed");
  }), /provider failed/);
  assert.notEqual(attempted, out);
  assert.equal(readFileSync(out, "utf8"), "old paid take");
});

test("successful synthesis publishes only the new staged take", async () => {
  const out = join(temp(), "take.wav");
  writeFileSync(out, "old");
  await synthesizeFresh(out, async (stage) => writeFileSync(stage, "new"));
  assert.equal(readFileSync(out, "utf8"), "new");
});

test("transient retry is bounded and uses a fresh stage", async () => {
  const out = join(temp(), "take.wav");
  const stages = [];
  await synthesizeWithRetries(out, async (stage) => {
    stages.push(stage);
    if (stages.length === 1) throw new Error("provider 429 rate limit");
    writeFileSync(stage, "valid");
  });
  assert.equal(stages.length, 2);
  assert.notEqual(stages[0], stages[1]);
  assert.equal(readFileSync(out, "utf8"), "valid");
});

test("permanent synthesis failures are not retried", async () => {
  let calls = 0;
  await assert.rejects(synthesizeWithRetries(join(temp(), "take.wav"), async () => {
    calls++;
    throw new Error("invalid API key");
  }), /invalid API key/);
  assert.equal(calls, 1);
});

test("synthesis identity includes language and ignores alignment choice", () => {
  const request = { engine: "gemini", model: "m", voice: "Puck", style: "warm", language: "en", text: "hello" };
  assert.equal(synthesisKey({ ...request, align: "local" }), synthesisKey({ ...request, align: "soniox" }));
  assert.notEqual(synthesisKey(request), synthesisKey({ ...request, language: "vi" }));
  assert.notEqual(synthesisKey(request), synthesisKey({ ...request, style: "urgent" }));
});

test("cached synthesis requires the canonical audio fingerprint", () => {
  const wav = join(temp(), "take.wav");
  writeFileSync(wav, "first");
  const manifest = { key: "request", sha256: fileSha256(wav) };
  assert.equal(synthesisCacheMatches(null, "request", wav), false);
  assert.equal(synthesisCacheMatches(manifest, "request", wav), true);
  writeFileSync(wav, "changed");
  assert.equal(synthesisCacheMatches(manifest, "request", wav), false);
  writeFileSync(wav, "corrupt");
  manifest.sha256 = fileSha256(wav);
  assert.equal(synthesisCacheMatches(manifest, "request", wav, () => { throw new Error("bad wav"); }), false);
});

test("oversized individual scenes are rejected before take planning", () => {
  const scenes = [{ id: "large", text: "12345" }];
  assert.throws(() => planSynthesisTakes(scenes, (scene) => scene.text, 4), /large: 5 chars exceeds/);
});

test("scene overwrite invalidates its alignment and aggregate vo-lines only", () => {
  const root = temp();
  mkdirSync(join(root, "data", "align"), { recursive: true });
  for (const file of ["s1.json", "s2.json"]) writeFileSync(join(root, "data", "align", file), "{}");
  writeFileSync(join(root, "data", "vo-lines.json"), "{}");
  invalidateSceneAudioCaches(root, "s1");
  assert.throws(() => readFileSync(join(root, "data", "align", "s1.json")));
  assert.equal(readFileSync(join(root, "data", "align", "s2.json"), "utf8"), "{}");
  assert.throws(() => readFileSync(join(root, "data", "vo-lines.json")));
});

test("scene ids cannot escape owned audio or alignment directories", () => {
  assert.equal(assertSafeSceneId("s01-cover"), "s01-cover");
  for (const id of ["../../victim", "a/b", "..", "", ".hidden"])
    assert.throws(() => assertSafeSceneId(id), /invalid scene id/);
  for (const id of ["CON", "con", "PrN", "AUX", "nul", "COM1", "com9", "LPT1", "lpt9"])
    assert.throws(() => assertSafeSceneId(id), /reserved Windows device/i);
  for (const id of ["console", "com0", "com10", "lpt0", "lpt10"]) assert.equal(assertSafeSceneId(id), id);
});

test("scene validation rejects case-fold duplicates and punctuation-only speech", () => {
  assert.throws(() => validateVoiceScenes([{ id: "Intro", text: "hello" }, { id: "intro", text: "world" }], (s) => s.text), /duplicate scene id/i);
  assert.throws(() => validateVoiceScenes([{ id: "s1", text: "...?!" }], (s) => s.text), /no spoken text/);
  assert.deepEqual(validateVoiceScenes([{ id: "s1", text: "Xin chào!" }], (s) => s.text), ["Xin chào!"]);
});

test("generate project lock permits one writer and releases cleanly", () => {
  const root = temp();
  const release = acquireProjectLock(root);
  assert.equal(existsSync(join(root, "data", ".generate-voiceover.lock")), true);
  assert.throws(() => acquireProjectLock(root), /already running/);
  release();
  const releaseAgain = acquireProjectLock(root);
  releaseAgain();

  const lock = join(root, "data", ".generate-voiceover.lock");
  writeFileSync(lock, "2147483647:stale");
  assert.throws(() => acquireProjectLock(root), /if no process is active, remove/);
});

test("generate and align share one lock and failure always releases it", async () => {
  const root = temp();
  const releaseGenerate = acquireProjectLock(root);
  await assert.rejects(withProjectLock(root, async () => assert.fail("align overlapped generate")), /already running/);
  releaseGenerate();

  await assert.rejects(withProjectLock(root, async () => { throw new Error("alignment failed"); }), /alignment failed/);
  const releaseAfterFailure = acquireProjectLock(root);
  releaseAfterFailure();
});

test("nested transport errors and status fields are retried, permanent errors are not", async () => {
  for (const error of [Object.assign(new Error("fetch failed"), { cause: { code: "ECONNRESET" } }), { status: 503 }, { code: "ETIMEDOUT" }]) {
    let calls = 0;
    await synthesizeWithRetries(join(temp(), "take.wav"), async (stage) => {
      if (++calls === 1) throw error;
      writeFileSync(stage, "valid");
    });
    assert.equal(calls, 2);
  }
});
