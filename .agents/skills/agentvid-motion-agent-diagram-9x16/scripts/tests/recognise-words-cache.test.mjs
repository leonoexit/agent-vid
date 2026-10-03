import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { recogniseWords } from "../lib/recognise-words.mjs";

const temp = () => mkdtempSync(join(tmpdir(), "agentvid-align-cache-"));

test("ElevenLabs alignment never passes a pre-existing canonical cache to multix", async () => {
  const cache = join(temp(), "scene.json");
  writeFileSync(cache, JSON.stringify({ words: [{ text: "stale", start: 0, end: 1 }] }));
  let stage;
  const words = await recogniseWords({
    engine: "elevenlabs", file: "voice.wav", language: "en", text: "fresh", cache,
    runMultix: async (args, options) => {
      stage = options.output;
      assert.notEqual(stage, cache);
      assert.equal(args.at(-1), stage);
      writeFileSync(stage, JSON.stringify({ words: [{ text: "fresh", start: 1, end: 2 }] }));
    },
  });
  assert.deepEqual(words, [{ t: "fresh", s: 1, e: 2 }]);
  assert.equal(JSON.parse(readFileSync(cache, "utf8")).words[0].text, "stale");
  assert.equal(existsSync(stage), false);
});

test("failed ElevenLabs alignment cannot bless stale canonical JSON", async () => {
  const cache = join(temp(), "scene.json");
  writeFileSync(cache, JSON.stringify({ words: [{ text: "stale", start: 0, end: 1 }] }));
  let stage;
  await assert.rejects(recogniseWords({
    engine: "elevenlabs", file: "voice.wav", language: "en", text: "fresh", cache,
    runMultix: async (_args, options) => {
      stage = options.output;
      writeFileSync(stage, JSON.stringify({ words: [{ text: "partial", start: 0, end: 1 }] }));
      throw new Error("provider failed");
    },
  }), /provider failed/);
  assert.equal(JSON.parse(readFileSync(cache, "utf8")).words[0].text, "stale");
  assert.equal(existsSync(stage), false);
});
