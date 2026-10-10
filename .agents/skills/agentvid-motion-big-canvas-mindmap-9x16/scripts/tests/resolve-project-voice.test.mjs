// Unit tests for the starting voice of a new project (theme < ~/.agentvid/voice.json < flags).
// Run: node --test scripts/tests/resolve-project-voice.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { resolveProjectVoice } from "../lib/resolve-project-voice.mjs";

const catalog = JSON.parse(readFileSync(new URL("../lib/vieneu-voices.json", import.meta.url), "utf8")).voices;
const vi = { engine: "vieneu", voice: "Thanh Bình", tempo: 1.0 };
const en = { engine: "gemini", voice: "Fenrir", model: "gemini-3.8-flash-tts", tempo: 1.08 };

test("no prefs: the theme voice", () => {
  assert.deepEqual(resolveProjectVoice({ themeVoice: vi, language: "vi", catalog }), { voice: vi, from: "theme" });
});

test("explainer voice.json renames the VieNeu preset, its engine key is ignored", () => {
  const { voice, from } = resolveProjectVoice({ themeVoice: vi, language: "vi", catalog, prefs: { engine: "vieneu", voice: "Thùy Dung" } });
  assert.equal(voice.voice, "Thùy Dung");
  assert.equal(from, "~/.agentvid/voice.json");
  // an English project and a Gemini-voiced theme are left alone by the flat format
  assert.equal(resolveProjectVoice({ themeVoice: en, language: "en", catalog, prefs: { voice: "Thùy Dung" } }).voice.voice, "Fenrir");
});

test("per-language voice.json can switch engine and drops the theme's engine fields", () => {
  const { voice } = resolveProjectVoice({ themeVoice: en, language: "en", catalog, prefs: { en: { engine: "soniox", voice: "Adrian" } } });
  assert.deepEqual(voice, { engine: "soniox", tempo: 1.0, voice: "Adrian" });
});

test("--region picks a voice of that region with the theme voice's gender", () => {
  const { voice, from } = resolveProjectVoice({ themeVoice: vi, language: "vi", catalog, flags: { region: "nam" } });
  const pick = catalog.find((v) => v.name === voice.voice);
  assert.equal(pick.region, "nam");
  assert.equal(pick.gender, "male");
  assert.equal(from, "--region=nam");
});

test("--voice beats voice.json", () => {
  const { voice } = resolveProjectVoice({ themeVoice: vi, language: "vi", catalog, prefs: { voice: "Thùy Dung" }, flags: { voice: "Quang Sơn" } });
  assert.equal(voice.voice, "Quang Sơn");
});

test("invalid engine, region, VieNeu language and preset fail before scaffolding", () => {
  assert.throws(() => resolveProjectVoice({ themeVoice: vi, language: "vi", catalog, flags: { engine: "bogus" } }), /unknown voice engine/);
  assert.throws(() => resolveProjectVoice({ themeVoice: vi, language: "vi", catalog, flags: { region: "west" } }), /unknown VieNeu region/);
  assert.throws(() => resolveProjectVoice({ themeVoice: en, language: "en", catalog, flags: { engine: "vieneu", voice: vi.voice } }), /supports language "vi"/);
  assert.throws(() => resolveProjectVoice({ themeVoice: vi, language: "vi", catalog, flags: { voice: "Unknown" } }), /not a known VieNeu preset/);
  assert.throws(() => resolveProjectVoice({ themeVoice: en, language: "en", catalog, flags: { region: "nam" } }), /only valid with the VieNeu/);
  assert.throws(() => resolveProjectVoice({ themeVoice: vi, language: "vi", catalog, flags: { region: "nam", voice: vi.voice } }), /either --voice or --region/);
});

test("non-VieNeu engines preserve custom provider voice names", () => {
  const { voice } = resolveProjectVoice({ themeVoice: en, language: "en", catalog, flags: { engine: "soniox", voice: "Private Custom Voice" } });
  assert.equal(voice.voice, "Private Custom Voice");
});
